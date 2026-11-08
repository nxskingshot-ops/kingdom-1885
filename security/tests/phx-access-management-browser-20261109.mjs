import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixture, id } from './phx-access-management-isolated-20261109.mjs';

const { chromium } = await import(process.env.PHX_PLAYWRIGHT || 'playwright');
const entry = 'transfer-scouting-id-stage-20261030';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const stage = join(root, 'deploy/phalanx-kvk-test/pylon-ix/transfer-pr42');
const base = 'https://phalanx-isolated.test';
const candidateEmail = 'invited-player@example.test';
const candidateId = '291000010';
const { db, rpc, addUser } = await fixture();
await db.query('INSERT INTO app_private.phx_access_settings (protected_user_id,delegate_user_id) VALUES ($1,$2)', [id(1), id(2)]);
const browser = await chromium.launch({
  executablePath: process.env.PHX_CHROMIUM,
  args: ['--no-sandbox'],
});

async function connect(user, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', dialog => dialog.accept());
  const stub = `
    export function createClient() {
      const result = data => ({data,error:null});
      const post = async (path, payload) => (await fetch(${JSON.stringify(base)} + path, {
        method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type':'application/json'}
      })).json();
      return {
        auth: {
          getUser: async () => result({user:{id:${JSON.stringify(id(user))},email:'local@example.test'}}),
          signUp: payload => post('/_isolated_signup', {email:payload.email, metadata:payload.options.data}),
        },
        from() { return {
          select() { return this; }, eq() { return this; }, order() { return this; },
          maybeSingle: async () => (await fetch(${JSON.stringify(base)} + '/_isolated_membership')).json(),
          limit: async () => result([]),
        }; },
        rpc: (_, args) => post('/_isolated_rpc', args),
      };
    }
  `;
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === 'esm.sh') {
      return route.fulfill({ body: stub, contentType: 'text/javascript', headers: {'Access-Control-Allow-Origin':'*'} });
    }
    if (url.origin !== base) return route.abort();
    if (url.pathname === '/_isolated_signup') {
      const { email, metadata } = route.request().postDataJSON();
      assert.equal(email, candidateEmail);
      assert.deepEqual(metadata, { player_id: candidateId });
      await addUser(10, email, metadata.player_id, false, 'player_id');
      return route.fulfill({ json: { data: {}, error: null } });
    }
    if (url.pathname === '/_isolated_rpc') {
      const { p_action, ...args } = route.request().postDataJSON();
      try { return await route.fulfill({ json: { data: await rpc(user, p_action, args), error: null } }); }
      catch (error) { return route.fulfill({ json: { data: null, error: { code: error.code, message: error.message } } }); }
    }
    if (url.pathname === '/_isolated_membership') {
      const { rows } = await db.query('SELECT role,active,expires_at FROM public.nxs_memberships WHERE user_id=$1', [id(user)]);
      return route.fulfill({ json: { data: rows[0] || null, error: null } });
    }
    const name = url.pathname.split('/').pop();
    const file = name === entry ? name + '.html' : name;
    for (const dir of [stage, process.env.PHX_STAGE_TEST_ASSETS].filter(Boolean)) {
      const path = join(dir, file);
      if (await access(path).then(() => true, () => false)) {
        const contentType = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/html';
        return route.fulfill({ path, contentType });
      }
    }
    return route.fulfill({ status: 404 });
  });
  return { page, errors };
}

async function openTools(page) {
  await page.goto(base + '/' + entry);
  await page.locator('#private').waitFor({state:'visible'});
  await page.locator('#workspace-nav [data-view="workspace-tools"]').click();
}

try {
  const mobile = await connect(2, 390);
  await openTools(mobile.page);
  const panel = mobile.page.locator('#phxAccessManagement');
  await panel.locator('summary').click();
  await panel.getByText('No open invitations.').waitFor();
  assert.equal(await panel.getByRole('link', { name: 'Open registration link' }).getAttribute('href'), base + '/transfer-register.html');
  await panel.getByLabel('Email', {exact:true}).fill(candidateEmail);
  await panel.getByLabel('Kingshot Player ID').fill(candidateId);
  await panel.getByRole('button', {name:'Create invitation'}).click();
  await panel.getByText(candidateEmail, {exact:true}).waitFor();

  const signup = await connect(10, 390);
  await signup.page.goto(base + '/transfer-register.html');
  await signup.page.locator('#email').fill(candidateEmail);
  await signup.page.locator('#playerId').fill(candidateId);
  await signup.page.locator('#password').fill('Synthetic-test-only-1234');
  await signup.page.locator('#confirm').fill('Synthetic-test-only-1234');
  await signup.page.getByRole('button', {name:'Create account'}).click();
  await signup.page.getByText('Check your inbox', {exact:false}).waitFor();
  await signup.page.goto(base + '/' + entry);
  await signup.page.getByText('Signed in, but no approved NXS membership was found', {exact:false}).waitFor();

  await panel.getByLabel('Filter by email or player ID').fill(candidateId);
  await panel.getByRole('button', {name:'Refresh accounts'}).click();
  await panel.getByText('Email not confirmed', {exact:false}).waitFor();
  assert.equal(await panel.getByRole('button', {name:'Approve access'}).count(), 0);
  assert.equal(await panel.getByText('member@example.test', {exact:true}).count(), 0);
  await db.query('UPDATE auth.users SET email_confirmed_at=now() WHERE id=$1', [id(10)]);
  await panel.getByRole('button', {name:'Refresh accounts'}).click();
  await panel.getByRole('button', {name:'Approve access'}).click();
  const candidate = panel.locator('article').filter({ hasText: candidateEmail });
  await candidate.getByRole('button', {name:'Suspend access'}).waitFor();
  await signup.page.reload();
  await signup.page.locator('#private').waitFor({state:'visible'});

  await candidate.getByRole('button', {name:'Suspend access'}).click();
  await candidate.getByRole('button', {name:'Reactivate access'}).waitFor();
  await signup.page.reload();
  await signup.page.getByText('Signed in, but this NXS membership is inactive.', {exact:true}).waitFor();
  await candidate.getByRole('button', {name:'Reactivate access'}).click();
  await candidate.getByRole('button', {name:'Suspend access'}).waitFor();
  await signup.page.reload();
  await signup.page.locator('#private').waitFor({state:'visible'});
  const box = await panel.boundingBox();
  assert.ok(box.x >= 0 && box.x + box.width <= 390, JSON.stringify({
    box,
    overflow: await panel.evaluate(el => Array.from(el.querySelectorAll('*'))
      .map(child => [child.tagName, child.className, child.getBoundingClientRect().right])
      .filter(value => value[2] > 390).slice(0, 12))
  }));

  const desktop = await connect(6, 1280);
  await openTools(desktop.page);
  await desktop.page.locator('#phxAccessManagement summary').click();
  await desktop.page.locator('#phxAccessManagement').getByText(candidateEmail, {exact:true}).waitFor();
  const officer = await connect(3, 1280);
  await openTools(officer.page);
  assert.equal(await officer.page.locator('#phxAccessManagement').count(), 0);

  for (const test of [mobile, signup, desktop, officer]) assert.deepEqual(test.errors, []);
  const { rows } = await db.query('SELECT operation FROM public.nxs_audit_log ORDER BY id');
  assert.deepEqual(rows.map(x => x.operation), ['invite','approve','suspend','reactivate']);
  console.log('PASS Chromium 390/1280: existing registration screen, confirmed-email approval, app sign-in gates, suspension/reactivation, admin and delegated R5, nondelegated R5 exclusion and audit.');
} finally {
  await browser.close();
  await db.close();
}

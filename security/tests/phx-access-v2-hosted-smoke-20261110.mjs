import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
const { chromium } = await import(process.env.PHX_PLAYWRIGHT);
const credentials = JSON.parse(await readFile(process.env.PHX_HOSTED_FIXTURE_IDENTITIES,'utf8')).created;
const find = kind => {
  const fixture=credentials.find(x=>x.kind===kind);
  assert.ok(fixture && /^phx-access-[a-f0-9]{12}-(owner|delegate|observer|operator|administrator)@example\.com$/.test(fixture.email),
    'Only a synthetic hosted fixture identity may be used');
  return fixture;
};
const base = 'https://yuyvmbdybwpwpqsipfjt.supabase.co';
const key = process.env.PHX_HOSTED_PUBLISHABLE_KEY;
assert.match(key ?? '', /^sb_publishable_[A-Za-z0-9_-]+$/);
const preview = 'https://phalanx-cloudflare-test-depl.nexus-phalanx-kvk-test.pages.dev/pylon-ix/isolated-account-test/transfer-access-v2/transfer-scouting-id-stage-20261030.html';
const table='phx_hosted_fixture_candidates';
const rpc='phx_hosted_fixture_access';
const activeClients = new Set();
let browser, phase='start';
const client = () => createClient(base,key,{auth:{persistSession:false,autoRefreshToken:false}});
function ok(r) { if (r.error) throw Error(r.error.code+' '+r.error.message); return r.data; }
async function direct(kind) {
  const person=find(kind), c=client();
  const auth=ok(await c.auth.signInWithPassword({email:person.email,password:person.password}));
  assert.equal(auth.user.id,person.id);
  activeClients.add(c);
  return c;
}
function result(label){ console.log('PASS',label); }
async function view(kind) {
  const p=find(kind), page=await browser.newPage({viewport:{width:390,height:844},ignoreHTTPSErrors:process.env.PHX_FIXTURE_PROXY_CA_OVERRIDE==='1'});
  page.setDefaultTimeout(15000);
  const allowed = new Set([new URL(preview).origin,base,'https://esm.sh']);
  await page.route('**/*', route => allowed.has(new URL(route.request().url()).origin) ? route.continue() : route.abort());
  page.on('dialog',d=>d.accept());
  page.on('requestfailed',r=>{
    const u=new URL(r.url());
    if(u.origin===base||u.origin==='https://esm.sh') console.log('Browser request failed',u.origin,u.pathname,r.failure()?.errorText);
  });
  page.on('response',r=>{
    const u=new URL(r.url());
    if(u.origin===base && u.pathname==='/auth/v1/token') console.log('Hosted browser login HTTP',r.status());
  });
  await page.goto(preview,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof document.querySelector('#authForm')?.onsubmit==='function');
  await page.locator('#email').fill(p.email);
  await page.locator('#password').fill(p.password);
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  return page;
}
try {
  phase='signed-out and out-of-roster RPC';
  assert.ok((await client().rpc(rpc,{p_action:'list'})).error);
  const owner=await direct('owner');
  assert.equal(ok(await owner.rpc(rpc,{p_action:'check'})).allowed,true);
  assert.equal((await owner.rpc(rpc,{p_action:'invite',p_email:'out-of-fixture@example.com',p_player_id:'99900000',p_role:'observer'})).error?.code,'42501');
  result('unauthenticated and out-of-roster denial');
  phase='hosted delegate browser login';
  browser=await chromium.launch({executablePath:process.env.PHX_CHROMIUM,args:['--no-sandbox'],...(process.env.PHX_FIXTURE_BROWSER_PROXY?{proxy:{server:process.env.PHX_FIXTURE_BROWSER_PROXY}}:{})});
  const delegate=await view('delegate');
  try { await delegate.locator('#private').waitFor({state:'visible'}); }
  catch(e) { throw Error('Login status: '+(await delegate.locator('#message').textContent())+' | '+e.message); }
  await delegate.locator('#workspace-nav [data-view="workspace-tools"]').click();
  const panel=delegate.locator('#phxAccessManagement');
  await panel.locator(':scope > summary').click();
  await panel.getByText('Invite Player',{exact:true}).click();
  for(const kind of ['observer','operator','administrator']){
    phase='hosted invitation '+kind;
    const person=find(kind);
    await panel.getByLabel('Email',{exact:true}).fill(person.email);
    await panel.getByLabel('Kingshot Player ID').fill(person.player_id);
    await panel.getByLabel('Access role',{exact:true}).selectOption(kind);
    await panel.getByRole('button',{name:'Create invitation'}).click();
    await panel.getByText('Invitation created.',{exact:false}).waitFor();
    const page=await view(kind);
    await page.getByText('no approved NXS membership was found',{exact:false}).waitFor();
    phase='hosted approval '+kind;
    await panel.getByRole('button',{name:'Approvals',exact:true}).click();
    await panel.getByLabel('Email or player ID',{exact:true}).fill(person.player_id);
    await panel.getByRole('button',{name:'Search',exact:true}).click();
    const card=panel.locator('article').filter({hasText:person.email});
    await card.getByLabel('Approval role').waitFor();
    assert.equal(await card.getByLabel('Approval role').inputValue(),kind);
    await card.getByRole('button',{name:'Approve access'}).click();
    await panel.getByText('Account updated.',{exact:true}).waitFor();
    await page.reload();
    await page.locator('#private').waitFor({state:'visible'});
    assert.equal(await page.locator('#phxIdentityMeta').textContent(),kind.toUpperCase()+' · ACTIVE');
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    await page.close();
    await panel.getByLabel('Email or player ID',{exact:true}).fill('');
    await panel.getByRole('button',{name:'Refresh',exact:true}).click();
    result('Cloudflare browser invite, approval and reload for '+kind);
  }
  phase='hosted PostgREST role policies';
  const [observer,operator,admin]=await Promise.all(['observer','operator','administrator'].map(direct));
  assert.equal((await observer.rpc(rpc,{p_action:'list'})).error?.code,'42501');
  assert.equal((await operator.rpc(rpc,{p_action:'list'})).error?.code,'42501');
  const roleCheck=ok(await admin.rpc(rpc,{p_action:'check'}));
  assert.equal(roleCheck.allowed,true);
  assert.equal(roleCheck.scouting_role,'administrator');
  for(const [i,c] of [operator,admin].entries()){
    const id='hosted-fixture-'+(i+1);
    ok(await c.from(table).insert({candidate_id:id,player_name:'Fixture candidate '+(i+1)}));
    const changed=ok(await c.from(table).update({notes:'Hosted isolated test'}).eq('candidate_id',id).select('notes'));
    assert.equal(changed[0].notes,'Hosted isolated test');
    assert.deepEqual(ok(await c.from(table).delete().eq('candidate_id',id).select('candidate_id')),[]);
  }
  assert.equal(ok(await observer.from(table).select('candidate_id')).length,2);
  assert.equal((await observer.from(table).insert({candidate_id:'observer-denied',player_name:'Denied'})).error?.code,'42501');
  for(const kind of ['owner','delegate','administrator']){
    assert.equal((await admin.rpc(rpc,{p_action:'set_scouting_role',p_user_id:find(kind).id,p_role:'observer',p_email:'Isolated guard check'})).error?.code,'42501');
  }
  result('real hosted candidate RLS and protected owner, delegate and self');
  phase='hosted browser role editor and reload';
  await panel.getByRole('button',{name:'Accounts',exact:true}).click();
  const observerCard=panel.locator('article').filter({hasText:find('observer').email});
  for(const role of ['operator','observer']){
    await observerCard.getByText('Change role',{exact:true}).click();
    await observerCard.getByLabel('Member role',{exact:true}).selectOption(role);
    await observerCard.getByLabel('Reason for change').fill('Hosted browser acceptance');
    await observerCard.getByRole('button',{name:'Save role',exact:true}).click();
    await observerCard.locator(':scope > p').filter({hasText:new RegExp(role,'i')}).waitFor();
    assert.equal(ok(await observer.rpc(rpc,{p_action:'check'})).scouting_role,role);
  }
  result('hosted role editor and API readback');
  phase='hosted browser candidate board';
  const operatorPage=await view('operator');
  await operatorPage.locator('#private').waitFor({state:'visible'});
  await operatorPage.locator('#workspace-nav [data-view="scoutingBoard"]').click();
  await operatorPage.getByRole('button',{name:'Open player profile for Fixture candidate 1'}).waitFor();
  await operatorPage.reload();
  await operatorPage.locator('#private').waitFor({state:'visible'});
  await operatorPage.locator('#workspace-nav [data-view="scoutingBoard"]').click();
  assert.equal(await operatorPage.locator('tbody#rows tr[data-id]').count(),2);
  result('hosted candidate board renders persisted fixtures at 390 CSS px');
  phase='hosted session revocation';
  const access=ok(await observer.auth.getSession()).session.access_token;
  ok(await observer.auth.signOut({scope:'global'}));
  const stale=createClient(base,key,{global:{headers:{Authorization:'Bearer '+access}},auth:{persistSession:false,autoRefreshToken:false}});
  const check=ok(await stale.rpc(rpc,{p_action:'check'}));
  assert.equal(check.allowed,false);
  assert.equal(check.scouting_role,null);
  result('server-side denial after global logout');
} catch(e) {
  let sanitized=String(e.message);
  for(const p of credentials) for(const s of [p.email,p.password,p.id,p.player_id]) sanitized=sanitized.replaceAll(s,'[fixture]');
  console.error('FAILED',phase,sanitized.slice(0,2000));
  process.exitCode=1;
} finally {
  await browser?.close();
  await Promise.allSettled([...activeClients].map(c=>c.auth.signOut({scope:'local'})));
}

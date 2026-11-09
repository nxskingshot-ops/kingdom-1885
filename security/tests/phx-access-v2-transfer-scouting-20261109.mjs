import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { fixture, id } from './phx-access-management-isolated-20261109.mjs';

const patch = name => readFile(new URL('../patches/' + name, import.meta.url), 'utf8');

export async function scoutingFixture() {
  const context = await fixture();
  await context.db.exec(`
    CREATE TABLE public.transfer_candidates (candidate_id text PRIMARY KEY, player_name text);
    ALTER TABLE public.transfer_candidates ENABLE ROW LEVEL SECURITY;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.transfer_candidates TO authenticated;
    GRANT SELECT ON public.nxs_memberships TO authenticated;
    GRANT USAGE ON SCHEMA auth TO authenticated;
    CREATE POLICY self_read ON public.nxs_memberships FOR SELECT TO authenticated USING (user_id = auth.uid());
    CREATE POLICY legacy_read ON public.transfer_candidates FOR SELECT TO authenticated
      USING (EXISTS (SELECT 1 FROM public.nxs_memberships WHERE active AND role IN ('member','r4','r5','admin')));
    CREATE POLICY legacy_write ON public.transfer_candidates FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.nxs_memberships WHERE active AND role IN ('r4','r5','admin')));
  `);
  await context.db.query('INSERT INTO app_private.phx_access_settings (protected_user_id,delegate_user_id) VALUES ($1,$2)', [id(1), id(2)]);
  await context.db.exec(await patch('PHX-ACCESS-V2-TRANSFER-SCOUTING-20261109.sql'));
  return context;
}

async function run() {
  const { db, rpc, addUser } = await scoutingFixture();
  const denied = { code: '42501' };
  const appRole = (user, role, reason = 'Transfer Scouting staffing') => ({p_user_id: id(user), p_role: role, p_email: reason});
  const as = (user, sql) => db.transaction(async tx => {
    const { rows: [session] } = await tx.query('SELECT id FROM auth.sessions WHERE user_id=$1', [id(user)]);
    await tx.exec('SET LOCAL ROLE authenticated');
    await tx.query("SELECT set_config('request.jwt.claims',$1,true)", [JSON.stringify({sub: id(user), session_id: session?.id})]);
    return tx.query(sql);
  });
  try {
    assert.deepEqual(await rpc(1, 'check'), {allowed: true});
    await assert.rejects(rpc(1, 'invite', {p_role:'observer'}), denied);
    await db.exec('UPDATE app_private.phx_access_settings SET scouting_roles_enabled=true');

    for (const [user, role, inviter] of [[10,'observer',1], [11,'operator',1], [12,'administrator',2]]) {
      const email = role + '@example.test';
      const playerId = String(291100000 + user);
      const invite = {p_email:email,p_player_id:playerId,p_role:role};
      const approval = {...invite,p_user_id:id(user)};
      await addUser(user,email,playerId,false,'player_id');
      assert.deepEqual(await rpc(inviter,'invite',invite), {ok:true,changed:true});
      assert.deepEqual(await rpc(inviter,'invite',invite), {ok:true,changed:false});
      await assert.rejects(rpc(inviter,'approve',approval),denied);
      await db.query('UPDATE auth.users SET email_confirmed_at=now() WHERE id=$1',[id(user)]);
      await assert.rejects(rpc(inviter,'approve',{...approval,p_role:'member'}),denied);
      assert.deepEqual(await rpc(inviter,'approve',approval), {ok:true,changed:true});
      assert.deepEqual(await rpc(user,'check'), {allowed:role==='administrator',scouting_roles_enabled:true,legacy_manager:false,scouting_role:role});
      const {rows} = await db.query('SELECT role,scouting_role FROM public.nxs_memberships WHERE user_id=$1',[id(user)]);
      assert.deepEqual(rows, [{role:'member',scouting_role:role}]);
    }
    await assert.rejects(rpc(3,'set_scouting_role',appRole(10,'operator')),denied);
    for (const user of [1,2,6,12]) await assert.rejects(rpc(1,'set_scouting_role',appRole(user,'observer')),denied);
    await assert.rejects(rpc(12,'set_scouting_role',appRole(12,'observer')),denied);
    await assert.rejects(rpc(1,'suspend',{p_user_id:id(12)}),denied);
    await assert.rejects(rpc(12,'invite',{p_email:'kingdom@example.test',p_player_id:'100',p_role:'kingdom'}),denied);
    await assert.rejects(rpc(12,'set_scouting_role',appRole(10,'operator',' ')),{code:'22023'});
    await assert.rejects(rpc(10,'list'),denied);
    await assert.rejects(rpc(11,'list'),denied);
    await assert.rejects(rpc(1,'list',{},undefined,'anon'),denied);
    assert.deepEqual((await rpc(12,'check',{},'bad-session')).allowed,false);

    await db.exec("INSERT INTO public.transfer_candidates VALUES ('fixture','Existing')");
    assert.equal((await as(10,'SELECT * FROM public.transfer_candidates')).rows.length,1);
    await assert.rejects(as(10,"INSERT INTO public.transfer_candidates VALUES ('denied','Observer')"),denied);
    assert.equal((await as(10,"UPDATE public.transfer_candidates SET player_name='Denied' WHERE candidate_id='fixture'")).affectedRows,0);
    assert.equal((await as(11,"UPDATE public.transfer_candidates SET player_name='Edited' WHERE candidate_id='fixture'")).affectedRows,1);
    assert.equal((await as(12,"INSERT INTO public.transfer_candidates VALUES ('admin','Added')")).affectedRows,1);
    assert.equal((await as(12,"DELETE FROM public.transfer_candidates WHERE candidate_id='fixture'")).affectedRows,0);
    assert.equal((await as(4,"UPDATE public.transfer_candidates SET player_name='Legacy R4' WHERE candidate_id='fixture'")).affectedRows,1);

    assert.deepEqual(await rpc(12,'set_scouting_role',appRole(10,'operator')), {ok:true,changed:true});
    assert.deepEqual(await rpc(12,'set_scouting_role',appRole(10,'operator')), {ok:true,changed:false});
    assert.equal((await rpc(1,'list')).accounts.find(account=>account.user_id===id(10)).scouting_role,'operator');
    const {rows: [audit]} = await db.query("SELECT actor_id, before_data, after_data FROM public.nxs_audit_log WHERE operation='set_scouting_role'");
    assert.equal(audit.actor_id,id(12));
    assert.equal(audit.before_data.scouting_role,'observer');
    assert.equal(audit.after_data.scouting_role,'operator');
    assert.equal(audit.after_data.reason,'Transfer Scouting staffing');
    await db.exec("ALTER TABLE public.nxs_audit_log ADD CONSTRAINT simulated_failure CHECK (operation <> 'set_scouting_role') NOT VALID");
    await assert.rejects(rpc(1,'set_scouting_role',appRole(10,'observer')),{code:'23514'});
    assert.equal((await rpc(10,'check')).scouting_role,'operator');

    await db.query('DELETE FROM auth.sessions WHERE user_id=$1',[id(11)]);
    assert.equal((await rpc(11,'check')).scouting_role,null);
    assert.equal((await as(11,"UPDATE public.transfer_candidates SET player_name='Revoked'")).affectedRows,0);
    await db.exec(await patch('PHX-ACCESS-V2-TRANSFER-SCOUTING-DISABLE-20261109.sql'));
    assert.deepEqual(await rpc(12,'check'),{allowed:false});
    assert.equal((await as(10,"UPDATE public.transfer_candidates SET player_name='Disabled'")).affectedRows,0);
    assert.equal((await as(4,"UPDATE public.transfer_candidates SET player_name='Legacy remains' WHERE candidate_id='fixture'")).affectedRows,1);
    assert.equal((await db.query('SELECT scouting_role FROM public.nxs_memberships WHERE user_id=$1',[id(10)])).rows[0].scouting_role,'operator');
    const snapshot = `
      SELECT (SELECT jsonb_agg(to_jsonb(m) ORDER BY user_id) FROM public.nxs_memberships m) memberships,
             (SELECT jsonb_agg(to_jsonb(c) ORDER BY candidate_id) FROM public.transfer_candidates c) candidates,
             (SELECT jsonb_agg(to_jsonb(i) ORDER BY id) FROM app_private.phx_access_invites i) invitations,
             (SELECT jsonb_agg(to_jsonb(a) ORDER BY id) FROM public.nxs_audit_log a) audit,
             (SELECT scouting_roles_enabled FROM app_private.phx_access_settings WHERE singleton) enabled
    `;
    const statement = (await db.query(snapshot)).rows;
    const archive = await db.dumpDataDir('gzip');
    const bytes = Buffer.from(await archive.arrayBuffer());
    assert.ok(bytes.length > 0);
    const restored = new PGlite({loadDataDir:new Blob([Buffer.from(bytes)])});
    try {
      const {rows} = await restored.query(snapshot);
      assert.deepEqual(rows,statement);
      console.log('PASS synthetic backup integrity and separate database restore: SHA-256 ' +
        createHash('sha256').update(bytes).digest('hex'));
    } finally {
      await restored.close();
    }
    console.log('PASS PostgreSQL: three invitations and approvals, compatible memberships, actor/target guards, direct RLS, reason audit, audit failure rollback, revoked session and disable.');
  } finally {
    await db.close();
  }
}

if (process.argv[1]?.endsWith('phx-access-v2-transfer-scouting-20261109.mjs')) await run();

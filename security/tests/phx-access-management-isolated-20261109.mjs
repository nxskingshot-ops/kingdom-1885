import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

export const id = value => '10000000-0000-4000-8000-' + String(value).padStart(12, '0');
const sessionId = value => '20000000-0000-4000-8000-' + String(value).padStart(12, '0');

export async function fixture() {
  const db = new PGlite();
  await db.exec(`
    CREATE ROLE anon;
    CREATE ROLE authenticated;
    CREATE SCHEMA auth;
    CREATE SCHEMA app_private;
    GRANT USAGE ON SCHEMA app_private TO authenticated;
    CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS
      $$ SELECT nullif(current_setting('request.jwt.claims', true), '')::jsonb $$;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
      $$ SELECT (auth.jwt()->>'sub')::uuid $$;
    CREATE TABLE auth.users (
      id uuid PRIMARY KEY, email text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
      email_confirmed_at timestamptz, deleted_at timestamptz, banned_until timestamptz,
      is_anonymous boolean NOT NULL DEFAULT false, is_sso_user boolean NOT NULL DEFAULT false, raw_user_meta_data jsonb
    );
    CREATE TABLE auth.sessions (
      id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES auth.users(id), not_after timestamptz, oauth_client_id uuid
    );
    CREATE TABLE public.nxs_memberships (
      user_id uuid PRIMARY KEY REFERENCES auth.users(id), role text NOT NULL
      CHECK (role IN ('kingdom','member','outpost_manager','r4','r5','admin')),
      active boolean NOT NULL DEFAULT false, granted_at timestamptz NOT NULL DEFAULT now(),
      granted_by uuid REFERENCES auth.users(id), expires_at timestamptz
    );
    ALTER TABLE public.nxs_memberships ENABLE ROW LEVEL SECURITY;
    CREATE TABLE public.nxs_audit_log (
      id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, table_name text NOT NULL, record_key text NOT NULL,
      operation text NOT NULL, actor_id uuid, before_data jsonb, after_data jsonb,
      recorded_at timestamptz NOT NULL DEFAULT now()
    );
    ALTER TABLE public.nxs_audit_log ENABLE ROW LEVEL SECURITY;
  `);
  const addUser = async (user, email, player, confirmed = true, metadataKey = 'kingshot_player_id') => {
    await db.query(`
      INSERT INTO auth.users (id,email,email_confirmed_at,raw_user_meta_data)
      VALUES ($1,$2,CASE WHEN $4::boolean THEN now() END,jsonb_build_object($5::text,$3::text))
    `, [id(user), email, player, confirmed, metadataKey]);
    await db.query('INSERT INTO auth.sessions (id,user_id) VALUES ($1,$2)', [sessionId(user), id(user)]);
  };
  const role = async (user, name, active = true) => {
    await db.query('INSERT INTO public.nxs_memberships (user_id,role,active) VALUES ($1,$2,$3)', [id(user), name, active]);
  };
  const rpc = (user, action, args = {}, session = sessionId(user), dbRole = 'authenticated') => db.transaction(async tx => {
    assert.ok(dbRole === 'authenticated' || dbRole === 'anon');
    await tx.exec('SET LOCAL ROLE ' + dbRole);
    await tx.query("SELECT set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: id(user), session_id: session })]);
    const { rows } = await tx.query('SELECT public.phx_access_management($1,$2,$3,$4,$5) AS response', [
      action, args.p_user_id ?? null, args.p_email ?? null, args.p_player_id ?? null, args.p_role ?? null,
    ]);
    return rows[0].response;
  });

  for (const [user, name, userRole] of [
    [1, 'owner', 'admin'], [2, 'delegate', 'r5'], [3, 'other-r5', 'r5'], [4, 'officer', 'r4'],
    [5, 'member', 'member'], [6, 'admin', 'admin'], [7, 'disabled', 'admin'],
    [8, 'outpost', 'outpost_manager'], [9, 'expired', 'member'],
  ]) {
    await addUser(user, name + '@example.test', null);
    await role(user, userRole, user !== 7);
  }
  await db.query("UPDATE public.nxs_memberships SET expires_at = now() - interval '1 day' WHERE user_id = $1", [id(9)]);
  await db.exec(await readFile(new URL('../patches/PHX-ACCESS-MANAGEMENT-STAGE-20261109.sql', import.meta.url), 'utf8'));
  return { db, rpc, addUser };
}

const request = (user, email, player, role) => ({
  p_user_id: id(user), p_email: email, p_player_id: player, p_role: role,
});
const denied = { code: '42501' };

export async function run() {
  const { db, rpc, addUser } = await fixture();
  try {
    assert.deepEqual(await rpc(1, 'check'), { allowed: false });
    await assert.rejects(rpc(1, 'list'), denied);
    await db.query('INSERT INTO app_private.phx_access_settings (protected_user_id,delegate_user_id) VALUES ($1,$2)', [id(1), id(2)]);
    for (const actor of [1, 2, 6]) assert.deepEqual(await rpc(actor, 'check'), { allowed: true });
    for (const actor of [3, 4, 5, 7, 8, 9]) {
      assert.deepEqual(await rpc(actor, 'check'), { allowed: false });
      await assert.rejects(rpc(actor, 'list'), denied);
      await assert.rejects(rpc(actor, 'suspend', { p_user_id: id(5) }), denied);
    }
    await assert.rejects(rpc(2, 'list', {}, sessionId(6)), denied);
    await assert.rejects(rpc(2, 'check', {}, sessionId(2), 'anon'), denied);
    await db.query("UPDATE auth.sessions SET not_after=now() - interval '1 second' WHERE id=$1", [sessionId(6)]);
    await assert.rejects(rpc(6, 'suspend', { p_user_id: id(5) }), denied);
    await db.query('UPDATE auth.sessions SET not_after=NULL WHERE id=$1', [sessionId(6)]);
    await db.query('DELETE FROM auth.sessions WHERE id=$1', [sessionId(6)]);
    await assert.rejects(rpc(6, 'list'), denied);
    await db.query('INSERT INTO auth.sessions (id,user_id) VALUES ($1,$2)', [sessionId(6), id(6)]);
    await db.query('UPDATE auth.sessions SET oauth_client_id=$1 WHERE id=$2', [id(10), sessionId(6)]);
    await assert.rejects(rpc(6, 'list'), denied);
    await db.query('UPDATE auth.sessions SET oauth_client_id=NULL WHERE id=$1', [sessionId(6)]);
    for (const target of [1, 2, 3, 4, 6, 8]) await assert.rejects(rpc(6, 'suspend', { p_user_id: id(target) }), denied);
    await assert.rejects(rpc(6, 'reactivate', { p_user_id: id(9) }), denied);
    await assert.rejects(db.transaction(async tx => {
      await tx.exec('SET LOCAL ROLE authenticated');
      await tx.query('SELECT * FROM app_private.phx_access_invites');
    }), denied);
    await assert.rejects(db.transaction(async tx => {
      await tx.exec('SET LOCAL ROLE authenticated');
      await tx.query('UPDATE public.nxs_memberships SET active=false');
    }), denied);

    const alice = request(10, 'alice@example.test', '291000001', 'member');
    const bob = request(11, 'bob@example.test', '291000002', 'kingdom');
    await assert.rejects(rpc(2, 'invite', { ...alice, p_role: 'admin' }), { code: '22023' });
    await assert.rejects(rpc(2, 'invite', { ...alice, p_email: 'owner@example.test' }), { code: '23505' });
    assert.equal((await rpc(2, 'invite', { ...alice, p_email: 'ALICE@example.test' })).changed, true);
    assert.equal((await rpc(2, 'invite', alice)).changed, false);
    await assert.rejects(rpc(6, 'invite', { ...alice, p_email: 'duplicate@example.test' }), { code: '23505' });
    await addUser(10, alice.p_email, alice.p_player_id, false);
    assert.equal((await rpc(2, 'list')).accounts.find(a => a.user_id === id(10)).status, 'unconfirmed');
    await assert.rejects(rpc(2, 'approve', alice), denied);
    await db.query('UPDATE auth.users SET email_confirmed_at=now() WHERE id=$1', [id(10)]);
    await assert.rejects(rpc(2, 'approve', { ...alice, p_role: 'kingdom' }), denied);
    await assert.rejects(rpc(2, 'approve', { ...alice, p_email: 'wrong@example.test' }), { code: '22023' });
    await assert.rejects(rpc(2, 'approve', { ...alice, p_player_id: '291000009' }), { code: '22023' });
    assert.equal((await rpc(2, 'approve', alice)).changed, true);
    assert.equal((await rpc(2, 'list')).invitations.length, 0);
    await assert.rejects(rpc(2, 'approve', alice), { code: '22023' });
    await db.query('UPDATE auth.users SET raw_user_meta_data = NULL WHERE id=$1', [id(10)]);
    await assert.rejects(rpc(2, 'invite', { ...alice, p_email: 'duplicate@example.test' }), { code: '23505' });
    assert.equal((await rpc(2, 'suspend', alice)).changed, true);
    assert.equal((await rpc(2, 'suspend', alice)).changed, false);
    assert.equal((await rpc(6, 'reactivate', alice)).changed, true);
    assert.equal((await rpc(2, 'list')).accounts.find(a => a.user_id === id(10)).status, 'active');

    await addUser(11, bob.p_email, bob.p_player_id, true, 'player_id');
    await assert.rejects(rpc(2, 'approve', bob), denied);
    await rpc(2, 'invite', bob);
    await db.query("UPDATE app_private.phx_access_invites SET created_at=now()-interval '8 days', expires_at=now()-interval '1 day' WHERE email=$1", [bob.p_email]);
    await assert.rejects(rpc(2, 'approve', bob), denied);
    await rpc(2, 'invite', bob);
    assert.equal((await rpc(2, 'reject', bob)).changed, true);
    assert.equal((await rpc(2, 'reject', bob)).changed, false);
    assert.equal((await rpc(2, 'list')).accounts.find(a => a.user_id === id(11)).status, 'rejected');
    await assert.rejects(rpc(2, 'approve', bob), denied);
    await rpc(2, 'invite', bob);
    await db.query('UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || $2::jsonb WHERE id=$1', [id(11), JSON.stringify({ kingshot_player_id: '999' })]);
    await assert.rejects(rpc(2, 'approve', bob), { code: '22023' });
    await db.query("UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data - 'kingshot_player_id' WHERE id=$1", [id(11)]);
    await rpc(2, 'approve', bob);
    await db.exec("ALTER TABLE public.nxs_audit_log ADD CHECK (operation <> 'suspend') NOT VALID");
    await assert.rejects(rpc(2, 'suspend', bob), { code: '23514' });
    assert.equal((await rpc(2, 'list')).accounts.find(a => a.user_id === id(11)).status, 'active');
    assert.equal((await rpc(2, 'list')).accounts.find(a => a.user_id === id(11)).role, 'kingdom');
    const { rows: audit } = await db.query('SELECT operation,actor_id,before_data,after_data FROM public.nxs_audit_log ORDER BY id');
    assert.deepEqual(audit.map(a => a.operation), ['invite','approve','suspend','reactivate','invite','invite','reject','invite','approve']);
    assert.equal(audit[3].actor_id, id(6));
    assert.deepEqual(audit[2].before_data, { role: 'member', active: true });
    assert.ok(audit.every(a => !JSON.stringify(a).includes('@example.test')));
    assert.equal((await db.query('SELECT role FROM public.nxs_memberships WHERE user_id=$1',[id(1)])).rows[0].role, 'admin');
    const revoke = 'REVOKE EXECUTE ON FUNCTION public.phx_access_management(text, uuid, text, text, text), app_private.phx_access_management(text, uuid, text, text, text) FROM authenticated';
    await db.exec(revoke);
    await assert.rejects(rpc(2, 'check'), denied);
    assert.equal((await db.query('SELECT count(*)::integer AS count FROM public.nxs_audit_log')).rows[0].count, audit.length);
    assert.equal((await db.query('SELECT active FROM public.nxs_memberships WHERE user_id=$1', [id(11)])).rows[0].active, true);
    console.log((await db.query('SELECT version()')).rows[0].version);
    console.log('PASS: disabled-by-default, actor and target matrix, expiry, session revocation, private data, invitation/identity/approval/rejection, suspension/reactivation, audit rollback, duplicate operations and API disable.');
  } finally {
    await db.close();
  }
}

if (new URL(import.meta.url).pathname === process.argv[1]) await run();

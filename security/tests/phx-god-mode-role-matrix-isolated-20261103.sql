-- ISOLATED ROLE-MATRIX TEST: disposable PostgreSQL only; no Supabase connection.
\set ON_ERROR_STOP on
BEGIN;
CREATE SCHEMA phx_role_gate;
CREATE TABLE phx_role_gate.owner_principal (
 singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
 owner_auth_user uuid NOT NULL UNIQUE
);
CREATE TABLE phx_role_gate.memberships (
 user_id uuid PRIMARY KEY,
 role text NOT NULL CHECK(role IN ('kingdom','member','outpost_manager','r4','r5','admin')),
 active boolean NOT NULL DEFAULT false,
 expires_at timestamptz
);
CREATE FUNCTION phx_role_gate.can_manage(target uuid, actor uuid) RETURNS boolean
LANGUAGE sql STABLE SET search_path=pg_catalog,phx_role_gate AS $$
 SELECT EXISTS(SELECT 1 FROM phx_role_gate.owner_principal WHERE owner_auth_user=actor)
 OR (
  NOT EXISTS(SELECT 1 FROM phx_role_gate.owner_principal WHERE owner_auth_user=target)
  AND EXISTS(SELECT 1 FROM phx_role_gate.memberships WHERE user_id=actor AND role='admin' AND active AND (expires_at IS NULL OR expires_at>now()))
 )
$$;
CREATE FUNCTION phx_role_gate.owner_only(actor uuid) RETURNS boolean
LANGUAGE sql STABLE SET search_path=pg_catalog,phx_role_gate AS $$
 SELECT EXISTS(SELECT 1 FROM phx_role_gate.owner_principal WHERE owner_auth_user=actor)
$$;
INSERT INTO phx_role_gate.owner_principal VALUES(true,'11111111-1111-4111-8111-111111111111');
INSERT INTO phx_role_gate.memberships(user_id,role,active) VALUES
 ('11111111-1111-4111-8111-111111111111','admin',true),
 ('22222222-2222-4222-8222-222222222222','admin',true),
 ('33333333-3333-4333-8333-333333333333','r4',true),
 ('44444444-4444-4444-8444-444444444444','member',true),
 ('55555555-5555-4555-8555-555555555555','admin',false);
DO $$
DECLARE owner_id uuid:='11111111-1111-4111-8111-111111111111';
 admin_id uuid:='22222222-2222-4222-8222-222222222222';
 r4_id uuid:='33333333-3333-4333-8333-333333333333';
 member_id uuid:='44444444-4444-4444-8444-444444444444';
 disabled_id uuid:='55555555-5555-4555-8555-555555555555';
BEGIN
 IF NOT phx_role_gate.owner_only(owner_id) THEN RAISE EXCEPTION 'FAIL owner recognized'; END IF;
 RAISE NOTICE 'PASS owner recognized';
 IF phx_role_gate.owner_only(admin_id) THEN RAISE EXCEPTION 'FAIL admin elevated to owner'; END IF;
 RAISE NOTICE 'PASS admin not owner';
 IF phx_role_gate.can_manage(owner_id,admin_id) THEN RAISE EXCEPTION 'FAIL admin manages owner'; END IF;
 RAISE NOTICE 'PASS admin cannot manage owner';
 IF NOT phx_role_gate.can_manage(member_id,admin_id) THEN RAISE EXCEPTION 'FAIL admin cannot manage member'; END IF;
 RAISE NOTICE 'PASS admin manages ordinary member';
 IF phx_role_gate.can_manage(member_id,r4_id) THEN RAISE EXCEPTION 'FAIL r4 elevated to admin'; END IF;
 RAISE NOTICE 'PASS r4 not admin';
 IF phx_role_gate.can_manage(member_id,disabled_id) THEN RAISE EXCEPTION 'FAIL disabled admin allowed'; END IF;
 RAISE NOTICE 'PASS disabled admin rejected';
 IF NOT phx_role_gate.can_manage(owner_id,owner_id) THEN RAISE EXCEPTION 'FAIL owner self management'; END IF;
 RAISE NOTICE 'PASS owner self management';
 IF NOT phx_role_gate.can_manage(member_id,owner_id) THEN RAISE EXCEPTION 'FAIL owner manages member'; END IF;
 RAISE NOTICE 'PASS owner manages member';
END $$;
ROLLBACK;
-- Demonstrates role-decision logic only. Does NOT enforce Supabase Auth, RLS or mutation permissions.

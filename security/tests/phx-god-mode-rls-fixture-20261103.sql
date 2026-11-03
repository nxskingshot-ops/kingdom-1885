\set ON_ERROR_STOP on
-- Disposable RLS fixture derived from observed membership columns, NOT a clone of production policies.
BEGIN;
CREATE SCHEMA phx_rls_fixture;
CREATE TABLE phx_rls_fixture.owner_binding (owner_user uuid PRIMARY KEY);
CREATE TABLE phx_rls_fixture.memberships (
 user_id uuid PRIMARY KEY, role text NOT NULL CHECK(role IN ('kingdom','member','outpost_manager','r4','r5','admin')),
 active boolean NOT NULL DEFAULT false, expires_at timestamptz
);
CREATE ROLE phx_fixture_client NOLOGIN;
CREATE FUNCTION phx_rls_fixture.actor() RETURNS uuid LANGUAGE sql STABLE AS $$
 SELECT nullif(current_setting('phx_fixture.actor',true),'')::uuid
$$;
CREATE FUNCTION phx_rls_fixture.can_update(target uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,phx_rls_fixture AS $$
 SELECT
 EXISTS(SELECT 1 FROM phx_rls_fixture.owner_binding WHERE owner_user=phx_rls_fixture.actor())
 OR (
 NOT EXISTS(SELECT 1 FROM phx_rls_fixture.owner_binding WHERE owner_user=target)
 AND EXISTS(SELECT 1 FROM phx_rls_fixture.memberships WHERE user_id=phx_rls_fixture.actor() AND role='admin' AND active AND (expires_at IS NULL OR expires_at>now()))
 )
$$;
REVOKE ALL ON FUNCTION phx_rls_fixture.can_update(uuid) FROM PUBLIC;
GRANT USAGE ON SCHEMA phx_rls_fixture TO phx_fixture_client;
GRANT SELECT,UPDATE ON phx_rls_fixture.memberships TO phx_fixture_client;
GRANT EXECUTE ON FUNCTION phx_rls_fixture.can_update(uuid) TO phx_fixture_client;
ALTER TABLE phx_rls_fixture.memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY fixture_read ON phx_rls_fixture.memberships FOR SELECT TO phx_fixture_client USING (true);
CREATE POLICY fixture_update ON phx_rls_fixture.memberships FOR UPDATE TO phx_fixture_client USING (phx_rls_fixture.can_update(user_id)) WITH CHECK (phx_rls_fixture.can_update(user_id));
INSERT INTO phx_rls_fixture.owner_binding VALUES ('11111111-1111-4111-8111-111111111111');
INSERT INTO phx_rls_fixture.memberships(user_id,role,active) VALUES
('11111111-1111-4111-8111-111111111111','admin',true),
('22222222-2222-4222-8222-222222222222','admin',true),
('33333333-3333-4333-8333-333333333333','member',true);
SET LOCAL ROLE phx_fixture_client;
SELECT set_config('phx_fixture.actor','22222222-2222-4222-8222-222222222222',true);
DO $$
DECLARE n integer;
BEGIN
 UPDATE phx_rls_fixture.memberships SET active=false WHERE user_id='11111111-1111-4111-8111-111111111111';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'FAIL admin changed owner'; END IF;
 RAISE NOTICE 'PASS admin blocked from owner UPDATE';
 UPDATE phx_rls_fixture.memberships SET active=false WHERE user_id='33333333-3333-4333-8333-333333333333';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>1 THEN RAISE EXCEPTION 'FAIL admin ordinary member UPDATE'; END IF;
 RAISE NOTICE 'PASS admin may update ordinary member';
END $$;
SELECT set_config('phx_fixture.actor','33333333-3333-4333-8333-333333333333',true);
DO $$
DECLARE n integer;
BEGIN
 UPDATE phx_rls_fixture.memberships SET role='admin' WHERE user_id='33333333-3333-4333-8333-333333333333';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'FAIL member self elevation'; END IF;
 RAISE NOTICE 'PASS member cannot self-elevate';
END $$;
SELECT set_config('phx_fixture.actor','11111111-1111-4111-8111-111111111111',true);
DO $$
DECLARE n integer;
BEGIN
 UPDATE phx_rls_fixture.memberships SET active=true WHERE user_id='33333333-3333-4333-8333-333333333333';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>1 THEN RAISE EXCEPTION 'FAIL owner manages member'; END IF;
 RAISE NOTICE 'PASS owner may manage member';
END $$;
RESET ROLE;
ROLLBACK;
-- Does not test actual production RLS, Auth, DELETE, principal integrity, or service_role bypass.

-- PHALANX GOD MODE — isolated executable PostgreSQL security test
-- Run only in a disposable test database, never production.
BEGIN;
CREATE SCHEMA phx_guard_test;
CREATE TABLE phx_guard_test.owner (
  singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
  principal uuid NOT NULL UNIQUE
);
CREATE TABLE phx_guard_test.game_links (
  auth_user uuid NOT NULL,
  game_player_id text NOT NULL
);
CREATE TABLE phx_guard_test.memberships (
  auth_user uuid PRIMARY KEY,
  role text NOT NULL,
  active boolean NOT NULL DEFAULT true
);
CREATE FUNCTION phx_guard_test.deny_owner_mutation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, phx_guard_test AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM phx_guard_test.owner o WHERE o.principal = OLD.auth_user) THEN
    RAISE EXCEPTION 'owner-protected account' USING ERRCODE = '42501';
  END IF;
  RETURN OLD;
END;
$$;
CREATE TRIGGER owner_membership_guard
BEFORE UPDATE OR DELETE ON phx_guard_test.memberships
FOR EACH ROW EXECUTE FUNCTION phx_guard_test.deny_owner_mutation();

INSERT INTO phx_guard_test.owner VALUES
 (true,'11111111-1111-4111-8111-111111111111');
INSERT INTO phx_guard_test.memberships VALUES
 ('11111111-1111-4111-8111-111111111111','owner',true),
 ('22222222-2222-4222-8222-222222222222','admin',true);
INSERT INTO phx_guard_test.game_links VALUES
 ('11111111-1111-4111-8111-111111111111','291410048');

-- Negative tests: owner UPDATE/DELETE must fail; game identity is irrelevant.
DO $$
DECLARE denied boolean;
BEGIN
  denied := false;
  BEGIN
    UPDATE phx_guard_test.memberships SET active=false
      WHERE auth_user='11111111-1111-4111-8111-111111111111';
  EXCEPTION WHEN insufficient_privilege THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'FAIL: owner suspension allowed'; END IF;

  denied := false;
  BEGIN
    DELETE FROM phx_guard_test.memberships
      WHERE auth_user='11111111-1111-4111-8111-111111111111';
  EXCEPTION WHEN insufficient_privilege THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'FAIL: owner deletion allowed'; END IF;

  UPDATE phx_guard_test.game_links SET game_player_id='changed'
    WHERE auth_user='11111111-1111-4111-8111-111111111111';
  DELETE FROM phx_guard_test.game_links
    WHERE auth_user='11111111-1111-4111-8111-111111111111';
  IF NOT EXISTS (SELECT 1 FROM phx_guard_test.owner
    WHERE principal='11111111-1111-4111-8111-111111111111')
  THEN RAISE EXCEPTION 'FAIL: game unlink affected owner'; END IF;

  UPDATE phx_guard_test.memberships SET active=false
    WHERE auth_user='22222222-2222-4222-8222-222222222222';
  IF NOT EXISTS (SELECT 1 FROM phx_guard_test.memberships
    WHERE auth_user='22222222-2222-4222-8222-222222222222'
      AND active=false)
  THEN RAISE EXCEPTION 'FAIL: non-owner update blocked'; END IF;
END $$;
ROLLBACK;
-- All changes rolled back, including test schema. No production deployment.
-- NOTE: This test only proves the fixture's membership trigger, not full
-- auth.users protection, owner identity bootstrap, RLS or platform access.

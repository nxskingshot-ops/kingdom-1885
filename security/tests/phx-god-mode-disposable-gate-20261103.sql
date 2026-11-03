-- ISOLATED TEST ONLY. Run only against the ephemeral PostgreSQL service in the workflow.
BEGIN;
CREATE SCHEMA phx_god_gate_fixture;
CREATE TABLE phx_god_gate_fixture.owner_principal (singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton), principal uuid NOT NULL UNIQUE);
CREATE TABLE phx_god_gate_fixture.memberships (auth_user uuid PRIMARY KEY, role text NOT NULL, active boolean NOT NULL);
CREATE TABLE phx_god_gate_fixture.game_links (auth_user uuid NOT NULL, game_player_id text NOT NULL);
CREATE FUNCTION phx_god_gate_fixture.protect_owner() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,phx_god_gate_fixture AS $$
BEGIN
 IF EXISTS (SELECT 1 FROM phx_god_gate_fixture.owner_principal WHERE principal=OLD.auth_user) THEN
 RAISE EXCEPTION 'owner-protected' USING ERRCODE='42501';
 END IF;
 IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER protect_owner_membership BEFORE UPDATE OR DELETE ON phx_god_gate_fixture.memberships FOR EACH ROW EXECUTE FUNCTION phx_god_gate_fixture.protect_owner();
INSERT INTO phx_god_gate_fixture.owner_principal VALUES(true,'11111111-1111-4111-8111-111111111111');
INSERT INTO phx_god_gate_fixture.memberships VALUES('11111111-1111-4111-8111-111111111111','owner',true),('22222222-2222-4222-8222-222222222222','admin',true);
INSERT INTO phx_god_gate_fixture.game_links VALUES('11111111-1111-4111-8111-111111111111','example-game-id');
DO $$ DECLARE denied boolean;
BEGIN
 denied:=false;
 BEGIN UPDATE phx_god_gate_fixture.memberships SET active=false WHERE auth_user='11111111-1111-4111-8111-111111111111'; EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'FAIL owner suspension'; END IF;
 RAISE NOTICE 'PASS owner suspension rejected';
 denied:=false;
 BEGIN UPDATE phx_god_gate_fixture.memberships SET role='member' WHERE auth_user='11111111-1111-4111-8111-111111111111'; EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'FAIL owner demotion'; END IF;
 RAISE NOTICE 'PASS owner demotion rejected';
 denied:=false;
 BEGIN DELETE FROM phx_god_gate_fixture.memberships WHERE auth_user='11111111-1111-4111-8111-111111111111'; EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
 IF NOT denied THEN RAISE EXCEPTION 'FAIL owner deletion'; END IF;
 RAISE NOTICE 'PASS owner deletion rejected';
 UPDATE phx_god_gate_fixture.game_links SET game_player_id='changed' WHERE auth_user='11111111-1111-4111-8111-111111111111';
 DELETE FROM phx_god_gate_fixture.game_links WHERE auth_user='11111111-1111-4111-8111-111111111111';
 IF NOT EXISTS (SELECT 1 FROM phx_god_gate_fixture.owner_principal WHERE principal='11111111-1111-4111-8111-111111111111') THEN RAISE EXCEPTION 'FAIL game link independent'; END IF;
 RAISE NOTICE 'PASS game link independent';
 UPDATE phx_god_gate_fixture.memberships SET active=false WHERE auth_user='22222222-2222-4222-8222-222222222222';
 IF NOT EXISTS (SELECT 1 FROM phx_god_gate_fixture.memberships WHERE auth_user='22222222-2222-4222-8222-222222222222' AND active=false) THEN RAISE EXCEPTION 'FAIL non-owner update'; END IF;
 RAISE NOTICE 'PASS non-owner membership update';
END $$;
ROLLBACK;
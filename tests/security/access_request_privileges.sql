-- Disposable local PostgreSQL ONLY. Run in a fresh temporary database.
\set ON_ERROR_STOP on
BEGIN;
CREATE ROLE phalanx_test_anon NOLOGIN;
CREATE ROLE phalanx_test_auth NOLOGIN;
CREATE SCHEMA phalanx_test;
CREATE TABLE phalanx_test.nexus_access_requests (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 gamer_tag text NOT NULL,
 player_id text NOT NULL,
 alliance text NOT NULL,
 status text NOT NULL DEFAULT 'pending',
 requested_at timestamptz DEFAULT now(),
 reviewed_at timestamptz,
 reviewed_by uuid,
 note text,
 granted_user_id uuid,
 granted_role text
);
GRANT USAGE ON SCHEMA phalanx_test TO phalanx_test_anon, phalanx_test_auth;
-- Simulate the existing broad table-level grant.
GRANT INSERT ON phalanx_test.nexus_access_requests TO phalanx_test_anon, phalanx_test_auth;
DO $$
BEGIN
 IF NOT has_column_privilege('phalanx_test_anon','phalanx_test.nexus_access_requests','granted_role','INSERT') THEN
   RAISE EXCEPTION 'Precondition failed: broad grant not effective';
 END IF;
END $$;
-- Proposed restricted column grants.
REVOKE INSERT ON phalanx_test.nexus_access_requests FROM phalanx_test_anon, phalanx_test_auth;
GRANT INSERT (gamer_tag, player_id, alliance, status)
 ON phalanx_test.nexus_access_requests TO phalanx_test_anon, phalanx_test_auth;
DO $$
DECLARE role_name text; col_name text;
BEGIN
 FOREACH role_name IN ARRAY ARRAY['phalanx_test_anon','phalanx_test_auth'] LOOP
   FOREACH col_name IN ARRAY ARRAY['gamer_tag','player_id','alliance','status'] LOOP
     IF NOT has_column_privilege(role_name,'phalanx_test.nexus_access_requests',col_name,'INSERT') THEN
       RAISE EXCEPTION '% lacks allowed INSERT column %',role_name,col_name;
     END IF;
   END LOOP;
   FOREACH col_name IN ARRAY ARRAY['id','requested_at','reviewed_at','reviewed_by','note','granted_user_id','granted_role'] LOOP
     IF has_column_privilege(role_name,'phalanx_test.nexus_access_requests',col_name,'INSERT') THEN
       RAISE EXCEPTION '% can INSERT protected column %',role_name,col_name;
     END IF;
   END LOOP;
 END LOOP;
END $$;
-- Real inserts under both roles (identity/default fields omitted).
SET LOCAL ROLE phalanx_test_anon;
INSERT INTO phalanx_test.nexus_access_requests(gamer_tag,player_id,alliance,status)
 VALUES ('Local Tester','LT-123','NXS','pending');
RESET ROLE;
SET LOCAL ROLE phalanx_test_auth;
INSERT INTO phalanx_test.nexus_access_requests(gamer_tag,player_id,alliance,status)
 VALUES ('Local Reviewer','LR-123','NXS','pending');
RESET ROLE;
ROLLBACK;
\echo PASS: local column privilege and legitimate insert contract checks

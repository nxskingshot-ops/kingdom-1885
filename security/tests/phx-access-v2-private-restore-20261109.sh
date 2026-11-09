#!/usr/bin/env bash
# Runner-side replay. Reads only a preverified archive in the private runner directory.
set -euo pipefail
umask 077

: "${RUNNER_TEMP:?}" "${PHX_RESTORE_TEMP:?}" "${RESTORE_CONTAINER:?}" "${RESTORE_IMAGE:?}"
[[ "$PHX_RESTORE_TEMP" == "$RUNNER_TEMP"/phx-restore.* && "$RESTORE_CONTAINER" == phx-private-restore-* ]]
[[ "$RESTORE_IMAGE" == supabase/postgres@sha256:* && -s "$PHX_RESTORE_TEMP/restore.dump" ]]

# Suppress database errors and output containing restored values from the Actions log.
restore_log="$PHX_RESTORE_TEMP/rehearsal.log"
fail() {
  printf '::error::Restore rehearsal failed during %s. Private output was not published.\n' "$1"
  exit 1
}

export POSTGRES_PASSWORD
POSTGRES_PASSWORD=$(openssl rand -hex 40)
docker run -d --name "$RESTORE_CONTAINER" --network none --log-driver none \
  -e POSTGRES_PASSWORD -e POSTGRES_USER=supabase_admin -e POSTGRES_DB=postgres \
  "$RESTORE_IMAGE" postgres -D /etc/postgresql -c listen_addresses= -c cron.launch_active_jobs=off \
  > "$restore_log" 2>&1 || fail 'starting the isolated image'
unset POSTGRES_PASSWORD

db() {
  local database=$1
  shift
  docker exec -i --user postgres "$RESTORE_CONTAINER" \
    psql -X --set ON_ERROR_STOP=1 --username supabase_admin --dbname "$database" "$@"
}

for attempt in $(seq 1 90); do
  if docker exec "$RESTORE_CONTAINER" sh -c 'test "$(cat /proc/1/comm)" = postgres' >> "$restore_log" 2>&1 &&
    db template1 -qAt -c "SELECT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator')" \
    > "$PHX_RESTORE_TEMP/ready" 2>> "$restore_log" && grep -qx t "$PHX_RESTORE_TEMP/ready"; then
    break
  fi
  sleep 1
done
grep -qx t "$PHX_RESTORE_TEMP/ready" || fail 'waiting for Supabase bootstrap roles'
[[ "$(docker inspect -f '{{.HostConfig.NetworkMode}}' "$RESTORE_CONTAINER")" == none ]] || fail 'verifying network isolation'
db template1 -q >> "$restore_log" 2>&1 <<'SQL' || fail 'creating an empty restore target'
ALTER DATABASE postgres WITH ALLOW_CONNECTIONS false;
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'postgres';
ALTER DATABASE postgres RENAME TO phx_bootstrap;
CREATE DATABASE postgres WITH TEMPLATE template0;
SQL

if ! /usr/lib/postgresql/18/bin/pg_restore --no-owner --no-acl --file=- "$PHX_RESTORE_TEMP/restore.dump" 2>> "$restore_log" \
  | db postgres -q --single-transaction >> "$restore_log" 2>&1; then
  fail 'restoring the complete custom archive'
fi

# The archive omits owners and ACLs. Replay the independently captured Access V2 scope.
db postgres -q < security/tests/phx-access-v2-private-restore-acl-20261109.sql \
  >> "$restore_log" 2>&1 || fail 'replaying and validating scoped ownership, grants and RLS'

inventory_sql="
SELECT 'membership' AS key, md5(coalesce(jsonb_agg(to_jsonb(m) - 'scouting_role' ORDER BY user_id)::text,'[]'))
FROM public.nxs_memberships m
UNION ALL SELECT 'candidates', md5(coalesce(jsonb_agg(to_jsonb(c) ORDER BY candidate_id)::text,'[]'))
FROM public.transfer_candidates c
UNION ALL SELECT 'invites', md5(coalesce(jsonb_agg(to_jsonb(i) - 'scouting_role' ORDER BY id)::text,'[]'))
FROM app_private.phx_access_invites i
UNION ALL SELECT 'audit', md5(coalesce(jsonb_agg(to_jsonb(a) ORDER BY id)::text,'[]'))
FROM public.nxs_audit_log a
UNION ALL SELECT 'settings', md5(coalesce(jsonb_agg(to_jsonb(s) - 'scouting_roles_enabled' ORDER BY singleton)::text,'[]'))
FROM app_private.phx_access_settings s
ORDER BY 1"
db postgres -qAt -c "$inventory_sql" > "$PHX_RESTORE_TEMP/before" 2>> "$restore_log" || fail 'checking restored data'
if ! { printf 'SET ROLE postgres;\n'; cat security/patches/PHX-ACCESS-V2-TRANSFER-SCOUTING-20261109.sql; } \
  | db postgres -q >> "$restore_log" 2>&1; then
  fail 'rehearsing the disabled-by-default migration'
fi
db postgres -qAt -c "$inventory_sql" > "$PHX_RESTORE_TEMP/after" 2>> "$restore_log" || fail 'checking migrated data'
cmp -s "$PHX_RESTORE_TEMP/before" "$PHX_RESTORE_TEMP/after" || fail 'verifying legacy row integrity'
db postgres -q >> "$restore_log" 2>&1 <<'SQL' || fail 'checking migration release guards'
DO $check$
BEGIN
  IF (SELECT scouting_roles_enabled FROM app_private.phx_access_settings WHERE singleton) IS DISTINCT FROM false
    OR has_function_privilege('anon', 'app_private.phx_current_scouting_role()', 'execute')
    OR has_function_privilege('anon', 'public.phx_access_management(text,uuid,text,text,text)', 'execute')
    OR (SELECT pg_get_userbyid(proowner) FROM pg_proc
        WHERE oid = 'app_private.phx_current_scouting_role()'::regprocedure) <> 'postgres' THEN
    RAISE EXCEPTION 'Unexpected V2 flag or execute grant';
  END IF;
END;
$check$;
BEGIN;
SET LOCAL ROLE authenticated;
DO $check$
BEGIN
  IF public.phx_access_management('check')->'allowed' IS DISTINCT FROM 'false'::jsonb THEN
    RAISE EXCEPTION 'An unauthenticated fixture context was accepted';
  END IF;
END;
$check$;
ROLLBACK;
SQL

{
  echo '### PHALANX private backup restore rehearsal'
  echo '- BESTANDEN · encrypted archive integrity and full PostgreSQL archive restore in a network-disabled container.'
  echo '- BESTANDEN · restored Transfer Scouting ownership, Access RPC grants, candidate RLS and legacy row integrity after the disabled-by-default migration.'
  echo '- NICHT GETESTET · full-project owner and ACL parity, hosted Auth, Android, and the production rollout.'
} >> "$GITHUB_STEP_SUMMARY"

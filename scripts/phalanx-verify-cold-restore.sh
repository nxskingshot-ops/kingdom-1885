#!/usr/bin/env bash
# Offline disposable PostgreSQL restore verifier. No production connections.
set -Eeuo pipefail
umask 077
test "$#" -eq 1 && test -s "$1" || { echo 'Supply a decrypted custom-format dump'; exit 2; }
for c in pg_restore initdb pg_ctl psql createdb sha256sum realpath; do command -v "$c" >/dev/null || { echo "Missing $c"; exit 2; }; done
dump="$(realpath "$1")"
tmp="$(mktemp -d)"
cleanup() { if test -f "$tmp/db/postmaster.pid"; then pg_ctl -D "$tmp/db" -m immediate stop >/dev/null 2>&1 || true; fi; rm -rf "$tmp"; }
trap cleanup EXIT
sha256sum "$dump"
pg_restore --list "$dump" > "$tmp/contents.txt"
test -s "$tmp/contents.txt"
initdb -D "$tmp/db" --auth-local=trust --auth-host=reject --no-instructions > "$tmp/initdb.log"
mkdir "$tmp/socket"
pg_ctl -D "$tmp/db" -o "-c listen_addresses='' -c unix_socket_directories='$tmp/socket'" -l "$tmp/postgres.log" start >/dev/null
export PGHOST="$tmp/socket" PGUSER="$(id -un)"
createdb phalanx_restore_test
pg_restore --dbname=phalanx_restore_test --no-owner --no-acl --exit-on-error "$dump" > "$tmp/restore.stdout" 2> "$tmp/restore.stderr" || { echo 'RESTORE FAILED; see local logs before cleanup'; exit 1; }
psql -d phalanx_restore_test -XAtqc "SELECT 'tables='||count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r';"
psql -d phalanx_restore_test -XAtqc "SELECT 'rls_enabled='||count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity;"
psql -d phalanx_restore_test -XAtqc "SELECT 'policies='||count(*) FROM pg_policies WHERE schemaname='public';"
echo 'ARCHIVE DATABASE RESTORE PASS; Auth/Storage/Edge/config remain separate gates.'

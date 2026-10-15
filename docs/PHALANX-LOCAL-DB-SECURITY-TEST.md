# PHALANX — zero-cost local database privilege test

**Local-only**. Never point these commands at `hcjrdofkdkasznywvcxo` or another hosted production database.

Requires Docker Desktop / Docker Engine (with Compose) on a computer. The ChatGPT execution environment does not currently have PostgreSQL or Docker installed, so this integration test is **prepared, not executed**.

Run from repository root:

```bash
docker run --rm --name phalanx-grant-test -e POSTGRES_PASSWORD=localtest -p 127.0.0.1:55439:5432 -d postgres:17
# Wait until healthy: docker exec phalanx-grant-test pg_isready -U postgres
docker exec -i phalanx-grant-test psql -v ON_ERROR_STOP=1 -U postgres < tests/security/access_request_privileges.sql
docker stop phalanx-grant-test
```

The test creates disposable roles and a simplified table matching the access-request columns, then verifies column grants using PostgreSQL's `has_column_privilege`. It does not reproduce Supabase Auth, RLS, existing policy definitions, Edge Functions or actual database migrations. Those need separate integration tests before production release.

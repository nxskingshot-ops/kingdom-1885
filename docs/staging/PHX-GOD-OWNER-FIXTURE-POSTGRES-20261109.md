# PHALANX GOD MODE – first real PostgreSQL fixture run (2026-11-09)

**Environment:** isolated Supabase project `yuyvmbdybwpwpqsipfjt`, PostgreSQL **17.11**. No production schema changed.

**Source:** `security/tests/PHX-GOD-MODE-ISOLATED-OWNER-GUARD-TEST.sql` on `governance/phalanx-project-control-20261021`. Read-only inspection before execution. Fixture was run inside BEGIN/ROLLBACK, creating only temporary transaction-scoped test schema and records.

## Finding: original fixture FAIL
The original trigger function returned `OLD` for both `UPDATE` and `DELETE`. On PostgreSQL `BEFORE UPDATE`, returning `OLD` silently discards the proposed non-owner changes. The original fixture therefore **failed** the assertion `FAIL non-owner update blocked`. This is a functional defect in the original isolated SQL fixture; it does **not** establish that production GOD-mode code has the same defect.

## Corrected in-memory test PASS
Changed only the transient SQL executed in the isolated transaction to:
```sql
IF TG_OP='UPDATE' THEN RETURN NEW; END IF;
RETURN OLD;
```
All original assertions then **PASS**: owner UPDATE and DELETE denied with 42501; unlinking game identity does not affect owner principal; non-owner UPDATE allowed. Query returned `fixture_assertions_passed`, PostgreSQL `17.11`. Transaction ended with `ROLLBACK`. Frozen original source file was **not** changed.

## Limits
This verifies only the isolated fixture trigger. Actual PHALANX GOD principal, auth.users, management API, service-role, RLS, real module access and infrastructure recovery are **NOT TESTED**. No production integration/release authorized.

## Follow-up
Propose a reviewed patch to the original fixture on a separate work branch; do not alter the frozen governance source without explicit approval.

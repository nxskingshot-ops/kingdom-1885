# PHALANX Access V2 – security release gate 2026-11-09

Isolated project `yuyvmbdybwpwpqsipfjt`; production not modified.

## Verified permissions
Read-only `pg_proc` inspection confirms all four sensitive functions `phx_approve_registration_with_role_v2`, `phx_list_app_members_v2`, `phx_review_registration`, and `phx_set_app_role_v2` have `anon EXECUTE=false`, `authenticated EXECUTE=true`. Each requires server-side identity/authorization; tests already verified denial for nonadmin and positive rollback-only grants.

## Supabase advisor
Security advisor flags four authenticated-callable SECURITY DEFINER functions as WARN. This is expected for privileged authenticated RPCs but warrants review of each function's authorization and SQLSTATE on all negative paths. Advisor also reports leaked-password protection disabled and several RLS-without-policy tables (mostly intentionally private). Review individually; no blanket grant or RLS relaxation.

Reference:
https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## Release blockers
1. Real browser approval with a separate dedicated test account: NOT TESTED.
2. Role editor browser mutation: NOT TESTED.
3. Existing PHALANX module access enforcement using new `phx_app_roles`: NOT VERIFIED.
4. GOD owner protection on server-side role mutation: NOT VERIFIED.
5. Full rollback restoration: NOT TESTED; transaction rollback only was verified.
6. Production release: NOT AUTHORIZED by this isolated test scope.

No security settings, permissions, data or production app changed by this audit.

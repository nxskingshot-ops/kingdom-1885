# Edge Function authorization verification plan

Status: **NOT TESTED**. Static inspection only. Do not run negative tests against production.

## Functions with `verify_jwt=false`
- `kvk-sync`
- `outpost-sync`
- `outpost-editor`
- `verified-outpost-sync`
- `phalanx-mightpulse-scheduled`

## Review and test requirements
For each function in an isolated Supabase test project:
1. Inspect all request paths and middleware, including OPTIONS/preflight and error handling.
2. Confirm which credential or user identity is required, and ensure verification happens **before** privileged actions.
3. Test requests with no credential, invalid credential, expired/revoked credential, and a correctly authorized credential.
4. Confirm unauthorized calls cause no database changes, no outbound webhook calls, and no scheduled side effects.
5. Verify allowed HTTP methods, CORS behavior, and error responses.
6. Review logs for accidental token, password, API-key, or service-role disclosure.
7. Preserve the deployed JWT setting in any isolated restore; do not change production configuration during audit.

## Notes from limited static pattern checks
- `outpost-editor`: a call to `auth.getUser` and role-related checks were detected; actual enforcement remains unverified.
- `outpost-sync` and `verified-outpost-sync`: secret-comparison patterns detected; actual enforcement remains unverified.
- `kvk-sync`: a configured webhook-token variable was detected, but the simple secret-comparison pattern did not match; **manual inspection is a priority**. This is not proof of missing authentication.
- `phalanx-mightpulse-scheduled`: authorization-related code and a 401 response pattern detected; actual enforcement remains unverified.

## Exit criteria
All five functions pass authorization/denial tests in an isolated environment, with recorded evidence and no production impact.

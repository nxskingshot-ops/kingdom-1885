# PHALANX Transfer Registration — isolated verification 2026-11-08

## Scope
Frozen Queen An staging: stage/transfer-live-rankings-20261103 — UNCHANGED.
Frozen backup: backup/phalanx-an-frozen-20261108 — UNCHANGED.
Registration handler added ONLY in lab/pylon-ix-v3-20261108 at deploy/phalanx-kvk-test/pylon-ix/transfer-register.js, blob 67de3cd636191807fb188ecf3183c05f375af491.

## Root-cause evidence
Frozen HTML transfer-register.html references ./transfer-register.js, but GitHub fetch for that path returned NOT_FOUND on both frozen staging and backup branches. This establishes missing GitHub source, NOT that the currently published Cloudflare artifact has the same missing file.

## Verified
- 8 static source checks passed: JavaScript syntax, auth.signUp, no role/membership writes, player ID only in user metadata, password validation, no password persistence, existing publishable client key, approval messaging.
- 7 direct V8 mock-DOM function checks passed on the actual lab source: signUp invocation, approval messaging, password clearing, no role assignment, player ID metadata, invalid password blocked, invalid player ID blocked.
- The first mock harness attempt had 3/6 passes because of an incorrectly replaced dynamic import in the TEST HARNESS; corrected harness passed 7/7. No code change was needed.
- No real account was created or modified.

## Not tested / blockers
- Live HTTPS registration endpoint: unavailable through available web access (web open failed; container DNS lookup failed).
- Android browser, Supabase real signUp flow, email confirmation, password recovery, RLS, membership approval and login after approval: NOT TESTED.
- No Cloudflare deployment or live promotion; no evidence of published code parity.
- No database backup or restore validation conducted in this task.
- No Auth account deletions, no role changes, no data migrations.

## Release gate
Before inviting An to register again, verify the actual published /pylon-ix/transfer-register.js responds successfully, deploy only the reviewed isolated fix after checking Cloudflare Pages target/build, then test real signup with a dedicated authorized test account and confirm approval gating and login. Do not create a privileged role from unverified Kingshot Player ID.

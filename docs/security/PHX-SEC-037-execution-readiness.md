# PHX-SEC-037: execution readiness decision

Date: 2026-10-19
Authorization: user approved a controlled encrypted backup of 26 existing Edge Functions using existing private storage only, without new costs, permission changes, production restore, deployment or merge.

## Confirmed
- Supabase read-only inventory: 26 ACTIVE functions, 26 distinct slugs, 26 versions and 26 bundle digests.
- Offline GitHub CI run 39318748573 passed.
- Existing database workflow references private Backblaze B2 storage, but does not back up Edge Function source.
- Main-branch Edge Function workflow still downloads live source and can push it into Git. Do not run.
- Draft PR #37 replaces that workflow with a safety hold; this is not a functioning encrypted backup.

## Execution blockers
1. No verified safe runner currently combines private source retrieval, maintained secret scanning, authenticated encryption, private B2 upload, remote checksum readback and offline recovery verification.
2. The available chat tools can list and retrieve Supabase functions but cannot securely write encrypted archives into the existing B2 bucket.
3. No evidence that the existing B2 credentials can write to a separate Edge Function prefix within the current permission and cost limits.
4. Recovery-key custody and safe rotation are not verified.
5. Draft PR changes cannot be treated as live on main without a separately authorized merge.

## Safe continuation
- Build and review a complete single-run workflow in the isolated branch.
- Require a real, version-pinned secret scanner and a separate encrypted archive key.
- Validate it without live credentials first, then confirm B2 permissions and no added costs before any live execution.
- Run live source backup only from an approved safe workflow. Compare all 26 slugs/versions/digests; verify remote ciphertext checksum and offline decrypt; report only sanitized counts and checks.
- Do not merge or deploy under the current authorization.

Decision: NOT READY FOR LIVE EXECUTION. Authorization is recorded but is not a substitute for the missing safety prerequisites.

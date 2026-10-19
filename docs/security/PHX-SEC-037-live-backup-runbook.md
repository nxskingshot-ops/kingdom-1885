# PHX-SEC-037 – Edge Function encrypted backup runbook (isolated implementation contract)

**Status:** execution specification, not a completed backup. Do not execute the unsafe main-branch workflow.

## Fixed inputs and boundaries
- Supabase project: `hcjrdofkdkasznywvcxo`.
- 26 active Edge Functions verified individually, one nonempty source file each, version and bundle digest matching list output.
- Existing private B2 bucket: `nexus-phalanx-backup`; endpoint `https://s3.eu-central-003.backblazeb2.com`.
- New object prefix only: `edge-functions/encrypted/`. Never write to `postgres/daily/`.
- Run from isolated reviewed GitHub Actions workflow with `contents: read`, `persist-credentials: false`, no artifacts, no commits, no push, no deployments, no production restore.
- Required existing credentials: `SUPABASE_ACCESS_TOKEN`, `B2_KEY_ID`, `B2_APPLICATION_KEY`. Recovery encryption must use a **separate** restricted secret; do not assume database encryption passphrase is suitable or authorized.
- Do not create or rotate keys, modify bucket policies, or start billable infrastructure without explicit approval.

## Single-run algorithm
1. Fail closed unless all prerequisites and existing storage permissions have been verified. Use `umask 077`, an ephemeral runner directory and trap cleanup.
2. Fetch current Supabase function inventory, require exactly 26 distinct active slugs, store slug/version/deployment digest in a local manifest. Reject mismatch against the approved inventory and stop; do not silently skip or overwrite.
3. Download each deployed source into the ephemeral directory using the authenticated CLI. Reject empty files, symlinks, absolute/parent paths, unexpected extra slugs and incomplete downloads. Compare exact 26/26 inventory, not merely total count.
4. Run a pinned maintained secret scanner in offline mode; treat tool absence, scanner failure or detected credentials as a hard stop. Suppress raw matches and source snippets from logs.
5. Construct deterministic manifest with per-file SHA-256, function slug/version and deployment bundle digest. Note bundle digest is not equivalent to source hash.
6. Package manifest and sources locally. Encrypt with authenticated AES-256-GCM using an independently recoverable encryption key; never upload plaintext, never expose key, nonce or source in logs.
7. Check existing B2 bucket/prefix permissions read-only before writing. Stop if the permission/cost boundary cannot be established. Upload only encrypted ciphertext and its nonsecret checksum to `edge-functions/encrypted/`.
8. Download the uploaded ciphertext into a fresh temporary directory; compare SHA-256 to local ciphertext; authenticate/decrypt locally; validate every file hash, slug and version against the manifest. Do not run or deploy recovered code.
9. Delete ephemeral plaintext and recovered files. Report only timestamp, count, remote object key, ciphertext digest and sanitized PASS/FAIL gates.
10. A backup is accepted only if the remote encrypted readback and isolated decrypt verification both pass. A successful upload alone is insufficient.

## Current gate status
- Read-only source parity: PASS (26/26).
- Synthetic security and encrypted storage tests: PASS (GitHub Actions 39318748573).
- Safe executable live runner: NOT IMPLEMENTED.
- Independent recovery key custody: NOT VERIFIED.
- Existing B2 prefix write permission and cost boundary: NOT VERIFIED.
- Remote encrypted object: NOT CREATED.
- Isolated real-archive recovery: NOT EXECUTED.

## Explicitly forbidden
- Running the old main workflow.
- Writing raw sources to Git, GitHub artifacts, workflow logs or public URLs.
- Using the database passphrase as a newly approved Edge Function recovery key by assumption.
- Merging PR #37, changing production configuration or permissions, deploying functions or performing production restore.

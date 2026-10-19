# PHX-SEC-037: private backup integration gates

Date: 2026-10-19
Status: integration checklist; no live archival or restore.

## Verified
- Draft PR #37 contains the isolated safety hold and offline fixtures.
- GitHub Actions run 39318135578 completed successfully with both synthetic test suites.
- No production Edge Function source or backup encryption key was used in these tests.

## Preconditions for existing private backup storage
1. Confirm the existing Backblaze B2 destination is private and accepts an encrypted archive without any new billable resource or permission change.
2. Verify a dedicated least-privilege upload credential already exists; never place it in the repository, logs or test fixtures.
3. Specify independent key custody and recovery procedure. Losing the encryption key makes the archive unrecoverable.
4. Record the full live function inventory immediately before download, including slug, version and bundle digest.
5. Require an exact inventory match and maintained secret scanner success before archive promotion. The regex preflight is only defense in depth.
6. Upload only authenticated ciphertext; store the checksum and metadata in a separately validated manifest. Never upload plaintext source or raw scanner reports.
7. Read back the ciphertext and compare its SHA-256; perform an offline decryption and integrity test with disposable data before handling production source.
8. Keep a retention and deletion policy and test a recovery drill without deploying anything.

## Explicitly not proven
- Full live inventory parity, successful production-source retrieval, safe secret-scanner integration, encrypted offsite upload, remote readback, independent recovery-key availability, or full restore.
- No approval exists for running the legacy main-branch Edge Function backup workflow.
- The safety hold in PR #37 is not active on main until a separately authorized merge.

## Go/no-go
Do not enable live archival or merge the safety hold until security review and explicit approval. A green synthetic CI run is necessary but not sufficient for disaster-recovery readiness.

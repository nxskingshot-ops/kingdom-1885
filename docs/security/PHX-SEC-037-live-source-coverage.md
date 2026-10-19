# PHX-SEC-037 – Live read-only source coverage

Date: 2026-10-19
Scope: read-only Supabase Edge Function retrieval; **no archive persisted**.

- Queried the project function inventory: 26 ACTIVE functions with 26 unique slugs.
- Retrieved each function individually in three batches (8 + 8 + 10).
- Each response contained exactly one nonempty source file.
- All 26 returned deployed versions matched the list inventory.
- All 26 returned deployment bundle digests matched the list inventory.
- No retrieval errors.
- Source contents are deliberately **not** committed, logged or attached to this report.
- This establishes retrieval parity only, **not** independent source integrity against a known-good original, encrypted storage, remote readback, or recoverability.

## Remaining blocking acceptance gates
1. Safe complete backup workflow must be implemented and independently reviewed.
2. Maintained secret scanner must fail closed without exposing matches in logs.
3. Separately controlled authenticated encryption and recoverable key custody.
4. Existing private B2 permissions and cost limits verified without changing permissions.
5. Encrypted archive uploaded and independently downloaded, checksum verified.
6. Isolated decryption and exact 26/26 source-file recovery verified.
7. No merge, deployment or production restore without separate authorization.

Do not run the original main-branch Edge Function backup workflow: it can push source into Git.

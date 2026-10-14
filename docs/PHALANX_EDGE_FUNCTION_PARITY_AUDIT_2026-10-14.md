# PHALANX Edge Function source parity audit — 2026-10-14

## Result
**FAIL / recovery gap found.**

The live Supabase project currently reports 24 ACTIVE Edge Functions. The recursive GitHub main-branch tree was checked for durable Edge Function source directories/files and for the live function slugs.

GitHub currently contains PHALANX/MightPulse frontend/staging assets such as:
- staging/phalanx-mightpulse-manual-refresh.js
- preview/phalanx-mightpulse-refresh-test-20261014.html
- preview/phalanx-mightpulse-value-diff-auth-test-20261014.html
- preview/phalanx-kingdom-scout-report-v1-20261014.html

However, the repository tree does **not** currently contain a Supabase Edge Function source tree corresponding to the live deployed functions. Therefore GitHub cannot yet be considered a complete source-level disaster-recovery copy of the Supabase Edge Functions.

## Live functions requiring source preservation
kvk-sync v4
outpost-sync v4
outpost-editor v6
nxs-guest-setup v5
nexus-feedback v3
nexus-true-power v6
nexus-access-review v6
verified-outpost-sync v3
mightpulse-ranking-test v2
mightpulse-ranking-audit v3
mightpulse-ranking-identity-audit v2
mightpulse-board-coverage-audit v2
mightpulse-coverage-round2-fixed v2
mightpulse-freshness-quality-audit v2
mightpulse-quality-batch-audit v2
mightpulse-quality-batch-4-7 v2
mightpulse-quality-overview-16 v5
mightpulse-alliance-schema-diagnostic v2
mightpulse-kills-diagnostic v3
phalanx-mightpulse-poll v7
phalanx-mightpulse-status v4
phalanx-mightpulse-scheduled v2
phalanx-mightpulse-value-diff-test v2
phalanx-kingdom-1913-scout-test v2
phalanx-kingdom-scout-report-test v3

## Safety rule
Do not commit Supabase secret values, API keys, database passwords, backup passphrases, or GitHub secret values. Function source may reference environment-variable names only.

## Recommended remediation
Export/fetch the current deployed source of each live function through the authenticated Supabase management interface, inspect for accidental hard-coded credentials, then commit sanitized source under a dedicated recovery/source directory. Record live version + deployment SHA alongside each source snapshot. Finally compare the preserved source hashes with the live deployment inventory where a comparable hash is available.

Until that is complete, database recovery is tested, but full PHALANX project disaster recovery is **not yet complete**.

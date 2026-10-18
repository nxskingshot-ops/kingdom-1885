# Alpha CI verification status — 2026-10-18

Branch: `alpha/android-integrated-freeze-20261017`.

## Confirmed
- Workflow definition committed: `.github/workflows/phalanx-alpha-canonical-integrity-20261018.yml`, commit `4cbad981c859748bfe246b77441e5abc90fdda09`.
- Guard script committed: `scripts/phalanx-alpha-canonical-guard-20261018.mjs`, commit `f059710ffc8b1f3765e7330d4aefa5bd7cdc163b`.
- Canonical lock records SHA256 `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d` and 1105961 bytes.
- GitHub fetch confirms the canonical preview path exists but returns an empty content payload for this large file.

## NOT confirmed
- No successful GitHub Actions run can be established. Commit-workflow-runs API returned no PR-triggered runs, and combined commit statuses returned no statuses. These APIs do not establish that a push-triggered run never occurred.
- The guard script has not been executed in a verified checkout.
- The canonical preview bytes have not been independently hashed in this check.
- No branch protection or required-check policy has been verified.

## Safety rule
Do not mark CI GREEN until the named job completes successfully and the checked-out canonical preview SHA256 equals the frozen original. Never replace the original with a smaller or historical map to make a test pass.

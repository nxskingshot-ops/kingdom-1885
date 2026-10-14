# PHALANX STRATEGY FREEZE — 2026-10-14

**Owner decision: FREEZE.** Preserve this product direction until the owner explicitly changes it.

## Release strategy
- **V1:** Free, stable NEXUS PHALANX for Kingdom #1885. Target zero recurring cost with up to 300 registered users; capacity and cost must be verified by load tests, not assumed.
- **V2:** Architecture capable of multiple kingdoms and alliances with strict tenant separation. No cross-kingdom access to private strategy data. Personal profiles remain portable across kingdom transfers.
- **V3:** Commercial licensing or premium access is a **future option only if demand develops**, subject to explicit owner approval and legal/third-party API review. No payment gates or billing features now.
- **Personal data:** binding Hybrid / Local First decision. On-device data, free export/import, optional Google Drive, Supabase for auth and shared intelligence.
- **Design:** Existing approved portrait fantasy/gold/glow PHALANX UI is frozen. No redesign, hamburger menu or production/main changes without explicit approval.
- **Operations:** work on isolated development branch; no production schema changes, deployments, third-party uploads or paid upgrades without approval.
- **V1 release gate:** RLS/privacy, Android PWA, offline/export/import, data integrity, 300-concurrent-user load simulation, cost monitoring and explicit owner GO.

**FREEZE means scope and strategy approval, not proof of readiness or authorization to deploy.**

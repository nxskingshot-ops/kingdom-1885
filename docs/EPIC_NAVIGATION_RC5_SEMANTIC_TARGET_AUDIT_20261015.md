# RC5 module target semantic and dependency audit — 2026-10-15

Scope: seven remaining unique destinations on isolated integration branch. Static source inspection only; no production writes, no authentication or functional runtime assertions.

| Target | Observed source title | Integration concern |
| --- | --- | --- |
| preview/nexus-phalanx-command-center-alpha28-local-pair-test-2026-10-13.html | NEXUS PHALANX — Alpha28 Local Pair Test | Explicit alpha test; screenshot confirms user can open, not frozen final dashboard |
| preview/kvk-prep-five-contrast-v13.html | Nexus · NXS KvK Prep Dashboard | Contains 05–10 Oct 2026 prep guide; verify freshness and authenticated data paths |
| preview/kvk-enemy-1913.html | KvK Comparison · #1885 vs #1913 | Shared by Opponent and Threat Intelligence; distinct intent not yet validated |
| preview/nexus-phalanx-battle-readiness-verified-status-test-2026-10-12.html | Nexus App — KvK Command | Uses Supabase and localStorage; requires auth-safe runtime check |
| preview/outpost-editor-v5.html | NXS · Outpost Editor | Explicit R4/Admin access; not equivalent to public read-only Outpost Details |
| preview/kingdom-hub-trends-v8.html | Nexus · NXS · Transfer Scouting Compare Demo | Candidate Board points to demo, not verified production board |
| preview/hero-intelligence-evidence-advisor-v15-2026-10-12.html | NEXUS PHALANX · Hero Intelligence v15 | Candidate for focused feature verification |

Local dependency existence checks passed: preview/outpost-editor-v5.js, preview/kingdom-hub-scouting-v6.html, preview/for-an.html, preview/transfer-scouting-demo-v5.html, preview/transfer-scouting-live.html, preview/alliance-trends-v3.html, pwa-update.js, nexus-app-2.webmanifest, nexus.webmanifest.

Recommendation: preserve frozen navigation and status distinctions; do not promote preview/candidate to integrated based on existence or HTTP 200. Next verify correct destination semantics, freshness, access control and functional flows per module. GitHub Actions isolated offline smoke #8 was green per user screenshot, but that test does not establish final integration.

# Alpha HOME byte-integrity verification (2026-10-17)

Verified against original ChatGPT Library raw files:
- `NEXUS_PHALANX_HOME_ORIGINAL_2026-10-11.html`: 435650 bytes, SHA-256 `f8e8a4c4a61cdaf89b9b6de8a8c8c906c0cace084e9b54ae6ac5ed4b90fa8031` — PASS.
- `NEXUS_PHALANX_HOME_APPROVED_ALPHA12_2026-10-12.html`: 436149 bytes, SHA-256 `489aa01b8124d603fa73d2472cf3ac46be8488566c2761e75a1ca50349e8b798` — PASS.

The approved Alpha12 HTML fetches `https://raw.githubusercontent.com/nxskingshot-ops/kingdom-1885/main/preview/nexus-app-2-command-center-portrait-final-polish-test.html` at runtime. Therefore the approved HTML alone is NOT a hermetic offline bundle, and main-dependency drift must be eliminated only in a derived copy without changing the frozen original.

The current `preview/phalanx-alpha-android-integration-20261017.html` is a **temporary integration harness**, not a frozen-design final app. Its HOME route points to archival 11-Oct HTML rather than approved Alpha12; its navigation route points to an older sandbox rather than RC5. Both are open integration blockers. No Android acceptance or Cloudflare publication has occurred.

Next required implementation: add an immutable approved Alpha12 asset to the isolated branch; make a separate, clearly derived runtime copy with pinned local dependency; identify actual RC5 source path; connect War Room using only approved design; run mobile regression and auth checks. Never silently mark these gates complete.

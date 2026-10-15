# PHALANX HOME → MightPulse / Alpha35 navigation audit
Date: 2026-10-15. Read-only repository inspection. No production changes.

## Authoritative references
- HOME: `backups/NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html` (repository copy) and user Library original, expected SHA-256 `f8e8a4c4a61cdaf89b9b6de8a8c8c906c0cace084e9b54ae6ac5ed4b90fa8031`. The GitHub file's byte-for-byte SHA-256 has **not** been independently confirmed in this audit.
- Alpha35 function freeze: expected SHA-256 `22336f5ec5cd438b1dbf3058f3820d4038df5f3e8f94061d8f15932cc74fc6ba`, 1,912,593 bytes, stored in ChatGPT Library; do not replace with earlier Alpha versions.
- MightPulse Android menu/back test: `preview/phalanx-command-center-mightpulse-menu-test-20261014.html`; this starts from an older Command Center, **not** canonical HOME.
- Older `preview/nexus-phalanx-navigation-sandbox-2026-10-12.html` also defaults to the older KvK Command Center; **not** a release entrypoint.

## Critical integration findings
1. The GitHub HOME wrapper dynamically fetches `preview/nexus-app-2-command-center-portrait-final-polish-test.html` from the current GitHub main branch. This is a reproducibility/offline drift risk. Pin a tested dependency in a derived, isolated candidate, without changing the frozen master.
2. The GitHub HOME copy does not directly contain the word `mightpulse`; this alone does not prove MightPulse cannot be reached through dynamic content.
3. The MightPulse menu test includes its own modal/panel and back control. Do not paste that entire HTML as the new HOME or create a new top-level integration landing page.
4. The Android-verified Alpha35 navigation must be reused from its actual frozen artifact, not recreated from memory.
5. A successful Supabase cron run and 16/16 structural checks do not prove the game values are accurate or fresh.

## Release candidate acceptance sequence
- Compare original Library HOME SHA-256 and Alpha35 SHA-256 to source bytes before integration.
- Derived RC opens directly to canonical HOME in Android portrait with unchanged header, branding, cards, and layout.
- Existing HOME navigation opens MightPulse, then returns to exactly the same HOME state without extra landing screen.
- Existing HOME navigation opens the byte-verified Alpha35 map; its filter/zoom/return controls remain functional.
- Session expiry, unauthenticated access, loading, network failures and stale timestamps are visible and safe.
- Verify no untrusted MightPulse or opponent values are inserted using raw HTML string concatenation.
- Check offline startup and update flow with pinned assets; do not change manifests/service worker without migration test.
- Owner explicitly approves any merge/deployment; leave production and freezes untouched.

## Current decision
BLOCKED for final RC assembly until byte-verified frozen Alpha35 artifact is available to the build and HOME original SHA-256 is verified. No approximation or restyling is authorized.

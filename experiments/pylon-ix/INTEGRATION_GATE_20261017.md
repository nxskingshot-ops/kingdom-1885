# PYLON IX – isolated browser and module integration gate

Status: static review completed; live browser test and integration not yet verified.
Branch: `test/pylon-ix-offline-contract-20261017`.

## Confirmed interfaces
- `experiments/pylon-ix/pylon-core.js` exports `askPylon(question, {language})`, `MODULES` and `PYLON_BRAND`.
- The preview `experiments/pylon-ix/index.html` imports that core as an ES module, exposes DE/EN/FR, and uses `textContent` for responses (not untrusted HTML injection).
- PHALANX's isolated i18n foundation exports `resolveLanguage`, `languages` and `translate`. PYLON currently has its own localized response dictionary and does not yet consume PHALANX's active language selection.
- The module keys (`hero-calculator`, `kvk-prep`, `account-intelligence`, `alliance-comparison`) are **semantic identifiers**, not verified navigable URLs. Do not turn them into links before inspecting actual navigation contracts.

## Required browser smoke checks
1. Open isolated PYLON preview via local HTTP server (not file://), confirm module import and no console errors.
2. Open/close concept tile using keyboard and touch; verify focus visibility and responsive width.
3. For DE, EN and FR: greeting, four preset actions, manual text entry, Enter key, unknown intent and language switching.
4. Confirm output is text-only; no network calls, no local storage, no cookies, no external API or personal-data upload.
5. Verify small Android viewport and accessibility labels. Existing HOME/Header/Nav FREEZEs must not change.

## Integration gate
- Map semantic module identifiers to existing reviewed PHALANX routes.
- Read the actual application language state; avoid a second independent language preference.
- Attach PYLON contextually in WAR ROOM, hero, KvK and alliance screens **only after** a freeze-conflict review.
- Import approved original visual asset with provenance; do not invent/regenerate it.
- No production credentials in public preview. No Supabase writes, main merge or deployment.

## Security and release
- Node offline contract tests and GitHub workflow are separate from browser tests.
- Backend authorization, deployed artifact parity and restorable offsite backup remain independent release blockers.

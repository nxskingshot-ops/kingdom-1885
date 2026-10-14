# RC9 dependency and release-boundary audit — 2026-10-14

Scope: read-only GitHub source inspection. No browser or Android execution performed.

## Verified source chain
1. `preview/phalanx-home-auth-rc9-20261014.html` fetches a pinned raw GitHub file at commit `4d710903700ea27208b591180420c89cc9df9faa`: `backups/NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html`.
2. The frozen wrapper in turn fetches `preview/nexus-app-2-command-center-portrait-final-polish-test.html` from **main**, not a pinned commit.
3. The RC9 wrapper uses exact text replacement for one signed-in marker and injects a session verifier before `function translateHome(){`. Both markers occur once in the current frozen wrapper.
4. The command-center HTML exists on main and contains 36 `<button` tags, but no literal Top-40/top40 text. This does not establish button function; Top-40 may live in another loaded module.
5. `index.html` on main returns zero text through GitHub fetch. Production artifact equivalence remains unverified.

## Findings
- **P0 – mutable transitive dependency**: RC9 pins the outer wrapper but the wrapper fetches an inner HTML file from mutable `main`. Therefore RC9 is not a reproducible immutable preview.
- **P0 – runtime-only patching**: RC9 does not change the production build; success in RC9 cannot certify production access.
- **P1 – fragile integration**: RC9 requires exact source text markers; a source change can cause a loading failure.
- **P1 – external dependency**: loading requires GitHub raw access and a third-party Supabase JS CDN; failures must be tested on Android.
- **P1 – auth semantics**: the client verifies membership and shows the first active role; role rendering is not a server-side permission test.

## Safe acceptance checks
- Pin **all** nested source dependencies to an audited immutable revision in a new isolated candidate; do not alter the frozen reference.
- Compare loaded DOM/layout against the frozen baseline in Android portrait.
- Test signed-out, active admin, expired membership, network outage, and rejected read permissions.
- Trace Top-40 actual click handler in its owning module; do not infer from labels alone.
- No merge or production deployment without explicit user approval.

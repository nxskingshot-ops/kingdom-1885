# PHX OUT-024 B003 — integrity test (2026-10-21)

Status: **STATICALLY TESTED**, not browser-tested, Android-tested, released, or deployed.

Local artifact: `PHX-TERRITORY-OUTPOST-ALPHA24-ISOLATED-B003-20261021.html`.
SHA-256 of local B003 file: `9a875d44a704c2930534a7f2b632582dfee70ee735d2eeee2c21d4a888f4abd0`.

Verified via Python standard-library script against independently recovered frozen original `PHX-OUT-024-MAP2-FROZEN-20261018.html`:
- Frozen original SHA-256: `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`.
- Embedded base64-decoded map **byte-identical** to frozen original.
- Exactly one map embedding in B003.
- Source contains map button, map view, back button, frame, pushState/popstate hooks, disabled Reports button.
- No `allow-top-navigation` iframe permission.

Limitations: source-presence checks do not prove functioning navigation. Browser attempt previously returned `ERR_BLOCKED_BY_ADMINISTRATOR` on loopback; no Android/device acceptance. B003 full HTML has not been archived to GitHub. Current HOME bridge is in Library but raw materialization denied. Do not represent the current shell as final HOME, nor link older HOME in place of the 21 Oct FREEZE. No production/main/deploy/security/cost changes.

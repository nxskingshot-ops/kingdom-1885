# PHALANX AUTOPILOT execution rule — 2026-10-17

## Operating agreement
- Continue sequential technical steps autonomously within the active working session; no repeated "Go" requests.
- Inspect real GitHub sources and current branches before modifying code.
- Preserve all approved design FREEZEs and working features; avoid regression and reimplementation.
- Work only on isolated alpha development branch; never merge into main, change production, modify Supabase live data, change permissions, or incur costs without explicit approval.
- Distinguish planned, implemented, technically tested, user-confirmed, and deployed.
- Perform available code, dependency, routing, regression and preview checks independently.
- Request user input only for genuine decisions, missing permissions, or manual device tests. When requesting, specify action, reason, and link.
- Do not claim autonomous background execution between conversation turns.
- Password recovery is user-confirmed functional; show-password and confirmation field are deferred non-release-critical tasks.
- Security, backups, auth/RLS and release gates remain open.
- Target: first connected Android-usable alpha with approved HOME, RC5 Epic Navigation, War Room, Command Center, existing modules and PYLON IX original artwork.
- The current isolated alpha shell is an intermediate technical artifact, not a validated or published unified alpha.

# PHX-INT001 B003 Chromium smoke — 2026-10-21

Status: TECHNICALLY TESTED (shell navigation only). Not Android/device tested; not released.

Tested original local B003 SHA256 `9a875d44a704c2930534a7f2b632582dfee70ee735d2eeee2c21d4a888f4abd0` using headless Chromium and Playwright `page.set_content` at 390x844.

PASS: hub initially visible; Reports button disabled; map button reveals map screen and hash `#outpost-map`; back returns to hub; no top-level JS errors.

LIMIT: embedded map iframe was not confirmed loaded in the restricted browser. No map visual, data fetch, Reports behavior, 21 Oct HOME visual, permission or Android verification. Previous file/localhost browser navigation blocked by environment policy.

Do not equate this smoke test with full integrated E2E acceptance. Do not promote B003 to production or replace the existing HOME original.

# RC5 dependency audit — phase 1, batch B (2026-10-15)

Read-only inspection of the seven remaining unique linked target HTML files on GitHub default branch. This completes source-level review of 12/12 unique HTML targets (not runtime testing).

| Module | Static observations | Referenced local files |
|---|---|---|
| Command Center | fetch, location navigation; manifest and icon | nexus-app-2.webmanifest, icon-192.png confirmed |
| KvK Prep | fetch, Supabase marker, form; map scouting link | kingdom-hub-scouting-v6.html confirmed |
| KvK Enemy 1913 | fetch; no external href/src discovered | no static local file refs |
| Battle Readiness | fetch, Supabase marker, local/session storage, location navigation | nexus-app-2.webmanifest, icon-192.png confirmed |
| Outpost Editor | Supabase marker, form, map scouting and JS | kingdom-hub-scouting-v6.html and outpost-editor-v5.js confirmed |
| Kingdom Hub Trends | iframe and multiple navigation targets | nexus.webmanifest, for-an.html, kvk-prep-five-contrast-v13.html, transfer-scouting-demo-v5.html, transfer-scouting-live.html, alliance-trends-v3.html, outpost-editor-v5.html, pwa-update.js confirmed |
| Hero Intelligence | no fetch, Supabase, storage, iframe, or external href/src detected by static string scan | none identified |

All local file references identified in batch B exist in repository. icon-192.png verified using base64 fetch (UTF-8 fetch fails for binary and does not mean missing file).

Risks:
- Network and auth effects of fetch not classified as read-only.
- Multiple menus share one destination; distinct submenu behavior not verified.
- Kingdom Hub iframe interactions and Outpost injected viewer not browser tested.
- These heuristic string scans cannot prove absence of dynamic dependencies.

Next: controlled browser smoke tests, and code-level audit of network methods and side effects before allowing login/API calls. Do not touch production, original FREEZE or main.

# NEXUS PHALANX — Top-40 Integration Gate (2026-10-13)

## Verified
- GitHub Pages standalone preview `preview/phalanx-top40-v5.html` loaded 40 entries for each NXS, FRA, OoO, MYM (user screenshots).
- Incognito request returned DB error 42501 (user confirmation), no protected rows shown.
- Supabase `phalanx_alliance_latest` and `phalanx_alliance_top40` are security-invoker views; anon has no SELECT; authenticated has SELECT.
- Source tables have RLS enabled and SELECT policy calls `phalanx_can_read_alliances()` which requires active, unexpired membership with approved role.
- Backup branch: `backup/phalanx-top40-v5-working-2026-10-13`.

## Do not change
- Frozen master mobile portrait design, header, navigation, or working features.
- Never overwrite `main/index.html` without reviewing its complete source and rendering diffs.
- Do not broaden RLS grants or bypass membership checks.

## Integration plan
1. Retrieve complete current `index.html` through a method supporting large files; inspect existing PHALANX navigation and auth client.
2. Build a small isolated Top-40 component using the *existing* app Supabase client/session, without a separate `createClient` instance.
3. Add only the agreed PHALANX route/button hook; preserve all other UI exactly.
4. Ensure click status is visible before async work; show meaningful `42501`, missing-session and incomplete-snapshot errors.
5. Check all four alliances, portrait layout, login and incognito denial in a staging preview.
6. Review diff and only then request approval for merging to main.

## Current status
Integration planning branch only. No master application code changed. Full source inspection pending.

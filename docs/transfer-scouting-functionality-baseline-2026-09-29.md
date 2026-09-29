# NEXUS Transfer Scouting — protected functionality baseline

Status: staged integration only; no production switch. Date: 2026-09-29.

## Protected reference
- `preview/transfer-scouting-demo-v5.html` + `preview/transfer-scouting-demo-v5.js`: existing fictional candidate board and approved layout.
- `preview/transfer-scouting-live-v5.html` + `preview/transfer-scouting-live-v5.js`: existing protected LIVE candidate management; separate from fictional demo.
- `preview/kingdom-hub-menu-test.html`: current app routing; unchanged by this stage.

## Existing features that must continue working
| Feature | Original demo v5 | Live v5 |
| --- | --- | --- |
| Candidate list / candidate profile | Yes | Yes |
| Search / sorting | Yes | Yes |
| Candidate edit / creation | Yes (browser-only) | Yes (authorized roles) |
| Delete demo candidates | Yes | No direct delete UI |
| Fit / contact filters | Yes | Search / sort |
| Candidate selection / multi-comparison | Yes | Yes |
| CSV export | Yes | Yes |
| Role, eligibility, invitation estimate, contact status, notes | Yes | Yes (varying fields) |
| Fictional demo persistence | Browser storage | N/A |
| Protected real-candidate storage | No | Supabase RLS |
| Complete six-section profile data persistence | Not yet | Not yet |

## Isolated test stage
- `preview/transfer-scouting-integration-stage.html` and `.js` copy the original demo v5 unchanged except for a single **collapsed** details section in the existing candidate-profile sidebar and stage-specific browser storage keys.
- New read-only details expose recorded Mystic Trials if present, evidence, observation date and a limited evidence-based written overview; missing values explicitly say 'Not recorded'.
- Existing candidate-table, sorting, filters, compare, editors, delete, CSV, and pre-existing calculations are preserved by reusing the original JavaScript unchanged except stage-specific localStorage keys and the `renderIntelligence()` call.
- No real player data, Supabase calls, route changes, schema changes, or live data writes. Only locally fictional records.

## Manual acceptance checklist (before touching the live app)
1. Open stage in portrait and landscape. Compare appearance with original demo v5; confirm no unintended layout changes.
2. Search and change sorting/filters; select a player.
3. Expand Player Intelligence; check that unrecorded trial data are not fabricated.
4. Edit candidate fields; reopen profile and intelligence area, verify updated record.
5. Add a fictional candidate; delete after testing; confirm existing candidate selection still works.
6. Select two or three candidates and compare; export visible CSV.
7. Reload the stage and confirm its local edits persist *independently* of original demo browser state.
8. Verify original demo, LIVE transfer scouting, True Power and other tabs remain unchanged.

Do not merge into existing LIVE or original demo until this checklist passes on user device. Future live dossier evidence/history storage requires separate auth, privacy and RLS review.
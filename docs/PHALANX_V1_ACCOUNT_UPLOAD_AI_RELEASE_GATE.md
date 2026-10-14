# PHALANX V1 — mandatory release gate (FREEZE 2026-10-14)

**Binding user-approved scope.** Do not change frozen UI, main, production, or incur paid services without separate approval.

## First-use journey
1. Authenticate PHALANX user independently from Kingshot player ID.
2. Offer **Basic** or **Full PHALANX Profile** at onboarding; allow upgrading Basic later.
3. For Full, search Kingshot player by ID through an authorized, validated provider (MightPulse/Mighty only if API permissions, fields, rate limits and costs are verified). Show candidate identity for confirmation; ID is **not proof of ownership**.
4. Import only available, permitted fields with source and freshness labels. Never promise all heroes/troops via API.
5. Upload screenshots and battle reports, including personal hero, skills, equipment, troop and march data and battle outcomes.
6. Extract fields with confidence and source reference; present **review and correction before saving**. No silent overwrites.
7. Store confirmed records in a private, editable, deletable profile with access policies. Do not expose sensitive personal player records to alliance users without explicit sharing.
8. Connect 'Frag PHALANX' to verified profile and goal-specific tools: **'Das habe ich – das will ich'**. If data is absent/stale or combat models unverified, say so; do not fabricate damage, win odds or best builds.

## Required V1 acceptance checks
- Basic path usable without full profile; Full path can be completed even if third-party API unavailable via manual/screenshot entry.
- Search-by-ID displays matched player and requires explicit confirmation; no account takeover by ID.
- Valid upload accepted and parsed; invalid format rejected; uncertain fields highlighted; corrections persist; duplicate upload does not double-count.
- Authenticated user A cannot read/write user B's private profile, files or reports. Storage bucket policies and DB RLS tested.
- Updated hero roster, troop counts, march capacities and locks are reflected in next 'Frag PHALANX' calculation.
- Troop and hero conservation under simultaneous deployments; no invented opponent or combat data.
- First-use novice flow tested with real users; clear limitations and error states.
- API permission, retention, privacy, quotas and cost behavior documented before enabling provider integration.
- No release claim until these checks pass in deployed environment.

## Status
**SPECIFICATION ONLY**. Not proof that authentication, import, upload, parsing, private storage, or assistant integration currently works. Prior prototypes remain isolated on audit branch.

# Player identity and search — evidence checkpoint (2026-10-16)

## Verified
- Isolated Player Intelligence currently searches four embedded historical profiles by display name only. No verified game player IDs are stored in this test view.
- Repository code contains `player_id` fields in KvK warning/transfer flows and a `playerId` field in other modules. Field names alone do not establish that those values are sourced from Kingshot or MightPulse.
- MightPulse integration checkpoint reports 16/16 structurally checked ranking boards and an authenticated refresh/status test on Android on 2026-10-14. It explicitly warns that a successful poll does not imply fresh source values.
- The staged refresh module consumes aggregated status via an authenticated Supabase client. It does not establish that ranking responses expose a stable game ID.

## Unknown / release-blocking for identity linking
- Whether MightPulse ranking records expose a stable, verified Kingshot player ID, with its precise field name, type, and semantics.
- Whether IDs are stable across name/alliance changes, Kingdom transfers, and different ranking boards.
- Whether the authenticated user is authorized to claim a particular game player ID.
- Whether any ranking snapshots can be retained as an individual's longitudinal history under the project's access/privacy rules.

## Implementation contract (not yet implemented)
1. Query only approved authenticated ranking data; never embed tokens, secrets, raw private rosters, or IDs in public test HTML.
2. Search by case-insensitive name and exact player ID where the source has a **verified** ID. Display Kingdom, alliance, timestamp, and source to disambiguate.
3. If a source lacks a verified ID, show an explicitly unverified candidate; do not merge same-name records across dates, Kingdoms, or boards.
4. Require a deliberate identity-claim/verification step before attaching an in-game player profile to a PHALANX login. Never silently claim the first matching name.
5. Append a dated, source-provenance snapshot only after identity resolution and access review; keep original baselines immutable. A ranking delta requires compatible boards and timestamps.
6. Keep raw power, rank changes, and hypothetical combat outcomes separate. Rank position is not proof of a fight outcome.
7. Test duplicate names, renames, transfers, missing IDs, stale snapshots, and authorization failures in isolated staging before release.

## Next concrete verification
Inspect the **schema/field names** of an authorized, non-sensitive MightPulse ranking response or backend transformation (without copying real player records or secrets into this repository). Record whether a verified player ID is present, absent, or unknown. Until that inspection, automatic ID matching is **NOT VERIFIED**.

## Boundaries
No production deployment, RLS changes, database writes, user-account creation, or edits to frozen Epic Navigation V2 / Smart March Optimizer.

# PHALANX Smart March Optimizer — binding input-to-goal contract

Date: 2026-10-14
Status: Binding product rule; prototype specification, not live UI

## Invariant
**"Das habe ich – das will ich."** Every optimization starts with the user's verified actual resources and their explicit desired outcome. Never output a generic ratio as if it were optimal.

## Input (DAS HABE ICH)
- Timestamped troop inventory by class and tier; available, wounded, assigned, reserved; screenshot-derived values require user review.
- Per-march capacity, occupied slots, simultaneous timing constraints.
- Owned heroes, stars, skill levels, gear, eligibility, availability and user locks; stale/unverified data must be labeled.
- Relevant opponent/garrison intelligence with source and date where authorized.
- Optional spend and training limits. Do not assume user's historical snapshots are current.

## Objective (DAS WILL ICH)
- Event: bear, viking, pvp-attack, pvp-defense, kvk-rally-lead, kvk-rally-joiner, kvk-garrison, reinforcement, custom.
- Explicit measurable goal: e.g. highest verified damage, win probability (only if calibrated), least troop losses, highest verified points, specific target feasibility, or maximize available rally contribution.
- Constraints: required ratio/hero locks, max marches, preserve castle defense, reserve troops, time horizon.
- If goal is ambiguous, ask one concise clarifying question instead of assuming damage equals win chance.

## Processing
1. Validate inventory, freshness, ownership, constraints and objective.
2. Generate only feasible march/hero allocations, reconcile every troop and simultaneous hero assignment.
3. Compare alternative feasible strategies; separate exact feasibility from empirical combat performance.
4. Rank by the selected objective **only if** validated mechanics/battle reports support it. Otherwise return feasible options with 'performance unknown' and request calibration evidence.
5. Explain tradeoffs, deficits, limitations and recommended next upgrade/training step.
6. Keep user-provided locks unchanged; never claim certainty from proxy scoring.

## Worked objective: KvK rally attack
- Inventory and hero roster are inputs, not generic assumptions.
- Target may be attack damage, win probability, minimize losses, or strongest contribution as joiner. Treat these as distinct objectives.
- Include enemy intel and actual rally role if supplied; no unauthorized enemy or alliance data access.
- Output candidate formations, individual march breakdowns, leftover inventory, feasible deficits, expected outcome **only if evidenced**, and source confidence.
- If the opponent/goal is unknown, do not fabricate a matchup recommendation.

## Release gates
- Separate prototype from live app; frozen UI stays unchanged until explicit approval.
- Automated invariants: no double-counted troops, no duplicate simultaneous heroes, exact integer allocations, role-specific requirements, input validity, unknown performance represented as unknown.
- Human validation with real reports before damage or win-probability claims.

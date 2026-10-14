# Troop Planner — recovered original requirements (2026-10-14)

Source: user's saved original `PHALANX_IDEA_TROOP_RATIO_CALCULATOR_2026-10-13.md` (2026-10-13). This is a development handoff; the original remains the source of truth. **Not implemented in full.**

## Required functionality
- Screenshot-extracted troop inventory by class/tier, explicitly user-correctable; per-march capacities and roles; no troop double assignment.
- Bear: selectable Joiner only / Lead + Joiner / Lead only. For combined mode, **1 Lead + 6 Joiners = seven deployment opportunities**, each with independent capacity/ratio/heroes. Allocate Lead first and validate actual simultaneous availability/timing.
- Viking: **no advance HQ reserve**. Initially reinforce; later withdraw from existing reinforcement allocations to assemble a fixed-ratio/fixed-cap HQ march at **wave 10 OR 20**. Show before/after allocations, troop withdrawals, and timing uncertainties. Troops remaining in user's castle must be **archers only**.
- Bear heroes: locked user-selected Joiner heroes cannot be replaced automatically; select eligible strongest Lead from verified owned heroes/skills and avoid conflicting simultaneous assignments.
- Viking heroes: strongest eligible defense heroes remain in castle; assign other eligible heroes to reinforcements, preserving locks and HQ transition.
- Compare (A) more partly-filled marches, (B) fewer fuller marches, (C) mixed feasible configurations for each event. Do not call one optimal without validated damage/points evidence; never optimize an invented proxy.
- Per-march assignments, remaining inventory, deficits, feasible alternatives, source freshness, uncertainty, copyable presets. Avoid assuming hero skills or tier bonuses not verified.

## Implementation order
1. Add structured inventory + march schemas and validation.
2. Reconcile all seven Bear deployment requirements against inventory and individual caps.
3. Model Viking reinforcement -> HQ withdrawal as explicit phases, not reserve-first.
4. Add hero locks and simultaneous availability validation.
5. Compare feasible allocation strategies; only rank by verified event score/damage data.
6. Add screenshot review and authorized PHALANX assistant adapter.
7. Execute regression tests and independent numerical checks, then mobile QA.

## Status
The existing `src/phalanx-troop-allocation-v1.js` handles only integer ratio splits for **one** march. It is a low-level helper, not the planned Troop Ratio Calculator. Do not advertise it as feature completion.

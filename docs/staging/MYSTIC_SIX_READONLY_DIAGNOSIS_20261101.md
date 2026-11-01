# PHALANX Mystic Six — read-only diagnosis

This stage-only diagnostic checks whether MightyPulse exposes six individual Mystic Trial leaderboards. It performs **no database writes** and must not be deployed publicly without a reviewed authorization policy.

Expected board keys (to verify with live API): `coliseum`, `forest_of_life`, `crystal_cave`, `knowledge_nexus`, `molten_fort`, `radiant_spire`.

## Execution

Run in an authorized server environment with existing `MIGHTPULSE_API_KEY` configured. Do not paste credentials into logs, chat, commits, or client code.

```bash
node --test scripts/mystic-six-readonly.test.mjs
node scripts/mystic-six-readonly.mjs
```

The script emits metadata only (HTTP status, reported keys, captured_at, row count, identity and rank integrity), never raw player profiles or secrets. Missing or inconsistent responses block promotion to the 22-board snapshot. No score may combine mismatched source timestamps.

## Status
- Branch isolated: yes.
- Live API response: NOT TESTED.
- Database integration: NOT TESTED.
- Production unchanged.

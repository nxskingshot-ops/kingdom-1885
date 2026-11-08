# PYLON IX V3 — refinement verification 2026-11-08

## Scope
Isolated branch: lab/pylon-ix-v3-20261108. No staging, production, Supabase, or permission changes.

## Change
The "Underestimated permanent-development strength" classification now requires a documented gap of at least five rank positions between Personal Power rank and the median of available permanent-development rankings. This prevents the previous iSureHopeItDoes false-positive while retaining Psychostick0.

Code commit: 0221bbab755c4ce3b8ae5fccd02ef96395e9e2b9
Regression test additions commit: 5a694de76d79c932ed4249eca7af651c2c87baa2

## Executed checks
Fetched exact GitHub lab module blob 72a08398094c72698bd098953e064225abef8697 and fixture blob 7ffdc64e009007d5788fd21bbf5909744e11bb14, evaluated the module in a JavaScript V8 isolate, and ran 18 direct assertions: ten no-role-certification checks, five named profile checks, malformed ranks, empty data, historical timestamp. **18 passed, 0 failed**.

This was **not** the Node.js test runner. The committed test file has not been executed end-to-end in this run.

## Profiles after refinement
- Achilles: Broad elite development
- Greyjoy: Broad elite development
- Dovik: Troop-forward, uneven development
- Psychostick0: Underestimated permanent-development strength
- iSureHopeItDoes: Strong permanent-development profile
- goo 대박: Strong permanent-development profile
- Inigo Montoya: Broad elite development
- CoCo sNOW: Strong permanent-development profile
- Applerari: Troop-forward, uneven development
- KIA BONGO³: Troop-forward, uneven development

## Remaining work
- Execute committed Node test suite in CI / real checkout.
- Execute actual V2 module side by side with V3 using identical, correctly mapped inputs.
- Improve the interpretation of permanent development vs Total Power and avoid overconfident qualitative labels.
- Test current data freshness, source comparability, partial snapshots, combat evidence, browser and Android.
- No release approval or deployment. Queen An's frozen app unchanged.

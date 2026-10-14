# PHALANX — 60-second first-use acceptance test

Date: 2026-10-14. Status: release acceptance protocol, not yet executed.

## Objective
A first-time alliance member, without instructions, can ask a natural-language or keyword question and receive a useful, grounded answer within 60 seconds of opening the app.

## Test setup
Recruit at least five testers unfamiliar with PHALANX, including at least one non-officer. Test on real Android portrait devices. Do not coach. Use only authorized test accounts and non-sensitive sample data where necessary. Record time from first screen to first useful answer, task success, confusing steps, errors, and role-based access behavior.

## Scenarios
1. `Bär Ratio 6 Märsche` — obtain a valid troop calculation or one specific question about missing capacity.
2. `KvK Gegner` — retrieve a current or clearly timestamped opponent summary; avoid inventing data.
3. `Alcar oder Amadeus` — obtain a scoped hero comparison, clearly distinguishing estimates from verified mechanics.
4. `Top 40 Veränderung` — retrieve an authorized trend or clearly state insufficient history.
5. `Outposts Nord` — access only role-authorized information or receive a comprehensible access explanation.
6. Follow-up: `Und mit 50/20/30?` — preserve the active troop-calculation context.
7. Unknown request — ask a helpful clarification or offer relevant modules, without fabricated claims.

## Pass criteria
- Every tester can find the question entry point without explanation.
- At least 80% of the attempted core scenarios reach a useful, accurate response within 60 seconds; record individual failures, not just averages.
- Zero unauthorized disclosures; zero fabricated numbers presented as facts.
- Responses work on portrait screens and clearly separate concise answer from optional details.
- The frozen Command Center is not silently redesigned; new entry point needs explicit visual approval.
- The assistant must not claim ChatGPT-level free-form intelligence if only rule-based routing is implemented.

## Failure handling
If criteria fail, do not declare release-ready. Fix the observed issue in a separate branch and rerun the same scenarios plus regression tests.

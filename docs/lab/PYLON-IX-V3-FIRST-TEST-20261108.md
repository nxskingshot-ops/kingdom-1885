# PYLON IX V3 — first execution and V2/V3 review
Date: 2026-11-08
Branch: lab/pylon-ix-v3-20261108
Historical fixture: tests/fixtures/pylon-ix-v3-1913-20261004.json (10 players, #1913, 2026-10-04)

## Test execution
- Runtime: Node.js v22.16.0, isolated local copy of GitHub source and reference fixture.
- First run: 7 passed / 1 failed. Psychostick0 was classified as Broad elite development instead of Underestimated permanent-development strength because broad-elite rule took precedence.
- Fix: evaluate underestimated-strength rule first, then broad-elite.
- Second run: 8 passed / 0 failed; syntax check passed.
- Fix committed to lab only: 9c521321cc76a695904f310c096047b586ca65fa.
- GitHub-hosted CI run: NOT TESTED. The local reproduction used the same assessment logic and historical ranking values; exact GitHub file hashes were not compared against the local reproduction.

## Comparative interpretation (NOT a full V2 runtime execution)
The V2 column below is an offline approximation of the V2 kingdom-level classification using available fixture ranks. It does not execute V2 directly and cannot reproduce missing Master Power / Hero Total metrics.

| Player | V2 approximate level | V3 lab profile | Permanent coverage |
| --- | --- | --- | --- |
| goo 대박 | Strong kingdom profile | Strong permanent-development profile | 7/7 |
| Dovik | Established kingdom profile | Troop-forward, uneven development | 5/7 |
| Achilles | Strong kingdom profile | Broad elite development | 7/7 |
| Greyjoy | Strong kingdom profile | Broad elite development | 7/7 |
| Inigo Montoya | Strong kingdom profile | Broad elite development | 7/7 |
| CoCo sNOW | Strong kingdom profile | Strong permanent-development profile | 6/7 |
| Applerari | Established kingdom profile | Troop-forward, uneven development | 7/7 |
| iSureHopeItDoes | Strong kingdom profile | Underestimated permanent-development strength | 7/7 |
| Psychostick0 | Strong kingdom profile | Underestimated permanent-development strength | 7/7 |
| KIA BONGO³ | Established kingdom profile | Troop-forward, uneven development | 5/7 |

## Known weaknesses / next gates
- iSureHopeItDoes is labeled 'Development-heavy elite' in the reference, but V3 labels it 'Underestimated permanent-development strength'. The rule is too broad for this case; review against independent criteria before calling V3 superior.
- The V3 labels are heuristic and not validated ground truth; historical narrative labels must not be used as sole proof of accuracy.
- No authenticated live API test, no role certification, no browser/mobile UI test, no lab deployment, and no production merge.
- Future test should execute the actual V2 module and V3 on a common, correctly mapped dataset, not an approximate V2 proxy.
- Preserve frozen Queen An app and backup branch unchanged.

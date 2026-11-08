# PYLON IX V3 — direct source-executed V2/V3 comparison
Date: 2026-11-08
Branch: lab/pylon-ix-v3-20261108
Status: LAB ONLY; NO RELEASE

## Verified execution
Fetched both actual GitHub assessment source files and the 10-player historical fixture, and executed both assessment functions in a V8 JavaScript isolate. This is direct function execution, not a Node.js test-runner execution or browser test.

Source blobs:
- V2: dd4e449c3ed9b8fa8a2705aa7b7c6216f245f52e
- V3: 72a08398094c72698bd098953e064225abef8697
- Fixture: 7ffdc64e009007d5788fd21bbf5909744e11bb14

Mapping: hero_equip_rank -> hero_equip, research_rank -> research_power, pet_power_rank -> pet_power, troop_power_rank -> troop_power, governor_gear_rank -> gov_gear, governor_charm_rank -> gov_charm, mystic_rank -> mystic_trial. V2 Master Power and Hero Total were NOT invented. V3 uses additional Hero without Equipment rank; coverage counts are therefore not identical metrics.

| Player | V2 level / balance | V3 profile |
| --- | --- | --- |
| goo 대박 | Strong / Balanced | Strong permanent-development profile |
| Dovik | Established / Mixed development | Troop-forward, uneven development |
| Achilles | Strong / Balanced | Broad elite development |
| Greyjoy | Strong / Balanced | Broad elite development |
| Inigo Montoya | Strong / Balanced | Broad elite development |
| CoCo sNOW | Strong / Balanced | Strong permanent-development profile |
| Applerari | Established / Mixed development | Troop-forward, uneven development |
| iSureHopeItDoes | Strong / Balanced | Strong permanent-development profile |
| Psychostick0 | Strong / Balanced | Underestimated permanent-development strength |
| KIA BONGO³ | Established / Balanced | Troop-forward, uneven development |

## Interpretation and limitations
- V3 produces more descriptive labels for the historical cases, especially Dovik, Applerari and Psychostick0.
- Descriptive specificity is not independent accuracy validation. Reference labels are historical interpretations, not verified combat ground truth.
- No current player data, no cross-snapshot freshness/comparability test, no battle evidence, no browser or Android testing.
- Node test suite not yet executed through Node.js in this run.
- Frozen Queen An application, deployment, authentication, roles and data remain untouched.

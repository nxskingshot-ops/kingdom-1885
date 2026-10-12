# NEXUS PHALANX — Computational Intelligence Milestone
**Canonical project recap · 12 October 2026 · Kingdom #1885 · Creator FaQu**

> Motto: *Many paths, many strengths, one force.*
> Mission: **Win by intelligence, not just power.**
> Status: research/prototype, not released or game-calibrated. Frozen Command Center/UI must not be modified without approval.

## What we have

| Pillar | Existing work | Evidence / limitation |
| --- | --- | --- |
| Hero Intelligence | 28 heroes across Gen 1–5, 68 documented skills, 87 recorded effect rows | Counts from V13 source registry; complete independent source validation pending. 12 heroes have linked evidence. Rosa: six screenshots archived locally in V12, central skill transcription / GitHub evidence pending; DO NOT ask for reupload as if never received. |
| Hero selection and rally analysis | Alpha32 Rally Skill Selection; leader/joiner first-expedition skill selection, team-optimizer prototypes, troop ratio exploration | Model assumptions; battle calibration pending. |
| Pets, Masters & Buffs | Research schema for passives, activations, refinement, mode/duration, Valora/Cassia etc., and anti-double-counting rules | Many effects community-sourced; exact level tables, stacking and snapshot inclusion unverified. |
| Monte Carlo and uncertainty | Alpha31 Monte Carlo Lab; deterministic/conditional combat models and stochastic scenarios | Outcomes are model-dependent proxies, not verified Kingshot damage/win odds. |
| Robust team optimization | Scenario enumeration, constraint-based ranking, sensitivity, performance under alternate stacking assumptions | Policy documented; fully integrated, empirically calibrated recommendation engine NOT complete. |
| Investment and purchasing decisions | Hero Investment Lab Alpha2; 3★/4★/5★ comparisons, replacing vs keeping heroes, Gen4 vs Gen5 forward look, resource opportunity costs, F2P/Low/Mid/Whale priorities | Prototype, not verified prices or universal buying advice; investment ROI is a *model* pending accurate costs/performance data. |
| Shared Battle Readiness | Role protected shared Supabase plan, checklists, local drafts, history, plain-language save state; Android tested by creator | Database plan verified at 6/7 and revision 7 on 12 Oct 2026 (may change); normal-member end-to-end test still missing. Role changes not opened to testers. |
| Mobile Command Center | Frozen original design; working direct navigation into Rally/Monte Carlo and older app; portrait tests | Not every menu tile/module production-ready. |

## Mathematical scale (theoretical, NOT executed runs)

- Unique unordered 3-hero teams: **C(28,3) = 28! / (3!25!) = 3,276**.
- Three ordered positions: **P(28,3) = 28! / 25! = 19,656**.
- 10,000 hypothetical Monte Carlo samples per unordered team: **32,760,000** samples.
- Per ordered trio: **196,560,000** hypothetical samples.
- Six distinct marches each with 3 different heroes, without hero reuse, order **inside** each march ignored: **28! / (10! × (3!)^6) = 1,800,819,924,583,680,000**. This is a mathematical upper search space, NOT 6-game-march legality and NOT an executed enumeration; additional game constraints reduce it.
- Earlier alpha32 checkpoint **reports** 64 core Node assertions, 12 rally-selection assertions, 1,000 random cross-checks, 10,626 candidate combinations in each of two optimizers, 7/7 first-skill source match. These are archived test *claims*, not a newly observed full CI result; current GitHub Actions pass state not verified.

## What the engine should answer

1. **What is strong?** Compare heroes, expedition skills and archetypes.
2. **What works together?** Recommend compatible lead / joiner combinations within legal troop, slot, and skill constraints.
3. **When does it work?** Differentiate Bear Trap vs PvP/rallies/defense, troop ratios, buffs, pets, masters, skill conditions, effect duration.
4. **How robust is it?** Test rank stability under uncertain stacking, procs and snapshot inclusion, with sensitivity and uncertainty shown.
5. **What is worth spending on?** Evaluate marginal utility per shard/resource/cost, opportunity cost, future-generation replacements and player spending tier.

Formally, under an explicitly chosen utility and cost model:
\
\(x^* = \\arg\\max_{x\\in\\mathcal F} U(x;\\theta)\), where \\(\\mathcal F\\) is feasible builds and \\(\\theta\\) are uncertain mechanics.
Illustrative investment efficiency \\(ROI_{model}=\\Delta U/Cost\\), **not** a verified monetary return.

## Model-consistency principles and safety gates

- Deterministic arithmetic should be reproducible with identical inputs; seeded stochastic simulations reproducible with seed and full model version. Stability across assumptions is not the same as accurate game prediction.
- Apply passive/active effects only to applicable modes, actor, duration and troop type.
- Do not double count bonuses present in in-game snapshots (gear, charms, research, pets, master).
- Joiner first-expedition skills/selection and grouping are based in part on community documentation, with disputed mechanics; model alternatives rather than state absolute rules.
- Bear Hunt score bonuses are not interchangeable with damage multipliers; do not use offense model for defense.
- Release blocked pending complete verified skill/effect records, executable regression/CI review, representative in-game reports and calibrated error bars; users should see confidence/coverage rather than invented precision.
- Never imply that theoretical search-space/simulation counts were actually computed. Preserve current snapshots and historical timestamps. No production/approved design edits without permission.

## Canonical sources in repository

- `data/phalanx-source-registry-v13-2026-10-12.json`
- `data/phalanx-hero-roster-gen1-gen5-v1-2026-10-12.json`
- `data/phalanx-pets-masters-buffs-research-v1-2026-10-12.json`
- `data/phalanx-combat-modifier-engine-v1-2026-10-12.json`
- `data/phalanx-combat-qualification-v2-2026-10-12.json`
- `data/phalanx-robust-optimizer-policy-v1-2026-10-12.json`
- `data/phalanx-hero-generation-policy-2026-10-12.json`
- `data/phalanx-release-quality-gate-v1-2026-10-12.json`
- `backups/phalanx-alpha32-checkpoint-2026-10-12.json`
- `preview/phalanx-hero-investment-lab-alpha2-2026-10-12.html`
- `preview/phalanx-rally-selection-alpha32-2026-10-12.html`
- `preview/phalanx-monte-carlo-lab-alpha31-2026-10-12.html`

**Future recaps:** Read this document AND its source registers, check for newer dated versions, separate implemented & tested from planned, and state any uncertainty. Do not re-ask for already supplied hero screenshots unless original values are genuinely unavailable.

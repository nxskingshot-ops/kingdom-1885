# PHALANX Kingdom Scout — Threat Intelligence V0 (isolated draft)
Date: 2026-10-14
Scope: Kingdom #1913; no production or Alpha35 changes.

## Principle
Keep raw power potential, historical battle performance, and confidence separate. Do not infer causation from a KvK win/loss. Never equate Prep victory with Castle victory. Historic outcomes require verified source, date, opponent, Prep winner, Castle winner, attendance, and participation evidence. Unknown is not zero.

## Inputs
Current MightPulse boards: personal_power, troop_power, gov_gear, gov_charm, hero_total, pet_power, mystic_trial. Rank/score and captured_at. Player identity by uid, alliances and top100 coverage. Prior KvKs: enemy kingdom, Prep result, Castle result, turret and rally outcomes, leading-player participation, source and timestamp.

## Raw Power Threat (0–100)
Compare kingdom-level distributions (top10, top40, top100; concentrations) against #1885 *using same boards and comparable capture windows*. Draft board weights: troop_power 25%, gov_gear 20%, gov_charm 15%, hero_total 15%, pet_power 10%, mystic_trial 10%, personal_power 5%. These are heuristic starting weights, NOT validated predictions. Use normalized percentiles/relative differences, not raw-score sums across incompatible board units. Missing boards -> score unavailable or explicitly lower confidence, never silently renormalize.

## Battle Threat (separate; initially NOT numerically scored)
History: last 3–5 verified KvKs, with recency weighting (most recent highest). Distinguish Prep and Castle. Inspect participation of high-ranked players, coordination, rally/garrison effectiveness, tower control, timezone coverage, and opponent strength. Direct #1885 vs #1913 encounter receives explicit contextual treatment, but not a guaranteed repeat result. Unknown causal factors remain hypotheses.

## Risk of false confidence
Source data age != retrieval time. 100/100 quality check verifies structural integrity, not accuracy of game data. MightPulse board top100 excludes lower-ranked players. A strong whale who does not participate is not equivalent to an active whale; activity must be evidenced, not guessed. Castle win may reflect execution, attendance, time windows, transfers or resource allocation, not just power. Keep evidence and interpretations visibly separate.

## Historical evidence register (draft; requires corroboration)
Earlier PHALANX opponent notes mention #1913: Prep losses vs #1934 and #1932 while Castle held, and Prep win vs #1918 (4.33B–4.15B) followed by Castle loss. These are *historical notes awaiting independent source confirmation*, not live verified facts. The user's current statement says #1885 defeated #1913 despite apparent strength, but the exact Prep/Castle phase and causal explanation are not yet established. Do not present speculative causes as facts.

## UI design proposal
Two distinct scores: Raw Power Threat [numeric after normalization validation], Battle Threat [insufficient evidence until historic match records verified]. Third indicator Confidence [High/Medium/Low with missing-source reasons]. Four qualitative bands only after calibration. Detail drawer: verified facts, open questions, hypotheses, source timestamp, compare to #1885. 'Why did we win?' is an evidence-led explanation, not a fabricated one.

## Next isolated steps
1. Obtain/verify last KvK outcomes with source dates and phase.
2. Match historical roster and current uid where possible, detect player transfers.
3. Calculate per-board normalized distribution vs #1885 from contemporaneous source captures.
4. Validate weighting against known matches; avoid training on the same example used to judge model accuracy.
5. Implement isolated preview only after validated data contract; do not alter frozen UI, Alpha35 or production.

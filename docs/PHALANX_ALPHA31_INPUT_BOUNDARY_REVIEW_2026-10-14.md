# Alpha31 input edge-case review — 2026-10-14

Source: isolated candidate `preview/phalanx-monte-carlo-lab-alpha31-empty-input-fix-candidate-20261014.html`, SHA `64244193b518067e0c3c71899fc4ccb9ba822470`.

Verified by source inspection:
- Empty-field guard checks six inputs before numeric conversion.
- Chance bounds 0..100%, rounds 1..1000 integer, cooldown 0..1000 integer, trials 100..100000 integer, seed integer.
- No explicit `Number.isSafeInteger(seed)` validation; a very large integer-valued JavaScript Number may have lost input precision.
- HTML `step=1` for chance and `step=100` for trials are not explicitly enforced by the JavaScript click handler. This is a consistency/UX question, not automatically a correctness defect.
- No original-page Android test performed.

Recommendation: retain current isolated fix, test boundary behavior in browser, consider a safe-integer seed guard as a separate candidate only after confirming expected RNG seed semantics. Do not merge or deploy without approval.

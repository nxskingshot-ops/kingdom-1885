# RC5 navigation link audit — 2026-10-18

Read-only static inspection of `preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html` at blob `491a89a2a1ea5aa13ec6150d8f78fa8e93b6fb14`.

- Exactly **39 anchor links** were found.
- **7** point to explicit relative preview HTML paths; all seven target files exist on the alpha branch.
- **32** have `href="#"` and are explicitly annotated `aria-disabled="true"`, `data-pending="true"`, and `NOT LINKED`. This is a deliberate unlinked state in the current RC5 preview, not evidence of 32 broken working routes.
- The `Outpost Map` RC5 submenu entry is one of these 32 unlinked anchors, **despite** the approved OUT-024 map existing separately and matching its original SHA-256.
- No user-approved navigation or FREEZE was changed during this audit.

## Important limitation
The 39 anchors are not necessarily the full set of all visual navigation controls or dynamic routing. This is a static source audit only; no click-through, return-navigation or Android end-to-end tests were performed. Do not infer that all 39 are integrated or that the 32 pending routes are missing implementations.

## Required next steps
1. Map each pending RC5 navigation label to a canonical feature ID and current approved target, if any.
2. Preserve explicitly pending entries until an approved, tested target exists; do not connect legacy prototypes just to increase coverage.
3. Integrate OUT-024 only in an isolated derived candidate, not by modifying the original or existing FREEZE, and require hash/route regression tests.
4. Obtain user acceptance for any visual or navigation change before marking a route final.

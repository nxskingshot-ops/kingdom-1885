# Epic Navigation V2 – Source Inventory (2026-10-15)

## Authoritative candidate
- Library file: `NEXUS_PHALANX_Epic_Navigation_V2.html` (original, not a reconstructed mockup).
- Size: 239510 bytes.
- SHA-256: `a7f015ec6efebabc0038754b5c9f94524be7bfc1b2f6cc13b436dd905526d8f5`.
- Header in source: `EPIC NAVIGATION V2 · DESIGN FREEZE · ISOLATED PREVIEW`.
- Source inspection: 39 HTML anchors, 38 `data-unlinked="1"` markers, 1 script block.
- `KvK Prep` currently has `href="#"` and `data-unlinked="1"`; no integration is implied.

## Integration strategy (not yet implemented)
1. Preserve original file byte-for-byte as immutable reference. Verify SHA-256 after any copy.
2. Create a separate derived test file only; wire the existing `KvK Prep` entry to the already deployed `kvk-prep-v13.html` without altering its visual design.
3. Do not promote the derived file to the root or replace V1 until isolated browser comparison and FREEZE acceptance.
4. Keep authentication blocked for real credentials until backend access checks are complete.
5. No main merge, production deployment, or Supabase modifications without approval.

## Current result
Reference recovered and inspected; V2 integration not yet implemented or tested.

# OUT-024 data-source inspection — 2026-10-19

Source: frozen preview Git blob `80cb3565ac8d12ea82a425e106096091e85878e8`; original canonical lock remains authoritative.

## Observed in frozen code
- A `fetch` call reads the Supabase REST view `public_outposts_verified_20261002`.
- Query selects `id,source_key,alliance,structure_type,level,coord_x,coord_y` with `verified=eq.true`, `published=eq.true`, ordered by id.
- A publishable API key appears in client code. Do not copy it into a new adapter or document.
- The map computes quadrants using a 600/600 split:
  - x<600,y<600: Nord
  - x>=600,y<600: Ost
  - x>=600,y>=600: Süd
  - x<600,y>=600: West
- Map reports fetched data as live and builds filters from rows.
- This is evidence of an existing *read path*, NOT proof of stable API contract, RLS safety, view permission design, or report authorization.

## Critical design difference
The local Reports prototype expects `{id,alliance,quadrant}`, while the map data source provides coordinates and source_key. Any bridge must normalize and validate without altering frozen map code.

## Gate before live reports
1. Verify Supabase view read-only permissions/RLS and published/verified filters with project owner approval; do not query live endpoint merely because it is in public client code.
2. Confirm canonical source key semantics and row count; reject duplicates and out-of-range coordinates.
3. Keep a versioned adapter with provenance and stale-data labeling.
4. Do not embed, duplicate, or rotate credentials; no production write, schema change, or new cost.
5. Test with synthetic fixtures first; browser and Android tests later.

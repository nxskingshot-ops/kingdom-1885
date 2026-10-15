# RC5 Outpost Details integration decision — 2026-10-15

Decision: preserve the frozen navigation and public map. Do not route the general Outpost Details menu to the privileged outpost-editor-v5.html.

Verified from repository sources:
- preview/outpost-report-v11.html embeds ../index.html and injects preview/outpost-viewer-an-v1.js.
- The public viewer clears the embedded snapshot and fetches published rows from public_outposts_verified_20261002 using GET.
- Its redraw() function retains selected row and calls showOutpostPopup(item).
- preview/outpost-editor-v5.js uses a separate authenticated role gate and executes an UPDATE on public_outposts on form save.

Remaining before wiring:
1. Identify a deterministic public details entry point or introduce a *non-mutating* deep-link to select an outpost. Preserve the existing visual FREEZE.
2. Browser-test selection, popup, missing IDs, failed network, mobile back navigation.
3. Verify database RLS separately; a client-side role gate alone does not establish write protection.
4. Confirm the map's verified view returns intended data without exposing unpublished records.

Do not label as fully integrated until these runtime checks pass. No production modifications authorized.

# RC5 public Outpost Details — deep-link contract (isolated)

Status: design contract only; no runtime integration or production change.

## Proposed interface
- Query parameter `outpost_id` selects a published outpost by its stable public identifier, only after a successful verified-view GET.
- Never interpolate user input into a URL, SQL expression or HTML. Parse strictly and match against the fetched published dataset.
- If ID missing: display the normal read-only map without preselection.
- If ID invalid or unpublished: show a non-sensitive not-found state; never fall back to the privileged editor.
- On network failure: display a retryable read error; do not silently show stale or unpublished records.
- Back navigation must close the detail panel before leaving the PHALANX module.
- Keep portrait navigation, map appearance and all frozen assets unchanged.

## Acceptance gates
1. Determine actual published identifier field and permitted format from existing viewer/data contract.
2. Verify one known published ID and one absent ID against the verified view.
3. Browser-test Android portrait, selection, popup, back, offline and reload.
4. Confirm RLS and publication filtering server-side separately.
5. Run existing RC5 tests and CI; no deployment or merge without approval.

This document does not claim these gates passed.

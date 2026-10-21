# PHALANX TC / Truegold interpretation — confirmed user rule 2026-10-21

## Scope
- `town_center_level` is **castle/Town Center only**, not total building development.
- Other buildings can be upgrade prerequisites, but their levels must never be inferred as exact from TC.
- TG1 through TG5 each have a subprogress range 0/5 through 5/5; no progress greater than 5/5 within a tier.
- For kingdom #1885, currently do not assume tiers above TG5; treat this as a time-sensitive kingdom observation, **not** a global hardcoded ceiling.
- User-corrected mapping: numeric TC 50 => TG5 0/5; 51 => TG5 1/5; ... 55 => TG5 5/5. Accordingly TC 40 => TG3 0/5; TC 45 => TG4 0/5.
- Do not silently extrapolate below TC40 or above TC55 until the wider scale and game updates are verified.
- Preserve raw numeric TC alongside display label and captured timestamp.
- For HOME show power and TC/Truegold; kills belong in War Room, not header.
- Avatar is never fetched from external game source; manual upload or Spartan helmet default.
- Only use source data with verified UID+kingdom and capture date; don't conflate `score` from unrelated ranking boards.
- No Top-40 dependency. Use existing `phalanx_mightpulse_rank_snapshots` `town_center` board, and separately verify a suitable `personal_power` record.
- Do not claim a live API or full building assessment based on castle level.
- This note documents logic only; no app deployment, merge, or database mutation authorized.

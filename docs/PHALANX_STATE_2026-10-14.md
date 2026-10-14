# NEXUS PHALANX — State checkpoint — 2026-10-14

## Purpose
Durable checkpoint so verified work, frozen UI decisions, data-source status, and recovery setup are not lost between chats.

## Production / freeze boundaries
- Productive index.html: do not change without explicit approval.
- Frozen HOME/UI and Alpha35: do not change without explicit approval.
- Frozen Alpha35 reference: preview/phalanx-alpha35-alliance-top40-stage-v3-20261013.html
- Alpha35 reference commit: 1790e60620375a9fac369dd0b0799f1a263823bb
- PHALANX display mapping audit: data/phalanx-display-gate-check-v1-2026-10-14.json
- Mapping audit result: 18/18 verified.
- Mapping audit commit: 6b11f750e18c502218e88cdcbc23b9d4a6c77772

## Supabase / MightPulse
- Supabase project ref: hcjrdofkdkasznywvcxo
- Project: kingdom-1885-app
- MightPulse quality overview function is active.
- #1885: 16 ranking boards structurally quality-checked.
- Important: structural/API validation is not the same as independent game-truth validation.
- Never store API keys or database passwords in this document or repository.

## Kingdom Scout
- Isolated #1913 scout function tested successfully for 7 boards:
  - personal_power
  - troop_power
  - gov_gear
  - gov_charm
  - hero_total
  - pet_power
  - mystic_trial
- Generic isolated scout report function: phalanx-kingdom-scout-report-test, v2.
- Isolated preview: preview/phalanx-kingdom-scout-report-v1-20261014.html
- Preview commit: e6faec1dd08ed5ba2df2bb3e4e659e7b154e6bde
- Threat scoring is NOT finalized. Do not present provisional weights as validated.
- Future threat model must separate raw power, battle threat, Prep potential, cycle/age advantage, and confidence.
- Historical KvK claims must be corroborated before being treated as facts.

## Backup system — verified
- Private Backblaze B2 bucket: nexus-phalanx-backup
- Database backup is encrypted before upload.
- GitHub Actions credentials are stored only as repository secrets.
- Automatic workflow: .github/workflows/phalanx-db-backup.yml
- Schedule: daily.
- Daily retention policy implemented in workflow: 35 days.
- Final automatic workflow was manually test-run successfully on 2026-10-14.
- Restore validation workflow was also successfully tested read-only.
- Verified recovery chain:
  Supabase Postgres -> pg_dump -> encryption -> Backblaze B2 -> download -> checksum/integrity check -> decrypt -> pg_restore archive validation.
- Restore validation uses PostgreSQL 18 tooling.
- This proves archive readability; it is intentionally not a destructive restore into production.

## Backup coverage caveat
The PostgreSQL dump protects database schema/data. It is not by itself a complete Supabase-project backup. Code/history is in GitHub. Supabase Storage object contents, dashboard configuration, and non-exportable secrets need separate inventory/coverage where applicable.

## Security rules
- Never print, commit, or request secret values in chat/repository.
- Never use service-role credentials in browser frontend.
- Existing GitHub Actions secrets include database, B2, and backup-encryption credentials; values must remain secret.
- Do not reset the Supabase database password unless explicitly required and connection impact is understood.

## Next sensible work
1. Inventory all assets not covered by the PostgreSQL dump (Storage, project configuration, external credentials).
2. Add a concise backup/restore runbook without secrets.
3. Continue Kingdom Scout / threat-intelligence research in isolation.
4. Keep frozen UI and working production features unchanged until explicit approval.

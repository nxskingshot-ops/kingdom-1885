# PHALANX — Recovery Master Register (Start 2026-10-18)

**Purpose:** One navigational source of truth for provenance, verified source artifacts, restoration gaps and freezes. This document is an **audit index**, not a claim of complete backup or full recovery. Do not overwrite original masters, change production/main, alter Supabase data, reveal secrets or incur costs.

## Evidence labels
- **LIVE CHECKED 2026-10-18**: connector read-only inspection in this session.
- **ARCHIVED AUDIT**: documentary evidence from an earlier audit, not newly retested.
- **ORIGINAL/FREEZE**: user-approved immutable reference, not necessarily deployed.
- **GAP**: must be verified or recovered before declaring disaster recovery complete.

## Systems of record

| System | Evidence | Scope | Current status / gap |
| --- | --- | --- | --- |
| GitHub | `data/phalanx-full-repository-inventory-20261014.json` | 422 recursive entries at historical commit 0f4c963, paths and Git blob hashes | ARCHIVED AUDIT; current branches/history and changed files not yet completely re-inventoried |
| GitHub | `data/phalanx-repository-inventory-20261014.json` | 319 top-level entries in data/docs/preview | ARCHIVED AUDIT; partial directory scope |
| ChatGPT Library | `docs/assets/PHALANX_REFERENCE_IMAGE_DATABASE_2026-10-13.md` | 13 approved checksum-indexed image references, ZIP and index | ARCHIVED AUDIT; verify archive bytes/current accessibility |
| ChatGPT Library | `docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md` | Frozen HOME HTML, SHA256 f8e8a4c4… | ARCHIVED AUDIT; verify original bytes; do not substitute older KvK wrapper |
| ChatGPT Library | `docs/freezes/NEXUS-PHALANX-ALPHA35-FUNCTION-FREEZE-2026-10-13.md` | Alpha35 HTML, checksum and Android-tested map controls | ARCHIVED AUDIT; archive retrieval and integrity to verify |
| ChatGPT Library | `docs/PHALANX_BACKUP_COVERAGE_2026-10-14.md` | Project ZIP dated 13.10, external DB backup | ARCHIVED AUDIT; ZIP integrity and current B2 backups unverified |
| Supabase | project `hcjrdofkdkasznywvcxo` | 23 public tables, 26 ACTIVE Edge Functions, 52 migration records | **LIVE CHECKED 2026-10-18**; ACTIVE_HEALTHY; metadata only, no data modification |
| Backblaze B2 | `docs/PHALANX_BACKUP_COVERAGE_2026-10-14.md` | encrypted PostgreSQL backup and read-only restore test | ARCHIVED AUDIT (14.10); current backup date/restore not yet checked |
| Cloudflare Pages | B003 CI gate, `PHX-B003-BUILD-PROVENANCE.json` | isolated Android alpha | previous CI and user screenshots; current live build/URL not freshly tested |
| Design FREEZEs | HOME, Alpha35, OUT-024, Epic Navigation RC5, header/branding approvals | immutable visual/function references | Verify newest approved originals, timestamps and hashes individually |

## Live Supabase inspection (18.10.2026)

- Project `kingdom-1885-app` in `eu-central-1`: ACTIVE_HEALTHY.
- Public schema: **23 tables** (not views), including app_profiles, nxs_memberships, public_outposts, transfer_candidates, kvk_snapshots, outpost_ownership_history, nxs_battle_readiness_plans/history, phalanx_alliance_players/snapshots, phalanx_mightpulse_poll_runs/rank_snapshots.
- **26 ACTIVE Edge Functions**. The 14.10. coverage document enumerates 24 active functions (some other 14.10 records report 25); the current inventory has 26. Additional known slug: `phalanx-native-ranking-rc-test` v2. Historical inventory mismatch requires exact set reconciliation. Preserve full function version and `ezbr_sha256` hashes in a separate sanitized source manifest; fetch/inspect source before treating any as backed up.
- **52 migrations** reported by the current connector. Older documents report 53/54; investigate counting method and source differences, do not infer deleted migrations from count alone.
- Secrets and personal data must not be copied into GitHub or this audit file.

## Known source gaps and risks

1. `docs/PHALANX_EDGE_FUNCTION_PARITY_AUDIT_2026-10-14.md` reported **FAIL**: live Edge Function source not fully preserved in GitHub. This is the highest-priority recovery gap.
2. Cloudflare B003 original OUT-024 checksum locked: `data/outpost-map-alpha24-canonical-lock-20261018.json`. Do not use OUT-023 as current.
3. Historical Top40 Alliance Comparison was a screenshot-sized data sample, **not** a product ranking limit. Later 16 × Top100 ranking board coverage is documented as 14.10 snapshot; current freshness remains unverified.
4. Supabase database backup does not automatically preserve Edge Function source, project Auth settings, secrets, external image ZIPs, or Cloudflare configuration.
5. Last user-approved HOME/header/branding design from 16.10 must be reconciled with earlier 11–13.10 FREEZEs. Do not choose winners silently.

## Audit completion criteria

- Inventory all live/source locations, branches, latest versions and owners.
- Verify existence, hashes and restore accessibility of canonical originals and archives.
- Retrieve and preserve **sanitized** deployed Edge Function source with per-function version and hash; no secrets.
- Confirm current B2 backup timestamps and isolated restore test without production writes.
- Test current alpha route/function flows and freeze fidelity on Android.
- Record conflicts as decisions for user, not silent design changes.
- Produce a reproducible recovery runbook and evidence-based green/yellow/red report.

## Execution discipline
Audit is read-only for live infrastructure; only audit documents in isolated alpha branch may be updated. No release or new features until evidence is reconciled.

## Self-audit of this register (2026-10-18): NOT COMPLETE

**Finding:** This register initially omitted the existing, retrievable Library feature register. A single narrative markdown file is not sufficient as a complete, machine-verifiable project memory.

### Newly verified Library retrievals

Library folder `/NEXUS PHALANX` exists with subfolders `Assets`, `Backups`, `Data`, `Design Freeze`, `Development Tests`, `Project Management`, `Recovered Originals`. The following entries were **listed live**; listing verifies path/metadata, NOT archive contents or SHA256:

- `/NEXUS PHALANX/Project Management/NEXUS_PHALANX_FEATURE_REGISTER_2026-10-13.json`: **read and parsed successfully**, 16 modules, **74 features**, status/test/evidence fields. XLSX companion also listed. Historical status only.
- `/NEXUS PHALANX/Design Freeze/NEXUS_PHALANX_HOME_ORIGINAL_2026-10-11.html`: listed, **435650 bytes**; content hash not yet rechecked.
- `/NEXUS PHALANX/Recovered Originals/OUTPOST_MAP_ALPHA24_USER_CONFIRMED_20261018.html`: listed, **1105961 bytes**; content hash not yet rechecked.
- `/NEXUS PHALANX/Design Freeze/Zentrale Referenzbilder-Datenbank/REFERENZBILDER_FREEZE_2026-10-13.zip`: listed, **21646308 bytes**; ZIP/hash not revalidated.
- `/NEXUS PHALANX/Backups/2026-10-13 Projektstand/NEXUS_PHALANX_PROJEKT_BACKUP_2026-10-13_FINAL.zip`: listed, **15578998 bytes**; ZIP/hash not revalidated.
- `/NEXUS PHALANX/Backups/NEXUS_PHALANX_EPIC_NAVIGATION_V2_FREEZE_BACKUP_2026-10-15.zip`: listed, **940985 bytes**; ZIP/hash not revalidated.
- Historical Alpha14–19 HOME function test files listed in `Development Tests`; do not discard or promote as current.
- `/NEXUS PHALANX/Design Freeze/Zentrale Referenzbilder-Datenbank/REFERENZ_INDEX.md` and `/NEXUS PHALANX/Backups/2026-10-13 Projektstand/BACKUP_MANIFEST.md` listed but not yet content/hash validated.

### Source-of-truth design

**One logical canonical memory; several specialized registers; three independent durable backup copies of irreplaceable originals, subject to actual verification.** Do not create three contradictory master documents.

1. `PROJECT-INDEX`: short, stable entrypoint, version and last-audit timestamp; all paths resolvable.
2. `FEATURE-REGISTER`: each feature with immutable ID, lifecycle, version, test evidence and canonical implementation; import/reconcile the existing 74 entries, do not rewrite history.
3. `ARTIFACT/FREEZE-REGISTER`: immutable ID, exact file location, byte size, SHA-256, approval, supersession, last verification; distinguish visual/function/data FREEZEs.
4. `DEPLOYMENT/ENVIRONMENT-REGISTER`: GitHub commit/branch, Cloudflare project/build, Supabase function slug/version/hash, DB migrations; capture reproducible deployment provenance.
5. `DATA/BACKUP/RESTORE-REGISTER`: DB source timestamps, encrypted backup object references (not secrets), independent storage copies, restore drill result and RPO/RTO.
6. `DECISION/CONFLICT-LOG`: who approved what, when, reference screenshot, supersedes/does-not-supersede and pending conflicts.

All registers must use stable IDs and links, be machine-checkable where feasible, and contain **evidence class + checked-at + limitation**. Never infer a tested feature from file existence.

### Minimum memory acceptance tests

- **Lookup test:** for a sample of feature IDs (including OUT-024, HOME, rankings, PYLON IX), find canonical file, exact version, approval and test status from index alone; zero ambiguous latest-version resolutions.
- **Integrity test:** download original, compute SHA256 and compare with locked manifest; report failures, never replace by approximate regeneration.
- **Cross-source reconciliation:** compare feature register, all branches, Library, Supabase, Cloudflare and backups; every unmatched artifact and missing source is a tracked gap.
- **Recovery drill:** on isolated disposable environment, restore a chosen original plus DB schema/data and one Edge Function; no production writes and no chargeable environment without explicit consent.
- **Freshness test:** last-audited timestamp and source-captured timestamp separately tracked; alert on drift, stale snapshots, missing backup runs.
- **Cold-start test:** a fresh chat reading only PROJECT-INDEX must correctly locate the frozen HOME, OUT-024, current alpha, feature register and known recovery gaps; do not depend on conversational memory.
- **Three-copy principle:** one working copy, one independent local/provider backup, one independent offsite encrypted copy for irreplaceable assets. GitHub, Supabase and Cloudflare serve different content; three providers alone do NOT prove three copies of each artifact.

### Corrections to earlier claims

- The old 14.10 backup coverage file actually lists **24** active Edge Functions, not 25. The 18.10 live read returned **26**; the new slugs relative to that document include `phalanx-native-ranking-rc-test` and another already documented elsewhere. Avoid comparing mismatched historical snapshots as if they were exact consecutive inventories.
- This document is an index of evidence, not the full project knowledge base, and it is not yet tested for complete retrieval or disaster recovery.

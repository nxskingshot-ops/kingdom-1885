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
- **26 ACTIVE Edge Functions**. The previous 14.10. coverage inventory lists 25, so the current inventory is newer. Additional slug: `phalanx-native-ranking-rc-test` v2. Preserve full function version and `ezbr_sha256` hashes in a separate sanitized source manifest; fetch/inspect source before treating any as backed up.
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

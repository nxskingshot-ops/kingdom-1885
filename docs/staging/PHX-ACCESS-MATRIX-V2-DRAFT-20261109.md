# PHALANX Access Matrix V2 — review draft
Date: 2026-11-09
Status: PROPOSAL / NOT APPROVED / NOT DEPLOYED

## Binding decisions
Kingshot rank R1–R5 and PHALANX app authorization are independent. App roles named Observer, Operator, Administrator. GOD is separate protected owner status, not a self-service role. Do not silently change existing FREEZEs, permissions, user accounts, or live policies.

## Proposed role baselines
- Observer: read permitted information, player searches, analyses and comparisons.
- Operator: Observer plus authorized operational editing and reporting/export.
- Administrator: Operator plus registration approval, role assignment (including Administrator only by an already authorized Administrator), account deactivation/reactivation, audit inspection and authorized candidate deletion.
- GOD: owner protection and recovery according to existing governance; implementation not proven.

## Module-by-module proposal (subject to module FREEZE and security review)
| Module | Observer | Operator | Administrator | Gate |
|---|---|---|---|---|
| HOME / War Room | view | view | view | preserve HOME FREEZE |
| Transfer Scouting | read/search/compare | edit candidates/notes/assessments, export | plus candidate deletion and governance | data privacy / RLS |
| Territory Control | view | scoped edits TBD | scoped admin TBD | protect navigation |
| Outpost Map 2.0 | view/filter/zoom | scoped outpost data maintenance TBD | scoped management TBD | preserve 74-outpost full feature and JSON/CSV exports |
| Reports | view | create/export TBD | manage TBD | existing exports protected |
| Command Center | permitted view TBD | operations TBD | admin TBD | inspect actual implementation |
| Rankings / Intelligence | permitted read TBD | operations TBD | scoped admin TBD | sensitive data access review |
| PYLON IX | permitted Q&A TBD | authorized operational actions TBD | admin actions TBD | server-side checks per action |
| Access Management | none | none | registration, user roles, account lifecycle, audit | GOD protection and atomic approval |

## Recommended design (not approved)
Use role baseline + explicit per-module capabilities. Do not assume Operator has blanket write access to every module. Record module permission grants and audit. Game rank never used as authorization input.

## Known live contradictions
Supabase policies permit r4/r5 to review access requests and delete transfer candidates. Deployed nexus-access-review v8 permits r4/r5 to review requests and creates technical-email auth users. Do not deploy V2 without compatibility mapping, existing-identity reconciliation, verified backup/rollback, security tests and Android regression.

## Verification
Project handoff snapshots dated 2026-10-21 inspected. GitHub and Supabase prior read-only findings recorded in PHX-IDENTITY-RLS-GAP-20261109.md. This file is a planning artifact only. No migration, backup, restore, frontend integration, API or mobile test executed.

## Approved governance workflow — 2026-11-09
User decision: Do NOT pre-approve module/function permission details globally. Review and decide authorization **module by module, function by function, when that module/function is actually worked on**. Observer, Operator, Administrator remain the app-role names; GOD remains separately protected. The table above is an unapproved discussion aid, NOT a grant of access. Preserve current behavior, data and FREEZEs until each change is inspected, approved, implemented and tested. For each module record current implementation, data sensitivity, read/write/delete/export/admin actions, server-side authorization, role tests, rollback and release status. Do not treat an Administrator as automatically entitled to every operational write without that module's review.

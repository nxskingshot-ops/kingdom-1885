# PHALANX PWA manifests and backup verification gate

Date: 2026-10-15. Read-only inspection; no production changes.

## Three different manifests on public main
| File | Name | Start URL | Scope |
| --- | --- | --- | --- |
| manifest.webmanifest | Kingdom #1885 · Outposts | ./preview/kingdom-hub-scouting-v6.html?view=map | ./ |
| nexus-app-2.webmanifest | Nexus App 2.0 | ./preview/nexus-app-2-command-center-v1.html | ./preview/ |
| nexus.webmanifest | NEXUS · Kingdom #1885 | ./preview/kingdom-hub-menu-test.html?view=map | ./ |

Different start URLs and scopes mean installed clients may have different upgrade and navigation paths. This is not proof of a malfunction.

## Backup workflows
- `.github/workflows/daily-code-backup.yml`: scheduled + manually triggerable, creates a dated Git tag snapshot of main (not an independently stored offsite backup).
- `.github/workflows/phalanx-db-restore-validation.yml`: manually triggerable DB restore validation workflow.
- Workflow execution histories and actual backup artifacts were **not verified**: the available GitHub fetch interface rejected the Actions workflows endpoint.
- Git tag snapshots alone do not protect against loss of repository access or all branches/history.

## Gates before private migration
1. Identify which manifest each actual installed Android/PWA variant uses, including service-worker scope.
2. Read-only verify Actions runs, last success, backup locations and retention through authorized tools.
3. Independently export all Git refs, branches and tags; validate archive checksums and restore.
4. Validate DB/Edge Function backup and restore without touching production.
5. Preserve user-facing app URLs or implement tested migration and rollback.
6. Request explicit approval before visibility, Pages, hosting or deployment changes.

## Status
Audit notes only. No backup success or migration claimed.

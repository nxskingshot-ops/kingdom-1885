# Edge Function source coverage

**PARTIAL – 5 of 25 deployed sources backed up.**

> This is an inventory, not a complete disaster recovery backup. The 20 missing source files must be exported through an approved route. Do not bypass connector security restrictions.

| Function | Version | Source in branch |
|---|---:|---|
| `kvk-sync` | 4 | Verified |
| `outpost-sync` | 4 | Verified |
| `outpost-editor` | 6 | Verified |
| `nxs-guest-setup` | 5 | Verified |
| `nexus-feedback` | 3 | Missing |
| `nexus-true-power` | 6 | Missing |
| `nexus-access-review` | 6 | Missing |
| `verified-outpost-sync` | 3 | Missing |
| `mightpulse-ranking-test` | 2 | Missing |
| `mightpulse-ranking-audit` | 3 | Missing |
| `mightpulse-ranking-identity-audit` | 2 | Verified |
| `mightpulse-board-coverage-audit` | 2 | Missing |
| `mightpulse-coverage-round2-fixed` | 2 | Missing |
| `mightpulse-freshness-quality-audit` | 2 | Missing |
| `mightpulse-quality-batch-audit` | 2 | Missing |
| `mightpulse-quality-batch-4-7` | 2 | Missing |
| `mightpulse-quality-overview-16` | 5 | Missing |
| `mightpulse-alliance-schema-diagnostic` | 2 | Missing |
| `mightpulse-kills-diagnostic` | 3 | Missing |
| `phalanx-mightpulse-poll` | 7 | Missing |
| `phalanx-mightpulse-status` | 4 | Missing |
| `phalanx-mightpulse-scheduled` | 2 | Missing |
| `phalanx-mightpulse-value-diff-test` | 2 | Missing |
| `phalanx-kingdom-1913-scout-test` | 2 | Missing |
| `phalanx-kingdom-scout-report-test` | 3 | Missing |

## Acceptance criteria

- [ ] All 25 `index.ts` sources saved on the recovery branch.
- [ ] All 25 saved sources compared byte-for-byte with their deployed counterparts.
- [x] Non-secret metadata inventory includes all 25 function versions, JWT settings and reported hashes.
- [ ] Secret values restored only through an approved secrets manager in a test environment.
- [ ] Isolated test-project restoration and authorization tests completed.

Production and `main` remain out of scope for this audit.

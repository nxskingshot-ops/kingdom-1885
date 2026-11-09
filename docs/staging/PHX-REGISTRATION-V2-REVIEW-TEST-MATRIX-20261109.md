# PHALANX Registration V2 — Review and notification test matrix
Date: 2026-11-09. Staging source only. No live migration/deployment.

## Required access controls
| Scenario | Expected |
| --- | --- |
| Anonymous status or submit | 401 |
| Invalid JWT | 401 |
| Signed-in user reads another application | 403/no data |
| Pending user reads internal reviewer note | never returned |
| Self-declared Kingshot R5/player ID | no elevated access |
| Legacy r4/r5 without PHALANX Administrator permission | no review rights |
| PHALANX Administrator without explicit registration-review grant | no review rights |
| Approved reviewer attempts self-review | 403 |
| Review already processed | 409, no new event or email |
| Concurrent reviewers | exactly one committed decision |
| Approval with failed membership grant | rollback decision, event, outbox |
| Owner GOD protection | unchanged |
| Existing Queen An / owner / working account | unchanged |

## Notification invariants
| Scenario | Expected |
| --- | --- |
| Pending->approved | one durable event and one email outbox item |
| Pending->rejected | one durable event and one email outbox item |
| Repeated delivery | idempotent, no duplicate dispatch |
| Provider outage | queued/failed with bounded retry, UI status remains truthful |
| No confirmed recipient email | no send; actionable safe error |
| Email provider unset | no send, no false success |
| Applicant refreshes page | no new email |
| Failed review transaction | no event/email |

## Functional/regression checks
Registration, confirmation, status refresh, signup duplicates, approval, rejection, permission-specific access, login/logout, navigation, mobile viewport, candidate CRUD RLS, legacy request history, audit and rollback.

## Verified as of this commit
- GitHub staging source written: PASS.
- Schema draft contains RLS and revoked public grants: STATIC REVIEW ONLY.
- Runtime endpoint tests: NOT TESTED.
- Migration: NOT EXECUTED.
- Email dispatch: NOT IMPLEMENTED / NOT TESTED.
- Administrator review endpoint: NOT IMPLEMENTED.
- Deployment: NOT PERFORMED.

## Release gates
Do not deploy until authenticated server-side reviewer role mapping is agreed, migrations are rehearsed against nonproduction copy, current backup integrity/restore are tested, sender credentials and costs approved, and E2E + regression tests pass.

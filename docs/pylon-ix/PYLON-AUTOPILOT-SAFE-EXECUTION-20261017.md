# PYLON IX — Autopilot safe execution

## Standing working convention (2026-10-17)

Within each user-requested work session, complete several related safe steps before reporting; do not require a separate "Go" per file or commit. Review existing implementation, implement cohesive isolated changes, run or prepare tests, inspect results, fix errors and provide a concise status with blockers.

## Permitted without additional approval

- Read-only GitHub and Supabase schema/security inspection.
- Isolated code and mock-only test changes on `feature/pylon-ix-design-spec-20261017`.
- Documentation, code review, and zero-cost verification.

## Explicit approval required

- Production deployment, merges to main, changes to frozen designs or existing functional modules.
- Live private game data exposure, real-account RLS testing, new test users/memberships or permission changes.
- Any paid resource, billable branch or other cost.
- Destructive or privacy-sensitive operations.

## Important limits

A normal chat session does not continue working after its response finishes. Scheduled tasks are separate, explicitly requested workflows; they do not imply an always-on developer. A green mock CI run is not proof of actual Supabase RLS behavior. Keep live data disconnected until an authorized and unauthorized test session have both been tested, reviewed and approved.

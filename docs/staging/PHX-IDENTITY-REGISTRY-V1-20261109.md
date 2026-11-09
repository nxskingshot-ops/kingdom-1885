# PHX Identity Registry V1 — implementation gate
Date: 2026-11-09
Status: ISOLATED DESIGN / NOT DEPLOYED

## Verified baseline
Supabase project hcjrdofkdkasznywvcxo; auth.users (7), app_profiles (7), nxs_memberships (6), nexus_access_requests (2). Existing membership roles are authoritative. No auth, role, or user records may be overwritten by identity enrollment.

## Identity model
Add a dedicated private identity table in a reviewed migration, with user_id UUID UNIQUE referencing auth.users, kingshot_player_id TEXT UNIQUE when verified, display_name, kingdom, alliance, verification_status (unverified / pending / verified / disputed), verified_by, verified_at, source, created_at, updated_at. Keep historical identity claims in an append-only audit table with access restricted to authorized administrators. Do not copy email into this table: join to auth.users only in trusted server-side code.

## Registration
Email + password + Kingshot player ID mandatory. Verify email. Resolve available name/kingdom/alliance from approved lookup, otherwise mark pending; never treat lookup as proof of ownership. New user has no active membership or application access until an authorized administrator approves the registration and explicitly assigns a role (member, r4, or r5). The registration form must never allow self-selection of a role. Admin/GOD privileges are excluded from ordinary registration approval and require the separately protected governance procedure. Rejections and subsequent role changes must be audited. Approval and role assignment must be one authorized, atomic server-side operation. Prevent duplicate verified player IDs and implement a dispute/recovery flow. Existing accounts must not be reset.

## Access control
Identity and authorization separate. Never infer r5/admin/GOD from player ID, alliance, user_metadata or client claims. Preserve existing nxs_memberships role and GOD owner guard. Read own identity only; admin listing and verification through authenticated server-side authorization, audit every change. Never expose auth.users directly to browser.

## Migration and release gate
1. Review latest deployed account-management code and canonical branch.
2. Export and verify recoverable database backup; test restore in isolated environment.
3. Implement additive migration with RLS, unique constraints and ownership-safe policies.
4. Backfill only user-confirmed identity (An Morrigan player 291688449 for existing R5 account) after verifying account linkage; leave other unknown IDs pending.
5. Implement registration and account-management UI in current PHALANX layout, no FREEZE changes.
6. Test duplicate IDs, spoofing, role escalation, user self-read, admin read, migration rollback, Android and regressions.
7. Obtain separate release approval for production.

## 2026-11-09 evidence
matze4428@gmail.com has active admin membership. gemmafinnegan@gmail.com has active r5 membership; user confirmed that this is An Morrigan. An's Kingshot ID 291688449 is user-provided, not API-verified. The +phxarbeitsapp1109 account has no membership. Two expired guest accounts are inactive. Current account-management UI showing only two accounts requires code-level investigation.

## Tests
Database read-only baseline: PASS.
Branch creation: PASS.
Migration, RLS, registration, integration, Android, backup, restore: NOT TESTED.
No production changes performed.

## Role selection decision — 2026-11-09
Admin approval dropdown V1: **Member** (`member`), **R4 – Officer** (`r4`), **R5 – Alliance Leader** (`r5`). No role selection by applicants. The approving administrator must explicitly select exactly one role; no preselected privileged default. Persist assignment and approval together server-side and audit approver/time/role. **PHALANX Admin** (`admin`) and **GOD/System Owner** must NOT appear in ordinary registration approval. Existing memberships are unchanged. Exact permissions per role remain to be decided and verified; do not infer app admin rights from Kingshot R5. Preserve governance security FREEZE (21 Oct 2026): GOD MODE is not proven implemented; owner guard cannot be assumed live.

Verification: GitHub document update only; registration UI, database enforcement, RLS, integration and Android NOT TESTED.

## Member permissions — approved 2026-11-09
Member is **read-only**: may search players and view scouting analyses and comparisons. Member must not create, edit or delete candidates, notes, evaluations, identity records, registration approvals, memberships or roles; must not administer accounts. Enforcement must be server-side (RLS/API), not only hidden UI buttons. Exact visibility of sensitive shared records remains subject to access review. Existing live behavior is unchanged until implementation and regression verification. R4 permissions: pending user decision.

## R4 permissions — approved 2026-11-09
R4 inherits all Member read-only search/analysis/comparison capabilities and additionally may (1) create and edit transfer scouting candidates, (2) edit scouting notes and evaluations, and (3) export reports and comparisons. Explicitly excluded: view registration requests, approve/reject registrations, assign/change roles, delete candidates, administer accounts, access GOD functions. No other privileges are implied. Changes must be enforced by RLS/server APIs and UI, with existing production behavior protected until tested release. R5 permissions remain pending user decision.

## R5 permissions — approved 2026-11-09 (binding)
R5 inherits **exactly** the R4 scouting permissions, with **no additional permissions**. R5 may search players, view analyses/comparisons, create/edit candidates, edit notes/evaluations, export reports/comparisons. R5 must not delete candidates, view registration requests, approve/reject registrations, assign/change roles, deactivate accounts or access Admin/GOD functions. All unselected rights are explicitly excluded. Only a separately authorized PHALANX administrator may review/approve registrations and select the Member/R4/R5 role at approval. The in-game R5 title must not grant PHALANX admin permissions. Implement this matrix in backend/RLS and frontend; current production access has not been modified or tested. This decision supersedes any earlier draft suggesting R5 approval privileges.

## Binding PHALANX Admin decision — 2026-11-09
The user explicitly approved the **admin** role: inherits all R4/R5 scouting permissions plus (1) inspect registration requests, (2) approve or reject registrations, (3) assign member/r4/r5 at approval, (4) change existing member/r4/r5 roles, (5) deactivate/reactivate accounts without deletion, (6) delete scouting candidates with confirmation and audit, (7) view security/change audit logs. No other administrative permissions are implied. Admin/GOD role assignment and GOD owner management remain outside ordinary workflows. Admin may not grant or change Admin/GOD via the standard UI. For existing-role changes, protect Admin/GOD accounts and prevent self-escalation. Authorization must be enforced server-side and logged.

## PHALANX permissions matrix V1 — binding
| Capability | Member | R4 | R5 | Admin |
|---|:---:|:---:|:---:|:---:|
| Search players | Yes | Yes | Yes | Yes |
| View analyses and comparisons | Yes | Yes | Yes | Yes |
| Create/edit candidates | No | Yes | Yes | Yes |
| Edit notes and evaluations | No | Yes | Yes | Yes |
| Export reports and comparisons | No | Yes | Yes | Yes |
| Review registration requests | No | No | No | Yes |
| Approve/reject registrations | No | No | No | Yes |
| Assign member/r4/r5 at approval | No | No | No | Yes |
| Change existing member/r4/r5 roles | No | No | No | Yes |
| Deactivate/reactivate non-admin accounts | No | No | No | Yes |
| Delete scouting candidates | No | No | No | Yes |
| View security/change audit logs | No | No | No | Yes |
| Assign Admin or GOD; manage GOD owner | No | No | No | No |

Approval dropdown is **Member / R4 / R5 only**; no self-selected role, no implicit role on signup. Admin role is assigned only through a separate protected governance procedure. This matrix governs the Transfer Scouting/Identity Registry scope; it must not silently replace other existing PHALANX module permission models or FREEZEs.

## Verification for this decision
Documented on isolated GitHub branch only. No database or production role changes. Database migration, RLS/API authorization, UI integration, audit logging, backup integrity, restore and mobile regression: **NOT TESTED**.

## Amendment — Admin in registration role list (2026-11-09)
The user approved adding **Admin** as a fourth role option in the registration approval list, with the restriction that **only an already authorized PHALANX Admin may assign the Admin role**. The registration applicant never selects their own role. Thus approval dropdown: Member / R4 / R5 / Admin, but Admin selection is visible/actionable only to verified authorized Admin approvers; all role grants require server-side authorization, identity verification, atomic approval+role assignment and audit. GOD/System Owner remains excluded. This amendment **supersedes** earlier text in this register excluding Admin from the ordinary approval list. Do not infer permission to modify the GOD owner or to bypass governance FREEZEs. The technical implementation and effective admin-to-admin delegation controls require verification before release. Existing accounts/roles unchanged.

## V2 governance decision — STRICT separation of Kingshot rank and PHALANX permissions (2026-11-09)
**Binding user decision:** Kingshot in-game rank and PHALANX application authorization are two independent attributes and must be named differently to prevent confusion. Never infer PHALANX privileges from Kingshot R1–R5, nor infer game rank from application permissions. The V1 Member/R4/R5/Admin authorization matrix is **superseded as a proposed target model**, retained as historical record, and MUST NOT be deployed as-is. Existing live roles/data are unchanged; migration requires explicit mapping, backup, rollback, server-side authorization and regression tests.

**Proposed names (not yet approved):** game_rank = Kingshot R1–R5; app_access_role = Observer (read-only), Operator (scouting edit/export), Administrator (account administration and candidate deletion), GOD (separate protected owner). Naming, exact capabilities, and existing legacy role migration remain OPEN pending approval. Display game rank and app role separately. Existing legacy role identifiers in DB are NOT to be renamed or migrated blindly.

**Status:** Governance decision documented only; implementation, DB migration, backup, restore, role tests and deployment NOT TESTED.

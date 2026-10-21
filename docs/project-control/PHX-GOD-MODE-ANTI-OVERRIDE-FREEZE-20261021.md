# PHALANX GOD MODE — Protected invariant / anti-override FREEZE (2026-10-21)

## Highest-priority binding project requirement
The sole verified owner of NEXUS PHALANX holds GOD MODE. No normal administrator, including An, may suspend, ban, delete, demote, replace, share, clone or transfer GOD MODE. The only permitted ownership transfer is an owner-approved completed sale through a dedicated, strongly authenticated and audited transfer process.

**No ordinary software update, refactor, database migration, restore, feature flag, role assignment or app configuration change may silently remove, weaken, override or bypass these invariants.**

## Engineering controls to implement before release
1. **Independent owner identity:** fixed trusted owner principal outside user-editable profiles/roles, and explicit immutable owner invariants enforced server-side in every admin route, RLS/RPC, Edge Function and background task.
2. **Protected code ownership:** branch protection, required independent review for owner-security paths, required CI checks and protected deployments. No operational app admin can merge or deploy security-policy changes merely by holding app permissions.
3. **Automated negative tests:** deny ban, suspension, deletion, demotion, role overwrite, transfer, cloning, self-approval, bulk updates, cascading deletion, REST/RPC/Edge Function bypass and PYLON-based privilege escalation against the owner.
4. **Migration/restore guards:** every migration and restore must validate that exactly one verified owner remains and protected capabilities are intact. Abort on invariant failure; maintain independent versioned backups and restore tests.
5. **Infrastructure separation:** protect Supabase project ownership, GitHub admins, Cloudflare deployment controls, service keys, CI secrets and backup credentials with MFA, least privilege and independent recovery. App operational admins receive no infrastructure privileges by default.
6. **Emergency lock:** owner-exclusive lock/unlock, verified on the server; owner recovery remains available.
7. **Audit:** tamper-resistant record of attempted violations, sensitive role changes, deployment, migration, lock/unlock and sale transfer.
8. **Sale-only transfer:** no ordinary transfer UI, no second GOD MODE. Require owner initiation, identity checks, explicit confirmation and verified completed sale before atomic reassignment.

## Important limits
No purely software-based mechanism can be absolutely unchangeable by someone who has ultimate authority over code, database, hosting, backups and identity provider. This FREEZE specifies the strongest practical safeguards, not a mathematically unbreakable guarantee. Legal title to the software and platform contracts require separate treatment.

## Governance
Any proposed change affecting this FREEZE must be clearly identified as a protected-owner-security change and cannot be bundled into routine feature work. Owner approval alone does not replace testing, infrastructure safeguards or deployment review.

## Status
Binding design/governance requirement, not yet implemented or penetration-tested. No database/RLS/auth changes, deploy, main merge or production changes authorized by this document.

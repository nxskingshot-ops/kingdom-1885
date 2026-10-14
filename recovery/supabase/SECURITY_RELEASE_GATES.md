# PHALANX security and recovery release gates

Status: **NOT RELEASE-READY**. Evidence-based checklist. Date: 2026-10-14.

## Confirmed by read-only checks
- [x] 25 active Edge Functions inventoried with deployment metadata.
- [x] 5 Edge Function sources backed up and compared exactly against current deployed code and inventory hashes.
- [x] All five `verify_jwt=false` functions statically reviewed for application-level access controls.
- [x] RLS enabled on `nxs_memberships` and `public_outposts_verified_20261002`.
- [x] Security advisor baseline captured (8 no-policy tables, SECURITY DEFINER execution warnings, leaked-password protection warning).
- [x] Performance advisor baseline captured.

## Blockers – do not claim release/recovery readiness
- [ ] Obtain the remaining 20 function source backups via approved export.
- [ ] Verify all 25 saved sources against deployed source and hash metadata.
- [ ] Review actual RLS policies for Outpost and membership tables, including expiration enforcement and privilege escalation.
- [ ] Review the implementation and intended grants for `phalanx_can_read_alliances()`.
- [ ] Confirm authorization denial and allowed behavior in an isolated staging project.
- [ ] Verify secure restoration of required secrets from approved storage, not from GitHub.
- [ ] Demonstrate isolated full restore and document rollback evidence.
- [ ] Separately validate frozen HOME UI behavior on target mobile devices.

## Do not do
- Do not modify production RLS, functions, auth settings, cron jobs, or frozen UI during an audit.
- Do not bypass connector safety blocks to copy missing source code.
- Do not infer policy correctness from migration names or `rls_enabled=true` alone.

## Next dependency
Read-only policy/function definition inspection through an approved administrator-access route, and an approved source export for the 20 missing functions.

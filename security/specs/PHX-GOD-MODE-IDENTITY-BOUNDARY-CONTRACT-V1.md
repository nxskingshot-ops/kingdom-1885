# PHALANX GOD MODE — Independent identity implementation contract V1

Status: isolated engineering specification. No production change.

## Identity model
- `phx_security.owner_identity`: single protected owner principal keyed by an internal UUID, separate from Kingshot identities.
- `phx_security.owner_auth_bindings`: trusted PHALANX Auth user UUID binding, initially exactly one active verified owner credential; changing credentials requires protected owner recovery, not an app-admin update.
- `public.phx_game_identity_links`: ordinary optional game data links keyed by authenticated PHALANX user, containing kingdom and source-specific player identifier. Changes have **zero** impact on owner status.
- Owner authorization requires an authenticated verified PHALANX principal and a protected owner binding. Never compare Kingshot IDs, email text, game nicknames or game rank for authorization.

## Owner bootstrap and recovery
1. Owner identity must be securely initialized out of band after verifying the founder's PHALANX Auth identity. Never hard-code an email or a Kingshot player ID in a migration.
2. Recovery of lost credentials changes the **authentication binding**, not the underlying owner principal. Require independent MFA/recovery evidence and full audit; no R5, operational admin or game-ID holder can perform recovery.
3. Owner emergency console remains accessible if game data service or Kingshot account is unavailable.

## Required authorization invariant
No non-owner actor can delete, suspend, ban, demote, transfer, share or relink the protected owner principal or its active authentication binding, including via admin bulk APIs, PYLON, Edge Functions, RLS, migrations or regular user-profile updates. Ordinary admin rights never include infrastructure privileges.

## Test matrix (before activation)
- Kingshot ID missing, changed, stolen, duplicated, unlinked or deleted => owner unchanged.
- Alliance, rank, kingdom, nickname changes => owner unchanged.
- Kingshot data source offline => owner emergency console works.
- An/operational admin tries owner suspension, permission revocation, transfer, game-ID relink, user deletion, owner auth-binding change => denied.
- Owner MFA recovery => owner principal preserved, prior compromised sessions revoked.
- Emergency lock/unlock => owner-only; PYLON and API deny non-owner protected data.
- Direct REST, RPC, service-role paths, database jobs, CI/deploy, backups and restore tested independently.
- Security review validates no owner ID leaks and no ordinary app-admin ability to deploy policy changes.

## Deployment gates
No migration or merge until current auth schema, RLS, privileged functions, triggers, Cloudflare/Supabase/GitHub administrators and service credentials are audited. Verify protected owner identity by secure means before any bootstrap. Require isolated integration tests and rollback/restore evidence.

This document is a technical contract and not proof of implemented safeguards.

# PHALANX GOD MODE — Independent of Kingshot identity FREEZE (2026-10-21)

## Binding requirement
GOD MODE ownership belongs exclusively to the verified PHALANX owner identity, never to any Kingshot game account, game player ID, governor ID, nickname, kingdom, alliance, rank or game profile.

## Required identity separation
1. **Owner identity**: dedicated, protected, uniquely identified PHALANX owner principal; only this identity authorizes owner-only operations.
2. **Authentication identity**: verified PHALANX Auth user with strong MFA/recovery; credentials can be rotated through a protected, owner-authenticated recovery procedure without transferring ownership.
3. **Game identity**: optional mutable link to Kingshot player ID(s) for data lookup and display only. No privilege-bearing effect whatsoever.

## Invariants
- Loss, suspension, deletion, transfer or replacement of any Kingshot account must not suspend, ban, demote, delete, reassign or impair the PHALANX owner principal.
- Changes to game name, player ID, alliance, kingdom or game rank must not modify owner permissions.
- Owner administration, emergency lock/unlock and recovery must remain accessible when game data services are unavailable.
- No game identity input, profile sync, import, merge, player matching, avatar update or data correction may modify owner identity or security roles.
- An and all other operational admins cannot relink a game ID to impersonate the owner or trigger owner transfer.
- GOD MODE sale-only transfer rules remain in force; a sale transfer is a separate protected process, not a game-account transfer.
- Do not equate `uid` and `governor_id` without source verification.

## Architecture and tests
- Separate game-player link tables from privileged owner identity; no FK cascade from game profile to owner.
- All authorization uses trusted PHALANX Auth/owner principal, never game IDs or client-supplied claims.
- Negative tests: game ID change/delete, no game profile, kingdom/alliance change, data sync failure, duplicate game ID claim, game ID takeover attempt, administrator relink attempt, emergency lock/unlock with game source unavailable.
- Protect PHALANX authentication/recovery against account takeover; owner account immunity to ordinary app-admin operations does not prevent external identity-provider or infrastructure outages.

## Status
Binding product/security FREEZE. Not yet implemented or tested. No live database/auth changes, deploy or main merge authorized.

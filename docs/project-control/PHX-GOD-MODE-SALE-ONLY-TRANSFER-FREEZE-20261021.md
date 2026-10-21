# PHALANX — GOD MODE ownership transfer only upon sale FREEZE (2026-10-21)

## Binding ownership rule
- PHALANX has exactly one GOD MODE owner: the founder's verified owner identity.
- GOD MODE cannot be shared, delegated, duplicated, co-owned, assigned by ordinary admins, inherited from in-game rank, or transferred through a standard settings screen.
- The **only authorized reason** to transfer GOD MODE or ownership is an actual sale expressly approved by the current owner.
- Operational administrator An retains broad operational permissions but never GOD MODE.

## Sale and transfer procedure (future implementation)
1. Current owner independently initiates and expressly authorizes a sale-related transfer. An operational admin cannot initiate it on the owner's behalf.
2. Require legally appropriate evidence of the completed sale and explicit buyer identity verification; legal and contractual details require professional review.
3. Require strong reauthentication (MFA) and a second deliberate owner confirmation before a time-bound transfer.
4. Execute an audited, atomic transfer to the verified buyer identity, revoke prior ownership rights and active sessions as appropriate, rotate affected credentials, and verify no second owner exists.
5. Do not give the buyer access before conditions are met. Include a recovery/rollback plan for technical failure, not an unapproved ownership reversal.
6. A purported sale must not bypass hosting, app-store, game-data, intellectual-property or privacy requirements.

## Non-goals
No shared GOD MODE, temporary GOD MODE, emergency second owner, secret backdoor, master password, routine ownership-transfer UI or admin-created owner accounts.

## Status
Product/design FREEZE only. No live transfer flow, DB constraint, production policy, deployment or merge implemented.

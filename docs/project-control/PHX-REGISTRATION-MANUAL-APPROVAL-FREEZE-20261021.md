# PHALANX 1.0 — Manual registration approval FREEZE (2026-10-21)

Approved decision: first registration requests email, password, and Kingshot player ID. Verify email, then hold the account in PENDING_APPROVAL; no access to private PHALANX app or alliance intelligence until an authorized administrator explicitly approves it.

## Identity and access
- A game player ID is not proof of ownership. Admins must independently verify the player's identity and eligibility before approval. E-mail verification proves only control of e-mail.
- Prevent duplicate **active** mappings of the same game player ID; resolve conflicts through a documented manual review, never automatic reassignment.
- Status lifecycle: EMAIL_UNVERIFIED -> PENDING_APPROVAL -> APPROVED or REJECTED; optionally SUSPENDED. A rejected/suspended account does not gain app access.
- Enforce authorization on the backend via RLS/verified claims, not by hiding frontend screens alone. Pending users may access only their own approval-status page and permitted account management functions.
- Limit administrator approvals to authorized roles, record approver/time/reason in an audit trail, and prevent self-approval.
- Registration should avoid account-enumeration leaks and rate-limit requests; do not store plaintext passwords.

## Profile
- Once approved, look up player data from the existing permitted source using kingdom + player UID. Display name, alliance, kingdom, power, and castle/Truegold stage are read-only, source-dated, and refreshed when new verified data arrives.
- Avatar is NEVER fetched from the game data source; use PHALANX Spartan helmet or manual image upload. Only avatar is user-editable.
- No game nickname change, no nickname verification code, no costs or burdens placed on players.
- Keep HOME design FREEZE unchanged. Do not depend on deprecated Top 40.

## Scope
This document records an approved product requirement, not an implemented auth flow. No database changes, new permissions, deployment, production changes, or main merge authorized by this FREEZE.

# PHALANX offline authorization model V5 — 2026-11-03

18/18 Node.js offline tests passed. Replaced caller-controlled role with an internal verified-session test fixture, moved owner protection to private configuration, and made binding and request maps private. Tests cover role spoofing, owner-ID spoofing, unknown/inactive sessions, direct binding replacement, mutable read copies, R4/R5/admin permissions, elevated grants and simulated staged failures.

LIMITATIONS: the session registry is a test fixture, NOT actual JWT validation; private JavaScript fields are NOT database privileges; simulated atomicity is NOT real Supabase Auth/Postgres transactionality. No real Edge Function deployment, Supabase staging, live browser or administrator regression tests were performed. Production unchanged.

Required: independent server-controlled binding, actual session verification and active membership lookup, Auth/database failure compensation, real backup+restore verification, full role regression and explicit release approval.

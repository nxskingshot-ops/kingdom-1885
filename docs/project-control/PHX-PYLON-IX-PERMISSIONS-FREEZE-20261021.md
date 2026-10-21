# PYLON IX — Permission inheritance FREEZE (2026-10-21)

## Binding rule
Every approved PHALANX account may use PYLON IX. PYLON IX is not an independent privileged actor: it must operate strictly within the current user's effective PHALANX permissions, including per-resource and per-alliance restrictions.

## Default access
- All approved users: their own profile and the general approved-user Outpost map (and approved public location/ownership Outpost facts).
- Rankings, aggregated ranking comparisons, tactical assessments, confidential reports and transfer intelligence require explicit grants.
- Game rank (including R5) does not confer additional PHALANX or PYLON privileges.
- Pending, rejected or suspended users cannot use PYLON to access protected data.

## Enforcement
- All retrievals, tools, exports, cross-resource joins, summaries and generated answers are subject to the user's server-enforced authorization. Never provide a service-role unrestricted query path to the assistant.
- Filter/retrieve permitted rows and fields **before** passing data to the model; do not rely on prompts to redact secrets.
- No inference or aggregation that reveals restricted underlying data. Deny unauthorized requests without leaking whether a private record exists.
- PYLON may explain admin operations but may not silently approve users, grant rights, edit data or take other privileged actions. Such actions require both the correct grant and a separately confirmed, audited action.
- Permission revocations apply to subsequent accesses; minimize cached sensitive context and re-check authorization on tool calls.
- Audit sensitive actions and access denials as appropriate without logging secrets or passwords.

## Status
Approved architecture/design FREEZE. Not yet implemented or security-tested. No DB/RLS changes, deploy or main merge authorized.

# PHALANX — Queen An priority sequence (2026-11-01)
Status: approved product direction; implementation and tests pending.

## Decision
Do not block Queen An on completion of the full PHALANX app. First make Transfer Scouting usable as an isolated test module, then connect the EXISTING KvK module directly to it because KvK is imminent and important to Queen An. Reuse the same authentication, compact signed-in player name / session status / verified scoped role indicator, and PHALANX visual language. Navigation: Transfer Scouting ↔ KvK.

## Safeguards
Before implementation, inspect actual current KvK source, last working deployment, data/API contracts, roles and FREEZEs. Do not substitute a simplified new KvK module or modify productive data. Shared login does NOT imply automatic KvK authorization: inspect and enforce KvK-specific server permissions. No merge, production changes, new costs, or privilege grants without explicit approval. Record browser and Android integration tests.

## Work queue
1. Complete isolated Transfer Scouting auth, owner approval flow and compact status bar.
2. Identify current functional KvK implementation and integration points.
3. Connect both modules through protected navigation and shared session, with distinct role checks.
4. Test session, back navigation, KvK data, exports, mobile, regressions, and permission boundaries.
5. Publish isolated test preview only when authorized and verified.

No technical completion is claimed by this register.

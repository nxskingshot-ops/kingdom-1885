# PHX-INT002 — module entrypoint contract

Status: DOCUMENTED. Follows PHX-ARCH-FREEZE-20261021-01.

Every independently shipped module should declare a stable feature ID, version, route, governing design FREEZE, dependencies, and evidence level. HOME links to routes only; it never imports a module's entire markup as a giant base64 literal.

Initial intended routes:
- `/` HOME — frozen visual must be implemented separately.
- `/territory` Territory Control — isolated shell only.
- `/territory/outposts` Outpost Map — Alpha24 original, immutable.
- `/territory/reports` Reports — disabled until verified source recovered.
- `/war-room` War Room — pending implementation.

Navigation contract: module links open by the central router; back returns to the correct parent; no route may bypass actual authorization checks. UI disabled routes are not a security mechanism.

Test gates: route target exists, retired-source policy passes, module HTML loads, back navigation works, Android touch checks; Reports additionally requires verified data/export behavior. A passing static test is not a device test.

This contract is not a release approval. No production changes.

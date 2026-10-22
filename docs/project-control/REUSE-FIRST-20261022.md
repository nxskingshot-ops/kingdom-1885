# REUSE FIRST - PHALANX

Status: documented, not an automated CI gate.

Before any integration, inspect the latest binding FREEZEs, GitHub branches and existing library originals. Record exact source version and feature ID. Reuse existing functional code instead of recreating it. If version provenance is uncertain, stop replacement and document the conflict. Do not substitute OUT-024 for Atlas CORE V2. The A039 Territory source already includes Reports functionality and must be evaluated before implementing Reports again.

Changes must remain isolated and tested. Never merge to main, deploy, alter production or incur costs without explicit authorization.

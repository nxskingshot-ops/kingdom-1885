# A039-R8 navigation regression gate (2026-10-22)

Status: SOURCE REVIEWED; BROWSER TEST NOT COMPLETED; NO FIX APPLIED.

Compared library originals A039-R6 and A039-R8. R8 adds War Room, three configurable slots and hash-based destinations. Its openTarget() sets location.hash to 'home', 'map', 'report' or 'pylon'. The R6 HOME route only distinguishes #phalanx-home or empty hash from other states; other listeners must be checked before claiming working navigation. R8 also changes the HOME click handler compared with R6. This is a targeted regression risk, not a confirmed runtime defect.

Required acceptance checks: HOME avatar opens War Room; Back returns HOME; each configured slot opens the intended module; Territory opens correctly; map/reports retain data and actions; browser back works. Preserve the original A039-R8 file. Do not replace with the 2026-10-22 technical shell or older OUT-024. Atlas CORE V2 provenance remains unresolved.

No main merge, deployment, production mutation or extra cost authorized.

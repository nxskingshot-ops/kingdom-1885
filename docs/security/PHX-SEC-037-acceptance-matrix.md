# PHX-SEC-037 – Recovery acceptance matrix

Date: 2026-10-19
Scope: Edge Function source recovery, isolated PR #37.

| Gate | Evidence | Result |
| --- | --- | --- |
| Remove unsafe automatic source push in branch | safety-hold workflow | PASS in branch only |
| Offline inventory preflight | synthetic tests in GitHub Actions 39318490239 | PASS |
| Authenticated encryption fixture | synthetic tests in GitHub Actions 39318490239 | PASS |
| Empty archive and symlink rejection | synthetic tests in GitHub Actions 39318490239 | PASS |
| Existing B2 integration architecture review | workflow inspection documented in storage assessment | REVIEWED, not exercised |
| Complete live Edge Function inventory | no contemporaneous parity evidence | OPEN |
| Maintained independent secret scanner | no integration | OPEN |
| Production source download into restricted workspace | not performed | OPEN |
| Private encrypted offsite upload | not performed | OPEN |
| Remote checksum and encrypted readback | not performed | OPEN |
| Independent recovery-key access | not demonstrated | OPEN |
| Restore drill with real encrypted snapshot | not performed | OPEN |
| Security approval and merge | not authorized | OPEN |

Decision: PHX-SEC-037 is NOT recovery-complete. The old main-branch workflow must not be run without a separate security decision. The draft PR is not a production release.

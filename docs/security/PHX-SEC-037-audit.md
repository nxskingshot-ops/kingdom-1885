# PHX-SEC-037: Edge Function backup review

Date: 2026-10-19
Status: audit only; no fix or test completed.

The manual Edge Function backup workflow downloads deployed sources and pushes them to GitHub after checking only for a private-key marker. This is not sufficient to detect embedded credentials.

Required before enabling the workflow: eliminate automatic publication of unreviewed source; scan in a private temporary workspace with fail-closed behavior; prevent sensitive logs; require explicit approval for sanitized archival; verify all live versions and backup integrity using synthetic tests.

No production changes, restores, workflow executions, or merges are authorized by this audit.

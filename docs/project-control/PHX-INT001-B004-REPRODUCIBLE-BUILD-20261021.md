# PHX-INT001 — Reproducible B004 build (2026-10-21)

Status: TECHNICALLY VERIFIED LOCALLY; source build script not yet committed to GitHub. No deployment, no merge.

An isolated stdlib-only Python builder reads the immutable Alpha24 source, rejects it unless SHA256 equals `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`, embeds its base64 in the B004 `srcdoc` wrapper and refuses output unless SHA256 equals `fbe46c255704dada391754baf5f1f163bcdec3729665905ccaacb6084c003e94`.

Local run passed: the rebuilt B004 HTML and original B004 HTML both have SHA256 `fbe46c255704dada391754baf5f1f163bcdec3729665905ccaacb6084c003e94`. The original Alpha24 map bytes were not modified.

Builder artifact: `/mnt/data/phx_build_b004.py`. Rebuilt artifact: `/mnt/data/PHX-B004-REBUILT-20261021.html`. These are conversation-local artifacts, not GitHub repository files. No HOME source recovery or Reports integration is implied by this build verification.

Next: integrate builder and original into an isolated repository workflow only after confirming the source path; obtain an authorized raw copy of the 20 Oct HOME direct bridge before any combined HOME/Reports build.

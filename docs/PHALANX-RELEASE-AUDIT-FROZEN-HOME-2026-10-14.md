# PHALANX Release Audit – Frozen Home Reference
Date: 2026-10-14

A complete GitHub blob exists at backups/NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html (Git blob SHA e07740b64bf9dacb4df00ad9cdd374c21bd2f244; 435650 bytes per repository inventory). The previously written canonical freeze note states that the source HTML was absent from GitHub; this statement is now outdated. Git blob existence does not yet prove SHA-256 equivalence to the approved original (expected f8e8a4c4a61cdaf89b9b6de8a8c8c906c0cace084e9b54ae6ac5ed4b90fa8031). Compare raw bytes before use.

The frozen file is a wrapper that dynamically fetches preview/nexus-app-2-command-center-portrait-final-polish-test.html from raw.githubusercontent.com, then injects its HOME UI. The runtime therefore depends on an external raw GitHub fetch and the current main branch, which creates reproducibility/offline and version-drift risks. No changes authorized to frozen file.

Security advisor: WARN on SECURITY DEFINER public.phalanx_can_read_alliances executable by anon/authenticated; leaked-password protection disabled. INFO 8 RLS enabled/no-policy tables. Five JWT-disabled edge functions inspected: four custom token checks, one GET-only editor with client login; DB RLS validation pending. SQL policy query blocked by safety checks.

Next: verify canonical SHA-256, pin dependency in isolated derived test, test Android and auth in staging. Status NOT_RELEASE_READY. Production unchanged.

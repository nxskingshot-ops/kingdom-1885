# PHALANX Project Control — 2026-10-21

This directory is a **proposed governance baseline**, not a production deployment.

- `project_state.json` records the latest user-confirmed navigation and asset rules.
- `project_guard.py` is a fail-closed static gate for integrated HTML builds with the expected R6 element IDs.
- The current R6 build **fails** because retired Epic Navigation V2 is still present. Do not treat it as a clean release candidate.

## Local check

Install `beautifulsoup4` in an existing development environment if absent, then run:

```sh
python docs/project-control/project_guard.py /path/to/candidate.html
```

Exit code 0 means the listed **static** checks passed, not that Android interactions or visual layout were tested. Exit code 1 blocks handoff. Do not automatically deploy, merge, or change permissions.

## Scope and limitations

The guard currently targets the R6 integrated HTML structure. Other architectures may fail until the gate is explicitly updated. The FREEZE asset hash for HOME is checked against the embedded `data-original-sha256` attribute, which alone is not an independent trusted digest; pin a verified reference digest before treating it as tamper-proof. PYLON and Territory asset identity checks remain to be added. This branch does not activate GitHub Actions or branch protection.

# NEXUS PHALANX — canonical HOME design freeze
Verified 2026-10-12. Status: authoritative user-approved HOME design reference.

## EXACT reference, recovered from ChatGPT Library
- File: `NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html`
- Source: user's ChatGPT file Library (original file, not GitHub repo)
- SHA-256: `f8e8a4c4a61cdaf89b9b6de8a8c8c906c0cace084e9b54ae6ac5ed4b90fa8031`
- Original bytes: 435650 (UTF-8 encoded).
- The SHA-256 was rechecked on the raw file on 2026-10-12 and matches `backups/nexus-phalanx-home-freeze-2026-10-11.json` exactly.
- The GitHub backup manifest alone does **not** contain the frozen HTML. Recover the file from Library when code changes are needed.

## Key distinction: two separate visual freezes
**HOME / Command Center landing page** = 11-Oct file above, featuring fantasy art, gold-laurel silver-helmet player avatar, personal FaQu profile, DE/EN/FR, Quick Access tiles, Kingdom Status and its existing navigation/layout.
**KvK intelligence / Opponent Intelligence & Battle Readiness** = the older `preview/nexus-app-2-command-center-portrait-final-polish-test.html` and `docs/KVK_INTELLIGENCE_LAYOUT_FREEZE_2026-10-03.md`, covering opponent comparisons and the historical 04-Oct opponent snapshot.

The old KvK HTML is NOT the frozen HOME entry. The subsequent Alpha10 / Alpha11 tests erroneously treated it as Home, were rejected by the user, and must not be reused as Home masters.

## Why accidental duplication happened
The frozen HOME HTML is an integration wrapper: on execution it loads the older KvK HTML, then augments it with the HOME dashboard, profile, customizable quick access and navigation using an embedded script and image assets. Its GitHub dependency on the older KvK markup does not make the older markup the intended landing page.

## Immutable rules
1. Never overwrite or restyle the user-approved 11-Oct HOME reference.
2. Start new HOME work from a byte-for-byte copy of the checksum-verified Library HTML, not from an approximate lookalike.
3. Attach new Intelligence functions behind existing appropriate controls only, in a separate derived test file.
4. Do not introduce new top-level tiles, alternative headers, layout variants or navigation as a shortcut.
5. Keep the frozen KvK sub-page as a **separate** frozen reference for its own area.
6. Preserve historic opponent timestamp; do not label 04-Oct-2026 #1913 as a live/current opponent.
7. The old test app and production stay untouched. Visual equivalence must be confirmed on Android before approval.
8. Do not claim this Home reference is already live in GitHub Pages: the actual HTML was recovered from Library and was absent from the backup commit.

## Additional project references
- `backups/nexus-phalanx-home-freeze-2026-10-11.json`
- `docs/nexus-app-2-design-freeze.md`
- `docs/KVK_INTELLIGENCE_LAYOUT_FREEZE_2026-10-03.md`

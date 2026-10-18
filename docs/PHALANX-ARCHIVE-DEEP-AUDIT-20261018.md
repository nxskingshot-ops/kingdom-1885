# PHALANX — Archive deep integrity audit (2026-10-18)

All below were downloaded as original bytes from the ChatGPT Library and inspected read-only in an isolated temporary workspace. ZIP CRC test passed for all six. **CRC is not the same as a full recovery test.**

| Archive | ZIP entries | Embedded checksum checks | Result |
| --- | ---: | --- | --- |
| `REFERENZBILDER_FREEZE_2026-10-13.zip` | 15 | **13/13** assets match internal SHA-256 and byte-size index | PASS |
| `NEXUS_PHALANX_PROJEKT_BACKUP_2026-10-13_FINAL.zip` | 12 | **10/10** payload entries match `CHECKSUMS.json` | PASS |
| `NEXUS_PHALANX_EPIC_NAVIGATION_V2_FREEZE_BACKUP_2026-10-15.zip` | 5 (including directory) | 2 HTML payloads match included `SHA256SUMS.txt`; both identical SHA-256 `635053c7bd5c846ef66a941d71c4915ce1dba95bc1198e56d27904be19b6d505` | PASS |
| `ALPHA35_FUNCTION_FREEZE_BACKUP_2026-10-13.zip` | 2 | HTML matches separate Library original and historical freeze SHA-256 `22336f5ec5cd438b1dbf3058f3820d4038df5f3e8f94061d8f15932cc74fc6ba` | PASS |
| `ALPHA23_FREEZE_BACKUP_2026-10-13.zip` | 3 | HTML SHA-256 `e8109617ef6d4578f4bfd7ca3a519bceedbae0850b432e6f27e24ef2d82fe0b0`; historical, **NOT** the current Alpha24 | CRC PASS; semantic/historical hash reference still to reconcile |
| `FOUR_APPROVED_MASTER_CARDS.zip` | 5 | No independently verified checksum manifest | CRC PASS only |

## Critical distinctions
- Alpha23 is a historical FREEZE, while user-approved current OUT-024 has SHA-256 `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`.
- Reference image index contains **13 logical image records**, while its ZIP has 15 entries because it also includes 2 index files.
- The 13 image records include two pairs of byte-identical image files with different descriptive roles. Deduplication must **not** delete approval/provenance entries.
- The project ZIP contains nested prior FREEZE ZIPs and is **not** a full GitHub/Supabase/Cloudflare recovery package.
- 2026-10-15 Epic Navigation FREEZE is preserved, but current 2026-10-16 HOME/header decisions must be checked separately; a 15.10 backup is not automatic evidence of 16.10 final design.
- No change was made to Library originals, Supabase, Cloudflare, production or frozen code.

## Next checks
1. Retrieve and hash remaining Library ZIPs (data snapshots, alliance originals, Top100, MightPulse).
2. Reconcile the 74 historical feature records against current source and actual tests.
3. Inventory all 26 deployed Edge Functions and preserve matching source, without secrets.
4. Establish cold-start, referential-integrity and safe isolated restore acceptance tests.

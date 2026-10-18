# PHALANX Library original-byte integrity checks — 2026-10-18

**Scope:** Five Library objects materialized as raw bytes into a temporary audit workspace. SHA-256 calculated on those bytes. ZIP CRC checked using `ZipFile.testzip()`. This is a **file integrity test**, not a complete restore, semantic design approval, or external redundancy verification.

| Library artifact | Bytes | SHA-256 | Verification |
| --- | ---: | --- | --- |
| `Design Freeze/NEXUS_PHALANX_HOME_ORIGINAL_2026-10-11.html` | 435650 | `f8e8a4c4a61cdaf89b9b6de8a8c8c906c0cace084e9b54ae6ac5ed4b90fa8031` | MATCH historical canonical HOME manifest |
| `Design Freeze/Alpha35 Function Freeze/NEXUS_PHALANX_ALPHA35_FUNCTION_FROZEN.html` | 1912593 | `22336f5ec5cd438b1dbf3058f3820d4038df5f3e8f94061d8f15932cc74fc6ba` | MATCH historical Alpha35 freeze manifest |
| `Recovered Originals/OUTPOST_MAP_ALPHA24_USER_CONFIRMED_20261018.html` | 1105961 | `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d` | MATCH historical OUT-024 canonical lock |
| `Design Freeze/Zentrale Referenzbilder-Datenbank/REFERENZBILDER_FREEZE_2026-10-13.zip` | 21646308 | `74862a826c12515e232b53f772403ad79d58c3f18ce836940a9d39c50f772d39` | ZIP 15 entries; CRC all pass. Individual inner manifest hashes not yet cross-checked |
| `Backups/2026-10-13 Projektstand/NEXUS_PHALANX_PROJEKT_BACKUP_2026-10-13_FINAL.zip` | 15578998 | `3b9196800eb2795a69188111de499c2b4f1b6bb008584bc8fe1de791d4eb64c0` | ZIP 12 entries; CRC all pass. Not proof of full-project coverage |

**Important:** The historic project ZIP contains only 12 entries, including a consolidated app HTML and alliance assets; it is not a full Git/Supabase/Cloudflare disaster-recovery image. Treat name 'FINAL' as historical filename only.

**Current gaps:** Compare all internal image hashes against reference index; verify current 16.10 header/PYLON/HOME approvals; verify ZIPs for Epic Navigation/Alpha35 and others; verify independent backup copy, B2 recent backup and isolated restore; preserve all 26 deployed Edge Function sources safely.

**No production or freeze modification.** The originals were read only.

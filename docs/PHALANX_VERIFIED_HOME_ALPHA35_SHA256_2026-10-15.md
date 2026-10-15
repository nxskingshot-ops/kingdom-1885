# Verified original artifacts — release gate passed (2026-10-15)

Both files were retrieved from the user's ChatGPT Library and their **raw bytes** independently SHA-256 hashed locally.

| Original | Bytes | SHA-256 | Match |
|---|---:|---|---|
| NEXUS_PHALANX_HOME_ORIGINAL_2026-10-11.html | 435650 | `f8e8a4c4a61cdaf89b9b6de8a8c8c906c0cace084e9b54ae6ac5ed4b90fa8031` | YES |
| NEXUS_PHALANX_ALPHA35_FUNCTION_FROZEN.html | 1912593 | `22336f5ec5cd438b1dbf3058f3820d4038df5f3e8f94061d8f15932cc74fc6ba` | YES |

## Integration implications
- Original HOME is a wrapper that fetches older KvK HTML from GitHub main. This is a runtime dependency; avoid mutating the original and pin in a derived build.
- Alpha35 contains its own HOME and the embedded Outpost Map payload, opened with `window.phOpenOutpost()` and closed with `window.phCloseOutpost()`; it already has functional navigation. It does not directly contain MightPulse.
- Avoid adding a second landing page or duplicating the header. Reuse existing navigation in a derived, isolated RC.
- MightPulse has an existing menu-mounted Android-tested proof of concept, but not yet a verified canonical HOME integration.
- Before any deployment, test authentication, untrusted data rendering, offline behavior, Android layout and back navigation.

**Gate status:** Original-file authenticity PASS. Combined RC navigation and security checks PENDING. No production files, GitHub main, Supabase, or frozen assets changed.

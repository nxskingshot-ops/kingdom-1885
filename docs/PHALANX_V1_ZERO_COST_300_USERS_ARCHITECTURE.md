# PHALANX V1 – ZERO-COST TARGET FOR 300 USERS
Decision requirement recorded 2026-10-14: PHALANX **should remain free for the owner and all players at 300 registered accounts**. This is a hard design target, **not a proven capacity or guarantee**. No paid service, billing enablement or tier upgrade without explicit approval.

## Architecture recommendation (subject to implementation validation)
- Local-first personal heroes, troop inventory, marches, user preferences and draft screenshots in IndexedDB on each device. Use explicit schema versions, migration, checksums and clear offline/eviction warnings.
- Free local export/import first; optional encrypted user-owned Google Drive backup only after consent, Google OAuth integration and quota/billing review. Google Drive is **not required** for V1.
- Supabase only for existing login, roles and shared alliance/KvK intelligence, plus minimal account metadata where needed. Do not centrally store raw screenshots by default.
- Process image extraction locally when technically feasible; otherwise explicit consent, temporary transfer, strict size limits and deletion. No promise of free cloud OCR/AI.
- 'Frag PHALANX' first uses deterministic local calculation tools; optional paid external AI must never be silently enabled.
- Warn that PWA IndexedDB is **not a durable backup** and device/browser clearing may erase it; export is a V1 safety gate.
- Implement quota monitoring and fail-safe rejection/degradation rather than unexpected upgrades.

## Public vendor quota reference (checked 2026-10-14)
Supabase Free: 50,000 monthly active users, 500 MB database, 1 GB storage, 5 GB egress, 500,000 Edge Function calls/month. Source: https://supabase.com/docs/guides/platform/billing-on-supabase
Google Drive API standard usage currently no additional charge, but API quotas apply and Google has announced billing for exceeded quotas later in 2026: https://developers.google.com/workspace/drive/api/guides/limits
These are platform-wide limits, not a prediction of actual PHALANX traffic.

## Release verification
Simulate 300 active accounts, worst-case reads/writes and image processing; track monthly network egress, DB size, invocation counts, storage and PWA cache; verify free-tier status in actual dashboard and use no paid resources. Ensure user data stays private. If projected free quotas are exceeded, reduce traffic/features before asking for authorization; never auto-upgrade.

## Impact on earlier plan
The earlier proposed Supabase per-user hero/troop/upload schema is **not the default V1 architecture**. It remains a draft, not applied. Local-first profile storage and export/import take priority. User identity and RLS remain relevant for shared services.

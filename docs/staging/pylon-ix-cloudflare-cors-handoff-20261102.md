# PYLON IX – Cloudflare CORS deployment handoff (2026-11-02)

Status: **NOT DEPLOYED**. Direct Supabase deployment was blocked by platform safety checks. Do not claim the player lookup is fixed.

## Verified live baseline
- Supabase project: `hcjrdofkdkasznywvcxo`
- Function: `phalanx-transfer-id-snapshot-fallback-stage-20261031`
- Live version before attempted change: **14**, `verify_jwt=true`.
- The actual live source was fetched from Supabase. Do **not** replace it with the older GitHub `preview/transfer-id-snapshot-fallback-stage-20261031.ts`; they differ.
- Live source uses `const allowedOrigins=new Set([...]);`, `const corsHeaders=...`, explicit origin rejection and authenticated membership/quota checks.

## Approved change – only these two lines
Insert immediately **after** the existing `const allowedOrigins=new Set([...]);` declaration and **before** `const corsHeaders=`:

```ts
allowedOrigins.add('https://9e99bc03.nexus-phalanx-kvk-test.pages.dev');
allowedOrigins.add('https://phalanx-cloudflare-test-depl.nexus-phalanx-kvk-test.pages.dev');
```

No other changes. Keep JWT verification, membership authorization, quota and existing allowed origins. User explicitly approved only these two origins.

## Verification gates
1. Preserve a copy of **live V14** before deployment; verify the complete source differs only by the two added lines.
2. Deploy through authorized Supabase dashboard or an authorized tool; confirm new function version and `verify_jwt=true`.
3. Send an unauthenticated OPTIONS preflight with `Origin: https://9e99bc03.nexus-phalanx-kvk-test.pages.dev` and `Access-Control-Request-Headers: authorization,apikey`; verify 204 and matching `access-control-allow-origin`.
4. Verify a non-allowlisted origin is still rejected; do not expose player data.
5. Android browser: load `/pylon-ix/transfer-scouting-id-stage-20261030.html`, sign in with authorized account and test player ID `290492605`. No claim of success without a real response.
6. On failure, restore saved V14 source through the same authorized route and retest.

## Protected scope
No database writes, no Auth/RLS/role changes, no new function, no production frontend changes, no new costs. Cloudflare deployment is already live; CORS remains the blocker.

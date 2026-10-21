# PHX-INT001 B004 – map interaction smoke

Status: TECHNICALLY TESTED (isolated browser with mocked API), NOT DEVICE TESTED, NOT RELEASED.

Source B004 SHA256 `fbe46c255704dada391754baf5f1f163bcdec3729665905ccaacb6084c003e94`. Embedded Alpha24 original SHA256 `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`; decoded bytes match frozen original exactly.

Chromium/Playwright 390x844. Public outposts API request intercepted with two synthetic records (NXS, FRA), no live data fetched.

PASS: iframe map loads; 2 outposts and 2 interactive SVG markers rendered; alliance filter NXS shows 1/2; zoom-in changes scale to 1.5; reset shows 2/2; no top-level JavaScript errors.

NOT TESTED: real Supabase request, RLS, marker details, coordinate copy, fullscreen, touch gestures, Reports, HOME bridge, Android device, production readiness.

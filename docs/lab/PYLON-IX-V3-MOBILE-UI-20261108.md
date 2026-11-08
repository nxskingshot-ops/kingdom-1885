# PYLON IX V3 — isolated mobile laboratory UI
Date: 2026-11-08
Branch: lab/pylon-ix-v3-20261108
HTML: lab/pylon-ix-v3/index.html
Commit: 4c14c77aecf6d991e19552e9093ac6f6f460c5cf

## Implementation
Compact dark bronze/red/gold lab interface, responsive CSS for mobile, player selector for 10 historical fixtures, English assessment summary, ranks, evidence coverage, strengths, relative development gaps, strategic interpretation, roles marked REVIEW ONLY, missing rankings, historical NOT LIVE banner, clipboard report action.

The HTML imports the actual independent lab report.mjs module and loads the historical fixture via a relative path. It does not import Queen An's staging app, invoke Supabase, or write to storage.

## Checks
Fetched GitHub HTML blob 85c02359ceb46f427b9e464093c8ff7dcee703b9 and checked 10 structural properties, all passed: HTML presence, mobile CSS, accessible selector, historical warning, module import, fixture path, safe textContent assignment, no innerHTML, no Auth/DB references in inline JS, 10 fixture players.

## Not tested
Browser execution, network loading of modules and fixture, clipboard permissions, Android viewport and touch usability, screenshots, CI/Node test runner, public HTTPS deployment, live data and authenticated access. Structural checks are not browser tests.

## Deployment note
The GitHub source link is a code view, NOT a running website. A static server must serve the repository with correct MIME types for .mjs and the JSON fixture; direct file:// opening may fail due to module/CORS restrictions.

## Protection
No merge, no staging or production deployment, no Supabase changes, no data writes, no changes to Queen An's frozen app or design FREEZEs.

## Next
Run isolated browser and Android verification, then publish a separate lab-only HTTPS preview if approved and infrastructure access is verified. Do not use Queen An's fixed URL.

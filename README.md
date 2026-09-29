# Kingdom #1885 · Nexus (NXS)

This repository contains the Kingdom #1885 web app and its approved Nexus visual system.

## Approved integrated app preview

**[Open Kingdom #1885 — Nexus app](https://nxskingshot-ops.github.io/kingdom-1885/preview/kingdom-hub-menu-test.html)**

This existing preview preserves the agreed **NXS green-and-gold crest**, shared header, exact alliance motto and parchment-and-gold visual style. It includes:

- **Outpost Map:** embeds the existing public read-only map viewer. It does not replace the source map.
- **KvK Prep:** embeds the original protected dashboard with its existing login and data access logic.
- **Transfer Scouting:** embeds the existing fictional interactive demo board, including candidate comparison and editable estimated transfer information. Sample data is **not** live member information.
- A shared keyboard-dismiss button.

**Current tester preview (29 September 2026):** The shared NEXUS test app includes the Outpost Map, Outpost Editor, KvK Prep (Dashboard, KvK Controlling, Alliance Comparison, Alliance Trends), Transfer Scouting DEMO and LIVE, and Contact & Feedback. Protected sections require approved NXS membership; the preview does not mean permissions have been certified for every tester. Provisional roster aggregates are distinct from real-time game data.

**Do not confuse this with a production member portal.** Membership permissions for the eventual live scouting module and any editing roles must be separately implemented and verified. A successful preview load does not certify authentication or sync.

## Design contract

See [DESIGN_STANDARD.md](DESIGN_STANDARD.md). Its canonical base layout is [preview/kingdom-hub-branded-v2.html](preview/kingdom-hub-branded-v2.html). The integrated preview above extends that approved header while retaining the original map and protected KvK module.

Do not create another generic app shell, replace the NXS crest with the PWA icon, publish invented data as real, or overwrite the established map/dashboard. Validate mobile and desktop before promoting a preview.

## Install on phones and desktops

Once the finalized main application is deployed as a PWA, open its **production** URL and use the browser's **Install app / Add to Home screen** option (mobile) or **Install** action (desktop, where supported). This preview link is for testing and should not be presented as the finished installed application.

# PHALANX Outpost Atlas — PHX-OUT-024 · CORE V2

Isolierte, modularisierte Weiterentwicklung der unveränderten Alpha24-Referenz.

- Anzeigename: **Outpost Atlas**
- Feature-ID: **PHX-OUT-024** (stabil)
- Technischer Stand: **CORE V2**
- Quellreferenz: eingefrorene Alpha24; SHA256 siehe manifest.json
- Keine produktive Freigabe, kein Live-Datenanbieter, kein Deployment.

## Architektur
`index.html` UI, `map.css` Design, `map-core.js` Interaktion, `map-layout.js` Layout, `core/provider.js` autorisierte Datenquelle, `core/data-contract.js` Validierung, `assets/` originale Bilder.

## Erweiterungsregeln
Neue Datenanbieter ausschließlich über `window.PHALANX_OUTPOST_DATA_PROVIDER`; Berechtigungsprüfung muss im autorisierten Backend erfolgen, nicht nur im Browser. Zusätzliche Datenfelder benötigen versionierten Vertrag und Migration. Vor Austausch der Alpha24-Integration: Regressionstest von Zoom, Pan, Pinch, Suche, Filtern, Markern, Details, Vollbild, mobilen Ansichten und Berechtigungen.

`npm test` führt Datenvertragstests aus. Lokale statische Vorschau erfordert einen HTTP-Server; ohne Anbieter werden bewusst keine Live-Outposts gezeigt.

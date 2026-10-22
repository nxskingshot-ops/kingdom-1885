# PHX M1 – R11 Import Invalidation (2026-10-22)

Status: IMPLEMENTIERT im lokalen R11-Arbeitspaket; GitHub-Atlas-Bridge implementiert; vollständiger End-to-End-Browsertest OFFEN. Keine Freigabe oder Produktion.

## Nachvollziehbarer Ablauf
- Atlas CORE V2 erhält Outposts ausschließlich über den ausdrücklich autorisierten Host-Provider und validiert Datensätze.
- R11 widerruft beim Beginn jedes neuen Importversuchs die vorherige Provider-Freigabe und löst `phx-outpost-provider-changed` aus – auch wenn die neue JSON-Datei ungültig ist.
- Die isolierte GitHub-Bridge (`src/phalanx/integration/PHX-A045-R11-ATLAS-ROUTE.js`, Commit e7dbad64f66351c40cf328886221b70070176da2) reagiert auf dieses Ereignis mit Rücknahme von `ready`, Rollback auf die bisherige Karte und Atlas-Neuladen.
- Nach erfolgreicher Validierung aktiviert R11 den Provider erneut; Atlas meldet `PHX_ATLAS_CORE_V2_DATA_READY` nach erfolgreicher Datenübernahme. Der Host akzeptiert nur Meldungen vom erwarteten iframe mit identischer Origin.

## Nachweise und Grenzen
- Lokales Archiv: `PHALANX_M1_R11_IMPORT_INVALIDATION_20261022.zip`; zwei betroffene Skripte bestehen `node --check` laut lokalem Prüfstand.
- Das komplette lokale R11-HTML wurde noch nicht als verbindlicher GitHub-Quellstand integriert.
- Der vollständige Browserpfad HOME → Territory Control → Outpost Atlas, JSON-Import, Filter, War Room ist NICHT als End-to-End bestanden nachgewiesen.
- Browserumgebung blockiert lokale HTTP-/Datei-Navigation; Einzel- und Bridge-Tests sind kein Ersatz für Geräteabnahme.

## Sicherheits- und Designgrenzen
Kein Produktionsdeployment, main-Merge, Rechteänderung oder Kosten. Aktuelle HOME-/Header-FREEZEs unverändert; Epic Navigation V2 bleibt ausgemustert. GOD MODE nicht als implementiert ausgeben.

## Nächste Umsetzung
R11-HTML anhand des verifizierten aktuellen GitHub-Quellstandes in einem isolierten Integrationsbranch abgleichen; danach vollständigen Browser-/Android-Test durchführen. Keine alte Outpost-Map integrieren.

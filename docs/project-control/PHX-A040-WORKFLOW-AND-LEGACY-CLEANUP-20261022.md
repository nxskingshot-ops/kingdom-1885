# PHX-A040 — Arbeitsstruktur und Legacy-Bereinigung
Status: DOKUMENTIERT, isolierter Branch, nicht produktiv.

## Aktive Quellen
A039-R11 Library Original: neuer HOME/Territory/War Room Integrationskandidat; nicht gerätegetestet.
Atlas PHX-OUT-024 CORE V2: work/phx-version-hygiene-20261021 / src/phalanx/outpost-atlas/; modularer Kartenkandidat, ohne Live-Datenanbieter.
Alpha24 OUT-024: FROZEN-REFERENCE; nicht löschen oder als CORE V2 ausgeben.

## Nicht erneut aktivieren
Epic Navigation V2: RETIRED nach Governance-Handoff.
A039-R8: historischer Kandidat, nicht anstelle R11 verwenden.
Alpha19-Kartenbestandteile in R11: Legacy, erst nach Atlas-Ersatz aus aktiven Wegen entfernen.
Reports V11: veraltete Viewer-Abhängigkeit; nicht als aktives Reports-Modul einsetzen.
Territory B001/B002/B003: historische Hüllen, nicht als vollständige App behandeln.

## Verbindlicher Ablauf
1. START-HERE und neuesten FREEZE lesen.
2. Neueste tatsächliche Originalquelle und Feature-ID verifizieren.
3. Bestehende Implementierung wiederverwenden, keine Ersatzhüllen.
4. In einem isolierten Integrationspaket zusammenführen.
5. Nur betroffene Routen, Datenrechte und Regressionen testen.
6. Register und Handoff nach erfolgreicher Integration aktualisieren.

## Offen
R11 gegen Atlas API und Reports abgleichen; Atlas-Datenanbieter nur autorisiert; Browser- und Android-Test; HOME-Artwork original archivieren.
Keine destruktive Löschung, main-Merges, Deployments, Rechteänderungen oder Kosten ohne Freigabe.
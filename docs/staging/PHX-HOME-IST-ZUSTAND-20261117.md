# PHALANX HOME — IST-Zustand · 17.11.2026

Status: BESTANDSAUFNAHME · keine Designänderung, keine Produktivfreigabe.

## Belegbasis
- `docs/staging/PHX-HOME-FINAL-ABNAHME-20261116.md`
- `docs/staging/PHX-HOME-ANDROID-DESIGN-AUDIT-20261117.md`
- `docs/staging/PHX-WAR-ACADEMY-UEBERGABE-20261117.md`
- `android-stage/scripts/integrate-home-v25.py`
- `android-stage/www/phx-war-room-v2.js`
- `.github/workflows/phx-home-final-device-test.yml`
Alle Aussagen beziehen sich auf die geprüften Quellen und die dort dokumentierten Tests, nicht auf einen in dieser Bestandsaufnahme neu ausgeführten Gerätetest.

## Schutzbestand
- HOME Queen-An Originalgrafik, Unified Header V2, Epic Navigation V2 RC5, HOME-FREEZE und PYLON IX Emblem nicht ändern.
- Profilname, Königreich und Allianz aus autorisierter Spieler-ID-Verknüpfung; niemals #1885/NXS/FaQu hartkodieren.
- HOME-Levelzeile absichtlich ausgeblendet; War-Room-Level nicht mit HOME-Regel verwechseln.
- Territory Control und Outpost Map 2.0 mit 74 Einträgen, Filter, Zoom, Vollbild, Quadranten und JSON/CSV schützen.
- Keine produktiven Eingriffe, Rollen- oder Datenänderungen.

## Bestand und Nachweise
| Element | IST | Nachweisgrenze |
|---|---|---|
| Queen-An HOME-Grafik | BESTANDEN | Originaldatei-Prüfsumme laut Abnahmeprotokoll |
| Profilplaketten | BESTANDEN im früheren physischen Gerätetest | Name/Königreich/Allianz aus bestätigtem Profil; aktuelle neue APK noch nicht vollständig abgenommen |
| HOME-Level | BESTANDEN | absichtlich unsichtbar |
| HOME -> War Room -> HOME | BESTANDEN im Chromium | vollständiger neuer physischer Gerätetest offen |
| HOME -> Territory Control / Reports | BESTANDEN im Chromium | Android-Ende-zu-Ende offen |
| HOME -> PYLON IX -> Transfer -> PYLON -> HOME | BESTANDEN in 12 Chromium-Prüfgruppen | Android-Systemzurück im aktuellen HOME-Build offen; früherer Emulatorlauf fehlgeschlagen |
| Outpost Map / Exporte | BESTANDEN im Browser mit aufgezeichneter 74er Antwort | erneute native Dateiprüfung im aktuellen HOME-Build offen |
| War Room Account Intelligence | teilweise integriert | Spieler-ID und Erfassungsdatum im Dossier; Alliance Position und historischer Fortschritt offen |
| War Academy / T11 | zurückgestellt | unbekannte Werte als UNKNOWN, keine erfundenen Daten |

## Offene visuelle Befunde
1. FEHLGESCHLAGEN: Grauer Streifen oberhalb der HOME-Grafik auf physischem Android; Ursache noch unbekannt. Vor CSS-Änderung Native WindowInsets, WebView-Viewport und DOM-Rects messen.
2. OFFEN: ungenutzter Raum unter Command-Center-Kacheln. Nicht mit unbeauftragten Modulen auffüllen.
3. OFFEN: HOME-/War-Room-Layout nach Login, Rückkehr und Kaltstart im neuesten Testpaket auf realem Gerät abnehmen.

## Reihenfolge der Fortsetzung
1. Exakten GitHub-HEAD und Android-APK-Quellstand inkl. SHA prüfen; Baseline und Wiederherstellungsweg bestätigen.
2. Aktuelle HOME-Ansicht auf Android mit Screenshots und WebView-Geometrie erfassen, grauen Streifen lokalisieren.
3. Optische Korrektur nur am nachgewiesenen Verursacher auf isolierter Kopie.
4. HOME-Navigation, War Room, PYLON IX, Transfer und Outpost-Exporte auf Android erneut prüfen.
5. Abnahmeprotokoll und offenen Punktestand aktualisieren; keine Freigabe ohne vollständige Nachweise.

## Prüfstatus dieser Bestandsaufnahme
- Quell-/Protokollsichtung: BESTANDEN
- Neuer Android-Build: NICHT GETESTET
- Neue Browserregression: NICHT GETESTET
- Neuer physischer Android-Test: NICHT GETESTET
- Backup in dieser Runde erstellt: NEIN
- Produktivänderung: KEINE

## Physischer HOME-Screenshot 50388.png · Sichtprüfung
- Sichtbar: großer grauer Leerbereich oberhalb der Queen-An-Szene; keine Systemstatussymbole in diesem Bereich. Ursache ohne WindowInsets-/DOM-Messung ungeklärt.
- Sichtbar: obere Plaketten `FaQu` und `#1885 · NXS`, War-Room-Einstieg links; keine HOME-Levelzeile. Die Datenfrische/Spieler-ID-Bindung ist allein aus dem Bild nicht beweisbar.
- Sichtbar: Queen-An-Motiv, PHALANX-Logo, sechsfeldrige Navigation (Home, War Room, Command Center, Territory Control, Reports, PYLON IX) und DE-Auswahl. PYLON-Eintrag zeigt ein schlichtes Lambda; Abgleich mit freigegebenem PYLON-IX-Emblem erforderlich.
- Sichtbar: vier Command-Center-Banner (KvK Vorbereitung, Territory Control, Transfer Scouting, Allianzvergleich). Drei tragen `Anbindung folgt`; daraus ist keine tatsächliche Modulabwesenheit abzuleiten. Territory-Control-Banner trägt `Outposts & Reports`.
- Sichtbar: sehr großer ungenutzter unterer Bildschirmbereich sowie hohe Navigationsfläche; Gestaltungsentscheidung noch offen.
- BELEGT: Die bereits installierte Android-App kann HOME darstellen. NICHT BELEGT: Aktualität der APK, Modulnavigation, Live-Profil, Rücktaste, Exporte und persistente Speicherung.
- Schutz: Keine Änderungen an Originalgrafik oder FREEZEs vor gezielter Ursachenmessung. Screenshot ist vom Nutzer bereitgestellt und wird nicht als Repo-Bilddatei kopiert.

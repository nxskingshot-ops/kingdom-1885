# HOME · freigegebene kompakte Gestaltung · 18.11.2026

Status: IN ISOLIERTER WEBVORSCHAU BEREITGESTELLT UND IM BROWSER GEPRÜFT. Neue physische Android-Gestaltungsabnahme offen.
Freigabe: Nutzer „Go“ zum Vorschlag Live-Profil im War Room, dezenter Kontozugang, kompaktere Navigation, korrektes PYLON-IX-Emblem; Queen-An-Grafik und vier Banner erhalten.
Ausgangscommit der festen Webvorschau: 4a762ee43d2f15eb3af78eed672662726c5007b9. Vorheriger Webdeploy 583fa3fb0e0a6379aac278af29c6c9777ecf5c44.

## Änderungen / geschützter Bestand
- Ein einziges bestehendes Kontoformular bleibt im Account-Intelligence-Bereich des bestehenden War Rooms.
- HOME-Kontozugang öffnet den bestehenden War-Room-Einstieg und dort das Kontoformular. Kein zweites Auth-System, keine lokale Kopie der Identität.
- HOME zeigt eine schmale Zeile mit Sprache und Sign in / Account. Kein großer Live-Profilblock mehr auf HOME.
- Alle sechs bisherigen Navigationsziele bleiben erhalten; zwei flache Reihen mit 44px Mindestbedienhöhe, einzelnen Bronze-Konturen und vorhandenen Original-Icons. Die hohe äußere Tabellenumrahmung entfällt.
- PYLON-IX-Button verwendet die vorhandene freigegebene Originalgrafik aus #phx-pylon-modal img, deren Original-Badge oben rechts durch SVG-viewBox 882 34 132 132 gezeigt wird. Keine neue Emblemzeichnung, keine Bildänderung. Quelle 1024 × 1536, roter Schild, goldenes Lambda/Lorbeer, IX.
- Queen-An-PNG, HOME-Basis-HTML und vier Command-Center-Banner unverändert. Territory-Control-Gestaltung, Karte, Reports, War-Room-Original und bestehende Router nicht verändert.
- Sitzungserhaltung, Refresh, Logout, autorisierte Spieler-ID und Origin/JWT-Prüfung bleiben erhalten.
- Betroffene Dateien: android-stage/www/phx-war-room-live.js, phx-war-room-live.css; mobile Browserprüfung test-home-session-browser.cjs. Keine Backend-/RLS-/Rollen-/Datenänderung.

## Sicherung
BACKUP ERSTELLT: Git-Ref backup/phx-home-before-compact-20261118 auf Ausgangscommit, zusätzlich lokales TAR der betroffenen Bestandsdateien.
INTEGRITÄT / LOKALER RÜCKWEG: separate Extraktion und Bytevergleich mit Git-Ausgangsstand. Gehosteter Rollback NICHT GETESTET.
Feste URL unverändert: https://home-plaque-visual-20261117.nexus-phalanx-kvk-test.pages.dev/
Keine main-Änderung oder produktive Veröffentlichung.

## Prüfumfang
- BESTANDEN: 10 Sitzungstests, 14 bestehende Origin-/Profil-Handler-Tests, Asset-Prüfsummen, Syntax, diff --check.
- GEPLANT vor Veröffentlichung: 320/393/430px, kompakte Navigation ≤100px, sechs Ziele, Originalbild-Verknüpfung des IX-Badges, Sprache sichtbar, kein Kontoformular auf HOME; Login/Reload/Token-Erneuerung/Logout/falsche Anmeldung; War Room, Territory, Map, Reports, PYLON und Rückwege.
- NICHT GETESTET: neue physische Android-Abnahme, lange Namen, native Exporte, vollständige Transfer-/Rollenregression. Keine Gesamt-FERTIG-Aussage.
- Vorhandene offene Integrationen (Transfer-Zugang, Map-Exportschicht, War-Room-Assessment/Alliance Position/Development) bleiben unverändert im Register.

## PYLON-Wissensdelta
HOME-Konto führt in den bestehenden War Room, gleiche Sitzung und autorisierte Profilquelle; alle sechs bisherigen Navigationsziele erhalten; HOME-PYLON-Button referenziert das existierende Original-Badge. Wissen im Git-Projektregister dokumentiert; automatische Übernahme durch eine PYLON-Laufzeit NICHT GETESTET und nicht behauptet.

## Ausführung und Nachweise

Status: AUF FESTER TESTADRESSE BEREITGESTELLT UND IM BROWSER GEPRÜFT. Neue physische Android-Gestaltungsabnahme offen.

- Quellcommit **3fc690c6cbb45f490c250cdcd4a66cab1828ecbe**.
- [Workflow 44248629689](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44248629689), Job 134613585414: BESTANDEN. Deployment 2505497d, veröffentlicht **18.11.2026 06:05:22 UTC**, fester Alias unverändert.
- BESTANDEN bei **320 / 393 / 430px**: Navigationshöhe ≤100px, alle sechs Ziele vorhanden, vier bestehende Banner, Sprache sichtbar, IX-Badge referenziert exakt den eingebetteten Original-Bildstring, kein Kontoformular im HOME-DOM.
- BESTANDEN je Breite mit simulierten Auth-/Profildaten: Anmeldung im War Room, Wiederaufnahme nach Reload, Erneuerung abgelaufenen Tokens, Aktualisieren, Abmelden/Reload, fehlgeschlagene Anmeldung.
- BESTANDEN je Breite: War Room und Zurück; HOME → Territory → Map → Territory → Reports → Territory → HOME; direkte Reports aus HOME und Rückweg; HOME → PYLON → HOME; Home- und Command-Center-Schaltfläche.
- Echte Cloud-Browser-Sitzung wiederverwendet, ohne neue Zugangsdatenabfrage: nach Neuladen bestätigte Identität FaQu / 291410048 / #1885 / NXS. Account öffnet War Room mit Live-Profil (Power 194862455, Quellzeit 06:03:55 UTC, Checked 06:05:45 UTC). Danach War-Room-Seite neu geladen und nach HOME zurück: Identität erneut angezeigt; kein Passwort erforderlich.
- Live-DOM-Messung: sechs Navigationsbuttons, **93px** Navigationshöhe, Original-Badge vorhanden. HOME-Screenshot erfasst. Keine mobile Emulation dieses Cloud-Browsers behauptet.
- Geschützte HOME-Basis und Queen-An-PNG bestanden die vorhandenen Prüfsummenprüfungen. Original-Bildbytes, Banner und Territory-Control-Code wurden nicht verändert.
- Die CI-Screenshots der mobilen Browsergrößen liegen im Workflow-Artefakt phx-home-session-mobile-evidence (begrenzte Aufbewahrung). Langfristiger Prüfstatus ist in diesem Git-Protokoll festgehalten.
- NICHT GETESTET: neue physische Android-Sichtprüfung, lange Namen, native Funktionen/Exporte und vollständige Transfer-/Rollenmatrix. Vorhandene offene Module/War-Room-Funktionen bleiben offen.
- Nächster Schritt: Nutzer-Sichtprüfung dieser freigegebenen HOME-Gestaltung am gleichen Weblink; anschließend weitere HOME-/Namensprüfung und bestehende War-Room-/Modulintegration in der vereinbarten Reihenfolge. Kein Gesamt-FERTIG.

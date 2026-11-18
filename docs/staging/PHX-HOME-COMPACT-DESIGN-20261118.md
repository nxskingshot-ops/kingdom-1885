# HOME · freigegebene kompakte Gestaltung · 18.11.2026

Status: IMPLEMENTIERT, LOKAL GEPRÜFT; Browser-/Deploymentnachweise folgen unten.
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

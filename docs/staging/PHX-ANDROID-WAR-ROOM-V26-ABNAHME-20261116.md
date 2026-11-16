# PHALANX War Room V2.6

Stand 16.11.2026. Isolierter Android-Testbuild, keine Produktionsfreigabe.

## Verbindliche Basis

Matthias hat in der Unterhaltung am 16.11. die Vorlage `50231.png` als Basis ausgewählt. Die Bilddatei enthält JPEG-Daten (969 × 1536 Pixel). Die Datei wird in der APK unter `phx-war-room-reference.jpg` bytegleich verwendet. SHA-256 `184d4632637057086989360e21b0663a7e47ac4bb2e186b16ff29f08a6991630`.

Die Kommandantenhalle, Profilrahmen, Funktionskacheln und Grafiken der Schnellzugriffe werden aus der Vorlage gerendert. Der bestehende HOME-Button steht in einer schmalen Leiste über dem Motiv. Profilwerte aus HOME und die konfigurierbaren Ziele werden als Bedienoberfläche angezeigt. Die Einstellungen für Profil und Schnellzugriffe stehen unter Command Access. Power zeigt weiterhin „Data pending“. Spieler-ID, letzter Abruf und Live-Power sind in diesem Testpaket unverbunden.

## Bestandsschutz

- Ausgangscommit `c02282e561625150f9b4c909e19d471bd8f5da87`. Vergleich für index.html, Queen-An-HOME-Grafik, HOME-CSS und HOME-Integrationsskript: bytegleich. Änderungen an der Benutzeroberfläche sind auf den War Room begrenzt.
- Der vorhandene War-Room-Router, die drei Shortcut-Einstellungen und der lokale Profilspeicher bleiben erhalten. Der Testbuild `app.nexusphalanx.stage.v26warroom` hat eigenen Android-App-Speicher und ist parallel installierbar. Einstellungen aus V2.5 werden nicht automatisch übertragen.
- Territory Control, Karte, Reports, PYLON IX und vorhandene Zugriffsregeln verwenden die bestehenden Quellen. Die bereits in V2.5 erfassten offenen Kartenexporte und die rechte HOME-Plakette bleiben im ursprünglichen [Abnahmeprotokoll](https://github.com/nxskingshot-ops/kingdom-1885/blob/c02282e561625150f9b4c909e19d471bd8f5da87/docs/staging/PHX-ANDROID-HOME-V25-ABNAHME-20261116.md) dokumentiert.
- Rückweg über den separaten V2.5-Build. V2.6 wurde auf einem eigenen Branch von der dokumentierten V2.5-Basis abgeleitet.

## Verifikation

- [Actions-Lauf 43812269770](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43812269770) für Build-Commit `bfc02518c9bcc50e17de55ac05a4f9ee73b715da` auf `work/phx-war-room-art-v26-20261116`.
- **BESTANDEN (Chromium):** neun Prüfschritte. HOME und Plaketten, War-Room-Einstieg und Rückweg, Profilwerte mit Persistenz, drei persistente Schnellzugriffe samt Wechsel zu Reports, Territory und Karte, PYLON IX von HOME, Territory- und Reports-Rückwege, 74 Outposts, Filter, Zoom, Vollbild und CSV in Reports. Keine unbehandelten Browserfehler.
- **BESTANDEN (visueller Browserabgleich):** War-Room-Bild vollständig sichtbar, Zurück-Button oberhalb der Grafik, Standard- und langer Testname ohne Überlappung. [Browserprotokoll und Screenshots](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43812269770/artifacts/14200897489).
- **BESTANDEN (Android-Sichtprüfung):** Nutzer-Screenshots vom 16.11.2026 zeigen V2.6 auf dem Zielgerät. War Room mit vollständigem Titel, HOME-Button oberhalb des Motivs, FaQu, Level 27, NXS, #1885, den drei Funktionskacheln, drei Schnellzugriffen und sichtbaren Einstellungen. HOME zeigt die Queen-An-Grafik unter der Statusleiste und den einmaligen Namen FaQu. Die rechte Plakette zeigt weiter den bereits erfassten zusätzlichen Rahmen.
- **OFFEN (Gerätebedienung):** Die Standbilder zeigen beide Ansichten. Die einzelnen Klickwege, Shortcut-Persistenz und Modulregression auf dem Zielgerät wurden damit nicht nachgewiesen. Die gesonderten Browserprüfungen sind oben aufgeführt.
- **OFFEN:** autorisierte Live-Daten für Power, Spieler-ID und Aktualisierungszeit.

- **BESTANDEN (APK):** Gradle-Build, Paket-ID und Debug-Signatur. SHA-256 `7cdfc75761e147372d33c58856a4b921f30bcd6a72d7fb7ab5497f1cec50c896`. [APK-Artefakt](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43812269770/artifacts/14200832749).

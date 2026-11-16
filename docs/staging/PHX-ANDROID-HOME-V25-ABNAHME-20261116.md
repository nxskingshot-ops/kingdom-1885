# PHALANX HOME V2.5 · Android-Testprotokoll

Stand 16.11.2026. Isolierte Testfassung, Geräteabnahme offen.

## Bestand und Rückweg

- Verifizierter Ausgangsbranch: `work/phx-android-v21-parallel-20261115`, HEAD `13a59d9823576b395fba6b48d603d6be2b323c3b`.
- V2.3: [Build 43747351261](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43747351261), SHA `0d454bfb8ccff9a4b66b0f369b75ead1198d8ea8`, Paket `app.nexusphalanx.stage.v23insets`. Die Übergabe berichtet einen Geräte-Screenshot ohne überlagernde Statusleiste.
- V2.4: [Build 43748139865](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43748139865), SHA `679f157e10a9dab89c7b7b9405f1ff2b54ab8696`, Paket `app.nexusphalanx.stage.v24plaque`. Der Workflow ersetzte die linke CSS-Fläche durch Transparenz. Die Originalgrafik enthält an dieser Stelle bereits den Namen „FaQu“. Die V2.4-Sichtprüfung schlug laut Geräteübergabe für die linke Plakette fehl.
- **BACKUP ERSTELLT:** Vor dem Patch lokales Git-Bundle des vollständigen Android-Ausgangsstands. SHA-256 `f204eea58c5567fbea214413b273987e95cbab99e9837cbd6a0ace9c3913b238`. Dauerhafter Rückweg über den ursprünglichen GitHub-Branch, die Base-SHA und die früheren Pakete.
- **INTEGRITÄT GEPRÜFT:** `git bundle verify`, SHA-256 des Bundles sowie Prüfung der Basisdateien.
- **WIEDERHERSTELLUNG GETESTET:** Bundle in separates Verzeichnis geklont, Base-SHA ausgecheckt, `git fsck --full` und `node android-stage/scripts/verify.cjs` bestanden. Der Test deckt Quellcode ab. Ein aktueller Datenbank- oder Android-Datenrestore wurde nicht ausgeführt.

## V2.5 und Prüfnachweise

- Branch `work/phx-android-home-v25-20261116`, [Build-Commit `20cf2d14744b6490291d3f4d3edffab839fa458f`](https://github.com/nxskingshot-ops/kingdom-1885/commit/20cf2d14744b6490291d3f4d3edffab839fa458f).
- [GitHub Actions 43808252562](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43808252562): Browser und APK bestanden. [Browserprotokoll und Screenshots](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43808252562/artifacts/14199745393) und [APK-ZIP](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43808252562/artifacts/14199521313).
- Paket `app.nexusphalanx.stage.v25home`, Label `NEXUS PHALANX V2.5 TEST`. Separater Android-Speicher. Bestehende Installationen behalten ihre lokalen Profile. APK SHA-256 `5918eea81c32313d557bd1222718880928abe1795bbd244913d560c5aeb3461a`. Debug-Signatur per `apksigner` im CI bestätigt.
- Die Android-Kopie übernimmt den Statusleisten-Patch von V2.3. Der nachgereichte Geräte-Screenshot bestätigt die HOME-Anzeige unterhalb der Android-Statusleiste.
- R13 dient als Vorlage für die Technik. Für die 1670 × 941 Pixel große Queen-An-Grafik verwendet die linke Maske andere Koordinaten und einen unbeschrifteten Ausschnitt aus derselben Grafik. In den geprüften Quellen wurde keine gesondert freigegebene leere Queen-An-Plakette gefunden. Das Original-PNG bleibt bytegleich mit SHA-256 `44af7b03d8fc1e68ac950b663aef8605bb1c9406e471eec4d10634b2083a9ada`. Rechts bleibt die V2.4-Darstellung erhalten. Lange Namen werden im begrenzten HOME-Feld mit Auslassung angezeigt und stehen vollständig im War Room und in den Einstellungen.
- Der erste [Browserlauf](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43807912256) zeigte, dass globale alte Territory-Regeln die vorhandene HOME-Navigation ausblenden. Der erfolgreiche Folgelauf aktiviert die vorhandenen HOME-Buttons im richtigen Bereich, belegt den eingezeichneten Territory-Zurückpfeil mit einer transparenten Trefferfläche und führt „Festung“ von Karte und Reports zu Territory Control. Kartenrahmen, Reports, PYLON-Dialog und War Room sind im HTML-Vergleich identisch. Die Territory-Szene ist bis auf die transparente Trefferfläche identisch.
- Die Übergabe vom 16.11. bestimmt die aktuell zu erhaltende Navigation. Historische abweichende Navigationsentscheidungen wurden nicht zur Wiederherstellung älterer Layouts herangezogen.
- Auth, Rollen, GOD MODE, Supabase-Struktur, Nutzerkonten, produktive Deployments und Transfer Scouting blieben außerhalb der Änderungen.

## Prüfmatrix

| Prüfung | Ergebnis | Umfang |
|---|---|---|
| Originalgrafik, linke und rechte Plakette | BESTANDEN | Chromium bei 393 px. Screenshot links mit einmaligem Namen. Wechsel von Königreich und Allianz rechts geprüft. |
| Langer Name, Level | BESTANDEN | 320/393/740 px. Zentrierung und Auslassung geprüft. Vollständiger Name und Level im War Room, Level auf HOME verborgen. |
| Profilbild → War Room → HOME | BESTANDEN | Browser-Tap, Rückweg und sichtbare Ansicht. |
| Commander Profile, Account Intelligence, Alliance Position, Player Development | BESTANDEN | Vier Bereiche und aufklappbare Inhalte geprüft. Bestehende Hinweise auf fehlende verifizierte Daten. |
| Profileinstellungen, Speichern und erneutes Laden | BESTANDEN | Lokales Testprofil mit Name, Level, Königreich und Allianz. |
| Drei konfigurierbare Shortcuts | BESTANDEN | Alle drei Ziele umgestellt und nach Reload bestätigt. |
| Profilbild-Upload und Bedienung aller drei Shortcut-Ziele | NICHT GETESTET | Test deckt Einstieg per Standardavatar und gespeicherte Ziele ab. |
| Command Center, PYLON IX und Rückweg | BESTANDEN | Fokus auf vorhandener Überschrift und Öffnen/Schließen des PYLON-Dialogs im Browser. |
| HOME → Territory Control → Karte und Reports → HOME | BESTANDEN | Kachel, Karten-/Report-Trefferflächen und Rückwege im Browser. Direkter HOME-Reports-Einstieg geprüft. |
| 74 verifizierte Außenposten | BESTANDEN | Browser mit 74 Listeneinträgen. Separater Leseabruf ergab HTTP 200, 74 IDs und 74 eindeutige Positionen. |
| Karte: Allianzfilter, Zurücksetzen, Zoom und Vollbild | BESTANDEN | Browser. |
| Karte: Orientierung und Quadranten | BESTANDEN | Unveränderte Originalfunktionen geprüft. Vier Eckpunkte und drei Grenzfälle. |
| Karte: Quadranten-, Typ- und Levelfilter auf dem Zielgerät | NICHT GETESTET | Geräteprüfung steht aus. |
| Reports: CSV-Export | BESTANDEN | Browserdownload und CSV-Kopf bestätigt. |
| Karte: direkter JSON- und CSV-Export | FEHLGESCHLAGEN | Im vorhandenen Android-Ausgangsstand fehlen beide Exportaktionen bereits. Reports bietet einen eigenen CSV-Export. |
| Browserregression | BESTANDEN | Kein unbehandelter Browserfehler im dokumentierten Lauf. |
| Android V2.5: HOME-Anzeige, Statusleiste und linke Plakette | BESTANDEN | Eingereichter Geräte-Screenshot zeigt HOME unterhalb der Statusleiste, FaQu einmal mittig, ohne Level. |
| Android V2.5: rechte Plakette | BESTANDEN (Lesbarkeit) | #1885 · NXS ist lesbar. Der zusätzliche Rahmen über der goldenen Einfassung ist sichtbar. Designfreigabe offen. |
| Android V2.5: Modulwege | NICHT GETESTET | Das Standbild belegt die HOME-Anzeige. War-Room- und Territory-Rückwege sind bisher im Browser geprüft. |
| Live-Accountwerte, PYLON-Rollen und Produktionsdaten | NICHT GETESTET | Bestehende Berechtigungen geschützt. Der Browserlauf prüft Navigation und öffentliche Kartendaten. |

## Geräteabnahme

Der Geräte-Screenshot vom 16.11.2026 liegt vor. Für die Funktionsabnahme noch Profilbild → War Room → HOME und Territory Control → Outpost Map beziehungsweise Reports → Territory Control → HOME auf dem Gerät prüfen. Offene Kartenexporte bleiben bis zur Identifikation der dazu freigegebenen Implementierung im Projektregister vermerkt.

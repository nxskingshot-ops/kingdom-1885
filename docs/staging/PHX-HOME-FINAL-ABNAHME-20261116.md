# PHALANX HOME FINAL · Abnahme · 16.11.2026

Status: **Isolierter Integrationsstand. Produktions- und Gerätefreigabe offen.**

| Stand | Nachweis |
|---|---|
| V2.7 · ursprüngliche Übergabe | `1b20723e8d771b2affbf6cb0fcd965ce6bfae1dd` · [Browser- und APK-Lauf](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43898095335) |
| V2.8 · tatsächlicher APK-Build | [Lauf 43819309644](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43819309644), Quellstand `c7d5675df2068896c7af14ef9501e820b5b0c8df`. Dokumentations-HEAD `9f687ce47c0f5014dc1d9952d0422270f068f29c`. |
| V2.9 · geprüfte Quellbasis | `d74db11a29f4987dbf2a479f24cbf3f9ea2c6f63` · [Quellstand](https://github.com/nxskingshot-ops/kingdom-1885/commit/d74db11a29f4987dbf2a479f24cbf3f9ea2c6f63). Eigene Gerätefreigabe NICHT GETESTET. |
| Funktionaler Integrationsstand | `05000c444d98c64e9a9d98587d16a485abe50cb4` · [Android- und Browser-Ausführung](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43906522924) |

## Ursachen und Integration

- Rechte HOME-Plakette. Die freigegebene Datei enthält `#1885 · NXS` als Pixel. Das native V2.7-Paket stellt Android-Inhalte aus `android/app/src/main/assets/public/index.html` bereit. V2.7 lud nach dem Basis-CSS zuerst `phx-home-plaque-v25.css`, dann `phx-home-right-plaque-v26-candidate.css` und am Ende das War-Room-CSS sowie das verzögert ausgeführte War-Room-Skript. `phx-home-plaque-v24.css` war nicht aktiv. Die V2.6-CSS-Schicht entfernte nur den dynamischen Rahmen. Bildschrift und HTML-Text blieben gleichzeitig vorhanden. In der erzeugten Android- und Browser-Fassung verdeckt die aus der Originaltextur zugeschnittene Ebene nur die Beispielbuchstaben innerhalb der vorhandenen Fläche. Ein DOM-Feld rendert Königreich und Allianz. Ohne Verbindung erscheint ein Strich, bei bestätigtem Profil ohne Allianz bleibt der Trenner ausgeblendet.
- Linke Plakette. Auch `FaQu` existierte in der Grafik und als lokaler Standard im R10-Profil. Die generierte Live-Fassung bindet genau einen Namensrenderer an den authentifizierten Profilabruf. Aus älterem lokalem Speicher stammende Identitätswerte können HOME und War Room nicht überschreiben. Die Benutzerentscheidung vom 16.11. hat Vorrang vor der älteren Spezifikation: Das Level ist auf HOME ausgeblendet. Profilbild und Zuschneidewerte werden über die bestehenden Einstellungen und den vorhandenen lokalen Schlüssel gespeichert.
- War Room. V2.7 las `phx-personal-profile-r10` und hatte keine Live-Kontoverknüpfung. V2.8/V2.9 ergänzten einen separaten Live-Dialog, während die Dossierfelder aus dem lokalen HOME-Profil kamen. Die separate Capacitor-Paketkennung hat eigenen WebView-Speicher. Lokale Werte und Bilder eines früheren Pakets werden von dieser App nicht übernommen. Der bestehende Live-Endpunkt des isolierten Supabase-Projekts löst serverseitig die eigene bestätigte Spieler-ID auf und prüft die MightPulse-Antwort. HOME und Dossier zeigen aus demselben Ergebnis Name, Königreich und Allianz. Der bestehende Live-Bereich zeigt zusätzlich die bestätigte Spieler-ID, Power und Zeitstempel, soweit verfügbar. Der bereitgestellte Basisabruf in Funktionsversion 3 enthält kein Level. Der War Room zeigt dafür einen Strich. Das Access-Token bleibt wie in V2.8 im Arbeitsspeicher. Nach vollständigem App-Neustart ist erneut eine Anmeldung nötig. Die Live-Schicht wurde nach dem War-Room-Skript eingebunden und aktualisiert dessen Identitätsfelder per Ereignis.
- Navigation. Reports aus HOME kehrt über seinen Zurückbutton nach HOME zurück. Reports aus Territory Control kehrt zu Territory Control zurück. War-Room-Zurück, PYLON IX und bestehende Router bleiben im gleichen App-Gerüst.
- Outpost Map 2.0. Die eingebettete Ausgangsfassung hatte einen aktiven Leseabruf, Filter, Zoom, Vollbild und Ausrichtung, jedoch keinen JSON- oder CSV-Download in der Karte. Im Abschnitt der vorhandenen Outpost-Liste wurden beide Downloads ergänzt, aus demselben bereits geladenen veröffentlichten Datensatz. Sie exportieren alle Outposts inklusive Kartenausrichtung, auch wenn ein Bildschirmfilter aktiv ist. Der Browserdownload nutzt das Hauptdokument. Android verwendet den Systemdialog zum Speichern über den isolierten Capacitor-Baustein `OutpostExport`. Der Kartenrahmen behält seine Sandbox. Die separate Reports-CSV wurde nicht ersetzt.
- Unveränderte Originaldateien. `www/index.html` SHA-256 `7765193e9753c4709b925ca9402c36c425ed2ec7e3c5e26890ae559af7238c97`. Queen-An-PNG SHA-256 `44af7b03d8fc1e68ac950b663aef8605bb1c9406e471eec4d10634b2083a9ada`. War-Room-Referenz SHA-256 `184d4632637057086989360e21b0663a7e47ac4bb2e186b16ff29f08a6991630`. Die Integrationsskripte arbeiten auf Kopien. Die erzeugte Outpost-Funktion enthält zusätzliche Export-Bedienelemente. Die Territory-Control-Festungsgrafik und ihre Anordnung werden nicht bearbeitet.

## Sicherung und Rückweg

- **BACKUP ERSTELLT.** Isolierte [Git-Backup-Ref für V2.9](https://github.com/nxskingshot-ops/kingdom-1885/tree/backup/phx-home-final-v29-baseline-20261116) auf `d74db11a29f4987dbf2a479f24cbf3f9ea2c6f63`. V2.7 bleibt als eigener Branch und Actions-Nachweis abrufbar. Ein vollständiges Git-Bundle aus der Backup-Ref wurde testweise erzeugt, SHA-256 `8334b1a664cd423a218e60f7550896b5986d6a98d203040caee3e6c737332e30`.
- **INTEGRITÄT GEPRÜFT.** Vollständiges Bundle mit `git bundle verify`, Objektprüfung mit `git fsck --full` und tatsächliche SHA-256-Prüfung des Original-HTML und der Queen-An-PNG-Datei.
- **WIEDERHERSTELLUNG GETESTET.** Das vollständige Git-Bundle wurde in ein separates Verzeichnis geklont. HEAD stimmt mit der Backup-Ref überein und der Staging-Validator hat beide Originaldateien akzeptiert. Ein erster Versuch mit einem Bundle aus einem flachen Checkout scheiterte an fehlenden Elternobjekten. Er wurde durch das vollständige Bundle ersetzt. Keine Wiederherstellung einer APK oder Datenbank ausgeführt.
- Rückweg für den Code: Backup-Ref separat auschecken und mit `node android-stage/scripts/verify.cjs` prüfen. Der Arbeitsstand wurde weder in `main` integriert noch produktiv bereitgestellt. Datenbank, Zuordnungen, Rollen und GOD-Mode-Regeln wurden in dieser Runde nicht verändert.

## Zwischenprüfungen

- Die ersten Elf-Punkte-Läufe zeigten einen blockierten Download aus dem Sandbox-Rahmen. Nach der Korrektur über das Hauptdokument bestand der Browserlauf vollständig.
- Beim ersten Emulatorlauf bestanden APK-Installation und Kaltstart. Die Prüfung brach beim Zugriff auf WebView ab, weil der normale Chromium-CDP-Client eine von Android WebView nicht unterstützte Download-Schnittstelle ansprach. Der darauffolgende Lauf erreichte HOME, War Room und 74 Kartenzeilen und brach beim JSON-Export durch eine unterbrochene WebView-Verbindung ab.

- Ein Android-Screenshot zeigte die Systemstatusleiste auf HOME. Die installierte Fassung ruft für HOME jetzt `StatusBar.hide` auf. Der aktuelle Screenshot und das Systemprotokoll sind im Emulatorartefakt enthalten. Der emulierte Grafiktreiber meldete im aktuellen Lauf ungültige Bildpuffer. Die Testverbindung scheiterte auch bei direkter Adressierung der App-PID. Die vollständige Layoutabnahme bleibt offen.
- Die separate Android-App wurde im aktuellen Lauf gebaut, installiert und per Kaltstart geöffnet. Der CI-Lauf veröffentlicht keine APK für die Nutzerinstallation.

## Testmatrix

| Prüfung | Ergebnis | Nachweis und Grenze |
|---|---|---|
| HOME und Queen-An-Grafik | BESTANDEN | Originalbytes geprüft. Screenshot 393 CSS-Pixel im Browser, zusätzlich DOM-Prüfungen bei 320 und 740 CSS-Pixeln. |
| Linke Plakette | BESTANDEN | Verifizierter Name aus Testantwort, vorhandener Avatar und ausgeblendete Levelzeile. Lange Namen können auf der Plakette gekürzt erscheinen. |
| Rechte Plakette | BESTANDEN | Sichtprüfung für unverknüpft und alternativen Datensatz `#1901 · ALT`. Keine sichtbare Doppelbeschriftung. Test ohne Allianz prüft ausgeblendeten Trenner. |
| Profilbild → War Room → HOME | BESTANDEN | Browser-Navigation, Titel und Zurückbutton, keine Überlagerung. |
| War Room und Profilstatus | BESTANDEN | Gemeinsam gerenderte Identität, aktualisieren, abmelden, keine Altwerte bei veralteter Quelle oder Konto ohne Verknüpfung. Anmeldung und Profilantwort im Browser simuliert. |
| Echter Profilabruf mit installiertem HOME-FINAL-Paket | NICHT GETESTET | Bestehende isolierte Edge Function ist aktiv, Version 3, JWT-Prüfung aktiv. Tatsächlicher Preflight mit Android-Origin HTTP 204, anonyme Anfrage HTTP 401. Der echte Fall FaQu ist separat für die frühere HTTP-Testsitzung belegt. |
| Territory Control, Reports und PYLON IX | BESTANDEN | Browser-Rundwege, korrekter Rückweg aus Reports, PYLON IX über HOME und War Room, bestehender Reports-CSV-Export. |
| Outpost Map 2.0 | BESTANDEN | 74 Datensätze vom bestehenden öffentlichen Lese-Endpunkt. Filter, Rücksetzen, Zoom und Vollbild. Beide Browserexporte enthalten 74 Einträge, keine doppelten IDs und die erwarteten Quadranten. |
| Lokale Speicherung | BESTANDEN | Bild über Einstellungen gespeichert, nach Reload in HOME und War Room erhalten, War-Room-Kurzbefehle nach Reload erhalten. |
| Rechte und Datenzugriff | BESTANDEN | Neun Handler-Tests, darunter fremde oder fehlende ID, nicht angemeldete und unverknüpfte Session, abweichende Quellidentität, Datenfrische und Limit. Aktueller Endpoint-Preflight und Schutz gegen anonymen Zugriff einzeln geprüft. |
| Rollen/GOD-Mode Ende-zu-Ende | NICHT GETESTET | Bestehende Berechtigungsverwaltung unverändert. Kein Test mit den Produktivrollen. |
| Android-Build, Installation und Kaltstart | BESTANDEN | GitHub-Emulator API 35, Paket `app.nexusphalanx.stage.homefinal`. |
| Android-Emulator, vollständige Layout- und Bedienprüfung | FEHLGESCHLAGEN | Aktueller Lauf brach mit Wartezeitüberschreitung beim WebView-Zugriff ab. Grafiktreiber meldete ungültige Bildpuffer. Frühere Teilprüfung bestätigte HOME, Profilbild-Einstieg, War Room, Zurück und 74 Outposts. |
| Nativer JSON- und CSV-Dateidialog, Speichern der Dateien | NICHT GETESTET | Android-Exportbaustein wurde im Protokoll registriert. Beim direkten Exportversuch endete die WebView-Verbindung vor einer Speichern-Bestätigung. |
| Reales Telefon, Anmeldung und Live-Profil | NICHT GETESTET | Hier steht kein verbundenes Telefon und keine interaktive Testsitzung mit dem freigegebenen Konto zur Verfügung. |
| Browserregression | BESTANDEN | Elf Browserprüfungen und neun Handler-Tests. |
| Freigabe der Nutzer-Test-APK | NICHT GETESTET | Android-Ende-zu-Ende-Abnahme und Live-Anmeldung auf dem echten Gerät offen. |

[Aktuelle Browserergebnisse und Screenshots](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43906522924/artifacts/14244524045)

[Android-Screenshot und Systemprotokoll](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43906522924/artifacts/14246850326)

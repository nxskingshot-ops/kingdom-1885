# PHALANX · War Academy Intelligence / Transfer Scouting

Stand 17.11.2026 · **Isolierte Integration technisch geprüft. Live-Transfer und Geräteabnahme offen.**

## Quelle, Sicherung und Rückweg

- Arbeitsbranch `work/phx-home-final-audit-20261116`. Vor Änderung lokal und auf GitHub verifiziert: `84b3c97ab57a54d2b5d805883a2c8661942664a0`.
- Integration `46195d6112087a789b8142f009e74986e54c4c1d`. Abgleich mit dem bereitgestellten MightPulse-Vertrag `1f3d648228f917d8ca64ab0dc22fe806549bee6e`, Quellbaum `08eb6eab4d7ea5931bf8ae43150fca188721be5a`. Auswahl des WebView-Sockets im Android-Test korrigiert in `8084ee93b158baeb4959c2c303cf3991ee9016de`.
- Bestehende Android-Referenz `05000c444d98c64e9a9d98587d16a485abe50cb4`. Browser- und Gerätetestarchive wurden mit `unzip -t` geprüft. Die enthaltene Geräte-APK entspricht mit SHA-256 `20052da6d74f7ddabe3d77e34e771ed3f538bed8174de211a4bb67f847922c82` der dokumentierten Referenz. Das Abnahmeprotokoll weist für diese frühere Fassung einen erfolgreichen Live-Login auf dem Nutzergerät und einen offenen HOME-Layoutfehler aus.
- Bestehende Backup-Ref `backup/phx-home-final-v29-baseline-20261116` zeigt auf `d74db11a29f4987dbf2a479f24cbf3f9ea2c6f63`. Aktueller Rückweg vor der Intelligence-Integration: [Git-Backup-Ref](https://github.com/nxskingshot-ops/kingdom-1885/tree/backup/phx-war-academy-pre-integration-20261117).
- **BACKUP ERSTELLT, INTEGRITÄT GEPRÜFT, WIEDERHERSTELLUNG GETESTET** für den Ausgangsquellcode. Vollständiges lokales Git-Bundle vor Änderung erzeugt, mit `git bundle verify` geprüft, in einen getrennten Checkout wiederhergestellt und mit `git fsck --full` und dem Staging-Validator geprüft. Bundle-SHA-256 `50b91a7d4d1997e894644355e3110f9f806a739cf14f888057749c73943b86b8`. Rückweg über separaten Checkout der Backup-Ref. APK- und Datenbankwiederherstellung in dieser Runde NICHT GETESTET.
- Der Stand von Transfer Scouting unter `transfer-pr42` basiert auf dem bestehenden geschützten Modul. Die veröffentlichte HTML-Seite stimmt mit der lokalen Basisdatei bytegenau überein, SHA-256 `5d43085d9a076418de7a790e76ec6806c86f56141ed4602f2e7ca9a23ed4b2eb`. [Bestehende Transfer-Testbereitstellung](https://stage-transfer-live-rankings.nexus-phalanx-kvk-test.pages.dev/pylon-ix/transfer-pr42/transfer-scouting-id-stage-20261030)

## Implementierter Stand · War Academy Intelligence v0.2

- `android-stage/scripts/integrate-war-academy.py` ergänzt die erzeugten Browser-/Android-Dateien. War Room → Player Development und Transfer Scouting → Account Assessment benutzen dieselbe Engine und Anzeige.
- Das eigene Profil stammt aus `phx-war-room-own-profile` v3. Die Edge Function löst die Spieler-ID serverseitig aus der autorisierten Verknüpfung auf und liefert aus `include=base` Identität und Power. Die Transfer-Funktion v21 prüft Mitgliedschaft und konkrete Spieler-ID und liefert `base,heroes,ranks`. Die Engine verlangt bestätigte Datenfrische. Sie verwendet für Transfer die bisherige Castle-/Truegold-Zuordnung, wenn der Rankingwert mit Erfassungszeit vorliegt. ISO- und Epoch-Zeitwerte werden verarbeitet.
- War-Academy-Stufe und T11-Status für Infanterie, Kavallerie und Bogenschützen werden in keiner der beiden Antwortstrukturen geliefert. Die Anzeige lautet **UNKNOWN**. Diese Lücken fließen nicht als Schwäche in die bestehende Transfer-Bewertung ein. Referenzkatalog und Meilensteinberechnung sind offen.
- PYLON IX verwendet sein bestehendes Dialogfenster mit Originalgrafik. Darunter führen **Outpost Atlas** und **Transfer Scouting** in die vorhandenen Module. Der Rückweg aus Transfer nutzt die Historie des bestehenden Browsers. Der isolierte Android-Build behandelt die System-Zurücktaste für PYLON IX und Transfer.
- Gepackte PYLON-Originalgrafik SHA-256 `0ecd0aec53687a93970b303b7a5c62ea18ea46b83262976acc3645010e5f015b`. HOME-Basis, Queen-An-Asset, War-Room-Referenz und Territory-Layout blieben im Quellbaum byteidentisch.
- Transfer behält bestehende Anmeldung, Mitgliedschaft, Kandidaten, Rollen und Zugriffskontrollen. Die Auth-Links in den generierten Assets verwenden den bestehenden Staging-Origin. Dort liefert `password-recovery.js` derzeit HTML. Der wiederverwendete Passwort-Reset benötigt seinen Originalcode und eine gesonderte Abnahme.
- Die zwei älteren APK-Pipeline-Ausfälle bei `87f2bc9a` und `84b3c97a` lagen an ungültigem YAML. Browser und native APK-Erzeugung verwenden jetzt denselben Integrationsschritt. Native Build-Tools 34 und Signatur-Tools 35 sind explizit im Testworkflow enthalten. Die Workflows lösen für diesen Branch eine Prüfung ohne Bereitstellung aus.

## Prüfungen

| Prüfung | Ergebnis | Nachweis und Grenze |
|---|---|---|
| Gemeinsame Engine, ID-Abgleich, Frische, Zeitformate und UNKNOWN ohne Negativbewertung | **BESTANDEN** | Ausgeführter Node-Test und [CI Core](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44040056466). |
| War Room Handler | **BESTANDEN** | 9 Tests. Servergebundene eigene ID, unbekannte Quelle, abweichende Identität, fehlende Zuordnung und Autorisierung, Limit. |
| Transfer-Accountbewertung | **BESTANDEN** | 12 vorhandene Node-Regressionen mit Rankings, Rollenindikatoren, Vergleich und Power. |
| Mobile Browserintegration | **BESTANDEN** | 12 Prüfungen im Chromium bei 393 px, Randprüfungen bei 320/740 px. PYLON IX, beide Rückwege, Outpost Atlas, Transfer-ID mit Town Center und UNKNOWN, fehlende Mitgliedschaft und Observer-Ansicht mit Testantworten. War Room meldet bei Test-Login verifizierte Daten und bei Abmeldung den Ausgangszustand. Auch der GitHub-Browserjob war erfolgreich. |
| Outposts, Filter, Zoom, Vollbild, JSON/CSV, Reports und Einstellungen | **BESTANDEN** | Lese-Endpunkt separat HTTP 200, 74 veröffentlichte eindeutige IDs. Im lokalen Browser mit derselben aufgezeichneten Antwort erneut abgespielt, da Chromium den Dienst in der lokalen Umgebung nicht direkt erreichte. JSON/CSV mit 74 Datensätzen und Quadranten bestanden. |
| Android-APK | **BESTANDEN** | `assembleDebug`, APK-Signatur, Paket `app.nexusphalanx.stage.homefinal`, ZIP-Integrität und Vergleich gepackter Assets mit Build-Eingaben. Lokaler APK-SHA-256 `4a6b89704dbc5990db6d688501724fdc59ab0d76daf146f02437bbd8f1ce4429`. Debug-Signatur des lokalen Builds. [Erfolgreicher isolierter APK-Lauf mit Artefakt](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44040056529/artifacts/14308852646) |
| Android-Emulator, erster Lauf | **FEHLGESCHLAGEN** | APK installiert und Kaltstart ausgeführt. WebView-Auswahl brach vor der ersten UI-Prüfung ab. Playwright verarbeitet in der verwendeten Version `pkg` und `socketName`, der Test übergab versehentlich nur `pid`. [Android-Testprotokoll](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44039783154/job/133891610070) |
| Android-Emulator API 35, korrigierter Lauf | **BESTANDEN** | APK installiert und gestartet. HOME, War Room, Territory Control, Reports, PYLON IX und Transfer-Loginseite geöffnet. Native System-Zurücktaste führte von Transfer zu PYLON IX. Zurück zu HOME und Speichern beider Outpost-Exporte über den nativen Dateidialog bestanden. [Jobprotokoll](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44040551324/job/133894067566) · [Emulatornachweise](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44040551324/artifacts/14309237837) |
| Android Transfer · echte MightPulse-Antwort | **FEHLGESCHLAGEN** | Der ID-Lookup liefert für `Origin: https://localhost` HTTP 403 `origin_forbidden`. Rankings liefern HTTP 204 mit einer anderen Allow-Origin-Antwort, die Android ebenfalls blockiert. Beide unterstützen den bestehenden Cloudflare-Test-Origin. Der War-Room-Endpunkt antwortet für Android mit HTTP 204 und passender Allow-Origin-Antwort. |
| Rollen und RLS im isolierten PostgreSQL- und Browsertest | **BESTANDEN** | Vorhandene Access-V2-Regressionen mit Freigaben, Observer/Operator/Administrator, direkten RLS-Prüfungen, Sitzungsentzug, Audits und Rollback. Chromium bei 390/1280 px. |
| Live-Login, Rollen/RLS, Speicherung und Passwort-Reset im neuen Build | **NICHT GETESTET** | Live-Konten und echte Kandidaten waren von der Prüfung ausgenommen. |
| PYLON IX Wissensspeicher, Synchronisierung und Schreibaktionen | **NICHT GETESTET** | Die Integration nutzt den bestehenden PYLON-Dialog. In der geprüften App ist kein autorisierter persistenter Wissensdienst verdrahtet. |
| Physisches Android, Layout und native Exporte im neuen Build | **NICHT GETESTET** | HOME-Rand und vollständiger Rückweg inklusive System-Zurück, Login, Lesen und Export auf einem physischen Gerät weiter offen. |

Browserprotokoll SHA-256 `4b6983e19719bd9924b60dbe83501948555fd2dffa7ddf6f1c841f75a875c6d8`. Die aufgezeichnete öffentliche Outpost-Antwort ist kein zusätzlicher Stammdatensatz.

## Fortsetzung

1. Eine autorisierte Test-Origin-Verbindung für **beide** Transfer-Funktionen herstellen. Bestehendes Cloudflare-Staging ist in beiden Allowlisten vorhanden. Für eine APK vom lokalen Origin eine Änderung nur in der dafür freigegebenen isolierten Backend-Umgebung vorbereiten. Beide Funktionen verlangen JWT und Mitgliedschaft. Den Android-Origin bei Rankings an dieselbe Prüfung für nicht anonyme Mitglieder wie Cloudflare-Staging binden. Aktuelle Funktionsversionen v21/v9 vor jeder Änderung sichern und Rückweg testen. Identität und Rollen per echten genehmigten Testkonten verifizieren.
2. Mit den vorgeschriebenen Android- und Rollenprüfungen fortsetzen. Passwort-Reset-Originalimplementierung ermitteln. Den älteren HOME-Randfehler separat im freigegebenen Testpaket messen.
3. Wenn die Quelle War Academy oder T11 ergänzen kann, die autorisierte Antwortstruktur und Feldherkunft vor der Anbindung bestätigen. Bis dahin bleibt die Anzeige UNKNOWN.

Datenbank, RLS, Rollen, GOD MODE und produktive Bereitstellungen wurden bei dieser Integration nicht geändert.

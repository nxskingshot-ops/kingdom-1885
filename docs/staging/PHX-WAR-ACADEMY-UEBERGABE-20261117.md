# PHALANX · War Academy Intelligence / Transfer Scouting

Stand 17.11.2026 · **Isolierte Integration technisch geprüft. Android-Origin freigegeben. Authentifizierter Live-Transfer und Geräteabnahme offen.**

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
| Android Transfer · Preflight vor der Origin-Freigabe | **FEHLGESCHLAGEN** | Lookup v21 lieferte für `https://localhost` HTTP 403 `origin_forbidden`. Rankings v9 lieferte eine fremde Allow-Origin-Antwort. |
| Android Transfer · Preflight nach der Origin-Freigabe | **BESTANDEN** | Lookup v22 und Rankings v10 liefern HTTP 204 mit exakt `Access-Control-Allow-Origin: https://localhost`. Die authentifizierte Live-Datenprüfung ist **NICHT GETESTET**. |
| Rollen und RLS im isolierten PostgreSQL- und Browsertest | **BESTANDEN** | Vorhandene Access-V2-Regressionen mit Freigaben, Observer/Operator/Administrator, direkten RLS-Prüfungen, Sitzungsentzug, Audits und Rollback. Chromium bei 390/1280 px. |
| Live-Login, Rollen/RLS, Speicherung und Passwort-Reset im neuen Build | **NICHT GETESTET** | Live-Konten und echte Kandidaten waren von der Prüfung ausgenommen. |
| PYLON IX Wissensspeicher, Synchronisierung und Schreibaktionen | **NICHT GETESTET** | Die Integration nutzt den bestehenden PYLON-Dialog. In der geprüften App ist kein autorisierter persistenter Wissensdienst verdrahtet. |
| Physisches Android, Layout und native Exporte im neuen Build | **NICHT GETESTET** | HOME-Rand und vollständiger Rückweg inklusive System-Zurück, Login, Lesen und Export auf einem physischen Gerät weiter offen. |

Browserprotokoll SHA-256 `4b6983e19719bd9924b60dbe83501948555fd2dffa7ddf6f1c841f75a875c6d8`. Die aufgezeichnete öffentliche Outpost-Antwort ist kein zusätzlicher Stammdatensatz.

## Fortsetzung

1. In der Android-Test-App mit einem genehmigten Transfer-Konto anmelden. Unter PYLON IX → Transfer Scouting → Find a Player eine bekannte Kingshot-Spieler-ID laden, Spieleridentität und Quellzeit abgleichen und die Live-Rankings öffnen. Die CORS-Freigabe ist bereits aktiv.
2. Mit den vorgeschriebenen Android- und Rollenprüfungen fortsetzen. Passwort-Reset-Originalimplementierung ermitteln. Den älteren HOME-Randfehler separat im freigegebenen Testpaket messen.
3. Wenn die Quelle War Academy oder T11 ergänzen kann, die autorisierte Antwortstruktur und Feldherkunft vor der Anbindung bestätigen. Bis dahin bleibt die Anzeige UNKNOWN.

Datenbank, RLS, Rollen, GOD MODE und produktive Bereitstellungen wurden bei dieser Integration nicht geändert.


## Freigegebene Android-Origin-Änderung · 17.11.2026

- Ausschließlich die zwei bestehenden Transfer-Testfunktionen wurden geändert. `phalanx-transfer-id-snapshot-fallback-stage-20261031` v21 → **v22** und `phalanx-transfer-intelligence-stage-20261031` v9 → **v10**. Beide aktiven Quellbundles wurden vom Dienst zurückgelesen und mit dem freigegebenen Änderungssatz verglichen. `verify_jwt=true` ist für beide Versionen aktiv.
- Bei Rankings unterliegt der Android-Origin derselben Mitgliedschaftsprüfung wie das bestehende Cloudflare-Staging. Die Prüfungen verlangen einen aktiven, nicht anonymen, zur Transfer-Nutzung berechtigten Account. Der Lookup prüft weiterhin Mitgliedschaft, Quote und Spieler-ID.
- **BESTANDEN** · 14 HTTP-Prüfungen an beiden bereitgestellten Endpunkten. Android und Cloudflare erhalten beim Preflight jeweils HTTP 204 und ihre exakte Origin im Header. Eine fremde Origin erhält keine passende CORS-Freigabe. GET ohne Token oder mit ungültigem Token erhält HTTP 401.
- **BESTANDEN** · Isolierter Quelltest mit simulierten Auth-, Mitgliedschafts- und MightPulse-Antworten. Anerkannte Mitgliedschaft lieferte die angefragte ID, Town Center und Rankings. Fehlende, anonyme, inaktive, abgelaufene und nicht qualifizierte Mitglieder erreichten die Datenquelle nicht.
- **BACKUP ERSTELLT, INTEGRITÄT GEPRÜFT** · Originalquellen, Funktionsversionen und JWT-Konfiguration vor der Änderung gesichert. Backup-SHA-256 `bf30a22fb429a062e521f5540a83d05ffa8bbaf3d151cbbeff3dfe918adf5be0`. **WIEDERHERSTELLUNG LOKAL GETESTET** · Beide Funktionsquellen aus der Sicherung im isolierten Test ausgeführt. Rückweg bei Bedarf: jeweilige Originalquelle mit `verify_jwt=true` auf dieselbe Testfunktion einspielen und den Origin-/Auth-Prüfsatz wiederholen. Die aktive Bereitstellung wurde nicht zu Testzwecken zurückgesetzt.
- **BESTANDEN auf Android** · Der authentifizierte Spieler-ID-Abruf wurde später auf dem Nutzergerät bestätigt. Der getrennte Live-Königreichsrankings-Abruf bleibt offen.

## Physischer Android-Test und Anzeige · 17.11.2026

- **BESTANDEN** · Die separate APK `app.nexusphalanx.stage.transfertest` öffnet Transfer Scouting unter PYLON IX. Der Screenshot 50370 belegt den angemeldeten aktiven FaQu-Admin. Screenshot 50371 belegt ein geöffnetes Spielerergebnis mit 22 Ranking-Metriken. Die Identität des angezeigten Spielers und Herkunft der einzelnen Ranking-Werte sind im sichtbaren Ausschnitt nicht dokumentiert. Der getrennte Live-Königreichsrankings-Abruf bleibt offen.
- Der War-Academy-Bereich verwarf auch separat datierte Kingdom-Rankingwerte, wenn die Aktualität des Spielerprofils nicht bestätigt war. Die Anzeige unterscheidet jetzt bestätigte Identität von unbestätigter Profilaktualität. Town Center kann aus einem datierten, zum Spieler zugeordneten Kingdom-Ranking des Anbieters erscheinen. Nicht frische Player-Captures und gespeicherte Snapshots liefern hierfür keinen Wert. Das Foto allein klärt nicht, ob die konkrete Spielerantwort einen passenden Town-Center-Wert enthielt.
- **BESTANDEN** · Kernprüfung und zwölf Browserregressionen, einschließlich frischem Spielerprofil, nicht frischem Profil mit datiertem Anbieter-Ranking und Ausschluss eines gespeicherten Snapshots. APK 1.1 gebaut, Signatur und gepackten JavaScript-Stand geprüft. SHA-256 `ca5607ed99bcb994fec3adb1300f71cae4e6d51fe112b9ffab294e817874398a`. Diese APK verwendet dieselbe separate Paketkennung und Debug-Signatur wie APK 1.0.
- **BESTANDEN auf physischem Android** · Screenshot 50375 zeigt in APK 1.1 die bestätigte Spieler-ID `291688449` (Queen An), Town Center **TG5 5/5** aus dem datierten Anbieter-Ranking vom 17.11.2026 um 02:07:20.482 UTC und 22 angezeigte Ranking-Metriken. Die Aktualität des Spielerprofils ist unbestätigt. War Academy und T11 für Infanterie, Kavallerie und Bogenschützen erscheinen korrekt als UNKNOWN.

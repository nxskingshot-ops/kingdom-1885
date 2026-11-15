# PHALANX Android V2 – Update-/Signaturdiagnose (15.11.2026)

## Nachgewiesener Zustand
- Isolierter Branch: `work/phx-android-capacitor-isolated-20261115` (kein Produktionsbranch).
- `android-stage/capacitor.config.json`: App-ID `app.nexusphalanx.stage.v2`, Anzeigename `NEXUS PHALANX TEST V2`.
- CI erzeugt mit `npx cap add android` das native Android-Projekt neu und baut mit `./gradlew assembleDebug`.
- Workflow enthält **keine explizite persistente Release-/Debug-Keystore-Konfiguration**.
- GitHub Actions Run #6: laut vom Nutzer vorgelegtem Screenshot Build **Success**; das belegt **nicht**, dass die APK auf bestehender V2 installierbar ist.
- Nutzer meldet: Neue APK wird von Android mit „App wurde nicht installiert“ abgelehnt. Vorhandene V2 startet, Statusleiste überlagert HOME-Bedienelemente.
- APK-Signatur, Package-ID und versionCode der **installierten** V2 sowie der heruntergeladenen APK sind noch nicht direkt ausgelesen. Signaturkonflikt ist eine **Hypothese**, keine bestätigte Ursache.

## Verbindlicher Prüfpfad – ohne Datenverlust
1. Vorhandene V2 **nicht deinstallieren**, App-Daten und Cache **nicht löschen**.
2. APK-Dateien mit `apksigner verify --print-certs --verbose <apk>` prüfen: Signatur-SHA256, Paketname und versionCode (z. B. mit `apkanalyzer manifest application-id` und `apkanalyzer manifest version-code`).
3. Falls ADB autorisiert verfügbar: `adb shell pm list packages | grep nexusphalanx`, `adb shell dumpsys package app.nexusphalanx.stage.v2`; Signatur/Installationsstatus nach Möglichkeit mit `adb shell pm install -r <apk>` diagnostizieren, **ohne** `-d`, `-t` oder Deinstallation als Umgehung.
4. Bei `INSTALL_FAILED_UPDATE_INCOMPATIBLE`: bisherigen Signierschlüssel suchen; falls nicht vorhanden, **separate** Test-App mit anderer App-ID installieren, keine bestehende V2 überschreiben.
5. Bei `INSTALL_FAILED_VERSION_DOWNGRADE`: versionCode korrekt erhöhen, Signatur muss trotzdem übereinstimmen.
6. Bei `INSTALL_FAILED_NO_MATCHING_ABIS`, `INSTALL_PARSE_FAILED_*` oder anderen Codes: ursachenspezifisch beheben.
7. Für zukünftige Updates einen **dauerhaften, geschützten** Signierschlüssel festlegen; private Schlüssel **niemals** im Repository oder in Logs speichern. Eine Schlüsselanlage benötigt ausdrückliche Freigabe und sichere Ablage.
8. Native Android-Statusleisten-/Insets-Fixes erst in separater APK auf realem Android prüfen; Build-Erfolg ist kein UI-Nachweis.

## Schutz / Abnahme
- HOME/Queen-An-Grafik, Territory Control, Reports, Outpost Map (74 OP), Supabase, Rollen, FREEZEs: **nicht verändert**.
- Backup erstellt: **NICHT NACHGEWIESEN**; Repository-Branch bleibt isoliert, aber kein behauptetes vollständiges Datenbackup.
- APK-Build Run #6: **BESTANDEN laut Screenshot**.
- APK-Installation als Update: **FEHLGESCHLAGEN laut Nutzer**.
- Signaturvergleich: **NICHT GETESTET**.
- Statusleistenfix auf Gerät: **NICHT GETESTET**.
- Navigation/Regressionen: **NICHT GETESTET**.
- Freigabe zur produktiven Bereitstellung: **NICHT ERTEILT**.

## Verifiziertes Ergebnis der Signaturdiagnose – 15.11.2026

- GitHub Actions Lauf [#1](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43728771682): **BESTANDEN**, Job-ID `132856374419`.
- Originalartefakte Build #5 und Build #6 wurden durch den Workflow heruntergeladen und mit `apksigner` sowie `aapt` geprüft.
- Build #5: APK-SHA256 `8bc2f48d5e99b22403a2ff5a30fa2d618122ea1b4eb5e236b2e9cece4f5d15a7`.
- Build #6: APK-SHA256 `3e0db623d9be751c89febc9a1851d98b9806f5b40ecfe2ddead56a97fe1ca97a`.
- Beide APKs: App-ID `app.nexusphalanx.stage.v2`, `versionCode=1`, `versionName=1.0`.
- **Beide APKs verwenden laut direktem Zertifikatvergleich dasselbe Signaturzertifikat**. Die frühere Vermutung eines Zertifikatkonflikts **zwischen Build #5 und #6 ist widerlegt**. Das sagt noch nichts über die Signatur der auf dem Gerät installierten V2.
- **Ursache des Installationsfehlers weiterhin OFFEN**. Nächster Nachweis: `adb install -r` mit dem bereits vorhandenen Build-#6-Artefakt und Auswertung des konkreten `INSTALL_FAILED_...`-Codes, nur mit autorisiertem Testgerät und ohne Deinstallation oder Datenlöschung; alternativ Zertifikat der installierten App und APK separat prüfen.
- **Keine neue APK erzeugen**, bevor der konkrete Installationsfehler bekannt ist. Keine Produktion oder Daten geändert.

## Verifizierter Build-#4-Vergleich – 15.11.2026

- GitHub Actions [Lauf](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43734137585), Job `132872878237`: **BESTANDEN**.
- Build #4: `app.nexusphalanx.stage`, `versionCode=1`, SHA256 `859c7c85cbf94634b39eb0177e6515ff46f20b80c580c864fe4ea5645c249459`.
- Build #5: `app.nexusphalanx.stage.v2`, `versionCode=1`.
- Build #6: `app.nexusphalanx.stage.v2`, `versionCode=1`.
- **Zertifikat für #4, #5 und #6 identisch**; frühere Signaturvermutung ist für diese Artefakte widerlegt.
- **Entscheidender Unterschied: Build #4 hat andere App-ID als #5/#6.** #4 ist daher kein In-Place-Update für eine Installation der V2-Paket-ID. Die vom Nutzer sichtbaren zwei App-Namen STAGE und TEST V2 passen zu getrennten Installationen, aber die tatsächliche Zuordnung der auf dem Handy installierten Pakete ist ohne Paketmanagerdiagnose noch nicht verifiziert.
- Für das **bestehende TEST V2** ist Build #5 als Ursprung wahrscheinlicher als #4; ausdrücklich **Hypothese**. Das Installationsproblem von #6 ist weiterhin ungeklärt.
- Nächster Schritt: installierte V2-Paket-ID/Signatur und exakten Installationsfehler ermitteln. Keine Daten löschen, keine weitere APK auf Verdacht.

## Abschließender Zertifikatsvergleich / Schlüsselsuche (15.11.2026)

- GitHub Actions [Diagnose #4](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43736451374): **BESTANDEN**; alle Fingerabdrücke tatsächlich ausgelesen.
- Installierte V2 (App Analyzer, Nutzer-Screenshot): `bab2610df631cd2616bc5eb2fbbd7c06f51b69e7f8fff873b9474bf4446c1780`.
- Build #4: `9ad497999407e768119117e3dca83d54f811cccaef2a4f35648c5833911dae30` — MISMATCH.
- Build #5: `bab2610df631cd2616bc5eb2fbbd7c06f51b69e7f8fff873b9474bf4446c1780` — **MATCH**.
- Build #6: `124aff3e9fd3093de52d9b504130b248c8ff9d1c0a9c4cd7a68a455b5b2ec09a` — MISMATCH.
- Build #7: `0f57d011e151dd8e924ebdd48ac3505411fed530ffdbac45d05a1c2c67ec048f` — MISMATCH.
- **Ursache bestätigt:** automatischer Debug-Keystore wechselte zwischen GitHub Actions Läufen; späterer Build kann installierte V2 nicht aktualisieren.
- GitHub-Code-Suche nach `debug.keystore`, `keystore`, `signingConfig`: keine Ergebnisse im durchsuchbaren Standardbranch. Dies ist **kein Beweis**, dass in anderen Branches/externen Speichern keine Sicherung existiert.
- Artefakte von Run #5 und #7 enthalten jeweils nur `phalanx-stage-debug-apk` und `phalanx-stage-lockfile`, keinen Keystore.
- Privater Signaturschlüssel von #5: **NICHT GEFUNDEN**. APK-Zertifikat erlaubt keine Wiederherstellung des privaten Schlüssels.
- **STOPP für In-Place-Update** bis Schlüssel nachweislich vorliegt. Weder bestehende V2 deinstallieren noch App-Daten löschen.
- Option: zuerst explizit geprüften Datenexport / Migration entwerfen und testen; erst danach mit Freigabe zu neuer dauerhaft signierter App wechseln.
- Status: Signaturdiagnose BESTANDEN; Schlüsselverfügbarkeit NICHT NACHGEWIESEN; Datenbackup/Wiederherstellung NICHT GETESTET; Update FEHLGESCHLAGEN; Produktion UNVERÄNDERT.

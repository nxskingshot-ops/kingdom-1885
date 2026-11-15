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

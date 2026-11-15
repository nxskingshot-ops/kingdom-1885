# PHALANX Android – isolierte Vorbereitung

Branch: `work/phx-android-capacitor-isolated-20261115`.

Dies ist **kein APK-Release**. Die freigegebene HOME-Datei (`www/index.html`, 11.7 MB) und Queen-An-Grafik (`www/PHX_HOME_QUEEN_AN_APPROVED.png`, 2.6 MB) liegen nur im gesicherten lokalen Testpaket und sind **nicht** Bestandteil dieses Branch-Commits. Keine Web-App oder Moduldatei wurde ersetzt.

## Sperre vor Build

1. Beide Originaldateien aus dem gesicherten Paket nach `android-stage/www/` übertragen.
2. SHA-256 mit `checksums.json` prüfen, vor jedem Build abbrechen bei Abweichung.
3. `package-lock.json` mit Netzwerkzugang erstellen und prüfen.
4. Erst danach isolierten CI-Workflow für Debug-APK aktivieren und Android-Tests durchführen.
5. Keine Produktion, kein Release, keine Datenänderungen oder FREEZE-Änderungen.

**Status:** Branch und Android-Konfiguration vorhanden; APK NICHT GEBAUT; Android NICHT GETESTET.

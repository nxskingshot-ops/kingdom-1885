# PHALANX HOME FINAL · Feste Testadresse · 20.11.2026

**Status · Isoliert bereitgestellt. Live-Profil und Reload im bestehenden FaQu-Testkonto bestätigt. Physische Android-Abnahme offen.**

## Bereitstellung und Rückweg

- Freigabe des Projektverantwortlichen am 20.11.2026 für die feste isolierte Cloudflare-Adresse. [HOME-Testansicht](https://home-plaque-visual-20261117.nexus-phalanx-kvk-test.pages.dev/#phalanx-home)
- Testbranch `test/home-plaque-visual-20261117`, ausgelieferter Commit `6a58c9adca7f984ded1694d5c2d51f750a2bb2e7`. Vier Dateien bytegleich aus dem bereits geprüften Commit `a84a106b1fa9bee3b932c793a13b665f3ed02162` übernommen: HOME-CSS, HOME-Controller, Namensumbruch und Browser-Regressionstest. [Vorausgehendes Android- und Layoutprotokoll](https://github.com/nxskingshot-ops/kingdom-1885/blob/a84a106b1fa9bee3b932c793a13b665f3ed02162/docs/staging/PHX-HOME-ANDROID-PLAQUE-20261120.md)
- [Actions 44668665321](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44668665321) · Job `136064084296`, erfolgreich. Cloudflare-Deployment `34109c0c`, 04:35:56 Uhr MEZ. HTML entspricht dem geloggten Workflow einschließlich des Zeilenumbruchs vor dem schließenden Body-Tag. JS, CSS, Namensskript und Original-PNG stimmen an Alias und Deployment-Host bytegenau mit dem Build überein.
- Vor der Veröffentlichung stand der feste Git-Branch auf `d11dc15`. Der Alias lieferte nachweislich den Build von `1cc0091` aus. Das ursprüngliche HTML, JS und CSS dieses Builds wurden lokal rekonstruiert und gegen die vor dem Update ausgelieferten Dateien verglichen. Die Branch-Sicherungen `backup/phx-home-fixed-preview-before-plaque-20261120` → `d11dc15` und `backup/phx-home-before-android-visual-fix-20261119` → `1cc0091` sind vorhanden.
- Das vorherige Deployment `86b5f2cb` ist erreichbar. Nach dem Update ausgelieferte CSS- und JS-Dateien auf dessen eigenem Host stimmen mit dem gesicherten Vorzustand überein. Eine Rückschaltung des festen Alias wurde nicht ausgeführt. [Vorheriger Actions-Lauf](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44258035109)
- Geschützte Originaldateien, Module, Supabase-Konfiguration, Rollen und Produktion wurden nicht geändert.

## Prüfergebnisse

| Prüfung | Ergebnis |
|---|---|
| Origin der festen Testadresse | BESTANDEN · Echter Profil-Preflight liefert 204 mit exaktem Allow-Origin. |
| HOME und Reload mit echtem Konto | BESTANDEN · Bestehende FaQu-Sitzung übernommen. Nach Reload zeigt die korrigierte Helm-Plakette FaQu, #1885 und NXS. |
| War Room nach Reload | BESTANDEN · Avatar-Einstieg, Spielerkonto und Verifizierungsstatus bleiben sichtbar. `Verified profile · MightPulse` um 04:36:59 Uhr MEZ im Profil überprüft. Eine neue Passwortanmeldung wurde für den Live-Test nicht ausgeführt. |
| Navigation im ausgelieferten Browserstand | BESTANDEN · War Room → HOME, Territory Control → Outpost Map → zurück → Reports → HOME, PYLON IX → HOME. |
| Mobilbrowser 320, 393, 430 px | BESTANDEN im Deploy-Workflow · Layout, Routen, Anmeldung mit simulierten Serverantworten, Reload, Token-Erneuerung, Profilaktualisierung, Abmeldung und abgewiesene Falschanmeldung. |
| Android-Testpaket | BESTANDEN für Build und Integrität · [Actions 44668665290](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44668665290), [Artefakt 14598578110](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44668665290/artifacts/14598578110). Unabhängige Debug-Paketkennung `app.nexusphalanx.stage.plaquevisual`, Commit und SHA-256 verifiziert. CSS, JS und Queen-An-PNG im APK entsprechen dem Web-Build. SHA-256 des APK `3c25ed09fa5188e4a3ca50cc955e13e0afbb4122dd16ed829e8e3e9e5d26e757`. |
| Physisches Android, neue Live-Anmeldung und vollständige fachliche War-Room-Abnahme | NICHT GETESTET. Die Android-WebView-Regression des Änderungssatzes ist im vorausgehenden Prüfprotokoll dokumentiert. |

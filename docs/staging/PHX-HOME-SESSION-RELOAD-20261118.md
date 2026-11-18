# HOME · Anmeldung nach Neuladen und kompakter Profilbereich · 18.11.2026

Status: FEHLERKORREKTUR AUF FESTER TESTADRESSE BEREITGESTELLT. MOBILE BROWSERMATRIX UND ECHTER LOGIN/RELOAD IM CLOUD-BROWSER BESTANDEN. Physische Android-Nachprüfung offen.

## Abschluss dieser Fehlerkorrektur

- Veröffentlicht aus Commit **583fa3fb0e0a6379aac278af29c6c9777ecf5c44**.
- [Webworkflow 44245851814](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44245851814) BESTANDEN; Job 134604498809. Veröffentlicht am 18.11.2026 um 05:42:59 UTC, Cloudflare-Deployment 5e2ed72d, unveränderter fester Alias.
- BESTANDEN: Browserprüfungen mit simulierten HTTP-Antworten bei **320, 393 und 430px**, jeweils Login, kompakte Darstellung ohne Feldüberlauf, Reload ohne neue Passwortanfrage, abgelaufener Sitzungstoken/Erneuerung, War Room/Rückweg, Logout/Reload, fehlgeschlagene Anmeldung. Screenshots im Workflow-Artefakt phx-home-session-mobile-evidence.
- BESTANDEN: echter Cloud-Chrome-Test auf der festen Webadresse. Sichere Passwortanmeldung, verifiziertes Profil für ID **291410048**, FaQu, #1885, NXS, Power **194876881**. Quellzeit **05:15:42 UTC**, erste Checked-Zeit **05:44:15 UTC**.
- Danach echte Browser-Neuladung desselben Tabs. Zunächst leerer Ladezustand, anschließend **ohne erneute Anmeldung** identische autorisierte Identität und neue Checked-Zeit **05:44:58 UTC**. Sitzung erhalten, Profil frisch geprüft; unveränderte Quellzeit korrekt beibehalten. Keine Token-/Passwortwerte über Browserwerkzeuge gelesen.
- BESTANDEN: live DOM-Messung Profilüberschrift **18px**, Datensätze als **grid**, Profilbox Höhe rund **322px** bei rund **708px** Inhaltsbreite auf Desktop. Kein Android-Nachweis aus dieser Desktopmessung abgeleitet.
- Bestehendes Browsertest-Fixture in test-home-v25.cjs an die vollständige Supabase-Sessionantwort angepasst (synthetischer Refresh-Token/Ablaufzeit). Vollständige alte Browser-Suite in dieser Runde NICHT GETESTET; fokussierte neue Browsermatrix und bestehende 14 Handler-Tests bestanden.
- BACKUP-Ref im GitHub erstellt: backup/phx-home-before-session-fix-20261118 bei 169de99792aed44d2a5de52e11fcaaef87059e55. Historische Quellen und Daten erhalten.
- Versuch eines zusätzlichen bytegenauen HTTP-Abgleichs der Webdateien aus der Shell wurde durch HTTP 403 blockiert: NICHT GETESTET. Browserzugriff und realer Reload funktionierten; kein neuer App-/CORS-Fehler daraus abgeleitet.
- NICHT GETESTET: neue physische Android-Bestätigung nach dieser Korrektur, echter Ablauf eines Live-Refresh-Tokens über längere Zeit, Schließen/Wiederöffnen des Tabs oder nativer App-Neustart. Letztere sind nicht Ziel der tabbezogenen Sitzung.
- Keine neue Backend-/Origin-/Rechteänderung, kein Produktivdeploy. Weitere HOME-/War-Room-/Modulaufgaben bleiben bestehen. Kein Gesamt-FERTIG.

## Nutzerbelege und Ursache
- Android-Screenshot 50500.png: FaQu, #1885 · NXS, ID 291410048, Verified profile · MightPulse, Power 194876881, Quellzeit 05:15:42 UTC sichtbar. Bestätigt eigenen Live-Abruf auf Nutzergerät, keine vollständige App-Abnahme.
- Meldung „Beim aktualisieren ist der login wieder weg“: Code hielt nur access_token in einer lokalen JS-Variablen. Reload initialisierte sie mit null; refresh_token wurde verworfen.
- HOME-Profil war unformatiert: CSS verlangte direkten Kindknoten von #phx-r6-home, das bestehende Formular wird jedoch innerhalb des vorhandenen HOME-Inhaltscontainers eingefügt.

## Korrektur und Grenzen
- Neue kleine Sitzungsverwaltung phx-war-room-session.js: sessionStorage nur für denselben Tab und denselben isolierten Projekt-Schlüssel; Reload bleibt angemeldet. Keine Zusage für geschlossene Tabs, Browser-Neustart oder native App-Neustarts.
- Gespeichert werden ausschließlich Access-/Refresh-Token und Ablaufzeit, niemals Passwort, E-Mail oder Profilwerte. Neue Profile kommen erneut aus der autorisierten Edge Function, keine lokalen Identitätswerte.
- Ablaufende / serverseitig abgewiesene Access-Tokens einmalig über bestehenden Supabase-Refresh-Endpunkt erneuern; rotierende Tokens sichern. Gleichzeitige Refreshes zusammenfassen. Verspätete Refreshes dürfen Logout oder neuen Account nicht überschreiben.
- Temporäre Netz-/Serverfehler melden und Sitzung für erneuten Versuch behalten. Ungültige Refresh-Tokens beenden die Sitzung.
- Logout löscht nur diesen Sitzungsschlüssel und nutzt bestehenden lokalen Supabase-Logout. Andere gespeicherte Nutzerdaten bleiben unverändert.
- Korrekte CSS-Nachfahrenselektoren, 18px Überschrift/14px Datenraster, umbrechende Werte und vorhandene Formularfelder in kompakter Box. Queen-An-Grafik, Plaketten, Navigation und Territory-Control-Design unverändert.
- Integration lädt Sitzungsdatei vor vorhandenem Livecontroller. Kein neues Loginformular oder zweites Kontomodell.
- Keine Supabase-/JWT-/RLS-/Rollen-/Secretsänderung. Bestehende Origin-Funktion v4 unverändert.

## Sicherung
- Ausgangscode: d0dec3763b8c094cb796d174b538edc9a13799fd; feste Webbasis 169de99792aed44d2a5de52e11fcaaef87059e55.
- BACKUP ERSTELLT: TAR der drei betroffenen Ausgangsdateien (Live-JS/CSS und Integrationsskript) lokal.
- INTEGRITÄT GEPRÜFT / WIEDERHERSTELLUNG LOKAL GETESTET: Archiv in separates Verzeichnis extrahiert und alle Dateien bytegenau mit Git-Baseline verglichen.
- Gehostete Wiederherstellung NICHT GETESTET. Git-Backup-Ref und unveränderter Ausgangscommit dienen als Rückweg; keine Datenmigration.
- Deployment nur feste isolierte Testadresse. Kein main-Merge.

## Prüfungen
- BESTANDEN: 10 Node-Sitzungstests; Reload, Rotation/Deduplizierung, Logout, verspätete Antworten, Accountwechsel, ungültige Tokens, Netzausfall, korrupter/gesperrter Speicher, erzwungene Erneuerung.
- BESTANDEN: 14 bestehende Edge-Handler-Tests, geschützte Asset-Prüfung, JS-Syntax, diff --check.
- GEPLANT: Browserprüfung mit simulierten Auth-/Profildaten bei 320/393/430px vor Veröffentlichung, einschließlich Login, Reload, abgelaufener Sitzung, War Room, Logout und falscher Anmeldung.
- NICHT GETESTET: neue echte Android-Abnahme; Auth-Rollen-/Quota-Matrix unverändert aus vorherigem Register.
- Neue Dateien: android-stage/www/phx-war-room-session.js; android-stage/scripts/test-war-room-session.cjs; android-stage/scripts/test-home-session-browser.cjs.
- Geänderte Dateien: vorhandener Livecontroller/CSS, Integrationsskript, bestehender Webvorschau-Workflow.
- HOME-Gesamtstand, lange Namen, Gestaltung, War-Room-Restfunktionen und Modulintegration bleiben offen. Kein FERTIG.

## Erster CI-Lauf
Lauf 44245702031: FEHLGESCHLAGEN vor Browserstart, weil ubuntu-latest inzwischen Ubuntu 26.04 auswählte und der vorhandene fixierte Playwright-Stand 1.58.2 diese Plattform nicht unterstützt. Veröffentlichung wurde korrekt übersprungen; feste Webadresse unverändert. Runner wie in den bestehenden PHALANX-Browsertests auf ubuntu-24.04 fixiert, danach erneute Prüfung.

## Physische Android-Bestätigung · 18.11.2026

BESTANDEN gemäß ausdrücklicher Nutzerrückmeldung „Funktioniert“ nach Aufforderung zum Reload-Test. Screenshot 50501.png (Gerätezeit 06:48) zeigt angemeldeten HOME-Zustand, FaQu, #1885 · NXS sowie den korrekt formatierten Live-Profilbereich. ID 291410048, Power 194876881, Quellzeit 05:15:42 UTC, Checked 05:48:52 UTC. Die erfolgreiche Sitzungserhaltung nach Neuladen ist durch die Nutzerrückmeldung bestätigt; die Bilddatei allein belegt nicht die Bedienfolge.

Die vorige offene physische Android-Nachprüfung ist damit für Login/Reload und den dargestellten Profilbereich abgeschlossen. Kein Nachweis für native App-Neustarts, lange Namen, sämtliche Navigationen, Rollen oder vollständige HOME-/Modul-Abnahme daraus abgeleitet. HOME-Gestaltungsabstimmung bleibt der nächste Arbeitsblock; keine neue Designfreigabe aus „Funktioniert“ ableiten.

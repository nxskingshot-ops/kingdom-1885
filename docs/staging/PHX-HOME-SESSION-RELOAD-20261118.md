# HOME · Anmeldung nach Neuladen und kompakter Profilbereich · 18.11.2026

Status: IMPLEMENTIERT, LOKAL GETESTET; Web-/Browser-Ergebnisse werden nach Ausführung ergänzt.

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

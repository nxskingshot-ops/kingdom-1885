# PHALANX HOME FINAL — Android Design Audit · 17.11.2026

Status: OFFEN · Analyse dokumentiert, keine visuelle Abnahme, keine Produktionsänderung.

## Eingangsbelege
- Physisches Android: 50335.png (War Room, verifiziertes MightPulse-Profil) und 50336.png (HOME nach Rückkehr), vom Projektverantwortlichen bereitgestellt.
- Funktionale APK-Quellbasis: 05000c444d98c64e9a9d98587d16a485abe50cb4.
- Verbindliches Protokoll: docs/staging/PHX-HOME-FINAL-ABNAHME-20261116.md.
- Der Branch work/phx-home-final-audit-20261116 enthält gegenüber der funktionalen Basis nur Workflow und Dokumentation (vor diesem Audit). Die Workflow-Datei checkt explizit den Quellcommit 05000c4 aus: Änderungen an Branch-Assets allein gelangen daher NICHT in die Test-APK.

## Sichtbefunde
1. HOME: großer grauer Bereich oberhalb der Queen-An-Szene, obwohl Statussymbole auf HOME nicht sichtbar sind. FEHLGESCHLAGEN.
2. HOME: auffällig große ungenutzte Fläche unter den Command-Center-Kacheln. Designprüfung offen; nicht automatisch mit Platzhaltermodulen füllen.
3. HOME: Profilplaketten nach Live-Login genau einmal FaQu und #1885 · NXS; Levelzeile nicht sichtbar. BESTANDEN laut Nutzergerät.
4. War Room: Android-Statusleiste sichtbar; unter der Test-Toolbar folgt das originale Dossier. Ob dies beabsichtigt ist, gegen HOME-FREEZE prüfen.
5. War Room: sichtbare technische Toolbar HOME / Live profile / HOME FINAL TEST; darunter separate Live-profile-Box statt einheitlicher Dossierdarstellung.
6. War Room: im grafischen Dossier sind Player ID und Last updated als Beschriftungen sichtbar, ohne zugehörige dynamische Werte; die separate Live-Box enthält diese Werte.
7. War Room: leeres Kronen-/Level-Feld; HOME-Levelverbot nicht ungeprüft auf War Room übertragen.
8. War Room: Account Intelligence und Alliance Position als Grafik-Kacheln vorhanden; Funktion und Datenbindung durch Screenshot nicht belegt.
9. Native Android-Outpost-JSON/CSV-Speicherung: NICHT GETESTET, Browserexporte mit 74 Einträgen dokumentiert.

## Codebefunde (Quellbasis)
- android-stage/www/phx-war-room-v2.css setzt am Wurzelelement #phx-r8-war padding-top: env(safe-area-inset-top). Dieses Verhalten ist mit dem nativen Fenster-Inset zusammen zu prüfen, nicht ohne Messung global auf 0 zu setzen.
- android-stage/www/phx-war-room-live.css definiert die sichtbare Test-Toolbar und Live-Account-Darstellung; eine Änderung darf Login, Verifizierung, Fehlerstatus, Sign-out und Aktualisierung nicht verdecken.
- .github/workflows/phx-home-final-device-test.yml generiert das Android-Projekt und setzt WindowCompat.setDecorFitsSystemWindows(..., true), StatusBar-Konfiguration und native OutpostExport-Registrierung. Der graue HOME-Bereich kann daher aus nativem Inset, Root-Layout oder CSS kommen. Eine eindeutige Ursache ist NICHT NACHGEWIESEN.

## Korrekturverfahren (vor Änderung)
1. Android HOME: getWindowInsets/Systemleisten-Sichtbarkeit, WebView-Viewport und BoundingRects von body, #phx-r6-home und Queen-An-Container im selben Build erfassen. Grauen Bereich einem konkreten Element/Inset zuordnen.
2. Nur den nachgewiesenen Auslöser in isolierter generierter Test-App korrigieren. Originalgrafik und freigegebene Profilplaketten byteidentisch erhalten.
3. War Room: eine rein visuelle, reversible Darstellungsschicht entwickeln, die die Live-Box nicht funktionslos entfernt. Nachgewiesene Live-Werte im Dossier und Diagnosedaten zugänglich halten.
4. Test-Workflow so anpassen, dass er ausdrücklich die gewählte neue Quellbasis baut; SHA-256, Paketkennung und Artefakt-Commit dokumentieren.
5. Android-Gerät: HOME-Screenshot nach Kaltstart und Rückkehr, War Room, Anmeldung, Refresh/Sign-out, Profilwerte, Navigation, Outpost Map mit 74 Einträgen, JSON-/CSV-Dateidialog, tatsächliches Speichern und erneutes Lesen beider Dateien.
6. Keine Änderung an Territory Control, Queen-An-Original, Backend, Auth, Rollen, GOD-Mode oder produktiver Bereitstellung.

## Testmatrix dieser Audit-Runde
- GitHub-Branch und Workflow: BESTANDEN (lesend geprüft).
- Grafische Ursachenfeststellung: NICHT GETESTET (kein WebView-Inset-/DOM-Messprotokoll).
- Designkorrektur und Android-Build: NICHT GETESTET.
- Browser-/Android-Regression: NICHT GETESTET.
- Native JSON-/CSV-Dateien: NICHT GETESTET.
- Produktionsänderung: KEINE.

Keine Freigabe, kein FERTIG.


## War Academy / T11 Integration Gate · 17.11.2026
- User decision: NO standalone main module. Shared intelligence adapter for existing War Room > Player Development and Transfer Scouting > Account Assessment.
- Existing `android-stage/www/phx-war-room-v2.js` has a `development` details panel with an unverified placeholder; preserve the panel and HOME freeze.
- Existing `android-stage/www/phx-war-room-live.js` obtains the authenticated player's verified profile via `/functions/v1/phx-war-room-own-profile`; do NOT bypass account ownership or expose credentials.
- First build a read-only adapter isolated from production. Normalize each value with `{value,source,observedAt,verification}`; `unknown` must never become zero or `not unlocked`.
- Player-ID-specific: use only authorized backend response. MightPulse documented player identity/power and town-center field require field-by-field verification; do not invent individual War Academy/T11 values.
- Reference data: validate license, schema, version and source checksum before import. No blind writes to Supabase or automatic overwrites of manual confirmations.
- War Room: show building progress, War Academy, T11 branches, next milestone only when grounded. Transfer: compact same facts; unknown excluded from negative score.
- Dependencies: HOME Android installation and layout regression still open. No live API integration, production changes, or completed Android tests claimed.
- Gates: isolated unit tests, source field mapping, permissions/RLS, export, mobile navigation, regression, release approval.

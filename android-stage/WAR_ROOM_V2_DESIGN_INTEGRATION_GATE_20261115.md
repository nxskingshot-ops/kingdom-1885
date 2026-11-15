# PHALANX WAR ROOM V2 – Designabgleich und Integrations-Gate
Stand: 2026-11-15 · Status: DESIGNRICHTUNG AKZEPTIERT, NICHT IMPLEMENTIERT, NICHT FREIGEGEBEN

## Quellen und Bestand
- Projektdateien 01_START_HERE.md, 02_DESIGN_FREEZES.md, 03_FEATURE_REGISTER.md, 04_SECURITY_GOD_MODE.md, 05_ROADMAP_RELEASE.md (Projektübergabe, teils älter).
- Aktueller isolierter Android-Testbranch: work/phx-android-v21-parallel-20261115.
- android-stage/capacitor.config.json: app.nexusphalanx.stage.v21parallel; StatusBar overlaysWebView=false.
- android-stage/checksums.json: index.html SHA256 b675a78957893f13bb9708f604310ccba27774a0087d788605cede40bd690604; PHX_HOME_QUEEN_AN_APPROVED.png SHA256 44af7b03d8fc1e68ac950b663aef8605bb1c9406e471eec4d10634b2083a9ada.
- Screenshots vom Nutzer am Android-Gerät: HOME, Territory Control, Outpost Map 2.0, Reports und War Room; Navigation und Rückwege bestätigt.
- Die grafische War-Room-V2-Idee wurde als Richtung akzeptiert, nicht als finales pixelgenaues Design oder funktionale Implementierung.

## Verbindlicher Abgleich vor Integration
1. Queen-An-HOME, Originalgrafik und dynamische Profilplakette unverändert erhalten; kein Redesign von HOME.
2. Territory Control vom 10.11.2026 vollständig geschützt; kein Umbau von Header, Festung, Kacheln, Navigation.
3. Unified Header V2: HOME goldene Augen; Module rot; Funktionen blau; Burger nur bei Modulen/Funktionen.
4. Epic Navigation V2 RC5 und originale goldene 3D-Icons respektieren.
5. PHALANX WORLD: Stein/Holz/Bronze und sparsame Rot-Gold-Akzente.
6. PYLON IX: ausschließlich das freigegebene Originalemblem; keine neu generierte Ersatzgrafik.
7. Outpost Map 2.0 mit 74 Außenposten, Filtern, Zoom, Vollbild, JSON/CSV-Export und Reports unangetastet.
8. War Room ist persönliches Account-Dossier; bestehende drei frei belegbaren Schnellzugriffe erhalten und in kompakterer Darstellung integrieren.
9. HOME und War Room teilen dieselbe autorisierte, an Spieler-ID gebundene Identität; automatische Initialladung beim ersten App-Einstieg, spätere Aktualisierung mit sichtbarem Zeitpunkt. Keine erfundenen Live-Daten.
10. Die früher ausgeschlossenen Master/Pet/Hero-Power-Felder nicht ohne erneute Freigabe in den War Room aufnehmen. Grafikentwurf mit vier anonymen Stat-Kacheln ist keine Funktionsfreigabe.
11. Kein Avatar-Scraping aus Kingshot; erlaubtes Standardemblem oder nutzerseitig gewähltes Bild.
12. Sicherheitsmodell, Rollen, GOD MODE und Serverberechtigungen bleiben unberührt.

## Offene technische Prüfungen
- Quellcode-Stellen der bestehenden War-Room-Routen und Speicherzugriffe präzise identifizieren.
- Autorisierte Live-Spieler-ID-Quelle und Transfer-Scouting-Adapter read-only prüfen.
- Sicherstellen, dass die Initialladung HOME nicht blockiert; Offline- und Fehlerzustände definieren.
- Layout auf Android einschließlich Statusleiste, lange Spielernamen und Scrollen testen.
- Schnellzugriff öffnen, umstellen, speichern und nach Neustart laden testen.
- Regressionsprüfung HOME → Territory Control → Map/Reports → zurück und HOME → War Room → HOME.
- Datensicherung, Datenmigration, Benutzerrollen, Integrität und Exporte separat prüfen.

## Status
- FREEZE-Abgleich mit den fünf bereitgestellten Projektregistern: BESTANDEN (Dokumentensichtung).
- Aktueller GitHub-Branch und zwei Prüfsummen: BESTANDEN (read-only abgerufen).
- Designrichtung: AKZEPTIERT; finale Grafik: NICHT FREIGEGEBEN.
- Änderungen an HTML, HOME, Territory Control oder Nutzerdaten: KEINE.
- War-Room-V2-Implementierung: NICHT BEGONNEN.
- Android-Regressionsprüfung für War Room V2: NICHT GETESTET.

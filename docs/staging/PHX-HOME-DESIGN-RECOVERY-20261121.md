# PHALANX HOME – Design-Recovery / Ursachenabgrenzung – 21.11.2026

Status: RECOVERY-BRANCH ERSTELLT; KEINE DEPLOYMENT- ODER DESIGNABNAHME.

## Quellen und Ausgangspunkte
- Dokumentierte kompakte HOME-Basis: 3fc690c6cbb45f490c250cdcd4a66cab1828ecbe, Workflow 44248629689; Browserprüfungen und echte Session dokumentiert in PHX-HOME-COMPACT-DESIGN-20261118.md.
- Neue zusätzliche Unified-Plaque: Arbeitsstand 1cc0091f3b7f87417aa89ffdd036076bd9433739, danach Android-CSS-Änderung ba5b3d2bd0233f98d6f20988227c119f5766c366 und Workflow 90f6c4b94f24518e54485beae1dea2dd110fb214.
- Benutzer-Screenshots zeigen über der unveränderten Queen-An-Szene eine zweite Profil-/Avatar-Zeile, während die ursprüngliche Szene selbst einen War-Room-Einstieg zeigt; diese visuelle Doppelung ist nicht durch reine Größenkorrektur lösbar.
- Der Nutzer hat den sichtbaren Android-Stand ausdrücklich abgelehnt. Keine visuelle Freigabe.

## Sichere Entscheidung
- Neuer isolierter Branch work/phx-home-design-recovery-20261121 startet EXAKT von 3fc690c6, ohne neue Unified-Plaque-Änderungen zu übernehmen.
- Der aktuelle Stand work/phx-home-android-visual-fix-20261119 und Backup backup/phx-home-before-android-visual-fix-20261119 bleiben unangetastet.
- Dies ist KEIN vollständiger Rollback einer Live-Umgebung und KEIN Nachweis, dass die ältere Oberfläche bereits pixelgenau der finalen Freigabe entspricht.
- Keine Änderung an HOME-Original-PNG, Backend, MightyPulse-Profilquelle, Auth, Rollen, Territory Control, 74 Outposts, Exports oder Produktion.

## Prüfstatus
- BESTANDEN: Repository-Quellenvergleich und Wiederherstellungsbranch erstellt.
- BESTANDEN (historischer Nachweis, nicht neu getestet): kompakte Browsernavigation, Auth/Reload und HOME-War-Room-Rückweg gemäß PHX-HOME-COMPACT-DESIGN-20261118.md.
- FEHLGESCHLAGEN: visuelle Android-Abnahme des späteren Unified-Plaque-Standes laut Nutzerrückmeldung.
- NICHT GETESTET: neue isolierte Recovery-Bereitstellung, tatsächliche Android-Ansicht des Recovery-Branches, aktuelle Live-Auth, aktuelle Module/Exporte, Wiederherstellung der gehosteten Version.

## Nächster Schritt
1. Freigegebene Designreferenz (Originalmockup vom 18.11.) als visuelle Abnahmegrundlage gegen die unveränderte Queen-An-Grafik abgleichen.
2. Isolierte Recovery-Vorschau über bereits vorhandenen Workflow nach gezielter Prüfung bereitstellen; niemals main/Produktion ersetzen.
3. Android-Screenshot gegen Referenz prüfen, dann nur den belegten Verursacher ändern.
4. Login, Reload, War Room, Territory, Reports, PYLON und 74er-Outpost-/Exportregressionen prüfen.
5. Erst nach bestandenem Nachweis eine Freigabe beantragen.

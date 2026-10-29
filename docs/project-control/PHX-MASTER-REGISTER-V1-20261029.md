# NEXUS PHALANX — MASTER REGISTER V1.0
Stand: 2026-10-29 | Status: BEGINN BESTANDSAUFNAHME / KEIN RELEASE-NACHWEIS
Repository: nxskingshot-ops/kingdom-1885 | Register-Branch: governance/phalanx-project-control-20261021
Projekt: NEXUS PHALANX 1.0 — FIRST STRIKE | Kingdom #1885

## Verbindliche Leseregel
Status strikt unterscheiden: GEPLANT, FREEZE, DOKUMENTIERT, IMPLEMENTIERT, TECHNISCH GETESTET, GERÄTEGETESTET, FREIGEGEBEN, PRODUKTIV. Ein aktiver Edge-Function-Eintrag beweist nicht die End-to-End-Funktion. Ältere Designvarianten sind keine Freigabe. Neuere explizite FREEZEs haben Vorrang. Keine produktiven Änderungen, Merges, neuen Kosten oder RLS/Auth-Anpassungen ohne ausdrückliche Freigabe.

## Quellen und Audit-Grenze
- Canonical handoff: docs/project-control/START-HERE-PHALANX-AI-HANDOFF-20261021.md auf governance/phalanx-project-control-20261021 (am 29.10. erneut gelesen).
- Projektquellen 01_START_HERE, 02_DESIGN_FREEZES, 03_FEATURE_REGISTER, 04_SECURITY_GOD_MODE, 05_ROADMAP_RELEASE, Stand 21.10.2026.
- Supabase Projekt kingdom-1885-app (eu-central-1), ref hcjrdofkdkasznywvcxo: read-only list_tables, get_edge_function und SELECT-Abfragen am 29.10.2026.
- GitHub branch search am 29.10.2026: u.a. governance/phalanx-project-control-20261021, phalanx-cloudflare-test-deploy, feature/phalanx-top40-integration-20261013, backup/phalanx-isolated-20261016-2bf23e44. Noch KEIN vollständiger Branch-/Asset-/Deployment-Audit.

## Erste verifizierte Funktionsinventur
| ID | Bereich | Ist-Befund 29.10.2026 | Status / offener Nachweis |
|---|---|---|---|
| PHX-001 | HOME / War Room | verbindliche HOME/Header-FREEZEs; kanonische HOME-Binärgrafik laut Handoff noch nicht archiviert | FREEZE; Integration/Android offen |
| PHX-002 | Territory Control / Outpost Atlas | 74 Datensätze in public_outposts_verified_20261002; public_outposts derzeit 68; Version/Verwendung im Frontend ungeprüft | Daten vorhanden; 74er-Integration offen |
| PHX-003 | Outpost Reports / Navigation | geschützte Route HOME → Territory Control → Atlas/Reports → zurück; Epic Navigation V2 ausgemustert | FREEZE; Browser-End-to-End offen |
| PHX-004 | MightPulse Rankings | phalanx_mightpulse_rank_snapshots 3136 Zeilen, 16 Boards (196 Snapshots je Board); inkl. gov_gear, gov_charm, hero_equip, hero_total, pet_power, research_power, mystic_trial | IMPLEMENTIERT / Datenabrufprotokolle erfolgreich |
| PHX-005 | MightPulse Polling | letzte drei gespeicherte scheduled runs 29.10. um 10:00, 12:00, 14:00 UTC: jeweils 16/16 passed, successful=true, failures=[]; source_captured_at zuletzt 29.10. 00:57 UTC, Speicherung 14:00 UTC | gespeicherter Nachweis; Datenfrische von Quellzeit unterscheiden |
| PHX-006 | True Power | Supabase Edge Function nexus-true-power ACTIVE V6; liest manuelle mystic_trial_observations und power references, 6 Kategorien; letzte 84 Beobachtungen vom 29.09.2026 | IMPLEMENTIERT; automatischer MightPulse-Abgleich offen |
| PHX-007 | PYLON IX | Name, Emblem, Governance-FREEZEs; Konzept siehe unten | FOUNDATION GEPLANT; keine produktive KI-Integration behaupten |
| PHX-008 | Rollen / Registrierung / GOD MODE | Freigaberegeln und Eigentümerschutz dokumentiert; GOD MODE laut Security Register nicht technisch end-to-end getestet | FREEZE/ENTWURF; Security-Gate offen |
| PHX-009 | PHALANX WORLD | monumentale Festungswelt Holz/Stein/Bronze mit gezielten Rot-Gold-Akzenten | DESIGN FREEZE |
| PHX-010 | Backend/Recovery | Supabase-Projekt ACTIVE_HEALTHY; dokumentierte frühere verschlüsselte Backups/3 Restore-Tests, hier nicht unabhängig neu verifiziert | Infrastruktur bestätigt; Restore-Audit offen |

## PYLON IX — verbindlich zu bewahrendes Vorhaben / M01 FOUNDATION
**Meilensteinfolge:** M00 Bestands-, Quellen-, Backup- und Restore-Gate; danach M01 PYLON FOUNDATION frühzeitig, vor weiterer umfangreicher HOME-Feature-Expansion. Keine Behauptung, M00 sei bereits vollständig bestanden.

**Onboarding:** PYLON begrüßt neue berechtigte Nutzer persönlich; Kingshot-Spieler-ID aus genehmigter Registrierung/Profil-Verknüpfung; verfügbare verifizierte Spielerdaten mit Quelle und Zeitstempel übernehmen; kurze, freiwillige App-Tour; überspringbar und später erneut aufrufbar. Keine Annahme, dass alle Spielerdaten/Helden/Equipment über API verfügbar sind.

**Persönliche Beratung:** Helden, Ausrüstung, Charms, Governor Gear, Forschung, Pets, Ressourcen und Strategie analysieren, sobald zulässige Daten und geprüfte Kingshot-Regeln vorliegen. Erklärbare Handlungsempfehlungen mit Datenquelle, Aktualität, Unsicherheit, Priorität. Kein automatisches Handeln ohne Rolle und nötige ausdrückliche Freigabe.

**Mystic-Trial-Intelligence:** sechs Prüfungen als fachliches Modell: Coliseum (Helden), Forest of Life (Pets), Crystal Cave (Charms), Knowledge Nexus (Forschung), Molten Fort (Governor Gear), Radiant Spire (kombinierte Stärke). Eine gute Platzierung in der jeweiligen Prüfung ist ein *Indikator* für den Entwicklungsbereich, kein Beweis exakter Ausrüstungsstufen. Vor produktiver Nutzung Zuordnung und tatsächliche API-Felder verifizieren. Die vorhandene MightPulse-Board-Sammlung enthält aktuell ein gemeinsames `mystic_trial`-Board, nicht nachgewiesen alle sechs Einzelboards. `gov_gear` und `gov_charm` sind separat vorhanden.

**True-Power-Integration:** dieselbe belegte Datenbasis für PYLON und True Power; manuelle Trial-Snapshots vom 29.09. als historische Referenz bewahren; bestehende True-Power-Funktion V6 nicht überschreiben; in isolierter Entwicklung neue MightPulse-Boards verknüpfen, Identität/Spieler-ID matchen, Werte und Rankingpositionen zeitlich sauber zuordnen, keine exakten Gear-/Charm-Level erfinden. Zunächst erklärbares True-Power-Profil, gewichteter Score erst nach Formelvalidierung. Ranglisten/Spielerprofile sind zugriffsbeschränkt.

**Wissensfundament:** versionierter, belegter Kingshot-Wissenskatalog mit Regel-/Formelherkunft, Gültigkeitszeitraum, Verlässlichkeit, Tests; austauschbare modulare Schnittstellen/Erweiterungspunkte; Trennung von Beobachtung, Berechnung, Hypothese und Empfehlung. PYLON kann analysieren und empfehlen; serverseitige Rollenprüfung für jede geschützte Aktion, Mensch/Admin behält die letzte Kontrolle, GOD MODE nur nach Sicherheitsfreigabe.

**Gestaltung:** bestätigtes PYLON-IX-Emblem (roter Rundschild, goldenes Lambda, Lorbeer, IX), eingebettet in PHALANX WORLD und bestehende HOME-/Header-FREEZEs.

## Nächste gezielte Audit-Schritte
1. Vollständiges GitHub-Feature-, Asset-, Branch-, Versionen- und letzte-funktionierende-Deployment-Inventar mit Commit-SHAs und Belegen.
2. Supabase-Tabellen/Functions/Policies und MightPulse-Schema katalogisieren, ohne Geheimnisse oder personenbezogene Rohdaten ins Register zu kopieren.
3. Datenfelder/Identitätsabgleich und sechs Trial-Einzelrankings technisch prüfen; bestehende 16-Board-Pipeline schützen.
4. Isoliertes True-Power-V7-/PYLON-M01-Integrationspaket erst nach Source-Gate, keine produktiven Writes.
5. Gezielte Regressionen, Rollen-/Datenschutztests, Browser-/Android-End-to-End und explizite Release-Freigabe.

## Datenschutz und Änderungsregister
Dieses Dokument enthält keine API-Keys, Tokens, privaten Spielerdatensätze oder Backup-Passwörter. Am 29.10.2026 ausschließlich lesende Supabase- und GitHub-Prüfung; diese Registerdatei ist die einzige beabsichtigte GitHub-Änderung, auf dem Governance-Branch, kein Merge oder Deployment.


## Audit-Nachtrag A01 — Mehrquellenabgleich 29.10.2026
**Geprüfte Quellen:** 01_START_HERE, 02_DESIGN_FREEZES, 03_FEATURE_REGISTER, 04_SECURITY_GOD_MODE, 05_ROADMAP_RELEASE (Projektuploads); PHALANX_PRUEFREGISTER_2026-10-29.md; PHALANX_FIRST_STRIKE_ARBEITSLISTE_2026-10-29.md (Projektdateisuche); Governance-Handoff auf GitHub; GitHub-Branch-Suche; Supabase read-only Abfragen und Function-Quelltext; wiedergefundene Chatkontexte. Nicht jede historische Datei oder jede Chatnachricht war vollständig einzeln verfügbar. Kein Vollständigkeitsnachweis aller jemals erzeugten Artefakte.

### Nachinventarisierte Funktionen und Historie
| ID | Bereich | Wiedergefundener Beleg / Statusgrenze |
|---|---|---|
| PHX-011 | Outpost Reports V7–V9 | frühere Chatprotokolle: V7 Textsplit >480 Zeichen, Signatur/Status/UTC; V8 Kingshot Compact / Discord Detailed; V9 Default-Reset; dokumentierte 11–13 Tests. HISTORISCH, nicht aktueller R11-Nachweis. |
| PHX-012 | Outpost Map Alpha19/20 | historische HTML-Artefaktnamen und Nutzer-FREEZEs: NXS grün, OoO rosa, MYM violett, FRA korallrot; Auswahlmarker, Detailpanel, Kombifilter, Akademie-Ringe; keine automatische Rückkehr zu alten Alphas. |
| PHX-013 | Outpost Map Daten | 74 in public_outposts_verified_20261002, aber 68 in public_outposts; MISMATCH. Prüfen, welche Tabelle der tatsächliche aktuelle Atlas verwendet, bevor man von 74 Live-OP spricht. |
| PHX-014 | R11 + Atlas CORE V2 | Projekt-Prüfregister dokumentiert lokales ZIP PHX_R11_ATLAS_CORE_V2_LOCAL_BUILD_20261029.zip (24 Einträge) und Wiederherstellungspaket; Quelle/Ausführung nicht hier vollständig erneut geprüft; Vercel-Deployment-ID/URL fehlt. |
| PHX-015 | Android-Navigation / Export | Prüfregister führt Nutzerbestätigung 29.10. für HOME→Territory Control→Outpost/Reports→zurück und JSON/CSV auf früherem Teststand; nicht als Test des neuen R11-Atlas-Builds umetikettieren. |
| PHX-016 | Intelligence Timeline | Nutzerentscheidung 16.10.: erster erfasster Stand unveränderliche Baseline, datierte Entwicklung, Rankingbewegungen, fehlende Werte niemals als Null. FREEZE/KONZEPT; Implementierung offen. |
| PHX-017 | True Power ursprüngliche Methodik | Chat 29.09.: Gesamtkampfkraft minus Truppenstärke als Ausgangsvergleich, Mystic Trials als Zusatzindikator. Bestehende V6 liefert Daten, keinen nachgewiesenen final gewichteten True-Power-Score. |
| PHX-018 | KvK / Opponent Intelligence | Historische Teilimplementierungen, Top-40, Power-Analyse, KvK Force, Battle/Monte-Carlo-Frameworks in Chat dokumentiert; tatsächliche aktuelle Codeversion/Integration offen. |
| PHX-019 | Hero-/Rally-Optimierung | Historische Helden-/Skill-/Rally-Planung, Berechnungs- und Simulationsideen; spielmechanische Formeln und Live-Funktion nicht neu validiert. |
| PHX-020 | Mehrsprachigkeit | DE/EN/FR als bindende Zielvorgabe, appweit persistente Sprache; historische isolierte Sprachtests, vollständige aktuelle Integration offen. |
| PHX-021 | Backups | Frühere Berichte: verschlüsselte DB, 26 Edge Functions, 3 Restore-Tests, Drive-ZIP; B2-Bucket/Backup-Automatisierung historisch besprochen. Aktuelle Backup-Jobs, Wiederherstellbarkeit, Speicherziele und Originalartefakte NICHT erneut geprüft. Keine Secrets dokumentieren. |
| PHX-022 | Sicherheitsmodell | GOD MODE getrennt von Kingshot-Konto; genau ein geschützter Eigentümer; kein normaler Admin-Override; Eigentümerwechsel nur autorisierter Verkauf. SQL Guard Entwurf, echte Postgres-Tests offen. |
| PHX-023 | Registration / Access | E-Mail + Passwort + Kingshot-ID, E-Mail-Bestätigung, PENDING_APPROVAL; aktuelles altes Schema/Formular weicht laut Handoff ab. Rollen/RLS vor Release prüfen. |
| PHX-024 | Release-Strategie | FIRST STRIKE V1 lokal für NEXUS #1885 und kostenfrei, Entwicklungsziel ca. 300 Nutzer; V2 optional kingdomübergreifend mit Datentrennung; V3 mögliche Vermarktung nur nach Freigabe. Historische Strategie, keine aktuelle Kosten-/Skalierungsgarantie. |
| PHX-025 | Designvarianten / HOME | Historische HTML-Varianten und freigegebenes Referenzbild, aber kein nachgewiesenes kanonisches Binärasset; Epic Navigation V2 RETIRED, nicht neu einbauen. |
| PHX-026 | PYLON Intelligence | M01-PYLON-Konzept vollständig im Hauptregister; zusätzliche Timeline, True-Power-Daten und sechs Trial-Modelle als mögliche gemeinsame Datenbasis; nur verifizierte API-Felder verwenden. |

### Geprüfte Projektartefakte in der ChatGPT-Projektdateisuche
- PHALANX_PRUEFREGISTER_2026-10-29.md: Nutzerbestätigung früherer Android-Navigation, lokale Integration und Regressionen getrennt.
- PHALANX_FIRST_STRIKE_ARBEITSLISTE_2026-10-29.md: 26 offene Arbeitspakete und Hash des dokumentierten A039-R11-Originals: 32cbfc36af7d0405044f7ac73afac6ebd80273c9d70451c4c76bd2d3dc3d975b.
- PHX_M1_B016_SHA256_MANIFEST_20261022.json: Asset-/Dateimanifest, noch nicht vollständig mit allen ZIP-Bytes neu abgeglichen.
- build_r11_atlas_pylon_preview.py und assemble_core_v2.py: isolierte Build-Skripte auffindbar; Ausführung nicht erneut nachgewiesen.
- phalanx-master-integration-test.html: historische Testdatei auffindbar; nicht als aktuelles Deployment behandeln.

### Wichtige Konflikte / offene Gates
1. 74 verifizierte Outposts vs. 68 in public_outposts; Quelle und tatsächliche Laufzeitdaten klären.
2. Android-Erfolg auf früherem Stand vs. R11/Atlas neuer Build ohne zugeordnete URL/Build-ID; gezielte Regression, nicht alles erneut testen.
3. True-Power-V6 verwendet Trial-Snapshot 29.09.; MightPulse-Polling hat 16 Boards, deren gespeicherte Quellzeit hinter der Schreibzeit liegen kann; Aktualität nicht gleichsetzen.
4. `mystic_trial` als ein Board vs. sechs individuelle Trial-Prüfungen in manuell erfassten Beobachtungen; API-/Feldverfügbarkeit separat belegen.
5. GOD MODE / neue Registrierung: FREEZE ≠ sichere produktive Umsetzung.
6. R11/Atlas, kanonische HOME-Grafik, letzte funktionierende Deployment-Identität und externe Backups noch nicht vollständig verifiziert.

### Prüfprotokoll
Nur Dokumentation auf Governance-Branch. Keine Änderung an Supabase, Edge Functions, RLS, produktiven GitHub-Branches, Cloudflare/Vercel oder Secrets. Diese Inventur ist ein **fortschreibbarer Mehrquellenabgleich**, keine Aussage, dass sämtliche Chats und Speicherorte lückenlos exportiert oder geprüft wurden.


## Audit-Nachtrag A02 — ORIGINAL-Ideendatenbank und Formel-/Mechanikenregister (29.10.2026)
**Wiedergefundene Dateien:** `PHALANX_IDEEN_DATENBANK_ORIGINAL_20261021.md` ist eine Originalkopie des `NEXUS-IDEAS-TODO.md` (angelegt 28.09.2026). `PHALANX_MECHANIKEN_UND_IDEEN_AUDIT_20261029.md` dokumentiert eine historische lokale ZIP-Sicherung mit 645 Einträgen und mehrere Berechnungs-JSONs. Beide Quellen in der Projektumgebung gelesen; **die erwähnten ZIP-Originalbytes und alle JSON-Inhalte sind in diesem Arbeitsschritt nicht einzeln neu verifiziert**. Historische Berichte sind von aktuellen technischen Nachweisen zu trennen.

### Original-Ideenboard: einzeln erfasste Bestandspunkte
- PHX-IDEA-001 Android-PWA Fullscreen/Startziel Outpost Map, Statusleisten und Geräteverhalten — Test offen.
- PHX-IDEA-002 Vollständiger Rollen- und Navigations-E2E-Test (Kingdom, Member, Outpost Manager, R4/R5/Admin; Editor, Scouting Demo/Live, Save, Logout) — Test offen.
- PHX-IDEA-003 Scouting-Board mobil ohne horizontales Scrollen; versteckte Spalten im Profil zugänglich — Gerätetest offen.
- PHX-IDEA-004 Transfer-Einladung 170M **nur Planungsbeispiel**, offizielle Cap/Königreichsklasse/Special-Invite-Regeln abwarten; Admin-Override nur berechtigt — offen.
- PHX-IDEA-005 Geschütztes Scouting: Member lesen, R4/R5/Admin editieren laut historischem Codevermerk; Real-Account-Gerätetest offen.
- PHX-IDEA-006 Automatische GitHub-Backups: historische erfolgreiche Scheduled Runs am 29.09., 03.10. und 04.10. dokumentiert; aktuellen Zustand erneut prüfen.
- PHX-IDEA-007 Supabase-Rollback: historischer Snapshot für 14 Anwendungstabellen und dokumentierte Restore-Anleitung 04.10.; externe Disaster-Recovery/PITR weiterhin gesondert prüfen.
- PHX-IDEA-008 Spieler-Snapshot-Rhythmus ungefähr alle drei Tage; während KvK Prep gegebenenfalls dichter — Vorschlag, nicht implementierter Automatismus.
- PHX-IDEA-009 KvK-Matchmaking-Warnschwellen anhand historischer Snapshots/KvK-Zyklen kalibrieren; **keine offizielle Matchmaking-Formel behaupten**.
- PHX-IDEA-010 UI-Terminologie: **Opponent Intelligence** = Gegneranalyse; **Battle Readiness** = eigene Einsatzbereitschaft.
- PHX-IDEA-011 FaQuAI-Wappenvarianten mit Eddy/Robot optional, genehmigtes Original erhalten — Grafikidee.
- PHX-IDEA-012 Onboarding / Tester-Anleitung, Demo- vs. Echtdaten klar unterscheiden — offen.
- PHX-IDEA-013 Mobile Hide-Keyboard-Funktion über alle editierbaren Tabs prüfen — offen.
- PHX-IDEA-014 Allianzchat-Berichte: historische Implementierung mit 74er-Kartenbasis und Kingshot/Discord-Ausgabe; `docs/ALLIANCE_CHAT_REPORT_STANDARD.md` referenziert; aktueller Stand separat prüfen.
- PHX-IDEA-015 App-Shell mit Outpost Map/Editor, KvK Prep, Demo- und Live-Scouting, fünf KvK-KPI-Kacheln, PWA-Manifest: historische Code-Implementierungsvermerke, keine aktuelle Browserprüfung.
- PHX-IDEA-016 Historische Sicherungsbranches `stable-nexus-v13-2026-09-28` und `backup/nexus-initial-2026-09-28`: Existenz/Commits aktuell erneut prüfen.

### Berechnungs- und Simulationsbibliothek — historische Dateien
`data/phalanx-calculation-database-v1-2026-10-12.json`, `data/phalanx-combat-formulas-v1-2026-10-12.json`, `data/phalanx-rally-mechanics-source-audit-2026-10-12.json`, `data/phalanx-robust-optimizer-policy-v1-2026-10-12.json`, `data/phalanx-database-qualification-audit-v1-2026-10-12.json`. Historische Datenbank-Qualifikation: 15/15 Strukturchecks, aber `PARTIAL_PASS_RELEASE_BLOCKED`; 28 Hero-Roster-Matches, 0/28 vollständig im Spiel verifizierte Skillsätze; 4 von mindestens 11 Pets; 4 Master-Einträge ohne vollständige Level-Tabellen; Joiner-Skillzeilen nicht voll verifiziert. **Nicht als aktuell vollständige oder produktionsreife Wissensdatenbank ausgeben.**

### Mechaniken: nach Evidenzklasse
**Mathematisch exakt unter klaren Eingaben:**
- Inventar pro Truppenklasse/-tier: `assigned + reserve = available`; simultane Zuteilung ganzzahlig, `assigned <= available`, kein Double Booking.
- Truppenanteil `100 * class_count / total` für `total > 0`.
- Relative Änderung `100 * (new - old) / old` für `old != 0`; sonst undefiniert statt 0.

**Community-Modelle / Hypothesen, nicht offizielle Kingshot-Formeln:**
- `effective_attack = baseAttack*(1+attackPct/100)*baseLethality*(1+lethalityPct/100)/100`
- `effective_defense = baseDefense*(1+defensePct/100)*baseHealth*(1+healthPct/100)/100`
- `army_factor = sqrt(troopTypeCount*min(totalOwnTroops,totalEnemyTroops))`
- Gear-Interpolation `base+(enhancementLevel/100)*(max-base)`; Mastery `enhancedStat*(1+0.1*masteryLevel)`.
- Zeitproxy `baseTime/(1+speedPct/100)`; Formation-Proxy mit Typgewichten 1/3, 1, 1.47.
- Simulationsmodell laut A02: `damage = army_factor*(att_per_troop/def_per_troop)*type_bonus*SkillMod*fatigue_factor/100`, `losses=ceil(damage)`; aus Community-/State-of-Survival-Ansatz abgeleitet, **keine offizielle Kingshot-Schadensgleichung**.

**Quellenhinweise aus A02 (in diesem Nachtrag nicht live neu geprüft):**
- Kingshot offizielles Combat FAQ: https://centurygames.helpshift.com/hc/en/140-kingshot/faq/9125-combat-faq-1783436100/ — Formation Infanterie/Kavallerie/Bogenschützen, rundenbasierte Expedition, Rally-/Joiner-Skill-Kontext.
- KingshotSim Community: https://kingshotsim.com/damage-formula und https://kingshotsim.com/rally-and-troops — Modellannahmen, keine Spielserver-Formel.
- Unbestätigt: 10%-Typkonter, 20%-Kavallerie-Bypass, 10%-Bogenschützen-Doppelschuss, fatigue, Skill-Stacking/effect_op, allgemeingültige Bear-Quoten.
- Bekannte Konflikte: Yeonwoo vs. Chenko effect_op, Helga-Rolle, Joiner-Skill-Auswahl/Stacking. Primärbelege und reale anonymisierte Battle Reports vor jeder Empfehlung.

### Smart March Optimizer — verbindliche Idee, nicht implementiert
Referenz `PHALANX_IDEA_TROOP_RATIO_CALCULATOR_2026-10-13.md`: Bear 1 Lead **plus** 6 Joiner = 7 getrennte Planungen; feste Joiner-Helden und bester zulässiger Lead; Vikings zuerst Reinforcements, danach Rückzug für HQ-Welle 10/20; nur Bogenschützen als eigene verbleibende Burgtruppen; stärkste Defense-Helden in der Burg; exakte Inventarrechnung, Rollen-/Timing-Konflikte prüfen. Drei Strategien nach **belegter Eventzielgröße** vergleichen, niemals erfundene Schadens-/Punktzahlen optimieren.

### Weitere Recherche und Umsetzungsgates
1. Original-Ideenboard und alle Datenbank-JSONs bytegenau gegen Backup und Live-GitHub abgleichen; eindeutige IDs, Herkunft, Historie und Status vergeben, Originale nicht überschreiben.
2. Offizielle Kingshot-Patchnotes und FAQ je Mechanik/Version, danach Communityquellen und anonymisierte Kampfberichte; jede Formel mit Quelle, Datum, Annahmen, Test und Konfidenz.
3. Helden/Skills, Pets, Masters, Forschung, Charms, Gear, Eventpunkte und Rally-Skill-Stacking gezielt nachqualifizieren.
4. PYLON/True Power dürfen nur geprüfte Regeln als Fakten ausgeben; ungeprüfte Modelle ausdrücklich als Hypothese kennzeichnen.
5. Keine Implementierung allein aufgrund eines Ideen-Eintrags; geschützte Daten/Rollen und bestehende FREEZEs bleiben verbindlich.


## Audit-Nachtrag A03 — Berechnungen, Simulationen, Annahmen und Ergebnisse (29.10.2026)
**Originalquelle bytegenau geöffnet:** lokales Archiv `PHALANX_BACKUP_2026-10-29/kingdom-1885-work-phx-version-hygiene-20261021 (2).zip`, historischer Stand 21.10.2026. Die unten genannten Dateien sind daraus direkt gelesen, nicht nur aus Chat-Zusammenfassungen erschlossen. **Nicht behaupten, dass damit sämtliche jemals ausgeführten Simulationsläufe oder Ergebnisse rekonstruiert sind.**

### A03-01 Monte Carlo V2 — reproduzierbare Laufzeitprüfung
Quellen: `src/phalanx-monte-carlo-v2.js`, `tests/phalanx-monte-carlo-v2.test.js`, `.github/workflows/phalanx-monte-carlo-v2.yml`; in isoliertem lokalen Verzeichnis aus dem ZIP extrahiert. Node v22.16.0: Testdatei erfolgreich, Ausgabe `11 Monte Carlo assertions passed` (zusätzlich nach dieser Ausgabe weitere Assertions ohne Fehler). Kein Produktivcode verändert.

**Modell:** seeded linear congruential RNG (Default Seed 1885); pro Trial 1–1000 Runden, 1–1.000.000 Trials, 1–20 Skills, individuelle Wahrscheinlichkeit, abstrakter Bonus, Cooldown. Abhängigkeit `independent` (separate Zufallsziehungen) oder `shared` (gemeinsame Zufallsziehung pro Runde). Ergebnisse mean, SD, SE, p05, Median, p95, meanTriggers. Score = Summe ausgelöster abstrakter Skill-Boni; **keine Kingshot-Schadens- oder Siegformel**.

**Neu reproduziert am 29.10.2026:** je 100.000 Trials, 1 Runde, 4 Skills mit `chance=0.4, bonus=1, cooldown=0`, Seed 1885:
| Modus | Mittel | SD | SE | p05 | Median | p95 | mittlere Trigger |
|---|---:|---:|---:|---:|---:|---:|---:|
| independent | 1.59841 | 0.9836948063 | 0.0031107161 | 0 | 2 | 3 | 1.59841 |
| shared | 1.60108 | 1.9598119383 | 0.0061974695 | 0 | 0 | 4 | 1.60108 |
Interpretation: bei gleichem Erwartungswert erhöht gemeinsame Auslösung die Streuung; dies belegt **nur die Modellarithmetik**.

**Analytische Kontrollwerte bei 4 unabhängigen Bernoulli-Skills p=0.4:** `E[X]=4*0.4=1.6`; `Var[X]=4*0.4*0.6=0.96`, SD=sqrt(0.96)≈0.9798; `P(any)=1-0.6^4=0.8704`; `P(all)=0.4^4=0.0256`. Bei vollständig gemeinsamer Auslösung `E[X]=1.6`, `Var[X]=16*0.4*0.6=3.84`, SD≈1.9596; `P(any)=P(all)=0.4`. Die Annahme der Unabhängigkeit ist für Kingshot nicht belegt.

### A03-02 Sensitivitätsmodell V3 — archivierte Testergebnisse
Quelle `data/phalanx-combat-sensitivity-v3-2026-10-12.json`: `MATHEMATICALLY_TESTED_NOT_GAME_CALIBRATED`; historisch 12 vorherige + 6 neue = 18 bestandene, 0 fehlgeschlagene Tests laut JSON (nicht alle 18 erneut unabhängig ausgeführt).
- Vier hypothetische Joiner-Boni zu je +25 %: alle in einer additiven Gruppe Faktor **2.0**; zwei Gruppen zu je zwei Faktor **2.25**; vier unabhängige multiplikative Gruppen Faktor **2.44140625**. Die unterschiedliche Gruppierung ändert das theoretische Optimum; reale `effect_op`-IDs ungeprüft.
- Unabhängige Proc-Skills p=0.4, n=4: mindestens einer **87.04 %**, alle vier **2.56 %**, erwartete Auslösungen **1.6** je Runde; kein Ingame-Beleg.
- Hypothetischer Pet-Proxy bei +10 Prozentpunkten Angriff und Lethality: Ausgang ATK/LET 50/50 → **13.7778 %**; 200/150 → **7.4667 %**; 500/400 → **3.7 %**; 1000/1000 → **1.8264 %**. Nur bei der Modellannahme, dass die beiden Boni in den angezeigten Prozentpunkten additiv eingehen und nicht bereits im Snapshot stecken.
- Historischer Freigabestatus `BLOCKED`.

### A03-03 Combat Qualification V2 — archivierte Szenariorechnung
Quelle `data/phalanx-combat-qualification-v2-2026-10-12.json`, Urteil `qualified_relative_comparison_only`. Bei vier Joiner-Boni à 25 % und genau zwei angenommene Gruppen:
- Gruppe A/B = 0/4 → Faktor 2.0000, Referenz 0 %
- 1/3 → Faktor 2.1875, gegenüber Referenz +9.38 % (gerundet)
- 2/2 → Faktor 2.2500, +12.5 %
- 3/1 → Faktor 2.1875, +9.38 %
- 4/0 → Faktor 2.0000, Referenz 0 %
Hypothetische Pet-Fälle laut Datei: ATK/LET 200/150 → Grundfaktor 7.5, Aktivfaktor 8.06, +7.4667 %; 50/50 → 2.25/2.56, +13.7778 %; 500/400 → 30/31.11, +3.7 %. **Kein nachgewiesener Kampfschaden**.

### A03-04 Versionierte Formelsammlung — Original-Definitionen
Quellen `data/phalanx-calculation-database-v1-2026-10-12.json`, `data/phalanx-combat-formulas-v1-2026-10-12.json`, `data/phalanx-combat-modifier-engine-v1-2026-10-12.json`.
- `attack_lethality = (1+ATK_pct/100)*(1+LET_pct/100)`.
- `formation_damage_proxy = leaderFactor*SUM((1+ATK_i/100)*(1+LET_i/100)*sqrt(fraction_i*rallyCapacity)*troopWeight_i)`; Gewichte Infanterie 1/3, Kavallerie 1, Bogenschützen 1.47. Nur relative Community-Näherung.
- `effectiveAttack = baseAttack*(1+attackPct/100)*baseLethality*(1+lethalityPct/100)/100`.
- `effectiveDefense = baseDefense*(1+defensePct/100)*baseHealth*(1+healthPct/100)/100`.
- `armyFactor = sqrt(troopTypeCount*min(totalOwnTroops,totalEnemyTroops))`.
- `skillMultiplier = product(1+sum(same_effect_op_bonus_pct)/100)` über hypothetisch unabhängige Gruppen.
- Gear `enhanced = base+(level/100)*(max-base)`; `final=enhanced*(1+0.1*masteryLevel)`; `weightedGearScore=finalStat*strategicWeight` (Spielerpriorität, kein Spielbonus).
- `xp_upgrade_roi=statGain*strategicWeight*masteryMultiplier/xpCost`; `normalized_resource_roi=valueGain/(resourcesUsed/resourcesAvailable*100)` (je Ressource getrennt).
- `speedSeconds=baseSeconds/(1+speedPct/100)`; `rss_cost=baseCost*(1-min(90,costDownPct)/100)`, Truegold ausgenommen. Grenzen und Mechanik vor Anwendung verifizieren.
- Gear-Referenzwerte im JSON: epic base .09, +.0021/Level bis 80; mythic .15, +.0035/Level bis 100; red ab Level 100 base .5, +.005/Level bis 200; Mastery +.1/Level bis 20, Schmiedehammer-Kosten pro Zielstufe `10*level`, Summe 0→10 550, 0→20 2100, Mythic Gear 10→20 55. **Historische Community-Parameter, keine aktuelle Kingshot-Bestätigung.**
- Combat modifier engine unterscheidet `snapshot` (nur noch nicht enthaltene Modifikatoren ergänzen) von `reconstruct` (Basis plus jeden Effekt genau einmal). Doppelzählung vermeiden; pro Effekt Quelle, Modus, Akteur, Timing, Dauer, Stacking-Gruppe, Confidence dokumentieren.

### A03-05 Nicht nachgewiesene Ergebnisse und vollständige Historie
- Die Datei `phalanx-monte-carlo-lab-alpha31-2026-10-12.html` und die Team-/Battle-/Joiner-Optimizer-Previews liegen im historischen ZIP. Existenz ist nachgewiesen, **deren sämtliche gespeicherten Szenarien und Testläufe wurden nicht einzeln rekonstruiert**.
- Weitere historische JSONs: `phalanx-combat-verification-audit-v1`, `phalanx-mechanics-audit`, `phalanx-rally-mechanics-source-audit`, `phalanx-robust-optimizer-policy-v1`, `phalanx-sensitivity-2026-10-12`; ihre Namen und Inhalte teilweise gelesen. Originale nicht überschreiben.
- Keine belastbare Gesamtzahl aller früheren Simulationsläufe oder deren Ingame-Treffergenauigkeit; insbesondere keine Tausenderzahl als historische Tatsache behaupten. Die **jetzt ausgeführten 200.000 Trials** sind reproduzierbare neue Modellläufe, nicht historische Spielkämpfe.
- Fachliche Freigabe: **BLOCKED** bis Ingame-Quellen, Hero-/Skill-Level, Timing/Stacking, Battle Reports und Sensitivität gegen reale Ergebnisse validiert sind. PYLON darf diese Daten nur als Annahmen/relative Modelle verwenden.

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


## Audit-Nachtrag A04 — Original-Verification-Audit und Robust Optimizer Policy (29.10.2026)
**Direkt im historischen Original-ZIP geprüft:** `data/phalanx-combat-verification-audit-v1-2026-10-12.json` und `data/phalanx-robust-optimizer-policy-v1-2026-10-12.json`. Der Quellenstatus aus 12.10. ist historisch, **nicht als heute live neu verifizierte Kingshot-Mechanik missverstehen**.

### Historisch dokumentierte Community-Regeln (noch keine neue offizielle Verifikation)
- Rally Leader stellt Combat Stats; Joiner-Stats/Gear ersetzen nicht die Leader-Stats.
- Vier Joiner-Skill-Slots; erster Expedition-Skill des ersten Helden; Priorität laut historischer Communityquelle Skill-Level, dann Beitrittsreihenfolge.
- Gleiche `effect_op` additiv, verschiedene `effect_op` multiplikativ in bestimmten dokumentierten Buff-Familien. **Nicht global für sämtliche Skill-Familien verallgemeinern**.
- Historisch als offiziell geprüft notiert: Cassia Mastery in allen Expedition-Kämpfen; Quelle https://centurygames.helpshift.com/hc/en/140-kingshot/faq/8865-battle-master-in-which-scenarios-does-cassia-s-mastery-skill-take-effect/ — Originalquelle vor Verwendung neu prüfen.

### Pet-Buff-Maxima laut historischem Community-Audit, nicht aktuell verifiziert
- Giant Rhino: Squad Attack +10 %, Dauer 2 h.
- Alpha Black Panther: Troop Lethality +10 %, Dauer 2 h.
- Mighty Bison: Squad Capacity +15.000, Dauer 2 h.
- Great Moose: Rally Capacity +150.000, Dauer 2 h.
Die tatsächliche Aktivierung, Berechtigung, Dauer und Snapshot-Einrechnung sind vor Anwendung zu validieren.

### Explizite offene Konflikte und Regressionen
1. **Valora Expertise:** Zwei Communityquellen widersprechen sich bei Level 4–10, obwohl Maximalwert 30 % Bear Hunt Damage Points übereinstimmend genannt wird; keine ungeprüften Zwischenwerte interpolieren. Bear-Punkte ≠ automatisch Raw Damage.
2. **Alpha25 Snapshot-Schalter:** Unterdrückt alle aktiven Boni pauschal, obwohl manche nicht im Snapshot enthalten sein können; pro Effekt `includedInSnapshot` erforderlich.
3. **Alpha25 Pet/Master Stacking:** Angriffswerte werden in einem Pool summiert und mit Lethality multipliziert — nur provisorischer Offensivindex, nicht validierter Schaden.
4. **Pet-Aktivierung:** Die Preview bietet Prozentfelder ohne belegte Aktivierungs-, Zeit- und Eligibility-Prüfung.
5. **Alpha25 Scope:** Relative Offensive, kein defensiver Simulator oder bestätigte absolute Schadensformel.
**Historisches Release Gate:** Alpha25 nicht produktiv freigeben, bis die fünf Punkte geklärt sind.

### Robust Optimizer Policy — ausdrücklich konservativ
- Szenarien getrennt rechnen: gleiche Effect-Gruppen additiv; unabhängige Gruppen multiplikativ; unabhängige Chance-Procs; eingeschränktes Stacking; Buff im Snapshot enthalten vs. nicht enthalten.
- Für jede Aufstellung relativen Modell-Score, Worst Case, Sensitivität und mögliche Rangumkehr bei Annahmewechseln dokumentieren.
- `robustness = fraction of explicitly enumerated scenarios in which candidate beats baseline` ist **keine empirische Siegwahrscheinlichkeit**.
- Erwartungswert nur dann mit Wahrscheinlichkeitsgewichten, wenn diese empirisch begründet sind; keine erfundenen Szenariogewichte.
- Kosten-/ROI-Ziele für F2P/Low/Mid getrennt von Whale-Maximum bewerten; marginale Unterschiede unter Unsicherheit markieren.
- **Produktivstatus BLOCKED**, bis ausführbare Regressionstests und repräsentative Ingame-Beobachtungen vorliegen.
- Historische Folgeaufgabe: deterministische Szenarioenumeration und robuste Rangfolge mit Gegenprüfungen implementieren.
- Quellen im Original-Audit: kingshotwin.com/guides/gameplay/rallies/, kingshothandbook.com/guides/joiner-rules-guide, kingshot.wiki/guides/lethality-attack-defense-health-what-they-actually-do, kingshotguide.org/data-center/kingshot-pets-database, kingshotmastery.com/masters/valora, kingshotdata.com/masters/valora. **Hier nur Originalreferenzen konserviert, nicht live erneut bestätigt.**


## Audit-Nachtrag A05 — Vier visuell belegte Frakinator-/Optimizer-Ausgaben (29.10.2026)
**Quelle:** vier vom Projektverantwortlichen im Chat bereitgestellte Screenshots am 29.10.2026. Sichtbar sind ternäre Heatmaps mit Beschriftung `Average damage over 50 sims`, Marker `Best` und Lead-/Joiner-Konfiguration. **Werkzeugname nicht aus den Bildern beweisbar** (Frakinator oder anderer Formation Optimizer); Zuordnung vorerst `unverified_tool_origin`. Die Heatmap-Achsen zeigen Infanterie, Kavallerie und Bogenschützen. Verhältnis-Reihenfolge hier **Infanterie/Kavallerie/Bogenschützen**. Bilder selbst sind Chat-Originalbelege, nicht durch dieses Markdown als Binärdateien ins Repository übertragen.

| Fall | Sichtbare Quelle | Lead-Helden | Attack factors | Truppensplit (I/K/B) | Joiner | Squad | Valora | Best I/K/B | Farbskala mittlerer Schaden / 50 Sims |
|---|---|---|---|---|---|---:|---:|---|---|
| A | nykro, 17.10.2026 21:07 | Amadeus/Petra/Saul | 29.66/37.26/35.86 | 1,800/27,000/61,200 | Chenko/Amane/Yeonwoo/None | 90,000 | 27% | **2/30/68** | ca. 2.8M–27.6M |
| B | An Mórrígan, 17.10.2026 14:53 | Zoe/Petra/Marlin | 43.28/45.53/44.29 | 3,000/29,000/68,000 | Chenko/Chenko/Amane/Amane | 100,000 | 18% | **3/29/68** | ca. 3.2M–31.5M |
| C | Screenshot ohne erkennbare Autor-/Zeitzeile | Zoe/Petra/Marlin | 77.85/91.71/93.90 | 3,192/44,687/111,719 | Chenko/Yeonwoo/Amane/Hilde | 159,598 | 30% | **2/28/70** | ca. 6.9M–69.1M |
| D | Screenshot ohne erkennbare Autor-/Zeitzeile | Zoe/Petra/Marlin | 77.85/91.71/93.90 | 3,100/41,850/110,050 | Chenko/Chenko/Amane/Amane | 155,000 | 24% | **2/27/71** | ca. 9.7M–96.9M |

**Wichtige Präzisierung:** Die Legende `Average damage over 50 sims` belegt **50 Simulationen je visualisiertem Modellpunkt laut Bildbeschriftung**, nicht die Anzahl aller Rasterpunkte, die Gesamtzahl aller Läufe oder die reale Trefferquote. Die Legenden-Minima/-Maxima sind abgelesene Skalenwerte, **nicht** die separat ausgewiesenen exakten Best-Point-Damage-Werte. Die `Troop split`-Zahlen sind die vom Tool ausgegebenen Einheiten, die `Best`-Werte ihre gerundeten Prozentanteile.

**Befund:** Die vier sichtbaren Modell-Optima liegen eng beieinander (I 2–3 %, K 27–30 %, B 68–71 %). Das ist eine **interessante modellinterne Konsistenz**, aber kein Beleg für eine allgemeingültige Kingshot-Formation: Helden, Skill-Stacking, Valora-Punktebuff, Event, Gegner, Truppentiers, Modellformel, Rasterauflösung und reale Kampfberichte sind nicht vollständig offengelegt. Die höheren Schadensskalen in C/D sind wegen anderer Stats, Kapazitäten, Joiner und Boni **nicht kausal miteinander vergleichbar**.

**Nächster Prüfschritt:** tatsächlichen Tool-/Quellcode und Eingabedatensatz identifizieren, Seed/Simulationsumfang/Parameter nachstellen, Best-Point-Damage numerisch reproduzieren und mit realen Bear-Reports gegenprüfen. **Keine globale 2/28/70-Empfehlung** ohne diesen Nachweis. Quelle weiterhin als vom Nutzer gelieferter externer Ergebnisbeleg klassifizieren.


## Ideen-Nachtrag A06 — True-Gold-Rechner und Frakinator-Referenz (29.10.2026)
**PHX-IDEA-017 — True-Gold-Rechner** (neu vom Projektverantwortlichen vorgeschlagen, `IDEA / RESEARCH`, **nicht implementiert**): Rechner für True-Gold-Bedarf bei geplanten Kingshot-Ausbaustufen; aktuelle Stufe, Zielstufe, Gebäude-/Forschungsabhängigkeiten, vorhandenes True Gold, fehlende Mengen, Upgrade-Reihenfolge und optionale Szenarien. Kosten-/Stufentabellen und Server-/Versionsabhängigkeiten zuerst aus aktuellen verifizierten Spielquellen ermitteln; niemals generische Ressourcen-Rabattformeln ungeprüft auf True Gold anwenden. Ausbaureihenfolge als Empfehlung nur mit transparenten Kriterien (Kosten, Voraussetzungen, Nutzen, Zeit) und belastbaren Werten. **Abgrenzung:** True Gold ist eine Ressource; `True Power` ist ein separates Stärkebewertungsmodell.

**PHX-EXT-001 — Frakinator**: Externer Kingshot-Rechner `https://frakinator.streamlit.app/` als Referenz für Formation-/Bear-Hunt-Optimierung und die vier bildbelegten A05-Ergebnisse vorgemerkt. Externe Modellformeln, Eingabefelder, Version, Simulationsumfang und Genauigkeit noch nicht vollständig technisch verifiziert; nicht als offizielle Kingshot-Formel ausgeben. Vergleich nur nach Prüfung der tatsächlich verwendeten Parameter, Quellen und realen Battle Reports.

**Governance:** Ideenregister und Audit ergänzen; keine App-Änderung, kein produktiver Merge, kein Deployment und keine Kosten.


## Audit-Nachtrag A07 — Historisches Feature-Baseline-Register und vollständige Formelquellen-Inventur (29.10.2026)
**Quellen:** historisches Original-ZIP `PHALANX_BACKUP_2026-10-29/kingdom-1885-work-phx-version-hygiene-20261021 (2).zip` (645 Einträge), insbesondere `data/phalanx-feature-register-baseline-audit-20261018.json`, `data/phalanx-verified-math-audit-2026-10-12.json`, `data/phalanx-exhaustive-math-audit-2026-10-12.json`, `data/phalanx-double-audit-math-v1.json`, `data/phalanx-release-quality-gate-v1-2026-10-12.json`, `data/phalanx-source-registry-v13-2026-10-12.json`. Originaldaten gelesen, **historische Testprotokolle nicht als frisch wiederholte Tests ausgeben**.

### Feature-Baseline vom 18.10.2026
- **74 Features**, über historische Module Command Center (5), Outpost Intelligence (10), Outpost Operations (5), KvK Intelligence (5), Players to Watch (4), Battle Readiness (3), True Power (4), Alliance Comparison (5), Transfer Scouting (4), Hero Intelligence (4), Rally Optimizer (4), WarSim (4), Reports & History (4) und weitere im Original-JSON dokumentierte Module.
- Historische Statuszählung: Teilweise integriert 5; Android-getestet 15; Konzipiert/separat 13; separat entwickelt 16; konzipiert 4; Integration offen 9; teilweise separat 4; geplant 3; teilweise/geplant 5. Summe 74. **Dies sind Statusangaben aus dem Baseline-Snapshot, keine heute neu bestätigten App-Funktionen.**
- Keine doppelten Feature-IDs, keine fehlenden Pflichtfelder laut historischer Baseline. **Live-Code-Parität und Android-End-to-End-Test beide `NOT_TESTED`**.
- Diese 74 **Feature-Einträge** dürfen nicht mit den 74 **Außenposten** verwechselt werden; zufällig gleiche Anzahl, verschiedene Datensätze.

### Vollständigeres mathematisches Prüfprotokoll (historische Angaben)
- `phalanx-exhaustive-math-audit`: 625 Skill-Level-Tupel × 16 Attack/Lethality-Zuweisungen = **10.000 enumerierte Szenarien**; fünf Level 5/10/15/20/25; gruppierter Faktor `(1+sumAttackPct/100)*(1+sumLethalityPct/100)`. Vier hypothetische Boni 25/25/25/25 → optimaler Proxy 2.25 vs. 2.0 alle gleich gruppiert; 25/25/25/5 → 1.95 vs. 1.8375; 25/25/10/5 → 1.755. Das sind **Modell-Optima**, keine verifizierten Ingame-Optima.
- Historischer stochastischer Audit: **200.000 Trials**, Seed 1885, vier unabhängige 40%-Procs, mindestens einer empirisch 0.870645 (exakt 0.8704), alle vier empirisch 0.02536 (exakt 0.0256), mittlere Procs empirisch 1.59971 (exakt 1.6). Nicht mit den **neu ausgeführten** A03-200.000 Trials verwechseln.
- `phalanx-double-audit-math-v1`: 10.000 Fälle; exakt `P(any)=0.8704`, `P(all)=0.0256`, Mittel 1.6, Varianz 0.96; 100.000 seeded Trials mit Histogramm `[13175,34416,34387,15437,2585]`, Mittel 1.59841, Varianz 0.9676554719. **Auffälligkeit:** Histogramm-Summe = 100.000, aber der angegebene Mittelwert 1.59841 sollte unabhängig gegen das Histogramm geprüft werden, bevor alle Felder als konsistent gelten.
- `phalanx-verified-math-audit`: historisch 64/64 Assertions in fünf Kernsuiten, 1.000/1.000 randomisierte Crosschecks, 3 weitere deterministische Checks, 10.000 unabhängige Python-Fälle und 35 Heldengruppen. Diese Zahlen stammen aus dem archivierten Audit, **nicht aus neuem CI-Nachweis**. Remote CI: `not inspected`.
- Mathematische unabhängige Binomialverteilung für vier p=.4 Procs: P(X=0..4) = `[.1296,.3456,.3456,.1536,.0256]`. Bei vollständig gemeinsamer Auslösung P(any)=P(all)=.4 und Varianz 3.84. Der Unterschied zeigt Unsicherheit durch Abhängigkeitsannahmen.
- `phalanx-source-registry-v13`: historisch 28 Helden, 68 dokumentierte Skills, 87 lokale Skill-Effekt-Zeilen, neun genannte Hero-Ingame-Quellen, 12 Hero-Roster-Quellverknüpfungen, 7 abgeglichene First-Expedition-Skills. Original-Screenshots/Skill-Level nicht pauschal als vollständig verifiziert ansehen.

### Register der im Original-ZIP vorhandenen Berechnungs-/Evidenzdateien
**Mathematik/Simulation:** `phalanx-double-audit-math-v1`, `phalanx-exhaustive-math-audit`, `phalanx-independent-math-validation`, `phalanx-independent-validation`, `phalanx-verified-math-audit`, `phalanx-combat-sensitivity-v3`, `phalanx-sensitivity`, `phalanx-combat-qualification-v2`, `phalanx-combat-formulas-v1`, `phalanx-calculation-database-v1`, `phalanx-combat-modifier-engine-v1`, `phalanx-robust-optimizer-policy-v1`.
**Mechaniken/Evidenz:** `phalanx-combat-verification-audit-v1`, `phalanx-mechanics-audit`, `phalanx-rally-mechanics-source-audit`, `phalanx-effect-model-bridge-v1`, `phalanx-evidence-reconciliation`, `phalanx-skill-effect-taxonomy-v1`, `phalanx-skill-name-crosswalk-v1`, `phalanx-skill-normalization-audit-v1`, `phalanx-secondary-skill-reconciliation-v1`, `phalanx-secondary-skill-source-links-v1`, `phalanx-hero-skill-source-index-v1`, `phalanx-hero-unified-evidence-index-v1/v2`, `phalanx-hero-comparison-coverage-v1`, `phalanx-hero-comparison-readiness-v1`, `phalanx-hero-comparison-display-gate-v1`, `phalanx-hero-comparison-trigger-safety-overlay-v1`.
**Helden/Pets/Masters:** `phalanx-amadeus-ingame-validation`, `phalanx-amadeus-onslaught-evidence-resolution-v1`, `phalanx-amane-ingame-validation`, `phalanx-chenko-ingame-validation`, `phalanx-gen3-ingame-skills`, `phalanx-gen4-alcar-margot-ingame`, `phalanx-helga-ingame-validation`, `phalanx-hilde-ingame-validation`, `phalanx-yeonwoo-ingame-validation`, `phalanx-saul-skill-evidence-v1`, `phalanx-seven-hero-first-expedition-skills`, `phalanx-joiner-heroes-researched-v1`, `phalanx-hero-roster-gen1-gen5-v1`, `phalanx-pets-masters-buffs-research-v1`, `phalanx-hero-generation-policy`.
**Qualität/Bestand:** `phalanx-database-qualification-audit-v1`, `phalanx-release-quality-gate-v1`, `phalanx-source-registry-v13`, `phalanx-feature-register-baseline-audit`, `phalanx-feature-id-baseline`, `phalanx-repository-inventory`, `phalanx-full-repository-inventory`, `phalanx-library-discovery`, `phalanx-phase1-ingame-evidence-index`, `phalanx-cycle-advantage-research-v1`, `phalanx-command-center-integration-audit`, `phalanx-display-gate-check-v1`, `phalanx-alpha29-status`, `phalanx-alpha-version-baseline`, `phalanx-alpha-version-lock`, `phalanx-edge-functions-live`, `phalanx-sandbox-access-audit`.
Die Dateinamen beziehen sich auf `data/*.json` im genannten ZIP; ein Eintrag im Inventar **bescheinigt weder aktuelle Gültigkeit noch vollständige externe Quellenprüfung**.

### Abschließende Governance-Klassifizierung
- **Dokumentationsinventur:** A01–A07 und originale Ideen-/Formelquellen sind registriert und auf einem isolierten Governance-Branch gesichert.
- **Fachliche Freigabe:** `RESEARCH_ONLY / BLOCKED` gemäß `phalanx-release-quality-gate-v1`, bis Ingame-Kalibrierung und Mechaniknachweise vorliegen.
- **Technische Freigabe:** aktuelle Source-to-Live-Code-Parität, R11-Atlas-E2E, produktionsnahe Restore-Nachweise und aktuelles Deployment bleiben offen.
- **Nicht behaupten:** alle historischen Chats, sämtliche Backups, alle externen Webseiten oder alle jemals berechneten Simulationsergebnisse seien lückenlos abgeglichen.
- **Nächster Gate:** deduplizierter, versionierter Einzeldatei-/Ergebnisindex mit SHA256 und Nachweisstatus; danach zielgerichtete Validierung und gesonderte Integrationsfreigabe.


## Audit-Nachtrag A08 — SHA-256-Datei- und Archivindex (29.10.2026)
**Neu tatsächlich berechnet:** neun lokal gemountete ZIP-Archive aus `/mnt/data`; alle ZIPs vollständig geöffnet, pro Archiv SHA-256 über die ZIP-Bytes und pro enthaltenem regulären Dateieintrag SHA-256 über die dekomprimierten Bytes berechnet. Vollständiger maschinenlesbarer Index: `PHX_A08_SHA256_FILE_INDEX_20261029.json` als lokales Gesprächsartefakt (263.287 Bytes; **noch nicht als Datei ins GitHub-Repo übertragen**). Umfang: **1.110 Dateivorkommen, 632 unterschiedliche Inhalts-SHA-256, 464 Hash-Gruppen mit mindestens zwei Vorkommen**. Verzeichniseinträge sind aus der Dateizählung ausgeschlossen. Diese Zahlen sind **keine Aussage über 632 Features**.

| Archiv | reguläre Dateien | Archiv-SHA-256 (Präfix) |
|---|---:|---|
| `PHALANX_M00_BACKUP_MIT_GATE_REGEL_20261029.zip` | 3 | `0598d0bd5e71` |
| `PHALANX_M00_MIT_M01_PYLON_FOUNDATION_20261029.zip` | 4 | `9beddc5fd26f` |
| `PHALANX_M00_MIT_PYLON_CONNECTOR_REGEL_20261029.zip` | 2 | `05d8a3448637` |
| `PHALANX_M00_PYLON_V2_ERGAENZUNG_20261029.zip` | 3 | `639b02087980` |
| `PHALANX_WIEDERHERSTELLUNGSPAKET_2026-10-29.zip` | 5 | `7559384c07c4` |
| `PHALANX_WIEDERHERSTELLUNGSPAKET_MIT_PRUEFREGISTER_2026-10-29.zip` | 6 | `5c99402a3f55` |
| `PHX_R11_ATLAS_CORE_V2_LOCAL_BUILD_20261029.zip` | 24 | `6b881b9730e5` |
| `kingdom-1885-main (1).zip` | 461 | `0c0e20b916f9` |
| `kingdom-1885-work-phx-version-hygiene-20261021 (2).zip` | 602 | `bd8b7ac4073e` |

**Quellen-Differenz zwischen den zwei historischen Repository-ZIPs (vergleichbare relative Dateipfade):** 15 nur im Main-Archiv, 156 nur im Hygiene-Archiv, drei gleiche relative Pfade mit unterschiedlichem Inhalt. Die beiden ZIPs sind **nicht austauschbar**; kein Restore darf eines ungeprüft durch das andere ersetzen.

**Abgrenzung:** Dieser Audit bestätigt lokale Dateiintegrität und Duplikate. Er beweist **nicht**, dass Remote-GitHub, Google-Drive-Backups, Supabase-Daten, Vercel/Cloudflare-Deployments oder alle älteren Chats denselben Stand haben. Kein Merge/Deploy/Produktivzugriff. Nächster Gate: kanonische Zuordnung je Datei/Version, aktuelle Remote-Parität und Ergebnis-/Formelvalidierung.


## Audit-Nachtrag A09 — aktueller GitHub-Remote-Gate (29.10.2026)
**Jetzt live über GitHub-Connector gelesen:** Master Register auf `governance/phalanx-project-control-20261021` (Blob `854e7c9b8c209323287922659b03bcbd97508e26` vor diesem Nachtrag); START-HERE auf demselben Branch (Blob `d04f6e65abc076086cd1b1bc4a5953dad9d3f798`). Formeldatei `data/phalanx-combat-formulas-v1-2026-10-12.json` auf `main` **und** `work/phx-version-hygiene-20261021` mit **identischer Git-Blob-SHA `f7194adebef467ea2a7f311bde13e37d11e7d884`** bestätigt. Die lokale A08-Datei listet diese Formeldatei ebenfalls in beiden historischen Repository-ZIPs mit identischer SHA-256 `d39d5905c3713ccb77455a55704aefeb744ec74030cebe1fca918c927d13e6cf`. **Identität lokal↔remote nicht bytegenau bewiesen**, solange kein direkter Remote-SHA256-Vergleich erfolgt.

**Live-Branch-Vergleich `main...governance/phalanx-project-control-20261021`:** Status `diverged`; Governance **297 Commits voraus**, **30 Commits hinter main**; Vergleich nennt **117 geänderte Dateien**. Diese Zahlen beschreiben Git-Historie, nicht 117 produktive Feature-Änderungen. **Folge:** Governance-Branch nicht als Ersatz für aktuelles `main` deployen oder mergen; vor jedem Integrationspaket die 30 Main-Commits und betroffenen Dateien prüfen. Weder letzter funktionierender Deploy noch Vercel/Cloudflare-Laufzeitstand sind hiermit verifiziert.

**Gates:** (1) Main-vs-Branch-Differenzen nach Risiko priorisieren, (2) SHA-256-Lokal-/Remote-Parität für kritische Assets/Code belegen, (3) aktuelles Deployment ermitteln, (4) getrennte Testvorschau ohne Kosten, (5) E2E mit 74 echten Outposts und Exporten. Bis dahin `DOCUMENTED_NOT_RELEASE_VERIFIED`. Keine produktive Änderung.


## Audit-Nachtrag A10 — Branch-Differenzrisiken und verbindliche True-Gold-Logik (29.10.2026)
**Live-GitHub-Vergleich aktualisiert:** `main...governance/phalanx-project-control-20261021` = `diverged`, 298 Commits ahead, 30 behind, 117 Dateidifferenzen (114 added, 3 modified). Die drei als modified ausgewiesenen Pfade sind `.github/workflows/phalanx-edge-functions-backup.yml`, `preview/outpost-report-v11.html` und `preview/phalanx-ranking-integration-rc-20261015.html`. 114 added sind **nicht** 114 neu produktiv geschaltete Funktionen. Governance und main nicht blind zusammenführen.

**Hochrisiko-Differenz Backup-Workflow:** Auf Governance ist `.github/workflows/phalanx-edge-functions-backup.yml` als `SECURITY HOLD` ausgestaltet; manuell ausführbarer Job verweigert explizit einen Export vertraulicher Edge-Function-Quellen in das öffentliche Repo, ohne Supabase-Zugriff oder Git-Push. Vor jeder Änderung am Workflow die Main-Fassung separat sicherheitsprüfen. Die Existenz dieser Governance-Sperre belegt **nicht**, dass sie bereits auf main oder produktiv wirksam ist. Nie versehentlich deaktivieren.

**Sicherheitsbefund Auth/RLS:** `docs/project-control/PHX-ACCESS-CONTROL-V1-IMPLEMENTATION-SECURITY-20261021.md` dokumentiert RLS-Policies, die historisch Antragsfreigaben an Rollen `r4,r5,admin` koppeln. Der Produkt-FREEZE verlangt dagegen separate explizite Berechtigung `access_requests.approve`; Ingame-Rang allein darf keine PHALANX-Genehmigung erteilen. Eine neue permissive RLS-Policy ohne Rückbau alter OR-verknüpfter Policies würde die Lücke nicht schließen. **Dokumentierter Migrationsblocker; keine DB-Änderung freigegeben.**

**True-Gold-Originalregel aus `docs/project-control/PHX-TC-TRUEGOLD-INTERPRETATION-20261021.md`:**
- `town_center_level` bezeichnet **nur** das Schloss/Town Center, nicht die Ausbaustufen aller Gebäude.
- TG1–TG5 mit je `0/5` bis `5/5`; für Kingdom #1885 keine Stufen über TG5 ohne aktuellen Beleg annehmen. Keine globale feste Obergrenze daraus ableiten.
- Vom Projektverantwortlichen korrigierte Abbildung: `TC 40 = TG3 0/5`, `TC 45 = TG4 0/5`, `TC 50 = TG5 0/5`, `TC 51 = TG5 1/5`, ... `TC 55 = TG5 5/5`. Unter TC40 und über TC55 nicht still extrapolieren.
- Numerischen Roh-TC, Anzeige und Capture-Zeitpunkt gemeinsam aufbewahren. Fremde Gebäudestufen nicht aus TC ableiten. Rankingdaten nur bei verifizierter UID, Kingdom und Erfassungszeit; `town_center`-Board nicht mit `personal_power`-Scores verwechseln.
- **PHX-IDEA-017 True-Gold-Rechner:** vorhandene TC/TG-Interpretation als feste Anzeige-/Inputregel nutzen, aber **nicht** mit echten Ressourcenkosten verwechseln; Kosten, Voraussetzungen, Mengen und Upgrade-Reihenfolge sind separat zu recherchieren und zu validieren.

**Release-/Quellenstatus:** `SOURCE_AUDITED / RUNTIME_UNVERIFIED`. Sicherheits- und Versionsabweichungen vor isolierter Integration prüfen. Keine produktiven Änderungen, kein Merge, keine Kosten.


## Audit-Nachtrag A11 — acht von acht Originaldateien bytegenau GitHub-Branch-paritätisch (29.10.2026)
**Prüfmethode:** Aus `kingdom-1885-main (1).zip` und `kingdom-1885-work-phx-version-hygiene-20261021 (2).zip` je vier Pfade entpackt; lokal Git-Blob-SHA-1 nach Git-Objektformat (`blob <Bytezahl>\\0<Originalbytes>`) berechnet und mit den **aktuell live** per GitHub-Connector abgefragten Blob-SHAs auf `main` beziehungsweise `governance/phalanx-project-control-20261021` verglichen. **8/8 exakt identisch.** Vollständiger Auditbericht als Gesprächsartefakt `PHX_A11_REMOTE_PARITY_20261029.md`.

| Pfad | main-Blob-SHA1 | Governance-Blob-SHA1 | Bewertung |
|---|---|---|---|
| `.github/workflows/phalanx-edge-functions-backup.yml` | `038b909a1048c94661f8b8f2806c48cac88e9c82` | `058bdc9f60b243840bbd527d00ee7435e35f8c70` | Jeweiliges Archiv passt exakt; **unterschiedliche Sicherheitslogik** |
| `preview/outpost-report-v11.html` | `d7d6b94e4df8fed4c4029cd6aa8ec3c4b22de584` | `0f6eb192adfab5ea07397c06af4ba531c789fa89` | Jeweiliges Archiv passt; unterschiedliche Fassungen |
| `preview/phalanx-ranking-integration-rc-20261015.html` | `f13f0737745c861bf728b63edb099582bf7470bc` | `76c0f457c212bbd7c86d23b0265228108cd2d932` | Jeweiliges Archiv passt; unterschiedliche Fassungen |
| `data/phalanx-combat-formulas-v1-2026-10-12.json` | `f7194adebef467ea2a7f311bde13e37d11e7d884` | `f7194adebef467ea2a7f311bde13e37d11e7d884` | **Gleicher Inhalt** auf beiden Branches und in beiden Archiven |

**Sicherheitsrisiko auf aktuellem `main` direkt bestätigt:** Workflow ist per `workflow_dispatch` startbar, besitzt `contents: write`, lädt mit Supabase-Token deployte Edge-Function-Quellen, prüft nur auf die Zeichenfolge `PRIVATE KEY-----` und pusht Quellen nach `recovery/supabase/functions` in das Repository. Ein solcher Einzelstring-Guard ist kein allgemeiner Geheimnisschutz. Die Governance-Fassung enthält dagegen einen blockierenden `SECURITY HOLD`; **die Sperre ist nicht auf `main` bestätigt**. Workflow **nicht ausgeführt**, keine Quellen heruntergeladen, keine Änderungen vorgenommen. Vor produktiver Nutzung ist eine gesondert autorisierte Sicherheitskorrektur notwendig.

**Prüfgrenzen:** 8 Dateipaarungen, nicht sämtliche Dateien; keine Prüfung letzter produktiver Deployments, laufender CI-Workflows, Datenbanken oder Remote-Backups. Ergebnisstatus `CRITICAL_FILES_PARITY_VERIFIED / MAIN_WORKFLOW_SECURITY_RISK / DEPLOY_UNVERIFIED`.


## Audit-Nachtrag A12 — Quellcode-Differenzen und Navigationsrisiko (29.10.2026)
**Live gelesene Dateien auf `main` und Governance, ohne Ausführung oder Deployment.**

1. `preview/outpost-report-v11.html`: `main` lädt das eingebettete Kingdom-iframe mit `../index.html?kingdom-preview=an-viewer-v1&single-header=3`; Governance nutzt `./index.html?kingdom-preview=an-viewer-v1&single-header=3`. **Pfadwechsel ist ein möglicher Regressionstreiber**, wenn das Preview-Verzeichnis kein eigenes `index.html` enthält. Governance ergänzt Diagnose-/Timeout-Logik (15 Sekunden), Map-Ready-/Script-Error-Anzeigen und Startup-Hooks. Diese Änderungen können die Fehlererkennung verbessern, **beweisen aber nicht**, dass die Map tatsächlich startet.
2. `preview/phalanx-ranking-integration-rc-20261015.html`: `main`-Rücknavigation verweist auf `./phalanx-home-auth-rc9-20261014.html`; Governance auf `./phalanx-alpha-android-integration-20261017.html#rc5` mit `target=_top`. **Navigationsziel und Frame-Verhalten sind bewusst verschieden** und müssen für HOME → Territory Control → Reports → Zurück separat im Browser geprüft werden. Der übrige beobachtete Code nutzt denselben Supabase-Projektendpunkt und Session-Abfrage; kein Beleg für gleiches Laufzeitverhalten.
3. `.github/workflows/phalanx-edge-functions-backup.yml`: auf `main` bestätigter schreibender Quellcode-Backup-Workflow vs. blockierende Governance-Sicherheitssperre (A11). **Sicherheitspriorität kritisch**; ohne Freigabe keine produktive Korrektur.

**Entscheidung:** `SOURCE_DIFF_REVIEWED / NAVIGATION_REGRESSION_POSSIBLE / RUNTIME_UNVERIFIED`. Kein automatisch angenommener „letzter funktionierender Stand“; keine Freigabe für Merge/Deploy. Nächster Beweisschritt: Existenz/Abhängigkeiten der beiden HTML-Ziele im Zielpaket und danach isolierter Browser-E2E-Test.


## Audit-Nachtrag A13 — R11/Atlas CORE V2 lokale Testausführung (29.10.2026)
**Tatsächlich lokal durchgeführt:** `PHX_R11_ATLAS_CORE_V2_LOCAL_BUILD_20261029.zip` entpackt, `node --test tests/*.test.mjs` im Unterverzeichnis `outpost-atlas` mit Node v22.16.0 ausgeführt. **2 PASS, 1 FAIL**. Datenvertrag und Modul-/DOM-Integration PASS; `source-integrity.test.mjs` FAIL wegen `outpost-atlas/index.html`. Erwartete SHA256 `113caa4e10ea8cb6ad5c89c57f94f26ef2405a1ba00e9a505c1bdf59169ccc0c`, tatsächliche SHA256 `2a8ebd0a1efa95ad01f68acd4f7cb2c26c96c76644cdc38a7419628ab51b2add`. **Sechs weitere der sieben Integritäts-Dateien stimmen exakt mit ihrer eingefrorenen SHA256 überein**: `map-core.js`, `map-layout.js`, `map.css`, drei originale JPEG-Assets. **Integritätstest nicht manipuliert, Manifest nicht umgeschrieben.**

**Paketabhängigkeiten:** 24 ZIP-Einträge, Root `index.html` (R11 Territory Control), `outpost-atlas/index.html`, `map-core.js`, `map-layout.js`, `map.css`, `core/provider.js`, `core/data-contract.js`, `atlas-export-isolated.js`, drei lokale JPEGs und Testdateien sind vorhanden. Root `index.html` enthält `./outpost-atlas/index.html` als iframe-Ziel; dieser Pfad ist im Paket vorhanden. Das ist **nicht** identisch mit dem älteren `preview/outpost-report-v11.html`-Pfadproblem aus A12; die Pakete nicht vermischen.

**Datenstand:** `outpost-atlas/outposts-verified-20261002.fixture.json` enthält **74 Zeilen**; `fixture-provider-isolated.js` lädt diese historische Fixture ausdrücklich über `fetch`. Keine Live-Kingshot-/Supabase-Quelle und keine produktive Berechtigungsprüfung dadurch nachgewiesen. `PREVIEW_NOTES.md` warnt ausdrücklich vor fehlendem Browser-Regressionstest und nicht aktiviertem PYLON-Backend.

**Freigabestatus:** `LOCAL_STATIC_TESTS_2_OF_3 / SOURCE_INTEGRITY_BLOCKED / BROWSER_E2E_NOT_RUN / LIVE_DATA_NOT_VERIFIED`. Vor isoliertem Deployment Ursache der abweichenden `index.html`-Prüfsumme gegen freigegebene Alpha24-Quelle aufklären; nicht blind Referenzhash überschreiben. Keine produktive Änderung.


## Audit-Nachtrag A14 — Ursache des Atlas-Integritätsfehlers eindeutig nachgewiesen (29.10.2026)
**Lokal direkt verglichen:** `/mnt/data/atlas_original_verified/index.html` (2516 Bytes; SHA256 `113caa4e10ea8cb6ad5c89c57f94f26ef2405a1ba00e9a505c1bdf59169ccc0c`) und `/mnt/data/phx_a13_work/outpost-atlas/index.html` (2630 Bytes; SHA256 `2a8ebd0a1efa95ad01f68acd4f7cb2c26c96c76644cdc38a7419628ab51b2add`). Unified Diff: **genau eine geänderte HTML-Zeile**. Alle ursprünglichen Elemente einschließlich `<script type="module" src="map-core.js"></script>` und `<script src="map-layout.js" defer></script>` erhalten; in der Paketfassung sind zusätzlich `<script src="fixture-provider-isolated.js"></script>` und `<script type="module" src="atlas-export-isolated.js"></script>` unmittelbar vor den bestehenden Skripten eingefügt. Die 114 Byte Größendifferenz stammen aus diesen beiden zusätzlichen Tags. **Kein sonstiger HTML-Inhaltsunterschied im Diff.**

**Ursachenbewertung:** `SOURCE_INTEGRITY_FAIL_EXPLAINED` – keine nachgewiesene Beschädigung des eingefrorenen Originals, sondern absichtliche Testintegration durch Bearbeitung einer geschützten Datei. Die Änderung bleibt nach bestehender Freeze-Regel **nicht freigegeben**, auch wenn funktional plausibel. Originalhash und Integritätstest nicht überschreiben. Isolierte Wrapper-/Loader-Integration entwickeln, bei der `outpost-atlas/index.html` bytegleich zur geprüften Originaldatei bleibt und Zusatzmodule separat eingebunden werden; anschließend statische Tests und Browser-E2E erneut ausführen.

**Nicht behaupten:** Dass die zwei ergänzten Skripte bereits fehlerfrei zusammenarbeiten, dass Export und 74 Outposts im Browser nachgewiesen sind oder dass das Paket deployfähig ist. **Kein produktiver Eingriff.**


## Stage milestone — Transfer Scouting 2026-10-31
PHX-TRANSFER-WORLD-EN: English runtime/recovery, Kingshot Player ID terminology, demo removal and structural V5 body integration on isolated `stage/transfer-id-lookup-20261030`. Header unchanged. 25 existing + 9 full-DOM test groups passed; not live RLS/Android evidence. Source bundle integrity and isolated source checkout restore verified; database restore and Vercel rollback not tested. See `docs/staging/transfer-work-verification-20261030.md` for exact source/deployment/limits. Authenticated mobile candidate save, comparison/CSV, live roles and design acceptance remain OPEN. Original local JSON backup/import convergence remains OPEN. No main/production PHALANX/backend/freeze changes.

Deployment evidence: source `ab0477914fdb55ce453719734bfb09aaf0f2374c`, isolated test deployment `dpl_56iHTaRH3AzX4trtxnFHDL1bBw7t` READY, 12-file inventory matches submitted source by content identifiers. English login/recovery visually confirmed. Secure app login returned Invalid login credentials; private browser/Android/RLS/save/comparison/CSV tests remain BLOCKED/OPEN. No final acceptance. Full evidence in stage log.

Transfer continuation 31.10: successful authenticated browser reads, all dossier tabs, CSV download/parse, real ID/arena/rank display. Internal comparison CORS failure traced to unchanged production V6 origin. Explicit user approval received for separate read-only JWT-protected Stage copy; source and five tests prepared, Stage frontend endpoint updated. Deployment results follow in the Transfer verification log. Live multi-role RLS, Android save/mobile and multi-candidate comparison remain open.

Transfer Stage comparison now LIVE VERIFIED: code `16663c123d6e267db67e2b0547997b774f3057f0`, Vercel `dpl_Ft6EpEZvecVTcYL3MFrs7j3wL7Gg` READY; approved separate intelligence function V1/JWT true, original V6 unchanged. 84 real internal players loaded, player switch and comparison rendered, return route passed. Data snapshot is historical 2026-09-29, not live current power. 39 local tests pass; source/content IDs verified. Actual Android/save/multi-role RLS/multi-candidate comparison/design acceptance remain OPEN. Full evidence and rollback references in Transfer verification log.

PHX-TRANSFER-REF-BODY 31.10: corrected rejected Body using exact original artwork/emblem viewports, navy/gold task views and grouped live review; header unchanged. Final code `0470ecd0fb358d8e85766c5ac4d0a240fa89b615`, isolated Vercel `dpl_BMATWaoLd2unaqBFqyAcZvpp7FX8` READY. 39 local groups pass; three private views, real grouped ID response, dossier/Back and file identifiers checked. Final source bundle integrity and separate checkout restore pass. Android new-design acceptance, save/RLS/multi-candidate gates remain OPEN. Details in Transfer verification log.

Transfer PHX-CLEAR-TASKS: user approved My Candidates (saved shortlist) / Find a Player (ID lookup) separation. Existing HTML/CSS only; nine DOM regressions and authenticated view/transition/help checks passed. Runtime d6544a4518d11f527b529075c1bf477360b79bcb, Vercel dpl_4hL5LJu6u6E91yHQ4TQrAWhJxncQ READY; 12 content IDs matched; source bundle restore verified. No new data/backend/role/freeze change. Existing open gates retained in stage verification log.

### PHX-TRANSFER-FULL-RANKINGS — 2026-10-31
User requested available Mighty Pulse rankings in dossiers and one-to-one comparison with #1885 using current provider data. Root cause and patch documented in docs/staging/transfer-work-verification-20261030.md. 41 local checks PASS. Stage-only bridges/UI, no migration/RLS/auth/freeze/main changes. Top-100 union covers 249 UIDs; data capture 2026-10-30 00:29 UTC, not a kingdom census or realtime claim. ID-based internal comparison added for unlisted players. New deployed/live proof must be recorded before acceptance; no full release claimed.

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

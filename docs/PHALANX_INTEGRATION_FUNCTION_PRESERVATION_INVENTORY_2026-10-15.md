# PHALANX Integration — Funktions-Erhaltungsinventur (15.10.2026)

## Scope und Evidenz
GitHub `main` rekursiv gelesen: 442 Blob-Dateien, nicht abgeschnitten; darunter 254 `preview/`, 9 `src/`, 15 `tests/`. Zusätzlich gelesen: `docs/PHALANX-PROJECT-MEMORY-2026-10-14.md`, `docs/PHALANX-STATUS-QUO-RELEASE-BASELINE-2026-10-14.md`, `docs/PHALANX-14-DIMENSION-PROFILES-2026-10-14.md`. Das ist ein **Datei-/Konzept-Inventar**, kein Nachweis funktionierender Navigation oder vollständiger Produktintegration. Audit-Branch enthält zusätzliche isolierte Testkandidaten, die nicht in den 442 main-Dateien enthalten sind.

## Erhaltungsgruppen für RC1
1. **Shell / Command Center / Design**: Frozen HOME, Alpha35, Branding, mobile Portraitansicht, Sprachwahl, Rollenanzeige, konfigurierte Kacheln, Head-to-Head, Whale Risk, Tactical Alerts. Referenzen: `backups/NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html`, `docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md`, `preview/nexus-phalanx-command-center-integration-test-2026-10-12.html`.
2. **Player Intelligence**: UID-basierte Profile, 14 getrennte Boards, Datenabdeckung, Power-Trends, True Power, Master Power, Mystic Trials, Research, Pets, Heroes, Activity; kein fiktiver Composite-Score. Referenzen: `preview/phalanx-player-intelligence-isolated-20261014.html`, `docs/PHALANX-14-DIMENSION-PROFILES-2026-10-14.md`.
3. **Kingdom / Opponent / Threat Intelligence**: Kingdom Scout, #1885/#1913, 7/16 Rankingboards, Players to Watch, KvK Prep-vs-Castle, Cycle Advantage als Hypothese, Threat Confidence und Datenlücken. Referenzen: `preview/phalanx-kingdom-scout-report-v1-20261014.html`, `data/kvk-opponent-intelligence-current.json`, `docs/phalanx-kingdom-scout-threat-intelligence-v0-20261014.md`.
4. **Alliance Intelligence**: NXS/FRA/OoO/MYM, Mitglieder, Gesamtpower, TG-Level, Ranglisten, Historie, Datenfrische. Referenzen: `preview/phalanx-alpha35-alliance-top40-stage-v3-20261013.html`, `integration/alliance-overview-reader-test.mjs`, `integration/alliance-top40-reader-test.mjs`. Top40 ist nur eine Ansicht, **nicht** Produktarchitektur.
5. **KvK Command / Battle Readiness**: Matchmaking-Risiko, Prep Dashboard, Warnlisten, Battle Readiness, Role Safety, History, Shared Status, taktische Planung. Referenzen: `preview/kvk-prep-five-contrast-v13.html`, `preview/nexus-phalanx-battle-readiness-unified-test-2026-10-12.html`.
6. **Hero Intelligence**: Helden Gen1–Gen5, Skill-/Sterne-/Ausrüstungs-Evidenz, Vergleich, Shard-Rechner, Investitionsprofile, Future Testing, F2P/Low/Mid/Whale, Ampel. Referenzen: `preview/hero-intelligence-evidence-advisor-v15-2026-10-12.html`, `data/phalanx-hero-unified-evidence-index-v2-2026-10-13.json`.
7. **Team / Joiner / Smart March Optimizer**: Rollen Lead/Joiner, Formation/Position, eigene Heldenbestände, Zielkontext, Rally-Synergie, robuste Optimierung, Screenshot-Joiner. Referenzen: `preview/phalanx-team-optimizer-position-aware-alpha11-2026-10-12.html`, `preview/phalanx-joiner-optimizer-alpha29-2026-10-12.html`, `src/phalanx-joiner-search-v1.js`, `src/phalanx-rally-selection-v1.js`.
8. **Troop Ratio / Combat Intelligence**: Bär/Wikinger/KvK, 6 Märsche, Cap/Ratio/Timing, Modifier, Wahrscheinlichkeit, Monte Carlo, Dependence Bounds, Pets/Masters/Buffs. Referenzen: `src/phalanx-monte-carlo-v2.js`, `src/phalanx-modifier-math-v1.js`, `data/phalanx-pets-masters-buffs-research-v1-2026-10-12.json`. Troop Ratio und Smart March als vollständige Produkte nicht nachgewiesen.
9. **Outpost Intelligence**: 74 Outposts, 90°-Koordinaten, Quadranten, Karte, Filter, Zoom, Editor, Konflikt-/Transferprüfung, Chat-/Discord-Reports, Sheet Sync. Referenzen: `preview/manage-outposts-v7.html`, `preview/outpost-report-v11.html`, `integrations/verified-outpost-sheet-sync.gs`, `docs/freezes/NEXUS-PHALANX-OUTPOST-MAP-ALPHA23-FREEZE-2026-10-13.md`.
10. **Transfer Scouting**: Kandidaten, Power-Limits, Einladung, Live/Demo, Intelligence und integrierte Stages. Referenzen: `preview/transfer-scouting-integrated-v10.html`, `docs/transfer-scouting-functionality-baseline-2026-09-29.md`.
11. **Reports / Operations**: Intelligence-Berichte, Kingdom Scout Reports, Battle Assignments, Export für Allianzchat/Discord, History. Einzelne Elemente/Entwürfe nachgewiesen; vollständiges Operations Center nicht bestätigt.
12. **Datenpipeline / Account**: MightPulse 16 Boards, 2h-Polling (eingerichtet, Laufzeit nicht neu geprüft), Supabase, Auth/Membership/RLS, optional lokales Accountprofil, Screenshots/Import/Export, Local-First/0€-Ziel. Referenzen: `docs/PHALANX-MIGHTPULSE-DATA-INVENTORY-2026-10-14.md`, `docs/PHALANX-DATA-STRATEGY-2-0-2026-10-14.md`.
13. **PWA / Security / Release**: Android, Offline, Update, i18n, FREEZE, DB Restore, Edge-Function-Backup, Tests, Rollback, 1.0 vs 1.x vs Lab. Referenzen: `docs/PHALANX-STATUS-QUO-RELEASE-BASELINE-2026-10-14.md`, `.github/workflows/phalanx-edge-functions-backup.yml`.

## Nicht als erledigt deklarieren
- Ein sichtbarer Preview-Dateiname beweist keine korrekte Funktion.
- Keine vollständige Android-End-to-End-Abnahme, keine belegte Server-View-Autorisierung.
- Snapshot 2026-10-13 im isolierten Alliance-Top40-Kandidaten ist veraltet.
- 14-dimensionale Profile sind nicht automatisch Combat-/Threat-Scores.
- Freigegebene Designs, produktives `index.html`, Alpha35 und RLS/Secrets bleiben unverändert.

## Integrationsreihenfolge
A. Tatsächlichen produktiven Einstiegspunkt und Navigation bestimmen.
B. Module in einer isolierten RC1-Shell sichtbar machen, ohne vorhandene Rechen-/Datenlogik zu kopieren.
C. Daten-/Auth-Verträge pro Modul prüfen; nach Möglichkeit gemeinsame Quellen statt paralleler Snapshots.
D. Nur blockierende Fehler gezielt testen.
E. Android-Gesamtdurchlauf und gesonderte Freigabe vor Deployment.

Diese Datei ist ein Bewahrungsindex, keine Releasefreigabe.

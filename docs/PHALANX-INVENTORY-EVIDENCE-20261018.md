# NEXUS PHALANX – Bestandsinventur (Evidenzprüfung) – 18.10.2026

Status: laufende Inventur, **keine** Produktivfreigabe und **keine** automatische Aufhebung eines FREEZE. Prüfungsbasis: vorhandene GitHub-Dokumente und B003-Alpha-Routen, plus vom Nutzer gezeigte Android-Screenshots. Keine vollständige Repository- oder Laufzeitprüfung aller Module.

## A. Nachweislich als Referenz freigegeben (nicht automatisch in B003 vollständig integriert)

| Bereich | Referenz | Beleg | Grenze |
| --- | --- | --- | --- |
| HOME | `docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md` | Original-Library-HTML, SHA-256 f8e8a4c4… | Original nicht durch alte KvK-HTML ersetzen; B003 HOME-Integration nicht bestätigt |
| Alpha35 Outpost-Funktion | `docs/freezes/NEXUS-PHALANX-ALPHA35-FUNCTION-FREEZE-2026-10-13.md` | User-geprüfte Android-Filter, Zoom, Pan, Fullscreen, 74 Outposts | Funktionales Original gesondert von OUT-024 aufbewahren |
| Alpha35 Alliance Comparison (HISTORISCH) | `docs/freezes/NEXUS-PHALANX-ALPHA35-ALLIANCE-INTEGRATION-FREEZE-2026-10-13.md` | NXS/FRA/OoO/MYM, damaliger Top40-Stand und Rücknavigation dokumentiert | **Top40 war keine Produktgrenze**, sondern lediglich die damals durch Screenshots verfügbare Datenstichprobe (Nutzerklärung 18.10.). Keine feste Top40-Begrenzung ableiten; tatsächliche Abdeckung abhängig von verfügbarer Datenquelle |
| OUT-024 Map 2.0 | `data/outpost-map-alpha24-canonical-lock-20261018.json` | gesichertes SHA-256-Original, B003 CI-Gate und Android-Screenshots | vollständige Interaktion/Live-Daten nicht erneut end-to-end abgenommen |
| RC5 Epic Navigation | `preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html` | B003 Android RC5→Command Center→RC5→Outpost getestet | übrige 39 Unterrouten nicht vollständig abgenommen |

## B. Vorhandene Implementierungen, Abschlussstatus OFFEN

| Modul | B003-Datei | Nachweis | Offene Abnahme |
| --- | --- | --- | --- |
| Command Center | `preview/nexus-phalanx-command-center-alpha28-local-pair-test-2026-10-13.html` | Android-Seite öffnet | altes lokales Testdesign, historische Daten, finaler HOME-FREEZE noch nicht integriert |
| KvK Prep | `preview/kvk-prep-five-contrast-v13.html` | Android-Loginseite öffnet | Auth/zentraler Login, altes Branding, eigentliche KvK-Funktionen |
| Battle Readiness | `preview/nexus-phalanx-battle-readiness-verified-status-test-2026-10-12.html` | Datei; Computational-Milestone nennt Android-Test | Rollen-/Mitglieder-End-to-End fehlt |
| Rankings | `preview/phalanx-ranking-integration-rc-20261015.html` | 20/40/100-Ansicht vorhanden; dokumentierte 16 Boards × 100 Ranking-Einträge, 242 eindeutige Spieler-UIDs über 14 Spielerboards (Snapshot 14.10.) | aktuelle Datenfrische, Auth, vollständige Android-Integration und End-to-End offen |
| Reports & History | `preview/outpost-report-v11.html` | Legacy-Datei | aktueller Modulstand/Exports nicht abgenommen |
| Transfer Command | `preview/transfer-scouting-demo-v5.html` | ausdrücklich Demo | Live-Daten und Freigabe fehlen |
| Hero Intelligence | `preview/hero-intelligence-evidence-advisor-v15-2026-10-12.html` | Datei, dokumentierte Gen1–5 Daten/Modelle | Datenvalidierung und Spielkalibrierung offen |

## C. Vorhandene Forschung/Prototypen, nicht als fertig deklarieren

- `docs/NEXUS-PHALANX-COMPUTATIONAL-INTELLIGENCE-MILESTONE-2026-10-12.md`: Rally Selection Alpha32, Monte Carlo Alpha31, Hero Investment Lab Alpha2, Optimierung und Pets/Buffs. Explizit Forschungsstand, keine kalibrierten Kingshot-Gewinnchancen.
- `docs/PHALANX-PROJECT-MEMORY-2026-10-14.md`: Kingdom #1913 Scout, Rankings, Edge-Function und Datenmodelle; dokumentierte Tests und offene Browser-/Quellenprüfungen.
- Design-FREEZEs vom 16.10. (Unified Header V2, HOME, PYLON IX) aus Nutzerentscheidungen sind für die spätere Designintegration bindend; diese Inventur behauptet keine geprüfte, aktuelle GitHub-Originalgrafik.

## C2. Nachrecherchierte Datenabdeckung (14.10.2026)

- `docs/PHALANX-MIGHTPULSE-DATA-INVENTORY-2026-10-14.md`: 16 Boards × 100 = 1.600 **Ranking-Einträge**, davon 14 Spielerboards × 100 mit 242 verschiedenen Spieler-UIDs und 2 Allianzboards × 100. Dies sind historische, dokumentierte SQL-Prüfergebnisse, keine am 18.10. neu ausgeführte Datenbankabfrage.
- `docs/PHALANX-DATA-STRATEGY-2-0-2026-10-14.md`: Auswertungen bis Top100 **wo Daten verfügbar**; keine Extrapolation über verfügbare Rangtiefe hinaus.
- `preview/phalanx-ranking-integration-rc-20261015.html`: sichtbare Filter 20/40/100, kein Beleg für unbegrenzte Daten oder erfolgreiches heutiges Laden.
- `docs/PHALANX_NAVIGATION_V1_2026-10-15.md`: Ranking Top40 als Filter/Ansicht, nicht eigenständiges Modul; frühere HOME→Ranking-Verbindung ausdrücklich noch nicht validiert.
- Die Beschränkung auf 40 manuelle Screenshots ist historisch und **nicht** als Funktionslimit anzusehen. Datenverfügbarkeit, Ansichtslimit und Geschäftsregel stets getrennt dokumentieren.

## D. Festgestellte Risiken und nächste Prüfung

1. **Historische Top40-Datenstichprobe**: 40 war ausschließlich die Anzahl damals manuell bereitgestellter Spieler-Screenshots, keine fachliche Ranking-Grenze. Aktuelle Datenquelle, tatsächliche Abdeckung und mögliche technische Limits getrennt prüfen; nicht automatisch Top100 oder unbegrenzte Daten behaupten.
2. **Versionskonflikt**: alte OUT-023-Vorschau existiert weiter als Legacy; OUT-024 ist die alleinige aktuelle freigegebene Map. Nicht vertauschen.
2. **Design-Mix**: RC5, Alpha28 Command Center und KvK V13 haben unterschiedliche Oberflächen; keine automatische Restyling-Freigabe.
3. **Pfadstatus**: B003-Android-Screenshots zeigten `route mismatch` trotz sichtbarer Module. Separat testen, nicht das Modul-Original verändern.
4. **Auth**: KvK hat eigenen Login; zentrale Authentifizierung und RLS sind noch keine vollständige End-to-End-Freigabe.
5. **Historische Daten**: 04.10.26 Snapshot darf nicht als aktuell/live etikettiert werden.
6. **Nächste Aufgabe**: tatsächliche Originale der FREEZEs und Modul-Funktionsprüfungen gegen Artefakte/Hashes abgleichen; danach Prioritäten nach Abhängigkeiten festlegen. Keine Merges, keine Produktion, keine Kosten.

## Statusdefinitionen

- **FREEZE** = verbindliche, unveränderliche Referenz; nicht automatisch produktiv.
- **ANDROID VISUAL** = sichtbarer Screenshot; keine Funktionsvollabnahme.
- **FUNCTION TESTED** = ausdrücklich getesteter Teilfluss, nicht gesamtes Modul.
- **INTEGRATED** = in isolierter Alpha erreichbar; nicht automatisch freigegeben.
- **RELEASED** = erst nach expliziter Nutzerfreigabe und Sicherheitsprüfung.

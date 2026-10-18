# NEXUS PHALANX – Bestandsinventur (Evidenzprüfung) – 18.10.2026

Status: laufende Inventur, **keine** Produktivfreigabe und **keine** automatische Aufhebung eines FREEZE. Prüfungsbasis: vorhandene GitHub-Dokumente und B003-Alpha-Routen, plus vom Nutzer gezeigte Android-Screenshots. Keine vollständige Repository- oder Laufzeitprüfung aller Module.

## A. Nachweislich als Referenz freigegeben (nicht automatisch in B003 vollständig integriert)

| Bereich | Referenz | Beleg | Grenze |
| --- | --- | --- | --- |
| HOME | `docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md` | Original-Library-HTML, SHA-256 f8e8a4c4… | Original nicht durch alte KvK-HTML ersetzen; B003 HOME-Integration nicht bestätigt |
| Alpha35 Outpost-Funktion | `docs/freezes/NEXUS-PHALANX-ALPHA35-FUNCTION-FREEZE-2026-10-13.md` | User-geprüfte Android-Filter, Zoom, Pan, Fullscreen, 74 Outposts | Funktionales Original gesondert von OUT-024 aufbewahren |
| Alpha35 Alliance Comparison | `docs/freezes/NEXUS-PHALANX-ALPHA35-ALLIANCE-INTEGRATION-FREEZE-2026-10-13.md` | NXS/FRA/OoO/MYM, Top40, Zurück-Navigation vom Nutzer bestätigt | Nur nachgewiesene Testflüsse; nicht automatisch in B003 |
| OUT-024 Map 2.0 | `data/outpost-map-alpha24-canonical-lock-20261018.json` | gesichertes SHA-256-Original, B003 CI-Gate und Android-Screenshots | vollständige Interaktion/Live-Daten nicht erneut end-to-end abgenommen |
| RC5 Epic Navigation | `preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html` | B003 Android RC5→Command Center→RC5→Outpost getestet | übrige 39 Unterrouten nicht vollständig abgenommen |

## B. Vorhandene Implementierungen, Abschlussstatus OFFEN

| Modul | B003-Datei | Nachweis | Offene Abnahme |
| --- | --- | --- | --- |
| Command Center | `preview/nexus-phalanx-command-center-alpha28-local-pair-test-2026-10-13.html` | Android-Seite öffnet | altes lokales Testdesign, historische Daten, finaler HOME-FREEZE noch nicht integriert |
| KvK Prep | `preview/kvk-prep-five-contrast-v13.html` | Android-Loginseite öffnet | Auth/zentraler Login, altes Branding, eigentliche KvK-Funktionen |
| Battle Readiness | `preview/nexus-phalanx-battle-readiness-verified-status-test-2026-10-12.html` | Datei; Computational-Milestone nennt Android-Test | Rollen-/Mitglieder-End-to-End fehlt |
| Rankings | `preview/phalanx-ranking-integration-rc-20261015.html` | Datei | Funktion und aktuelle Daten nicht abgenommen |
| Reports & History | `preview/outpost-report-v11.html` | Legacy-Datei | aktueller Modulstand/Exports nicht abgenommen |
| Transfer Command | `preview/transfer-scouting-demo-v5.html` | ausdrücklich Demo | Live-Daten und Freigabe fehlen |
| Hero Intelligence | `preview/hero-intelligence-evidence-advisor-v15-2026-10-12.html` | Datei, dokumentierte Gen1–5 Daten/Modelle | Datenvalidierung und Spielkalibrierung offen |

## C. Vorhandene Forschung/Prototypen, nicht als fertig deklarieren

- `docs/NEXUS-PHALANX-COMPUTATIONAL-INTELLIGENCE-MILESTONE-2026-10-12.md`: Rally Selection Alpha32, Monte Carlo Alpha31, Hero Investment Lab Alpha2, Optimierung und Pets/Buffs. Explizit Forschungsstand, keine kalibrierten Kingshot-Gewinnchancen.
- `docs/PHALANX-PROJECT-MEMORY-2026-10-14.md`: Kingdom #1913 Scout, Rankings, Edge-Function und Datenmodelle; dokumentierte Tests und offene Browser-/Quellenprüfungen.
- Design-FREEZEs vom 16.10. (Unified Header V2, HOME, PYLON IX) aus Nutzerentscheidungen sind für die spätere Designintegration bindend; diese Inventur behauptet keine geprüfte, aktuelle GitHub-Originalgrafik.

## D. Festgestellte Risiken und nächste Prüfung

1. **Versionskonflikt**: alte OUT-023-Vorschau existiert weiter als Legacy; OUT-024 ist die alleinige aktuelle freigegebene Map. Nicht vertauschen.
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

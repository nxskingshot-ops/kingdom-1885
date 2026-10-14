# NEXUS PHALANX — Projektgedächtnis | 14.10.2026

## Verbindliche Regeln
- Produktive App/index.html und Alpha35 nicht ohne ausdrückliche Freigabe verändern.
- Alpha35-Freeze: preview/phalanx-alpha35-alliance-top40-stage-v3-20261013.html; Freeze-Commit 1790e60620375a9fac369dd0b0799f1a263823bb.
- HOME-Design-Freeze: docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md.
- Ungeprüfte Formeln, Daten und historische Ursachen nicht als bestätigt darstellen. Keine Geheimnisse im Repository speichern.

## Heutige gesicherte Artefakte
- data/phalanx-display-gate-check-v1-2026-10-14.json — Mapping-Audit 18/18 laut früherem Prüflauf.
- preview/phalanx-kingdom-scout-report-v1-20261014.html — isolierte mobile Scout-UI, Commit e6faec1; Browser-Test offen.
- Supabase phalanx-kingdom-1913-scout-test — 7/7 strukturelle Rankingprüfungen im Dashboard bestätigt.
- Supabase phalanx-kingdom-scout-report-test — v2 ACTIVE, HTTP 200 und ok:true für #1913 vom Nutzer bestätigt.
- docs/phalanx-kingdom-scout-threat-intelligence-v0-20261014.md — Konzept zur Trennung von Power und historischer Battle-Leistung.
- data/phalanx-cycle-advantage-research-v1-20261014.json — Cycle-Advantage Forschungsmodell, Commit 98cd04e; noch keine bestätigten exakten Unlock-Daten.
- preview/phalanx-mightpulse-refresh-test-20261014.html und preview/phalanx-mightpulse-value-diff-auth-test-20261014.html — isolierte Testoberflächen.
- Helden- und Formelaudits unter data/phalanx-*; insbesondere phalanx-hero-unified-evidence-index-v2-2026-10-13.json und phalanx-source-registry-v13-2026-10-12.json.

## Fakten, Hypothesen, offene Prüfungen
- MightPulse: #1885 16 Boards strukturell auditiert; Strukturqualität ist keine unabhängige Spielvalidierung.
- #1913 sieben Boards geprüft, Scout UI erstellt, noch kein kalibrierter Threat Score.
- Prep und Castle immer separat bewerten; Königreichsnummer allein beweist keinen exakten Alters-/Freischaltungsabstand.
- Nutzer berichtet #1913 habe aufgrund eines Zyklus-Rückstands mehr Prep-Upgrades nutzen können. Plausible Hypothese, genaue Ereignisse und Ursachen noch nicht unabhängig verifiziert.
- Historische KvK-Ergebnisse aus älteren Notizen mit Datum, Gegner, Prep-/Castle-Ausgang und Quelle abgleichen.

## Nächste Schritte
1. Isolierte Scout-Vorschau mobil testen: Login, #1913, sieben Boards.
2. Letzte KvK-Ergebnisse für #1913 und #1885 quellenbasiert erfassen.
3. Königreichsalter, Freischaltungswellen, verbleibende Prep-Upgrades und Prep-Regeln belegen.
4. Synchronisierte #1885/#1913-Rankings normalisiert vergleichen.
5. Erst danach Threat Score, Prep Opportunity, Cycle Advantage und Confidence in isolierter Vorschau berechnen.
6. Vor jeder Integration Freeze- und Qualitätsprüfung; produktiv nur mit ausdrücklicher Freigabe.

## Wiederaufnahme
Dieses Dokument zuerst lesen, anschließend referenzierte Artefakte. Jeden neuen Befund mit Quelle, Datum, Status (bestätigt/geschätzt/offen), Entscheidung und nächstem Schritt ergänzen. Bestehende geprüfte Daten nicht ungeprüft überschreiben.
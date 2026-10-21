# PHALANX — Verbindliche Versionshygiene und Negativregister (2026-10-21)

Status: DOKUMENTIERT auf isoliertem Arbeitsbranch; keine Produktionsfreigabe. Gilt als Arbeitsregel für neue Integrationspakete; bestehende FREEZEs haben Vorrang.

## Regeln
1. Vor Änderungen START-HERE, neueste spezifische FREEZEs, aktuelle Quellversion und bestehende Integration prüfen.
2. Jede Quelle erhält: Feature-ID, Pfad, Version, SHA/Commit soweit verifiziert, Status, Ersatzversion, Grund und Nachweis.
3. Status: AKTUELL (Integrationskandidat), FROZEN (verbindlich geschützt), VERALTET (ersetzt), FEHLERHAFT (belegter Defekt), VERWORFEN (bewusst ausgeschlossen), ARCHIVIERT (historisch). Status ist unabhängig von Implementierungs-/Test-/Release-Reife.
4. Aus aktiven Einstiegspunkten entfernte Varianten bleiben historisch nachvollziehbar. Keine destruktive Löschung von FREEZEs, Originalgrafiken, Backups oder Wiederherstellungsständen.
5. Kein unbestätigtes Hochstufen zu AKTUELL oder FEHLERHAFT. Bei Konflikt blockieren und dokumentieren; keine stillschweigende Auswahl.
6. Nach zwei gescheiterten Versuchen Ansatz wechseln. Keine neuen isolierten HTML-Hüllen ohne konkrete Integrationsnotwendigkeit.
7. Nach Integrationspaket Register und START-HERE aktualisieren; technische Tests, Android-Tests und Freigaben getrennt ausweisen.
8. Keine Änderungen an main, Produktion, Rechten oder kostenpflichtiger Infrastruktur ohne ausdrückliche Freigabe.

## Erstes Negativ-/Quellenregister (aus bisheriger Projektübergabe, noch gegen tatsächlichen Code zu prüfen)
| Bereich | Quelle | Einstufung | Begründung / nächster Schritt |
|---|---|---|---|
| HOME | Design-FREEZE 2026-10-21 | FROZEN | Aktuelle visuelle Entscheidung; Binäroriginal noch nicht kanonisch archiviert. |
| HOME | DIRECT-BRIDGE 2026-10-20 | PRÜFEN | Vorhandene technische Integration; nicht mit HOME-FREEZE 21.10 gleichsetzen. |
| Navigation | Epic Navigation RC5 | PRÜFEN | Historische Baseline 8/39; neuere verbindliche Entscheidungen abgleichen. |
| Outpost Map | Alpha24 | PRÜFEN | Früher bytegenau verifiziert; neuere Alpha35/Integrations-FREEZEs vor Aktivsetzung vergleichen. |
| Reports | preview/outpost-report-v11.html | NICHT AKTIVIEREN | Historische Viewer-Abhängigkeit; neuere sichere Übergangsentscheidung vom 18.10 prüfen. |
| Territory-Wrapper | B001/B002/B003 | ARCHIV-KANDIDAT | Zwischenlösungen nicht als kanonische App-Integration deklarieren. |
| GOD MODE | SQL-Entwurf | NICHT IMPLEMENTIERT | Sicherheits-FREEZEs bewahren; kein produktiver Eingriff. |

PRÜFEN, NICHT AKTIVIEREN und ARCHIV-KANDIDAT sind bewusst Vorprüfvermerke, keine behaupteten formalen Freigaben. Kein Code gelöscht.

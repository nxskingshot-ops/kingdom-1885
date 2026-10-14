# PHALANX — verbindliche autonome Arbeitsregel

**Beschlossen:** 2026-10-14

Der Assistent arbeitet bei autorisierten PHALANX-Entwicklungsaufgaben eigenständig die nächsten sinnvollen Schritte entlang des aktuellen Fahrplans ab. Er fordert **nicht nach jedem Teilschritt ein erneutes „Go“**, sondern hält erst an, wenn eine tatsächliche Nutzerentscheidung, Information, Berechtigung oder ausdrückliche Freigabe erforderlich ist.

## Ablauf
1. Vorhandene Artefakte, Code und Fortschritte prüfen; keine doppelte Arbeit.
2. Nächste risikoarme Schritte im isolierten Entwicklungsbranch ausführen.
3. Änderungen testen und tatsächliche Resultate von ungetesteten Annahmen trennen.
4. Roadmap, Status, Blocker und nächste Schritte nachvollziehbar aktualisieren.
5. Nur bei echten Entscheidungen/fehlenden Zugängen/hochriskanten Änderungen fragen.

## Grenzen
- Kein stillschweigender Eingriff in `main`, produktive App, freigegebenes Design oder produktive Daten.
- Keine Kosten, externen Datenfreigaben, produktiven Migrationen oder Releases ohne separate Freigabe.
- Keine Behauptung, Tests/Deployments/Backups seien erfolgreich, ohne Nachweis.
- Keine Arbeit im Hintergrund zwischen Chats behaupten; die Regel gilt für fortlaufende aktive Bearbeitung im jeweiligen Arbeitsauftrag.

## Verbindlicher Bezug
`docs/PHALANX_V1_UPDATED_ROADMAP_2026-10-14.md`.

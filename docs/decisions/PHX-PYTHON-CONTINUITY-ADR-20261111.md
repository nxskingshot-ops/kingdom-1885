# PHALANX – Python-Kontinuität und feste Übergabe (ADR)

Datum: 2026-11-11
Status: BESCHLOSSENE ANFORDERUNG; AUTOMATISCHE VERKABELUNG NOCH NICHT IMPLEMENTIERT ODER GETESTET.
Geltungsbereich: NEXUS APP 2.0 – PHALANX, alle Module und Entscheidungsschritte.

## Verbindliche Regel
Python wird bei jedem relevanten technischen Entscheidungsschritt als Prüf- und Automatisierungsschicht berücksichtigt. Kein zweites, widersprüchliches Projektgedächtnis: **GitHub-Register und tatsächlich geprüfter Quellcode sind die maßgebliche Quelle**.

## Gewünschte feste Verkabelung
1. Jede technische Entscheidung erhält einen versionierten, maschinenlesbaren Eintrag mit Datum, Geltungsbereich, betroffenen Dateien, FREEZEs, Abhängigkeiten, Status und Rückweg.
2. Python-basierte Prüfungen sollen diese Register einlesen, auf fehlende Angaben und Widersprüche prüfen und einen nachvollziehbaren Prüfbericht erzeugen.
3. Vor riskanten Änderungen: Bestandsaufnahme, Sicherung, Daten- und Berechtigungsprüfung; nach Änderungen: Tests und Regressionen.
4. Alle Module verwenden dieselbe Entscheidungsquelle. Python ersetzt keine Autorisierung, keine Benutzerfreigabe und keine echten Browser-/Backendtests.
5. Auth-Entscheid: genau **ein** Supabase Auth; synthetische Kontoerzeugung nur nach Abhängigkeitsprüfung gezielt stilllegen; siehe `docs/decisions/PHX-AUTH-SINGLE-SYSTEM-ADR-20261111.md`.
6. Keine automatische Ausführung produktiver Änderungen, Datenlöschungen, Rollenänderungen, Deployments oder kostenpflichtiger Aktionen durch Python ohne Freigabe.

## Geplanter maschinenlesbarer Datensatz
```json
{
  "id": "PHX-PYTHON-CONTINUITY-20261111",
  "status": "decision_recorded_implementation_pending",
  "source_of_truth": "github_repository_and_verified_code",
  "scope": "all_phalanx_modules",
  "required_checks": ["requirements", "freezes", "dependencies", "backups", "permissions", "tests", "regressions", "rollback"],
  "auth_system": "existing_supabase_auth_only",
  "production_changes_allowed": false
}
```

## Nachweise und offene Punkte
- BESTANDEN: Entscheidung im isolierten GitHub-Branch dokumentiert, sofern nach Schreibvorgang erneut gelesen.
- NICHT GETESTET: automatische Python-Einlesung, CI-Verkabelung, Prüfbericht, Browser-/Datenbanktests.
- NICHT ERFOLGT: Deployment, produktive Änderung, Deaktivierung, Datenlöschung.

**Wichtig:** Python hat kein dauerhaftes eigenes Gedächtnis. Ein automatischer Informationsfluss ist erst vorhanden, wenn ein tatsächlich ausgeführtes und getestetes Skript/CI-Workflow ihn herstellt.

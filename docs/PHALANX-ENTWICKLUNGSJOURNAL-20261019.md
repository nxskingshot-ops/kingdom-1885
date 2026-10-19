# NEXUS PHALANX · Entwicklungsjournal

**Kennung:** PHX-LOG-001  
**Angelegt:** 2026-10-19  
**Ort:** GitHub, isolierter Journal-Branch  
**Zweck:** Historische Arbeit nachvollziehbar machen, künftig Zeitaufwand und Ergebnisse transparent erfassen.

## Regeln der Zeiterfassung

- `GEMESSEN`: Uhrzeit/Arbeitsdauer wurde tatsächlich mit Start und Ende erfasst.
- `GESCHÄTZT`: nachvollziehbare grobe Rückschau, **keine** Zeitmessung.
- `NICHT ERFASST`: Ein Arbeitsergebnis ist bekannt, aber kein belastbarer Zeitaufwand verfügbar.
- Zeitarten stets unterscheiden: **persönliche aktive Zeit**, **gemeinsame interaktive Arbeitszeit**, **asynchrone GitHub-Runner-Zeit**. Nicht unbemerkt addieren.
- Historische Schätzungen niemals nachträglich in gemessene Werte umetikettieren.
- Für jeden Block festhalten: Datum, Arbeitsbereich, Quelle/Commit, Ergebnisstatus, Testnachweis, offene Punkte, Zeittyp und Dauer.
- Keine Geheimnisse, Zugangsdaten, personenbezogenen Daten oder privaten Backup-Inhalte in dieses Journal aufnehmen.
- Kein Eintrag erklärt ein Feature ohne Nachweis für freigegeben oder auf Android getestet.

## Historische Gesamtschätzung (Ende September bis 19.10.2026)

**100–180 Stunden; GESCHÄTZT; sehr hohe Unsicherheit.** Grundlage sind intensive Gespräche und bekannte Aufgabenpakete. Es gibt bisher **keine lückenlose Stoppuhrmessung**. Die Verteilung unten dient nur als grobe Orientierung; sie ist keine Arbeitszeiterfassung oder abrechenbare Leistung.

| Bereich | Geschätzte Stunden |
| --- | ---: |
| Konzeption, Module, Funktionen | 15–25 |
| Design, Branding, FREEZEs | 20–35 |
| Entwicklung, technische Integration | 30–55 |
| Tests, Fehlerbehebung, Navigation | 25–45 |
| GitHub, Backups, Sicherheit | 10–20 |
| **GESAMT (grobe Rückschau)** | **100–180** |

Die Summe der Bereichsobergrenzen beträgt 180; die Bereichsuntergrenzen betragen 100. Unterschiedliche parallele Tätigkeiten sind nicht unabhängig verifiziert.

## Journal-Einträge

| Datum | ID | Bereich | Nachweis / Ergebnis | Status | Zeit |
| --- | --- | --- | --- | --- | --- |
| 2026-10-19 | PHX-LOG-001-A | Projektorganisation | ChatGPT-Projekt mit Anweisungen eingerichtet; GitHub-Quellenwegweiser auf `work/alpha-territory-integration-20261019`, Commit `b81809c0` | Dokumentiert; kein App-Release | NICHT ERFASST |
| 2026-10-19 | PHX-LOG-001-B | PostgreSQL-Backup | Sechs GitHub-Actions-Läufe bis 19.10. laut Nutzer-Screenshot erfolgreich; zusätzlicher Archivprüflauf `39153463727` | Backup/Archivprüfung belegt; kompletter Restore offen | NICHT ERFASST |
| 2026-10-19 | PHX-LOG-001-C | Edge Functions | 26 Quellen archiviert: Lauf `39153935072`. Täglicher Workflow auf `main` ergänzt; manuell gestarteter Lauf #4 laut GitHub-Screenshot erfolgreich (56 s) | Sicherungsworkflow getestet; planmäßiger Lauf noch separat nachzuweisen | **56 s GitHub-Runner-Dauer**, keine menschliche Arbeitszeit |
| 2026-10-19 | PHX-LOG-001-D | Isolierter DB-Restore | Datenbanktest: Prüfsumme und Entschlüsselung bestanden, `pg_restore` scheiterte mit `MISSING_EXTENSION`; Kompatibilitätstest für Supabase PostgreSQL vorbereitet | RESTORE **NICHT VERIFIZIERT** | NICHT ERFASST |
| 2026-10-19 | PHX-LOG-001-E | Entwicklungsjournal | Journal neu erstellt; künftige dokumentierte Blöcke nach diesem Schema | CODE_PRESENT / dokumentiert | NICHT ERFASST |

## Vorlage für neue Blöcke

```text
Datum (Europe/Berlin):
ID:
Arbeitsbereich / Feature-ID:
Ziel:
Ausgangsversion / Branch:
Änderungen (Commit/Dateipfade):
Tests (Ausführung, Ergebnis, Nachweis):
Status: PLANNED | CODE_PRESENT | CI_VERIFIED | DEVICE_VERIFIED | FROZEN | BLOCKED
Offene Punkte / Rückfallweg:
Zeittyp: GEMESSEN | GESCHÄTZT | NICHT ERFASST
Aktive Arbeitszeit:
Automatische Laufzeit (separat):
```

## Pflege

Dieses Journal wird zu sinnvollen abgeschlossenen Arbeitspaketen aktualisiert. Es ersetzt weder das Feature-Register noch den Design-FREEZE-Index oder die Recovery-Dokumentation. Die jeweilige Originalquelle bleibt maßgeblich. Bei künftigen Arbeiten nur mit nachvollziehbaren Zeitangaben echte Summen bilden.

## Ergänzung: Restore-Kompatibilität, 19. Oktober 2026

| Datum | ID | Bereich | Nachweis / Ergebnis | Status | Zeit |
| --- | --- | --- | --- | --- | --- |
| 2026-10-19 | PHX-LOG-001-F | Supabase-Kompatibilität | GitHub Actions `PHALANX Supabase PostgreSQL Compatibility Gate (Dummy Only)` #1: **Success** (33 s laut Nutzer-Screenshot). Container mit PostgreSQL 17 und sechs Extension-Namen verfügbar | CI_VERIFIED nur für Dummy-/Kompatibilitätsprüfung; echter DB-Restore OFFEN | 33 s Runner-Dauer, menschliche Zeit NICHT ERFASST |
| 2026-10-19 | PHX-LOG-001-G | Datenbank-Restore | Neuer isolierter, manuell auszulösender Workflow `.github/workflows/phalanx-supabase-compatible-restore-drill.yml` auf `main`, Commit `014cf38c`; Backup-Download, Restore und 23-Tabellen-/23-RLS-Prüfung definiert | CODE_PRESENT; Workflow **noch nicht ausgeführt** | NICHT ERFASST |


## Ergänzung: Auth-/Public-Abhängigkeit beim Restore, 19. Oktober 2026

| Datum | ID | Bereich | Nachweis / Ergebnis | Status | Zeit |
| --- | --- | --- | --- | --- | --- |
| 2026-10-19 | PHX-LOG-001-H | Restore-Diagnose | `public`-Teil-Restore scheiterte mit `SCHEMA_OR_OBJECT_MISSING` bei TABLE. Read-only Supabase-Prüfung bestätigte `auth.uid()` als Default und 5 public→auth-FKs; auth intern 24 FKs | Diagnose belegt, erste SQL-Fehlursache nicht vollständig bewiesen | NICHT ERFASST |
| 2026-10-19 | PHX-LOG-001-I | Restore-Test Auth+Public | Neues manuelles GitHub-Workflow `.github/workflows/phalanx-auth-public-restore-validation.yml`, Commit `eba93721`, isolierte Wiederherstellung und Prüfungen (23 Tabellen/RLS, 5 FKs, auth.users) | CODE_PRESENT, echter Test noch ausstehend | NICHT ERFASST |


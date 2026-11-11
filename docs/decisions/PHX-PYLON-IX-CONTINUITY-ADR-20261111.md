# PHALANX – PYLON IX als zentrale Informations- und Koordinationsinstanz

Datum: 2026-11-11
Status: BESCHLOSSENE ANFORDERUNG; TECHNISCHE VERKABELUNG NOCH NICHT IMPLEMENTIERT ODER GETESTET.

## Verbindliche Nutzervorgabe
**PYLON / PYLON IX (nicht Python)** muss bei jedem relevanten Entscheidungsschritt eingebunden sein. Alle PHALANX-Module benötigen eine feste, nachvollziehbare Verbindung („Leerrohr“/feste Verkabelung) zur PYLON-IX-Instanz, damit Entscheidungen, Status und Abhängigkeiten nicht verloren gehen.

## Architekturgrundsätze
1. PYLON IX ist die zentrale Koordinations- und Informationsinstanz für PHALANX; keine konkurrierende zweite Quelle der Wahrheit für Auth, Rollen oder Daten.
2. Jedes Modul definiert einen nachvollziehbaren Informationsweg zu PYLON IX für relevante Entscheidungen, Modulstatus, Abhängigkeiten, Fehler, Freigaben und Tests.
3. Bereits bestehende PYLON-IX-Implementierung, Emblem-FREEZE, HOME-FREEZE, Navigation, Projektregister und Rechte vor Änderungen tatsächlich prüfen.
4. Die konkrete technische Anbindung (Schnittstelle, Events, Datenmodell, Berechtigungen) ist erst nach Bestandsaufnahme zu planen; keine unbelegten Behauptungen über eine schon bestehende Verbindung.
5. Keine produktiven Änderungen, Rechteänderungen, Datenmigrationen, Löschungen oder Zusatzkosten ohne ausdrückliche Freigabe. Isolierte Umsetzung und Regressionstests.
6. Der Auth-Entscheid bleibt unverändert: bestehendes Supabase Auth als einziges Auth-System; siehe `PHX-AUTH-SINGLE-SYSTEM-ADR-20261111.md`.

## Nachweise / offener Stand
- BESTANDEN: Nutzervorgabe schriftlich festgehalten und im isolierten GitHub-Branch versioniert (erneutes Lesen erforderlich).
- NICHT GETESTET: tatsächliche PYLON-IX-Verbindung, Modul-Synchronisation, Rechte, Navigation, Integration, Regressionen.
- NICHT ERFOLGT: Produktive Änderungen oder Deployment.

## Korrekturvermerk
Die zuvor erstellte Datei `PHX-PYTHON-CONTINUITY-ADR-20261111.md` beruhte auf einer Fehlinterpretation und wurde ausdrücklich für ungültig erklärt. Python ist **nicht** die vom Nutzer gemeinte zentrale Instanz.

## Verbindliche PYLON-IX-Wissensfortschreibung – Zusatzentscheid 2026-11-11

**Nutzerauftrag:** PYLON IX muss das bereits vorhandene Wissen, insbesondere aus Transfer Scouting, behalten und bei jedem relevanten Entwicklungsschritt nachweisbar dazulernen, ohne dass der Nutzer dies wiederholt einfordern muss.

### Pflichtablauf für jede zukünftige Moduländerung
1. **VORHER:** Bestehenden PYLON-IX-Code, Regeln, gespeicherte Erkenntnisse, Schnittstellen, Versionsstände, Entscheidungen und FREEZEs lesen. Wissen und Funktionalität nicht als leer annehmen.
2. **BESTAND SICHERN:** Unveränderten Ausgangsstand und Abhängigkeiten dokumentieren; für riskante Änderungen Backup, Integrität und Rückweg gesondert nachweisen.
3. **WISSENSDELTA:** Zu jeder Änderung festhalten, was PYLON IX neu wissen muss: Modul, Funktionen, Eingänge/Ausgänge, Datenquellen, Berechtigungen, Entscheidungen, Fehler, Tests, Status, Quellverweise und Version.
4. **ÜBERGABE:** Wissensdelta im versionierten PHALANX-Projektregister dokumentieren; sobald eine echte PYLON-Schnittstelle implementiert ist, an diese übermitteln. Kein stillschweigendes Überschreiben vorhandener Regeln.
5. **NACHWEIS:** Prüfung ausweisen als `BESTANDEN`, `FEHLGESCHLAGEN` oder `NICHT GETESTET`. Nur `BESTANDEN` für echte Wissensübernahme, wenn PYLON IX den neuen Eintrag nachweislich wieder auslesen kann. GitHub-Dokumentation allein ist **keine** bewiesene automatische Übernahme durch PYLON IX.
6. **KEINE RÜCKFRAGE-SCHLEIFE:** Wissensfortschreibung ist Standardbestandteil der Arbeit; nur bei notwendigen Freigaben, Sicherheitsrisiken oder Blockaden fragen.

### Startbestand Transfer Scouting
- Bestehende Quelle: `docs/staging/PHX-TRANSFER-DECISION-V2-20261107.md` auf `stage/transfer-live-rankings-20261103` sowie tatsächlicher Transfer-Code, Bewertungsmodule und Backend.
- Vorhandene PYLON-IX-Urteilsdarstellung, SEA-WORLD-Regeln, Rollenprioritäten, Vergleiche, Datenquellen, Fehler, Tests und Rückwege **inventarisieren und erhalten**; nicht neu erfinden.
- Bereits gespeicherte PYLON-IX-Daten und deren Speicherort müssen noch technisch verifiziert werden.

### Technischer Status
- BESTANDEN: Pflichtprozess und Transfer-Startquellen im isolierten GitHub-Branch dokumentiert, sofern danach erneut gelesen.
- NICHT GETESTET: PYLON-IX-Wissensspeicher, automatische Synchronisierung, Abruf des Wissens durch PYLON IX, Live-Events und End-to-End-Verkabelung.
- KEINE produktive Änderung, Datenlöschung, Berechtigungsänderung oder Deployment durch diesen Eintrag.

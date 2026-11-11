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

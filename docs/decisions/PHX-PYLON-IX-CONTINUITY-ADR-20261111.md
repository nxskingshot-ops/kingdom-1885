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

## Präzisierung: funktionsgenaue Verkabelung (2026-11-11)

Der Nutzer stellt ausdrücklich klar: PYLON IX darf **nicht nur Module** miteinander verbinden. Die verbindliche Zielarchitektur umfasst auch **Funktionen innerhalb eines Moduls** sowie **Funktionen über mehrere Module hinweg** und Ereignisse, die mehrere Funktionen betreffen.

### Pflicht für jede technische Bestandsaufnahme und Integration
- Jede relevante Funktion mit stabiler ID, Modul, Aufgabe, Eingaben/Ausgaben, Datenquellen, Aufrufern, abhängigen Funktionen, Berechtigungen, Fehlerpfad, Status, Version und Tests inventarisieren.
- Beziehungen typisieren: `module-to-module`, `function-to-function`, `cross-module-function`, `event-to-function`. Bestehende Verbindungen von neuen/geplanten klar unterscheiden.
- Funktionsübergreifende Vorgänge Ende-zu-Ende betrachten (z. B. Registrierung → Freigabe → Profil/Rolle → HOME; Profil-Spieler-ID → geschützte Spielerabfrage → Transferbewertung). Beispiele sind **Zielbilder**, keine Bestätigung der aktuellen technischen Umsetzung.
- Gemeinsame Funktionen wiederverwenden statt duplizieren; keine konkurrierende Authentifizierung, keine ungeprüften direkten Datenbankzugriffe und keine Umgehung von Rollen/RLS.
- Bei jeder Modul- oder Funktionsänderung Auswirkungen auf **alle** verbundenen Funktionen und Module prüfen und als Wissensdelta für PYLON IX dokumentieren.
- Vor Umsetzung tatsächliche Quellcode-Abhängigkeiten, vorhandene PYLON-Integration und FREEZEs prüfen; erst dann Steckpunkte, Schnittstellen, Eventwege und Steuerungszuständigkeiten festlegen.
- Automatische, funktionsgenaue Verkabelung, PYLON-Lesezugriff und End-to-End-Tests sind **noch nicht implementiert oder nachgewiesen**. Kein produktiver Eingriff durch diese Dokumentation.

## PYLON IX – verlässliche Nutzerantworten (Zusatzentscheid 2026-11-11)

**Nutzerziel:** PYLON IX soll auf Fragen aller berechtigten Nutzer plausible, präzise, sinnvolle und möglichst richtige Antworten geben, einschließlich modul- und funktionsübergreifender Fragen.

### Verbindliche Qualitäts- und Sicherheitsregeln
1. **Quellenbindung:** App-Code, versionierte Projektregister, freigegebene Regeln und berechtigt abrufbare aktuelle Daten als Wissensgrundlage; Aussagen nach Quelle, Zeitpunkt und Gültigkeitsbereich unterscheiden.
2. **Keine Halluzinationen:** Fehlende, unvollständige, veraltete oder widersprüchliche Daten offen benennen. Keine Spielerwerte, Live-Verfügbarkeit, Freigaben, Tests oder Funktionszustände erfinden.
3. **Funktionsübergreifende Antworten:** Relevante Abhängigkeiten zwischen Funktionen und Modulen berücksichtigen, ohne Berechtigungen oder RLS zu umgehen.
4. **Berechtigungen:** Jede Datenabfrage und Antwort muss das bestehende Supabase-Auth- und Rollenmodell respektieren; kein unberechtigtes Offenlegen von Spieler-, Konto-, Mitglieder- oder Administrationsdaten.
5. **Erklärbarkeit:** Bei Bewertungen relevante Kennzahlen, Datenquelle, Erfassungszeit, verwendete Regel und Grenzen nachvollziehbar machen; insbesondere Transfer-Scouting-Rollen nicht ohne erforderliche Kampfnachweise als gesichert ausgeben.
6. **Antwortqualität:** Nutzerfrage direkt, verständlich, kontextbezogen und ohne unnötige Rückfragen beantworten; Ungewissheit angemessen kalibrieren.
7. **Keine absolute Korrektheitsbehauptung:** KI-Antworten können fehlerhaft sein. Qualitätskontrolle durch Testfälle, Quellenabgleich, Rechte- und Regressionstests sowie Korrekturprotokolle.
8. **Wissensfortschreibung:** Nach freigegebenen Änderungen Wissensdelta dokumentieren und später nachweislich über die PYLON-Verbindung synchronisieren. Keine stillschweigende Übernahme unbestätigter Behauptungen als Fakten.

### Abnahmekriterien (noch offen)
- Testfragen zu HOME, Access, Territory, Transfer und funktionsübergreifenden Abläufen.
- Korrekte Antworten auf belegte Fragen; explizite Unsicherheit bei Datenlücken; Nachweis von Quelle und Datenstand.
- Berechtigungstests für Gast, Mitglied, Operator, Administrator und geschützte Rollen, soweit implementiert.
- Regressionstests nach jeder relevanten Wissens- oder Schnittstellenänderung.

**Status:** Anforderung dokumentiert; Antwortsystem, Datenzugriffe, Qualitätstests und Live-Anbindung sind **NICHT GETESTET**. Keine produktiven Änderungen.

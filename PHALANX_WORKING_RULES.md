# NEXUS PHALANX — verbindliche Arbeitsregeln

Stand: 2026-10-15. Geltungsbereich: Entwicklung, Integration, Tests und Releasevorbereitung von NEXUS PHALANX. Diese Datei dokumentiert die vom Projektinhaber bestätigte Arbeitsweise; sie ändert keine produktive Anwendung.

## Arbeitsmodus
- **Go:** Nächsten sinnvollen, unmittelbar ausführbaren Projektschritt eigenständig durchführen.
- **Autopilot:** Zusammenhängende, ohne Nutzerentscheidung mögliche Schritte durchführen; keine unbeaufsichtigte Hintergrundausführung behaupten.
- **Check:** Prüfen, keine Änderungen vornehmen.
- **Fix:** Ursache analysieren, gezielt beheben, Auswirkungen prüfen.
- **Freeze:** Freigegebenen Stand mit Quelle, Datum, Hash und Umfang sichern; keine stillschweigende Änderung.
- **Status:** Nur nachweisbare Fortschritte, offene Aufgaben, Blocker und nächsten Schritt berichten.

## Verbindlicher Entwicklungsablauf
1. Vor jeder Änderung GitHub, relevante Projektdateien, vorhandene Tests und die letzte freigegebene Version prüfen. Gesprächsnotizen sind keine verlässliche Ersatzquelle für aktuellen Code.
2. Funktionsinventar berücksichtigen: Command Center, Player/Kingdom/Opponent/Threat Intelligence, Alliance Intelligence, KvK Command/Battle Readiness, Hero Intelligence, Smart March/Joiner/Team Optimizer, Troop Ratio/Combat/Monte Carlo, Outpost Intelligence, Transfer Scouting, Reports/Operations, Daten/Accounts/MightPulse/Supabase, PWA/Security/Backup.
3. Funktionierende Features und freigegebene Designs schützen. Keine neuen Header, Kacheln, Menüs oder Layout-Neuinterpretationen ohne Freigabe.
4. Ursachen statt Symptome beheben. Vorher und nachher abhängige Navigation, Datenverträge, Berechtigungen, Darstellung und Fehlerfälle prüfen.
5. Isolierten Branch/Preview verwenden. **Keine Änderungen an produktiver App, produktiver Datenbank, RLS, Secrets oder Deployment ohne ausdrückliche Freigabe.**
6. Vorhandene technische Tests selbst ausführen, wenn Werkzeuge verfügbar sind. Nur für echte Geräte-/Nutzertests, fehlende Berechtigungen oder Entscheidungen nachfragen.
7. Mehrere zusammenhängende Korrekturen bündeln; keine unnötige Abfolge kleinster Android-Tests. Trotzdem keine ungetesteten Änderungen als bestätigt ausgeben.
8. Zwischen **geplant**, **implementiert**, **automatisiert getestet**, **auf Android bestätigt** und **produktiv freigegeben** unterscheiden. Aussagekräftige Belege nennen.
9. Bei unsicherer Datenqualität Quellen, Erfassungszeit und Coverage anzeigen. Fehlender Top-100-Eintrag ist nicht Null; kein unbelegter Combat- oder Threat-Score.
10. Keine Zugangsdaten, API-Keys, Tokens oder privaten Accountdaten ins Repository committen.

## Schutzreferenzen
- HOME-Design: `docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md`; Original `NEXUS_PHALANX_HOME_ORIGINAL_2026-10-11.html` in der Projektbibliothek.
- Alpha35-Funktions-FREEZE: `docs/freezes/NEXUS-PHALANX-ALPHA35-FUNCTION-FREEZE-2026-10-13.md`; Original `NEXUS_PHALANX_ALPHA35_FUNCTION_FROZEN.html` in der Projektbibliothek.
- Outpost-FREEZE: `docs/freezes/NEXUS-PHALANX-OUTPOST-MAP-ALPHA23-FREEZE-2026-10-13.md`.
- KvK-Intelligence-Layout: `docs/KVK_INTELLIGENCE_LAYOUT_FREEZE_2026-10-03.md`.
- Gesamtinventar: `docs/PHALANX_INTEGRATION_FUNCTION_PRESERVATION_INVENTORY_2026-10-15.md`.
- RC1-Gates: `docs/PHALANX_RC1_ENTRYPOINT_AND_FREEZE_GATE_2026-10-15.md`.
- Release-Baseline: `docs/PHALANX-STATUS-QUO-RELEASE-BASELINE-2026-10-14.md`.

## Ziel
Eine stabile, vollständig integrierte, mobil nutzbare NEXUS-PHALANX-App mit nachvollziehbaren Daten, minimalen Betriebskosten und ohne Funktions- oder Designverlust. Release nur nach End-to-End- und Sicherheitsprüfung sowie ausdrücklicher Freigabe.

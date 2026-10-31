# PHX Transfer Scouting — Feldherkunft und Lückenprüfung (31.10.2026)

Status: DIAGNOSE / KEINE FREIGABE. Nur Quellcode- und Schema-Prüfung; kein Live-API-Payload gelesen.

## Nachgewiesene Datenwege
- Player-ID-Bridge `phalanx-transfer-id-bridge-stage-20261030`: prüft Governor-ID, UID und Kingdom; übernimmt eine begrenzte Feldauswahl aus der Mighty-Pulse-Player-Antwort, Arena-Helden und ausgewählte Ranking-Boards. Kingdom-Boards enthalten nur maximal 100 Einträge. Nicht gelistet bedeutet weder Rang 0 noch keine Spielerdaten.
- `preview/transfer-id-candidate-20261030.js`: schreibt Live-Lookup unter `metadata.external_lookup`; keine Übertragung auf `metadata.mystic_trials`.
- `preview/transfer-scouting-id-stage-20261030.js`: sechs Trial-Stufen werden aus `metadata.mystic_trials` gelesen. Frühere Machtwerte und Trial-Snapshots werden als feste Platzhalter ausgegeben. Die große Power-Kennzahl basiert auf gespeichertem `power_m`, nicht bevorzugt auf dem neuesten Live-Wert.
- `phalanx-transfer-intelligence-stage-20261031`: erzeugt Kingdom-#1885-Index aus verfügbaren Top-100-Ranking-Boards; kein vollständiger Kingdom-Zensus. Rankings sind keine Trial-Stufen.

## Vorhandene Datenstrukturen (Supabase list_tables, read-only)
- `transfer_candidates`: 1 Zeile, RLS aktiv.
- `kvk_roster_history`: 388 Zeilen, `player_id` und `identity_status`, RLS aktiv.
- `mystic_trial_observations`: 84 Zeilen, sechs Stage-Felder, aber keine `player_id`, RLS aktiv.
- `mystic_trial_power_references`: 8 Zeilen, RLS aktiv.
- `phalanx_mightpulse_rank_snapshots`: 3440 Zeilen, RLS aktiv.

## Nicht nachgewiesen / Pflichtprüfungen
1. Vollständiges Schema eines authentifizierten, datenschutzgerecht redigierten Live-API-Payloads einschließlich Typ, Nullwert, Quelle und Erfassungszeit je Feld.
2. Aktuelle Zeitstempel und Coverage aller 24 gewünschten Boards; tatsächlich verfügbar ≠ in Allowlist enthalten.
3. ID-sichere Verbindung zwischen historischen namensbasierten Mystic-Trial-Daten und Governor-ID; keine Namensheuristik.
4. Vergleich mit allen Kingdom-1885-Spielern: Quelle für Vollzensus noch nicht nachgewiesen.
5. End-to-End-Tests von Auth, CORS, Mobilansicht, Datenintegrität, Live-Wert vs. gespeichertem Wert, Zeit-/Zahlenformat und Regression.

## Schutzentscheidung
Keine Kacheln ausblenden, bevor Ursachen und Datenverfügbarkeit geklärt sind. Kompakte Vorschau vom 31.10. nicht freigegeben. Keine Änderungen an True Power V6, FREEZEs, RLS, Daten oder produktiver App. SQL-Aggregationsabfragen waren von Sicherheitschecks blockiert; keine Ersatzannahmen. 

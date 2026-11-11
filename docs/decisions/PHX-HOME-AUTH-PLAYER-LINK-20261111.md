# PHALANX HOME R15 – Auth ↔ Kingshot-Spielerprofil (2026-11-11)

## Bestätigte Identität
- Der Projektverantwortliche hat im Gespräch ausdrücklich bestätigt: Kingshot-Spieler-ID **291410048** gehört zum bestehenden PHALANX-Account mit Anzeigename **FaQu**.
- Auth-Account-UUID (read-only in Supabase geprüft): `d4da222e-8aac-4950-a6df-46c88972458c`.
- Bestehende PHALANX-Mitgliedschaft: `admin`, `active=true`; E-Mail-Bestätigung vorhanden. **Nicht ändern**.
- `nexus_access_requests` enthält für dieses Konto **keine** zugeordnete genehmigte Anfrage. Bestehende Test-/Altanfragen sind keine Identitätsnachweise.

## Datenbeleg und Frische
- `public.phalanx_alliance_players`, `player_id=291410048`: Snapshot **2026-10-13**, Name FaQu, Kingdom 1885, Allianz NXS, Allianzrang R4, `tg_level=TG 4`, Quelle MightPulse CSV.
- Allianz und Rang sind **historische Snapshot-Werte**, nicht ungeprüft als aktuell anzeigen.
- TG-Level **nicht** als Spielerlevel ausgeben. Tatsächliches Spielerlevel aus geeigneter verifizierter Quelle separat ermitteln; sonst klar als unbekannt markieren.

## Sichere Zielintegration (noch nicht umgesetzt)
1. Nur vorhandenes Supabase Auth und gültige Sitzung verwenden; keine zweite Registrierung und keine Rollenvergabe über Spieler-ID.
2. Autorisierte, serverseitig geschützte Zuordnung `auth.users.id → player_id` vorsehen, RLS/Autorisierung prüfen und bestehende Daten erhalten. Die Bestätigung im Gespräch ersetzt **keine** sichere technische Zuordnung in der Datenbank.
3. HOME-Felder `phx-r10-name`, `phx-r10-sub`, `phx-r11-kingdom`, `phx-r11-alliance` und Avatar `phx-r10-photo` in der existierenden HOME R15 verwenden, Design-FREEZEs unverändert lassen. Allianzrang nur als separat validiertes Feld integrieren.
4. Bestehenden War-Room-Button `phx-r8-war-entry` und Profilbild-Navigation erhalten und browserseitig testen.
5. PYLON IX erhält Quellen-, Datenfrische-, Funktions- und Testbezüge; keine behauptete automatische Synchronisation.

## Prüfstand
- BESTANDEN: Auth-Account vorhanden, E-Mail bestätigt, aktive admin-Mitgliedschaft; historischer Spielerdatensatz zu bestätigter Spieler-ID vorhanden; R15-HOME-Elemente im Quellcode gefunden.
- NICHT GETESTET: sichere persistente Account↔Spieler-ID-Verknüpfung; aktuelle Live-Spielerdaten; echte Login→HOME→War-Room-Navigation; Mobil- und Regressionstests.
- NICHT DURCHGEFÜHRT: Datenbankmigration, produktive Änderungen, Backup/Restore-Test, Deployment.
- Änderungsumfang dieser Entscheidung: **nur Dokumentation im isolierten GitHub-Branch**.

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

## Quellcode- und Build-Nachprüfung (2026-11-11)
- Der reale Einstieg wird aus `preview/phalanx-home-r13/build.cjs` bzw. `build-hybrid.cjs` und einer **externen** geprüften R12-HTML-Quelldatei erzeugt. `preview/phalanx-home-r13/index.html` ist **kein** Quellpfad.
- Die R12-Originaldatei `PHALANX_HOME_R12_TEST.html` wurde in der Projektbibliothek gefunden und als Arbeitskopie materialisiert; **SHA-256 `ace5c9dd54e685e378b350b9d462ec756ce05abd231fae3b66ed35df6eaa0c42` verifiziert**.
- R12-Quelltext enthält lokale Browserprofil-Logik (`localStorage`), jedoch **keine** direkte `supabase.auth`- oder `createClient`-Integration. Das HOME ist daher noch nicht mit einer echten Supabase-Login-Sitzung verbunden.
- Der isolierte Adapter `home-profile-auth-stage.js` ist noch nicht in den Build eingebunden und wird nicht ausgeführt. Sein bestehendes Staging-API setzt einen authentifizierten Supabase-Client voraus; **nicht** durch eine neue parallele Authentifizierung ersetzen.
- Vercel-Projekt `phalanx-r11-atlas-preview` vorhanden; zuletzt beobachtete Preview READY bedeutet **keinen** erfolgreichen Login-/HOME-Funktionstest.
- Nächster Schritt: den **tatsächlichen** Login-Einstieg der vorhandenen App ermitteln und sicheren Auth-Session-Übergang zur bestehenden HOME-Build-Ausgabe spezifizieren; erst danach isoliert verdrahten, testen und deployen. Keine produktive Migration ohne eigene Freigabe.

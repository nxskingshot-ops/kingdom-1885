# NEXUS PHALANX – HOME R15 Wiederherstellungspunkt & Chatübergabe

**Stand:** 2026-11-11 · **Projekt:** Kingshot #1885 · **Status:** QUELLSTAND GESICHERT / RESTORE NICHT GETESTET

## Wiederaufnahme im neuen Chat
„Setze NEXUS PHALANX HOME R15 anhand von docs/handoffs/PHX-HOME-R15-RESTORE-HANDOFF-20261111.md im Branch backup/phx-home-r15-chat-handoff-20261111 fort. Erst lesen, keine produktiven Änderungen. Ziel: bestehende Supabase-Anmeldung sicher mit bestehendem HOME verbinden; Login→HOME→War Room testen. Design-FREEZEs und Daten schützen.“

## Wiederherstellungspunkt
- Repository: `nxskingshot-ops/kingdom-1885`
- **Sicherungsbranch:** `backup/phx-home-r15-chat-handoff-20261111` (vom isolierten Entwicklungsbranch erstellt).
- **Arbeitsbranch vor Sicherung:** `work/phx-home-hybrid-c-r15-isolated-20261111`.
- Sicherungsumfang: der gesamte zu diesem Zeitpunkt referenzierte Git-Quellstand des Arbeitsbranches einschließlich versionierter Quelltexte, Dokumentation und versionierter Bilddateien. Nicht enthalten sind automatisch: nicht versionierte Dateien, externe Library-Objekte, Supabase-Daten/Storage, Auth-Konten, Cloudflare-/Vercel-Deployments und deren Geheimnisse.
- Geprüft durch GitHub `fetch_file`: `preview/phalanx-home-r13/{build.cjs,build-hybrid.cjs,hero.html,hero.css,hybrid.css,hybrid.js,home-profile-auth-stage.js}`, `docs/decisions/PHX-HOME-AUTH-PLAYER-LINK-20261111.md`, `docs/staging/PHX-HOME-HYBRID-C-R15-REGISTER-20261111.md`.
- **BACKUP ERSTELLT:** Git-Branch. **INTEGRITÄT GEPRÜFT:** diese 9 Einzeldateien auf dem Sicherungsbranch lesbar; vollständiger Repository-/Binärdatei-Vergleich nicht durchgeführt. **WIEDERHERSTELLUNG GETESTET:** NEIN.

## Externe Originaldatei – nicht im Git-Branch
- Library: `PHALANX_HOME_R12_TEST.html` · Library-ID `libfile_cf02c1ab2ad08191b5e6b89786c06a11`.
- Erwartete und in vorheriger Prüfung bestätigte SHA-256: `ace5c9dd54e685e378b350b9d462ec756ce05abd231fae3b66ed35df6eaa0c42`.
- Die Originaldatei ist für `preview/phalanx-home-r13/build.cjs` und `build-hybrid.cjs` erforderlich. Vor Neubau erneut beschaffen und Hash prüfen. **Nicht** durch neue HTML-App ersetzen.
- Originalbild: `preview/phalanx-home-r13/home-header.jpg`; Builder erwartet SHA-256 `9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016`. Die Bilddatei ist versioniert, aber ihr Byte-Hash wurde in dieser Übergaberunde nicht erneut geprüft.

## Auth und Spielerprofil
- Supabase Projekt `hcjrdofkdkasznywvcxo` eu-central-1, bestehendes Supabase Auth beibehalten; **keine zweite Anmeldung**.
- Benutzer hat Kingshot-Spieler-ID **291410048** als zu FaQu gehörig ausdrücklich bestätigt. Existierendes Supabase-Auth-Konto mit bestätigter E-Mail und aktiver App-Mitgliedschaft `admin` read-only nachgewiesen. Keine `nexus_access_requests`-Verknüpfung zu diesem Konto.
- `phalanx_alliance_players`: FaQu / #1885 / NXS / R4 / TG 4, **Snapshot 2026-10-13**; nicht als live ausgeben; TG 4 ist nicht das tatsächliche Spielerlevel.
- `home-profile-auth-stage.js` ist isolierter, **nicht eingebundener** Read-only-Adapter. Feste Client-Zuordnung Account-UUID→Spieler-ID wurde entfernt. Der Adapter benötigt einen autorisierten `resolvePlayerId(user)`-Resolver und einen vorhandenen Supabase-Client.
- R12-HOME speichert Profilinformationen lokal im Browser, ist noch nicht mit der realen Auth-Sitzung verbunden.

## Bestehende FREEZEs und Funktionen
- UNIFIED HEADER V2 FINAL: HOME goldene Augen, Module rot, Funktionen blau.
- Epic Navigation V2 RC5: acht Banner, goldene 3D-Icons.
- HOME: War Room, Command Center, Territory Control, Reports, PYLON IX; Einstellungen; schlanke Navi; Avatar führt in War Room.
- PYLON IX Emblem: rotes Rundschild, goldenes Lambda, Lorbeer, IX; PHALANX WORLD Holz/Stein/Bronze, Rot-Gold.
- Territory Control→Outpost Map 2.0 / Reports→zurück; 74 OP, Filter, Zoom, Vollbild, Quadranten, JSON/CSV-Export schützen.
- App-Rollen Observer/Operator/Administrator/GOD-Mode strikt von Kingshot-Rängen R1–R5 trennen.
- Keine HOME-Ersatz-App, kein überschreiben eingefrorener Module, kein produktiver Merge/DB-Eingriff ohne Freigabe.

## Relevante Verweise
- `preview/phalanx-home-r13/README.md` – R13/R14, Builder und Referenzvorschauen.
- `docs/staging/PHX-HOME-HYBRID-C-R15-REGISTER-20261111.md` – HOME-R15-Register.
- `docs/decisions/PHX-HOME-AUTH-PLAYER-LINK-20261111.md` – Identitäts- und Integrationsprotokoll.
- `docs/decisions/PHX-AUTH-SINGLE-SYSTEM-ADR-20261111.md` – Single-Auth-Vorgabe.
- `docs/decisions/PHX-PYLON-IX-CONTINUITY-ADR-20261111.md` – PYLON-Kontinuität.
- Vercel-Testprojekt `phalanx-r11-atlas-preview`, jüngste beobachtete isolierte Bereitstellung READY; Browser-Funktion nicht nachgewiesen.
- Transfer Scouting getrennt erhalten: `stage/transfer-live-rankings-20261103`; keine Änderungen daran in dieser HOME-Arbeit.

## Offene Schritte
1. Tatsächlichen maßgeblichen Supabase-Login-Einstieg und Session-Übergabe im bestehenden App-Routing ermitteln.
2. Sichere, autorisierte, serverseitig prüfbare Account→Spieler-ID-Zuordnung planen und isoliert integrieren; RLS beachten.
3. Original-R12-Quelle und Bildhash verifizieren, unveränderten R15-Build reproduzieren; Adapter **erst danach** einbinden.
4. Authentifizierten Browser-Test: Login→HOME, Name, Kingdom/Allianz, korrekte Frische/Levelanzeige, Avatar→War Room, Einstellungen und zurück.
5. Mobil-, Rollen-, Datenintegritäts-, Navigation- und Regressionstests; Ergebnisse einzeln protokollieren.
6. Vor produktiver Freigabe DB-Backup-/Restore-Status gesondert nachweisen; keine alten Restore-Tests als aktuellen Beleg verwenden.

## Prüfergebnis
- BESTANDEN: Git-Sicherungsbranch erstellt; 9 Kerntextdateien dort wiedergefunden; R12-Original in Library identifiziert; Account/Spieler-ID vom Nutzer bestätigt.
- NICHT GETESTET: kompletter Restore, alle Bilder/Assets byteweise, Auth→HOME→War Room, Live-Daten, physisches Android.
- NICHT DURCHGEFÜHRT: Supabase-Datenbankbackup, Cloudflare/Vercel-Snapshot, Produktiv-Deployment, Rechte-/Datenänderung.

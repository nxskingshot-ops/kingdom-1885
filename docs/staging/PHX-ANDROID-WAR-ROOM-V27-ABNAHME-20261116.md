# PHALANX War Room V2.7 · Navigation und Live-Daten

Stand 16.11.2026. Isolierter Android-Testbuild, keine Produktionsfreigabe.

## Rückweg aus PYLON IX

In V2.6 setzte der War-Room-Schnellzugriff den Hash direkt auf `#pylon`. Damit umging er den bestehenden Öffner des Dialogs und dessen History-Markierung. Der Schließen-Knopf fiel auf Territory Control zurück.

V2.7 verwendet für PYLON IX den bestehenden Öffner. Die schon vorhandene Dialog-Navigation führt danach zum vorherigen War-Room-Eintrag. Diese Änderung sitzt ausschließlich am konfigurierbaren Schnellzugriff im War Room. Bildvorlage, ursprüngliches HTML, HOME, Territory Control und lokaler Profil- und Shortcut-Speicher sind auf Dateiebene mit V2.6 identisch. Ausgangscommit und Rückweg `f8c3fe15528936a0bc95db36d119109f3e9cda71`. Separates Paket `app.nexusphalanx.stage.v27warroom` mit getrenntem Gerätespeicher. Einstellungen aus V2.6 werden nicht automatisch kopiert.

## Live-Profildaten

Die Untersuchung war lesend. Der vorhandene Transfer-Endpunkt `phalanx-transfer-id-snapshot-fallback-stage-20261031` verlangt eine authentifizierte Sitzung und aktive Mitgliedschaft, nimmt seine Spieler-ID aus einem Suchparameter und meldet unter anderem die Erfassungszeit und Datenfrische. Der CORS-Preflight für den Transfer-Testursprung liefert 204 mit Allow-Origin, der gleiche Preflight für den Android-Ursprung `https://localhost` liefert 403 ohne Allow-Origin. Die Android-Testfassung hat keine Supabase-Anmeldung und keine serverseitige Auflösung des eigenen Spielerprofils. Die vorhandene R15-Profilvorschau ist ein historischer Snapshot-Leser mit vorausgesetztem autorisierten Resolver. Die Tabellensicht bestätigt `app_profiles.user_id` ohne Spieler-ID und eine private Einladungszuordnung mit `approved_user_id` und `player_id`. Die Existenz dieser Spalten beweist keine Zuordnung für alle Bestandskonten.

Voraussetzung für Live-Daten ist eine Android-Sitzung mit serverseitig aufgelöster, geprüfter Bindung an die eigene Spieler-ID. Ein eigener lesender Pfad soll nur das zugeordnete Profil liefern und Erfassungszeit von Abrufzeit unterscheiden. Transfer-Suche und manuelle Profilwerte werden nicht als Identitätsbeleg verwendet. Live-Power, Spieler-ID und letzte Aktualisierung sind in V2.7 weiterhin offen.

## Verifikation

- [Actions-Lauf 43813714741](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43813714741) für Commit `7c1ee449ad7542ed9ec9d1475026d1f63eb66bc5` auf `work/phx-war-room-navigation-v27-20261116`.
- **BESTANDEN (Browser):** PYLON IX aus dem War Room öffnen, per Schließen, Escape und Browser-Zurück zum War Room zurückkehren. Außerdem HOME-Navigation, War-Room-Profil und Schnellzugriffspersistenz, Territory Control, 74 Outposts, Filter, Zoom, Vollbild und Reports-CSV. Keine unbehandelten Browserfehler.
- **NICHT GETESTET (V2.7 auf dem Zielgerät):** Installation und native Zurück-Taste. Die eingereichten Android-Screenshots belegen V2.6.

- **BESTANDEN (APK):** Build, Paketkennung und Signatur. SHA-256 `b037605c6187e2cb8342cc9e8d36ffed577c4592f153ae020b576a9a1cbb4a42`. [APK-Artefakt](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43813714741/artifacts/14202040435) · [Browsernachweis](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43813714741/artifacts/14202010499).

# PHALANX Release 1.0 – Autopilot status

Stand: 2026-10-15

## Verifiziert
- GitHub Actions Lauf #4 erfolgreich (Screenshot des Projektinhabers).
- Isolierte Cloudflare-Seite im Browser erreichbar; Navigation zu KvK Prep V13 lädt eine Anmeldemaske (Screenshots).
- Branch `phalanx-cloudflare-test-deploy` enthält `deploy/phalanx-kvk-test/index.html`, `index-kvk.html` und `kvk-prep-v13.html`.
- `index.html` im Deployment-Verzeichnis ist eine kurze Test-Platzhalterseite, während die Navigation in `index-kvk.html` liegt. Die tatsächliche Zuordnung der veröffentlichten Root-URL muss vor Release geprüft werden.
- `kvk-prep-v13.html` enthält Supabase- und Passwort-Anmeldecode. Authentifizierung und Datenisolation sind noch NICHT sicherheitsgeprüft.

## Release-Gates / Blocker
1. **Sicherheit (Pflicht):** Testanmeldung nicht mit produktiven Credentials durchführen, bevor Datenzugriff, Auth und Rollen geprüft sind.
2. **Design (Pflicht):** Freigegebene Epic Navigation V2 statt isolierter Navigation V1; keine Neuinterpretation.
3. **Funktion (Pflicht):** Module, Navigation, Auth und Fehlerfälle gegen konkrete Release-1.0-Liste prüfen.
4. **Deployment (Pflicht):** Reproduzierbare Tests und überprüfte Ziel-URL; Produktionsdeployment erst nach ausdrücklicher Freigabe.

## Später
- Erweiterungen, Zukunftsmodule und optische Verbesserungen außerhalb der freigegebenen Pflichtfunktionen.

## Schutzregeln
- Kein Merge, kein Produktionsdeployment, keine Änderung produktiver Daten, Rollen, Secrets oder FREEZEs ohne Freigabe.
- Änderungen nur isoliert und reversibel.

## Nächste Arbeit
- Read-only-Sicherheitsaudit für Supabase und KvK-Auth.
- Test-Deploy-Root/Navigation vergleichen.
- Bestehende Test- und CI-Workflows wiederverwenden, nicht duplizieren.

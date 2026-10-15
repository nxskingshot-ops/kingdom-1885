# PHALANX KvK V13 – Read-only Auth Audit

Stand: 2026-10-15. Keine produktiven Änderungen.

## Quellcode-Befunde
- Untersuchte Datei: `deploy/phalanx-kvk-test/kvk-prep-v13.html` auf Branch `phalanx-cloudflare-test-deploy`.
- Das Modul lädt `@supabase/supabase-js@2` und initialisiert einen Client mit einem Publishable Key.
- Der Client verbindet sich mit dem bestehenden Supabase-Projekt `hcjrdofkdkasznywvcxo`. **Keine isolierte Testdatenbank nachgewiesen.**
- Im Code vorhanden: `signInWithPassword`, `getSession`, persistente Session, Mitgliedschaftsprüfung über `nxs_memberships`, anschließende Lesezugriffe auf KvK-Tabellen.
- Mitgliedschaftsprüfung im Browser ersetzt keine serverseitigen Zugriffspolicies.

## Datenbank-Befunde
- Read-only-SQL: 23 von 23 öffentlichen Tabellen mit aktivierter RLS.
- Acht Tabellen haben keine Policies; daraus folgt nicht automatisch ein Datenleck.
- Die Detailabfrage der Policies wurde durch einen Werkzeugsicherheitscheck blockiert. **Nicht erneut umgangen.**

## Deployment-Konsistenz
- `deploy/phalanx-kvk-test/index.html` enthält nur eine statische Platzhalterseite.
- `deploy/phalanx-kvk-test/index-kvk.html` enthält die isolierte Navigation V1.
- Nutzer-Screenshot zeigt Navigation auf der Cloudflare-Testdomain. Das stimmt nicht eindeutig mit der aktuellen Root-Datei des untersuchten Branches überein; mögliche Deployment-/Cache-/Routing-Unterschiede sind **ungeklärt**. Keine Root-Datei blind ersetzen.

## Release-Blocker
1. Zugriff mit anonymem Nutzer, nicht freigegebenem Mitglied und freigegebenem Mitglied serverseitig prüfen.
2. Öffentliche Testdomain und produktive Auth-/Datenbanknutzung sauber trennen oder explizit sicherheitstechnisch freigeben.
3. Tatsächliche Cloudflare-Deployment-Version/Branch/URL gegen GitHub-Dateien abgleichen.
4. Freigegebene Navigation V2 und Pflichtmodule ohne FREEZE-Änderung integrieren und testen.

## Sicherheitsregel
Keine echten Zugangsdaten im Test eingeben, bis Authentifizierung und Zugriff serverseitig verifiziert sind. Kein Merge nach main, kein produktiver Deploy, keine Secrets-, RLS- oder Datenänderung ohne ausdrückliche Freigabe.

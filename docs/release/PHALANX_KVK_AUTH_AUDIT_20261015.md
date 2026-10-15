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

## Ergänzende statische Prüfung – V2-Testkopie (2026-10-15)
- Geprüft: `deploy/phalanx-kvk-test/kvk-prep-v13-epic-v2-test.html` (ohne Anmeldung, ohne Datenbankmutation).
- `membership()` prüft im Browser `active===true`, Rollen `member/r4/r5/admin` und `expires_at` gegen die aktuelle Zeit; der API-Aufruf verwendet den Session-Bearer-Token. Das ist **nur clientseitige UI-Zugangskontrolle**, kein Nachweis serverseitiger Autorisierung.
- `load()` fragt die bestehenden Tabellen `kvk_snapshots`, `kvk_player_changes` und `kvk_roster_history` direkt über Supabase ab. RLS-Policies auf **jeder** dieser Tabellen müssen die beabsichtigten Rollen und Datensätze serverseitig begrenzen; andernfalls kann ein Client die UI-Prüfung umgehen und die API direkt ansprechen.
- Supabase Auth verwendet `persistSession:true` und `autoRefreshToken:true`: Sessions können im Browser gespeichert bleiben. Der isolierte Frontend-Branch verwendet weiterhin das bestehende Backend; daher **keine echten Logins im öffentlichen Test** bis zur gesonderten Freigabe.
- Statischer Code-Review ersetzt keinen RLS-Test mit getrennten anonymen, nicht autorisierten und autorisierten Testidentitäten. Keine solche Prüfung behauptet oder durchgeführt.
- Empfohlene sichere nächste Stufe: ausschließlich Metadaten-/Policy-Review mit explizit erlaubten Read-only-Werkzeugen, anschließend getrennte Testidentitäten und Backend-Isolation vor Freigabe. Keine Änderungen an RLS, Secrets oder Produktion ohne Freigabe.

## Supabase Security Advisors – read-only, 2026-10-15
- Projekt `hcjrdofkdkasznywvcxo`: `list_tables(public)` bestätigt RLS aktiv auf **23/23** Tabellen, darunter `nxs_memberships`, `kvk_snapshots`, `kvk_player_changes`, `kvk_roster_history`. Aktivierte RLS allein bestätigt **nicht** korrekte Policies.
- Security Advisor meldet **8 INFO** (`rls_enabled_no_policy`) für: `mystic_trial_categories`, `mystic_trial_observations`, `mystic_trial_power_references`, `nxs_audit_log`, `nxs_guest_access_config`, `phalanx_mightpulse_poll_runs`, `phalanx_mightpulse_rank_snapshots`, `public_outposts_backup_20261002`. Fehlende Policies bei aktivierter RLS verweigern gewöhnlich Client-Zugriff, sind nicht automatisch Datenlecks.
- **2 WARN**: `public.phalanx_can_read_alliances()` ist `SECURITY DEFINER` und für `anon` sowie `authenticated` ausführbar. Das ist eine potenzielle Berechtigungsoberfläche, nicht automatisch ein nachgewiesener Datenabfluss. Funktion und Aufrufkontext vor Änderung prüfen. Supabase-Hinweise: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable und https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- **1 WARN**: Leaked Password Protection ist deaktiviert. Hinweis: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- `list_branches` meldet **keine Supabase-Entwicklungsbranches**; Cloudflare/GitHub-Isolation bedeutet keine Backend-Isolation.
- **Release-Gate bleibt rot** für reale Login-Tests: RLS-Policy-Detail und Autorisierungs-Matrix nicht verifiziert. Keine Produktivänderungen vorgenommen.

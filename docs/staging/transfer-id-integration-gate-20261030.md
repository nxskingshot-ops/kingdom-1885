# PHALANX Transfer ID – Integrationsfreigabe (Stand 2026-10-30)

## Geschützter Bestand
- Original: preview/transfer-scouting-live-v5.html / .js – nicht überschreiben.
- Branch: stage/transfer-id-lookup-20261030 – keine Produktionsfreigabe.
- Supabase V4: phalanx-player-id-read-test-20261030 – unverändert.

## Nachgewiesen
- GitHub-Branch und additive Dateien vorhanden.
- Mitgliedschaftsspalten user_id, role, active, expires_at per read-only SQL geprüft.
- Private Quota-Tabelle + privilegierte RPC ausschließlich als SQL-Entwurf vorhanden.
- Bridge-Quellcode prüft JWT, Mitgliedschaft, Kontingent vor externem Abruf; Browser-Origin ist ausdrücklich gesperrt.

## Offene technische Blockaden
1. Keine ausgeführte Quota-Migration und kein Restore-Test dieser neuen Struktur.
2. Keine ausgeführte Bridge-Deployment-Prüfung; keine echte Live-Auth- oder API-Probe.
3. Browser-Origin-Sperre verhindert derzeit die Nutzung der UI; erst nach Quota-RPC-Live-Test durch eng begrenzte CORS-Allowlist ersetzen.
4. Browser-UI hat noch leere Bridge-URL.
5. Mobile Navigation, Login, bestehende Candidate-CRUD, Vergleich, CSV, Arena und Ranks nicht end-to-end getestet.
6. Vor Datenbankänderung aktuelle Sicherung, Berechtigungen und Rollback überprüfen und Freigabe einholen.

## Freigabekriterium
Nur nach dokumentierten Sicherheitstests, Auth-/Role-Negativtests, Quota-Parallelitätstest, API-Feldprüfung und Browser-Regressionen. Kein Merge/Produktion ohne ausdrückliche Zustimmung.

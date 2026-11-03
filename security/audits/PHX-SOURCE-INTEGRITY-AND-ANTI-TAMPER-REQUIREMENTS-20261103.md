# PHALANX – Quellcode-Vertraulichkeit und Manipulationsschutz

Status: VERBINDLICHE ANFORDERUNG, NICHT ALS IMPLEMENTIERT ODER GETESTET FREIGEGEBEN.

## Schutzumfang
- Nichtöffentliche Quellen, Repository-Inhalte, Servercode, Projektunterlagen und Zugangsdaten dürfen nicht unberechtigt offengelegt werden. Keine Geheimnisse in Client-Bundles oder öffentlichen Logs.
- Nur ausdrücklich autorisierte Entwickler dürfen Code, CI/CD, Konfiguration, Edge Functions, Datenbankschema, Berechtigungen und Deployments ändern.
- R4, R5, Admin und Spielrollen gewähren keine Repository-, Infrastruktur- oder GOD-Mode-Rechte.
- Server muss jede schreibende Aktion authentifizieren, autorisieren und revisionssicher protokollieren. Clientseitige Prüfungen allein sind nicht ausreichend.
- Eigentümerrechte werden an die geschützte Auth-Identität gebunden, nicht an eine Spiel-ID. Keine Rollen- oder Kontenübernahme durch manipulierte Anträge.
- Schutz gegen unautorisierte Änderungen an Deployments, Build-Pipeline, Branches, Daten und App-Konfiguration; minimal notwendige Rechte, geschützte Branches, verpflichtende Reviews, secret scanning und verifizierbare Deployments prüfen.
- Manipulierte Clients und API-Aufrufe dürfen keine unberechtigten Serveraktionen bewirken.
- Browserseitig ausgelieferter Code kann technisch eingesehen werden; deshalb keine Zusage vollständiger Frontend-Geheimhaltung.

## Freigabe-Gates
1. Tatsächliche Repository-Sichtbarkeit, Team-/Tokenrechte, Branchschutz und Deployment-Berechtigungen prüfen.
2. Supabase RLS, Grants, Edge Functions und Auth-Rollen prüfen; bekannte access-request-UPDATE-Lücke schließen, erst nach Backup, Rückweg und Abhängigkeitsprüfung.
3. Testmatrix: unautorisierter Lese-/Schreibzugriff, Rolleneskalation, Clientmanipulation, geschützte Eigentümeridentität, Code-/Deployment-Integrität, Auditierung, Regression.
4. Keine produktiven Änderungen oder Kosten ohne bestehende einschlägige Freigabe; keine FREEZEs überschreiben.

Stand 2026-11-03: Anforderung dokumentiert; technische Durchsetzung und End-to-End-Nachweis OFFEN.

# PHALANX – gesamtheitlicher Sicherheits-Schutzumfang

Status: VERBINDLICHE ANFORDERUNG; TECHNISCHE DURCHSETZUNG UND TESTS OFFEN.

Der Schutz gilt unabhängig vom Werkzeug (Menschen, KI, KI-Agenten, Bots, Skripte, Automatisierung) für aktuelle und zukünftige PHALANX-Komponenten.

## Schutzobjekte
- Quellcode, private Repositories, Branches, Git-Historie, CI/CD, Artefakte, Build-Konfiguration.
- Alle Datenbanken, Tabellen, Schemas, Berechtigungen, RLS, Migrationen, Replikate und Datenexporte.
- Datei-/Objektspeicher, Cloudspeicher, Uploads, Bilder, Archive, temporäre Dateien und Caches.
- Backups, Snapshots, Wiederherstellungsdaten, Schlüssel und Wiederherstellungspfade.
- Zugangsdaten, API-Schlüssel, Tokens, Sitzungen, Service-Accounts, Recovery-Codes und Geheimnisse.
- Hosting, Domains, DNS, CDN, Edge Functions, Deployments, Webhooks, APIs, Drittanbieter und Integrationen.
- Nutzeridentitäten, GOD Mode, Rollen, Einladungen, Geräte, Freigaben und administrative Schnittstellen.
- Audit-Logs, Monitoring, Warnungen, Sicherheitskonfiguration, interne Dokumentation und FREEZEs.
- Künftige Module und Dienste automatisch im gleichen Sicherheitsmodell.

## Schutzregeln
1. Keine unberechtigte Einsicht, Änderung, Kopie, Weiterleitung, Löschung, Veröffentlichung oder Übernahme – auch nicht KI-gestützt.
2. Strikte Trennung von Spielrollen und technischen Infrastrukturrechten; Least Privilege, MFA für privilegierte Zugänge, regelmäßige Zugriffsprüfung.
3. Keine Hintertüren, Schattenkonten, stillen Deployments oder ungeprüften Automationen.
4. Schutz gegen Datenexfiltration, Manipulation, Löschung, Sabotage, Rechteeskalation, Prompt-Injection und Missbrauch von Drittanbietern.
5. Schutz der Eigentümeridentität und unabhängiger Recovery-Pfade; keine Aussperrung durch normale Adminrollen.
6. Änderungen mit überprüfbaren Auditspuren; möglichst unveränderliche externe Protokollierung und Alarmierung.
7. Backups getrennt und nachweislich wiederherstellbar; keine produktive Änderung ohne einschlägige Freigabe und Rückweg.
8. Geheimnisse niemals in öffentliche Clients, Logs, Artefakte oder unautorisierte KI-Systeme aufnehmen.
9. Schutzmaßnahmen für Verfügbarkeit: Rate Limits, Ressourcenlimits, Missbrauchserkennung und Incident Response.
10. Sicherheitskontrollen und Abhängigkeiten regelmäßig prüfen; technische Grenzen offen benennen (ausgelieferter Frontendcode bleibt einsehbar; absolute Sicherheit nicht garantierbar).

## Umsetzungsgates
Inventar aller Ressourcen und Berechtigungen; tatsächliche Konfiguration prüfen; Sicherheitslücken priorisieren; isoliert patchen; Rollen-, Integritäts-, Datenzugriffs-, Backup-/Restore- und Regressionstests; dokumentierte Freigabe.

Stand: Nur dokumentiert. Keine produktive Änderung, kein vollständiger Sicherheitsnachweis.

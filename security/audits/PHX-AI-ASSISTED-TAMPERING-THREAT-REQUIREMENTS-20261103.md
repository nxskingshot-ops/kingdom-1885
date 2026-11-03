# PHALANX – Schutz gegen KI-gestützte Manipulation

Status: VERBINDLICHE SICHERHEITSANFORDERUNG; UMSETZUNG UND WIRKSAMKEIT NICHT VERIFIZIERT.

Ergänzung zu PHX-SOURCE-INTEGRITY-AND-ANTI-TAMPER-REQUIREMENTS-20261103.md.

- Das Verbot unberechtigter Quellcode-Einsicht, Änderung, Reverse Engineering mit missbräuchlichem Ziel, Rechteeskalation, Datenmanipulation und Infrastrukturübernahme gilt unabhängig vom verwendeten Werkzeug: auch KI-Assistenten, KI-Agenten, automatisierte Browser, Codegeneratoren, Skripte und externe Dienste.
- Sicherheitsentscheidungen ausschließlich serverseitig; KI-generierte API-Aufrufe, manipulierte Clients oder Prompt-Injection dürfen keine Berechtigungen umgehen.
- Vertrauliche Quellen, Tokens und interne Anweisungen nicht in Client-Bundles, öffentliche Logs oder unautorisierte KI-Dienste übertragen; Geheimnisse serverseitig halten.
- Schutz von GitHub, CI/CD, Deployment, Supabase und Backups durch minimale Rechte, starke Authentifizierung, Branch-/Deployment-Schutz, getrennte Secrets, Auditlogs und kontrollierte Freigaben.
- KI-gestützte Angriffsversuche im autorisierten, isolierten Sicherheits-Testplan berücksichtigen, ohne reale Nutzerkonten oder Daten zu gefährden.
- Keine absolute Sicherheit oder vollständige Geheimhaltung ausgelieferten Frontend-Codes behaupten. Maßgeblich ist, dass unautorisierte Zugriffe und Änderungen auch mit KI-Unterstützung nicht erfolgreich sind.

Produktive Implementierung: OFFEN. End-to-End-Nachweis: NICHT GETESTET. Keine FREEZE- oder Produktionsänderung durch dieses Dokument.

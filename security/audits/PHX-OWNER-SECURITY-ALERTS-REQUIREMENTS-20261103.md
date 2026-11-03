# PHALANX – verpflichtende Sicherheitswarnungen an GOD-Eigentümer

Status: VERBINDLICHE ANFORDERUNG; VERSAND, PUSH UND ERKENNUNG NOCH NICHT IMPLEMENTIERT ODER GETESTET.

Bei verdächtigen oder unberechtigten Aktivitäten an PHALANX-App, Daten, Identitäten, Quellcode, Backups, Infrastruktur, Schnittstellen oder KI-gestützten Zugriffsversuchen ist der geschützte GOD-Eigentümer unverzüglich über Push oder E-Mail zu benachrichtigen; bei kritischen Ereignissen nach Möglichkeit über beide unabhängigen Kanäle.

## Meldeereignisse
- Abgelehnte oder ungewöhnliche GOD-Freigabe-/Datenoffenlegungsanfragen, insbesondere fremde E-Mail-Adressen und Exporte.
- Wiederholte fehlgeschlagene Anmeldungen, Passkey-/GOD-Passwortversuche, Recovery-Vorgänge und auffällige neue Geräte oder Sessions.
- Rollen-/Rechteänderungen, Änderungen an RLS/Grants, API-Schlüsseln, Tokens, Secrets und Eigentümeridentität.
- Ungewöhnliche Datenbankabfragen, Massenauslesung, Datenexporte, unerlaubte Schreib-/Löschvorgänge und Backupzugriffe.
- Änderungen an GitHub, Branchschutz, CI/CD, Deployments, Edge Functions, Hosting, DNS, Webhooks und externen Integrationen.
- Verdacht auf KI-/Bot-Automation, Prompt-Injection oder automatisierten Missbrauch.
- Ausfall/Manipulation der Auditierung, Alarmzustellung oder Sicherheitsüberwachung.

## Technische Vorgaben
- Serverseitige Erkennung; keine alleinige Abhängigkeit vom Browser. Ereignisse manipulationserschwerend und ohne Geheimnisse protokollieren.
- Warnung enthält Zeitpunkt, Kategorie, betroffene Ressource, Risiko, groben Kontext und sichere Handlungsempfehlung; keine Passwörter, Tokens oder fremde E-Mail-Adressen im Nachrichtentext.
- Push und E-Mail an vorher verifizierte, geschützte Eigentümerkanäle; Kanaländerung nur nach starker GOD-Step-up-Freigabe, unabhängig vom normalen Admin.
- Kritische Ereignisse priorisiert, Zustellversuche und Fehler protokolliert, Wiederholversuch und Fallback-Kanal vorgesehen; Deduplizierung und Rate-Limits gegen Alarmfluten.
- Zustellung ist nicht garantiert; Monitoring der Erkennung und Zustellung, Testalarme und Nachweis von Empfang erforderlich.
- Keine externen Versandkosten, Dienste oder produktiven Konfigurationsänderungen ohne gesonderte Freigabe.

## Freigabe-Gates
Inventar der verfügbaren Event- und Push-/E-Mail-Infrastruktur, Schutz des Empfängerkanals, datensparsame Warninhalte, Testereignisse für alle Risikoklassen, Negativ-/Manipulationstests, Zustellnachweis auf Android und E-Mail, Ausfall-/Fallback-Test, Regression.

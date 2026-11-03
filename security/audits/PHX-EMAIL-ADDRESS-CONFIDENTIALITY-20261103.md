# PHALANX – Vertraulichkeit aller E-Mail-Adressen

Status: VERBINDLICHE ANFORDERUNG; NOCH NICHT TECHNISCH VERIFIZIERT.

Alle E-Mail-Adressen von Eigentümer, Mitgliedern, Bewerbern, Administratoren, Support und weiteren Kontakten sind personenbezogene vertrauliche Daten.

- Keine unberechtigte Einsicht oder massenhafte Abfrage über App, APIs, Datenbank, Auth, Logs, Exporte, Dateien, Backups, Analytics, Fehlermeldungen, Benachrichtigungen oder KI-Systeme.
- Jeder Benutzer darf die eigene E-Mail-Adresse für Konto- und Sicherheitsfunktionen sehen. Andere Adressen nur für ausdrücklich berechtigte, erforderliche Zwecke; keine allgemeinen Mitglieder-/R4-/R5-Listen.
- E-Mail-Adressen nicht in öffentlichen Clients, URLs, Quellcode, statischen Bundles, Telemetrie, Debug-Logs oder frei abrufbaren Datenbank-Views veröffentlichen.
- Supabase Auth und public-Tabellen/Views/RPCs, Storage, Edge Functions, service_role-Nutzung, RLS und Grants auf Datenabfluss prüfen. API-Antworten nach dem Prinzip Datenminimierung gestalten; bei Bedarf Maskierung statt Klartext.
- Auch indirekte Offenlegung durch Suchfunktion, Enumeration, Kontoexistenzprüfung, Passwort-Reset-Antworten, E-Mail-Header oder Export verhindern. Einheitliche neutrale Fehlermeldungen und Rate Limits vorsehen.
- Vertrauliche Adressen nicht an unautorisierte externe KI-Tools oder Integrationen übertragen. Aufbewahrung, Löschung und Zugriff nach geltendem Datenschutzkonzept regeln.
- Privilegierte Support-/Owner-Zugriffe mit begrenztem Zweck und nachvollziehbarer Auditierung; Eigentümer-Schutz gilt auch hier.

Freigabe-Gates: Inventar der E-Mail-Felder und Zugriffswege, sichere Sicherung und Rückweg, Berechtigungs- und API-Tests für anonym/member/r4/r5/admin/owner, Negativtests gegen Enumeration/Exporte/Logs, Regression. Keine produktiven Änderungen ohne Freigabe und Nachweis.

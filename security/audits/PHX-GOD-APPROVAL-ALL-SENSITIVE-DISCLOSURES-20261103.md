# PHALANX – GOD-Freigabepflicht für vertrauliche Anfragen

Status: VERBINDLICHE ANFORDERUNG; NOCH NICHT IMPLEMENTIERT ODER GETESTET.

Jede Anfrage Dritter nach personenbezogenen oder vertraulichen Informationen, insbesondere fremden E-Mail-Adressen, sowie nach Quellcode, Datenbankinhalten, Speicherorten, Backups, Konfigurationen, Zugangs- oder Sicherheitsinformationen benötigt vor jeder Offenlegung eine ausdrückliche, einzeln nachvollziehbare GOD-Freigabe.

- Standard: verweigern (deny by default). Weder R4/R5 noch gewöhnliche Administratoren dürfen GOD-Freigaben ersetzen oder selbst erteilen.
- Freigabe ist an Identität, konkreten Antragsteller, Zweck, Datenumfang, Empfänger und kurze Gültigkeit gebunden. Keine pauschalen oder dauerhaft wiederverwendbaren Freigaben.
- GOD-Freigabe verlangt frische starke Authentifizierung gemäß separatem GOD-Passwort- und WebAuthn/biometrischem Schutzkonzept. Server validiert die Freigabe vor Datenzugriff/Export/Weitergabe.
- Auch KI, Bots, Skripte, automatisierte Exporte, API-/RPC-Aufrufe, Backups, Logs, Cloudspeicher und Drittanbieter sind umfasst.
- Jede Anfrage und Entscheidung auditieren, ohne die angefragten Geheimnisse im Log offenzulegen.
- Eigene E-Mail-Adresse und notwendige Konto-Selbstverwaltung bleiben dem jeweiligen authentifizierten Kontoinhaber zugänglich; keine fremde GOD-Freigabe für die Einsicht in eigene Kontodaten. Technisch notwendige Systemverarbeitung ist auf minimale Berechtigung und Zweckbindung zu beschränken.
- Freigabe ersetzt keine datenschutzrechtliche Rechtsgrundlage und erlaubt keine Offenlegung von Passwörtern, geheimen Schlüsseln oder biometrischen Rohdaten.
- Einwilligung/Datenschutzrechte betroffener Personen sowie gesetzliche Pflichten sind gesondert zu beachten.

Umsetzung offen: Inventar der Datenflüsse und Rollen; serverseitiger GOD-Freigabedienst, sichere Auditierung, E-Mail-/Daten-API-Guards, Negativtests gegen Umgehung, Regression und Recovery. Keine produktiven Änderungen durch dieses Dokument.

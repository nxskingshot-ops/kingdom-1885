# PHALANX – Authentifizierungs- und Login-Sicherheitsprotokoll

Status: VERBINDLICHE ANFORDERUNG; IMPLEMENTIERUNG UND VOLLSTÄNDIGKEIT NICHT VERIFIZIERT.

## Umfang
- Erfolgreiche und fehlgeschlagene Logins, MFA-/Passkey-Ereignisse, Sperren, Recovery, Passwort-Resets, Sitzungsbeginn/-ende/-widerruf, neue Geräte, privilegierte GOD-Step-up-Freigaben und Rollenänderungen soweit technisch erfassbar.
- Pro Ereignis: UTC-Zeit, interne Auth-ID falls zuverlässig zuordenbar, Ereignistyp, Ergebnis, begrenzte Geräte-/Browserinformation, pseudonymisierte oder zweckgebunden geschützte IP-Daten, Session-/Request-Korrelations-ID ohne Token, Risikosignal und relevante Ressource.
- Niemals Klartext-Passwörter, Passwort-Hashes, vollständige Tokens, Recovery-Codes, private Schlüssel oder biometrische Rohdaten protokollieren. E-Mail-Adressen nicht in normalen Logs; eigene Kontodaten bleiben für Kontoinhaber zugänglich.
- Fehlversuche dürfen nicht automatisch einer Person zugeordnet werden; keine Kontoexistenz-Leaks durch Meldungen.
- Logs serverseitig erfassen, manipulationserschwerend getrennt sichern, Zugriffe minimieren und auditieren; normale R4/R5/Admins erhalten keine pauschale Einsicht. Drittzugriff nur nach gültiger, zweckgebundener GOD-Freigabe und datenschutzrechtlicher Grundlage.
- Auffällige Ereignisse an GOD-Eigentümer per Push/E-Mail nach separatem Alert-Konzept; Alarm bei Log-Ausfall und Manipulationsverdacht.
- Datenschutz: Zweckbindung, Transparenz, Zugriffskontrolle, Aufbewahrungs-/Löschfristen, Datensparsamkeit, Schutz der IP-Adressen, DSGVO-Rechtsgrundlage prüfen. Keine unbegrenzte Speicherung.
- Tatsächliche Auth-Anbieter-Ereignisse, Logs, Webhooks und Schnittstellen vor Implementierung inventarisieren. Nicht alle Client-Abbrüche oder Geräteattribute sind zuverlässig beobachtbar.

## Tests vor Freigabe
Erfolgreicher/fehlgeschlagener Login, MFA, Recovery, Sessionablauf, Rollenwechsel, Anonymisierung, Logzugriff nach Rollen, Tampering, Alert-Zustellung, Datenschutz-/Aufbewahrungsregeln, Regression. Keine produktive Änderung durch diese Anforderung.

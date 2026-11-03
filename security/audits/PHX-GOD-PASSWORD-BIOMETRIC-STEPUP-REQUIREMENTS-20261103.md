# PHALANX – GOD-Passwort und biometrische Freigabe

Status: VERBINDLICHE ANFORDERUNG; NICHT IMPLEMENTIERT; NICHT GETESTET.

- GOD Mode bleibt an die geschützte Supabase Auth-Eigentümeridentität gebunden und ist unabhängig von Spiel-ID, R4/R5 und gewöhnlichen Adminrollen.
- Zusätzlich zum normalen Login: separates starkes GOD-Passwort sowie gerätegebundene Nutzerverifikation über WebAuthn/Passkey (Biometrie, sofern vom Gerät unterstützt). Für die verbindliche biometrische Nutzung sind tatsächliche Plattformunterstützung und Verifikationsverfahren zu prüfen; WebAuthn userVerification allein garantiert nicht zwingend Biometrie statt Geräte-PIN.
- Kein Speichern von Klartext-Passwörtern oder biometrischen Rohdaten; Passwörter mit geeignetem Passwort-Hashing schützen, Passkey-Öffentlichschlüssel und Credential-Metadaten serverseitig verwalten.
- Server prüft Eigentümeridentität, Passwortfaktor, frische kryptografische WebAuthn-Challenge, Origin/RP-ID und die Bindung der Bestätigung an die konkret angeforderte Aktion. Clientseitige Statusflags sind keine Autorisierung.
- Kritische Aktionen benötigen zeitlich begrenzte, aktionsgebundene Step-up-Freigabe; Replay-, CSRF-, Brute-Force- und Session-Diebstahl-Schutz sowie Rate Limits.
- Registrieren, Entfernen und Ersetzen von Passkeys oder Wiederherstellungsmitteln erfordert gleichwertige starke Autorisierung und Auditierung.
- Wiederherstellung bei Geräteverlust ohne Umgehung durch gewöhnliche Administratoren; unabhängiger sicherer Recovery-Pfad, widerrufbare verlorene Geräte.
- Geschützte Audit-Logs; keine Secrets in Logs oder KI-Dienste. Vor Umsetzung vorhandene Auth-Flows, Berechtigungen, FREEZEs und Backups prüfen; keine produktive Änderung ohne Freigabe.

Tests erforderlich: Eigentümer/nicht-Eigentümer, Passwort falsch, fehlende Biometrie/Passkey, Challenge abgelaufen/wiederholt, falsche Origin/RP-ID, Geräteverlust, Sessionwechsel, kritische Aktionen, Recovery, Android und Regression.

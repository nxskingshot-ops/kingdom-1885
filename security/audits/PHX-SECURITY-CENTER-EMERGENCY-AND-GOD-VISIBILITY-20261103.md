# PHALANX SECURITY CENTER – Schutzumfang und Notfallkonzept

Status: VERBINDLICHE ANFORDERUNGEN UND ENTWURF; NICHT IMPLEMENTIERT ODER END-TO-END-GETESTET.

## Klarstellung der GOD-Datensicht (Nutzerkorrektur)
Der GOD-Eigentümer darf zur rechtmäßigen Sicherheits- und Benutzerverwaltung E-Mail-Adressen, Auth-Benutzer-IDs und Anmeldeereignisse einsehen, mit strenger Step-up-Authentifizierung und Auditierung. Die zuvor formulierte gegenteilige Einschränkung ist verworfen. Passwörter, Passwort-Hashes, Tokens, Recovery-Geheimnisse, private Schlüssel und biometrische Rohdaten bleiben auch im GOD Mode unlesbar. R4/R5/gewöhnliche Admins erhalten keinen pauschalen Zugriff auf fremde Identitätsdaten.

## SECURITY CENTER
- GOD-Übersicht: sicherheitsrelevante Ereignisse, Auth- und Sitzungsprotokolle, Identitätsdaten, Rechte und Status.
- GOD-Verwaltung: Benutzer/Sitzungen sperren, Rollen und Freigaben verwalten, Geräte widerrufen; frische, aktionsgebundene GOD-Freigabe.
- GOD-Sicherheitskern: Änderungen an Schutzregeln, Infrastruktur, Wiederherstellung und Eigentümeridentität nur nach besonders starker Authentifizierung, unabhängigen Kontrollen und Audit.
- Eigentümerwarnungen per verifiziertem Push/E-Mail mit Zustellnachweis und Ausfallüberwachung.

## Incident Response und Notfallsperre
- Standard: auffällige Vorgänge erkennen, protokollieren, Eigentümer alarmieren; missbräuchliche einzelne Sessions, Tokens oder Endpunkte soweit nachweislich sicher begrenzbar temporär drosseln oder sperren.
- Keine automatische globale Abschaltung der App, keine Massen-Sperrung, keine irreversible Löschung und kein Lockout des Eigentümers ohne gesonderte Entscheidung und sichere Wiederherstellung.
- Bei kritischem Vorfall: Schadensbegrenzung, forensische Sicherung, Schutz des Recovery-Kanals, nachvollziehbare Entsperrung und Regression.
- Entscheidung, ob und unter welchen Schwellen automatische globale Sperren überhaupt erlaubt sind, bleibt OFFEN und erfordert ausdrückliche GOD-Freigabe.

## Weitere Gates
- Schutz vor Session-Diebstahl, Geräteverlust, manipulierten Updates, Upload-Schadsoftware, Datenabfluss, Hintertüren und Drittanbieter-Kompromittierung.
- Getrennte, überprüfbare Backups und Restore-Proben, least privilege, MFA, Vier-Augen-Prinzip bei Infrastruktur, Datenschutz-Aufbewahrungsregeln und Löschkonzept.
- Inventar von GitHub/Supabase/Hosting/Storage/Auth/Logs und Abhängigkeiten; Tests für Rollen, Navigation, Daten, Mobilgeräte, Alerts, Backup und Regression.

Keine produktiven Änderungen durch dieses Dokument. Keine Garantie vollständiger Angriffsdetektion.

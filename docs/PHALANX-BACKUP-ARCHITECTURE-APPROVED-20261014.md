# PHALANX — verbindliche Backup-Architektur V1 (2026-10-14)

## Entscheidung
GitHub Actions als geplanter Ausführungsdienst, Backblaze B2 als privater verschlüsselter Offsite-Speicher. Kostenlos solange aktuelle Freikontingente eingehalten werden; keine Garantie auf dauerhaft unveränderte Konditionen.

## Sicherheitsgrenzen
- Bestehenden GitHub-Tages-Tag-Workflow beibehalten. Er sichert nur Git-Quellcode.
- Neue Datenbank-Backups getrennt, in privatem B2-Bucket; niemals Datenbank-Dumps, Secrets oder unverschlüsselte temporäre Artefakte ins Git-Repository committen.
- Backup-Schlüssel, Datenbank-Verbindungsdaten und B2-Anwendungsschlüssel ausschließlich als GitHub Actions Secrets mit geringstmöglichen Rechten.
- Sicherungsprozess mit kompatibler PostgreSQL-Client-Version und pg_dump/Supabase CLI; AES-256 oder age-Verschlüsselung vor Upload.
- Export und Restore von PostgreSQL-Daten getrennt von Supabase Storage-Objekten, Edge-Function-Quellcode, Secrets und ggf. Auth/rollenbezogenen Bestandteilen planen.
- Restore-Test nur in isolierter Umgebung, niemals auf Produktion.

## Zielbetrieb (noch NICHT aktiviert)
- Tägliche verschlüsselte Datenbanksicherung, mit 7 Tages- und 4 Wochenständen (Retention nach tatsächlicher Größe/Kosten anpassen).
- Integritätsprüfung: Hash + Entschlüsselbarkeit + monatlicher Restore-Test.
- Alarm bei Fehlern und Kontingentgrenze (z.B. 8 GiB), keine stillen Fehler.
- Kein automatisches Aktivieren vor erfolgreichem manuellen Probelauf und Nutzerfreigabe.

## Noch vom Nutzer erforderlich
1. Backblaze B2-Konto und privaten Bucket anlegen; Bucketname und Region mitteilen (keine Zugangsdaten im Chat).
2. B2-Anwendungsschlüssel nur mit Schreib-/Lese-/Listenberechtigungen für den Backup-Bucket anlegen und als GitHub Secrets eintragen.
3. Geeignete Supabase-Datenbank-Verbindung und Backup-Zugangsdaten sicher als GitHub Secrets eintragen.
4. Sicheren Verschlüsselungsschlüssel erstellen, separat aufbewahren und als GitHub Secret konfigurieren.

## Umsetzungsschritte
1. GitHub Actions Workflow zunächst ausschließlich manuell ausführbar vorbereiten; keine Secrets im Code.
2. Prüfen, ob GitHub-hosted Runner den Datenbank-Endpunkt erreichen kann.
3. Verschlüsselten Probeexport in B2 ablegen und Download/Restore isoliert testen.
4. Erst nach Nachweis der Wiederherstellbarkeit den täglichen Zeitplan einschalten.

## Status
ARCHITECTURE_APPROVED; BACKUP_NOT_CONFIGURED; NO_BACKUP_CREATED; NO_RESTORE_TESTED; NO_PRODUCTION_CHANGE.

Quellen: https://www.backblaze.com/cloud-storage/pricing ; https://supabase.com/docs/guides/platform/backups ; https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
# PHALANX Restore — Abhängigkeitsanalyse 2026-10-19

Status: **BLOCKED; NOT RESTORE_VERIFIED**.

## Nachweis
- Erfolgreich: pinned supabase/postgres 17.6 image, isolated container, B2 encrypted archive download/verification/decryption.
- Fehlgeschlagen: `pg_restore --schema=public`, klassifiziert als `SCHEMA_OR_OBJECT_MISSING`, Phase `TABLE`; full restore previously `OTHER_SQL_ERROR`.
- Inventar aus lesender Supabase-Abfrage: 23 Tabellen im Schema public, alle 23 mit aktiviertem RLS.
- Lesende Prüfung: **5** Foreign Keys von public-Tabellen nach **auth**. Der konkrete fehlende Objekttyp/Objektname aus dem letzten Restore ist noch nicht nachgewiesen; FK-Abhängigkeit ist ein gesicherter zusätzlicher Befund, nicht bewiesene Ursache des aktuellen TABLE-Fehlers.

## Nächste Schritte
1. Kein weiterer unveränderter Testlauf. Keine spontane Produktionseingriffe.
2. Archiv-Toc/pg_restore-Fehler *innerhalb des ephemeral runners* datenschutzgerecht nach SQLSTATE bzw. per lokaler Objektklassifizierung untersuchen; nur generische Ergebnisse veröffentlichen.
3. Eine explizite, vorgelagerte Abhängigkeitsphase für relevante auth-/extensions-Objekte definieren. Validiere zuerst nur Struktur und Rechte, dann isolierte Daten-Wiederherstellung.
4. Öffentliche Tabellenzahl, RLS, FK-Integrität und exemplarische Datenkonsistenz kontrollieren. Teil-Restore bleibt PARTIAL bis alle relevanten Datenobjekte geprüft sind.
5. Full Supabase Recovery bleibt separat offen (Auth-Konfiguration, Storage-Objekte, Edge-Laufzeit, Secrets).

Die CI-Tests und deren Erfolgsmeldungen dürfen nie als Full-Restore gewertet werden.

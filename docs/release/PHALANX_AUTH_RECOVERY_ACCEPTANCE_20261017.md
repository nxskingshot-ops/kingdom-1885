# PHALANX Passwort-Wiederherstellung – Abnahme 2026-10-17

## Funktionale Abnahme durch Nutzer
- Neuer Wiederherstellungslink per E-Mail angefordert und geöffnet.
- Recovery-Link wurde vom veröffentlichten Formular bestätigt.
- Versuch, das bisherige Passwort erneut zu setzen, wurde serverseitig mit `New password should be different from the old password` zurückgewiesen.
- Neues Passwort anschließend erfolgreich gespeichert; Oberfläche meldete `Passwort geändert. Bitte erneut anmelden.`
- Nutzer bestätigte danach ausdrücklich, dass die Anmeldung mit dem neuen Passwort geklappt hat.
- Ergebnis: **Funktionaler Passwort-Reset im getesteten Preview-Ablauf akzeptiert.** Keine weitere Reset-Testschleife nötig.

## Nicht releasekritische To-dos
- **AUTH-UI-001:** Sichtbarkeit des neuen Passworts per Schalter ein-/ausschalten.
- **AUTH-UI-002:** Zweites Eingabefeld `Passwort bestätigen`, clientseitige Gleichheitsprüfung vor Absenden.
- Priorität niedrig; kein Release-Blocker. Nutzer hat ausdrücklich entschieden, beide Verbesserungen auf die To-do-Liste zu verschieben.
- Funktionierenden Recovery-Ablauf bis zu einer gesonderten Änderungsfreigabe unverändert lassen.

## Abgrenzung
- Dies ist eine dokumentierte **Funktionsabnahme durch Nutzer-Screenshots und Login-Bestätigung**, keine Bestätigung einer produktiven Integration oder eines Security-Audits.
- Offene RLS-/Autorisierungs-, Backup-/Restore- und Deployment-Paritäts-Gates aus `PHALANX_KVK_AUTH_AUDIT_20261015.md` und `PHALANX_BACKUP_RELEASE_GATE_20261016.md` bleiben bestehen.
- Kein Merge auf `main`, keine Änderung an Produktion, Supabase, FREEZE-Designs oder Cloudflare.

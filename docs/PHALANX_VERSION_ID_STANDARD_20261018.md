# PHALANX – sichtbarer Versions-ID-Standard (Entwurf, 2026-10-18)

Status: Verbindliche Arbeitskonvention für neue isolierte Alpha-Änderungen; KEINE rückwirkende Umbenennung, KEINE Release-Freigabe.

## Format
- Modul: `MOD-NNN · BMMM`, z. B. `OUT-024 · B003`.
- Gesamtapp: `PHX-A001 · B003`.
- Modul-Kürzel: `OUT` Outpost, `CMD` Command Center, `KVK` KvK, `BRD` Battle Readiness, `TRF` Transfer, `HER` Hero, `NAV` Navigation, `HOM` Home, `PYL` PYLON IX.
- `NNN` = fachlicher Modulstand, nur mit überprüfter Zuordnung zu Quelle/FREEZE. `MMM` = fortlaufende Buildnummer pro Modulstand. `A001` = registrierte Gesamtapp-Konfiguration, nicht das Alter des Repositories.
- Kennungen sind nur dann vergeben, wenn sie im Register stehen. Ein Beispiel ist **keine** nachträgliche Behauptung über einen bestehenden Build.

## Immer sichtbar
- Im Modulheader: `OUT-024 · B003 | TEST`; beim Antippen/Kopieren der ID technische Details anzeigen.
- In der Testapp: `PHX-A001 · B003` sowie Liste der enthaltenen Modul-IDs.
- In Screenshots, Prüfberichten, GitHub-Commit und Deployment-Beschreibung dieselbe Kennung.
- Nicht das eingefrorene Design verändern: Kennzeichnung zuerst nur in neuen isolierten Testhüllen, für FREEZE-UI separat freigeben.

## Eindeutigkeit und Nachvollziehbarkeit
Zu jeder vergebenen ID speichern: Modul, lesbarer Titel, Originaldatei, SHA-256, Git-Commit, Branch, Build-/Deploy-URL, Datum (UTC), Freigabestatus, Referenz-Screenshot, abhängige Modul-IDs und Änderung zur Vorgängerversion. ID nie recyceln.
- `REF`: visuelle Referenz bestätigt; `SRC`: Quelldatei verifiziert; `INT`: integriert; `TST`: gezielt geprüft; `REL`: separat freigegeben; `BLOCKED`: Zuordnung unklar.
- Grün bei GitHub Actions = Buildprüfung, nicht Designfreigabe.
- Bei Konflikt zwischen Dateiname, Code, Referenzbild und Register: fail closed, keine stille Auswahl.

## Aktueller Outpost-Fall
- `OUT-024`: nur **Referenz-ID** für vom Nutzer gezeigte Alpha24-Screenshots. **Keine** verifizierte Quelldatei, **kein** belegter Build `B003`; Status `REF / BLOCKED`.
- `OUT-023`: historischer Alpha23-Snapshot (SHA-256 `e8109617ef6d4578f4bfd7ca3a519bceedbae0850b432e6f27e24ef2d82fe0b0`), nicht aktuelle gewünschte Karte.
- Der bestehende Android-Testbuild darf **nicht** als `OUT-024` bezeichnet werden, bis seine Originalquelle eindeutig nachgewiesen ist.

## Ab sofort bei jeder Änderung
1. Erst ID/Quellstand im Register nachsehen; falls unklar, BLOCKED statt raten.
2. Nur freigegebene Quelle isoliert bearbeiten; bei neuer Funktion neue NNN, bei reiner Paketierung neue BMMM.
3. Bei jedem neuen Build Kennung im Testhüllen-Header und Deployment-Artefakt identisch ausweisen.
4. Einmal gezielt prüfen, danach Status und Ergebnis im Register festhalten; keine Wiederholung ohne Codeänderung.

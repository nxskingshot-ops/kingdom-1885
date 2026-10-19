# PHALANX – Projektstart / Quellenwegweiser (2026-10-19)

**Zweck:** Ein einziger kurzer Einstieg für neue ChatGPT-Projektchats. Dies ist **kein neues Feature-Register, kein neuer FREEZE und kein Freigabenachweis**. Verbindliche Dokumente bleiben am Ursprungsort. Status ist zeitgebunden; vor Änderungen live prüfen.

## In 60 Sekunden zur richtigen Quelle

| Gesucht | Verbindliche Stelle | Hinweis |
| --- | --- | --- |
| Projekt- und Aufgabenübersicht | [Unified Roadmap](PHALANX-UNIFIED-ROADMAP-20261018.md), anschließend `TODO.md` im Repository | Roadmap ist ein Index, keine pauschale Fertigmeldung |
| 74 Features in 16 Modulen | `data/phalanx-feature-id-baseline-20261018.json` und `data/phalanx-feature-register-baseline-audit-20261018.json` | `UNVERIFIED_CURRENT_ALPHA` nicht als getestet auslegen |
| Freigegebene Originale und deren Herkunft | [Recovery Master Register](PHALANX-RECOVERY-MASTER-REGISTER-20261018.md) und `docs/assets/PHALANX_REFERENCE_IMAGE_DATABASE_2026-10-13.md` | Bibliotheksexemplar und SHA-256 vergleichen |
| HOME | `docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md` und der separat dokumentierte HOME/Header-Stand 16.10 | Kein älteres HTML stillschweigend als endgültigen HOME-Stand ausgeben |
| Header/Branding | `docs/PHALANX-DESIGN-AUDIT-20261019.md` auf `work/reports-out024-readonly-20261019` | HOME groß/gold, Module mittel/rot, Funktionen kompakt/blau; finaler Original-Asset-Abgleich offen |
| Outpost Map | `data/outpost-map-alpha24-canonical-lock-20261018.json` | **OUT-024 Alpha24** ist aktuell, historische Alpha23 nicht ersetzen/integrieren |
| RC5 → OUT-024 → Reports | `preview/PHALANX_RC5_OUT024_REPORTS_ISOLATED_NAV_20261019.html` auf `work/reports-out024-readonly-20261019` | Isolierter Router bereits vorhanden; nicht neu bauen |
| Reports-Datenanbindung | `docs/PHALANX-OUT024-REPORTS-EXPORT-GATE-20261019.md` auf Reports-Branch | Momentan manueller JSON-Import; automatische Übernahme gesperrt bis geprüfte Schnittstelle existiert |
| Backups und Recovery | Recovery Master Register + `docs/PHALANX_BACKUP_COVERAGE_2026-10-14.md` | PostgreSQL-Archivprüfung und Edge-Quellarchiv belegt; kompletter Restore **offen** |

## Derzeit belegte Recovery-Ereignisse

- PostgreSQL: GitHub Actions `39153463727` – private Sicherung heruntergeladen, Prüfsumme, Entschlüsselung und PostgreSQL-Archivliste erfolgreich. Kein vollständiger Restore.
- Edge: GitHub Actions `39153935072` – 26 Quellen archiviert und privat verschlüsselt gespeichert, Download verglichen und Archiv geprüft. Kein funktionaler Restore.
- Geplante tägliche Edge-Automatik: `main:.github/workflows/phalanx-edge-daily-encrypted-b2.yml`. Am 19.10. sind mehrere manuelle Tests fehlgeschlagen; zuletzt wurde die CLI-Installation angepasst (Commit `a4189cdf`). **Erster erfolgreicher Lauf nicht nachgewiesen**; aktuellen Actions-Status prüfen, bevor „fertig“ gemeldet wird.
- Tägliche Datenbanksicherung: `main:.github/workflows/phalanx-db-backup.yml`; Nutzer-Screenshot zeigt sechs erfolgreiche Läufe bis 19.10.

## Arbeitsregeln

1. Vor jeder Änderung tatsächlichen GitHub-Branch, neueste freigegebene Quelle, FREEZE und vorhandene Umsetzung vergleichen.
2. Bereits dokumentierte Implementierungen und Tests wiederverwenden; keine extra „Master-Datenbank“ aus diesem Index erzeugen.
3. Produktions-App, Daten, Secrets, Berechtigungen, Backups und FREEZEs nur innerhalb der jeweiligen ausdrücklich freigegebenen Grenzen verändern. Keine Zusatzkosten.
4. `PLANNED`, `CODE_PRESENT`, `CI_VERIFIED`, `DEVICE_VERIFIED`, `RESTORE_VERIFIED` und `FROZEN` strikt auseinanderhalten.
5. Für neue ChatGPT-Projektgespräche zuerst dieses Dokument und die verlinkten Originalquellen öffnen. Memory ist nützlicher Kontext, kein Live-Nachweis.

## Technische Quellen

Repository: `nxskingshot-ops/kingdom-1885`. Dieser Wegweiser liegt isoliert auf Branch `work/alpha-territory-integration-20261019`; das ältere `README.md` auf `main` beschreibt teilweise historische NEXUS-Stände und ist nicht automatisch der aktuelle PHALANX-Alpha-Einstieg.

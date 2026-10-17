# PYLON IX — Modul- und Datenzugriffsvertrag V0

Stand: 2026-10-17 · Status: Architekturentwurf / **nicht integriert**.

## Bestand geprüft
- `preview/kvk-prep-v4.html`: bestehende KvK-Prep-Vorschau; nicht durch PYLON ersetzen.
- `docs/PHALANX-SUPABASE-FREE-BACKUP-PLAN-20261014.md`: Supabase-Backups auf Free-Plan nicht automatisch verfügbar; GitHub-Backup ist kein Datenbankbackup.
- `preview/pylon-ix-assistant-isolated.html`: isolierte UI-Demo, statische Antworten, keine echte KI.

## Zugriffsprinzip
PYLON erhält **keinen** eigenen uneingeschränkten Zugriff auf Supabase, keine Service-Role-Keys und keine direkten produktiven Schreibrechte. Moduladapter liefern ausschließlich zuvor autorisierte, minimale, versionierte Lesedaten. Jeder Adapter prüft die aktuellen Rechte des angemeldeten Benutzers serverseitig oder durch bestehende geschützte App-Schichten. RLS niemals umgehen.

## V0-Adaptervertrag (konzeptionell)
```json
{
  "schema_version": "pylon.module-context.v0",
  "module": "kvk-prep",
  "source": "existing-phalanx-module",
  "observed_at": null,
  "verified_at": null,
  "data_status": "not-connected",
  "scope": "none",
  "facts": [],
  "warnings": ["Keine freigegebenen Daten verbunden"],
  "provenance": []
}
```

Zulässige Modulkennungen für eine spätere Adapterprüfung: `kvk-prep`, `alliance-comparison`, `outpost-intelligence`, `account-intelligence`. Kein Adapter ist hiermit aktiviert.

## PYLON-Antwortregeln
1. Fehlen verifizierte Daten, eindeutig „Keine aktuellen Daten verfügbar“ melden; keine fiktiven Werte oder Ränge.
2. Zwischen Fakt, Berechnung, Schätzung und Empfehlung unterscheiden.
3. Quellenstand und Zeitstempel anzeigen; veraltete Daten als veraltet kennzeichnen.
4. Privates Profil und Allianz-/Königreichsdaten strikt nach Berechtigungen trennen.
5. Keine geheimen Quellenbezeichnungen oder Tokens in UI, Prompt oder Logs ausgeben.
6. Kein Upload privater Daten an externe KI-Anbieter ohne gesonderte Zustimmung und Datenschutzprüfung.
7. Keine automatischen Spielaktionen, Käufe, Nachrichten oder Änderungen ohne explizite Nutzerfreigabe.
8. Ein Fehler in PYLON darf die ursprünglichen Module nicht blockieren.

## Vor der Implementierung zu prüfen
- Welche bestehenden Modulversionen wirklich aktiv sind und wo deren freigegebene Leseschnittstellen liegen.
- RLS/Auth-Verhalten mit Testkonten und negativen Zugriffstests.
- Kostenfreie Laufzeitoptionen, Limits, Datenschutz und Datenaufbewahrung.
- Test mit synthetischen Daten, dann autorisierter Integrationstest auf isolierter Umgebung.
- PYLON-Originalgrafik verlustfrei als Asset sichern; keine freie Nachzeichnung.

## Release-Gates
Kein Merge auf main, kein produktiver Deploy, keine Auth-/RLS-Änderung, keine neuen kostenpflichtigen Ressourcen. About und Donate sind nach Nutzerentscheidung zurückgestellte Release-TODOs (#24 und #25).

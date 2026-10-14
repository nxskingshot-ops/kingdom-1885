# NEXUS PHALANX — AKTUALISIERTER VERBINDLICHER FAHRPLAN
**Stand:** 2026-10-14 | **Status:** Entwicklungsplanung, kein Release-GO

## Entscheidung / Änderung gegenüber bisheriger Release-Baseline
Die ältere Baseline `PHALANX-STATUS-QUO-RELEASE-BASELINE-2026-10-14.md` sah umfangreiche Profile als 2.0/Lab vor und optionale neue Funktionen nicht als Release-Blocker. **Diese Einstufung ist für die ausdrücklich freigegebenen V1-Funktionen überholt.** Der Nutzer hat am 2026-10-14 **persönliche Profile, Onboarding, Datenübernahme, Upload und Frag PHALANX als verbindliche V1-Release-Faktoren** festgelegt. Sicherheits- und Stabilitätsgates bleiben zusätzlich bestehen. Andere Innovationen bleiben 1.x/2.0.

## Unverrückbare Produktregeln
- **„Das habe ich – das will ich“**: erst tatsächliche, möglichst aktuelle Ressourcen und Ziel, dann Machbarkeit, Alternativen und nur evidenzgestützte Optimierung.
- Frozen Hochformat-Design und bestehende Live-App unverändert bis explizite Integrationsfreigabe.
- Kein zusätzliches kostenpflichtiges Angebot oder heimliche Datenweitergabe.
- ID dient zur Suche, niemals als Authentifizierung/Eigentumsnachweis.
- Unbekannte Kampfwirkung, veraltete Daten und nicht bestätigte Extraktion werden transparent gekennzeichnet.

## V1-Arbeitspakete — priorisierte Reihenfolge
| Priorität | Paket | Konkrete Akzeptanz | Status |
| --- | --- | --- | --- |
| P0 | Bestand & Sicherheits-Audit | Bestehende Auth, Rollen, Supabase-RLS, Storage, Edge Functions, produktive UI, Backup/Restore prüfen und wiederverwenden | **Offen / Bestandsaufnahme** |
| P0 | Regression / reproduzierbare Tests | Vorhandene Troop-, Bear-, Viking-, PvP/KvK- und Assistant-Tests tatsächlich ausführen, Fehler korrigieren und CI-Status nachweisen | **Code/Tests angelegt; grüne Ausführung nicht bestätigt** |
| P1 | Account-Onboarding | Wahl Basis- oder Vollprofil beim ersten Einstieg; Upgrade später; getrennte PHALANX-Identität | **Spezifiziert, nicht implementiert** |
| P1 | Kingshot-ID / Datenimport | ID-Suche, Kandidaten bestätigen, erlaubte Mighty/MightPulse-Felder mit Zeitstempel importieren; bei API-Ausfall manuell fortfahren | **Spezifiziert; API-Zugriff/Berechtigung prüfen** |
| P1 | Privates Spielerprofil | Helden, Sterne, Skills, Ausrüstung, Truppen, Tier, Marschkapazitäten, Locks; editierbar, löschbar, private RLS | **Spezifiziert, nicht integriert** |
| P1 | Upload & Prüfstrecke | Screenshots/Kampfberichte hochladen; Felder extrahieren, Unsicherheit anzeigen, Korrektur/Bestätigung, Dubletten verhindern | **Spezifiziert, nicht integriert** |
| P1 | Frag PHALANX | Freie Fragen und Rückfragen; profilbezogene Antworten mit geprüften Daten; fehlende Angaben erfragen; Rollenprüfung | **Router/Adapter-Prototyp, keine vollständige E2E-Integration** |
| P1 | Smart March Optimizer | Bear, Viking, PvP, KvK, Garnison, Verstärkung, Custom; Ziel-/Inventar-/Helden- und Timingregeln; keine unbewiesenen Best-Claims | **Feasibility-Prototypen, Hero-/Timing-/Combat-Validierung offen** |
| P1 | Sicherheit & Erstnutzertest | A/B-Datentrennung, sichere Uploads, Kostenlimits, Android-Portrait, mehrsprachige Fragen, realer Erstnutzertest | **Offen** |
| P0 | Release-Freigabe | End-to-End-Abnahme aller V1-Gates und ausdrückliches GO | **BLOCKIERT bis Nachweise vorliegen** |

## Konkrete nächste Entwicklungsschritte (ohne Nutzereingriff)
1. **Repository/Bestand prüfen**: bestehende Login-/Profile-/Upload-/Mighty-Integration und Supabase-Schema inventarisieren, nichts doppelt implementieren.
2. **Tests wirklich laufen lassen**: GitHub CI/Node-Suite, Fehlerberichte und reproduzierbare Resultate; mathematische Erhaltung und Berechtigungen.
3. **Datenvertrag**: Nutzeridentität, verknüpfte Kingshot-ID, private Profilfelder, Quellen-/Zeitstempel, Import- und Uploadstatus, explizite Bestätigung definieren.
4. **Sicherer Import/Upload-Prototyp** nur auf isoliertem Branch, ohne Produktion/Secrets/Kosten.
5. **Assistent verbinden**: Nutzerziel -> autorisierte Profildaten -> passender Rechenkern -> nachvollziehbare Antwort.
6. **E2E-/Novizen-Abnahme** und anschließende gesonderte Freigabe für produktive Integration.

## Definition von V1-Fertig
Basiszugang und Vollprofil funktionieren; ID-Suche mit Bestätigung; erlaubter Import plus manueller Fallback; geschützte Profilbearbeitung; sichere Screenshot-/Bericht-Uploads mit Review; Frag PHALANX nutzt das bestätigte Profil und liefert belastbare oder transparent eingeschränkte Antworten; Tests/Android/Datenschutz/Backup bestanden; ausdrückliches Release-GO.

## Verbindliche Referenzen
- `docs/PHALANX_V1_ACCOUNT_UPLOAD_AI_RELEASE_GATE.md`
- `docs/PHALANX_ASK_ASSISTANT_RELEASE_GATE.md`
- `docs/PHALANX_SMART_MARCH_INPUT_GOAL_CONTRACT.md`
- `docs/PHALANX_TROOP_PLANNER_RECOVERED_REQUIREMENTS.md`
- `docs/PHALANX-STATUS-QUO-RELEASE-BASELINE-2026-10-14.md` (historischer Ausgangspunkt; bei V1-Scope durch diese Entscheidung überholt)

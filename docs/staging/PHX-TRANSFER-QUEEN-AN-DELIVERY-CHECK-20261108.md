# PHALANX Transfer Scouting — Queen An delivery gate (2026-11-08)

## Scope and protection
Repository nxskingshot-ops/kingdom-1885; isolated feature branch work/truepower-pylon-verdict-20261108. Do not merge to stage/transfer-live-rankings-20261103 or change protected design FREEZEs without release approval. No data writes or schema changes were performed in this audit.

## Verified (2026-11-08)
- Vercel isolated preview READY, runtime commit bb21ac76c4f0f71841c7b85f6c554462f7a18797.
- Preview HTML, JS, account-assessment JS, display JS, CSS all returned HTTP 200.
- Android screenshots from the project conversation demonstrate ID lookups and distinct PYLON assessments for KomaR (290591005) and KingoftheHill (293285312), including True Power color matching Average for KingoftheHill. These are limited manual observations, not comprehensive regressions.
- Supabase Edge Function phalanx-transfer-intelligence-stage-20261031 version 8 ACTIVE with JWT and membership check; player ID fallback previously verified v19. No new Edge Function deployment.
- Supabase read-only query: latest stored capture for all inspected ranking boards = 2026-11-08 01:14:33.348+00. Latest row creation = 2026-11-08 10:00:08.986985+00. Ingestion time is not measurement time.
- Frontend playerSummaryMetrics selects newer Total Power for headline, but calculates True Power only from a Total Power / Troop Power pair with exactly matching capture time and source; never substitute a mismatched headline value.
- Kingdom intelligence backend first requests MightPulse provider and falls back to most recently created saved snapshots. It does not guarantee the fallback is the newest capture timestamp in all possible ingestion orders. This remains a freshness audit item.

## Not verified / delivery blockers
- Queen An's own authenticated access and authorization to the protected rankings and player lookup APIs: NOT TESTED. Do not advertise public/no-login access.
- Current live provider freshness versus stored snapshots: NOT TESTED with an authenticated user session. The API can fall back to saved capture.
- End-to-end save/reload of candidate data, roles, export/backup, alliance tiles, and cross-kingdom lookup: NOT TESTED in this audit.
- Navigation, mobile regression across devices, security and access roles, and all color categories: NOT TESTED in this audit.
- No evidence of production readiness or a complete release. No staging merge.

## Minimum release decision
Use isolated preview only as an explicitly labeled TEST / operational preview, subject to verified Queen An login and at least one end-to-end candidate lookup and saved-record reload. Show source capture timestamps. If access fails, STOP and repair authorized access without relaxing JWT or membership controls. Merge to staging only after recorded acceptance and regression evidence.

## Isolated preview
https://phalanx-r11-atlas-preview-git-work-truepo-13a8b9-matze4428-6040.vercel.app/deploy/phalanx-kvk-test/pylon-ix/transfer-scouting-id-stage-20261030.html

## Additional static functional audit (2026-11-08, pre-release)
- Frontend module JS syntax: PASS using AsyncFunction after stripping ES imports/exports for parsing only. Assessment and display helper JS syntax: PASS.
- DOM contract: PASS for 68 unique `$('id')` references; all resolve to one of 87 HTML IDs in the deployed HTML source. This does not prove runtime handler success.
- Forms identified: authForm, phxIdForm, internalIdForm, candidateForm; all four have registered submit handlers in source: PASS static wiring.
- Candidate save path: source calls Supabase `transfer_candidates` insert/update and then `load()`; actual authorization, RLS, persistence and reload: NOT TESTED.
- CSV export: source constructs Blob and browser download; actual Android download and file contents: NOT TESTED.
- Protected #1885 rankings: source fetches Edge Function with session bearer token, no-store; access for Queen An: NOT TESTED.
- Latest saved rankings: all inspected boards have source capture 2026-11-08T01:14:33.348Z, while database `created_at` was 2026-11-08T10:00:08.986985Z. The latter must never be represented as the capture time.
- Freshness risk: intelligence Edge Function uses `created_at desc` to choose saved fallback, rather than `source_captured_at desc`; later reingestion of older captures could supersede newer measurements. This is a concrete LIVE DATA FIRST release risk; no production function change performed.
- Deployment check: READY commit bb21ac76c4f0f71841c7b85f6c554462f7a18797; five directly fetched preview assets HTTP 200.
- This is source/static and read-only integration auditing, NOT a complete user-journey test. Release gate remains CLOSED.

## Additional read-only data and permission audit
- public.transfer_candidates table exists with candidate_id, player_name, kingdom, alliance, power_m, castle_level, contact_status, transfer_eligibility, recruiter, notes, metadata, updated_at: PASS schema check.
- Existing candidate rows: 4; no rows were added, modified or deleted during this audit.
- RLS enabled: PASS.
- SELECT policy: authenticated member or higher. INSERT, UPDATE, DELETE policies: authenticated NXS R4 or higher. PASS policy existence and role separation; Queen An's actual user membership and sign-in are NOT TESTED.
- Candidate editor submits Supabase insert/update and reloads records from the table: PASS static path inspection; live write/reload remains NOT TESTED to protect existing records.
- Four alliance tiles generated from destinationAlliances, with source-capture grouping: PASS static code inspection; UI rendering with a real session NOT TESTED.
- Open issue: saveCandidate closes the editor before checking whether subsequent load() succeeded. This can mask a read-back failure. Not changed during this read-only audit.
- Open issue: latest fallback ranking is ordered by saved row creation time, not source capture time. No Edge Function redeploy authorized or performed.

## Nachtrag · Feature-Branch · 08.11.2026

**Entscheidung: NICHT FREIGABEFÄHIG für Queen An.** Der Frontend-Fix wurde mit einer isolierten Chromium-Sitzung und simulierten API-Antworten geprüft. Der aktive Backend-Fallback und der Einsatz mit Queen Ans eigener Sitzung sind offene Freigabepunkte.

- Kandidateneditor wartet auf eine bestätigte Schreibantwort und auf dieselbe Datensatzversion im anschließenden Listenabruf. Lese-Wiederholung führt keinen zweiten Schreibzugriff aus. Ein Versionsfilter schützt vor dem Überschreiben einer zwischenzeitlichen Bearbeitung. Die Anlage per Spieler-ID bestätigt denselben Rücklesepfad.
- True Power verwendet genau einen gemeinsam erfassten Total-/Troop-Power-Satz mit gemeinsamer Herkunft. Abweichende Erfassungen und gespeicherte Quellen werden angezeigt. Bestehende PYLON-Karten für individuelle Stärken und Entwicklungsfelder werden gerendert.
- Backend-Korrektur als [isolierter Patch](patches/PHX-TRANSFER-MEASURED-CAPTURE-20261108.patch) für die beiden laufenden Funktionsquellen v8 und v19. Der Patch wählt je Rangliste nach Messzeit. Bei Gleichstand hat der direkte Provider Vorrang. Patch-Anwendung ausschließlich nach Prüfung der Ausgangsquellen und in einer freigegebenen isolierten Funktionsumgebung.
- Lokale SHA-256 der abgerufenen v8-Quelle: `2e77c38f5209f41e54750f015fefeeba71799abd66e7456bb07dbfefa32e15fb`. v19-Quelle: `4e4b73ce503ef352baa6634c3b6413b575af9da2c73b47123b2a4f9b9b005d71`. Auf bytegleichen Ausgangsdateien mit `git apply --unidiff-zero --check` geprüft, angewandt und gegen die getesteten Funktionen verglichen. Laufende Funktionen wurden nicht neu bereitgestellt.
- **BESTANDEN** · 14 Transfer-Assertions und 28 Repository-Tests. Asset-Preflight bestanden. Drei lokale Funktionsprüfungen mit Testdaten: unterschiedliche Speicher-/Messreihenfolge, teilweise Provider-Antwort, Provider-Ausfall und Zeitgleichstand.
- **BESTANDEN** · Chromium mit HTTPS-Testserver und abgefangenen API-Antworten: Anmeldung/Sitzungsreload, Rollen-Gates, Lookup #1913, fünf Power-Kennzahlen, vier Farbbänder plus unbekannt, PYLON/KvK, Rankings, vier Allianzen, Einzelvergleich #1885, Arena, Anlage/Bearbeitung, HTTP 404, Schreib- und Rücklesefehler, CSV-Download mit Inhaltsprüfung und Navigation bei 390 CSS-Pixeln.
- **BESTANDEN** · Reale Vorabprüfung: Beide aktiven Edge-Routen akzeptierten die Feature-Branch-Origin beim OPTIONS-Aufruf (204) und verweigerten anonymen GET (401). RLS aktiv, vier Kandidaten beim schreibfreien Zähltest. Bei 26 Ranglisten war der neueste gespeicherte Messzeitpunkt 08.11.2026 01:14:33.348 UTC, jüngste Speicherung 10:00:08.986 UTC. Der authentifizierte Provider-Abruf ist damit nicht nachgewiesen.
- **NICHT GETESTET** · Queen Ans Vercel-Zugang und App-Sitzung, authentifizierter Provider-E2E, echte Kandidaten-Schreib-/Lesestrecke, Android-Gerät, Datenbank-Backup und Restore. In dieser Transfer-Ansicht ist CSV als Export verdrahtet. Eine separate Backup-/Restore-Oberfläche wurde im aktiven Einstieg nicht gefunden.
- **BACKUP ERSTELLT / INTEGRITÄT GEPRÜFT / WIEDERHERSTELLUNG GETESTET** · Lokales Git-Bundle der Ausgangsversion `6261fb56ad3e8a233f713560b51e293fbd946751`. `git bundle verify`, Wiederherstellung in separatem Checkout, Commitvergleich und `git fsck --connectivity-only` bestanden. Das betrifft den Quellcode. Eine Sicherung oder Wiederherstellung von Kandidaten- oder Datenbankdaten wurde in diesem Durchlauf nicht ausgeführt.

## Nachtrag · Manuelle Transfer-Einstellungen · 08.11.2026

- Direktzugriff über **Transfer-Einstellungen** im Transfer-Modul. Erfasst werden maximale Transfer-Power in Millionen, Transfergruppe, optionaler Kingdom-Bereich, Zielkönigreich, Transferfenster sowie Quelle und Belegdatum. Die bisherige lokale Speicherung wird weiterverwendet.
- Die manuelle Planung erscheint im Modul und im Dossier. Der Transfer-Rechner übernimmt das Limit als Eingabe. Eine dokumentierte Quelle setzt die separate Bestätigung der im Spiel geprüften Metrik nicht automatisch. Feste Richtwerte aus der Tools-Ansicht wurden durch einen Verweis auf die Event-Einstellungen ersetzt. Einladungen werden weiterhin nicht aus Total oder True Power abgeleitet.
- **BESTANDEN** · Chromium bei 390 und 1280 CSS-Pixeln mit isolierten API-Antworten. Vorhandene Werte wieder eingelesen, Dezimal-Power und Gruppe 9 gespeichert, fehlerhafte Zeitfenster, Belege und Kingdom-Bereiche abgefangen, Modul/Dossier/Rechner abgeglichen, Reload und Löschen des Limits geprüft. 20 Browser-Regressionen, 25 automatisierte Transfer-/Ranking-Tests und Asset-Preflight bestanden.
- **BACKUP ERSTELLT / INTEGRITÄT GEPRÜFT / WIEDERHERSTELLUNG GETESTET** · Lokales Git-Bundle von `a2ae3d17892ce8b8bcda5f68571b013b75e59825`, Wiederherstellung in getrenntem Checkout. Keine Kandidaten- oder Datenbankänderung.
- **FEHLGESCHLAGEN · laufender Backend-Fallback** · Die gemeinsam genutzten Versionen v8 und v19 wählen weiterhin nach Speicherzeit. Beide wählten im lokalen Vergleich einen später gespeicherten älteren Testmesswert. Der Patch wählte jeweils den neueren Messwert. Für diesen Durchlauf stand keine getrennte Supabase-Umgebung bereit. Der geschützte Vercel-Zugang für Queen An und der authentifizierte Live-Abruf bleiben **NICHT GETESTET**.

## Nachtrag · True-Power-Farbe bei zeitversetzten Kingdom-Messungen · 08.11.2026

- Die Testvorschau nutzt für die Farbe die zeitlich nächstgelegene verifizierte #1885-Stichprobe mit mindestens 20 verschiedenen Spielern. Zulässig sind bis zu 24 Stunden Unterschied zur Kandidatenmessung. Ein ausreichend besetzter zeitgleicher Vergleich hat Vorrang. Die Spielerwerte eines Vergleichs stammen aus einem einzigen #1885-Messzeitpunkt.
- Total und Troop Power müssen pro Spieler weiter aus derselben Quelle und Messung stammen. Der Infodialog zeigt beide Messzeiten und ihren Abstand. Ohne geeignete Stichprobe bleibt die Anzeige neutral. Die vorhandene Farbskala bleibt maßgeblich.
- **BESTANDEN** · 27 automatisierte Tests inklusive 24-Stunden-Grenze, Vorrang der zeitgleichen Stichprobe, getrennten Messungen, Duplikaten und Selbstausschluss. Chromium mit Testdaten zeigte alle vier Farben, darunter die Farbe bei einem Stundenversatz, beide Zeitstempel im Dialog und den neutralen Zustand außerhalb des Fensters. Kandidatenabläufe, Rollen und manuelle Transferplanung wurden erneut mit isolierten API-Antworten geprüft.
- **NICHT GETESTET** · LadyBeth23 am neuen Stand auf Android mit authentifizierter Live-Antwort. Backend-Patch zur Snapshot-Auswahl ist davon getrennt.

## Follow-up · English transfer scouting interface · 2026-11-08

- The Transfer Scouting preview uses English for the tools, planning forms, saved-plan summary, candidate removal prompts, and lookup errors. The summary uses English decimal formatting. Existing saved plans retain their values.
- **PASS** · Browser checks with isolated API responses covered lookup and True Power colors, candidate management and removal prompts, the tools menu, CSV, and plan validation. Saved plans and English formatting were verified in a German browser locale at 390 and 1280 CSS pixels. All 27 automated tests and the asset preflight passed.
- **NOT TESTED** · This revision on an Android device or with Queen An's authenticated session.

## Follow-up · Transfer menu audit · 2026-11-08

- One **Alliance Needs & Kingdoms** menu opens both **NXS Needs** and **Kingdom Notes**. The event-rule note now appears directly in **Plan Transfers**. The Kingdom #1885 comparison returns to its Tools menu when leaving the player lookup or dossier.
- The access view has one registration link. The candidate board shows one player lookup button for recruiters, with a separate empty-state button used only when the board is empty. Shortlist comparison, player comparison and CSV remain available from their existing contexts.
- **BESTANDEN** · All five Tools menus, workspace navigation, comparison panel placement, registration links and candidate lookup controls in Chromium at 390 and 1280 CSS pixels with isolated API responses. Transfer, candidate, ranking and CSV browser regressions, 27 automated tests and the asset preflight passed.
- **NICHT GETESTET** · Physical Android device and Queen An's authenticated preview session for this revision.

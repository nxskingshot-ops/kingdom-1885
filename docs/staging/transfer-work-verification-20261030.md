# PHALANX Transfer Scouting — Work-Prüfstand 30.10.2026

## Status
TEILWEISE IMPLEMENTIERT / STAGE-CORS LIVE GETESTET / BROWSER BLOCKIERT.
Keine Gesamtfreigabe, kein Fertig-Nachweis.

## Quellen und Bestandsschutz
- Repository nxskingshot-ops/kingdom-1885, Branch stage/transfer-id-lookup-20261030.
- Vorheriger Head dedc1912c356314ef660823a2d220847973b3323 per Branch-Commitliste bestätigt.
- Originale preview/transfer-scouting-live-v5.html und .js nicht bearbeitet.
- Stage-Frontend-Originale lokal bytegenau gegen Git-Blob-SHAs geprüft: HTML 85c927448f696ddbf4a58b047cec55ac389c23ad; JS 664a39572dc2427fce75a30fb1d9d97b70b27c72.
- Fünf Projektquellen, kanonisches START-HERE, Governance-Master-Register und A040/A041 an den referenzierten Originalcommits gelesen.
- Achtung: kanonisches START-HERE stuft Epic Navigation V2 als RETIRED ein; ältere Projektquellen sind insoweit überholt. Keine Navigations- oder HOME-FREEZEs geändert.
- Ursprüngliche Stage-Edge-Function V1 gesichert; SHA256 cc5e255c9e597921ee9a9bec0e580e8a5005386e62bdaed00d9b5a6bdf779eed. Wiederherstellung NICHT GETESTET.
- BACKUP ERSTELLT: lokale Originaldateien und Recovery-Paket. INTEGRITÄT GEPRÜFT: Frontend gegen Git-Blobs, deployte V2-Quelle gegen eingereichte Quelle. WIEDERHERSTELLUNG GETESTET: nein.

## Änderungen
- Vorbereitete enge CORS-Allowlist integriert; nur https://phalanx-r11-atlas-preview.vercel.app und die konkrete isolierte Deployment-Origin https://phalanx-r11-atlas-preview-hwmocd03j-matze4428-6040.vercel.app.
- Bestehende Auth-, Mitgliedschafts- und Quota-Prüfungen erhalten; verify_jwt=true.
- Bestehende Quota-RPC lesend geprüft: SECURITY INVOKER; anon/authenticated EXECUTE=false, service_role EXECUTE=true. Keine Migration oder Rechteänderung.
- Frontend: SUPABASE_URL umbenannt, damit native URL-Konstruktoren und CSV-Blob-URLs funktionieren; Arena-Sterne akzeptieren stars und star. Statushinweis korrigiert.
- Keine Kandidatendatensätze geschrieben, gelöscht oder zurückgesetzt. Bestehende Kandidatenverwaltung zeigt weiterhin auf die echte geschützte Tabelle: keine Testeinträge dort anlegen.
- Keine Auth-Konten, Rollen, RLS, Schemas oder produktiven Originalfunktionen verändert. Kein Merge.

## Tatsächliche Bereitstellung
Supabase: hcjrdofkdkasznywvcxo / phalanx-transfer-id-bridge-stage-20261030, ACTIVE V2, verify_jwt=true.
Bundle SHA256: 0691e6410e0be4baabc41e42e230a5a2d47d3cd72ee7766f9cc4370f9206a4c3.
Deployte V2-Quelldatei nach Deployment erneut gelesen: exakt identisch zur eingereichten Quelle.

Vercel: ausschließlich vorhandenes Projekt phalanx-r11-atlas-preview, ID prj_XRX2lvA6YQ4YtT9GG53vy5dt2Kt5, Team team_7CaFlyvsyPTeJHMcZsnp0KXU.
Vorher: kein Deployment, keine Domains. Jetzt dpl_53nUQsfqe4u54ZbSRaco5gkfMJhi, READY.
HTTPS: https://phalanx-r11-atlas-preview.vercel.app/
Immutable HTTPS: https://phalanx-r11-atlas-preview-hwmocd03j-matze4428-6040.vercel.app/
ABWEICHUNG: create_deployment mit target=preview angefordert, Vercel bestätigt target=production und weist Standardalias zu. Keine bestehende Bereitstellung ersetzt. Das ist keine nachgewiesene Preview-Umgebung; nicht als solche ausgeben. Weitere Releases angehalten.
Ausgeliefertes Root-HTML mit authentifiziertem Vercel-Fetch HTTP200 geprüft; es enthält vollständiges Stage-Frontend, keine Ersatz-App. Originale Demo-V5-HTML/JS und vollständiges fiktives Dossier als Abhängigkeiten mitgeliefert. Kein Gesamt-App- oder Atlas-Deployment behaupten.
Vercel Authentication aktiv. Direkter Browseraufruf landet auf Vercel-Login.
Temporären Freigabelink für Alias erstellt; Browser-Autoreview lehnt Nutzung als nicht ausdrücklich genehmigte Zugriffsänderung plus production-Kennzeichnung ab. Neu erstellten Alias-Link daraufhin widerrufen; Antwort protectionBypass={}. Das zuvor von web_fetch_vercel_url automatisch angelegte temporäre Deployment-Sharing wurde nicht weiter verwendet. Keine Zugangstokens im Bericht.

## Nachweise
| Prüfung | Ergebnis | Grenze |
|---|---|---|
| Stage-JavaScript Syntax | BESTANDEN | kein App-E2E |
| 9 lokale Node-Prüfungen | BESTANDEN | simulierte Auth/Membership/Quota/Providerantworten |
| Exakte CORS-Origin / OPTIONS | BESTANDEN | Live HTTP204 mit konkreter ACAO-Origin |
| Fremde Origin / OPTIONS | BESTANDEN | Live HTTP403, kein ACAO |
| Ohne Authorization | BESTANDEN | Live Gateway HTTP401, kein Profilzugriff |
| Deployed Source-to-Source | BESTANDEN | V2 exakt, verify_jwt=true |
| Vollständiges HTML ausgeliefert | BESTANDEN | authentifizierter HTTP200, kein Browsertest |
| Vercel Preview-Target | FEHLGESCHLAGEN | angefragt preview, tatsächlich production im isolierten Testprojekt |
| Browserzugang | BLOCKIERT | Vercel Login; Auto-review verweigert Share-Link |
| Erfolgreiche App-Anmeldung | NICHT GETESTET | kein genehmigter verfügbarer Testzugang |
| Zwei reale Spieler-ID-Abfragen | NICHT GETESTET | keine erfolgreiche User-Session in dieser Sitzung |
| Arena Squad / Ranglisten live in Browser | NICHT GETESTET | lokale Payload-Projektion geprüft, echte Werte offen |
| Kandidaten Laden/Speichern/Editieren/Vergleich/CSV | NICHT GETESTET im Browser | keine echten Datensätze zu Testzwecken verändert |
| Dossier → Vergleich → Zurück | NICHT GETESTET | Browserblockade |
| Android / Portrait / Landscape | NICHT GETESTET | keine Gerätemeldung dieser Sitzung |
| PHALANX-Design komplett | NICHT BESTÄTIGT | Stage-HTML nutzt beige Board-Optik und erwartet Shared Header im Parent; kanonische Parent-Hülle hier nicht integriert |
| Kosten / Rechnung | NICHT GEPRÜFT | keine kostenpflichtigen Ressourcen/Abos bestellt; Nutzungsabrechnung nicht geprüft |
| Restore | NICHT GETESTET | V1-Datei als Rückweg vorhanden |

Lokale Prüfgruppen: Preflight ohne Auth/Quota/Provider, fremde Origin, fehlende/ungültige/anonyme Auth, inaktive/falsche/abgelaufene Mitgliedschaft, erschöpfte/defekte Quota, ungültige Parameter/Methoden, positive synthetische Profilprojektion, falsche Identität, URL-Kollision.

## Bestehende Sicherheitsbefunde, nicht geändert
Supabase Advisor nennt RLS-ohne-Policy bei neun Tabellen (darunter private Quota; dort server-only Zugriff vorgesehen), öffentlich und authentifiziert ausführbare SECURITY-DEFINER-Funktion public.phalanx_can_read_alliances(), und deaktivierte Leaked Password Protection.
Remediation: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
Diese Hinweise sind keine neu nachgewiesene Ausnutzbarkeit und keine Freigabe für produktive Korrekturen.

## Nächster konkreter Schritt
Explizite Freigabe für einen höchstens 23 Stunden gültigen Vercel-Testlink ausschließlich dieses isolierten Testprojekts trotz dessen production-Kennzeichnung einholen; App-Login bleibt vorgeschrieben. Danach Browserprüfung fortsetzen, ohne echte Testkandidaten in Produktion zu schreiben. Vollständige kanonische PHALANX-Parent-Hülle anhand der neuesten freigegebenen Originalquelle verifizieren und isoliert integrieren; keinen Ersatzheader erfinden. Positive Auth-/ID-/Arena-/Ranking- und Navigationsprüfungen nachholen. Bis dahin keinen Queen-An-fertigen Testlink behaupten.


## Fortsetzung nach ausdrücklichem Go — 30.10.2026
Die vorherige Freigabefrage bezog sich konkret auf einen maximal 23 Stunden gültigen Vercel-Testlink trotz production-Kennzeichnung im isolierten Testprojekt. Nutzer antwortete Go. Neuer Alias-Testlink mit TTL 82800 Sekunden erstellt; Ablauf laut Vercel 31.10.2026 19:50:53 MEZ. Linktoken bewusst nicht im öffentlichen Register gespeichert.
BESTANDEN: Genehmigter Link im Cloud-Browser geöffnet; tatsächliche Seite NXS Live Transfer Scouting / Member access sichtbar. Frühere Auto-review-Browserblockade ist für diesen genehmigten Aufruf aufgehoben.
FEHLGESCHLAGEN: Anmeldung über browserAuth sicher angefordert und abgeschickt; frischer sichtbarer Seitenzustand meldet Invalid login credentials. Keine Credential-Werte ausgelesen oder gespeichert. Kein automatischer Wiederholungsversuch, kein Auth-Reset, keine Rechteänderung.
NICHT GETESTET bleiben erfolgreiche App-Anmeldung, reale ID-Abfragen, Arena/Ranks, Candidate-Laden/Speichern, Vergleich/Export und private Navigation. Design-Hülle weiterhin offen. Keine weiteren Deployments, keine Kandidaten-Schreibtests oder Datenänderungen in dieser Fortsetzung. Nächster Schritt: Nutzer kann die Anmeldung im bereitgestellten Browser korrigieren; erst nach sichtbarem Login-Erfolg geschützte Browserprüfungen fortsetzen.


## Android-Nutzernachweise — 30.10.2026
Quelle: vom Nutzer bereitgestellte Screenshots, keine zusätzliche authentifizierte Agent-Browsersession und kein zusätzlicher Profilabruf.
- Screenshot 47724.png: Recovery-Seite meldet Passwort geändert; Nutzer hat Passwort selbst gesetzt. Screenshot belegt sichtbare Erfolgsmeldung, keine Passwortwerte übernommen.
- Screenshot 47725.png: geschützter Scouting-Bereich mit ID-Formular und Kandidatenboard auf Android sichtbar. Erfolgreiche App-Anmeldung damit GERÄTEGETESTET (Nutzernachweis); kein vollständiger Auth-/RLS-Sicherheitsaudit.
- Screenshot 47727.png: ID 290591005 liefert erwartete Identität KomaR, Kingdom1885/NXS; Abfrage meldet abgeschlossen. Fünf benannte Arena-Helden mit Level/Sternen sowie vier Rangfelder sichtbar. BESTANDEN: erster echter Android-UI-Abruf über Stage-Bridge, Arena-Basisdarstellung und Vorhandensein von Rangwerten. Spielerwerte nicht öffentlich in diesem Register dupliziert. Keine unabhängige Prüfung der Aktualität/Richtigkeit sämtlicher Anbieterwerte.
- Anzeigeproblem OFFEN: Datenstand UTC wird als rohe numerische Unixzeit ausgegeben, nicht als lesbares UTC-Datum. UI enthält außerdem englische Statuswerte available und gemischte Sprachführung. Keine Korrektur dieser Punkte in diesem Nachtrag.
- Weiterhin NICHT GETESTET: zweiter Browser-ID-Abruf aus fremdem Kingdom, unbekannte ID/404, Kandidaten-Speichern/Laden/Bearbeiten/Vergleich/CSV und private Navigationsregressionen. Keine Schreibtests mit realen Kandidatendaten durchgeführt. Vollständige PHALANX-Parent-Hülle/Designintegration weiterhin OFFEN. Kein Gesamt-Fertigstatus.


## Zweiter Android-ID-Nachweis — 30.10.2026
Quelle: Nutzer-Screenshot 47728.png. Sichtbare Governor-ID 227802999, erwartete Identität グッチ, Kingdom1555/TYZ; erfolgreiche schreibgeschützte Antwort, fünf Arena-Helden einschließlich unterschiedlicher Sternwerte, Ranglistenwerte sichtbar. Keine erneute API-Abfrage durch Agent. Keine geschützten Profil-/Rangwerte in diesem öffentlichen Register dupliziert.
BESTANDEN / GERÄTEGETESTET (Nutzernachweise): erfolgreiche Android-Anmeldung und direkte ID-Abfragen für zwei unterschiedliche Governor-IDs aus Kingdom1885 und Kingdom1555; Arena-Basis- und Rangfeld-Darstellung. Damit ist eine funktionierende kingdomübergreifende Browseranbindung für diese zwei IDs nachgewiesen. Keine Garantie für jede beliebige ID, keine unabhängige Verifikation aller Anbieterwerte. Keine weiteren identischen positiven ID-Tests erforderlich.
OFFEN bleiben: lesbare UTC-/Zahlenformatierung, Statusübersetzung, kanonische PHALANX-Parent-Hülle, Kandidatenverwaltung/Export/Vergleich/Navigation und relevante Fehlerfälle. Weiterhin kein Gesamt-Fertigstatus und keine Freigabe der produktiven PHALANX-App.


## Anzeige und Transfer-Gestaltung — 30.10.2026
Code-Commit: 9b493401faf334b677ec6c0c25803c412b4071e1, ausschließlich Stage-Branch.
Deployment: dpl_2r2mp9fsia4QvJAXfzGLrYrgo4k9 READY im bestehenden isolierten Projekt phalanx-r11-atlas-preview. Vercel target=production bezeichnet weiterhin nur dessen bekannten Testprojekt-Slot. Kein Merge oder Deployment der produktiven PHALANX-App.

### Quellennachweis / Bestandsschutz
- V4-/V5-Originalberichte aus Library gelesen; aktueller Transfer-Referenz-Site-ID über list_sites bestätigt: appgprj_6ae48f4819088191a4dbcd688aef551f.
- Site-Quelle read-only geklont: Source-Head exakt 55f372ddf58fed03e1aa8563c8cba74a943673b4, passende veröffentlichte Version6. Kein Push, keine Änderung oder Veröffentlichung dieser Referenz-Site; git status sauber.
- Original artwork assets/phalanx-approved-reference.png SHA256 c42c044984b96999f960135c587260d8db5d910b57a7afd02330bb58612e184a bytegenau verifiziert.
- Originaler Transfer-Header und Icon-Medaillons wiederverwendet; CSS aus phalanx-original.css übernommen, ausschließlich Bild-URL auf die bestehende öffentliche Referenz-Site gesetzt. Keine Bildgenerierung und kein neuer HOME-FREEZE. Externe Grafikabhängigkeit bleibt: https://phalanx-transfer-an.abuzzshark25.chatgpt.site/assets/phalanx-approved-reference.png . Das Paket ist daher nicht als offline/selbstenthaltend zu bezeichnen.
- Alte beige Stage-Dateien vor Änderung lokal nach recovery/before-display-polish/ gesichert. Vorheriger Git-Head c7abceaa6e56fb6dbadc0245c75a01772fa4f71e und Vercel-Deployment dpl_DSJAHtD6pL61ZHYNrYiFMPAN7v9n bleiben Rückweg. Keine Wiederherstellung/Rollback ausgeführt.
- Automatischer Quellvergleich: gesamter bestehender JS-Block vor dem ID-Panel (Auth, Membership, Candidate-CRUD, Dossiers, Vergleich) bytegleich, abgesehen von neuem Display-Import. Alle bisherigen DOM-IDs erhalten, keine doppelten IDs.
- Backend/Bridge/Quota/RLS/Rollen unverändert; keine Profilabfragen oder Kandidaten-Schreibtests dieser Runde. Die zwei Android-Nachweise vorheriger Runde bleiben referenziert, sind kein Android-Nachweis der neuen Gestaltung.

### Implementiert
- Anzeigeformat für ganze Zahlen mit deutschen Tausenderpunkten, ohne Governor-IDs oder gespeicherte Rohdaten umzuschreiben.
- Numerische Unixsekunden/Unixmillisekunden und ISO-Zeitwerte werden als DD.MM.YYYY · HH:MM:SS UTC angezeigt; unbekannte/ungültige Zeitwerte bleiben ausdrücklich Nicht verfügbar. Quelle und Abfragezeit bleiben getrennte Felder.
- verfügbare/fehlende/leere/unbekannte Abschnittsstatus verständlich dargestellt.
- Distinkte Fehlermeldungen für 401/403/404/429/502/503/504, sichtbarer Ladestatus, Freigabe des Buttons im Fehlerfall erhalten.
- Dunkle Blau-/Gold-Gestaltung mit vorhandenem Originalmotiv und drei nativen Bereichslinks Spieler-ID / Kandidaten / Vergleich. Bestehende Dossiers öffnen/schließen weiterhin mit bisherigen Funktionen; Bereichslinks zu Board/Vergleich schließen offene Dossiers.
- Mobile Kandidatenkarten gemäß vorhandener Transfer-Optik; optionale Felder weiterhin im Profil. Link zur bereits vorhandenen Passwort-Wiederherstellung ergänzt.
- Korrigierter Hinweis: Kandidateneditor speichert echte geschützte Scouting-Datensätze. ID-Lesen bleibt schreibgeschützt; keine falsche Behauptung einer insgesamt schreibgeschützten App.

### Ergebnisse
BESTANDEN: JavaScript-Syntax; 18 lokale Prüfungen (5 Displayfunktionen, 4 tatsächlicher ID-UI-Handler mit synthetischer Session/Antwort, 9 vorhandene Bridge-/Sicherheitsprüfungen); Bestandsschutz- und DOM-ID-Prüfung.
BESTANDEN: Browser lokale Login-/Header-Darstellung, optische Inspektion, kein seitlicher Überlauf bei 390px Portrait (390/390), 844px Landscape-iframe (829/829 mit Scrollbar) und Desktop (1348/1348). Nur ausgeloggter Bereich, keine simulierte Voll-App als Live-Nachweis.
BESTANDEN: neuer HTTPS-Stand im Browser geöffnet, Originalheader, Passwort-vergessen-Link und Login sichtbar. Browserlogs der Runde nur Browserextension-Metadatenfehler, keine beobachteten eigenen Scriptfehler. Neuer Vercel-Stand READY.
NICHT GETESTET: private neue Gestaltung am echten Android-Gerät, erneuter echter ID-Abruf auf neuem Build, Candidate-CRUD/Laden/Speichern/CSV/Vergleich und private Navigation im Browser. Handlerfälle lokal geprüft, Live-Erfolgsnachweise stammen von den beiden früheren Nutzer-Screenshots.
NICHT GETESTET: produktiver Restore, Kosten-/Rechnungsprüfung. Keine kostenpflichtigen Ressourcen/Abos bestellt. Kein Datenbankbackup in dieser Runde nötig/erstellt; keine Datenbankänderung.
OFFEN: Gesamtfunktionstest Kandidaten/Navigation, visuelle Nutzerabnahme der Stage-Gestaltung, vollständiger Unified-Header-/Modul-Integrationsnachweis. Kein Gesamt-Fertigstatus, kein neuer Design-FREEZE.


## Nutzerabnahme — Header akzeptiert, Body-Design abgelehnt (30.10.2026)
Nutzer zu Screenshot 47729.png: Scheint zu funktionieren, aber das Design ist komplett anders; nur der Header passt. Dies ist KEIN vollständiger Funktionstest und KEINE Freigabe des gesamten Designs.
Verbindliche Entscheidung: vorhandenen übernommenen Header erhalten. Übrige Stage-Gestaltung/Struktur NICHT AKZEPTIERT. Die Runde hat alte Live-V5-Board-Struktur lediglich mit der Transfer-V5-Optik versehen und native Scrollbereichslinks ergänzt; sie hat nicht die eigenständige V5-Arbeitsoberfläche mit ihren getrennten Ansichten und progressiver Bedienung integriert. 18 lokale Tests und Responsive-Login-Prüfungen ersetzen diese fehlende Produkt-/Design-Parität nicht.
Nächster Schritt: tatsächliche V5-Quelle (Referenz-Site appgprj_6ae48f4819088191a4dbcd688aef551f, Commit55f372ddf58fed03e1aa8563c8cba74a943673b4) strukturell mit der aktuellen geschützten Stage-Anbindung abgleichen und einen kohärenten Integrationspatch vorbereiten. Bestehenden akzeptierten Header, funktionierende ID-Bridge, Auth, Rollen, Kandidatendaten und Original-V5-Site erhalten. Keine weitere bloße CSS-Umlackierung als vollständige Designintegration ausgeben. Keine Änderung/Veröffentlichung der App in diesem Abnahmenachtrag.


## V5 workspace correction after rejected body — 2026-10-30

- User accepted header only, then authorized continuation. Header markup remains byte-identical to the accepted deployment.
- Read original V5 source `55f372ddf58fed03e1aa8563c8cba74a943673b4` from the existing read-only Sites checkout. Reused original workspace base and progressive presentation CSS, adapted to existing protected cloud DOM IDs. No edits to original Site.
- Three actual task views replace scroll-only links: candidates, player data (existing authenticated ID bridge), tools. Empty board shows the V5 first-use action; stats and empty profiles are hidden. Profile is closable, supporting alliance/planning sections collapsed, candidate editor optional fields collapsed. Existing cloud auth, roles, candidate payloads, ID response and recovery logic retained.
- All previous DOM IDs retained; no duplicates. No migration, schema change, deletion, backend deployment, role change or synthetic cloud write.
- Automated verification: 18 existing bridge/display/UI tests passed; module syntax passed.
- Browser verification with internal synthetic client only (not deployed): all three task views switched correctly; two selected candidates enabled comparison and rendered correct synthetic values; candidate dossier opened; add editor opened with optional fields collapsed. Empty board displayed first-use actions and hid zero metrics. Responsive iframe widths: 375/375 and 829/829 clientWidth/scrollWidth. These are fixture tests, not authenticated live E2E or actual Android tests.
- Remaining gap: original browser-local JSON import/backup/restore stays in original V5 Site and is explicitly linked from tools; it is not silently mapped onto protected cloud records. Full local/cloud feature convergence is NOT complete. No claim of full V5 parity or design acceptance.
- Existing user Android evidence already confirms login/recovery and two real cross-kingdom ID queries with arena and rankings. No new authenticated agent session; no new live candidate CRUD test.
- Deployment target remains only `phalanx-r11-atlas-preview` (`prj_XRX2lvA6YQ4YtT9GG53vy5dt2Kt5`); Vercel labels this isolated test project's alias slot `production`. Actual PHALANX production/main untouched. Internal fixture files excluded from deployment.

### Deployment result — workspace correction
- Source commit: `1bb16415f3510e89c24bc382de203e1278b0c819`.
- Isolated test deployment: `dpl_DMxhGC28XzJekbxPSRkyUMcG3WmN`, READY, alias assigned without error. Immutable URL: https://phalanx-r11-atlas-preview-geljurnsh-matze4428-6040.vercel.app .
- Browser opened existing authorized HTTPS alias share link successfully; existing login gate visible, module URL confirms `build=phx-v5-workspace-4`. Browser error sample contained extension metadata errors only; not an authenticated application-flow proof.
- UI fixture files were excluded from the 14-file deployment. No new sharing access or protection changes. Existing share expiry remains unchanged.
- Body design is awaiting user review; full original local import/backup integration and new authenticated candidate-write tests remain open.

## ID-first candidate onboarding correction — 2026-10-30

User reported Android screenshot 47730: Add Candidate still required manual name/kingdom. Agreed flow: enter Governor ID only → load verified data → review → explicitly adopt candidate.

- IMPLEMENTED: Both new-candidate entry buttons now open and focus the ID lookup. Existing record editor remains available for intentional edits. Successful lookup offers an explicit `Als Kandidaten übernehmen` button to r4/r5/admin only; reading never saves automatically.
- IMPLEMENTED: Map confirmed name/kingdom/alliance/power (base units to millions) and bounded ID/arena/rank/source evidence into existing columns/metadata. No fabricated role, fit, castle, eligibility or specialized trial stages. ID preserved as string; source UID kept distinct.
- IMPLEMENTED: Fresh protected duplicate read checks deterministic candidate ID and legacy `metadata.governor_id` / `metadata.player_id`. New records use `NXS-GOV-{governorId}`; existing primary key prevents two simultaneous new-ID inserts. Insert only, no upsert/update/overwrite. Failed duplicate read fails closed. A concurrent legacy-editor identity reassignment is not transactionally prevented by this client-only change; no general global identity uniqueness claim.
- IMPLEMENTED: Clear pending adoption on ID change/new lookup. Disable repeat/in-flight saves. Success only after returned candidate ID, then reload candidate list; uncertain/save/permission/duplicate failures show an explicit message.
- FOUND AND FIXED: Original V5 empty-state CSS hid every toolbar, including the ID form when there were no cloud candidates. Scoped empty-state rules to candidate board. Confirmed mobile ID field is visible with zero candidates.
- BESTANDEN: 25 automated tests (18 previous + 7 new), module syntax. Covers exact mapping, unknown/zero power, rejected identity, role/logged-out/stale-ID gates, explicit-save-only, duplicate-read failure, legacy duplicate, PK race/error and rapid double-click. New save tests use mocks; not live RLS tests.
- BESTANDEN: Browser at 390px iframe with synthetic-only in-memory database: empty board → add per ID → only ID entered → returned identity/arena/rank display → explicit adopt → candidate count becomes 1 and saved message; repeat lookup/adopt reports existing candidate without overwrite. Width client/scroll = 375/375. Synthetic fixture excluded from GitHub/deployment.
- NICHT GETESTET: New live authenticated candidate insertion/reload/RLS or actual Android save. No real test candidates created. Previous user Android identity lookup evidence remains valid; not substituted for new save verification.
- Read-only Supabase inspection confirmed existing text candidate_id PK, JSONB metadata and r4 INSERT/UPDATE/member SELECT policies. No schema, RLS, auth, database data or Edge Function changed by the agent.
- BACKUP ERSTELLT: local pre-edit HTML/JS copies plus prior stage commit `81be4bcd2bd5026b103cbab737fc95e6f4f8c336`; previous deployment `dpl_DMxhGC28XzJekbxPSRkyUMcG3WmN`. Copy hashes: HTML `789e320cc90f928cbb11c0138b35e1dea4ca07edcbb435003ad725ce1ce5d15b`, JS `100746844b2772aa07943e52af500cd3d1c238ad7723629d72d3c8098bae55e5`. WIEDERHERSTELLUNG NICHT GETESTET.
- Header markup preserved byte-identically. Remaining original local V5 import/backup/cloud convergence and complete design acceptance still open. No main merge, production PHALANX change, extra cost, protection or rights change.

### Deployment result — ID onboarding
- Source commit `e49fa01ce7eb51babba0b405c518f1d01d729657`, isolated test deployment `dpl_B3eD14NwAfBA4x8DHyTL9F6BD2aK`, READY with alias assigned and no alias error. Immutable URL: https://phalanx-r11-atlas-preview-h2srbbsnd-matze4428-6040.vercel.app .
- Existing authorized HTTPS alias/share link opened successfully in browser; module DOM confirms `build=phx-id-onboarding-5`. Login still required. Error sample: extension metadata error only. No new authenticated live save test.
- 15-file deployment includes new candidate mapping helper, all prior recovery/demo dependencies and corrected CSS; excludes synthetic fixture, test mocks and credentials. Test project/SSO/share duration unchanged. Vercel target label is `production` for this isolated test-project alias slot only.

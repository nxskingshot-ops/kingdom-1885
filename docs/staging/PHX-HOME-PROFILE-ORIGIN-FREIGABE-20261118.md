# PHALANX HOME FINAL · Profil-Origin-Freigabe · 18.11.2026

Status: ORIGIN-KORREKTUR FREIGEGEBEN UND IM ISOLIERTEN TESTPROJEKT BEREITGESTELLT. ECHTER LIVE-PROFILWEG IM BROWSER BESTANDEN. Keine vollständige App-/Android-Abnahme. Die Vorbereitung ist historisch erhalten; aktuelle Ergebnisse im Ausführungsabschnitt unten.
Arbeitsbranch: `work/phx-home-profile-origin-20261118`.
Verbindlich: Übergabe des Projektverantwortlichen vom 18.11.2026; neuere Freigaben vor historischen Projektdateien.

## Ausgangszustand und tatsächliche Ziele

| Gegenstand | Verifizierter Stand |
|---|---|
| HOME-Testbranch | `test/home-plaque-visual-20261117` → `169de99792aed44d2a5de52e11fcaaef87059e55` |
| HOME-Auditbranch | `work/phx-home-final-audit-20261116` → `f674790d8f44f945db6b61d8d067dc1b0232d5cb` |
| Historische Backup-Ref | `backup/phx-home-final-v29-baseline-20261116` → `d74db11a29f4987dbf2a479f24cbf3f9ea2c6f63`; Existenz geprüft, kein neuer Restore dieser Ref |
| Feste Webadresse | https://home-plaque-visual-20261117.nexus-phalanx-kvk-test.pages.dev/ → HTTP 200 |
| Letzter Web-Deploy | [Workflow #6 / 44064186898](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44064186898), erfolgreich, Quellcommit `169de99792aed44d2a5de52e11fcaaef87059e55` |
| Cloudflare-Nachweis | Job `133973612984`: Deployment `c40f88e2`, Alias exakt die feste Webadresse |
| Ausgeliefertes Profilskript | `phx-war-room-live.js` byteidentisch zur Datei des geprüften Quellcommits |
| Tatsächlicher Profilserver | `phalanx-security-isolated-test` / `yuyvmbdybwpwpqsipfjt`, ACTIVE_HEALTHY |
| Hauptprojekt | `kingdom-1885-app` / `hcjrdofkdkasznywvcxo`, ACTIVE_HEALTHY; Profilfunktion dort nicht vorhanden. Nicht dort neu anlegen. |
| Aktive Profilfunktion | `phx-war-room-own-profile`, Version 3, ACTIVE, `verify_jwt=true`, Bundle-SHA `3c5060fadda2ae43ff7c5e79c6e59e850070ea535ad0b8d96536188576254acc` |

Die heruntergeladenen aktiven Dateien `index.ts` und `handler.mjs` stimmen bytegenau mit den Integrationsdateien des geprüften Git-Commits überein.
Die Logs enthalten am 17.11.2026 wiederholte `OPTIONS | 403`, zuletzt 10:26:48.182 UTC, sowie frühere erfolgreiche GET-Aufrufe. Dies ist kein neuer erfolgreicher Live-Profiltest.

## Aktueller Live-Gegentest vor Änderungen

Drei echte OPTIONS-Anfragen an die aktive Funktion, jeweils mit GET-Preflight und Authorization-/apikey-Headerankündigung:

| Origin | HTTP | Allow-Origin | Ergebnis |
|---|---|---|---|
| `https://localhost` | 204 | exakt Android-Origin | BESTANDEN |
| `https://home-plaque-visual-20261117.nexus-phalanx-kvk-test.pages.dev` | 403 | fehlt | FEHLGESCHLAGEN für benötigten HOME-Zugriff; Ursache reproduziert |
| `https://foreign.example` | 403 | fehlt | BESTANDEN, fremde Origin abgewiesen |

Rohbeleg: `security/backups/phx-war-room-own-profile-v3-20261118/preflight-before.json`.

## Eng begrenzter Änderungsvorschlag

- `integration/war-room-live-profile/index.ts`: zusätzliche explizite Konfiguration `homePreviewOrigin` mit genau der festen HTTPS-Origin, ohne abschließenden Slash.
- `integration/war-room-live-profile/handler.mjs`: vorhandenen exakten Originvergleich um genau diese konfigurierte Origin erweitern.
- Ohne zusätzliche Konfiguration bleibt die bisherige Android-only-Regel bestehen.
- Keine Wildcard, keine beliebigen Pages-Subdomains, keine fremden Ports oder HTTP-Varianten.
- Sonstiger Handler bleibt identisch: keine Änderung an JWT-Gateway, Auth-Weitergabe, Spieler-ID-Resolver, Quelle, Frischeprüfung, Identitätsabgleich, Quota, Methoden, Query-Abweisung oder Verhalten ohne Origin.
- Nur vorgesehener Deployment-Zielort nach Freigabe: bestehende Funktion im isolierten Projekt `yuyvmbdybwpwpqsipfjt`, weiterhin `verify_jwt=true`.
- Keine SQL-Migration, keine Auth-, Rollen-, RLS-, Secrets- oder Bestandsdatenänderung. Kein Frontend-Deploy erforderlich.

## Sicherung und Rückweg

BACKUP ERSTELLT: aktive v3-Dateien und Metadaten unter `security/backups/phx-war-room-own-profile-v3-20261118/`.

INTEGRITÄT GEPRÜFT: bytegenauer Abgleich mit aktiver Funktion und Git-Baseline; SHA-256 für beide Dateien im `manifest.json`.
Lokales TAR-Archiv erstellt, separat extrahiert und beide Prüfsummen erneut verglichen.

WIEDERHERSTELLUNG LOKAL GETESTET: neun bestehende Handler-Tests gegen die zurückgesicherte v3-Datei bestanden.
WIEDERHERSTELLUNG GEHOSTET: NICHT GETESTET; absichtlich kein Deployment ohne Freigabe.
Rückweg nach einer später genehmigten Bereitstellung: beide gesicherten v3-Dateien erneut als dieselbe Funktion mit aktiver JWT-Prüfung bereitstellen. Eine solche Wiederherstellung wäre eine neue Supabase-Funktionsversion, kein Zurücksetzen des Versionszählers.
Keine Datenbanksicherung oder vollständige App-Wiederherstellung in dieser Runde behauptet.

## Testmatrix dieser Runde

| Bereich | Status | Nachweis / Grenze |
|---|---|---|
| Quellen, aktuelle Deployments, tatsächliches Projekt | BESTANDEN | GitHub, ausgeliefertes Skript, aktive Funktionsdateien |
| Original-Handler vor Änderung | BESTANDEN | 9 Node-Tests |
| Vorbereiteter Handler | BESTANDEN | 14 Node-Tests, HTTP-Abhängigkeiten simuliert |
| Origin-Sicherheit lokal | BESTANDEN | Android/HOME; Lookalike-Host, Subdomain, Port, HTTP, null und fremde Origin abgewiesen |
| Sitzung / eigene ID / Quota / Frische lokal | BESTANDEN | ursprüngliche Tests plus HOME-spezifische negative Fälle; kein Schlüssel in Antwort |
| Echte aktuelle Origin-Prüfung | BESTANDEN / FEHLGESCHLAGEN | Android/fremde Origin korrekt; HOME weiterhin blockiert, siehe Live-Matrix |
| JWT-Gateway nach Änderung | NICHT GETESTET | noch kein genehmigtes Deployment; aktive v3-Metadaten weiter true |
| Erfolgreiche / fehlgeschlagene Anmeldung aktuell | NICHT GETESTET | Nutzerbeobachtungen aus Übergabe sind historischer Nachweis |
| Vollständiger Live-Datenweg bis HOME / War Room | NICHT GETESTET | durch nicht freigegebene Originänderung blockiert |
| MightPulse-Werte aktuell | NICHT GETESTET | keine neue authentifizierte Quellenabfrage |
| HOME-Datei-/Asset-Prüfung | BESTANDEN | `node android-stage/scripts/verify.cjs`; begrenzter Integritätscheck |
| Profilplaketten / lange Namen | NICHT GETESTET | Autofit-Quelle gelesen, Syntax geprüft; keine neue vollständige Geräte-/Namensmatrix |
| Navigation / 74 Outposts / Exporte / Rollen | NICHT GETESTET | keine neue E2E-Regression; vorhandener Code unverändert |
| Android-Browser / native Funktionen | NICHT GETESTET | getrennte Abnahme weiter erforderlich |
| Datenintegrität | BESTANDEN für diese Runde | keine Datenmutation durchgeführt; kein umfassender Datenbankvergleich |
| Neues APK-/Frontend-Build | NICHT GETESTET | keine Frontendänderung vorgenommen |
| Backup / lokale Wiederherstellung | BESTANDEN | siehe Sicherung; gehosteter Restore nicht getestet |

Ausgeführte Prüfungen: `node --test integration/war-room-live-profile/handler.test.mjs`, neun Baseline-Tests nach lokaler Rücksicherung, `node --check` für Handler und bestehendes Autofit-Skript, `git diff --check`, vorhandener Asset-Verifier.
Automatische Security-Advisories lesend geprüft: 17 INFO RLS-ohne-Policy, 7 WARN aufrufbare SECURITY-DEFINER-Funktionen, 1 WARN Passwort-Leakschutz deaktiviert. Kein Beweis für ausnutzbare Rechtefehler; keine automatische Änderung im Rahmen dieser CORS-Korrektur. Hinweise: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable und https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection.
Supabase-Changelog und aktuelle CORS-Dokumentation geprüft; keine Bibliotheks-/CLI-Umstellung Bestandteil dieses Vorschlags.

## Verbindliches Aufgabenregister / Reihenfolge bleibt erhalten

1. HOME-Profil: Freigabe für exakt diesen Originzusatz im isolierten Projekt einholen; vor Ausführung aktive v3-Dateien/Metadaten gegen Sicherung erneut prüfen, Drift nicht überschreiben.
2. Nach Genehmigung echte positive und negative Origin-/JWT-Tests; Anmeldung → autorisierte eigene ID → MightPulse → verifizierte HOME-Plaketten → War Room prüfen. Ein 204-Preflight beweist keinen erfolgreichen Profilabruf.
3. Profilplaketten: Profilbild circa 25 % größer, überstehend erlaubt; Name prominent und zentriert, kein HOME-Level, kein Abschneiden/unnötige Ellipsen. Breitenmessung mit kurzen, mittleren, langen und sehr langen Namen/Sonderzeichen auf Android prüfen; kontrollierte zwei Zeilen nur wenn passend. Keine festen Benutzeridentitäten.
4. HOME-Design gemeinsam abstimmen: oberer grauer Abstand erst nach Ursachenmessung; kompaktere Navigation, untere Leerfläche, Login-Integration. Vier Command-Center-Banner erhalten. Keine eigenmächtige FREEZE-Abweichung.
5. Bestehenden War Room abschließen: Commander Profile, Account Intelligence, Alliance Position, Player Development, Command Access, Profile Settings erhalten. Eigener Account, belegte Daten, keine unnötige Master-/Pet-/Hero-Power; Profilbild-Einstieg und Rückweg prüfen. Historischer Fortschritt und Alliance Position bleiben offene Punkte.
6. Danach bestehende Module integrieren/abnehmen: HOME → Territory → Map/Reports → zurück; echte 74 Outposts samt Filter/Zoom/Vollbild/Quadranten/JSON/CSV; HOME → PYLON IX → Transfer → zurück, Rollen Observer/Operator/Administrator. KvK/Allianzvergleich anhand echter Quellen beurteilen, nicht anhand Platzhaltertext.
7. Android-Browser und native Funktionen separat prüfen, Regressionen und Datenerhalt nachweisen, Freigabe/Sicherung dokumentieren.

Geschützt: UNIFIED HEADER V2 FINAL, Epic Navigation V2 RC5, HOME-FREEZE, Queen-An-Grafik, PYLON-IX-Emblem, PHALANX WORLD, Territory-Control-FREEZE 10.11.2026, bestehende Berechtigungen/GOD-Mode/Grüne-Schrift-Regel. Keine produktive Änderung.
War Academy/T11 zurückgestellt: keine weitere Recherche/Integration ohne neuen Auftrag, keine erfundenen Werte.

## Freigabegrenze

Der Projektverantwortliche hat am 18.11.2026 ausdrücklich nur Vorbereitung und Prüfung erlaubt. Die bestehende Supabase-Originregel wurde NICHT geändert. Der Änderungsvorschlag ist reviewbar, das Deployment bleibt bis zur gezielten Zustimmung gesperrt.
Keine Aussage FERTIG; vollständiger Profil-, Geräte-, Design- und Integrationsnachweis steht aus.

## Ausführung nach gezielter Freigabe · 18.11.2026

Der Projektverantwortliche hat mit „Freigabe erteilt“ die Bereitstellung dieses exakten Origin-Zusatzes genehmigt. Die vorstehenden Abschnitte beschreiben die Vorbereitung; die nachfolgende Ausführung ersetzt deren Freigabesperre für genau diese Änderung.

- Vor Ausführung aktive Version 3 erneut abgerufen: JWT aktiv, exakt zwei Quelldateien; beide byteidentisch zum gesicherten v3-Stand. Kein Drift.
- Bereitgestellt aus Commit `96d9b4353268cd6408952ab1e6c9bf90d489227f`, ausschließlich bestehende Funktion `phx-war-room-own-profile` im isolierten Projekt `yuyvmbdybwpwpqsipfjt`.
- Aktive neue Version **4**, JWT weiterhin aktiv, Bundle-SHA `ed3fc767a22de648eaa483680e265393761cbdecc0b3d955c8f436e5339fb64a`.
- Nach Deployment beide Quelldateien erneut heruntergeladen: byteidentisch zum genehmigten Änderungssatz.
- Kein Frontend-Deploy, APK-Build, SQL-, Auth-, RLS-, Rollen- oder Secrets-Änderung. Das Hauptprojekt wurde nicht geändert. Reguläre Anmelde-/Abmelde- und Profilabrufvorgänge können die bestehenden Sitzungs-/Quota-/Provider-Zustände wie vorgesehen aktualisieren; keine fachlichen Bestandsdaten wurden durch Testdaten ersetzt.

### Echte HTTP-Sicherheitsprüfung nach Bereitstellung

| Test | Ergebnis |
|---|---|
| Android-Origin OPTIONS | BESTANDEN · 204, exakter Allow-Origin |
| Feste HOME-Origin OPTIONS | BESTANDEN · 204, exakter Allow-Origin |
| Fremde Origin OPTIONS | BESTANDEN · 403, kein Allow-Origin |
| Ähnlich aussehender fremder Host OPTIONS | BESTANDEN · 403, kein Allow-Origin |
| Andere Pages-Vorschau OPTIONS | BESTANDEN · 403, kein Allow-Origin |
| HOME GET ohne Token | BESTANDEN · 401, sign_in_required |
| HOME GET mit ungültigem Token | BESTANDEN · 401, Invalid JWT |
| Android GET ohne Token | BESTANDEN · 401, sign_in_required |

Beim ungültigen JWT antwortet das vorhandene Supabase-Gateway selbst mit `Access-Control-Allow-Origin: *` und 401. Das ist keine Wildcard der Profilfunktion und gewährt keinen Profilzugriff. Die Funktionsantworten und erlaubten Preflights verwenden ausschließlich exakte Origins. Gateway-Konfiguration unverändert.

Rohbelege: `docs/staging/evidence/phx-home-origin-20261118/hosted-origin-jwt-results.json` und `deployed-function-v4.json`.

### Verifizierter Browser-Datenweg

BESTANDEN im Cloud-Chrome-Browser, kein Android-Gerätetest:
1. Feste HOME-Adresse geöffnet, erwarteter anonymer Zustand „Profil“ / „—“.
2. Bestehendes HOME-Anmeldeformular geöffnet. Anmeldung über sichere Browser-Eingabe; keine Zugangsdaten gelesen, protokolliert oder in Projektdateien gespeichert.
3. Echter Profilabruf liefert die eigene Spieler-ID **291410048**, **FaQu**, Königreich **1885**, Allianz **NXS**, Power **194887139**. Status „Verified profile · MightPulse“.
4. Quelle erfasst **18.11.2026 04:50:34 UTC**, zuerst geprüft **04:50:34 UTC**. Nur diese konkrete Beobachtung dokumentiert, keine konstanten Benutzerwerte eingebaut.
5. Profilbild öffnet War Room. Commander Profile zeigt denselben Namen, dieselbe Allianz, dasselbe Königreich, Spieler-ID, Erfassungsdatum und verifizierte Power. Fehlendes Level bleibt unbekannt.
6. Echter Refresh im War Room erfolgreich, Checked-Zeit auf **04:51:13 UTC** aktualisiert; Quellzeit unverändert **04:50:34 UTC**. Kein neues Quellereignis erfunden.
7. Zurück zu HOME erhält die verifizierte Identität.
8. Sign out auf HOME erfolgreich: HOME setzt Profil/—; War Room entfernt Name/Allianz/Königreich/ID/Power und zeigt „Sign in for live data“. Abschließend Rückkehr nach HOME, abgemeldet.

Passende Supabase-Logs: OPTIONS 204 um **04:50:31.712 UTC**, GET 200 um **04:50:34.655 UTC**; Refresh OPTIONS 204 um **04:51:12.944 UTC**, GET 200 um **04:51:13.937 UTC**.
Die serverseitige eigene Spieler-ID-Bindung und Quota-Logik wurden unverändert übernommen. Eine zweite echte fremde/unverknüpfte Sitzung und ein echtes Ausschöpfen der Quota wurden in dieser Runde NICHT GETESTET; lokale negative Handlerfälle sind bestanden.
Eine absichtlich fehlgeschlagene Passwortanmeldung wurde NICHT GETESTET; ungültige JWTs sind ein anderer Testfall.

### Browser-Regressionsprobe und Grenzen

| Bereich | Ergebnis / Grenze |
|---|---|
| HOME → War Room → HOME | BESTANDEN, mit echten Profildaten und nach Logout |
| HOME → Territory → Map → Territory → Reports → Territory → HOME | BESTANDEN |
| Live-Karte | BESTANDEN: 74 / 74 sichtbar, 74 Markierungen im AX-Baum |
| Allianzfilter | BESTANDEN: NXS 11 / 74, Zurücksetzen 74 / 74 |
| Vollbild | BESTANDEN: „Karte im Vollbild öffnen“ → „Vollbild schließen“, danach geschlossen |
| Zoom | NICHT VOLLSTÄNDIG GETESTET: +-Knopf betätigt, keine belastbare Messung der Zoomtransformation; unverändertes viewBox allein beweist keinen Defekt |
| Reports | BESTANDEN: 74 Datensätze aus Karte, 12 Allianzen, Rückweg |
| HOME → PYLON → HOME | BESTANDEN; Zurück-Beschriftung nennt Territory, tatsächlicher Rückweg ging nach HOME |
| Transfer aus PYLON | FEHLGESCHLAGEN für Integrationsziel dieser Webfassung: in der geöffneten PYLON-Ansicht nur Originalgrafik und Zurückbutton, kein Transfer-Einstieg sichtbar. Vorhandenes Transfer-Modul wurde nicht verändert oder als fehlend eingestuft. Aktuelle Webfassung nicht mit späterem Auditbranch gleichsetzen. |
| Map JSON/CSV | FEHLGESCHLAGEN für vollständiges Integrationsziel der Webfassung: keine JSON-/CSV-Bedienelemente im vollständigen Map-AX-/DOM-Baum; tatsächlicher Export NICHT GETESTET. Fester Webworkflow integriert derzeit die vorhandene Export-Schicht nicht. Bestehenden nativen Exportcode erhalten und später in Test-Webpaket integrieren. |
| Reports-CSV | NICHT GETESTET; Matrix-CSV-Schaltfläche vorhanden |
| Grafische Quellen | Keine Originalgrafik oder geschützte Territory-Gestaltung geändert |
| HOME-Layout | NICHT ABGENOMMEN: vollständiger Seitenscreenshot zeigt unter HOME Teile der Territory-Szene; Root-/Overflow-Ursache noch zu messen. Live-Profil auf HOME wirkt weiterhin gestalterisch unvollständig. |
| Android / Namensmatrix | NICHT GETESTET: Cloud-Desktop-Browser ersetzt keinen Android-/WebView-Nachweis |
| War Room Gesamtfunktion | NICHT ABGENOMMEN: Account Assessment unavailable; Alliance Position/Development bleiben offene vorhandene Punkte |

Interne Browser-Screenshots erfasst (HOME-Plaketten, HOME-Liveprofil, War-Room-Liveprofil). Keine Zugangsdaten oder Auth-Tokens enthalten. Kein neuer Android-Screenshot behauptet.
Der lokale Chromium-Start für mobile Automation scheiterte an einer Socket-Beschränkung der Laufzeit. Stattdessen wurde der verfügbare Cloud-Chrome-Browser für die oben ausdrücklich bezeichneten Desktopprüfungen verwendet; keine mobile Emulation behauptet.

### Aktualisierter nächster Schritt

Origin-Blocker behoben und Live-Datenweg für das eigene genehmigte Konto nachgewiesen. Nächster Arbeitsblock bleibt HOME: dynamische Namensmatrix und Android-Darstellung, oberer Abstand/Root-Überlauf messen, dann die bereits erfassten HOME-Designentscheidungen mit dem Projektverantwortlichen abstimmen. Danach bestehenden War Room und bestehende Module integrieren. Keine neue Produktiv-, FREEZE- oder Berechtigungsfreigabe aus dieser Origin-Zustimmung ableiten.

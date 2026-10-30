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

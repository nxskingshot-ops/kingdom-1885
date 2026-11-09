# PHALANX Account Management V2 · Prüfprotokoll

**09.11.2026 · TEILWEISE TECHNISCH GETESTET · Freigabe offen**

## Versionen und Schutz

- Arbeitsbranch `work/phx-registration-status-ui-20261109`. Baseline `6c4eda9ded514a114cf6af98995d00bed4fff143`, Backend-Korrektur `00d0da602fb40be071ac5663457a26486f2d1c0d`, UI-Korrektur `3570ac25b37bb5f2219ce9d1872f373a7e06da94`.
- Staging `stage/transfer-live-rankings-20261103` vor und nach dem UI-Commit auf `134cd53b323d45c84e6538e2a0ef424ed0389cf3`. Bestehender Transfer-Einstieg nutzt weiterhin seinen bestehenden Auth- und Mitgliedschaftspfad.
- Vercel-Projekt `prj_XRX2lvA6YQ4YtT9GG53vy5dt2Kt5`, Deployment `dpl_Rj255mrAjFCGiB3xBRdyD2qae6d7`, READY, Preview, SSO aktiv. Acht Dateiprüfsummen stimmen mit der GitHub-Baseline überein. `index.html` und `test-sign-in.html` sind identisch. Die Vorschau enthält die spätere UI-Korrektur noch nicht.
- Supabase ausschließlich `yuyvmbdybwpwpqsipfjt`, eu-central-1, ACTIVE_HEALTHY. Drei Registrierungsmigrationen `20261109083530`, `20261109083533`, `20261109083535`. `phx-registration-v2` Version 2 ACTIVE mit JWT-Prüfung. Bereitgestellter Quelltext stimmt mit GitHub überein. Die historischen Entwurfsnamen der drei SQL-Dateien geben ihren isolierten Ausführungsstatus nicht wieder.
- Der einzige geänderte Anwendungscode liegt im isolierten Verzeichnis `deploy/phalanx-kvk-test/pylon-ix/isolated-account-test/`. Produktionsprojekt, Rollen im Arbeitsprojekt, geschützte Navigation und Design-Dateien wurden in diesem Durchlauf nicht bearbeitet.

## Testmatrix

| Prüfung | Ergebnis | Ausführung und Beleg |
|---|---|---|
| GitHub, Vercel-Inventar, SSO und isolierte Supabase-Version | BESTANDEN | Git-HEAD und Hashes abgeglichen. Vercel leitet ohne autorisierte Sitzung zur SSO-API um. Isolierte Edge-Quelle ist bytegleich mit GitHub. |
| Auth-Konfiguration und vorhandener Bestand | BESTANDEN | Öffentliche Auth-Einstellungen erlauben E-Mail-Signup und verlangen Bestätigung. Vor dem Lauf 15 Auth-Konten, davon 11 bestätigt. Keine bestehenden Konten verwendet. SMTP-Konfiguration war über den verfügbaren Zugriff nicht einsehbar. |
| RLS und direkte Lesegrants | BESTANDEN | Alle vier Registrierungstabellen mit RLS. `anon` und `authenticated` haben kein direktes SELECT. |
| Vorschau mit autorisiertem SSO im Browser öffnen | NICHT GETESTET | Kein verwendbarer SSO-Zugang für den Browsertest. Der automatische Browserlauf mit Live-Anmeldung wurde wegen Dritt-Hosts durch die automatische Freigabeprüfung blockiert. Separater Browserlauf ohne externe Netzverbindungen und getrennte Live-API-Tests durchgeführt. |
| Registrierungsformular und Eingabevalidierung | BESTANDEN | Lokales Chromium, Pixel-7-Emulation, simulierte Auth-Antwort. Navigation, Passwortanzeige, Rückmeldung und Spieler-ID-Eingabe geprüft. |
| Gehosteter Signup mit reservierter Testadresse | FEHLGESCHLAGEN | HTTP 400, `email_address_invalid`. Null Kontozeilen für den Versuch. Diese Adresse war bewusst kein erreichbares Postfach. Reguläre Registrierung mit zugelassener Adresse bleibt offen. |
| Öffentliche Registrierung mit zustellbarer Testadresse | NICHT GETESTET | Kein bereitgestelltes, autorisiertes Testpostfach. |
| E-Mail-Bestätigung per Einmallink | BESTANDEN | Nur isolierte synthetische Auth-Fixture. Vor Bestätigung Login 400 `email_not_confirmed`. Gültiger Token erzeugt über gehostetes Auth eine Sitzung. Wiederholung 303 mit `otp_expired`, ohne Sitzung. |
| Rücksprung aus erfolgreicher Bestätigung | FEHLGESCHLAGEN | Für die angeforderte Vercel-Statusseite liefert der gültige Bestätigungslink HTTP 303 an `/functions/v1/phx-auth-test-return` im Testprojekt. Exakte Vorschau-URL im isolierten Auth-Dashboard abgleichen. |
| Anmeldung mit realer Supabase-Sitzung | BESTANDEN | Drei frische synthetische Konten, Passwort-Auth über gehostetes Supabase jeweils HTTP 200. Die reale Sitzung im geschützten Vercel-Browser bleibt offen. |
| Antrag und Status | BESTANDEN | Drei Anträge über die aktive Edge Function. Nach Übermittlung `pending`, nach Entscheidung `approved` bzw. `rejected`. Getrennt dazu Browser-Status mit simulierten Antworten geprüft. |
| Direkter Zugriff ohne Sitzung | BESTANDEN | Live-Edge HTTP 401 für Review-Warteschlange. Preflight der Vercel-Origin HTTP 200 mit passenden CORS-Headern. |
| Authentifizierter Zugriff ohne Prüferrecht | BESTANDEN | Live-Edge HTTP 403 für Warteschlange und Entscheidung. |
| Explizit berechtigter Prüfer | BESTANDEN | Live-Edge HTTP 200. Die Warteschlange enthielt drei eigene synthetische Anträge. Nach beiden Entscheidungen wurde jeweils der erledigte Antrag entfernt. |
| Selbstfreigabe | BESTANDEN | Live-Edge HTTP 403 auch bei explizit gesetztem synthetischen Prüferrecht. |
| Doppelter Antrag während `pending` | BESTANDEN | Live-Edge HTTP 200 mit `already_pending: true` und identischer Antrags-ID. |
| Gleichzeitige Antragstellung und erneuter Antrag nach Genehmigung | NICHT GETESTET | Der wiederholte Antrag wurde sequenziell mit noch offenem Antrag geprüft. |
| Genehmigung und Ablehnung | BESTANDEN | Live-Edge und echte JWTs. HTTP 200, `access_granted: false`. Beide Entscheidungen und Outbox-Einträge belegt. Separat Browserdialog, Buttons und Statuswechsel mit simulierten Antworten geprüft. |
| Doppelte Entscheidung | BESTANDEN | Live-Edge HTTP 409. |
| Ungültige Spieler-ID | BESTANDEN | Live-Edge HTTP 400 für `abc`. Browser blockiert ungültige Eingabe vor API-Aufruf. |
| Fehlende oder nicht erneuerbare Sitzung in der Statusansicht | BESTANDEN | Baseline zeigte in beiden Browserfällen fälschlich eine Störung. Nach UI-Korrektur in isoliertem Commit zeigen beide `Sign in required`. Live-Auth wies alle drei widerrufenen Refresh-Tokens mit HTTP 400 `refresh_token_not_found` ab. |
| Ablauf eines signierten Access-JWT | NICHT GETESTET | Fehlende Sitzung und widerrufener Refresh-Token geprüft. Natürlicher Ablauf eines zuvor gültigen Access-JWT nicht abgewartet. |
| Fehlerhafte Netzwerkantwort | BESTANDEN | Chromium mit simuliertem HTTP 502 und HTML statt JSON. Temporäre Störung korrekt angezeigt, kein Antrag angeboten, erneutes Laden erfolgreich. |
| Mobile Bedienbarkeit | BESTANDEN | Pixel-7-Emulation für Anmeldung, Registrierung, Status und Warteschlange. Kein horizontaler Überlauf an den geprüften Ansichten. Externe Bildanforderung blockiert. |
| Physisches Android und Browser-End-to-End auf Vercel | NICHT GETESTET | Browserproben liefen lokal mit simulierten Antworten. Live-Auth und Edge separat geprüft. |
| Bestehende Mitgliedschaften | BESTANDEN | Prüfsumme der sieben isolierten Mitgliedschaftszeilen vor und nach dem Test identisch. Null Mitgliedschaften für neue Testkonten. Statuspriorität bei vorhandener Mitgliedschaft im Browser mit simulierter Antwort geprüft. |
| Zustellung von Bestätigungs- und Entscheidungs-E-Mails | NICHT GETESTET | Synthetischer Einmaltoken belegt Auth-Bestätigung. Outbox belegt Datenbankeintrag. Zustellung an Postfach offen. |
| Integration und vollständige Regression der bestehenden Transfer-App | NICHT GETESTET | Bestehender Einstieg und geschützter Datenpfad identifiziert. V2 bleibt in separater Account-Vorschau. Kein Merge. |

## Testdaten und Rückweg

Drei eigens erzeugte isolierte Konten wurden nach den Tests abgemeldet und gesperrt. Kontrollabfrage ergab null Sitzungen, nutzbare Einmaltokens, aktive Testprüfer, offene Testanträge oder Testmitgliedschaften. Ein zweiter eigens erzeugter Prüfer schloss den Selbstfreigabe-Testantrag kontrolliert. Die Testanträge und Audit-Ereignisse bleiben nachvollziehbar. Drei synthetische Outbox-Einträge wurden mit `synthetic_test_only` in einen nicht sendebereiten Zustand versetzt. Bestehende Daten wurden nicht gelöscht.

- **Quellcode-Rückweg:** Der unveränderte Baseline-Commit `6c4eda9` und die daraus bereitgestellte Vorschau wurden anhand der Dateiprüfsummen abgeglichen. Bei Bedarf nur den isolierten UI-Commit zurücknehmen.
- **BACKUP ERSTELLT:** In diesem Lauf kein vollständiger Datenbankexport.
- **INTEGRITÄT GEPRÜFT:** Dateiprüfsummen der Vercel-Baseline, Git-Blob der UI-Korrektur und Vorher/Nachher-Prüfsumme der isolierten Mitgliedschaften.
- **WIEDERHERSTELLUNG GETESTET:** In diesem Lauf nicht ausgeführt.

## Offene Freigabeschritte

1. Exakte Status-URL unter Redirect URLs im isolierten Supabase-Projekt verifizieren und ergänzen, bestehende Ziele beibehalten. Mit autorisiertem Vercel-Zugang und zustellbarem Testpostfach den echten E-Mail- und Browserablauf einschließlich Android wiederholen.
2. UI-Korrektur in der isolierten Vorschau gezielt bereitstellen und nachweisen. Danach V2 mit dem bestehenden Transfer-Einstieg integrieren und Login, Mitgliedschaftsschutz, Navigation, Live-Rankings und Scouting regressionsprüfen.
3. Vor produktiver Bereitstellung aktuellen Sicherungs- und Wiederherstellungsnachweis sowie gesonderte Freigabe einholen. Queen Ans R5-Rolle nur nach verifizierter Identität in einem kontrollierten Adminvorgang zuweisen. Der endgültige Einstieg muss auf die bestehende Transfer-App führen.

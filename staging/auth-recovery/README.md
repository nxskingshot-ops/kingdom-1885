# PHALANX Zugangswiederherstellung — vorbereitet, nicht deployed

Nutzer hat die Vorbereitung der Wiederherstellung für sein bestehendes Konto ausdrücklich beauftragt. Kontostatus zuvor lesend geprüft: E-Mail bestätigt, aktive Admin-Mitgliedschaft, keine Sperre oder Ablaufzeit. Keine Passwort-Hashes gelesen.

Separate Stage-Seite: password-recovery.html + password-recovery.js. Bestehende Scouting-Seite unverändert. Rücksetzmail anfordern über Supabase Auth; neue Passworteingabe erst nach PASSWORD_RECOVERY und serverseitigem getUser. Keine Admin-Passwortsetzung, keine Rollenänderung. Neues Passwort muss der Nutzer selbst eingeben und absenden.

BESTANDEN: JavaScript-Syntaxprüfung; HTML-Skriptpfad lokal vorhanden. NICHT GETESTET: E-Mail-Versand/Zustellung, erlaubte Redirect-URL, echte Recovery-Session, Passwortänderung und anschließende Anmeldung.

Vor Versand erforderlich: diese zwei Dateien im bestehenden isolierten Testprojekt bereitstellen und die genaue HTTPS-Callback-URL in Supabase gegen die vorhandene Redirect-Allowlist prüfen. Falls nicht zugelassen, ist eine explizit genehmigte Auth-Konfigurationsänderung erforderlich. Verfügbare Supabase-Tools bieten hier keinen direkten Zugriff auf diese Konfiguration. Keine Allowlist-Einstellung vermuten.

Vercel-Testprojekt kennzeichnet Deployments derzeit als production. Vor Veröffentlichung der Recovery-Erweiterung deshalb konkrete Freigabe einholen. Der bisher genehmigte zeitlich begrenzte Testlink bleibt davon unberührt; sein Ablauf kann auch den Recovery-Zugang blockieren.

KEINE E-MAIL VERSENDET. KEIN PASSWORT GEÄNDERT. Keine produktive Auth-Konfiguration geändert.


## Freigegebene Bereitstellung — 30.10.2026
Nutzer hat nach konkreter Freigabefrage Deployment der Rücksetzseite im isolierten Testprojekt sowie gegebenenfalls Ergänzen ausschließlich ihrer Rücksprungadresse ausdrücklich genehmigt.
Vercel-Deployment dpl_DSJAHtD6pL61ZHYNrYiFMPAN7v9n im bestehenden Projekt prj_XRX2lvA6YQ4YtT9GG53vy5dt2Kt5 ist READY, target=production (isoliertes Testprojekt). Vorheriges Deployment dpl_53nUQsfqe4u54ZbSRaco5gkfMJhi bleibt als Rückweg vorhanden; Rollback NICHT GETESTET. Alle bisherigen Scouting-/Demo-Dateien mit übernommen; zusätzlich password-recovery.html und .js aus Commit e2ecb41825d8b6644cc591d51d7ace11ab091df5.
BESTANDEN: Seite im Browser über genehmigten zeitlich begrenzten Alias-Testzugang geöffnet, Titel PHALANX · Zugang wiederherstellen, E-Mail-Feld und Rücksetzlink-anfordern sichtbar. Callback-Kandidat https://phalanx-r11-atlas-preview.vercel.app/password-recovery.html.
BLOCKIERT: vorhandene Supabase-Anbindung besitzt keine Auth-Konfigurationsoperation. Browser-Dashboard verlangt separate Anmeldung; sichere browserAuth-Anmeldeauswahl resultierte in declined. Keine Wiederholung, keine Umgehung; frischer Seitenzustand bleibt Dashboard-Sign-in.
NICHT GETESTET: Redirect-Allowlist, Mailversand/-zustellung, Recovery-Session, Passwortänderung, anschließender App-Login. KEINE E-MAIL VERSENDET, KEIN PASSWORT GEÄNDERT, KEINE AUTH-KONFIGURATION GEÄNDERT.
Nächster Schritt erst nach vom Nutzer erneut gewähltem Dashboardzugang: exakt Callback-URL lesen/gegebenenfalls autorisiert ergänzen; dann Rücksetzmail an die bekannte Konto-Adresse anfordern. Neues Passwort ausschließlich vom Nutzer selbst eingeben und absenden lassen. Die Mail nicht vor verifiziertem Callback anfordern.


### Erneuter vom Nutzer beauftragter Anmeldeversuch
Nach erneutem Go sichere Supabase-Anmeldeauswahl wieder geöffnet. Ergebnis erneut declined, kein Dashboardzugriff. Kein weiterer automatischer Anmeldeversuch. Callback-Konfiguration unverifiziert; keine E-Mail angefordert, kein Passwort geändert. Bestehende Freigabe bleibt erhalten; Blocker ist die fehlende tatsächliche Dashboard-Anmeldung, keine fehlende Genehmigung.


## Konkrete Callback-Diagnose — 30.10.2026
Ohne neuen Loginversuch aktuelle Browserzustände und Warn-/Fehlerlogs gelesen: Supabase-Dashboard zeigt weiterhin Sign-in, Recovery-Seite zeigt fertiges E-Mail-Formular; kein sichtbarer laufender Spinner in diesen Agent-Tabs. Supabase-Logs nur Feature-Flag-Warnungen; Recovery-Tab nur Browserextension-Metadatenfehler. Kein Nachweis, dass diese Warnungen den vom Nutzer berichteten Hänger verursachen.
Zusätzliche öffentliche Auth-API-Negativprüfung ohne echte Tokens und ohne Follow-Redirect: GET /auth/v1/verify mit absichtlich ungültigem Test-token, type=recovery und redirect_to=https://phalanx-r11-atlas-preview.vercel.app/password-recovery.html. Antwort HTTP303, Location-Ziel (Query/Fragment nicht protokolliert) http://localhost:3000. Callback-Ziel stimmt NICHT mit angefragter Rücksetzseite überein. Erste Prüfvariante mit token_hash auf GET wurde mit HTTP400 validation_failed zurückgewiesen; auf korrekten GET-Parameter token berichtigt, keine Wiederholung danach.
BEWERTUNG: Auth-API nimmt in dieser Prüfung die gewünschte Rücksprungadresse nicht an und verwendet localhost. Das ist ein konkreter Blocker für nutzbare Recovery-Links; nicht als Ursache des früheren Invalid-login-credentials-Passwortfehlers ausgeben. Dashboard-Konfiguration weiterhin nicht lesbar/änderbar ohne authentifizierten Zugriff. Bestehende Genehmigung für genau diese zusätzliche Callback-URL liegt vor. Keine Auth-Konfiguration geändert, kein gültiger Token verwendet, kein Konto angemeldet, KEINE MAIL VERSENDET, KEIN PASSWORT GEÄNDERT.
Nächster Schritt: in Supabase Authentication > URL Configuration ausschließlich die exakte HTTPS-Callback-URL unter Redirect URLs ergänzen und speichern (bestehende Site URL/Einträge erhalten), danach dieselbe einmalige Negativprüfung erneut ausführen. Bei bestätigter Rücksprungadresse die bereits autorisierte Recovery-Mail anfordern.


## Callback bestätigt und Recovery-Mail angefordert — 30.10.2026
Nach Nutzer-Go erneute öffentliche Negativprüfung mit absichtlich ungültigem Token: HTTP303, Rücksprungziel nun exakt https://phalanx-r11-atlas-preview.vercel.app/password-recovery.html. Damit ist der frühere localhost-Fallback für diese genaue Adresse in der aktuellen Prüfung behoben. Konfiguration nicht durch Agent geändert; Screenshot/Nutzeraktion und Laufzeitprüfung getrennt betrachtet. Andere Site-URL-/Allowlist-Einträge wurden nicht inventarisiert.
Anschließend genau einmal die bereits ausdrücklich genehmigte Passwort-Wiederherstellung für die bekannte Konto-Adresse über Supabase Auth POST /auth/v1/recover mit genau dieser redirect_to-Adresse angefordert. HTTP200: Anfrage vom Auth-Dienst angenommen. Keine geheimen Tokens oder Antwort-Sessions ausgelesen/gespeichert. Kein Passwort gesetzt. Kein Wiederholungsversand.
BESTANDEN: konkrete Callback-Rückleitung, Annahme der Recovery-Mail-Anfrage. NICHT BESTÄTIGT: Zustellung/Empfang und Inhalt der E-Mail. NICHT GETESTET: gültige Recovery-Session, neue Passworteingabe/-speicherung durch Nutzer, anschließender App-Login sowie geschützte Scouting-E2E-Tests. Nächster Schritt liegt beim Nutzer: Postfach/Spam prüfen und über Mail-Link neues Passwort selbst setzen, vorzugsweise im selben Browser mit bestehendem zeitlich begrenztem Vercel-Testzugang. Keinen E-Mail-Link oder neues Passwort in den Chat kopieren.

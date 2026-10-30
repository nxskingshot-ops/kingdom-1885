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

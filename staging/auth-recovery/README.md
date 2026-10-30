# PHALANX Zugangswiederherstellung — vorbereitet, nicht deployed

Nutzer hat die Vorbereitung der Wiederherstellung für sein bestehendes Konto ausdrücklich beauftragt. Kontostatus zuvor lesend geprüft: E-Mail bestätigt, aktive Admin-Mitgliedschaft, keine Sperre oder Ablaufzeit. Keine Passwort-Hashes gelesen.

Separate Stage-Seite: password-recovery.html + password-recovery.js. Bestehende Scouting-Seite unverändert. Rücksetzmail anfordern über Supabase Auth; neue Passworteingabe erst nach PASSWORD_RECOVERY und serverseitigem getUser. Keine Admin-Passwortsetzung, keine Rollenänderung. Neues Passwort muss der Nutzer selbst eingeben und absenden.

BESTANDEN: JavaScript-Syntaxprüfung; HTML-Skriptpfad lokal vorhanden. NICHT GETESTET: E-Mail-Versand/Zustellung, erlaubte Redirect-URL, echte Recovery-Session, Passwortänderung und anschließende Anmeldung.

Vor Versand erforderlich: diese zwei Dateien im bestehenden isolierten Testprojekt bereitstellen und die genaue HTTPS-Callback-URL in Supabase gegen die vorhandene Redirect-Allowlist prüfen. Falls nicht zugelassen, ist eine explizit genehmigte Auth-Konfigurationsänderung erforderlich. Verfügbare Supabase-Tools bieten hier keinen direkten Zugriff auf diese Konfiguration. Keine Allowlist-Einstellung vermuten.

Vercel-Testprojekt kennzeichnet Deployments derzeit als production. Vor Veröffentlichung der Recovery-Erweiterung deshalb konkrete Freigabe einholen. Der bisher genehmigte zeitlich begrenzte Testlink bleibt davon unberührt; sein Ablauf kann auch den Recovery-Zugang blockieren.

KEINE E-MAIL VERSENDET. KEIN PASSWORT GEÄNDERT. Keine produktive Auth-Konfiguration geändert.

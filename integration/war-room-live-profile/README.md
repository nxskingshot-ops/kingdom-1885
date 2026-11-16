# PHALANX War Room · eigenes Spielerprofil

Stand 16.11.2026. Der SQL-Resolver und die Edge Function sind im freigegebenen Supabase-Testprojekt bereitgestellt. Die V2.7-APK nutzt diese Schnittstelle noch nicht.

## Ablauf

1. Der Android-Client ruft künftig `GET phx-war-room-own-profile` mit dem Access-Token der angemeldeten Sitzung auf. Der Endpunkt akzeptiert keine vom Client angegebene Spieler-ID.
2. PostgREST prüft das Token. `phx_war_room_current_player_id()` löst die eigene ID aus einer abgeschlossenen, bestätigten Einladung auf. Die Funktion verlangt das bestätigte Auth-Konto sowie eine aktive, gültige Mitgliedschaft. Fehlende oder mehrdeutige Zuordnungen ergeben keinen Treffer. Anonyme und Service-Role-Aufrufe haben keine Ausführungsberechtigung. Veränderbare Auth-Metadaten werden nicht ausgewertet.
3. Der Endpunkt gibt ausschließlich das eigene Profil aus dem vorhandenen Spieler-Lookup zurück. Die Lookup-Berechtigung der Sitzung bleibt wirksam. Die Antwort enthält die verifizierte Spieler-ID und unterscheidet `capturedAt` (Quellenerfassung) und `checkedAt` (Abruf). Bei veralteten, unbekannten oder widersprüchlichen Quellzeiten enthält die Antwort keine aktuellen Profilwerte.
4. Der spätere War-Room-Client rendert Power nur bei `freshness: "fresh"` und vorhandener Power. Fehlende Quellzeiten werden als unbekannt angezeigt. Lokale Profilwerte bleiben als solche erkennbar.

Freigabeoffen ist insbesondere, wie bestehende Konten ohne bestätigten Einladungsdatensatz sicher ihrer Spieler-ID zugeordnet werden. Die Zuordnung erfolgt nicht anhand der eingegebenen ID, des Anzeigenamens oder einer unbestätigten Registrierung.

## Nachweis

| Prüfung | Ergebnis |
|---|---|
| PostgreSQL im vorhandenen Projekt `phalanx-security-isolated-test` | Sechs Identitätsfälle und die Rechte für `anon` und `service_role` bestanden. Funktion und Testkonten nach `ROLLBACK` nachweislich entfernt. |
| Server-Handler mit simulierten HTTP-Antworten | Sieben Node-Tests bestanden. Abgedeckt sind Android-Origin, Sitzung, fremde Spieler-ID, Identitätsabweichung, Datenfrische und Power-Präzision. |
| Gehosteter Endpunkt mit echten Testsitzungen | Bestanden. Passwortanmeldung beider synthetischen Konten HTTP 200, Android-CORS-Preflight 204, anonymer Aufruf 401. Der Resolver lieferte dem verknüpften Konto die eigene synthetische ID und beim unverknüpften Konto keinen Treffer. Der Endpunkt verweigerte das unverknüpfte Konto mit 403 und einen Spieler-ID-Parameter mit 400. |
| Gehostete Live-Quelle und Android-App | Offen. Das verknüpfte Konto erreicht die Quellenabfrage. Der Endpunkt antwortet mit 503 `profile_source_unavailable`. Die vorhandene Transfer-Bridge ist im isolierten Projekt nicht bereitgestellt. |
| APK / bestehende Module | V2.7 bleibt letzter installierbarer Teststand. In diesem Branch wurden nur die Dateien der neuen serverseitigen Integration ergänzt. |

Lokaler Test: `node --test integration/war-room-live-profile/handler.test.mjs`. SQL-Test: Den letzten `commit;`-Schritt der SQL-Datei beim isolierten Test durch `current-player-link.test.sql` ersetzen. Dieser Test schließt mit `rollback;` und einer Prüfung auf zurückgerollte Änderungen ab.

## Nächster vollständiger Test

Die autorisierte Spielerquelle im isolierten Projekt anbinden und anschließend den Abruf mit einer freigegebenen Android-Testsitzung prüfen. Der vorhandene Quelladapter erwartet einen serverseitig hinterlegten Mighty-Pulse-Schlüssel (`MIGHTPULSE_API_KEY`). Für diese Runde wurde keine Spielerquelle bereitgestellt.

## Deployment und Testdaten

- Testprojekt `phalanx-security-isolated-test` (`yuyvmbdybwpwpqsipfjt`), Migration `phx_war_room_current_player_link`, Edge Function `phx-war-room-own-profile`, Version 1, JWT-Prüfung aktiv.
- PostgreSQL-Verifikation nach der Migration ergab Ausführungsrecht für `authenticated`, kein Ausführungsrecht für `anon` und `service_role`.
- Nach der Prüfung wurden beide temporären Testkonten und ihre Datensätze entfernt. Die Nachkontrolle ergab jeweils null verbleibende Konten, Mitgliedschaften, Zuordnungen und Sitzungen. Der Profil-Resolver blieb bereitgestellt.

## MightPulse-Anbindung im isolierten Testprojekt

Der War-Room-Endpunkt verwendet für die bestätigte eigene Spieler-ID den MightPulse-Basisabruf (Name, Königreich, Allianz und Power). Die bisherige Transfer-Bridge ist davon unabhängig. Der API-Schlüssel gehört als `MIGHTPULSE_API_KEY` in die Edge-Function-Secrets des Testprojekts. Die bestehende Kontoprüfung und ein separates Limit von 20 Aufrufen pro Konto und UTC-Stunde liegen vor dem Anbieterabruf. Der Anbieter erhält nur die ermittelte Spieler-ID und seinen API-Schlüssel.

Neun Handler-Tests mit simulierten Antworten bestanden. Der PostgreSQL-Test bestätigte die Ablehnung eines unverknüpften Kontos, 20 erlaubte Aufrufe und die Ablehnung des nächsten Aufrufs. Die SQL-Testtransaktion wurde vollständig zurückgerollt. Der Abruf mit einem echten MightPulse-Testschlüssel und die Android-Anzeige stehen aus.

### Live-Nachweis · 16.11.2026

- Im isolierten Projekt wurde die Migration `phx_war_room_mightpulse_quota` angewendet und `phx-war-room-own-profile` als Version 3 mit aktiver JWT-Prüfung bereitgestellt. Quellstand `427f750c5f0390810260cd8da15abf9847afcc2f`. Die vorherige Funktionsfassung ist im Git-Stand `8612b5639837f9690d3d2b399c55f1fa0ed555e8` enthalten.
- **BESTANDEN:** Anmeldung mit temporärem Supabase-Testkonto sowie anschließender eigener Profilabruf mit Android-Origin `https://localhost` jeweils HTTP 200. Der Server lieferte für die im Test zugeordnete Spieler-ID 291410048 FaQu, Königreich 1885, NXS und Power 190.778.224. Die Quelle meldete `fresh`, Erfassungszeit 06:32:25.503 UTC, Abrufzeit 06:32:25.629 UTC. Dieser Nachweis verwendet eine authentifizierte HTTP-Testsitzung mit Android-Origin.
- **BESTANDEN:** Nach Bereinigung null verbleibende Datensätze des Testkontos in Konten, Sitzungen, Mitgliedschaften, Zuordnungen und Abruflimits.
- **NICHT GETESTET:** Geräteanzeige. V2.7 enthält keinen Client für diese Anbindung. Der nächste App-Schritt ist die Android-Anmeldung im Testprojekt und das Rendern des verifizierten eigenen Profils im War Room.

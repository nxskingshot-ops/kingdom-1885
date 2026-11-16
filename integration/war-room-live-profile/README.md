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

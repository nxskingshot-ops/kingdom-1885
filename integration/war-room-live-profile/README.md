# PHALANX War Room · eigenes Spielerprofil

Stand 16.11.2026. Serverseitige Anbindung auf dem isolierten GitHub-Branch. Die V2.7-APK und der Produktionsbetrieb verwenden weiterhin ihren bisherigen Stand.

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
| Gehosteter Endpunkt, echte Android-Anmeldung und Live-Quelle | Offen. Im vorhandenen isolierten Supabase-Projekt ist die tatsächlich eingesetzte Spieler-Lookup-Bridge nicht verfügbar. Der Handler sendet nur an den konfigurierten Projektursprung. |
| APK / bestehende Module | V2.7 bleibt letzter installierbarer Teststand. In diesem Branch wurden nur die Dateien der neuen serverseitigen Integration ergänzt. |

Lokaler Test: `node --test integration/war-room-live-profile/handler.test.mjs`. SQL-Test: Den letzten `commit;`-Schritt der SQL-Datei beim isolierten Test durch `current-player-link.test.sql` ersetzen. Dieser Test schließt mit `rollback;` und einer Prüfung auf zurückgerollte Änderungen ab.

## Nächster vollständiger Test

Den eigenen Profil-Endpunkt und den SQL-Resolver in der vorhandenen isolierten Umgebung bereitstellen und dort die autorisierte Spielerquelle anbinden. Danach mit einer freigegebenen Testsitzung in Android prüfen. Eine explizite Freigabe für Datenbankänderungen und Deployment ist laut Projektübergabe erforderlich. Der bestehende Transfer-Endpunkt und die produktive Datenbank wurden in dieser Runde lesend geprüft.

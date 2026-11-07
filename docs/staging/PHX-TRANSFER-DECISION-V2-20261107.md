# PHALANX Transfer Scouting · Decision V2

**Feature-ID** PHX-TRANSFER-DECISION-V2 · 07.11.2026
**Arbeitsbranch** `stage/transfer-live-rankings-20261103`
**Rücksprungpunkt** `15a01d9b7108f952e9e3699341face62d393abf7`

## Integration

Die vorhandene Spieler-ID-Ansicht rendert die V2-Entscheidungsübersicht direkt nach der geschützten Abfrage. Die Karte zeigt Identität, sechs Kennzahlen, eine begründbare Einstufung, Profil, belegte Stärken und Entwicklungsbereiche. Kills, die Arena-Aufstellung, genaue Werte, die Bewertungsmethode, das provisorische SEA-WORLD-Modell und Zeitstempel sind in den Nachweisen zugänglich. Die bestehenden Vergleichs-, Kandidaten- und Tool-Pfade werden weiterverwendet. Header, PHALANX-Navigation außerhalb von Transfer Scouting, Backend, Daten und Rechte gehören zum geschützten Bestand.

Für Kingdom-#1885-Spieler ist ihre unterstützte Allianz vorausgewählt, sonst NXS. Der Einzelvergleich startet mit dem stärksten dokumentierten Zielallianz-Spieler nach Total Power, sofern verfügbar. Die vorhandene Filterung und die direkte Abfrage per ID bleiben zugänglich. Historische Kader werden bei identischem Stichtag anhand von Mitgliederzahl, eindeutigen IDs und Power-Summe auf Vollständigkeit geprüft. Der aktuelle Kandidat wird per Governor-ID aus der Vergleichsmenge entfernt, falls er im historischen Kader enthalten ist. Gleichstände zeigen einen Rangbereich. Der Kingdom-Top-100-Auszug bleibt separat und wird als Teilstichprobe ausgewiesen. Datum, Quelle und Zeitpunkt des Kandidatenwerts sind abrufbar.

Die vier KvK-Rollen zeigen Prüfprioritäten anhand ausgewählter Kingdom-Top-15-Werte. Ihre Freigabe erfordert rollenbezogene Kampfnachweise. Insbesondere sind Kampfbuffs und Battle Reports über diese Ansicht nicht verfügbar. Die Profil- und Rangschwellen sind dokumentierte Staging-Regeln.

## Nachweis vor Veröffentlichung

| Prüfung | Ergebnis | Umfang |
|---|---|---|
| Quellstand / HTTPS-Baseline | BESTANDEN | HTML und Haupt-JS waren bytegleich zum Basis-Commit. Governance-Handoff, Master-Register und Header-FREEZE geprüft. |
| Backup erstellt, Integrität geprüft, Wiederherstellung getestet | BESTANDEN | Basis-Git-Bundle erstellt und mit `git bundle verify` geprüft. Abruf in ein leeres Repository gelang. Das wiederhergestellte Hauptskript war bytegleich zur HTTPS-Baseline. Umfang ist der Codebestand. |
| Originalpaket | BESTANDEN | ZIP-Integrität und 13/13 isolierte Originalassertions. |
| Syntax, Asset-Preflight, V2- und Rankingsregressionen | BESTANDEN | Geänderte JS-Dateien, bestehender Cloudflare-Preflight, 10 V2-Fälle und 11 Rankingfälle. |
| Browserfunktion mit Testdaten | BESTANDEN | Chromium mit geladenem Supabase-JS-SDK und simulierten API-Antworten. Gast, Admin, Member, inaktive Mitgliedschaft, ID-Abfrage mit Fehlerfall, Datenlücken, sechs Kennzahlen, KvK-Rollen, Rankings, historischer Kader und Teilstichprobe, Einzelvergleich inkl. ID, Kandidat hinzufügen/neu laden, Dossier und Tools. |
| Mobile Darstellung | BESTANDEN | Browser-Emulation bei 320, 390 und 430 CSS-Pixeln, zusätzlich 1280. Kein horizontaler Überlauf bei geschlossenen Nachweisen. Gleiche 390-Pixel-Testdaten: Ergebnisbereich 2019 → 592 CSS-Pixel Höhe. |
| Reale Daten, lesender Abgleich | BESTANDEN | Vier historische Kader vom 13.10.2026 mit insgesamt 395 eindeutigen Spielerzeilen innerhalb ihrer jeweiligen Allianz. Jede Power-Summe und Mitgliederzahl passte. Das Ranking-RPC liefert ausdrücklich einen Kingdom-Top-100-Ausschnitt. |
| Reale geschützte Endpunkte ohne Sitzung | BESTANDEN | Spielerabfrage und Einzelvergleich lehnten den Gast jeweils mit HTTP 401 ab. |
| Authentifizierter Live-Lauf, Live-Speichern und Android-Gerät | NICHT GETESTET | Der Browser-Funktionstest verwendet Testdaten und eine simulierte Sitzung. Ein persönlicher Admin-Login und ein physisches Android-Gerät stehen für diesen Nachweis aus. |

Wiederholbare Tests: `node --test scripts/test_phx_transfer_decision_v2.mjs` und `node --test deploy/phalanx-kvk-test/pylon-ix/*test.mjs`.
Staging: [Transfer Scouting öffnen](https://stage-transfer-live-rankings.nexus-phalanx-kvk-test.pages.dev/pylon-ix/transfer-scouting-id-stage-20261030.html).

Rückweg bei Bedarf: V2-Commit auf dem Staging-Branch per Revert zurücknehmen. Der vorhandene Cloudflare-Testworkflow übernimmt den Rückstand. Die Basis-SHA identifiziert den geprüften Rücksprungpunkt.

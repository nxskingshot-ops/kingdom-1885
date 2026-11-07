# PHALANX Transfer Scouting · Decision V2

**Feature-ID** PHX-TRANSFER-DECISION-V2 · 07.11.2026
**Arbeitsbranch** `stage/transfer-live-rankings-20261103`
**Rücksprungpunkt** `15a01d9b7108f952e9e3699341face62d393abf7`

## Integration

Die vorhandene Spieler-ID-Ansicht rendert die V2-Entscheidungsübersicht direkt nach der geschützten Abfrage. Die Karte zeigt Identität, sechs Kennzahlen, eine begründbare Einstufung, Profil, belegte Stärken und Entwicklungsbereiche. Kills, die Arena-Aufstellung, genaue Werte, die Bewertungsmethode, das provisorische SEA-WORLD-Modell und Zeitstempel sind in den Nachweisen zugänglich. Die bestehenden Vergleichs-, Kandidaten- und Tool-Pfade werden weiterverwendet. Header, PHALANX-Navigation außerhalb von Transfer Scouting, Backend, Daten und Rechte gehören zum geschützten Bestand.

Für Kingdom-#1885-Spieler ist ihre unterstützte Allianz vorausgewählt, sonst NXS. Der Einzelvergleich startet mit dem stärksten dokumentierten Zielallianz-Spieler nach Total Power, sofern verfügbar. Die vorhandene Filterung und die direkte Abfrage per ID bleiben zugänglich. Wenn die geschützte Ranglisten-Spielerliste ausfällt, befüllen geschützte historische Allianzstände die Auswahl. Der stärkste verfügbare Vergleichsspieler wird dann über die bestehende Spieler-ID-Abfrage aktualisiert. Historische Kader werden bei identischem Stichtag anhand von Mitgliederzahl, eindeutigen IDs und Power-Summe auf Vollständigkeit geprüft. Der aktuelle Kandidat wird per Governor-ID aus der Vergleichsmenge entfernt, falls er im historischen Kader enthalten ist. Gleichstände zeigen einen Rangbereich. Der Kingdom-Top-100-Auszug bleibt separat und wird als Teilstichprobe ausgewiesen. Datum, Quelle und Zeitpunkt des Kandidatenwerts sind abrufbar.

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
| Browser-Rückweg bei Ausfall der Spielerliste | BESTANDEN | Simulierter Netzwerkfehler beim Listen-Endpunkt. Die historischen Kader befüllten die Auswahl und der stärkste andere Zielallianz-Spieler wurde über seine ID aktualisiert. |
| Reale geschützte Endpunkte ohne Sitzung | BESTANDEN | Spielerabfrage und Einzelvergleich lehnten den Gast jeweils mit HTTP 401 ab. |
| Authentifizierter Live-Lauf, Live-Speichern und Android-Gerät | NICHT GETESTET | Der Browser-Funktionstest verwendet Testdaten und eine simulierte Sitzung. Ein persönlicher Admin-Login und ein physisches Android-Gerät stehen für diesen Nachweis aus. |

Die automatisierten Tests lassen sich wiederholen mit `node --test scripts/test_phx_transfer_decision_v2.mjs` und `node --test deploy/phalanx-kvk-test/pylon-ix/*test.mjs`.
[Staging · Transfer Scouting öffnen](https://stage-transfer-live-rankings.nexus-phalanx-kvk-test.pages.dev/pylon-ix/transfer-scouting-id-stage-20261030.html).

Zum Rückbau die V2-Änderungen auf dem Staging-Branch per Revert zurücknehmen. Der vorhandene Cloudflare-Testworkflow veröffentlicht den wiederhergestellten Stand. Die Basis-SHA identifiziert den geprüften Rücksprungpunkt.

Beim HTTPS-Test erlaubte die Spieler-ID-Schnittstelle die Staging-Herkunft. Die CORS-Antwort für die separate #1885-Spielerliste gab eine andere Herkunft an und verhindert damit den Zugriff von dieser Staging-Adresse. Der Rückweg nutzt die bereits geschützten Allianz- und Spieler-ID-Abfragen mit derselben Sitzung.


## Korrektur der mobilen Ergebnisansicht

Der Android-Live-Test zeigte eine aktive FaQu-Admin-Sitzung. Ein erster Abruf endete im Browser mit einer Fehlermeldung, während der Server nach rund 62 Sekunden HTTP 200 protokollierte. Der nächste übermittelte Android-Screenshot zeigte KomaR (`290591005`) mit sechs Kennzahlen, 24 Rankingmetriken und der historischen NXS-Einordnung. Der Nutzer lehnte die dargestellte braune Ergebniskarte ab. Dieser Screenshot bestätigt den Abruf und die Anzeige im davor veröffentlichten Stand.

Die Darstellung orientiert sich wieder am Staging-Stand vor V2 (`15a01d9`). Neben der Identität stehen SEA-WORLD-V2-Sterne und Kategorie, soweit die vorhandene Bewertungslogik sie stützt. Total Power, Castle/TG und True Power bilden die obere Reihe, gefolgt von Master, Pet und Hero Power. Das PYLON-IX-Urteil und die Rangbalken sind direkt sichtbar. True Power hat wieder einen eigenen Nachweisdialog. Die Datenabfrage, die V2-Auswertung und der Allianzvergleich mit historischem Rückweg sind dieselben wie im vorherigen Staging-Stand.

Chromium mit Testdaten bei 320, 390, 430 und 1280 CSS-Pixeln prüfte Kennzahlenreihenfolge, SEA-WORLD-Kategorie und Sterne, fehlende Rangdaten, Dialog inklusive Escape, Rangbalken, Allianzplatzierung und Vergleichsrückweg. Bei geschlossenen Nachweisen trat kein horizontaler Überlauf auf. Die korrigierte Ergebnisansicht wurde noch nicht auf dem physischen Android-Gerät abgenommen.

## Drei-Kachel-Ansicht und belegte Vergleiche · 07.11.2026

**Basis und Rückweg** · `59e36ac14e64ff261c5ec568467c4bc80434aedf` auf `stage/transfer-live-rankings-20261103`. HTML, Haupt-JS und Decision-CSS stimmten bytegenau mit der bereitgestellten Cloudflare-Version überein. Governance-Handoff, Master-Register, Header-FREEZE und A040/A041 wurden abgeglichen. Der Auftrag beschreibt die Screenshot-Referenz vollständig in Textform. Die eigentliche Bilddatei lag bei der Prüfung nicht vor. Der ältere, im Code verlinkte Entwurf zeigt das HOME und ist keine Referenz für Player Intelligence.

- Die Spieleransicht zeigt ausschließlich Total Power, True Power und Castle/TG, in dieser Reihenfolge. Master, Pet und Hero Power bleiben in Bewertung, Rankings und Nachweisen verfügbar. Review Player Data, Spielerkopf und Rangbalken bleiben erhalten.
- Die zentrale Bewertung zeigt belegte Stärken und schwächere Kategorien, Profildaten und eine vorrangig zu prüfende KvK-Rolle mit Indikatoren. Gleich belegte Rollen werden gemeinsam vorgeschlagen. Die vier Rollen haben getrennte Kriterien und Nachweise. Kampfbuffs und Battle Reports bleiben für eine Rollenbestätigung erforderlich.
- SEA WORLD verwendet unveränderte Gewichtungen und Schwellen. Die Darstellung stellt die in `15a01d9` belegte Plus-Konvention und die konservative Stern-/Tier-Anzeige wieder her. Die Anwendung des provisorischen #1885-Modells auf andere Kingdoms ist als solche dokumentiert. Bei unsicherer Einstufung sind Untergrenze und mögliche Obergrenze gekennzeichnet.
- Das Allianzprofil trennt vollständige historische Kader und Teilstichproben. Im vollständigen Kader sind Einordnungsbereich und Abstand zur Top-15-Schwelle sichtbar. Bei unvollständigem Kader bleiben Gesamtplatz und ungesicherte Top-15-Zugehörigkeit offen. Bekannte eigene Datensätze werden anhand der IDs aus dem Vergleich entfernt.
- Im Einzelvergleich werden verfügbare gemeinsame Werte, die größten Abweichungen, Datenabdeckung und mögliche Zeitunterschiede ausgewiesen. Eine manuelle Auswahl bleibt beim Aktualisieren der Liste erhalten, soweit die Identität weiter verfügbar ist. Die ID-Suche bleibt der direkte Zugang für #1885-Spieler außerhalb der Listen. Für Kategorievergleiche mit historischen Top-15-Peers sind mindestens fünf per Governor-ID zugeordnete Werte derselben Erfassung erforderlich. Quelle und Erfassungszeit beider Seiten bleiben getrennt.
- Die Laufzeitänderung betrifft nur die Transfer-HTML (Cachekennung), das Hauptskript, den lokalen Decision-Stylesheet und die zwei vorhandenen Bewertungsmodule. Die Regressionstests in `scripts/test_phx_transfer_decision_v2.mjs` wurden erweitert.

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Staging-Basis und Code-Rückweg | BESTANDEN | Git-Bundle der Basis erstellt, Integrität geprüft, in leeres Repository zurückgelesen und die wiederhergestellte HTML-Datei mit der HTTPS-Basis verglichen. Rückbau der veröffentlichten Änderung über Revert des Staging-Commits und den bestehenden Cloudflare-Workflow. |
| Logik, Ranking-Regressionssuite, Syntax und Asset-Preflight | BESTANDEN | 23 Tests, `node --check`, `python3 scripts/check_phalanx_test_assets.py` und `git diff --check`. |
| Reale Ranking-Daten, nur lesend | BESTANDEN | 26 gespeicherte Boards aus der Erfassung vom 07.11.2026, 01:45:37 UTC, bis zu 100 Einträge je Board. Für KomaR sind 246.603.564 Total Power, 146.714.322 Troop Power und Castle 55 belegt. Daraus folgen 99.889.242 True Power und TG5 5/5. Für boss gab es in den geprüften #1885-Boards keinen Datensatz. |
| Reale Allianzdaten, nur lesend | BESTANDEN | Neuester gespeicherter Kader für NXS, OoO, MYM und FRA vom 13.10.2026. |
| Geschützte ID-Endpunkte ohne Sitzung | BESTANDEN | Staging-Herkunft für die ID-Abfrage erlaubt. Beide Beispiel-IDs liefern ohne Sitzung HTTP 401. |
| Live-#1885-Spielerliste aus Cloudflare | FEHLGESCHLAGEN | Der Listen-Endpunkt erlaubt bei der Vorabfrage eine Vercel-Herkunft und blockiert damit die Cloudflare-Staging-Adresse. Historische Kader und die separate ID-Abfrage bilden den vorhandenen Rückweg. |
| Persönliche Live-Sitzung, Live-Speichern und physisches Android-Gerät | NICHT GETESTET | Für diese Nachweise ist eine berechtigte persönliche Sitzung bzw. ein Gerät erforderlich. |
| Sichtabgleich mit dem exakten Screenshot | NICHT GETESTET | Die Screenshot-Datei war in dieser Übergabe nicht verfügbar. |
| Chromium mit simulierten API-Antworten | BESTANDEN | Echtes Supabase-JS-SDK mit isolierten Testantworten. Gast, Admin, Member und inaktive Mitgliedschaft, ID-Abruf mit 404, Datenlücken, drei Kennzahlen, Orca Elite+ als Fixture, Ranking-Zuordnung, KvK-Rollen, True-Power-Dialog, Allianzwechsel, Rückweg bei Listenfehler, Peer-Kategorien, Einzelvergleich mit Suche und ID, Kandidat speichern und neu laden, Dossier sowie Tools und Rücknavigation. |
| Responsive Ansicht | BESTANDEN | Chromium bei 320, 390, 430 und 1280 CSS-Pixeln. Die Spielerübersicht mit drei Kacheln hatte keinen horizontalen Überlauf. |
| Übrige geschützte App-Routen | NICHT GETESTET | HOME, Territory Control, Reports, Outpost Map und GOD-Mode waren außerhalb der geänderten Transfer-Dateien. |

## Cloudflare-Herkunft für die geschützte #1885-Liste · Korrektur zur Freigabe

**Status** · Lokal getestet, separater Arbeitsbranch. Die aktive Edge Function wurde nicht geändert.

Der aktive Quellstand der Edge Function `phalanx-transfer-intelligence-stage-20261031` ist Version 6 mit `verify_jwt=true`. Die Vorabfrage an der Cloudflare-Staging-Adresse erhält die Vercel-Herkunft. Das Ranking-Snapshot-Tableau ist für Gast und normale angemeldete Sitzung nicht lesbar. Die bestehende Allianz-RPC liefert Einordnungsdaten und keine Spielerliste.

Der [Patch](phalanx-transfer-intelligence-cloudflare-origin-20261107.patch) ergänzt genau `https://stage-transfer-live-rankings.nexus-phalanx-kvk-test.pages.dev` als Herkunft. Für diese Adresse bleiben ein gültiges Token, eine aktive Mitgliedschaft und die vorhandenen Scouting-Rollen `member`, `r4`, `r5` und `admin` Voraussetzung. Anonyme Konten werden abgewiesen. Die vier Vercel-Herkünfte, die Datenpfade und das JWT-Gateway bleiben für zulässige Anfragen unverändert. Der Patch korrigiert außerdem den nachgewiesenen Initialisierungsfehler beim Ablehnen unzulässiger Methoden oder Herkünfte.

- **BESTANDEN** · 7 lokale Tests mit dem echten Handler und simulierten Abhängigkeiten. Geprüft wurden Vorabfrage, ähnlich aussehende fremde Herkunft, fehlende oder ungültige Sitzung, inaktive, abgelaufene und unzulässige Mitgliedschaft, vier freigegebene Rollen, Datenquelle und Snapshot-Rückweg, bestehende Vercel-Herkünfte und HTTP 405 für eine unzulässige Methode.
- **BESTANDEN** · Vorwärts- und Rückwärtsanwendung des Patches mit anschließendem Bytevergleich. SHA-256 der Version 6 `e0fccf87915d980d95ea3024892cbfd24772ee27092bc0bbdaaa142be8e71271`. SHA-256 des Kandidaten `ae9124a1b4acf24c92a17635f9865d0aeeeb9b8dfa15cf534d088c28d80b0a0d`. Für den Rückweg vor der Veröffentlichung die Live-Fassung und ihre Prüfsumme erneut kontrollieren.
- **NICHT GETESTET** · Authentifizierter Abruf mit dem Patch auf Cloudflare. Die zusätzliche erlaubte Herkunft erfordert eine ausdrückliche Freigabe für die bestehende geschützte Funktion im gemeinsamen Supabase-Projekt.

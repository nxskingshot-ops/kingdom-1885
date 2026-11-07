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

## Wiederherstellung des ursprünglichen Player-Intelligence-Layouts

Der Android-Livetest mit KomaR zeigte den erfolgreichen geschützten ID-Abruf, die drei Kennzahlen, das Ranking und den geschlossenen Vergleich. Der Nutzer meldete die abweichende Gestaltung. `3ef2007` hatte die ursprüngliche Ergebnisansicht durch eine neue Karte ersetzt. `59e36ac` und `55945cc` übernahmen einzelne Merkmale, verwendeten aber weiterhin deren Markup.

Die Wiederherstellung übernimmt die dokumentierte Quellansicht vom 04.11. aus `15a01d9`. Review Player Data, dunkelblauer Rahmen, Spieler- und Orca-Kopf mit eigener Skala, drei dekorierte Kacheln, separate PYLON-IX-Überschrift, einklappbare Stärken und Entwicklungsbereiche sowie durchgehende farbige Rankingbalken sind wieder integriert. Die im Browser tatsächlich wirksame alte Kartengestaltung wurde direkt aus dem alten Stand gerendert und mit demselben Datensatz verglichen. Die aktuelle Bewertungs- und Vergleichslogik liefert weiterhin die Texte und Platzierungen. Der True-Power-Farbhinweis kennzeichnet die Grundlage als Rankingprofil. Das runde Infoelement öffnet den bestehenden Dialog.

- **BESTANDEN** · Chromium mit dem bestehenden SDK und isolierten Testantworten bei 320, 390, 430 und 1280 CSS-Pixeln. Anmeldung, Leserechte, ID-Abruf, drei Kennzahlen, Orca-Badge, Dialog und Escape, Rangbalken, historischer Kader, #1885-Einzelvergleich mit und ohne Ranglistenrückweg, Kandidat hinzufügen, Dossier und Rücknavigation. Badge und True Power passen in die getesteten Breiten.
- **BESTANDEN** · 23 automatische Entscheidungs- und Rankingtests, JS-Syntax und Cloudflare-Assetprüfung. Layout-Rückweg auf `55945cccba8c55cd73fd8eafe3acd770dd9df3e8` als Git-Bundle erstellt, Integrität geprüft und in einem leeren Repository wiederhergestellt.
- **NICHT GETESTET** · Die wiederhergestellte Ansicht auf dem physischen Android-Gerät und die dort aufgeklappte Live-Spielerliste. Die früheren Android-Aufnahmen zeigen die ersetzte Ansicht, und die historische Quellversion dient als visueller Rückweg.

## Mobiler Ergebnisbereich mit einem Außenrahmen

Der Android-Screenshot vom 07.11.2026 zeigt im geöffneten Live-Einzelvergleich 258 verfügbare Spieler und 15 von 16 Kennzahlen für KomaR und A_S_S_A_U_L_T. Er bestätigt den zuvor offenen Einzelvergleich und zeigt überlagerte Rahmen von Arbeitsbereich, Scoutingsuche, Review, Spielerkarte und Vergleich.

Bei geöffnetem Scoutingergebnis bis 700 CSS-Pixeln bleibt der Außenrahmen des Arbeitsbereichs sichtbar. Die inneren Container teilen sich diese Fläche. Ihre seitlichen Rahmen, Einzüge und dekorativen Schatten entfallen. Eingabefelder behalten ihre Konturen. Die Änderung besteht aus CSS und einer neuen CSS-Cachekennung.

- **BESTANDEN** · Bei 390 CSS-Pixeln wuchs die Nutzbreite des Vergleichsergebnisses im Browser von 276 auf 340 CSS-Pixel. Geprüft wurden die Rahmenbreiten, Einzüge, Steuerelementkonturen und die Rückkehr zur Kandidatenansicht.
- **BESTANDEN** · Browserprüfung bei 320, 390, 430 und 1280 CSS-Pixeln, 23 vorhandene Entscheidungs- und Rankingtests und Assetprüfung.
- **NICHT GETESTET** · Sichtprüfung der Rahmenkorrektur auf dem physischen Android-Gerät.

## Einzelvergleich mit Ergebnis zuerst · 07.11.2026

**Basis** · `f0149ddce2e08f46a3ddc6516eb181c80ed2f1b7`. Die auf Cloudflare ausgelieferten HTML-, CSS- und JS-Dateien stimmen bytegenau mit dem Basis-Commit überein. Ein Git-Bundle der Basis wurde erstellt, mit `git bundle verify` geprüft und in ein leeres Repository eingelesen. Die wiederhergestellte CSS-Blob-SHA stimmt mit der Basis überein. Der physische Android-Nachweis der Basis liegt im Projektnachtrag `PHX-TRANSFER-ANDROID-RAHMEN-20261107.md`, Screenshot `49060.png`.

Die bestehende Vergleichsansicht zeigt Paarung, stärksten Vorsprung und größten Rückstand aus Sicht des geprüften Spielers direkt unter der Vergleichsüberschrift. Die Auswahl klappt beim ersten Ergebnis ein, sofern sie gerade keinen Fokus hat. Suche, Allianzfilter, Refresh und ID-Abfrage bleiben erreichbar. Ein fehlgeschlagener ID-Abruf lässt den bisherigen Vergleich stehen. Spielername und Balken verwenden dieselben Farben, Gold für den geprüften und Blau für den #1885-Spieler. Zeitstand, Datenabdeckung, vollständiger Rankingvergleich und historisch gekennzeichnete Allianz-Top-15 bleiben erhalten.

- **BESTANDEN** · 23 Entscheidungs- und Rankingtests, JS-Syntax, Asset-Preflight und `git diff --check`.
- **BESTANDEN** · Chromium mit isolierten Testantworten bei 320, 390, 430 und 1280 CSS-Pixeln. Ergebnis vor Auswahl, einklappbare Filter, Paarungswechsel über Suche und ID, fehlerhafte ID, Listen-Refresh, historischer Rückweg, Balkenzuordnung, vollständiger Rankingvergleich, Kandidat speichern im Test und Dossier-Rückweg. Bei 390 CSS-Pixeln bleibt die Vergleichsbreite 340 CSS-Pixel. Kein horizontaler Seitenüberlauf in den geprüften Zuständen.
- **BESTANDEN** · Cloudflare-Staging. HTML, CSS und JavaScript wurden per HTTPS abgerufen und anhand der Git-Blob-SHAs bytegenau mit `6386e26ae1f2223f9869fc237edb9cffa3e337a8` abgeglichen.
- **BESTANDEN** · Android-Liveanzeige, Screenshot `49070.png` vom 07.11.2026, 16:57 Uhr laut Gerätestatusleiste. Der geöffnete Vergleich KomaR ↔ MrMoe zeigt Namen und Kurzfazit vor der eingeklappten Spielerauswahl sowie farblich passende Balken in Gold und Blau. Ein Außenrahmen bleibt sichtbar. 15 von 16 Kennzahlen wurden verglichen. Aus KomaRs Sicht zeigt das Kurzfazit Research Power +1,7 % und Master Power −34,6 %. Die geöffneten Quellenhinweise nennen getrennte Erfassungszeiten (Kandidat 15:55:05 UTC, #1885-Daten 01:45:37 UTC).
- **BESTANDEN** · Android-Livewechsel über die Spielerliste von MrMoe zu Nitro (NXS). Screenshot `49072.png` vom 07.11.2026, 17:00 Uhr laut Gerätestatusleiste, zeigt die neue Paarung, aktualisierte Balken und 5 von 16 gemeinsam vergleichbare Kennzahlen. Der größte angezeigte Vorsprung KomaRs ist Hero Equipment (+124,2 %). Der Hinweis zu abweichenden oder unbekannten Erfassungszeiten bleibt sichtbar.
- **NICHT GETESTET** · Wechsel über Suche, Allianzfilter oder direkte ID sowie Kandidatenspeicherung in dieser Android-Live-Sitzung. Diese Interaktionen wurden mit isolierten Testantworten geprüft.

SHA-256 der Android-Aufnahme `49070.png`: `2fb592a3a122ff22b648a1a0346558cb1cbfc4f229616f8823c5785234bd2f22`.

SHA-256 der Android-Aufnahme `49072.png`: `320800fd05e4c019d9b79e55022c1813c0dced98fc478f26c71c69daa684cc4b`.

## Vergleichsüberschriften mit stärkerem Kontrast · 07.11.2026

**Basis** · Staging-Register `58d23ec2cc3be28b5af5bb1ef4327ae88f62a520`, ausgelieferte Laufzeit `6386e26ae1f2223f9869fc237edb9cffa3e337a8`. Ausgeliefertes HTML und CSS waren bytegleich mit dieser Laufzeit. Das lokale Laufzeitäquivalent ist als Git-Bundle gesichert. Integrität und Abruf in ein leeres Repository wurden geprüft. Die CSS-Blob-SHA der Wiederherstellung stimmt mit der ausgelieferten Basis überein.

Die aufklappbaren Hauptabschnitte im Scoutingergebnis erhalten dunkle Titelzeilen mit Goldakzent und sichtbar hellerem geöffneten Zustand. Spielerwechsel und Quellen erscheinen als dezenter abgesetzte Unterpunkte. Die Kennzahlenbeschriftungen im Balkenvergleich sind etwas größer und kräftiger. Geändert sind Decision-CSS und dessen Cachekennung in der Transfer-HTML.

- **BESTANDEN** · Chromium mit isolierten Testdaten bei 320, 390, 430 und 1280 CSS-Pixeln. Hauptüberschriften mindestens 44 CSS-Pixel hoch, geöffneter Zustand unterscheidbar, sichtbarer Tastaturfokus und Öffnen per Enter. Spielerwechsel, Quellen und vollständiger Rankingvergleich funktionierten. In den geprüften Zuständen kein horizontaler Seitenüberlauf.
- **BESTANDEN** · 23 Entscheidungs- und Rankingtests, Asset-Preflight und `git diff --check`.
- **BESTANDEN** · Cloudflare-Staging liefert HTML und CSS bytegleich zu `f54b3fd1abe987fcfebfa996cef230880e0b35ef` aus.
- **BESTANDEN** · Android-Sichtprüfung der eingeklappten Titelzeilen auf Staging. `49076.png` vom 07.11.2026, 17:13 Uhr laut Gerät, zeigt die abgesetzten Zeilen für Historical Top 15, Einzelvergleich, KvK-Rollen und Rankings. `49075.png` (17:12 Uhr) zeigt die Spielerübersicht und den Goldakzent auch bei „View rating scale“.
- **NICHT GETESTET** · Sichtprüfung des geöffneten Zustands und der Unterpunkte für diese Stiländerung auf Android. Diese Zustände wurden in Chromium geprüft.

SHA-256 `49075.png`: `242854e95e0a2fe1d472638a873d75c1139de3e3dab2cc0d33dc0e7d8c157a37`.

SHA-256 `49076.png`: `9bebfedceb1f6fcefd3437017e37889215183a252593501da5834bca2db505a7`.

## Vier Allianzen direkt vergleichen · 07.11.2026

**Basis** · Staging-Register `33b1ba18abe8a3db17cc073bbb035a317a184eb1`, ausgelieferte Laufzeit `f54b3fd1abe987fcfebfa996cef230880e0b35ef`. HTML, CSS und JS stimmten bytegenau mit der HTTPS-Basis überein. Das lokale Laufzeitäquivalent wurde als Git-Bundle gesichert, geprüft und mit identischer Tree-SHA in ein leeres Repository eingelesen.

Der Bereich Alliance comparison zeigt NXS, OoO, MYM und FRA gleichzeitig. Das Zielallianz-Menü entfällt. Die vier Kader laden unabhängig. Historischer Datenstand, Abdeckung, Platzierung und Abstand zur Top-15-Grenze bleiben je nach Datenlage sichtbar. Historische Top 15, Rangbalken, Kategoriebelege und die getrennte Kingdom-Teilstichprobe bleiben in den Details erreichbar. Der #1885-Einzelvergleich behält seinen eigenen Allianzfilter und wählt weiterhin standardmäßig die unterstützte Heimatallianz eines #1885-Spielers, sonst NXS. Der historische Rückweg kann laufende Kaderabfragen beim ersten Abruf wiederverwenden. Ein manueller Refresh fragt die Daten erneut ab.

- **BESTANDEN** · Chromium mit isolierten Testantworten bei 320, 390, 430 und 1280 CSS-Pixeln. Vier sichtbare Allianzen ohne Zielallianz-Menü, unterschiedliche Rangplätze, Teildaten ohne exakten Gesamtplatz, fehlgeschlagener Einzelkader, unabhängiges Öffnen der Top 15, Einzelvergleich samt Allianzfilter, Spielerwechsel sowie historischer Rückweg und erneuter Abruf. Kein horizontaler Seitenüberlauf in den geprüften Zuständen.
- **BESTANDEN** · 23 Entscheidungs- und Rankingtests, JS-Syntax, Asset-Preflight und `git diff --check`.
- **NICHT GETESTET** · Neuer Laufzeitstand auf Cloudflare-Staging und auf einem physischen Android-Gerät.

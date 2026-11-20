# PHALANX HOME FINAL · Android-Profilplakette · 20.11.2026

## Versionsstand

| Referenz | Nachweis |
|---|---|
| Angeforderter Branch | `work/phx-home-android-visual-fix-20261119` bei `90f6c4b94f24518e54485beae1dea2dd110fb214` |
| Freigabegrundlage | [Unified Profile Plaque vom 18.11.2026](PHX-HOME-UNIFIED-PLAQUE-APPROVED-20261118.md) |
| Basisprüfung | [Actions 44481489920](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44481489920) · erfolgreich, Artefakt 14509170702 mit verifizierter SHA-256 |
| Basisvorschau | [Deployment a2606861](https://a2606861.nexus-phalanx-kvk-test.pages.dev/) und [Cloudflare-Alias](https://home-android-visual-fix-2026.nexus-phalanx-kvk-test.pages.dev/) · HTTP 200. Die ausgeschriebene Variante mit `20261119` liefert HTTP 404. |
| Tatsächlich ausgeliefert | `phx-war-room-live.css`, `phx-war-room-live.js` und `PHX_HOME_QUEEN_AN_APPROVED.png` stimmen bytegenau mit `90f6c4b` überein. |
| Korrektur | `fe046eaddae0020927b1fb53b21224c060f9a01d` auf `work/phx-home-plaque-validation-20261120` |
| Android-Prüfkonfiguration | `ecfe09031f21649f3e733663cec34da0b5a7df37` auf demselben Prüfbranch |

## Korrektur und Bestandsschutz

- In den Basisscreenshots war das alte Porträt im neuen Avatarbutton sichtbar. Der Button zeigt jetzt einen Ausschnitt des zentralen Spartanerhelms aus der freigegebenen Queen-An-Grafik. Bestehender War-Room-Einstieg, Fokusbehandlung und persönliches Profilbild bleiben über dieselben DOM-Elemente angebunden.
- Die Trennlinie über Königreich und Allianz übernimmt keine abgerundete Kontur der alten Plakette. Lange Namen werden gleichmäßiger umgebrochen und bleiben vollständig sichtbar. Die Profilzeilen behalten dieselben Datenbindungen und die bereits ausgeblendete Levelzeile.
- Die vorhandene Hero-Szene bleibt vollständig sichtbar. Die links/rechts in der Grafik enthaltenen alten Rahmen gehören zur eingefrorenen Illustration. Der Textvergleich stützt sich auf das Freigaberegister, die Basisscreenshots und die unveränderte Originalgrafik. Die endgültige visuelle Freigabe auf dem Nutzergerät steht aus.
- Original-HTML, Queen-An-PNG, War-Room-Referenz und Moduldateien sind im Quellbaum byteidentisch zur Basis. Queen-An-PNG SHA-256 `44af7b03d8fc1e68ac950b663aef8605bb1c9406e471eec4d10634b2083a9ada`. Änderungen an der App betreffen ausschließlich die HOME-Plakette. Produktionsbranch, Cloudflare-Projektkonfiguration, Backend, Rollen und bestehende Sicherungsrefs wurden im Auftrag nicht verändert.
- In der Web-Basisvorschau bleiben Transfer Scouting und Allianzvergleich im Command Center als „Anbindung folgt“ sichtbar. Weitergehende Modulintegration und vollständige fachliche War-Room-Abnahme gehören zu den offenen Projektpunkten.

## Interaktive Prüfung der Cloudflare-Basis

BESTANDEN · Avatar öffnet den War Room, Reload ohne Anmeldung erhält die War-Room-Route, Zurück führt zu HOME. HOME → Territory Control → Outpost Map → zurück → Outpost Reports → zurück → HOME sowie PYLON IX → HOME durchgeklickt. Das war ein Navigationstest auf der veröffentlichten Basis.

Vercels bestehende Git-Anbindung hat für den Prüfbranch automatisch eine separate Vorschau erstellt. Die Deployment-Metadaten zeigen `target: null`. Cloudflare bleibt auf dem bereits ausgelieferten Stand.

## Live-Profil und Anmeldung

Echter HTTP-OPTIONS-Preflight an die bestehende isolierte Profilfunktion für einen authentifizierten GET mit `authorization,apikey`:

| Origin | Ergebnis |
|---|---|
| `https://a2606861.nexus-phalanx-kvk-test.pages.dev` | FEHLGESCHLAGEN · 403 |
| `https://home-android-visual-fix-2026.nexus-phalanx-kvk-test.pages.dev` | FEHLGESCHLAGEN · 403 |
| `https://home-plaque-visual-20261117.nexus-phalanx-kvk-test.pages.dev` | BESTANDEN · 204, exakt passender Allow-Origin |
| `https://localhost` (Capacitor) | BESTANDEN · 204, exakt passender Allow-Origin |

Der neue Cloudflare-Alias liegt außerhalb der bestehenden Freigabe. Das blockiert im Browser den verifizierten Profilabruf. Die ältere freigegebene Adresse belegt nur ihren eigenen Stand. Anmeldung, Reload mit echtem Testkonto, die Zuordnung zur eigenen Spieler-ID und MightPulse wurden für den korrigierten Stand nicht end-to-end getestet. Vor einem Live-Test braucht die korrigierte Fassung eine genehmigte isolierte Bereitstellung unter einer zugelassenen Origin oder eine ausdrücklich genehmigte Anpassung der Test-Originliste.

## Sicherung und Rückweg

- BESTANDEN · Remote-Sicherungsref `backup/phx-home-before-android-visual-fix-20261119` zeigt auf `1cc0091f3b7f87417aa89ffdd036076bd9433739`. Der angeforderte Arbeitsbranch hält weiterhin die exakt geprüfte Basis `90f6c4b`.
- BACKUP ERSTELLT · Lokales Git-Bundle der Basis mit vollständiger Historie. SHA-256 `2040af91e45fa92771489b99b0af6e517ec2a30fd48f8141250cd4cd007fce14`.
- INTEGRITÄT GEPRÜFT · `git bundle verify`, `git fsck --full`, SHA-256 und Abgleich der beiden geschützten Quelldateien.
- WIEDERHERSTELLUNG GETESTET · Separater lokaler Clone aus dem Bundle, exakter HEAD und unveränderte HTML-/Bildbytes bestätigt. Kein Wiederherstellungstest für Hosting, Datenbank oder Sitzungen. Das lokale Bundle ist ein Arbeitsartefakt. Der dauerhafte Quellrückweg ist der unveränderte GitHub-Branch.

## Prüfmatrix des korrigierten Stands

| Prüfung | Ergebnis und Beleg |
|---|---|
| Mobile Webansicht | BESTANDEN · [Actions 44666093925](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44666093925) bei 320, 393 und 430 CSS-Pixeln. Alle sechs HOME-Ziele und Rückwege, War Room per Avatar und Tastatur, Plaketten-Geometrie und vollständige lange Namen. |
| Anmeldung, Reload und Profil | BESTANDEN mit simulierten HTTP-Antworten · Anmeldung, dynamischer Name/Königreich/Allianz, Reload in HOME und War Room, Token-Erneuerung, Profil-Refresh, Logout und abgewiesene Falschanmeldung. 10 Sitzungs- und 14 Profil-Handler-Tests bestanden. Echtes Konto siehe oben. |
| Android-WebView, API 35 (Pixel-6-Emulator) | BESTANDEN · [Actions 44666253459](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44666253459). HOME nach Reload und ohne sichtbare Statusleiste, korrigierter Helm und gerade Trennlinie, Plakette oberhalb der ursprünglichen Grafik, Avatar → War Room → HOME. |
| Android-Module | BESTANDEN im Emulator · Territory Control, Reports, PYLON IX und Transfer Scouting (beide Einstiege und Android-Zurücktaste). Karte mit 74 Zeilen, JSON- und CSV-Speicherung über den Android-Dateidialog. Der Test bestätigt den Speichervorgang, kein erneutes Einlesen der Dateien. Transfer-Rollen und fachliche Aktionen waren nicht Teil des Routentests. |
| Sichtprüfung | BESTANDEN für die überprüften Merkmale anhand der CI-Screenshots bei 393 px, dem langen Namen bei 320 px und dem Android-WebView-Screenshot. Im Extremfall benötigt der vollständige Name bei 320 px vier Zeilen. Android-Screenshot ohne Anmeldung. |
| Physisches Android-Gerät | NICHT GETESTET · Ausstehende Nutzerabnahme mit echtem Konto und Live-Daten. |
| Cloudflare-Deploy der Korrektur | NICHT AUSGEFÜHRT · Der Prüfzweig überspringt den Publish-Schritt. Der geprüfte HTTP-200-Link liefert weiterhin `90f6c4b`. |

### Prüfartefakte

- [Mobile Screenshots](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44666093925/artifacts/14597379689) · `home-unified-393.png` und `home-long-name-320.png`. ZIP-SHA-256 `7f56a4e86619243fa847800162a6ab35194add526ed9204020b72bcfe08b35fd`.
- [Android-WebView-Nachweis](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/44666253459/artifacts/14598001580) · `android-home-unified-plaque.png`, `android-war-room.png`, Geräte- und WebView-Protokolle. ZIP-SHA-256 `f2928c796e19d8c8bc552c17b3d7d82a93ea4266452e98fa9ac937c599dfd0ee`.

Beide Archive wurden heruntergeladen, gegen die von GitHub gemeldete SHA-256 geprüft und vollständig entpackt. GitHub hält die Archive bis 27.11.2026 vor. Die verlinkten Lauf- und Commit-Nachweise dokumentieren die getesteten Stände.

**Status · IMPLEMENTIERT und TECHNISCH GETESTET. Physische Android-Abnahme und echter Live-Profilablauf stehen aus. Keine Produktionsfreigabe.**

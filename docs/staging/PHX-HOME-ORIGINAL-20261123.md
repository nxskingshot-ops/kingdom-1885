# PHALANX HOME · bestätigte Originalplaketten

23.11.2026 · Der Eigentümer hat die Originalszene mit beiden Plaketten per Screenshot bestätigt. Die Umsetzung verwendet den bereits vorhandenen Recovery-Stand `62ae0b5c5a0f9bab662822956f8394db1af5aa58` als Rückweg und Ausgangspunkt. Der Android-Fix mit zusätzlicher Profilzeile und die feste Vorschau bleiben auf ihren bisherigen Referenzen.

## Umfang

Die vorhandenen beiden Textflächen in der Queen-An-Szene zeigen den verifizierten Spielernamen sowie Königreich und Allianz. Der Schriftgrad richtet sich nach den tatsächlich gerenderten Textmaßen und der Größe der Originalrahmen. Lange Namen können darin umbrechen. Ohne verifiziertes Profil bleiben die Textfelder leer. Fehlt die Allianz, bleibt nur das vorhandene Königreich sichtbar. Avatar, War-Room-Lasche und die bisherige Navigation verwenden ihre bestehenden Aktionen. Auth, Sitzungsablauf, War-Room-Dossier, Rollen und Datenquellen bleiben unverändert.

Die Originalgrafik und das eingefrorene Quell-HTML sind bytegleich zur Recovery-Basis. Die Staging-Pipeline verwendet deren bestehende SVG-Texturmaske und Exportschicht für Outpost Map 2.0. Die neue Cloudflare-Vorschau verwendet einen separaten Alias im bestehenden Testprojekt.

## Lokale Nachweise

| Prüfung | Ergebnis |
|---|---|
| SHA-256 Originalgrafik | BESTANDEN · `44af7b03d8fc1e68ac950b663aef8605bb1c9406e471eec4d10634b2083a9ada` |
| Verifikation von eingefrorenem HTML / PNG und Syntax | BESTANDEN |
| Profil- und Session-Tests | BESTANDEN · 24 automatisierte Tests |
| Originalplaketten bei 320, 393 und 430 CSS-Pixeln | BESTANDEN · kurzer und langer Name, zwei Königreiche, andere Allianz, fehlende Allianz, Level ausgeblendet |
| Login, Reload, Token-Erneuerung, Profil-Refresh, Logout und falsches Passwort | BESTANDEN mit simulierten HTTP-Antworten |
| Avatar und Lasche → War Room → HOME, Territory Control → Map / Reports, sechs HOME-Navigationsziele | BESTANDEN in Chromium |
| Outpost Map 2.0 und Export | BESTANDEN · 74 Zeilen aus der aufgezeichneten aktuellen öffentlichen Antwort. Erneut abgespielt. JSON und CSV als Downloads geöffnet und jeweils 74 Datensätze gezählt. |
| Echtes Konto, physisches Android-Gerät, Rollenaktionen und War-Room-Redesign | NICHT GETESTET |

## Rückweg

INTEGRITÄT GEPRÜFT · Quellbasis und PNG anhand von Commit und SHA-256 identifiziert. Der neue Teststand übernimmt die unveränderte Original-PNG. Das dauerhafte Original wurde bereits in Phase 1 als einzelne Datei gesichert. WIEDERHERSTELLUNG GETESTET · NICHT GETESTET für Hosting, Backend und Sitzungen in diesem Durchgang.

## Korrektur der Testadresse für Live-Profile

Der Test auf Android zeigte eine bestehende Anmeldung und leere Plaketten. Für den isolierten Profilabruf antwortet die neue Branch-Origin `home-original-20261123.nexus-phalanx-kvk-test.pages.dev` auf den GET-Preflight mit HTTP 403. Die bereits explizit zugelassene feste HOME-Origin `home-plaque-visual-20261117.nexus-phalanx-kvk-test.pages.dev` antwortet mit HTTP 204 samt exaktem Allow-Origin.

Der Workflow veröffentlicht denselben Prüfstand künftig über diese bestehende feste HOME-Testadresse. Authentifizierung, Rollen, Daten und die serverseitige Originliste werden dabei nicht geändert. [Frühere Fassung der festen Adresse](https://34109c0c.nexus-phalanx-kvk-test.pages.dev/) · Die sechs zentralen Auslieferungsdateien einschließlich index.html, Grafik und Profilskript wurden vor der Umstellung bytegleich zur alten festen Adresse verifiziert. [Erstes Deployment des Originalstands](https://8dd221b1.nexus-phalanx-kvk-test.pages.dev/) bleibt für Vergleichszwecke adressierbar.

# PYLON IX · Fachliche Vorlage für Account-Dossiers (2026-11-02)

## Zweck
Die historische KvK-Gegneranalyse von Kingdom #1913 ist ausschließlich eine **inhaltliche und redaktionelle Referenz**. Achilles, Greyjoy, goo 대박, Psychostick0 und Dovik werden NICHT als Trainingsdatensatz, aktuelle Vergleichsspieler oder automatische Punktekalibrierung verwendet.

## Nachgewiesene Quelle
`data/kvk-opponent-intelligence-current.json`, Version 3, Stand 2026-10-04, Feld `strategic_assessment`, Status `working_tendency`. Dort werden mehrere unterschiedliche Eliteprofile statt eines einzigen „Whales“ unterschieden; Rollen, konkrete taktische Konsequenzen und Unsicherheiten getrennt genannt. Die dokumentierte Gefährdungsreihenfolge ist historisch und darf nicht auf neue Kandidaten übertragen werden.

## Zielbild pro Kandidat
1. **Kompakter Kopf:** Spieler, ID, Allianz, Castle/TG, Total/True/Master/Hero/Pet Power soweit tatsächlich verfügbar; SEA WORLD separat und erklärbar.
2. **Gesamturteil (max. zwei Sätze):** Accounttyp (ausgewogen / offensive oder defensive Indizien / spezialisiert / unklar), belegte Stärken, relative Entwicklungsfelder. Nicht aus fehlenden Daten auf Schwäche schließen.
3. **Taktischer Nutzen:** maximal drei priorisierte Einsatzoptionen, jeweils mit belegten Gründen, entscheidenden fehlenden Kampfnachweisen und klarer Kennzeichnung „Prüfpriorität, keine bestätigte Rolle“. Offensive und defensive Eignung niemals allein aus identischen Rankingwerten ableiten.
4. **Allianzplatzierung:** Top-15-Position beziehungsweise Position außerhalb der Top 15; ausschließlich auf tatsächlich vorliegenden, datierten, gleichartigen Kennzahlen und dem vollständigen verfügbaren Roster. Historische Total Power ist keine aktuelle Kampfkraft.
5. **Konkretes Fazit:** Was bringt der Kandidat der Zielallianz, was muss Queen An vor einer Zusage prüfen?
6. **Nachweise aufklappbar:** vollständige Rankings, Quellen, Datenalter, Event-/Arena-Indikatoren und detaillierte Rollenevidenz. Keine redundanten Haupttextblöcke.

## SEA WORLD
Unveränderte V2-Grenzen aus `preview/phx-sea-world-v2-gate-20261101.js`: 98+ Mega Whale; 90+ Whale; 85+ Orca Elite; 70+ Orca; 55+ Strong; 40+ Solid; sonst Developing. Vorläufige Top-25-Kalibrierung. Antippbare Stern-Legende als eigenständige UI-Anforderung; Sterne sind keine taktische Rollenzusage.

## Schutz / Abnahme
Keine Änderungen an KvK-Originaldaten, FREEZEs, Supabase, Auth, anderen Modulen oder produktiven Deployments. Bestehende Lookup-, Ranking-, Export-, Platzierungs- und Navigationsfunktionen erhalten. Abnahme erst nach Code-/Syntax-/Integrationsprüfung, automatischem Cloudflare-Testdeployment und Android-Sichtprüfung.

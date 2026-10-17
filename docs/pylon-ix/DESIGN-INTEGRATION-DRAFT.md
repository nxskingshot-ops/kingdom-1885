# PYLON IX — Design- und Integrationsvertrag (Entwurf)

Stand: 2026-10-17. Status: Designreferenz durch Nutzer ausgewählt; technische Integration NICHT erfolgt; kein neuer Symbol-FREEZE.

## Visuelle Referenz
Die zuletzt im Chat bestätigte Bildversion ist die einzige visuelle Referenz: antiker kreisförmiger Schild, kräftiges leuchtendes Rot mit Rissstruktur, goldener Lambda-Körper, symmetrischer goldener Lorbeerkranz, unten rot glühendes römisches IX, bronzegoldener Rand. Das Originalbild liegt im Chat; es wurde **nicht** als Binärasset in GitHub archiviert. Für pixelgenaue Umsetzung ist das Originalasset erforderlich; keine freie Nachzeichnung als Ersatz.

## Produktabsicht
PYLON IX wird als strategische Assistenz innerhalb von NEXUS PHALANX konzipiert, nicht als eigenständiger kostenpflichtiger Cloud-Service. Bestehende Module und Begrifflichkeiten verwenden; kein FRAG-System. KI-Funktionalität und Datenanbindung sind noch zu spezifizieren und technisch zu prüfen; keine Behauptung einer funktionsfähigen KI.

## Schutzregeln
- Sämtliche bisherigen FREEZEs und funktionierenden Features unverändert lassen.
- Kein Merge auf main, kein produktiver Deploy, keine Auth-/RLS-Änderung.
- Keine neuen kostenpflichtigen Dienste, Tokens oder API-Aufrufe.
- Vertrauliche interne Datenquellen nicht im UI benennen.
- Keine Spielerdaten an externe KI ohne separate Freigabe.

## Nächste Prüfungen
1. Vorhandene Navigations- und Header-Komponenten auf wiederverwendbare Einbindung prüfen.
2. Originalgrafik als Asset verlustfrei sichern, erst danach responsive Icon-Ableitungen erstellen.
3. Isolierten, statischen PYLON-UI-Prototyp ohne externe API oder produktive Daten erstellen.
4. Auf Mobilgeräten Layout, Navigation, Kontrast und Ladezeiten prüfen.
5. Erst nach technischem Test und expliziter Freigabe Integration erwägen.

## Verbindliche Informationsarchitektur: About / Info
Alle Erklärungen zu Namen, Herkunft, Symbolen, Motiven und Entstehungsgeschichte gehören in den bestehenden About-/Info-Bereich, nicht in operative Dashboards. Vorhandenes About NEXUS (Queen-An-Poster, 1885-Banner und sonstige FREEZEs) bleibt unangetastet.

Geplante Sektionen:
- NEXUS: Namensbedeutung, Allianzkontext, freigegebenes Motto „Nexus — many paths, many strengths, one force.“
- PHALANX: Wortherkunft, griechische Formation, Markeninterpretation.
- PYLON IX: gewählter Name, strategische KI-Rolle (geplant, nicht als bereits funktionsfähig darstellen), Designentwicklung und Schildsymbol.
- Lambda (Λ): historischer Bezug zu Lakedaimoniern; konkrete Schildgestaltung als künstlerische Interpretation kennzeichnen.
- Lorbeerkranz: klassische Sieg-/Ehrensymbolik; kein Anspruch, dass das Motiv historisch typisch für spartanische Schilde sei.
- IX: römische Zahl Neun; keine zusätzliche erfundene Namensgeschichte.

Regeln: Trenne belegbare Geschichte von Projekt-Lore und tatsächlichen Nutzerentscheidungen. Interne vertrauliche Quellen nicht offenlegen. Kein neues Hauptmenü, sondern vorhandenes About erweitern; visuelle FREEZEs und vorhandene Inhalte bewahren. Implementierung erst nach Bestandsprüfung und ausschließlich isoliert.

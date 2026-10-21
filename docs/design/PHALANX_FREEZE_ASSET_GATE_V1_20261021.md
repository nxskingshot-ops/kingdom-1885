# PHALANX — FREEZE-ASSET-GATE V1 (2026-10-21)

Status: verbindliche Arbeitsregel für isolierte Entwicklung; keine Änderung an bestehenden FREEZEs.

## Grundsatz
**FREEZE = Originaldatei verwenden, nicht nachzeichnen und nicht neu generieren.**
Eine Textbeschreibung ist niemals Ersatz für das freigegebene Bild.

## Gesicherte Identitäten
- HOME: PHX-HOME-VISUAL-FREEZE-20261020-01.
- PYLON IX: PHX-PYLON-IX-VISUAL-FREEZE-20261020-01. Rissiges karminrotes Rundschild, goldenes Lambda und Lorbeer, **neonblaues IX**. Diese Beschreibung ist lediglich eine Erkennungsregel, KEINE Reproduktionsvorlage.
- UNIFIED HEADER V2 FINAL FREEZE: HOME goldene Helmaugen, Module rote, Funktionen blaue; Module/Funktionen Burger und Zurück.

## Harte Freigabesperre vor jeder neuen Designversion
1. **Quelle nachweisen:** Pfad zur exakten Originaldatei, Ursprung, Versions-ID, Freigabe, SHA-256 in ein Asset-Register aufnehmen.
2. **Original sichern:** Unveränderliche Referenzdatei und getrennte Arbeitskopie. Keine stille Substitution.
3. **Änderungsbereich eingrenzen:** Nur ausdrücklich gewünschte Pixel/HTML-Komponenten bearbeiten.
4. **Integrität nachweisen:** Vorher-/Nachher-Hash für alle unveränderten Assets vergleichen. Bei HTML-Einbettung Asset-Hash separat kontrollieren.
5. **Bildprüfung:** Bei visueller Bearbeitung Pixel-Diff außerhalb der erlaubten Maske; abweichende Pixel => STOP, keine Freigabe. Bildgenerierung nicht als Ersatz für geschützte Elemente.
6. **Funktionsprüfung:** Sichtbare Grafikknöpfe sind keine echten Buttons. Click-Hotspots, Navigation, Tastatur und Android separat testen.
7. **Beweis dokumentieren:** Testdateiname, Commit, verwendete Assets, Hashes, erlaubte Änderungen, Testergebnis, verbleibende Risiken.

## STOP-Regeln
- Originaldatei nicht auffindbar oder Hash nicht prüfbar => keine Behauptung „FREEZE-konform“.
- Modell generiert ein bereits eingefrorenes Element neu => verwerfen.
- Designbeschreibung widerspricht Original => Original maßgeblich; bei Unsicherheit Entscheidung einholen.
- Screenshot zeigt optische Übereinstimmung => nicht automatisch Funktionsfreigabe.

## Aktueller Blocker
Der exakte binäre Originalpfad und die SHA-256 des freigegebenen PYLON-IX-Emblems sind in dieser Dokumentation noch **nicht verifiziert**. Bis dahin keine weitere Neugenerierung des Emblems oder Behauptung, die Illustration sei pixelidentisch.

## Versionsregel
Neue isolierte Teststände erhalten eindeutige IDs; keine Änderung an main, kein Merge, kein Deployment, keine zusätzlichen Kosten ohne explizite Freigabe.

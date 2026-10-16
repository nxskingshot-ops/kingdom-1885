# HOME-CUSTOM-001 — Personalisiertes Command Center

Status: Fachlich freigegeben am 2026-10-16; technische Umsetzung noch offen. Keine Änderung bestehender FREEZEs oder Produktion.

## Verbindlicher Umfang

Der PHALANX-Homescreen erhält einen persönlich konfigurierbaren Bereich. Der bestehende freigegebene Header, Branding, Navigation, Allianz-Wappen und verpflichtende Hinweise bleiben unverändert. Nutzer können **geeignete** Kacheln hinzufügen, ausblenden und neu anordnen. Nicht jede Funktion benötigt eine eigene Kachel.

### Drei Kategorien

1. **Modulkacheln:** Einstieg in vollständige Bereiche, z. B. Mein Account, KvK Prep oder Team Optimizer.
2. **Direktzugriffe:** Sprung in häufig genutzte Unterfunktionen, z. B. Outpost-Karte oder Players to Watch, sofern stabile Navigation und Berechtigung bestehen.
3. **Informationskacheln:** Zeigen verlässliche aktuelle Daten, z. B. Truppenübersicht aus dem lokalen Account. Keine erfundenen Live-Werte; Quelle und Aktualität kenntlich machen.

## Verhaltensregeln

- Konfiguration ist **Local-First** und standardmäßig geräte-/browserlokal; keine automatische geräteübergreifende Synchronisierung behaupten.
- Änderungen an der Kachelanordnung löschen weder Account- noch Modul-Daten.
- Berechtigungen gelten unabhängig von Sichtbarkeit oder Direktlink.
- Unverfügbare Module werden nicht als funktionsfähig angeboten; leere Daten werden verständlich erklärt.
- Ein Standardlayout kann wiederhergestellt werden, ohne Nutzdaten zu löschen.
- Mobile Bedienung: gut erreichbarer Bearbeiten-Modus; Verschieben per zugänglichen Auf-/Ab-Aktionen als Fallback für Drag-and-Drop.
- Jeder Kacheltyp besitzt stabile ID, Kategorie, Ziel/Aktion, Verfügbarkeitsprüfung und optionales Datenmodell.
- Konfiguration pro lokalem Profil getrennt; unbekannte Kachel-IDs beim Laden ignorieren, nicht ungeprüft rendern.

## Abnahme

1. Mein Account kann in den konfigurierbaren Bereich aufgenommen, ausgeblendet und verschoben werden.
2. Mindestens je eine Modul-, Direktzugriffs- und Informationskachel funktioniert mit realem Ziel bzw. verlässlicher Datenquelle.
3. Layout bleibt nach Neuladen erhalten; Standard wiederherstellen erhält Accountdaten.
4. Kein Eingriff in bestehende FREEZEs oder Produktionsnavigation.
5. Browserprüfung auf Mobilansicht, Tastaturbedienung, Berechtigungen und fehlende Daten.

## Release-Abhängigkeiten

Zunächst P1 Commander Account und sichere Rechneranbindung stabilisieren. Danach isolierter HOME-CUSTOM-001-Prototyp mit visuellem Review; kein stiller Design-FREEZE-Wechsel.

## Implementierungsstand (2026-10-16)
- Isolierter Funktionsprototyp: `deploy/phalanx-kvk-test/home-custom-001-isolated.html`.
- Automatischer Chromium-Test: `scripts/test_home_custom_001_browser.py`.
- Mobile Screenshots: `test-artifacts/home-custom-001/mobile-default.png` und `mobile-edit.png` als CI-Artefakt, nicht als freigegebene FREEZE-Bilder.
- Referenz für spätere visuelle Prüfung: `NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html` aus der ChatGPT Library, im Branding-Register als `home-freeze` verzeichnet. Diese Referenz ist nicht als identische Datei im Testprototyp hinterlegt.
- Aktuelle Darstellung ist ein **isolierter funktionaler Prototyp**; kein Nachweis pixelgenauer Übereinstimmung mit HOME-FREEZE und keine Freigabe für Produktion.
- Vor visueller Freigabe: tatsächliche CI-Screenshots sichten, eingefrorene HOME-Referenz daneben prüfen, Abweichungen dokumentieren und nur nicht eingefrorene Oberflächen ändern.

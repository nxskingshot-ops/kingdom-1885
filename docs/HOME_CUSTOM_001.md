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

## FREEZE source audit — 2026-10-16
- Library sources inspected: `NEXUS_PHALANX_HOME_ORIGINAL_2026-10-11.html`, `NEXUS_PHALANX_HOME_APPROVED_ALPHA12_2026-10-12.html`, `NEXUS_PHALANX_HOME_FUNCTIONAL_TEST_ALPHA13_2026-10-12.html`.
- **Important:** These three HTML files are integrated-loader wrappers; their CSS is a temporary loading state. Their script fetches `main/preview/nexus-app-2-command-center-portrait-final-polish-test.html` and injects assets. Do **not** use the wrapper's `#03111e` / `#f0d78c` as authoritative frozen UI palette.
- Actual upstream Command Center CSS (main branch) inspected: navy scale `#020914/#04111d/#061c2c/#0b2a40`, gold scale `#d5a83c/#f6d36b/#fff0a2`, text `#f2f5f8`, muted `#9cb2c5`, blue border `#1b567e`. Header uses `nexus-banner-1885.png`, crest and an existing language/menu area.
- The standalone HOME-CUSTOM prototype presently uses the separate Epic Navigation V2 / FREEZE-001 B token set; do not assert pixel parity with the HOME freeze. The two scopes are distinct. Never replace the original header or navigation with a duplicate.
- Next step: compare the fully loaded upstream HOME in a browser against the isolated prototype at mobile portrait width, with a source-faithful visual record. A source-code audit is not visual acceptance.

## Mobile integration plan — verified source boundaries
The upstream HOME source contains a sticky `.topbar` with original crest, brand, realm and language/menu actions, plus a mobile drawer. Its `.panel` uses blue border `#235f8b`, 8px radius and a dark navy gradient. This differs from Epic Navigation V2's gold-bordered menu groups; **these are distinct approved surfaces**.

For HOME-CUSTOM integration:
1. Mount the personal-area component **inside** the Command Center content area, below the existing original topbar. Never insert another header, language switch, menu or crest.
2. Use the HOME-native panel grammar for the embedded component (navy gradient, blue panel borders, gold only for title/highlights). Do not globally override the Epic Navigation V2 component library or the existing HOME CSS.
3. Keep editing controls local to the personal-area section, with its own storage key and without modifying the account's local data.
4. Preserve mobile portrait and original menu behavior; require actual side-by-side screenshots before visual approval.
5. Until integration is implemented, the standalone `home-custom-001-isolated.html` remains a **functional test harness**, not a visual substitute for the frozen HOME.

## Integration insertion point — source verified
The upstream HOME `preview/nexus-app-2-command-center-portrait-final-polish-test.html` has exactly one `<main class="content">`, followed by `<section class="switches">` and the existing intelligence panels. The HOME-CUSTOM personal section belongs **inside this existing main**, as a new independent section, not in the global header, sidebar, mobile drawer or as a replacement for `.switches`. The HOME source is an approved frozen surface: implement a new isolated derivative for integration testing, not an in-place edit to `main`.

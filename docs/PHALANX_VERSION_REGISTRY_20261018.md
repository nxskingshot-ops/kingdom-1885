# PHALANX — verbindliches Versionsregister (Audit 2026-10-18)

**Status:** Audit/Zuordnung; keine Release-Freigabe. Gilt für isolierte Alpha, nicht für Produktion.

## Kennungsschema
`PHX-<MODUL>-<ART>-<NNN>`; ART = `DES` (freigegebenes Design), `IMP` (implementierter Stand), `FRZ` (unveränderlicher Snapshot), `TST` (Testbuild), `REL` (freigegebener Release). Nummern sind **registerintern**, keine aus Dateinamen abgeleiteten Versionsbehauptungen. Jede Zuordnung braucht Quelle/Pfad, Datum, Prüfnachweis, Status, SHA-256 für FREEZE und Zielroute. `latest` ist ohne Nachweis verboten.

## Nachgewiesene Zuordnungen
| Kennung | Modul / Art | Verifizierte Quelle | Status |
|---|---|---|---|
| PHX-OUT-DES-001 | Outpost Map 2.0 Design | `docs/NEXUS-PHALANX-OUTPOST-MAP-V2-DESIGN-FREEZE-2026-10-12.md` | 12.10. genehmigt; Konzept, kein lauffähiger Release |
| PHX-OUT-FRZ-001 | Outpost Map 2.0 Alpha23 | Library `/NEXUS PHALANX/Design Freeze/Outpost Map Alpha23/OUTPOST_MAP_ALPHA23_FROZEN.html` | 13.10. genehmigte Android-Testbasis; SHA-256 `e8109617ef6d4578f4bfd7ca3a519bceedbae0850b432e6f27e24ef2d82fe0b0`; **nicht im GitHub-Alpha-Paket** |
| PHX-OUT-IMP-LEGACY | alte Outpost-Berichtsseite | `preview/outpost-report-v11.html` | Wird aktuell fälschlich als Outpost Map in RC5 eingebunden; nicht V2 |
| PHX-RC5-FRZ-001 | RC5-Navigation | `preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html` | Unveränderlicher Ableger, SHA-256 `e767ed7fd477bd797cd3eb80401358b2a345458abe312cf3ffdff8249d452062` |
| PHX-ALPHA-TST-001 | Android Integrationshülle | `preview/phalanx-alpha-android-integration-20261017.html` | Buildanzeige `20261018-n`; kein Release |

## Weitere Version-Risiken im Repository (NICHT als Fehler bestätigt)
- **Command Center:** RC5 nutzt `nexus-phalanx-command-center-alpha28-local-pair-test-2026-10-13.html`, während eine Reihe `nexus-app-2-command-center-portrait-*-test.html` und ein dokumentierter Command-Center-FREEZE existieren. Ob Alpha28 freigegeben ist, **ungeprüft**.
- **Battle Readiness:** RC5 nutzt `nexus-phalanx-battle-readiness-verified-status-test-2026-10-12.html`; mehrere Varianten `*-unified-*`, `*-role-safety-*`, `*-live-status-*` existieren. Freigabestand **ungeprüft**.
- **KvK Prep:** RC5 nutzt `kvk-prep-five-contrast-v13.html`; `v1..v4`, `v12`, `fixed` existieren. Freigabestand **ungeprüft**.
- **Transfer Scouting:** RC5 verwendet `transfer-scouting-demo-v5.html`, obwohl auch `transfer-scouting-live-v5.html` und Intelligence-Varianten existieren. DEMO vs LIVE **unterschiedliche Zwecke**, kein automatischer Austausch.
- **Hero Intelligence:** RC5 nutzt `hero-intelligence-evidence-advisor-v15-2026-10-12.html`; viele Hero-Investment- und Synergy-Varianten existieren. Vergleich nur innerhalb desselben Funktionsumfangs.
- **HOME:** Testhülle verweist teils auf nicht paketierte historische Dateien; Home-FREEZE muss vor Integration gegen die echte Bibliotheksdatei geprüft werden.
- **Outpost:** verifizierter Versions-/Routingfehler; zusätzlich verweist die alte Karte auf leere Repository-`index.html`.

## Verbindliches VERSION-CHECK-FIRST-Gate
1. **Vor Codeänderung** alle Kandidaten in GitHub **und** Library ermitteln; Version aus Name, HTML-Titel und dokumentiertem FREEZE getrennt betrachten.
2. Featureumfang und Freigabe dokumentieren. Höhere Nummer ist **kein** Beleg für neueren oder besseren Stand; DEMO ≠ LIVE.
3. FREEZE-Original nie ändern; SHA-256 vergleichen und nur isolierte Kopie integrieren.
4. Route und sämtliche Laufzeitabhängigkeiten im tatsächlichen Deploy-Paket prüfen; fehlende Dateien => **Buildfehler**.
5. Erst nach grünen Prüfungen isoliert deployen; Release/Produktion nur mit gesonderter Freigabe.
6. Bei widersprüchlichen FREEZEs Nutzerentscheidung einholen. Keine stillschweigende Priorisierung.

## Offene Aufgaben
- Alpha23 aus der Library als unveränderte isolierte Kopie in den Alpha-Branch übernehmen; SHA-256 im CI prüfen; Outpost-Route auf diese Kopie umstellen.
- Alle übrigen Modul-FREEZEs einzeln mit ihren aktuellen RC5-Zielen abgleichen und Ergebnisse in diesem Register ergänzen.
- Keine alten Routen entfernen, bevor deren Abhängigkeiten geprüft sind.

## Korrekturprotokoll 2026-10-18 — visuelle Identität hat Vorrang
- **OUTPOST AKTUELL GESUCHT:** `Outpost Intelligence · Alpha 24`, `MAP 2.0 · KINGDOM #1885 · ALPHA 24`. Referenz sind sechs vom Nutzer bereitgestellte Android-Screenshots (Königin/PHALANX-Banner, Navy/Gold-Diamantkarte, 74 Outposts, Allianzfilter, Scholar's Tower Detailkarte). **Dateipfad und SHA noch NICHT identifiziert.** Status: `REFERENCE_CONFIRMED / SOURCE_UNVERIFIED / INTEGRATION_BLOCKED`.
- **PHX-OUT-FRZ-001 Alpha23:** Der Hash beweist nur die Identität des Alpha23-Snapshots, **nicht** seine Eignung als aktuelle Karte. Darf nicht als freigegebene aktuelle UI bezeichnet werden. Bestehende Alpha-Testroute gilt als **Fehlzuordnung**, bis Alpha24-Quelle eindeutig identifiziert ist.
- **Alpha35:** Kein Nachweis, dass die Alpha35-Allianz-Integrationsdateien dieselbe Outpost-Karte darstellen. Versionsnummern unterschiedlicher Module niemals vergleichen.
- **Verbindliche Reihenfolge:** (1) Screenshots/Designreferenz → (2) Quellpfad plus inhaltlicher Abgleich → (3) Hash → (4) explizite Zielroute → (5) einmaliger notwendiger Integrationstest. Fehlt (2), keine Route ändern und keine Freigabe behaupten.
- **Nachweisdisziplin:** Grün bei CI bedeutet Build bestanden; ein Browser-Screenshot einer anderen Karte bedeutet nicht Designfreigabe. Keine weiteren Tests von Alpha23; keine Änderung an Produktion oder FREEZE-Originalen.
- **Konflikt zum alten Registereintrag:** Die oben stehende frühere Aufgabe »Alpha23 in Alpha integrieren« ist historisch erledigt, aber **fachlich durch die bestätigte Alpha24-Referenz überholt**. Nicht wiederholen.

## Alpha-Modul-Audit 2026-10-18 – offene Quellfreigaben

| Modul | Bekannte RC5-Zuordnung | Status | Nächste notwendige Prüfung |
|---|---|---|---|
| OUT | Alpha23 Legacy-Vorschau; Alpha24 nur Bildreferenz | BLOCKED | Original-Alpha24-HTML + Inhaltsvergleich + Hash |
| CMD | Command Center Alpha28 Local Pair | UNVERIFIED | Freigegebene Command-Center-Referenz gegen Route prüfen |
| BRD | Battle Readiness Verified Status Test | UNVERIFIED | FREEZE und Navigation gegen tatsächlich eingebundene Datei prüfen |
| KVK | KvK Prep Five Contrast v13 | UNVERIFIED | Funktionsumfang und freigegebenen Stand vergleichen |
| TRF | Transfer Scouting Demo v5 | DEMO / UNVERIFIED | Demo nicht als Live-Funktion ausgeben |
| HER | Hero Intelligence Evidence Advisor v15 | UNVERIFIED | Quellen und Funktionsumfang des Hero-Moduls abgleichen |
| HOM | Historische HOME-Verweise in Testhülle | UNVERIFIED | Aktuelle HOME-FREEZE-Originalquelle zuordnen |

Diese Tabelle ist ein **Prüfauftrag, keine Freigabe**. Versionsnummern unterschiedlicher Module dürfen nicht als Aktualitätsbeleg verwendet werden. Bestehende Routen und FREEZE-Originale bleiben unangetastet. Neue Modulkennungen erst nach Quellnachweis vergeben.

# PHALANX RC1 — Einstiegspunkt und Freeze-Gate (15.10.2026)

## Tatsächlich geprüfte Dateien
- `index.html` on main: 0 Zeichen, blob `507539831a5e5600dc1c00f404c4b14a320ff82b`. **Nicht als funktionierenden App-Einstiegspunkt annehmen.** GitHub Pages Deployment-Konfiguration nicht hierdurch nachgewiesen.
- `backups/NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html`: 435549 Zeichen, blob `e07740b64bf9dacb4df00ad9cdd374c21bd2f244`. Enthält FaQu, Quick Access, Kingdom Status, `translateHome`, lädt ältere KvK-Ansicht dynamisch. Der eingefrorene SHA-256/Bytevergleich wurde in diesem Audit nicht erneut ausgeführt; Freeze-Dokument verweist auf bestätigte Library-Originaldatei.
- `docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md`: HOME und KvK Intelligence sind **zwei unterschiedliche visuelle FREEZEs**. Kein Ersatz des HOME-Masters durch KvK Preview.
- `docs/freezes/NEXUS-PHALANX-ALPHA35-FUNCTION-FREEZE-2026-10-13.md`: Android-bestätigte Outpost-Integration mit 74 verifizierten Outposts, Filtern, Zoom, Navigation; HTML/ZIP-Original in Library; nicht überschreiben.
- `preview/phalanx-alpha35-alliance-top40-stage-v3-20261013.html` on main: leerer Blob; **nicht** als nachgewiesen lauffähiger Alpha35-Master verwenden.
- `data/phalanx-command-center-integration-audit-2026-10-12.json`: dokumentierte Lücken in Navigation, Integration und Mobilansicht.

## RC1-Invarianten
1. Separater Entwicklungsbranch; Main, HOME-Master, Alpha35 und produktive Daten unverändert.
2. Basis muss bytegenau dem freigegebenen HOME-Original entsprechen. Wenn Library-Datei nicht verifiziert zugänglich ist, **keinen approximierten HOME-Nachbau erstellen**.
3. Bestehende HOME-Controls und Layout beibehalten; keine neuen Kacheln, Header, Menüs.
4. Alpha35 Outpost-Funktionsverhalten als unveränderten Referenzpfad erhalten.
5. Module hinter bestehenden Navigationselementen schrittweise integrieren, zunächst mit klaren Offline/Demo/Live-Labels.
6. Gemeinsam genutzte Auth-, Daten- und Ranking-Verträge; keine falsche Behauptung serverseitiger Berechtigungen.
7. Vor produktiver Integration: Routen-, Android- und Rollentest sowie ausdrückliche Freigabe.

## Nächster konkreter Arbeitsschritt
- Library-Originale von HOME und Alpha35 lesen, Bytes/Hashes mit Freeze-Manifests abgleichen.
- Vorhandene HOME-Navigations-IDs/Handler und Alpha35-Routen systematisch extrahieren.
- Integrations-Mapping: bestehender Control → Moduldatei → Datenquelle → Auth-Gate → Teststatus.
- Erst dann abgeleitete RC1-Shell erstellen, ohne neue visuelle Komponenten.

Diese Datei dokumentiert nachgewiesene und fehlende Voraussetzungen; kein Release-GO.

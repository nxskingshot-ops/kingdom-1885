# PHALANX FIRST STRIKE – Status und Übergabe 2026-10-21

## Verbindliche Designentscheidungen
- HOME: PHX-HOME-VISUAL-FREEZE-20261020-01. Freigegebene Originalgrafik bleibt maßgeblich.
- PYLON IX: PHX-PYLON-IX-VISUAL-FREEZE-20261020-01. Rundes, rissiges karminrotes Schild, goldenes Lambda und Lorbeerkranz, **neonblau leuchtendes IX**, epische dunkle Fantasy-Oberfläche. Vier Bereiche: Analysieren, Berichte, Strategie, Fragen. Kein Designumbau ohne Freigabe.
- HOME-Header Gold; Modul-Header Rot; Funktions-Header Blau (Augenfarbe). Der rot/blau/goldene Gesamtauftritt ist nicht als Freigabe für beliebige Farbänderungen zu verstehen.
- Für generische Module keine fest eingebrannten Königreichsnummern oder NXS-Bezüge. HOME-FREEZE nicht ohne neue Freigabe ändern.
- Keine produktiven Änderungen, Merges, Deployments, neuen Kosten ohne ausdrückliche Freigabe.

## Android-Nachweise (Screenshots 20. Oktober)
- HOME → Territory Control → Outpost Map 2.0 sichtbar.
- HOME → Territory Control → Outpost Reports sichtbar; veröffentlichte Supabase-Daten 74/74 angezeigt. Export/Filter nicht vollständig E2E geprüft.
- PYLON Zugang und Öffnen in B017/B018 nachgewiesen.
- B019 zeigte visuell eingefrorene PYLON-Grafik, aber zu klein.
- B020 schnitt rechte vierte Kachel ab.
- B021 vier Kacheln sichtbar, aber Bildbanner und Layout unruhig.
- B022 technisch lesbar, jedoch vom Nutzer **gestalterisch abgelehnt** („Nein“). Nicht als Designvorlage weiterverwenden.

## Aktueller Stand
- Der visuelle PYLON-FREEZE gilt weiter; die responsive HTML-Umsetzung ist offen.
- Territory Control B016 Bildsprache gefällt grundsätzlich, aber zu viel Rot, doppelte Überschrift, Königreichsnummer und NXS-Bezüge entfernen; kein endgültiger Territory-FREEZE.
- Kartenversionskonflikt: äußere UI Alpha24, im eingebetteten Code wurde Alpha19 festgestellt. Nicht als bestätigte Alpha35 bezeichnen.
- HOME basiert in isolierter Integration teils auf Bildreferenz/Touchflächen; nicht mit vollständig semantischer HTML-Umsetzung verwechseln.
- PYLON-Analyse, Gespräch, Strategie und Berichtsfunktionen sind noch nicht real angebunden.
- 26 Supabase Edge Functions, DB-Backups und 3 Restore-Tests wurden in früheren Laptop-Übergaben als abgeschlossen gemeldet, heute nicht erneut geprüft.

## GitHub-Prüfung 21. Oktober
- Repo nxskingshot-ops/kingdom-1885.
- Branch alpha/android-integrated-freeze-20261017 HEAD e72742eddab0c5053644029047bf0808a30097ea.
- main HEAD fdf36aa759dc514b64ddca330ced3747d7fda4af.
- Isolierte B019–B022 Testdateien sind **nicht** als GitHub-Commit nachgewiesen.
- Keine Änderung an main, kein Merge oder Deployment im Zuge dieser Statussicherung.

## Nächster sinnvoller Entwicklungsblock
1. Einmalige technisch saubere, responsive PYLON-Umsetzung auf Basis des originalen FREEZE, ohne Plakat-Cropping oder generische Kästchen.
2. Territory Control: weniger Rot, keine festen Kingdom-/Allianztexte, Header nach FREEZE, doppelte Überschrift beseitigen.
3. Kartenversion anhand tatsächlicher eingebetteter Quelle abgleichen; keine unnötige Testschleife.
4. Ein gezielter Android-Check nach dem Entwicklungsblock.

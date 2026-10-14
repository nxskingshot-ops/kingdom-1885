# NEXUS PHALANX — STATUS QUO / RELEASE BASELINE
**Stichtag:** 2026-10-14
**Status:** Arbeits-Baseline vor Release-1.0-Audit, KEINE Produktionsfreigabe.

## Grundsatz
Ab diesem Stichtag getrennte Entwicklungsspuren: (1) Release 1.0 / Stabilität, (2) Updates 1.x / Verbesserungen, (3) Innovation Lab / 2.0. Neue optionale Features sind kein Release-Blocker. Kritische Bugs, Sicherheit, Integrität und Funktionsfähigkeit sind Release-Blocker.

## Eingefroren
- Verbindliches NEXUS PHALANX Branding und freigegebenes Hochformat-Design.
- Frozen Alpha35 UI und bestehendes produktives index.html nicht ungefragt verändern.
- KvK Opponent Intelligence freigegebenes Layout und Master bleiben unverändert.
- Neue Funktionen zunächst isoliert in Preview/Staging; Produktionsintegration nur nach gesonderter Freigabe.

## Nachweislich vorhandene Grundlagen
- GitHub Repository nxskingshot-ops/kingdom-1885 und Supabase-Projekt hcjrdofkdkasznywvcxo.
- MightPulse Polling für 16 Boards, je 100 Ranking-Einträge; automatisierte Erfassung alle zwei Stunden eingerichtet. Laufende Betriebszuverlässigkeit und Security müssen im Release-Audit gesondert geprüft werden.
- Snapshot 2026-10-14T00:37:52.362Z: 14 Spielerboards × 100 Einträge; 242 verschiedene Spieler (kid+uid); 15 Spieler auf allen 14 Spielerboards. Fehlende Top-100-Einträge sind nicht Nullwerte.
- Read-only Mehrkategorienprofile geprüft; 14-dimensionale FaQu-Beispielauswertung dokumentiert.
- Isolierte Player-Intelligence-HTML-Vorschau mit vier Beispielprofilen in GitHub; Offline-Vorschau separat, kein produktiver Einbau. Vollständige 242-Spieler-Vorschau noch nicht erfolgreich veröffentlicht.
- Datenstrategie, Inventar, verifizierte Stärkenprofile und Profilanforderungen dokumentiert.
- Heldenrechner: Module, Testideen, Monte-Carlo-/Validierungskonzepte in Entwicklung; Freigabereife nicht nachgewiesen.
- Outpost Intelligence, Alliance Comparison, KvK Intelligence und Command Center: Konzepte, Datenmodelle, Dokumente und Teilansichten vorhanden; End-to-End-Status nicht vollständig auditiert.

## Release-1.0-Audit: offene Prüffelder
1. Exakten produktiven Build, Branch, Deployment-URL und Build-Version identifizieren.
2. Tatsächlich integrierte Funktionen und Navigationswege inventarisieren; Buttons/Links auf Android testen.
3. Authentifizierung, Rollen, Supabase RLS/Secrets, Edge Functions, Backup/Restore und Datenschutz prüfen.
4. Datenqualität, Aktualität, Fehlerzustände und Offline-/Netzwerkverhalten prüfen.
5. Freigegebenes Layout, Hochformat, Scrollen, Karten und Darstellung gegen Freeze abgleichen.
6. Kritische Bugs klassifizieren und Release-Blocker von späteren Updates trennen.
7. Freigabekriterien, Verantwortliche und reproduzierbare Release-Checkliste erstellen.

## Release-Gates
- Kein neues optionales Feature als Gate.
- Keine stillschweigende Änderung an Freeze/Produktionsdateien.
- Release 1.0 erst nach nachgewiesenem End-to-End-Test, Sicherheitsprüfung und ausdrücklicher Freigabe.
- Status quo bedeutet dokumentierte Ausgangslage, nicht GO für Release.

## Roadmap
**1.0:** Bestand stabilisieren und veröffentlichen.
**1.x:** Helden-/Datenupdates, Verbesserungen und inkrementelle Funktionen.
**2.0 / Lab:** umfangreiche Profile, fortgeschrittene Simulationen, neue Intelligence-Modelle.

Dieser Status quo ist eine Planungsbaseline und keine Behauptung, alle Bereiche seien bereits funktionsfähig.

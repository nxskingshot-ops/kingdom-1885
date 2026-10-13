# PHALANX Alliance Intelligence — Integrationsstand 2026-10-13

## Verifizierter Datenstand
Supabase-Projekt: `kingdom-1885-app` (`hcjrdofkdkasznywvcxo`).
- `public.phalanx_alliance_snapshots`: vier Summenstände 2026-10-13.
- `public.phalanx_alliance_players`: 395 Spielerstände, anhand Mitgliederzahl, eindeutiger Spieler-IDs und exakter Power-Summen geprüft.
- `public.phalanx_alliance_latest`: neueste Allianzstände.
- `public.phalanx_alliance_top40`: 40 stärkste Spieler pro Allianz (160 Zeilen für 2026-10-13 geprüft).
- `public.phalanx_player_changes`: LAG-basierte Historie; Powerdifferenzen erst bei mindestens zwei Snapshots pro Spieler aussagekräftig.

## Schutz
RLS für beide Basistabellen aktiv. `anon` und `authenticated` haben keine SELECT-Rechte auf die neuen Tabellen/Views. Keine personenbezogenen Spielerkader im öffentlichen GitHub-Repo speichern. Niemals `service_role` im Frontend verwenden.

## Anschlussplan (kein Live-Deploy)
1. Bestehende App-Authentifizierung und Rollen (`nxs_memberships`) prüfen.
2. Gezielt `SELECT` für berechtigte Nutzer über geeignete RLS-Policies und minimal erforderliche Views/RPCs bereitstellen; `anon` bleibt gesperrt.
3. Separaten Testbranch verwenden, keine Veränderung der freigegebenen UI / vier Alliance Cards.
4. Vergleich von UI-Zahlen gegen vier CSV-Quellen, inklusive 98/100/99/98 Spieler, 40 Topspieler pro Allianz und Null-Fällen.
5. Mobiltest (Android Hochformat), Rollen-/Gasttests, Regressionstests, erst dann Merge/Deploy nach Freigabe.

## Nicht als abgeschlossen behaupten
Die App liest die neuen Views derzeit nicht nachweislich. Es wurde kein App-Deploy durchgeführt. Alte September-Daten nicht überschreiben.
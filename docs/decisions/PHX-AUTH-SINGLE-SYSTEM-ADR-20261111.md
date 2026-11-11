# PHALANX Auth – verbindlicher Architekturentscheid (ADR)

Datum: 2026-11-11
Status: BESCHLOSSEN (Architektur); Umsetzung und Stilllegung NICHT FREIGEGEBEN/NOCH NICHT GETESTET.
Projekt: NEXUS APP 2.0 – PHALANX, Kingdom #1885.

## Entscheidung
- **Genau ein Authentifizierungssystem: bestehendes Supabase Auth** im bestehenden Projekt. Kein neues oder paralleles Login-System und keine Neuentwicklung einer zweiten Registrierung.
- Bestehende E-Mail-/Passwort-Anmeldung, Verifizierung, Administratorfreigabe, nxs_memberships, Rollen, Berechtigungen und GOD-Mode bewahren.
- HOME R15, Transfer Scouting und künftige Module verwenden dasselbe Supabase-Auth-Konto und dieselbe bestehende Session; Spieler-ID/MightyPulse ist ein Profil-/Datenlink, **keine zweite Identität und kein Berechtigungsnachweis**.
- Bestehende Konten, insbesondere Projektverantwortlicher und Queen An (R5), nicht neu anlegen, löschen, umstellen oder zurücksetzen.

## Historische Übergangslösung
- Die aktive Edge Function `nexus-access-review` v8 erstellt im bisherigen Approval-Pfad technische Auth-Konten mit `nexus-...@example.com` und generiertem Passwort. Die synthetische Erstellung diente nach Projektkontext als Zwischen-/Testlösung; der ursprüngliche Zweck jeder Nutzung ist vor Abschaltung anhand von Aufrufen und Abhängigkeiten zu verifizieren.
- **Nicht** die gesamte Funktion löschen: sie enthält Administrator-, Rollen- und Freigabelogik. Die technische Kontoerzeugung ist getrennt von der Freigabelogik zu betrachten.
- Wenn die synthetische Kontoerstellung nachweislich nicht mehr benötigt wird: **gezielt stilllegen/deaktivieren** statt pauschal löschen; bestehende Testkonten und Daten nicht automatisch entfernen.
- Kein doppeltes Auth-Konto bei Freigabe eines bereits registrierten Benutzers. Vorhandenes Konto eindeutig und sicher zuordnen.

## Schutz- und Abnahmebedingungen
1. Vor Eingriffen aktuelle Repository-Version, produktive Edge-Function-Version, Datenbankstruktur, Auth-Konten, RLS/Policies, Aufrufer und FREEZEs erneut lesen.
2. Betroffene Daten und Code sichern, Integrität und Rückweg getrennt nachweisen.
3. Änderungen nur isoliert; keine produktive Deaktivierung, Datenlöschung, Rollenänderung oder Migration ohne gesonderte ausdrückliche Freigabe.
4. Registrierung, Login, E-Mail-Verifizierung, Freigabe, bestehende Logins, Rollen (Observer/Operator/Administrator und R5/GOD), Transfer Scouting, HOME/War Room und Regressionen testen.
5. Erst nach belegter Nichtverwendung der synthetischen Erstellung, erfolgreichem Ersatzpfad und bestandenen Tests die **gezielte** Deaktivierung zur Freigabe vorlegen.

## Tatsächlicher Stand (2026-11-11)
- BESTANDEN (Code-/Strukturprüfung): Supabase Auth und Tabellen `app_profiles`, `nxs_memberships`, `nexus_access_requests` vorhanden; `nexus-access-review` v8 mit synthetischem Approval-Pfad gelesen; `phalanx-transfer-id-snapshot-fallback-stage-20261031` v21 mit Auth-/Rollenprüfung gelesen.
- NICHT GETESTET: neuer einheitlicher Registrierungs-/Freigabeablauf, Login-End-to-End, Konto-Verknüpfung, HOME-Integration, Abschaltung, Rollback.
- KEINE produktive Änderung, KEINE Deaktivierung, KEINE Datenlöschung im Rahmen dieser Entscheidung.

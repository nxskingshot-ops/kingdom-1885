# PYLON IX – Rollenlogik Prüfnachweis (2026-11-02)

Branch: `stage/pylon-ix-livebase-20261102`.
Source: `preview/transfer-scouting-id-stage-20261030.js`, blob `acb124ae37c0dff05bdb1dfd6790791e93544907`.

## BESTANDEN – Quellcodekontrolle
- Eliteklassen whale, mega_whale, orca, orca_elite unterdrücken Rally Joiner in der regulären Empfehlung.
- Garrison Attacker und Garrison Holder sind getrennt aufgeführt.
- Der Text weist auf fehlende gesonderte Kampfnachweise für Angriff und Verteidigung hin.
- Die Prioritätsstufen balanced, multi-category und incomplete hängen von dokumentierten Top-10-Kategorien ab, **nicht** von verifizierten Offensiv-/Defensiv-Buffs.

## BESTANDEN – isolierte Szenarien der Entscheidungsregel
- Whale / 3 Top-10-Kategorien -> balanced, kein Joiner.
- Orca / 2 Top-10-Kategorien -> multi-category, kein Joiner.
- Solid / 2 Top-10-Kategorien -> multi-category, Joiner als Support möglich.
- Whale / 0 Top-10-Kategorien -> incomplete, kein Joiner.

## NICHT GETESTET
- Vollständige JavaScript-Modulsyntax und Laufzeit.
- Supabase-Integration und echte MightyPulse-Datensätze.
- Android-/Browser-UI, Navigation, Speicherung, Berechtigungen und Regressionen.
- Tatsächliche Angriff-/Verteidigungseignung mangels Kampfdaten.

## Release-Sperre
Kein produktives Merge oder Deployment. Die Rollenpriorisierung ist eine vorläufige Prüfung von Accountentwicklung, keine bewiesene taktische Spezialisierung. Vor Freigabe vollständige Modul- und Browsertests nachholen.

#!/usr/bin/env python3
"""Check approved HOME information architecture without claiming visual pixel parity."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/"deploy/phalanx-kvk-test/header-v2-app-integration-isolated.html").read_text(encoding="utf-8")
sections=["COMMAND CENTER","WERKZEUGE & RECHNER","INTELLIGENZ & BERICHTE"]
cards=["KvK VORBEREITUNG","AUSSENPOSTEN","TRANSFER SCOUTING","ALLIANZ VERGLEICH","HELDENRECHNER","TRUPPENRATIO","MARSCH OPTIMIERUNG","GEGNER ANALYSE","KÖNIGREICH SCOUT","DATENBERICHTE"]
assert all(section in html for section in sections), "Missing FREEZE section"
assert all(card in html for card in cards), "Missing FREEZE card"
assert all(html.index(a)<html.index(b) for a,b in zip(sections,sections[1:])), "Wrong section order"
assert "b.disabled=true" in html and "if(card.section)" in html, "Unintegrated targets must not appear clickable"
assert "navigate({mode:'detail'" in html, "Existing detail navigation missing"
assert "embeddedModules" in html and "battle-readiness-isolated.html" in html, "Existing Battle Readiness integration missing"
assert "mountPhalanxHeaderV2" in html, "Approved header integration missing"
assert "Pixelgenauer HOME-Abgleich weiterhin offen" in html, "Visual acceptance gate must remain explicit"
print("PASS: isolated HOME information architecture, safe disabled targets, existing navigation; visual FREEZE NOT yet certified")

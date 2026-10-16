#!/usr/bin/env python3
"""Non-destructive design FREEZE audit for the isolated PHALANX preview.

Usage: python scripts/audit_phalanx_global_freeze_isolated.py
Exit 0 when audit runs; findings are explicitly NOT a release approval.
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "deploy/phalanx-kvk-test/header-v2-app-integration-isolated.html"
HOME_FREEZE = ROOT / "docs/design-freeze/PHALANX_HOME_FREEZE_REFERENCE_2026-10-16.md"
GLOBAL_FREEZE = ROOT / "docs/design-freeze/PHALANX_GLOBAL_DESIGN_FREEZE_2026-10-16.md"
IMAGE = ROOT / "assets/design-freeze/PHALANX_HOME_APPROVED_2026-10-16.jpg"
CHECKSUM = "d23305e3631fe5065ae4e3665c1567883aad4dbaa47a6f2ce350a2260cfbfe9d"

def main():
    import hashlib
    html = PAGE.read_text(encoding="utf-8")
    findings = []
    def check(key, ok, detail):
        findings.append({"check": key, "status": "PASS" if ok else "OPEN", "detail": detail})

    check("global_freeze_documented", GLOBAL_FREEZE.exists(), "Global design freeze documented")
    check("home_freeze_documented", HOME_FREEZE.exists(), "HOME composition documented")
    image_ok = IMAGE.is_file() and hashlib.sha256(IMAGE.read_bytes()).hexdigest() == CHECKSUM
    check("exact_home_reference_in_repo", image_ok, "Exact 1024x1536 source image required for visual diff")
    check("account_identity", all(x in html for x in ("FaQu", "Kingdom #1885")), "Profile/kingdom overlay visible in app DOM")
    check("command_center_labels", all(label in html for label in ("KvK VORBEREITUNG", "AUSSENPOSTEN", "TRANSFER SCOUTING", "ALLIANZ VERGLEICH")), "Four Command Center labels present; artwork not certified")
    check("tools_labels", all(label in html for label in ("HELDENRECHNER", "TRUPPENRATIO", "MARSCH OPTIMIERUNG")), "Three tools labels present; artwork not certified")
    check("intelligence_labels", all(label in html for label in ("GEGNER ANALYSE", "KÖNIGREICH SCOUT", "DATENBERICHTE")), "Three intelligence labels present; artwork not certified")
    check("no_generic_final_cards", not bool(re.search(r"\.tile\s*\{[^}]*background:\s*#0b2030", html)), "Legacy flat .tile CSS must be removed before release")
    check("illustrated_card_assets", False, "Approved individual card illustrations not yet present/verified in isolated app")
    check("three_header_states", all(x in html for x in ("header-home.png", "header-module.png", "header-detail.png")), "HOME / MODULE / DETAIL artwork wired")
    check("existing_module_integrated", "battle-readiness-isolated.html" in html, "Existing module link remains wired")
    print(json.dumps({"scope": "isolated preview", "release_approved": False, "findings": findings, "open_count": sum(x["status"] == "OPEN" for x in findings)}, indent=2, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

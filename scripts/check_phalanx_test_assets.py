#!/usr/bin/env python3
"""Read-only preflight for the isolated PHALANX Cloudflare test assets."""
from pathlib import Path
import re
import sys

base = Path(__file__).resolve().parents[1] / "deploy" / "phalanx-kvk-test"
required = ("index.html", "index-kvk.html", "kvk-prep-v13.html", "epic-navigation-v2-kvk-test.html")
errors = []
for name in required:
    file = base / name
    if not file.is_file() or not file.stat().st_size:
        errors.append(f"Missing/empty test asset: {name}")

if not errors:
    root = (base / "index.html").read_text(encoding="utf-8")
    nav = (base / "index-kvk.html").read_text(encoding="utf-8")
    kvk = (base / "kvk-prep-v13.html").read_text(encoding="utf-8")
    epic_v2 = (base / "epic-navigation-v2-kvk-test.html").read_text(encoding="utf-8")
    if "Epic Navigation V2" not in epic_v2:
        errors.append("Epic V2 test file lacks the expected V2 title")
    if not re.search(r'<a\s+href=["\']\./kvk-prep-v13\.html["\']>KvK Prep', epic_v2):
        errors.append("Epic V2 KvK Prep link missing or disabled")
    if epic_v2.count('data-unlinked="1"') != 37:
        errors.append("Epic V2 placeholder count changed; check design freeze")
    if "./kvk-prep-v13.html" not in nav:
        errors.append("Navigation does not link to the expected KvK module")
    if not re.search(r"<title[^>]*>.*?</title>", nav, re.I | re.S):
        errors.append("Navigation page lacks a title")
    if not re.search(r"<title[^>]*>.*?</title>", kvk, re.I | re.S):
        errors.append("KvK page lacks a title")
    for name, data in (("index.html", root), ("index-kvk.html", nav), ("kvk-prep-v13.html", kvk), ("epic-navigation-v2-kvk-test.html", epic_v2)):
        if re.search(r"service[_-]?role|sb_secret_", data, re.I):
            errors.append(f"Potential privileged key marker in {name}; manual security review required")
    if "Deployment-Test erfolgreich" in root:
        print("WARNING: Root index.html is still a placeholder; root routing must be verified before release.")
    if "hcjrdofkdkasznywvcxo.supabase.co" in kvk:
        print("WARNING: KvK test page references the existing Supabase project; auth isolation is NOT verified.")

if errors:
    for error in errors:
        print("FAIL:", error, file=sys.stderr)
    sys.exit(1)
print("PASS: Isolated PHALANX test asset preflight (not an auth/security certification).")

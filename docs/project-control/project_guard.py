#!/usr/bin/env python3
"""Static project gate for PHALANX R6 HTML; does not replace Android testing."""
import argparse
import base64
import hashlib
import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
STATE = json.loads((ROOT / "project_state.json").read_text(encoding="utf-8"))
parser = argparse.ArgumentParser()
parser.add_argument("candidate", type=Path)
args = parser.parse_args()
soup = BeautifulSoup(args.candidate.read_text(encoding="utf-8"), "html.parser")
issues = []

if soup.select_one("#phx-r6-epic-nav") or soup.find(string=re.compile("EPIC NAVIGATION V2", re.I)):
    issues.append("BLOCK: retired Epic Navigation V2 is present")
if not soup.select_one("#phx-r6-home"):
    issues.append("BLOCK: original HOME layer missing")
if not soup.select_one("#home"):
    issues.append("BLOCK: Territory Control missing")
for key in ("map", "report", "phx-pylon-modal"):
    if not soup.find(id=key):
        issues.append(f"BLOCK: required existing section #{key} missing")
home_img = soup.select_one("#phx-r6-home img")
if home_img:
    data = home_img.get("src", "")
    if not data.startswith("data:image/png;base64,"):
        issues.append("BLOCK: HOME artwork not embedded PNG")
    else:
        digest = hashlib.sha256(base64.b64decode(data.split(",", 1)[1])).hexdigest()
        expected = soup.select_one("#phx-r6-home").get("data-original-sha256")
        if digest != expected:
            issues.append("BLOCK: HOME original hash mismatch")
else:
    issues.append("BLOCK: HOME original image missing")

print("CANDIDATE:", args.candidate.name)
print("STATE:", STATE["as_of"])
for issue in issues:
    print(issue)
if issues:
    print("RESULT: FAIL — candidate must not be called current approved integration")
    sys.exit(1)
print("RESULT: PASS (static gate only; not an Android runtime test)")

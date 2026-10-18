#!/usr/bin/env python3
"""Fail closed for an incorrectly advertised CURRENT Outpost map."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
lock = json.loads((root / "data/phalanx-alpha-version-lock-20261018.json").read_text())
assert lock["app"]["status"] == "TEST"
modules = {m["code"]: m for m in lock["modules"]}
assert modules["OUT-023"]["current"] is False
current = modules["OUT-024"]
assert current["current"] is True
assert current["status"] == "REFERENCE_CONFIRMED_SOURCE_UNVERIFIED"
assert current["path"] is None
# Until Alpha24 source is verified, do not mislabel the deployed Alpha23.
harness = (root / "preview/phalanx-alpha-android-integration-20261017.html").read_text()
assert "Outpost Map V2 · approved Alpha23" not in harness, "BLOCKED: Alpha23 mislabeled as current"
assert "Outpost Map Alpha23 · legacy reference" in harness
print("PASS: Alpha23 visibly marked legacy; Alpha24 source remains unverified")

assert lock['app']['id'] in harness
assert lock['app']['build'] in harness

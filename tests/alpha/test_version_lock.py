#!/usr/bin/env python3
"""Fail closed for an incorrectly advertised CURRENT Outpost map."""
import json
import hashlib
from pathlib import Path

root = Path(__file__).resolve().parents[2]
lock = json.loads((root / "data/phalanx-alpha-version-lock-20261018.json").read_text())
assert lock["app"]["status"] == "TEST"
modules = {m["code"]: m for m in lock["modules"]}
assert modules["OUT-023"]["current"] is False
assert modules["OUT-023"]["installed"] is True
assert modules["OUT-023"]["reference_only"] is False
legacy = modules["OUT-023"]
legacy_path = root / legacy["path"]
assert legacy_path.is_file(), "BLOCKED: legacy source missing"
assert hashlib.sha256(legacy_path.read_bytes()).hexdigest() == legacy["sha256"], "BLOCKED: legacy source hash mismatch"
current = modules["OUT-024"]
assert current["current"] is True
assert current["installed"] is False
assert current["reference_only"] is True
assert not any(m["installed"] and m["reference_only"] for m in modules.values())
assert current["status"] == "REFERENCE_CONFIRMED_SOURCE_UNVERIFIED"
assert current["path"] is None
assert current["sha256"] is None
assert not any(m["code"] == "OUT-024" and m.get("path") for m in lock["modules"]), "BLOCKED: unverified Alpha24 route"
# Until Alpha24 source is verified, do not mislabel the deployed Alpha23.
harness = (root / "preview/phalanx-alpha-android-integration-20261017.html").read_text()
assert "Outpost Map V2 · approved Alpha23" not in harness, "BLOCKED: Alpha23 mislabeled as current"
assert "Outpost Map Alpha23 · legacy reference" in harness
print("PASS: Alpha23 visibly marked legacy; Alpha24 source remains unverified")

assert lock['app']['id'] in harness
assert lock['app']['build'] in harness

assert len(lock['changes']) >= 1
assert all(item['kind'] in ('warning','error','changed','added','unchanged') for item in lock['changes'])
assert all(item['verified'] is True for item in lock['changes'])

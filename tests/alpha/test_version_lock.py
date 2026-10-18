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
assert current["installed"] is True
assert current["reference_only"] is False
assert current["status"] == "USER_APPROVED_SOURCE_STAGED_AWAITING_CI"
assert current["path"] == "preview/PHX-OUT-024-MAP2-FROZEN-20261018.html"
assert current["sha256"] == "1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d"
assert hashlib.sha256((root / current["path"]).read_bytes()).hexdigest() == current["sha256"]
assert not any(m["installed"] and m["reference_only"] for m in modules.values())
harness = (root / "preview/phalanx-alpha-android-integration-20261017.html").read_text()
assert "Outpost Map Alpha23 · legacy reference" not in harness
assert "Outpost Map 2.0 · Alpha24 · verified original" in harness
print("PASS: B003 verified OUT-024 installed; archived Alpha23 remains noncurrent")

assert lock['app']['id'] in harness
assert lock['app']['build'] in harness

assert len(lock['changes']) >= 1
assert all(item['kind'] in ('warning','error','changed','added','unchanged') for item in lock['changes'])
assert all(item['verified'] is True for item in lock['changes'])

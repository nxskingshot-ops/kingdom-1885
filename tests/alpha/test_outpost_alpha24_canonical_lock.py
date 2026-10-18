#!/usr/bin/env python3
"""Fail-closed OUT-024 identity gate; no fallback to legacy maps."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
lock = json.loads((root / "data/outpost-map-alpha24-canonical-lock-20261018.json").read_text())
assert lock["canonical_id"] == "PHX-OUT-024-MAP2-FROZEN-20261018"
assert lock["original"]["immutable"] is True
assert lock["guards"]["forbid_legacy_as_current"] is True
assert lock["guards"]["require_exact_sha256"] is True
assert len(lock["original"]["sha256"]) == 64
assert lock["original"]["bytes"] == 1105961
registry = json.loads((root / "data/phalanx-alpha-version-lock-20261018.json").read_text())
modules = {m["code"]: m for m in registry["modules"]}
assert modules["OUT-023"]["current"] is False, "Legacy Outpost must never be current"
current = modules["OUT-024"]
assert current["current"] is True
if current["installed"]:
    assert current["reference_only"] is False
    path = current["path"]
    assert path and "alpha23" not in path.lower()
    source = root / path
    assert source.is_file(), "Current OUT-024 source missing: fail closed"
    content = source.read_bytes()
    assert len(content) == lock["original"]["bytes"], "OUT-024 size mismatch"
    assert hashlib.sha256(content).hexdigest() == lock["original"]["sha256"], "OUT-024 source checksum mismatch"
    assert current["sha256"] == lock["original"]["sha256"], "Version registry checksum mismatch"
else:
    assert current["reference_only"] is True
    assert current["path"] is None
    assert current["sha256"] is None
print("PASS: OUT-024 canonical lock; source", "installed and byte-verified" if current["installed"] else "safely marked NOT INSTALLED")

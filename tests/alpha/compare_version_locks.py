#!/usr/bin/env python3
"""Compare two PHALANX version locks. Unknown source identity is never approved."""
import json
import sys
from pathlib import Path

COLORS = {"added": "green", "changed": "blue", "removed": "red", "unchanged": "gray", "unverified": "yellow"}
def compare(old, new):
    for label, registry in (("baseline", old), ("current", new)):
        codes = [m["code"] for m in registry["modules"]]
        if len(codes) != len(set(codes)):
            raise ValueError(f"BLOCKED: duplicate module codes in {label}")
        for m in registry["modules"]:
            if m.get("reference_only") and m.get("installed"):
                raise ValueError(f"BLOCKED: reference-only module installed: {m['code']}")
            if m.get("installed") and (not m.get("path") or not m.get("sha256")):
                raise ValueError(f"BLOCKED: installed module lacks source identity: {m['code']}")
    before = {m["code"]: m for m in old["modules"]}
    after = {m["code"]: m for m in new["modules"]}
    result = []
    for code in sorted(before.keys() | after.keys()):
        a, b = before.get(code), after.get(code)
        if a is None:
            kind = "added"
        elif b is None:
            kind = "removed"
        elif a == b:
            kind = "unchanged"
        else:
            kind = "changed"
        if b and b.get("current") and (not b.get("path") or not b.get("sha256")):
            kind = "unverified"
        result.append({"code": code, "kind": kind, "color": COLORS[kind],
                       "before": a, "after": b})
    return {"schema": 1, "before_build": old["app"]["build"],
            "after_build": new["app"]["build"], "same_build": old["app"]["build"] == new["app"]["build"], "modules": result,
            "source_verified": all(not m.get("current") or
               (m.get("path") and m.get("sha256")) for m in after.values())}

if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit("usage: compare_version_locks.py BASELINE CURRENT OUTPUT")
    old, new = (json.loads(Path(p).read_text(encoding="utf-8")) for p in sys.argv[1:3])
    result = compare(old, new)
    Path(sys.argv[3]).write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Compared", len(result["modules"]), "module versions; source_verified:", result["source_verified"])

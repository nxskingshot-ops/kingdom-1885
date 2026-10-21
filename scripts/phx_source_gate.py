#!/usr/bin/env python3
"""PHX-INT-001: stdlib-only integration source gate. Read-only; no network."""
import argparse
import json
from pathlib import Path

def check(manifest, root):
    failures = []
    for entry in manifest["sources"]:
        path = root / entry["path"]
        if entry["status"] in ("SUPERSEDED", "DEFECTIVE", "QUARANTINED"):
            continue
        if not path.is_file():
            failures.append(f"MISSING: {entry['id']} {entry['path']}")
            continue
        if entry.get("sha256"):
            import hashlib
            actual = hashlib.sha256(path.read_bytes()).hexdigest()
            if actual != entry["sha256"]:
                failures.append(f"HASH MISMATCH: {entry['id']}")
    for entry in manifest["routes"]:
        target = next((x for x in manifest["sources"] if x["id"] == entry["source_id"]), None)
        if target is None:
            failures.append(f"UNKNOWN SOURCE: {entry['source_id']}")
        elif target["status"] in ("SUPERSEDED", "DEFECTIVE", "QUARANTINED", "UNKNOWN"):
            failures.append(f"BLOCKED ROUTE: {entry['route']} -> {target['id']} ({target['status']})")
    return failures

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--root", default=".")
    args = parser.parse_args()
    data = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    failures = check(data, Path(args.root))
    for item in failures:
        print(item)
    print(f"PHX SOURCE GATE: {'FAIL' if failures else 'PASS'}")
    raise SystemExit(bool(failures))

if __name__ == "__main__":
    main()

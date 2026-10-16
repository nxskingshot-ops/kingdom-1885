#!/usr/bin/env python3
"""Read-only gate for PHALANX V2 binary assets; exits nonzero if incomplete.

Usage: python3 scripts/verify_phalanx_header_v2_assets.py [repository-root]
Does not modify files, generate artwork, or touch production.
"""
from pathlib import Path
import hashlib
import struct
import sys

EXPECTED = {
    "assets/header-v2/PHALANX_HEADER_V2_APPROVED_REFERENCE.png": ((1536, 1024), "16d1091c0c862e8bc1a6b8b7361ec202b96055911d90e4b48c5afad99d8371f3"),
    "assets/header-v2/header-home.png": ((506, 217), None),
    "assets/header-v2/header-module.png": ((506, 217), None),
    "assets/header-v2/header-detail.png": ((506, 217), None),
}

def inspect(root):
    errors = []
    for relative, (dimensions, checksum) in EXPECTED.items():
        path = root / relative
        if not path.is_file():
            errors.append(f"MISSING {relative}")
            continue
        data = path.read_bytes()
        if len(data) < 24 or data[:8] != b"\\x89PNG\\r\\n\\x1a\\n" or data[12:16] != b"IHDR":
            errors.append(f"INVALID PNG {relative}")
            continue
        actual = struct.unpack(">II", data[16:24])
        if actual != dimensions:
            errors.append(f"DIMENSION MISMATCH {relative}: {actual}, expected {dimensions}")
        if checksum and hashlib.sha256(data).hexdigest() != checksum:
            errors.append(f"SHA256 MISMATCH {relative}")
        if not any(relative in e for e in errors):
            print(f"PASS {relative}: {actual[0]}x{actual[1]}")
    return errors

if __name__ == "__main__":
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    errors = inspect(root)
    for error in errors:
        print("FAIL", error, file=sys.stderr)
    print(f"PHALANX V2 asset gate: {'BLOCKED' if errors else 'PASS'}")
    sys.exit(bool(errors))

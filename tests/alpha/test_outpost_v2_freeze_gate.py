#!/usr/bin/env python3
"""Fail-closed Outpost V2 identity and route gate. Read-only; no network."""
from pathlib import Path
import hashlib
import sys

ROOT = Path(__file__).resolve().parents[2]
FROZEN = ROOT / "preview" / "outpost-map-alpha23-frozen.html"
EXPECTED = "e8109617ef6d4578f4bfd7ca3a519bceedbae0850b432e6f27e24ef2d82fe0b0"
ADAPTER = ROOT / "preview" / "phalanx-rc5-isolated-route-adapter-20261017.js"

def main():
    if not FROZEN.is_file():
        sys.exit("BLOCKED: approved Alpha23 frozen HTML missing from isolated branch")
    actual = hashlib.sha256(FROZEN.read_bytes()).hexdigest()
    if actual != EXPECTED:
        sys.exit(f"BLOCKED: Alpha23 SHA-256 mismatch: {actual}")
    if not ADAPTER.is_file():
        sys.exit("BLOCKED: RC5 route adapter missing")
    adapter = ADAPTER.read_text(encoding="utf-8")
    if "'Reports & History':'outpost-report-v11.html'" in adapter:
        sys.exit("BLOCKED: legacy Outpost v11 is still wired")
    if "'Reports & History':'outpost-map-alpha23-frozen.html'" not in adapter:
        sys.exit("BLOCKED: approved Outpost V2 route not explicitly wired")
    print("PASS: approved Alpha23 SHA-256 and RC5 route verified")

if __name__ == "__main__":
    main()

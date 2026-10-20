#!/usr/bin/env python3
"""Build a self-contained, same-origin HOME derivative for isolated HTTPS preview.

Input: exact frozen HOME bytes supplied from the verified private backup.
Never modify the input or write to production. Fail closed on unexpected source.
Usage:
 python3 tests/alpha/build_first_strike_home.py INPUT_FROZEN_HOME.html OUTPUT_DIR
"""
from pathlib import Path
import hashlib
import sys

EXPECTED_SHA256 = "f8e8a4c4a61cdaf89b9b6de8a8c8c906c0cace084e9b54ae6ac5ed4b90fa8031"
REMOTE = "https://raw.githubusercontent.com/nxskingshot-ops/kingdom-1885/main/preview/nexus-app-2-command-center-portrait-final-polish-test.html"
LOCAL = "./PHX-FIRST-STRIKE-HOME-BASE-20261020.html"
REQUIRED = (
    "PHX-FIRST-STRIKE-HOME-BASE-20261020.html",
    "PHX-FIRST-STRIKE-HOME-TERRITORY-ALPHA-20261020.html",
    "PHX-FIRST-STRIKE-TERRITORY-ALPHA-20261020.html",
    "PHALANX_RC5_OUT024_REPORTS_ISOLATED_NAV_20261019.html",
    "PHALANX_RC5_ALPHA_DERIVED_20261017.html",
    "PHX-OUT-024-MAP2-FROZEN-20261018.html",
    "phalanx-reports-out024-local-adapter-20261019.html",
    "phalanx-out024-report-normalizer-20261019.js",
)
def build(source: Path, destination: Path):
    raw=source.read_bytes()
    actual=hashlib.sha256(raw).hexdigest()
    if actual!=EXPECTED_SHA256:
        raise ValueError(f"Frozen HOME mismatch: {actual}; expected {EXPECTED_SHA256}")
    if raw.count(REMOTE.encode())!=1:
        raise ValueError("Frozen HOME remote loader contract changed; refusing transformation")
    for name in REQUIRED:
        if not (destination/name).is_file():
            raise FileNotFoundError(f"Missing preview dependency: {name}")
    derivative=raw.replace(REMOTE.encode(),LOCAL.encode())
    if b"raw.githubusercontent.com/nxskingshot-ops/kingdom-1885/main/" in derivative:
        raise ValueError("Unpinned source remains")
    (destination/"NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html").write_bytes(derivative)
    (destination/"index.html").write_bytes((destination/"PHX-FIRST-STRIKE-HOME-TERRITORY-ALPHA-20261020.html").read_bytes())
    print("FIRST STRIKE same-origin preview assembled; frozen input untouched.")
    print("Derivative SHA256:",hashlib.sha256(derivative).hexdigest())
if __name__=="__main__":
    if len(sys.argv)!=3:
        raise SystemExit("Usage: build_first_strike_home.py FROZEN_HOME OUTPUT_DIR")
    build(Path(sys.argv[1]),Path(sys.argv[2]))

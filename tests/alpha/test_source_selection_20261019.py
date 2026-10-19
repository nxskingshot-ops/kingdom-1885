#!/usr/bin/env python3
"""Guard against selecting legacy Outpost Map Alpha23 as current."""
from pathlib import Path

root = Path(__file__).resolve().parents[2]
log = (root / 'docs/PHALANX-ALPHA-SOURCE-RECONCILIATION-20261019.md').read_text()
assert 'PHX-OUT-024-MAP2-FROZEN-20261018' in log
assert 'Alpha23' in log
print('PASS: canonical Alpha24 source decision documented')

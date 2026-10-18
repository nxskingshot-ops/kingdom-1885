#!/usr/bin/env python3
"""Stage verified OUT-024 source; never substitute OUT-023."""
from pathlib import Path
import hashlib, json, shutil, sys
root=Path(__file__).resolve().parents[2]
lock=json.loads((root/'data/outpost-map-alpha24-canonical-lock-20261018.json').read_text())
expected=lock['original']['sha256']
source=root/'preview/PHX-OUT-024-MAP2-FROZEN-20261018.html'
if not source.is_file():
    sys.exit('BLOCKED: approved OUT-024 source absent; upload exact original to '+str(source))
actual=hashlib.sha256(source.read_bytes()).hexdigest()
if actual!=expected or source.stat().st_size!=lock['original']['bytes']:
    sys.exit('BLOCKED: OUT-024 checksum or size mismatch; do not deploy')
dest=root/'alpha-deploy'/source.name
dest.parent.mkdir(parents=True,exist_ok=True)
shutil.copyfile(source,dest)
assert hashlib.sha256(dest.read_bytes()).hexdigest()==expected
print('PASS: immutable OUT-024 copied byte-identically to alpha-deploy')

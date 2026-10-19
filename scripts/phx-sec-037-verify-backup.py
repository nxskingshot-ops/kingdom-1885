#!/usr/bin/env python3
"""Offline PHX-SEC-037 source inventory preflight; NOT a comprehensive secret scanner."""
import argparse, hashlib, json, re, sys
from pathlib import Path

PATTERNS = [
    re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----'),
    re.compile(rb'(?i)(?:api[_-]?key|secret|token|password)\s*[:=]\s*["\x27][^"\x27\r\n]{8,}["\x27]'),
    re.compile(rb'(?i)(?:postgres(?:ql)?|mongodb(?:\+srv)?|redis)://[^\s"\x27]+:[^\s"\x27@]+@'),
]

def inspect(root, inventory):
    if not root.is_dir() or not inventory:
        raise ValueError('missing source directory or live inventory')
    if any(not isinstance(x, dict) or not isinstance(x.get('slug'), str) or not re.fullmatch(r'[a-zA-Z0-9][a-zA-Z0-9_-]*', x['slug']) for x in inventory):
        raise ValueError('invalid function slug')
    expected = {x['slug']: x for x in inventory}
    if len(expected) != len(inventory) or not all(x.get('version') is not None and x.get('ezbr_sha256') for x in inventory):
        raise ValueError('invalid or duplicate inventory entries')
    if any(p.is_symlink() for p in root.rglob('*')):
        raise ValueError('symlinks prohibited')
    actual = {p.name for p in root.iterdir() if p.is_dir()}
    if actual != set(expected) or any(p.is_file() for p in root.iterdir()):
        raise ValueError('source inventory mismatch')
    entries = []
    for slug in sorted(expected):
        files = sorted(p for p in (root / slug).rglob('*') if p.is_file())
        if not files:
            raise ValueError('empty function directory')
        hashes = []
        for p in files:
            if p.is_symlink() or not p.resolve().is_relative_to(root.resolve()):
                raise ValueError('unsafe file path')
            data = p.read_bytes()
            if any(pattern.search(data) for pattern in PATTERNS):
                raise ValueError('potential embedded credential')
            hashes.append({'path':p.relative_to(root).as_posix(),'sha256':hashlib.sha256(data).hexdigest()})
        item = expected[slug]
        entries.append({'slug':slug,'version':item['version'],'deployed_bundle_sha256':item['ezbr_sha256'],'files':hashes})
    return {'format':'PHX-SEC-037-v1','functions':entries,'note':'Source digests are not comparable to deployed bundle digests.'}

if __name__ == '__main__':
    a=argparse.ArgumentParser()
    a.add_argument('--sources',type=Path,required=True)
    a.add_argument('--inventory',type=Path,required=True)
    a.add_argument('--output',type=Path,required=True)
    args=a.parse_args()
    try:
        manifest=inspect(args.sources,json.loads(args.inventory.read_text()))
        args.output.write_text(json.dumps(manifest,indent=2)+'\n')
    except (ValueError,KeyError,OSError,json.JSONDecodeError):
        print('PHX-SEC-037: validation failed; no source contents disclosed',file=sys.stderr)
        sys.exit(1)

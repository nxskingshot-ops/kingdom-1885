#!/usr/bin/env python3
"""Local encrypted archive readback verification; no network, credentials or restore."""
import argparse
import hashlib
import sys
from pathlib import Path

def verify_file(path, expected):
    if len(expected) != 64 or any(c not in '0123456789abcdefABCDEF' for c in expected):
        raise ValueError('invalid expected SHA-256')
    if not path.is_file() or path.is_symlink():
        raise ValueError('missing or unsafe ciphertext file')
    digest = hashlib.sha256()
    with path.open('rb') as source:
        while True:
            block = source.read(1024 * 1024)
            if not block:
                break
            digest.update(block)
    if digest.hexdigest().lower() != expected.lower():
        raise ValueError('ciphertext integrity mismatch')
    return True

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ciphertext', type=Path, required=True)
    parser.add_argument('--sha256', required=True)
    args = parser.parse_args()
    try:
        verify_file(args.ciphertext, args.sha256)
        print('PHX-SEC-037 ciphertext checksum verified')
    except (OSError, ValueError):
        print('PHX-SEC-037 ciphertext verification failed', file=sys.stderr)
        sys.exit(1)

#!/usr/bin/env python3
"""Offline encrypted object-store contract fixture; no network or production data."""
import hashlib
from pathlib import Path

def verified_roundtrip(store, key, encrypted, expected_sha256):
    """Simulate private object storage; reject corruption or absent objects."""
    if not isinstance(key,str) or not key.startswith('edge-functions/') or '..' in key.split('/'):
        raise ValueError('invalid private object key')
    if hashlib.sha256(encrypted).hexdigest()!=expected_sha256:
        raise ValueError('local ciphertext checksum mismatch')
    store[key]=bytes(encrypted)
    downloaded=store.get(key)
    if downloaded is None or hashlib.sha256(downloaded).hexdigest()!=expected_sha256:
        raise ValueError('remote ciphertext checksum mismatch')
    return downloaded

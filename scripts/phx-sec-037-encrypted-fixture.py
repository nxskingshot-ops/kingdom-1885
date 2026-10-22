#!/usr/bin/env python3
"""Offline synthetic fixture archive proof; NOT a production backup workflow."""
import hashlib
import io
import os
import tarfile
from pathlib import Path
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

MAGIC = b'PHX037-AESGCM-1\n'

def encrypt_bytes(plaintext, key):
    if len(key) != 32:
        raise ValueError('AES-256 key must be 32 bytes')
    nonce = os.urandom(12)
    return MAGIC + nonce + AESGCM(key).encrypt(nonce, plaintext, MAGIC)

def decrypt_bytes(ciphertext, key):
    if not ciphertext.startswith(MAGIC) or len(ciphertext) < len(MAGIC) + 28:
        raise ValueError('invalid archive envelope')
    start = len(MAGIC)
    return AESGCM(key).decrypt(ciphertext[start:start+12], ciphertext[start+12:], MAGIC)

def archive_synthetic(root, key):
    root = Path(root)
    if not root.is_dir():
        raise ValueError('missing fixture directory')
    if root.is_symlink():
        raise ValueError('symlink root prohibited')
    buffer = io.BytesIO()
    with tarfile.open(fileobj=buffer, mode='w') as tar:
        for path in sorted(root.rglob('*')):
            if path.is_symlink():
                raise ValueError('symlink prohibited')
            if path.is_file():
                tar.add(path, arcname=path.relative_to(root).as_posix(), recursive=False)
    if not buffer.getvalue() or not any(p.is_file() for p in root.rglob('*')):
        raise ValueError('empty archive prohibited')
    encrypted = encrypt_bytes(buffer.getvalue(), key)
    return encrypted, hashlib.sha256(encrypted).hexdigest()

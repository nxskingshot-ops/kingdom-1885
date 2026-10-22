#!/usr/bin/env python3
"""PHX-SEC-037 private B2 encrypted roundtrip. Requires reviewed preflight.

Only ciphertext is uploaded. Caller provides an already-encrypted archive.
No production restore, no source output, no Git operations.
"""
import hashlib
import os
import pathlib
import subprocess
import tempfile

ENDPOINT = "https://s3.eu-central-003.backblazeb2.com"
BUCKET = "nexus-phalanx-backup"
PREFIX = "edge-functions/encrypted/"

def _aws(*args):
    return subprocess.run(["aws", "--endpoint-url", ENDPOINT, "s3api", *args],
                          check=True, capture_output=True, text=True)

def upload_and_verify(encrypted_path, object_key, expected_sha256):
    path = pathlib.Path(encrypted_path)
    if not path.is_file() or path.is_symlink():
        raise ValueError("invalid encrypted archive")
    if not object_key.startswith(PREFIX) or "/" in object_key[len(PREFIX):] or not object_key.endswith(".enc"):
        raise ValueError("invalid private object key")
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if digest != expected_sha256:
        raise ValueError("local ciphertext digest mismatch")
    if not all(os.getenv(x) for x in ("AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY")):
        raise RuntimeError("B2 credentials missing")
    _aws("put-object", "--bucket", BUCKET, "--key", object_key,
         "--body", str(path), "--content-type", "application/octet-stream")
    with tempfile.TemporaryDirectory(prefix="phx037-b2-") as temp:
        recovered = pathlib.Path(temp) / "download.enc"
        _aws("get-object", "--bucket", BUCKET, "--key", object_key, str(recovered))
        actual = hashlib.sha256(recovered.read_bytes()).hexdigest()
        if actual != expected_sha256:
            raise ValueError("remote ciphertext mismatch")
        return recovered.read_bytes()

#!/usr/bin/env python3
"""PHX-SEC-037: fail-closed local archive verification. No network or deployment."""
import hashlib
import io
import json
import os
import pathlib
import re
import tarfile

SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
SHA = re.compile(r"^[a-f0-9]{64}$")

def create_archive(root, inventory):
    root = pathlib.Path(root)
    if not isinstance(inventory, list) or len(inventory) != 26:
        raise ValueError("expected 26 functions")
    seen = set()
    files = []
    for item in inventory:
        slug, version, digest = item["slug"], item["version"], item["ezbr_sha256"]
        if not SLUG.fullmatch(slug) or slug in seen or not isinstance(version, int) or not SHA.fullmatch(digest):
            raise ValueError("invalid inventory")
        seen.add(slug)
        directory = root / slug
        if directory.is_symlink() or not directory.is_dir():
            raise ValueError("missing function")
        found = 0
        for path in sorted(directory.rglob("*")):
            if path.is_symlink():
                raise ValueError("symlink")
            if path.is_dir():
                continue
            if not path.is_file():
                raise ValueError("unsupported file")
            rel = path.relative_to(root).as_posix()
            if not path.stat().st_size:
                raise ValueError("empty file")
            files.append((rel, path.read_bytes(), slug, version, digest))
            found += 1
        if not found:
            raise ValueError("empty function")
    if {p.name for p in root.iterdir()} != seen:
        raise ValueError("unexpected function directory")
    manifest = [{"path": rel, "sha256": hashlib.sha256(data).hexdigest(), "slug": slug,
                 "version": version, "bundle_sha256": digest} for rel, data, slug, version, digest in files]
    payload = io.BytesIO()
    with tarfile.open(fileobj=payload, mode="w") as tar:
        for rel, data, *_ in files:
            info = tarfile.TarInfo("sources/" + rel)
            info.size = len(data)
            info.mode = 0o600
            info.mtime = 0
            tar.addfile(info, io.BytesIO(data))
        raw = json.dumps(manifest, sort_keys=True, separators=(",", ":")).encode()
        info = tarfile.TarInfo("manifest.json")
        info.size = len(raw)
        info.mode = 0o600
        info.mtime = 0
        tar.addfile(info, io.BytesIO(raw))
    return payload.getvalue()

def verify_archive(payload, expected_inventory):
    expected = {(x["slug"], x["version"], x["ezbr_sha256"]) for x in expected_inventory}
    if len(expected) != 26:
        raise ValueError("invalid expected inventory")
    with tarfile.open(fileobj=io.BytesIO(payload), mode="r:*") as tar:
        members = tar.getmembers()
        names = [m.name for m in members]
        if len(names) != len(set(names)) or "manifest.json" not in names:
            raise ValueError("duplicate or missing archive entry")
        if any(not m.isfile() or m.size <= 0 or m.name.startswith("/") or ".." in pathlib.PurePosixPath(m.name).parts for m in members):
            raise ValueError("unsafe archive")
        manifest = json.loads(tar.extractfile("manifest.json").read())
        if len(manifest) != len(members)-1:
            raise ValueError("manifest coverage mismatch")
        matched = set()
        for row in manifest:
            rel = row["path"]
            if not rel.startswith(row["slug"] + "/") or not SHA.fullmatch(row["sha256"]):
                raise ValueError("invalid manifest")
            if (row["slug"], row["version"], row["bundle_sha256"]) not in expected:
                raise ValueError("metadata mismatch")
            name = "sources/" + rel
            if name not in names:
                raise ValueError("missing source")
            data = tar.extractfile(name).read()
            if hashlib.sha256(data).hexdigest() != row["sha256"]:
                raise ValueError("source checksum mismatch")
            matched.add(row["slug"])
        if matched != {x[0] for x in expected}:
            raise ValueError("function coverage mismatch")
    return True

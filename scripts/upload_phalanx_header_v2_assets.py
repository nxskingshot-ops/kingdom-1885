#!/usr/bin/env python3
"""Upload PHALANX V2 approved PNG assets to isolated GitHub branch.

Usage:
  GITHUB_TOKEN=... python3 scripts/upload_phalanx_header_v2_assets.py PHALANX_HEADER_V2_GITHUB_READY.zip

Uses GitHub's Git Data API with one atomic commit, never production.
Requires a token with repository contents:write permission.
"""
import base64
import hashlib
import json
import os
from pathlib import Path
import sys
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from zipfile import ZipFile

REPO = "nxskingshot-ops/kingdom-1885"
BRANCH = "fix/battle-readiness-navigation-isolated-20261015"
SHA256 = {
    "assets/header-v2/PHALANX_HEADER_V2_APPROVED_REFERENCE.png": "16d1091c0c862e8bc1a6b8b7361ec202b96055911d90e4b48c5afad99d8371f3",
    "assets/header-v2/header-home.png": "40e1aa10f12dc3f13a6a03b2a2c32a80be4f4bc7aa5bc6c77dfded5157914908",
    "assets/header-v2/header-module.png": "31cb1d1f787687f0839b595f3a86f9715ada1e9d2e3b29156fe5c68919df1a0d",
    "assets/header-v2/header-detail.png": "a67dec4bdfa69f588b76843004c5a50e9b327723c391d4940ecd486e76abf09d",
}

def api(method, endpoint, payload=None):
    token = os.environ["GITHUB_TOKEN"]
    data = None if payload is None else json.dumps(payload).encode()
    req = Request(
        "https://api.github.com/repos/" + REPO + endpoint,
        data=data,
        method=method,
        headers={
            "Authorization": "Bearer " + token,
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            "User-Agent": "phalanx-v2-isolated-upload",
        },
    )
    try:
        with urlopen(req, timeout=30) as response:
            return json.load(response)
    except HTTPError as error:
        raise RuntimeError(f"GitHub API {method} {endpoint}: HTTP {error.code}") from error

def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python3 scripts/upload_phalanx_header_v2_assets.py PATH_TO_ZIP")
    archive = Path(sys.argv[1])
    with ZipFile(archive) as z:
        blobs = {}
        for path, digest in SHA256.items():
            raw = z.read(path)
            actual = hashlib.sha256(raw).hexdigest()
            if actual != digest:
                sys.exit(f"ABORT: checksum mismatch for {path}")
            blobs[path] = raw
    print("All 4 approved PNG checksums match.")
    if not os.environ.get("GITHUB_TOKEN"):
        sys.exit("Upload not attempted: set GITHUB_TOKEN with contents:write permission.")
    # Verify the intended branch and obtain its current head.
    ref = api("GET", "/git/ref/heads/" + BRANCH)
    parent = ref["object"]["sha"]
    commit = api("GET", "/git/commits/" + parent)
    entries = []
    for path, raw in blobs.items():
        obj = api("POST", "/git/blobs", {
            "content": base64.b64encode(raw).decode("ascii"),
            "encoding": "base64",
        })
        entries.append({"path": path, "mode": "100644", "type": "blob", "sha": obj["sha"]})
        print("Uploaded blob:", path)
    tree = api("POST", "/git/trees", {"base_tree": commit["tree"]["sha"], "tree": entries})
    new_commit = api("POST", "/git/commits", {
        "message": "assets: archive verified PHALANX header V2 PNG references (isolated)",
        "tree": tree["sha"],
        "parents": [parent],
    })
    # Non-forced update rejects concurrent branch changes.
    api("PATCH", "/git/refs/heads/" + BRANCH, {"sha": new_commit["sha"], "force": False})
    print("Committed on isolated branch:", new_commit["sha"])
    print("Production untouched. Run asset integrity workflow before integration.")

if __name__ == "__main__":
    main()

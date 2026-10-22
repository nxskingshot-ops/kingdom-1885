#!/usr/bin/env python3
"""PHX-SEC-037: staged-source encrypted B2 recovery orchestrator.

Requires pre-downloaded sources, verified inventory and an external secret scan.
Does not fetch production data or execute without explicit preflight approval.
"""
import argparse
import base64
import hashlib
import importlib.util
import json
import os
import pathlib
import tempfile

ROOT=pathlib.Path(__file__).resolve().parent

def load(name,filename):
    spec=importlib.util.spec_from_file_location(name,ROOT/filename)
    module=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

archive=load("phx037_archive","phx-sec-037-archive.py")
crypto=load("phx037_crypto","phx-sec-037-encrypted-fixture.py")
b2=load("phx037_b2","phx-sec-037-b2-roundtrip.py")

def run(source_root, inventory_path, scan_receipt_path, object_key):
    if os.environ.get("PHX037_APPROVED_PREFLIGHT") != "VERIFIED-PRIVATE-B2-AND-ZERO-COST":
        raise RuntimeError("live storage/cost preflight not approved")
    encoded=os.environ.get("PHALANX_EDGE_RECOVERY_KEY_B64","")
    try:
        key=base64.b64decode(encoded,validate=True)
    except (ValueError,base64.binascii.Error):
        raise RuntimeError("invalid recovery key encoding") from None
    if len(key)!=32:
        raise RuntimeError("independent AES-256 recovery key required")
    inventory=json.loads(pathlib.Path(inventory_path).read_text())
    receipt=json.loads(pathlib.Path(scan_receipt_path).read_text())
    # Receipt is only a consistency check, not an authorization or trusted scan proof.
    # The live runner MUST generate it after executing a pinned scanner in the same job.
    if receipt.get("result")!="PASS" or receipt.get("functions")!=26 or receipt.get("scanner") not in ("gitleaks","trufflehog"):
        raise RuntimeError("approved secret scanner receipt required")
    if receipt.get("inventory_sha256")!=hashlib.sha256(pathlib.Path(inventory_path).read_bytes()).hexdigest():
        raise RuntimeError("secret scan receipt does not match inventory")
    raw=archive.create_archive(source_root,inventory)
    if receipt.get("archive_sha256")!=hashlib.sha256(raw).hexdigest():
        raise RuntimeError("secret scan receipt does not match archive")
    if os.environ.get("PHX037_SCANNER_EXECUTED_IN_THIS_JOB") != "YES":
        raise RuntimeError("scanner execution not attested by live runner")
    ciphertext=crypto.encrypt_bytes(raw,key)
    digest=hashlib.sha256(ciphertext).hexdigest()
    with tempfile.TemporaryDirectory(prefix="phx037-") as tmp:
        path=pathlib.Path(tmp)/"functions.enc"
        path.write_bytes(ciphertext)
        os.chmod(path,0o600)
        downloaded=b2.upload_and_verify(path,object_key,digest)
        if not archive.verify_archive(crypto.decrypt_bytes(downloaded,key),inventory):
            raise RuntimeError("isolated recovery verification failed")
    return {"functions":26,"object_key":object_key,"ciphertext_sha256":digest,"verified":True}

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--sources",required=True)
    parser.add_argument("--inventory",required=True)
    parser.add_argument("--scan-receipt",required=True)
    parser.add_argument("--object-key",required=True)
    args=parser.parse_args()
    result=run(args.sources,args.inventory,args.scan_receipt,args.object_key)
    print(json.dumps(result,sort_keys=True))

if __name__=="__main__":
    main()

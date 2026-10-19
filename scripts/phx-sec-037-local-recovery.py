#!/usr/bin/env python3
"""PHX-SEC-037 isolated local end-to-end synthetic recovery proof.

No network, Supabase access, B2 credentials, production restore or deployment.
"""
import hashlib
import importlib.util
import os
from pathlib import Path

HERE=Path(__file__).resolve().parent

def load(name,filename):
    spec=importlib.util.spec_from_file_location(name,HERE/filename)
    module=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

archive=load('phx_archive','phx-sec-037-archive.py')
crypto=load('phx_crypto','phx-sec-037-encrypted-fixture.py')
storage=load('phx_storage','phx-sec-037-storage-contract.py')

def prove_local_recovery(source_root, inventory):
    plaintext=archive.create_archive(source_root,inventory)
    key=os.urandom(32)
    ciphertext=crypto.encrypt_bytes(plaintext,key)
    checksum=hashlib.sha256(ciphertext).hexdigest()
    private_fixture={}
    downloaded=storage.verified_roundtrip(private_fixture,'edge-functions/synthetic.enc',ciphertext,checksum)
    recovered=crypto.decrypt_bytes(downloaded,key)
    if not archive.verify_archive(recovered,inventory):
        raise ValueError('recovery verification failed')
    return {'functions':len(inventory),'ciphertext_sha256':checksum,'verified':True}

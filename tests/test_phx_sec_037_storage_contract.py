import hashlib
import importlib.util
import os
import unittest
from pathlib import Path

base=Path(__file__).resolve().parents[1]/'scripts'
def load(name,path):
    spec=importlib.util.spec_from_file_location(name,base/path)
    m=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m

storage=load('storage','phx-sec-037-storage-contract.py')
fixture=load('fixture','phx-sec-037-encrypted-fixture.py')

class TestStorageContract(unittest.TestCase):
    def test_encrypted_roundtrip(self):
        key=os.urandom(32)
        encrypted=fixture.encrypt_bytes(b'synthetic only',key)
        digest=hashlib.sha256(encrypted).hexdigest()
        retrieved=storage.verified_roundtrip({},'edge-functions/fixture.enc',encrypted,digest)
        self.assertEqual(fixture.decrypt_bytes(retrieved,key),b'synthetic only')

    def test_bad_checksum(self):
        with self.assertRaises(ValueError):
            storage.verified_roundtrip({},'edge-functions/fixture.enc',b'ciphertext','0'*64)

    def test_unsafe_object_key(self):
        with self.assertRaises(ValueError):
            storage.verified_roundtrip({},'edge-functions/../other',b'ciphertext',hashlib.sha256(b'ciphertext').hexdigest())

    def test_wrong_prefix(self):
        with self.assertRaises(ValueError):
            storage.verified_roundtrip({},'postgres/daily/fixture.enc',b'ciphertext',hashlib.sha256(b'ciphertext').hexdigest())

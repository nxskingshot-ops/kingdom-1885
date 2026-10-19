import importlib.util
import io
import os
import tarfile
import tempfile
import unittest
from pathlib import Path

spec=importlib.util.spec_from_file_location('fixture',Path(__file__).resolve().parents[1]/'scripts'/'phx-sec-037-encrypted-fixture.py')
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class TestEncryptedFixture(unittest.TestCase):
    def test_roundtrip(self):
        key=os.urandom(32)
        with tempfile.TemporaryDirectory() as d:
            (Path(d)/'index.ts').write_text('synthetic fixture')
            payload,digest=module.archive_synthetic(d,key)
            self.assertEqual(len(digest),64)
            with tarfile.open(fileobj=io.BytesIO(module.decrypt_bytes(payload,key))) as tar:
                self.assertEqual(tar.extractfile('index.ts').read(),b'synthetic fixture')

    def test_wrong_key(self):
        with self.assertRaises(Exception):
            module.decrypt_bytes(module.encrypt_bytes(b'fixture',os.urandom(32)),os.urandom(32))

    def test_tampering(self):
        key=os.urandom(32)
        payload=bytearray(module.encrypt_bytes(b'fixture',key))
        payload[-1]^=1
        with self.assertRaises(Exception): module.decrypt_bytes(bytes(payload),key)

    def test_short_key(self):
        with self.assertRaises(ValueError): module.encrypt_bytes(b'fixture',b'wrong')

    def test_plaintext_not_visible(self):
        self.assertNotIn(b'private fixture',module.encrypt_bytes(b'private fixture',os.urandom(32)))

    def test_symlink_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            (Path(d)/'link').symlink_to('/etc/hosts')
            with self.assertRaises(ValueError): module.archive_synthetic(d,os.urandom(32))

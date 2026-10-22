import hashlib
import importlib.util
import tempfile
import unittest
from pathlib import Path

spec=importlib.util.spec_from_file_location('verify',Path(__file__).resolve().parents[1]/'scripts'/'phx-sec-037-verify-ciphertext.py')
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class TestCiphertext(unittest.TestCase):
    def test_good_digest(self):
        with tempfile.TemporaryDirectory() as d:
            path=Path(d)/'archive.enc'
            path.write_bytes(b'synthetic ciphertext')
            self.assertTrue(module.verify_file(path,hashlib.sha256(path.read_bytes()).hexdigest()))

    def test_wrong_digest(self):
        with tempfile.TemporaryDirectory() as d:
            path=Path(d)/'archive.enc'
            path.write_bytes(b'synthetic ciphertext')
            with self.assertRaises(ValueError): module.verify_file(path,'0'*64)

    def test_missing_file(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaises(ValueError): module.verify_file(Path(d)/'absent','0'*64)

    def test_symlink(self):
        with tempfile.TemporaryDirectory() as d:
            target=Path(d)/'target'
            target.write_bytes(b'fixture')
            link=Path(d)/'link'
            link.symlink_to(target)
            with self.assertRaises(ValueError): module.verify_file(link,hashlib.sha256(b'fixture').hexdigest())

    def test_invalid_digest(self):
        with tempfile.TemporaryDirectory() as d:
            path=Path(d)/'archive.enc'
            path.write_bytes(b'fixture')
            with self.assertRaises(ValueError): module.verify_file(path,'not-a-hash')

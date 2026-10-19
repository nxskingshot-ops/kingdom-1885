import importlib.util
import tempfile
import unittest
from pathlib import Path

spec=importlib.util.spec_from_file_location('preflight',Path(__file__).resolve().parents[1]/'scripts'/'phx-sec-037-verify-backup.py')
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
inspect=module.inspect
INV=[{'slug':'test-fn','version':2,'ezbr_sha256':'a'*64}]

class TestSafety(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        (self.root/'test-fn').mkdir()
        self.file=self.root/'test-fn'/'index.ts'

    def test_safe(self):
        self.file.write_text('const x = Deno.env.get("API_KEY");')
        self.assertEqual(inspect(self.root,INV)['functions'][0]['version'],2)

    def test_key(self):
        self.file.write_text('-----BEGIN PRIVATE KEY-----\nfake')
        with self.assertRaises(ValueError): inspect(self.root,INV)

    def test_token(self):
        self.file.write_text('api_key = "this-is-a-fake-secret"')
        with self.assertRaises(ValueError): inspect(self.root,INV)

    def test_connection(self):
        self.file.write_text('postgres://alice:fakepassword@localhost/db')
        with self.assertRaises(ValueError): inspect(self.root,INV)

    def test_empty(self):
        with self.assertRaises(ValueError): inspect(self.root,INV)

    def test_missing(self):
        self.file.write_text('safe')
        with self.assertRaises(ValueError): inspect(self.root,INV+[{'slug':'missing','version':1,'ezbr_sha256':'b'*64}])

    def test_duplicate(self):
        self.file.write_text('safe')
        with self.assertRaises(ValueError): inspect(self.root,INV+INV)

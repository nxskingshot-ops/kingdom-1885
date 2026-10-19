import importlib.util
import io
import json
import pathlib
import tarfile
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('archive',pathlib.Path(__file__).resolve().parents[1]/'scripts'/'phx-sec-037-archive.py')
archive=importlib.util.module_from_spec(spec)
spec.loader.exec_module(archive)

def inventory():
    return [{'slug':f'function-{i}', 'version':1, 'ezbr_sha256':'a'*64} for i in range(26)]

class TestArchive(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root=pathlib.Path(self.temp.name)
        for row in inventory():
            d=self.root/row['slug']
            d.mkdir()
            (d/'index.ts').write_text('export default 1')

    def test_roundtrip(self):
        self.assertTrue(archive.verify_archive(archive.create_archive(self.root,inventory()),inventory()))

    def test_missing_function(self):
        (self.root/'function-0'/'index.ts').unlink()
        with self.assertRaises(ValueError):
            archive.create_archive(self.root,inventory())

    def test_extra_function(self):
        (self.root/'rogue').mkdir()
        with self.assertRaises(ValueError):
            archive.create_archive(self.root,inventory())

    def test_symlink(self):
        (self.root/'function-0'/'index.ts').unlink()
        (self.root/'function-0'/'index.ts').symlink_to(self.root/'function-1'/'index.ts')
        with self.assertRaises(ValueError):
            archive.create_archive(self.root,inventory())

    def test_tamper(self):
        raw=archive.create_archive(self.root,inventory())
        with tarfile.open(fileobj=io.BytesIO(raw)) as t:
            entries=[(m,t.extractfile(m).read()) for m in t.getmembers()]
        out=io.BytesIO()
        with tarfile.open(fileobj=out,mode='w') as t:
            for m,data in entries:
                if m.name=='sources/function-0/index.ts':
                    data=b'tampered'
                    m.size=len(data)
                t.addfile(m,io.BytesIO(data))
        with self.assertRaises(ValueError):
            archive.verify_archive(out.getvalue(),inventory())

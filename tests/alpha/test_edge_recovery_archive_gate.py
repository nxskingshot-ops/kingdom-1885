"""Read-only local archive gate. Never fetches credentials or deploys."""
import json
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]
INVENTORY = ROOT / "data/phalanx-edge-functions-live-20261018.json"
ARCHIVE = ROOT / "recovery/supabase/functions"
DANGEROUS = [
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"gh[pousr]_[A-Za-z0-9_]{30,}"),
    re.compile(r"sk_live_[A-Za-z0-9]{12,}"),
    re.compile(r"AKIA[0-9A-Z]{16}"),
]

class RecoveryArchiveGate(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads(INVENTORY.read_text(encoding="utf-8"))
        cls.slugs = [item["slug"] for item in cls.manifest["functions"]]

    def test_inventory_is_unique_and_complete(self):
        self.assertEqual(self.manifest["count"], 26)
        self.assertEqual(len(self.slugs), 26)
        self.assertEqual(len(set(self.slugs)), 26)
        for item in self.manifest["functions"]:
            self.assertEqual(item["status"], "ACTIVE")
            self.assertRegex(item["ezbr_sha256"], r"^[a-f0-9]{64}$")

    @unittest.skipUnless(ARCHIVE.exists(), "Source archive absent; archival recovery NOT verified")
    def test_archive_contains_all_live_slugs(self):
        dirs = {p.name for p in ARCHIVE.iterdir() if p.is_dir()}
        self.assertEqual(dirs, set(self.slugs), "Missing or extra function directories")
        for slug in self.slugs:
            source = ARCHIVE / slug / "index.ts"
            self.assertTrue(source.is_file(), f"Missing entrypoint: {slug}")
            self.assertGreater(source.stat().st_size, 0, f"Empty source: {slug}")

    @unittest.skipUnless(ARCHIVE.exists(), "Source archive absent; secret review NOT verified")
    def test_limited_secret_pattern_scan(self):
        for file in ARCHIVE.rglob("*"):
            if not file.is_file():
                continue
            text = file.read_text(encoding="utf-8", errors="replace")
            for pattern in DANGEROUS:
                self.assertIsNone(pattern.search(text), f"Potential secret in {file.relative_to(ROOT)}")

if __name__ == "__main__":
    unittest.main()

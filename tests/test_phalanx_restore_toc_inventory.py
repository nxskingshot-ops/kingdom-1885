"""Synthetic tests; no private backup or PostgreSQL connection needed."""
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "phalanx_restore_toc_inventory", ROOT / "scripts/phalanx-restore-toc-inventory.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class TestArchiveInventory(unittest.TestCase):
    def test_classifies_public_auth_and_external_without_names(self):
        toc = """; private archive header
1; 2615 11 SCHEMA - auth postgres
2; 2615 12 SCHEMA - custom_confidential postgres
3; 1259 21 TABLE public secret_table postgres
4; 1259 22 TABLE auth identities postgres
5; 1259 23 TABLE storage blob_table postgres
6; 0 0 OTHER FAKE ENTRY
"""
        kinds, declared, used, unparsed = module.inspect(toc)
        self.assertEqual(unparsed, 0)
        self.assertEqual(kinds["TABLE"], 3)
        self.assertEqual(kinds["OTHER_KIND"], 1)
        self.assertEqual(declared["auth"], 1)
        self.assertEqual(declared["OTHER_SCHEMA"], 1)
        self.assertEqual(used["public"] + used["auth"], 2)
        self.assertEqual(used["storage"], 1)
        self.assertNotIn("secret_table", used)
        self.assertNotIn("custom_confidential", declared)

    def test_counts_invalid_entry_without_printing_it(self):
        kinds, declared, used, unparsed = module.inspect("not a valid TOC line\n")
        self.assertEqual(unparsed, 1)
        self.assertEqual(sum(kinds.values()), 0)


if __name__ == "__main__":
    unittest.main()

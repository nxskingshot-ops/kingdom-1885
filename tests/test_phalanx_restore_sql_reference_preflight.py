import importlib.util
from pathlib import Path
import unittest

p = Path(__file__).resolve().parents[1] / "scripts/phalanx-restore-sql-reference-preflight.py"
spec = importlib.util.spec_from_file_location("preflight", p)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class TestLexicalReferencePreflight(unittest.TestCase):
    def test_known_and_unknown_categories(self):
        example = 'SELECT auth.users, "storage"."objects", private_schema.value, public.items;'
        result = module.summarize(example)
        self.assertEqual(result["AUTH"], 1)
        self.assertEqual(result["STORAGE"], 1)
        self.assertEqual(result["OTHER_OR_UNKNOWN"], 1)
        self.assertEqual(result["PUBLIC"], 1)
        self.assertNotIn("private_schema", result)

    def test_masks_comments_literals_and_dollar_bodies(self):
        sample = """-- storage.objects
/* outer auth.users /* inner vault.items */ end */
SELECT public.items, 'realtime.events', $quoted$ storage.private $quoted$,
$func$ SELECT auth.hidden; $func$;
"""
        result = module.summarize(sample)
        self.assertEqual(result["PUBLIC"], 1)
        self.assertEqual(sum(result.values()), 1)

    def test_empty_input(self):
        self.assertEqual(sum(module.summarize("").values()), 0)


if __name__ == "__main__":
    unittest.main()

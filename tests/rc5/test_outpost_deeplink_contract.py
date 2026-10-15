"""Static contract checks for isolated RC5 published-only deep link."""
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]
VIEWER = ROOT / "preview/outpost-viewer-an-v1.js"

class PublishedDeepLinkContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = VIEWER.read_text(encoding="utf-8")

    def test_strict_numeric_id(self):
        self.assertIn("get('outpost_id')", self.source)
        self.assertIn(r"/^[1-9]\d{0,14}$/", self.source)
        self.assertIn("Number.isSafeInteger(Number(deepLinkValue))", self.source)

    def test_only_selects_loaded_published_data(self):
        self.assertIn("DATA.find(row => row.id === deepLinkId)", self.source)
        self.assertIn("if (!item)", self.source)
        self.assertIn("sel = item.id;", self.source)
        self.assertIn("showOutpostPopup(item)", self.source)

    def test_applies_after_validated_fetch(self):
        self.assertIn("published=eq.true", self.source)
        self.assertIn("if (valid.length !== rows.length) throw", self.source)
        self.assertRegex(self.source, r"hasLiveSnapshot = true;[\s\S]*?redraw\(\);[\s\S]*?applyPublishedDeepLink\(\);")

    def test_missing_id_preserves_error_after_live_status(self):
        self.assertIn("status('● Outpost not found'", self.source)
        self.assertLess(
            self.source.index("status('● Live DB · '"),
            self.source.index("applyPublishedDeepLink();"),
        )

    def test_middle_wrapper_forwards_id(self):
        wrapper = (ROOT / "preview/outpost-report-v11.html").read_text(encoding="utf-8")
        self.assertIn("get('outpost_id')", wrapper)
        self.assertIn("nested.searchParams.set('outpost_id',requestedOutpost)", wrapper)

    def test_outer_preview_forwards_id(self):
        """Integration gate: outer iframe must forward the requested ID."""
        outer = (ROOT / "preview/rc5-outpost-details-readonly.html").read_text(encoding="utf-8")
        self.assertIn("get('outpost_id')", outer)
        self.assertIn("searchParams.set('outpost_id'", outer)

    def test_no_write_methods(self):
        for method in ("POST", "PATCH", "PUT", "DELETE"):
            self.assertNotRegex(self.source, rf"method:\s*['\"]{method}['\"]")

if __name__ == "__main__":
    unittest.main()

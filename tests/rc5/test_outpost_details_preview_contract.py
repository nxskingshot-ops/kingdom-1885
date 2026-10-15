"""Isolated Outpost Details preview must never link to privileged editor."""
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGE = ROOT / "preview/rc5-outpost-details-readonly.html"
MAP = ROOT / "preview/outpost-report-v11.html"

class OutpostDetailsPreviewContract(unittest.TestCase):
    def test_readonly_preview_exists(self):
        content = PAGE.read_text(encoding="utf-8")
        self.assertIn("outpost-report-v11.html", content)
        self.assertIn("Read-only preview", content)
        self.assertNotIn("outpost-editor-v5", content)
        self.assertNotIn("supabase", content.lower())
        self.assertNotIn("<form", content.lower())

    def test_existing_map_unchanged_reference(self):
        self.assertIn("outpost-viewer-an-v1.js", MAP.read_text(encoding="utf-8"))

if __name__ == "__main__":
    unittest.main()

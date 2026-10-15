# RC5 Outpost Details — read-only contract test
# Run: python -m unittest tests/rc5/test_outpost_details_contract.py
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]
VIEWER = ROOT / "preview/outpost-viewer-an-v1.js"
EDITOR = ROOT / "preview/outpost-editor-v5.js"
WRAPPER = ROOT / "preview/outpost-report-v11.html"

class OutpostDetailsContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.viewer = VIEWER.read_text(encoding="utf-8")
        cls.editor = EDITOR.read_text(encoding="utf-8")
        cls.wrapper = WRAPPER.read_text(encoding="utf-8")

    def test_live_published_read_source(self):
        self.assertIn("public_outposts_verified_20261002", self.viewer)
        self.assertIn("published=eq.true", self.viewer)
        self.assertRegex(self.viewer, r"method:\s*['\"]GET['\"]")

    def test_selected_outpost_popup_exists(self):
        self.assertIn("showOutpostPopup(item)", self.viewer)
        self.assertIn("sel !== null", self.viewer)

    def test_viewer_has_no_supabase_mutations(self):
        # Only verify network-facing mutation patterns, not Set.delete().
        for verb in ("POST", "PATCH", "PUT", "DELETE"):
            self.assertNotRegex(self.viewer, rf"method:\s*['\"]{verb}['\"]")
        self.assertNotRegex(self.viewer, r"\.from\([^)]*\)\.update\(")

    def test_editor_is_write_capable_and_role_gated(self):
        self.assertIn(".update(payload)", self.editor)
        self.assertIn("nxs_memberships", self.editor)
        for role in ("r4", "r5", "admin", "outpost_manager"):
            self.assertIn(role, self.editor)

    def test_map_wrapper_injects_viewer(self):
        self.assertIn("outpost-viewer-an-v1.js", self.wrapper)
        self.assertIn("kingdom-preview=an-viewer-v1", self.wrapper)

if __name__ == "__main__":
    unittest.main()

"""Regression tests for the PHX read-only source gate (no network)."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("phx_source_gate.py")
spec = importlib.util.spec_from_file_location("phx_source_gate", SCRIPT)
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)

class SourceGateTests(unittest.TestCase):
    def test_allowed_source_and_hash(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "good.html").write_text("frozen", encoding="utf-8")
            import hashlib
            digest = hashlib.sha256(b"frozen").hexdigest()
            manifest = {"sources": [{"id": "GOOD", "path": "good.html", "status": "FROZEN-REFERENCE", "sha256": digest}], "routes": [{"route": "map", "source_id": "GOOD"}]}
            self.assertEqual(gate.check(manifest, root), [])

    def test_old_report_route_rejected(self):
        manifest = {"sources": [{"id": "REPORTS-V11", "path": "old.html", "status": "SUPERSEDED"}], "routes": [{"route": "reports", "source_id": "REPORTS-V11"}]}
        with tempfile.TemporaryDirectory() as tmp:
            self.assertTrue(any("BLOCKED ROUTE" in x for x in gate.check(manifest, Path(tmp))))

    def test_missing_active_source_rejected(self):
        manifest = {"sources": [{"id": "HOME", "path": "missing.html", "status": "ACTIVE-CANDIDATE"}], "routes": []}
        with tempfile.TemporaryDirectory() as tmp:
            self.assertTrue(any("MISSING" in x for x in gate.check(manifest, Path(tmp))))

    def test_unknown_route_rejected(self):
        manifest = {"sources": [], "routes": [{"route": "map", "source_id": "UNKNOWN"}]}
        with tempfile.TemporaryDirectory() as tmp:
            self.assertTrue(any("UNKNOWN SOURCE" in x for x in gate.check(manifest, Path(tmp))))

if __name__ == "__main__":
    unittest.main()

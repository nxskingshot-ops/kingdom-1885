#!/usr/bin/env python3
"""Static safety contract for the isolated OUT-024 report adapter."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
PAGE = ROOT / "preview/phalanx-reports-out024-local-adapter-20261019.html"

class ReportsContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = PAGE.read_text(encoding="utf-8")

    def test_canonical_map_link(self):
        self.assertIn('./PHX-OUT-024-MAP2-FROZEN-20261018.html', self.html)
        self.assertNotIn('outpost-viewer-an-v1.js', self.html)
        self.assertNotIn('outpost-report-v11.html', self.html)

    def test_no_network_or_storage_side_effects(self):
        for pattern in (r'\bfetch\s*\(', r'XMLHttpRequest', r'WebSocket',
                        r'localStorage', r'sessionStorage', r'supabase',
                        r'\bindexedDB\b'):
            self.assertIsNone(re.search(pattern, self.html, re.I), pattern)

    def test_fail_closed_validation(self):
        for token in ('JSON.parse(source.value)', 'Array.isArray(rows)',
                      'rows.length>1000', 'ids.has(id)', "['N','O','S','W'].includes(quadrant)",
                      "copy.disabled=true", "report=''", "result.textContent=''"):
            self.assertIn(token, self.html, token)

    def test_real_newlines_in_report_and_chunks(self):
        # Guard against accidentally encoding a literal backslash-n in JS.
        self.assertIn("report.split('\\n')", self.html)
        self.assertIn("current+=(current?'\\n':'')+line", self.html)
        self.assertIn("].join('\\n')", self.html)
        self.assertNotIn("report.split('\\\\n')", self.html)
        self.assertNotIn("current+=(current?'\\\\n':'')+line", self.html)

    def test_offline_import_bridge_safety(self):
        bridge = (ROOT / "preview/phalanx-out024-public-json-bridge-20261019.html").read_text(encoding="utf-8")
        for forbidden in (r'\bfetch\s*\(', r'XMLHttpRequest', r'WebSocket',
                          r'localStorage', r'sessionStorage', r'supabase', r'indexedDB'):
            self.assertIsNone(re.search(forbidden, bridge, re.I), forbidden)
        for required in ('JSON.parse(source.value)', 'rows.length>1000',
                         'ids.has(id)', 'Number.isFinite(x)', 'Number.isFinite(y)',
                         "copy.disabled=true", "approved=''"):
            self.assertIn(required, bridge, required)
        self.assertIn('./phalanx-reports-out024-local-adapter-20261019.html', bridge)

    def test_report_center_links_offline_bridge(self):
        self.assertIn('./phalanx-out024-public-json-bridge-20261019.html', self.html)
        bridge = (ROOT / "preview/phalanx-out024-public-json-bridge-20261019.html").read_text(encoding="utf-8")
        self.assertIn('./phalanx-reports-out024-local-adapter-20261019.html', bridge)

    def test_explicit_provenance(self):
        self.assertIn('manuell geprüfter JSON-Import', self.html)
        self.assertIn('Keine Kartensynchronisierung bestätigt.', self.html)

if __name__ == '__main__':
    unittest.main()

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
        for pattern in (r'\\bfetch\\s*\\(', r'XMLHttpRequest', r'WebSocket',
                        r'localStorage', r'sessionStorage', r'supabase',
                        r'\\bindexedDB\\b'):
            self.assertIsNone(re.search(pattern, self.html, re.I), pattern)

    def test_fail_closed_validation(self):
        for token in ('JSON.parse(source.value)', 'Array.isArray(rows)',
                      'rows.length>1000', 'ids.has(id)', "['N','O','S','W'].includes(quadrant)",
                      "copy.disabled=true", "report=''", "result.textContent=''"):
            self.assertIn(token, self.html, token)

    def test_explicit_provenance(self):
        self.assertIn('manuell geprüfter JSON-Import', self.html)
        self.assertIn('Keine Kartensynchronisierung bestätigt.', self.html)

if __name__ == '__main__':
    unittest.main()

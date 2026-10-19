#!/usr/bin/env python3
"""Fail-closed static checks for the isolated RC5 OUT-024 + Reports route."""
from pathlib import Path
import re
import unittest

ROOT=Path(__file__).resolve().parents[2]
NAV=(ROOT/'preview/PHALANX_RC5_OUT024_REPORTS_ISOLATED_NAV_20261019.html').read_text(encoding='utf-8')
RC5=(ROOT/'preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html').read_text(encoding='utf-8')
REPORT=(ROOT/'preview/phalanx-reports-out024-local-adapter-20261019.html').read_text(encoding='utf-8')

class RouteContract(unittest.TestCase):
    def test_rc5_has_unique_targets(self):
        self.assertEqual(len(re.findall(r'>Outpost Map<small',RC5)),1)
        self.assertEqual(len(re.findall(r'>Reports &amp; History<small',RC5)),1)
        self.assertIn('href="./outpost-report-v11.html"',RC5)

    def test_isolated_route_targets(self):
        for target in ('PHALANX_RC5_ALPHA_DERIVED_20261017.html',
                       'PHX-OUT-024-MAP2-FROZEN-20261018.html',
                       'phalanx-reports-out024-local-adapter-20261019.html'):
            self.assertIn(target,NAV)
            self.assertTrue((ROOT/'preview'/target).is_file(),target)
        self.assertIn("querySelectorAll('.submenu a')",NAV)
        self.assertIn("Report Center|Reports & History", NAV)
        self.assertIn("reportsEntry.length!==1",NAV)
        self.assertIn('src="about:blank"',NAV)
        self.assertLess(NAV.index("frame.addEventListener(\'load\'"), NAV.rindex("frame.src=rc5;"))

    def test_back_navigation(self):
        self.assertIn("back.addEventListener('click',showRc5)",NAV)
        self.assertIn("frame.src=reports",NAV)
        self.assertIn("frame.src=out",NAV)
        self.assertIn("frame.src=rc5",NAV)

    def test_no_mutation_of_frozen_assets(self):
        self.assertNotIn('outpost-viewer-an-v1.js',NAV)
        self.assertIn('Keine automatische Übernahme',REPORT)

if __name__=='__main__':
    unittest.main()

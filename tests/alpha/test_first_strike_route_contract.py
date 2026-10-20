#!/usr/bin/env python3
"""FIRST STRIKE: read-only route and frozen source contract.

Run from repository root: python3 tests/alpha/test_first_strike_route_contract.py
No network, deployment, database, or production writes.
"""
from pathlib import Path
import hashlib
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
PREVIEW = ROOT / "preview"
ROUTER = PREVIEW / "PHALANX_RC5_OUT024_REPORTS_ISOLATED_NAV_20261019.html"
MAP = PREVIEW / "PHX-OUT-024-MAP2-FROZEN-20261018.html"
RC5 = PREVIEW / "PHALANX_RC5_ALPHA_DERIVED_20261017.html"
REPORTS = PREVIEW / "phalanx-reports-out024-local-adapter-20261019.html"
EXPECTED_MAP_SHA256 = "1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d"

class FirstStrikeContract(unittest.TestCase):
    def test_dependency_closure(self):
        for file in (ROUTER, MAP, RC5, REPORTS):
            with self.subTest(file=file.name):
                self.assertTrue(file.is_file(), f"Missing required source: {file}")

    def test_map_immutable_checksum(self):
        self.assertTrue(MAP.is_file(), "Canonical map missing; never substitute Alpha23")
        actual = hashlib.sha256(MAP.read_bytes()).hexdigest()
        self.assertEqual(actual, EXPECTED_MAP_SHA256, "Frozen OUT-024 bytes changed: STOP")

    def test_existing_router_only(self):
        src = ROUTER.read_text(encoding="utf-8")
        for name in (RC5.name, MAP.name, REPORTS.name):
            with self.subTest(dependency=name):
                self.assertIn(name, src)
        self.assertIn("showMap()", src)
        self.assertIn("showReports()", src)
        self.assertIn("showRc5()", src)
        self.assertIn("stopImmediatePropagation()", src)
        self.assertIn("addEventListener('load',reconcileFrame)", src)

    def test_reports_are_explicitly_manual(self):
        src = REPORTS.read_text(encoding="utf-8")
        self.assertRegex(src.lower(), r"json|import")
        self.assertNotIn("supabase.co", src.lower())

    def test_no_unapproved_home_claim(self):
        # The October 16 final helmet/banner source is not yet hash verified.
        # No HOME entry is installed by this contract test.
        src = ROUTER.read_text(encoding="utf-8")
        self.assertNotIn("NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html", src)

if __name__ == "__main__":
    unittest.main()

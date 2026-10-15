"""RC5 offline freshness contract: snapshot is historical, never silently live.

Run with: python -m unittest discover -s tests/rc5 -p 'test_*_contract.py' -v
This is a static source/data check; no network or production mutations.
"""
import datetime as dt
import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]
SOURCE = ROOT / "data/kvk-opponent-intelligence-current.json"
DASHBOARD = ROOT / "preview/nexus-phalanx-command-center-alpha28-local-pair-test-2026-10-13.html"
REFERENCE_DATE = dt.date(2026, 10, 15)

class DashboardFreshnessContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(SOURCE.read_text(encoding="utf-8"))
        cls.dashboard = DASHBOARD.read_text(encoding="utf-8")

    def test_dashboard_references_snapshot(self):
        self.assertIn("kvk-opponent-intelligence-current.json", self.dashboard)

    def test_snapshot_has_parseable_update_time(self):
        raw = self.data.get("updated_at")
        self.assertIsInstance(raw, str)
        stamp = dt.datetime.fromisoformat(raw.replace("Z", "+00:00"))
        self.assertIsNotNone(stamp.tzinfo)

    def test_snapshot_is_not_current_as_of_audit(self):
        stamp = dt.datetime.fromisoformat(self.data["updated_at"].replace("Z", "+00:00"))
        self.assertLess(stamp.date(), REFERENCE_DATE)

    def test_source_snapshot_dates_not_newer_than_dataset(self):
        stamp = dt.datetime.fromisoformat(self.data["updated_at"].replace("Z", "+00:00")).date()
        for name, source in self.data.get("sources", {}).items():
            if not isinstance(source, dict) or not source.get("snapshot_date"):
                continue
            with self.subTest(source=name):
                self.assertLessEqual(dt.date.fromisoformat(source["snapshot_date"]), stamp)

if __name__ == "__main__":
    unittest.main()

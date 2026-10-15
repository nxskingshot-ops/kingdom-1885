#!/usr/bin/env python3
"""Offline, read-only regression checks for the PHALANX access-request SQL proposal.

This is NOT a database privilege test and never connects to Supabase.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PROPOSAL = ROOT / "docs/PHALANX-ACCESS-REQUEST-HARDENING-PROPOSAL-20261015.md"
FRONTEND = ROOT / "preview/kingdom-hub-menu-test.html"

def main():
    doc = PROPOSAL.read_text(encoding="utf-8")
    html = FRONTEND.read_text(encoding="utf-8")
    assert "REVOKE INSERT ON TABLE public.nexus_access_requests FROM anon, authenticated;" in doc
    assert re.search(r"GRANT INSERT\s*\(gamer_tag, player_id, alliance, status\)\s*ON TABLE public\.nexus_access_requests TO anon, authenticated;", doc)
    assert "GRANT INSERT ON TABLE public.nexus_access_requests TO anon, authenticated;" in doc, "Rollback absent"
    match = re.search(r"\.from\(['\"]nexus_access_requests['\"]\)\.insert\(\{([^}]*)\}\)", html)
    assert match, "Direct public request INSERT not found"
    fields = set(re.findall(r"([A-Za-z_][A-Za-z_0-9]*)\s*:", match.group(1)))
    assert fields == {"gamer_tag", "player_id", "alliance", "status"}, f"Unexpected insert fields: {fields}"
    for forbidden in ("granted_role", "granted_user_id", "reviewed_by", "reviewed_at"):
        assert forbidden not in fields
    assert "functions/v1/nexus-access-review" in html
    print("PASS: proposal matches public form payload and contains rollback.")
    print("NOTE: No SQL executed; real RLS/grant integration testing remains required.")

if __name__ == "__main__":
    main()

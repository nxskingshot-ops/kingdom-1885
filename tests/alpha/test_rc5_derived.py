#!/usr/bin/env python3
"""Read-only RC5 derived alpha contract. Usage: python tests/alpha/test_rc5_derived.py FILE"""
import hashlib, pathlib, re, sys
from html.parser import HTMLParser
EXPECTED_SHA="e767ed7fd477bd797cd3eb80401358b2a345458abe312cf3ffdff8249d452062"
TARGETS={
"nexus-phalanx-command-center-alpha28-local-pair-test-2026-10-13.html",
"kvk-prep-five-contrast-v13.html",
"nexus-phalanx-battle-readiness-verified-status-test-2026-10-12.html",
"phalanx-ranking-integration-rc-20261015.html",
"outpost-report-v11.html",
"kingdom-hub-trends-v8.html",
"hero-intelligence-evidence-advisor-v15-2026-10-12.html",
}
class Anchors(HTMLParser):
 def __init__(self): super().__init__();self.links=[]
 def handle_starttag(self,tag,attrs):
  if tag=="a": self.links.append(dict(attrs))
def main(path):
 raw=pathlib.Path(path).read_bytes()
 actual=hashlib.sha256(raw).hexdigest()
 assert actual==EXPECTED_SHA, f"derived SHA mismatch: {actual}"
 doc=raw.decode("utf-8")
 p=Anchors();p.feed(doc)
 links=p.links
 linked=[a for a in links if a.get("href","").startswith("./")]
 pending=[a for a in links if a.get("href")=="#" and "data-pending" in a]
 assert len(links)==39, f"Expected 39 links, got {len(links)}"
 assert len(linked)==7, f"Expected 7 preview routes, got {len(linked)}"
 assert {a["href"][2:] for a in linked}==TARGETS
 assert len(pending)==32, f"Expected 32 pending routes, got {len(pending)}"
 assert all("data-pending" not in a for a in linked)
 print("PASS: byte checksum, 39 menu anchors, 7 relative routes, 32 pending")
if __name__=="__main__": main(sys.argv[1])

#!/usr/bin/env python3
"""Static regression contract for the isolated RC5 alpha harness."""
from pathlib import Path
import re

source = Path("preview/phalanx-alpha-android-integration-20261017.html").read_text(encoding="utf-8")
assert 'ALPHA BUILD 20261018-k' in source, "Persistent preview build marker missing"
assert "if(b.dataset.key==='rc5'){active='';" in source, "RC5 button must force reload"
assert "currentPath!==targetPath" in source, "Route must compare iframe actual URL"
assert "if(active!==k||currentPath!==targetPath)" in source, "Route guard regression"
assert "history.pushState" in source and "popstate" in source, "History routing missing"
assert 'data-key="rc5"' in source, "RC5 control missing"
for filename in (
    "PHALANX_RC5_ALPHA_DERIVED_20261017.html",
    "kvk-prep-five-contrast-v13.html",
    "nexus-phalanx-battle-readiness-verified-status-test-2026-10-12.html",
):
    assert filename in source, f"Missing route: {filename}"
    assert (Path("preview") / filename).is_file(), f"Missing target: {filename}"
assert not re.search(r"location\.(?:assign|replace)\(", source), "Unexpected top-level redirect"
print("PASS: alpha harness static navigation contract; browser interaction still requires manual validation")

assert "e.stopImmediatePropagation()" in source, "Candidate Board native click must not navigate to unrelated module"
assert "view.replaceWith(fresh)" in source, "RC5 return must rebuild iframe"
assert "RC5 CLICK RECEIVED" in source, "RC5 click acknowledgement missing"

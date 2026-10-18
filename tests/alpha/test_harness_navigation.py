#!/usr/bin/env python3
"""Static regression contract for the isolated RC5 alpha harness."""
from pathlib import Path
import re

source = Path("preview/phalanx-alpha-android-integration-20261017.html").read_text(encoding="utf-8")
assert 'PHX-A001' in source, "Persistent preview build marker missing"
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

assert "candidate.setAttribute('href','./transfer-scouting-demo-v5.html')" in source, 'Candidate Board link must be corrected in loaded RC5 document'

# Outpost V2 must never silently fall back to legacy V11 in the Android harness.
assert "outposts:['./outpost-map-alpha23-frozen.html'" in source
assert "'preview/outpost-map-alpha23-frozen.html':'outposts'" in source
assert "outpost.setAttribute('href','./outpost-map-alpha23-frozen.html')" in source
assert "reports:['./outpost-report-v11.html','Reports & History · legacy V11']" in source
assert (Path("preview") / "outpost-map-alpha23-frozen.html").is_file()

# Visible buttons must lead to files staged by the alpha workflow.
workflow = Path(".github/workflows/alpha-rc5-contract.yml").read_text(encoding="utf-8")
routes = source.split("const routes={", 1)[1].split("};let view=", 1)[0]
for key in re.findall(r'<button data-key="([^"]+)"', source):
    prefix = key + ":['./"
    assert prefix in routes, f"Visible button has no route: {key}"
    filename = routes.split(prefix, 1)[1].split("'", 1)[0]
    assert (Path("preview") / filename).is_file(), f"Missing visible module: {key}"
    assert "cp preview/" + filename + " alpha-deploy/" in workflow, f"Module not staged: {key}"
print("PASS: visible module routes are staged in deploy")

assert "'preview/transfer-scouting-demo-v5.html':'transfers'" in source
assert "tag.textContent='LEGACY 23'" in source

# Build identity must agree with the version registry and must not use stale labels.
import json
lock = json.loads(Path("data/phalanx-alpha-version-lock-20261018.json").read_text(encoding="utf-8"))
assert lock["app"]["build"] == "B002"
assert "PHX-A001 · B002 | TEST" in source
assert "B001" not in source

assert 'id="copy-module"' in source
assert "navigator.clipboard.writeText(url.href)" in source
assert "url.hash=active||'rc5'" in source

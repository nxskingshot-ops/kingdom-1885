#!/usr/bin/env python3
"""Build a separate RC5 test derivative; never write to the frozen source."""
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[2]
source = root / "preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html"
output = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "dist/reports-out024/rc5-integrated.html"
html = source.read_text(encoding="utf-8")
routes = {
    "Outpost Map": "./PHX-OUT-024-MAP2-FROZEN-20261018.html",
    "Report Center": "./phalanx-reports-out024-local-adapter-20261019.html",
}
for label, url in routes.items():
    old = f'<a aria-disabled="true" data-pending="true" href="#">{label}<small class="status unlinked">NOT LINKED</small></a>'
    new = f'<a href="{url}" title="Isolierte Modulvorschau öffnen">{label}<small class="status linked">PREVIEW</small></a>'
    if html.count(old) != 1:
        raise SystemExit(f"Fail closed: expected exactly one frozen RC5 menu anchor for {label}")
    html = html.replace(old, new, 1)
if 'document.querySelectorAll("[data-pending]")' not in html:
    raise SystemExit("Fail closed: pending-link guard missing in source")
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(html, encoding="utf-8")
assert all(html.count(f'href="{url}"') == 1 for url in routes.values())
assert source.read_text(encoding="utf-8") != html
print("PASS: two isolated static menu routes; frozen RC5 source untouched")

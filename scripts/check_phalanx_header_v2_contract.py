# PHALANX HEADER V2 — preflight static contract (read-only)
# Run: python3 scripts/check_phalanx_header_v2_contract.py
from pathlib import Path
import re
import sys

root=Path(__file__).resolve().parents[1]
component=(root/"src/phalanx-unified-header-v2-isolated.js").read_text()
css=(root/"src/phalanx-unified-header-v2-isolated.css").read_text()
demo=(root/"deploy/phalanx-kvk-test/header-v2-isolated.html").read_text()
errors=[]
for mode in ("home","module","detail"):
    if f'header-{mode}.png' not in demo:
        errors.append("Demo artwork missing: "+mode)
    if f'data-mode="{mode}"' not in demo:
        errors.append("Demo selector missing: "+mode)
if "aspect-ratio:506/217" not in css:
    errors.append("Header CSS artwork ratio differs from verified 506x217")
if "host.replaceChildren(root)" not in component:
    errors.append("Single-header replacement contract absent")
if "if (mode!=='home')" not in component:
    errors.append("HOME must not include module navigation")
for label in ("Zurück","Menü öffnen"):
    if label not in component:
        errors.append("Missing accessible action label: "+label)
if "typeof onBack !== 'function'" not in component or "typeof onMenu !== 'function'" not in component:
    errors.append("Non-home navigation must require real callbacks")
if "expectedImageSize={width:506,height:217}" not in demo:
    errors.append("Browser demo must validate loaded image dimensions")
if "typeof onNavigate !== 'function'" not in component or "onNavigate:(destination)" not in demo:
    errors.append("HOME navigation requires a real callback")
if "repeat(7,minmax(0,1fr))" not in css:
    errors.append("Seven-column HOME navigation grid missing")
if "id===activeDestination" not in component or "activeDestination=destination" not in demo:
    errors.append("HOME selection state is not synchronized")
if "aria-pressed" not in demo:
    errors.append("Mode selection state not exposed")
if "img.complete" not in demo or "img.naturalWidth" not in demo:
    errors.append("Cached image handling missing")
if re.search(r'<script[^>]*src=[^>]*https?://',demo):
    errors.append("Unexpected external script")
if errors:
    for error in errors: print("FAIL",error,file=sys.stderr)
    sys.exit(1)
print("PASS: isolated V2 static component/demo contract")
print("NOTE: This does not validate pixel parity, actual browser navigation or production readiness.")

#!/usr/bin/env python3
"""Static safety checks for isolated PHALANX design-system v0.2."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1] / "deploy" / "phalanx-kvk-test"
html = (root / "design-system-components-isolated.html").read_text(encoding="utf-8")
css = (root / "phalanx-components-isolated.css").read_text(encoding="utf-8")
comparison = (root / "commander-branding-comparison-isolated.html").read_text(encoding="utf-8")
checks = {
    "scoped stylesheet": 'class="px-test-scope"' in html and ".px-test-scope .px-action" in css,
    "v0.2 marker": "Designsystem v0.2" in html,
    "commander label": 'for="commander"' in html and 'id="commander"' in html,
    "identity button": 'id="identity-test"' in html,
    "result announcement": 'id="identity-result"' in html and 'aria-live="polite"' in html,
    "button event handler": "getElementById('identity-test').addEventListener('click'" in html,
    "handlers separated": "Button reagiert.'});document.getElementById" in html,
    "no backend access": not re.search(r"supabase|XMLHttpRequest|fetch\s*\(|WebSocket|signInWithPassword", html, re.I),
    "touch targets": "min-height:44px" in css,
    "focus styles": ":focus-visible" in css,
    "no external assets": not any(token in html.lower() for token in ("<iframe", "<img", "https://", "http://")),
    "commander comparison labeled as unapproved": all(term in comparison for term in ("KEIN FREEZE", "kein originalgetreuer", "A ·", "B ·")),
    "status variants": all(f'data-status="{name}"' in html for name in ("ready", "warning", "blocked")),
}
for name, passed in checks.items():
    print(f'{"PASS" if passed else "FAIL"}: {name}')
if not all(checks.values()):
    raise SystemExit(1)

"""Extend the generated V2.5 staging HTML after the frozen HOME integration."""
import sys
from pathlib import Path

root = Path(sys.argv[1])
index = root / "index.html"
html = index.read_bytes()
anchor = b'<script src="./phx-war-room-v2.js" defer data-phx-war-v2="true"></script>'
assert html.count(anchor) == 1 and b'data-phx-plaque-v25' not in html
assert b'phx-home-plaque-v25.css' in html and b'phx-war-room-live.js' not in html
for name in ("phx-war-room-live.js", "phx-war-room-live.css"):
    assert (root / name).is_file(), f"Missing asset: {name}"
index.write_bytes(html.replace(
    anchor,
    anchor + b'\n<link rel="stylesheet" href="./phx-war-room-live.css">\n'
    + b'<script src="./phx-war-room-live.js" defer></script>',
))

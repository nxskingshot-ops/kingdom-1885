"""Extend the generated V2.5 staging HTML after the frozen HOME integration."""
import sys
from pathlib import Path

root = Path(sys.argv[1])
index = root / "index.html"
html = index.read_bytes()
anchor = b'<script src="./phx-war-room-v2.js" defer data-phx-war-v2="true"></script>'
assert html.count(anchor) == 1 and b'data-phx-plaque-v25' not in html
assert b'phx-home-plaque-v25.css' in html and b'phx-war-room-live.js' not in html
for name in ("phx-war-room-live.js", "phx-war-room-live.css", "phx-war-room-session.js"):
    assert (root / name).is_file(), f"Missing asset: {name}"
# In the Live build, legacy settings can still store preferences and the
# uploaded avatar. Only the live controller may write the visible identity.
legacy_identity = (
    b" $('phx-r10-name').textContent=profile.name||'Kommandant';\n"
    b" $('phx-r10-sub').textContent='Lvl '+(profile.level||'\xe2\x80\x94')+' \xe2\x9a\x94';\n"
    b" $('phx-r11-kingdom').textContent='#'+(profile.kingdom||'\xe2\x80\x94');\n"
    b" $('phx-r11-alliance').textContent=profile.alliance||'Keine Allianz';\n"
)
assert html.count(legacy_identity) == 1, "Unexpected legacy identity renderer"
html = html.replace(legacy_identity, b'', 1)
index.write_bytes(html.replace(
    anchor,
    anchor + b'\n<link rel="stylesheet" href="./phx-war-room-live.css">\n'
    + b'<script src="./phx-war-room-session.js" defer></script>\n'
    + b'<script src="./phx-war-room-live.js" defer></script>',
))

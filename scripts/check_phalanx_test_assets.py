#!/usr/bin/env python3
"""Read-only preflight for the isolated PHALANX Cloudflare test assets."""
from pathlib import Path
import re
import sys

base = Path(__file__).resolve().parents[1] / "deploy" / "phalanx-kvk-test"
required = ("index.html", "index-kvk.html", "kvk-prep-v13.html", "epic-navigation-v2-kvk-test.html", "kvk-prep-v13-epic-v2-test.html", "home-freeze-pinned-preview.html")
errors = []
for name in required:
    file = base / name
    if not file.is_file() or not file.stat().st_size:
        errors.append(f"Missing/empty test asset: {name}")

if not errors:
    root = (base / "index.html").read_text(encoding="utf-8")
    nav = (base / "index-kvk.html").read_text(encoding="utf-8")
    kvk = (base / "kvk-prep-v13.html").read_text(encoding="utf-8")
    epic_v2 = (base / "epic-navigation-v2-kvk-test.html").read_text(encoding="utf-8")
    kvk_v2 = (base / "kvk-prep-v13-epic-v2-test.html").read_text(encoding="utf-8")
    home = (base / "home-freeze-pinned-preview.html").read_text(encoding="utf-8")
    pinned_url = "https://raw.githubusercontent.com/nxskingshot-ops/kingdom-1885/8cd9fdd87dc46ff4f54775e992250e2b0ec6fd40/preview/nexus-app-2-command-center-portrait-final-polish-test.html"
    if home.count(pinned_url) != 1:
        errors.append("HOME preview must reference the expected immutable dependency exactly once")
    if "raw.githubusercontent.com/nxskingshot-ops/kingdom-1885/main/preview/" in home:
        errors.append("HOME preview still loads mutable main branch")
    if "NEXUS PHALANX" not in home:
        errors.append("HOME preview missing PHALANX identity")
    if kvk_v2.count('href="./epic-navigation-v2-kvk-test.html"') < 2:
        errors.append("KvK V2 test copy lacks return links to Epic V2")
    if "Epic Navigation V2" not in epic_v2:
        errors.append("Epic V2 test file lacks the expected V2 title")
    if not re.search(r'<a\s+href=["\']\./kvk-prep-v13-epic-v2-test\.html["\']>KvK Prep', epic_v2):
        errors.append("Epic V2 KvK Prep link missing or disabled")
    if epic_v2.count('data-unlinked="1"') != 33:
        errors.append("Epic V2 placeholder count changed; check design freeze")
    alliance_page = base / "alliance-trends-isolated.html"
    alliance_data = base / "data" / "alliance-trends-2026-10-02.json"
    if epic_v2.count('href="./alliance-trends-isolated.html"') != 1:
        errors.append("Epic V2 must link exactly once to Alliance Trends")
    if not alliance_page.is_file() or not alliance_data.is_file():
        errors.append("Alliance Trends historical preview or snapshot missing")
    else:
        import json
        snapshot = json.loads(alliance_data.read_text(encoding="utf-8"))
        if snapshot.get("status") != "provisional_manual_transcription" or snapshot.get("snapshot_date") != "2026-10-02":
            errors.append("Alliance Trends snapshot provenance changed")
        if "NOT LIVE" not in alliance_page.read_text(encoding="utf-8"):
            errors.append("Alliance Trends preview missing historical-data warning")
    battle_file = base / "battle-readiness-isolated.html"
    battle_data_file = base / "kvk-opponent-intelligence-current.json"
    if not battle_file.is_file() or not battle_file.stat().st_size:
        errors.append("Battle Readiness isolated view missing")
    else:
        battle_html = battle_file.read_text(encoding="utf-8")
        if 'createClient(' in battle_html or '<script type="module">' in battle_html:
            errors.append("Battle Readiness isolated view contains an active Supabase client/module")
        if "./kvk-opponent-intelligence-current.json" not in battle_html:
            errors.append("Battle Readiness snapshot path is not local to the deployment")
    if battle_file.is_file():
        battle_html = battle_file.read_text(encoding="utf-8")
        if 'id="menuBtn"' in battle_html:
            errors.append("Battle Readiness must not show a second hamburger menu")
        if 'class="menu-btn phalanx-back"' not in battle_html or 'href="./epic-navigation-v2-kvk-test.html"' not in battle_html:
            errors.append("Battle Readiness must provide an Epic V2 return link")
        if "ARCHIVE / TEST DATA" not in battle_html:
            errors.append("Historical Battle Readiness snapshot must be clearly marked as archive/test data")
        if "../icon-192.png" in battle_html or "../assets/" in battle_html:
            errors.append("Battle Readiness contains unresolved relative image assets")
    if not battle_data_file.is_file() or not battle_data_file.stat().st_size:
        errors.append("Battle Readiness local opponent snapshot missing")
    if epic_v2.count('href="./battle-readiness-isolated.html"') != 1:
        errors.append("Epic V2 must link to Battle Readiness isolated view exactly once")
    if "./kvk-prep-v13.html" not in nav:
        errors.append("Navigation does not link to the expected KvK module")
    if not re.search(r"<title[^>]*>.*?</title>", nav, re.I | re.S):
        errors.append("Navigation page lacks a title")
    if not re.search(r"<title[^>]*>.*?</title>", kvk, re.I | re.S):
        errors.append("KvK page lacks a title")
    for name, data in (("index.html", root), ("index-kvk.html", nav), ("kvk-prep-v13.html", kvk), ("epic-navigation-v2-kvk-test.html", epic_v2), ("kvk-prep-v13-epic-v2-test.html", kvk_v2), ("home-freeze-pinned-preview.html", home)):
        if re.search(r"service[_-]?role|sb_secret_", data, re.I):
            errors.append(f"Potential privileged key marker in {name}; manual security review required")
    # The isolated Cloudflare root must open the frozen Epic V2, not legacy V1.
    if 'url=./epic-navigation-v2-kvk-test.html' not in root:
        errors.append("Cloudflare test root must redirect to frozen Epic Navigation V2")
    if 'href="./epic-navigation-v2-kvk-test.html"' not in root:
        errors.append("Cloudflare test root fallback link must target Epic Navigation V2")
    if "Deployment-Test erfolgreich" in root:
        print("WARNING: Root index.html is still a placeholder; root routing must be verified before release.")
    if "hcjrdofkdkasznywvcxo.supabase.co" in kvk:
        print("WARNING: KvK test page references the existing Supabase project; auth isolation is NOT verified.")
    if "hcjrdofkdkasznywvcxo.supabase.co" in kvk_v2:
        print("WARNING: Epic V2 KvK test page also uses the existing Supabase backend; do not use real credentials before Auth/RLS approval.")
    for isolated_name in ("battle-readiness-isolated.html", "alliance-trends-isolated.html"):
        isolated_path = base / isolated_name
        if isolated_path.is_file():
            isolated_html = isolated_path.read_text(encoding="utf-8")
            if re.search(r"supabase\.co|createClient\s*\(|signInWithPassword", isolated_html, re.I):
                errors.append(f"Isolated local module unexpectedly contains Supabase auth/backend code: {isolated_name}")

# PWA entry contract: installed app and browser root must open the same frozen Epic V2.
manifest_file = base / "crimson-icon-test.webmanifest"
if not manifest_file.is_file():
    errors.append("Crimson PWA manifest missing")
else:
    import json
    manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
    if manifest.get("start_url") != "./epic-navigation-v2-kvk-test.html":
        errors.append("Crimson PWA installed start_url must target frozen Epic V2")
    if manifest.get("scope") != "./":
        errors.append("Crimson PWA scope unexpectedly changed")

# Isolated Crimson icon test: prevent placeholder text from masquerading as PNGs.
crimson_page = base / "crimson-icon-test.html"
crimson_manifest = base / "crimson-icon-test.webmanifest"
if crimson_page.is_file() or crimson_manifest.is_file():
    if not crimson_page.is_file() or not crimson_manifest.is_file():
        errors.append("Crimson PWA test page or manifest missing")
    for icon_name in ("crimson-icon-192.png", "crimson-icon-512.png", "crimson-icon-512-transparent.png"):
        icon_path = base / "assets" / icon_name
        if not icon_path.is_file():
            errors.append(f"Crimson PNG missing: {icon_name}")
            continue
        icon_bytes = icon_path.read_bytes()
        if len(icon_bytes) < 100 or not icon_bytes.startswith(bytes((137, 80, 78, 71, 13, 10, 26, 10))):
            errors.append(f"Crimson PNG invalid or placeholder: {icon_name} ({len(icon_bytes)} bytes)")
            continue
        # PNG IHDR stores dimensions as two unsigned big-endian 32-bit integers.
        if len(icon_bytes) < 33 or icon_bytes[12:16] != b"IHDR":
            errors.append(f"Crimson PNG has no valid IHDR: {icon_name}")
            continue
        width = int.from_bytes(icon_bytes[16:20], "big")
        height = int.from_bytes(icon_bytes[20:24], "big")
        expected = 192 if icon_name == "crimson-icon-192.png" else 512
        if (width, height) != (expected, expected):
            errors.append(f"Crimson PNG dimensions wrong: {icon_name} ({width}x{height}, expected {expected}x{expected})")

# Epic V2 module routes: fail fast if a navigation target is absent or loses its return path.
for module_name, filename in (("KvK Prep", "kvk-prep-v13-epic-v2-test.html"), ("Battle Readiness", "battle-readiness-isolated.html"), ("Rankings", "phalanx-ranking-integration-rc-20261015.html"), ("Hero Intelligence", "hero-intelligence-v15-isolated.html"), ("Player Intelligence", "player-intelligence-isolated.html")):
    route = './' + filename
    if epic_v2.count('href="' + route + '"') != 1:
        errors.append(f"Epic V2 {module_name} must link exactly once to {route}")
    target = base / filename
    if not target.is_file():
        errors.append(f"Epic V2 {module_name} target missing: {filename}")
    elif 'href="./epic-navigation-v2-kvk-test.html"' not in target.read_text(encoding='utf-8'):
        errors.append(f"Epic V2 {module_name} target lacks return link: {filename}")

# Prevent an archival opponent snapshot from being published as current/live.
import json
snapshot_file = base / "kvk-opponent-intelligence-current.json"
if not snapshot_file.is_file():
    errors.append("Opponent snapshot JSON missing")
else:
    try:
        snapshot = json.loads(snapshot_file.read_text(encoding="utf-8"))
        if snapshot.get("status") != "historical_test_snapshot_not_live":
            errors.append("Opponent snapshot must explicitly be historical/not live")
        if not str(snapshot.get("updated_at", "")).startswith("2026-10-04"):
            errors.append("Opponent snapshot date unexpectedly changed; review before updating")
    except (ValueError, OSError) as exc:
        errors.append(f"Opponent snapshot JSON invalid: {exc}")


# Release routing audit: inspect all local HTML links in the six connected modules.
# Anchors, mailto, external HTTPS links and JS-driven actions are out of scope.
from html.parser import HTMLParser
class LocalLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() == "a":
            for key, value in attrs:
                if key == "href" and value:
                    self.links.append(value)

for module_file in (
    "epic-navigation-v2-kvk-test.html",
    "kvk-prep-v13-epic-v2-test.html",
    "battle-readiness-isolated.html",
    "phalanx-ranking-integration-rc-20261015.html",
    "hero-intelligence-v15-isolated.html",
    "player-intelligence-isolated.html",
    "alliance-trends-isolated.html",
):
    target = base / module_file
    if not target.is_file():
        errors.append(f"Release route missing: {module_file}")
        continue
    parser = LocalLinks()
    parser.feed(target.read_text(encoding="utf-8"))
    for href in parser.links:
        clean = href.split("#", 1)[0].split("?", 1)[0]
        if not clean or clean.startswith(("https://", "http://", "mailto:", "tel:", "javascript:", "/", "#")):
            continue
        resolved = (target.parent / clean).resolve()
        if not resolved.is_relative_to(base.resolve()) or not resolved.is_file():
            errors.append(f"Broken local HTML link: {module_file} -> {href}")

if errors:
    for error in errors:
        print("FAIL:", error, file=sys.stderr)
    sys.exit(1)
print("PASS: Isolated PHALANX test asset preflight (not an auth/security certification).")

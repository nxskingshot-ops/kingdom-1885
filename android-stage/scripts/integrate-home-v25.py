"""Apply the HOME plaque correction to a staged copy of the Android web assets."""

import argparse
from hashlib import sha256
import json
from pathlib import Path


STAGE = Path(__file__).resolve().parents[1]
SCENE = '<img class="phx-queen-scene" src="PHX_HOME_QUEEN_AN_APPROVED.png" alt="" aria-hidden="true">'
# Like R13, mask the baked letters with adjacent texture from the same file.
# The donor strip and mask keep clear of the laurels and gold frame.
LEFT_TEXTURE = """<svg class="phx-home-name-texture" viewBox="0 0 1670 941" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <defs>
    <filter id="phx-v25-texture-edge"><feGaussianBlur stdDeviation="0.9"/></filter>
    <mask id="phx-v25-name-mask" maskUnits="userSpaceOnUse" x="249" y="32" width="144" height="60">
      <rect x="251" y="34" width="140" height="56" fill="white" filter="url(#phx-v25-texture-edge)"/>
    </mask>
  </defs>
  <g mask="url(#phx-v25-name-mask)">
    <svg x="248" y="31" width="146" height="62" viewBox="389 34 10 44" preserveAspectRatio="none" overflow="hidden">
      <image href="./PHX_HOME_QUEEN_AN_APPROVED.png" width="1670" height="941"/>
    </svg>
  </g>
</svg>"""
TERRITORY_ENTRY = '<button aria-label="Outpost Map 2.0 öffnen"'
TERRITORY_BACK = (
    '<a class="phx-v25-territory-back" href="#phalanx-home"'
    ' aria-label="Zurück zu HOME"></a>'
)
OLD_MODULE_RETURN = """if (!event.target.closest('[data-phx-r3-target="home"]')) return;
    event.stopImmediatePropagation();
    location.hash = '#phalanx-home';"""
MODULE_RETURN = """if (!event.target.closest('[data-phx-r3-target="home"]')) return;
    event.stopImmediatePropagation();
    bridge('home');"""
STYLE_LINK = '<link rel="stylesheet" href="./phx-home-plaque-v25.css">'


def integrate(web_root: Path) -> None:
    expected = json.loads((STAGE / "checksums.json").read_text())
    if web_root.resolve() == (STAGE / "www").resolve():
        raise SystemExit("Use a staging copy of www.")
    for filename, digest in expected.items():
        if sha256((web_root / filename).read_bytes()).hexdigest() != digest:
            raise SystemExit(f"Unexpected baseline SHA-256 for {filename}")
    index = web_root / "index.html"
    original = index.read_bytes()
    replacements = {
        SCENE: f"{SCENE}\n{LEFT_TEXTURE}",
        "</head>": f"{STYLE_LINK}\n</head>",
        TERRITORY_ENTRY: f"{TERRITORY_BACK}{TERRITORY_ENTRY}",
        OLD_MODULE_RETURN: MODULE_RETURN,
    }
    patched = original
    for before, after in replacements.items():
        if patched.count(before.encode()) != 1:
            raise SystemExit(f"Unexpected integration anchor: {before}")
        patched = patched.replace(before.encode(), after.encode(), 1)
    if not (web_root / "phx-home-plaque-v25.css").is_file():
        raise SystemExit("Missing V2.5 plaque stylesheet.")
    index.write_bytes(patched)
    print("BESTANDEN: V2.5 texture and CSS applied to verified staging assets.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("web_root", type=Path)
    integrate(parser.parse_args().web_root)

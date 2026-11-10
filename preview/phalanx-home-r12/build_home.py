"""Derive the isolated PHX-007-R12 HOME candidate from the verified R11 HTML."""

import argparse
import base64
import hashlib
from pathlib import Path
import re


R11_SHA256 = "32cbfc36af7d0405044f7ac73afac6ebd80273c9d70451c4c76bd2d3dc3d975b"
ART_SHA256 = "c42c044984b96999f960135c587260d8db5d910b57a7afd02330bb58612e184a"
SOURCE = Path(__file__).resolve().parent


def replace_one(source, pattern, replacement):
    updated, count = re.subn(pattern, lambda _: replacement, source, flags=re.DOTALL)
    if count != 1:
        raise ValueError(f"Expected exactly one matching R11 block, found {count}: {pattern}")
    return updated


def build(r11):
    if hashlib.sha256(r11).hexdigest() != R11_SHA256:
        raise ValueError("Input must be the pinned PHALANX A039 R11 HTML")
    source = r11.decode("utf-8")
    section_pattern = r'<section\b[^>]*\bid="phx-r6-home"[^>]*>.*?</section>'
    original_section = re.search(section_pattern, source, flags=re.DOTALL).group()
    art = re.search(r'src="(data:image/png;base64,([A-Za-z0-9+/=]+))"', original_section)
    if not art or hashlib.sha256(base64.b64decode(art[2], validate=True)).hexdigest() != ART_SHA256:
        raise ValueError("R11 HOME artwork does not match the confirmed visual reference")

    markup = (SOURCE / "home-fragment.html").read_text(encoding="utf-8")
    styles = (SOURCE / "home.css").read_text(encoding="utf-8")
    script = (SOURCE / "home.js").read_text(encoding="utf-8")
    source = replace_one(source, section_pattern, markup.rstrip().replace("__HOME_ART__", art[1]))
    source = replace_one(source, r'<style id="phx-r6-home-css">.*?</style>',
                         f'<style id="phx-r6-home-css">\n{styles}</style>')
    source = replace_one(source, r'<style id="phx-r11-css">.*?</style>', "")
    source = replace_one(source, r'<script id="phx-r6-home-router">.*?</script>', "")
    # R11 still owns the existing War Room and local profile. Bind HOME after their initialization.
    source = replace_one(source, r'</body>\s*</html>\s*\Z',
                         f'<script id="phx-r12-home-router">\n{script}</script>\n</body>\n</html>\n')
    return source.encode("utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("r11", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()
    if arguments.r11.resolve() == arguments.output.resolve():
        parser.error("the output must be separate from the R11 original")
    arguments.output.write_bytes(build(arguments.r11.read_bytes()))

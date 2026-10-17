#!/usr/bin/env python3
"""Stage approved original HOME card crops for the isolated preview only.

Accept either individual source WebP assets or the single signed-by-content
FREEZE ZIP. Never unpack arbitrary archive members to the checkout.
"""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/"assets/design-freeze/cards"
ARCHIVE=ROOT/"assets/design-freeze/PHALANX_10_FREEZE_Originalkacheln.zip"
DEST=ROOT/"deploy/phalanx-kvk-test/assets/design-freeze/cards"
EXPECTED_REFERENCE="d23305e3631fe5065ae4e3665c1567883aad4dbaa47a6f2ce350a2260cfbfe9d"
NAMES=("kvk-vorbereitung","aussenposten","transfer-scouting","allianz-vergleich","heldenrechner","truppenratio","marsch-optimierung","gegner-analyse","koenigreich-scout","datenberichte")

def main():
    DEST.mkdir(parents=True,exist_ok=True)
    if ARCHIVE.is_file():
        with zipfile.ZipFile(ARCHIVE) as archive:
            manifest=json.loads(archive.read("manifest.json"))
            if manifest.get("reference_sha256")!=EXPECTED_REFERENCE:
                raise SystemExit("ERROR: wrong approved HOME reference checksum")
            cards=manifest.get("cards",{})
            if set(cards)!=set(NAMES):
                raise SystemExit("ERROR: original ZIP must contain exactly ten known cards")
            for name in NAMES:
                item=cards[name]
                member="assets/design-freeze/cards/"+name+".webp"
                if item.get("file")!=member:
                    raise SystemExit("ERROR: unexpected manifest file path: "+name)
                data=archive.read(member)
                if hashlib.sha256(data).hexdigest()!=item.get("sha256"):
                    raise SystemExit("ERROR: FREEZE image checksum mismatch: "+name)
                if not(data[:4]==b"RIFF" and data[8:12]==b"WEBP"):
                    raise SystemExit("ERROR: invalid WebP: "+name)
                (DEST/(name+".webp")).write_bytes(data)
        print("PASS: ten original HOME FREEZE images verified and staged from approved ZIP")
    elif all((SOURCE/(name+".webp")).is_file() for name in NAMES):
        for name in NAMES:
            data=(SOURCE/(name+".webp")).read_bytes()
            if not(data[:4]==b"RIFF" and data[8:12]==b"WEBP"):
                raise SystemExit("ERROR: invalid WebP: "+name)
            (DEST/(name+".webp")).write_bytes(data)
        print("PASS: ten original HOME FREEZE images staged from individual files (checksum provenance requires archive)")
    else:
        print("OPEN: no approved ZIP or complete individual assets in repo; image fallback remains")
if __name__=="__main__":
    main()

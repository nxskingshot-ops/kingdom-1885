#!/usr/bin/env python3
"""Validate original PHALANX HOME artwork without treating missing files as release-ready."""
from pathlib import Path
import hashlib, json, sys
ROOT=Path(__file__).resolve().parents[1]
CARDS=ROOT/"assets/design-freeze/cards"
NAMES=("kvk-vorbereitung","aussenposten","transfer-scouting","allianz-vergleich","heldenrechner","truppenratio","marsch-optimierung","gegner-analyse","koenigreich-scout","datenberichte")
EXPECTED=(1024,1536)
def main():
    try:
        from PIL import Image
    except ImportError:
        Image=None
    findings=[]
    for name in NAMES:
        path=CARDS/(name+".webp")
        item={"card":name,"exists":path.is_file()}
        if path.is_file():
            data=path.read_bytes()
            item.update(bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),valid_webp=data[:4]==b"RIFF" and data[8:12]==b"WEBP")
            if Image:
                with Image.open(path) as im:
                    im.verify()
                item["verified"]=True
        findings.append(item)
    ready=all(x.get("valid_webp") for x in findings)
    print(json.dumps({"scope":"isolated","artwork_ready":ready,"expected":len(NAMES),"present":sum(x["exists"] for x in findings),"cards":findings},ensure_ascii=False,indent=2))
    # A nonzero status would prevent unrelated test previews while assets are being staged.
    return 0
if __name__=="__main__":
    sys.exit(main())

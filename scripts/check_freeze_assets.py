#!/usr/bin/env python3
"""PHALANX freeze asset gate: fail closed on absent/mutated immutable originals.
Stdlib only; no network, no deployment, no file modification.
Usage: python3 scripts/check_freeze_assets.py --manifest docs/design/freeze-assets.json
       python3 scripts/check_freeze_assets.py --manifest docs/design/freeze-assets.json --changed-file path
"""
import argparse, hashlib, json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
def fail(msg): print("FAIL:",msg,file=sys.stderr); return False
def check(manifest, changed):
    ok=True
    if not manifest.is_file(): return fail("manifest missing: "+str(manifest))
    try: data=json.loads(manifest.read_text(encoding="utf-8"))
    except (ValueError,OSError) as e: return fail("manifest invalid: "+str(e))
    assets=data.get("assets")
    if not isinstance(assets,list) or not assets: return fail("no registered originals; release blocked")
    ids=set();paths=set()
    for a in assets:
        if not isinstance(a,dict): ok=fail("malformed entry");continue
        name=a.get("id");rel=a.get("path");digest=a.get("sha256");approved=a.get("approved")
        if not isinstance(name,str) or not name or name in ids: ok=fail("invalid/duplicate asset ID");continue
        ids.add(name)
        if not isinstance(rel,str) or not rel or rel in paths: ok=fail(name+": invalid/duplicate path");continue
        paths.add(rel)
        path=(ROOT/rel).resolve()
        if not path.is_relative_to(ROOT) or path.is_symlink(): ok=fail(name+": unsafe path");continue
        if not approved: ok=fail(name+": approval not recorded")
        if not isinstance(digest,str) or len(digest)!=64 or any(c not in "0123456789abcdef" for c in digest): ok=fail(name+": SHA-256 missing/invalid");continue
        if not path.is_file(): ok=fail(name+": original missing at "+rel);continue
        actual=hashlib.sha256(path.read_bytes()).hexdigest()
        if actual!=digest: ok=fail(name+": SHA-256 mismatch")
        else: print("PASS:",name,rel)
    for p in changed:
        full=(ROOT/p).resolve()
        if not full.is_relative_to(ROOT): ok=fail("changed path outside repository")
        if p in paths: ok=fail("protected original changed: "+p)
    required={"PHX-HOME-VISUAL-FREEZE-20261020-01","PHX-PYLON-IX-VISUAL-FREEZE-20261020-01","UNIFIED-HEADER-V2-FINAL-FREEZE"}
    if not required.issubset(ids): ok=fail("required freezes not all registered: "+", ".join(sorted(required-ids)))
    return ok
if __name__=="__main__":
    parser=argparse.ArgumentParser();parser.add_argument("--manifest",default="docs/design/freeze-assets.json");parser.add_argument("--changed-file",action="append",default=[]);args=parser.parse_args()
    sys.exit(0 if check(ROOT/args.manifest,args.changed_file) else 1)

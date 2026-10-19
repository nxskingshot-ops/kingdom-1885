#!/usr/bin/env python3
"""Build an opt-in read-only loader from the existing frozen map request.
No credential or endpoint duplication in repository source; output only in dist.
"""
from pathlib import Path
import json
import re
import sys

root = Path(__file__).resolve().parents[2]
frozen = (root / "preview/PHX-OUT-024-MAP2-FROZEN-20261018.html").read_text(encoding="utf-8")
bridge = (root / "preview/phalanx-out024-public-json-bridge-20261019.html").read_text(encoding="utf-8")
out = Path(sys.argv[1])
pattern = r"fetch\('(https://[^']+/rest/v1/public_outposts_verified_20261002\?[^']+)',\{headers:\{apikey:'([^']+)'\}\}\)"
matches = re.findall(pattern, frozen)
if len(matches) != 1:
    raise SystemExit("Fail closed: expected exactly one frozen map public read request")
url, public_key = matches[0]
if "verified=eq.true" not in url or "published=eq.true" not in url or not public_key.startswith("sb_publishable_"):
    raise SystemExit("Fail closed: public read filters/key not verified")
if "id=\"load-public\"" in bridge:
    raise SystemExit("Fail closed: loader already inserted")
button = '<button id="load-public" type="button">Veröffentlichte Outposts laden</button>'
script = """<script>
(()=>{'use strict';
const btn=document.getElementById('load-public'),status=document.getElementById('status');
btn.addEventListener('click',async()=>{
  btn.disabled=true;status.textContent='Lade veröffentlichte Outposts …';
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try{
    const response=await fetch(URL_VALUE,{headers:{apikey:KEY_VALUE},signal:controller.signal,cache:'no-store'});
    if(!response.ok)throw Error('HTTP '+response.status);
    const rows=await response.json();
    if(!Array.isArray(rows)||rows.length===0||rows.length>1000)throw Error('Ungültige Anzahl');
    const source=document.getElementById('source');
    source.value=JSON.stringify(rows.map(r=>({source_key:r.source_key,alliance:r.alliance,coord_x:r.coord_x,coord_y:r.coord_y})));
    source.dispatchEvent(new Event('input',{bubbles:true}));
    document.getElementById('check').click();
    if(document.getElementById('direct').disabled)throw Error('Datenprüfung fehlgeschlagen');
    status.textContent=rows.length+' veröffentlichte Outposts geladen und geprüft. Direkte Übergabe möglich.';
  }catch(e){status.textContent='Laden abgelehnt: '+e.message}
  finally{clearTimeout(timer);btn.disabled=false}
});
})();
</script>""".replace("URL_VALUE",json.dumps(url)).replace("KEY_VALUE",json.dumps(public_key))
if bridge.count('<button id="check">') != 1 or bridge.count('</main></html>') != 1:
    raise SystemExit("Fail closed: import bridge markup changed")
filters = '<p><label>Allianz <select id="alliance-filter"><option value="">Alle</option></select></label> <label>Quadrant <select id="quadrant-filter"><option value="">Alle</option><option value="N">Nord</option><option value="O">Ost</option><option value="S">Süd</option><option value="W">West</option></select></label></p>'
bridge=bridge.replace('<button id="check">',filters+'<button id="check">',1)
bridge=bridge.replace('<button id="check">',button+' <button id="check">',1)
bridge=bridge.replace('</main></html>','</main>'+script+'</html>',1)
if bridge.count('id="load-public"') != 1 or bridge.count('published=eq.true') != 1:
    raise SystemExit("Fail closed: generated loader contract invalid")
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(bridge,encoding='utf-8')
assert "load-public" in bridge and "published=eq.true" in bridge
print("PASS: isolated opt-in public OUT-024 loader assembled; frozen map unchanged")

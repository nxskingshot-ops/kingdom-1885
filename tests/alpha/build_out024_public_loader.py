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
    const allianceFilter=document.getElementById('alliance-filter'),quadrantFilter=document.getElementById('quadrant-filter');
    const selected=allianceFilter.value;
    const names=[...new Set(rows.map(r=>String(r.alliance||'').trim().toUpperCase()))].filter(Boolean).sort();
    allianceFilter.replaceChildren(new Option('Alle',''),...names.map(n=>new Option(n,n)));
    allianceFilter.value=names.includes(selected)?selected:'';
    window.phalanxOutpostRows=rows;
    const apply=()=>{
      const a=allianceFilter.value,q=quadrantFilter.value;
      const subset=window.phalanxOutpostRows.filter(r=>{
        const x=Number(r.coord_x),y=Number(r.coord_y),quadrant=x<600?(y<600?'N':'W'):(y<600?'O':'S');
        return (!a||String(r.alliance||'').trim().toUpperCase()===a)&&(!q||quadrant===q);
      });
      source.value=JSON.stringify(subset.map(r=>({source_key:r.source_key,alliance:String(r.alliance||'').trim().toUpperCase(),coord_x:r.coord_x,coord_y:r.coord_y})));
      source.dispatchEvent(new Event('input',{bubbles:true}));
      if(subset.length){
        document.getElementById('check').click();
        if(document.getElementById('direct').disabled)throw Error('Datenprüfung fehlgeschlagen');
        status.textContent=subset.length+' von '+rows.length+' veröffentlichten Outposts ausgewählt und geprüft.';
      }else status.textContent='Keine Outposts für diese Filter.';
    };
    const reportArea=document.getElementById('one-tap-report');
    const makeReport=()=>{
      const selected=JSON.parse(source.value);
      if(!selected.length){reportArea.textContent='Keine Outposts für diese Auswahl.';return}
      const totals=new Map();
      for(const row of selected){
        const x=row.coord_x,y=row.coord_y,q=x<600?(y<600?'N':'W'):(y<600?'O':'S');
        const key=row.alliance+' · '+q;totals.set(key,(totals.get(key)||0)+1);
      }
      reportArea.textContent=['KINGDOM #1885 | OUTPOST REPORT','Quelle: veröffentlichte OUT-024-Daten','Einträge: '+selected.length,'',...[...totals].sort((a,b)=>a[0].localeCompare(b[0])).map(([k,n])=>k+': '+n)].join('\\n');
    };
    allianceFilter.onchange=()=>{apply();makeReport()};
    quadrantFilter.onchange=()=>{apply();makeReport()};
    apply();makeReport();
  }catch(e){status.textContent='Laden abgelehnt: '+e.message}
  finally{clearTimeout(timer);btn.disabled=false}
});
})();
</script>""".replace("URL_VALUE",json.dumps(url)).replace("KEY_VALUE",json.dumps(public_key))
if bridge.count('<button id="check">') != 1 or bridge.count('</main></html>') != 1:
    raise SystemExit("Fail closed: import bridge markup changed")
filters = '<p><label>Allianz <select id="alliance-filter"><option value="">Alle</option></select></label> <label>Quadrant <select id="quadrant-filter"><option value="">Alle</option><option value="N">Nord</option><option value="O">Ost</option><option value="S">Süd</option><option value="W">West</option></select></label></p>'
bridge=bridge.replace('<button id="check">',filters+'<button id="check">',1)
bridge=bridge.replace('<button id="check">','<h2>Outpost-Bericht</h2><pre id="one-tap-report" style="white-space:pre-wrap;overflow-wrap:anywhere">Noch kein Bericht erstellt.</pre><button id="export-copy" type="button">Bericht kopieren</button> <button id="export-txt" type="button">TXT herunterladen</button><button id="check">',1)
bridge=bridge.replace('<button id="check">',button+' <button id="check">',1)
bridge=bridge.replace('</main></html>','</main>'+script+'</html>',1)
export_script = """<script>
(()=>{
const report=document.getElementById('one-tap-report'),status=document.getElementById('status');
const getText=()=>report.textContent.startsWith('KINGDOM #1885')?report.textContent:'';
document.getElementById('export-copy').addEventListener('click',async()=>{
 const value=getText();if(!value){status.textContent='Bitte zuerst Outposts laden.';return}
 try{await navigator.clipboard.writeText(value);status.textContent='Gefilterter Bericht kopiert.'}
 catch{status.textContent='Kopieren nicht verfügbar.'}
});
document.getElementById('export-txt').addEventListener('click',()=>{
 const value=getText();if(!value){status.textContent='Bitte zuerst Outposts laden.';return}
 try{
  const blob=new Blob([value],{type:'text/plain;charset=utf-8'});
  const link=document.createElement('a'),url=URL.createObjectURL(blob);
  link.href=url;link.download='phalanx-out024-report.txt';link.textContent='Datei speichern';
  document.body.appendChild(link);link.click();
  setTimeout(()=>{URL.revokeObjectURL(url);link.remove()},60000);
  status.textContent='Download angefordert. Falls dein Browser nichts speichert, nutze „Bericht kopieren“.';
 }catch(e){status.textContent='Download nicht möglich: '+e.message}
});
})();
</script>"""
bridge=bridge.replace('</main></html>','</main>'+export_script+'</html>',1)

if bridge.count('id="load-public"') != 1 or bridge.count('published=eq.true') != 1:
    raise SystemExit("Fail closed: generated loader contract invalid")
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(bridge,encoding='utf-8')
assert "load-public" in bridge and "published=eq.true" in bridge
print("PASS: isolated opt-in public OUT-024 loader assembled; frozen map unchanged")

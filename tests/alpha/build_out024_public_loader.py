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
const saveButton=document.getElementById('export-txt');
let activeUrl=null,saveLink=null;
saveButton.addEventListener('click',()=>{
 const value=getText();if(!value){status.textContent='Bitte zuerst Outposts laden.';return}
 try{
  if(saveLink)saveLink.remove();
  if(activeUrl)URL.revokeObjectURL(activeUrl);
  activeUrl=URL.createObjectURL(new Blob([value],{type:'text/plain;charset=utf-8'}));
  saveLink=document.createElement('a');
  saveLink.href=activeUrl;saveLink.download='phalanx-out024-report.txt';
  saveLink.textContent='TXT-Datei speichern';
  saveLink.style.cssText='display:inline-block;padding:12px 16px;margin:12px 0;border:1px solid #d8b66d;border-radius:8px;color:#f5d58a';
  saveButton.insertAdjacentElement('afterend',saveLink);
  status.textContent='Tippe auf „TXT-Datei speichern“. Falls dein Browser das Speichern verhindert, nutze „Bericht kopieren“.';
 }catch(e){status.textContent='Download nicht möglich: '+e.message}
});
})();
</script>"""
bridge=bridge.replace('</main></html>','</main>'+export_script+'</html>',1)
# One-Tap layout: place user controls before a collapsed developer-only panel.
# Preserve every existing element ID and handler for the tested report workflow.
start=bridge.index('<p><label>Allianz <select id="alliance-filter">')
end=bridge.index('<button id="check">',start)
controls=bridge[start:end].replace('<button id="load-public" type="button">Veröffentlichte Outposts laden</button> ', '', 1)
bridge=bridge[:start]+bridge[end:]
bridge=bridge.replace('<button id="load-public" type="button">Veröffentlichte Outposts laden</button> ', '', 1)
bridge=bridge.replace('<label for="source">', '<details id="expert-tools"><summary>Expertenwerkzeuge</summary><label for="source">', 1)
bridge=bridge.replace('<p id="status" role="status">', '</details><p id="status" role="status">', 1)
bridge=bridge.replace('<h1>⚔ OUT-024 · geprüfter Datenimport</h1>', '<h1>⚔ OUT-024 · Outpost Reports</h1>', 1)
bridge=bridge.replace('<details id="expert-tools">', '<button id="load-public" type="button">Outposts laden</button>'+controls+'<details id="expert-tools">', 1)
bridge=bridge.replace('Lokaler, schreibgeschützter Test: Füge einen JSON-Export mit verifizierten OUT-024-Daten ein. Keine Netzwerkanfragen, kein Speichern, keine Änderungen an der Karte.', 'Veröffentlichte Outposts laden, filtern und den Bericht kopieren. Die Karte bleibt unverändert.', 1)
bridge=bridge.replace('<button id="export-txt" type="button">TXT herunterladen</button>', '<button id="export-txt" type="button">TXT vorbereiten</button><p id="export-feedback" role="status"></p>', 1)
bridge=bridge.replace("const saveButton=document.getElementById('export-txt');", "const saveButton=document.getElementById('export-txt'),feedback=document.getElementById('export-feedback');", 1)
bridge=bridge.replace("status.textContent='Tippe auf „TXT-Datei speichern“. Falls dein Browser nichts speichert, nutze „Bericht kopieren“.';", "feedback.textContent='Datei vorbereitet. Tippe auf „TXT-Datei speichern“. Alternativ Bericht kopieren.';", 1)
bridge=bridge.replace("status.textContent='Tippe auf „TXT-Datei speichern“. Falls dein Browser das Speichern verhindert, nutze „Bericht kopieren“.';", "feedback.textContent='Datei vorbereitet. Tippe auf „TXT-Datei speichern“. Alternativ Bericht kopieren.';", 1)
# Explicit function-level classification, without fabricating a frozen header asset.
# The shared PHALANX function header must be integrated from its verified canonical source.
bridge=bridge.replace('<h1>⚔ OUT-024 · Outpost Reports</h1>', '<nav id="out024-context" aria-label="PHALANX navigation"><span class="out024-level">TERRITORY CONTROL / FUNKTION</span><strong>Outpost Reports</strong></nav><h1>Outpost Reports</h1>', 1)
bridge=bridge.replace('Veröffentlichte Outposts laden, filtern und den Bericht kopieren. Die Karte bleibt unverändert.', 'Veröffentlichte Outposts laden, filtern und den Bericht kopieren.', 1)
bridge=bridge.replace('''<style id="out024-one-tap-style">''', '''<style id="out024-one-tap-style">
#out024-context{display:flex;flex-direction:column;gap:5px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid #9f793b;color:#f4d494}
#out024-context .out024-level{font-size:11px;letter-spacing:.15em;color:#9eb8ca;font-weight:750}
#out024-context strong{font:700 clamp(17px,4vw,23px) Georgia,serif}
''', 1)
# Isolated visual polish only; no edits to frozen branding or application shell.
style='''<style id="out024-one-tap-style">
body{padding:14px;background:radial-gradient(ellipse at 50% 0%,#172d39 0%,#06111c 65%);font-family:system-ui,-apple-system,sans-serif}
main{max-width:650px;padding:clamp(18px,4vw,30px);border:1px solid #9f793b;box-shadow:0 20px 70px #0009;background:linear-gradient(165deg,#122938,#081824);border-radius:20px}
h1{font-size:clamp(23px,5vw,32px);letter-spacing:.04em;margin:0 0 12px}
main>p{line-height:1.55;color:#d8dce1}
#load-public{width:100%;font-weight:750;font-size:17px;padding:17px;background:linear-gradient(125deg,#785021,#b48742,#785021);color:#fff5d9;border:1px solid #e1ba75;box-sizing:border-box}
#load-public:disabled{opacity:.6}
#alliance-filter,#quadrant-filter{display:block;width:100%;min-height:46px;margin-top:7px;background:#071927;color:#f4e1b5;border:1px solid #a78046;border-radius:9px;padding:9px}
main>p:has(#alliance-filter){display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0}
#one-tap-report{padding:18px;background:#061621;border:1px solid #425667;border-radius:12px;line-height:1.65;font-size:14px;overflow-x:auto}
#export-copy,#export-txt{font-weight:650;min-height:48px}
#export-copy{background:#b78b43;color:#07121c;border-color:#f0c77d}
#export-feedback{color:#f0d393}
#expert-tools{margin:24px 0 12px;padding:12px;border:1px solid #405666;border-radius:12px;background:#081c2a}
#expert-tools summary{cursor:pointer;color:#bac8d3;font-size:14px;padding:5px}
#expert-tools textarea{margin-top:10px}
#status{padding:10px 0;color:#d9e6e9}
@media(max-width:360px){main>p:has(#alliance-filter){grid-template-columns:1fr}#export-copy,#export-txt{width:100%;box-sizing:border-box}}
</style>'''
bridge=bridge.replace('</main></html>',style+'</main></html>',1)
if bridge.count('id="load-public"')!=1 or bridge.count('id="expert-tools"')!=1 or bridge.count('id="one-tap-report"')!=1:
    raise SystemExit("Fail closed: One-Tap layout contract invalid")


if bridge.count('id="load-public"') != 1 or bridge.count('published=eq.true') != 1:
    raise SystemExit("Fail closed: generated loader contract invalid")
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(bridge,encoding='utf-8')
assert "load-public" in bridge and "published=eq.true" in bridge
print("PASS: isolated opt-in public OUT-024 loader assembled; frozen map unchanged")

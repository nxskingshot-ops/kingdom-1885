/* PHX M1 – R11 local-only authorized Outpost JSON import.
 * Must run after the R11 map view exists and before the Atlas bridge.
 * No network access, no sample/live data and no silent fallback.
 */
(()=>{'use strict';
const map=document.getElementById('map');if(!map)return;
const wrap=document.createElement('section');wrap.id='phx-m1-import';
wrap.style.cssText='padding:12px;border:1px solid #bda16b;border-radius:10px;margin:10px 0;background:#102337;color:#e7d4aa';
const title=document.createElement('strong');title.textContent='Outpost-Datenquelle · lokaler Import';
const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.setAttribute('aria-label','Autorisierte Outpost-JSON-Datei auswählen');
const info=document.createElement('p');info.setAttribute('role','status');info.textContent='Keine Daten geladen. Bestehende Karte bleibt erhalten.';
wrap.append(title,input,info);map.prepend(wrap);
let verified=null,importGeneration=0;
const text=x=>typeof x==='string'&&x.length>0&&x.length<=128;
function validate(rows){
 if(!Array.isArray(rows)||rows.length>10000)throw Error('Erwartet: Liste mit höchstens 10.000 Einträgen');
 const ids=new Set();return rows.map((r,i)=>{
 if(!r||typeof r!=='object'||Array.isArray(r))throw Error('Ungültiger Eintrag '+i);
 for(const k of ['id','source_key','alliance','structure_type'])if(!text(r[k]))throw Error('Ungültiges Feld '+k+' bei '+i);
 if(ids.has(r.id))throw Error('Doppelte ID '+r.id);ids.add(r.id);
 for(const k of ['coord_x','coord_y'])if(!Number.isInteger(r[k])||r[k]<0||r[k]>1199)throw Error('Ungültige Koordinate '+k+' bei '+i);
 if(!Number.isInteger(r.level)||r.level<0||r.level>100)throw Error('Ungültiges Level bei '+i);
 return Object.freeze({id:r.id,source_key:r.source_key,alliance:r.alliance,structure_type:r.structure_type,coord_x:r.coord_x,coord_y:r.coord_y,level:r.level});
 });
}
input.addEventListener('change',async()=>{
 const generation=++importGeneration;
 verified=null;delete window.PHALANX_OUTPOST_DATA_PROVIDER;
 window.dispatchEvent(new Event('phx-outpost-provider-changed'));
 const f=input.files?.[0];if(!f)return;
 try{
 if(f.size>2*1024*1024)throw Error('Datei größer als 2 MB');
 const raw=await f.text();
 if(generation!==importGeneration)return;
 const parsed=JSON.parse(raw);
 const rows=validate(Array.isArray(parsed)?parsed:parsed?.rows);
 verified=Object.freeze(rows);window.PHALANX_OUTPOST_DATA_PROVIDER=async()=>({rows:verified});
 info.textContent=rows.length+' geprüfte Einträge aus lokaler Datei. Keine Serverübertragung.';
 window.dispatchEvent(new Event('phx-outpost-provider-changed'));
 }catch(e){if(generation===importGeneration)info.textContent='Import abgewiesen: '+e.message;}
});
})();

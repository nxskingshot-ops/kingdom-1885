// PHX-INT005: isolated, local-only reports. No network or writes. Existing formatter reused.
const $=id=>document.getElementById(id);
const file=$('reportFile'),alliance=$('alliance'),format=$('reportFormat'),make=$('makeReport'),part=$('reportPart'),output=$('reportText'),copy=$('copyReport'),status=$('reportStatus');
const formatter=window.NexusAllianceReports;
let rows=[],parts=[];
const clean=s=>String(s??'').replace(/[\r\n\t\x00-\x1f\x7f]+/g,' ').trim();
function clearReport(){parts=[];part.replaceChildren();part.disabled=true;output.value='';copy.disabled=true;}
file.addEventListener('change',async()=>{
 rows=[];clearReport();make.disabled=true;alliance.disabled=true;
 try{
  if(!formatter)throw Error('Report-Generator fehlt');
  if(!file.files?.[0])throw Error('Keine Datei gewählt');
  if(file.files[0].size>2000000)throw Error('Datei zu groß (max. 2 MB)');
  const raw=JSON.parse(await file.files[0].text());
  const input=Array.isArray(raw)?raw:Array.isArray(raw?.outposts)?raw.outposts:null;
  if(!input||input.length>5000)throw Error('JSON-Liste oder outposts-Array erwartet (max. 5000)');
  const seen=new Set();
  rows=input.map((r,i)=>{
   if(!r||typeof r!=='object'||Array.isArray(r))throw Error('Ungültiger Eintrag '+(i+1));
   const name=clean(r.name??r.structure_type??r.type),a=clean(r.alliance),level=Number(r.level),x=Number(r.coord_x??r.x),y=Number(r.coord_y??r.y);
   if(!name||!a||name.length>120||a.length>40||!Number.isInteger(level)||level<1||level>20||!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>1199||y>1199)throw Error('Ungültige Daten in Eintrag '+(i+1));
   const coord=x+','+y;if(seen.has(coord))throw Error('Doppelte Koordinate '+coord);seen.add(coord);
   return {name,alliance:a,level,coord_x:x,coord_y:y};
  });
  alliance.replaceChildren();
  for(const a of ['ALLE',...[...new Set(rows.map(r=>r.alliance))].sort()]){const option=document.createElement('option');option.value=a;option.textContent=a;alliance.append(option)}
  alliance.disabled=false;make.disabled=false;
  status.textContent=rows.length+' lokale Einträge geladen · UNVERIFIZIERT.';
 }catch(e){rows=[];status.textContent='Import abgelehnt: '+e.message;}
});
function displayPart(){output.value=parts[Number(part.value)]??'';copy.disabled=!output.value;}
make.addEventListener('click',()=>{
 clearReport();
 try{
  if(!formatter)throw Error('Report-Generator fehlt');
  const a=alliance.value,selected=rows.filter(r=>a==='ALLE'||r.alliance===a);
  if(!selected.length)throw Error('Keine Outposts für diese Allianz');
  const sector=a==='ALLE'?'KINGDOM #1885':a;
  if(format.value==='discord'){
   const report=formatter.makeDiscordOutpostReport({sector,outposts:selected,verified:false});
   parts=formatter.splitReportForDiscord(report);
  }else{
   const report=formatter.makeOutpostReport({sector,outposts:selected,verified:false,includeAlliance:a==='ALLE'});
   parts=formatter.splitReportForKingshot(report);
  }
  parts.forEach((_,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent='Teil '+(i+1)+' von '+parts.length;part.append(option)});
  part.disabled=false;part.value='0';displayPart();
  status.textContent=parts.length+' Nachricht(en) erstellt · UNVERIFIZIERT · lokaler Import.';
 }catch(e){status.textContent='Bericht nicht erstellt: '+e.message;}
});
part.addEventListener('change',displayPart);
copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(output.value);status.textContent='Ausgewählten Teil kopiert · UNVERIFIZIERT.'}catch{output.focus();output.select();status.textContent='Bitte markierten Text manuell kopieren.'}});

// PHX-OUTPOST-ATLAS-CORE-V2: modular authorized provider and validated outpost contract.
import {loadAuthorizedOutposts} from './core/provider.js';
const $=id=>document.getElementById(id),ns='http://www.w3.org/2000/svg',fam={NXS:['#4FA36A',0],NxS:['#4FA36A',1],FRA:['#E57876',0],Fra:['#E57876',1],MYM:['#8871ED',0],MyM:['#8871ED',1],OoO:['#D94D93',0],oOo:['#D94D93',1]};let data=[],items=[],zoom=1,dx=0,dy=0,sel=null,drag=null;
const X=r=>170+145*(r.coord_x-r.coord_y)/1199,Y=r=>190+145*((r.coord_x+r.coord_y)/1199-1),quad=r=>r.coord_x<600?(r.coord_y<600?'Nord':'West'):(r.coord_y<600?'Ost':'Süd');function e(tag,attrs){let n=document.createElementNS(ns,tag);for(let k in attrs)n.setAttribute(k,attrs[k]);return n}function line(g,p,q,c='#395a70',w=1){g.append(e('line',{x1:X(p),y1:Y(p),x2:X(q),y2:Y(q),stroke:c,'stroke-width':w}))}
function paint(){let g=$('camera');g.replaceChildren();g.setAttribute('transform',`translate(${dx} ${dy}) translate(170 190) scale(${zoom}) translate(-170 -190)`);g.append(e('polygon',{points:'170,45 315,190 170,335 25,190',fill:'#102d42af',stroke:'#dfb66d','stroke-width':2}));for(let n=200;n<1200;n+=200){line(g,{coord_x:n,coord_y:0},{coord_x:n,coord_y:1199});line(g,{coord_x:0,coord_y:n},{coord_x:1199,coord_y:n})}line(g,{coord_x:600,coord_y:0},{coord_x:600,coord_y:1199},'#bba374',2);line(g,{coord_x:0,coord_y:600},{coord_x:1199,coord_y:600},'#bba374',2);for(let [t,x,y] of [['N',170,31],['O',330,193],['S',170,360],['W',10,193]]){let z=e('text',{x,y,fill:'#f4d791','font-size':13,'text-anchor':'middle'});z.textContent=t;g.append(z)}let z=e('text',{x:170,y:187,fill:'#f4d791','font-size':16,'text-anchor':'middle'});z.textContent='♜';g.append(z);for(let r of items){let [col,acad]=fam[r.alliance]||['#a1adb8',0],x=X(r),y=Y(r);let selected=sel?.id===r.id;
let marker=e('g',{'role':'button','tabindex':'0','aria-label':r.structure_type+' Level '+r.level+' · '+r.alliance+' · '+r.coord_x+','+r.coord_y,style:'cursor:pointer'});
if(selected){marker.append(e('circle',{cx:x,cy:y,r:8.8,stroke:'#fff3cc','stroke-width':1.8,fill:'#f0c677','fill-opacity':.13}));marker.append(e('circle',{cx:x,cy:y,r:6.9,stroke:col,'stroke-width':1.3,fill:'none'}))}
marker.append(e('circle',{cx:x,cy:y,r:11,fill:'transparent','pointer-events':'all'}));
marker.append(e('circle',{cx:x,cy:y,r:acad?4.3:3.6,fill:acad?'#112a3c':col,stroke:col,'stroke-width':acad?2:1,'pointer-events':'none'}));
if(acad)marker.append(e('circle',{cx:x,cy:y,r:1,fill:col,'pointer-events':'none'}));
marker.addEventListener('click',()=>choose(r));marker.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();choose(r)}});g.append(marker)}}
function choose(r){
 sel=r;let d=$('detail');d.hidden=false;d.replaceChildren();
 const head=document.createElement('div');head.className='ph-detail-head';
 const h=document.createElement('strong');h.textContent=r.structure_type+' · L'+r.level;
 const actions=document.createElement('div');actions.className='ph-detail-actions';
 const toggle=document.createElement('button');toggle.type='button';toggle.textContent='Details ▴';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Outpost-Details aufklappen');
 const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Outpost-Details schließen');
 actions.append(toggle,close);head.append(h,actions);
 const summary=document.createElement('p');summary.className='ph-detail-summary';const allianceStrong=document.createElement('span');allianceStrong.className='ph-alliance-strong';allianceStrong.textContent=r.alliance;summary.append(allianceStrong,document.createTextNode(' · '+quad(r)+' · X:'+r.coord_x+' / Y:'+r.coord_y));
 const extra=document.createElement('div');extra.className='ph-detail-extra';extra.hidden=true;
 const id=document.createElement('p');id.textContent='Outpost-ID: '+r.source_key;
 const copy=document.createElement('button');copy.type='button';copy.textContent='Koordinaten kopieren';copy.onclick=async()=>{try{await navigator.clipboard.writeText(r.coord_x+','+r.coord_y);copy.textContent='Kopiert ✓'}catch{copy.textContent=r.coord_x+','+r.coord_y}};
 extra.append(id,copy);
 toggle.onclick=()=>{extra.hidden=!extra.hidden;let expanded=!extra.hidden;toggle.textContent=expanded?'Weniger ▾':'Details ▴';toggle.setAttribute('aria-expanded',String(expanded));toggle.setAttribute('aria-label',expanded?'Outpost-Details einklappen':'Outpost-Details aufklappen')};
 close.onclick=()=>{d.hidden=true;sel=null;paint()};
 d.append(head,summary,extra);paint();
}
function renderActiveFilters(){
 const wrap=$('activeFilters');wrap.replaceChildren();
 const selected=[['q','Suche'],['a','Allianz'],['quad','Quadrant'],['type','Typ'],['level','Level']].filter(([id])=>Boolean($(id).value));
 wrap.hidden=selected.length===0;
 if(!selected.length)return;
 const label=document.createElement('span');label.className='active-title';label.textContent='Aktiv:';wrap.append(label);
 for(const [id,name] of selected){
  const control=$(id),value=control.tagName==='SELECT'?control.selectedOptions[0]?.textContent:control.value;
  const chip=document.createElement('button');chip.type='button';chip.className='active-filter-chip';chip.textContent=(id==='q'?'Suche: ':id==='type'?'Typ: ':id==='level'?'Level: ':'')+value;const x=document.createElement('span');x.className='ph-chip-x';x.textContent='×';x.setAttribute('aria-hidden','true');chip.append(x);chip.setAttribute('aria-label',name+'-Filter '+value+' entfernen');
  chip.onclick=()=>{control.value='';filter()};wrap.append(chip);
 }
}
function filter(){let q=$('q').value.toLowerCase(),a=$('a').value,v=$('quad').value,t=$('type').value,l=$('level').value;items=data.filter(r=>(!a||r.alliance===a)&&(!v||quad(r)===v)&&(!t||r.structure_type===t)&&(!l||String(r.level)===l)&&(!q||[r.source_key,r.alliance,r.structure_type,r.level,r.coord_x,r.coord_y,r.coord_x+','+r.coord_y].some(z=>String(z).toLowerCase().includes(q))));$('count').textContent=items.length+' / '+data.length;if(sel&&!items.some(r=>r.id===sel.id)){sel=null;$('detail').hidden=true;$('detail').replaceChildren()}renderActiveFilters();$('noMatches').hidden=!(data.length>0&&items.length===0);let rows=$('rows');rows.replaceChildren();items.forEach(r=>{let b=document.createElement('button');b.className='item';const a=document.createElement('span');a.className='ph-list-alliance';a.textContent=r.alliance;b.append(document.createTextNode(r.structure_type+' L'+r.level+' · '),a,document.createTextNode(' · '+r.coord_x+','+r.coord_y));b.onclick=()=>choose(r);rows.append(b)});paint()}
for(let [n,c] of [['NXS','#4FA36A'],['FRA','#E57876'],['MYM','#8871ED'],['OoO','#D94D93'],['Andere','#a1adb8']]){let s=document.createElement('span');s.innerHTML=`<i style="--c:${c}"></i>${n}`;$('legend').append(s)}$('legend').append('● Hauptallianz · ◉ Akademie');for(let id of ['q','a','quad','type','level'])$(id).addEventListener('input',filter);$('reset').onclick=()=>{for(let id of ['q','a','quad','type','level'])$(id).value='';filter()};function clampCamera(){
  if(zoom<=1){dx=dy=0;return}
  const limit=Math.max(0,Math.min(145*(zoom-1),145*zoom-82));
  dx=Math.max(-limit,Math.min(limit,dx));
  dy=Math.max(-limit,Math.min(limit,dy));
}
function setz(z){zoom=Math.max(1,Math.min(7,z));clampCamera();paint()}
$('zin').onclick=()=>setz(zoom*1.5);$('zout').onclick=()=>setz(zoom/1.5);$('home').onclick=()=>{zoom=1;dx=dy=0;paint()};
const mapEl=document.querySelector('.map'),fullBtn=$('expandMap');
function toggleMapFullscreen(force){
 const on=typeof force==='boolean'?force:!mapEl.classList.contains('expanded');
 mapEl.classList.toggle('expanded',on);
 document.body.classList.toggle('ph-map-open',on);
 fullBtn.textContent=on?'⤢':'⛶';
 fullBtn.setAttribute('aria-label',on?'Vollbild schließen':'Karte im Vollbild öffnen');
 fullBtn.setAttribute('title',on?'Vollbild schließen':'Karte im Vollbild öffnen');
 fullBtn.setAttribute('aria-pressed',String(on));
 if(!on){zoom=1;dx=dy=0;paint()}else{clampCamera();paint()}
}
fullBtn.onclick=()=>toggleMapFullscreen();
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mapEl.classList.contains('expanded'))toggleMapFullscreen(false)});
const svg=$('svg');
svg.style.touchAction='none';
const touches=new Map();let panStart=null,pinchStart=null;
const pt=e=>{const r=svg.getBoundingClientRect();return {x:(e.clientX-r.left)*340/r.width,y:(e.clientY-r.top)*380/r.height}};
function pinchSnapshot(){const v=[...touches.values()];if(v.length<2)return null;const a=v[0],b=v[1];return {distance:Math.hypot(b.x-a.x,b.y-a.y),center:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},zoom,dx,dy}}
svg.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 touches.set(e.pointerId,pt(e));
 try{svg.setPointerCapture(e.pointerId)}catch(_){}
 if(touches.size>=2){pinchStart=pinchSnapshot();panStart=null}
 else{panStart={point:pt(e),dx,dy};pinchStart=null}
 if(e.cancelable)e.preventDefault();
});
svg.addEventListener('pointermove',e=>{
 if(!touches.has(e.pointerId))return;
 const p=pt(e);touches.set(e.pointerId,p);
 if(touches.size>=2){
   if(!pinchStart){pinchStart=pinchSnapshot();return}
   const cur=pinchSnapshot();
   if(!pinchStart.distance)return;
   zoom=Math.max(1,Math.min(7,pinchStart.zoom*cur.distance/pinchStart.distance));
   const ratio=zoom/pinchStart.zoom;
   dx=(cur.center.x-170)-ratio*(pinchStart.center.x-170-pinchStart.dx);
   dy=(cur.center.y-190)-ratio*(pinchStart.center.y-190-pinchStart.dy);
   clampCamera();paint();
 }else if(panStart&&zoom>1){
   dx=panStart.dx+p.x-panStart.point.x;
   dy=panStart.dy+p.y-panStart.point.y;
   clampCamera();paint();
 }
 if(e.cancelable)e.preventDefault();
});
function endPointer(e){
 touches.delete(e.pointerId);
 if(touches.size===1){const remaining=[...touches.values()][0];panStart={point:remaining,dx,dy};pinchStart=null}
 else if(touches.size>=2){pinchStart=pinchSnapshot();panStart=null}
 else{pinchStart=null;panStart=null}
}
svg.addEventListener('pointerup',endPointer);
svg.addEventListener('pointercancel',endPointer);
svg.addEventListener('lostpointercapture',e=>{if(touches.has(e.pointerId))endPointer(e)});
paint();loadAuthorizedOutposts().then(rows=>{data=rows;$('status').textContent=data.length+' verifizierte Outposts · bereitgestellt';for(let [id,key] of [['a','alliance'],['type','structure_type'],['level','level']])for(let v of [...new Set(data.map(r=>r[key]))].sort()){let o=document.createElement('option');o.value=v;o.textContent=v;$(id).append(o)}filter()}).catch(err=>$('status').textContent='Daten nicht erreichbar: '+err.message+' — keine Testdaten erfunden');

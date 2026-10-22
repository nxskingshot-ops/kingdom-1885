/* PHX-A045 — R11 Atlas CORE V2 route integration, isolated, reversible.
 * Include AFTER the original A039-R11 router. Requires the canonical Atlas
 * directory at src/phalanx/outpost-atlas/. No data provider is injected.
 */
(()=>{'use strict';
const map=document.getElementById('map');
if(!map||typeof window.phxNavigate!=='function')return;
const original=[...map.children];
const frame=document.createElement('iframe');
frame.id='phx-atlas-core-v2';frame.title='Outpost Atlas CORE V2';
frame.setAttribute('sandbox','allow-scripts allow-same-origin');
frame.setAttribute('referrerpolicy','no-referrer');
frame.style.cssText='display:none;width:100%;height:80vh;min-height:550px;border:0;background:#101820';
const status=document.createElement('p');status.setAttribute('role','status');
status.style.cssText='display:none;color:#d9b66a;padding:8px 12px';
map.prepend(status);map.prepend(frame);
let active=false,loaded=false;
function rollback(){active=false;frame.style.display='none';status.style.display='none';original.forEach(el=>el.hidden=false)}
function activate(){
 if(active)return;
 active=true;original.forEach(el=>el.hidden=true);
 frame.style.display='block';status.style.display='block';
 status.textContent='Outpost Atlas CORE V2 lädt. Daten nur über autorisierten Anbieter.';
 if(!frame.getAttribute('src'))frame.src='src/phalanx/outpost-atlas/index.html';
}
frame.addEventListener('load',()=>{loaded=true;if(active)status.textContent='Atlas-Modul geladen. Autorisierter Datenanbieter erforderlich.'});
frame.addEventListener('error',()=>{if(active){status.textContent='Atlas konnte nicht geladen werden. Vorherige Karte wird wiederhergestellt.';rollback()}});
function sync(){if(document.body.dataset.view==='map'&&!map.classList.contains('hidden'))activate();else if(active)rollback()}
new MutationObserver(sync).observe(map,{attributes:true,attributeFilter:['class']});
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-view']});
window.phxAtlasIntegration=Object.freeze({version:'PHX-OUT-024 CORE V2',activate,rollback,status:()=>({active,loaded})});
sync();
})();

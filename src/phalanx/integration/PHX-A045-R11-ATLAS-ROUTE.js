/* PHX M1: R11 -> Atlas CORE V2, reversible same-origin readiness handshake.
 * Load AFTER the R11 router. Legacy remains visible until Atlas has validated
 * rows from an explicitly authorized host provider.
 */
(()=>{'use strict';
const map=document.getElementById('map');
if(!map||typeof window.phxNavigate!=='function')return;
const original=[...map.querySelectorAll('iframe')];
const originalHidden=new Map(original.map(el=>[el,el.hidden]));
const frame=document.createElement('iframe');
frame.id='phx-atlas-core-v2';frame.title='Outpost Atlas CORE V2';
frame.setAttribute('sandbox','allow-scripts allow-same-origin');
frame.setAttribute('referrerpolicy','no-referrer');
frame.style.cssText='display:none;width:100%;height:80vh;min-height:550px;border:0;background:#101820';
const status=document.createElement('p');status.setAttribute('role','status');
status.style.cssText='display:none;color:#d9b66a;padding:8px 12px';
const context=map.querySelector('.context');
if(context){context.after(frame);frame.after(status)}else{map.prepend(status);map.prepend(frame)}
let active=false,loaded=false,ready=false;
function rollback(){active=false;frame.style.display='none';status.style.display='none';original.forEach(el=>el.hidden=originalHidden.get(el))}
function inMap(){return document.body.dataset.view==='map'&&!map.classList.contains('hidden')}
function sync(){
 if(!inMap()){rollback();return}
 if(typeof window.PHALANX_OUTPOST_DATA_PROVIDER!=='function'){rollback();return}
 if(!frame.getAttribute('src'))frame.src='src/phalanx/outpost-atlas/index.html';
 if(!ready)return; // Keep legacy visible until validated data is rendered.
 active=true;original.forEach(el=>el.hidden=true);
 frame.style.display='block';status.style.display='block';
 status.textContent='Outpost Atlas CORE V2 · verifizierte Daten geladen';
}
window.addEventListener('message',event=>{
 if(event.source!==frame.contentWindow||event.origin!==window.location.origin)return;
 if(event.data?.type!=='PHX_ATLAS_CORE_V2_DATA_READY')return;
 if(!Number.isInteger(event.data.count)||event.data.count<0)return;
 ready=true;sync();
});
frame.addEventListener('load',()=>{loaded=true});
frame.addEventListener('error',()=>{ready=false;rollback()});
new MutationObserver(sync).observe(map,{attributes:true,attributeFilter:['class']});
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-view']});
window.phxAtlasIntegration=Object.freeze({version:'PHX-OUT-024 CORE V2',rollback,status:()=>({active,loaded,ready})});
sync();
})();

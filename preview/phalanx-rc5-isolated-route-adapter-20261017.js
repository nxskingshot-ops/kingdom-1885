/* NEXUS PHALANX RC5 isolated alpha route adapter.
   Include ONLY in a derivative of the byte-frozen RC5 HTML.
   Original frozen asset is immutable. No write operations. */
(()=>{'use strict';
const PREVIEW_ROOT='https://nxskingshot-ops.github.io/kingdom-1885/preview/';
const targets={
'Dashboard':'nexus-phalanx-command-center-alpha28-local-pair-test-2026-10-13.html',
'KvK Prep':'kvk-prep-five-contrast-v13.html',
'Battle Readiness':'nexus-phalanx-battle-readiness-verified-status-test-2026-10-12.html',
'Reports & History':'outpost-report-v11.html',
'Candidate Board':'kingdom-hub-trends-v8.html',
'Hero Intelligence':'hero-intelligence-evidence-advisor-v15-2026-10-12.html'
};
const entries=[...document.querySelectorAll('a[data-pending]')];
const totalBefore=document.querySelectorAll('nav .submenu a').length;
function label(a){return [...a.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').trim();}
let linked=0,disabled=0,unexpected=0;
for(const a of entries){
 const name=label(a),file=targets[name];
 if(file){
  const existing=new URL(a.href,location.href);
  if(existing.href!==PREVIEW_ROOT+file){unexpected++;continue;}
  // The frozen click interceptor is registered directly on each anchor.
  // Replacing the node drops that interceptor WITHOUT changing markup or CSS.
  const clean=a.cloneNode(true);clean.removeAttribute('data-pending');clean.removeAttribute('aria-disabled');
  clean.href=PREVIEW_ROOT+file;
  clean.addEventListener('click',event=>{
   // Intercept only in embedded alpha harness; keep ordinary browser links otherwise.
   if(window.parent===window)return;
   event.preventDefault();
   window.parent.postMessage({type:'phalanx-alpha-rc5-route',path:'preview/'+file},location.origin);
  });
  a.replaceWith(clean);linked++;
 }else if(a.getAttribute('href')==='#'){disabled++;a.setAttribute('aria-disabled','true');}
 else unexpected++;
}
const rankings=[...document.querySelectorAll('a:not([data-pending])')].filter(a=>a.textContent.trim().startsWith('Rankings'));const rankingValid=rankings.length===1&&rankings[0].href===PREVIEW_ROOT+'phalanx-ranking-integration-rc-20261015.html';
const result={total:totalBefore,linked,disabled,unexpected,rankingValid,ready:totalBefore===39&&entries.length===38&&linked===6&&disabled===32&&unexpected===0&&rankingValid};
document.documentElement.dataset.rc5RouteGate=result.ready?'pass':'fail';
console.info('[PHALANX RC5 isolated route adapter]',result);
})();
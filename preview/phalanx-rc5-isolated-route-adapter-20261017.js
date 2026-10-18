/* NEXUS PHALANX RC5 alpha adapter — only deploy derivative, never frozen source.
   Preserve Reports & History (legacy report) as a separate module from Outpost Map V2. */
(()=>{'use strict';
const anchors=[...document.querySelectorAll('nav .submenu a')];
const map=anchors.find(a=>a.textContent.trim().startsWith('Outpost Map'));
const legacy=anchors.find(a=>a.textContent.trim().startsWith('Reports & History'));
const expectedMap=map&&(map.getAttribute('href')==='#'&&map.hasAttribute('data-pending')||map.getAttribute('href')==='./PHX-OUT-024-MAP2-FROZEN-20261018.html');
const expectedLegacy=legacy&&legacy.getAttribute('href')==='./outpost-report-v11.html';
if(anchors.length!==39||!expectedMap||!expectedLegacy){
 document.documentElement.dataset.rc5RouteGate='fail';
 console.error('[PHALANX] RC5 source contract changed: stop before route mutation');
 return;
}
const routeTargets=new Map([
 ['Dashboard','nexus-phalanx-command-center-alpha28-local-pair-test-2026-10-13.html'],
 ['KvK Prep','kvk-prep-five-contrast-v13.html'],
 ['Battle Readiness','nexus-phalanx-battle-readiness-verified-status-test-2026-10-12.html'],
 ['Rankings','phalanx-ranking-integration-rc-20261015.html'],
 ['Outpost Map','PHX-OUT-024-MAP2-FROZEN-20261018.html'],
 ['Reports & History','outpost-report-v11.html'],
 ['Candidate Board','transfer-scouting-demo-v5.html'],
 ['Hero Intelligence','hero-intelligence-evidence-advisor-v15-2026-10-12.html']
]);
let wired=0;
for(const a of anchors){
 const label=[...a.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').trim();
 const file=routeTargets.get(label);
 if(!file)continue;
 const clone=a.cloneNode(true); // removes frozen per-anchor click blocker
 clone.setAttribute('href','./'+file);
 clone.removeAttribute('data-pending');clone.removeAttribute('aria-disabled');
 const status=clone.querySelector('.status');
 if(status){status.textContent=label==='Outpost Map'?'MAP 2.0 · 24':label==='Reports & History'?'LEGACY':'PREVIEW';status.classList.remove('unlinked');status.classList.add('linked');}
 clone.addEventListener('click',e=>{
  if(window.parent===window)return;
  e.preventDefault();
  window.parent.postMessage({type:'phalanx-alpha-rc5-route',path:'preview/'+file},location.origin);
 });
 a.replaceWith(clone);wired++;
}
const pending=[...document.querySelectorAll('nav .submenu a[data-pending]')].length;
const ready=wired===8&&pending===31;
document.documentElement.dataset.rc5RouteGate=ready?'pass':'fail';
console.info('[PHALANX RC5 route gate]',{total:anchors.length,wired,pending,ready});
})();

/* NEXUS PWA update checks: compare the actual deployed shell, not a manually maintained version number. */
(()=>{
'use strict';
const page=location.pathname;
const shell=document.documentElement;
const scriptText=Array.from(document.scripts).find(s=>!s.src)?.textContent||'';
const cssText=document.querySelector('head style')?.textContent||'';
const shellIdentity=()=>[document.title,scriptText,cssText].join('\u241f');
const baseline=shellIdentity();
let notification=false, checking=false, dirty=false, workerChanged=false;
const banner=document.createElement('aside');
banner.id='nexus-update-banner';
banner.setAttribute('role','status');
banner.style.cssText='position:fixed;z-index:2147483646;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));padding:12px 16px;background:#392716;color:#ffe9b6;border:2px solid #d4aa62;border-radius:12px;box-shadow:0 4px 28px #0009;font:600 13px system-ui;display:none;align-items:center;gap:12px;flex-wrap:wrap';
const message=document.createElement('span');
message.textContent='A new NEXUS version is available.';
message.style.flex='1';
const apply=document.createElement('button');
apply.textContent='Update now';
apply.type='button';
const later=document.createElement('button');
later.textContent='Later';
later.type='button';
banner.append(message,apply,later);
document.body.append(banner);
const notify=()=>{notification=true;banner.style.display='flex'};
later.addEventListener('click',()=>{banner.style.display='none'});
function observeInputs(doc){
 try{doc.addEventListener('input',()=>{dirty=true},true);doc.addEventListener('change',()=>{dirty=true},true)}catch(_){}
}
observeInputs(document);
document.querySelectorAll('iframe').forEach(frame=>frame.addEventListener('load',()=>{try{if(frame.contentDocument)observeInputs(frame.contentDocument)}catch(_){}}));
apply.addEventListener('click',()=>{
 if(dirty&&!confirm('Unsaved entries may be lost. Update NEXUS now?'))return;
 const target=new URL(location.href);
 target.searchParams.set('_nexus_reload',Date.now().toString());
 location.replace(target.href);
});
async function check(){
 if(checking||document.visibilityState==='hidden'||!navigator.onLine)return;
 checking=true;
 try{
  if('serviceWorker' in navigator){
   const reg=await navigator.serviceWorker.getRegistration();
   if(reg)await reg.update();
  }
  const response=await fetch(page+'?_nexus_version_check='+Date.now(),{cache:'no-store',redirect:'follow'});
  if(!response.ok)return;
  const doc=new DOMParser().parseFromString(await response.text(),'text/html');
  const servedScript=Array.from(doc.scripts).find(s=>!s.src)?.textContent||'';
  const servedCSS=doc.querySelector('head style')?.textContent||'';
  const fresh=[doc.title,servedScript,servedCSS].join('\u241f');
  if(fresh!==baseline||workerChanged)notify();
 }catch(err){console.warn('NEXUS update check:',err)}
 finally{checking=false}
}
if('serviceWorker' in navigator){
 navigator.serviceWorker.addEventListener('controllerchange',()=>{workerChanged=true;notify()});
 navigator.serviceWorker.getRegistration().then(reg=>{
  if(!reg)return;
  if(reg.waiting)notify();
  reg.addEventListener('updatefound',()=>{
   const next=reg.installing;
   if(next)next.addEventListener('statechange',()=>{if(next.state==='activated')notify()});
  });
 }).catch(()=>{});
}
window.addEventListener('focus',check);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
window.addEventListener('online',check);
setInterval(check,15*60*1000);
check();
})();

// Kingdom #1885 PWA: network-first, with offline fallback for installed app assets.
// HTML is never written to the offline cache: prevents outdated dashboard pages.
const CACHE = 'kingdom-1885-20260928-live-html-v9';
const FILES = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET' || new URL(event.request.url).origin!==location.origin)return;
  const request=event.request;
  const html=request.mode==='navigate' || request.destination==='document' || /\.html(?:$|\?)/i.test(new URL(request.url).pathname);
  if(html){
    event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>caches.match(request)));
    return;
  }
  event.respondWith(fetch(request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}
    return response;
  }).catch(()=>caches.match(request)));
});

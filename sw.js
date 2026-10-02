// NEXUS: always request fresh network content; cache is used only when offline.
const CACHE = 'kingdom-1885-nexus-20261002-v20';
const OFFLINE = ['./','./index.html','./preview/kingdom-hub-menu-test.html','./manifest.webmanifest','./nexus.webmanifest','./pwa-update.js','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => event.waitUntil(
 caches.open(CACHE).then(c=>c.addAll(OFFLINE)).then(()=>self.skipWaiting())
));
self.addEventListener('activate', event => event.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch', event => {
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==location.origin)return;
 const url=new URL(request.url);
 const isHTML=request.mode==='navigate'||request.destination==='document'||url.pathname.endsWith('.html')||url.pathname.endsWith('/');
 event.respondWith(
  fetch(request,{cache:'no-store'}).then(response=>{
   if(response.ok&&response.type==='basic'&&!url.searchParams.has('_nexus_version_check')&&!url.searchParams.has('_nexus_reload')){
    const copy=response.clone();
    event.waitUntil(caches.open(CACHE).then(c=>c.put(request,copy)));
   }
   return response;
  }).catch(async()=>{
   const cached=await caches.match(request,{ignoreSearch:true});
   if(cached)return cached;
   if(isHTML)return (await caches.match('./preview/kingdom-hub-menu-test.html'))||
    new Response('<h1>NEXUS offline</h1><p>Reconnect to load the latest version.</p>',{headers:{'Content-Type':'text/html'}});
   return Response.error();
  })
 );
});

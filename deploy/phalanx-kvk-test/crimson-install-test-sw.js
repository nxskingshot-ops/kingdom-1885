// PHALANX Crimson: isolated, scope-limited installation test only.
// No production pages or shared data are cached.
const CACHE = 'phalanx-crimson-install-test-v3';
const SCOPE = new URL('./', self.registration.scope);
const ALLOWED = [
  new URL('crimson-icon-test.html', SCOPE).href,
  new URL('epic-navigation-v2-kvk-test.html', SCOPE).href,
  new URL('crimson-icon-test.webmanifest', SCOPE).href,
  new URL('assets/crimson-freeform-192.png', SCOPE).href,
  new URL('assets/crimson-freeform-512.png', SCOPE).href,
  new URL('assets/crimson-maskable-512.png', SCOPE).href,
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ALLOWED);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('phalanx-crimson-install-test-') && key !== CACHE) {
        await caches.delete(key);
      }
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !ALLOWED.includes(request.url)) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      const cached = await caches.match(request);
      return cached || Response.error();
    }
  })());
});

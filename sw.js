const CACHE = 'nourish-v1';
const ASSETS = ['/nourish/', '/nourish/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for API calls, cache-first for the app shell
  if (e.request.url.includes('api.anthropic') || e.request.url.includes('strava') ||
      e.request.url.includes('openfoodfacts') || e.request.url.includes('usda')) {
    return; // let these go straight to network
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

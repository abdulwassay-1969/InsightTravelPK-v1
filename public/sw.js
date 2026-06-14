const CACHE_NAME = 'insighttravelpk-v1';
const MAP_TILE_CACHE = 'map-tiles-cache';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/globals.css',
  '/loading.tsx'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== MAP_TILE_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event: any) => {
  const url = new URL(event.request.url);

  // Cache openstreetmap tile layer requests dynamically
  if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('tile.osm.org')) {
    event.respondWith(
      caches.open(MAP_TILE_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            // Offline fallback
            return cachedResponse || new Response('', { status: 404 });
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Next.js static files or page requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Only cache successful GET requests from our origin
        if (
          event.request.method === 'GET' && 
          networkResponse.status === 200 && 
          url.origin === self.location.origin &&
          !url.pathname.startsWith('/api') &&
          !url.pathname.startsWith('/_next/webpack-hmr')
        ) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        return cachedResponse || Response.error();
      });
      return cachedResponse || fetchPromise;
    })
  );
});

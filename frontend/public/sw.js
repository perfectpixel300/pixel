const CACHE_NAME = 'pixel-perfect-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pixelperfect.png',
  '/favicon.svg',
  '/logo.jpeg'
];

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-caching non-fatal warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (!request || request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Skip non-HTTP protocols (browser extensions, data URIs, etc.)
  if (!url.protocol.startsWith('http')) return;

  // Let API requests pass directly to the network without Service Worker interception
  if (
    url.pathname.startsWith('/api') ||
    url.port === '5000' ||
    url.hostname.includes('brevo.com') ||
    url.hostname.includes('cloudinary.com')
  ) {
    return;
  }

  // Let Vite dev-server requests pass directly
  if (
    url.pathname.includes('/@vite') ||
    url.pathname.includes('/@fs') ||
    url.pathname.includes('/@id') ||
    url.pathname.includes('/src/') ||
    url.pathname.includes('hot-update')
  ) {
    return;
  }

  // Navigation requests (HTML SPA routes)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        try {
          const cached = (await caches.match('/index.html')) || (await caches.match('/'));
          if (cached) return cached;
        } catch {}
        return new Response('<!DOCTYPE html><html><body>Offline</body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        });
      })
    );
    return;
  }

  // Static assets & files: Cache-first with network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache).catch(() => {});
            }).catch(() => {});
          }
          return networkResponse;
        })
        .catch(() => {
          // Never resolve to undefined in event.respondWith
          return new Response('', {
            status: 408,
            statusText: 'Network request failed and not in cache',
          });
        });
    })
  );
});


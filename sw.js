const CACHE_NAME = 'ignite-eval-cache-v2';
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/supabase-config.js',
  '/sw.js',
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.1/dist/umd/supabase.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return undefined;
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const { request } = event;
  const url = new URL(request.url);
  const isDocumentRequest = request.mode === 'navigate' || request.destination === 'document';
  const isSupabaseConfig = url.pathname.endsWith('/supabase-config.js');

  if (isDocumentRequest) {
    event.respondWith(networkFirst(request, '/index.html'));
    return;
  }

  if (isSupabaseConfig) {
    event.respondWith(networkFirst(request, null));
    return;
  }

  event.respondWith(cacheFirst(request));
});

const networkFirst = (request, fallbackPath) => {
  return fetch(request)
    .then((response) => {
      const cloned = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
      return response;
    })
    .catch(() => {
      if (!fallbackPath) {
        return caches.match(request);
      }
      return caches.match(request).then((cached) => cached || caches.match(fallbackPath));
    });
};

const cacheFirst = (request) => {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      return cachedResponse;
    }
    return fetch(request)
      .then((response) => {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        return response;
      })
      .catch(() => undefined);
  });
};

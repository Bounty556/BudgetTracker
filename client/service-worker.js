const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/dist/app.bundle.js',
  '/dist/db.bundle.js'
];

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') {
    event.respondWith(caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return caches.open(RUNTIME).then(cache => {
        return fetch(event.request).then(data => {
          return cache.put(event.request, data.clone()).then(() => {
            return data;
          })
        });
      });
    }));
  }
});
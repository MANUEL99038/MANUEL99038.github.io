const CACHE_NAME = 'detector-perdidas-v1';
const APP_SHELL = [
  './',
  './index.html',
  './css/styles.css',
  './css/enhancements.css',
  './js/app.js',
  './manifest.json',
  './assets/image.png',
  './assets/icons/favicon.svg',
  './assets/icons/app-icon.svg',
  './assets/icons/app-icon-maskable.svg',
  './assets/icons/app-icon-192.png',
  './assets/icons/app-icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((cacheName) => cacheName.startsWith('detector-perdidas-') && cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;
  if (requestUrl.pathname.includes('/downloads/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(new URL('./index.html', self.registration.scope)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => cachedResponse || fetch(request))
  );
});
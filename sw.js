const cacheName = 'journey-snap-v1';
const filesToCache = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './js/main.js',
  './js/app.js',
  './js/destinations.js',
  './pages/destinations.html',
  './pages/gallery.html',
  './pages/memories.html',
  './images/background.jpg',
  './images/pwa-icon-128.png',
  './images/pwa-icon-144.png',
  './images/pwa-icon-152.png',
  './images/pwa-icon-192.png',
  './images/pwa-icon-256.png',
  './images/pwa-icon-512.png',
  './images/icons/home.svg',
  './images/icons/map.svg',
  './images/icons/gallery.svg',
  './images/icons/add.svg',
  './images/destinations/paris.jpg',
  './images/destinations/tokyo.jpg',
  './images/destinations/bali.jpg',
  './images/destinations/santorini.jpg',
  './images/destinations/newyork.jpg',
  './images/destinations/rio.jpg',
  './favicon.ico'
];

// Instalacja Service Worker'a i buforowanie plików
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// Obsługa żądań z pamięci podręcznej i dynamiczne buforowanie
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request.clone())
          .then((fetchResponse) => {
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic' || event.request.method !== 'GET') {
              return fetchResponse;
            }
            
            const responseToCache = fetchResponse.clone();
            caches.open(cacheName)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return fetchResponse;
          });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});

// Aktywacja Service Worker'a i czyszczenie starych cache'ów
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheName];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!cacheWhitelist.includes(cache)) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
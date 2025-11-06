const CACHE_NAME = 'wellness-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch strategy: Network first, fall back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Periodic water reminder
self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_WATER_REMINDER') {
    scheduleWaterReminder();
  }
});

function scheduleWaterReminder() {
  // This is a simplified version - in production, use Background Sync API
  setInterval(() => {
    self.registration.showNotification('💧 Stay Hydrated!', {
      body: 'Time to drink some water. Keep your body hydrated!',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'water-reminder',
      requireInteraction: false
    });
  }, 3600000); // Every hour
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

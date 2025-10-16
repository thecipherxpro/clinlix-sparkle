const CACHE_NAME = 'clinlix-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  'https://clinlix.com/assets/logo-clinlix-BphsOeP6.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Clinlix PWA Cache Opened');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip Supabase API calls - always fetch fresh data
  if (event.request.url.includes('supabase')) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          // Cache static assets
          if (event.request.url.includes('/assets/') || 
              event.request.url.includes('.png') || 
              event.request.url.includes('.jpg')) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});

// 🔔 Push Notification Handler
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received:', event);
  
  let notificationData = {
    title: 'Clinlix',
    body: 'You have a new notification',
    icon: 'https://clinlix.com/assets/logo-clinlix-BphsOeP6.png',
    badge: 'https://clinlix.com/assets/logo-clinlix-BphsOeP6.png',
    data: { url: '/' }
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || 'Clinlix',
        body: data.body || 'You have a new notification',
        icon: data.icon || 'https://clinlix.com/assets/logo-clinlix-BphsOeP6.png',
        badge: data.badge || 'https://clinlix.com/assets/logo-clinlix-BphsOeP6.png',
        data: { 
          url: data.target_url || '/',
          ...data 
        },
        vibrate: [100, 50, 100],
        tag: data.tag || 'clinlix-notification',
        requireInteraction: false
      };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      vibrate: notificationData.vibrate,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction
    })
  );
});

// 🖱️ Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
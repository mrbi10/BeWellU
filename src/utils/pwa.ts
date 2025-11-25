export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/BeWellU/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
          }

          if (registration.active) {
            registration.active.postMessage({
              type: 'SCHEDULE_WATER_REMINDER',
            });
          }
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
}

export function showNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        icon: '/BeWellU/icon-192.png',
        badge: '/BeWellU/icon-192.png',
        ...options,
      });
    });
  }
}

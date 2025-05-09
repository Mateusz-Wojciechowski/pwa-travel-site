// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Konfiguracja Firebase ze szczegółami Twojego projektu
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Obsługa wiadomości w tle (gdy aplikacja jest zamknięta lub w tle)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Otrzymano wiadomość w tle ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/pwa-icon-192.png',
    badge: '/images/notification-badge.png',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Obsługa kliknięcia w powiadomienie
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Kliknięto powiadomienie: ', event.notification.tag);
  
  // Zamknij powiadomienie
  event.notification.close();

  // Sprawdź dane powiadomienia i przekieruj użytkownika
  let clickAction = '/';
  if (event.notification.data && event.notification.data.url) {
    clickAction = event.notification.data.url;
  }

  // Otwórz lub skupić istniejące okno
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // Sprawdź, czy już mamy otwarte okno i przekieruj do niego
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url.indexOf(clickAction) >= 0 && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Jeśli nie ma otwartego okna, otwórz nowe
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    })
  );
});
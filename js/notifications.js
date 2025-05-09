// Obsługa powiadomień push - notifications.js

// Funkcja inicjująca Firebase
function initializeFirebase() {
  // Zastąp tymi danymi które otrzymałeś z Firebase - używam Twoich rzeczywistych danych
  const firebaseConfig = {
    apiKey: "AIzaSyDSJAJwDhxhEpoClhnOtwKiplee-q5VLLs",
    authDomain: "journey-snap-pwa.firebaseapp.com",
    projectId: "journey-snap-pwa",
    storageBucket: "journey-snap-pwa.firebasestorage.app",
    messagingSenderId: "923491205070",
    appId: "1:923491205070:web:3f2960a502cebd14e7359f",
    measurementId: "G-D9JHF6YEMC"
  };

  // Sprawdź czy Firebase już nie jest zainicjalizowany
  if (!firebase.apps || !firebase.apps.length) {
    // Inicjalizacja Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase zainicjalizowany");
  } else {
    console.log("Firebase już jest zainicjalizowany");
  }
  
  // Sprawdź, czy przeglądarka obsługuje powiadomienia
  if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
    console.log("Przeglądarka obsługuje powiadomienia push");
    initializePushNotifications();
  } else {
    console.log('Powiadomienia push nie są obsługiwane przez tę przeglądarkę');
    
    // Opcjonalnie: powiadom użytkownika
    const notificationSection = document.querySelector('.notifications-section');
    if (notificationSection) {
      const notificationInfo = document.createElement('div');
      notificationInfo.className = 'notification-info';
      notificationInfo.innerHTML = `
        <p><small>Twoja przeglądarka nie obsługuje powiadomień push. Zaktualizuj przeglądarkę, aby korzystać z tej funkcji.</small></p>
      `;
      notificationSection.querySelector('.container').appendChild(notificationInfo);
      
      // Wyłącz przycisk
      const button = document.getElementById('notification-button');
      if (button) {
        button.disabled = true;
        button.textContent = "Powiadomienia niedostępne";
      }
    }
  }
}

// Funkcja inicjalizująca powiadomienia push
function initializePushNotifications() {
  console.log("Inicjalizacja powiadomień push");
  
  try {
    const messaging = firebase.messaging();
    console.log("Firebase Messaging dostępny");
    
    // Sprawdź, czy użytkownik jest już zapisany
    messaging.getToken({vapidKey: "BPFHnRRUMnrD0YZkiDPluW2H88-Ov9RcDMaXpj0-3gKDLpP-B0UMKnzCiOJrJ3q7i42U5fblWYRsf8x3Fw8Ug68"}).then(currentToken => {
      if (currentToken) {
        console.log('Użytkownik jest już zapisany do powiadomień:', currentToken);
        updateSubscriptionButton(true);
        // Tutaj możesz wysłać token do swojego serwera
        saveTokenToDatabase(currentToken);
      } else {
        console.log('Użytkownik nie jest zapisany do powiadomień');
        updateSubscriptionButton(false);
      }
    }).catch(err => {
      console.error('Wystąpił błąd podczas pobierania tokenu: ', err);
      updateSubscriptionButton(false);
    });
    
    // Dodaj obsługę kliknięcia przycisku
    const button = document.getElementById('notification-button');
    if (button) {
      button.addEventListener('click', togglePushNotifications);
    }
    
    // Nasłuchuj wiadomości, gdy aplikacja jest otwarta
    messaging.onMessage(payload => {
      console.log('Wiadomość otrzymana: ', payload);
      
      // Wyświetl powiadomienie na stronie
      showInAppNotification(payload.notification.title, payload.notification.body);
    });
  } catch (error) {
    console.error("Błąd podczas inicjalizacji powiadomień:", error);
  }
}

// Funkcja do aktualizacji stanu przycisku
function updateSubscriptionButton(isSubscribed) {
  const button = document.getElementById('notification-button');
  if (!button) return;
  
  if (isSubscribed) {
    button.textContent = 'Wypisz się z powiadomień';
    button.classList.remove('primary-btn');
    button.classList.add('secondary-btn');
  } else {
    button.textContent = 'Zapisz się do powiadomień';
    button.classList.remove('secondary-btn');
    button.classList.add('primary-btn');
  }
}

// Funkcja przełączająca zapis/wypis do powiadomień
function togglePushNotifications() {
  console.log("Przełączanie powiadomień push");
  
  try {
    const messaging = firebase.messaging();
    
    Notification.requestPermission().then(permission => {
      console.log("Uprawnienia:", permission);
      
      if (permission === 'granted') {
        console.log('Pozwolenie na powiadomienia zostało udzielone');
        
        messaging.getToken({vapidKey: "BPFHnRRUMnrD0YZkiDPluW2H88-Ov9RcDMaXpj0-3gKDLpP-B0UMKnzCiOJrJ3q7i42U5fblWYRsf8x3Fw8Ug68"}).then(currentToken => {
          if (currentToken) {
            // Użytkownik jest już zapisany, więc go wypisujemy
            messaging.deleteToken(currentToken).then(() => {
              console.log('Token został usunięty');
              updateSubscriptionButton(false);
              removeTokenFromDatabase(currentToken);
              showInAppNotification('Wypisano z powiadomień', 'Nie będziesz już otrzymywać powiadomień z Journey Snap.');
            }).catch(err => {
              console.error('Nie udało się usunąć tokenu: ', err);
            });
          } else {
            // Użytkownik nie jest zapisany, więc go zapisujemy
            messaging.getToken({vapidKey: "BPFHnRRUMnrD0YZkiDPluW2H88-Ov9RcDMaXpj0-3gKDLpP-B0UMKnzCiOJrJ3q7i42U5fblWYRsf8x3Fw8Ug68"}).then(newToken => {
              console.log('Nowy token: ', newToken);
              updateSubscriptionButton(true);
              saveTokenToDatabase(newToken);
              showInAppNotification('Zapisano do powiadomień', 'Dziękujemy za zapisanie się do powiadomień. Będziemy informować Cię o nowych destynacjach i inspiracjach podróżniczych.');
            }).catch(err => {
              console.error('Nie udało się uzyskać tokenu: ', err);
            });
          }
        }).catch(err => {
          console.error('Wystąpił błąd podczas pobierania tokenu: ', err);
        });
      } else {
        console.log('Nie udzielono pozwolenia na powiadomienia');
        showInAppNotification('Brak uprawnień', 'Musisz zezwolić na powiadomienia w ustawieniach przeglądarki.');
      }
    });
  } catch (error) {
    console.error("Błąd podczas przełączania powiadomień:", error);
  }
}

// Funkcja zapisująca token do bazy danych (w prawdziwej aplikacji wysyłałaby token do serwera)
function saveTokenToDatabase(token) {
  console.log('Token zapisany: ', token);
  
  // W prawdziwej aplikacji wysłałbyś token do serwera
  // Na potrzeby demo zapisujemy tylko w localStorage
  localStorage.setItem('fcmToken', token);
  
  // Dodatkowo, dla celów demonstracyjnych, po 5 sekundach wysyłamy lokalne powiadomienie testowe
  setTimeout(() => {
    showInAppNotification('Witaj w Journey Snap!', 'Dziękujemy za zapisanie się do powiadomień. Będziemy informować Cię o nowych destynacjach i inspiracjach podróżniczych.');
  }, 5000);
}

// Funkcja usuwająca token z bazy danych
function removeTokenFromDatabase(token) {
  console.log('Token usunięty: ', token);
  
  // W prawdziwej aplikacji usunąłbyś token z serwera
  localStorage.removeItem('fcmToken');
}

// Funkcja wyświetlająca powiadomienie w aplikacji
function showInAppNotification(title, body) {
  console.log("Pokazuję powiadomienie w aplikacji:", title, body);
  const notification = document.createElement('div');
  notification.className = 'in-app-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <h4>${title}</h4>
      <p>${body}</p>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Dodaj style dla powiadomienia
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .in-app-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 350px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow: hidden;
        animation: slideIn 0.3s ease-out;
      }
      
      .notification-content {
        padding: 15px;
        position: relative;
        border-left: 4px solid var(--primary-color);
      }
      
      .notification-content h4 {
        margin: 0 0 5px 0;
        color: var(--primary-color);
      }
      
      .notification-content p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }
      
      .notification-close {
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #999;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Dodaj obsługę zamknięcia
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  });
  
  // Automatycznie ukryj po 5 sekundach
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded - Inicjalizacja powiadomień");
  setTimeout(initializeFirebase, 1000); // Daj przeglądarce czas na załadowanie skryptów Firebase
});
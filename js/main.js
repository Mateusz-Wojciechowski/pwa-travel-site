window.onload = () => {
  'use strict';
  
  // Rejestracja Service Worker'a
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker registered successfully.'))
      .catch((error) => console.error('Service Worker registration failed:', error));
  }
  
  // Wykrywanie stanu offline
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  function updateOnlineStatus() {
    const statusElement = document.createElement('div');
    statusElement.className = 'status-notification';
    statusElement.textContent = navigator.onLine 
      ? '🟢 You are back online' 
      : '🔴 You are offline. App is working from cache';
    
    document.body.appendChild(statusElement);
    
    setTimeout(() => {
      statusElement.classList.add('show');
      
      setTimeout(() => {
        statusElement.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(statusElement);
        }, 500);
      }, 3000);
    }, 100);
  }
  
  // Sprawdzanie czy aplikacja działa w trybie standalone (zainstalowana)
  const isInStandaloneMode = () => 
    (window.matchMedia('(display-mode: standalone)').matches) || 
    (window.navigator.standalone) || 
    document.referrer.includes('android-app://');
  
  if (isInStandaloneMode()) {
    console.log('Application is running in standalone mode');
  } else {
    // Pokaż podpowiedź o instalacji po 3 sekundach od załadowania
    setTimeout(() => {
      if (!localStorage.getItem('installPromptShown')) {
        const installPrompt = document.createElement('div');
        installPrompt.className = 'install-prompt';
        installPrompt.innerHTML = `
          <div class="install-prompt-content">
            <h3>Add to Home Screen</h3>
            <p>Install Journey Snap for offline access!</p>
            <div class="install-prompt-actions">
              <button class="btn secondary-btn" id="later-btn">Later</button>
              <button class="btn primary-btn" id="install-info-btn">How to install</button>
            </div>
            <button class="install-prompt-close" id="close-prompt">&times;</button>
          </div>
        `;
        
        document.body.appendChild(installPrompt);
        
        setTimeout(() => {
          installPrompt.classList.add('show');
        }, 100);
        
        document.getElementById('later-btn').addEventListener('click', () => {
          installPrompt.classList.remove('show');
          setTimeout(() => {
            document.body.removeChild(installPrompt);
          }, 500);
        });
        
        document.getElementById('close-prompt').addEventListener('click', () => {
          installPrompt.classList.remove('show');
          setTimeout(() => {
            document.body.removeChild(installPrompt);
          }, 500);
          localStorage.setItem('installPromptShown', 'true');
        });
        
        document.getElementById('install-info-btn').addEventListener('click', () => {
          const userAgent = navigator.userAgent.toLowerCase();
          let installInstructions;
          
          if (userAgent.indexOf('firefox') > -1) {
            installInstructions = 'To install, tap on the menu (three dots) in the upper-right corner and select "Install App".';
          } else if (userAgent.indexOf('edge') > -1) {
            installInstructions = 'To install, tap on the menu (three dots) in the upper-right corner and select "Install App".';
          } else if (userAgent.indexOf('chrome') > -1) {
            installInstructions = 'To install, tap on the menu (three dots) in the upper-right corner and select "Install App".';
          } else if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('mobile') > -1) {
            installInstructions = 'To install, tap the Share button (rectangle with arrow) at the bottom of the screen, then select "Add to Home Screen".';
          } else {
            installInstructions = 'To install, check your browser\'s menu for an "Add to Home Screen" or "Install" option.';
          }
          
          alert(installInstructions);
        });
      }
    }, 3000);
  }
  
  // Dodaj style dla powiadomień
  const style = document.createElement('style');
  style.textContent = `
    .status-notification {
      position: fixed;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: top 0.5s ease;
    }
    
    .status-notification.show {
      top: 20px;
    }
    
    .install-prompt {
      position: fixed;
      bottom: -200px;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.7);
      padding: 20px;
      z-index: 1000;
      transition: bottom 0.5s ease;
    }
    
    .install-prompt.show {
      bottom: 70px;
    }
    
    .install-prompt-content {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      position: relative;
    }
    
    .install-prompt-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 15px;
    }
    
    .install-prompt-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #777;
    }
  `;
  
  document.head.appendChild(style);
};
document.addEventListener('DOMContentLoaded', () => {
    // Renderowanie galerii
    renderGallery();
    
    // Obsługa formularza wspomnień
    setupMemoryForm();
    
    // Ładowanie zapisanych wspomnień
    loadMemories();
  });
  
  // Funkcja renderowania galerii
  function renderGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;
    
    // Dane zdjęć do galerii
    const galleryImages = [
      { src: '../images/gallery/gallery1.jpg', alt: 'Mountain landscape' },
      { src: '../images/gallery/gallery2.jpg', alt: 'Tropical beach' },
      { src: '../images/gallery/gallery3.jpg', alt: 'Ancient temple' },
      { src: '../images/gallery/gallery4.jpg', alt: 'Desert sunset' },
      { src: '../images/gallery/gallery5.jpg', alt: 'European street café' },
      { src: '../images/gallery/gallery6.jpg', alt: 'African safari' },

      { src: '../images/destinations/paris.jpg', alt: 'Eiffel Tower in Paris' },
      { src: '../images/destinations/tokyo.jpg', alt: 'Tokyo cityscape' },
      { src: '../images/destinations/bali.jpg', alt: 'Rice terraces in Bali' },
      { src: '../images/destinations/santorini.jpg', alt: 'White buildings in Santorini' },
      { src: '../images/destinations/newyork.jpg', alt: 'New York skyline' },
      { src: '../images/destinations/rio.jpg', alt: 'Rio de Janeiro beach' }
    ];
    
    galleryImages.forEach((image, index) => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.style.animationDelay = `${index * 0.1}s`;
      
      galleryItem.innerHTML = `
        <img src="${image.src}" alt="${image.alt}" class="gallery-img">
      `;
      
      galleryContainer.appendChild(galleryItem);
    });
  }
  
  // Obsługa formularza wspomnień
  function setupMemoryForm() {
    const memoryForm = document.getElementById('memory-form');
    if (!memoryForm) return;
    
    memoryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const location = document.getElementById('location').value;
      const date = document.getElementById('date').value;
      const notes = document.getElementById('notes').value;
      const photoInput = document.getElementById('photo');
      
      // Przetwarzanie zdjęcia (jeśli zostało wybrane)
      let photoDataUrl = null;
      
      if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
          photoDataUrl = event.target.result;
          saveMemory(location, date, notes, photoDataUrl);
        };
        
        reader.readAsDataURL(photoInput.files[0]);
      } else {
        saveMemory(location, date, notes, photoDataUrl);
      }
    });
  }
  
  // Zapisywanie wspomnień
  function saveMemory(location, date, notes, photoDataUrl) {
    let memories = [];
    
    // Pobierz istniejące wspomnienia z localStorage
    const savedMemories = localStorage.getItem('travelMemories');
    if (savedMemories) {
      memories = JSON.parse(savedMemories);
    }
    
    // Dodaj nowe wspomnienie
    const newMemory = {
      id: Date.now(),
      location,
      date,
      notes,
      photo: photoDataUrl,
      createdAt: new Date().toISOString()
    };
    
    memories.push(newMemory);
    
    // Zapisz zaktualizowaną listę wspomnień
    localStorage.setItem('travelMemories', JSON.stringify(memories));
    
    // Zresetuj formularz
    document.getElementById('memory-form').reset();
    
    // Odśwież listę wspomnień
    loadMemories();
    
    // Pokaż powiadomienie o sukcesie
    showNotification('Memory saved successfully!');
  }
  
  // Ładowanie wspomnień z localStorage
  function loadMemories() {
    const memoriesContainer = document.getElementById('memories-container');
    const emptyMessage = document.getElementById('empty-memories-message');
    
    if (!memoriesContainer) return;
    
    // Pobierz zapisane wspomnienia
    const savedMemories = localStorage.getItem('travelMemories');
    let memories = [];
    
    if (savedMemories) {
      memories = JSON.parse(savedMemories);
    }
    
    // Wyczyść kontener (zachowaj wiadomość o pustej liście)
    while (memoriesContainer.firstChild) {
      if (memoriesContainer.firstChild === emptyMessage) {
        break;
      }
      memoriesContainer.removeChild(memoriesContainer.firstChild);
    }
    
    // Pokaż lub ukryj wiadomość o pustej liście
    if (memories.length === 0) {
      if (emptyMessage) {
        emptyMessage.style.display = 'block';
      }
      return;
    } else {
      if (emptyMessage) {
        emptyMessage.style.display = 'none';
      }
    }
    
    // Sortuj wspomnienia od najnowszych
    memories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Renderuj wspomnienia
    memories.forEach(memory => {
      const memoryCard = document.createElement('div');
      memoryCard.className = 'memory-card';
      memoryCard.dataset.id = memory.id;
      
      // Formatuj datę
      const formattedDate = new Date(memory.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Stwórz HTML dla karty wspomnienia
      let memoryHTML = `
        <div class="memory-date">${formattedDate}</div>
        <div class="memory-location">${memory.location}</div>
        <div class="memory-notes">${memory.notes}</div>
      `;
      
      // Dodaj zdjęcie, jeśli istnieje
      if (memory.photo) {
        memoryHTML += `<img src="${memory.photo}" alt="Memory from ${memory.location}" class="memory-img">`;
      }
      
      // Dodaj przyciski do edycji/usuwania
      memoryHTML += `
        <div class="memory-actions">
          <button class="btn secondary-btn delete-memory" data-id="${memory.id}">Delete</button>
        </div>
      `;
      
      memoryCard.innerHTML = memoryHTML;
      memoriesContainer.appendChild(memoryCard);
      
      // Dodaj obsługę usuwania
      memoryCard.querySelector('.delete-memory').addEventListener('click', function() {
        deleteMemory(memory.id);
      });
    });
  }
  
  // Funkcja usuwania wspomnienia
  function deleteMemory(id) {
    if (confirm('Are you sure you want to delete this memory?')) {
      // Pobierz zapisane wspomnienia
      const savedMemories = localStorage.getItem('travelMemories');
      if (!savedMemories) return;
      
      let memories = JSON.parse(savedMemories);
      
      // Znajdź i usuń wspomnienie
      memories = memories.filter(memory => memory.id !== id);
      
      // Zapisz zaktualizowaną listę
      localStorage.setItem('travelMemories', JSON.stringify(memories));
      
      // Odśwież listę wspomnień
      loadMemories();
      
      // Pokaż powiadomienie
      showNotification('Memory deleted!');
    }
  }
  
  // Funkcja wyświetlania powiadomień
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'status-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 3000);
    }, 100);
  }
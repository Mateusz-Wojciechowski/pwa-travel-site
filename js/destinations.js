// Dane miejsc podróży
const destinationsData = [
    {
      id: 1,
      name: 'Paris, France',
      description: 'The City of Light is known for its stunning architecture, art museums like the Louvre, and iconic monuments like the Eiffel Tower.',
      image: '../images/destinations/paris.jpg',
      bestTime: 'April to June, September to October',
      rating: 4.7
    },
    {
      id: 2,
      name: 'Tokyo, Japan',
      description: 'A fascinating blend of the ultramodern and traditional, Tokyo offers visitors high-tech sights, historical temples, and amazing food.',
      image: '../images/destinations/tokyo.jpg',
      bestTime: 'March to May, September to November',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Bali, Indonesia',
      description: 'Known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites and vibrant arts.',
      image: '../images/destinations/bali.jpg',
      bestTime: 'April to October',
      rating: 4.6
    },
    {
      id: 4,
      name: 'Santorini, Greece',
      description: 'Famous for its dramatic views, stunning sunsets, white-washed houses, and vibrant blue domes that contrast against the azure sea.',
      image: '../images/destinations/santorini.jpg',
      bestTime: 'April to May, September to October',
      rating: 4.9
    },
    {
      id: 5,
      name: 'New York City, USA',
      description: 'The Big Apple is known for its towering skyscrapers, Broadway shows, cultural diversity, and amazing food scene.',
      image: '../images/destinations/newyork.jpg',
      bestTime: 'April to June, September to November',
      rating: 4.6
    },
    {
      id: 6,
      name: 'Rio de Janeiro, Brazil',
      description: 'Famous for its spectacular natural setting, carnival celebrations, samba music, and vibrant beach culture.',
      image: '../images/destinations/rio.jpg',
      bestTime: 'December to March',
      rating: 4.5
    }
  ];
  
  // Funkcja do renderowania miejsc podróży
  function renderDestinations() {
    const container = document.getElementById('destinations-container');
    if (!container) return;
    
    destinationsData.forEach(destination => {
      const destinationCard = document.createElement('div');
      destinationCard.className = 'destination-card';
      
      destinationCard.innerHTML = `
        <img src="${destination.image}" alt="${destination.name}" class="destination-img">
        <div class="destination-info">
          <h3>${destination.name}</h3>
          <p>${destination.description}</p>
          <div class="destination-meta">
            <span>Best time: ${destination.bestTime}</span>
            <span>⭐ ${destination.rating}</span>
          </div>
        </div>
      `;
      
      container.appendChild(destinationCard);
    });
  }
  
  // Wywołaj funkcję renderowania po załadowaniu strony
  document.addEventListener('DOMContentLoaded', renderDestinations);
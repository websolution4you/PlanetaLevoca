// Google Reviews Loader
// Pre načítanie skutočných recenzií z Google Places API pomocou Maps JavaScript API
// Toto riešenie používa Maps JavaScript API, ktoré nevyžaduje CORS

const GOOGLE_API_KEY = 'AIzaSyAFrSBwbwPvnYBL-Q2GqU0UkxkJaeM_Z54'; // Google Maps API kľúč
const PLACE_SEARCH_QUERY = 'Planeta Levoča, Námestie Majstra Pavla 26, Levoča'; // Názov a adresa pre vyhľadávanie

let googleMapsLoaded = false;
let placesService = null;

// Funkcia na vytvorenie hviezdičiek
function createStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fa fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHtml += '<i class="fa fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="fa fa-star" style="opacity: 0.3;"></i>';
    }
    return starsHtml;
}

// Funkcia na získanie iniciálov z mena
function getInitials(name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Funkcia na načítanie Google Maps JavaScript API
function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps && window.google.maps.places) {
            googleMapsLoaded = true;
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;
        
        window.initGoogleMaps = function() {
            googleMapsLoaded = true;
            // Vytvoriť dummy map pre PlacesService
            const dummyMap = new google.maps.Map(document.createElement('div'));
            placesService = new google.maps.places.PlacesService(dummyMap);
            resolve();
        };
        
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Funkcia na nájdenie Place ID pomocou PlacesService
function findPlaceId() {
    return new Promise((resolve, reject) => {
        if (!placesService) {
            reject('PlacesService nie je inicializovaný');
            return;
        }

        const request = {
            query: PLACE_SEARCH_QUERY
        };

        placesService.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                const place = results[0];
                console.log('Nájdené miesto:', place.name, '- Place ID:', place.place_id);
                resolve(place.place_id);
            } else {
                console.error('Miesto sa nenašlo:', status);
                reject(status);
            }
        });
    });
}

// Funkcia na načítanie recenzií z Google Places API
function loadPlaceDetails(placeId) {
    return new Promise((resolve, reject) => {
        if (!placesService) {
            reject('PlacesService nie je inicializovaný');
            return;
        }

        const request = {
            placeId: placeId,
            fields: ['name', 'rating', 'reviews']
        };

        placesService.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place && place.reviews) {
                resolve(place.reviews);
            } else {
                console.error('Chyba pri načítaní recenzií:', status);
                reject(status);
            }
        });
    });
}

// Funkcia na zobrazenie recenzií v carousel
function displayReviews(reviews) {
    const carousel = document.querySelector('.testimonial-carousel');
    
    if (!carousel) {
        console.error('Carousel element sa nenašiel');
        return;
    }

    // Zobraziť prvých 5 recenzií
    const reviewsToShow = reviews.slice(0, 5);
    carousel.innerHTML = '';
    
    reviewsToShow.forEach(review => {
        const reviewHtml = `
            <div class="testimonial-item bg-transparent border rounded p-4">
                <div class="d-flex align-items-center mb-3">
                    <div class="text-warning">
                        ${createStars(review.rating)}
                    </div>
                </div>
                <i class="fa fa-quote-left fa-2x text-primary mb-3"></i>
                <p>${review.text}</p>
                <div class="d-flex align-items-center">
                    <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                        <span class="text-white fw-bold">${getInitials(review.author_name)}</span>
                    </div>
                    <div class="ps-3">
                        <h5 class="mb-1">${review.author_name}</h5>
                        <small><i class="fab fa-google me-1"></i>Google Recenzia</small>
                    </div>
                </div>
            </div>
        `;
        carousel.innerHTML += reviewHtml;
    });
    
    // Reinicializovať carousel po načítaní recenzií
    if (typeof $ !== 'undefined' && $.fn.owlCarousel) {
        $('.testimonial-carousel').owlCarousel({
            items: 1,
            loop: true,
            margin: 30,
            nav: false,
            dots: true,
            autoplay: true,
            autoplayTimeout: 5000,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                992: { items: 3 }
            }
        });
    }
}

// Hlavná funkcia na načítanie recenzií
async function loadGoogleReviews() {
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_API_KEY') {
        console.log('Google Maps API kľúč nie je nakonfigurovaný. Zobrazujú sa príklady recenzií.');
        return;
    }

    try {
        // Načítať Google Maps API
        console.log('Načítavam Google Maps API...');
        await loadGoogleMapsAPI();
        
        // Nájsť Place ID
        console.log('Hľadám Place ID pre:', PLACE_SEARCH_QUERY);
        const placeId = await findPlaceId();
        
        // Načítať detaily miesta s recenziami
        console.log('Načítavam recenzie pre Place ID:', placeId);
        const reviews = await loadPlaceDetails(placeId);
        
        // Zobraziť recenzie
        displayReviews(reviews);
        console.log('Recenzie úspešne načítané a zobrazené');
        
    } catch (error) {
        console.error('Chyba pri načítaní Google recenzií:', error);
        console.log('Zobrazujú sa príklady recenzií.');
    }
}

// Načítať recenzie po načítaní stránky
document.addEventListener('DOMContentLoaded', function() {
    loadGoogleReviews();
});


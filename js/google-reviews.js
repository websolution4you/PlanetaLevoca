// Google Reviews Loader
// Pre načítanie skutočných recenzií z Google Places API
// Potrebujete Google Places API kľúč a Place ID

const GOOGLE_PLACE_ID = 'ChIJ...'; // Nahraďte Place ID pre Planeta Levoča
const GOOGLE_API_KEY = 'AIzaSyAFrSBwbwPvnYBL-Q2GqU0UkxkJaeM_Z54'; // Google Places API kľúč

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

// Funkcia na načítanie recenzií z Google Places API
async function loadGoogleReviews() {
    if (!GOOGLE_PLACE_ID || GOOGLE_PLACE_ID === 'ChIJ...' || !GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_API_KEY') {
        console.log('Google Places API nie je nakonfigurovaný. Zobrazujú sa príklady recenzií.');
        return;
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,reviews&key=${GOOGLE_API_KEY}`
        );
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.result && data.result.reviews) {
            const reviews = data.result.reviews.slice(0, 5); // Zobrazíme prvých 5 recenzií
            const carousel = document.querySelector('.testimonial-carousel');
            
            if (carousel) {
                carousel.innerHTML = '';
                
                reviews.forEach(review => {
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
        }
    } catch (error) {
        console.error('Chyba pri načítaní Google recenzií:', error);
    }
}

// Načítať recenzie po načítaní stránky
document.addEventListener('DOMContentLoaded', function() {
    loadGoogleReviews();
});


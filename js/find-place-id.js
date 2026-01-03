// Pomocný skript na nájdenie Place ID pre Planeta Levoča
// Spustite tento kód v konzole prehliadača (F12) na stránke s Google Maps API

const API_KEY = 'AIzaSyAFrSBwbwPvnYBL-Q2GqU0UkxkJaeM_Z54';

// Funkcia na nájdenie Place ID podľa názvu a adresy
async function findPlaceId() {
    const query = 'Planeta Levoča, Námestie Majstra Pavla 26, Levoča';
    
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`
        );
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            const place = data.results[0];
            console.log('Nájdené miesto:', place.name);
            console.log('Place ID:', place.place_id);
            console.log('Adresa:', place.formatted_address);
            return place.place_id;
        } else {
            console.error('Miesto sa nenašlo:', data.status);
            return null;
        }
    } catch (error) {
        console.error('Chyba pri vyhľadávaní:', error);
        return null;
    }
}

// Spustiť vyhľadávanie
findPlaceId();



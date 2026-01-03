// Daily Menu Loader
let menuData = null;
let currentView = 'today'; // 'today' alebo 'week'

document.addEventListener('DOMContentLoaded', function() {
    const dayNames = {
        'pondelok': { name: 'Pondelok', icon: 'fa-calendar-day', short: 'Pon' },
        'utorok': { name: 'Utorok', icon: 'fa-calendar-day', short: 'Uto' },
        'streda': { name: 'Streda', icon: 'fa-calendar-day', short: 'Str' },
        'stvrtok': { name: 'Štvrtok', icon: 'fa-calendar-day', short: 'Štv' },
        'piatok': { name: 'Piatok', icon: 'fa-calendar-day', short: 'Pia' }
    };

    const dayOrder = ['pondelok', 'utorok', 'streda', 'stvrtok', 'piatok'];

    // Zistiť aktuálny deň v týždni
    function getCurrentDayKey() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = nedeľa, 1 = pondelok, ..., 6 = sobota
        
        // Mapovanie dní na naše kľúče
        const dayMap = {
            1: 'pondelok',   // Pondelok
            2: 'utorok',     // Utorok
            3: 'streda',     // Streda
            4: 'stvrtok',    // Štvrtok
            5: 'piatok'      // Piatok
        };
        
        // Ak je víkend (0 = nedeľa, 6 = sobota), zobrazíme piatok
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return 'piatok';
        }
        
        return dayMap[dayOfWeek] || 'pondelok'; // Fallback na pondelok
    }

    const currentDayKey = getCurrentDayKey();

    // Načítať menu (z Google Sheets ak je nakonfigurované, inak z JSON)
    let loadMenuPromise;
    
    if (typeof GOOGLE_SHEETS_CONFIG !== 'undefined' && GOOGLE_SHEETS_CONFIG.enabled && GOOGLE_SHEETS_CONFIG.apiKey && GOOGLE_SHEETS_CONFIG.spreadsheetId) {
        // Načítať z Google Sheets
        loadMenuPromise = loadFromGoogleSheets();
    } else {
        // Načítať z JSON (fallback)
        loadMenuPromise = fetch('data/daily-menu.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nepodarilo sa načítať denné menu');
                }
                return response.json();
            });
    }
    
    loadMenuPromise
        .then(data => {
            // Ak sú dáta z Google Sheets (majú property 'values'), konvertovať
            if (data.values) {
                // TODO: Implementovať konverziu z Google Sheets
                // Pre teraz použijeme JSON fallback
                return fetch('data/daily-menu.json').then(r => r.json());
            }
            return data;
        })
        .then(data => {
            // Ak sú dáta z Google Sheets, konvertovať na správny formát
            if (typeof GOOGLE_SHEETS_CONFIG !== 'undefined' && GOOGLE_SHEETS_CONFIG.enabled) {
                data = convertSheetsDataToMenuFormat(data);
            }
            // Aktualizovať informácie o týždni a cene - zlúčiť do jedného riadku
            const weekPriceInfo = document.getElementById('weekPriceInfo');
            if (weekPriceInfo) {
                let infoText = '';
                if (data.week) {
                    infoText = data.week;
                }
                if (data.price) {
                    if (infoText) {
                        infoText += ' | ';
                    }
                    infoText += 'Cena: ' + data.price;
                }
                weekPriceInfo.textContent = infoText || 'Načítavam...';
            }
            
            // Zobraziť aktuálny dátum a deň
            const today = new Date();
            const dayOfWeek = today.getDay();
            const currentDateInfo = document.getElementById('currentDateInfo');
            
            if (currentDateInfo) {
                const dayNamesSlovak = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
                const monthNamesSlovak = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 
                                         'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];
                
                const dayName = dayNamesSlovak[dayOfWeek];
                const day = today.getDate();
                const month = monthNamesSlovak[today.getMonth()];
                const year = today.getFullYear();
                
                currentDateInfo.textContent = `Dnes: ${dayName}, ${day}. ${month} ${year}`;
            }
            
            // Zobraziť víkendovú správu ak je víkend
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                const weekendInfo = document.getElementById('weekendInfo');
                if (weekendInfo) {
                    weekendInfo.style.display = 'block';
                }
            }
            
            // Uložiť dáta globálne pre prepínanie
            menuData = data;

            // Vytvoriť obsah pre dni (bez tabov)
            const contentContainer = document.getElementById('dayContent');

            dayOrder.forEach((dayKey, index) => {
                const day = dayNames[dayKey];
                const dayData = data.days[dayKey];

                if (!dayData) return;

                // Vytvoriť obsah pre deň
                const dayContainer = document.createElement('div');
                dayContainer.id = `day-${dayKey}`;
                dayContainer.className = `day-container ${dayKey === currentDayKey ? 'active' : ''}`;
                
                // Pridať nadpis dňa pre režim "Celý týždeň"
                let menuHTML = `<div class="day-header mb-4" style="display: none;">
                    <h4 class="text-primary mb-3"><i class="fa fa-calendar-day me-2"></i>${day.name}</h4>
                    <hr class="mb-4">
                </div>`;
                menuHTML += '<div class="row g-4">';

                // Polievka
                if (dayData.polievka) {
                    const portionText = dayData.polievka.portion ? ` (${dayData.polievka.portion})` : '';
                    // Zobraziť cenu len ak nie je "V cene"
                    const priceDisplay = dayData.polievka.price && dayData.polievka.price !== 'V cene' 
                        ? `<span class="text-primary ms-3 flex-shrink-0" style="white-space: nowrap;">${dayData.polievka.price}</span>` 
                        : '';
                    menuHTML += `
                        <div class="col-lg-6">
                            <div class="d-flex align-items-center">
                                <div class="w-100 d-flex flex-column text-start">
                                    <h5 class="d-flex justify-content-between align-items-center border-bottom pb-2">
                                        <span class="flex-grow-1">${dayData.polievka.name}${portionText}</span>
                                        ${priceDisplay}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    `;
                }

                // Menu 1, 2, 3
                ['menu1', 'menu2', 'menu3'].forEach(menuKey => {
                    if (dayData[menuKey]) {
                        const menu = dayData[menuKey];
                        // Zobraziť cenu len ak nie je "V cene"
                        const priceDisplay = menu.price && menu.price !== 'V cene' 
                            ? `<span class="text-primary ms-3 flex-shrink-0" style="white-space: nowrap;">${menu.price}</span>` 
                            : '';
                        menuHTML += `
                            <div class="col-lg-6">
                                <div class="d-flex align-items-center">
                                    <div class="w-100 d-flex flex-column text-start">
                                        <h5 class="d-flex justify-content-between align-items-center border-bottom pb-2">
                                            <span class="flex-grow-1">${menu.name}</span>
                                            ${priceDisplay}
                                        </h5>
                                        <small class="fst-italic">${menu.description || ''}</small>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                });

                menuHTML += '</div>';
                dayContainer.innerHTML = menuHTML;
                
                // Skryť/zobraziť podľa aktuálneho dňa
                if (dayKey !== currentDayKey) {
                    dayContainer.style.display = 'none';
                }
                
                contentContainer.appendChild(dayContainer);
            });
        })
        .catch(error => {
            console.error('Chyba pri načítaní denného menu:', error);
            const weekPriceInfo = document.getElementById('weekPriceInfo');
            if (weekPriceInfo) {
                weekPriceInfo.textContent = 'Chyba pri načítaní menu';
            }
            document.getElementById('dayContent').innerHTML = '<p class="text-danger">Nepodarilo sa načítať denné menu. Skontrolujte, či existuje súbor data/daily-menu.json</p>';
        });
});

// Globálna funkcia na získanie aktuálneho dňa
function getCurrentDayKey() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    const dayMap = {
        1: 'pondelok',
        2: 'utorok',
        3: 'streda',
        4: 'stvrtok',
        5: 'piatok'
    };
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return 'piatok';
    }
    
    return dayMap[dayOfWeek] || 'pondelok';
}

// Funkcia na prepínanie medzi režimami
function switchView(view) {
    currentView = view;
    
    // Aktualizovať tlačidlá
    document.getElementById('btnToday').classList.toggle('active', view === 'today');
    document.getElementById('btnWeek').classList.toggle('active', view === 'week');
    
    const currentDayKey = getCurrentDayKey();
    
    if (view === 'today') {
        // Zobraziť len aktuálny deň
        document.querySelectorAll('.day-container').forEach(container => {
            if (container.id === `day-${currentDayKey}`) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
        
        // Skryť nadpisy dní
        document.querySelectorAll('.day-header').forEach(header => {
            header.style.display = 'none';
        });
    } else {
        // Zobraziť celý týždeň - zobraziť všetky dni naraz
        document.querySelectorAll('.day-container').forEach(container => {
            container.style.display = 'block';
        });
        
        // Zobraziť nadpisy dní
        document.querySelectorAll('.day-header').forEach(header => {
            header.style.display = 'block';
        });
    }
}

// Funkcia na načítanie z Google Sheets (ak je nakonfigurované)
function loadFromGoogleSheets() {
    if (typeof GOOGLE_SHEETS_CONFIG === 'undefined' || !GOOGLE_SHEETS_CONFIG.enabled) {
        return Promise.reject(new Error('Google Sheets nie je nakonfigurované'));
    }
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/values/${GOOGLE_SHEETS_CONFIG.range}?key=${GOOGLE_SHEETS_CONFIG.apiKey}`;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Nepodarilo sa načítať z Google Sheets');
            }
            return response.json();
        })
        .then(sheetsData => {
            // Konverzia sa urobí v .then(data => ...)
            return sheetsData;
        });
}

// Funkcia na konverziu Google Sheets dát do formátu menu
function convertSheetsDataToMenuFormat(sheetsData) {
    // TODO: Implementovať konverziu z Google Sheets formátu do JSON formátu
    // Toto bude závisieť od štruktúry vašej Google Sheets tabuľky
    // Pre teraz vrátime fallback - načítame z JSON
    console.warn('Google Sheets konverzia ešte nie je implementovaná, používa sa JSON fallback');
    return fetch('data/daily-menu.json')
        .then(response => response.json());
}


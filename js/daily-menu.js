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

    // Funkcia na formátovanie a zobrazenie aktuálneho dňa a dátumu
    function updateCurrentDayDate() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        
        // Mapovanie dní na slovenské názvy
        const dayNames = {
            0: 'Nedeľa',
            1: 'Pondelok',
            2: 'Utorok',
            3: 'Streda',
            4: 'Štvrtok',
            5: 'Piatok',
            6: 'Sobota'
        };
        
        // Mapovanie mesiacov na slovenské názvy
        const monthNames = {
            0: 'január',
            1: 'február',
            2: 'marec',
            3: 'apríl',
            4: 'máj',
            5: 'jún',
            6: 'júl',
            7: 'august',
            8: 'september',
            9: 'október',
            10: 'november',
            11: 'december'
        };
        
        const dayName = dayNames[dayOfWeek];
        const day = today.getDate();
        const month = monthNames[today.getMonth()];
        const year = today.getFullYear();
        
        const dateString = `${dayName}, ${day}. ${month} ${year}`;
        
        const currentDayDateElement = document.getElementById('currentDayDate');
        if (currentDayDateElement) {
            currentDayDateElement.textContent = dateString;
        }
    }

    // Aktualizovať dátum hneď pri načítaní
    updateCurrentDayDate();

    // Načítať menu (najprv z localStorage, potom z Google Sheets alebo JSON)
    let loadMenuPromise;
    
    // Skontrolovať localStorage najprv
    const savedMenuData = localStorage.getItem('dailyMenuData');
    if (savedMenuData) {
        try {
            const parsedData = JSON.parse(savedMenuData);
            loadMenuPromise = Promise.resolve(parsedData);
        } catch (error) {
            console.error('Chyba pri parsovaní dát z localStorage:', error);
            // Pokračovať s načítaním z iného zdroja
            loadMenuPromise = null;
        }
    }
    
    // Ak nie sú dáta v localStorage, načítať z iného zdroja
    if (!loadMenuPromise) {
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
            
            // Zobraziť víkendovú správu ak je víkend
            const today = new Date();
            const dayOfWeek = today.getDay();
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
                // Pridať väčší rozostup medzi dňami (okrem prvého)
                if (index > 0) {
                    dayContainer.style.marginTop = '7rem';
                }
                
                // Pridať nadpis dňa pre režim "Celý týždeň"
                let menuHTML = `<div class="day-header mb-4" style="display: none;">
                    <h4 class="text-primary mb-3">${day.name}</h4>
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
            
            // Automaticky zobraziť aktuálny deň po načítaní
            switchView('today');
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
                // Zobraziť nadpis pre aktuálny deň
                const header = container.querySelector('.day-header');
                if (header) {
                    header.style.display = 'block';
                }
            } else {
                container.style.display = 'none';
            }
        });
        
        // Skryť nadpisy ostatných dní
        document.querySelectorAll('.day-container').forEach(container => {
            if (container.id !== `day-${currentDayKey}`) {
                const header = container.querySelector('.day-header');
                if (header) {
                    header.style.display = 'none';
                }
            }
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
    if (!sheetsData.values || sheetsData.values.length === 0) {
        throw new Error('Google Sheets neobsahuje dáta');
    }
    
    const rows = sheetsData.values;
    const headerRow = rows[0];
    
    // Nájsť indexy stĺpcov
    const weekIndex = headerRow.indexOf('Týždeň');
    const priceIndex = headerRow.indexOf('Cena');
    const timeIndex = headerRow.indexOf('Čas');
    const dayIndex = headerRow.indexOf('Deň');
    
    // Vytvoriť štruktúru menu
    const menuData = {
        week: '',
        price: '',
        time: '',
        days: {}
    };
    
    // Prejsť všetky riadky (okrem hlavičky)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;
        
        // Získať základné informácie z prvého riadku
        if (i === 1) {
            menuData.week = row[weekIndex] || '';
            menuData.price = row[priceIndex] || '';
            menuData.time = row[timeIndex] || '';
        }
        
        const day = row[dayIndex];
        if (!day) continue;
        
        const dayKey = day.toLowerCase();
        if (!['pondelok', 'utorok', 'streda', 'stvrtok', 'piatok'].includes(dayKey)) continue;
        
        // Nájsť indexy pre polievku a menu
        const polievkaNameIndex = headerRow.indexOf('Polievka - Názov');
        const polievkaPortionIndex = headerRow.indexOf('Polievka - Porcia');
        const polievkaPriceIndex = headerRow.indexOf('Polievka - Cena');
        
        if (!menuData.days[dayKey]) {
            menuData.days[dayKey] = {
                polievka: {
                    name: row[polievkaNameIndex] || '',
                    portion: row[polievkaPortionIndex] || '',
                    price: row[polievkaPriceIndex] || 'V cene'
                },
                menu1: {
                    name: row[headerRow.indexOf('Menu 1 - Názov')] || '',
                    description: row[headerRow.indexOf('Menu 1 - Popis')] || '',
                    price: row[headerRow.indexOf('Menu 1 - Cena')] || 'V cene'
                },
                menu2: {
                    name: row[headerRow.indexOf('Menu 2 - Názov')] || '',
                    description: row[headerRow.indexOf('Menu 2 - Popis')] || '',
                    price: row[headerRow.indexOf('Menu 2 - Cena')] || 'V cene'
                },
                menu3: {
                    name: row[headerRow.indexOf('Menu 3 - Názov')] || '',
                    description: row[headerRow.indexOf('Menu 3 - Popis')] || '',
                    price: row[headerRow.indexOf('Menu 3 - Cena')] || 'V cene'
                }
            };
        }
    }
    
    return menuData;
}


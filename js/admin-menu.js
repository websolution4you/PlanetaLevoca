// Admin Menu Editor
document.addEventListener('DOMContentLoaded', function() {
    const dayNames = {
        'pondelok': 'Pondelok',
        'utorok': 'Utorok',
        'streda': 'Streda',
        'stvrtok': 'Štvrtok',
        'piatok': 'Piatok'
    };

    const dayOrder = ['pondelok', 'utorok', 'streda', 'stvrtok', 'piatok'];

    // Načítať menu z JSON (fallback, neskôr Google Sheets)
    loadMenu();

    // Načítanie menu
    function loadMenu() {
        // Skontrolovať, či je Google Sheets nakonfigurované
        let dataPromise;
        
        if (typeof GOOGLE_SHEETS_CONFIG !== 'undefined' && GOOGLE_SHEETS_CONFIG.enabled && GOOGLE_SHEETS_CONFIG.apiKey && GOOGLE_SHEETS_CONFIG.spreadsheetId) {
            // Načítať z Google Sheets
            dataPromise = loadFromGoogleSheets()
                .then(sheetsData => {
                    // Konvertovať Google Sheets dáta na formát menu
                    return convertSheetsDataToMenuFormat(sheetsData);
                });
        } else {
            // Načítať z JSON (fallback)
            dataPromise = fetch('data/daily-menu.json')
                .then(response => response.json());
        }
        
        dataPromise.then(data => {
                // Vyplniť formulár
                document.getElementById('week').value = data.week || '';
                document.getElementById('price').value = data.price || '';
                document.getElementById('time').value = data.time || '';

                // Vytvoriť formulár pre dni
                const daysContainer = document.getElementById('daysContainer');
                daysContainer.innerHTML = '';

                dayOrder.forEach(dayKey => {
                    const dayData = data.days[dayKey];
                    if (!dayData) return;

                    const daySection = document.createElement('div');
                    daySection.className = 'day-section';
                    daySection.innerHTML = `
                        <h4 class="day-title">${dayNames[dayKey]}</h4>
                        
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label><strong>Polievka:</strong></label>
                                <div class="row">
                                    <div class="col-md-8">
                                        <input type="text" class="form-control mb-2" 
                                            id="${dayKey}_polievka_name" 
                                            placeholder="Názov polievky" 
                                            value="${dayData.polievka?.name || ''}">
                                    </div>
                                    <div class="col-md-2">
                                        <input type="text" class="form-control mb-2" 
                                            id="${dayKey}_polievka_portion" 
                                            placeholder="0,3l" 
                                            value="${dayData.polievka?.portion || ''}">
                                    </div>
                                    <div class="col-md-2">
                                        <input type="text" class="form-control mb-2" 
                                            id="${dayKey}_polievka_price" 
                                            placeholder="V cene" 
                                            value="${dayData.polievka?.price || 'V cene'}">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label><strong>Menu 1:</strong></label>
                                <input type="text" class="form-control mb-2" 
                                    id="${dayKey}_menu1_name" 
                                    placeholder="Názov menu 1" 
                                    value="${dayData.menu1?.name || ''}">
                                <input type="text" class="form-control mb-2" 
                                    id="${dayKey}_menu1_description" 
                                    placeholder="Popis" 
                                    value="${dayData.menu1?.description || ''}">
                                <input type="text" class="form-control" 
                                    id="${dayKey}_menu1_price" 
                                    placeholder="V cene" 
                                    value="${dayData.menu1?.price || 'V cene'}">
                            </div>
                            <div class="col-md-4 mb-3">
                                <label><strong>Menu 2:</strong></label>
                                <input type="text" class="form-control mb-2" 
                                    id="${dayKey}_menu2_name" 
                                    placeholder="Názov menu 2" 
                                    value="${dayData.menu2?.name || ''}">
                                <input type="text" class="form-control mb-2" 
                                    id="${dayKey}_menu2_description" 
                                    placeholder="Popis" 
                                    value="${dayData.menu2?.description || ''}">
                                <input type="text" class="form-control" 
                                    id="${dayKey}_menu2_price" 
                                    placeholder="V cene" 
                                    value="${dayData.menu2?.price || 'V cene'}">
                            </div>
                            <div class="col-md-4 mb-3">
                                <label><strong>Menu 3:</strong></label>
                                <input type="text" class="form-control mb-2" 
                                    id="${dayKey}_menu3_name" 
                                    placeholder="Názov menu 3" 
                                    value="${dayData.menu3?.name || ''}">
                                <input type="text" class="form-control mb-2" 
                                    id="${dayKey}_menu3_description" 
                                    placeholder="Popis" 
                                    value="${dayData.menu3?.description || ''}">
                                <input type="text" class="form-control" 
                                    id="${dayKey}_menu3_price" 
                                    placeholder="V cene" 
                                    value="${dayData.menu3?.price || 'V cene'}">
                            </div>
                        </div>
                    `;
                    daysContainer.appendChild(daySection);
                });
            })
            .catch(error => {
                console.error('Chyba pri načítaní menu:', error);
                alert('Nepodarilo sa načítať menu. Skontrolujte, či existuje súbor data/daily-menu.json');
            });
    }

    // Uloženie formulára
    document.getElementById('menuForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Zozbierať dáta z formulára
        const menuData = {
            week: document.getElementById('week').value,
            price: document.getElementById('price').value,
            time: document.getElementById('time').value,
            days: {}
        };

        dayOrder.forEach(dayKey => {
            menuData.days[dayKey] = {
                polievka: {
                    name: document.getElementById(`${dayKey}_polievka_name`).value,
                    portion: document.getElementById(`${dayKey}_polievka_portion`).value,
                    price: document.getElementById(`${dayKey}_polievka_price`).value || 'V cene'
                },
                menu1: {
                    name: document.getElementById(`${dayKey}_menu1_name`).value,
                    description: document.getElementById(`${dayKey}_menu1_description`).value,
                    price: document.getElementById(`${dayKey}_menu1_price`).value || 'V cene'
                },
                menu2: {
                    name: document.getElementById(`${dayKey}_menu2_name`).value,
                    description: document.getElementById(`${dayKey}_menu2_description`).value,
                    price: document.getElementById(`${dayKey}_menu2_price`).value || 'V cene'
                },
                menu3: {
                    name: document.getElementById(`${dayKey}_menu3_name`).value,
                    description: document.getElementById(`${dayKey}_menu3_description`).value,
                    price: document.getElementById(`${dayKey}_menu3_price`).value || 'V cene'
                }
            };
        });

        // Uložiť do Google Sheets (ak je nakonfigurované) alebo localStorage
        if (typeof GOOGLE_SHEETS_CONFIG !== 'undefined' && GOOGLE_SHEETS_CONFIG.enabled && GOOGLE_SHEETS_CONFIG.apiKey && GOOGLE_SHEETS_CONFIG.spreadsheetId) {
            // Uložiť do Google Sheets
            saveToGoogleSheets(menuData)
                .then(() => {
                    showSuccessAndRedirect();
                })
                .catch(error => {
                    console.error('Chyba pri ukladaní do Google Sheets:', error);
                    // Fallback na localStorage
                    saveToLocalStorage(menuData);
                    showSuccessAndRedirect();
                });
        } else {
            // Uložiť do localStorage
            saveToLocalStorage(menuData);
            showSuccessAndRedirect();
        }
    });
    
    // Funkcia na uloženie do localStorage
    function saveToLocalStorage(menuData) {
        try {
            localStorage.setItem('dailyMenuData', JSON.stringify(menuData));
        } catch (error) {
            console.error('Chyba pri ukladaní do localStorage:', error);
            throw error;
        }
    }
    
    // Funkcia na zobrazenie úspechu a presmerovanie
    function showSuccessAndRedirect() {
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        successMessage.style.zIndex = '9999';
        successMessage.innerHTML = `
            <strong>Úspech!</strong> Menu bolo uložené. Presmerovávam na denné menu...
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(successMessage);
        
        // Presmerovať na denné menu po 1 sekunde
        setTimeout(() => {
            window.location.href = 'daily-menu.html';
        }, 1000);
    }
    
    // Funkcia na načítanie z Google Sheets
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
    
    // Funkcia na uloženie do Google Sheets (cez Google Apps Script webhook)
    function saveToGoogleSheets(menuData) {
        if (typeof GOOGLE_SHEETS_CONFIG === 'undefined' || !GOOGLE_SHEETS_CONFIG.enabled) {
            return Promise.reject(new Error('Google Sheets nie je nakonfigurované'));
        }
        
        // Ak je nastavený webhook URL (Google Apps Script), použiť ho
        if (GOOGLE_SHEETS_CONFIG.webhookUrl) {
            return fetch(GOOGLE_SHEETS_CONFIG.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nepodarilo sa uložiť do Google Sheets');
                }
                return response.json();
            });
        }
        
        // Fallback: uložiť do localStorage (Google Sheets API vyžaduje OAuth)
        console.warn('Google Sheets webhook nie je nakonfigurovaný, používa sa localStorage');
        saveToLocalStorage(menuData);
        return Promise.resolve();
    }

});


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

    // Demo dish options for dropdown (real dish names from menu)
    const DEMO_DISH_OPTIONS = [
        "Kulajda / Kurací vývar",
        "Fazuľová polievka / Kurací vývar",
        "Hrachová polievka s oškvarkami / Kurací vývar",
        "Tekvicová polievka / Kurací vývar",
        "Kapustnica s klobásou / Kurací vývar",
        "½ Bryndza, ½ kapustové halušky s bravčovou pečienkou",
        "Kurací rezeň s grilovanou zeleninou, dušená ryža",
        "Vyprážaná cuketa, zemiaky varené, tatárska omáčka, šalát",
        "Koložvárska kapusta, zemiaky varené",
        "Maďarský guláš, dušená knedľa",
        "Špenátové rizotto, pečený morský okúň",
        "Čiernohorský rezeň, zemiaky varené, kyslá uhorka",
        "Bravčový rezeň, pečené zemiaky s červenou repou a cibuľou, šalát"
    ];

    // Dish catalog helper functions (kept but not used in demo)
    function loadDishCatalog() {
        try {
            const stored = localStorage.getItem('dishCatalog');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Chyba pri načítaní zoznamu jedál:', error);
        }
        return [];
    }

    function saveDishCatalog(arr) {
        try {
            localStorage.setItem('dishCatalog', JSON.stringify(arr));
        } catch (error) {
            console.error('Chyba pri ukladaní zoznamu jedál:', error);
        }
    }

    function isDishInCatalog(dishName, catalog) {
        const trimmed = dishName.trim().toLowerCase();
        return catalog.some(dish => dish.trim().toLowerCase() === trimmed);
    }

    // Datalist creation disabled for demo (dropdown only)

    // Reusable "Pridať do zoznamu" button
    let addButton = null;
    let activeDishInput = null;

    function createAddButton() {
        if (!addButton) {
            addButton = document.createElement('button');
            addButton.type = 'button';
            addButton.textContent = 'Pridať do zoznamu';
            addButton.className = 'btn btn-sm btn-outline-primary';
            addButton.style.fontSize = '0.75rem';
            addButton.addEventListener('mousedown', function(e) {
                e.preventDefault();
            });
            addButton.addEventListener('click', function() {
                if (activeDishInput && activeDishInput.value.trim()) {
                    const dishName = activeDishInput.value.trim();
                    const catalog = loadDishCatalog();
                    if (!isDishInCatalog(dishName, catalog)) {
                        catalog.push(dishName);
                        saveDishCatalog(catalog);
                        refreshDatalist();
                        refreshCatalogDisplay();
                        addButton.style.display = 'none';
                        // Re-check if button should still show after adding
                        setTimeout(() => {
                            if (activeDishInput === document.activeElement) {
                                handleInputChange(activeDishInput);
                            }
                        }, 10);
                    }
                }
            });
        }
        return addButton;
    }

    function refreshDatalist() {
        const catalog = loadDishCatalog();
        dishCatalogList.innerHTML = '';
        catalog.forEach(dish => {
            const option = document.createElement('option');
            option.value = dish;
            dishCatalogList.appendChild(option);
        });
    }

    function refreshCatalogDisplay() {
        const catalogSection = document.getElementById('catalogSection');
        if (!catalogSection) return;

        const listContainer = catalogSection.querySelector('.catalog-list');
        if (!listContainer) return;

        const catalog = loadDishCatalog();
        listContainer.innerHTML = '';

        if (catalog.length === 0) {
            listContainer.innerHTML = '<p class="text-muted small mb-0">Zoznam je prázdny</p>';
            return;
        }

        catalog.forEach((dish, index) => {
            const row = document.createElement('div');
            row.className = 'd-flex justify-content-between align-items-center border-bottom pb-2 mb-2';
            row.innerHTML = `
                <span>${dish}</span>
                <button type="button" class="btn btn-sm btn-outline-danger" style="font-size: 0.75rem; padding: 2px 8px;">✕</button>
            `;
            row.querySelector('button').addEventListener('click', function() {
                const updatedCatalog = loadDishCatalog();
                updatedCatalog.splice(index, 1);
                saveDishCatalog(updatedCatalog);
                refreshDatalist();
                refreshCatalogDisplay();
                // Update add button visibility if needed
                if (activeDishInput) {
                    handleInputChange(activeDishInput);
                }
            });
            listContainer.appendChild(row);
        });
    }

    function handleInputChange(input) {
        const value = input.value.trim();
        const catalog = loadDishCatalog();
        const shouldShow = value && !isDishInCatalog(value, catalog);

        // Find the wrapper div for this input
        let wrapper = input.parentElement;
        if (!wrapper || !wrapper.classList.contains('dish-input-wrapper')) {
            return; // Input not wrapped yet, skip
        }

        // Update "🧹 Nahradiť" button visibility
        const replaceButton = wrapper.querySelector('.replace-dish-button');
        if (replaceButton) {
            replaceButton.style.display = value ? 'inline-block' : 'none';
        }

        if (shouldShow) {
            const btn = createAddButton();
            // Remove button from previous location if exists
            if (btn.parentNode) {
                btn.parentNode.removeChild(btn);
            }
            // Add button to wrapper (after input)
            wrapper.appendChild(btn);
            btn.style.display = 'inline-block';
        } else {
            if (addButton && addButton.parentNode) {
                addButton.style.display = 'none';
            }
        }
    }

    function setupChangeButton(input) {
        const wrapper = input.parentElement;
        if (!wrapper || !wrapper.classList.contains('dish-input-wrapper')) {
            return;
        }

        // Create "🧹 Nahradiť" button
        let replaceButton = wrapper.querySelector('.replace-dish-button');
        if (!replaceButton) {
            replaceButton = document.createElement('button');
            replaceButton.type = 'button';
            replaceButton.textContent = '🧹 Nahradiť';
            replaceButton.className = 'replace-dish-button btn btn-sm btn-outline-secondary';
            replaceButton.style.fontSize = '0.75rem';
            replaceButton.addEventListener('click', function() {
                input.value = '';
                input.focus();
                activeDishInput = input;
                handleInputChange(input);
            });
            wrapper.appendChild(replaceButton);
        }

        // Set initial visibility
        replaceButton.style.display = input.value.trim() ? 'inline-block' : 'none';
    }

    function createCatalogSection() {
        // Disabled for demo (dropdown only)
    }

    function setupDishDropdown(input) {
        const wrapper = input.parentElement;
        if (!wrapper || !wrapper.classList.contains('dish-input-wrapper')) {
            return;
        }

        // Check if dropdown already exists
        let inputGroup = wrapper.querySelector('.dish-input-group');
        if (inputGroup) {
            return; // Already exists
        }

        // Make the input visible and editable (remove any hiding)
        input.style.display = '';
        input.readOnly = false;

        // Create flex container (not Bootstrap input-group)
        inputGroup = document.createElement('div');
        inputGroup.className = 'dish-input-group';
        inputGroup.style.width = '100%';
        inputGroup.style.position = 'relative';
        inputGroup.style.display = 'flex';
        inputGroup.style.gap = '5px';
        inputGroup.style.alignItems = 'stretch';

        // Create arrow button
        const arrowButton = document.createElement('button');
        arrowButton.type = 'button';
        arrowButton.className = 'btn btn-outline-secondary';
        arrowButton.innerHTML = '▼';
        arrowButton.style.cursor = 'pointer';
        arrowButton.style.position = 'relative';
        arrowButton.style.display = 'flex';
        arrowButton.style.alignItems = 'center';
        arrowButton.style.justifyContent = 'center';
        arrowButton.style.height = 'auto';


        // Create hidden select dropdown (overlay on arrow button)
        const dropdown = document.createElement('select');
        dropdown.className = 'dish-dropdown-select';
        dropdown.style.position = 'absolute';
        dropdown.style.opacity = '0';
        dropdown.style.pointerEvents = 'auto';
        dropdown.style.cursor = 'pointer';
        dropdown.style.zIndex = '10';
        dropdown.style.border = 'none';
        dropdown.style.background = 'transparent';
        dropdown.style.appearance = 'none';
        dropdown.style.webkitAppearance = 'none';

        // Add placeholder option (selected by default)
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = '— vyber jedlo —';
        placeholderOption.selected = true;
        dropdown.appendChild(placeholderOption);

        // Add options from DEMO_DISH_OPTIONS
        DEMO_DISH_OPTIONS.forEach(dish => {
            const option = document.createElement('option');
            option.value = dish;
            option.textContent = dish;
            dropdown.appendChild(option);
        });

        // Keep select at placeholder (don't sync with input value)
        dropdown.value = '';

        // Set input to flex:1
        input.style.flex = '1';

        // Move input into flex container
        wrapper.removeChild(input);
        inputGroup.appendChild(input);
        inputGroup.appendChild(arrowButton);
        inputGroup.appendChild(dropdown);
        wrapper.appendChild(inputGroup);

        // Measure input height after render and set button height to match (pixel-perfect)
        setTimeout(() => {
            const inputHeight = input.offsetHeight; // Includes padding and border
            const inputStyle = window.getComputedStyle(input);
            const inputPaddingTop = parseFloat(inputStyle.paddingTop);
            const inputPaddingBottom = parseFloat(inputStyle.paddingBottom);
            
            // Set button to exact same height and padding as input
            arrowButton.style.height = inputHeight + 'px';
            arrowButton.style.paddingTop = inputPaddingTop + 'px';
            arrowButton.style.paddingBottom = inputPaddingBottom + 'px';
            arrowButton.style.paddingLeft = '12px';
            arrowButton.style.paddingRight = '12px';
        }, 0);

        // Position select overlay exactly over arrow button
        const updateSelectPosition = () => {
            const buttonRect = arrowButton.getBoundingClientRect();
            const groupRect = inputGroup.getBoundingClientRect();
            dropdown.style.left = (buttonRect.left - groupRect.left) + 'px';
            dropdown.style.top = (buttonRect.top - groupRect.top) + 'px';
            dropdown.style.width = buttonRect.width + 'px';
            dropdown.style.height = buttonRect.height + 'px';
        };

        // Update position initially and on resize
        setTimeout(updateSelectPosition, 0);
        window.addEventListener('resize', updateSelectPosition);

        // On select change, update the input value
        dropdown.addEventListener('change', function() {
            if (this.value) {
                input.value = this.value;
                // Trigger input event for existing save logic
                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);
            } else {
                input.value = '';
                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);
            }
            // Reset select to placeholder after selection
            this.value = '';
        });
    }

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
                                        <div class="dish-input-wrapper" style="display:flex; align-items:center; gap:8px;">
                                            <input type="text" class="form-control mb-2" 
                                                id="${dayKey}_polievka_name" 
                                                placeholder="Názov polievky" 
                                                value="${dayData.polievka?.name || ''}">
                                        </div>
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
                                <div class="dish-input-wrapper" style="display:flex; align-items:center; gap:8px;">
                                    <input type="text" class="form-control mb-2" 
                                        id="${dayKey}_menu1_name" 
                                        placeholder="Názov menu 1" 
                                        value="${dayData.menu1?.name || ''}">
                                </div>
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
                                <div class="dish-input-wrapper" style="display:flex; align-items:center; gap:8px;">
                                    <input type="text" class="form-control mb-2" 
                                        id="${dayKey}_menu2_name" 
                                        placeholder="Názov menu 2" 
                                        value="${dayData.menu2?.name || ''}">
                                </div>
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
                                <div class="dish-input-wrapper" style="display:flex; align-items:center; gap:8px;">
                                    <input type="text" class="form-control mb-2" 
                                        id="${dayKey}_menu3_name" 
                                        placeholder="Názov menu 3" 
                                        value="${dayData.menu3?.name || ''}">
                                </div>
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

                // Setup dropdown selects for dish name inputs (demo mode)
                dayOrder.forEach(dayKey => {
                    // Polievka name input
                    const polievkaInput = document.getElementById(`${dayKey}_polievka_name`);
                    if (polievkaInput) {
                        setupDishDropdown(polievkaInput);
                    }

                    // Menu 1, 2, 3 name inputs
                    ['menu1', 'menu2', 'menu3'].forEach(menuKey => {
                        const menuInput = document.getElementById(`${dayKey}_${menuKey}_name`);
                        if (menuInput) {
                            setupDishDropdown(menuInput);
                        }
                    });
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


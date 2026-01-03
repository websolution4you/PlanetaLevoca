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

    // Načítať JSON súbor
    fetch('data/daily-menu.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Nepodarilo sa načítať denné menu');
            }
            return response.json();
        })
        .then(data => {
            // Aktualizovať informácie o týždni a cene
            if (data.week) {
                document.getElementById('weekInfo').textContent = data.week;
            }
            if (data.price) {
                document.getElementById('priceInfo').textContent = 'Cena: ' + data.price;
            }
            if (data.time) {
                const timeInfo = document.getElementById('timeInfo');
                if (timeInfo) {
                    timeInfo.textContent = 'Menu je k dispozícii od pondelka do piatka v čase ' + data.time;
                }
            }
            
            // Zobraziť informáciu o aktuálnom dni (iba počas pracovných dní)
            const today = new Date();
            const dayOfWeek = today.getDay();
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                const currentDayInfo = document.getElementById('currentDayInfo');
                const currentDayNameEl = document.getElementById('currentDayName');
                if (currentDayInfo) {
                    currentDayInfo.style.display = 'block';
                }
                if (currentDayNameEl) {
                    currentDayNameEl.textContent = dayNames[currentDayKey].name;
                }
            } else {
                // Zobraziť víkendovú správu
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
                        ? `<span class="text-primary">${dayData.polievka.price}</span>` 
                        : '';
                    menuHTML += `
                        <div class="col-lg-6">
                            <div class="d-flex align-items-center">
                                <div class="w-100 d-flex flex-column text-start">
                                    <h5 class="d-flex justify-content-between border-bottom pb-2">
                                        <span>${dayData.polievka.name}${portionText}</span>
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
                            ? `<span class="text-primary">${menu.price}</span>` 
                            : '';
                        menuHTML += `
                            <div class="col-lg-6">
                                <div class="d-flex align-items-center">
                                    <div class="w-100 d-flex flex-column text-start">
                                        <h5 class="d-flex justify-content-between border-bottom pb-2">
                                            <span>${menu.name}</span>
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
            document.getElementById('weekInfo').textContent = 'Chyba pri načítaní menu';
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


// Daily Menu Loader
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
                if (currentDayInfo) {
                    currentDayInfo.style.display = 'block';
                }
            }

            // Vytvoriť taby pre dni
            const tabsContainer = document.getElementById('dayTabs');
            const contentContainer = document.getElementById('dayContent');

            dayOrder.forEach((dayKey, index) => {
                const day = dayNames[dayKey];
                const dayData = data.days[dayKey];

                if (!dayData) return;

                // Vytvoriť tab
                const tabItem = document.createElement('li');
                tabItem.className = 'nav-item';
                // Nastaviť aktívny tab podľa aktuálneho dňa
                const isActive = dayKey === currentDayKey ? 'active' : '';
                const isFirst = index === 0 ? 'ms-0' : '';
                const isLast = index === dayOrder.length - 1 ? 'me-0' : '';

                tabItem.innerHTML = `
                    <a class="d-flex align-items-center text-start mx-3 ${isFirst} ${isLast} pb-3 ${isActive}" data-bs-toggle="pill" href="#day-${dayKey}">
                        <i class="fa ${day.icon} fa-2x text-primary"></i>
                        <div class="ps-3">
                            <small class="text-body">${day.short}</small>
                            <h6 class="mt-n1 mb-0">${day.name}</h6>
                        </div>
                    </a>
                `;
                tabsContainer.appendChild(tabItem);

                // Vytvoriť obsah pre deň
                const tabPane = document.createElement('div');
                tabPane.id = `day-${dayKey}`;
                // Nastaviť aktívny obsah podľa aktuálneho dňa
                const isContentActive = dayKey === currentDayKey;
                tabPane.className = `tab-pane fade ${isContentActive ? 'show active' : ''} p-0`;
                
                let menuHTML = '<div class="row g-4">';

                // Polievka
                if (dayData.polievka) {
                    const portionText = dayData.polievka.portion ? ` (${dayData.polievka.portion})` : '';
                    menuHTML += `
                        <div class="col-lg-6">
                            <div class="d-flex align-items-center">
                                <div class="w-100 d-flex flex-column text-start">
                                    <h5 class="d-flex justify-content-between border-bottom pb-2">
                                        <span>${dayData.polievka.name}${portionText}</span>
                                        <span class="text-primary">${dayData.polievka.price}</span>
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
                        menuHTML += `
                            <div class="col-lg-6">
                                <div class="d-flex align-items-center">
                                    <div class="w-100 d-flex flex-column text-start">
                                        <h5 class="d-flex justify-content-between border-bottom pb-2">
                                            <span>${menu.name}</span>
                                            <span class="text-primary">${menu.price}</span>
                                        </h5>
                                        <small class="fst-italic">${menu.description || ''}</small>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                });

                menuHTML += '</div>';
                tabPane.innerHTML = menuHTML;
                contentContainer.appendChild(tabPane);
            });
        })
        .catch(error => {
            console.error('Chyba pri načítaní denného menu:', error);
            document.getElementById('weekInfo').textContent = 'Chyba pri načítaní menu';
            document.getElementById('dayTabs').innerHTML = '<p class="text-danger">Nepodarilo sa načítať denné menu. Skontrolujte, či existuje súbor data/daily-menu.json</p>';
        });
});


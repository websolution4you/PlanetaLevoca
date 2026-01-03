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
        fetch('data/daily-menu.json')
            .then(response => response.json())
            .then(data => {
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

        // Vytvoriť JSON a stiahnuť
        const jsonString = JSON.stringify(menuData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'daily-menu.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('JSON súbor bol stiahnutý! Nahraďte súbor data/daily-menu.json na serveri.');
    });
});


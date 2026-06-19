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
    
    // Seed list to pre-populate database if empty
    const SEED_DISHES = [
      "kelová so zemiakmi",
      "česká bramboračka",
      "šošovicová",
      "cesnaková",
      "ruský boršč",
      "bulharská kuracia",
      "brokolicová so zemiakmi",
      "držková",
      "paradajková",
      "zemiaková krémová so slaninkou",
      "gulášová",
      "fazuľková struková",
      "mrkvová so zázvorom",
      "karfiólová s karamelizovanou cibuľkou",
      "hrachová",
      "kulajda",
      "hŕstková s údeným",
      "zeleninová krémová",
      "fazuľová s údeným",
      "šošovicová s párkom",
      "kapustnica",
      "karfiólová krémová",
      "hrachová so slaninkou",
      "fraknkfurtská",
      "krúpová s údeným",
      "hrachová s krutónmi",
      "zemiaková na kyslo",
      "sviatočná kapustnica",
      "brokolicová krémová",
      "tekvicová hokaido",
      "cesnaková krémová",
      "Bravčové ragú na póre, dusená ryža, cesnaková bagetka",
      "Kurací steak s broskyňou a syrom, ryža, hranolky, šalát",
      "Plnená cuketa Caprese, pečené zemiaky, šalát",
      "Maďarský guláš, knedľa",
      "Bravčový špíz, pečené zemiaky, šalát coleslaw",
      "Bryndzové a kapustové halušky",
      "Krkovička na rasci, pečené zemiaky, šalát",
      "Kuracie kari soté, ryža, mrkvový šalát",
      "Penne s cuketou a parmezánom",
      "Bravčové pliecko na bielom víne, tlačené zemiaky, baby mrkva",
      "Grilované kuracie mäso, tagliatelle so syrovou omáčkou",
      "Vyprážaný encián, varené zemiaky, tatárska omáčka, šalát",
      "Lasagne bolognese",
      "Bravčový steak na syrovej omáčke, pečené zemiaky, šalát",
      "Kurací steak so šunkou a syrom, ryža, hranolky, šalát",
      "Cuketový prívarok, varené zemiaky, volské oko",
      "Pečené plnené kuracie stehná, ryža, kompót",
      "Zapečený karfiól so zemiakmi a syrom",
      "Segedínsky guláš, knedľa",
      "Grilovaná zelenina s parmezánom, opekané zemiaky, dressing",
      "Bravčový špíz so zeleninou, hranolky, šalát coleslaw",
      "Kurací cordon bleu, zemiaková kaša, šalát",
      "Kurací gyros, ryža, hranolky, tzatziki",
      "Vyprážané šampiňóny, varené zemiaky, tatárska omáčka, šalát",
      "Koložvárska kapusta, varené zemiaky",
      "Sumček na holandskej omáčke, pečené zemiakové plátky",
      "Obrátený bravčový rezeň, tlačené zemiaky",
      "Kurací steak na grilovanej zelenine, pečené zemiaky",
      "Linguine s brokolicovou omáčkou a grilovaným lososom",
      "Krkovička na rasci, žemľová knedľa",
      "Ryba na kari omáčke s kokosovým mliekom, ryža",
      "Španielsky vtáčik, slovenská ryža, šalát",
      "Krkovička pečená so zemiakmi, cibuľou a koreňovou zeleninou",
      "Čiernohorský rezeň, zemiaková kaša, šalát",
      "Kurací steak s bylinkovým maslom, ryža, hranolky, šalát",
      "Bryndzové pirohy s maslom a kyslou smotanou",
      "Pečená krkovička s mrkvou na pive, tlačené zemiaky",
      "Kuracie soté s kari, ryža, hranolky, mrkvový šalát",
      "Vyprážaný karfiól, varené zemiaky, tatárska omáčka, šalát",
      "Penne so syrovou omáčkou, brokolicou a cesnakom",
      "Čiernohorský rezeň, zemiaková kaša, kyslá uhorka",
      "Živánska na plechu, šalát",
      "Zabíjačka (krkovička, jaternica, klobása), kyslá kapusta, varené zemiaky",
      "Hríbové rizoto s parmezánom",
      "Bravčové pliecko na bielom víne, tlačené zemiaky, špenát",
      "Bravčový steak na syrovej omáčke, ryža, hranolky, šalát",
      "Bryndzové halušky s cibuľkou opraženou na masle",
      "Bravčový tokáň, zemiaková kaša",
      "Vyprážaný bravčový rezeň, zemiaková kaša, šalát",
      "Kurací steak s ananásom a syrom, ryža, hranolky, šalát",
      "Zeleninové rizoto s parmezánom",
      "Bravčový steak na dijonskej omáčke, pečené zemiaky",
      "Zeleninové rizoto so syrom",
      "Vyprážaný syr, varené zemiaky, tatárska omáčka, šalát",
      "Hamburské bravčové pliecko, cestovina kolienka",
      "Sedliacka krkovička, zemiaky s cibuľkou a petržlenom",
      "Kuracie krídelká barbecue, ryža, hranolky, coleslaw",
      "Penne so syrovou omáčkou a grilovaným kuracím mäsom",
      "Špagety s olivovým olejom, chilli, cesnakom a parmezánom",
      "Zemiakový prívarok, pečená fašírka s vajíčkom, chlieb",
      "Bravčové pečené, červená kapusta knedľa",
      "Cuketové rizoto s parmezánom",
      "Kuracie soté v zemiakovej placke, šalát",
      "Zeleninové kari, dusená ryža, mrkvový šalát",
      "Živánska na plechu",
      "Kuracie Caprese, ryža, hranolky, šalát",
      "Bravčové medajlóniky na krémovej omáčke so špenátom a hráškom, tlačené zemiaky",
      "Sviečková na smotane s Brusnicami, knedľa",
      "Čiernohorský rezeň, zemiaková kaša, uhorkový šalát",
      "Penne s brokolicou, cesnakom a syrom",
      "Bravčový perkelt s haluškami",
      "Plnený kurací rezeň, zemiaková kaša, šalát",
      "Špagety s chilli, cesnakom a parmezánom",
      "Zabíjačka (jaternica, klobása, krkovička) so strapačkami",
      "Pečená krkovička na pive, tlačené zemiaky",
      "Hovädzie dusené, kôprová omáčka, knedľa",
      "Zemiakové šúľance s makom a maslom",
      "Bravčové medajlóniky na hríbovej omáčke, pečené zemiaky, šalát",
      "Moravský vrabec, dusená kyslá kapusta, knedľa",
      "Pečené plnené kuracie stehno, dusená ryža, kompót",
      "Panenka plnená fetou a špenátom, pečené zemiaky, šalát",
      "Bravčový Stroganoff, ryža, krokety, šalát",
      "Plnený kurací rezeň, varené zemiaky, tatárska omáčka, šalát"
    ];

    let cachedCatalog = [];
    let tomSelectInstances = {};

    // Load dishes catalog from Firestore
    async function loadDishCatalog() {
        if (typeof db === 'undefined') {
            const local = localStorage.getItem('dishCatalog');
            return local ? JSON.parse(local) : SEED_DISHES;
        }

        try {
            const snapshot = await db.collection('catalog').doc('dishes').get();
            if (snapshot.exists) {
                const data = snapshot.data();
                if (data && Array.isArray(data.items) && data.items.length > 15) {
                    cachedCatalog = data.items.sort();
                    return cachedCatalog;
                }
            }
            // Seed database if empty or has too few items from previous draft
            await db.collection('catalog').doc('dishes').set({ items: SEED_DISHES });
            cachedCatalog = SEED_DISHES.sort();
            return cachedCatalog;
        } catch (error) {
            console.error('Chyba pri načítaní katalógu z Firestore:', error);
            return SEED_DISHES;
        }
    }

    // Save dish catalog to Firestore
    async function saveDishCatalog(catalog) {
        cachedCatalog = [...new Set(catalog)].sort();
        if (typeof db !== 'undefined') {
            try {
                await db.collection('catalog').doc('dishes').set({ items: cachedCatalog });
            } catch (error) {
                console.error('Chyba pri ukladaní katalógu do Firestore:', error);
            }
        } else {
            localStorage.setItem('dishCatalog', JSON.stringify(cachedCatalog));
        }
        refreshCatalogDisplay();
        updateTomSelectOptions();
    }

    function isDishInCatalog(dishName, catalog) {
        if (!dishName) return false;
        const trimmed = dishName.trim().toLowerCase();
        return catalog.some(dish => dish.trim().toLowerCase() === trimmed);
    }

    // Update choices in all Tom Select widgets
    function updateTomSelectOptions() {
        const options = cachedCatalog.map(dish => ({ value: dish, text: dish }));
        Object.values(tomSelectInstances).forEach(ts => {
            // Keep current value if not in options
            const currentVal = ts.getValue();
            ts.clearOptions();
            ts.addOption(options);
            if (currentVal) {
                if (!ts.options[currentVal]) {
                    ts.addOption({ value: currentVal, text: currentVal });
                }
                ts.setValue(currentVal, true);
            }
        });
    }

    // Initialize Tom Select widget on input element
    function initTomSelect(input) {
        if (!input) return;
        const id = input.id;
        if (tomSelectInstances[id]) {
            tomSelectInstances[id].destroy();
        }

        const options = cachedCatalog.map(dish => ({ value: dish, text: dish }));
        const currentVal = input.value;
        let isEditing = false;
        let originalValueBeforeEdit = '';

        const ts = new TomSelect(input, {
            plugins: ['clear_button'],
            create: true,
            maxItems: 1,
            maxOptions: 150,
            valueField: 'value',
            labelField: 'text',
            searchField: ['text'],
            options: options,
            placeholder: input.placeholder || 'Vyberte alebo napíšte...',
            createFilter: function(input) {
                return input.trim().length > 1;
            },
            openOnFocus: true,
            shouldOpen: function() {
                return true;
            },
            selectOnTab: true,
            render: {
                option_create: function(data, escape) {
                    return '<div class="create">Pridať jedlo: <strong>' + escape(data.input) + '</strong> do zoznamu...</div>';
                }
            },
            onFocus: function() {
                const self = this;
                // Vymazať vyhľadávací input pri kliknutí
                setTimeout(() => {
                    if (isEditing) {
                        return;
                    }
                    const activeInput = self.control_input;
                    if (activeInput) {
                        activeInput.value = '';
                        const currentVal = self.getValue();
                        if (currentVal) {
                            // Zneviditeľniť text a kurzor kým nezačne písať (len ak je niečo vybraté)
                            activeInput.style.color = 'transparent';
                            activeInput.style.textShadow = '0 0 0 transparent'; // Aby nebol vidieť ani tieň písma
                            activeInput.style.caretColor = 'transparent';
                        } else {
                            // Zviditeľniť text a kurzor ak je pole prázdne
                            activeInput.style.color = '';
                            activeInput.style.textShadow = '';
                            activeInput.style.caretColor = '';
                        }
                    }
                }, 10);
            },
            onType: function(str) {
                const activeInput = this.control_input;
                if (activeInput) {
                    if (str) {
                        activeInput.style.color = '';
                        activeInput.style.textShadow = '';
                        activeInput.style.caretColor = '';
                    } else {
                        activeInput.style.color = 'transparent';
                        activeInput.style.textShadow = '0 0 0 transparent';
                        activeInput.style.caretColor = 'transparent';
                    }
                }
            },
            onChange: function(val) {
                const self = this;
                input.value = val;
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
                
                originalValueBeforeEdit = ''; // Reset when a value is selected or explicitly cleared via (x)
                
                if (val) {
                    setTimeout(() => {
                        self.blur();
                    }, 50);
                } else {
                    // Automaticky zamerať len pri manuálnom premazaní používateľom
                    if (!self.isProgrammaticChange) {
                        setTimeout(() => {
                            self.focus();
                            const activeInput = self.control_input;
                            if (activeInput) {
                                activeInput.style.color = '';
                                activeInput.style.textShadow = '';
                                activeInput.style.caretColor = '';
                            }
                        }, 50);
                    }
                }
            },
            onBlur: function() {
                const self = this;
                setTimeout(() => {
                    if (isEditing) {
                        const currentVal = self.getValue();
                        // Ak už má priradenú hodnotu (napr. z výberu v našepkávači), tak ju necháme
                        if (!currentVal) {
                            const newVal = self.control_input.value.trim();
                            if (newVal) {
                                if (!self.options[newVal]) {
                                    self.addOption({ value: newVal, text: newVal });
                                }
                                self.setValue(newVal);
                            } else if (originalValueBeforeEdit) {
                                self.setValue(originalValueBeforeEdit, true);
                            }
                        }
                        isEditing = false;
                        self.wrapper.classList.remove('is-editing');
                    } else {
                        const currentVal = self.getValue();
                        if (!currentVal && originalValueBeforeEdit) {
                            // Restore original value if they changed their mind
                            self.setValue(originalValueBeforeEdit, true);
                            originalValueBeforeEdit = '';
                        }
                    }
                    
                    if (window.innerWidth <= 768) {
                        self.control_input.readOnly = true;
                        self.control_input.setAttribute('inputmode', 'none');
                    }
                }, 150);
            },
            onDropdownOpen: function() {
                const self = this;
                setTimeout(() => {
                    self.wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
            },
            onDropdownClose: function() {
                // No backdrop needed anymore
            }
        });

        if (currentVal) {
            if (!ts.options[currentVal]) {
                ts.addOption({ value: currentVal, text: currentVal });
            }
            ts.setValue(currentVal, true);
        }

        // Rýchly výber pre dotykové zariadenia (rieši nutnosť dvojitého ťuknutia na možnosť v zozname a umožňuje scrolovanie)
        let touchStartPos = null;
        let isScrolling = false;
        let touchSelected = false;
        let touchSelectedTimeout = null;

        ts.dropdown.addEventListener('touchstart', function(e) {
            isScrolling = false;
            if (e.touches && e.touches.length === 1) {
                touchStartPos = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            }
        }, { passive: true });

        ts.dropdown.addEventListener('touchmove', function(e) {
            if (!touchStartPos) return;
            if (e.touches && e.touches.length === 1) {
                const dx = e.touches[0].clientX - touchStartPos.x;
                const dy = e.touches[0].clientY - touchStartPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 10) {
                    isScrolling = true;
                }
            }
        }, { passive: true });

        ts.dropdown.addEventListener('touchend', function(e) {
            if (!touchStartPos) return;
            
            if (!isScrolling) {
                const option = e.target.closest('.option');
                const createOpt = e.target.closest('.create');
                
                if (option) {
                    e.preventDefault();
                    e.stopPropagation();
                    const value = option.getAttribute('data-value');
                    if (value) {
                        touchSelected = true;
                        if (touchSelectedTimeout) clearTimeout(touchSelectedTimeout);
                        touchSelectedTimeout = setTimeout(() => { touchSelected = false; }, 500);
                        
                        ts.setValue(value);
                        ts.blur();
                    }
                } else if (createOpt) {
                    e.preventDefault();
                    e.stopPropagation();
                    const newVal = ts.control_input.value.trim();
                    if (newVal) {
                        touchSelected = true;
                        if (touchSelectedTimeout) clearTimeout(touchSelectedTimeout);
                        touchSelectedTimeout = setTimeout(() => { touchSelected = false; }, 500);

                        if (!ts.options[newVal]) {
                            ts.addOption({ value: newVal, text: newVal });
                        }
                        ts.setValue(newVal);
                        ts.blur();
                    }
                }
            }
            touchStartPos = null;
        }, { passive: false });

        // Odchytávame eventy v capturing fáze pred tým, než ich spracuje Tom Select
        const blockEvent = function(e) {
            if (isScrolling || touchSelected) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        };

        ts.dropdown.addEventListener('mousedown', blockEvent, { capture: true });
        ts.dropdown.addEventListener('click', blockEvent, { capture: true });
        ts.dropdown.addEventListener('pointerdown', blockEvent, { capture: true });

        // Ak je to mobil, nastav vstup na readOnly pre výber (potlačí klávesnicu)
        if (window.innerWidth <= 768) {
            ts.control_input.readOnly = true;
            ts.control_input.setAttribute('inputmode', 'none');
        }

        // Enter zatvorí/uloží úpravu
        ts.control_input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                ts.blur();
            }
        });

        // Prepojiť tlačidlo vymazania (krížik) s editačným režimom a klávesnicou
        const originalClearBtn = ts.control.querySelector('.clear-button');
        if (originalClearBtn) {
            // Naklonujeme tlačidlo, aby sme vymazali pôvodné event listenery naviazané pluginom Tom Selectu
            const clearBtn = originalClearBtn.cloneNode(true);
            originalClearBtn.parentNode.replaceChild(clearBtn, originalClearBtn);

            const handleClear = function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                originalValueBeforeEdit = ''; // Keďže čistia text, nechceme obnovovať pôvodný pri blure
                isEditing = true;
                ts.wrapper.classList.add('is-editing');

                // Povoliť písanie na mobile
                ts.control_input.readOnly = false;
                ts.control_input.removeAttribute('inputmode');

                // Vymazať ticho vybratú hodnotu bez spustenia autofocus eventov
                ts.isProgrammaticChange = true;
                ts.clear(true);
                delete ts.isProgrammaticChange;

                // Zamerať vstup synchrónne, aby na mobile vyskočila klávesnica
                ts.focus();
                ts.control_input.style.color = '';
                ts.control_input.style.textShadow = '';
                ts.control_input.style.caretColor = '';

                // Scroll do horného okraja, aby klávesnica neprekrývala vstup
                setTimeout(() => {
                    ts.wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
            };

            clearBtn.addEventListener('mousedown', handleClear);
            clearBtn.addEventListener('touchstart', handleClear);
            clearBtn.addEventListener('click', handleClear);
        }

        // Pridať tlačidlo na úpravu (ceruzku)
        const editBtn = document.createElement('a');
        editBtn.className = 'edit-button';
        editBtn.title = 'Upraviť text';
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        ts.control.appendChild(editBtn);

        const handleEdit = function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const val = ts.getValue();
            if (val) {
                originalValueBeforeEdit = val; // Store original value to restore on blur
                isEditing = true;
                ts.wrapper.classList.add('is-editing');

                // Povoliť písanie na mobile
                ts.control_input.readOnly = false;
                ts.control_input.removeAttribute('inputmode');

                // Vymazať ticho vybratú hodnotu bez spustenia autofocus eventov
                ts.isProgrammaticChange = true;
                ts.clear(true);
                delete ts.isProgrammaticChange;

                // Predvyplniť vstup pôvodným textom
                ts.control_input.value = val;

                // Zamerať vstup synchrónne, aby na mobile vyskočila klávesnica
                ts.focus();
                ts.control_input.style.color = '';
                ts.control_input.style.textShadow = '';
                ts.control_input.style.caretColor = '';
                
                // Presunúť kurzor na koniec textu
                const len = ts.control_input.value.length;
                ts.control_input.setSelectionRange(len, len);

                // Scroll do horného okraja, aby klávesnica neprekrývala vstup
                setTimeout(() => {
                    ts.wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
            }
        };

        editBtn.addEventListener('mousedown', handleEdit);
        editBtn.addEventListener('touchstart', handleEdit);
        editBtn.addEventListener('click', handleEdit);

        tomSelectInstances[id] = ts;
    }

    function refreshCatalogDisplay() {
        const catalogSection = document.getElementById('catalogSection');
        if (!catalogSection) return;

        const listContainer = catalogSection.querySelector('.catalog-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        if (cachedCatalog.length === 0) {
            listContainer.innerHTML = '<p class="text-muted small mb-0">Zoznam je prázdny</p>';
            return;
        }

        cachedCatalog.forEach((dish, index) => {
            const row = document.createElement('div');
            row.className = 'd-flex justify-content-between align-items-center border-bottom pb-2 mb-2';
            row.innerHTML = `
                <span class="small">${dish}</span>
                <button type="button" class="btn btn-sm btn-outline-danger" style="font-size: 0.7rem; padding: 1px 6px;">✕</button>
            `;
            row.querySelector('button').addEventListener('click', async function() {
                if (confirm(`Naozaj chcete vymazať "${dish}" z našepkávača?`)) {
                    const updated = cachedCatalog.filter((_, i) => i !== index);
                    await saveDishCatalog(updated);
                }
            });
            listContainer.appendChild(row);
        });
    }

    // Setup direct manual addition to catalog
    document.getElementById('btnAddDirectDish')?.addEventListener('click', async function() {
        const input = document.getElementById('newDirectDish');
        const value = input?.value.trim();
        if (value) {
            if (!isDishInCatalog(value, cachedCatalog)) {
                const updated = [...cachedCatalog, value];
                await saveDishCatalog(updated);
                input.value = '';
            } else {
                alert('Toto jedlo už v katalógu existuje.');
            }
        }
    });

    // Smart Text Parser Logika
    document.getElementById('btnParseText')?.addEventListener('click', function() {
        const rawText = document.getElementById('rawMenuText').value;
        if (!rawText.trim()) {
            alert('Vložte najskôr nejaký text menu.');
            return;
        }

        const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
        const parsedData = {
            pondelok: { polievka: '', menu1: '', menu2: '', menu3: '' },
            utorok: { polievka: '', menu1: '', menu2: '', menu3: '' },
            streda: { polievka: '', menu1: '', menu2: '', menu3: '' },
            stvrtok: { polievka: '', menu1: '', menu2: '', menu3: '' },
            piatok: { polievka: '', menu1: '', menu2: '', menu3: '' }
        };

        let currentDay = null;
        let menuIndexForDay = 1; // Fallback index if lines are not numbered
        let dayLinesCount = 0; // Count lines processed within current day block

        const dayRegex = /^(pondelok|utorok|streda|štvrtok|stvrtok|piatok)/i;
        const numberRegex = /^([1-3])\.\s*(.*)/;

        lines.forEach(line => {
            const dayMatch = line.match(dayRegex);
            if (dayMatch) {
                let dayName = dayMatch[1].toLowerCase();
                if (dayName === 'štvrtok') dayName = 'stvrtok';
                currentDay = dayName;
                menuIndexForDay = 1; // reset counter
                dayLinesCount = 0;
                
                // Check if soup text is on the same line (e.g. "pondelok držková/kurací vývar")
                const soupPart = line.replace(dayRegex, '').trim();
                if (soupPart) {
                    parsedData[currentDay].polievka = cleanDishText(soupPart);
                    dayLinesCount = 1;
                }
                return;
            }

            if (currentDay) {
                dayLinesCount++;
                const cleanLine = cleanDishText(line);

                // Check if it starts with 1., 2., 3.
                const numMatch = line.match(numberRegex);
                if (numMatch) {
                    const menuNum = 'menu' + numMatch[1];
                    parsedData[currentDay][menuNum] = cleanDishText(numMatch[2]);
                    menuIndexForDay = parseInt(numMatch[1]) + 1;
                } else {
                    // It doesn't start with a number. Let's guess:
                    // Rule 1: The very first line of a day block is always the Soup
                    if (dayLinesCount === 1 && !parsedData[currentDay].polievka) {
                        parsedData[currentDay].polievka = cleanLine;
                    } else if (line.toLowerCase().includes('/') && !parsedData[currentDay].polievka && dayLinesCount <= 2) {
                        // Guess as soup if it has a slash and is early in the day block
                        parsedData[currentDay].polievka = cleanLine;
                    } else {
                        // Otherwise it's the next Menu item sequentially
                        if (menuIndexForDay <= 3) {
                            parsedData[currentDay]['menu' + menuIndexForDay] = cleanLine;
                            menuIndexForDay++;
                        }
                    }
                }
            }
        });

        // Fill data to form inputs and refresh Tom Selects
        dayOrder.forEach(dayKey => {
            const data = parsedData[dayKey];
            if (!data) return;

            setTomSelectValue(`${dayKey}_polievka_name`, data.polievka);
            setTomSelectValue(`${dayKey}_menu1_name`, data.menu1);
            setTomSelectValue(`${dayKey}_menu2_name`, data.menu2);
            setTomSelectValue(`${dayKey}_menu3_name`, data.menu3);
        });

        alert('Text bol úspešne spracovaný a rozdelený do formulára! Skontrolujte prosím výsledok.');
    });

    function cleanDishText(text) {
        // Remove weight/portion annotations (e.g., "130 g", "130g", "0,3 l", "0,3l", "250 g") and allergen indices (e.g., "1,3,7", "1,7")
        return text
            .replace(/^\d+(?:,\d+)?\s*(?:g|l)\s+/gi, '') // "130 g", "130g", "0,3 l", "0,3l"
            .replace(/\s+\d+(?:,\d+)*$/g, '') // trailing allergens like " 1,3,7" or " 1"
            .trim();
    }

    function setTomSelectValue(inputId, value) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        input.value = value;
        const ts = tomSelectInstances[inputId];
        if (ts) {
            ts.isProgrammaticChange = true;
            if (value) {
                if (!ts.options[value]) {
                    ts.addOption({ value: value, text: value });
                }
                ts.setValue(value);
            } else {
                ts.clear();
            }
            delete ts.isProgrammaticChange;
        }
    }

    // Načítať menu z JSON
    loadMenu();

    // Načítanie menu
    function loadMenu() {
        let dataPromise;
        
        if (typeof db !== 'undefined') {
            dataPromise = db.collection('menu').doc('daily').get()
                .then(doc => {
                    if (doc.exists) {
                        return doc.data();
                    } else {
                        throw new Error('Dokument daily v Firestore neexistuje.');
                    }
                })
                .catch(error => {
                    console.warn('Nepodarilo sa načítať z Firestore pre admina:', error);
                    return loadFallbackMenu();
                });
        } else {
            dataPromise = loadFallbackMenu();
        }
        
        function loadFallbackMenu() {
            const saved = localStorage.getItem('dailyMenuData');
            if (saved) {
                try {
                    return Promise.resolve(JSON.parse(saved));
                } catch (e) {}
            }
            if (typeof GOOGLE_SHEETS_CONFIG !== 'undefined' && GOOGLE_SHEETS_CONFIG.enabled && GOOGLE_SHEETS_CONFIG.apiKey && GOOGLE_SHEETS_CONFIG.spreadsheetId) {
                return loadFromGoogleSheets().then(sheetsData => convertSheetsDataToMenuFormat(sheetsData));
            } else {
                return fetch('/data/daily-menu.json').then(response => response.json());
            }
        }
        
        dataPromise.then(async data => {
                // Load dish catalog first so we have the autocompletes ready
                await loadDishCatalog();
                refreshCatalogDisplay();

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
                    daySection.id = 'day-section-' + dayKey;
                    if (dayKey === 'pondelok') {
                        daySection.classList.add('active-day');
                    }
                    daySection.innerHTML = `
                        <h4 class="day-title">${dayNames[dayKey]}</h4>
                        
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label><strong>Polievka:</strong></label>
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="dish-input-wrapper">
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
                                            value="${dayData.polievka?.portion || '0,3l'}">
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
                                <div class="dish-input-wrapper">
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
                                <div class="dish-input-wrapper">
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
                                <div class="dish-input-wrapper">
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

                // Initialize Tom Select on all name fields
                dayOrder.forEach(dayKey => {
                    initTomSelect(document.getElementById(`${dayKey}_polievka_name`));
                    ['menu1', 'menu2', 'menu3'].forEach(menuKey => {
                        initTomSelect(document.getElementById(`${dayKey}_${menuKey}_name`));
                    });
                });

                // Inicializácia mobilného prepínania dní
                document.querySelectorAll('.mobile-day-nav .nav-item').forEach(btn => {
                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.mobile-day-nav .nav-item').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        
                        const selectedDay = this.getAttribute('data-day');
                        document.querySelectorAll('.day-section').forEach(sec => {
                            sec.classList.remove('active-day');
                        });
                        document.getElementById('day-section-' + selectedDay)?.classList.add('active-day');
                        // Scroll to the active day container instead of the top of the page
                        document.getElementById('daysContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                });

                // Nastavenie akcie pre mobilné ukladacie tlačidlo (FAB)
                document.getElementById('mobileSaveBtn')?.addEventListener('click', function() {
                    document.querySelector('#menuForm button[type="submit"]')?.click();
                });

                // Nastavenie kliknutia mimo našepkávačov na ich zatvorenie (vyrieši problém s double-tap na iné polia na mobiloch)
                const handleOutsideClick = function(e) {
                    if (!e.target.closest('.ts-wrapper')) {
                        Object.values(tomSelectInstances).forEach(ts => {
                            ts.close();
                        });
                    }
                };
                document.addEventListener('click', handleOutsideClick);
                document.addEventListener('touchstart', handleOutsideClick, { passive: true });
            })
            .catch(error => {
                console.error('Chyba pri načítaní menu:', error);
                alert('Nepodarilo sa načítať menu: ' + error.message);
            });
    }

    // Uloženie formulára
    document.getElementById('menuForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Zozbierať dáta z formulára
        const menuData = {
            week: document.getElementById('week').value,
            price: document.getElementById('price').value,
            time: document.getElementById('time').value,
            days: {}
        };

        const newDishes = [];

        dayOrder.forEach(dayKey => {
            const polName = document.getElementById(`${dayKey}_polievka_name`).value.trim();
            const m1Name = document.getElementById(`${dayKey}_menu1_name`).value.trim();
            const m2Name = document.getElementById(`${dayKey}_menu2_name`).value.trim();
            const m3Name = document.getElementById(`${dayKey}_menu3_name`).value.trim();

            if (polName) newDishes.push(polName);
            if (m1Name) newDishes.push(m1Name);
            if (m2Name) newDishes.push(m2Name);
            if (m3Name) newDishes.push(m3Name);

            menuData.days[dayKey] = {
                polievka: {
                    name: polName,
                    portion: document.getElementById(`${dayKey}_polievka_portion`).value,
                    price: document.getElementById(`${dayKey}_polievka_price`).value || 'V cene'
                },
                menu1: {
                    name: m1Name,
                    description: document.getElementById(`${dayKey}_menu1_description`).value,
                    price: document.getElementById(`${dayKey}_menu1_price`).value || 'V cene'
                },
                menu2: {
                    name: m2Name,
                    description: document.getElementById(`${dayKey}_menu2_description`).value,
                    price: document.getElementById(`${dayKey}_menu2_price`).value || 'V cene'
                },
                menu3: {
                    name: m3Name,
                    description: document.getElementById(`${dayKey}_menu3_description`).value,
                    price: document.getElementById(`${dayKey}_menu3_price`).value || 'V cene'
                }
            };
        });

        // Auto-save newly added dishes to catalog
        let catalogChanged = false;
        const updatedCatalog = [...cachedCatalog];
        newDishes.forEach(dish => {
            if (!isDishInCatalog(dish, updatedCatalog)) {
                updatedCatalog.push(dish);
                catalogChanged = true;
            }
        });

        if (catalogChanged) {
            await saveDishCatalog(updatedCatalog);
        }

        // Uložiť do Firestore, Google Sheets (ak je nakonfigurované) alebo localStorage
        if (typeof db !== 'undefined') {
            db.collection('menu').doc('daily').set(menuData)
                .then(() => {
                    saveToLocalStorage(menuData);
                    showSuccessAndRedirect();
                })
                .catch(error => {
                    console.error('Chyba pri ukladaní do Firestore:', error);
                    alert('Chyba pri ukladaní do Firestore: ' + error.message);
                });
        } else if (typeof GOOGLE_SHEETS_CONFIG !== 'undefined' && GOOGLE_SHEETS_CONFIG.enabled && GOOGLE_SHEETS_CONFIG.apiKey && GOOGLE_SHEETS_CONFIG.spreadsheetId) {
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


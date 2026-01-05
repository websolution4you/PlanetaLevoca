# Zhrnutie zmien - Denné Menu a Admin funkcionalita (DENNE_MENU branch)

## Prehľad
Implementácia denného menu stránky s automatickým prepínaním na aktuálny deň a admin rozhraním pre jednoduchú úpravu menu. Systém podporuje zobrazenie menu pre pondelok až piatok s možnosťou prepínania medzi "Dnešný deň" a "Celý týždeň" režimom.

## Hlavné zmeny

### 1. Denné Menu stránka (`daily-menu.html`)
- **Nová stránka**: Kompletná stránka pre zobrazenie týždenného denného menu
- **Automatické prepínanie**: Pri načítaní sa automaticky zobrazí menu pre aktuálny deň
- **Víkendová logika**: Počas víkendu sa zobrazuje piatkové menu s informačnou správou
- **Dva režimy zobrazenia**:
  - **Dnešný deň**: Zobrazuje len menu pre aktuálny deň
  - **Celý týždeň**: Zobrazuje menu pre všetky dni (Pondelok - Piatok)
- **Zobrazenie dátumu**: Zobrazuje aktuálny dátum a deň pre overenie funkčnosti systému
- **Štruktúra menu pre každý deň**:
  - Polievka (názov, porcia, cena)
  - Menu 1, 2, 3 (názov, popis, cena)
- **Ceny**: Nastavené na 6,50 € (namiesto "V cene")
- **Formátovanie cien**: Ceny zostávajú v jednom riadku aj pri dlhých názvoch jedál

### 2. Admin stránka (`admin-menu.html`)
- **Nová stránka**: Jednoduché admin rozhranie pre úpravu denného menu
- **Formulár pre každý deň**: 
  - Polievka (názov, porcia, cena)
  - Menu 1, 2, 3 (názov, popis, cena)
- **Týždenné informácie**: Pole pre týždeň, cenu a čas
- **Uloženie**: Generuje JSON súbor, ktorý sa stiahne po kliknutí na "Uložiť zmeny"
- **Jednoduché použitie**: Navrhnuté pre bežného používateľa (podobne ako Facebook/Instagram)

### 3. JSON dátová štruktúra (`data/daily-menu.json`)
- **Formát**: Štruktúrovaný JSON súbor s týždennými dátami
- **Štruktúra**:
  ```json
  {
    "week": "6. - 10. november 2023",
    "price": "3,40 €",
    "time": "11:00 - 14:00",
    "days": {
      "pondelok": { ... },
      "utorok": { ... },
      ...
    }
  }
  ```
- **Každý deň obsahuje**: polievka + menu1, menu2, menu3
- **Ceny**: Aktualizované na 6,50 € pre všetky položky

### 4. JavaScript funkcionalita (`js/daily-menu.js`)
- **Dynamické načítanie**: Načítanie menu z JSON súboru
- **Automatická detekcia dňa**: Určenie aktuálneho dňa a zobrazenie príslušného menu
- **Prepínanie režimov**: Funkcia `switchView()` pre prepínanie medzi "Dnešný deň" a "Celý týždeň"
- **Víkendová logika**: Automatické zobrazenie piatkového menu počas víkendu
- **Formátovanie**: Ceny s `white-space: nowrap` a `flex-shrink-0` pre zachovanie v jednom riadku
- **Google Sheets podpora**: Pripravená štruktúra pre budúcu integráciu s Google Sheets

### 5. Admin JavaScript (`js/admin-menu.js`)
- **Načítanie dát**: Automatické načítanie aktuálneho menu z JSON
- **Vyplnenie formulára**: Automatické vyplnenie všetkých polí aktuálnymi dátami
- **Generovanie JSON**: Konverzia formulárových dát do JSON formátu
- **Stiahnutie súboru**: Automatické stiahnutie upraveného JSON súboru

### 6. Navigácia a odkazy
- **Admin odkaz**: Pridaný na koniec denného menu stránky (pred footerom)
- **Tlačidlo**: "Upraviť Menu (Admin)" s ikonou ceruzky
- **Odkaz odstránený z hlavnej navigácie**: Admin odkaz je viditeľný len na dennom menu

### 7. Dokumentácia
- **`docs/GOOGLE_SHEETS_SETUP.md`**: Návod na nastavenie Google Sheets API (pripravené na budúcnosť)
- **`data/README.md`**: Inštrukcie pre admina ako upravovať menu
- **`js/google-sheets-config.js`**: Konfiguračný súbor pre Google Sheets (pripravený, nie aktivovaný)

## Technické zmeny

### Nové súbory
- `daily-menu.html` - Stránka denného menu
- `admin-menu.html` - Admin stránka pre úpravu menu
- `js/daily-menu.js` - JavaScript pre denné menu
- `js/admin-menu.js` - JavaScript pre admin stránku
- `js/google-sheets-config.js` - Konfigurácia pre Google Sheets
- `data/daily-menu.json` - JSON súbor s menu dátami
- `docs/GOOGLE_SHEETS_SETUP.md` - Dokumentácia pre Google Sheets

### Upravené súbory
- `index.html` - Pridaný odkaz na denné menu do navigácie
- `menu.html` - Pridaný odkaz na denné menu do navigácie
- `data/daily-menu.json` - Aktualizované ceny na 6,50 €

## Použitie

### Pre návštevníkov
1. Otvoriť stránku "Denné Menu"
2. Automaticky sa zobrazí menu pre aktuálny deň
3. Možnosť prepnúť na "Celý týždeň" pre zobrazenie všetkých dní

### Pre admina
1. Otvoriť denné menu stránku
2. Kliknúť na "Upraviť Menu (Admin)" na konci stránky
3. Upraviť menu v formulári
4. Kliknúť na "Uložiť zmeny"
5. Stiahne sa JSON súbor
6. Nahradiť `data/daily-menu.json` na serveri
7. Zmeny sa zobrazia na webe

## Budúce vylepšenia
- **Google Sheets integrácia**: Možnosť editovať menu priamo v Google Sheets (pripravené, nie aktivované)
- **Automatické načítanie**: Načítanie menu priamo z Google Sheets bez potreby nahrávania JSON súboru

## Commity v tomto merge
1. **e763220** - Pridana admin stranka pre upravu menu, zmenene ceny na 6,50 EUR, upravene formatovanie cien
2. Predchádzajúce commity s implementáciou denného menu a admin funkcionality

## Výsledok
- ✅ Funkčná denné menu stránka s automatickým prepínaním
- ✅ Admin stránka pre jednoduchú úpravu menu
- ✅ JSON dátová štruktúra pre menu
- ✅ Prepínanie medzi "Dnešný deň" a "Celý týždeň"
- ✅ Víkendová logika s informačnou správou
- ✅ Zobrazenie aktuálneho dátumu a dňa
- ✅ Ceny nastavené na 6,50 €
- ✅ Formátovanie cien v jednom riadku
- ✅ Pripravená štruktúra pre Google Sheets integráciu

---

# Zhrnutie zmien - Merge kamil_branch do main

## Prehľad
Kompletná transformácia reštaurácie template na webovú stránku pre **Planéta Levoča** s lokalizáciou do slovenčiny a prispôsobením obsahu.

## Hlavné zmeny

### 1. Transformácia obsahu
- **Lokalizácia**: Všetky stránky preložené do slovenčiny
- **Názov reštaurácie**: Aktualizovaný na "Planéta Levoča" (s diakritikou) na všetkých stránkach
- **Obsah stránok**: 
  - História reštaurácie od roku 2007
  - Informácie o Levoči a UNESCO dedičstve
  - Catering a organizovanie osláv/eventov
  - Denné menu (3,40 €)
  - Suveníry spojené s Levočou

### 2. Galéria
- **Nová stránka**: `gallery.html` s filtrom kategórií a modalným zobrazením
- **12 kategórií obrázkov**: Interiér, Jedlá, Terasa, Oslavy, Špeciality, Atmosféra, Levoča, Menu, Catering, Námestie, Svadby, Eventy
- **Synchronizácia**: Obrázky v `index.html` a `gallery.html` sú identické
- **Všetky obrázky**: Nahradené skutočnými fotografiami z reštaurácie

### 3. Vizuálne úpravy
- **Hero sekcia**: 
  - Okrúhly rotujúci obrázok s optimalizovanou veľkosťou
  - Background obrázok zmenený na `levoca.jpg`
  - Upravená opacity pre lepšiu viditeľnosť
- **Sekcia "Čo ponúkame"**: 
  - Background obrázky pre každý box (catering, jedlá, eventy, suveníry)
  - Opacity nastavená na 0.20 pre lepšiu čitateľnosť textu

### 4. Recenzie
- **Sekcia recenzií**: Aktualizovaná s Google recenziami
- **JavaScript integrácia**: `js/google-reviews.js` pre načítanie skutočných recenzií z Google Places API
- **Fallback recenzie**: Príklady recenzií, ak API nie je nakonfigurované
- **Zobrazenie**: Hviezdičky, mená recenzentov, Google branding
- **Stránka recenzií**: `testimonial.html` kompletne upravená

### 5. Kontaktné informácie
- **Otváracie hodiny**:
  - 1. október - 30. apríl: Pon-Ne 8:00 - 18:00
  - 1. máj - 30. september: Pon-Ne 7:30 - 18:00
- **Kontakty**: Adresa, telefón, email aktualizované
- **Sociálne siete**: Odkaz len na Facebook (odstránený odkaz na oficiálnu stránku)

### 6. Technické zmeny
- **Nové súbory**:
  - `gallery.html` - Galéria s filtrom
  - `js/google-reviews.js` - Načítanie Google recenzií
- **Upravené súbory**:
  - `index.html` - Hlavná stránka
  - `about.html` - O nás
  - `service.html` - Služby
  - `menu.html` - Menu
  - `contact.html` - Kontakt
  - `booking.html` - Rezervácia
  - `testimonial.html` - Recenzie
  - `css/style.css` - Štýly pre hero sekciu

## Poznámky pre nasadenie
- Pre aktiváciu skutočných Google recenzií je potrebné:
  1. Získať Google Places API kľúč
  2. Nájsť Place ID pre Planeta Levoča
  3. Upraviť `js/google-reviews.js` s týmito údajmi

## Počet commitov
35+ commitov s detailnými zmenami

---

# Zhrnutie zmien - Merge peto_branch do main

## Prehľad
Integrácia slovenského menu s detailným zoznamom jedál a interaktívnym modalom pre zobrazenie detailov jedla. Tento merge kombinuje najnovšie zmeny z `main` branchu s kompletným slovenským menu a novou funkcionalitou.

## Hlavné zmeny

### 1. Slovenské menu - Kompletná implementácia
- **5 kategórií menu**:
  1. **Ranajky** (8 položiek)
     - Malé raňajky (4,00 €)
     - Veľké raňajky (6,90 €)
     - Müsli raňajky (6,90 €)
     - Planéta raňajky (6,90 €)
     - Levoča raňajky (6,90 €)
     - Zeleninová omeleta 150g (4,00 €)
     - 2 ks Spišské párky (4,00 €)
     - 2 ks Zipser Würstchen (4,00 €)
  
  2. **Polievky** (Kompletný zoznam slovenských polievok)
  
  3. **Hlavné jedlá** (Rozsiahly výber hlavných jedál)
  
  4. **Dezerty** (Rôzne sladkosti a dezerty)
  
  5. **Napoje** (Káva, čaje, nealkoholické a alkoholické nápoje)

- **Detailné popisy**: Každá položka má detailný popis zloženia a príloh
- **Ceny v EUR**: Všetky ceny zobrazené v eurách
- **Slovenské názvy**: Kompletne lokalizované názvy jedál

### 2. Interaktívny modal pre detail jedla
- **Funkcionalita**: Kliknutie na akúkoľvek menu položku otvorí modal s detailom
- **Zobrazenie v modale**:
  - Veľký obrázok jedla
  - Názov jedla
  - Detailný popis zloženia
  - Cena
- **Bootstrap Modal**: Použitý Bootstrap 5 modal komponent
- **JavaScript integrácia**: Automatické načítanie dát z HTML štruktúry
- **Responzívny dizajn**: Modal sa prispôsobí veľkosti obrazovky

### 3. Integrácia zmien z main branchu
- **Merge najnovších zmien**: Všetky zmeny z `main` branchu integrované
- **Zachované funkcie**: 
  - Google recenzie
  - Galéria
  - Všetky obrázky a vizuálne úpravy
  - Kontaktné informácie
- **Konfliktové riešenie**: 
  - Zachované slovenské menu z `peto_branch`
  - Integrované najnovšie zmeny z `main`
  - Odstránené duplicitné informácie o dennom menu

### 4. Oprava base tagu pre lokálny vývoj
- **Problém**: Statický `<base href="/PlanetaLevoca/">` tag kazil cesty k obrázkom pri lokálnom vývoji
- **Riešenie**: Dynamický JavaScript, ktorý nastaví base tag len pre GitHub Pages
- **Výsledok**: 
  - Lokálne funguje bez problémov (všetky cesty relatívne)
  - Na GitHub Pages funguje správne (base tag sa nastaví automaticky)

## Technické zmeny

### Upravené súbory
- **`menu.html`**: 
  - Kompletne prepracované menu s 5 kategóriami
  - Pridaný Bootstrap modal pre detail jedla
  - JavaScript pre interakciu s modalom
  - 395 pridaných riadkov, 110 odstránených
  
- **`index.html`**: 
  - Oprava base tagu pre lokálny vývoj
  - Zachované všetky zmeny z main branchu

### JavaScript funkcionalita
```javascript
// Automatické zachytenie klikov na menu položky
// Načítanie dát (názov, cena, popis, obrázok)
// Zobrazenie v Bootstrap modale
```

## Štruktúra menu

### Kategórie a ikony
- **Ranajky**: `fa-coffee` ikona
- **Polievky**: `fa-bowl-food` ikona  
- **Hlavné jedlá**: `fa-utensils` ikona
- **Dezerty**: `fa-birthday-cake` ikona
- **Napoje**: `fa-glass` ikona

### Formátovanie
- Každá položka má:
  - Malý obrázok (80px)
  - Názov jedla
  - Cenu (zvýraznená primárnou farbou)
  - Detailný popis (kurzíva)

## Commity v tomto merge
1. **dd9a49b** - Pridaný modal pre detail jedla - kliknutie na menu položku otvorí detail
2. **9673061** - Aplikované slovenské menu - Ranajky, Polievky, Hlavné jedlá, Dezerty, Napoje
3. **53c622e** - Merge main into peto_branch: Integrácia najnovších zmien z main s zachovaním slovenského menu

## Výsledok
- ✅ Kompletné slovenské menu s 5 kategóriami
- ✅ Interaktívny modal pre detail jedla
- ✅ Integrované najnovšie zmeny z main
- ✅ Opravené cesty pre lokálny vývoj
- ✅ Zachovaná všetka funkcionalita z main branchu

## Poznámky
- Menu je pripravené na ďalšie rozšírenie (možnosť pridania ďalších kategórií)
- Modal je univerzálny a funguje pre všetky menu položky
- Všetky ceny sú v eurách a pripravené na aktualizáciu

---

# Zhrnutie zmien - Vylepšenie denného menu UI (peto_branch)

## Prehľad
Vylepšenie používateľského rozhrania denného menu s dôrazom na zjednodušenie, zlepšenie čitateľnosti a používateľského zážitku.

## Hlavné zmeny

### 1. Odstránenie sekcie "Denné Menu & Špeciality" z hlavnej stránky
- **Súbor**: `index.html`
- **Zmena**: Odstránená celá sekcia s tabmi (Aktuálne Denné Menu, Špecialita Hlavné Jedlá, Nápoje Káva & Nápoje)
- **Dôvod**: Denné menu má vlastnú stránku (`daily-menu.html`), duplicitná sekcia na hlavnej stránke bola zbytočná

### 2. Optimalizácia "Back to Top" tlačidla
- **Súbor**: `js/main.js`
- **Zmena**: Nahradená jQuery animácia (1500ms) natívnym `window.scrollTo()` s `behavior: 'smooth'`
- **Výhody**: 
  - Rýchlejšia odozva na kliknutie
  - Plynulejšie scrollovanie
  - Lepšia výkonnosť (natívna implementácia prehliadača)

### 3. Zobrazenie aktuálneho dátumu v tlačidle "Dnešný deň"
- **Súbory**: `daily-menu.html`, `js/daily-menu.js`
- **Zmena**: 
  - Pridaný dátum pod textom tlačidla "Dnešný deň" vo formáte "Pondelok, 5. január 2026"
  - Dátum je zobrazený červenou farbou (`text-danger`) a tučným písmom (`fw-bold`) pre lepšiu viditeľnosť
  - Automatická aktualizácia pri načítaní stránky
- **Funkcionalita**: Nová funkcia `updateCurrentDayDate()` formátuje a zobrazuje aktuálny dátum

### 4. Odstránenie ikon kalendára
- **Súbory**: `daily-menu.html`, `js/daily-menu.js`
- **Zmeny**:
  - Odstránená ikona kalendára z tlačidla "Dnešný deň"
  - Odstránená ikona kalendára z tlačidla "Celý týždeň"
  - Odstránené ikony kalendára z nadpisov dní v týždennom zobrazení
- **Dôvod**: Zjednodušenie UI, ikony boli zbytočné

### 5. Zobrazenie nadpisu dňa pri dennom zobrazení
- **Súbor**: `js/daily-menu.js`
- **Zmena**: Pri zobrazení len denného menu sa teraz zobrazuje nadpis aktuálneho dňa (napr. "Pondelok") rovnako ako pri týždennom zobrazení
- **Výhoda**: Konzistentné zobrazenie, používateľ vždy vidí, ktorý deň sa zobrazuje

### 6. Zväčšenie rozostupu medzi dňami v týždennom zobrazení
- **Súbor**: `js/daily-menu.js`
- **Zmena**: Pridaný `marginTop: '7rem'` na každý deň okrem prvého v týždennom zobrazení
- **Výhoda**: Lepšia čitateľnosť a prehľadnosť pri zobrazení celého týždňa

### 7. Odstránenie duplicitného zobrazenia dátumu
- **Súbory**: `daily-menu.html`, `js/daily-menu.js`
- **Zmena**: Odstránený riadok "Dnes: Pondelok, 5. januára 2026" z hlavičky stránky
- **Dôvod**: Dátum je už zobrazený v tlačidle "Dnešný deň", duplicitné zobrazenie bolo zbytočné

## Technické detaily

### Upravené súbory:
- `index.html` - odstránenie sekcie denného menu
- `daily-menu.html` - úpravy tlačidiel a odstránenie duplicitného dátumu
- `js/main.js` - optimalizácia "Back to Top" funkcie
- `js/daily-menu.js` - nová funkcia pre dátum, úpravy zobrazenia, rozostupy

### Nové funkcie:
- `updateCurrentDayDate()` - formátuje a zobrazuje aktuálny dátum v tlačidle

### CSS zmeny:
- Pridané `text-danger fw-bold` na dátum v tlačidle pre lepšiu viditeľnosť
- Pridaný inline style `marginTop: '7rem'` pre rozostup medzi dňami

## Commity v tomto merge
1. **2b8a01f** - Vylepsenie denneho menu: UI upravy, odstranenie ikon, zobrazenie datumu, rozostup medzi dnymi

## Výsledok
- ✅ Zjednodušené UI denného menu
- ✅ Rýchlejšie "Back to Top" tlačidlo
- ✅ Zobrazenie aktuálneho dátumu v tlačidle
- ✅ Konzistentné zobrazenie nadpisov dní
- ✅ Lepšia čitateľnosť týždenného zobrazenia
- ✅ Odstránené zbytočné duplicitné informácie

## Poznámky
- Všetky zmeny sú spätne kompatibilné
- Žiadne breaking changes
- Zmeny zlepšujú používateľský zážitok bez zmeny funkcionality


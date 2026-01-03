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


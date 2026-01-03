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



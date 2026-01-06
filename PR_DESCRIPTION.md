# Vylepšenie denného menu - UI úpravy a zlepšenie používateľského zážitku

## Prehľad
Tento PR obsahuje viacero vylepšení denného menu stránky, zameraných na zjednodušenie UI, zlepšenie čitateľnosti a používateľského zážitku.

## Hlavné zmeny

### 1. Odstránenie sekcie "Denné Menu & Špeciality" z hlavnej stránky
- **Súbor**: `index.html`
- **Zmena**: Odstránená celá sekcia s tabmi (Aktuálne Denné Menu, Špecialita Hlavné Jedlá, Nápoje Káva & Nápoje)
- **Dôvod**: Denné menu má vlastnú stránku (`daily-menu.html`), duplicitná sekcia na hlavnej stránke bola zbytočná

### 2. Vylepšenie tlačidla "Back to Top"
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
  - Dátum je zobrazený červenou farbou a tučným písmom pre lepšiu viditeľnosť
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

## Testovanie
- ✅ Zobrazenie denného menu funguje správne
- ✅ Zobrazenie týždenného menu funguje správne
- ✅ Prepínanie medzi režimami funguje
- ✅ Dátum sa zobrazuje správne
- ✅ "Back to Top" tlačidlo funguje rýchlejšie
- ✅ Rozostupy medzi dňami sú dostatočné

## Screenshoty
- Dátum sa zobrazuje červenou farbou pod tlačidlom "Dnešný deň"
- Nadpis dňa sa zobrazuje aj pri dennom zobrazení
- Týždenné zobrazenie má dostatočný rozostup medzi dňami

## Poznámky
- Všetky zmeny sú spätne kompatibilné
- Žiadne breaking changes
- Zmeny zlepšujú používateľský zážitok bez zmeny funkcionality


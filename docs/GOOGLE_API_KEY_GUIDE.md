# Návod: Ako získať Google Sheets API kľúč

## Krok 1: Vytvorenie projektu v Google Cloud Console

1. Prejdite na [Google Cloud Console](https://console.cloud.google.com/)
2. Ak nemáte účet, prihláste sa pomocou svojho Google účtu
3. Kliknite na dropdown v hornej časti (kde je názov projektu) alebo na "Select a project"
4. Kliknite na "NEW PROJECT" (Nový projekt)
5. Zadajte názov projektu (napr. "Planeta Levoca Menu")
6. Kliknite na "CREATE" (Vytvoriť)
7. Počkajte, kým sa projekt vytvorí (môže to trvať niekoľko sekúnd)

## Krok 2: Povolenie Google Sheets API

1. V Google Cloud Console vyberte váš nový projekt (ak nie je automaticky vybraný)
2. V ľavom menu kliknite na "APIs & Services" > "Library" (Knižnica)
3. Do vyhľadávacieho poľa zadajte "Google Sheets API"
4. Kliknite na "Google Sheets API" v zozname výsledkov
5. Kliknite na modré tlačidlo "ENABLE" (Povoliť)
6. Počkajte, kým sa API povolí (zvyčajne okamžite)

## Krok 3: Vytvorenie API kľúča

1. V ľavom menu kliknite na "APIs & Services" > "Credentials" (Poverenia)
2. Kliknite na "CREATE CREDENTIALS" (Vytvoriť poverenia) v hornej časti stránky
3. Z rozbaľovacieho menu vyberte "API key" (API kľúč)
4. Zobrazí sa dialógové okno s vaším novým API kľúčom
5. **DÔLEŽITÉ**: Skopírujte API kľúč (vyzerá ako: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
6. Kliknite na "CLOSE" (Zavrieť)

## Krok 4: Obmedzenie API kľúča (Odporúčané pre bezpečnosť)

1. V sekcii "API keys" kliknite na váš novovytvorený API kľúč
2. V sekcii "API restrictions" (Obmedzenia API):
   - Vyberte "Restrict key" (Obmedziť kľúč)
   - V "Select APIs" vyberte "Google Sheets API"
3. V sekcii "Application restrictions" (Obmedzenia aplikácie):
   - Vyberte "HTTP referrers (web sites)" (HTTP referrery - webové stránky)
   - Pridajte vašu doménu (napr. `https://websolution4you.github.io/*`)
   - Pre lokálne testovanie pridajte: `http://localhost:*` a `http://127.0.0.1:*`
4. Kliknite na "SAVE" (Uložiť) v dolnej časti stránky

## Krok 5: Zápis API kľúča do projektu

1. Otvorte súbor `js/google-sheets-config.js` vo vašom projekte
2. Nájdite riadok: `apiKey: '',`
3. Vložte váš API kľúč medzi úvodzovky:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    apiKey: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Váš API kľúč
    spreadsheetId: '',
    range: 'Sheet1!A1:O100',
    sheetName: 'Sheet1',
    enabled: false,
    webhookUrl: ''
};
```

4. **DÔLEŽITÉ**: Uložte súbor

## Krok 6: Získanie ID Google Sheets dokumentu

1. Otvorte váš Google Sheets dokument
2. Pozrite sa na URL v prehliadači
3. URL vyzerá takto: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
4. Skopírujte časť medzi `/d/` a `/edit` - toto je vaše `spreadsheetId`
5. Vložte ho do `js/google-sheets-config.js`:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    apiKey: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', // Váš Spreadsheet ID
    range: 'Sheet1!A1:O100',
    sheetName: 'Sheet1',
    enabled: false,
    webhookUrl: ''
};
```

## Krok 7: Aktivácia Google Sheets integrácie

1. V súbore `js/google-sheets-config.js` zmeňte `enabled: false` na `enabled: true`:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    apiKey: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Sheet1!A1:O100',
    sheetName: 'Sheet1',
    enabled: true, // Zmenené na true
    webhookUrl: ''
};
```

2. Uložte súbor

## Testovanie

1. Otvorte `daily-menu.html` v prehliadači
2. Ak je všetko správne nastavené, menu by sa malo načítať z Google Sheets
3. Ak nie, skontrolujte konzolu prehliadača (F12) pre chybové správy

## Bezpečnostné poznámky

⚠️ **DÔLEŽITÉ**:
- API kľúč je viditeľný v JavaScripte, preto je dôležité ho obmedziť (Krok 4)
- Obmedzte API kľúč len na Google Sheets API
- Obmedzte prístup len na vašu doménu
- Nikdy nezdieľajte API kľúč verejne
- Pre produkciu použite obmedzený API kľúč

## Riešenie problémov

**Chyba: "API key not valid"**
- Skontrolujte, či je API kľúč správne skopírovaný
- Skontrolujte, či je Google Sheets API povolené

**Chyba: "The request cannot be completed because you have exceeded your quota"**
- Google Sheets API má bezplatný limit
- Skontrolujte, či ste neprekročili limit

**Chyba: "Access denied"**
- Skontrolujte, či je Google Sheets dokument zdieľaný (Share > Anyone with the link can view)
- Skontrolujte obmedzenia API kľúča



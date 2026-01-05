# Google Apps Script Webhook pre ukladanie do Google Sheets

## Prehľad
Pre ukladanie dát do Google Sheets cez API potrebujeme autentifikáciu (OAuth 2.0). Najjednoduchšie riešenie je použiť Google Apps Script ako webhook, ktorý prijme dáta a uloží ich do Sheets.

## Krok 1: Vytvorenie Google Apps Script

1. Prejdite na [Google Apps Script](https://script.google.com/)
2. Kliknite na "Nový projekt"
3. Vložte nasledujúci kód:

```javascript
function doPost(e) {
  try {
    // Parsovať JSON dáta z requestu
    const data = JSON.parse(e.postData.contents);
    
    // ID vášho Google Sheets dokumentu
    const SPREADSHEET_ID = 'VÁŠ_SPREADSHEET_ID';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Vymazať staré dáta (okrem hlavičky)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    // Vytvoriť hlavičku
    const header = [
      'Týždeň', 'Cena', 'Čas', 'Deň',
      'Polievka - Názov', 'Polievka - Porcia', 'Polievka - Cena',
      'Menu 1 - Názov', 'Menu 1 - Popis', 'Menu 1 - Cena',
      'Menu 2 - Názov', 'Menu 2 - Popis', 'Menu 2 - Cena',
      'Menu 3 - Názov', 'Menu 3 - Popis', 'Menu 3 - Cena'
    ];
    
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    
    // Pridať dáta pre každý deň
    const dayOrder = ['pondelok', 'utorok', 'streda', 'stvrtok', 'piatok'];
    const rows = [];
    
    dayOrder.forEach(dayKey => {
      const dayData = data.days[dayKey];
      if (!dayData) return;
      
      const row = [
        data.week || '',
        data.price || '',
        data.time || '',
        dayKey,
        dayData.polievka?.name || '',
        dayData.polievka?.portion || '',
        dayData.polievka?.price || 'V cene',
        dayData.menu1?.name || '',
        dayData.menu1?.description || '',
        dayData.menu1?.price || 'V cene',
        dayData.menu2?.name || '',
        dayData.menu2?.description || '',
        dayData.menu2?.price || 'V cene',
        dayData.menu3?.name || '',
        dayData.menu3?.description || '',
        dayData.menu3?.price || 'V cene'
      ];
      
      rows.push(row);
    });
    
    // Zapísať dáta do tabuľky
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, header.length).setValues(rows);
    }
    
    // Vrátiť úspešnú odpoveď
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Dáta boli úspešne uložené'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Vrátiť chybovú odpoveď
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Nahraďte `VÁŠ_SPREADSHEET_ID` skutočným ID vašej Google Sheets tabuľky
5. Uložte projekt (Ctrl+S alebo Cmd+S)

## Krok 2: Nasadenie ako Web App

1. V Google Apps Script kliknite na "Nasadiť" > "Nová nasadenie"
2. Vyberte typ: "Webová aplikácia"
3. Nastavte:
   - **Popis**: "Daily Menu Webhook"
   - **Spúšťať ako**: "Ja"
   - **Kto má prístup**: "Všetci"
4. Kliknite na "Nasadiť"
5. Skopírujte **Web App URL** - toto je váš webhook URL

## Krok 3: Konfigurácia v projekte

1. Otvorte `js/google-sheets-config.js`
2. Nastavte `webhookUrl` na URL z kroku 2:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    apiKey: 'VÁŠ_API_KĽÚČ',
    spreadsheetId: 'VÁŠ_SPREADSHEET_ID',
    range: 'Sheet1!A1:O100',
    sheetName: 'Sheet1',
    enabled: true,
    webhookUrl: 'https://script.google.com/macros/s/VÁŠ_SCRIPT_ID/exec'
};
```

## Testovanie

1. Otvorte `admin-menu.html`
2. Upravte menu
3. Kliknite na "Uložiť zmeny"
4. Skontrolujte Google Sheets tabuľku - dáta by mali byť uložené

## Bezpečnostné poznámky

- Webhook URL je verejne dostupný, ale dáta sa ukladajú len do vášho Google Sheets
- Pre dodatočnú bezpečnosť môžete pridať autentifikáciu do Google Apps Script
- Zvážte obmedzenie prístupu len pre vašu doménu




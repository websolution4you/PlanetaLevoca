// Google Sheets Configuration
// ============================================
// INŠTRUKCIE PRE NASTAVENIE:
// 1. Získajte API kľúč z Google Cloud Console (viď docs/GOOGLE_API_KEY_GUIDE.md)
// 2. Vložte API kľúč do riadku 8 (medzi úvodzovky)
// 3. Vložte Spreadsheet ID do riadku 11 (z URL Google Sheets dokumentu)
// 4. Ak chcete používať Google Sheets, nastavte enabled: true na riadku 20
// ============================================

const GOOGLE_SHEETS_CONFIG = {
    // API kľúč z Google Cloud Console (pre načítanie dát)
    // Príklad: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    // KAM DAŤ: Vložte váš API kľúč medzi úvodzovky ↓
    apiKey: '',
    
    // ID dokumentu z Google Sheets URL (medzi /d/ a /edit)
    // Príklad: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
    // KAM DAŤ: Vložte Spreadsheet ID medzi úvodzovky ↓
    spreadsheetId: '',
    
    // Rozsah dát v tabuľke (napr. 'Sheet1!A1:O100')
    range: 'Sheet1!A1:O100',
    
    // Názov listu v Google Sheets
    sheetName: 'Sheet1',
    
    // Aktívne použitie Google Sheets
    // false = používa sa JSON súbor/localStorage
    // true = používa sa Google Sheets (vyžaduje apiKey a spreadsheetId)
    enabled: false,
    
    // URL pre Google Apps Script webhook (pre ukladanie dát)
    // Vytvorte Google Apps Script a nastavte sem jeho webhook URL
    // Príklad: 'https://script.google.com/macros/s/AKfycby.../exec'
    webhookUrl: ''
};


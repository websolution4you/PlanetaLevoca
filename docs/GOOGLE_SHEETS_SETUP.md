# Google Sheets Integrácia - Návod na nastavenie

## Prehľad
Tento návod popisuje, ako nastaviť Google Sheets integráciu pre úpravu denného menu.

## Krok 1: Vytvorenie Google Sheets dokumentu

1. Vytvorte nový Google Sheets dokument
2. Nastavte štruktúru tabuľky podľa tohto vzoru:

| Týždeň | Cena | Čas | Deň | Polievka - Názov | Polievka - Porcia | Polievka - Cena | Menu 1 - Názov | Menu 1 - Popis | Menu 1 - Cena | Menu 2 - Názov | Menu 2 - Popis | Menu 2 - Cena | Menu 3 - Názov | Menu 3 - Popis | Menu 3 - Cena |
|--------|------|-----|-----|-----------------|-------------------|-----------------|----------------|---------------|---------------|----------------|---------------|---------------|----------------|---------------|---------------|
| 6. - 10. november 2023 | 3,40 € | 11:00 - 14:00 | pondelok | Kulajda / Kurací vývar | 0,3l | V cene | ½ Bryndza, ½ kapustové halušky | 250g | V cene | ... | ... | ... | ... | ... | ... |

3. Zdieľajte dokument (Share) - nastavte na "Anyone with the link can view"
4. Skopírujte ID dokumentu z URL (medzi `/d/` a `/edit`)

## Krok 2: Nastavenie Google Sheets API

1. Prejdite na [Google Cloud Console](https://console.cloud.google.com/)
2. Vytvorte nový projekt alebo vyberte existujúci
3. Povoľte Google Sheets API:
   - Prejdite na "APIs & Services" > "Library"
   - Vyhľadajte "Google Sheets API"
   - Kliknite "Enable"
4. Vytvorte API kľúč:
   - Prejdite na "APIs & Services" > "Credentials"
   - Kliknite "Create Credentials" > "API Key"
   - Skopírujte API kľúč

## Krok 3: Konfigurácia v projekte

1. Otvorte súbor `js/google-sheets-config.js` a vyplňte:
```javascript
const GOOGLE_SHEETS_CONFIG = {
    apiKey: 'VÁŠ_API_KĽÚČ',
    spreadsheetId: 'ID_VAŠEHO_DOKUMENTU',
    range: 'Sheet1!A1:O100',
    sheetName: 'Sheet1',
    enabled: true,
    webhookUrl: 'VÁŠ_WEBHOOK_URL' // Pozri GOOGLE_APPS_SCRIPT_WEBHOOK.md
};
```

2. **DÔLEŽITÉ**: Pre produkciu použite obmedzený API kľúč (len pre Sheets API a len pre váš doménu)

## Krok 4: Nastavenie webhooku pre ukladanie

Pre ukladanie dát do Google Sheets potrebujete nastaviť Google Apps Script webhook. Pozri [GOOGLE_APPS_SCRIPT_WEBHOOK.md](./GOOGLE_APPS_SCRIPT_WEBHOOK.md) pre detailný návod.

## Krok 5: Testovanie

JavaScript automaticky načíta dáta z Google Sheets pomocou Google Sheets API v4 a uloží dáta cez webhook (ak je nakonfigurovaný).

## Bezpečnostné poznámky

- **Nikdy** nezverejňujte API kľúč v kóde, ktorý je verejne dostupný
- Pre GitHub Pages použite obmedzený API kľúč
- Zvážte použitie backend služby ako proxy (napr. Netlify Functions, Vercel Functions)

## Alternatíva: Publikovať ako CSV

Jednoduchšia alternatíva bez API:
1. V Google Sheets: File > Share > Publish to web > CSV
2. Získajte verejný link
3. Načítajte CSV pomocou JavaScriptu

## Testovanie

Po nastavení otestujte:
1. Otvorte `admin-menu.html`
2. Skontrolujte, či sa menu načíta z Google Sheets
3. Upravte menu v Google Sheets
4. Obnovte stránku a skontrolujte, či sa zmeny zobrazia


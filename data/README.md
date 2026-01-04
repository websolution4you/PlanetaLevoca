# Denné Menu - Návod na úpravu

## Ako upraviť denné menu

Denné menu sa upravuje v súbore `daily-menu.json`. Tento súbor obsahuje menu pre celý týždeň (Pondelok - Piatok).

### Štruktúra súboru

```json
{
  "week": "Týždeň 1. - 7. január 2026",
  "price": "3,40 €",
  "days": {
    "pondelok": {
      "polievka": {
        "name": "Názov polievky",
        "price": "V cene"
      },
      "menu1": {
        "name": "Názov menu 1",
        "description": "Popis menu 1",
        "price": "V cene"
      },
      "menu2": {
        "name": "Názov menu 2",
        "description": "Popis menu 2",
        "price": "V cene"
      },
      "menu3": {
        "name": "Názov menu 3",
        "description": "Popis menu 3",
        "price": "V cene"
      }
    }
  }
}
```

### Ako upraviť

1. Otvorte súbor `data/daily-menu.json` v textovom editore
2. Upravte názvy jedál, popisy a ceny pre každý deň
3. Uložte súbor
4. Zmeny sa zobrazia na stránke `daily-menu.html`

### Príklad úpravy

Ak chcete zmeniť menu na pondelok:

```json
"pondelok": {
  "polievka": {
    "name": "Gulášová polievka",
    "price": "V cene"
  },
  "menu1": {
    "name": "Sviečková na smotane",
    "description": "S knedľou a brusnicami",
    "price": "V cene"
  },
  "menu2": {
    "name": "Rezeň s hranolkami",
    "description": "Kurací rezeň, hranolky, zeleninový šalát",
    "price": "V cene"
  },
  "menu3": {
    "name": "Penne s kuracím mäsom",
    "description": "Penne, kuracie mäso, smotana, parmezán",
    "price": "V cene"
  }
}
```

### Dôležité poznámky

- **Cena**: Ak je cena "V cene", znamená to, že je súčasťou denného menu za 3,40 €
- **Popis**: Popis je voliteľný, ale odporúča sa ho pridať pre lepšiu informovanosť hostí
- **Formátovanie**: Dávajte pozor na správne formátovanie JSON (čárky, úvodzovky)
- **Validácia**: Pred uložením skontrolujte, či je JSON validný (môžete použiť online JSON validator)

### Validácia JSON

Ak chcete skontrolovať, či je váš JSON správny, použite:
- https://jsonlint.com/
- https://jsonformatter.org/

### Tipy

- Menu sa aktualizuje každý týždeň
- Nezabudnite aktualizovať aj pole `"week"` s aktuálnym týždňom
- Ak chcete zmeniť cenu denného menu, upravte pole `"price"`



/**
 * Planéta Levoča - Language Switcher
 * Vloží vlajky do navbaru, aplikuje preklady cez data-i18n atribúty
 * Ukladá voľbu jazyka do localStorage
 */

(function () {
    // --- Vloženie lišty s vlajkami pod navbar ---
    function injectLangFlags() {
        const navbar = document.querySelector('.container-xxl.position-relative.p-0');
        if (!navbar) return;

        const flags = [
            { code: 'sk', flag: 'sk', label: 'SK' },
            { code: 'en', flag: 'gb', label: 'EN' },
            { code: 'de', flag: 'de', label: 'DE' },
            { code: 'pl', flag: 'pl', label: 'PL' },
        ];

        const bar = document.createElement('div');
        bar.id = 'lang-bar';
        bar.style.cssText = [
            'position: absolute',
            'bottom: 16px',
            'right: 24px',
            'z-index: 999',
            'display: flex',
            'align-items: center',
            'gap: 6px',
            'background: rgba(0,0,0,0.45)',
            'backdrop-filter: blur(4px)',
            'padding: 5px 10px',
            'border-radius: 30px',
        ].join(';');

        flags.forEach(f => {
            const btn = document.createElement('button');
            btn.className = 'lang-flag-btn';
            btn.setAttribute('data-lang', f.code);
            btn.title = f.label;
            btn.style.cssText = [
                'background: none',
                'border: 2px solid transparent',
                'border-radius: 5px',
                'padding: 2px',
                'opacity: 0.55',
                'cursor: pointer',
                'transition: all 0.2s',
                'display: flex',
                'align-items: center',
            ].join(';');
            btn.innerHTML = `<img src="https://flagcdn.com/w40/${f.flag}.png" alt="${f.label}" style="width:28px;height:19px;object-fit:cover;border-radius:2px;display:block;">`;
            btn.addEventListener('click', () => switchLang(f.code));
            bar.appendChild(btn);
        });

        // Vlož lištu ako posledný element v hero kontajneri
        navbar.appendChild(bar);
    }

    // --- Aplikovanie prekladov ---
    function applyTranslations(lang) {
        const t = siteTranslations[lang];
        if (!t) return;

        // data-i18n atribúty (innerText)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                el.innerHTML = t[key];
            }
        });

        // data-i18n-placeholder atribúty (placeholder)
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key] !== undefined) {
                el.placeholder = t[key];
            }
        });

        // Aktualizácia aktívneho tlačidla vlajky
        document.querySelectorAll('.lang-flag-btn').forEach(btn => {
            const isActive = btn.getAttribute('data-lang') === lang;
            btn.style.opacity = isActive ? '1' : '0.5';
            btn.style.borderColor = isActive ? '#FEA116' : 'transparent';
            btn.style.transform = isActive ? 'scale(1.15)' : 'scale(1)';
        });

        // Uloženie do localStorage
        localStorage.setItem('planeta_lang', lang);

        // Ak má stránka vlastný handler (napr. menu.html), zavolaj ho
        if (typeof onLangChange === 'function') {
            onLangChange(lang);
        }
    }

    // --- Prepnutie jazyka ---
    function switchLang(lang) {
        applyTranslations(lang);
    }

    // --- Inicializácia ---
    function init() {
        injectLangFlags();

        // Načítaj uložený jazyk alebo SK ako default
        const saved = localStorage.getItem('planeta_lang') || 'sk';
        applyTranslations(saved);
    }

    // Spusti po načítaní DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

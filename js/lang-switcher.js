/**
 * Planéta Levoča - Language Switcher
 * Vloží vlajky do navbaru, aplikuje preklady cez data-i18n atribúty
 * Ukladá voľbu jazyka do localStorage
 */

(function () {
    // --- Vloženie vlajok do navbaru ---
    function injectLangFlags() {
        const navContent = document.querySelector('.navbar-nav');
        if (!navContent) return;

        const flags = [
            { code: 'sk', flag: 'sk', label: 'SK' },
            { code: 'en', flag: 'gb', label: 'EN' },
            { code: 'de', flag: 'de', label: 'DE' },
            { code: 'pl', flag: 'pl', label: 'PL' },
        ];

        const wrapper = document.createElement('div');
        wrapper.className = 'd-flex align-items-center gap-1 ms-2 lang-flags-nav';
        wrapper.style.cssText = 'border-left: 1px solid rgba(255,255,255,0.2); padding-left: 12px; margin-left: 4px;';

        flags.forEach(f => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm lang-flag-btn p-0';
            btn.setAttribute('data-lang', f.code);
            btn.title = f.label;
            btn.style.cssText = 'background:none; border:2px solid transparent; border-radius:4px; padding:2px!important; opacity:0.6; transition:all 0.2s; cursor:pointer;';
            btn.innerHTML = `<img src="https://flagcdn.com/w40/${f.flag}.png" alt="${f.label}" style="width:24px;height:16px;object-fit:cover;display:block;">`;
            btn.addEventListener('click', () => switchLang(f.code));
            wrapper.appendChild(btn);
        });

        navContent.appendChild(wrapper);
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

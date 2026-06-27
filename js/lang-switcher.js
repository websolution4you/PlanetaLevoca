/**
 * Planéta Levoča - Language Switcher
 * Vloží vlajky pod navbar, aplikuje preklady cez data-i18n atribúty.
 * data-show-lang="sk"  — element viditeľný iba pre daný jazyk (napr. Denné menu)
 * Ukladá voľbu jazyka do localStorage
 */

(function () {

    function injectLangFlags() {
        var navbar = document.querySelector('.container-xxl.position-relative.p-0');
        if (!navbar) return;

        var flags = [
            { code: 'sk', flag: 'sk', label: 'SK' },
            { code: 'en', flag: 'gb', label: 'EN' },
            { code: 'de', flag: 'de', label: 'DE' },
            { code: 'pl', flag: 'pl', label: 'PL' },
        ];

        var bar = document.createElement('div');
        bar.id = 'lang-bar';
        bar.style.cssText = 'position:absolute;bottom:16px;right:24px;z-index:999;display:flex;align-items:center;gap:6px;background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);padding:5px 10px;border-radius:30px;';

        flags.forEach(function(f) {
            var btn = document.createElement('button');
            btn.className = 'lang-flag-btn';
            btn.setAttribute('data-lang', f.code);
            btn.title = f.label;
            btn.style.cssText = 'background:none;border:2px solid transparent;border-radius:5px;padding:2px;opacity:0.55;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;';
            btn.innerHTML = '<img src="https://flagcdn.com/w40/' + f.flag + '.png" alt="' + f.label + '" style="width:28px;height:19px;object-fit:cover;border-radius:2px;display:block;">';
            btn.addEventListener('click', function() { switchLang(f.code); });
            bar.appendChild(btn);
        });

        navbar.appendChild(bar);
    }

    function applyTranslations(lang) {
        var t = siteTranslations[lang];
        if (!t) return;

        // Preklad textov
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) el.innerHTML = t[key];
        });

        // Preklad placeholder atributov
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (t[key] !== undefined) el.placeholder = t[key];
        });

        // data-show-lang="sk" — zobrazi element iba pre zadane jazyky
        document.querySelectorAll('[data-show-lang]').forEach(function(el) {
            var langs = el.getAttribute('data-show-lang').split(',').map(function(s) { return s.trim(); });
            el.style.display = langs.indexOf(lang) !== -1 ? '' : 'none';
        });

        // Aktivny stav vlajok
        document.querySelectorAll('.lang-flag-btn').forEach(function(btn) {
            var active = btn.getAttribute('data-lang') === lang;
            btn.style.opacity = active ? '1' : '0.5';
            btn.style.borderColor = active ? '#FEA116' : 'transparent';
            btn.style.transform = active ? 'scale(1.15)' : 'scale(1)';
        });

        localStorage.setItem('planeta_lang', lang);

        if (typeof onLangChange === 'function') onLangChange(lang);
    }

    function switchLang(lang) {
        applyTranslations(lang);
    }

    function init() {
        injectLangFlags();
        var saved = localStorage.getItem('planeta_lang') || 'sk';
        applyTranslations(saved);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

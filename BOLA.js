(() => {
    'use strict';

    const WIDGET_ID = 'kdh-match-widget';

    // Tinggi area yang terlihat.
    // Semakin kecil nilainya, semakin banyak bagian bawah yang terpotong.
    const VISIBLE_HEIGHT = 150;

    // Tinggi asli isi iframe.
    const IFRAME_HEIGHT = 230;

    let injected = false;

    const IFRAME_HTML = `
        <div
            id="${WIDGET_ID}"
            style="
                width: 100%;
                height: ${VISIBLE_HEIGHT}px;
                margin: 0 !important;
                padding: 0 !important;
                line-height: 0;
                font-size: 0;
                overflow: hidden;
                border-radius: 10px;
            "
        >
            <iframe
                src="https://kdh-match.lovable.app"
                style="
                    width: 100%;
                    height: ${IFRAME_HEIGHT}px;
                    border: none;
                    display: block;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    border-radius: 10px;
                    transform: translateY(0);
                "
                scrolling="no"
                loading="lazy"
            ></iframe>
        </div>
    `;

    function tryInsert() {
        if (injected || document.getElementById(WIDGET_ID)) {
            return true;
        }

        const target = document.querySelector('.c-dLTxpX');

        if (!target) {
            return false;
        }

        // Hilangkan jarak pada target.
        target.style.margin = '0';
        target.style.paddingTop = '0';
        target.style.paddingRight = '0';
        target.style.paddingBottom = '0';
        target.style.paddingLeft = '0';
        target.style.marginBottom = '0';

        const prev = target.previousElementSibling;
        const next = target.nextElementSibling;

        if (prev) {
            prev.style.marginBottom = '0';
            prev.style.paddingBottom = '0';
        }

        if (next) {
            next.style.marginTop = '0';
            next.style.paddingTop = '0';
        }

        target.insertAdjacentHTML('beforebegin', IFRAME_HTML);

        injected = true;

        console.log('[OK] KDH Match Widget injected');
        return true;
    }

    function start() {
        if (tryInsert()) {
            return;
        }

        const timer = setInterval(() => {
            if (tryInsert()) {
                clearInterval(timer);
            }
        }, 300);

        // Hentikan pencarian setelah 30 detik.
        setTimeout(() => {
            clearInterval(timer);
        }, 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();

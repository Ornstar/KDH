(() => {
    'use strict';

    const WIDGET_ID = 'kdh-match-widget';
    let injected = false;

    const IFRAME_HTML = `
        <div id="${WIDGET_ID}" style="
            width:100%;
            margin:0 0 -0.25rem 0 !important;
            padding:0.75rem 0 0 0 !important;
            line-height:0;
            font-size:0;
            transform:translateY(0);
        ">
            <iframe
                src="https://match-recommendation-kudahoki88.abacusai.app"
                style="
                    width:100%;
                    height:230px;
                    border:none;
                    display:block;
                    margin:0;
                    padding:0;
                    overflow:hidden;
                    border-radius:10px;
                "
                scrolling="no"
                loading="lazy">
            </iframe>
        </div>
    `;

    function tryInsert() {

        if (injected || document.getElementById(WIDGET_ID)) {
            return true;
        }

        const target = document.querySelector('.c-dLTxpX');
        if (!target) return false;

        // Spacing target
        target.style.margin = "0";
        target.style.paddingTop = ".75rem";
        target.style.paddingRight = "0";
        target.style.paddingBottom = "0";
        target.style.paddingLeft = "0";
        target.style.marginBottom = "-0.25rem";

        const prev = target.previousElementSibling;
        const next = target.nextElementSibling;

        if (prev) {
            prev.style.marginBottom = "0";
            prev.style.paddingBottom = "0";
        }

        if (next) {
            next.style.marginTop = "0";
            next.style.paddingTop = "0";
        }

        target.insertAdjacentHTML('beforebegin', IFRAME_HTML);

        injected = true;
        console.log('[OK] Widget injected');
        return true;
    }

    function start() {
        const timer = setInterval(() => {
            if (tryInsert()) {
                clearInterval(timer);
            }
        }, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

})();

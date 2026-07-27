(() => {
    "use strict";

    const TARGET_SELECTOR = ".c-dLTxpX";
    const WIDGET_ID = "kdh-match-widget";
    const HEIGHT = 40;

    function paksaUkuran() {
        const target = document.querySelector(TARGET_SELECTOR);

        if (!target) {
            return false;
        }

        target.style.setProperty("padding", "0px", "important");
        target.style.setProperty("margin", "0px", "important");

        target.style.setProperty(
            "height",
            HEIGHT + "px",
            "important"
        );

        target.style.setProperty(
            "min-height",
            HEIGHT + "px",
            "important"
        );

        target.style.setProperty(
            "max-height",
            HEIGHT + "px",
            "important"
        );

        target.style.setProperty(
            "overflow",
            "hidden",
            "important"
        );

        target.style.setProperty(
            "box-sizing",
            "border-box",
            "important"
        );

        const widget = document.getElementById(WIDGET_ID);

        if (widget) {
            widget.style.setProperty(
                "padding",
                "0px",
                "important"
            );

            widget.style.setProperty(
                "margin",
                "0px",
                "important"
            );

            widget.style.setProperty(
                "height",
                HEIGHT + "px",
                "important"
            );

            widget.style.setProperty(
                "min-height",
                HEIGHT + "px",
                "important"
            );

            widget.style.setProperty(
                "max-height",
                HEIGHT + "px",
                "important"
            );

            widget.style.setProperty(
                "overflow",
                "hidden",
                "important"
            );
        }

        return true;
    }

    function start() {
        paksaUkuran();

        const timer = setInterval(() => {
            paksaUkuran();
        }, 300);

        setTimeout(() => {
            clearInterval(timer);
        }, 30000);

        const observer = new MutationObserver(() => {
            requestAnimationFrame(paksaUkuran);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            start
        );
    } else {
        start();
    }
})();

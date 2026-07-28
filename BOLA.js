(() => {
    "use strict";

    const TARGET_SELECTOR = ".c-dLTxpX";
    const WIDGET_ID = "kdh-match-widget";
    const WIDGET_URL = "https://kdh-match.lovable.app";

    /* Tinggi widget yang terlihat */
    const WIDGET_HEIGHT = 210;

    /* Tinggi asli iframe */
    const IFRAME_HEIGHT = 230;

    /* Tinggi area .c-dLTxpX */
    const TARGET_HEIGHT = 40;

    let isProcessing = false;

    function setImportant(element, property, value) {
        if (!element) return;

        element.style.setProperty(
            property,
            value,
            "important"
        );
    }

    function cariTargetTerlihat() {
        const targets = document.querySelectorAll(
            TARGET_SELECTOR
        );

        for (const target of targets) {
            const rect = target.getBoundingClientRect();
            const style = window.getComputedStyle(target);

            if (
                rect.width > 0 &&
                style.display !== "none" &&
                style.visibility !== "hidden"
            ) {
                return target;
            }
        }

        return null;
    }

    function buatWidget() {
        const wrapper = document.createElement("div");

        wrapper.id = WIDGET_ID;

        setImportant(wrapper, "display", "block");
        setImportant(wrapper, "position", "relative");
        setImportant(wrapper, "width", "100%");

        setImportant(
            wrapper,
            "height",
            WIDGET_HEIGHT + "px"
        );

        setImportant(
            wrapper,
            "min-height",
            WIDGET_HEIGHT + "px"
        );

        setImportant(
            wrapper,
            "max-height",
            WIDGET_HEIGHT + "px"
        );

        setImportant(wrapper, "margin", "0");
        setImportant(wrapper, "padding", "0");
        setImportant(wrapper, "overflow", "hidden");
        setImportant(wrapper, "box-sizing", "border-box");
        setImportant(wrapper, "line-height", "0");
        setImportant(wrapper, "font-size", "0");

        wrapper.style.borderRadius = "10px";

        const iframe = document.createElement("iframe");

        iframe.src = WIDGET_URL;
        iframe.loading = "eager";
        iframe.scrolling = "no";

        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute(
            "title",
            "KDH Match Widget"
        );

        setImportant(iframe, "display", "block");
        setImportant(iframe, "width", "100%");

        setImportant(
            iframe,
            "height",
            IFRAME_HEIGHT + "px"
        );

        setImportant(
            iframe,
            "min-height",
            IFRAME_HEIGHT + "px"
        );

        setImportant(
            iframe,
            "max-height",
            IFRAME_HEIGHT + "px"
        );

        setImportant(iframe, "margin", "0");
        setImportant(iframe, "padding", "0");
        setImportant(iframe, "border", "0");

        wrapper.appendChild(iframe);

        return wrapper;
    }

    function aturTarget(target) {
        setImportant(target, "padding", "0");
        setImportant(target, "margin", "0");

        setImportant(
            target,
            "height",
            TARGET_HEIGHT + "px"
        );

        setImportant(
            target,
            "min-height",
            TARGET_HEIGHT + "px"
        );

        setImportant(
            target,
            "max-height",
            TARGET_HEIGHT + "px"
        );

        setImportant(target, "overflow", "hidden");
        setImportant(target, "box-sizing", "border-box");

        const parent = target.parentElement;

        if (parent) {
            setImportant(parent, "gap", "0");
            setImportant(parent, "row-gap", "0");
            setImportant(parent, "padding-bottom", "0");
            setImportant(parent, "margin-bottom", "0");
        }
    }

    function aturWidget(widget) {
        setImportant(widget, "width", "100%");

        setImportant(
            widget,
            "height",
            WIDGET_HEIGHT + "px"
        );

        setImportant(
            widget,
            "min-height",
            WIDGET_HEIGHT + "px"
        );

        setImportant(
            widget,
            "max-height",
            WIDGET_HEIGHT + "px"
        );

        setImportant(widget, "margin", "0");
        setImportant(widget, "padding", "0");
        setImportant(widget, "overflow", "hidden");

        const iframe = widget.querySelector("iframe");

        if (iframe) {
            setImportant(iframe, "display", "block");
            setImportant(iframe, "width", "100%");

            setImportant(
                iframe,
                "height",
                IFRAME_HEIGHT + "px"
            );

            setImportant(iframe, "margin", "0");
            setImportant(iframe, "padding", "0");
            setImportant(iframe, "border", "0");
        }
    }

    function pasangWidget() {
        if (isProcessing) return false;

        isProcessing = true;

        const target = cariTargetTerlihat();

        if (!target || !target.parentNode) {
            isProcessing = false;
            return false;
        }

        let widget = document.getElementById(WIDGET_ID);

        if (!widget) {
            widget = buatWidget();

            /*
             * Pasang tepat di atas .c-dLTxpX
             */
            target.parentNode.insertBefore(
                widget,
                target
            );
        } else if (widget.nextElementSibling !== target) {
            target.parentNode.insertBefore(
                widget,
                target
            );
        }

        aturWidget(widget);
        aturTarget(target);

        isProcessing = false;

        console.log(
            "[OK] KDH Match dipasang tepat di atas .c-dLTxpX"
        );

        return true;
    }

    function start() {
        pasangWidget();

        const timer = setInterval(() => {
            pasangWidget();
        }, 500);

        setTimeout(() => {
            clearInterval(timer);
        }, 30000);

        const observer = new MutationObserver(() => {
            requestAnimationFrame(pasangWidget);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener(
            "resize",
            pasangWidget
        );
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

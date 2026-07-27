(() => {
    "use strict";

    const WIDGET_ID = "kdh-match-widget-final";
    const TARGET_SELECTOR = ".c-dLTxpX";
    const IFRAME_URL = "https://kdh-match.lovable.app";

    /*
     * Tinggi area rekomendasi yang ingin terlihat.
     * 188px biasanya tepat sampai bagian bawah kotak.
     */
    const VISIBLE_HEIGHT = 188;

    /*
     * Tinggi asli iframe tetap 230px.
     */
    const IFRAME_HEIGHT = 230;

    /*
     * Jarak antara kotak rekomendasi dan Top Games.
     */
    const BOTTOM_GAP = 5;

    let isApplying = false;
    let observerTimer = null;

    function setImportant(element, property, value) {
        if (!element) return;

        element.style.setProperty(
            property,
            value,
            "important"
        );
    }

    /*
     * Hapus seluruh widget lama yang mungkin masih tertinggal.
     */
    function removeOldWidgets() {
        document
            .querySelectorAll(
                [
                    "#kdh-match-widget",
                    "#kdh-match-widget-v3",
                    "#kdh-match-widget-v4",
                    "#kdh-match-widget-v5",
                    "#kdh-match-widget-v6",
                    "#" + WIDGET_ID
                ].join(",")
            )
            .forEach(function (element) {
                element.remove();
            });

        document
            .querySelectorAll(
                'iframe[src*="kdh-match.lovable.app"]'
            )
            .forEach(function (iframe) {
                if (!iframe.closest("#" + WIDGET_ID)) {
                    const wrapper = iframe.parentElement;

                    if (wrapper) {
                        wrapper.remove();
                    } else {
                        iframe.remove();
                    }
                }
            });
    }

    /*
     * Membuat widget iframe.
     */
    function createWidget() {
        const wrapper = document.createElement("div");

        wrapper.id = WIDGET_ID;

        setImportant(wrapper, "display", "block");
        setImportant(wrapper, "position", "relative");
        setImportant(wrapper, "width", "100%");

        setImportant(
            wrapper,
            "height",
            VISIBLE_HEIGHT + "px"
        );

        setImportant(
            wrapper,
            "min-height",
            VISIBLE_HEIGHT + "px"
        );

        setImportant(
            wrapper,
            "max-height",
            VISIBLE_HEIGHT + "px"
        );

        setImportant(wrapper, "margin", "0");
        setImportant(wrapper, "padding", "0");
        setImportant(wrapper, "overflow", "hidden");
        setImportant(wrapper, "line-height", "0");
        setImportant(wrapper, "font-size", "0");
        setImportant(wrapper, "box-sizing", "border-box");

        wrapper.style.borderRadius = "10px";

        const iframe = document.createElement("iframe");

        iframe.src = IFRAME_URL;
        iframe.loading = "eager";
        iframe.scrolling = "no";
        iframe.setAttribute("frameborder", "0");

        setImportant(iframe, "display", "block");
        setImportant(iframe, "position", "absolute");
        setImportant(iframe, "top", "0");
        setImportant(iframe, "left", "0");
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
        setImportant(iframe, "overflow", "hidden");

        wrapper.appendChild(iframe);

        return wrapper;
    }

    /*
     * Mencari elemen berdasarkan teks persis.
     */
    function findElementByText(searchText) {
        if (!document.body) return null;

        const normalizedSearch =
            searchText.trim().toLowerCase();

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    const value = String(
                        node.nodeValue || ""
                    )
                        .replace(/\s+/g, " ")
                        .trim()
                        .toLowerCase();

                    if (value === normalizedSearch) {
                        return NodeFilter.FILTER_ACCEPT;
                    }

                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        const textNode = walker.nextNode();

        return textNode
            ? textNode.parentElement
            : null;
    }

    /*
     * Mencari container utama menu Top Games.
     */
    function findTopGamesContainer() {
        const textElement =
            findElementByText("Top Games");

        if (!textElement) {
            return null;
        }

        const minimumWidth = Math.max(
            280,
            window.innerWidth * 0.65
        );

        let current = textElement;
        let fallback = textElement;

        for (let index = 0; index < 10; index++) {
            if (!current) break;

            const rect =
                current.getBoundingClientRect();

            if (
                rect.width >= minimumWidth &&
                rect.height >= 35 &&
                rect.height <= 180
            ) {
                return current;
            }

            /*
             * Simpan ancestor lebar sebagai cadangan.
             */
            if (rect.width >= minimumWidth) {
                fallback = current;
            }

            current = current.parentElement;

            if (
                current === document.body ||
                current === document.documentElement
            ) {
                break;
            }
        }

        return fallback;
    }

    /*
     * Menghilangkan container kosong asli.
     */
    function collapseOriginalTarget(target, topGamesElement) {
        if (!target) return;

        /*
         * Jangan sembunyikan target apabila Top Games
         * ternyata berada di dalam target tersebut.
         */
        if (
            topGamesElement &&
            target.contains(topGamesElement)
        ) {
            setImportant(target, "min-height", "0");
            setImportant(target, "height", "auto");
            setImportant(target, "padding-top", "0");
            setImportant(target, "padding-bottom", "0");
            setImportant(target, "margin-top", "0");
            setImportant(target, "margin-bottom", "0");

            return;
        }

        setImportant(target, "display", "none");
        setImportant(target, "visibility", "hidden");
        setImportant(target, "height", "0");
        setImportant(target, "min-height", "0");
        setImportant(target, "max-height", "0");
        setImportant(target, "margin", "0");
        setImportant(target, "padding", "0");
        setImportant(target, "border", "0");
        setImportant(target, "overflow", "hidden");
    }

    /*
     * Menghapus tinggi minimum dan padding dari parent.
     */
    function cleanParentSpacing(
        widget,
        target,
        topGamesElement
    ) {
        let parent = target
            ? target.parentElement
            : widget.parentElement;

        for (let index = 0; index < 6; index++) {
            if (!parent) break;

            setImportant(parent, "min-height", "0");
            setImportant(parent, "padding-bottom", "0");
            setImportant(parent, "margin-bottom", "0");

            /*
             * Jangan mengubah tinggi body dan html.
             */
            if (
                parent !== document.body &&
                parent !== document.documentElement
            ) {
                setImportant(parent, "height", "auto");
            }

            /*
             * Berhenti jika parent sudah berisi widget
             * dan Top Games sekaligus.
             */
            if (
                topGamesElement &&
                parent.contains(widget) &&
                parent.contains(topGamesElement)
            ) {
                break;
            }

            parent = parent.parentElement;
        }
    }

    /*
     * Menarik Top Games langsung ke bawah widget.
     */
    function pullTopGamesUp(widget, topGamesContainer) {
        if (!widget || !topGamesContainer) {
            return;
        }

        /*
         * Simpan margin asli hanya satu kali.
         */
        if (
            !topGamesContainer.hasAttribute(
                "data-kdh-original-margin"
            )
        ) {
            const computedStyle =
                window.getComputedStyle(
                    topGamesContainer
                );

            const originalMargin =
                parseFloat(
                    computedStyle.marginTop
                ) || 0;

            topGamesContainer.setAttribute(
                "data-kdh-original-margin",
                String(originalMargin)
            );
        }

        const originalMargin =
            parseFloat(
                topGamesContainer.getAttribute(
                    "data-kdh-original-margin"
                )
            ) || 0;

        /*
         * Reset dahulu agar perhitungan tidak bertumpuk.
         */
        setImportant(
            topGamesContainer,
            "margin-top",
            originalMargin + "px"
        );

        setImportant(
            topGamesContainer,
            "padding-top",
            "0"
        );

        void topGamesContainer.offsetHeight;

        const widgetRect =
            widget.getBoundingClientRect();

        const topGamesRect =
            topGamesContainer.getBoundingClientRect();

        const desiredTop =
            widgetRect.top +
            VISIBLE_HEIGHT +
            BOTTOM_GAP;

        const emptyGap =
            topGamesRect.top - desiredTop;

        if (emptyGap > 0) {
            const newMargin =
                originalMargin - emptyGap;

            setImportant(
                topGamesContainer,
                "margin-top",
                newMargin + "px"
            );
        }
    }

    function applyLayout() {
        if (isApplying) return false;

        const target =
            document.querySelector(
                TARGET_SELECTOR
            );

        if (!target) {
            return false;
        }

        isApplying = true;

        let widget =
            document.getElementById(
                WIDGET_ID
            );

        if (!widget) {
            removeOldWidgets();

            widget = createWidget();

            target.parentNode.insertBefore(
                widget,
                target
            );
        }

        const topGamesContainer =
            findTopGamesContainer();

        collapseOriginalTarget(
            target,
            topGamesContainer
        );

        cleanParentSpacing(
            widget,
            target,
            topGamesContainer
        );

        requestAnimationFrame(function () {
            pullTopGamesUp(
                widget,
                topGamesContainer
            );
        });

        setTimeout(function () {
            pullTopGamesUp(
                widget,
                findTopGamesContainer()
            );
        }, 300);

        setTimeout(function () {
            pullTopGamesUp(
                widget,
                findTopGamesContainer()
            );
        }, 1000);

        isApplying = false;

        return true;
    }

    function start() {
        let attempts = 0;

        const searchTimer = setInterval(function () {
            attempts += 1;

            applyLayout();

            if (
                document.getElementById(
                    WIDGET_ID
                ) &&
                findTopGamesContainer()
            ) {
                clearInterval(searchTimer);
            }

            if (attempts >= 100) {
                clearInterval(searchTimer);
            }
        }, 300);

        applyLayout();

        /*
         * Terapkan kembali ketika React merender ulang halaman.
         */
        const observer = new MutationObserver(function () {
            clearTimeout(observerTimer);

            observerTimer = setTimeout(function () {
                applyLayout();
            }, 150);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener(
            "resize",
            function () {
                setTimeout(function () {
                    applyLayout();
                }, 100);
            }
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

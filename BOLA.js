(() => {
    "use strict";

    const OLD_WIDGET_ID = "kdh-match-widget";
    const NEW_WIDGET_ID = "kdh-match-widget-v3";
    const TARGET_SELECTOR = ".c-dLTxpX";
    const IFRAME_URL = "https://kdh-match.lovable.app";

    /*
     * Tinggi yang terlihat sampai bagian bawah
     * kotak rekomendasi pertandingan.
     */
    const VISIBLE_HEIGHT = 195;

    /*
     * Tinggi asli halaman dalam iframe.
     */
    const IFRAME_HEIGHT = 230;

    let sedangMemasang = false;

    function setImportant(element, property, value) {
        if (!element) return;

        element.style.setProperty(
            property,
            value,
            "important"
        );
    }

    /*
     * Menghapus seluruh widget lama agar perubahan
     * tinggi benar-benar diterapkan.
     */
    function hapusWidgetLama() {
        document
            .querySelectorAll(
                "#" + OLD_WIDGET_ID +
                ", #" + NEW_WIDGET_ID
            )
            .forEach(function (element) {
                element.remove();
            });

        document
            .querySelectorAll(
                'iframe[src*="kdh-match.lovable.app"]'
            )
            .forEach(function (iframe) {
                const wrapper = iframe.closest(
                    "#" + OLD_WIDGET_ID +
                    ", #" + NEW_WIDGET_ID
                );

                if (wrapper) {
                    wrapper.remove();
                } else {
                    iframe.remove();
                }
            });
    }

    function buatWidget() {
        const widget = document.createElement("div");

        widget.id = NEW_WIDGET_ID;

        setImportant(widget, "display", "block");
        setImportant(widget, "position", "relative");
        setImportant(widget, "width", "100%");
        setImportant(
            widget,
            "height",
            VISIBLE_HEIGHT + "px"
        );
        setImportant(
            widget,
            "min-height",
            VISIBLE_HEIGHT + "px"
        );
        setImportant(
            widget,
            "max-height",
            VISIBLE_HEIGHT + "px"
        );
        setImportant(widget, "margin", "0");
        setImportant(widget, "padding", "0");
        setImportant(widget, "overflow", "hidden");
        setImportant(widget, "line-height", "0");
        setImportant(widget, "font-size", "0");
        setImportant(widget, "box-sizing", "border-box");

        widget.style.borderRadius = "10px";

        const iframe = document.createElement("iframe");

        iframe.src = IFRAME_URL;
        iframe.scrolling = "no";
        iframe.loading = "eager";
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
        setImportant(iframe, "border", "0");
        setImportant(iframe, "margin", "0");
        setImportant(iframe, "padding", "0");

        widget.appendChild(iframe);

        return widget;
    }

    /*
     * Menyembunyikan kotak kosong yang berada
     * di bawah widget.
     */
    function sembunyikanTarget(target) {
        target.setAttribute(
            "data-kdh-hidden-target",
            "true"
        );

        setImportant(target, "display", "none");
        setImportant(target, "visibility", "hidden");
        setImportant(target, "width", "0");
        setImportant(target, "height", "0");
        setImportant(target, "min-height", "0");
        setImportant(target, "max-height", "0");
        setImportant(target, "margin", "0");
        setImportant(target, "padding", "0");
        setImportant(target, "border", "0");
        setImportant(target, "overflow", "hidden");
    }

    /*
     * Mencari elemen konten berikutnya,
     * termasuk jika berada di luar parent target.
     */
    function cariElemenBerikutnya(widget, target) {
        let current = target;

        for (let level = 0; level < 8; level++) {
            let sibling = current.nextElementSibling;

            while (sibling) {
                const style = window.getComputedStyle(
                    sibling
                );

                const rect =
                    sibling.getBoundingClientRect();

                if (
                    style.display !== "none" &&
                    style.visibility !== "hidden" &&
                    rect.height > 20
                ) {
                    return sibling;
                }

                sibling = sibling.nextElementSibling;
            }

            current = current.parentElement;

            if (
                !current ||
                current === document.body
            ) {
                break;
            }
        }

        return null;
    }

    /*
     * Mengukur ruang kosong dan menarik konten
     * berikutnya ke atas secara otomatis.
     */
    function potongRuangKosong(widget, target) {
        const nextElement =
            cariElemenBerikutnya(widget, target);

        if (!nextElement) return;

        setImportant(
            nextElement,
            "margin-top",
            "0"
        );

        setImportant(
            nextElement,
            "padding-top",
            "0"
        );

        requestAnimationFrame(function () {
            const widgetRect =
                widget.getBoundingClientRect();

            const nextRect =
                nextElement.getBoundingClientRect();

            const gap =
                nextRect.top - widgetRect.bottom;

            /*
             * Jika masih ada ruang lebih dari 5px,
             * tarik bagian berikutnya ke atas.
             */
            if (gap > 5) {
                setImportant(
                    widget,
                    "margin-bottom",
                    "-" + Math.ceil(gap) + "px"
                );
            } else {
                setImportant(
                    widget,
                    "margin-bottom",
                    "0"
                );
            }
        });
    }

    function rapikanParent(widget, target) {
        let parent = target.parentElement;

        for (let i = 0; i < 5 && parent; i++) {
            setImportant(parent, "min-height", "0");
            setImportant(parent, "padding-bottom", "0");
            setImportant(parent, "margin-bottom", "0");

            /*
             * Jangan paksa height auto pada body dan html.
             */
            if (
                parent !== document.body &&
                parent !== document.documentElement
            ) {
                const computed =
                    window.getComputedStyle(parent);

                if (
                    computed.height !== "auto" &&
                    parent.scrollHeight >
                        parent.clientHeight
                ) {
                    setImportant(
                        parent,
                        "height",
                        "auto"
                    );
                }
            }

            parent = parent.parentElement;
        }
    }

    function pasangWidget() {
        if (sedangMemasang) return false;

        const target = document.querySelector(
            TARGET_SELECTOR
        );

        if (!target) return false;

        sedangMemasang = true;

        hapusWidgetLama();

        const widget = buatWidget();

        target.parentNode.insertBefore(
            widget,
            target
        );

        sembunyikanTarget(target);
        rapikanParent(widget, target);

        /*
         * Jalankan beberapa kali karena layout situs
         * dapat berubah setelah iframe selesai dimuat.
         */
        setTimeout(function () {
            sembunyikanTarget(target);
            rapikanParent(widget, target);
            potongRuangKosong(widget, target);
        }, 100);

        setTimeout(function () {
            sembunyikanTarget(target);
            rapikanParent(widget, target);
            potongRuangKosong(widget, target);
        }, 700);

        setTimeout(function () {
            sembunyikanTarget(target);
            rapikanParent(widget, target);
            potongRuangKosong(widget, target);
        }, 1500);

        sedangMemasang = false;

        console.log(
            "[OK] KDH widget dipasang dan gap dipotong"
        );

        return true;
    }

    function mulai() {
        let attempts = 0;

        const timer = setInterval(function () {
            attempts++;

            const existingWidget =
                document.getElementById(
                    NEW_WIDGET_ID
                );

            if (!existingWidget) {
                pasangWidget();
            } else {
                const target =
                    document.querySelector(
                        TARGET_SELECTOR
                    );

                if (target) {
                    sembunyikanTarget(target);
                    rapikanParent(
                        existingWidget,
                        target
                    );
                    potongRuangKosong(
                        existingWidget,
                        target
                    );
                }
            }

            if (attempts >= 60) {
                clearInterval(timer);
            }
        }, 500);

        pasangWidget();

        window.addEventListener(
            "resize",
            function () {
                const widget =
                    document.getElementById(
                        NEW_WIDGET_ID
                    );

                const target =
                    document.querySelector(
                        TARGET_SELECTOR
                    );

                if (widget && target) {
                    potongRuangKosong(
                        widget,
                        target
                    );
                }
            }
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            mulai
        );
    } else {
        mulai();
    }
})();

(() => {
    "use strict";

    const WIDGET_ID = "kdh-match-widget";
    const TARGET_SELECTOR = ".c-dLTxpX";

    /*
     * Sesuaikan tinggi sampai tepat di bawah kotak rekomendasi.
     * Coba:
     * 185 = lebih pendek
     * 195 = normal
     * 205 = lebih tinggi
     */
    const VISIBLE_HEIGHT = 195;

    const IFRAME_HEIGHT = 230;
    const IFRAME_URL = "https://kdh-match.lovable.app";

    function important(element, property, value) {
        if (!element) return;

        element.style.setProperty(
            property,
            value,
            "important"
        );
    }

    function hapusWidgetLama() {
        /*
         * Hapus semua widget lama dengan ID yang sama.
         */
        document
            .querySelectorAll("#" + WIDGET_ID)
            .forEach(element => element.remove());

        /*
         * Hapus iframe duplikat yang mungkin masih tertinggal.
         */
        document
            .querySelectorAll(
                'iframe[src*="kdh-match.lovable.app"]'
            )
            .forEach(iframe => {
                const wrapper = iframe.parentElement;

                if (wrapper) {
                    wrapper.remove();
                } else {
                    iframe.remove();
                }
            });
    }

    function buatWidget() {
        const widget = document.createElement("div");

        widget.id = WIDGET_ID;

        important(widget, "width", "100%");
        important(
            widget,
            "height",
            VISIBLE_HEIGHT + "px"
        );
        important(
            widget,
            "min-height",
            VISIBLE_HEIGHT + "px"
        );
        important(
            widget,
            "max-height",
            VISIBLE_HEIGHT + "px"
        );
        important(widget, "margin", "0");
        important(widget, "padding", "0");
        important(widget, "overflow", "hidden");
        important(widget, "position", "relative");
        important(widget, "display", "block");
        important(widget, "line-height", "0");
        important(widget, "font-size", "0");
        important(widget, "box-sizing", "border-box");

        widget.style.borderRadius = "10px";

        const iframe = document.createElement("iframe");

        iframe.src = IFRAME_URL;
        iframe.loading = "lazy";
        iframe.scrolling = "no";
        iframe.setAttribute("frameborder", "0");

        important(iframe, "position", "absolute");
        important(iframe, "top", "0");
        important(iframe, "left", "0");
        important(iframe, "width", "100%");
        important(
            iframe,
            "height",
            IFRAME_HEIGHT + "px"
        );
        important(
            iframe,
            "min-height",
            IFRAME_HEIGHT + "px"
        );
        important(
            iframe,
            "max-height",
            IFRAME_HEIGHT + "px"
        );
        important(iframe, "border", "none");
        important(iframe, "margin", "0");
        important(iframe, "padding", "0");
        important(iframe, "display", "block");

        widget.appendChild(iframe);

        return widget;
    }

    function hilangkanKotakKosong(target) {
        /*
         * Elemen target inilah yang kemungkinan menjadi
         * area kosong panjang pada gambar.
         */
        important(target, "display", "none");
        important(target, "height", "0");
        important(target, "min-height", "0");
        important(target, "max-height", "0");
        important(target, "margin", "0");
        important(target, "padding", "0");
        important(target, "overflow", "hidden");
        important(target, "border", "none");

        const parent = target.parentElement;

        if (parent) {
            important(parent, "height", "auto");
            important(parent, "min-height", "0");
            important(parent, "max-height", "none");
            important(parent, "padding-bottom", "0");
            important(parent, "margin-bottom", "0");
        }

        const next = target.nextElementSibling;

        if (next) {
            important(next, "margin-top", "0");
            important(next, "padding-top", "0");
        }
    }

    function pasangWidget() {
        const target = document.querySelector(
            TARGET_SELECTOR
        );

        if (!target) {
            return false;
        }

        /*
         * Jangan langsung return ketika widget lama ditemukan.
         * Widget lama wajib dihapus agar ukuran terbaru diterapkan.
         */
        hapusWidgetLama();

        const widget = buatWidget();

        target.parentNode.insertBefore(
            widget,
            target
        );

        hilangkanKotakKosong(target);

        console.log(
            "[OK] Widget dipasang dan ruang kosong dipotong"
        );

        return true;
    }

    function start() {
        let selesai = false;

        const jalankan = () => {
            if (!selesai && pasangWidget()) {
                selesai = true;
            }
        };

        jalankan();

        const timer = setInterval(() => {
            jalankan();

            /*
             * Pastikan elemen target tetap tersembunyi
             * jika halaman melakukan render ulang.
             */
            const target = document.querySelector(
                TARGET_SELECTOR
            );

            if (target) {
                hilangkanKotakKosong(target);
            }
        }, 500);

        setTimeout(() => {
            clearInterval(timer);
        }, 30000);
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

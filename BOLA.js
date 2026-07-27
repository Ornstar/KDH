(() => {
    'use strict';

    const WIDGET_ID = 'kdh-match-widget';

    /*
     * Tinggi tampilan sampai batas bawah kotak pertandingan.
     * Kurangi menjadi 190 jika masih ada sedikit ruang kosong.
     * Tambah menjadi 205 jika bagian bawah kotak terpotong.
     */
    const VISIBLE_HEIGHT = 198;

    /*
     * Tinggi asli iframe.
     * Jangan diperkecil karena isi iframe akan tetap dirender penuh.
     */
    const IFRAME_HEIGHT = 230;

    let injected = false;

    function setImportant(element, property, value) {
        element.style.setProperty(property, value, 'important');
    }

    function createWidget() {
        const widget = document.createElement('div');

        widget.id = WIDGET_ID;

        setImportant(widget, 'width', '100%');
        setImportant(widget, 'height', VISIBLE_HEIGHT + 'px');
        setImportant(widget, 'min-height', '0');
        setImportant(widget, 'max-height', VISIBLE_HEIGHT + 'px');
        setImportant(widget, 'margin', '0');
        setImportant(widget, 'padding', '0');
        setImportant(widget, 'overflow', 'hidden');

        widget.style.position = 'relative';
        widget.style.display = 'block';
        widget.style.lineHeight = '0';
        widget.style.fontSize = '0';
        widget.style.borderRadius = '10px';

        const iframe = document.createElement('iframe');

        iframe.src = 'https://kdh-match.lovable.app';
        iframe.scrolling = 'no';
        iframe.loading = 'lazy';
        iframe.setAttribute('frameborder', '0');

        iframe.style.width = '100%';
        iframe.style.height = IFRAME_HEIGHT + 'px';
        iframe.style.minHeight = IFRAME_HEIGHT + 'px';
        iframe.style.border = 'none';
        iframe.style.display = 'block';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
        iframe.style.overflow = 'hidden';
        iframe.style.borderRadius = '10px';

        /*
         * Isi tetap dimulai dari atas.
         * Ubah ke -5px jika bagian atas ingin dinaikkan sedikit.
         */
        iframe.style.transform = 'translateY(0)';

        widget.appendChild(iframe);

        return widget;
    }

    function tryInsert() {
        const target = document.querySelector('.c-dLTxpX');

        if (!target) {
            return false;
        }

        /*
         * Hapus widget versi lama yang sebelumnya
         * dipasang menggunakan beforebegin.
         */
        const oldWidget = document.getElementById(WIDGET_ID);

        if (oldWidget && !target.contains(oldWidget)) {
            oldWidget.remove();
        }

        if (
            injected &&
            target.querySelector('#' + WIDGET_ID)
        ) {
            return true;
        }

        /*
         * Paksa target mengikuti tinggi widget.
         * Ini yang menghilangkan kotak kosong panjang.
         */
        setImportant(target, 'width', '100%');
        setImportant(target, 'height', VISIBLE_HEIGHT + 'px');
        setImportant(target, 'min-height', '0');
        setImportant(target, 'max-height', VISIBLE_HEIGHT + 'px');
        setImportant(target, 'margin', '0');
        setImportant(target, 'padding', '0');
        setImportant(target, 'overflow', 'hidden');

        target.style.display = 'block';
        target.style.position = 'relative';
        target.style.lineHeight = '0';
        target.style.fontSize = '0';

        /*
         * Kosongkan isi target lalu masukkan iframe
         * langsung ke dalam target.
         */
        target.innerHTML = '';
        target.appendChild(createWidget());

        const prev = target.previousElementSibling;
        const next = target.nextElementSibling;

        if (prev) {
            setImportant(prev, 'margin-bottom', '0');
            setImportant(prev, 'padding-bottom', '0');
        }

        if (next) {
            setImportant(next, 'margin-top', '0');
            setImportant(next, 'padding-top', '0');
        }

        injected = true;

        console.log(
            '[OK] KDH Match Widget dipasang tanpa ruang kosong'
        );

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

        setTimeout(() => {
            clearInterval(timer);
        }, 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            start
        );
    } else {
        start();
    }
})();

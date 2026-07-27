<style>
  #kdh-widget {
    display: block !important;
    position: relative !important;
    width: 100% !important;

    /* Tinggi tampilan widget */
    height: 215px !important;
    min-height: 215px !important;
    max-height: 215px !important;

    margin: 0 !important;
    padding: 0 !important;

    overflow: hidden !important;
    box-sizing: border-box !important;
    line-height: 0 !important;
    font-size: 0 !important;
    border-radius: 10px !important;
  }

  #kdh-widget iframe {
    display: block !important;
    width: 100% !important;
    height: 230px !important;
    min-height: 230px !important;

    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
  }

  #kdh-widget > div,
  #kdh-widget > section {
    margin: 0 !important;
    padding: 0 !important;
  }

  .kdh-target-rapat {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .kdh-target-kosong {
    height: 40px !important;
    min-height: 40px !important;
    max-height: 40px !important;

    margin: 0 !important;
    padding: 0 !important;

    overflow: hidden !important;
    box-sizing: border-box !important;
  }
</style>

<!-- WIDGET RESMI -->
<div id="kdh-widget"></div>

<script
  src="https://kdh-match.lovable.app/widget.js"
  data-target="kdh-widget"
  defer>
</script>

<!-- PINDAHKAN WIDGET KE ATAS .c-dLTxpX -->
<script>
(function () {
  "use strict";

  var HOST_ID = "kdh-widget";
  var TARGET_SELECTOR = ".c-dLTxpX";
  var sudahDipindahkan = false;

  function targetTerlihat(element) {
    if (!element) {
      return false;
    }

    var rect = element.getBoundingClientRect();
    var style = window.getComputedStyle(element);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    );
  }

  function cariTargetYangSesuai() {
    var targets = Array.from(
      document.querySelectorAll(TARGET_SELECTOR)
    ).filter(targetTerlihat);

    if (!targets.length) {
      return null;
    }

    /*
     * Prioritaskan .c-dLTxpX yang berupa area kosong,
     * bukan yang berisi tombol, gambar, atau menu.
     */
    var targetKosong = targets.find(function (target) {
      var teks = target.textContent
        .replace(/\s+/g, " ")
        .trim();

      var adaKontenInteraktif = target.querySelector(
        "a, button, img, iframe, input, select"
      );

      return (
        teks.length === 0 &&
        !adaKontenInteraktif &&
        target.getBoundingClientRect().height >= 60
      );
    });

    return targetKosong || targets[0];
  }

  function rapikanTarget(target) {
    if (!target) {
      return;
    }

    target.classList.add("kdh-target-rapat");

    var teks = target.textContent
      .replace(/\s+/g, " ")
      .trim();

    var adaKontenInteraktif = target.querySelector(
      "a, button, img, iframe, input, select"
    );

    /*
     * Hanya potong menjadi 40px jika target memang kosong.
     * Target yang memiliki menu atau isi tidak dihancurkan.
     */
    if (
      teks.length === 0 &&
      !adaKontenInteraktif
    ) {
      target.classList.add("kdh-target-kosong");
    }

    var parent = target.parentElement;

    if (parent) {
      parent.style.setProperty(
        "gap",
        "0px",
        "important"
      );

      parent.style.setProperty(
        "row-gap",
        "0px",
        "important"
      );
    }
  }

  function rapikanWidget(host) {
    if (!host) {
      return;
    }

    host.style.setProperty(
      "margin",
      "0px",
      "important"
    );

    host.style.setProperty(
      "padding",
      "0px",
      "important"
    );

    host.style.setProperty(
      "height",
      "215px",
      "important"
    );

    host.style.setProperty(
      "min-height",
      "215px",
      "important"
    );

    host.style.setProperty(
      "max-height",
      "215px",
      "important"
    );

    host.style.setProperty(
      "overflow",
      "hidden",
      "important"
    );

    var iframe = host.querySelector("iframe");

    if (iframe) {
      iframe.style.setProperty(
        "display",
        "block",
        "important"
      );

      iframe.style.setProperty(
        "width",
        "100%",
        "important"
      );

      iframe.style.setProperty(
        "height",
        "230px",
        "important"
      );

      iframe.style.setProperty(
        "margin",
        "0px",
        "important"
      );

      iframe.style.setProperty(
        "padding",
        "0px",
        "important"
      );

      iframe.style.setProperty(
        "border",
        "0",
        "important"
      );
    }
  }

  function pindahkanWidget() {
    var host = document.getElementById(HOST_ID);
    var target = cariTargetYangSesuai();

    if (!host || !target || !target.parentNode) {
      return false;
    }

    /*
     * Letakkan widget tepat sebelum .c-dLTxpX.
     */
    if (host.nextElementSibling !== target) {
      target.parentNode.insertBefore(
        host,
        target
      );
    }

    rapikanWidget(host);
    rapikanTarget(target);

    sudahDipindahkan = true;

    console.log(
      "[OK] KDH Widget tampil di atas .c-dLTxpX"
    );

    return true;
  }

  function mulai() {
    pindahkanWidget();

    var percobaan = 0;

    var timer = setInterval(function () {
      percobaan++;

      pindahkanWidget();

      var host =
        document.getElementById(HOST_ID);

      if (host) {
        rapikanWidget(host);
      }

      if (
        sudahDipindahkan &&
        host &&
        host.querySelector("iframe")
      ) {
        clearInterval(timer);
      }

      if (percobaan >= 100) {
        clearInterval(timer);
      }
    }, 300);

    /*
     * Menangani halaman yang render ulang dengan React.
     */
    var observer = new MutationObserver(function () {
      window.requestAnimationFrame(function () {
        pindahkanWidget();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
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
</script>

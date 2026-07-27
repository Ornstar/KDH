<style>
  #kdh-widget {
    display: block !important;
    position: relative !important;

    width: 100% !important;
    height: 198px !important;
    min-height: 198px !important;
    max-height: 198px !important;

    padding: 0 !important;
    margin: 0 !important;

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
    max-height: 230px !important;

    padding: 0 !important;
    margin: 0 !important;

    border: 0 !important;
    overflow: hidden !important;
  }

  #kdh-widget > div,
  #kdh-widget > section {
    padding: 0 !important;
    margin: 0 !important;
  }

  /* AREA KOSONG DI BAWAH WIDGET */
  [data-kdh-gap="true"] {
    display: flex !important;

    width: 100% !important;

    height: 40px !important;
    min-height: 40px !important;
    max-height: 40px !important;

    block-size: 40px !important;
    min-block-size: 40px !important;
    max-block-size: 40px !important;

    flex: 0 0 40px !important;

    padding: 0 !important;
    margin: 0 !important;

    overflow: hidden !important;
    box-sizing: border-box !important;
  }
</style>

<div id="kdh-widget"></div>

<script
  src="https://kdh-match.lovable.app/widget.js"
  data-target="kdh-widget"
  defer>
</script>

<script>
(function () {
  "use strict";

  var HOST_ID = "kdh-widget";

  /* Tinggi tampilan widget */
  var WIDGET_HEIGHT = 198;

  /* Tinggi area .c-dLTxpX */
  var TARGET_HEIGHT = 40;

  function setImportant(element, property, value) {
    if (!element) {
      return;
    }

    element.style.setProperty(
      property,
      value,
      "important"
    );
  }

  function cariTargetTerdekat(host) {
    var semuaTarget = Array.from(
      document.querySelectorAll(".c-dLTxpX")
    );

    if (!semuaTarget.length) {
      return null;
    }

    var hostRect = host.getBoundingClientRect();

    var kandidat = semuaTarget.filter(function (target) {
      return (
        !target.contains(host) &&
        !host.contains(target)
      );
    });

    if (!kandidat.length) {
      return null;
    }

    kandidat.sort(function (a, b) {
      var rectA = a.getBoundingClientRect();
      var rectB = b.getBoundingClientRect();

      var jarakA = Math.abs(
        rectA.top - hostRect.bottom
      );

      var jarakB = Math.abs(
        rectB.top - hostRect.bottom
      );

      return jarakA - jarakB;
    });

    return kandidat[0];
  }

  function aturWidget(host) {
    setImportant(host, "width", "100%");

    setImportant(
      host,
      "height",
      WIDGET_HEIGHT + "px"
    );

    setImportant(
      host,
      "min-height",
      WIDGET_HEIGHT + "px"
    );

    setImportant(
      host,
      "max-height",
      WIDGET_HEIGHT + "px"
    );

    setImportant(host, "padding", "0px");
    setImportant(host, "margin", "0px");
    setImportant(host, "overflow", "hidden");

    var iframe = host.querySelector("iframe");

    if (iframe) {
      setImportant(iframe, "width", "100%");
      setImportant(iframe, "height", "230px");
      setImportant(iframe, "min-height", "230px");
      setImportant(iframe, "max-height", "230px");
      setImportant(iframe, "padding", "0px");
      setImportant(iframe, "margin", "0px");
      setImportant(iframe, "border", "0");
      setImportant(iframe, "display", "block");
    }
  }

  function aturTarget(target) {
    if (!target) {
      return;
    }

    target.setAttribute(
      "data-kdh-gap",
      "true"
    );

    setImportant(target, "padding", "0px");
    setImportant(target, "margin", "0px");

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

    setImportant(
      target,
      "block-size",
      TARGET_HEIGHT + "px"
    );

    setImportant(
      target,
      "min-block-size",
      TARGET_HEIGHT + "px"
    );

    setImportant(
      target,
      "max-block-size",
      TARGET_HEIGHT + "px"
    );

    setImportant(
      target,
      "flex",
      "0 0 " + TARGET_HEIGHT + "px"
    );

    setImportant(target, "overflow", "hidden");
    setImportant(target, "box-sizing", "border-box");

    var parent = target.parentElement;

    if (parent) {
      setImportant(parent, "gap", "0px");
      setImportant(parent, "row-gap", "0px");
      setImportant(parent, "padding-bottom", "0px");
      setImportant(parent, "margin-bottom", "0px");
      setImportant(parent, "min-height", "0px");
    }

    var sebelum = target.previousElementSibling;
    var sesudah = target.nextElementSibling;

    if (sebelum) {
      setImportant(sebelum, "margin-bottom", "0px");
      setImportant(sebelum, "padding-bottom", "0px");
    }

    if (sesudah) {
      setImportant(sesudah, "margin-top", "0px");
      setImportant(sesudah, "padding-top", "0px");
    }
  }

  function terapkanUkuran() {
    var host = document.getElementById(HOST_ID);

    if (!host) {
      return;
    }

    aturWidget(host);

    var target = cariTargetTerdekat(host);

    aturTarget(target);
  }

  function mulai() {
    terapkanUkuran();

    var host = document.getElementById(HOST_ID);

    if (!host) {
      return;
    }

    var observerHost = new MutationObserver(function () {
      requestAnimationFrame(terapkanUkuran);
    });

    observerHost.observe(host, {
      childList: true,
      subtree: true
    });

    var observerHalaman = new MutationObserver(function () {
      requestAnimationFrame(terapkanUkuran);
    });

    observerHalaman.observe(document.body, {
      childList: true,
      subtree: true
    });

    var timer = setInterval(function () {
      terapkanUkuran();
    }, 500);

    setTimeout(function () {
      clearInterval(timer);
    }, 30000);

    window.addEventListener(
      "resize",
      terapkanUkuran
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
</script>

<style>
  #kdh-widget {
    width: 100% !important;

    padding: 0 !important;
    margin: 0 !important;

    min-height: 40px !important;

    /* Tinggi area widget yang terlihat */
    height: 132px !important;
    max-height: 132px !important;

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
    overflow: hidden !important;
  }

  #kdh-widget > div {
    padding: 0 !important;
    margin: 0 !important;
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
  var VISIBLE_HEIGHT = 198;

  function paksaUkuranWidget() {
    var host = document.getElementById(HOST_ID);

    if (!host) {
      return;
    }

    host.style.setProperty(
      "padding",
      "0px",
      "important"
    );

    host.style.setProperty(
      "margin",
      "0px",
      "important"
    );

    host.style.setProperty(
      "min-height",
      "40px",
      "important"
    );

    host.style.setProperty(
      "height",
      VISIBLE_HEIGHT + "px",
      "important"
    );

    host.style.setProperty(
      "max-height",
      VISIBLE_HEIGHT + "px",
      "important"
    );

    host.style.setProperty(
      "overflow",
      "hidden",
      "important"
    );

    var children = host.querySelectorAll(
      "div, section, iframe"
    );

    children.forEach(function (element) {
      element.style.setProperty(
        "margin",
        "0px",
        "important"
      );

      element.style.setProperty(
        "padding",
        "0px",
        "important"
      );
    });

    var iframe = host.querySelector("iframe");

    if (iframe) {
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
        "min-height",
        "230px",
        "important"
      );

      iframe.style.setProperty(
        "border",
        "0",
        "important"
      );

      iframe.style.setProperty(
        "display",
        "block",
        "important"
      );
    }
  }

  function mulai() {
    paksaUkuranWidget();

    var host = document.getElementById(HOST_ID);

    if (!host) {
      return;
    }

    var observer = new MutationObserver(function () {
      requestAnimationFrame(
        paksaUkuranWidget
      );
    });

    observer.observe(host, {
      childList: true,
      subtree: true
    });

    var timer = setInterval(function () {
      paksaUkuranWidget();
    }, 500);

    setTimeout(function () {
      clearInterval(timer);
    }, 20000);
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

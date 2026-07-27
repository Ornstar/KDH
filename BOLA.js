<style>
  #kdh-widget {
    display: block !important;
    position: relative !important;

    width: 100% !important;
    height: 205px !important;
    min-height: 205px !important;
    max-height: 205px !important;

    margin: 0 0 4px 0 !important;
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

  /* Target tepat di bawah widget */
  .c-dLTxpX[data-kdh-target="true"] {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
</style>

<script>
(function () {
  "use strict";

  var TARGET_SELECTOR = ".c-dLTxpX";
  var HOST_ID = "kdh-widget";
  var WIDGET_SCRIPT =
    "https://kdh-match.lovable.app/widget.js";

  /* Tinggi bagian widget yang terlihat */
  var WIDGET_HEIGHT = 205;

  /* Jarak widget dengan .c-dLTxpX */
  var GAP_BOTTOM = 4;

  var sudahDipasang = false;

  function setImportant(element, property, value) {
    if (!element) return;

    element.style.setProperty(
      property,
      value,
      "important"
    );
  }

  function cariTargetTerlihat() {
    var targets = document.querySelectorAll(
      TARGET_SELECTOR
    );

    for (var i = 0; i < targets.length; i++) {
      var rect =
        targets[i].getBoundingClientRect();

      var style =
        window.getComputedStyle(targets[i]);

      if (
        rect.width > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      ) {
        return targets[i];
      }
    }

    return null;
  }

  function hapusWidgetLama() {
    document
      .querySelectorAll(
        "#kdh-widget," +
        "#kdh-match-widget," +
        "#kdh-match-widget-v3," +
        "#kdh-match-widget-final," +
        "#kdh-match-widget-cropped"
      )
      .forEach(function (element) {
        element.remove();
      });

    document
      .querySelectorAll(
        'iframe[src*="kdh-match.lovable.app"]'
      )
      .forEach(function (iframe) {
        var parent = iframe.parentElement;

        if (parent) {
          parent.remove();
        } else {
          iframe.remove();
        }
      });

    document
      .querySelectorAll(
        'script[src*="kdh-match.lovable.app/widget.js"]'
      )
      .forEach(function (script) {
        script.remove();
      });
  }

  function buatHostWidget() {
    var host = document.createElement("div");

    host.id = HOST_ID;

    setImportant(host, "display", "block");
    setImportant(host, "position", "relative");
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

    setImportant(
      host,
      "margin",
      "0 0 " + GAP_BOTTOM + "px 0"
    );

    setImportant(host, "padding", "0");
    setImportant(host, "overflow", "hidden");
    setImportant(host, "box-sizing", "border-box");
    setImportant(host, "line-height", "0");
    setImportant(host, "font-size", "0");

    return host;
  }

  function rapikanTarget(target) {
    target.setAttribute(
      "data-kdh-target",
      "true"
    );

    setImportant(target, "margin-top", "0");
    setImportant(target, "padding-top", "0");

    /*
     * Jangan paksa tinggi target menjadi 40px.
     * Biarkan isi aslinya tampil normal.
     */
    setImportant(target, "min-height", "0");

    var parent = target.parentElement;

    if (parent) {
      setImportant(parent, "gap", "0");
      setImportant(parent, "row-gap", "0");
    }
  }

  function muatScriptWidget() {
    var script = document.createElement("script");

    script.src = WIDGET_SCRIPT;
    script.setAttribute(
      "data-target",
      HOST_ID
    );

    script.async = true;

    document.body.appendChild(script);
  }

  function paksaUkuranSetelahRender() {
    var host =
      document.getElementById(HOST_ID);

    if (!host) return;

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

    setImportant(host, "overflow", "hidden");

    var iframe = host.querySelector("iframe");

    if (iframe) {
      setImportant(iframe, "display", "block");
      setImportant(iframe, "width", "100%");
      setImportant(iframe, "height", "230px");
      setImportant(iframe, "min-height", "230px");
      setImportant(iframe, "margin", "0");
      setImportant(iframe, "padding", "0");
      setImportant(iframe, "border", "0");
    }
  }

  function pasangWidget() {
    if (sudahDipasang) {
      paksaUkuranSetelahRender();
      return true;
    }

    var target = cariTargetTerlihat();

    if (!target || !target.parentNode) {
      return false;
    }

    hapusWidgetLama();

    var host = buatHostWidget();

    /*
     * Widget dipasang tepat di atas .c-dLTxpX
     */
    target.parentNode.insertBefore(
      host,
      target
    );

    rapikanTarget(target);
    muatScriptWidget();

    sudahDipasang = true;

    setTimeout(
      paksaUkuranSetelahRender,
      300
    );

    setTimeout(
      paksaUkuranSetelahRender,
      1000
    );

    setTimeout(
      paksaUkuranSetelahRender,
      2000
    );

    console.log(
      "[OK] Widget dipasang tepat di atas .c-dLTxpX"
    );

    return true;
  }

  function mulai() {
    if (pasangWidget()) return;

    var timer = setInterval(function () {
      if (pasangWidget()) {
        clearInterval(timer);
      }
    }, 300);

    setTimeout(function () {
      clearInterval(timer);
    }, 30000);
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

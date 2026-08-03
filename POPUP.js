"use strict";

(function () {
  const IMG = [
    "https://www.image2url.com/r2/default/images/1785784031351-1c175e6d-55a2-4518-9c55-b176180f3ba9.png",
    "https://www.image2url.com/r2/default/images/1785784064177-d0473d13-17f7-4dd5-a6b5-62a5d0b05960.png",
    "https://www.image2url.com/r2/default/images/1785784092063-48dc414d-91ea-496a-85ff-6a92e60f6ea0.png"
  ];

  const DELAY_KEY = "popup_delay_1h";
  const SLIDER_INTERVAL = 7000;
  const STYLE_ID = "kdh-popup-style";
  const POPUP_ID = "kdh-popup";
  const OVERLAY_ID = "kdh-popup-overlay";

  let popupCreated = false;
  let currentIndex = 0;
  let sliderTimer = null;
  let changingSlide = false;

  /* ==============================
     CEK HALAMAN
  ============================== */

  function isAllowedPage() {
    const path = location.pathname
      .replace(/\/+$/, "")
      .toLowerCase();

    return (
      path === "" ||
      path === "/" ||
      path.includes("home")
    );
  }

  function canShowPopup() {
    if (!isAllowedPage()) return false;

    const lastClosed = Number(
      localStorage.getItem(DELAY_KEY) || 0
    );

    return !(
      lastClosed &&
      Date.now() - lastClosed < 3600000
    );
  }

  /* ==============================
     PRELOAD SEMUA GAMBAR
  ============================== */

  function preloadImages() {
    return Promise.all(
      IMG.map(function (url) {
        return new Promise(function (resolve) {
          const preload = new Image();
          preload.decoding = "async";

          preload.onload = function () {
            if (typeof preload.decode === "function") {
              preload
                .decode()
                .catch(function () {})
                .finally(resolve);
            } else {
              resolve();
            }
          };

          preload.onerror = resolve;
          preload.src = url;

          if (preload.complete && preload.naturalWidth > 0) {
            if (typeof preload.decode === "function") {
              preload
                .decode()
                .catch(function () {})
                .finally(resolve);
            } else {
              resolve();
            }
          }
        });
      })
    );
  }

  /* ==============================
     CSS
  ============================== */

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      @keyframes kdhFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes kdhFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }

      @keyframes kdhSlideIn {
        from {
          transform: translateY(25px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes kdhPopupPullUp {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(-110vh);
          opacity: 0;
        }
      }

      @keyframes kdhShine {
        0% { left: -40%; }
        100% { left: 125%; }
      }

      #${OVERLAY_ID} {
        position: fixed;
        inset: 0;
        z-index: 2147483646;
        background:
          linear-gradient(
            180deg,
            rgba(12, 10, 3, .48),
            rgba(0, 0, 0, .9)
          );
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        animation: kdhFadeIn .35s ease forwards;
      }

      #${OVERLAY_ID}.fade-out {
        animation: kdhFadeOut .35s ease forwards;
      }

      #${POPUP_ID} {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        box-sizing: border-box;
        background: transparent;
        overflow-y: auto;
      }

      #${POPUP_ID}.pull-up {
        animation:
          kdhPopupPullUp .72s
          cubic-bezier(.55, .05, .25, 1)
          forwards;
        pointer-events: none;
      }

      #kdh-popup-box {
        position: relative;
        animation: kdhSlideIn .45s ease forwards;
        filter: none !important;
        box-shadow: none !important;
        background: transparent !important;
        border: none !important;
      }

      #kdh-close {
        position: absolute;
        top: -12px;
        right: -12px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background:
          linear-gradient(
            180deg,
            #d4af37,
            #4a3608 60%,
            #090909
          );
        color: #fff;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9999;
        border: 1px solid #f3d77a;
        box-shadow:
          0 0 16px rgba(212, 175, 55, .72);
      }

      #kdh-image-stage {
        position: relative;
        display: grid;
        place-items: center;
        max-width: 92vw;
        max-height: 58vh;
        overflow: hidden;
        background: transparent !important;
      }

      #kdh-popup-img,
      #kdh-popup-img-next {
        grid-area: 1 / 1;
        display: block;
        max-width: 92vw;
        max-height: 58vh;
        width: auto;
        height: auto;
        object-fit: contain;
        border-radius: 0;
        box-shadow: none !important;
        filter: none !important;
        background: transparent !important;
        border: none !important;
        will-change: transform, opacity;
      }

      #kdh-popup-img {
        position: relative;
        z-index: 1;
        opacity: 1;
        transform: translateX(0);
      }

      #kdh-popup-img-next {
        position: relative;
        z-index: 2;
        opacity: 0;
        transform: translateX(100%);
        pointer-events: none;
      }

      #kdh-popup-img-next.slide-rtl {
        opacity: 1;
        transform: translateX(0);
        transition:
          transform .7s cubic-bezier(.22, .8, .28, 1),
          opacity .3s ease;
      }

      #kdh-popup-img.slide-old-left {
        opacity: .28;
        transform: translateX(-18%);
        transition:
          transform .7s cubic-bezier(.22, .8, .28, 1),
          opacity .55s ease;
      }

      .kdh-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid #f3d77a;
        background:
          linear-gradient(
            180deg,
            #b8860b,
            #2b2108
          );
        color: #fff;
        font-size: 24px;
        font-weight: 900;
        cursor: pointer;
        z-index: 9998;
        line-height: 22px;
        box-shadow:
          0 0 14px rgba(212, 175, 55, .55);
      }

      #kdh-prev {
        left: 8px;
      }

      #kdh-next {
        right: 8px;
      }

      #kdh-dots {
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        z-index: 9998;
        padding: 5px 8px;
        border-radius: 20px;
        background: rgba(0, 0, 0, .25);
      }

      .kdh-dot {
        width: 8px;
        height: 8px;
        min-width: 8px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, .5);
        padding: 0;
        cursor: pointer;
        transition:
          transform .2s ease,
          background .2s ease;
      }

      .kdh-dot.active {
        background: #d4af37;
        transform: scale(1.3);
        box-shadow: 0 0 10px #d4af37;
      }

      #kdh-title {
        font-weight: 900;
        font-size: 16px;
        color: #f7e7a9;
        letter-spacing: 2px;
        text-shadow:
          0 0 10px rgba(212, 175, 55, .92),
          0 0 25px rgba(212, 175, 55, .55);
      }

      .kdh-gif-row {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
      }

      .kdh-gif-box {
        position: relative;
        width: 90px;
      }

      .kdh-gif-box img {
        display: block;
        width: 100%;
        border-radius: 12px;
        pointer-events: none;
        box-shadow:
          0 0 10px rgba(212, 175, 55, .38);
      }

      .kdh-btn-row {
        width: 310px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
      }

      .kdh-btn,
      .kdh-ok {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        text-align: center;
        font-weight: 900;
        color: #fff !important;
        transition:
          transform .18s ease,
          filter .18s ease;
      }

      .kdh-btn {
        width: 148px;
        padding: 12px 0;
        border-radius: 15px;
        font-size: 12px;
        white-space: nowrap;
        text-decoration: none;
        letter-spacing: .5px;
        background:
          linear-gradient(
            180deg,
            #d4af37 0%,
            #9b7408 30%,
            #3b2c07 70%,
            #090909 100%
          );
        border: 1px solid #f3d77a;
        box-shadow:
          0 0 12px rgba(212, 175, 55, .72),
          0 0 28px rgba(212, 175, 55, .4),
          0 9px 22px rgba(0, 0, 0, .55),
          inset 0 1px 0 rgba(255, 255, 255, .2);
      }

      .kdh-ok {
        width: 120px;
        padding: 11px 0;
        border-radius: 14px;
        font-size: 14px;
        background:
          linear-gradient(
            180deg,
            #d4af37 0%,
            #9b7408 38%,
            #3b2c07 75%,
            #090909 100%
          );
        border: 1px solid #f7e7a9;
        box-shadow:
          0 0 12px rgba(212, 175, 55, .82),
          0 0 25px rgba(212, 175, 55, .45),
          0 8px 20px rgba(0, 0, 0, .5),
          inset 0 1px 0 rgba(255, 255, 255, .2);
      }

      .kdh-btn:hover,
      .kdh-ok:hover {
        transform: scale(1.045);
        filter: brightness(1.18);
      }

      .kdh-btn:active,
      .kdh-ok:active {
        transform: scale(.96);
      }

      .kdh-btn::before,
      .kdh-ok::before {
        content: "";
        position: absolute;
        top: 0;
        left: -40%;
        width: 25%;
        height: 100%;
        background:
          linear-gradient(
            120deg,
            rgba(255, 255, 255, 0),
            rgba(255, 236, 160, .95),
            rgba(255, 255, 255, 0)
          );
        transform: skewX(-25deg);
        animation: kdhShine 2s infinite;
      }

      @media (max-width: 768px) {
        #${POPUP_ID} {
          gap: 8px;
        }

        #kdh-image-stage,
        #kdh-popup-img,
        #kdh-popup-img-next {
          max-width: 94vw;
          max-height: 55vh;
        }

        .kdh-gif-box {
          width: 78px;
        }

        .kdh-btn-row {
          width: 310px;
          gap: 8px;
        }

        .kdh-btn {
          width: 148px;
          font-size: 12px;
          padding: 11px 0;
        }

        .kdh-ok {
          width: 115px;
          font-size: 13px;
          padding: 10px 0;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ==============================
     BUAT POPUP
  ============================== */

  async function createPopup() {
    if (
      popupCreated ||
      !canShowPopup() ||
      !document.body
    ) {
      return;
    }

    popupCreated = true;
    injectStyle();

    await preloadImages();

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;

    const popup = document.createElement("div");
    popup.id = POPUP_ID;

    popup.innerHTML = `
      <div id="kdh-popup-box">

        <div id="kdh-close" title="Tutup">
          ✕
        </div>

        <button
          type="button"
          class="kdh-nav"
          id="kdh-prev"
          aria-label="Gambar sebelumnya"
        >
          ‹
        </button>

        <div id="kdh-image-stage">
          <img
            id="kdh-popup-img"
            src="${IMG[0]}"
            alt="Dirgahayu Indonesia Slide 1"
          >

          <img
            id="kdh-popup-img-next"
            src=""
            alt=""
            aria-hidden="true"
          >
        </div>

        <button
          type="button"
          class="kdh-nav"
          id="kdh-next"
          aria-label="Gambar berikutnya"
        >
          ›
        </button>

        <div id="kdh-dots"></div>
      </div>

      <div id="kdh-title">
        DIRGAHAYU INDONESIA
      </div>

      <div class="kdh-gif-row">

        <div class="kdh-gif-box">
          <img
            src="https://www.image2url.com/r2/default/gifs/1776202907511-66e0b111-777d-4ebe-913e-e96b5c3cbe5f.gif"
            alt="Starlight Princess"
          >
        </div>

        <div class="kdh-gif-box">
          <img
            src="https://www.image2url.com/r2/default/gifs/1784829809669-8e602d39-2842-4aa9-97c3-48381ca2780f.gif"
            alt="Dirgahayu Indonesia"
          >
        </div>

        <div class="kdh-gif-box">
          <img
            src="https://www.image2url.com/r2/default/gifs/1776203611749-4994e8c2-bf51-4a8e-8d21-1a0732c86ff7.gif"
            alt="Lucky Neko"
          >
        </div>

      </div>

      <div class="kdh-btn-row">

        <a
          class="kdh-btn"
          href="https://goviplink.live/livescore"
          target="_blank"
          rel="noopener noreferrer"
        >
          LIVE SCORE
        </a>

        <a
          class="kdh-btn"
          href="https://goviplink.live/rtp-kudahoki88"
          target="_blank"
          rel="noopener noreferrer"
        >
          RTP
        </a>

        <button
          type="button"
          class="kdh-ok"
          id="kdh-ok"
        >
          OK
        </button>

      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    const sliderImage =
      document.getElementById("kdh-popup-img");

    const nextSliderImage =
      document.getElementById("kdh-popup-img-next");

    const dotsContainer =
      document.getElementById("kdh-dots");

    /* ==============================
       DOT SLIDER
    ============================== */

    function renderDots() {
      dotsContainer.innerHTML = "";

      IMG.forEach(function (_, imageIndex) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className =
          "kdh-dot" +
          (imageIndex === currentIndex ? " active" : "");

        dot.setAttribute(
          "aria-label",
          "Tampilkan gambar " + (imageIndex + 1)
        );

        dot.addEventListener("click", function () {
          changeSlide(imageIndex);
          resetSliderTimer();
        });

        dotsContainer.appendChild(dot);
      });
    }

    /* ==============================
       SLIDE KANAN KE KIRI
    ============================== */

    function changeSlide(newIndex) {
      if (
        changingSlide ||
        newIndex < 0 ||
        newIndex >= IMG.length ||
        newIndex === currentIndex
      ) {
        return;
      }

      changingSlide = true;

      nextSliderImage.classList.remove("slide-rtl");
      sliderImage.classList.remove("slide-old-left");

      nextSliderImage.src = IMG[newIndex];
      nextSliderImage.alt =
        "Dirgahayu Indonesia Slide " + (newIndex + 1);

      nextSliderImage.style.transition = "none";
      nextSliderImage.style.opacity = "0";
      nextSliderImage.style.transform =
        "translateX(100%)";

      void nextSliderImage.offsetWidth;

      nextSliderImage.style.transition = "";
      nextSliderImage.style.opacity = "";
      nextSliderImage.style.transform = "";

      sliderImage.classList.add("slide-old-left");
      nextSliderImage.classList.add("slide-rtl");

      let finished = false;

      function finishSlide() {
        if (finished) return;
        finished = true;

        nextSliderImage.removeEventListener(
          "transitionend",
          handleTransitionEnd
        );

        currentIndex = newIndex;

        sliderImage.src = IMG[currentIndex];
        sliderImage.alt =
          "Dirgahayu Indonesia Slide " +
          (currentIndex + 1);

        sliderImage.classList.remove("slide-old-left");
        sliderImage.style.transition = "none";
        sliderImage.style.opacity = "1";
        sliderImage.style.transform = "translateX(0)";

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            nextSliderImage.style.transition = "none";
            nextSliderImage.classList.remove("slide-rtl");
            nextSliderImage.style.opacity = "0";
            nextSliderImage.style.transform =
              "translateX(100%)";
            nextSliderImage.src = "";
            nextSliderImage.alt = "";

            requestAnimationFrame(function () {
              sliderImage.style.transition = "";
              sliderImage.style.opacity = "";
              sliderImage.style.transform = "";

              nextSliderImage.style.transition = "";
              nextSliderImage.style.opacity = "";
              nextSliderImage.style.transform = "";

              changingSlide = false;
            });
          });
        });

        renderDots();
      }

      function handleTransitionEnd(event) {
        if (
          event.target === nextSliderImage &&
          event.propertyName === "transform"
        ) {
          finishSlide();
        }
      }

      nextSliderImage.addEventListener(
        "transitionend",
        handleTransitionEnd
      );

      window.setTimeout(finishSlide, 900);
    }

    function nextSlide() {
      const nextIndex =
        (currentIndex + 1) % IMG.length;

      changeSlide(nextIndex);
    }

    function previousSlide() {
      const previousIndex =
        (currentIndex - 1 + IMG.length) % IMG.length;

      changeSlide(previousIndex);
    }

    function startSliderTimer() {
      clearInterval(sliderTimer);

      sliderTimer = setInterval(function () {
        nextSlide();
      }, SLIDER_INTERVAL);
    }

    function resetSliderTimer() {
      startSliderTimer();
    }

    /* ==============================
       TUTUP POPUP
    ============================== */

    function closePopup() {
      clearInterval(sliderTimer);

      popup.classList.add("pull-up");
      overlay.classList.add("fade-out");

      localStorage.setItem(
        DELAY_KEY,
        String(Date.now())
      );

      setTimeout(function () {
        popup.remove();
        overlay.remove();
        popupCreated = false;
      }, 760);
    }

    /* ==============================
       EVENT
    ============================== */

    document
      .getElementById("kdh-next")
      .addEventListener("click", function () {
        nextSlide();
        resetSliderTimer();
      });

    document
      .getElementById("kdh-prev")
      .addEventListener("click", function () {
        previousSlide();
        resetSliderTimer();
      });

    document
      .getElementById("kdh-close")
      .addEventListener("click", closePopup);

    document
      .getElementById("kdh-ok")
      .addEventListener("click", closePopup);

    renderDots();
    startSliderTimer();
  }

  /* ==============================
     INIT
  ============================== */

  function init() {
    let retry = 0;

    const checkBody = setInterval(function () {
      createPopup();
      retry++;

      if (popupCreated || retry >= 40) {
        clearInterval(checkBody);
      }
    }, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();

(function () {

    /* =========================
       CSS INJECTOR
    ========================== */
    const css = `
        @media (min-width: 992px) {
            .c-qiOHF {
                background: url("https://www.image2url.com/r2/default/images/1784832130662-8efe3afe-8ec2-4625-b6a8-6195555a4f35.jpg") center center / cover no-repeat !important;
            }

            .c-qiOHF::before {
                content: "";
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,.35);
                pointer-events: none;
            }

            .c-qiOHF > * {
                position: relative;
            }
        }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);


    /* =========================
       JACKPOT IMAGE REPLACER
    ========================== */
    const NEW_IMAGE_URL = "https://www.image2url.com/r2/default/images/1784832067711-5f9e6d39-3306-4a66-91ef-29140fba7269.png";

    function replaceJackpotDesktop() {
        const imgs = document.querySelectorAll('img[alt="jackpot-bg"]');

        if (!imgs.length) return;

        imgs.forEach(function (img) {

            const parent = img.parentElement;

            if (!parent || parent.dataset.jackpotReplaced === "1") return;

            parent.style.backgroundImage = `url(${NEW_IMAGE_URL})`;
            parent.style.backgroundSize = "contain";
            parent.style.backgroundRepeat = "no-repeat";
            parent.style.backgroundPosition = "center";
            parent.style.backgroundColor = "transparent";

            img.style.opacity = "0";
            img.style.visibility = "hidden";

            parent.dataset.jackpotReplaced = "1";
        });
    }

    function startRetry() {
        let count = 0;
        const maxTry = 40;

        const timer = setInterval(function () {
            replaceJackpotDesktop();
            count++;

            if (count >= maxTry) {
                clearInterval(timer);
            }
        }, 250);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startRetry);
    } else {
        startRetry();
    }

    const observer = new MutationObserver(function () {
        replaceJackpotDesktop();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();

(function () {
    const POPUP_IMAGES = [
        'https://plcl.me/images/uWEtJ.png',
        'https://plcl.me/images/R7Qsn.png',
        'https://plcl.me/images/nJmyo.jpg',
        'https://plcl.me/images/NfRXX.png'
    ];

    const DELAY_KEY = 'popup_delay_1h';
    const SLIDE_INTERVAL = 10000;

    let popupCreated = false;
    let slideTimer = null;
    let currentIndex = 0;

    function canShowPopup() {
        if (location.pathname !== '/') return false;

        const lastShow = Number(localStorage.getItem(DELAY_KEY) || 0);
        if (lastShow && Date.now() - lastShow < 36e5) return false;

        return true;
    }

    function createPopup() {
        if (popupCreated) return;
        if (!canShowPopup()) return;
        if (!document.body) return;

        popupCreated = true;

        const host = document.createElement('div');
        host.id = 'popup-shadow-host';
        document.body.appendChild(host);

        const shadow = host.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            #overlay{
                position:fixed;
                inset:0;
                z-index:2147483646;
                backdrop-filter:blur(8px);
                -webkit-backdrop-filter:blur(8px);
                background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.65));
                animation:fade-in .4s ease forwards;
            }

            #overlay.fade-out{
                animation:fade-out .4s ease forwards;
            }

            #popup{
                position:fixed;
                inset:0;
                z-index:2147483647;
                display:flex;
                align-items:center;
                justify-content:center;
                flex-direction:column;
                gap:10px;
            }

            #popup-box{
                position:relative;
                filter:drop-shadow(0 18px 40px rgba(0,0,0,.55));
                animation:slide-in .6s cubic-bezier(.16,1,.3,1) forwards;
            }

            #popup-box.slide-out{
                animation:slide-out .6s cubic-bezier(.16,1,.3,1) forwards;
            }

            #close-x{
                position:absolute;
                top:-12px;
                right:-12px;
                width:32px;
                height:32px;
                border-radius:50%;
                background:linear-gradient(180deg,#ff4b4b,#9e0000);
                color:#fff;
                font-weight:900;
                display:flex;
                align-items:center;
                justify-content:center;
                cursor:pointer;
                z-index:9999;
                box-shadow:0 6px 16px rgba(0,0,0,.45);
            }

            #popup-img{
                display:block;
                max-width:100%;
                height:auto;
                border-radius:8px;
                opacity:1;
                transition:opacity .45s ease;
                cursor:default;
            }

            #popup-img.fade{
                opacity:0;
            }

            .nav-btn{
                position:absolute;
                top:50%;
                transform:translateY(-50%);
                width:24px;
                height:24px;
                border:none;
                background:rgba(0,0,0,.35);
                color:#fff;
                font-size:22px;
                font-weight:700;
                cursor:pointer;
                z-index:9998;
                line-height:20px;
                padding:0;
                border-radius:50%;
            }

            #prev-btn{
                left:8px;
            }

            #next-btn{
                right:8px;
            }

            .dots{
                position:absolute;
                left:50%;
                bottom:10px;
                transform:translateX(-50%);
                display:flex;
                gap:5px;
                justify-content:center;
                align-items:center;
                z-index:9998;
            }

            .dot{
                width:6px;
                height:6px;
                border-radius:50%;
                border:none;
                background:rgba(255,255,255,.45);
                cursor:pointer;
                padding:0;
            }

            .dot.active{
                background:#ffd700;
            }

            .slot-text{
                font-weight:900;
                font-size:16px;
                color:#ffd700;
                letter-spacing:2px;
                text-shadow:0 0 10px rgba(255,215,0,.55);
            }

            .gif-row{
                display:flex;
                gap:10px;
                justify-content:center;
                margin-top:4px;
            }

            .gif-box{
                position:relative;
                width:90px;
            }

            .gif-box img{
                width:100%;
                border-radius:12px;
                pointer-events:none;
            }

            .gif-box svg{
                position:absolute;
                inset:0;
                width:100%;
                height:100%;
                pointer-events:none;
            }

            .btn-row{
                display:flex;
                gap:12px;
            }

            .btn,.btn-ok{
                position:relative;
                overflow:hidden;
                width:170px;
                padding:12px 0;
                border-radius:12px;
                font-size:14px;
                cursor:pointer;
                text-decoration:none;
                text-align:center;
                font-weight:900;
                color:#ffd86b;
                background:linear-gradient(180deg,#3b2b0d 0%,#151515 35%,#050505 100%);
                border:1px solid #d6a640;
                box-shadow:
                    0 0 0 1px rgba(255,215,120,.25),
                    0 6px 18px rgba(0,0,0,.45),
                    inset 0 1px 0 rgba(255,255,255,.18),
                    inset 0 -2px 8px rgba(0,0,0,.4);
                transition:all .25s ease;
            }

            .btn::before,
            .btn-ok::before{
                content:'';
                position:absolute;
                top:0;
                left:-40%;
                width:25%;
                height:100%;
                background:linear-gradient(
                    120deg,
                    rgba(255,215,0,0) 0%,
                    rgba(255,245,180,.95) 50%,
                    rgba(255,215,0,0) 100%
                );
                transform:skewX(-25deg);
                animation:shine 2s infinite;
            }

            @keyframes slide-in{
                0%{transform:translateX(-40px);opacity:0}
                100%{transform:translateX(0);opacity:1}
            }

            @keyframes slide-out{
                0%{transform:translateX(0);opacity:1}
                100%{transform:translateX(40px);opacity:0}
            }

            @keyframes fade-in{
                from{opacity:0}
                to{opacity:1}
            }

            @keyframes fade-out{
                from{opacity:1}
                to{opacity:0}
            }

            @keyframes shine{
                0%{left:-40%}
                100%{left:125%}
            }
        `;

        shadow.appendChild(style);

        const wrap = document.createElement('div');
        wrap.innerHTML = `
            <div id="overlay"></div>

            <div id="popup">
                <div id="popup-box">
                    <div id="close-x">✕</div>

                    <button class="nav-btn" id="prev-btn">‹</button>
                    <img id="popup-img" src="${POPUP_IMAGES[0]}">
                    <button class="nav-btn" id="next-btn">›</button>

                    <div class="dots" id="dots"></div>
                </div>

                <div class="slot-text">WORLD CUP 2026</div>

                <div class="gif-row">
                    <div class="gif-box">
                        <img src="https://www.image2url.com/r2/default/gifs/1776202907511-66e0b111-777d-4ebe-913e-e96b5c3cbe5f.gif">
                        <svg viewBox="0 0 100 100">
                            <rect x="2" y="2" width="96" height="96" rx="12" fill="none" stroke="#ffd700" stroke-width="2" stroke-dasharray="20 300">
                                <animate attributeName="stroke-dashoffset" from="0" to="-320" dur="2s" repeatCount="indefinite"/>
                            </rect>
                        </svg>
                    </div>

                    <div class="gif-box">
                        <img src="https://media.tenor.com/Hm5Hk1U_uVoAAAAd/fifa-world-cup-2026-fifa.gif">
                        <svg viewBox="0 0 100 100">
                            <rect x="2" y="2" width="96" height="96" rx="12" fill="none" stroke="#ffd700" stroke-width="2" stroke-dasharray="20 300">
                                <animate attributeName="stroke-dashoffset" from="0" to="-320" dur="2s" repeatCount="indefinite"/>
                            </rect>
                        </svg>
                    </div>

                    <div class="gif-box">
                        <img src="https://www.image2url.com/r2/default/gifs/1776203611749-4994e8c2-bf51-4a8e-8d21-1a0732c86ff7.gif">
                        <svg viewBox="0 0 100 100">
                            <rect x="2" y="2" width="96" height="96" rx="12" fill="none" stroke="#ffd700" stroke-width="2" stroke-dasharray="20 300">
                                <animate attributeName="stroke-dashoffset" from="0" to="-320" dur="2s" repeatCount="indefinite"/>
                            </rect>
                        </svg>
                    </div>
                </div>

                <div class="btn-row">
                    <a class="btn" href="https://goviplink.live/livescore" target="_blank">⚽ LIVE SCORE</a>
                    <a class="btn" href="https://goviplink.live/rtp-kudahoki88" target="_blank">RTP LIVE 🎰</a>
                </div>

                <button class="btn-ok" id="btn-ok">OK</button>
            </div>
        `;

        shadow.appendChild(wrap);

        const popupBox = shadow.querySelector('#popup-box');
        const overlay = shadow.querySelector('#overlay');
        const popupImg = shadow.querySelector('#popup-img');
        const dotsBox = shadow.querySelector('#dots');

        function renderDots() {
            dotsBox.innerHTML = '';

            POPUP_IMAGES.forEach(function (_, index) {
                const dot = document.createElement('button');
                dot.className = 'dot' + (index === currentIndex ? ' active' : '');

                dot.addEventListener('click', function () {
                    goToSlide(index);
                    resetSlideTimer();
                });

                dotsBox.appendChild(dot);
            });
        }

        function goToSlide(index) {
            popupImg.classList.add('fade');

            setTimeout(function () {
                currentIndex = index;
                popupImg.src = POPUP_IMAGES[currentIndex];
                popupImg.classList.remove('fade');
                renderDots();
            }, 300);
        }

        function nextSlide() {
            goToSlide((currentIndex + 1) % POPUP_IMAGES.length);
        }

        function prevSlide() {
            goToSlide((currentIndex - 1 + POPUP_IMAGES.length) % POPUP_IMAGES.length);
        }

        function startSlide() {
            slideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
        }

        function resetSlideTimer() {
            if (slideTimer) clearInterval(slideTimer);
            startSlide();
        }

        function closePopup() {
            if (slideTimer) clearInterval(slideTimer);

            popupBox.classList.add('slide-out');
            overlay.classList.add('fade-out');
            localStorage.setItem(DELAY_KEY, Date.now());

            setTimeout(function () {
                host.remove();
            }, 600);
        }

        shadow.querySelector('#next-btn').addEventListener('click', function () {
            nextSlide();
            resetSlideTimer();
        });

        shadow.querySelector('#prev-btn').addEventListener('click', function () {
            prevSlide();
            resetSlideTimer();
        });

        shadow.querySelector('#btn-ok').addEventListener('click', closePopup);
        shadow.querySelector('#close-x').addEventListener('click', closePopup);

        renderDots();
        startSlide();

        console.log('[✅] Popup slider aktif');
    }

    function startRetry() {
        let count = 0;
        const maxTry = 40;

        const timer = setInterval(function () {
            createPopup();
            count++;

            if (popupCreated || count >= maxTry) {
                clearInterval(timer);
            }
        }, 250);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startRetry);
    } else {
        startRetry();
    }

    const observer = new MutationObserver(function () {
        createPopup();
    });

    observer.observe(document.documentElement, {
        childList:true,
        subtree:true
    });
})();

(function () {
    const css = `
        @media (min-width: 992px) {
            .c-qiOHF {
                background: url("https://plcl.me/images/YcYh7.jpg") center center / cover no-repeat !important;
            }

            .c-qiOHF::before {
                content: "";
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.35);
                pointer-events: none;
            }

            .c-qiOHF > * {
                position: relative;
            }
        }
    `;

    const style = document.createElement("style");
    style.id = "desktop-background-overlay";
    style.textContent = css;
    document.head.appendChild(style);
})();

(function () {
    document.addEventListener("DOMContentLoaded", function () {
        if (!document.body.classList.contains("game-page") || document.querySelector(".bottom-header")) {
            return;
        }

        var homeHref = window.location.pathname.indexOf("/local/") !== -1 ? "../../../../index.html" : "../../../index.html";
        var bottomHeader = document.createElement("header");
        bottomHeader.className = "bottom-header";
        bottomHeader.innerHTML =
            '<nav class="bottom-nav" aria-label="Course credits">' +
                '<div class="bnav">MCC 416 </div>' +
                '<div class="bnav">Alexandria Henderson</div>' +
                '<div class="bnav">Hayden Gamblin</div>' +
                '<div class="bnav">Nathanael Tagert</div>' +
            '</nav>' +
            '<a href="' + homeHref + '" class="Blogo" aria-label="GAME AHN">' +
                '<span class="logo-top">AHN</span>' +
                '<span class="logo-main" aria-hidden="true">' +
                    '<span class="logo-letter letter-g">G</span>' +
                    '<span class="logo-letter letter-a">A</span>' +
                    '<span class="logo-letter letter-m">M</span>' +
                    '<span class="logo-letter letter-e">E</span>' +
                '</span>' +
            '</a>';

        document.body.appendChild(bottomHeader);
    });
})();

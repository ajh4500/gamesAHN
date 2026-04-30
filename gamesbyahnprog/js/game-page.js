(function () {
    document.addEventListener("DOMContentLoaded", function () {
        if (!document.body.classList.contains("game-page") || document.querySelector(".bottom-header")) {
            return;
        }

        var bottomHeader = document.createElement("header");
        bottomHeader.className = "bottom-header";
        bottomHeader.innerHTML =
            '<div class="Blogo" aria-label="GAME AHN">' +
                '<span class="logo-top">AHN</span>' +
                '<span class="logo-main" aria-hidden="true">' +
                    '<span class="logo-letter letter-g">G</span>' +
                    '<span class="logo-letter letter-a">A</span>' +
                    '<span class="logo-letter letter-m">M</span>' +
                    '<span class="logo-letter letter-e">E</span>' +
                '</span>' +
            '</div>';

        document.body.appendChild(bottomHeader);
    });
})();

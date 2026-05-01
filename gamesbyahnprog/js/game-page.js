(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var modePrompt = document.querySelector("[data-mode-group]");
        if (modePrompt && !modePrompt.dataset.modeHandlerBound) {
            var modeStorageKey = "gamesbyahn-selected-mode";

            function hideModePrompt() {
                modePrompt.style.opacity = "";
                modePrompt.style.transition = "";
                modePrompt.classList.add("is-hidden");
            }

            function getCurrentModeChoice() {
                var links = modePrompt.querySelectorAll("[data-mode-choice]");
                var currentUrl = window.location.href.split("#")[0];

                for (var i = 0; i < links.length; i++) {
                    var linkUrl = new URL(links[i].getAttribute("href"), window.location.href).href.split("#")[0];
                    if (linkUrl === currentUrl) {
                        return links[i].getAttribute("data-mode-choice");
                    }
                }

                return "";
            }

            try {
                var storedMode = JSON.parse(sessionStorage.getItem(modeStorageKey) || "null");
                var currentGroup = modePrompt.getAttribute("data-mode-group");
                if (storedMode && storedMode.group === currentGroup && storedMode.choice === getCurrentModeChoice()) {
                    hideModePrompt();
                    sessionStorage.removeItem(modeStorageKey);
                }
            } catch (error) {
                sessionStorage.removeItem(modeStorageKey);
            }

            modePrompt.dataset.modeHandlerBound = "true";
            modePrompt.addEventListener("click", function (event) {
                var link = event.target.closest("[data-mode-choice]");
                if (!link) return;

                event.preventDefault();
                hideModePrompt();

                var group = modePrompt.getAttribute("data-mode-group");
                var choice = link.getAttribute("data-mode-choice");
                var targetUrl = new URL(link.getAttribute("href"), window.location.href).href.split("#")[0];
                var currentUrl = window.location.href.split("#")[0];
                if (targetUrl === currentUrl) {
                    return;
                }

                sessionStorage.setItem(modeStorageKey, JSON.stringify({ group: group, choice: choice }));
                window.location.href = link.href;
            });
        }

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

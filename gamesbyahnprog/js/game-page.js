(function () {
    function storageKey(group) {
        return "gamesbyahn_mode_" + group;
    }

    function hidePrompt(prompt) {
        prompt.classList.add("is-hidden");
    }

    function showPrompt(prompt) {
        prompt.classList.remove("is-hidden");
    }

    document.addEventListener("DOMContentLoaded", function () {
        var prompts = document.querySelectorAll("[data-mode-group]");

        prompts.forEach(function (prompt) {
            var group = prompt.getAttribute("data-mode-group");
            if (group && sessionStorage.getItem(storageKey(group))) {
                hidePrompt(prompt);
            }

            prompt.addEventListener("click", function (event) {
                var choice = event.target.closest("[data-mode-choice]");
                if (!choice) return;

                if (group) {
                    sessionStorage.setItem(storageKey(group), choice.getAttribute("data-mode-choice"));
                }

                hidePrompt(prompt);
            });
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".restart-button")) return;

            prompts.forEach(function (prompt) {
                var group = prompt.getAttribute("data-mode-group");
                if (group) {
                    sessionStorage.removeItem(storageKey(group));
                }

                showPrompt(prompt);
            });
        }, true);
    });
})();

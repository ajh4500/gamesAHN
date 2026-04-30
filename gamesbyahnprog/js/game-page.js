(function () {
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("[data-mode-group]").forEach(function (prompt) {
            prompt.classList.remove("is-hidden");
        });
    });
})();

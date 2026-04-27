(function () {
    var AUTH_STORAGE_KEY = "gamesbyahn_user";
    var API_BASE = window.API_BASE;

    function getUser() {
        var raw = localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    }

    function setUser(user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }

    function clearUser() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    function renderNav() {
        var nav = document.querySelector("header nav");
        if (!nav) return;

        var user = getUser();
        if (user) {
            nav.innerHTML = '<a href="#" class="nav-profile" data-auth-action="profile">Profile</a>' +
                '<a href="#" class="nav-logout" data-auth-action="logout">Log out</a>';
            return;
        }

        nav.innerHTML = '<a href="#" data-auth-action="login">Log in</a>' +
            '<a href="#" data-auth-action="signup">Sign Up</a>';
    }

    function buildModal() {
        if (document.getElementById("auth-modal")) return;

        var modal = document.createElement("div");
        modal.className = "auth-modal";
        modal.id = "auth-modal";
        modal.innerHTML =
            '<div class="auth-panel">' +
                '<div class="auth-topbar">' +
                    '<h2 class="auth-title">Account</h2>' +
                    '<button type="button" class="auth-close" aria-label="Close">&times;</button>' +
                '</div>' +
                '<div class="auth-switcher">' +
                    '<button type="button" class="auth-tab is-active" data-auth-tab="login">Log in</button>' +
                    '<button type="button" class="auth-tab" data-auth-tab="signup">Sign Up</button>' +
                '</div>' +
                '<form class="auth-form is-active" data-auth-form="login">' +
                    '<div class="auth-field">' +
                        '<label for="login-email">Email</label>' +
                        '<input id="login-email" name="email" type="email" required>' +
                    '</div>' +
                    '<div class="auth-field">' +
                        '<label for="login-password">Password</label>' +
                        '<input id="login-password" name="password" type="password" required>' +
                    '</div>' +
                    '<button class="auth-submit" type="submit">Log in</button>' +
                '</form>' +
                '<form class="auth-form" data-auth-form="signup">' +
                    '<div class="auth-field">' +
                        '<label for="signup-username">Username</label>' +
                        '<input id="signup-username" name="username" type="text" required>' +
                    '</div>' +
                    '<div class="auth-field">' +
                        '<label for="signup-email">Email</label>' +
                        '<input id="signup-email" name="email" type="email" required>' +
                    '</div>' +
                    '<div class="auth-field">' +
                        '<label for="signup-password">Password</label>' +
                        '<input id="signup-password" name="password" type="password" required>' +
                    '</div>' +
                    '<button class="auth-submit" type="submit">Sign Up</button>' +
                '</form>' +
                '<div class="auth-message" id="auth-message"></div>' +
            '</div>';

        document.body.appendChild(modal);
    }

    function showMessage(message, isSuccess) {
        var messageEl = document.getElementById("auth-message");
        if (!messageEl) return;
        messageEl.textContent = message || "";
        messageEl.classList.toggle("is-success", !!isSuccess);
    }

    function setActiveTab(tab) {
        var tabs = document.querySelectorAll("[data-auth-tab]");
        var forms = document.querySelectorAll("[data-auth-form]");

        tabs.forEach(function (button) {
            button.classList.toggle("is-active", button.getAttribute("data-auth-tab") === tab);
        });

        forms.forEach(function (form) {
            form.classList.toggle("is-active", form.getAttribute("data-auth-form") === tab);
        });

        showMessage("");
    }

    function openModal(tab) {
        buildModal();
        setActiveTab(tab || "login");
        document.getElementById("auth-modal").classList.add("is-open");
    }

    function closeModal() {
        var modal = document.getElementById("auth-modal");
        if (!modal) return;
        modal.classList.remove("is-open");
        showMessage("");
    }

    async function submitAuth(url, payload) {
        var response = await fetch(API_BASE + url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        var data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }
        return data;
    }

    function goHome() {
        var isHome = /GAMESBYAHN\.html$/i.test(window.location.pathname) || window.location.pathname === "/" || window.location.pathname === "";
        if (isHome) {
            window.location.reload();
            return;
        }

        window.location.href = window.location.pathname.includes("/games/") ? "../../GAMESBYAHN.html" : "GAMESBYAHN.html";
    }

    function bindEvents() {
        document.addEventListener("click", function (event) {
            var actionEl = event.target.closest("[data-auth-action]");
            if (actionEl) {
                event.preventDefault();
                var action = actionEl.getAttribute("data-auth-action");

                if (action === "login" || action === "signup") {
                    openModal(action);
                } else if (action === "logout") {
                    clearUser();
                    renderNav();
                } else if (action === "profile") {
                    var user = getUser();
                    if (user) {
                        alert("Logged in as " + user.username);
                    }
                }
            }

            if (event.target.classList.contains("auth-close") || event.target.id === "auth-modal") {
                closeModal();
            }

            if (event.target.matches("[data-auth-tab]")) {
                setActiveTab(event.target.getAttribute("data-auth-tab"));
            }
        });

        document.addEventListener("submit", async function (event) {
            var form = event.target;
            if (!form.matches("[data-auth-form]")) return;

            event.preventDefault();

            try {
                if (form.getAttribute("data-auth-form") === "login") {
                    var loginData = Object.fromEntries(new FormData(form).entries());
                    var loginResult = await submitAuth("/login", loginData);
                    setUser(loginResult.user);
                    showMessage("Login successful.", true);
                    closeModal();
                    goHome();
                } else {
                    var signupData = Object.fromEntries(new FormData(form).entries());
                    var signupResult = await submitAuth("/signup", signupData);
                    setUser(signupResult.user);
                    showMessage("Signup successful.", true);
                    closeModal();
                    goHome();
                }
            } catch (error) {
                showMessage(error.message, false);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderNav();
        buildModal();
        bindEvents();
    });
    
})();

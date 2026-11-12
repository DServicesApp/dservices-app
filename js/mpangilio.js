/* ==========================================
   DSERVICES - MPANGILIO.JS
   ========================================== */

(function () {
    "use strict";

    const SETTINGS_MENUS = [
        { id: "account", name: "AKAUNTI", icon: "🏢" },
        { id: "users", name: "WATUMIAJI", icon: "👥" },
        { id: "permissions", name: "RUHUSA", icon: "🔐" },
        { id: "history", name: "HISTORIA", icon: "📜" },
        { id: "about", name: "KUHUSU MFUMO", icon: "ℹ️" },
        { id: "ads", name: "MATANGAZO", icon: "📢" }
    ];

    let currentSettingsPage = "home";

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function getSettingsUser() {
        return window.currentUser || {};
    }

    function getSettingsAccountId() {
        const user = getSettingsUser();

        return user.ACCOUNT_ID ||
               user.accountId ||
               user.account_id || "";
    }

    function getSettingsRole() {
        const user = getSettingsUser();

        return String(user.ROLE || user.role || "")
            .trim().toUpperCase();
    }

    function canOpenSettings() {
        return [
            "OWNER",
            "ACCOUNT_OWNER",
            "ADMIN"
        ].includes(getSettingsRole());
    }

    // MUUNDO MKUU
    function renderSettings(targetContainer) {

        const container =
            targetContainer ||
            document.getElementById("moduleWorkspace") ||
            document.getElementById("mainContent") ||
            document.getElementById("content");

        if (!container) return;

        if (!canOpenSettings()) {
            container.innerHTML =
                "<h3>Huna ruhusa ya kufungua MPANGILIO.</h3>";
            return;
        }

        container.innerHTML = `

            <div class="ds-settings">

                <!-- KUSHOTO -->
                <aside class="ds-settings-sidebar">

                    <div class="ds-settings-heading">
                        ⚙ MPANGILIO
                    </div>

                    ${SETTINGS_MENUS.map(item => `
                        <button
                            class="ds-settings-nav ${
                                currentSettingsPage === item.id
                                    ? "active" : ""
                            }"
                            onclick="window.openSettingsPage('${item.id}')">

                            <span>${item.icon}</span>
                            <span>${item.name}</span>

                        </button>
                    `).join("")}

                </aside>

                <!-- KULIA -->
                <main class="ds-settings-main">

                    <div id="settingsPageContent">
                        ${renderSettingsPage(currentSettingsPage)}
                    </div>

                </main>

            </div>
        `;
    }

    // KADI ZA MWANZO
    function renderHomePage() {

        return `

            <div class="ds-settings-welcome">

                <h3>MPANGILIO WA MFUMO</h3>

                <p>Chagua sehemu unayotaka kusimamia.</p>

            </div>

            <div class="ds-settings-cards">

                ${SETTINGS_MENUS.map(item => `

                    <button
                        class="ds-settings-card"
                        onclick="window.openSettingsPage('${item.id}')">

                        <div class="ds-settings-oval">
                            ${item.icon}
                        </div>

                        <div class="ds-settings-placeholder"></div>

                        <div class="ds-settings-card-title">
                            ${item.name}
                        </div>

                        <div class="ds-settings-card-line"></div>

                    </button>

                `).join("")}

            </div>

        `;
    }

    // KURASA ZA MPANGILIO
    function renderSettingsPage(page) {

        switch (page) {

            case "home":
                return renderHomePage();

            case "account":
                return renderAccountPage();

            case "users":
                return `
                    <h3>👥 WATUMIAJI</h3>
                    <p>Usimamizi wa watumiaji wa taasisi.</p>
                `;

            case "permissions":
                return `
                    <h3>🔐 RUHUSA</h3>
                    <p>Usimamizi wa ruhusa za watumiaji.</p>
                `;

            case "history":
                return `
                    <h3>📜 HISTORIA</h3>
                    <p>Historia ya shughuli za taasisi.</p>
                `;

            case "about":
                return `
                    <h3>ℹ KUHUSU MFUMO</h3>
                    <h2>DServices</h2>
                    <p>Huduma bora kwa ustawi wa jamii.</p>
                `;

            case "ads":
                return `
                    <h3>📢 MATANGAZO</h3>
                    <p>Usimamizi wa matangazo ya mfumo.</p>
                `;

            default:
                return "<p>Ukurasa haujapatikana.</p>";
        }
    }

    // AKAUNTI
    function renderAccountPage() {

        const user = getSettingsUser();

        return `

            <div class="ds-account">

                <h3>🏢 AKAUNTI YA TAASISI</h3>

                <div class="ds-account-grid">

                    <label>
                        ACCOUNT ID
                        <input
                            type="text"
                            value="${escapeHTML(getSettingsAccountId())}"
                            readonly>
                    </label>

                    <label>
                        ACCOUNT NAME
                        <input
                            type="text"
                            value="${escapeHTML(
                                user.ACCOUNT_NAME ||
                                user.accountName || ""
                            )}"
                            readonly>
                    </label>

                    <label>
                        MOTTO
                        <input type="text" readonly>
                    </label>

                    <label>
                        REG
                        <input type="text" readonly>
                    </label>

                    <label>
                        HUDUMA
                        <select disabled>
                            <option>Huduma kulingana na ruhusa</option>
                        </select>
                    </label>

                    <label>
                        KIPENGELE
                        <select disabled>
                            <option>Vipengele kulingana na ruhusa</option>
                        </select>
                    </label>

                </div>

            </div>
        `;
    }

    // KUFUNGUA UKURASA
    function openSettingsPage(page) {

        currentSettingsPage = page;

        const content =
            document.getElementById("settingsPageContent");

        if (content) {
            content.innerHTML = renderSettingsPage(page);
        }

        document.querySelectorAll(".ds-settings-nav")
            .forEach(btn => btn.classList.remove("active"));

        const activeButton = document.querySelector(
            `.ds-settings-nav[onclick*="'${page}'"]`
        );

        if (activeButton) {
            activeButton.classList.add("active");
        }
    }
    window.openSettingsPage = openSettingsPage;

    window.renderSettings = renderSettings;

    window.renderMpangilioPage = function(workspace) {
        currentSettingsPage = "home";
        renderSettings(workspace);
    };

})();
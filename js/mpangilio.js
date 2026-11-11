/* ==========================================
   DSERVICES - MPANGILIO.JS
   ========================================== */

(function () {
    "use strict";

    // MENYU ZA MPANGILIO
    const SETTINGS_MENUS = [
        { id: "account", name: "AKAUNTI", icon: "🏢" },
        { id: "users", name: "WATUMIAJI", icon: "👥" },
        { id: "permissions", name: "RUHUSA", icon: "🔐" },
        { id: "history", name: "HISTORIA", icon: "📜" },
        { id: "about", name: "KUHUSU MFUMO", icon: "ℹ️" }
    ];

    let currentSettingsPage = "account";

    // HTML SAFE
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    // PATA MTUMIAJI
    function getSettingsUser() {
        return window.currentUser || {};
    }

    // PATA ACCOUNT ID
    function getSettingsAccountId() {
        const user = getSettingsUser();

        return user.ACCOUNT_ID ||
               user.accountId ||
               user.account_id ||
               "";
    }

    // ROLE
    function getSettingsRole() {
        const user = getSettingsUser();

        return String(user.ROLE || user.role || "")
            .trim()
            .toUpperCase();
    }

    // RUHUSA YA KUONA MPANGILIO
    function canOpenSettings() {
        const role = getSettingsRole();

        return [
            "OWNER",
            "ACCOUNT_OWNER",
            "ADMIN"
        ].includes(role);
    }

    // MUUNDO MKUU
    function renderSettings() {

        const container =
            document.getElementById("mainContent") ||
            document.getElementById("content");

        if (!container) {
            console.error("DServices: Eneo la maudhui halijapatikana.");
            return;
        }

        if (!canOpenSettings()) {
            container.innerHTML =
                "<h3>Huna ruhusa ya kufungua MPANGILIO.</h3>";
            return;
        }

        container.innerHTML = `
            <div class="ds-settings">

                <h2>⚙️ MPANGILIO</h2>

                <div class="ds-settings-menu">
                    ${SETTINGS_MENUS.map(item => `
                        <button
                            class="ds-settings-btn ${
                                currentSettingsPage === item.id
                                    ? "active" : ""
                            }"
                            onclick="window.openSettingsPage('${item.id}')">

                            <span>${item.icon}</span>
                            ${item.name}

                        </button>
                    `).join("")}
                </div>

                <div id="settingsPageContent">
                    ${renderSettingsPage(currentSettingsPage)}
                </div>

            </div>
        `;
    }

    // KURASA ZA MPANGILIO
    function renderSettingsPage(page) {

        switch (page) {

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
                    <h3>ℹ️ KUHUSU MFUMO</h3>
                    <h2>DServices</h2>
                    <p>Huduma bora kwa ustawi wa jamii.</p>
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
                        <select id="settingsService" disabled>
                            <option>Huduma kulingana na ruhusa</option>
                        </select>
                    </label>

                    <label>
                        KIPENGELE
                        <select id="settingsModule" disabled>
                            <option>Vipengele kulingana na ruhusa</option>
                        </select>
                    </label>

                </div>

                <p class="ds-settings-note">
                    Taarifa zinaoneshwa kulingana na akaunti na
                    ruhusa ulizopewa.
                </p>

            </div>
        `;
    }

    // BADILI UKURASA
    function openSettingsPage(page) {

        currentSettingsPage = page;

        renderSettings();
    }

    // WEKA FUNCTIONS GLOBAL
    window.openSettingsPage = openSettingsPage;
    window.renderSettings = renderSettings;

})();
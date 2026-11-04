/* =====================================
   DServices - MAHUDHURIO
===================================== */

let mahudhurioTab = "ASUBUHI";
let mahudhurioAina = "";
let mahudhurioPopupOpen = false;


/* =====================================
   RUHUSA ZA JUMLA
===================================== */
function mahudhurioPermission(action) {

  if (typeof isOwner === "function" && isOwner()) {
    return true;
  }
  const permissions = currentUser?.permissions || [];

  if (!Array.isArray(permissions)) return false;

  const accountId = String(
    currentUser?.accountId ||
    currentUser?.ACCOUNT_ID || ""
  ).toUpperCase();

  const service = String(
    selectedService || "ELIMU"
  ).toUpperCase();

  return permissions.some(p => {

    const pAccount = String(
      p.accountId || p.ACCOUNT_ID || ""
    ).toUpperCase();

    const pService = String(
      p.huduma || p.service || ""
    ).toUpperCase();

    const pModule = String(
      p.module || ""
    ).toUpperCase();

    const pDiary = String(
      p.diaryId || ""
    ).toUpperCase();

    const accountMatch =
      !pAccount ||
      !accountId ||
      pAccount === accountId;

    const serviceMatch =
      !pService ||
      pService === "ALL" ||
      pService === service;

    const moduleMatch =
      !pModule ||
      ["ALL", "TUITION", "MAHUDHURIO"].includes(pModule);

    const diaryMatch =
      !pDiary ||
      ["ALL", "MAHUDHURIO"].includes(pDiary);

    const value =
      action === "approve"
        ? (p.approve ?? p.approvals)
        : p[action];
    const allowed =
      value === true ||
      value === 1 ||
      ["YES", "TRUE", "1"].includes(
        String(value).toUpperCase()
      );

    return (
      accountMatch &&
      serviceMatch &&
      moduleMatch &&
      diaryMatch &&
      allowed
    );
  });
}


/* =====================================
   RUHUSA ZA WANAFUNZI / WATUMISHI
===================================== */

function mahudhurioAinaPermission(aina) {

  if (typeof isOwner === "function" && isOwner()) {
    return true;
  }

  const permissions = currentUser?.permissions || [];

  if (!Array.isArray(permissions)) return false;

  const generalPermission =
    mahudhurioPermission("view");

  const ainaUpper = String(aina).toUpperCase();

  const specificPermissions = permissions.filter(p => {

    const scope = String(
      p.module ||
      p.diaryId ||
      p.kipengele ||
      ""
    ).toUpperCase();

    return (
      scope === "WANAFUNZI" ||
      scope === "WATUMISHI"
    );
  });

  // Kama hakuna ruhusa maalumu kwa aina,
  // tumia ruhusa ya jumla ya MAHUDHURIO.
  if (specificPermissions.length === 0) {
    return generalPermission;
  }
  return specificPermissions.some(p => {

    const scope = String(
      p.module ||
      p.diaryId ||
      p.kipengele ||
      ""
    ).toUpperCase();

    const value = p.view;

    const allowed =
      value === true ||
      value === 1 ||
      ["YES", "TRUE", "1"].includes(
        String(value).toUpperCase()
      );

    return scope === ainaUpper && allowed;
  });
}


/* =====================================
   KUFUNGUA UKURASA WA MAHUDHURIO
===================================== */

function renderMahudhurioPage(workspace) {

  if (!mahudhurioPermission("view")) {
    workspace.innerHTML = `
      <section class="section-panel">
        <p>Huna ruhusa ya kuona mahudhurio.</p>
      </section>
    `;
    return;
  }

  mahudhurioTab = "ASUBUHI";
  mahudhurioAina = "";

  workspace.innerHTML = `

    <section class="mahudhurio-page">

      <nav class="mahudhurio-toolbar">

        <button
          type="button"
          class="mah-btn active"
          onclick="openMahudhurioTab('ASUBUHI')">
          ASUBUHI
        </button>

        <button
          type="button"
          class="mah-btn"
          onclick="openMahudhurioTab('JIONI')">
          JIONI
        </button>

        <button
          type="button"
          class="mah-btn"
          onclick="openMahudhurioTab('HISTORIA')">
          HISTORIA
        </button>

      </nav>

      <div id="mahudhurioContent"></div>

    </section>
  `;

  addMahudhurioStyles();

  openMahudhurioTab("ASUBUHI");
}


/* =====================================
   KUBADILI TAB
===================================== */

function openMahudhurioTab(tab) {

  if (!mahudhurioPermission("view")) return;

  mahudhurioTab = tab;
  mahudhurioAina = "";

  document.querySelectorAll(".mah-btn")
    .forEach(btn => {

      btn.classList.toggle(
        "active",
        btn.textContent.trim() === tab
      );

    });

  if (tab === "ASUBUHI" || tab === "JIONI") {
    openMahudhurioPopup();
  }

  if (tab === "HISTORIA") {
    renderMahudhurioHistory();
  }
}


/* =====================================
   KUFUNGUA KAPAZIA
===================================== */

function openMahudhurioPopup() {

  const content = document.getElementById(
    "mahudhurioContent"
  );

  if (!content) return;

  const canSeeWanafunzi =
    mahudhurioAinaPermission("WANAFUNZI");

  const canSeeWatumishi =
    mahudhurioAinaPermission("WATUMISHI");

  if (!canSeeWanafunzi && !canSeeWatumishi) {

    content.innerHTML = `
      <p class="mah-no-permission">
        Huna ruhusa ya kuona WANAFUNZI
        wala WATUMISHI.
      </p>
    `;

    return;
  }

  content.innerHTML = `

    <div class="mah-popup-overlay"
         onclick="closeMahudhurioPopup(event)">

      <div class="mah-popup"
           onclick="event.stopPropagation()">

        <button
          type="button"
          class="mah-popup-close"
          onclick="closeMahudhurioPopup()">
          X
        </button>

        ${
          canSeeWanafunzi
          ? `
            <button
              type="button"
              class="mah-choice"
              onclick="selectMahudhurioAina('WANAFUNZI')">
              WANAFUNZI
            </button>
          `
          : ""
        }

        ${
          canSeeWatumishi
          ? `
            <button
              type="button"
              class="mah-choice"
              onclick="selectMahudhurioAina('WATUMISHI')">
              WATUMISHI
            </button>
          `
          : ""
        }

      </div>

    </div>
  `;

  mahudhurioPopupOpen = true;
}


/* =====================================
   KUFUNGA KAPAZIA
===================================== */

function closeMahudhurioPopup(event) {

  if (event && event.target &&
      !event.target.classList.contains(
        "mah-popup-overlay"
      )) {
    return;
  }

  const overlay = document.querySelector(
    ".mah-popup-overlay"
  );

  if (overlay) overlay.remove();

  mahudhurioPopupOpen = false;
}


/* =====================================
   KUCHAGUA WANAFUNZI / WATUMISHI
===================================== */

function selectMahudhurioAina(aina) {

  if (!mahudhurioAinaPermission(aina)) {
    alert("Huna ruhusa ya kuona sehemu hii.");
    return;
  }

  mahudhurioAina = aina;

  closeMahudhurioPopup();

  renderMahudhurioRoster();
}


/* =====================================
   UKURASA WA ORODHA YA MAHUDHURIO
===================================== */

function renderMahudhurioRoster() {

  const content = document.getElementById(
    "mahudhurioContent"
  );

  if (!content) return;

  if (!mahudhurioAinaPermission(mahudhurioAina)) {
    content.innerHTML = `
      <p>Huna ruhusa ya kuona taarifa hizi.</p>
    `;
    return;
  }

  content.innerHTML = `

    <section class="mah-roster-page">

      <div class="mah-roster-header">

        <button
          type="button"
          class="mah-back"
          onclick="openMahudhurioPopup()">
          ← RUDI
        </button>

        <h3>
          MAHUDHURIO YA ${mahudhurioAina}
        </h3>

        <p>
          KIPINDI: ${mahudhurioTab}
        </p>

      </div>

      <div id="mahudhurioRosterContent">

        ${
          mahudhurioAina === "WANAFUNZI"
          ? `
            <p>Chagua darasa ili kuona wanafunzi.</p>
            <div id="mahudhurioClassSelect"></div>
          `
          : `
            <p>
              Orodha ya watumishi itaonyeshwa hapa.
            </p>
          `
        }

      </div>

    </section>
  `;
}


/* =====================================
   HISTORIA
===================================== */

function renderMahudhurioHistory() {

  const content = document.getElementById(
    "mahudhurioContent"
  );

  if (!content) return;

  content.innerHTML = `

    <section class="section-panel">

      <h3>HISTORIA YA MAHUDHURIO</h3>

      <p>
        Historia ya mahudhurio itaunganishwa hapa.
      </p>

    </section>
  `;
}


/* =====================================
   CSS
===================================== */

function addMahudhurioStyles() {

  if (document.getElementById("mahudhurioStyles")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "mahudhurioStyles";

  style.textContent = `

    .mahudhurio-toolbar {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      flex-wrap: nowrap;
      margin: 0 0 12px;
    }

    .mahudhurio-toolbar button {
      flex: 1;
      min-width: 0;
      padding: 10px 5px;
      white-space: nowrap;
      border: 1px solid #4b5320;
      border-radius: 6px;
      background: #4b5320;
      color: white;
      cursor: pointer;
    }

    .mahudhurio-toolbar button.active {
      background: #f28c28;
      border-color: #f28c28;
    }

    .mah-popup-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0,0,0,.35);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 15px;
    }

    .mah-popup {
      position: relative;
      width:  min(280px, 90%);
      padding: 48px 18px 20px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 5px 25px rgba(0,0,0,.2);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .mah-popup-close {
      position: absolute;
      top: 10px;
      right: 12px;
      border: none;
      background: transparent;
      color: #4b5320;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
    }

    .mah-choice {
      width: 100%;
      padding: 13px 8px;
      border: 1px solid #4b5320;
      border-radius: 6px;
      background: #4b5320;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    .mah-choice:active {
      background: #f28c28;
    }

    .mah-no-permission {
      text-align: center;
      padding: 15px;
    }

    .mah-roster-page {
      width: 100%;
    }

    .mah-roster-header {
      margin-bottom: 15px;
    }

    .mah-roster-header h3 {
      margin: 12px 0 5px;
    }

    .mah-back {
      padding: 8px 12px;
      border: 1px solid #4b5320;
      border-radius: 6px;
      background: white;
      color: #4b5320;
      cursor: pointer;
    }

  `;

  document.head.appendChild(style);
}
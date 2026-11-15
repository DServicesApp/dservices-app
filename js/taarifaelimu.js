/* ==================================
   DSERVICES - ELIMU
   MODULI: TAARIFA
   FILE: taarifaelimu.js
   VERSION: 1.0
===================================== */
(function () {
  "use strict";

  const ROOT_ID = "taarifaElimuRoot";

  const MONTHS = [
    "JANUARI", "FEBRUARI", "MACHI", "APRILI",
    "MEI", "JUNI", "JULAI", "AGOSTI",
    "SEPTEMBA", "OKTOBA", "NOVEMBA", "DESEMBA"
  ];

  const CARDS = [
    {
      id: "michango",
      title: "Taarifa ya Michango",
      icon: "📊"
    },
    {
      id: "ada",
      title: "Ada Mwanafunzi",
      icon: "💳"
    },
    {
      id: "usajili",
      title: "Taarifa ya Usajili",
      icon: "📝"
    },
    {
      id: "fedha",
      title: "Taarifa ya Fedha",
      icon: "💰"
    },
    {
      id: "maendeleo",
      title: "Tathimini",
      icon: "📈"
    },
    {
      id: "wazazi",
      title: "Taarifa ya Wazazi/ Walezi",
      icon: "👨‍👩‍👧"
    }
  ];

  const currentYear = new Date().getFullYear();

  const state = {
    activeReport: null,
    reportData: null
  };

  /* =================================
     CSS
  ================================== */
  function addStyles() {
    if (document.getElementById("taarifaElimuStyles")) return;

    const style = document.createElement("style");
    style.id = "taarifaElimuStyles";

    style.textContent = `
    #${ROOT_ID} {
    width: 100%;
    box-sizing: border-box;
    color: #222;
    font-family: Arial, sans-serif;
    margin-top: -12px;
    padding-top: 0;
  }

      #${ROOT_ID} * {
        box-sizing: border-box;
      }

      #${ROOT_ID} .te-heading {
        font-size: 17px;
        font-weight: bold;
        margin: 5px 0 14px;
        color: #4B5320;
      }

      #${ROOT_ID} .te-card-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
      }

      #${ROOT_ID} .te-card {
        width: 100%;
        min-height: 82px;
        padding: 11px;
        font-size: 14px;
        font-weight: bold;
        background: #d1d1d1;
        color: #111;
        border: 1px solid #111;
        border-radius: 7px;
        cursor: pointer;
        text-align: center;
      }

      #${ROOT_ID} .te-card:active {
        background: #bfc5b8;
      }

      #${ROOT_ID} .te-icon {
        display: block;
        font-size: 23px;
        margin-bottom: 7px;
      }

      #${ROOT_ID} .te-panel {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 7px;
        padding: 12px;
        background: #fff;
      }

      #${ROOT_ID} .te-title {
        font-size: 16px;
        font-weight: bold;
        color: #4B5320;
        margin-bottom: 13px;
      }

      #${ROOT_ID} .te-filters {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 14px;
      }

      #${ROOT_ID} .te-field {
        min-width: 0;
      }

      #${ROOT_ID} .te-field label {
        display: block;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      #${ROOT_ID} .te-field select,
      #${ROOT_ID} .te-field input {
        width: 100%;
        min-width: 0;
        padding: 10px 7px;
        border: 1px solid #aaa;
        border-radius: 5px;
        background: #fff;
        font-size: 13px;
      }

      #${ROOT_ID} .te-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 12px 0;
      }

      #${ROOT_ID} .te-btn {
        padding: 10px 16px;
        border: 0;
        border-radius: 5px;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
      }

      #${ROOT_ID} .te-primary {
        background: #4B5320;
        color: white;
      }

      #${ROOT_ID} .te-secondary {
        background: #e5e7eb;
        color: #111;
        border: 1px solid #777;
      }

      #${ROOT_ID} .te-orange {
        background: #F28C28;
        color: #111;
      }

      #${ROOT_ID} .te-report {
        margin-top: 15px;
        padding: 12px;
        border: 1px solid #aaa;
        background: #fff;
        overflow-x: auto;
      }

      #${ROOT_ID} .te-report-header {
        text-align: center;
        margin-bottom: 15px;
      }

      #${ROOT_ID} .te-account {
        font-size: 17px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      #${ROOT_ID} .te-report-name {
        font-weight: bold;
        font-size: 14px;
      }

      #${ROOT_ID} .te-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        margin-top: 10px;
      }

      #${ROOT_ID} .te-table th,
      #${ROOT_ID} .te-table td {
        border: 1px solid #888;
        padding: 8px 6px;
        text-align: left;
      }

      #${ROOT_ID} .te-table th {
        background: #e5e7eb;
        font-weight: bold;
      }

      #${ROOT_ID} .te-total {
        font-weight: bold;
        background: #eee;
      }

      #${ROOT_ID} .te-empty {
        padding: 15px;
        text-align: center;
        color: #666;
        background: #f4f4f4;
        font-size: 13px;
      }

      #${ROOT_ID} .te-footer {
        font-size: 11px;
        margin-top: 18px;
        border-top: 1px solid #aaa;
        padding-top: 9px;
      }

      #${ROOT_ID} .te-hidden {
        display: none !important;
      }

      @media (max-width: 380px) {
        #${ROOT_ID} .te-filters {
          grid-template-columns: 1fr;
        }

        #${ROOT_ID} .te-card {
          font-size: 12px;
        }
      }

      @media print {
        body * {
          visibility: hidden;
        }

        #${ROOT_ID} .te-report,
        #${ROOT_ID} .te-report * {
          visibility: visible;
        }

        #${ROOT_ID} .te-report {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          border: 0;
        }

        #${ROOT_ID} .te-actions,
        #${ROOT_ID} .te-filters {
          display: none !important;
        }

        @page {
          size: A4;
          margin: 12mm;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =================================
     HELPERS
  ================================ */
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function getAccountName() {
    const user = window.currentUser || {};
    const account = user.account || user.taasisi || user;

    return (
      account.JINA_LA_ACCOUNT ||
      account.jinaLaAccount ||
      account.accountName ||
      "JINA LA TAASISI"
    );
  }

  function getUserName() {
    const user = window.currentUser || {};

    return (
      user.JINA ||
      user.JINA_LA_MTUMIAJI ||
      user.username ||
      user.jina ||
      "Mtumiaji"
    );
  }

  function getModuleName() {
    return window.selectedModule || "ELIMU";
  }

  function getYears() {
    let years = "";

    for (let y = currentYear; y >= 2018; y--) {
      years += `<option value="${y}">${y}</option>`;
    }

    return years;
  }

  function field(label, name, options, type) {
    const inputType = type || "select";

    if (inputType === "input") {
      return `
        <div class="te-field">
          <label>${escapeHTML(label)}</label>
          <input name="${escapeHTML(name)}" placeholder="Tafuta...">
        </div>
      `;
    }

    return `
      <div class="te-field">
        <label>${escapeHTML(label)}</label>
        <select name="${escapeHTML(name)}">
          ${options || ""}
        </select>
      </div>
    `;
  }

  function yearOptions() {
    return `
      <option value="">Chagua mwaka</option>
      ${getYears()}
    `;
  }

  function monthOptions() {
    return `
      <option value="">Chagua mwezi</option>
      <option value="YOTE">MIEZI YOTE</option>
      ${MONTHS.map(m => `<option value="${m}">${m}</option>`).join("")}
    `;
  }

  function footerHTML() {
    return `
      <div class="te-footer">
        Imetolewa na: ${escapeHTML(getUserName())}
        <br>
        Tarehe: ${new Date().toLocaleDateString("sw-TZ")}
      </div>
    `;
  }

  /* =================================
     LANDING PAGE
  ================================== */
  function renderHome(root) {
    state.activeReport = null;
    root.innerHTML = `
     
      <div class="te-card-actions">
        ${CARDS.map(card => `
          <button class="te-card"
            data-report="${card.id}">
            <span class="te-icon">${card.icon}</span>
            ${card.title}
          </button>
        `).join("")}
      </div>

      <div id="teWorkArea"></div>
    `;
  }

  /* ================================
     FILTERS
  ================================== */
  function getReportFields(id) {
    switch (id) {

      case "michango":
        return `
          ${field("MWAKA", "mwaka", yearOptions())}
          ${field("MWEZI", "mwezi", monthOptions())}
          ${field("AINA YA MCHANGO", "aina", `
            <option value="">Chagua aina ya mchango</option>
          `)}
        `;

      case "ada":
        return `
          ${field("MWAKA", "mwaka", yearOptions())}
          ${field("MWEZI", "mwezi", monthOptions())}
          ${field("DARASA", "darasa", `
            <option value="">Chagua darasa</option>
          `)}
          ${field("JINA LA MWANAFUNZI", "mwanafunzi", `
            <option value="">Chagua mwanafunzi</option>
          `)}
        `;

      case "usajili":
      case "fedha":
        return `
          ${field("MWAKA", "mwaka", yearOptions())}
        `;

      case "maendeleo":
        return `
          ${field("KUANZIA MWAKA", "mwakaMwanzo", yearOptions())}
          ${field("HADI MWAKA", "mwakaMwisho", yearOptions())}
        `;

      case "wazazi":
        return `
          ${field("MWAKA", "mwaka", yearOptions())}
          ${field("DARASA", "darasa", `
            <option value="">Chagua darasa</option>
          `)}
        `;

      default:
        return "";
    }
  }

  function reportTitle(id) {
    const card = CARDS.find(c => c.id === id);
    return card ? card.title : "TAARIFA";
  }

  function openReport(root, id) {
    state.activeReport = id;
    state.reportData = null;

    const work = root.querySelector("#teWorkArea");

    if (!work) return;

    const isParentReport = id === "wazazi";

    work.innerHTML = `
      <div class="te-panel" style="margin-top:14px">

        <div class="te-title">
          ${escapeHTML(reportTitle(id))}
        </div>

        <div class="te-filters">
          ${getReportFields(id)}
        </div>

        <div class="te-actions">
          <button class="te-btn te-primary"
            data-action="generate">
            TENGENEZA TAARIFA
          </button>

          <button class="te-btn te-secondary"
            data-action="back">
            RUDI
          </button>
        </div>

        <div id="teReportOutput"></div>

        ${isParentReport ? `
          <div class="te-empty">
            Sehemu hii itakamilishwa baada ya kufafanua
            taarifa zinazohitajika kwa wazazi na walezi.
          </div>
        ` : ""}
      </div>
    `;

    if (id === "maendeleo") {
      const start = work.querySelector('[name="mwakaMwanzo"]');
      const end = work.querySelector('[name="mwakaMwisho"]');

      if (start) start.value = Math.max(2018, currentYear - 4);
      if (end) end.value = currentYear;
    }
  }

  /* ===============================
     REPORT DISPLAY
  ================================ */
  function renderReport(root, id, data) {
    const output = root.querySelector("#teReportOutput");

    if (!output) return;

    if (!data || !Array.isArray(data.rows) || data.rows.length === 0) {
      output.innerHTML = `
        <div class="te-empty">
          Hakuna taarifa ya kuonyesha kwa sasa.
          <br><br>
          API ya taarifa hii bado haijaunganishwa.
          Hakuna takwimu za mfano zilizowekwa.
        </div>
      `;
      return;
    }

    const headers = data.headers || [];

    const tableHead = headers.map(h =>
      `<th>${escapeHTML(h)}</th>`
    ).join("");

    const tableRows = data.rows.map(row => `
      <tr>
        ${row.map(cell => `<td>${escapeHTML(cell)}</td>`).join("")}
      </tr>
    `).join("");

    output.innerHTML = `
      <div class="te-report" id="tePrintableReport">

        <div class="te-report-header">
          <div class="te-account">
            ${escapeHTML(getAccountName())}
          </div>

          <div>${escapeHTML(getModuleName())}</div>

          <div class="te-report-name">
            ${escapeHTML(data.title || reportTitle(id))}
          </div>
        </div>

        ${data.summary ? `
          <div>${escapeHTML(data.summary)}</div>
        ` : ""}

        <table class="te-table">
          <thead>
            <tr>${tableHead}</tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>

        ${footerHTML()}
      </div>

      <div class="te-actions">
        <button class="te-btn te-orange"
          data-action="download">
          PAKUA / CHAPISHA PDF
        </button>

        <button class="te-btn te-secondary"
          data-action="back">
          RUDI
        </button>
      </div>
    `;
  }

  /* =====================================================
     DATA CONNECTION PREPARATION
     
     Hapa ndipo tutaunganisha API zako halisi baadaye.
     Hatubuni majina ya action.
  ===================================================== */

  async function loadReportData(id, filters) {

    /*
      Mfumo ukishapata API halisi,
      utaweka data provider hapa:

      window.TAARIFA_ELIMU_DATA_PROVIDER = async function(id, filters) {
        // Itaita API iliyopo kwa kutumia callAPI()
        // na kurudisha:
        // {
        //   title: "...",
        //   headers: ["..."],
        //   rows: [["..."]]
        // }
      };
    */

    if (
      typeof window.TAARIFA_ELIMU_DATA_PROVIDER !== "function"
    ) {
      return null;
    }

    return await window.TAARIFA_ELIMU_DATA_PROVIDER(id, filters);
  }

  /* =====================================================
     FILTER VALUES
  ===================================================== */

  function readFilters(root) {
    const filters = {};

    root.querySelectorAll("#teWorkArea select, #teWorkArea input")
      .forEach(input => {
        filters[input.name] = input.value;
      });

    return filters;
  }

  /* =====================================================
     PDF
  ===================================================== */

  function downloadPDF() {
    const report = document.getElementById("tePrintableReport");

    if (!report) {
      alert("Hakuna taarifa ya kupakua.");
      return;
    }

    /*
      Kwenye simu:
      Chagua Save as PDF kwenye dirisha la kuchapisha.
    */

    window.print();
  }

  /* =====================================================
     EVENT HANDLING
  ===================================================== */

  const boundRoots = new WeakSet();

  function bindEvents(root) {
    if (boundRoots.has(root)) return;

    boundRoots.add(root);

    root.addEventListener("click", async function (event) {

      const card = event.target.closest("[data-report]");

      if (card) {
        openReport(root, card.dataset.report);
        return;
      }

      const actionButton = event.target.closest("[data-action]");

      if (!actionButton) return;

      const action = actionButton.dataset.action;

      if (action === "back") {
        renderHome(root);
        return;
      }

      if (action === "download") {
        downloadPDF();
        return;
      }

      if (action === "generate") {

        if (state.activeReport === "wazazi") {
          alert("Sehemu hii bado inasubiri mpangilio wa taarifa.");
          return;
        }

        const filters = readFilters(root);

        if (state.activeReport === "maendeleo") {
          if (!filters.mwakaMwanzo || !filters.mwakaMwisho) {
            alert("Chagua mwaka wa mwanzo na wa mwisho.");
            return;
          }

          if (
            Number(filters.mwakaMwanzo) >
            Number(filters.mwakaMwisho)
          ) {
            alert("Mwaka wa mwanzo hauwezi kuzidi mwaka wa mwisho.");
            return;
          }
        } else if (!filters.mwaka) {
          alert("Tafadhali chagua mwaka.");
          return;
        }

        actionButton.disabled = true;
        actionButton.textContent = "INATAFUTA...";

        try {
          const data = await loadReportData(
            state.activeReport,
            filters
          );

          state.reportData = data;

          renderReport(root, state.activeReport, data);

        } catch (error) {
          console.error("TAARIFA ELIMU:", error);

          const output = root.querySelector("#teReportOutput");

          if (output) {
            output.innerHTML = `
              <div class="te-empty">
                Imeshindikana kupata taarifa.
                Tafadhali jaribu tena.
              </div>
            `;
          }

        } finally {
          actionButton.disabled = false;
          actionButton.textContent = "TENGENEZA TAARIFA";
        }
      }
    });
  }

  /* =====================================================
     MAIN RENDER FUNCTION
  ===================================================== */

  window.renderTaarifaelimuPage = function (workspace) {

    if (!workspace) {
      console.error("TAARIFA ELIMU: Workspace haijapatikana.");
      return;
    }

    addStyles();

    let root = workspace.querySelector("#" + ROOT_ID);

    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      workspace.appendChild(root);
    }

    bindEvents(root);
    renderHome(root);
  };

})();
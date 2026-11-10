/* =========================================
   DSERVICES - TAALUMA
   FILE: taaluma.js
   UTENDAJI | RATIBA | MATOKEO
========================================= */

(function () {
  "use strict";

  let taalumaWorkspace = null;

  let taalumaState = {
    madarasa: [],
    masomo: [],
    mitihani: [],
    ratibaMasomo: [],
    ratibaMitihani: [],
    alama: [],
    majukumu: []
  };

  /* =====================================
     ACCOUNT ID
  ===================================== */

  function getTaalumaAccountId() {
    const user = window.currentUser || {};

    return (
      user.accountId ||
      user.ACCOUNT_ID ||
      user.account_id ||
      ""
    );
  }

  /* =====================================
     HIFADHI TAARIFA
  ===================================== */

  async function saveTaalumaData(action, data) {

    if (typeof window.saveOfflineRecord !== "function") {
      alert("Mfumo wa IndexedDB haujapatikana.");
      return false;
    }

    try {

      await window.saveOfflineRecord({
        accountId: getTaalumaAccountId(),
        serviceId: "ELIMU",
        moduleId: "TUITION",
        action: action,
        payload: data
      });

      return true;

    } catch (error) {

      console.error("Taaluma save error:", error);

      alert("Imeshindikana kuhifadhi taarifa.");

      return false;
    }
  }

  /* =====================================
     MUONEKANO MKUU
  ===================================== */

  function renderTaalumaPage(workspace) {

    taalumaWorkspace = workspace;

    workspace.innerHTML = `
      <section class="taaluma-panel">

        <div class="taaluma-toolbar">

          <button
            type="button"
            class="taaluma-btn add"
            onclick="openTaalumaModal()">
            ＋
          </button>

          <button
            type="button"
            class="taaluma-btn"
            onclick="openRatibaModal()">
            RATIBA
          </button>

          <button
            type="button"
            class="taaluma-btn"
            onclick="showTaalumaResults()">
            MATOKEO
          </button>

        </div>

        <div id="taalumaContent">

          <div class="taaluma-welcome">
            <h3>USIMAMIZI WA TAALUMA</h3>
            <p>
              Simamia madarasa, masomo, ratiba,
              mitihani na matokeo.
            </p>
          </div>

        </div>

      </section>

      <div id="taalumaModalRoot"></div>
    `;

    injectTaalumaStyles();
  }

  /* =====================================
     KIPAZIA CHA UTENDAJI
  ===================================== */

  function openTaalumaModal() {

    const root = document.getElementById(
      "taalumaModalRoot"
    );

    if (!root) return;

    root.innerHTML = `
      <div class="taaluma-overlay"
           onclick="closeTaalumaModal(event)">

        <div class="taaluma-modal"
             onclick="event.stopPropagation()">

          <div class="taaluma-modal-header">

            <h3>UTENDAJI WA TAALUMA</h3>

            <button
              type="button"
              onclick="closeTaalumaModal()">
              ×
            </button>

          </div>

          <div class="taaluma-actions">

            <button onclick="showTaalumaForm('DARASA')">
              SAJILI DARASA NA MASOMO
            </button>

            <button onclick="showTaalumaForm('MAJUKUMU')">
              SAJILI MAJUKUMU
            </button>

            <button onclick="showTaalumaForm('RATIBA_MASOMO')">
              INGIZA RATIBA ZA MASOMO
            </button>

            <button onclick="showTaalumaForm('RATIBA_MITIHANI')">
              INGIZA RATIBA ZA MITIHANI
            </button>

            <button onclick="showTaalumaForm('ALAMA')">
              INGIZA ALAMA
            </button>

          </div>

          <div id="taalumaFormArea"></div>

        </div>
      </div>
    `;
  }

  /* =====================================
     FUNGA KIPAZIA
  ===================================== */

  function closeTaalumaModal(event) {

    if (
      event &&
      event.target &&
      !event.target.classList.contains("taaluma-overlay")
    ) {
      return;
    }

    const root = document.getElementById(
      "taalumaModalRoot"
    );

    if (root) root.innerHTML = "";
  }

  /* =====================================
     KIPAZIA CHA RATIBA
  ===================================== */

  function openRatibaModal() {

    const root = document.getElementById(
      "taalumaModalRoot"
    );

    if (!root) return;

    root.innerHTML = `
      <div class="taaluma-overlay"
           onclick="closeTaalumaModal(event)">

        <div class="taaluma-modal ratiba-modal"
             onclick="event.stopPropagation()">

          <div class="taaluma-modal-header">

            <h3>RATIBA</h3>

            <button
              type="button"
              onclick="closeTaalumaModal()">
              ×
            </button>

          </div>

          <div class="taaluma-actions">

            <button onclick="showRatiba('MASOMO')">
              MASOMO
            </button>

            <button onclick="showRatiba('MITIHANI')">
              MITIHANI
            </button>

          </div>

          <div id="ratibaContent"></div>

        </div>
      </div>
    `;
  }

  /* =====================================
     MATOKEO
  ===================================== */

  function showTaalumaResults() {

    const content = document.getElementById(
      "taalumaContent"
    );

    if (!content) return;

    content.innerHTML = `
      <div class="taaluma-results">

        <h3>MATOKEO YA MITIHANI</h3>

        <div class="taaluma-filters">

          <select id="matokeoMwaka"
                  onchange="filterMatokeoMwaka()">
            <option value="">MWAKA</option>
          </select>

          <select id="matokeoDarasa"
                  disabled
                  onchange="filterMatokeoDarasa()">
            <option value="">DRS</option>
          </select>

          <select id="matokeoMtihani"
                  disabled
                  onchange="filterMatokeoMtihani()">
            <option value="">MTIHANI</option>
          </select>

          <select id="matokeoSomo"
                  disabled
                  onchange="filterMatokeoSomo()">
            <option value="">SOMO</option>
          </select>

        </div>

        <div id="matokeoTableArea">

          <p class="taaluma-empty">
            Chagua mwaka, darasa, mtihani na somo
            ili kuona matokeo.
          </p>

        </div>

      </div>
    `;

    loadMatokeoYears();
  }

  /* =====================================
     CSS
  ===================================== */

  function injectTaalumaStyles() {

    if (document.getElementById("taalumaStyles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "taalumaStyles";

    style.textContent = `

      .taaluma-panel {
        padding: 12px;
        width: 100%;
      }

      .taaluma-toolbar {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        flex-wrap: wrap;
        margin-bottom: 15px;
      }

      .taaluma-btn {
        border: 0;
        border-radius: 7px;
        padding: 10px 17px;
        background: #4B5320;
        color: white;
        font-weight: bold;
        cursor: pointer;
      }

      .taaluma-btn.add {
        background: #F28C28;
        font-size: 19px;
      }

      .taaluma-welcome {
        background: white;
        border-radius: 10px;
        padding: 25px 15px;
        text-align: center;
        border: 1px solid #ddd;
      }

      .taaluma-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.48);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
      }

      .taaluma-modal {
        background: white;
        width: 100%;
        max-width: 520px;
        max-height: 90vh;
        overflow-y: auto;
        border-radius: 12px;
        padding: 15px;
        box-shadow: 0 8px 30px rgba(0,0,0,.2);
      }

      .ratiba-modal {
        max-width: 380px;
      }

      .taaluma-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #F28C28;
        padding-bottom: 10px;
        margin-bottom: 15px;
      }

      .taaluma-modal-header h3 {
        margin: 0;
        color: #4B5320;
        font-size: 16px;
      }

      .taaluma-modal-header button {
        border: 0;
        background: transparent;
        font-size: 28px;
        cursor: pointer;
      }

      .taaluma-actions {
        display: grid;
        gap: 9px;
      }

      .taaluma-actions button {
        padding: 13px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: #f4f6f8;
        color: #333;
        font-weight: bold;
        text-align: left;
        cursor: pointer;
      }

      .taaluma-actions button:hover {
        border-color: #4B5320;
        background: #edf0e5;
      }

      .taaluma-filters {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        margin: 15px 0;
      }

      .taaluma-filters select {
        width: 100%;
        min-width: 0;
        padding: 10px 5px;
        border: 1px solid #ccc;
        border-radius: 7px;
        background: white;
      }

      .taaluma-empty {
        text-align: center;
        padding: 25px 10px;
        color: #777;
      }

      @media(max-width:600px) {
        .taaluma-filters {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     FUNCTIONS ZITAKAZOKAMILISHWA
     KWENYE SEHEMU ZINAZOFUATA
  ===================================== */

  function showTaalumaForm(type) {

  const area = document.getElementById("taalumaFormArea");

  if (!area) return;

  let title = "";

  switch (type) {

    case "DARASA":
      title = "SAJILI DARASA NA MASOMO";
      break;

    case "MAJUKUMU":
      title = "SAJILI MAJUKUMU";
      break;

    case "RATIBA_MASOMO":
      title = "INGIZA RATIBA ZA MASOMO";
      break;

    case "RATIBA_MITIHANI":
      title = "INGIZA RATIBA ZA MITIHANI";
      break;

    case "ALAMA":
      title = "INGIZA ALAMA";
      break;

    default:
      return;
  }

  area.innerHTML = `
    <div class="taaluma-form-section">

      <h3>${title}</h3>

      <p>
        Fomu ya ${title} itaonekana hapa.
      </p>

    </div>
  `;
}

  function showRatiba(type) {
    console.log("Ratiba:", type);
  }

  function loadMatokeoYears() {}
  function filterMatokeoMwaka() {}
  function filterMatokeoDarasa() {}
  function filterMatokeoMtihani() {}
  function filterMatokeoSomo() {}

  /* =====================================
     PUBLIC FUNCTIONS
  ===================================== */

  window.renderTaalumaPage = renderTaalumaPage;
  window.openTaalumaModal = openTaalumaModal;
  window.closeTaalumaModal = closeTaalumaModal;
  window.showTaalumaForm = showTaalumaForm;
  window.openRatibaModal = openRatibaModal;
  window.showRatiba = showRatiba;
  window.showTaalumaResults = showTaalumaResults;

  window.filterMatokeoMwaka = filterMatokeoMwaka;
  window.filterMatokeoDarasa = filterMatokeoDarasa;
  window.filterMatokeoMtihani = filterMatokeoMtihani;
  window.filterMatokeoSomo = filterMatokeoSomo;

})();
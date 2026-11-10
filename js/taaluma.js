/* =====================================
   DSERVICES - TAALUMA
   FILE: taaluma.js
   UTENDAJI | RATIBA | MATOKEO
===================================== */

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

  /* =================================
     ACCOUNT ID
  ================================== */

  function getTaalumaAccountId() {
    const user = window.currentUser || {};

    return (
      user.accountId ||
      user.ACCOUNT_ID ||
      user.account_id ||
      ""
    );
  }

  /* =================================
     HIFADHI TAARIFA
  ================================== */
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

  /* =================================
     MUONEKANO MKUU
  ================================== */
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

  /* ==================================
     KIPAZIA CHA UTENDAJI
  =================================== */
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

 <div class="taaluma-actions" id="taalumaActions">

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

  /* ================================
     FUNGA KIPAZIA
  ================================ */
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

  /* ================================
     KIPAZIA CHA RATIBA
  ================================ */
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

  /* ===============================
     MATOKEO
  ================================= */
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

  /* ================================
     CSS
  ================================= */
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
.taaluma-form-section {
  margin-top: 18px;
  padding: 12px;
  border-top: 2px solid #F28C28;
}

.taaluma-form-section h3 {
  color: #4B5320;
  font-size: 16px;
}

.taaluma-form-section label {
  display: block;
  margin-top: 12px;
  font-weight: bold;
  font-size: 13px;
}

.taaluma-form-section input,
.taaluma-form-section select,
.taaluma-form-section textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 7px;
}

.taaluma-form-section button {
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  border: 0;
  border-radius: 7px;
  background: #4B5320;
  color: white;
  font-weight: bold;
}

.taaluma-form-card {
  padding: 12px;
  margin-top: 15px;
  border: 1px solid #ddd;
  border-radius: 9px;
}

      @media(max-width:600px) {
        .taaluma-filters {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =================================
     FUNCTIONS ZITAKAZOKAMILISHWA
     KWENYE SEHEMU ZINAZOFUATA
  ================================= */
  function showTaalumaForm(type) {
  const area = document.getElementById("taalumaFormArea");
  if (!area) return;
  let form = "";
  switch (type) {
    case "DARASA":
      form = `
        <h3>SAJILI DARASA NA MASOMO</h3>

        <div class="taaluma-form-card">

          <h4>1. SAJILI DARASA</h4>

          <label>JINA LA DARASA</label>
          <input type="text" id="jinaDarasa"
                 placeholder="Mfano: I">

          <label>MAELEZO</label>
          <textarea id="maelezoDarasa"></textarea>

          <button onclick="saveTaalumaDarasa()">
            HIFADHI DARASA
          </button>

        </div>

        <div class="taaluma-form-card">

          <h4>2. SAJILI SOMO</h4>

          <label>JINA LA SOMO</label>
          <input type="text" id="jinaSomo"
                 placeholder="Mfano: HISABATI">

          <label>MAELEZO</label>
          <textarea id="maelezoSomo"></textarea>

          <button onclick="saveTaalumaSomo()">
            HIFADHI SOMO
          </button>

        </div>

        <div class="taaluma-form-card">

          <h4>3. UNGANISHA MASOMO NA DARASA</h4>

          <label>CHAGUA DARASA</label>
          <select id="unganishaDarasa">
            <option value="">CHAGUA DARASA</option>
          </select>

          <label>CHAGUA MASOMO</label>
          <select id="unganishaMasomo" multiple>
          </select>

          <button onclick="saveTaalumaMasomoDarasa()">
            UNGANISHA
          </button>

        </div>
      `;

      break;


    case "MAJUKUMU":
      form = `
        <h3>SAJILI MAJUKUMU</h3>

        <label>MTUMISHI / MWALIMU</label>
        <select id="jukumuMtumishi">
          <option value="">CHAGUA MTUMISHI</option>
        </select>

        <label>DARASA</label>
        <select id="jukumuDarasa">
          <option value="">CHAGUA DARASA</option>
        </select>

        <label>SOMO</label>
        <select id="jukumuSomo">
          <option value="">CHAGUA SOMO</option>
        </select>

        <label>AINA YA JUKUMU</label>
        <select id="ainaJukumu">
        <option value="">CHAGUA</option>
        <option>MWALIMU WA SOMO</option>
       <option>MWALIMU WA DARASA</option>
    <option>MSIMAMIZI WA MTIHANI</option>
       <option>JUKUMU JINGINE</option>
        </select>

        <button onclick="saveTaalumaJukumu()">
          HIFADHI
        </button>
      `;

      break;


    case "RATIBA_MASOMO":

      form = `
        <h3>INGIZA RATIBA ZA MASOMO</h3>

        <label>DARASA</label>
        <select id="ratibaDarasa"></select>

        <label>SIKU</label>
        <select id="ratibaSiku">
          <option>JUMATATU</option>
          <option>JUMANNE</option>
          <option>JUMATANO</option>
          <option>ALHAMISI</option>
          <option>IJUMAA</option>
          <option>JUMAMOSI</option>
        </select>

        <label>SOMO</label>
        <select id="ratibaSomo"></select>

        <label>MWALIMU</label>
        <select id="ratibaMwalimu"></select>

        <label>MUDA WA KUANZA</label>
        <input type="time" id="ratibaMwanzo">

        <label>MUDA WA KUMALIZA</label>
        <input type="time" id="ratibaMwisho">

        <button onclick="saveRatibaMasomo()">
          HIFADHI RATIBA
        </button>
      `;
      break;

    case "RATIBA_MITIHANI":
      form = `
        <h3>INGIZA RATIBA ZA MITIHANI</h3>
        <label>JINA LA MTIHANI</label>
        <input type="text" id="jinaMtihani">
        <label>DARASA</label>
        <select id="mtihaniDarasa"></select>
        <label>SOMO</label>
        <select id="mtihaniSomo"></select>
        <label>TAREHE</label>
        <input type="date" id="tareheMtihani">

        <label>MUDA WA KUANZA</label>
        <input type="time" id="mtihaniMwanzo">

        <label>MUDA WA KUMALIZA</label>
        <input type="time" id="mtihaniMwisho">

        <button onclick="saveRatibaMitihani()">
          HIFADHI RATIBA
        </button>
      `;

      break;


    case "ALAMA":

  form = `
    <h3>INGIZA ALAMA</h3>

    <div class="taaluma-filters">

      <select id="alamaMwaka"
        onchange="filterAlamaMwaka()">

        <option value="">MWAKA</option>

      </select>

      <select id="alamaDarasa"
        disabled
        onchange="filterAlamaDarasa()">

        <option value="">DRS</option>

      </select>

      <select id="alamaMtihani"
        disabled
        onchange="filterAlamaMtihani()">

        <option value="">MTIHANI</option>

      </select>

      <select id="alamaSomo"
        disabled
        onchange="filterAlamaSomo()">

        <option value="">SOMO</option>

      </select>

    </div>

    <div id="alamaWanafunziArea">

      <p class="taaluma-empty">
        Chagua mwaka, darasa, mtihani na somo
        ili kuona wanafunzi.
      </p>

    </div>
  `;
      break;
    default:
      return;
  }
  area.innerHTML = `
  <div class="taaluma-form-section">
    <button type="button"
      onclick="rudiTaalumaMenu()">
      ← RUDI KWENYE VIPENGELE
    </button>
    ${form}

  </div>
`;
const actions = document.getElementById("taalumaActions");
if (actions) {
  actions.style.display = "none";}
}

/* =================================
   ONESHA RATIBA
================================== */
function showRatiba(type) {
  const area = document.getElementById("ratibaContent");

  if (!area) return;

  let content = "";

  if (type === "MASOMO") {

    content = `
      <h3>RATIBA ZA MASOMO</h3>

      <label>DARASA</label>
      <select id="viewRatibaDarasa">
        <option value="">MADARASA YOTE</option>
      </select>

      <label>SIKU</label>
      <select id="viewRatibaSiku">
        <option value="">SIKU ZOTE</option>
        <option>JUMATATU</option>
        <option>JUMANNE</option>
        <option>JUMATANO</option>
        <option>ALHAMISI</option>
        <option>IJUMAA</option>
        <option>JUMAMOSI</option>
      </select>

      <div id="ratibaMasomoTable">
        <p class="taaluma-empty">
          Hakuna ratiba iliyoonyeshwa bado.
        </p>
      </div>

      <button type="button"
        onclick="pakuaRatiba('MASOMO')">
        PAKUA RATIBA
      </button>
    `;

  } else if (type === "MITIHANI") {

    content = `
      <h3>RATIBA ZA MITIHANI</h3>

      <label>DARASA</label>
      <select id="viewMtihaniDarasa">
        <option value="">MADARASA YOTE</option>
      </select>

      <label>MWAKA</label>
      <select id="viewMtihaniMwaka">
        <option value="">CHAGUA MWAKA</option>
      </select>

      <div id="ratibaMitihaniTable">
        <p class="taaluma-empty">
          Hakuna ratiba iliyoonyeshwa bado.
        </p>
      </div>

      <button type="button"
        onclick="pakuaRatiba('MITIHANI')">
        PAKUA RATIBA
      </button>
    `;

  } else {
    return;
  }

  area.innerHTML = `
    <div class="taaluma-form-section">
      ${content}
    </div>
  `;
}

function pakuaRatiba(type) {
  const tableId = type === "MASOMO"
    ? "ratibaMasomoTable"
    : "ratibaMitihaniTable";

  const area = document.getElementById(tableId);

  if (!area) return;

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Ruhusu mfumo kufungua ukurasa wa kupakua.");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>RATIBA ZA ${type}</title>
      </head>
      <body>
        <h2>RATIBA ZA ${type}</h2>
        ${area.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

/* =====================================
   RUDI KWENYE VIPENGELE
===================================== */
function rudiTaalumaMenu() {
  const actions = document.getElementById("taalumaActions");
  const area = document.getElementById("taalumaFormArea");
  if (actions) {
    actions.style.display = "grid";
  }
  if (area) {
    area.innerHTML = "";
  }
}

/* =====================================
   FILTER ZA ALAMA
===================================== */
function filterAlamaMwaka() {
  const mwaka = document.getElementById("alamaMwaka").value;
  const darasa = document.getElementById("alamaDarasa");
  const mtihani = document.getElementById("alamaMtihani");
  const somo = document.getElementById("alamaSomo");
  darasa.disabled = !mwaka;
  mtihani.disabled = true;
  somo.disabled = true;
  darasa.value = "";
  mtihani.value = "";
  somo.value = ""; document.getElementById("alamaWanafunziArea").innerHTML = "";

}

function filterAlamaDarasa() {
  const darasa = document.getElementById("alamaDarasa").value;
  const mtihani = document.getElementById("alamaMtihani");
  const somo = document.getElementById("alamaSomo");
  mtihani.disabled = !darasa;
  somo.disabled = true;
  mtihani.value = "";
  somo.value = "";

  document.getElementById("alamaWanafunziArea").innerHTML = "";

}

function filterAlamaMtihani() {
  const mtihani = document.getElementById("alamaMtihani").value;
  const somo = document.getElementById("alamaSomo");
  somo.disabled = !mtihani;

  somo.value = "";

  document.getElementById("alamaWanafunziArea").innerHTML = "";

}

function filterAlamaSomo() {

  const mwaka = document.getElementById("alamaMwaka").value;
  const darasa = document.getElementById("alamaDarasa").value;
  const mtihani = document.getElementById("alamaMtihani").value;
  const somo = document.getElementById("alamaSomo").value;

  if (!mwaka || !darasa || !mtihani || !somo) return;

  const area = document.getElementById("alamaWanafunziArea");

  area.innerHTML = `
    <h3>MATOKEO YA ${somo}</h3>

    <div style="overflow-x:auto">

      <table style="width:100%; border-collapse:collapse">

        <thead>
          <tr>
            <th>ID</th>
            <th>JINA</th>
            <th>JINSI</th>
            <th>SOMO</th>
            <th>DARAJA</th>
            <th>NAFASI</th>
          </tr>
        </thead>

        <tbody id="alamaWanafunziRows">

          <tr>
            <td colspan="6" style="text-align:center;padding:15px">
              Orodha ya wanafunzi itaonekana hapa.
            </td>
          </tr>

        </tbody>

      </table>

    </div>
  `;
}

  /* ================================
   PUBLIC FUNCTIONS
================================ */
window.renderTaalumaPage = renderTaalumaPage;
window.openTaalumaModal = openTaalumaModal;
window.closeTaalumaModal = closeTaalumaModal;

window.showTaalumaForm = showTaalumaForm;
window.rudiTaalumaMenu = rudiTaalumaMenu;

window.openRatibaModal = openRatibaModal;
window.showRatiba = showRatiba;
window.pakuaRatiba = pakuaRatiba;

window.showTaalumaResults = showTaalumaResults;

window.filterAlamaMwaka = filterAlamaMwaka;
window.filterAlamaDarasa = filterAlamaDarasa;
window.filterAlamaMtihani = filterAlamaMtihani;
window.filterAlamaSomo = filterAlamaSomo;

window.filterMatokeoMwaka = filterMatokeoMwaka;
window.filterMatokeoDarasa = filterMatokeoDarasa;
window.filterMatokeoMtihani = filterMatokeoMtihani;
window.filterMatokeoSomo = filterMatokeoSomo;
})();
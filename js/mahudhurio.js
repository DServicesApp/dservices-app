/* ===============================
 MAHUDHURIO - WANAFUNZI NA WATUMISHI
================================= */

let mahudhurioAina = "";
let mahudhurioDate = "";
let mahudhurioClass = "";
let mahudhurioRecords = [];
let mahudhurioBusy = false;


/* ==================================
   MSAIDIZI
=================================== */
function mahText(value) {
  return String(value ?? "").trim();
}

function mahUpper(value) {
  return mahText(value).toUpperCase();
}

function mahEscape(value) {
  return mahText(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[c]);
}

function mahToday() {

  const now = new Date();

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}


/* ================================
   RUHUSA ZA JUMLA
================================= */
function mahudhurioPermission(action) {

  if (typeof isOwner === "function" && isOwner()) {
    return true;
  }

  const permissions = currentUser?.permissions || [];

  if (!Array.isArray(permissions)) return false;

  const accountId = mahUpper(
    currentUser?.accountId ||
    currentUser?.ACCOUNT_ID
  );

  const service = mahUpper(
    selectedService || "ELIMU"
  );

  return permissions.some(p => {

    const pAccount = mahUpper(
      p.accountId || p.ACCOUNT_ID
    );

    const pService = mahUpper(
      p.huduma || p.service
    );

    const pModule = mahUpper(p.module);
    const pDiary = mahUpper(p.diaryId);

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
        mahUpper(value)
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


/* ===================================
   RUHUSA ZA WANAFUNZI / WATUMISHI
=================================== */
function mahudhurioAinaPermission(aina) {

  if (typeof isOwner === "function" && isOwner()) {
    return true;
  }

  if (!mahudhurioPermission("view")) {
    return false;
  }

  const ainaUpper = mahUpper(aina);

  if (!["WANAFUNZI", "WATUMISHI"].includes(ainaUpper)) {
    return false;
  }

  const permissions = currentUser?.permissions || [];

  if (!Array.isArray(permissions)) return false;

  const ainaZote = ["WANAFUNZI", "WATUMISHI"];

  const zinaRuhusaMaalum = permissions.some(p => {

    const scopes = [
      p.module,
      p.diaryId,
      p.kipengele
    ].map(mahUpper);

    return scopes.some(s => ainaZote.includes(s));
  });

  // Kama hakuna ruhusa maalum, tumia ruhusa ya jumla.
  if (!zinaRuhusaMaalum) {
    return true;
  }

  // Kama zipo ruhusa maalum, hakikisha aina husika imeruhusiwa.
  return permissions.some(p => {

    const scopes = [
      p.module,
      p.diaryId,
      p.kipengele
    ].map(mahUpper);

    const inahusika = scopes.includes(ainaUpper);

    const value = p.view;

    const allowed =
      value === true ||
      value === 1 ||
      ["YES", "TRUE", "1"].includes(mahUpper(value));

    return inahusika && allowed;
  });
}

/* ================================
   KUFUNGUA MAHUDHURIO
=================================== */
function renderMahudhurioPage(workspace) {

  if (!mahudhurioPermission("view")) {

    workspace.innerHTML = `
      <section class="section-panel">
        <p>Huna ruhusa ya kuona mahudhurio.</p>
      </section>
    `;

    return;
  }

  window.mahudhurioWorkspace = workspace;

  mahudhurioAina = "";
  mahudhurioRecords = [];

  addMahudhurioStyles();

  workspace.innerHTML = `

    <section class="mah-page">

      <div class="mah-main-buttons" id="mahMainButtons">

        ${
          mahudhurioAinaPermission("WATUMISHI")
          ? `
            <button
              class="mah-main-btn"
              onclick="openMahudhurioAina('WATUMISHI')">
              WATUMISHI
            </button>
          `
          : ""
        }

        ${
          mahudhurioAinaPermission("WANAFUNZI")
          ? `
            <button
              class="mah-main-btn"
              onclick="openMahudhurioAina('WANAFUNZI')">
              WANAFUNZI
            </button>
          `
          : ""
        }

      </div>

      <div id="mahudhurioContent"></div>

    </section>
  `;
}


/* =============================
   KUCHAGUA WANAFUNZI / WATUMISHI
=================================== */
function openMahudhurioAina(aina) {

  if (!mahudhurioAinaPermission(aina)) {
    alert("Huna ruhusa ya sehemu hii.");
    return;
  }

  mahudhurioAina = mahUpper(aina);
  mahudhurioRecords = [];

  // Ondoa darasa la awali tunapobadilisha aina.
  mahudhurioClass = "";

  const buttons = document.getElementById("mahMainButtons");

  if (buttons) {
    buttons.style.display = "none";
  }

  if (mahudhurioAina === "WANAFUNZI") {
    renderMahudhurioWanafunzi();
  }

  if (mahudhurioAina === "WATUMISHI") {
    renderMahudhurioWatumishi();
  }
}


/* ================================
   KUFUNGA FOMU
================================== */
function fungaMahudhurioFomu() {

  mahudhurioAina = "";
  mahudhurioRecords = [];

  if (window.mahudhurioWorkspace) {
    renderMahudhurioPage(window.mahudhurioWorkspace);
  }
}

/* ==============================
   UKURASA WA WANAFUNZI
=============================== */
function renderMahudhurioWanafunzi() {

  const content = document.getElementById(
    "mahudhurioContent"
  );

  if (!content) return;

  content.innerHTML = `

    <section class="mah-work">

      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        margin:0 0 15px;
      ">

        <h3 style="
          margin:0;
          font-size:15px;
        ">
          MAHUDHURIO YA WANAFUNZI
        </h3>

        <button
          onclick="fungaMahudhurioFomu()"
          style="
            width:32px;
            height:32px;
            border:none;
            border-radius:50%;
            background:#d00000;
            color:white;
            font-size:23px;
            font-weight:bold;
            cursor:pointer;
            flex-shrink:0;
          ">
          ×
        </button>

      </div>

      <div class="mah-filters">

        <div>
          <label>DARASA</label>

          <select id="mahClass">
            <option value="">INAPAKIA MADARASA...</option>
          </select>
        </div>

        <div>
          <label>TAREHE</label>

          <input
            type="date"
            id="mahStudentDate"
            value="${mahToday()}">
        </div>

      </div>

      <div class="mah-actions">

        <button
          class="mah-action-btn"
          onclick="loadMahudhurioWanafunzi()">

          PAKIA WANAFUNZI

        </button>

        <button
          class="mah-report-btn"
          onclick="showMahudhurioReport()">

          RIPOTI

        </button>

      </div>

      <div id="mahStudentList">

        <p class="mah-empty">
          Chagua darasa na tarehe.
        </p>

      </div>

    </section>
  `;

  loadMahudhurioClasses();
}


/* ===================================
   KUPATA MADARASA
================================== */
async function loadMahudhurioClasses() {

  const select = document.getElementById("mahClass");

  if (!select) return;

  try {

    const result = await callAPI({
      action: "getAttendanceClasses"
    });

    if (!result || result.success === false) {
      throw new Error(
        result?.message || "Imeshindwa kupata madarasa."
      );
    }

    const classes =
      result.classes ||
      result.data ||
      [];

    select.innerHTML = `
      <option value="">CHAGUA DARASA</option>
      ${
        classes.map(c => {

          const name = typeof c === "string"
            ? c
            : c.className || c.CLASS_NAME || c.jina || "";

          return `
            <option value="${mahEscape(name)}">
              ${mahEscape(name)}
            </option>
          `;

        }).join("")
      }
    `;

  } catch (error) {

    select.innerHTML = `
      <option value="">IMESHINDWA KUPATA MADARASA</option>
    `;

    console.error(error);
  }
}


/* =====================================
   KUVUTA WANAFUNZI
==================================== */

async function loadMahudhurioWanafunzi() {

  if (!mahudhurioAinaPermission("WANAFUNZI")) return;

  const className = document.getElementById("mahClass")?.value;

  const date = document.getElementById("mahStudentDate")?.value;

  const list = document.getElementById("mahStudentList");

  if (!className || !date) {
    alert("Chagua darasa na tarehe kwanza.");
    return;
  }

  if (!list) return;

  list.innerHTML = `
    <p class="mah-loading">INAPAKIA WANAFUNZI...</p>
  `;

  try {

    const result = await callAPI({

      action: "getAttendanceStudents",

      className: className,

      date: date

    });

    if (!result || result.success === false) {
      throw new Error(
        result?.message || "Imeshindwa kupata wanafunzi."
      );
    }

    const students =
      result.students ||
      result.data ||
      [];

    // ACTIVE pekee.
    // Aliyehama na INACTIVE hawaonekani.

    const activeStudents = students.filter(s => {

      const status = mahUpper(
        s.STATUS ||
        s.status
      );

      const transfer = mahUpper(
        s.TRANSFER_STATUS ||
        s.transferStatus ||
        s.hali
      );

      return (
        status === "ACTIVE" &&
        !["TRANSFERRED", "MOVED", "AMEHAMA"].includes(transfer)
      );

    });

    mahudhurioRecords = activeStudents.map(s => ({

      id:
        s.NA_USAJILI ||
        s.registrationNumber ||
        s.REG_NO ||
        s.id,

      name:
        s.JINA ||
        s.fullName ||
        s.name ||
        s.FULL_NAME,

      attendance: ""

    }));

    mahudhurioClass = className;
    mahudhurioDate = date;

    renderMahudhurioStudentList();

  } catch (error) {

    list.innerHTML = `
      <p class="mah-error">
        ${mahEscape(error.message)}
      </p>
    `;

    console.error(error);
  }
}


/* ====================================
   KUONYESHA ORODHA YA WANAFUNZI
====================================== */
function renderMahudhurioStudentList() {

  const list = document.getElementById("mahStudentList");

  if (!list) return;

  if (mahudhurioRecords.length === 0) {

    list.innerHTML = `
      <p class="mah-empty">
        Hakuna wanafunzi ACTIVE katika darasa hili.
      </p>
    `;

    return;
  }

  list.innerHTML = `

    <div class="mah-table-wrap">

      <table class="mah-table">

        <thead>

          <tr>
            <th>NA. USAJILI</th>
            <th>JINA</th>
            <th>YUPO</th>
            <th>HAYUPO</th>
          </tr>

        </thead>

        <tbody>

          ${
            mahudhurioRecords.map((s, i) => `

              <tr>

                <td>${mahEscape(s.id)}</td>

                <td>${mahEscape(s.name)}</td>

                <td>
                  <input
                    type="radio"
                    name="mahStudent${i}"
                    onchange="setMahStudentStatus(${i},'YUPO')">
                </td>

                <td>
                  <input
                    type="radio"
                    name="mahStudent${i}"
                    onchange="setMahStudentStatus(${i},'HAYUPO')">
                </td>

              </tr>

            `).join("")
          }

        </tbody>

      </table>

    </div>

    <button
      class="mah-save-btn"
      onclick="saveMahudhurio()">

      HIFADHI MAHUDHURIO

    </button>

  `;
}


/* ================================
   KUWEKA HALI YA MWANAFUNZI
================================= */
function setMahStudentStatus(index, status) {

  if (!mahudhurioRecords[index]) return;

  mahudhurioRecords[index].attendance = status;
}

/* ================================
   UKURASA WA WATUMISHI
=================================== */
function renderMahudhurioWatumishi() {

  const content = document.getElementById(
    "mahudhurioContent"
  );

  if (!content) return;

  content.innerHTML = `

    <section class="mah-work">

      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        margin:0 0 15px;
      ">

        <h3 style="
          margin:0;
          font-size:15px;
        ">
          MAHUDHURIO YA WATUMISHI
        </h3>

        <button
          onclick="fungaMahudhurioFomu()"
          style="
            width:32px;
            height:32px;
            border:none;
            border-radius:50%;
            background:#d00000;
            color:white;
            font-size:23px;
            font-weight:bold;
            cursor:pointer;
            flex-shrink:0;
          ">
          ×
        </button>

      </div>

      <div class="mah-filters">

        <div>

          <label>TAREHE</label>

          <input
            type="date"
            id="mahStaffDate"
            value="${mahToday()}"
            onchange="loadMahudhurioWatumishi()">

        </div>

        <button
          class="mah-report-btn"
          onclick="showMahudhurioReport()">

          RIPOTI

        </button>

      </div>

      <div id="mahStaffList">

        <p class="mah-empty">
          Chagua tarehe ili kupata watumishi.
        </p>

      </div>

    </section>
  `;

  loadMahudhurioWatumishi();
}

/* ===================================
   KUVUTA WATUMISHI
==================================== */
async function loadMahudhurioWatumishi() {

  if (!mahudhurioAinaPermission("WATUMISHI")) return;

  const date = document.getElementById("mahStaffDate")?.value;

  const list = document.getElementById("mahStaffList");

  if (!date || !list) return;

  list.innerHTML = `
    <p class="mah-loading">INAPAKIA WATUMISHI...</p>
  `;

  try {

    const result = await callAPI({

      action: "getAttendanceStaff",

      date: date

    });

    if (!result || result.success === false) {
      throw new Error(
        result?.message || "Imeshindwa kupata watumishi."
      );
    }

    const staff =
      result.staff ||
      result.data ||
      [];

    const activeStaff = staff.filter(s => {

      return mahUpper(
        s.STATUS ||
        s.status
      ) === "ACTIVE";

    });

    mahudhurioRecords = activeStaff.map(s => ({

      id:
        s.NA_MTUMISHI ||
        s.employeeNumber ||
        s.STAFF_NO ||
        s.id,

      name:
        s.JINA ||
        s.fullName ||
        s.name ||
        s.FULL_NAME,

      status: "ACTIVE",

      attendance: ""

    }));

    mahudhurioDate = date;

    renderMahudhurioStaffList();

  } catch (error) {

    list.innerHTML = `
      <p class="mah-error">
        ${mahEscape(error.message)}
      </p>
    `;

    console.error(error);
  }
}


/* =================================
   ORODHA YA WATUMISHI
==================================== */
function renderMahudhurioStaffList() {

  const list = document.getElementById("mahStaffList");

  if (!list) return;

  if (mahudhurioRecords.length === 0) {

    list.innerHTML = `
      <p class="mah-empty">
        Hakuna watumishi ACTIVE.
      </p>
    `;

    return;
  }

  list.innerHTML = `

    <div class="mah-table-wrap">

      <table class="mah-table">

        <thead>

          <tr>
            <th>NA. MTUMISHI</th>
            <th>JINA</th>
            <th>YUPO</th>
            <th>HAYUPO</th>
            <th>STATUS</th>
          </tr>

        </thead>

        <tbody>

          ${
            mahudhurioRecords.map((s, i) => `

              <tr>

                <td>${mahEscape(s.id)}</td>

                <td>${mahEscape(s.name)}</td>

                <td>
                  <input
                    type="radio"
                    name="mahStaff${i}"
                    onchange="setMahStudentStatus(${i},'YUPO')">
                </td>

                <td>
                  <input
                    type="radio"
                    name="mahStaff${i}"
                    onchange="setMahStudentStatus(${i},'HAYUPO')">
                </td>

                <td>
                  <span class="mah-active">
                    ACTIVE
                  </span>
                </td>

              </tr>

            `).join("")
          }

        </tbody>

      </table>

    </div>

    <button
      class="mah-save-btn"
      onclick="saveMahudhurio()">

      HIFADHI MAHUDHURIO

    </button>

  `;
}


/* =================================
   KUHIFADHI MAHUDHURIO
==================================== */
async function saveMahudhurio() {

  if (mahudhurioBusy) return;

  if (!mahudhurioPermission("edit") &&
      !mahudhurioPermission("save")) {

    alert("Huna ruhusa ya kuhifadhi mahudhurio.");
    return;
  }

  if (!mahudhurioAinaPermission(mahudhurioAina)) {
    alert("Huna ruhusa ya sehemu hii.");
    return;
  }

  if (!mahudhurioRecords.length) {
    alert("Hakuna taarifa za kuhifadhi.");
    return;
  }

  const incomplete = mahudhurioRecords.some(
    s => !s.attendance
  );

  if (incomplete) {
    alert("Weka hali ya mahudhurio kwa kila mtu.");
    return;
  }

  const payload = {

    aina: mahudhurioAina,

    date: mahudhurioDate,

    className:
      mahudhurioAina === "WANAFUNZI"
        ? mahudhurioClass
        : "",

    records: mahudhurioRecords.map(s => ({

      id: s.id,

      name: s.name,

      attendance: s.attendance

    }))

  };

  if (!confirm("Unataka kuhifadhi mahudhurio haya?")) {
    return;
  }

  mahudhurioBusy = true;

  try {

    const result = await callAPI({

      action: "saveAttendance",

      ...payload

    });

    if (!result || result.success === false) {
      throw new Error(
        result?.message || "Imeshindwa kuhifadhi."
      );
    }

    alert("MAHUDHURIO YAMEHIFADHIWA VIZURI.");

  } catch (error) {

    alert("Kosa: " + error.message);

    console.error(error);

  } finally {
    mahudhurioBusy = false;
  }
}

/* ===================================
   RIPOTI
=================================== */

function showMahudhurioReport() {

  if (!mahudhurioPermission("view")) return;

  const content = document.getElementById(
    "mahudhurioContent"
  );

  if (!content) return;

  content.innerHTML = `

    <section class="mah-work">

      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        margin:0 0 15px;
      ">

        <h3 style="
          margin:0;
          font-size:15px;
        ">
          RIPOTI ZA MAHUDHURIO
        </h3>

        <button
          onclick="fungaMahudhurioFomu()"
          style="
            width:32px;
            height:32px;
            border:none;
            border-radius:50%;
            background:#d00000;
            color:white;
            font-size:23px;
            font-weight:bold;
            cursor:pointer;
            flex-shrink:0;
          ">
          ×
        </button>

      </div>

      <label>TAREHE</label>

      <input
        type="date"
        id="mahReportDate"
        value="${mahudhurioDate || mahToday()}">

      ${
        mahudhurioAina === "WANAFUNZI"
        ? `
          <label>DARASA</label>
          <input
            type="text"
            value="${mahEscape(mahudhurioClass)}"
            readonly>
        `
        : ""
      }
      <button
        class="mah-action-btn"
        onclick="loadMahudhurioReport()">

        TAZAMA RIPOTI

      </button>

      <div id="mahReportContent"></div>

    </section>
  `;
}
 


/* ================================
   KUPATA RIPOTI
================================== */
async function loadMahudhurioReport() {

  const date = document.getElementById(
    "mahReportDate"
  )?.value;

  const output = document.getElementById(
    "mahReportContent"
  );

  if (!date || !output) return;

  output.innerHTML = "INAPATA RIPOTI...";

  try {

    const result = await callAPI({

      action: "getAttendanceReport",

      aina: mahudhurioAina,

      date: date,

      className: mahudhurioClass

    });

    if (!result || result.success === false) {
      throw new Error(
        result?.message || "Imeshindwa kupata ripoti."
      );
    }

    const records =
      result.records ||
      result.data ||
      [];

    const present = records.filter(
      r => mahUpper(r.attendance) === "YUPO"
    ).length;

    const absent = records.filter(
      r => mahUpper(r.attendance) === "HAYUPO"
    ).length;

    const total = records.length;

    const percent = total
      ? ((present / total) * 100).toFixed(1)
      : 0;

    output.innerHTML = `

      <div class="mah-report-box">

        <p>JUMLA: <b>${total}</b></p>

        <p>WALIOHUDHURIA: <b>${present}</b></p>

        <p>WASIYOHUDHURIA: <b>${absent}</b></p>

        <p>ASILIMIA: <b>${percent}%</b></p>

      </div>

    `;

  } catch (error) {

    output.innerHTML = `
      <p class="mah-error">
        ${mahEscape(error.message)}
      </p>
    `;

  }
}


/* =================================
   CSS
================================= */
function addMahudhurioStyles() {
  if (document.getElementById("mahudhurioStyles")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "mahudhurioStyles";

  style.textContent = `

    .mah-page {
      width: 100%;
      box-sizing: border-box;
    }

    .mah-main-buttons {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 10px;
      margin-bottom: 15px;
    }

    .mah-main-btn {
      padding: 16px 5px;
      border: none;
      border-radius: 7px;
      background: #4b5320;
      color: white;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
    }

    .mah-main-btn:active {
      background: #f28c28;
    }

    .mah-work {
  width: 100%;
  box-sizing: border-box;
  padding: 2px 0;
  margin-top: 0;
}

.mah-work h3 {
  margin: 5px 0 12px;
  font-size: 16px;
}

    .mah-back {
      padding: 9px 14px;
      border: 1px solid #4b5320;
      border-radius: 6px;
      background: white;
      color: #4b5320;
      font-weight: bold;
    }

    .mah-filters {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 9px;
      margin-bottom: 12px;
    }

    .mah-filters label,
    .mah-work label {
      display: block;
      margin-bottom: 6px;
      font-size: 12px;
      font-weight: bold;
    }

    .mah-filters select,
    .mah-filters input,
    .mah-work input[type="date"] {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      padding: 10px 6px;
      border: 1px solid #aaa;
      border-radius: 6px;
      background: white;
    }

    .mah-actions {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 8px;
      margin-bottom: 15px;
    }

    .mah-action-btn,
    .mah-report-btn {
      padding: 11px 5px;
      border: none;
      border-radius: 6px;
      background: #4b5320;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    .mah-report-btn {
      background: #f28c28;
    }

    .mah-table-wrap {
      width: 100%;
      overflow-x: auto;
      margin-top: 12px;
    }

    .mah-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      white-space: nowrap;
    }

    .mah-table th,
    .mah-table td {
      padding: 10px 7px;
      border: 1px solid #ddd;
      text-align: center;
    }

    .mah-table th {
      background: #4b5320;
      color: white;
    }

    .mah-table td:nth-child(2) {
      text-align: left;
    }

    .mah-table input[type="radio"] {
      width: 19px;
      height: 19px;
      accent-color: #4b5320;
    }

    .mah-save-btn {
      width: 100%;
      margin-top: 16px;
      padding: 14px 8px;
      border: none;
      border-radius: 7px;
      background: #f28c28;
      color: white;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
    }

    .mah-active {
      color: green;
      font-weight: bold;
    }

    .mah-empty,
    .mah-loading {
      text-align: center;
      padding: 18px 8px;
      color: #666;
    }

    .mah-error {
      padding: 12px;
      color: #b00020;
      background: #fff0f0;
      border-radius: 6px;
    }

    .mah-report-box {
      margin-top: 15px;
      padding: 14px;
      border: 1px solid #ddd;
      border-radius: 7px;
    }

    .mah-report-box p {
      padding: 7px;
      border-bottom: 1px solid #eee;
    }

    @media(max-width:400px) {

      .mah-filters {
        grid-template-columns: 1fr;
      }

      .mah-table {
        font-size: 11px;
      }
    }

  `;

  document.head.appendChild(style);
}
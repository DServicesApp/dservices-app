/* =========================================
   DSERVICES - USIMAMIZI FEDHA
   FILE: Fedha.js
   MALIPO | MATUMIZI
====================================== */
(function () {
  "use strict";

  const FINANCE_MENUS = [
    "MALIPO",
    "MATUMIZI",
  ];

  let currentFinanceMenu = "MALIPO";
 
const $f = (id, root = document) => {
  if (root === document) {
    return document.getElementById(id);
  }
  return root.querySelector("#" + id);
};


  /* ===============================
     KUSAIDIA KUSOMA TAARIFA
  =============================== */
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));
  }

  function getAccountId() {
    return String(
      window.currentUser?.accountId ||
      window.currentUser?.ACCOUNT_ID ||
      window.currentUser?.account_id ||
      ""
    );
  }

  function getServiceId() {
    return String(
      window.selectedService?.id ||
      window.selectedService?.serviceId ||
      window.selectedService ||
      ""
    );
  }

  function getModuleId() {
    return String(
      window.selectedModule?.id ||
      window.selectedModule?.moduleId ||
      window.selectedModule ||
      ""
    );
  }

  function today() {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }

  function makeId(prefix) {
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  const timestamp =
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds()) +
    pad(now.getDate()) +
    pad(now.getMonth() + 1) +
    now.getFullYear();

  const random = Math.floor(1000 + Math.random() * 9000);

  return `${prefix}-${timestamp}-V${random}`.toUpperCase();
}

  function showFinanceMessage(message, isError = false) {
    if (typeof window.showMessage === "function") {
      window.showMessage(
        message,
        isError ? "error" : "success"
      );
    } else {
      alert(message);
    }
  }


  /* ===============================
     MUONEKANO WA FEDHA
  =============================== */
  function injectFinanceStyles() {
    if ($f("dservicesFinanceStyles")) return;
    const style = document.createElement("style");

    style.id = "dservicesFinanceStyles";

    style.textContent = `

      .dsf-wrap {
        width:100%;
        color:#263238;
      }

      .dsf-head {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        flex-wrap:wrap;
        margin-bottom:14px;
      }

      .dsf-title {
        margin:0;
        color:#4b5320;
        font-size:20px;
      }

      .dsf-actions {
        display:flex;
        gap:8px;
        flex-wrap:wrap;
      }

      .dsf-btn {
        border:0;
        border-radius:7px;
        padding:10px 15px;
        cursor:pointer;
        font-weight:600;
      }

      .dsf-primary {
        background:#4b5320;
        color:#fff;
      }

      .dsf-secondary {
        background:#f28c28;
        color:#fff;
      }

      .dsf-light {
        background:#eef1e8;
        color:#4b5320;
      }

      .dsf-card {
        background:#fff;
        border:1px solid #e1e5dc;
        border-radius:10px;
        padding:15px;
        margin-bottom:13px;
        box-shadow:0 2px 7px rgba(0,0,0,.04);
      }

      .dsf-grid {
        display:grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap:12px;
      }

      .dsf-field {
        display:flex;
        flex-direction:column;
        gap:5px;
      }

      .dsf-field label {
        font-size:13px;
        font-weight:600;
        color:#4b5320;
      }

      .dsf-field input,
      .dsf-field select,
      .dsf-field textarea {
        width:100%;
        box-sizing:border-box;
        border:1px solid #ccd3c4;
        border-radius:6px;
        padding:10px;
        background:#fff;
        font:inherit;
        min-height:40px;
      }

      .dsf-field textarea {
        min-height:75px;
        resize:vertical;
      }

      .dsf-full {
        grid-column:1/-1;
      }

      .dsf-form-actions {
        display:flex;
        justify-content:center;
        gap:12px;
        margin-top:18px;
      }

      .dsf-muted {
        color:#68736a;
        font-size:13px;
      }

      .dsf-table-wrap {
        overflow-x:auto;
      }

      .dsf-table {
        border-collapse:collapse;
        width:100%;
        min-width:600px;
        background:#fff;
      }

      .dsf-table th,
      .dsf-table td {
        padding:10px;
        border-bottom:1px solid #e7eae3;
        text-align:left;
        font-size:13px;
      }

      .dsf-table th {
        background:#eef1e8;
        color:#4b5320;
      }

/* KADI ZA MALIPO NA MATUMIZI */
.dsf-menu-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin-bottom: 14px;
}

.dsf-menu-card {
  width: 100%;
  min-height: 42px;
  box-sizing: border-box;
  padding: 11px 8px;
  border: 1px solid #cfd3d6;
  border-radius: 7px;
  background: #eeeeee;
  color: #222222;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
}

.dsf-menu-card:active {
  background: #e2e2e2;
}

.dsf-search {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 11px 8px;
  border: 1px solid #cfd3d6;
  border-radius: 7px;
  background: #eeeeee;
  color: #222222;
  font-size: 13px;
  outline: none;
}

.dsf-modal-overlay {
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.55);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:15px;
  z-index:9999;
}

.dsf-modal-header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:18px;
}

.dsf-modal-header h3 {
  margin:0;
  color:#4b5320;
}

.dsf-modal-close {
  border:0;
  background:#f2f2f2;
  color:#333;
  border-radius:50%;
  width:35px;
  height:35px;
  font-size:20px;
  cursor:pointer;
}

.dsf-form-modal {
  background:#fff;
  width:100%;
  max-width:650px;
  max-height:90vh;
  overflow-y:auto;
  border-radius:12px;
  padding:18px;
  box-shadow:0 8px 30px rgba(0,0,0,.2);
}

.dsf-form-modal .dsf-modal-header {
  position:sticky;
  top:-18px;
  background:#fff;
  padding:5px 0 12px;
  z-index:2;
}

      @media(max-width:600px) {
        .dsf-grid {
          grid-template-columns:1fr;
        }
        .dsf-title {
          font-size:18px;
        }
      }
    `;
    document.head.appendChild(style);
  }

/* ===============================
   KUONYESHA UKURASA WA FEDHA
=============================== */
function renderFinancePage(workspace) {
  if (!workspace) return;

  injectFinanceStyles();

  const selected = String(
  selectedMenu || ""
).trim().toUpperCase();

if (!FINANCE_MENUS.includes(selected)) {
  workspace.innerHTML = "";
  return;
}
currentFinanceMenu = selected;

const menu = currentFinanceMenu;

  const isPayment = menu === "MALIPO";

  const choices = isPayment
    ? [
        ["student-payment", "MALIPO MWANAFUNZI"],
        ["other-payment", "MALIPO MENGINE"]
      ]
    : [
        ["staff-expense", "MATUMIZI MTUMISHI"],
        ["other-expense", "MATUMIZI MENGINE"]
      ];

  workspace.innerHTML = `
    <section class="dsf-wrap">

      <div class="dsf-menu-grid">

        <button
          type="button"
          class="dsf-menu-card"
          id="dsfHistoryBtn">
          HISTORIA
        </button>

        <input
          type="search"
          class="dsf-search"
          id="dsfSearchInput"
          placeholder="Tafuta....">

        ${choices.map(([id, label]) => `
          <button
            type="button"
            class="dsf-menu-card"
            data-form="${id}">
            ${label}
          </button>
        `).join("")}

      </div>

      <div id="dsfContent"></div>

    </section>
  `;

  // HISTORIA
  $f("dsfHistoryBtn", workspace)
    .addEventListener("click", () => {
      showHistory(workspace);
    });

  // FOMU ZA MALIPO NA MATUMIZI
workspace.querySelectorAll("[data-form]")
  .forEach(button => {
    button.addEventListener("click", () => {
      showFinanceForm(
        workspace,
        button.dataset.form
      );
    });
  });

  // TAFUTA KWENYE MATOKEO YANAYOONEKANA
  $f("dsfSearchInput", workspace)
    .addEventListener("input", event => {
      const neno = event.target.value
        .trim()
        .toLowerCase();
      workspace.querySelectorAll(
        ".dsf-table tbody tr"
      ).forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(neno)
            ? ""
            : "none";
      });
    });
showHistory(workspace);
}

  /* ===============================
     KUTENGENEZA VIPENGELE VYA FOMU
  =============================== */
  function field(label, name, type = "text", options = {}) {

    const id = "dsf_" + name;

    const required =
      options.required ? "required" : "";
    const full =
      options.full ? "dsf-full" : "";
    let control = "";
    if (type === "select") {
      control = `
        <select
          id="${id}"
          name="${name}"
          ${required}>
          <option value="">
            Chagua ${esc(label.toLowerCase())}
          </option>
          ${(options.items || []).map(item => `
            <option value="${esc(item)}">
              ${esc(item)}
            </option>
          `).join("")}
        </select>
      `;
    }
    else if (type === "textarea") {
      control = `
        <textarea
          id="${id}"
          name="${name}"
          ${required}></textarea>
      `;
    }
    else {
      control = `
        <input
          id="${id}"
          name="${name}"
          type="${type}"
          ${required}
          ${options.readonly ? "readonly" : ""}
          ${options.value !== undefined
            ? `value="${esc(options.value)}"`
            : ""}
          ${options.step ? `step="${options.step}"` : ""}>
      `;
    }
    return `
      <div class="dsf-field ${full}">
        <label for="${id}">
          ${esc(label)}${options.required ? " *" : ""}
        </label>
        ${control}
      </div>
    `;
  }

  /* ===============================
     FOMU ZA MALIPO NA MATUMIZI
  =============================== */
  function showFinanceForm(workspace, formType) {

    const isPayment =
      formType === "student-payment" ||
      formType === "other-payment";
    const isStudent =
      formType === "student-payment";

    const isStaffExpense =
      formType === "staff-expense";

    const prefix = isPayment
      ? "MALIPO"
      : "MATUMIZI";

    const idField = isPayment
      ? "ID_MALIPO"
      : "ID_MATUMIZI";

    const idValue = makeId(
      isPayment ? "MAL" : "MAT"
    );

    const title = ({
      "student-payment": "MALIPO MWANAFUNZI",
      "other-payment": "MALIPO MENGINE",
      "staff-expense": "MATUMIZI  MTUMISHI",
      "other-expense": "MATUMIZI MENGINE"
    })[formType];


    let fields = [

      field(
        "TAREHE",
        "TAREHE",
        "date",
        {
          required: true,
          value: today()
        }
      ),

      field(
        "ACCOUNT ID",
        "ACCOUNT_ID",
        "text",
        {
          value: getAccountId(),
          readonly: true
        }
      ),

      field(
        idField,
        idField,
        "text",
        {
          value: idValue,
          readonly: true
        }
      ),

      field(
        isPayment
          ? "AINA YA MALIPO"
          : "AINA YA MATUMIZI",

        isPayment
          ? "AINA_YA_MALIPO"
          : "AINA_YA_MATUMIZI",

        "select",

        {
          required: true,

          items: isPayment

            ? [
                "ADA",
                "FOMU YA USAJILI",
                "MITIHANI",
                "MICHANGO",
                "MALIPO MENGINE"
              ]

            : [
                "MSHAHARA",
                "MOTISHA",
                "NAULI",
                "CHAKULA",
                "VIFAA",
                "MATUMIZI MENGINE"
              ]
        }
      )

    ];


    /* MALIPO YA MWANAFUNZI */

    if (isStudent) {

      fields.push(

        field(
          "DARASA",
          "DARASA"
        ),

        field(
          "JINA LA MWANAFUNZI",
          "JINA_LA_MWANAFUNZI",
          "text",
          { required: true }
        ),

        field(
          "ID MWANAFUNZI",
          "ID_MWANAFUNZI",
          "text",
          { readonly: true }
        ),

        field(
          "NA. USAJILI",
          "NA_USAJILI",
          "text",
          { readonly: true }
        ),

        field(
          "JINA LA MLIPAJI",
          "JINA_LA_MLIPAJI"
        )

      );

    }


    /* MATUMIZI YA MTUMISHI */

    else if (isStaffExpense) {

      fields.push(

        field(
          "JINA LA MTUMISHI",
          "JINA_LA_MTUMISHI",
          "text",
          { required: true }
        ),

        field(
          "ID MTUMISHI",
          "ID",
          "text",
          { readonly: true }
        ),

        field(
          "JINA LA MPOKEAJI",
          "JINA_LA_MPOKEAJI"
        )

      );

    }


    /* MALIPO NA MATUMIZI MENGINE */

else {

  if (isPayment) {

    fields.push(
      field(
        "JINA LA MLIPAJI",
        "JINA_LA_MLIPAJI"
      )
    );

  } else {

    fields.push(
      field(
        "JINA LA MPOKEAJI",
        "JINA_LA_MPOKEAJI"
      )
    );

  }

}


    /* TAARIFA ZA FEDHA */

    fields.push(
      field(
        "KIASI (TSH)",
        "KIASI",
        "number",
        {
          required: true,
          step: "0.01"
        }
      ),

      field(
        "MAELEZO",
        "MAELEZO",
        "textarea",
        { full: true }
      ),

      field(
        "NJIA YA MALIPO",
        "NJIA_YA_MALIPO",
        "select",
        {
          required: true,

          items: [
            "TASLIMU",
            "M-PESA",
            "MIX BY YAS",
            "AIRTEL MONEY",
            "Halo-PESA",
            "BENKI",
            "Nyingine"
          ]
        }
      ),

      field(
        "NAMBA YA RISITI",
        "NAMBA_YA_RISITI"
      ),

      field(
        isPayment
          ? "JINA LA MPOKEAJI"
          : "JINA LA MLIPAJI",

        isPayment
          ? "MPOKEAJI"
          : "MLIPAJI"
      ),

      field(
        "NAFASI",

        isPayment
          ? "NAFASI_YA_MPOKEAJI"
          : "NAFASI_YA_MLIPAJI"
      ),

      field(
        "MUDA",
        "MUDA",
        "text",
        {
          value: new Date().toLocaleTimeString(
            "sw-TZ",
            { hour12: false }
          ),
          readonly: true
        }
      )
    );


    const content = $f("dsfContent", workspace);

content.innerHTML = `
  <div class="dsf-modal-overlay" id="dsfFormModal">

    <div class="dsf-form-modal">

      <div class="dsf-modal-header">

        <h3>${title}</h3>

        <button
          type="button"
          class="dsf-modal-close"
          id="dsfCloseForm">
          ×
        </button>

      </div>

      <form id="dsfFinanceForm">

        <div class="dsf-grid">
          ${fields.join("")}
        </div>

        <div class="dsf-form-actions">

          <button
            type="submit"
            class="dsf-btn dsf-primary">
            HIFADHI
          </button>

        </div>

        <p class="dsf-muted">
          Taarifa zitahifadhiwa kwenye simu
          na zitasawazishwa mtandao utakaporudi.
        </p>

      </form>

    </div>

  </div>
`;

 const formModal = $f("dsfFormModal", workspace);

// KUFUNGA KWA ALAMA ×
$f("dsfCloseForm", workspace)
  .addEventListener("click", () => {
    formModal.remove();
    showHistory(workspace);
  });

// KUFUNGA KWA KUBONYEZA NJE YA FOMU
formModal.addEventListener("click", event => {
  if (event.target === formModal) {
    formModal.remove();
    showHistory(workspace);
  }
});
    $f("dsfFinanceForm", workspace)
      .addEventListener("submit", event => {

        saveFinanceForm(
          event,
          workspace,
          formType,
          prefix
        );

      });

  }


  /* ===============================
     KUHIFADHI TAARIFA
  =============================== */
  async function saveFinanceForm(
    event,
    workspace,
    formType,
    sheetName
  ) {

    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) return;


    if (
      typeof window.saveOfflineRecord !== "function"
    ) {

      showFinanceMessage(
        "IndexedDB haijapatikana. Hakikisha offline-db.js imepakiwa kabla ya Fedha.js.",
        true
      );

      return;

    }


    const data = {};

    new FormData(form).forEach((value, key) => {

      data[key] = String(value).trim();

    });


    const isPayment =
      sheetName === "MALIPO";

    const action = isPayment
      ? "SAVE_MALIPO"
      : "SAVE_MATUMIZI";


    const payload = {

      sheet: sheetName,

      data: data,

      transactionType: formType,

      accountId: getAccountId(),

      serviceId: getServiceId(),

      moduleId: getModuleId()

    };


    try {

      await window.saveOfflineRecord({

        accountId: getAccountId(),

        serviceId: getServiceId(),

        moduleId: getModuleId(),

        action: action,

        payload: payload

      });
      showFinanceMessage(

        isPayment

  ? "Malipo yamehifadhiwa kwenye simu; yatasawazishwa mtandao utakaporudi."

 : "Matumizi yamehifadhiwa kwenye simu; yatasawazishwa mtandao utakaporudi."

      );
      showHistory(workspace);

    } catch (error) {

      console.error(
        "Finance save error:",
        error
      );
      showFinanceMessage(
   "Imeshindikana kuhifadhi taarifa: " +
        (error.message || error),
        true
      );
    }
  }

  /* ===============================
     HISTORIA YA MALIPO NA MATUMIZI
  =============================== */
  async function showHistory(workspace) {
    const content = $f("dsfContent", workspace);
if (!content) return;
content.innerHTML = `
      <div class="dsf-card">

        <p class="dsf-muted">
          Inatafuta taarifa zilizohifadhiwa kwenye simu...
        </p>
      </div>
    `;
    try {

      if (
        typeof window.getPendingRecords !== "function"
      ) {

        throw new Error(
          "IndexedDB haijapatikana."
        );
      }

const records =
  await window.getPendingRecords(
    getAccountId()
  );

const safeRecords = Array.isArray(records)
  ? records
  : [];

      const relevant = safeRecords

        .filter(record => {

          return (

            currentFinanceMenu === "MALIPO" &&
            record.action === "SAVE_MALIPO"

          ) || (

            currentFinanceMenu === "MATUMIZI" &&
            record.action === "SAVE_MATUMIZI"

          );

        })

        .sort((a, b) => {

          return new Date(b.createdAt) -
            new Date(a.createdAt);
        });

      if (!relevant.length) {

        content.innerHTML = `
  <div class="dsf-card">
    <p>
      Hakuna taarifa zinazosubiri
      kusawazishwa kwenye simu.
    </p>
  </div>
`;
        return;

      }
      content.innerHTML = `


          <div class="dsf-table-wrap">

            <table class="dsf-table">
              <thead>
                <tr>
                  <th>TAREHE</th>

                  <th>AINA</th>

                  <th>KIASI</th>

                  <th>HALI</th>

                </tr>

              </thead>

              <tbody>

                ${relevant.map(record => {

                  const d =
                    record.payload?.data || {};

                  return `

                    <tr>

                      <td>
                        ${esc(
                          d.TAREHE ||
                          String(record.createdAt || "").slice(0, 10)
                        )}
                      </td>

                      <td>
                        ${esc(
                          d.AINA_YA_MALIPO ||
                          d.AINA_YA_MATUMIZI ||
                          record.payload?.transactionType
                        )}
                      </td>

                      <td>
                        ${esc(d.KIASI || "")}
                      </td>

                      <td>
                        ${esc(record.status)}
                      </td>

                    </tr>

                  `;
                }).join("")}

              </tbody>

            </table>

          </div>

      `;
      
    } catch (error) {

      content.innerHTML = `

        <div class="dsf-card">

          <p>
            ${esc(error.message || error)}
          </p>
        </div>
      `;
    }

  }

  /* ===============================
     KUUNGANISHA NA INDEX.HTML
  =============================== */
  window.renderFedhaPage = renderFinancePage;
})();


/* =========================================
   DSERVICES - USIMAMIZI FEDHA
   FILE: Fedha.js
   MALIPO | MATUMIZI | HALI YA MICHANGO
====================================== */
(function () {
  "use strict";

  const FINANCE_MENUS = [
    "MALIPO",
    "MATUMIZI",
    "HALI YA MICHANGO"
  ];

  let currentFinanceMenu = "MALIPO";
  let currentFormType = "";
 
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
    return prefix + "-" +
      Date.now() + "-" +
      Math.random().toString(36)
        .slice(2, 7).toUpperCase();
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

      .dsf-tabs {
        display:flex;
        gap:7px;
        flex-wrap:wrap;
        margin:12px 0 16px;
      }

      .dsf-tab {
        background:#fff;
        border:1px solid #d7ddce;
        color:#4b5320;
        border-radius:7px;
        padding:9px 13px;
        cursor:pointer;
      }

      .dsf-tab.active {
        background:#4b5320;
        color:#fff;
        border-color:#4b5320;
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

      .dsf-chooser {
        display:grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap:10px;
      }
      .dsf-choice {
        padding:15px;
        border:1px solid #d7ddce;
        border-radius:8px;
        background:#fff;
        color:#4b5320;
        text-align:left;
        cursor:pointer;
        font-weight:600;
      }
      .dsf-choice:hover {
        border-color:#f28c28;
      }

      @media(max-width:600px) {
        .dsf-grid {
          grid-template-columns:1fr;
        }
        .dsf-chooser {
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
    window.selectedMenu || ""
  ).trim().toUpperCase();

  const menu = FINANCE_MENUS.includes(selected)
    ? selected
    : currentFinanceMenu;

  currentFinanceMenu = menu;

  const showActions =
    menu === "MALIPO" ||
    menu === "MATUMIZI";

  workspace.innerHTML = `

    <section class="dsf-wrap">

      ${
        showActions
          ? `
            <div class="dsf-head">

              <div class="dsf-actions">

                <button
                  class="dsf-btn dsf-primary"
                  id="dsfAddBtn">
                  ＋ Ongeza
                </button>

                <button
                  class="dsf-btn dsf-light"
                  id="dsfHistoryBtn">
                  Historia
                </button>

              </div>

            </div>
          `
          : ""
      }

      <div id="dsfContent"></div>

    </section>

  `;

  if (showActions) {

    $f("dsfAddBtn", workspace)
      .addEventListener("click", () => {

        showChooser(workspace);

      });

    $f("dsfHistoryBtn", workspace)
      .addEventListener("click", () => {

        showHistory(workspace);

      });

  }
  renderFinanceContent(workspace);

}

  /* ===============================
     MAUDHUI YA KILA MENYU
  =============================== */
  function renderFinanceContent(workspace) {
    const content = $f("dsfContent", workspace);

    if (!content) return;


    if (currentFinanceMenu === "MALIPO") {

      content.innerHTML = `

        <div class="dsf-card">

          <h3>MALIPO</h3>

          <p class="dsf-muted">
            Sajili malipo ya mwanafunzi
            au malipo mengine.
          </p>

          <div class="dsf-chooser">

            <button
              class="dsf-choice"
              data-form="student-payment">

              ＋ Malipo Mwanafunzi

            </button>

            <button
              class="dsf-choice"
              data-form="other-payment">

              ＋ Malipo Mengine

            </button>

          </div>

        </div>

      `;

    }


    else if (currentFinanceMenu === "MATUMIZI") {

      content.innerHTML = `

        <div class="dsf-card">

          <h3>MATUMIZI</h3>

          <p class="dsf-muted">
            Sajili matumizi ya mtumishi
            au matumizi mengine.
          </p>

          <div class="dsf-chooser">

            <button
              class="dsf-choice"
              data-form="staff-expense">

              ＋ Matumizi Mtumishi

            </button>

            <button
              class="dsf-choice"
              data-form="other-expense">

              ＋ Matumizi Mengine

            </button>

          </div>

        </div>

      `;

    }


    else {

      content.innerHTML = `

        <div class="dsf-card">

          <h3>HALI YA MICHANGO</h3>

          <p class="dsf-muted">
            Chagua mwaka wa masomo na
            mpango wa malipo.
          </p>


          <div class="dsf-grid">

            <div class="dsf-field">

              <label for="dsfSchoolYear">
                MWAKA WA MASOMO
              </label>

              <input
                id="dsfSchoolYear"
                type="number"
                value="${new Date().getFullYear()}">

            </div>


            <div class="dsf-field">

              <label for="dsfPlan">
                MPANGO WA MALIPO
              </label>

              <select id="dsfPlan">

                <option value="">
                  Chagua mpango
                </option>

                <option value="MWEZI">
                  MWEZI
                </option>

                <option value="MWAKA">
                  MWAKA
                </option>

                <option value="MADA">
                  MADA
                </option>

                <option value="MUHULA">
                  MUHULA
                </option>

              </select>

            </div>

          </div>


          <p class="dsf-muted" style="margin-top:12px">

            Muhtasari wa michango utaunganishwa
            na mipango ya malipo na taarifa
            halisi za wanafunzi.

          </p>

        </div>

      `;

    }


    content
      .querySelectorAll("[data-form]")
      .forEach(button => {

        button.addEventListener("click", () => {

          showFinanceForm(
            workspace,
            button.dataset.form
          );

        });

      });

  }


  /* ===============================
     KICHAGUO CHA AINA YA TAARIFA
  =============================== */

  function showChooser(workspace) {

    const content = $f("dsfContent", workspace);

    if (!content) return;


    const choices =
      currentFinanceMenu === "MATUMIZI"

        ? [

            ["staff-expense", "Matumizi Mtumishi"],

            ["other-expense", "Matumizi Mengine"]

          ]

        : currentFinanceMenu === "MALIPO"

          ? [

              ["student-payment", "Malipo Mwanafunzi"],

              ["other-payment", "Malipo Mengine"]

            ]

          : [];


    if (!choices.length) {

      showFinanceMessage(
        "Kipengele cha kuongeza michango kitaunganishwa baada ya mipango ya malipo."
      );

      return;

    }


    content.innerHTML = `

      <div class="dsf-card">

        <div class="dsf-head">

          <h3>
            Chagua aina ya ${currentFinanceMenu.toLowerCase()}
          </h3>

          <button
            class="dsf-btn dsf-light"
            id="dsfBackBtn">

            Rudi

          </button>

        </div>


        <div class="dsf-chooser">

          ${choices.map(([id, label]) => `

            <button
              class="dsf-choice"
              data-form="${id}">

              ＋ ${label}

            </button>

          `).join("")}

        </div>

      </div>

    `;


    $f("dsfBackBtn", workspace)
      .addEventListener("click", () => {

        renderFinanceContent(workspace);

      });


    content
      .querySelectorAll("[data-form]")
      .forEach(button => {

        button.addEventListener("click", () => {

          showFinanceForm(
            workspace,
            button.dataset.form
          );

        });

      });

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

    currentFormType = formType;

    const isPayment =
      formType === "student-payment" ||
      formType === "other-payment";

    const isStudent =
      formType === "student-payment";

    const isStaffExpense =
      formType === "staff-expense";

    const isExpense = !isPayment;

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
      "staff-expense": "MATUMIZI MTUMISHI",
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
          "ID_MWANAFUNZI/MTUMISHI",
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

      fields.push(

        field(
          "JINA LA MLIPAJI",
          isPayment
            ? "JINA_LA_MLIPAJI"
            : "MLIPAJI"
        )

      );

      if (isExpense) {

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
            "TIGO PESA",
            "AIRTEL MONEY",
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

      <div class="dsf-card">

        <div class="dsf-head">

          <h3>${title}</h3>

          <button
            class="dsf-btn dsf-light"
            id="dsfCancelForm">

            Rudi

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

            <button
              type="button"
              class="dsf-btn dsf-secondary"
              id="dsfCloseForm">

              FUNGA

            </button>

          </div>


          <p class="dsf-muted">

            Taarifa zitahifadhiwa kwenye simu
            na zitasawazishwa mtandao utakaporudi.

          </p>

        </form>

      </div>

    `;


    $f("dsfCancelForm", workspace)
      .addEventListener("click", () => {

        renderFinanceContent(workspace);

      });


    $f("dsfCloseForm", workspace)
      .addEventListener("click", () => {

        renderFinanceContent(workspace);

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
        "IndexedDB haijapatikana. Hakikisha offline-db.js imepakiwa kabla ya Fedha1.js.",
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


      renderFinanceContent(workspace);


    } catch (error) {

      console.error(
        "DServices finance save error:",
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
    content.innerHTML = `
      <div class="dsf-card">

        <h3>HISTORIA - ${currentFinanceMenu}</h3>

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


      const relevant = records

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

            <h3>HISTORIA</h3>

            <p>
              Hakuna taarifa zinazosubiri
              kusawazishwa kwenye simu.
            </p>

            <button
              class="dsf-btn dsf-light"
              id="dsfHistoryBack">

              Rudi

            </button>

          </div>

        `;


        $f("dsfHistoryBack", workspace)
          .addEventListener("click", () => {

            renderFinanceContent(workspace);

          });

        return;

      }


      content.innerHTML = `

        <div class="dsf-card">

          <div class="dsf-head">

            <h3>
              HISTORIA - ${currentFinanceMenu}
            </h3>

            <button
              class="dsf-btn dsf-light"
              id="dsfHistoryBack">

              Rudi

            </button>

          </div>


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
                          record.createdAt.slice(0, 10)
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

        </div>

      `;

      $f("dsfHistoryBack", workspace)
        .addEventListener("click", () => {
    renderFinanceContent(workspace);
        });


    } catch (error) {

      content.innerHTML = `

        <div class="dsf-card">

          <p>
            ${esc(error.message || error)}
          </p>

          <button
            class="dsf-btn dsf-light"
            id="dsfHistoryBack">
            Rudi
          </button>
        </div>
      `;

      $f("dsfHistoryBack", workspace)
        .addEventListener("click", () => {
 renderFinanceContent(workspace);
        });
    }

  }


  /* ===============================
     KUUNGANISHA NA INDEX.HTML
  =============================== */
  window.renderFedhaPage = renderFinancePage;
})();


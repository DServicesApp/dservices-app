/* =====================================
   DSERVICES - ELIMU
   MODULI: TAARIFA
   FILE: taarifaelimu.js
=================================== */
(function () {

  const TAARIFA_ELIMU = {

    CARDS: [
      {
        id: "michango",
        title: "Taarifa ya Michango",
        icon: "📊"
      },
      {
        id: "ada",
        title: "Ada Mwanafunzi",
        icon: "🎓"
      },
      {
        id: "usajili",
        title: "Taarifa Usajili",
        icon: "📝"
      },
      {
        id: "fedha",
        title: "Taarifa ya Fedha",
        icon: "💰"
      },
      {
        id: "tathimini",
        title: "Tathimini ya maendeleo",
        icon: "📈"
      },
      {
        id: "wazazi",
        title: "Taarifa wazazi/ walezi ",
        icon: "👨‍👩‍👧"
      }
    ]

  };


  /* ================================
     1. CSS
  ================================= */
  function taarifaElimuCSS() {
    if (document.getElementById("taarifa-elimu-style")) return;

    const style = document.createElement("style");

    style.id = "taarifa-elimu-style";

    style.textContent = `

      .taarifa-elimu {
        width: 100%;
        box-sizing: border-box;
        padding: 12px;
        color: #111;
      }

      .taarifa-elimu *,
      .taarifa-elimu *::before,
      .taarifa-elimu *::after {
        box-sizing: border-box;
      }

      .taarifa-header {
        font-size: 17px;
        font-weight: 700;
        margin-bottom: 15px;
        color: #4B5320;
      }

      .taarifa-card-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
      }

      .taarifa-card {
        width: 100%;
        min-height: 85px;
        padding: 11px 8px;
        border: 1px solid #111;
        border-radius: 7px;
        background: #d1d1d1;
        color: #111;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 7px;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
        cursor: pointer;
      }

      .taarifa-card:active {
        background: #bcbcbc;
        transform: scale(.98);
      }

      .taarifa-card-icon {
        font-size: 23px;
      }

      .taarifa-workspace {
        width: 100%;
        margin-top: 10px;
      }

      .taarifa-work-title {
        font-size: 15px;
        font-weight: 700;
        padding: 12px;
        border: 1px solid #111;
        background: #d1d1d1;
        color: #111;
        border-radius: 6px 6px 0 0;
      }

      .taarifa-work-body {
        border: 1px solid #111;
        border-top: 0;
        padding: 12px;
        background: #fff;
        border-radius: 0 0 6px 6px;
      }

      .taarifa-placeholder {
        background: #eeeeee;
        border: 1px solid #111;
        border-radius: 5px;
        padding: 12px;
        min-height: 90px;
        color: #111;
        margin-top: 12px;
      }

      .taarifa-filters {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .taarifa-field {
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-size: 12px;
        font-weight: 700;
      }

      .taarifa-field select {
        width: 100%;
        min-height: 40px;
        padding: 8px;
        border: 1px solid #111;
        border-radius: 5px;
        background: #fff;
        color: #111;
      }

      .taarifa-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 15px;
      }

      .taarifa-btn {
        padding: 10px 20px;
        border: 1px solid #111;
        border-radius: 5px;
        font-weight: 700;
        cursor: pointer;
      }

      .taarifa-back {
        background: #4B5320;
        color: white;
      }

      @media(max-width: 350px) {
        .taarifa-card-grid {
          gap: 6px;
        }

        .taarifa-card {
          font-size: 11px;
        }
      }

    `;

    document.head.appendChild(style);
  }


  /* ==================================
     2. KUFUNGUA MODULI
  =================================== */
  function renderTaarifaElimu(container) {

    const target = typeof container === "string"
      ? document.getElementById(container)
      : container;

    if (!target) {
      console.error("Sehemu ya TAARIFA ELIMU haijapatikana.");
      return;
    }

    taarifaElimuCSS();

    target.innerHTML = `

      <div class="taarifa-elimu">

        <div class="taarifa-header">
          TAARIFA ZA ELIMU
        </div>

        <div class="taarifa-card-grid"
             id="taarifaElimuCards">

          ${TAARIFA_ELIMU.CARDS.map(card => `

            <button
              type="button"
              class="taarifa-card"
              data-taarifa="${card.id}">

              <span class="taarifa-card-icon">
                ${card.icon}
              </span>

              <span>${card.title}</span>

            </button>

          `).join("")}

        </div>

        <div
          class="taarifa-workspace"
          id="taarifaElimuWorkspace"
          hidden>
        </div>

      </div>

    `;

    target.querySelectorAll("[data-taarifa]")
      .forEach(button => {

        button.addEventListener("click", function () {

          funguaTaarifaElimu(this.dataset.taarifa, target);

        });

      });

  }


  /* =================================
     3. KUFUNGUA KAZI ILIYOCHAGULIWA ================================= */

  function funguaTaarifaElimu(id, target) {

    const card = TAARIFA_ELIMU.CARDS.find(
      item => item.id === id
    );

    if (!card) return;

    const cards = target.querySelector(
      "#taarifaElimuCards"
    );

    const workspace = target.querySelector(
      "#taarifaElimuWorkspace"
    );

    cards.hidden = true;
    workspace.hidden = false;

    workspace.innerHTML = `

      <div class="taarifa-work-title">
        ${card.title}
      </div>

      <div class="taarifa-work-body">

        <div id="taarifaElimuForm">
          ${jengaTaarifaElimuForm(id)}
        </div>

        <div class="taarifa-placeholder">

          <strong>SEHEMU YA TAARIFA</strong>

          <div style="margin-top:8px;">
            Taarifa zitaonekana hapa baada ya
            kuunganisha data.
          </div>

        </div>

        <div class="taarifa-actions">

          <button
            type="button"
            class="taarifa-btn taarifa-back"
            id="taarifaElimuRudi">

            RUDI

          </button>

        </div>

      </div>

    `;

    workspace.querySelector("#taarifaElimuRudi")
      .addEventListener("click", function () {

        workspace.hidden = true;
        cards.hidden = false;

      });

  }


  /* ===================================
     4. FOMU ZA KILA TAARIFA
  =================================== */

  function jengaTaarifaElimuForm(id) {

    let fields = [];

    switch (id) {

      case "michango":

        fields = [
          ["MWAKA", "mwaka"],
          ["MWEZI", "mwezi"],
          ["AINA YA MCHANGO", "mchango"]
        ];

        break;

      case "ada":

        fields = [
          ["MWAKA", "mwaka"],
          ["MWEZI", "mwezi"],
          ["DARASA", "darasa"],
          ["JINA LA MWANAFUNZI", "mwanafunzi"]
        ];

        break;

      case "usajili":

        fields = [
          ["MWAKA", "mwaka"]
        ];

        break;

      case "fedha":

        fields = [
          ["MWAKA", "mwaka"]
        ];

        break;

      case "tathimini":

        fields = [
          ["MWAKA ANZIA", "mwakaAnzia"],
          ["MWAKA MWISHO", "mwakaMwisho"]
        ];

        break;

      case "wazazi":

        fields = [
          ["MWAKA", "mwaka"],
          ["DARASA", "darasa"]
        ];

        break;

    }

    return `

      <div class="taarifa-filters">

        ${fields.map(field => `

          <label class="taarifa-field">

            ${field[0]}

            <select
              name="${field[1]}"
              data-taarifa-filter="${field[1]}">

              <option value="">
                Chagua ${field[0]}
              </option>

            </select>

          </label>

        `).join("")}

      </div>

    `;

  }


  /* ================================
   5. KUUNGANISHA NA DSERVICES
================================ */
window.renderTaarifaelimuPage = function(workspace) {
  renderTaarifaElimu(workspace);
};

})();
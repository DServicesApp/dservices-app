/* =====================================
   DSERVICES - WATUMISHI
===================================== */
let watumishiData = [];
function renderWatumishiPage(workspace) {
  workspace.innerHTML = `
    <section class="section-panel">

      <div class="watumishi-toolbar">

        <button type="button"
          onclick="showWatumishiHistory()">
          HISTORIA
        </button>

        <button type="button"
          onclick="showWatumishiForm()">
          + SAJILI
        </button>

        <button type="button"
          onclick="showWatumishiSearch()">
          TAFUTA
        </button>

      </div>

      <div id="watumishiContent"></div>

    </section>

    <style>
     .watumishi-toolbar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  margin: 4px 0 12px;
}
.watumishi-toolbar button {
  flex: 1;
  min-width: 0;
  padding: 10px 8px;
  white-space: nowrap;
  border: 1px solid #4b5320;
  border-radius: 6px;
  background: #4b5320;
  color: white;
  cursor: pointer;
}
      .watumishi-toolbar button:active {
        opacity: .8;
      }
    </style>
  `;

  showWatumishiHistory();
}


/* =====================================
   TAFUTA MTUMISHI
===================================== */
function showWatumishiSearch() {
  const content = document.getElementById(
    "watumishiContent"
  );

  if (!content) return;

  content.innerHTML = `
    <div class="staff-group">

      <h4>TAFUTA MTUMISHI</h4>

      <div class="staff-field">

        <input
          type="search"
          id="tafutaMtumishi"
          placeholder="Andika kutafuta..."
          oninput="tafutaMtumishi()"
        >

      </div>

      <div id="matokeoTafutaMtumishi"
           style="margin-top:15px;">
      </div>

    </div>
  `;
}


function tafutaMtumishi() {

  const input = document.getElementById(
    "tafutaMtumishi"
  );

  const matokeo = document.getElementById(
    "matokeoTafutaMtumishi"
  );

  if (!input || !matokeo) return;

  const neno = input.value.trim().toLowerCase();

  const matokeoYatafutwa = watumishiData.filter(mt => {

    const taarifa = [
      mt.NA_MFANYAKAZI,
      mt.JINA_LA_KWANZA,
      mt.JINA_LA_KATI,
      mt.JINA_LA_MWISHO,
      mt.SIMU,
      mt.USERNAME
    ].join(" ").toLowerCase();

    return taarifa.includes(neno);

  });

  if (!neno) {
    matokeo.innerHTML = "<p>Andika taarifa za kutafuta.</p>";
    return;
  }

  if (matokeoYatafutwa.length === 0) {
    matokeo.innerHTML = "<p>Hakuna mtumishi aliyepatikana.</p>";
    return;
  }

  matokeo.innerHTML = matokeoYatafutwa.map(mt => `
    <div style="
      padding:12px;
      border-bottom:1px solid #ddd;
    ">
      <strong>${mt.NA_MFANYAKAZI || "-"}</strong>
      <br>
      ${[
        mt.JINA_LA_KWANZA,
        mt.JINA_LA_KATI,
        mt.JINA_LA_MWISHO
      ].filter(Boolean).join(" ")}
      <br>
      <small>${mt.SIMU || ""}</small>
    </div>
  `).join("");
}

/* =====================================
   HISTORIA
===================================== */
function showWatumishiHistory() {
  const content = document.getElementById(
    "watumishiContent"
  );
  if (!content) return;
  const list = [...watumishiData].sort(
    (a, b) =>
      new Date(b.TAREHE_YA_USAJILI) -
      new Date(a.TAREHE_YA_USAJILI)
  );
  content.innerHTML = `
    <h4>HISTORIA YA WATUMISHI</h4>
    <p>JUMLA YA WATUMISHI: ${list.length}</p>

    <div id="watumishiList"></div>
  `;
  const container = document.getElementById(
    "watumishiList"
  );

  if (list.length === 0) {
    container.innerHTML = `
      <p>Hakuna mtumishi aliyesajiliwa bado.</p>
    `;
    return;
  }

  list.forEach(mt => {

    const item = document.createElement("div");

    item.style.cssText =
      "padding:12px;border-bottom:1px solid #ddd;cursor:pointer;";

    item.innerHTML = `
      <strong>
        ${mt.NA_MFANYAKAZI || "-"}
      </strong>
      <br>
      ${[
        mt.JINA_LA_KWANZA,
        mt.JINA_LA_KATI,
        mt.JINA_LA_MWISHO
      ].filter(Boolean).join(" ")}
      <br>
      <small>${mt.HALI || ""}</small>
    `;

    container.appendChild(item);

  });

}


/* =====================================
   USAJILI WA MTUMISHI
===================================== */
function showWatumishiForm() {

  const content = document.getElementById("watumishiContent");
  if (!content) return;

  const leo = new Date();
  const tarehe = [
    leo.getFullYear(),
    String(leo.getMonth() + 1).padStart(2, "0"),
    String(leo.getDate()).padStart(2, "0")
  ].join("-");

  const huduma =
    window.selectedService ||
    window.currentService ||
    "";

  const kipengele =
    window.selectedMenu ||
    window.selectedModule ||
    "";

  content.innerHTML = `

    <style>

      .staff-form {
        width: 100%;
        max-width: 750px;
        margin: auto;
      }

      .staff-form-title {
        text-align: center;
        color: #4b5320;
        font-size: 19px;
        margin: 5px 0 18px;
      }

      .staff-group {
        background: #fff;
        padding: 15px;
        margin-bottom: 13px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }

      .staff-group h4 {
        margin: 0 0 15px;
        padding-bottom: 9px;
        border-bottom: 2px solid #4b5320;
        color: #4b5320;
        font-size: 15px;
      }

      .staff-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 13px;
      }

      .staff-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }

      .staff-field label {
        font-size: 13px;
        font-weight: 600;
      }

      .staff-field input,
      .staff-field select,
      .staff-field textarea {
        width: 100%;
        min-width: 0;
        padding: 11px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-sizing: border-box;
        font-size: 14px;
        background: #fff;
      }

      .staff-field input[readonly] {
        background: #f0f1ed;
        color: #555;
      }

      .staff-field textarea {
        min-height: 85px;
        resize: vertical;
      }

      .staff-full {
        grid-column: 1 / -1;
      }

      .staff-actions {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin: 20px 0;
      }

      .staff-actions button {
        min-width: 115px;
        padding: 12px 20px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
      }

      .staff-save {
        background: #4b5320;
        color: white;
      }

      .staff-close {
        background: #e5e7eb;
        color: #222;
      }

      .staff-message {
        text-align: center;
        margin: 10px 0;
        font-size: 14px;
      }

      @media(max-width:600px) {

        .staff-grid {
          grid-template-columns: 1fr;
        }

        .staff-full {
          grid-column: auto;
        }

      }

    </style>


    <div class="staff-form">

      <h3 class="staff-form-title">
        ＋ USAJILI WA MTUMISHI
      </h3>


      <form id="watumishiForm">


        <!-- TAARIFA ZA USAJILI -->

        <div class="staff-group">

          <h4>TAARIFA ZA USAJILI</h4>

          <div class="staff-grid">

            <div class="staff-field staff-full">
              <label>Tarehe ya Usajili</label>

              <input
                name="TAREHE_YA_USAJILI"
                type="date"
                value="${tarehe}"
                required
              >
            </div>

            <div class="staff-field">
              <label>Jina la Huduma</label>

              <input
                name="HUDUMA"
                value="${huduma}"
                readonly
              >
            </div>

            <div class="staff-field">
              <label>Jina la Kipengele</label>

              <input
                name="KIPENGELE"
                value="${kipengele}"
                readonly
              >
            </div>

            <div class="staff-field staff-full">
              <label>Namba ya Usajili</label>

              <input
                name="NA_MFANYAKAZI"
                readonly
                placeholder="Itazalishwa na mfumo"
              >
            </div>

          </div>

        </div>


        <!-- TAARIFA BINAFSI -->

        <div class="staff-group">

          <h4>TAARIFA BINAFSI</h4>

          <div class="staff-grid">

            <div class="staff-field">
              <label>Jina la Kwanza</label>

              <input
                name="JINA_LA_KWANZA"
                required
                oninput="updateWatumishiUsername()"
              >
            </div>

            <div class="staff-field">
              <label>Jina la Kati</label>

              <input name="JINA_LA_KATI">
            </div>

            <div class="staff-field">
              <label>Jina la Mwisho</label>

              <input
                name="JINA_LA_MWISHO"
                required
                oninput="updateWatumishiUsername()"
              >
            </div>

            <div class="staff-field">
              <label>Jinsi</label>

              <select name="JINSI">
                <option value="">Chagua</option>
                <option value="ME">ME</option>
                <option value="KE">KE</option>
              </select>
            </div>

            <div class="staff-field">
              <label>Simu</label>

              <input
                name="SIMU"
                type="tel"
                placeholder="07XXXXXXXX"
              >
            </div>

            <div class="staff-field">
              <label>Email</label>

              <input
                name="EMAIL"
                type="email"
                placeholder="example@email.com"
              >
            </div>

          </div>

        </div>


        <!-- TAARIFA ZA KAZI -->

        <div class="staff-group">

          <h4>TAARIFA ZA KAZI</h4>

          <div class="staff-grid">

            <div class="staff-field">
              <label>Elimu</label>

              <input
                name="ELIMU"
                placeholder="Kiwango cha elimu"
              >
            </div>

            <div class="staff-field">
              <label>Nafasi / Wadhifa</label>

              <select
                name="NAFASI/ WADHIFA"
                id="nafasiWatumishi"
                onchange="toggleNafasiMpya()"
                required
              >

                <option value="">Chagua nafasi</option>

                <option value="NYINGINE">
                  + Ongeza nafasi mpya
                </option>

              </select>
            </div>

            <div
              class="staff-field staff-full"
              id="nafasiMpyaBox"
              style="display:none;"
            >
              <label>Andika Nafasi Mpya</label>

              <input
                id="nafasiMpya"
                placeholder="Ingiza nafasi mpya"
              >

            </div>

            <div class="staff-field">
              <label>Username</label>

              <input
                name="USERNAME"
                id="usernameMtumishi"
                readonly
                placeholder="Itazalishwa na mfumo"
              >
            </div>

            <div class="staff-field">
              <label>Hali</label>

              <select name="HALI">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

          </div>

        </div>


        <!-- MAELEZO -->
        <div class="staff-group">
          <h4>MAELEZO</h4>
          <div class="staff-grid">

            <div class="staff-field staff-full">

              <label>Maelezo</label>

              <textarea
                name="MAELEZO"
                placeholder="Andika maelezo..."
              ></textarea>

            </div>

          </div>

        </div>


        <div
          id="watumishiFormMessage"
          class="staff-message">
        </div>


        <!-- VITUFE -->
        <div class="staff-actions">
          <button
            type="submit"
            class="staff-save">
            HIFADHI
          </button>
          <button
            type="button"
            class="staff-close"
            onclick="showWatumishiHistory()">
            FUNGA
          </button>

        </div>

      </form>

    </div>

  `;


  // Kupakia nafasi za watumishi
  loadNafasiWatumishi();


  // Kwa sasa kuhifadhi hakujabadilishwa
  document.getElementById("watumishiForm")
    .addEventListener("submit", function(e) {

      e.preventDefault();

      const message = document.getElementById(
        "watumishiFormMessage"
      );

      message.textContent =
        "Muunganiko wa kuhifadhi Google Sheets bado haujaunganishwa.";

    });

}
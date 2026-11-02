/* =====================================
   DSERVICES - WANAFUNZI
===================================== */

let wanafunziData = [];


/* =====================================
   UKURASA MKUU WA WANAFUNZI
===================================== */

function renderWanafunziPage(workspace) {

  workspace.innerHTML = `
    <section class="section-panel">

      <div class="wanafunzi-toolbar">

        <button type="button"
          onclick="showWanafunziForm()">
          + SAJILI
        </button>

        <button type="button"
          onclick="showWanafunziHistory()">
          HISTORIA
        </button>

        <button type="button"
          onclick="showWanafunziSearch()">
          TAFUTA
        </button>

      </div>

      <div id="wanafunziContent"></div>

    </section>

    <style>

      .wanafunzi-toolbar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 8px;
        flex-wrap: nowrap;
        margin: 4px 0 12px;
      }

      .wanafunzi-toolbar button {
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

      .wanafunzi-toolbar button:active {
        opacity: .8;
      }

    </style>
  `;

  showWanafunziHistory();
}


/* =====================================
   HISTORIA YA WANAFUNZI
===================================== */

function showWanafunziHistory() {

  const content = document.getElementById(
    "wanafunziContent"
  );

  if (!content) return;

  const list = [...wanafunziData].sort(
    (a, b) =>
      new Date(b["TAR USAJILI"]) -
      new Date(a["TAR USAJILI"])
  );

  content.innerHTML = `
    <h4>HISTORIA YA WANAFUNZI</h4>

    <p>JUMLA YA WANAFUNZI: ${list.length}</p>

    <div id="wanafunziList"></div>
  `;

  const container = document.getElementById(
    "wanafunziList"
  );

  if (list.length === 0) {

    container.innerHTML = `
      <p>Hakuna mwanafunzi aliyesajiliwa bado.</p>
    `;

    return;
  }

  list.forEach(mwanafunzi => {

    const item = document.createElement("div");

    item.style.cssText = `
      padding:12px;
      border-bottom:1px solid #ddd;
      cursor:pointer;
    `;

    item.innerHTML = `
      <strong>
        ${mwanafunzi.NA_USAJILI || "-"}
      </strong>
      <br>

      ${[
        mwanafunzi["JINA LA KWANZA"],
        mwanafunzi["JINA LA KATI"],
        mwanafunzi["JINA LA MWISHO"]
      ].filter(Boolean).join(" ")}

      <br>

      <small>
        ${mwanafunzi.DARASA || ""}
        |
        ${mwanafunzi.HALI || ""}
      </small>
    `;

    container.appendChild(item);

  });

}


/* =====================================
   TAFUTA MWANAFUNZI
===================================== */

function showWanafunziSearch() {

  const content = document.getElementById(
    "wanafunziContent"
  );

  if (!content) return;

  content.innerHTML = `

    <div class="staff-group">

      <h4>TAFUTA MWANAFUNZI</h4>

      <div class="staff-field">

        <label>
          Jina, namba ya usajili au darasa
        </label>

        <input
          type="search"
          id="tafutaMwanafunzi"
          placeholder="Andika hapa kutafuta..."
          oninput="tafutaMwanafunzi()"
        >

      </div>

      <div id="matokeoTafutaMwanafunzi"
           style="margin-top:15px;">
      </div>

    </div>

  `;
}


function tafutaMwanafunzi() {

  const input = document.getElementById(
    "tafutaMwanafunzi"
  );

  const matokeo = document.getElementById(
    "matokeoTafutaMwanafunzi"
  );

  if (!input || !matokeo) return;

  const neno = input.value.trim().toLowerCase();

  if (!neno) {

    matokeo.innerHTML =
      "<p>Andika taarifa za kutafuta.</p>";

    return;
  }

  const matokeoYatafutwa = wanafunziData.filter(m => {

    const taarifa = [
      m.NA_USAJILI,
      m.DARASA,
      m["JINA LA KWANZA"],
      m["JINA LA KATI"],
      m["JINA LA MWISHO"],
      m["ID MWANAFUNZI"]
    ].join(" ").toLowerCase();

    return taarifa.includes(neno);

  });

  if (matokeoYatafutwa.length === 0) {

    matokeo.innerHTML =
      "<p>Hakuna mwanafunzi aliyepatikana.</p>";

    return;
  }

  matokeo.innerHTML = matokeoYatafutwa.map(m => `

    <div style="
      padding:12px;
      border-bottom:1px solid #ddd;
    ">

      <strong>${m.NA_USAJILI || "-"}</strong>

      <br>

      ${[
        m["JINA LA KWANZA"],
        m["JINA LA KATI"],
        m["JINA LA MWISHO"]
      ].filter(Boolean).join(" ")}

      <br>

      <small>${m.DARASA || ""}</small>

    </div>

  `).join("");

}


/* =====================================
   USAJILI WA MWANAFUNZI
===================================== */

function showWanafunziForm() {

  const content = document.getElementById(
    "wanafunziContent"
  );

  if (!content) return;

  const leo = new Date();

  const tarehe = [
    leo.getFullYear(),
    String(leo.getMonth() + 1).padStart(2, "0"),
    String(leo.getDate()).padStart(2, "0")
  ].join("-");

  content.innerHTML = `

    <style>

      .student-form {
        width:100%;
        max-width:1000px;
        margin:auto;
      }

      .student-group {
        background:#fff;
        padding:15px;
        margin-bottom:15px;
        border:1px solid #ddd;
        border-radius:8px;
      }

      .student-group h4 {
        margin:0 0 15px;
        padding-bottom:8px;
        border-bottom:2px solid #4b5320;
        color:#4b5320;
      }

      .student-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:14px;
      }

      .student-field {
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width:0;
      }

      .student-field label {
        font-weight:600;
        font-size:14px;
      }

      .student-field input,
      .student-field select,
      .student-field textarea {
        width:100%;
        min-width:0;
        padding:11px;
        border:1px solid #ccc;
        border-radius:6px;
        box-sizing:border-box;
        font-size:15px;
      }

      .student-full {
        grid-column:1/-1;
      }

      .student-actions {
        display:flex;
        justify-content:center;
        gap:12px;
        flex-wrap:wrap;
        margin:20px 0;
      }

      .student-actions button {
        padding:11px 25px;
        border:none;
        border-radius:6px;
        cursor:pointer;
      }

      .student-save {
        background:#4b5320;
        color:white;
      }

      .student-cancel {
        background:#e5e7eb;
        color:#222;
      }

      .student-message {
        text-align:center;
        margin:10px 0;
      }

      @media(max-width:600px) {
        .student-grid {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }

        .student-full {
          grid-column:1/-1;
        }
      }

    </style>


    <div class="student-form">

      <h3 style="text-align:center;">
        👤 USAJILI WA MWANAFUNZI
      </h3>


      <form id="wanafunziForm">


        <!-- 1. USAJILI -->

        <div class="student-group">

          <h4>1. TAARIFA ZA USAJILI</h4>

          <div class="student-grid">

            <div class="student-field">
              <label>ACCOUNT</label>
              <input name="JINA_LA_ACCOUNT" readonly>
            </div>

            <div class="student-field">
              <label>ID MWANAFUNZI</label>
              <input name="ID MWANAFUNZI" readonly
                placeholder="Itazalishwa na mfumo">
            </div>

            <div class="student-field">
              <label>NA_USAJILI</label>
              <input name="NA_USAJILI" readonly
                placeholder="Itazalishwa na mfumo">
            </div>

          </div>

        </div>


        <!-- 2. TAARIFA BINAFSI -->

        <div class="student-group">
          <h4>2. TAARIFA BINAFSI</h4>

          <div class="student-grid">

            <div class="student-field">
              <label>Jina la Kwanza *</label>
              <input name="JINA LA KWANZA" required>
            </div>

            <div class="student-field">
              <label>Jina la Pili</label>
              <input name="JINA LA KATI">
            </div>

            <div class="student-field">
              <label>Jina la Mwisho *</label>
              <input name="JINA LA MWISHO" required>
            </div>
            <div class="student-field">
              <label>Umri</label>
              <input name="UMRI" type="number" min="1">
            </div>

            <div class="student-field">
              <label>Jinsi</label>
              <select name="JINSI">
                <option value="">Chagua jinsi</option>
                <option value="ME">ME</option>
                <option value="KE">KE</option>
              </select>
            </div>

            <div class="student-field">
              <label>Darasa *</label>
              <select name="DARASA" id="darasaMwanafunzi"
                onchange="onDarasaMwanafunziChange()" required>
                <option value="">Chagua darasa</option>
                <option value="NYINGINE">+ Ongeza darasa</option>
              </select>
            </div>

            <div class="student-field student-full"
              id="darasaMpyaBox" style="display:none;">

              <label>Andika Darasa Jipya</label>

              <input id="darasaMpya"
                placeholder="Ingiza jina la darasa">

            </div>

          </div>

        </div>


        <!-- 3. TAARIFA ZA MASOMO -->

        <div class="student-group">

          <h4>3. TAARIFA ZA MASOMO</h4>

          <div class="student-grid">

            <div class="student-field">
              <label>Masomo</label>
              <input name="MASOMO">
            </div>

            <div class="student-field">
              <label>Anapoishi</label>
              <input name="ANAPOISHI">
            </div>

            <div class="student-field">
              <label>Shule Atokayo</label>
              <input name="SHULE ATOKAYO">
            </div>

            <div class="student-field">
              <label>Simu 1 *</label>
              <input name="SIMU1" type="tel" required>
            </div>
            <div class="student-field">
              <label>Simu 2</label>
              <input name="SIMU2" type="tel">
            </div>

            <div class="student-field">
              <label>Tarehe ya Usajili *</label>
              <input name="TAR USAJILI"
                type="date" value="${tarehe}" required>
            </div>

          </div>

        </div>


        <!-- 4. MPANGO WA MASOMO -->

        <div class="student-group">

          <h4>4. MPANGO WA MASOMO</h4>

          <div class="student-grid">

            <div class="student-field">
              <label>Mpango wa Malipo</label>
              <select name="MPANGO MALIPO">
                <option value="">Chagua mpango</option>
                <option value="MWEZI">MWEZI</option>
                <option value="MUHULA">MUHULA</option>
                <option value="MWAKA">MWAKA</option>
                <option value="MALIPO KAMILI">MALIPO KAMILI</option>
              </select>
            </div>

            <div class="student-field">
              <label>Eneo la Mafunzo</label>
              <select name="ENEO LA MAFUNZO(NYUMBANI /KITUONI)">
                <option value="">Chagua eneo</option>
                <option value="NYUMBANI">NYUMBANI</option>
                <option value="KITUONI">KITUONI</option>
              </select>
            </div>

            <div class="student-field">
              <label>Kipindi cha Masomo</label>
              <select name="KIPINDI(KIPINDI CHA MASOMO, KIPINDI CHA LIKIZO, VIPINDI VYOTE)">
                <option value="">Chagua kipindi</option>
                <option value="KIPINDI CHA MASOMO">
                  KIPINDI CHA MASOMO
                </option>
                <option value="KIPINDI CHA LIKIZO">
                  KIPINDI CHA LIKIZO
                </option>
                <option value="VIPINDI VYOTE">
                  VIPINDI VYOTE
                </option>
              </select>
            </div>

          </div>

        </div>


        <!-- 5. TAARIFA ZA ZIADA -->

        <div class="student-group">

          <h4>5. TAARIFA ZA ZIADA</h4>

          <div class="student-grid">

            <div class="student-field student-full">
              <label>Maelezo</label>
              <textarea name="MAELEZO"></textarea>
            </div>

            <div class="student-field">
              <label>Msajili</label>
              <input name="MSAJILI" readonly>
            </div>

            <div class="student-field">
              <label>Nafasi</label>
              <input name="NAFASI" readonly>
            </div>

          </div>

        </div>


        <div id="wanafunziFormMessage"
          class="student-message"></div>


        <div class="student-actions">

          <button type="submit" class="student-save">
            HIFADHI
          </button>

          <button type="button"
            class="student-cancel"
            onclick="showWanafunziHistory()">
            GHAIRI
          </button>

        </div>

      </form>

    </div>

  `;


  /* KWA SASA HIFADHI NI MAJARIBIO YA UI */

  document.getElementById("wanafunziForm")
    .addEventListener("submit", function(e) {

      e.preventDefault();

      const message = document.getElementById(
        "wanafunziFormMessage"
      );

      message.textContent =
        "Fomu iko tayari. Muunganiko wa kuhifadhi bado haujaunganishwa.";

    });

}


/* =====================================
   DARASA JIPYA
===================================== */

function onDarasaMwanafunziChange() {

  const select = document.getElementById(
    "darasaMwanafunzi"
  );

  const box = document.getElementById(
    "darasaMpyaBox"
  );

  const input = document.getElementById(
    "darasaMpya"
  );
  if (!select || !box || !input) return;

  if (select.value === "NYINGINE") {
    box.style.display = "flex";
    input.required = true;
  } else {
    box.style.display = "none";
    input.required = false;
    input.value = "";

  }

}
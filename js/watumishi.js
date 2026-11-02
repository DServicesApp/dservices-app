/* =====================================
   DSERVICES - WATUMISHI
===================================== */

let watumishiData = [];

function renderWatumishiPage(workspace) {

  workspace.innerHTML = `
    <section class="section-panel">

      <h3 style="text-align:center;">
        WATUMISHI
      </h3>

      <div style="
        display:flex;
        justify-content:center;
        gap:8px;
        flex-wrap:wrap;
        margin:15px 0;
      ">

        <button onclick="showWatumishiHistory()">
          HISTORIA
        </button>

        <button onclick="showWatumishiForm()">
          + SAJILI
        </button>

        <button onclick="showWatumishiSearch()">
          TAFUTA
        </button>

      </div>

      <div id="watumishiContent"></div>

    </section>
  `;

  showWatumishiHistory();
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
   USAJILI
===================================== */

function showWatumishiForm() {

  const content = document.getElementById(
    "watumishiContent"
  );

  if (!content) return;

  content.innerHTML = `
    <h4 style="text-align:center;">
      USAJILI WA MTUMISHI
    </h4>

    <form id="watumishiForm">

      <label>Namba ya Usajili</label>
      <input name="NA_MFANYAKAZI">

      <label>Jina la Kwanza</label>
      <input name="JINA_LA_KWANZA" required>

      <label>Jina la Kati</label>
      <input name="JINA_LA_KATI">

      <label>Jina la Mwisho</label>
      <input name="JINA_LA_MWISHO" required>

      <label>Jinsi</label>
      <select name="JINSI">
        <option value="">Chagua</option>
        <option value="ME">ME</option>
        <option value="KE">KE</option>
      </select>

      <label>Simu</label>
      <input name="SIMU" type="tel">

      <label>Email</label>
      <input name="EMAIL" type="email">

      <label>Elimu</label>
      <input name="ELIMU">

      <label>Nafasi / Wadhifa</label>
      <input name="NAFASI/ WADHIFA">

      <label>Username</label>
      <input name="USERNAME" readonly>

      <label>Tarehe ya Usajili</label>
      <input
        name="TAREHE_YA_USAJILI"
        type="date"
        required
      >

      <label>Hali</label>
      <select name="HALI">
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>

      <label>Maelezo</label>
      <textarea name="MAELEZO"></textarea>

      <div style="
        display:flex;
        justify-content:center;
        gap:10px;
        margin-top:15px;
      ">

        <button type="submit">HIFADHI</button>

        <button
          type="button"
          onclick="showWatumishiHistory()"
        >
          FUNGA
        </button>

      </div>

    </form>
  `;

  const form = document.getElementById(
    "watumishiForm"
  );

  const date = form.elements[
    "TAREHE_YA_USAJILI"
  ];

  date.value = new Date().toISOString().slice(0, 10);

}
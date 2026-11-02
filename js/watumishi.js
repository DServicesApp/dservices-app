/* ==================================
   DSERVICES - WATUMISHI
================================== */

function renderWatumishiPage(workspace) {
  workspace.innerHTML = `
    <section class="watumishi-page">

      <h3 style="text-align:center;">
        WATUMISHI
      </h3>

      <div class="watumishi-actions"
           style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:15px 0;">

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

      <div id="watumishiContent">
        <p style="text-align:center;">
          Inapakia taarifa za watumishi...
        </p>
      </div>

    </section>
  `;

  showWatumishiHistory();
}


/* HISTORIA */

function showWatumishiHistory() {
  const content = document.getElementById("watumishiContent");

  if (!content) return;

  content.innerHTML = `
    <h4>HISTORIA YA WATUMISHI</h4>

    <p>Orodha ya watumishi itaonekana hapa.</p>
  `;
}


/* USAJILI */

function showWatumishiForm() {
  const content = document.getElementById("watumishiContent");

  if (!content) return;

  content.innerHTML = `
    <h4 style="text-align:center;">
      USAJILI WA MTUMISHI
    </h4>

    <form id="watumishiForm">

      <label>Namba ya Usajili</label>
      <input name="NA_MFANYAKAZI" type="text">

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
      <input name="TAREHE_YA_USAJILI" type="date">

      <label>Hali</label>
      <select name="HALI">
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>

      <label>Maelezo</label>
      <textarea name="MAELEZO"></textarea>

      <div style="display:flex;justify-content:center;gap:10px;margin-top:15px;">
        <button type="submit">HIFADHI</button>
        <button type="button" onclick="renderWatumishiPage(document.getElementById('moduleWorkspace'))">
          FUNGA
        </button>
      </div>

    </form>
  `;
}


/* TAFUTA */

function showWatumishiSearch() {
  const content = document.getElementById("watumishiContent");

  if (!content) return;

  content.innerHTML = `
    <h4>TAFUTA MTUMISHI</h4>

    <input
      type="search"
      id="watumishiSearchInput"
      placeholder="Jina, namba ya usajili, simu au username..."
    >

    <div id="watumishiSearchResults"></div>
  `;
}
/* =================================================
   DSERVICES - TAALUMA
   FILE: taaluma.js

   MODULES:
   1. DASHBOARD
   2. MADARASA
   3. MASOMO
   4. MAJUKUMU
   5. RATIBA MASOMO
   6. RATIBA MITIHANI
   7. ALAMA
   8. MATOKEO DARASA
   9. MATOKEO MWANAFUNZI
   10. PDF REPORTS

   BACKEND: GOOGLE APPS SCRIPT
   doGet / doPost - TO BE CONNECTED
================================================= */

(function () {
  "use strict";

  /* ==============================================
     1. CONFIGURATION
  ============================================== */

  const CONFIG = {
    SERVICE: "ELIMU",
    MODULE: "TUITION",
    API_URL: window.TAALUMA_API_URL || "",
    ACCOUNT_ID: "",
    VERSION: "2.0"
  };

  let workspace = null;
  let currentPage = "HOME";

  /* ==============================================
     2. DATA STATE

     Hizi ni data za muda za majaribio.
     Baadaye zitasomwa moja kwa moja Sheets.
  ============================================== */

  const DB = {
    madarasa: [],
    masomo: [],
    majukumu: [],
    ratibaMasomo: [],
    ratibaMitihani: [],
    alama: [],
    wanafunzi: []
  };

  const user = () => window.currentUser || {};

  function accountId() {
    const u = user();

    return String(
      u.accountId ||
      u.ACCOUNT_ID ||
      u.account_id ||
      ""
    );
  }

  function accountName() {
    const u = user();

    return (
      u.JINA_LA_ACCOUNT ||
      u.jinaLaAccount ||
      u.accountName ||
      u.ACCOUNT_NAME ||
      ""
    );
  }

  function currentUsername() {
    const u = user();

    return (
      u.JINA ||
      u.jina ||
      u.fullName ||
      u.username ||
      "Mtumiaji"
    );
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[char]
    );
  }

  function uid() {
    return (
      "TAL-" +
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2, 7)
    );
  }

  /* ==============================================
     3. API CONNECTION

     Tutaunganisha na doGet/doPost baadaye.
  ============================================== */

  async function taalumaAPI(action, payload = {}) {

    if (!CONFIG.API_URL) {
      return {
        success: false,
        offline: true,
        message: "API bado haijaunganishwa."
      };
    }

    try {

      const response = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          action,
          accountId: accountId(),
          serviceId: CONFIG.SERVICE,
          moduleId: CONFIG.MODULE,
          payload
        })
      });

      if (!response.ok) {
        throw new Error("API connection failed");
      }

      const result = await response.json();

      return result;

    } catch (error) {

      console.error("TAALUMA API:", error);

      return {
        success: false,
        message: "Imeshindikana kuwasiliana na server."
      };
    }
  }

  /*
    Kwa sasa data zinatunzwa kwenye DB ya muda
    ili tuweze kujaribu interface.

    Baadaye tutatumia Google Sheets.
  */

  async function saveRecord(type, data) {

    const payload = {
      ID: uid(),
      ACCOUNT_ID: accountId(),
      ...data,
      TAREHE: new Date().toISOString()
    };

    if (CONFIG.API_URL) {

      const result = await taalumaAPI(
        "saveTaaluma" + type,
        payload
      );

      if (!result.success) {
        alert(result.message || "Imeshindikana kuhifadhi.");
        return false;
      }

    } else {

      const key = {
        DARASA: "madarasa",
        SOMO: "masomo",
        JUKUMU: "majukumu",
        RATIBA_MASOMO: "ratibaMasomo",
        RATIBA_MITIHANI: "ratibaMitihani",
        ALAMA: "alama"
      }[type];

      if (key && DB[key]) {
        DB[key].push(payload);
      }

    }

    return true;
  }

  /* ==============================================
     4. MAIN PAGE
  ============================================== */

  function renderTaalumaPage(container) {

    if (!container) return;

    workspace = container;
    currentPage = "HOME";

    injectStyles();

    workspace.innerHTML = `
      <section class="taaluma-container">

        <div class="taaluma-heading">
          <h3>USIMAMIZI WA TAALUMA</h3>
        </div>

        <div class="card-actions">

          ${createCard(
            "RATIBA YA MASOMO",
            "Ratiba za vipindi",
            "RATIBA_MASOMO"
          )}

          ${createCard(
            "RATIBA YA MITIHANI",
            "Ratiba za mitihani",
            "RATIBA_MITIHANI"
          )}

          ${createCard(
            "SAJILI DARASA",
            "Usajili wa madarasa",
            "DARASA"
          )}

          ${createCard(
            "SAJILI MASOMO",
            "Usajili wa masomo",
            "MASOMO"
          )}

          ${createCard(
            "SAJILI MAJUKUMU",
            "Walimu na majukumu",
            "MAJUKUMU"
          )}

          ${createCard(
            "WEKA RATIBA MASOMO",
            "Panga vipindi",
            "WEKA_RATIBA_MASOMO"
          )}

          ${createCard(
            "WEKA RATIBA MITIHANI",
            "Panga mitihani",
            "WEKA_RATIBA_MITIHANI"
          )}

          ${createCard(
            "WEKA ALAMA",
            "Ingiza alama za wanafunzi",
            "ALAMA"
          )}

          ${createCard(
            "MATOKEO DARASA",
            "Ripoti ya darasa",
            "MATOKEO_DARASA"
          )}

          ${createCard(
            "MATOKEO MWANAFUNZI",
            "Ripoti ya mwanafunzi",
            "MATOKEO_MWANAFUNZI"
          )}

        </div>

        <div id="taalumaWorkspace"></div>

      </section>
    `;

  }

  function createCard(title, description, action) {

    return `
      <button
        type="button"
        class="taaluma-card"
        onclick="taalumaOpen('${action}')">

        <span class="taaluma-card-title">
          ${title}
        </span>

        <small class="taaluma-card-description">
          ${description}
        </small>

      </button>
    `;
  }

  /* ==============================================
     5. PAGE NAVIGATION
  ============================================== */

  function taalumaOpen(page) {

    currentPage = page;

    const area = document.getElementById(
      "taalumaWorkspace"
    );

    if (!area) return;

    const pages = {

      DARASA: formDarasa,
      MASOMO: formMasomo,
      MAJUKUMU: formMajukumu,

      WEKA_RATIBA_MASOMO: formRatibaMasomo,
      WEKA_RATIBA_MITIHANI: formRatibaMitihani,

      RATIBA_MASOMO: () => viewRatiba("MASOMO"),
      RATIBA_MITIHANI: () => viewRatiba("MITIHANI"),

      ALAMA: formAlama,

      MATOKEO_DARASA: resultsDarasa,
      MATOKEO_MWANAFUNZI: resultsMwanafunzi

    };

    if (pages[page]) {
      area.innerHTML = pages[page]();
      loadPageData(page);
    }

    area.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function pageHeader(title) {

    return `
      <div class="taaluma-page-header">

        <h3>${escapeHTML(title)}</h3>

        <button
          type="button"
          onclick="taalumaBack()">
          ← RUDI
        </button>

      </div>
    `;
  }

  function taalumaBack() {

    const area = document.getElementById(
      "taalumaWorkspace"
    );

    if (area) area.innerHTML = "";

    currentPage = "HOME";
  }

  /* ==============================================
     6. SAJILI DARASA
  ============================================== */

  function formDarasa() {

    return `
      ${pageHeader("SAJILI DARASA")}

      <div class="taaluma-form">

        <label>JINA LA DARASA</label>

        <input
          id="talDarasa"
          type="text"
          placeholder="Mfano: DARASA LA I">

        <label>MAELEZO</label>

        <textarea
          id="talDarasaMaelezo">
        </textarea>

        <button
          onclick="taalumaSaveDarasa()">
          HIFADHI DARASA
        </button>

        <div id="talDarasaList"></div>

      </div>
    `;
  }

  async function taalumaSaveDarasa() {

    const jina = document.getElementById(
      "talDarasa"
    ).value.trim();

    const maelezo = document.getElementById(
      "talDarasaMaelezo"
    ).value.trim();

    if (!jina) {
      alert("Weka jina la darasa.");
      return;
    }

    const ok = await saveRecord("DARASA", {
      JINA_LA_DARASA: jina,
      MAELEZO: maelezo
    });

    if (ok) {

      alert("Darasa limehifadhiwa.");

      taalumaOpen("DARASA");
    }
  }

  /* ==============================================
     7. SAJILI MASOMO
  ============================================== */

  function formMasomo() {

    return `
      ${pageHeader("SAJILI MASOMO")}

      <div class="taaluma-form">

        <label>JINA LA SOMO</label>

        <input
          id="talSomo"
          type="text"
          placeholder="Mfano: HISABATI">

        <label>MAELEZO</label>

        <textarea id="talSomoMaelezo"></textarea>

        <label>DARASA</label>

        <select id="talSomoDarasa">
          <option value="">CHAGUA DARASA</option>
        </select>

        <button
          onclick="taalumaSaveSomo()">
          HIFADHI SOMO
        </button>

      </div>
    `;
  }

  async function taalumaSaveSomo() {

    const jina = document.getElementById(
      "talSomo"
    ).value.trim();

    const darasa = document.getElementById(
      "talSomoDarasa"
    ).value;

    const maelezo = document.getElementById(
      "talSomoMaelezo"
    ).value.trim();

    if (!jina || !darasa) {
      alert("Jaza jina la somo na darasa.");
      return;
    }

    const ok = await saveRecord("SOMO", {
      JINA_LA_SOMO: jina,
      DARASA_ID: darasa,
      MAELEZO: maelezo
    });

    if (ok) {
      alert("Somo limehifadhiwa.");
      taalumaOpen("MASOMO");
    }
  }

  /* ==============================================
     8. SAJILI MAJUKUMU
  ============================================== */

  function formMajukumu() {

    return `
      ${pageHeader("SAJILI MAJUKUMU")}

      <div class="taaluma-form">

        <label>JINA LA MWALIMU</label>

        <input
          id="talMwalimu"
          type="text"
          placeholder="Jina la mwalimu">

        <label>NA. USAJILI</label>

        <input
          id="talMwalimuId"
          type="text">

        <label>DARASA</label>

        <select id="talJukumuDarasa">
          <option value="">CHAGUA DARASA</option>
        </select>

        <label>SOMO</label>

        <select id="talJukumuSomo">
          <option value="">CHAGUA SOMO</option>
        </select>

        <label>AINA YA JUKUMU</label>

        <select id="talAinaJukumu">

          <option value="">CHAGUA</option>

          <option>MWALIMU WA SOMO</option>

          <option>MWALIMU WA DARASA</option>

          <option>MSIMAMIZI WA MTIHANI</option>

          <option>JUKUMU JINGINE</option>

        </select>

        <button
          onclick="taalumaSaveJukumu()">
          HIFADHI JUKUMU
        </button>

      </div>
    `;
  }

  async function taalumaSaveJukumu() {

    const jina = document.getElementById(
      "talMwalimu"
    ).value.trim();

    const darasa = document.getElementById(
      "talJukumuDarasa"
    ).value;

    const somo = document.getElementById(
      "talJukumuSomo"
    ).value;

    const aina = document.getElementById(
      "talAinaJukumu"
    ).value;

    if (!jina || !aina) {
      alert("Jaza jina na aina ya jukumu.");
      return;
    }

    const ok = await saveRecord("JUKUMU", {

      JINA_LA_MWALIMU: jina,

      REGISTRATION_NO:
        document.getElementById("talMwalimuId").value,

      DARASA_ID: darasa,

      SOMO_ID: somo,

      AINA_YA_JUKUMU: aina

    });

    if (ok) {

      alert("Jukumu limehifadhiwa.");

      taalumaOpen("MAJUKUMU");
    }
  }

  /* ==============================================
     9. RATIBA ZA MASOMO
  ============================================== */

  function formRatibaMasomo() {

    return `
      ${pageHeader("WEKA RATIBA YA MASOMO")}

      <div class="taaluma-form">

        <label>DARASA</label>

        <select id="talRatibaDarasa">
          <option value="">CHAGUA DARASA</option>
        </select>

        <label>SIKU</label>

        <select id="talRatibaSiku">

          <option>JUMATATU</option>
          <option>JUMANNE</option>
          <option>JUMATANO</option>
          <option>ALHAMISI</option>
          <option>IJUMAA</option>
          <option>JUMAMOSI</option>

        </select>

        <label>SOMO</label>

        <select id="talRatibaSomo">
          <option value="">CHAGUA SOMO</option>
        </select>

        <label>MWALIMU</label>

        <input
          id="talRatibaMwalimu"
          type="text">

        <label>MUDA WA KUANZA</label>

        <input
          id="talRatibaMwanzo"
          type="time">

        <label>MUDA WA KUMALIZA</label>

        <input
          id="talRatibaMwisho"
          type="time">

        <button
          onclick="taalumaSaveRatibaMasomo()">
          HIFADHI RATIBA
        </button>

      </div>
    `;
  }

  async function taalumaSaveRatibaMasomo() {

    const darasa = document.getElementById(
      "talRatibaDarasa"
    ).value;

    const somo = document.getElementById(
      "talRatibaSomo"
    ).value;

    const mwanzo = document.getElementById(
      "talRatibaMwanzo"
    ).value;

    const mwisho = document.getElementById(
      "talRatibaMwisho"
    ).value;

    if (!darasa || !somo || !mwanzo || !mwisho) {
      alert("Jaza taarifa zote muhimu.");
      return;
    }

    if (mwanzo >= mwisho) {
      alert("Muda wa kumaliza lazima uwe baada ya muda wa kuanza.");
      return;
    }

    const ok = await saveRecord("RATIBA_MASOMO", {

      DARASA_ID: darasa,

      SIKU: document.getElementById(
        "talRatibaSiku"
      ).value,

      SOMO_ID: somo,

      MWALIMU: document.getElementById(
        "talRatibaMwalimu"
      ).value,

      MUDA_KUANZA: mwanzo,

      MUDA_KUMALIZA: mwisho

    });

    if (ok) {

      alert("Ratiba imehifadhiwa.");

      taalumaOpen("WEKA_RATIBA_MASOMO");
    }
  }

  /* ==============================================
     10. RATIBA ZA MITIHANI
  ============================================== */

  function formRatibaMitihani() {

    return `
      ${pageHeader("WEKA RATIBA YA MITIHANI")}

      <div class="taaluma-form">

        <label>JINA LA MTIHANI</label>

        <input
          id="talMtihani"
          type="text">

        <label>MWAKA</label>

        <input
          id="talMtihaniMwaka"
          type="number"
          value="${new Date().getFullYear()}">

        <label>DARASA</label>

        <select id="talMtihaniDarasa">
          <option value="">CHAGUA DARASA</option>
        </select>

        <label>SOMO</label>

        <select id="talMtihaniSomo">
          <option value="">CHAGUA SOMO</option>
        </select>

        <label>TAREHE</label>

        <input
          id="talMtihaniTarehe"
          type="date">

        <label>MUDA WA KUANZA</label>

        <input
          id="talMtihaniMwanzo"
          type="time">

        <label>MUDA WA KUMALIZA</label>

        <input
          id="talMtihaniMwisho"
          type="time">

        <button
          onclick="taalumaSaveRatibaMitihani()">
          HIFADHI RATIBA
        </button>

      </div>
    `;
  }

  async function taalumaSaveRatibaMitihani() {

    const jina = document.getElementById(
      "talMtihani"
    ).value.trim();

    const darasa = document.getElementById(
      "talMtihaniDarasa"
    ).value;

    const somo = document.getElementById(
      "talMtihaniSomo"
    ).value;

    const tarehe = document.getElementById(
      "talMtihaniTarehe"
    ).value;

    const mwanzo = document.getElementById(
      "talMtihaniMwanzo"
    ).value;

    const mwisho = document.getElementById(
      "talMtihaniMwisho"
    ).value;

    if (!jina || !darasa || !somo || !tarehe) {
      alert("Jaza taarifa za mtihani.");
      return;
    }

    if (mwanzo && mwisho && mwanzo >= mwisho) {
      alert("Muda wa kumaliza si sahihi.");
      return;
    }

    const ok = await saveRecord("RATIBA_MITIHANI", {

      JINA_LA_MTihANI: jina,

      MWAKA: document.getElementById(
        "talMtihaniMwaka"
      ).value,

      DARASA_ID: darasa,

      SOMO_ID: somo,

      TAREHE: tarehe,

      MUDA_KUANZA: mwanzo,

      MUDA_KUMALIZA: mwisho

    });

    if (ok) {

      alert("Ratiba ya mtihani imehifadhiwa.");

      taalumaOpen("WEKA_RATIBA_MITIHANI");
    }
  }

  /* ==============================================
     11. WEKA ALAMA
  ============================================== */

  function formAlama() {

    return `
      ${pageHeader("WEKA ALAMA")}

      <div class="taaluma-form">

        <label>MWAKA</label>

        <input
          id="talAlamaMwaka"
          type="number"
          value="${new Date().getFullYear()}">

        <label>DARASA</label>

        <select id="talAlamaDarasa">
          <option value="">CHAGUA DARASA</option>
        </select>

        <label>MTIHANI</label>

        <input
          id="talAlamaMtihani"
          type="text"
          placeholder="Jina la mtihani">

        <label>SOMO</label>

        <select id="talAlamaSomo">
          <option value="">CHAGUA SOMO</option>
        </select>

        <div id="talAlamaStudentArea">

          <label>NA. USAJILI</label>

          <input
            id="talAlamaUsajili"
            type="text">

          <label>JINA LA MWANAFUNZI</label>

          <input
            id="talAlamaJina"
            type="text">

          <label>ALAMA</label>

          <input
            id="talAlamaValue"
            type="number"
            min="0"
            max="100">

          <button
            onclick="taalumaSaveAlama()">
            HIFADHI ALAMA
          </button>

        </div>

      </div>
    `;
  }

  async function taalumaSaveAlama() {

    const mwaka = document.getElementById(
      "talAlamaMwaka"
    ).value;

    const darasa = document.getElementById(
      "talAlamaDarasa"
    ).value;

    const mtihani = document.getElementById(
      "talAlamaMtihani"
    ).value.trim();

    const somo = document.getElementById(
      "talAlamaSomo"
    ).value;

    const usajili = document.getElementById(
      "talAlamaUsajili"
    ).value.trim();

    const jina = document.getElementById(
      "talAlamaJina"
    ).value.trim();

    const alama = Number(
      document.getElementById("talAlamaValue").value
    );

    if (
      !mwaka ||
      !darasa ||
      !mtihani ||
      !somo ||
      !usajili ||
      !jina ||
      document.getElementById("talAlamaValue").value === ""
    ) {
      alert("Jaza taarifa zote.");
      return;
    }

    if (!Number.isFinite(alama) || alama < 0 || alama > 100) {
      alert("Alama lazima ziwe kati ya 0 na 100.");
      return;
    }

    const ok = await saveRecord("ALAMA", {

      MWAKA: mwaka,

      DARASA_ID: darasa,

      MTIHANI: mtihani,

      SOMO_ID: somo,

      NA_USAJILI: usajili,

      JINA: jina,

      ALAMA: alama,

      DARAJA: getGrade(alama)

    });

    if (ok) {

      alert("Alama zimehifadhiwa.");

      document.getElementById(
        "talAlamaUsajili"
      ).value = "";

      document.getElementById(
        "talAlamaJina"
      ).value = "";

      document.getElementById(
        "talAlamaValue"
      ).value = "";
    }
  }

  function getGrade(mark) {

    if (mark >= 75) return "A";
    if (mark >= 65) return "B";
    if (mark >= 45) return "C";
    if (mark >= 30) return "D";

    return "F";
  }

  /* ==============================================
     12. MATOKEO YA DARASA
  ============================================== */

  function resultsDarasa() {

    return `
      ${pageHeader("MATOKEO YA DARASA")}

      <div class="taaluma-form">

        <div class="taaluma-filters">

          <select id="resDarasaMwaka">
            <option value="">MWAKA</option>
          </select>

          <select id="resDarasaDarasa">
            <option value="">DARASA</option>
          </select>

          <select id="resDarasaMtihani">
            <option value="">MTIHANI</option>
          </select>

          <select id="resDarasaSomo">
            <option value="">SOMO</option>
          </select>

        </div>

        <button onclick="taalumaGenerateClassResults()">
          ONESHA MATOKEO
        </button>

        <div id="taalumaResultArea"></div>

      </div>
    `;
  }

  function taalumaGenerateClassResults() {

    const mwaka = document.getElementById(
      "resDarasaMwaka"
    ).value;

    const darasa = document.getElementById(
      "resDarasaDarasa"
    ).value;

    const mtihani = document.getElementById(
      "resDarasaMtihani"
    ).value;

    const somo = document.getElementById(
      "resDarasaSomo"
    ).value;

    if (!mwaka || !darasa || !mtihani || !somo) {
      alert("Chagua mwaka, darasa, mtihani na somo.");
      return;
    }

    const records = DB.alama.filter(item =>
      String(item.MWAKA) === mwaka &&
      String(item.DARASA_ID) === darasa &&
      String(item.MTIHANI || item.MTIHANI) === mtihani &&
      String(item.SOMO_ID) === somo
    );

    const rows = records.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHTML(item.NA_USAJILI)}</td>
        <td>${escapeHTML(item.JINA)}</td>
        <td>${escapeHTML(item.ALAMA)}</td>
        <td>${escapeHTML(item.DARAJA)}</td>
      </tr>
    `).join("");

    const darasaName = getClassName(darasa);

    const somoName = getSubjectName(somo);

    document.getElementById(
      "taalumaResultArea"
    ).innerHTML = `

      <div id="taalumaPrintable" class="taaluma-report">

        <h2>${escapeHTML(accountName())}</h2>

        <h3>
          MATOKEO YA MTIHANI DARASA LA
          ${escapeHTML(darasaName)}
        </h3>

        <p>
          Mwaka ${escapeHTML(mwaka)}
          — Mtihani wa ${escapeHTML(mtihani)}
        </p>

        <h4>SOMO: ${escapeHTML(somoName)}</h4>

        <table>

          <thead>
            <tr>
              <th>NA.</th>
              <th>NA. USAJILI</th>
              <th>JINA LA MWANAFUNZI</th>
              <th>ALAMA</th>
              <th>DARAJA</th>
            </tr>
          </thead>

          <tbody>
            ${rows || `
              <tr>
                <td colspan="5">
                  Hakuna matokeo yaliyopatikana.
                </td>
              </tr>
            `}
          </tbody>

        </table>

        <div class="taaluma-report-footer">

          <span>
            Imetolewa na: ${escapeHTML(currentUsername())}
          </span>

          <span>
            Tarehe: ${new Date().toLocaleDateString("sw-TZ")}
          </span>

        </div>

      </div>

      <div class="taaluma-report-buttons">

        <button onclick="taalumaPrintReport()">
          PAKUA PDF
        </button>

        <button onclick="taalumaBack()">
          RUDI
        </button>

      </div>
    `;
  }

  /* ==============================================
     13. MATOKEO YA MWANAFUNZI
  ============================================== */

  function resultsMwanafunzi() {

    return `
      ${pageHeader("MATOKEO YA MWANAFUNZI")}

      <div class="taaluma-form">

        <div class="taaluma-filters">

          <select id="resMwanafunziMwaka">
            <option value="">MWAKA</option>
          </select>

          <select id="resMwanafunziDarasa">
            <option value="">DARASA</option>
          </select>

          <select id="resMwanafunziJina">
            <option value="">JINA</option>
          </select>

          <select id="resMwanafunziMtihani">
            <option value="">MTIHANI</option>
          </select>

        </div>

        <button onclick="taalumaGenerateStudentResults()">
          ONESHA MATOKEO
        </button>

        <div id="taalumaStudentResultArea"></div>

      </div>
    `;
  }

  function taalumaGenerateStudentResults() {

    const mwaka = document.getElementById(
      "resMwanafunziMwaka"
    ).value;

    const darasa = document.getElementById(
      "resMwanafunziDarasa"
    ).value;

    const jina = document.getElementById(
      "resMwanafunziJina"
    ).value;

    const mtihani = document.getElementById(
      "resMwanafunziMtihani"
    ).value;

    if (!mwaka || !darasa || !jina || !mtihani) {
      alert("Chagua mwaka, darasa, jina na mtihani.");
      return;
    }

    const records = DB.alama.filter(item =>
      String(item.MWAKA) === mwaka &&
      String(item.DARASA_ID) === darasa &&
      String(item.JINA) === jina &&
      String(item.MTIHANI || item.MTIHANI) === mtihani
    );

    const student = records[0];

    const rows = records.map(item => `
      <tr>
        <td>${escapeHTML(getSubjectName(item.SOMO_ID))}</td>
        <td>${escapeHTML(item.ALAMA)}</td>
        <td>${escapeHTML(item.DARAJA)}</td>
      </tr>
    `).join("");

    document.getElementById(
      "taalumaStudentResultArea"
    ).innerHTML = `

      <div id="taalumaPrintable" class="taaluma-report">

        <h2>${escapeHTML(accountName())}</h2>

        <h3>
          MATOKEO YA MWANAFUNZI
          ${escapeHTML(jina)}
          DARASA LA ${escapeHTML(getClassName(darasa))}
        </h3>

        <p>
          Mtihani wa ${escapeHTML(mtihani)}
          — Mwaka ${escapeHTML(mwaka)}
        </p>

        <div class="taaluma-student-info">

          <strong>NA. USAJILI:</strong>
          ${escapeHTML(student?.NA_USAJILI || "")}

          <strong>JINA:</strong>
          ${escapeHTML(jina)}

        </div>

        <table>

          <thead>
            <tr>
              <th>SOMO</th>
              <th>ALAMA</th>
              <th>DARAJA</th>
            </tr>
          </thead>

          <tbody>

            ${rows || `
              <tr>
                <td colspan="3">
                  Hakuna matokeo yaliyopatikana.
                </td>
              </tr>
            `}

          </tbody>

        </table>

        <div class="taaluma-report-footer">

          <span>
            Imetolewa na: ${escapeHTML(currentUsername())}
          </span>

          <span>
            Tarehe: ${new Date().toLocaleDateString("sw-TZ")}
          </span>

        </div>

      </div>

      <div class="taaluma-report-buttons">

        <button onclick="taalumaPrintReport()">
          PAKUA PDF
        </button>

        <button onclick="taalumaBack()">
          HARIRI / RUDI
        </button>

      </div>
    `;
  }

  /* ==============================================
     14. PRINT / PDF
  ============================================== */

  function taalumaPrintReport() {

    const report = document.getElementById(
      "taalumaPrintable"
    );

    if (!report) return;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Ruhusu kufungua ukurasa wa PDF.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>

      <html lang="sw">

      <head>

        <meta charset="UTF-8">

        <title>MATOKEO - DSERVICES</title>

        <style>

          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            color: #111;
            margin: 0;
            font-size: 11px;
          }

          .taaluma-report {
            width: 100%;
          }

          h2, h3, h4, p {
            text-align: center;
          }

          h2 {
            font-size: 18px;
          }

          h3 {
            font-size: 14px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }

          th, td {
            border: 1px solid #333;
            padding: 7px 5px;
            text-align: center;
            overflow-wrap: anywhere;
          }

          th {
            background: #eeeeee;
          }

          tr {
            break-inside: avoid;
          }

          .taaluma-report-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            gap: 10px;
          }

          .taaluma-student-info {
            margin: 20px 0;
            display: flex;
            justify-content: space-between;
            gap: 10px;
          }

        </style>

      </head>

      <body>

        ${report.outerHTML}

        <script>
          window.onload = function() {
            window.print();
          };
        <\/script>

      </body>

      </html>
    `);

    printWindow.document.close();
  }

  /* ==============================================
     15. RATIBA VIEW
  ============================================== */

  function viewRatiba(type) {

    const title = type === "MASOMO"
      ? "RATIBA YA MASOMO"
      : "RATIBA YA MITIHANI";

    return `
      ${pageHeader(title)}

      <div class="taaluma-form">

        <label>DARASA</label>

        <select id="viewRatibaClass">
          <option value="">MADARASA YOTE</option>
        </select>

        <div id="viewRatibaTable"></div>

        <button onclick="taalumaPrintReport()">
          PAKUA
        </button>

      </div>
    `;
  }

  /* ==============================================
     16. DATA HELPERS
  ============================================== */

  function getClassName(id) {

    const item = DB.madarasa.find(
      x => x.ID === id
    );

    return item?.JINA_LA_DARASA || id;
  }

  function getSubjectName(id) {

    const item = DB.masomo.find(
      x => x.ID === id
    );

    return item?.JINA_LA_SOMO || id;
  }

  function fillSelect(id, records, valueKey, labelKey) {

    const select = document.getElementById(id);

    if (!select) return;

    const first = select.options[0]?.outerHTML || "";

    select.innerHTML = first;

    records.forEach(item => {

      const option = document.createElement("option");

      option.value = item[valueKey];

      option.textContent = item[labelKey];

      select.appendChild(option);

    });
  }

  async function loadPageData(page) {

    if (CONFIG.API_URL) {

      const result = await taalumaAPI(
        "getTaalumaData",
        { page }
      );

      if (result.success && result.data) {

        Object.keys(DB).forEach(key => {

          if (Array.isArray(result.data[key])) {
            DB[key] = result.data[key];
          }

        });

      }

    }

    fillSelect(
      "talSomoDarasa",
      DB.madarasa,
      "ID",
      "JINA_LA_DARASA"
    );

    fillSelect(
      "talJukumuDarasa",
      DB.madarasa,
      "ID",
      "JINA_LA_DARASA"
    );

    fillSelect(
      "talJukumuSomo",
      DB.masomo,
      "ID",
      "JINA_LA_SOMO"
    );

    fillSelect(
      "talRatibaDarasa",
      DB.madarasa,
      "ID",
      "JINA_LA_DARASA"
    );

    fillSelect(
      "talRatibaSomo",
      DB.masomo,
      "ID",
      "JINA_LA_SOMO"
    );

    fillSelect(
      "talMtihaniDarasa",
      DB.madarasa,
      "ID",
      "JINA_LA_DARASA"
    );

    fillSelect(
      "talMtihaniSomo",
      DB.masomo,
      "ID",
      "JINA_LA_SOMO"
    );

    fillSelect(
      "talAlamaDarasa",
      DB.madarasa,
      "ID",
      "JINA_LA_DARASA"
    );

    fillSelect(
      "talAlamaSomo",
      DB.masomo,
      "ID",
      "JINA_LA_SOMO"
    );

    fillSelect(
      "resDarasaDarasa",
      DB.madarasa,
      "ID",
      "JINA_LA_DARASA"
    );

    fillSelect(
      "resMwanafunziDarasa",
      DB.madarasa,
      "ID",
      "JINA_LA_DARASA"
    );

    fillSelect(
      "viewRatibaClass",
      DB.madarasa,
      "ID",
      "JINA_LA_DARASA"
    );

    fillResultFilters();
  }

  function fillResultFilters() {

    const years = [
      ...new Set(DB.alama.map(x => String(x.MWAKA)))
    ];

    const exams = [
      ...new Set(DB.alama.map(x => x.MTIHANI || x.MTIHANI))
    ];

    const students = [
      ...new Set(DB.alama.map(x => x.JINA))
    ];

    const subjects = [
      ...new Set(DB.alama.map(x => x.SOMO_ID))
    ];

    function options(id, values) {

      const select = document.getElementById(id);

      if (!select) return;

      values.forEach(value => {

        const option = document.createElement("option");

        option.value = value;

        option.textContent = value;

        select.appendChild(option);

      });
    }

    options("resDarasaMwaka", years);
    options("resDarasaMtihani", exams);
    options("resDarasaSomo", subjects);

    options("resMwanafunziMwaka", years);
    options("resMwanafunziMtihani", exams);
    options("resMwanafunziJina", students);
  }

  /* ==============================================
     17. CSS
  ============================================== */

  function injectStyles() {

    if (document.getElementById("taalumaStyles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "taalumaStyles";

    style.textContent = `

      .taaluma-container {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
      }

      .taaluma-heading {
        text-align: right;
        margin-bottom: 12px;
      }

      .taaluma-heading h3 {
        color: #222;
        font-size: 16px;
        margin: 0;
      }

      /* KADI KUU */
      .card-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
}

.card-actions button {
    width: 100%;
    padding: 11px 8px;
    box-sizing: border-box;
}

      .taaluma-card {
        width: 100%;
        min-width: 0;
        min-height: 76px;
        padding: 11px 8px;
        border: 1px solid #d2d2d2;
        border-radius: 8px;
        background: #eeeeee;
        color: #111;
        text-align: center;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        box-shadow: inset 0 0 5px rgba(0,0,0,.035);
      }

      .taaluma-card:active {
        background: #e2e2e2;
      }

      .taaluma-card-title {
        font-size: 13px;
        font-weight: 700;
        line-height: 1.3;
      }

      .taaluma-card-description {
        font-size: 10px;
        color: #444;
        font-weight: 400;
      }

      /* VICHWA */

      .taaluma-page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin: 20px 0 12px;
        padding-bottom: 9px;
        border-bottom: 1px solid #ccc;
      }

      .taaluma-page-header h3 {
        font-size: 15px;
        color: #222;
        margin: 0;
      }

      .taaluma-page-header button {
        padding: 8px 13px;
        background: #eeeeee;
        color: #222;
        border: 1px solid #ccc;
        border-radius: 6px;
      }

      /* FORM */

      .taaluma-form {
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 9px;
        padding: 13px;
        margin-top: 10px;
      }

      .taaluma-form label {
        display: block;
        margin-top: 13px;
        font-size: 12px;
        font-weight: bold;
        color: #222;
      }

      .taaluma-form input,
      .taaluma-form select,
      .taaluma-form textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 11px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: white;
        color: #222;
        font-size: 13px;
      }

      .taaluma-form textarea {
        min-height: 75px;
      }

      .taaluma-form > button,
      .taaluma-form button {
        padding: 11px;
        margin-top: 15px;
        border: 0;
        border-radius: 7px;
        background: #4B5320;
        color: white;
        font-weight: bold;
        cursor: pointer;
      }

      .taaluma-form > button {
        width: 100%;
      }

      /* FILTERS */

      .taaluma-filters {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
        margin-bottom: 12px;
      }

      .taaluma-filters select {
        width: 100%;
        min-width: 0;
        padding: 10px 5px;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: #fff;
        font-size: 11px;
      }

      /* REPORT */

      .taaluma-report {
        background: white;
        padding: 15px 8px;
        margin-top: 15px;
        color: #111;
        border: 1px solid #ddd;
      }

      .taaluma-report h2,
      .taaluma-report h3,
      .taaluma-report h4,
      .taaluma-report p {
        text-align: center;
      }

      .taaluma-report h2 {
        font-size: 18px;
      }

      .taaluma-report h3 {
        font-size: 14px;
      }

      .taaluma-report table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        margin-top: 15px;
      }

      .taaluma-report th,
      .taaluma-report td {
        border: 1px solid #777;
        padding: 7px 4px;
        text-align: center;
      }

      .taaluma-report th {
        background: #eee;
      }

      .taaluma-student-info {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: space-between;
        font-size: 12px;
        margin: 18px 0;
      }

      .taaluma-report-footer {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
        font-size: 11px;
        margin-top: 25px;
      }

      .taaluma-report-buttons {
        display: flex;
        gap: 10px;
        margin-top: 12px;
      }

      .taaluma-report-buttons button {
        flex: 1;
        padding: 11px;
        border: 0;
        border-radius: 6px;
        background: #4B5320;
        color: white;
        font-weight: bold;
      }

      @media(max-width:360px) {

        .taaluma-card-title {
          font-size: 11px;
        }

        .taaluma-card-description {
          font-size: 9px;
        }

        .taaluma-report table {
          font-size: 9px;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* ==============================================
     18. PUBLIC FUNCTIONS
  ============================================== */

  window.renderTaalumaPage = renderTaalumaPage;

  window.taalumaOpen = taalumaOpen;
  window.taalumaBack = taalumaBack;

  window.taalumaSaveDarasa = taalumaSaveDarasa;
  window.taalumaSaveSomo = taalumaSaveSomo;
  window.taalumaSaveJukumu = taalumaSaveJukumu;

  window.taalumaSaveRatibaMasomo =
    taalumaSaveRatibaMasomo;

  window.taalumaSaveRatibaMitihani =
    taalumaSaveRatibaMitihani;

  window.taalumaSaveAlama = taalumaSaveAlama;

  window.taalumaGenerateClassResults =
    taalumaGenerateClassResults;

  window.taalumaGenerateStudentResults =
    taalumaGenerateStudentResults;

  window.taalumaPrintReport = taalumaPrintReport;

})();
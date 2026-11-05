/* =====================================================
   DSERVICES - USIMAMIZI FEDHA
   FILE: fedha1.js
   MALIPO | MATUMIZI | HALI YA MICHANGO
===================================================== */

(function () {
  "use strict";

  const FINANCE_MENUS = [
    "MALIPO",
    "MATUMIZI",
    "HALI YA MICHANGO"
  ];

  let currentFinanceMenu = "MALIPO";
  let currentFormType = "";

  const $f = (id, root = document) =>
    root.getElementById(id);


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
/* ======================================
   DSERVICES - SHARED DASHBOARD
   TUITION | DAYCARE | NURSERY
====================================== */
function renderMuhtasariPage(workspace, data = {}) {
  if (!workspace) return;

// TAREHE YA SASA
const now = new Date(
  new Date().toLocaleString("en-US", {
    timeZone: "Africa/Dar_es_Salaam"
  })
);
const dateLabel = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric"
}).format(now);

const months = [
  "JANUARI", "FEBRUARI", "MACHI", "APRILI",
  "MEI", "JUNI", "JULAI", "AGOSTI",
  "SEPTEMBA", "OKTOBA", "NOVEMBA", "DESEMBA"
];
const currentMonth = months[now.getMonth()];
const currentYear = now.getFullYear();

const financialPeriod =
  `JANUARI - ${currentMonth} ${currentYear}`;
  // MODULE ID ZA MENU
  const MENU_IDS = {
    WATUMISHI: "MOD006",
    WANAFUNZI: "MOD007",
    MAHUDHURIO: "MOD008",
    MALIPO: "MOD010",
    MATUMIZI: "MOD011",
    HALI_YA_MICHANGO: "MOD012"
  };

  // THIBITISHA RUHUSA
  function canView(moduleId) {
    const role = String(
      currentUser?.role || currentUser?.ROLE || ""
    ).trim().toUpperCase();

    const owners = [
      "OWNER",
      "SUPER ADMIN",
      "SUPER_ADMIN",
      "MSIMAMIZI MKUU"
    ];

    if (owners.includes(role)) return true;

    const permissions = Array.isArray(currentUser?.permissions)
      ? currentUser.permissions
      : [];

    const accountId = String(
      currentUser?.accountId ||
      currentUser?.ACCOUNT_ID ||
      ""
    ).trim();

    return permissions.some(permission => {
      const getValue = key => {
        const foundKey = Object.keys(permission || {})
          .find(k => k.toUpperCase() === key.toUpperCase());

        return foundKey ? permission[foundKey] : "";
      };

      const permissionModule = String(
        getValue("MODULE_ID") || ""
      ).trim();

      const permissionAccount = String(
        getValue("ACCOUNT_ID") || ""
      ).trim();

      const view = String(
        getValue("VIEW") || ""
      ).trim().toUpperCase();

      const allowed = ["YES", "TRUE", "1", "ALLOW"];

      if (permissionModule !== moduleId) return false;

      if (
        accountId &&
        permissionAccount &&
        permissionAccount !== accountId
      ) {
        return false;
      }

      return allowed.includes(view);
    });
  }

  // RUHUSA ZA KILA SEHEMU
  const access = {
    students: canView(MENU_IDS.WANAFUNZI),
    staff: canView(MENU_IDS.WATUMISHI),
    attendance: canView(MENU_IDS.MAHUDHURIO),
    income: canView(MENU_IDS.MALIPO),
    expenses: canView(MENU_IDS.MATUMIZI),
    debt: canView(MENU_IDS.HALI_YA_MICHANGO)
  };

  const money = value => {
    if (value === undefined || value === null || value === "") {
      return "—";
    }

    const number = Number(value);

    return Number.isFinite(number)
      ? number.toLocaleString("en-US")
      : "—";
  };

  const count = value => {
    if (value === undefined || value === null || value === "") {
      return "—";
    }

    const number = Number(value);

    return Number.isFinite(number)
      ? number.toLocaleString("en-US")
      : "—";
  };

  // KADI ZA FEDHA
const card = (title, value) => `
  <div class="tuition-summary-card">
    <div class="tuition-card-title">
      ${title} <span>TSH</span>
    </div>
    <div class="tuition-card-value">
      ${value}
    </div>
  </div>
`;

  // KADI ZA MAHUDHURIO
  const attendance = (
    title,
    students,
    totalStudents,
    staff,
    totalStaff
  ) => `
    <div class="tuition-attendance-card">

      <div class="tuition-attendance-title">
        ${title}
      </div>

      <div class="tuition-attendance-row">
        <span>WANAFUNZI</span>
        <strong>
          ${count(students)} / ${count(totalStudents)}
        </strong>
      </div>

      <div class="tuition-attendance-row">
        <span>WATUMISHI</span>
        <strong>
          ${count(staff)} / ${count(totalStaff)}
        </strong>
      </div>

    </div>
  `;

  const students = data.students || {};
  const staff = data.staff || {};
  const today = data.today || {};
  const attendanceData = data.attendance || {};
  const monthly = data.monthly || {};

  let html = `<div class="tuition-dashboard">`;

  /* =====================================
     LEO - FEDHA
  ===================================== */

  const todayCards = [];

  if (access.income) {
    todayCards.push(card("MAPATO", money(today.income)));
  }

  if (access.expenses) {
    todayCards.push(card("MATUMIZI", money(today.expenses)));
  }

  if (access.debt) {
    todayCards.push(card("DENI", money(today.debt)));
  }

  if (access.income && access.expenses) {
    todayCards.push(card("SALIO", money(today.balance)));
  }

  if (todayCards.length) {
    html += `
      <section class="tuition-dashboard-section">

        <h3 class="tuition-section-heading">
  LEO TAREHE ${dateLabel}
</h3>

        <div class="tuition-today-grid">
          ${todayCards.join("")}
        </div>

      </section>
    `;
  }

  /* =====================================
     MAHUDHURIO
  ===================================== */
  if (access.attendance) {
    html += `
      <section class="tuition-dashboard-section">

        <h3 class="tuition-section-heading">
  MAHUDHURIO LEO TAREHE ${dateLabel}
        </h3>

        <div class="tuition-attendance-grid">

          ${attendance(
            "ASUBUHI",
            attendanceData.morningStudents,
            attendanceData.totalStudents,
            attendanceData.morningStaff,
            attendanceData.totalStaff
          )}

          ${attendance(
            "JIONI",
            attendanceData.eveningStudents,
            attendanceData.totalStudents,
            attendanceData.eveningStaff,
            attendanceData.totalStaff
          )}

        </div>

      </section>
    `;
  }

  /* =====================================
     WANAFUNZI NA WATUMISHI
  ===================================== */

  const peopleCards = [];

  if (access.students) {
    peopleCards.push(`
      <div class="tuition-people-card">

        <h3>WANAFUNZI</h3>

        <div class="tuition-stat-row">
          <span>Jumla</span>
          <strong>${count(students.total)}</strong>
        </div>

        <div class="tuition-stat-row">
          <span>ACTIVE</span>
          <strong>${count(students.active)}</strong>
        </div>

        <div class="tuition-stat-row">
          <span>INACTIVE</span>
          <strong>${count(students.inactive)}</strong>
        </div>

      </div>
    `);
  }

  if (access.staff) {
    peopleCards.push(`
      <div class="tuition-people-card">

        <h3>WATUMISHI ACTIVE</h3>

        <div class="tuition-stat-row">
          <span>Jumla</span>
          <strong>${count(staff.total)}</strong>
        </div>

        <div class="tuition-stat-row">
          <span>KE</span>
          <strong>${count(staff.female)}</strong>
        </div>

        <div class="tuition-stat-row">
          <span>ME</span>
          <strong>${count(staff.male)}</strong>
        </div>

      </div>
    `);
  }

  if (peopleCards.length) {
    html += `
      <section class="tuition-dashboard-section">

        <div class="tuition-people-grid">
          ${peopleCards.join("")}
        </div>

      </section>
    `;
  }

  /* =====================================
     MUHTASARI WA FEDHA
  ===================================== */

  const monthlyCards = [];

  if (access.income) {
    monthlyCards.push(
      card("MAPATO", money(monthly.income))
    );
  }

  if (access.expenses) {
    monthlyCards.push(
      card("MATUMIZI", money(monthly.expenses))
    );
  }

  if (access.debt) {
    monthlyCards.push(
      card("MADENI", money(monthly.debt))
    );
  }

  if (access.income && access.expenses) {
    monthlyCards.push(
      card("SALIO", money(monthly.balance))
    );
  }

  if (monthlyCards.length) {
    html += `
      <section class="tuition-dashboard-section">

        <h3 class="tuition-section-heading">
          MUHTASARI WA FEDHA
        </h3>

        <div class="tuition-month-label">
          ${financialPeriod}
        </div>

        <div class="tuition-month-grid">
          ${monthlyCards.join("")}
        </div>

      </section>
    `;
  }

  html += `</div>`;

  workspace.innerHTML = html;

  addTuitionDashboardStyles();
}


/* =========================================
   DASHBOARD CSS
========================================= */
function addTuitionDashboardStyles() {
  if (document.getElementById("tuitionDashboardStyles")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "tuitionDashboardStyles";

  style.textContent = `

    .tuition-dashboard {
      width: 100%;
      box-sizing: border-box;
    }

    .tuition-dashboard-section {
      margin-bottom: 20px;
      width: 100%;
    }

    .tuition-section-heading {
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 10px;
      color: var(--green, #4b5320);
    }

    .tuition-today-grid,
    .tuition-month-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
    }

    .tuition-summary-card {
  min-width: 0;
  padding: 6px 8px;
  border-radius: 9px;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
  text-align: center;

  transition: transform .2s ease,
              box-shadow .2s ease,
              border-color .2s ease;
}
.tuition-card-title {
  font-size: 11px;
  font-weight: 700;
  color: #666;
  margin-bottom: 8px;
  text-align: center;
}

.tuition-card-title span {
  font-size: 10px;
  font-weight: 600;
  color: #888;
}
.tuition-card-value {
  font-size: 19px;
  font-weight: 700;
  color: var(--green, #4b5320);
  overflow-wrap: anywhere;
  text-align: center;
}
    .tuition-attendance-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .tuition-attendance-card {
      min-width: 0;
      padding: 12px;
      border-radius: 9px;
      background: #fff;
      border: 1px solid #e5e7eb;
      box-sizing: border-box;
      transition: box-shadow .2s ease,
                  border-color .2s ease;
    }

    .tuition-attendance-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--green, #4b5320);
      margin-bottom: 10px;
    }

    .tuition-attendance-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      padding: 6px 0;
      font-size: 12px;
      border-top: 1px solid #eee;
    }

    .tuition-attendance-row strong {
      white-space: nowrap;
      color: var(--green, #4b5320);
    }

    .tuition-people-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .tuition-people-card {
      min-width: 0;
      background: #fff;
      padding: 14px;
      border: 1px solid #e5e7eb;
      border-radius: 9px;
      box-sizing: border-box;
      transition: box-shadow .2s ease,
                  border-color .2s ease;
    }

    .tuition-people-card h3 {
      font-size: 13px;
      color: var(--green, #4b5320);
      margin: 0 0 10px;
    }

    .tuition-stat-row {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 0;
      font-size: 12px;
      border-top: 1px solid #eee;
    }

    .tuition-stat-row strong {
      color: var(--green, #4b5320);
    }

    .tuition-month-label {
      font-size: 11px;
      color: #777;
      margin: -3px 0 10px;
    }

    @media (hover: hover) and (pointer: fine) {

      .tuition-summary-card:hover,
      .tuition-attendance-card:hover,
      .tuition-people-card:hover {
        transform: translateY(-2px);
        border-color: var(--orange, #f28c28);
        box-shadow: 0 3px 10px rgba(0,0,0,.07);
      }
    }

    @media (max-width: 600px) {
      .tuition-today-grid,
      .tuition-month-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
      .tuition-attendance-grid,
      .tuition-people-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
      .tuition-summary-card {
       padding: 6px 8px;
      }
      .tuition-card-value {
        font-size: 17px;
      }
      .tuition-attendance-card,
      .tuition-people-card {
        padding: 10px;
      }
    }
  `;
  document.head.appendChild(style);
}
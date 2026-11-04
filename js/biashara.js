/* =====================================
   DSERVICES - BIASHARA DASHBOARD
===================================== */

function renderBiasharaDashboard(workspace) {

  if (!workspace) return;

  workspace.innerHTML = `
    <div class="biashara-dashboard">

      <div class="biashara-kpi-grid">

        <div class="biashara-kpi">
          <div class="biashara-kpi-icon">🛒</div>
          <div class="biashara-kpi-label">MAUZO</div>
          <div class="biashara-kpi-value">TSH 0</div>
          <div class="biashara-kpi-note">
            Jumla ya mauzo
          </div>
        </div>

        <div class="biashara-kpi">
          <div class="biashara-kpi-icon">📦</div>
          <div class="biashara-kpi-label">MANUNUZI</div>
          <div class="biashara-kpi-value">TSH 0</div>
          <div class="biashara-kpi-note">
            Jumla ya manunuzi
          </div>
        </div>

        <div class="biashara-kpi">
          <div class="biashara-kpi-icon">💸</div>
          <div class="biashara-kpi-label">MATUMIZI</div>
          <div class="biashara-kpi-value">TSH 0</div>
          <div class="biashara-kpi-note">
            Jumla ya matumizi
          </div>
        </div>

        <div class="biashara-kpi">
          <div class="biashara-kpi-icon">💰</div>
          <div class="biashara-kpi-label">SALIO</div>
          <div class="biashara-kpi-value">TSH 0</div>
          <div class="biashara-kpi-note">
            Salio la biashara
          </div>
        </div>

      </div>

      <div class="biashara-section">

        <h3>MUHTASARI WA BIDHAA NA STOO</h3>

        <div class="biashara-info-grid">

          <div class="biashara-info-card">
            <span>📦</span>
            <div>
              <strong>0</strong>
              <small>Bidhaa zilizopo</small>
            </div>
          </div>

          <div class="biashara-info-card">
            <span>⚠️</span>
            <div>
              <strong>0</strong>
              <small>Bidhaa zinazoisha</small>
            </div>
          </div>

          <div class="biashara-info-card">
            <span>❌</span>
            <div>
              <strong>0</strong>
              <small>Bidhaa zilizoisha</small>
            </div>
          </div>

        </div>

      </div>

      <div class="biashara-section">

        <h3>ODA</h3>

        <div class="biashara-info-grid">

          <div class="biashara-info-card">
            <span>📋</span>
            <div>
              <strong>0</strong>
              <small>Oda zote</small>
            </div>
          </div>

          <div class="biashara-info-card">
            <span>⏳</span>
            <div>
              <strong>0</strong>
              <small>Oda zinazosubiri</small>
            </div>
          </div>

          <div class="biashara-info-card">
            <span>✅</span>
            <div>
              <strong>0</strong>
              <small>Oda zilizokamilika</small>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;

  if (!document.getElementById("biasharaDashboardStyles")) {

    const style = document.createElement("style");

    style.id = "biasharaDashboardStyles";

    style.textContent = `

      .biashara-dashboard {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .biashara-kpi-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .biashara-kpi {
        background: #fff;
        border-radius: 12px;
        padding: 16px;
        border: 1px solid #e5e7eb;
        border-left: 4px solid var(--green, #4b5320);
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      }

      .biashara-kpi-icon {
        font-size: 23px;
        margin-bottom: 8px;
      }

      .biashara-kpi-label {
        font-size: 12px;
        font-weight: 700;
        color: #555;
      }

      .biashara-kpi-value {
        font-size: 19px;
        font-weight: 800;
        color: var(--green, #4b5320);
        margin-top: 7px;
      }

      .biashara-kpi-note {
        font-size: 11px;
        color: #777;
        margin-top: 5px;
      }

      .biashara-section {
        background: #fff;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      }

      .biashara-section h3 {
        font-size: 14px;
        color: var(--green, #4b5320);
        margin: 0 0 14px;
        border-bottom: 2px solid var(--orange, #f28c28);
        padding-bottom: 9px;
      }

      .biashara-info-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      .biashara-info-card {
        background: #f4f6f8;
        padding: 12px 8px;
        border-radius: 9px;
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      .biashara-info-card span {
        font-size: 20px;
      }

      .biashara-info-card strong {
        display: block;
        font-size: 17px;
        color: var(--green, #4b5320);
      }

      .biashara-info-card small {
        font-size: 10px;
        color: #666;
      }

      @media (max-width: 380px) {
        .biashara-info-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

    `;

    document.head.appendChild(style);
  }
}
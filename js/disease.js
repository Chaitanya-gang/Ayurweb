/* ==========================================================================
   AYURWEB - Signature Disease Detail Controller (js/disease.js)
   ========================================================================== */

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  const btns = document.querySelectorAll(".section-nav-btn");

  btns.forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`[onclick="scrollToSection('${sectionId}')"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

let globalSourcesStore = [];

async function loadSourcesDatabase() {
  if (globalSourcesStore.length > 0) return globalSourcesStore;
  try {
    let resp;
    try {
      resp = await fetch("data/sources.json");
      if (!resp.ok) throw new Error();
    } catch (e) {
      resp = await fetch("../data/sources.json");
    }
    globalSourcesStore = await resp.json();
    return globalSourcesStore;
  } catch (err) {
    console.warn("Could not load sources database:", err);
    return [];
  }
}

async function renderDiseaseTemplate() {
  const urlParams = new URLSearchParams(window.location.search);
  const diseaseId = urlParams.get("id") || "fever";

  try {
    let resp;
    try {
      resp = await fetch("data/diseases.json");
      if (!resp.ok) throw new Error();
    } catch (e) {
      resp = await fetch("../data/diseases.json");
    }
    const db = await resp.json();
    const disease = db.find(d => d.id === diseaseId) || db.find(d => d.id === "fever");

    if (!disease) {
      console.error("Disease not found in database.");
      return;
    }

    const sourcesDb = await loadSourcesDatabase();

    // Page Title & Header
    document.title = `AYURWEB - ${disease.name} (${disease.traditionalName}) Information`;

    const titleEl = document.getElementById("diseaseNameTitle");
    if (titleEl) titleEl.innerText = `${disease.name} (${disease.traditionalName})`;

    const overviewEl = document.getElementById("diseaseOverviewText");
    if (overviewEl) overviewEl.innerText = disease.overview;

    // At a Glance Cards
    const glanceCategoryEl = document.getElementById("glanceCategory");
    if (glanceCategoryEl) glanceCategoryEl.innerText = disease.category.toUpperCase();

    const glanceDoshaEl = document.getElementById("glanceDosha");
    if (glanceDoshaEl) glanceDoshaEl.innerText = `${disease.dosha} Dosha Balance`;

    const glanceSeverityEl = document.getElementById("glanceSeverity");
    if (glanceSeverityEl) {
      glanceSeverityEl.className = `severity-chip severity-${disease.severity}`;
      glanceSeverityEl.innerText = disease.severityText;
    }

    // Tailored Emergency Notice Banner
    const emergencyBanner = document.getElementById("emergencyNoticeBanner");
    const emergencyTextEl = document.getElementById("emergencyNoticeText");
    const emergencyBtnEl = document.getElementById("emergencyNoticeAction");

    if (emergencyBanner) {
      if (disease.emergency && disease.emergency.required === true) {
        emergencyBanner.style.display = "flex";
        if (emergencyTextEl) emergencyTextEl.innerText = disease.emergency.notice;
        if (emergencyBtnEl && disease.emergency.action) {
          emergencyBtnEl.innerText = disease.emergency.action;
        }
      } else {
        emergencyBanner.style.display = "none";
      }
    }

    // Section 1: Symptoms
    const symptomsList = document.getElementById("symptomsList");
    if (symptomsList && disease.symptoms) {
      symptomsList.innerHTML = disease.symptoms.map(s => `<li>${s}</li>`).join("");
    }

    // Section 2: High-Visibility Warning Signs
    const warningList = document.getElementById("warningSignsList");
    if (warningList && disease.warningSigns) {
      warningList.innerHTML = disease.warningSigns.map(w => `<li>${w}</li>`).join("");
    }

    // Section 3: Self-Care Cards
    const selfCareList = document.getElementById("selfCareContainer");
    if (selfCareList && disease.selfCare) {
      selfCareList.innerHTML = disease.selfCare.map(sc => `
        <div class="flow-step-card">
          <h4 style="color: var(--primary-dark); font-weight: 700; margin-bottom: 6px;">
            <i class="fas fa-heartbeat text-success me-1"></i> Supportive Practice
          </h4>
          <p class="text-secondary" style="font-size: 0.9rem;">${sc}</p>
        </div>
      `).join("");
    }

    // Section 4: Ayurvedic Approaches (Rich Object Cards)
    const ayurContainer = document.getElementById("ayurvedicApproachesContainer");
    if (ayurContainer && disease.ayurvedicApproaches) {
      ayurContainer.innerHTML = disease.ayurvedicApproaches.map(item => {
        if (typeof item === 'object') {
          return `
            <div class="source-card mb-3">
              <div class="approach-card-header">
                <h4 class="approach-title">
                  <i class="fas fa-seedling text-success me-1"></i> ${item.name}
                </h4>
                <span class="remedy-tag">${item.type.replace('_', ' ').toUpperCase()}</span>
              </div>
              <p class="approach-purpose"><strong>Purpose:</strong> ${item.purpose}</p>
              <div class="approach-safety-note">
                <span><i class="fas fa-shield-alt text-info me-1"></i> Safety: ${item.safety}</span>
              </div>
            </div>
          `;
        }
        return `<div class="source-card"><li>${item}</li></div>`;
      }).join("");
    }

    // Section 5: Diet & Lifestyle
    const dietList = document.getElementById("dietList");
    if (dietList && disease.diet) {
      dietList.innerHTML = disease.diet.map(d => `<li>${d}</li>`).join("");
    }

    const yogaList = document.getElementById("yogaList");
    if (yogaList && disease.yoga) {
      yogaList.innerHTML = disease.yoga.map(y => `<li>${y}</li>`).join("");
    }

    // Section 6: Evidence Lens & Safety Breakdown
    const whenToSeekEl = document.getElementById("whenToSeekHelpText");
    if (whenToSeekEl) whenToSeekEl.innerText = disease.whenToSeekHelp || "Consult a doctor if symptoms persist.";

    const safetyContainer = document.getElementById("safetyStructuredContainer");
    if (safetyContainer && disease.safety) {
      const s = disease.safety;
      safetyContainer.innerHTML = `
        <div class="mb-3">
          <span class="severity-chip severity-yellow mb-2"><i class="fas fa-microscope me-1"></i> Evidence Level: ${s.evidenceLevel.toUpperCase()}</span>
          <p class="text-secondary" style="margin-top: 6px;">${s.notes}</p>
        </div>
        <div class="form-grid">
          <div>
            <strong class="text-warning"><i class="fas fa-exclamation-circle me-1"></i> Known Considerations & Risks:</strong>
            <ul class="text-secondary" style="padding-left: 18px; margin-top: 6px; font-size: 0.9rem;">
              ${s.knownRisks.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>
          <div>
            <strong class="text-danger"><i class="fas fa-ban me-1"></i> Contraindications:</strong>
            <ul class="text-secondary" style="padding-left: 18px; margin-top: 6px; font-size: 0.9rem;">
              ${s.contraindications.map(c => `<li>${c}</li>`).join("")}
            </ul>
          </div>
        </div>
      `;
    }

    // Section 7: Sources & References Citations
    const sourcesContainer = document.getElementById("sourcesCitationsList");
    if (sourcesContainer && disease.sources) {
      const matchedSources = disease.sources.map(srcId => sourcesDb.find(s => s.id === srcId)).filter(Boolean);
      if (matchedSources.length > 0) {
        sourcesContainer.innerHTML = matchedSources.map(src => `
          <div class="source-card">
            <div class="source-card-header">
              <strong class="source-org-title"><i class="fas fa-bookmark me-1 text-success"></i> ${src.organization}</strong>
              <span class="remedy-tag">${src.type}</span>
            </div>
            <p class="text-secondary" style="font-size: 0.88rem; margin-top: 4px;">
              <a href="${src.url}" target="_blank" rel="noopener" class="source-link">${src.title} <i class="fas fa-external-link-alt ms-1" style="font-size: 0.75rem;"></i></a>
            </p>
          </div>
        `).join("");
      } else {
        sourcesContainer.innerHTML = `<p class="text-muted" style="font-size: 0.9rem;">Traditional literature references.</p>`;
      }
    }

  } catch (err) {
    console.error("Error loading disease details:", err);
  }
}

document.addEventListener("DOMContentLoaded", renderDiseaseTemplate);

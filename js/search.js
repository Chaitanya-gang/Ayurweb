/* ==========================================================================
   AYURWEB - Unified Single Source of Truth Search Engine (js/search.js)
   ========================================================================== */

let diseasesDataStore = [];

async function loadSearchDatabase() {
  if (diseasesDataStore.length > 0) return diseasesDataStore;
  try {
    let resp;
    try {
      resp = await fetch("data/diseases.json");
      if (!resp.ok) throw new Error();
    } catch (e) {
      resp = await fetch("../data/diseases.json");
    }
    diseasesDataStore = await resp.json();
    return diseasesDataStore;
  } catch (err) {
    console.error("Failed to load single source of truth database:", err);
    return [];
  }
}

async function handleSearchInput() {
  const inputEl = document.getElementById("searchInput");
  const suggBox = document.getElementById("suggestionsDropdown");
  if (!inputEl || !suggBox) return;

  const query = inputEl.value.trim().toLowerCase();
  if (query === "") {
    suggBox.style.display = "none";
    suggBox.innerHTML = "";
    return;
  }

  const db = await loadSearchDatabase();
  const matches = db.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(query);
    const tradMatch = item.traditionalName && item.traditionalName.toLowerCase().includes(query);
    const synMatch = item.synonyms && item.synonyms.some(s => s.toLowerCase().includes(query));
    const catMatch = item.category && item.category.toLowerCase().includes(query);
    const doshaMatch = item.dosha && item.dosha.toLowerCase().includes(query);
    const symptomMatch = item.symptoms && item.symptoms.some(s => s.toLowerCase().includes(query));
    return nameMatch || tradMatch || synMatch || catMatch || doshaMatch || symptomMatch;
  });

  suggBox.innerHTML = "";
  if (matches.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.innerHTML = `<span class="sugg-name">No matching health topic found</span><span class="sugg-synonyms">Try searching "fever", "rabies", "cough", "acidity", "pitta"</span>`;
    suggBox.appendChild(emptyLi);
  } else {
    const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
    matches.slice(0, 6).forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="sugg-item-row">
          <span class="sugg-name"><i class="fas ${item.icon || 'fa-leaf'} me-2"></i> ${item.name} (${item.traditionalName})</span>
          <span class="severity-chip severity-${item.severity}">${item.severityText}</span>
        </div>
        <span class="sugg-synonyms">${item.dosha} • Category: ${item.category.toUpperCase()} • Synonyms: ${item.synonyms ? item.synonyms.slice(0, 3).join(", ") : ''}</span>
      `;
      li.addEventListener("click", () => {
        inputEl.value = item.name;
        suggBox.style.display = "none";
        window.location.href = `${prefix}disease.html?id=${item.id}`;
      });
      suggBox.appendChild(li);
    });
  }
  suggBox.style.display = "block";
}

async function searchRemedy() {
  const inputEl = document.getElementById("searchInput");
  if (!inputEl) return;
  const query = inputEl.value.trim().toLowerCase();

  if (!query) {
    alert("Please enter a health concern or condition name.");
    return;
  }

  const db = await loadSearchDatabase();
  const found = db.find(d => 
    d.name.toLowerCase().includes(query) || 
    (d.traditionalName && d.traditionalName.toLowerCase().includes(query)) ||
    (d.synonyms && d.synonyms.some(s => s.toLowerCase().includes(query)))
  );

  const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
  if (found) {
    window.location.href = `${prefix}disease.html?id=${found.id}`;
  } else {
    alert(`No specific health topic found for "${query}". Try searching "fever", "cough", "rabies", "diabetes".`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchRemedy();
    });
  }

  document.addEventListener("click", (e) => {
    const suggBox = document.getElementById("suggestionsDropdown");
    const searchCard = document.querySelector(".search-card");
    if (suggBox && searchCard && !searchCard.contains(e.target)) {
      suggBox.style.display = "none";
    }
  });
});

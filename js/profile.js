/* ==========================================================================
   AYURWEB - Wellness Profile Controller & Summary Dashboard (js/profile.js)
   ========================================================================== */

function handleFormSubmit(e) {
  if (e) e.preventDefault();

  const nameEl = document.getElementById('patientName');
  const ageEl = document.getElementById('patientAge');
  const genderEl = document.getElementById('patientGender');
  const phoneEl = document.getElementById('patientPhone');
  const ailmentEl = document.getElementById('primaryAilment');
  const symptomsEl = document.getElementById('symptomDetails');
  const dietEl = document.getElementById('dietType');
  const agniEl = document.getElementById('agniQuality');

  if (!nameEl || !phoneEl || !symptomsEl) return;

  const profileData = {
    name: nameEl.value.trim(),
    age: ageEl ? ageEl.value : '',
    gender: genderEl ? genderEl.value : '',
    phone: phoneEl.value.trim(),
    ailment: ailmentEl ? ailmentEl.value : '',
    symptoms: symptomsEl.value.trim(),
    diet: dietEl ? dietEl.value : '',
    agni: agniEl ? agniEl.value : '',
    updatedAt: new Date().toISOString()
  };

  // Save locally in localStorage
  try {
    localStorage.setItem("ayurweb_wellness_profile", JSON.stringify(profileData));
  } catch (err) {
    console.warn("Could not save profile to localStorage:", err);
  }

  // Save to user-isolated Firestore doc /users/{uid}/profile/main
  if (typeof db !== 'undefined' && db && typeof currentAuthUid !== 'undefined' && currentAuthUid) {
    db.collection('users').doc(currentAuthUid).collection('profile').doc('main').set(profileData, { merge: true }).then(() => {
      renderSummaryCard(profileData);
    }).catch(err => {
      renderSummaryCard(profileData);
    });
  } else {
    renderSummaryCard(profileData);
  }
}

function renderSummaryCard(data) {
  const form = document.getElementById("userInfoForm");
  const summaryView = document.getElementById("profileSummaryView");
  const nameSummary = document.getElementById("savedSummaryName");
  const detailsSummary = document.getElementById("savedSummaryDetails");

  if (form) form.style.display = "none";
  if (summaryView) summaryView.style.display = "block";

  if (nameSummary) nameSummary.innerText = `Namaste, ${data.name} (${data.age} yrs, ${data.gender})`;
  if (detailsSummary) {
    detailsSummary.innerHTML = `
      <strong>Primary Focus:</strong> ${data.ailment}<br>
      <strong>Diet & Digestion:</strong> ${data.diet} • ${data.agni}<br>
      <strong>Notes:</strong> ${data.symptoms}
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('userInfoForm');
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  // Pre-fill fields from localStorage if available
  try {
    const saved = localStorage.getItem("ayurweb_wellness_profile");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.name && document.getElementById('patientName')) document.getElementById('patientName').value = data.name;
      if (data.age && document.getElementById('patientAge')) document.getElementById('patientAge').value = data.age;
      if (data.gender && document.getElementById('patientGender')) document.getElementById('patientGender').value = data.gender;
      if (data.phone && document.getElementById('patientPhone')) document.getElementById('patientPhone').value = data.phone;
      if (data.ailment && document.getElementById('primaryAilment')) document.getElementById('primaryAilment').value = data.ailment;
      if (data.symptoms && document.getElementById('symptomDetails')) document.getElementById('symptomDetails').value = data.symptoms;
      if (data.diet && document.getElementById('dietType')) document.getElementById('dietType').value = data.diet;
      if (data.agni && document.getElementById('agniQuality')) document.getElementById('agniQuality').value = data.agni;
    }
  } catch (err) {
    // Ignore pre-fill errors
  }
});

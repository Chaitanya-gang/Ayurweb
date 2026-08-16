/* ==========================================================================
   AYURWEB - Prakriti (Dosha) Quiz Engine Module (js/quiz.js)
   ========================================================================== */

const quizQuestions = [
  {
    question: "1. How would you describe your physical frame & build?",
    options: [
      { text: "Light, slender, thin bone structure (Vata)", type: "vata" },
      { text: "Medium build, muscular, moderate weight (Pitta)", type: "pitta" },
      { text: "Solid, heavy, broad frame, gains weight easily (Kapha)", type: "kapha" }
    ]
  },
  {
    question: "2. How is your typical appetite & digestion?",
    options: [
      { text: "Irregular, variable appetite, prone to gas/bloating (Vata)", type: "vata" },
      { text: "Strong, intense appetite, cannot skip meals (Pitta)", type: "pitta" },
      { text: "Slow, steady appetite, can comfortably skip meals (Kapha)", type: "kapha" }
    ]
  },
  {
    question: "3. What is your sleep quality like?",
    options: [
      { text: "Light, restless sleeper, tend to wake up easily (Vata)", type: "vata" },
      { text: "Moderate, sound sleep, occasionally wake up warm (Pitta)", type: "pitta" },
      { text: "Deep, heavy sleep, hard to get out of bed (Kapha)", type: "kapha" }
    ]
  },
  {
    question: "4. How do you react to weather & climate?",
    options: [
      { text: "Averse to cold, wind, and dry weather (Vata)", type: "vata" },
      { text: "Averse to heat, sun, and hot humid weather (Pitta)", type: "pitta" },
      { text: "Averse to damp, cold, cloudy weather (Kapha)", type: "kapha" }
    ]
  },
  {
    question: "5. How do you process stress & emotions?",
    options: [
      { text: "Anxious, worry quickly, mind gets restless (Vata)", type: "vata" },
      { text: "Irritable, impatient, intense or sharp reactions (Pitta)", type: "pitta" },
      { text: "Calm, slow to react, peaceful but resistant to change (Kapha)", type: "kapha" }
    ]
  }
];

let quizCurrentIndex = 0;
let quizAnswers = [];

function renderQuizQuestion() {
  const box = document.getElementById("quizQuestionBox");
  const fill = document.getElementById("quizProgressFill");
  if (!box) return;

  const q = quizQuestions[quizCurrentIndex];
  if (fill) {
    const pct = ((quizCurrentIndex + 1) / quizQuestions.length) * 100;
    fill.style.width = pct + "%";
  }

  let optionsHtml = q.options.map((opt) => `
    <button type="button" class="quiz-option-btn ${quizAnswers[quizCurrentIndex] === opt.type ? 'selected' : ''}" onclick="selectQuizOption('${opt.type}')">
      <i class="far ${quizAnswers[quizCurrentIndex] === opt.type ? 'fa-check-circle' : 'fa-circle'} me-2"></i>
      ${opt.text}
    </button>
  `).join("");

  box.innerHTML = `
    <div class="quiz-question-title">${q.question}</div>
    <div class="quiz-options-list">${optionsHtml}</div>
  `;

  const prevBtn = document.getElementById("quizPrevBtn");
  const nextBtn = document.getElementById("quizNextBtn");
  if (prevBtn) prevBtn.style.display = quizCurrentIndex > 0 ? "inline-flex" : "none";
  if (nextBtn) nextBtn.innerText = quizCurrentIndex === quizQuestions.length - 1 ? "Get Wellness Profile" : "Next Question";
}

function selectQuizOption(type) {
  quizAnswers[quizCurrentIndex] = type;
  renderQuizQuestion();
}

function prevQuizQuestion() {
  if (quizCurrentIndex > 0) {
    quizCurrentIndex--;
    renderQuizQuestion();
  }
}

function nextQuizQuestion() {
  if (!quizAnswers[quizCurrentIndex]) {
    alert("Please select an option before proceeding.");
    return;
  }
  if (quizCurrentIndex < quizQuestions.length - 1) {
    quizCurrentIndex++;
    renderQuizQuestion();
  } else {
    calculateQuizResult();
  }
}

function calculateQuizResult() {
  let vataCount = quizAnswers.filter(a => a === "vata").length;
  let pittaCount = quizAnswers.filter(a => a === "pitta").length;
  let kaphaCount = quizAnswers.filter(a => a === "kapha").length;
  let total = quizAnswers.length;

  let vataPct = Math.round((vataCount / total) * 100);
  let pittaPct = Math.round((pittaCount / total) * 100);
  let kaphaPct = Math.round((kaphaCount / total) * 100);

  let dominant = "Vata";
  let maxVal = vataCount;
  let advice = "Your dominant Vata constitution thrives on warm, nourishing foods, gentle routines, hydration, and grounding practices like yoga and warm sesame oil massage.";

  if (pittaCount > maxVal) {
    dominant = "Pitta";
    maxVal = pittaCount;
    advice = "Your dominant Pitta constitution thrives on cooling herbal teas (mint, coriander), sweet and bitter foods, stress management, and avoiding excessive spices.";
  }
  if (kaphaCount > maxVal) {
    dominant = "Kapha";
    advice = "Your dominant Kapha constitution thrives on warm, pungent spices (ginger, pepper), active daily exercise, light meals, and invigorating routines.";
  }

  document.getElementById("quizQuestionContainer").style.display = "none";
  const resBox = document.getElementById("quizResultContainer");
  if (resBox) {
    resBox.style.display = "block";
    resBox.innerHTML = `
      <div style="font-size: 3rem; color: var(--primary); margin-bottom: 12px;"><i class="fas fa-seedling"></i></div>
      <h3 style="font-size: 1.8rem; color: var(--primary-dark); font-weight: 700; margin-bottom: 8px;">Your Dominant Dosha: ${dominant}</h3>
      <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 16px;">${advice}</p>

      <div class="dosha-score-bars">
        <div class="dosha-bar-item">
          <div class="dosha-bar-info"><span>Vata (Air & Ether)</span><span>${vataPct}%</span></div>
          <div class="dosha-bar-track"><div class="dosha-bar-fill-vata" style="width: ${vataPct}%"></div></div>
        </div>
        <div class="dosha-bar-item">
          <div class="dosha-bar-info"><span>Pitta (Fire & Water)</span><span>${pittaPct}%</span></div>
          <div class="dosha-bar-track"><div class="dosha-bar-fill-pitta" style="width: ${pittaPct}%"></div></div>
        </div>
        <div class="dosha-bar-item">
          <div class="dosha-bar-info"><span>Kapha (Earth & Water)</span><span>${kaphaPct}%</span></div>
          <div class="dosha-bar-track"><div class="dosha-bar-fill-kapha" style="width: ${kaphaPct}%"></div></div>
        </div>
      </div>

      <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 16px; padding: 10px; background: rgba(0,0,0,0.04); border-radius: var(--radius-sm);">
        <i class="fas fa-info-circle me-1"></i> <strong>Educational Disclaimer:</strong> This self-assessment is based on traditional Ayurvedic concepts and is intended for health education and wellness guidance. It is not a clinical or medical diagnosis.
      </div>

      <button type="button" class="btn-custom btn-primary-custom mt-3" onclick="resetQuiz()"><i class="fas fa-redo me-2"></i> Retake Wellness Self-Assessment</button>
    `;
  }
}

function resetQuiz() {
  quizCurrentIndex = 0;
  quizAnswers = [];
  document.getElementById("quizQuestionContainer").style.display = "block";
  document.getElementById("quizResultContainer").style.display = "none";
  renderQuizQuestion();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("quizQuestionBox")) {
    renderQuizQuestion();
  }
});

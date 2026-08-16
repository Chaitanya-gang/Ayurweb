/* ==========================================================================
   AYURWEB - Chatbot Assistant Component Module (js/chatbot.js)
   ========================================================================== */

function toggleChat() {
  const windowEl = document.getElementById("chatbotWindow");
  if (windowEl) windowEl.classList.toggle("active");
}

function sendChatMessage(presetText) {
  const inputEl = document.getElementById("chatInputField");
  const messagesBox = document.getElementById("chatMessagesBody");
  if (!messagesBox) return;

  const text = presetText || (inputEl ? inputEl.value.trim() : "");
  if (!text) return;

  if (inputEl) inputEl.value = "";

  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble chat-bubble-user";
  userBubble.innerText = text;
  messagesBox.appendChild(userBubble);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  setTimeout(() => {
    const lower = text.toLowerCase();
    const prefix = window.location.pathname.includes('/pages/') ? '../' : '';

    let reply = "Namaste! I am your Ayurvedic Health Education Assistant. Ask me about remedies for fever, rabies, cough, acidity, back pain, diabetes, joint pain, or take our Tridosha guide!";
    let linkBtnHtml = "";

    if (lower.includes("rabies") || lower.includes("bite") || lower.includes("dog") || lower.includes("snake") || lower.includes("emergency")) {
      reply = "🔴 <strong>URGENT EMERGENCY NOTICE</strong>: Animal bites & Rabies carry severe risks. <strong>Immediate anti-rabies vaccination (PEP) & hospital ER care is mandatory</strong>. Wash wound under running water with soap for 15 minutes immediately!";
      linkBtnHtml = `<a href="${prefix}disease.html?id=rabies" class="chat-link-btn"><i class="fas fa-exclamation-triangle me-1"></i> View Emergency Rabies Page →</a>`;
    } else if (lower.includes("fever") || lower.includes("jwara") || lower.includes("heat")) {
      reply = "🌿 <strong>Fever (Jwara) Supportive Care</strong>: Drink warm Tulsi & Ginger tea, sip coriander seed decoction, and take bed rest. Seek medical evaluation if fever exceeds 39°C (102°F).";
      linkBtnHtml = `<a href="${prefix}disease.html?id=fever" class="chat-link-btn"><i class="fas fa-thermometer-half me-1"></i> Explore Fever Details →</a>`;
    } else if (lower.includes("cough") || lower.includes("cold") || lower.includes("kasa")) {
      reply = "🍵 <strong>Cough & Cold (Kasa) Supportive Care</strong>: Sitopaladi churna with honey, warm turmeric milk at night, and eucalyptus steam inhalation.";
      linkBtnHtml = `<a href="${prefix}disease.html?id=cold-and-cough" class="chat-link-btn"><i class="fas fa-head-side-cough me-1"></i> Explore Cough Remedies →</a>`;
    } else if (lower.includes("acid") || lower.includes("heartburn") || lower.includes("amlapitta")) {
      reply = "🌱 <strong>Acidity (Amlapitta) Supportive Care</strong>: Drink fresh coconut water, cool milk with cardamom, and avoid spicy or fried meals.";
      linkBtnHtml = `<a href="${prefix}disease.html?id=acidity" class="chat-link-btn"><i class="fas fa-fire me-1"></i> View Acidity Guidelines →</a>`;
    } else if (lower.includes("pain") || lower.includes("joint") || lower.includes("back") || lower.includes("knee")) {
      reply = "💆 <strong>Joint & Muscular Care</strong>: Apply warm Sesame oil or Mahanarayana oil massage, practice gentle stretching, and drink warm ginger tea.";
      linkBtnHtml = `<a href="${prefix}disease.html?id=joint-pain" class="chat-link-btn"><i class="fas fa-bone me-1"></i> View Joint Care →</a>`;
    } else if (lower.includes("sugar") || lower.includes("diabetes") || lower.includes("prameha")) {
      reply = "🩺 <strong>Diabetes (Prameha) Supportive Care</strong>: Bitter gourd (Karela), Amla, Fenugreek seeds (Methi), and regular physical exercise.";
      linkBtnHtml = `<a href="${prefix}disease.html?id=diabetes" class="chat-link-btn"><i class="fas fa-tint me-1"></i> View Diabetes Details →</a>`;
    } else if (lower.includes("dosha") || lower.includes("vata") || lower.includes("pitta") || lower.includes("kapha") || lower.includes("quiz") || lower.includes("guide")) {
      reply = "🧘 <strong>Ayurvedic Tridosha Principles</strong>: Learn about Vata (Air), Pitta (Fire), and Kapha (Earth) dosha balances and daily routine (Dinacharya).";
      linkBtnHtml = `<a href="${prefix}pages/guide.html" class="chat-link-btn"><i class="fas fa-book-medical me-1"></i> Open Ayurveda Guide →</a>`;
    } else if (lower.includes("profile") || lower.includes("goal") || lower.includes("diet")) {
      reply = "👤 <strong>Wellness Profile & Personalization</strong>: Log your digestion quality (Agni), dietary preferences, and track personal health goals.";
      linkBtnHtml = `<a href="${prefix}pages/profile.html" class="chat-link-btn"><i class="fas fa-id-card me-1"></i> Open Wellness Profile →</a>`;
    }

    const botBubble = document.createElement("div");
    botBubble.className = "chat-bubble chat-bubble-bot";
    botBubble.innerHTML = reply + (linkBtnHtml ? `<br>${linkBtnHtml}` : "");
    messagesBox.appendChild(botBubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }, 500);
}

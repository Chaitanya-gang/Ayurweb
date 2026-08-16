/* ==========================================================================
   AYURWEB - Theme Controller Module (js/theme.js)
   ========================================================================== */

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  localStorage.setItem("ayurweb_darkmode", isDark ? "enabled" : "disabled");
  
  const icon = document.getElementById("themeToggleIcon");
  if (icon) {
    icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  }
}

function initTheme() {
  const saved = localStorage.getItem("ayurweb_darkmode");
  if (saved === "enabled") {
    document.body.classList.add("dark-mode");
    const icon = document.getElementById("themeToggleIcon");
    if (icon) icon.className = "fas fa-sun";
  }
}

document.addEventListener("DOMContentLoaded", initTheme);

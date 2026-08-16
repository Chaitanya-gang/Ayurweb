/* ==========================================================================
   AYURWEB - Central Application Coordinator (js/app.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌿 AYURWEB System Initialized");

  // Highlight active link in top navbar and sidebar based on current window location
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  const navLinks = document.querySelectorAll('.nav-links a, .sidebar-nav-list a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === pageName || (pageName === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
});

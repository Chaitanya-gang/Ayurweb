/* ==========================================================================
   AYURWEB - Navigation & Sticky Scroll Header Controller (js/navigation.js)
   ========================================================================== */

function openNav() {
  const drawer = document.getElementById("sidebarDrawer");
  const overlay = document.getElementById("sidebarOverlay");
  if (drawer) drawer.classList.add("active");
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeNav() {
  const drawer = document.getElementById("sidebarDrawer");
  const overlay = document.getElementById("sidebarOverlay");
  if (drawer) drawer.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function handleNavbarScroll() {
  const navbar = document.querySelector(".navbar-custom");
  if (!navbar) return;
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
});

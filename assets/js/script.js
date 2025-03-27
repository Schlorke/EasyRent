const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

// Ao clicar no hamburger, alterna as classes 'active'
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

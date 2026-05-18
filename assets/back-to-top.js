(function () {
  if (document.querySelector(".back-to-top")) return;

  const button = document.createElement("button");
  button.className = "back-to-top";
  button.type = "button";
  button.textContent = "Top";
  button.setAttribute("aria-label", "Back to top");

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.body.appendChild(button);
  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });

  function updateVisibility() {
    button.classList.toggle("is-visible", window.scrollY > 420);
  }
})();

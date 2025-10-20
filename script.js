window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  setTimeout(() => {
    loader.classList.add("fade-out");

    // Remove do DOM completamente após o fade
    setTimeout(() => {
      loader.remove();
    }, 1000); // tempo igual ao da transição de fade
  }, 3000);
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tot-form");
  const thanks = document.getElementById("tot-thanks");
  const summary = document.getElementById("tot-summary");

  if (!form || !thanks || !summary) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const pairs = [
      { name: "dinner", label: "Kolacja na start" },
      { name: "drink", label: "Napój ratunkowy" },
      { name: "gummies", label: "Słodycze" },
      { name: "chips", label: "Chrupanie" },
      { name: "choco", label: "Czekoladowy deser" },
      { name: "evening", label: "Wieczorny chill" },
    ];

    const summaryImages = document.createElement("div");
    summaryImages.className = "tot-summary__images";

    pairs.forEach(({ name }) => {
      const selected = formData.get(name);
      if (!selected) {
        return;
      }
      const img = document.createElement("img");
      img.src = `this_or_that/${selected}.png`;
      img.alt = `Wybrano: ${selected}`;
      summaryImages.appendChild(img);
    });

    summary.textContent = "";
    const summaryTitle = document.createElement("p");
    summaryTitle.textContent = "Twój zestaw na wieczór:";
    summaryTitle.style.letterSpacing = "0.08em";
    summaryTitle.style.textTransform = "uppercase";
    summary.appendChild(summaryTitle);
    summary.appendChild(summaryImages);

    form.setAttribute("hidden", "hidden");
    thanks.hidden = false;
    thanks.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

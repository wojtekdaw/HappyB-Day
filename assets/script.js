const normalizeAnswer = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_.-]/g, "");

const pickMessage = () => {
  const messages = [
    "To tylko fałszywy trop. Zobacz zagadkę powyżej!",
    "Jeszcze nie tym razem. Spróbuj odczytać wskazówki.",
    "Schodki prowadzą donikąd. Hasło jest bliżej, niż myślisz.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".puzzle-form").forEach((form) => {
    const rawAnswers = form.dataset.answer || "";
    const answers = rawAnswers
      .split("|")
      .map(normalizeAnswer)
      .filter(Boolean);
    const input = form.querySelector("input");
    const feedback = form.querySelector(".puzzle-feedback");
    const success = form
      .closest(".card")
      ?.querySelector(".puzzle-success");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const user = normalizeAnswer(input.value);

      if (!user) {
        feedback.textContent = "Wpisz rozwiązanie zagadki.";
        feedback.classList.add("puzzle-feedback--error");
        return;
      }

      if (answers.includes(user)) {
        feedback.textContent = "Tak! Ścieżka stoi otworem.";
        feedback.classList.remove("puzzle-feedback--error");
        input.disabled = true;
        form.querySelector("button")?.setAttribute("disabled", "disabled");
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        feedback.textContent = "To nie to hasło. Przeczytaj wskazówki jeszcze raz!";
        feedback.classList.add("puzzle-feedback--error");
      }
    });
  });

  document.querySelectorAll("[data-twist]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const feedbackTargetId = link.getAttribute("data-twist");
      const target =
        feedbackTargetId && document.getElementById(feedbackTargetId);

      if (target) {
        target.textContent = pickMessage();
        target.classList.add("puzzle-feedback--error");
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        alert(pickMessage());
      }
    });
  });

  document.querySelectorAll("[data-reveal-target]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const targetId = button.getAttribute("data-reveal-target");
      const target =
        targetId && document.getElementById(targetId);

      if (!target) {
        return;
      }

      target.hidden = false;
      target.classList.add("final-reveal--visible");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      button.setAttribute("disabled", "disabled");
    });
  });
});

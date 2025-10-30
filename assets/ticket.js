document.addEventListener("DOMContentLoaded", () => {
  const downloadLink = document.getElementById("ticket-download");
  const errorBox = document.getElementById("ticket-error");
  const countdownEl = document.getElementById("ticket-countdown");

  if (!downloadLink || !errorBox || !countdownEl) {
    return;
  }

  let ticking = false;
  let countdown = 5;
  let timer;

  const resetCountdown = () => {
    window.clearInterval(timer);
    countdown = 5;
    countdownEl.textContent = String(countdown);
    ticking = false;
  };

  const startCountdown = () => {
    if (ticking) {
      return;
    }
    ticking = true;

    timer = window.setInterval(() => {
      countdown -= 1;
      countdownEl.textContent = String(countdown);

      if (countdown <= 0) {
        window.clearInterval(timer);
        window.location.href = "flames.html";
      }
    }, 1000);
  };

  downloadLink.addEventListener("click", (event) => {
    event.preventDefault();
    errorBox.hidden = false;
    errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
    resetCountdown();
    startCountdown();
  });
});

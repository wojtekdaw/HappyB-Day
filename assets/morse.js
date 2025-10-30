document.addEventListener("DOMContentLoaded", () => {
  const phrase = "suśli dar jest tuż tuż";
  const codeMap = {
    s: "...",
    u: "..-",
    "ś": "...-...",
    l: ".-..",
    i: "..",
    d: "-..",
    a: ".-",
    r: ".-.",
    j: ".---",
    e: ".",
    t: "-",
    "ż": "--..-.",
  };

  const phraseContainer = document.getElementById("morse-phrase");
  const sequenceOutput = document.getElementById("sequence-output");
  const signalButtons = document.querySelectorAll("[data-signal]");
  const feedback = document.getElementById("morse-feedback");
  const secretForm = document.getElementById("morse-secret-form");
  const secretInput = document.getElementById("secret-input");
  const secretFeedback = document.getElementById("secret-feedback");
  const locationBox = document.getElementById("morse-location");

  if (
    !phraseContainer ||
    !sequenceOutput ||
    signalButtons.length === 0 ||
    !feedback ||
    !secretForm ||
    !secretInput ||
    !secretFeedback ||
    !locationBox
  ) {
    return;
  }

  const lettersMeta = [];
  phrase.split(" ").forEach((word) => {
    const wordEl = document.createElement("div");
    wordEl.className = "morse-word";
    wordEl.dataset.length = word.length;
    [...word].forEach((char) => {
      const span = document.createElement("span");
      span.className = "morse-letter";
      span.textContent = "•";
      wordEl.appendChild(span);
      lettersMeta.push({ char, span, revealed: false });
    });
    phraseContainer.appendChild(wordEl);
  });

  const codes = Object.values(codeMap);
  let currentSequence = "";
  let sequenceTimer = null;

  function updateSequenceDisplay() {
    sequenceOutput.textContent = currentSequence || "⌀";
  }

  function resetSequence() {
    clearTimeout(sequenceTimer);
    sequenceTimer = null;
    currentSequence = "";
    updateSequenceDisplay();
  }

  function showFeedback(message, success = false) {
    feedback.textContent = message;
    feedback.classList.toggle("morse-feedback--success", success);
  }

  function revealLetter(letter) {
    const target = lettersMeta.find((meta) => !meta.revealed && meta.char === letter);
    if (!target) {
      showFeedback(`Litera „${letter.toUpperCase()}” została już odsłonięta.`, true);
      return;
    }

    target.revealed = true;
    target.span.textContent = letter;
    target.span.classList.add("morse-letter--revealed");
    showFeedback(`Odsłonięto literę „${letter.toUpperCase()}”.`, true);

    if (lettersMeta.every((meta) => meta.revealed)) {
      showFeedback("Wszystkie litery odsłonięte! Wpisz hasło poniżej.", true);
      secretInput.focus({ preventScroll: false });
    }
  }

  function finalizeSequence() {
    if (!currentSequence) {
      return;
    }

    const entry = Object.entries(codeMap).find(([, code]) => code === currentSequence);

    if (!entry) {
      showFeedback("Ten rytm nie pasuje do żadnej litery w haśle.");
      resetSequence();
      return;
    }

    const [letter] = entry;
    revealLetter(letter);
    resetSequence();
  }

  function scheduleFinalizeIfNeeded() {
    const entry = Object.entries(codeMap).find(([, code]) => code === currentSequence);
    if (!entry) {
      return;
    }

    const code = entry[1];
    const hasLonger = codes.some((candidate) => candidate !== code && candidate.startsWith(code));
    const delay = hasLonger ? 1100 : 350;

    clearTimeout(sequenceTimer);
    sequenceTimer = window.setTimeout(finalizeSequence, delay);
  }

  function handleSignal(signal) {
    clearTimeout(sequenceTimer);
    currentSequence += signal;
    updateSequenceDisplay();

    const isPrefix = codes.some((code) => code.startsWith(currentSequence));
    if (!isPrefix) {
      showFeedback("Sygnał zboczył z kursu. Spróbuj ponownie.");
      resetSequence();
      return;
    }

    scheduleFinalizeIfNeeded();
  }

  signalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleSignal(button.dataset.signal || "");
    });
  });

  updateSequenceDisplay();

  const normalizePhrase = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const targetPhrase = normalizePhrase(phrase);

  secretForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const attemptRaw = secretInput.value;
    if (!attemptRaw.trim()) {
      secretFeedback.textContent = "Wpisz hasło, zanim potwierdzisz.";
      secretFeedback.classList.remove("morse-feedback--success");
      locationBox.hidden = true;
      return;
    }

    const attemptNormalized = normalizePhrase(attemptRaw);
    if (attemptNormalized === targetPhrase) {
      secretFeedback.textContent = "Hasło poprawne! Sygnał potwierdzony.";
      secretFeedback.classList.add("morse-feedback--success");
      locationBox.hidden = false;
      secretInput.setAttribute("disabled", "disabled");
      secretForm.querySelector("button")?.setAttribute("disabled", "disabled");
    } else {
      secretFeedback.textContent = "To nie jest pełne hasło. Sprawdź odsłonięte litery.";
      secretFeedback.classList.remove("morse-feedback--success");
      locationBox.hidden = true;
    }
  });
});

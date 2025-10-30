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

  const phraseContainer = document.getElementById("main-phrase");
  const sequenceOutput = document.getElementById("sequence");
  const signalButtons = document.querySelectorAll("[data-signal]");
  const feedback = document.getElementById("feedback");
  const secretInput = document.getElementById("secret-input");
  const secretButton = document.getElementById("secret-submit");
  const secretFeedback = document.getElementById("secret-feedback");
  const locationBox = document.getElementById("location");
  const modal = document.getElementById("courier-modal");
  const modalClose = document.getElementById("courier-close");

  if (
    !phraseContainer ||
    !sequenceOutput ||
    signalButtons.length === 0 ||
    !feedback ||
    !secretInput ||
    !secretButton ||
    !secretFeedback ||
    !locationBox ||
    !modal ||
    !modalClose
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

  secretButton.addEventListener("click", () => {
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
      secretButton.setAttribute("disabled", "disabled");
      modal.hidden = false;
    } else {
      secretFeedback.textContent = "To nie jest pełne hasło. Sprawdź odsłonięte litery.";
      secretFeedback.classList.remove("morse-feedback--success");
      locationBox.hidden = true;
    }
  });
  modalClose.addEventListener("click", () => {
    window.location.href = "flames.html";
  });
});

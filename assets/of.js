document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("subscribe-modal");
  const closeButton = modal?.querySelector("[data-close-modal]");
  const subscribeButtons = document.querySelectorAll("[data-subscribe]");
  let modalShown = false;

  if (!modal || subscribeButtons.length === 0) {
    return;
  }

  const focusClose = () => {
    if (!closeButton) {
      return;
    }
    closeButton.focus({ preventScroll: true });
  };

  const showModal = () => {
    modal.removeAttribute("hidden");
    // Wait a frame so transition triggers correctly.
    requestAnimationFrame(() => {
      modal.classList.add("is-visible");
      setTimeout(focusClose, 180);
    });
  };

  const hideModal = () => {
    if (modal.hasAttribute("hidden")) {
      return;
    }

    const finalize = () => {
      modal.setAttribute("hidden", "hidden");
      modal.removeEventListener("transitionend", finalize);
    };

    modal.classList.remove("is-visible");
    modal.addEventListener("transitionend", finalize, { once: true });
    // Fallback in case transitionend doesn't fire.
    window.setTimeout(finalize, 320);
  };

  subscribeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (modalShown) {
        return;
      }

      event.preventDefault();
      modalShown = true;
      showModal();
    });
  });

  closeButton?.addEventListener("click", hideModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      hideModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideModal();
    }
  });
});

const feedbackForm = document.querySelector("#feedback-form");

if (feedbackForm) {
  const modal = document.querySelector("#feedback-modal");
  const closeButton = document.querySelector("#feedback-modal-close");
  const submitButton = feedbackForm.querySelector('[type="submit"]');
  const fields = ["name", "email", "phone", "message", "agreement"];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phonePattern = /^\+380\d{9}$/;
  let previousFocus = null;

  const getInput = (field) => feedbackForm.elements.namedItem(field);
  const getError = (field) => document.querySelector(`#feedback-${field}-error`);

  function showState(field, error) {
    const input = getInput(field);
    const message = getError(field);
    input.setAttribute("aria-invalid", String(Boolean(error)));
    message.textContent = error || "";
    message.classList.toggle("hidden", !error);
    if (field !== "agreement") {
      input.classList.toggle("border-red-500", Boolean(error));
      input.classList.toggle("border-teal-600", !error);
      input.classList.remove("border-slate-300");
    }
    return !error;
  }

  function validateField(field) {
    const input = getInput(field);
    const value = field === "agreement" ? "" : input.value.trim();
    let error = "";

    if (field === "name" && value.length < 2) error = "Введіть ім’я щонайменше з 2 символів.";
    if (field === "email" && !emailPattern.test(value)) error = "Введіть коректну електронну адресу.";
    if (field === "phone" && !phonePattern.test(value)) error = "Введіть номер у форматі +380501234567.";
    if (field === "message" && value.length < 10) error = "Напишіть повідомлення щонайменше з 10 символів.";
    if (field === "agreement" && !input.checked) error = "Підтвердьте згоду з політикою конфіденційності.";

    return showState(field, error);
  }

  fields.forEach((field) => {
    const input = getInput(field);
    input.addEventListener("blur", () => validateField(field));
    input.addEventListener(field === "agreement" ? "change" : "input", () => {
      if (input.dataset.touched === "true" || input.getAttribute("aria-invalid") === "true") validateField(field);
      input.dataset.touched = "true";
    });
  });

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
    previousFocus?.focus();
  }

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
    if (event.key === "Tab") {
      event.preventDefault();
      closeButton.focus();
    }
  });

  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const results = fields.map((field) => validateField(field));
    if (results.some((valid) => !valid)) {
      getInput(fields[results.indexOf(false)]).focus();
      return;
    }

    previousFocus = submitButton;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
    closeButton.focus();
    feedbackForm.reset();
    fields.forEach((field) => {
      const input = getInput(field);
      input.dataset.touched = "false";
      input.setAttribute("aria-invalid", "false");
      getError(field).textContent = "";
      getError(field).classList.add("hidden");
      input.classList.remove("border-red-500", "border-teal-600");
      if (field !== "agreement") input.classList.add("border-slate-300");
    });
  });
}

console.log("Allazhar script loaded successfully.");

// Task 4: Keep the current color index between clicks.
const backgroundButton = document.getElementById("changeBackground");

const colors = ["lightblue", "lightgreen", "lightyellow", "lightpink", "lightgray", "white"];
let colorIndex = 0;

backgroundButton.addEventListener("click", function () {
  document.body.style.backgroundColor = colors[colorIndex];
  colorIndex = (colorIndex + 1) % colors.length;
});

// Task 5: Create a fresh Date each time this function runs.
const dateTimeElement = document.getElementById("currentDatetime");
function updateDateTime() {
  const now = new Date();
  dateTimeElement.textContent = now.toLocaleString("en-GB");
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Task 2: Each question controls the answer inside its own FAQ item.
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(function (item) {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.setAttribute("aria-expanded", "false");
  answer.setAttribute("aria-hidden", "true");

  question.addEventListener("click", function () {
    const isOpen = item.classList.toggle("is-open");
    question.setAttribute("aria-expanded", String(isOpen));
    answer.setAttribute("aria-hidden", String(!isOpen));

    if (isOpen) {
      answer.style.height = answer.scrollHeight + "px";
    } else {
      answer.style.height = "0px";
    }
  });
});

// Task 1: Shared helpers display errors next to the relevant inputs.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "Error");

  error.textContent = message;
  field.classList.toggle("is-invalid", message !== "");
  field.setAttribute("aria-invalid", String(message !== ""));
}

const registrationForm = document.getElementById("registrationForm");
const registrationMessage = document.getElementById("registrationMessage");

registrationForm.addEventListener("submit", function (event) {
  // Keep the browser on this page while JavaScript checks the fields.
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmation = document.getElementById("confirmPassword").value;

  let nameError = "";
  let emailError = "";
  let passwordError = "";
  let confirmationError = "";

  if (name === "") {
    nameError = "Enter your full name.";
  }

  if (email === "") {
    emailError = "Enter your email address.";
  } else if (!emailPattern.test(email)) {
    emailError = "Enter a valid email address, for example name@example.com.";
  }

  // Eight characters is our chosen rule; the assignment does not specify a minimum.
  if (password.trim() === "") {
    passwordError = "Enter a password.";
  } else if (password.length < 8) {
    passwordError = "Use at least 8 characters.";
  }

  if (confirmation === "") {
    confirmationError = "Confirm your password.";
  } else if (confirmation !== password) {
    confirmationError = "Passwords must match.";
  }

  showFieldError("registerName", nameError);
  showFieldError("registerEmail", emailError);
  showFieldError("registerPassword", passwordError);
  showFieldError("confirmPassword", confirmationError);

  const isValid = nameError === "" && emailError === "" &&
    passwordError === "" && confirmationError === "";

  registrationMessage.classList.toggle("is-success", isValid);

  if (!isValid) {
    registrationMessage.textContent = "Please correct the highlighted fields.";
    registrationForm.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  registrationMessage.textContent = "All fields are valid. Demo only: no account has been created.";
  // Do not store or log passwords; clear them after a successful check.
  document.getElementById("registerPassword").value = "";
  document.getElementById("confirmPassword").value = "";
});

// Task 3: Show the popup, close it, and distinguish backdrop clicks from form clicks.
const openPopupButton = document.getElementById("openPopup");
const closePopupButton = document.getElementById("closePopup");
const popup = document.getElementById("subscriptionPopup");
let previousBodyOverflow = "";

function openSubscriptionPopup() {
  previousBodyOverflow = document.body.style.overflow;
  popup.style.display = "flex";
  document.body.style.overflow = "hidden";
  document.getElementById("subscriptionName").focus();
}

function closeSubscriptionPopup() {
  popup.style.display = "none";
  document.body.style.overflow = previousBodyOverflow;
  openPopupButton.focus();
}

openPopupButton.addEventListener("click", openSubscriptionPopup);
closePopupButton.addEventListener("click", closeSubscriptionPopup);

popup.addEventListener("click", function (event) {
  // A click inside the panel has a different target and leaves the popup open.
  if (event.target === popup) {
    closeSubscriptionPopup();
  }
});

document.addEventListener("keydown", function (event) {
  if (popup.style.display !== "flex") {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeSubscriptionPopup();
  }

  // Keep keyboard focus inside the open dialog.
  if (event.key === "Tab") {
    const controls = popup.querySelectorAll("button, input");
    const first = controls[0];
    const last = controls[controls.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const subscriptionForm = document.getElementById("subscriptionForm");
const subscriptionMessage = document.getElementById("subscriptionMessage");

subscriptionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("subscriptionName").value.trim();
  const email = document.getElementById("subscriptionEmail").value.trim();
  let nameError = "";
  let emailError = "";

  if (name === "") {
    nameError = "Enter your name.";
  }

  if (email === "") {
    emailError = "Enter your email address.";
  } else if (!emailPattern.test(email)) {
    emailError = "Enter a valid email address, for example name@example.com.";
  }

  showFieldError("subscriptionName", nameError);
  showFieldError("subscriptionEmail", emailError);

  const isValid = nameError === "" && emailError === "";
  subscriptionMessage.classList.toggle("is-success", isValid);

  if (!isValid) {
    subscriptionMessage.textContent = "Please correct the highlighted fields.";
    subscriptionForm.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  subscriptionMessage.textContent = "Your details are valid. Demo only: no subscription has been sent.";
});

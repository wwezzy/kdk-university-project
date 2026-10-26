// Assignment 5 - Kuat Allazhar: Home and About.
// A function keeps these variables separate from the other team scripts.
function initAllazharAssignment5() {
  // 1. An array of objects stores the campus gallery data.
  const campusPhotos = [
    { src: "images/Campus2All.jpg", title: "Explore our campus", alt: "KDK University campus buildings" },
    { src: "images/LibraryAll.jpg", title: "Find your study space", alt: "Library and study spaces at KDK" },
    { src: "images/SportfieldAll.jpg", title: "Make time for sport", alt: "Outdoor sports field at KDK" }
  ];
  const mainImage = document.getElementById("a5MainImage");
  const photoCaption = document.getElementById("a5PhotoCaption");
  const thumbnails = document.getElementById("a5Thumbnails");

  // A for loop creates a thumbnail button for each photo.
  for (let index = 0; index < campusPhotos.length; index++) {
    const button = document.createElement("button");
    const image = document.createElement("img");
    button.type = "button";
    button.className = "a5-thumbnail";
    button.setAttribute("aria-label", campusPhotos[index].title);
    image.src = campusPhotos[index].src;
    image.alt = "";
    button.appendChild(image);
    thumbnails.appendChild(button);
    button.addEventListener("click", function () {
      showCampusPhoto(index);
    });
  }

  function showCampusPhoto(index) {
    const photo = campusPhotos[index];
    mainImage.setAttribute("src", photo.src);
    mainImage.setAttribute("alt", photo.alt);
    photoCaption.textContent = (index + 1) + " / " + campusPhotos.length + " - " + photo.title;
    const buttons = thumbnails.querySelectorAll("button");
    // forEach is a higher-order function: it receives a callback.
    buttons.forEach(function (button, buttonIndex) {
      const isSelected = buttonIndex === index;
      button.setAttribute("aria-pressed", String(isSelected));
      button.style.borderColor = isSelected ? "#1378bd" : "#d9ebf7";
      button.style.transform = isSelected ? "scale(0.94)" : "scale(1)";
    });
  }
  showCampusPhoto(0);

  // 2. Arrow keys move focus in the main navigation menu.
  const menuLinks = document.querySelectorAll(".assignment3-navbar .nav-link");
  menuLinks.forEach(function (link, index) {
    link.addEventListener("keydown", function (event) {
      let nextIndex = index;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = (index + 1) % menuLinks.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          nextIndex = (index - 1 + menuLinks.length) % menuLinks.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = menuLinks.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      menuLinks[nextIndex].focus();
    });
  });

  // 3. This object stores the form state and has its own method.
  const visitPlan = {
    name: "",
    email: "",
    interest: "Campus tour",
    getSummary: function () {
      return this.name + " would like to explore: " + this.interest + ". Contact: " + this.email + ".";
    }
  };
  const visitForm = document.getElementById("a5VisitForm");
  const steps = visitForm.querySelectorAll(".a5-step");
  const nameInput = document.getElementById("a5VisitorName");
  const emailInput = document.getElementById("a5VisitorEmail");
  const interestInput = document.getElementById("a5VisitInterest");
  const backButton = document.getElementById("a5Back");
  const nextButton = document.getElementById("a5Next");
  const finishButton = document.getElementById("a5Finish");
  const progress = document.getElementById("a5Progress");
  const errorMessage = document.getElementById("a5Error");
  const review = document.getElementById("a5Review");
  const result = document.getElementById("a5Result");
  let currentStep = 0;

  function saveVisitPlan() {
    visitPlan.name = nameInput.value.trim();
    visitPlan.email = emailInput.value.trim();
    visitPlan.interest = interestInput.value;
    review.textContent = visitPlan.getSummary();
  }

  function showVisitStep(stepIndex) {
    currentStep = stepIndex;
    steps.forEach(function (step, index) {
      step.hidden = index !== currentStep;
    });
    backButton.hidden = currentStep === 0;
    nextButton.hidden = currentStep === steps.length - 1;
    finishButton.hidden = currentStep !== steps.length - 1;
    progress.textContent = "Step " + (currentStep + 1) + " of " + steps.length;
    errorMessage.textContent = "";
  }

  function validateVisitStep() {
    saveVisitPlan();
    if (currentStep === 0 && visitPlan.name === "") {
      errorMessage.textContent = "Please enter your name.";
      nameInput.focus();
      return false;
    }
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitPlan.email);
    if (currentStep === 0 && !emailIsValid) {
      errorMessage.textContent = "Please enter a valid email address.";
      emailInput.focus();
      return false;
    }
    return true;
  }

  // The event listener receives a function, rather than calling it immediately.
  nextButton.addEventListener("click", function () {
    if (validateVisitStep()) {
      result.hidden = true;
      showVisitStep(currentStep + 1);
      steps[currentStep].querySelector("input, select, h3").focus();
    }
  });
  backButton.addEventListener("click", function () {
    saveVisitPlan();
    result.hidden = true;
    showVisitStep(currentStep - 1);
    steps[currentStep].querySelector("input, select, h3").focus();
  });

  // 4. Reuse one Audio object so repeated clicks cannot overlap sounds.
  const notificationSound = new Audio("sounds/kdk-notification.wav");
  notificationSound.volume = 0.25;
  const soundMessage = document.getElementById("a5SoundMessage");
  function playNotification() {
    notificationSound.pause();
    notificationSound.currentTime = 0;
    notificationSound.play().then(function () {
      soundMessage.textContent = "Notification sound played.";
    }).catch(function () {
      soundMessage.textContent = "Sound is unavailable. You can still use the visit planner.";
    });
  }
  document.getElementById("a5PlaySound").addEventListener("click", playNotification);

  visitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // Enter on an earlier step moves forward instead of finishing the form.
    if (currentStep < steps.length - 1) {
      nextButton.click();
      return;
    }
    saveVisitPlan();
    result.textContent = "Your visit plan is ready! " + visitPlan.getSummary() +
      " This is a local preview; no booking or email has been sent.";
    result.hidden = false;
    result.focus();
    if (document.getElementById("a5SoundEnabled").checked) {
      playNotification();
    }
  });

  document.getElementById("a5Reset").addEventListener("click", function () {
    visitForm.reset();
    saveVisitPlan();
    result.hidden = true;
    result.textContent = "";
    soundMessage.textContent = "";
    notificationSound.pause();
    notificationSound.currentTime = 0;
    showVisitStep(0);
    nameInput.focus();
  });
  showVisitStep(0);
}

initAllazharAssignment5();

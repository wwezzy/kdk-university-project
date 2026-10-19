// Assignment 4 - Task 1: Form Validation
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const message = document.getElementById("message").value.trim();
        const result = document.getElementById("form-message");

        result.style.color = "red";

        if (!name || !email || !password || !confirmPassword || !message) {
            result.textContent = "Please fill in all required fields.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            result.textContent = "Please enter a valid email address.";
        } else if (password.length < 8) {
            result.textContent = "Password must be at least 8 characters.";
        } else if (password !== confirmPassword) {
            result.textContent = "Passwords do not match.";
        } else {
            result.style.color = "green";
            result.textContent = "Form validated successfully!";
        }
    });
}

// Assignment 4 - Task 2: FAQ Accordion

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function(question) {
    question.addEventListener("click", function() {
        const answer = question.nextElementSibling;

        answer.classList.toggle("open");
        question.classList.toggle("active");
    });
});

// Assignment 4 - Task 3: Popup Form

const popup = document.getElementById("contact-popup");
const openPopup = document.getElementById("open-popup");
const closePopup = document.getElementById("close-popup");

if (popup && openPopup && closePopup) {

    openPopup.addEventListener("click", function() {
        popup.classList.add("show");
        document.getElementById("popup-name").focus();
    });

    closePopup.addEventListener("click", function() {
        popup.classList.remove("show");
        openPopup.focus();
    });

    popup.addEventListener("click", function(event) {
        if (event.target === popup) {
            popup.classList.remove("show");
            openPopup.focus();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && popup.classList.contains("show")) {
            popup.classList.remove("show");
            openPopup.focus();
        }
    });

    const popupForm = document.getElementById("popup-form");

    popupForm.addEventListener("submit", function(event) {
        event.preventDefault();
        alert("Thank you! This is a demo form.");
        popupForm.reset();
        popup.classList.remove("show");
        openPopup.focus();
    });
}

// Assignment 4 - Task 4: Dynamic Background Color

const changeBgButton = document.getElementById("change-bg");

if (changeBgButton) {
    const colors = ["#ffffff", "#eaf4ff", "#e8f5e9", "#fff3e0", "#f3e5f5"];
    let colorIndex = 0;

    changeBgButton.addEventListener("click", function() {
        colorIndex = (colorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[colorIndex];
    });
}

// Assignment 4 - Task 5: Current Date and Time

const dateTimeElement = document.getElementById("current-datetime");

if (dateTimeElement) {

    function updateDateTime() {
        const now = new Date();

        const formattedDateTime = now.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        dateTimeElement.textContent = formattedDateTime;
    }

    updateDateTime();

    setInterval(updateDateTime, 1000);
}
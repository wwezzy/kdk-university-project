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

// Assignment 5 - Task 1: Interactive Rating

const ratingStars = document.querySelectorAll(".rating-star");
const ratingResult = document.getElementById("rating-result");

ratingStars.forEach(function(star) {
    star.addEventListener("click", function() {

        const rating = Number(star.dataset.rating);

        ratingStars.forEach(function(item) {
            const starNumber = Number(item.dataset.rating);

            if (starNumber <= rating) {
                item.classList.add("selected");
            } else {
                item.classList.remove("selected");
            }
        });

        ratingResult.textContent =
            "You rated " + rating + " out of 5 stars!";
    });
});

// Assignment 5 - Task 2: Day/Night Mode

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", function() {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "Switch to Light Mode";
        } else {
            themeToggle.textContent = "Switch to Dark Mode";
        }

    });
}

// Assignment 5 - Task 3: Read More / Read Less

const readMoreBtn = document.getElementById("read-more-btn");
const extraCampusInfo = document.getElementById("extra-campus-info");

if (readMoreBtn && extraCampusInfo) {
    readMoreBtn.addEventListener("click", function() {

        extraCampusInfo.hidden = !extraCampusInfo.hidden;

        if (extraCampusInfo.hidden) {
            readMoreBtn.textContent = "Read More";
        } else {
            readMoreBtn.textContent = "Read Less";
        }

    });
}

// Assignment 5 - Task 4: Button Events

const showTimeBtn = document.getElementById("show-time-btn");
const clickedTime = document.getElementById("clicked-time");

if (showTimeBtn && clickedTime) {
    showTimeBtn.addEventListener("click", function() {

        const now = new Date();

        clickedTime.textContent =
            "Button clicked at: " + now.toLocaleTimeString();

    });
}

// Assignment 5 - Task 5: Keyboard Events

const campusCarousel = document.getElementById("campusCarousel");

if (campusCarousel) {

    const carousel = bootstrap.Carousel.getOrCreateInstance(campusCarousel);

    document.addEventListener("keydown", function(event) {

        // Do not change slides while typing in a form
        const tag = event.target.tagName;

            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT" ||
                event.target.closest("#mainNavbar")
            ) {
                return;
}

        if (event.key === "ArrowRight") {
            carousel.next();
        }

        if (event.key === "ArrowLeft") {
            carousel.prev();
        }

    });
}

// Keyboard navigation between menu links
const navLinks = document.querySelectorAll("#mainNavbar .nav-link");

navLinks.forEach(function(link, index) {
    link.addEventListener("keydown", function(event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();

            let nextIndex;

            if (event.key === "ArrowRight") {
                nextIndex = (index + 1) % navLinks.length;
            } else {
                nextIndex = (index - 1 + navLinks.length) % navLinks.length;
            }

            navLinks[nextIndex].focus();
        }
    });
});

// Assignment 5 - Task 6: Callback Functions

const eventRegister = document.getElementById("event-register");
const eventResult = document.getElementById("event-result");

// Function that receives a callback
function registerForEvent(name, eventName, callback) {
    const message = name + ", you registered for " + eventName + "!";
    callback(message);
}

// Callback function
function showRegistration(message) {
    eventResult.textContent = message;
}

if (eventRegister && eventResult) {
    eventRegister.addEventListener("click", function() {

        const name = document.getElementById("event-name").value.trim();
        const eventName = document.getElementById("event-choice").value;

        if (name === "" || eventName === "") {
            eventResult.textContent = "Please enter your name and select an event.";
            return;
        }

        registerForEvent(name, eventName, showRegistration);
    });
}

// Assignment 5 - Task 7: Switch Statement

const timeGreeting = document.getElementById("time-greeting");

if (timeGreeting) {
    const hour = new Date().getHours();
    let timeOfDay;

    if (hour < 12) {
        timeOfDay = "morning";
    } else if (hour < 18) {
        timeOfDay = "afternoon";
    } else {
        timeOfDay = "evening";
    }

    switch (timeOfDay) {
        case "morning":
            timeGreeting.textContent = "Good Morning!";
            break;

        case "afternoon":
            timeGreeting.textContent = "Good Afternoon!";
            break;

        case "evening":
            timeGreeting.textContent = "Good Evening!";
            break;

        default:
            timeGreeting.textContent = "Welcome!";
    }
}

// Assignment 5 - Task 8: JavaScript Objects

const campus = {
    name: "KDK University",
    city: "Astana",
    facilities: 5,
    hasLibrary: true,

    getDescription: function() {
        return this.name + " is located in " + this.city;
    }
};

const campusInfoBtn = document.getElementById("campus-info-btn");
const campusInfoResult = document.getElementById("campus-info-result");

if (campusInfoBtn && campusInfoResult) {

    campusInfoBtn.addEventListener("click", function() {

        campusInfoResult.innerHTML = `
            <h3>${campus.name}</h3>
            <p>City: ${campus.city}</p>
            <p>Facilities: ${campus.facilities}</p>} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            <p>Library Available: ${campus.hasLibrary ? "Yes" : "No"}</p>
            <p>${campus.getDescription()}</p>
        `;

    });
}

// Assignment 5 - Task 9: Arrays and Higher-Order Functions

const activities = [
    "Football Club",
    "Basketball Club",
    "Programming Workshop",
    "Music Club",
    "Art Club"
];

const activitiesBtn = document.getElementById("activities-btn");
const activitiesList = document.getElementById("activities-list");

if (activitiesBtn && activitiesList) {

    activitiesBtn.addEventListener("click", function() {

        activitiesList.innerHTML = "";

        activities.forEach(function(activity, index) {

            const card = document.createElement("div");

            card.className = "activity-card";

            card.textContent = (index + 1) + ". " + activity;

            activitiesList.appendChild(card);

        });

    });
}

// Assignment 5 - Task 10: Sounds and Animations

const celebrateBtn = document.getElementById("celebrate-btn");
const celebrateMessage = document.getElementById("celebrate-message");

if (celebrateBtn && celebrateMessage) {

    celebrateBtn.addEventListener("click", function() {

        // Change message
        celebrateMessage.textContent = "🎉 Enjoy Campus Life at KDK! 🎉";

        // Restart animation
        celebrateMessage.classList.remove("celebrate-animation");
        void celebrateMessage.offsetWidth;
        celebrateMessage.classList.add("celebrate-animation");

        // Play sound using Web Audio API
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (AudioContextClass) {
            const audioContext = new AudioContextClass();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = "sine";
            oscillator.frequency.value = 660;

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime + 0.3
            );

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);

            oscillator.onended = function() {
                audioContext.close();
            };
        }

    });
}
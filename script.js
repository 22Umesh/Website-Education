// ==========================================
// GOOGLE SHEET CONNECTION
// ==========================================

// Paste the Web app URL from Google Apps Script here
// (it ends in /exec). Setup steps are in google-sheet-script.gs.

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxRzuWH8_0o2CPV4OQluH-5jIrHnIxFlylhsRop_cS86kKe6YstYxr80HgvBRnkQBwcgw/exec";
const SUBMIT_FAILED_MESSAGE =
    "Sorry, we could not submit the form. " +
    "Please try again, or call us on +91 83758 11375.";


// Sends one form submission to the Google Sheet.
// The button is disabled while the data is being sent.

function sendToGoogleSheet(button, data) {

    if (GOOGLE_SHEET_URL === "") {

        return Promise.reject(
            new Error("GOOGLE_SHEET_URL is not set in script.js.")
        );

    }

    const buttonText = button.textContent;

    button.disabled = true;
    button.textContent = "Sending...";

    return fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        body: new URLSearchParams(data)
    })
    .then(function(response) {

        return response.json();

    })
    .then(function(result) {

        if (result.result !== "success") {
            throw new Error(result.message);
        }

    })
    .finally(function() {

        button.disabled = false;
        button.textContent = buttonText;

    });

}


// Returns the visible text of the chosen option, e.g. "Classes 1 - 5"

function selectedText(select) {

    return select.options[select.selectedIndex].text;

}


const form = document.querySelector(".registration-form");

const studentName = document.getElementById("studentName");
const parentName = document.getElementById("parentName");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");
const studentClass = document.getElementById("studentClass");
const subject = document.getElementById("subject");
const address = document.getElementById("address");
const agreeTerms = document.getElementById("agreeTerms");


form.addEventListener("submit", function(event) {

    event.preventDefault();

    clearErrors();

    let isValid = true;


    // Student Name Validation

    if (studentName.value.trim() === "") {

        showError(
            studentName,
            "studentNameError",
            "Please enter student name."
        );

        isValid = false;

    } else {

        studentName.classList.add("valid");

    }


    // Parent Name Validation

    if (parentName.value.trim() === "") {

        showError(
            parentName,
            "parentNameError",
            "Please enter parent name."
        );

        isValid = false;

    } else {

        parentName.classList.add("valid");

    }


    // Email Validation

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value.trim() === "") {

        showError(
            email,
            "emailError",
            "Please enter email address."
        );

        isValid = false;

    } else if (!emailPattern.test(email.value.trim())) {

        showError(
            email,
            "emailError",
            "Please enter a valid email address."
        );

        isValid = false;

    } else {

        email.classList.add("valid");

    }


    // Mobile Validation

    const mobilePattern = /^[0-9]{10}$/;

    if (!mobilePattern.test(mobile.value.trim())) {

        showError(
            mobile,
            "mobileError",
            "Please enter a valid 10-digit mobile number."
        );

        isValid = false;

    } else {

        mobile.classList.add("valid");

    }


    // Class Validation

    if (studentClass.value === "") {

        showError(
            studentClass,
            "classError",
            "Please select a class."
        );

        isValid = false;

    } else {

        studentClass.classList.add("valid");

    }


    // Subject Validation

    if (subject.value === "") {

        showError(
            subject,
            "subjectError",
            "Please select a subject."
        );

        isValid = false;

    } else {

        subject.classList.add("valid");

    }


    // Address Validation

    if (address.value.trim() === "") {

        showError(
            address,
            "addressError",
            "Please enter your address."
        );

        isValid = false;

    } else {

        address.classList.add("valid");

    }


    // Terms Validation

    if (!agreeTerms.checked) {

        document.getElementById("termsError").textContent =
            "Please agree to the Terms & Conditions.";

        isValid = false;

    }


    // Successful Registration

    if (isValid) {

        sendToGoogleSheet(form.querySelector(".register-btn"), {
            formType: "registration",
            studentName: studentName.value.trim(),
            parentName: parentName.value.trim(),
            email: email.value.trim(),
            mobile: mobile.value.trim(),
            studentClass: selectedText(studentClass),
            subject: selectedText(subject),
            address: address.value.trim()
        })
        .then(function() {

            alert("Registration successful!");

            form.reset();

            updateSubjectOptions(studentClass, subject);

            clearErrors();

        })
        .catch(function(error) {

            console.error("Registration was not saved:", error);

            alert(SUBMIT_FAILED_MESSAGE);

        });
    }

});


function showError(field, errorId, message) {

    field.classList.add("invalid");

    document.getElementById(errorId).textContent = message;
}


function clearErrors() {

    const errorMessages =
        document.querySelectorAll(".registration-form .error-message");

    errorMessages.forEach(function(error) {

        error.textContent = "";

    });
    


    const formFields =
        document.querySelectorAll(
            ".registration-form input, .registration-form select, .registration-form textarea"
        );

    formFields.forEach(function(field) {

        field.classList.remove("valid", "invalid");

    });
}


const contactForm = document.querySelector(".contact-form");

const contactName = document.getElementById("contactName");
const contactPhone = document.getElementById("contactPhone");
const contactMessage = document.getElementById("contactMessage");


contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    clearContactErrors();

    let isContactValid = true;


    // Name Validation

    if (contactName.value.trim() === "") {

        showContactError(
            contactName,
            "contactNameError",
            "Please enter your name."
        );

        isContactValid = false;

    } else {

        contactName.classList.add("valid");

    }


    // Mobile Validation

    const contactMobilePattern = /^[0-9]{10}$/;

    if (!contactMobilePattern.test(contactPhone.value.trim())) {

        showContactError(
            contactPhone,
            "contactPhoneError",
            "Please enter a valid 10-digit mobile number."
        );

        isContactValid = false;

    } else {

        contactPhone.classList.add("valid");

    }


    // Message Validation

    if (contactMessage.value.trim() === "") {

        showContactError(
            contactMessage,
            "contactMessageError",
            "Please enter your message."
        );

        isContactValid = false;

    } else {

        contactMessage.classList.add("valid");

    }


    // Successful Submission

    if (isContactValid) {

        sendToGoogleSheet(contactForm.querySelector(".contact-btn"), {
            formType: "contact",
            name: contactName.value.trim(),
            mobile: contactPhone.value.trim(),
            message: contactMessage.value.trim()
        })
        .then(function() {

            alert("Message sent successfully!");

            contactForm.reset();

            clearContactErrors();

        })
        .catch(function(error) {

            console.error("Message was not saved:", error);

            alert(SUBMIT_FAILED_MESSAGE);

        });

    }

});


function showContactError(field, errorId, message) {

    field.classList.add("invalid");

    document.getElementById(errorId).textContent = message;

}


function clearContactErrors() {

    document.getElementById("contactNameError").textContent = "";
    document.getElementById("contactPhoneError").textContent = "";
    document.getElementById("contactMessageError").textContent = "";

    contactName.classList.remove("valid", "invalid");
    contactPhone.classList.remove("valid", "invalid");
    contactMessage.classList.remove("valid", "invalid");

}
// ==========================================
// COURSE SEARCH / FILTER
// ==========================================

const courseClass = document.getElementById("courseClass");
const courseSubject = document.getElementById("courseSubject");

const searchCourseBtn =
    document.querySelector(".search-course-btn");

// ==========================================
// DYNAMIC SUBJECT OPTIONS
// ==========================================

// Subjects offered for each class group.
// Used by both the course search bar and the registration form.

const subjectsByClass = {

    "1-5": [
        { value: "all", label: "All Subjects" }
    ],

    "6-10": [
        { value: "maths", label: "Maths" },
        { value: "science", label: "Science" },
        { value: "english", label: "English" }
    ],

    "11-12": [
        { value: "biology", label: "Biology" },
        { value: "chemistry", label: "Chemistry" }
    ]

};


function updateSubjectOptions(classSelect, subjectSelect) {

    const subjects = subjectsByClass[classSelect.value] || [];

    // Clear previous subject options
    subjectSelect.innerHTML =
        '<option value="">Choose Subject</option>';

    subjects.forEach(function(item) {

        const option = document.createElement("option");

        option.value = item.value;
        option.textContent = item.label;

        subjectSelect.appendChild(option);

    });

}


courseClass.addEventListener("change", function() {

    updateSubjectOptions(courseClass, courseSubject);

});


studentClass.addEventListener("change", function() {

    updateSubjectOptions(studentClass, subject);

});


// Show the right subjects as soon as the page loads

updateSubjectOptions(courseClass, courseSubject);
updateSubjectOptions(studentClass, subject);


searchCourseBtn.addEventListener("click", function() {

    const selectedClass = courseClass.value;
    const selectedSubject = courseSubject.value;


    // Remove previous highlights

    const courseCards =
        document.querySelectorAll(".course-card");

    courseCards.forEach(function(card) {

        card.classList.remove("highlight");

    });


    // Check if class is selected

    if (selectedClass === "") {

        alert("Please select a class.");

        return;
    }


    let selectedCard;


    // Find matching card

    if (selectedClass === "1-5") {

        selectedCard =
            document.getElementById("course1to5");

    }

    else if (selectedClass === "6-10") {

        selectedCard =
            document.getElementById("course6to10");

    }

    else if (selectedClass === "11-12") {

        selectedCard =
            document.getElementById("course11to12");

    }


    // Subject validation

    if (selectedSubject === "") {

        alert("Please select a subject.");

        return;
    }


    // Highlight selected course

    selectedCard.classList.add("highlight");


    // Scroll to Courses section

    document.getElementById("courses").scrollIntoView({
        behavior: "smooth"
    });

});

// ==========================================
// ANIMATED STATISTICS COUNTERS
// ==========================================

const counters = document.querySelectorAll(".counter");


function startCounters() {

    counters.forEach(function(counter) {

        const target = Number(counter.getAttribute("data-target"));

        let count = 0;

        const increment = Math.ceil(target / 60);


        const updateCounter = function() {

            count += increment;


            if (count < target) {

                counter.textContent = count;

                setTimeout(updateCounter, 30);

            } else {

                counter.textContent = target;

            }

        };


        updateCounter();

    });

}


// Start the counters the first time the section comes into view.
// If this never runs, the numbers stay as written in the HTML.

if ("IntersectionObserver" in window) {

    const statsObserver =
        new IntersectionObserver(function(entries) {

            if (entries[0].isIntersecting) {

                startCounters();

                statsObserver.disconnect();

            }

        });

    statsObserver.observe(
        document.querySelector(".stats-section")
    );

}


// ==========================================
// COURSE CARD BUTTONS
// ==========================================

// "Know More" opens the registration form with that class selected

const courseButtons = document.querySelectorAll(".course-btn");

courseButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        studentClass.value = button.getAttribute("data-class");

        updateSubjectOptions(studentClass, subject);

        document.getElementById("registration").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// ==========================================
// MOBILE NAVIGATION MENU
// ==========================================

const mainNavbar = document.querySelector(".main-navbar");
const navToggle = document.querySelector(".nav-toggle");

const navLinks =
    document.querySelectorAll(".navbar-container a");


navToggle.addEventListener("click", function() {

    const isOpen = mainNavbar.classList.toggle("open");

    navToggle.setAttribute("aria-expanded", isOpen);

});


// Close the menu after a link is chosen

navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        mainNavbar.classList.remove("open");

        navToggle.setAttribute("aria-expanded", "false");

    });

});
/* =========================================================
   FEEDBACK SYSTEM - SCRIPT
   ---------------------------------------------------------
   Every page loads this one file. Each "setup" function
   checks for an element that only exists on its own page,
   so it does nothing on the other pages.

   1. Sample data
   2. Helpers
   3. Login pages
   4. Assignments page
   5. Attempts page
   6. Upload page
   7. Account Settings page
   ========================================================= */


/* =========================================================
   1. SAMPLE DATA
   This would come from the server in a real app.
   Attempts are listed newest first.
   ========================================================= */

const assignments = {
  zoo1a: {
    name: "Zoo 1A",
    fileName: "Zoo 1A Lee.zip",
    attempts: [
      {
        status: "warning",
        date: "September 14, 2026",
        time: "5:05 PM",
        file: "Zoo 1A Lee.zip",
        feedback:
          "Step 3 does not match the expected code. The <strong>Animal</strong> class is missing the <strong>Weight</strong> property."
      },
      {
        status: "warning",
        date: "September 14, 2026",
        time: "4:42 PM",
        file: "Zoo1A.zip",
        feedback:
          "Submitted file must be named <strong>Zoo 1A Lee.zip</strong>, but it is named <strong>Zoo1A.zip</strong>. Please correct the filename and resubmit."
      }
    ]
  },

  zoo1b: {
    name: "Zoo 1B",
    fileName: "Zoo 1B Lee.zip",
    attempts: [
      {
        status: "success",
        date: "September 13, 2026",
        time: "3:20 PM",
        file: "Zoo 1B Lee.zip",
        feedback: "Every step matches the expected code. No errors found."
      }
    ]
  },

  zoo1c: {
    name: "Zoo 1C",
    fileName: "Zoo 1C Lee.zip",
    attempts: [
      {
        status: "success",
        date: "September 20, 2026",
        time: "10:15 AM",
        file: "Zoo 1C Lee.zip",
        feedback: "Every step matches the expected code. No errors found."
      },
      {
        status: "warning",
        date: "September 19, 2026",
        time: "8:30 PM",
        file: "Zoo 1C Lee.zip",
        feedback:
          "Step 2 does not match the expected code. Check the <strong>Feed()</strong> method in <strong>Zookeeper.cs</strong>."
      }
    ]
  },

  zoo2a: {
    name: "Zoo 2A",
    fileName: "Zoo 2A Lee.zip",
    attempts: [
      {
        status: "success",
        date: "September 27, 2026",
        time: "1:48 PM",
        file: "Zoo 2A Lee.zip",
        feedback: "Every step matches the expected code. No errors found."
      }
    ]
  }
};

// Label, icon, and badge style for each status
const statuses = {
  success: {
    label: "Submitted",
    icon: "fa-circle-check",
    badge: "badge-success"
  },
  warning: {
    label: "Needs Attention",
    icon: "fa-circle-exclamation",
    badge: "badge-warning"
  },
  danger: {
    label: "Something Went Wrong",
    icon: "fa-triangle-exclamation",
    badge: "badge-danger"
  }
};


/* =========================================================
   2. HELPERS
   ========================================================= */

// Shows a success or error message under a form.
function showMessage(element, text, type) {
  element.textContent = text;
  element.className = "form-message form-message-" + type;
  element.hidden = false;
}

// Returns true if the two password boxes match. Shows an error if not.
function checkPasswordsMatch(passwordInput, confirmInput, messageElement) {
  if (passwordInput.value !== confirmInput.value) {
    showMessage(messageElement, "Passwords do not match. Please try again.", "error");
    confirmInput.focus();
    return false;
  }

  return true;
}

// Reads the assignment from the URL, e.g. attempts.html?assignment=zoo1a
// Falls back to Zoo 1A if the URL is missing or wrong.
function getAssignmentId() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("assignment");

  if (assignments[id]) {
    return id;
  }

  return "zoo1a";
}

// Builds the HTML for a status badge.
function createBadge(status) {
  const info = statuses[status];

  return `
    <span class="badge ${info.badge}">
      <i class="fa-solid ${info.icon}" aria-hidden="true"></i>
      ${info.label}
    </span>
  `;
}

// Changes a button's text for 2 seconds, then puts it back.
function flashButtonText(button, text) {
  const originalText = button.textContent;
  button.textContent = text;

  setTimeout(function () {
    button.textContent = originalText;
  }, 2000);
}


/* =========================================================
   3. LOGIN PAGES
   ========================================================= */

function setupLoginPage() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const message = document.getElementById("login-message");

  // Coming from Create Account (index.html?created=yes)
  const params = new URLSearchParams(window.location.search);
  if (params.get("created") === "yes") {
    showMessage(message, "Your account was created. Please log in.", "success");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    // A real site would check the email and password on the server here.
    window.location.href = "assignments.html";
  });
}

function setupCreateAccountPage() {
  const form = document.getElementById("create-account-form");
  if (!form) return;

  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");
  const message = document.getElementById("create-message");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (checkPasswordsMatch(password, confirmPassword, message)) {
      window.location.href = "index.html?created=yes";
    }
  });
}

function setupForgotPasswordPage() {
  const form = document.getElementById("forgot-form");
  if (!form) return;

  const message = document.getElementById("forgot-message");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showMessage(
      message,
      "If an account uses that email, a reset link is on its way. Check your inbox.",
      "success"
    );
    form.reset();
  });
}


/* =========================================================
   4. ASSIGNMENTS PAGE
   Shows only the rows for the selected course.
   ========================================================= */

function setupAssignmentsPage() {
  const courseSelect = document.getElementById("course-select");
  if (!courseSelect) return;

  const rows = document.querySelectorAll("#assignment-rows tr[data-course]");
  const emptyRow = document.getElementById("no-assignments");
  const count = document.getElementById("assignment-count");

  function showCourseAssignments() {
    let visibleCount = 0;

    rows.forEach(function (row) {
      const inCourse = row.dataset.course === courseSelect.value;
      row.hidden = !inCourse;

      if (inCourse) {
        visibleCount++;
      }
    });

    emptyRow.hidden = visibleCount > 0;

    if (visibleCount === 1) {
      count.textContent = "1 Assignment";
    } else {
      count.textContent = visibleCount + " Assignments";
    }
  }

  courseSelect.addEventListener("change", showCourseAssignments);
  showCourseAssignments();
}


/* =========================================================
   5. ATTEMPTS PAGE
   Fills the page with the selected assignment's attempts.
   ========================================================= */

function setupAttemptsPage() {
  const attemptList = document.getElementById("attempt-list");
  if (!attemptList) return;

  const id = getAssignmentId();
  const assignment = assignments[id];
  const attempts = assignment.attempts;
  const latest = attempts[0];

  // Page title and resubmit button
  document.title = "Feedback System - " + assignment.name + " Attempts";
  document.getElementById("assignment-title").textContent = assignment.name;
  document.getElementById("resubmit-link").href = "upload.html?assignment=" + id;

  // Summary bar
  document.getElementById("total-attempts").textContent = attempts.length;
  document.getElementById("latest-submission").textContent = latest.date;
  document.getElementById("current-status").innerHTML = createBadge(latest.status);

  // One <article> per attempt. Newest attempt has the highest number.
  let html = "";

  attempts.forEach(function (attempt, index) {
    const number = attempts.length - index;
    const icon = statuses[attempt.status].icon;

    html += `
      <article class="attempt-item" id="attempt-${number}">
        <div class="attempt-header">
          <div>
            <div class="attempt-title-row">
              <h3>Attempt ${number}</h3>
              ${createBadge(attempt.status)}
            </div>
            <p class="submission-date">Submitted ${attempt.date} at ${attempt.time}</p>
          </div>

          <button type="button" class="btn btn-outline copy-link" data-attempt="${number}">
            Copy Results Link
          </button>
        </div>

        <div class="feedback-block feedback-${attempt.status}">
          <p class="feedback-heading">
            <i class="fa-solid ${icon}" aria-hidden="true"></i>
            Feedback Results
          </p>
          <p class="feedback-message">${attempt.feedback}</p>
        </div>

        <p class="submitted-file">
          <i class="fa-solid fa-file-zipper" aria-hidden="true"></i>
          ${attempt.file}
        </p>
      </article>
    `;
  });

  attemptList.innerHTML = html;

  // If the link points at one attempt (#attempt-2), scroll to it
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView();
    }
  }

  // Copy Results Link: copies a link to that specific attempt
  const copyButtons = document.querySelectorAll(".copy-link");

  copyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const pageUrl = window.location.href.split("#")[0];
      const link = pageUrl + "#attempt-" + button.dataset.attempt;

      if (!navigator.clipboard) {
        flashButtonText(button, "Copy Failed");
        return;
      }

      navigator.clipboard
        .writeText(link)
        .then(function () {
          flashButtonText(button, "Link Copied!");
        })
        .catch(function () {
          flashButtonText(button, "Copy Failed");
        });
    });
  });
}


/* =========================================================
   6. UPLOAD PAGE
   ========================================================= */

function setupUploadPage() {
  const form = document.getElementById("upload-form");
  if (!form) return;

  const id = getAssignmentId();
  const assignment = assignments[id];
  const attemptsPage = "attempts.html?assignment=" + id;

  const fileInput = document.getElementById("assignment-file");
  const selectedFile = document.getElementById("selected-file");
  const message = document.getElementById("upload-message");

  // Fill in the assignment details
  document.title = "Feedback System - Upload " + assignment.name;
  document.getElementById("upload-title").textContent = "Upload " + assignment.name;
  document.getElementById("required-name").textContent = assignment.fileName;
  document.getElementById("back-link").href = attemptsPage;
  document.getElementById("cancel-link").href = attemptsPage;

  // Show the name of the chosen file
  fileInput.addEventListener("change", function () {
    message.hidden = true;

    if (fileInput.files.length > 0) {
      selectedFile.textContent = "Selected file: " + fileInput.files[0].name;
      selectedFile.hidden = false;
    } else {
      selectedFile.hidden = true;
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (fileInput.files.length === 0) {
      showMessage(message, "Please choose a ZIP file to upload.", "error");
      return;
    }

    // Catch the most common mistake before it uses up an attempt
    const fileName = fileInput.files[0].name;

    if (fileName !== assignment.fileName) {
      showMessage(
        message,
        "Your file is named \"" + fileName + "\" but must be named \"" +
          assignment.fileName + "\". Rename it and try again.",
        "error"
      );
      return;
    }

    // A real site would upload the file to the server here.
    showMessage(
      message,
      "Your assignment was submitted. Your feedback results will appear on the Attempts page.",
      "success"
    );
    form.reset();
    selectedFile.hidden = true;
  });
}


/* =========================================================
   7. ACCOUNT SETTINGS PAGE
   ========================================================= */

function setupAccountSettingsPage() {
  const infoForm = document.getElementById("info-form");
  if (!infoForm) return;

  const infoMessage = document.getElementById("info-message");

  infoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    showMessage(infoMessage, "Your information was saved.", "success");
  });

  // Cancel puts the fields back to how they were and hides old messages
  infoForm.addEventListener("reset", function () {
    infoMessage.hidden = true;
  });

  const passwordForm = document.getElementById("password-form");
  const passwordMessage = document.getElementById("password-message");
  const newPassword = document.getElementById("new-password");
  const confirmPassword = document.getElementById("confirm-password");

  passwordForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (checkPasswordsMatch(newPassword, confirmPassword, passwordMessage)) {
      passwordForm.reset();
      showMessage(passwordMessage, "Your password was updated.", "success");
    }
  });

  passwordForm.addEventListener("reset", function () {
    passwordMessage.hidden = true;
  });
}


/* =========================================================
   RUN
   ========================================================= */

setupLoginPage();
setupCreateAccountPage();
setupForgotPasswordPage();
setupAssignmentsPage();
setupAttemptsPage();
setupUploadPage();
setupAccountSettingsPage();

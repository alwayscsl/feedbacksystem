/* =========================================================
   FEEDBACK SYSTEM - SCRIPT
   ========================================================= */

/* =========================================================
   1. SAMPLE DATA
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
          "Step 3 does not match the expected code. The <strong>Animal</strong> class is missing the <strong>Weight</strong> property.",
      },
      {
        status: "warning",
        date: "September 14, 2026",
        time: "4:42 PM",
        file: "Zoo1A.zip",
        feedback:
          "Submitted file must be named <strong>Zoo 1A Lee.zip</strong>, but it is named <strong>Zoo1A.zip</strong>. Please correct the filename and resubmit.",
      },
    ],
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
        feedback: "Every step matches the expected code. No errors found.",
      },
    ],
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
        feedback: "Every step matches the expected code. No errors found.",
      },
      {
        status: "warning",
        date: "September 19, 2026",
        time: "8:30 PM",
        file: "Zoo 1C Lee.zip",
        feedback:
          "Step 2 does not match the expected code. Check the <strong>Feed()</strong> method in <strong>Zookeeper.cs</strong>.",
      },
    ],
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
        feedback: "Every step matches the expected code. No errors found.",
      },
    ],
  },
};

/* =========================================================
   2. STATUS INFORMATION
   ========================================================= */

const statuses = {
  success: {
    label: "Submitted",
    icon: "fa-circle-check",
    iconColor: "icon-success",
    badge: "badge-success",
    nextStep:
      "You're all set. There's no need to submit this assignment again.",
  },

  warning: {
    label: "Needs Attention",
    icon: "fa-circle-exclamation",
    iconColor: "icon-warning",
    badge: "badge-warning",
    nextStep:
      "Fix the issues above, then choose your updated file and submit again.",
  },

  none: {
    label: "Not Submitted",
    icon: "fa-circle-xmark",
    iconColor: "icon-muted",
    badge: "badge-muted",
    nextStep:
      "This attempt doesn't count. Check your ZIP file, then choose it and submit again.",
  },

  danger: {
    label: "Something Went Wrong",
    icon: "fa-triangle-exclamation",
    iconColor: "icon-danger",
    badge: "badge-danger",
    nextStep:
      "Please submit again. If this keeps happening, ask for help in the ITEC Slack channel.",
  },
};

/* =========================================================
   3. RANDOM TEST RESULTS
   ========================================================= */

const testResults = [
  {
    status: "success",
    weight: 4,
    feedback: ["Every step matches the expected code. No errors found."],
  },

  {
    status: "warning",
    weight: 4,
    feedback: [
      "Step 3 does not match the expected code. The <strong>Animal</strong> class is missing the <strong>Weight</strong> property.",
      "Step 2 does not match the expected code. Check the <strong>Feed()</strong> method in <strong>Zookeeper.cs</strong>.",
      "Steps 1 through 4 match the expected code, but step 5 does not. The <strong>Cage</strong> class constructor should set the <strong>Capacity</strong> property.",
      "Every step matches the expected code, but there are 2 StyleCop warnings in <strong>Program.cs</strong>. Add a documentation comment to <strong>Main()</strong> and remove the extra blank line at the end of the file.",
    ],
  },

  {
    status: "none",
    weight: 1,
    feedback: [
      "Your ZIP file doesn't contain a Visual Studio project (<strong>.csproj</strong> file), so there was nothing to check.",
      "Your ZIP file is empty, so there was nothing to check.",
    ],
  },

  {
    status: "danger",
    weight: 2,
    feedback: [
      "Your project could not be built, so it couldn't be compared to the expected code. Make sure it builds in Visual Studio before you zip it.",
      "The feedback system couldn't finish checking your submission. This wasn't caused by your code.",
    ],
  },
];

function getTestResult() {
  let totalWeight = 0;

  testResults.forEach(function (result) {
    totalWeight += result.weight;
  });

  let randomNumber = Math.random() * totalWeight;

  for (const result of testResults) {
    if (randomNumber < result.weight) {
      const randomIndex = Math.floor(Math.random() * result.feedback.length);

      return {
        status: result.status,
        feedback: result.feedback[randomIndex],
      };
    }

    randomNumber -= result.weight;
  }

  return {
    status: "success",
    feedback: "Every step matches the expected code. No errors found.",
  };
}

/* =========================================================
   4. SAVED SUBMISSIONS
   ========================================================= */

const STORAGE_KEY = "feedbackSubmissions-v3";

function getSavedSubmissions() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return {};
  }

  return JSON.parse(saved);
}

function saveSubmission(assignmentId, attempt) {
  const saved = getSavedSubmissions();

  if (!saved[assignmentId]) {
    saved[assignmentId] = [];
  }

  saved[assignmentId].unshift(attempt);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

function getAttempts(assignmentId) {
  const saved = getSavedSubmissions();

  return [
    ...(saved[assignmentId] || []),
    ...assignments[assignmentId].attempts,
  ];
}

/* =========================================================
   5. HELPER FUNCTIONS
   ========================================================= */

function showMessage(element, text, type, icon) {
  element.textContent = text;

  element.classList.remove("form-message-success", "form-message-error");

  element.classList.add("form-message-" + type);

  if (icon) {
    const iconElement = document.createElement("i");

    iconElement.className = "fa-solid " + icon;

    element.prepend(iconElement);
  }

  element.hidden = false;
}

function checkPasswordsMatch(password, confirmPassword, message) {
  if (password.value !== confirmPassword.value) {
    showMessage(message, "Passwords do not match. Please try again.", "error");

    confirmPassword.focus();

    return false;
  }

  return true;
}

function getAssignmentId() {
  const params = new URLSearchParams(window.location.search);

  const id = params.get("assignment");

  return assignments[id] ? id : "zoo1a";
}

function createBadge(status) {
  const info = statuses[status];

  return `
    <span class="badge ${info.badge}">
      <i class="fa-solid ${info.icon}"></i>
      ${info.label}
    </span>
  `;
}

function createAttemptDetails(attempt, number) {
  const info = statuses[attempt.status];

  return `
    <div class="attempt-title-row">
      <h3>Attempt ${number}</h3>
      ${createBadge(attempt.status)}
    </div>

    <p class="submission-date">
      Submitted ${attempt.date} at ${attempt.time}
    </p>

    <div class="feedback-block feedback-${attempt.status}">
      <p class="feedback-heading">
        <i class="fa-solid ${info.icon}"></i>
        Feedback Results
      </p>

      <p class="feedback-message">
        ${attempt.feedback}
      </p>
    </div>

    <p class="submitted-file">
      <i class="fa-solid fa-file-zipper"></i>
      ${attempt.file}
    </p>
  `;
}

function flashButtonText(button, text) {
  const originalText = button.textContent;

  button.textContent = text;

  setTimeout(function () {
    button.textContent = originalText;
  }, 2000);
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + " bytes";
  }

  if (bytes < 1024 * 1024) {
    return Math.round(bytes / 1024) + " KB";
  }

  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/* =========================================================
   6. LOGIN PAGES
   ========================================================= */

function setupLoginPage() {
  const form = document.getElementById("login-form");

  if (!form) {
    return;
  }

  const message = document.getElementById("login-message");

  const params = new URLSearchParams(window.location.search);

  if (params.get("created") === "yes") {
    showMessage(message, "Your account was created. Please log in.", "success");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    window.location.href = "assignments.html";
  });
}

function setupCreateAccountPage() {
  const form = document.getElementById("create-account-form");

  if (!form) {
    return;
  }

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

  if (!form) {
    return;
  }

  const message = document.getElementById("forgot-message");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    showMessage(
      message,
      "If an account uses that email, a reset link is on its way. Check your inbox.",
      "success",
    );

    form.reset();
  });
}

/* =========================================================
   7. ASSIGNMENTS PAGE
   ========================================================= */

function setupAssignmentsPage() {
  const courseSelect = document.getElementById("course-select");

  if (!courseSelect) {
    return;
  }

  const rows = document.querySelectorAll("#assignment-rows tr[data-course]");

  const emptyRow = document.getElementById("no-assignments");

  const count = document.getElementById("assignment-count");

  function showAssignments() {
    let visibleCount = 0;

    rows.forEach(function (row) {
      const matchesCourse = row.dataset.course === courseSelect.value;

      row.hidden = !matchesCourse;

      if (matchesCourse) {
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

  function updateStatuses() {
    rows.forEach(function (row) {
      const link = row.querySelector(".assignment-link");

      const label = row.querySelector(".status-label");

      if (!link || !label) {
        return;
      }

      const params = new URLSearchParams(link.search);

      const id = params.get("assignment");

      if (!assignments[id]) {
        return;
      }

      const attempts = getAttempts(id);

      if (attempts.length === 0) {
        return;
      }

      const latestAttempt = attempts[0];

      const info = statuses[latestAttempt.status];

      label.innerHTML = `
        <i class="fa-solid ${info.icon} ${info.iconColor}"></i>
        ${info.label}
      `;
    });
  }

  courseSelect.addEventListener("change", showAssignments);

  showAssignments();
  updateStatuses();
}

/* =========================================================
   8. ATTEMPTS PAGE
   ========================================================= */

function setupAttemptsPage() {
  const attemptList = document.getElementById("attempt-list");

  if (!attemptList) {
    return;
  }

  const id = getAssignmentId();

  const assignment = assignments[id];

  const attempts = getAttempts(id);

  const latest = attempts[0];

  document.title = "Feedback System - " + assignment.name + " Attempts";

  document.getElementById("assignment-title").textContent = assignment.name;

  document.getElementById("resubmit-link").href =
    "upload.html?assignment=" + id;

  document.getElementById("total-attempts").textContent = attempts.length;

  document.getElementById("latest-submission").textContent = latest.date;

  document.getElementById("current-status").innerHTML = createBadge(
    latest.status,
  );

  let html = "";

  attempts.forEach(function (attempt, index) {
    const number = attempts.length - index;

    const info = statuses[attempt.status];

    html += `
      <article
        class="attempt-item"
        id="attempt-${number}"
      >

        <div class="attempt-header">

          <div>
            <div class="attempt-title-row">
              <h3>Attempt ${number}</h3>
              ${createBadge(attempt.status)}
            </div>

            <p class="submission-date">
              Submitted ${attempt.date} at ${attempt.time}
            </p>
          </div>

          <button
            type="button"
            class="btn btn-outline copy-link"
            data-attempt="${number}"
          >
            Copy Results Link
          </button>

        </div>

        <div class="feedback-block feedback-${attempt.status}">
          <p class="feedback-heading">
            <i class="fa-solid ${info.icon}"></i>
            Feedback Results
          </p>

          <p class="feedback-message">
            ${attempt.feedback}
          </p>
        </div>

        <p class="submitted-file">
          <i class="fa-solid fa-file-zipper"></i>
          ${attempt.file}
        </p>

      </article>
    `;
  });

  attemptList.innerHTML = html;

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);

    if (target) {
      target.scrollIntoView();
    }
  }

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
   9. UPLOAD PAGE
   ========================================================= */

const MAX_FILE_SIZE = 25 * 1024 * 1024;

function getFileProblem(file, requiredName) {
  if (!file) {
    return "Please choose a ZIP file to upload.";
  }

  if (!file.name.toLowerCase().endsWith(".zip")) {
    return (
      '"' +
      file.name +
      '" is not a ZIP file. Compress your project folder into a .zip file and choose it again.'
    );
  }

  if (file.name !== requiredName) {
    return (
      'Your file is named "' +
      file.name +
      '" but must be named "' +
      requiredName +
      '". Rename it and choose it again.'
    );
  }

  if (file.size === 0) {
    return (
      '"' +
      file.name +
      '" is empty. Make sure you zipped the right folder and choose it again.'
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return (
      '"' +
      file.name +
      '" is ' +
      formatFileSize(file.size) +
      ". Files must be 25 MB or smaller."
    );
  }

  return "";
}

function uploadFile(onProgress) {
  return new Promise(function (resolve, reject) {
    let percent = 0;
    let timer;

    function failUpload() {
      clearInterval(timer);

      window.removeEventListener("offline", failUpload);

      reject(new Error("offline"));
    }

    if (!navigator.onLine) {
      reject(new Error("offline"));
      return;
    }

    window.addEventListener("offline", failUpload);

    timer = setInterval(function () {
      percent = Math.min(100, percent + 5 + Math.random() * 10);

      onProgress(Math.round(percent));

      if (percent >= 100) {
        clearInterval(timer);

        window.removeEventListener("offline", failUpload);

        setTimeout(resolve, 300);
      }
    }, 150);
  });
}

function getFeedback() {
  return new Promise(function (resolve) {
    setTimeout(
      function () {
        resolve(getTestResult());
      },
      1000 + Math.random() * 1000,
    );
  });
}

function setupUploadPage() {
  const form = document.getElementById("upload-form");

  if (!form) {
    return;
  }

  const id = getAssignmentId();

  const assignment = assignments[id];

  const attemptsPage = "attempts.html?assignment=" + id;

  const fileInput = document.getElementById("assignment-file");

  const selectedFile = document.getElementById("selected-file");

  const message = document.getElementById("upload-message");

  const cancelLink = document.getElementById("cancel-link");

  const submitButton = document.getElementById("submit-button");

  const originalButton = submitButton.innerHTML;

  const progress = document.getElementById("upload-progress");

  const progressFill = document.getElementById("upload-progress-fill");

  const progressText = document.getElementById("upload-progress-text");

  const progressPercent = document.getElementById("upload-progress-percent");

  const result = document.getElementById("submission-result");

  const resultHeading = document.getElementById("result-heading");

  const resultDetails = document.getElementById("result-details");

  document.title = "Feedback System - Upload " + assignment.name;

  document.getElementById("upload-title").textContent =
    "Upload " + assignment.name;

  document.getElementById("required-name").textContent = assignment.fileName;

  document.getElementById("back-link").href = attemptsPage;

  cancelLink.href = attemptsPage;

  function setProgress(percent) {
    progressFill.style.width = percent + "%";

    progressPercent.textContent = percent + "%";
  }

  function setUploading(isUploading) {
    fileInput.disabled = isUploading;
    submitButton.disabled = isUploading;

    if (isUploading) {
      window.addEventListener("beforeunload", warnBeforeLeaving);
    } else {
      window.removeEventListener("beforeunload", warnBeforeLeaving);
    }
  }

  function warnBeforeLeaving(event) {
    event.preventDefault();
    event.returnValue = "";
  }

  fileInput.addEventListener("change", function () {
    message.hidden = true;

    const file = fileInput.files[0];

    if (!file) {
      selectedFile.hidden = true;
      return;
    }

    selectedFile.textContent =
      "Selected file: " + file.name + " (" + formatFileSize(file.size) + ")";

    selectedFile.hidden = false;

    const problem = getFileProblem(file, assignment.fileName);

    if (problem) {
      showMessage(message, problem, "error", "fa-circle-exclamation");
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (submitButton.disabled) {
      return;
    }

    const file = fileInput.files[0];

    const problem = getFileProblem(file, assignment.fileName);

    if (problem) {
      showMessage(message, problem, "error", "fa-circle-exclamation");

      return;
    }

    message.hidden = true;
    result.hidden = true;

    setUploading(true);

    submitButton.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';

    setProgress(0);

    progress.hidden = false;

    progressText.textContent = "Uploading " + file.name + "...";

    uploadFile(setProgress)
      .then(function () {
        submitButton.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> Getting Feedback...';

        progressText.textContent = "Upload complete. Getting your feedback...";

        return getFeedback();
      })

      .then(function (feedback) {
        const now = new Date();

        const attempt = {
          status: feedback.status,

          date: now.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),

          time: now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),

          file: file.name,

          feedback: feedback.feedback,
        };

        saveSubmission(id, attempt);

        const attemptNumber = getAttempts(id).length;

        resultDetails.innerHTML =
          createAttemptDetails(attempt, attemptNumber) +
          '<p class="result-next">' +
          statuses[attempt.status].nextStep +
          "</p>";

        setUploading(false);

        progress.hidden = true;
        result.hidden = false;

        submitButton.innerHTML = originalButton;

        form.reset();

        selectedFile.hidden = true;

        cancelLink.style.display = "none";

        resultHeading.focus();
      })

      .catch(function () {
        setUploading(false);

        progress.hidden = true;

        submitButton.innerHTML = originalButton;

        showMessage(
          message,
          "Upload failed. We couldn't reach the server, so your file was not submitted. Check your internet connection, then click Submit Assignment to try again. Your file is still selected.",
          "error",
          "fa-triangle-exclamation",
        );

        submitButton.focus();
      });
  });
}

/* =========================================================
   10. ACCOUNT SETTINGS
   ========================================================= */

function setupAccountSettingsPage() {
  const infoForm = document.getElementById("info-form");

  if (!infoForm) {
    return;
  }

  const infoMessage = document.getElementById("info-message");

  infoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    showMessage(infoMessage, "Your information was saved.", "success");
  });

  infoForm.addEventListener("reset", function () {
    infoMessage.hidden = true;
  });

  const passwordForm = document.getElementById("password-form");

  const passwordMessage = document.getElementById("password-message");

  const newPassword = document.getElementById("new-password");

  const confirmPassword = document.getElementById("confirm-password");

  passwordForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const passwordsMatch = checkPasswordsMatch(
      newPassword,
      confirmPassword,
      passwordMessage,
    );

    if (passwordsMatch) {
      passwordForm.reset();

      showMessage(passwordMessage, "Your password was updated.", "success");
    }
  });

  passwordForm.addEventListener("reset", function () {
    passwordMessage.hidden = true;
  });
}

/* =========================================================
   START SCRIPT
   ========================================================= */

setupLoginPage();
setupCreateAccountPage();
setupForgotPasswordPage();
setupAssignmentsPage();
setupAttemptsPage();
setupUploadPage();
setupAccountSettingsPage();

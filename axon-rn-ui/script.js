// script.js (The Definitive, Complete "Magic Loop" Masterpiece)

// --- 1. DEFINE OUR GLOBAL CONSTANTS ---
const API_URL = "https://axon-rn-api.vercel.app/api/explain"; // Ensure this is your correct, live Vercel API URL

// --- 2. GET REFERENCES TO ALL HTML ELEMENTS ---
const explainForm = document.getElementById("explain-form");
const conceptInput = document.getElementById("concept-input");
const explainButton = document.getElementById("explain-button");
const outputSection = document.getElementById("output-section");
const welcomeModal = document.getElementById("welcome-modal");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const welcomeMessageSpan = document.getElementById("welcome-message");
const breadcrumbContainer = document.getElementById("breadcrumb-container");

// --- 3. STATE MANAGEMENT ---
let sessionHistory = []; // Our "memory" for the learning path
let currentExplanationData = null; // Holds the data for the current view

// --- 4. PERSONAL TUTOR LOGIC ---
const checkUser = () => {
  const userName = localStorage.getItem("axonUserName");
  if (!userName) {
    welcomeModal.classList.remove("hidden");
  } else {
    welcomeMessageSpan.textContent = `Welcome back, ${userName}. Let's make nursing school simple today!`;
  }
};

const saveUserName = (event) => {
  event.preventDefault();
  const userName = nameInput.value.trim();
  if (userName) {
    localStorage.setItem("axonUserName", userName);
    welcomeModal.classList.add("hidden");
    welcomeMessageSpan.textContent = `Welcome, ${userName}! Let's get started.`;
  }
};

// --- 5. MAIN EXPLANATION LOGIC ---
const handleExplain = async (event, isDrillDown = false) => {
  event.preventDefault();
  const concept = conceptInput.value.trim();
  if (!concept) return;

  if (!isDrillDown) {
    sessionHistory = [];
  }

  explainButton.disabled = true;
  explainButton.textContent = "Thinking...";
  breadcrumbContainer.innerHTML = "";
  outputSection.innerHTML = `
    <div class="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md animate-fade-in">
        <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <h3 class="mt-4 text-lg font-semibold text-gray-700">Forging Your Clarity Card...</h3>
        <p class="mt-1 text-sm text-gray-500">This can take a moment. Our AI is doing some deep thinking!</p>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept }),
    });
    if (!response.ok) {
      const e = await response.json();
      throw new Error(
        e.message || "The AI is having a tough time. Please try again."
      );
    }

    currentExplanationData = await response.json();
    sessionHistory.push(currentExplanationData);

    // --- MAGIC LOOP STEP 1: PRIME ---
    showMissionModal(currentExplanationData.missionQuestion);
  } catch (error) {
    console.error("Error fetching explanation:", error);
    renderError(error.message);
  }
};

// --- 6. MAGIC LOOP UI FUNCTIONS ---
const showMissionModal = (question) => {
  const modalHtml = `
        <div id="mission-backdrop" class="fixed inset-0 bg-black bg-opacity-60 z-20 flex justify-center items-center p-4 animate-fade-in">
            <div class="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full text-center">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">🚀 Your One-Minute Mission</h2>
                <p class="text-gray-600 mb-6">Find the answer to this one key question in the visual map:</p>
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-8">
                    <p class="text-blue-800 font-semibold text-lg">${question}</p>
                </div>
                <button id="start-mission-btn" class="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700">Start Mission</button>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML("beforeend", modalHtml);
  document
    .getElementById("start-mission-btn")
    .addEventListener("click", startMission);
};

const startMission = () => {
  document.getElementById("mission-backdrop")?.remove();
  // --- MAGIC LOOP STEP 2: INSIGHT ---
  renderSuccess(currentExplanationData);
};

// --- 7. UI RENDERING LOGIC ---
const renderSuccess = (data) => {
  renderBreadcrumbs();

  const storyListHtml =
    data.explanationBullets && Array.isArray(data.explanationBullets)
      ? data.explanationBullets.map((bullet) => `<li>${bullet}</li>`).join("")
      : "<li>The story for this topic will appear here.</li>";

  const successHtml = `
        <div class="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${
              data.title || "Untitled"
            }</h2>
            <p class="italic text-gray-600 mb-4"><strong>Analogy:</strong> ${
              data.analogy || "No analogy provided."
            }</p>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">The Story</h3>
                    <ol class="list-decimal pl-5 space-y-2 text-gray-700">${storyListHtml}</ol>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">The Visual Map</h3>
                    <div class="p-4 bg-gray-50 rounded-lg border" id="diagram-wrapper">${
                      data.diagramHtml || "<p>No diagram provided.</p>"
                    }</div>
                </div>
            </div>
            
            <div id="solidify-container"></div>
            <div id="feedback-container"></div>
            ${createReportIssueHtml()}
        </div>
    `;
  outputSection.innerHTML = successHtml;

  // Re-enable the explain button now that the result is rendered.
  explainButton.disabled = false;
  explainButton.textContent = "Explain";

  attachEventListeners();

  // --- MAGIC LOOP STEP 3: SOLIDIFY ---
  setTimeout(() => {
    showSolidifyPrompt(data.solidifyQuestion);
  }, 7000); // 7-second delay
};

const renderError = (message) => {
  breadcrumbContainer.innerHTML = "";
  outputSection.innerHTML = `
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-fade-in" role="alert">
            <p class="font-bold">An Error Occurred</p>
            <p>${message}</p>
        </div>
    `;
};

const renderBreadcrumbs = () => {
  if (sessionHistory.length <= 1) {
    breadcrumbContainer.innerHTML = "";
    return;
  }
  const breadcrumbLinks = sessionHistory
    .map((step, index) => {
      if (index === sessionHistory.length - 1) {
        return `<span class="font-semibold text-gray-800">${step.title}</span>`;
      }
      return `<a href="#" class="breadcrumb-link hover:underline text-blue-600" data-index="${index}">${step.title}</a>`;
    })
    .join(' <span class="mx-2 text-gray-400">&gt;</span> ');
  breadcrumbContainer.innerHTML = `<div class="p-4 bg-gray-100 rounded-lg animate-fade-in text-sm"><strong>Your Path:</strong> ${breadcrumbLinks}</div>`;
};

// --- 8. EVENT LISTENER & INTERACTIVITY LOGIC ---
const handleBreadcrumbClick = (event) => {
  if (event.target.classList.contains("breadcrumb-link")) {
    event.preventDefault();
    const index = parseInt(event.target.dataset.index, 10);
    sessionHistory = sessionHistory.slice(0, index + 1);
    currentExplanationData = sessionHistory[index]; // Update the current data
    renderSuccess(currentExplanationData);
  }
};

const attachEventListeners = () => {
  // Breadcrumbs need to be handled at a higher level now
  // This listener is moved to the initialization step.

  const nodeLinks = document.querySelectorAll(".node-link");
  nodeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const newConcept = link.dataset.concept;
      if (newConcept) {
        conceptInput.value = newConcept;
        handleExplain(new Event("submit"), true);
      }
    });
  });
};

const showSolidifyPrompt = (question) => {
  const container = document.getElementById("solidify-container");
  if (!container) return;

  const solidifyHtml = `
        <div class="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
            <h3 class="text-lg font-bold text-gray-800 text-center">✅ Mission Complete!</h3>
            <p class="text-center text-gray-600 mt-2 mb-4">${
              question || "In one simple sentence, how would you explain this?"
            }</p>
            <form id="solidify-form" class="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
                <input id="solidify-input" type="text" placeholder="Type your simple summary here..." class="flex-grow border-2 rounded-md px-4 py-2" required />
                <button type="submit" class="bg-green-600 text-white font-semibold px-6 py-2 rounded-md">Lock it in</button>
            </form>
        </div>
    `;
  container.innerHTML = solidifyHtml;

  document.getElementById("solidify-form").addEventListener("submit", (e) => {
    e.preventDefault();
    container.innerHTML = `<div class="mt-8 pt-6 border-t text-center animate-fade-in"><p class="text-xl font-bold text-green-600">Excellent! 🧠✨ Your knowledge is locked in.</p></div>`;
    showFeedbackPrompt();
  });
};

const showFeedbackPrompt = () => {
  const container = document.getElementById("feedback-container");
  if (container) {
    container.innerHTML = createFeedbackHtml();
    document
      .getElementById("feedback-yes")
      ?.addEventListener("click", handleFeedbackClick);
    document
      .getElementById("feedback-no")
      ?.addEventListener("click", handleFeedbackClick);
  }
};

// --- 9. "KINDNESS & TRUST LAYER" LOGIC ---
const createFeedbackHtml = () => {
  return `
        <div id="feedback-section" class="mt-8 pt-6 border-t border-gray-200 text-center">
            <h4 class="text-md font-semibold text-gray-700 mb-3">Did this explanation build your confidence?</h4>
            <div class="flex justify-center gap-3">
                <button id="feedback-yes" class="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">👍 Yes</button>
                <button id="feedback-no" class="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors">👎 Still Confusing</button>
            </div>
        </div>
    `;
};

const handleFeedbackClick = () => {
  const feedbackSection = document.getElementById("feedback-section");
  if (feedbackSection) {
    feedbackSection.innerHTML = `<p class="text-gray-600 font-semibold animate-fade-in">Thank you for your feedback! 🙏</p>`;
  }
};

const createReportIssueHtml = () => {
  const recipientEmail = "axonrn.dev@gmail.com";
  const emailSubject = "Axon RN Explanation Issue";
  const emailBody =
    "Hello Axon RN Founders,\n\nI found an issue with an explanation. Here are the details:\n\n[Please describe the concept you searched for and what was wrong]\n\nThank you!";
  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;
  return `
        <div class="mt-6 text-center">
            <a href="${mailtoLink}" class="text-xs text-gray-500 hover:text-blue-600 hover:underline">Report an issue with this explanation</a>
        </div>
    `;
};

// --- 10. INITIALIZE THE APPLICATION ---
document.addEventListener("DOMContentLoaded", checkUser);
nameForm.addEventListener("submit", saveUserName);
explainForm.addEventListener("submit", (event) => handleExplain(event, false));
// We add one master listener for breadcrumbs
breadcrumbContainer.addEventListener("click", handleBreadcrumbClick);

// script.js (The Final, Complete, "Magic Loop" Version)

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
const missionBackdrop = document.getElementById("mission-modal-backdrop");
const missionContent = document.getElementById("mission-modal-content");

let currentExplanationData = null; // A global variable to hold our data between steps

// --- 3. PERSONAL TUTOR LOGIC ---
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

// --- 4. MAIN EXPLANATION LOGIC (THE START OF THE LOOP) ---
const handleExplain = async (event) => {
  event.preventDefault();
  const concept = conceptInput.value.trim();
  if (!concept) return;

  explainButton.disabled = true;
  explainButton.textContent = "Thinking...";
  outputSection.innerHTML = `
    <div class="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md animate-fade-in">
        <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <h3 class="mt-4 text-lg font-semibold text-gray-700">Forging Your Clarity Card...</h3>
        <p class="mt-1 text-sm text-gray-500">This can take a moment. Our AI is doing some deep thinking!</p>
    </div>
  `;

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

    // MAGIC LOOP STEP 1: PRIME
    showMissionModal(currentExplanationData.missionQuestion);
  } catch (error) {
    renderError(error.message);
    explainButton.disabled = false;
    explainButton.textContent = "Explain";
  }
};

// --- 5. MAGIC LOOP UI FUNCTIONS ---
const showMissionModal = (question) => {
  missionContent.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-4">🚀 Your One-Minute Mission</h2>
        <p class="text-gray-600 mb-6">Find the answer to this one key question in the visual map:</p>
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-8">
            <p class="text-blue-800 font-semibold text-lg">${
              question || "Find the most important step."
            }</p>
        </div>
        <button id="start-mission-btn" class="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700">Start Mission</button>
    `;
  missionBackdrop.classList.remove("hidden");
  document
    .getElementById("start-mission-btn")
    .addEventListener("click", startMission);
};

const startMission = () => {
  missionBackdrop.classList.add("hidden");
  // MAGIC LOOP STEP 2: INSIGHT
  renderSuccess(currentExplanationData);
};

// --- 6. UI RENDERING LOGIC ---
const renderSuccess = (data) => {
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
                <div class="p-4 bg-gray-50 rounded-lg border">${
                  data.diagramHtml || "<p>No diagram provided.</p>"
                }</div>
            </div>
        </div>
        ${createFeedbackHtml()}
        ${createReportIssueHtml()}
    </div>
  `;
  outputSection.innerHTML = successHtml;

  explainButton.disabled = false;
  explainButton.textContent = "Explain";

  document
    .getElementById("feedback-yes")
    ?.addEventListener("click", handleFeedbackClick);
  document
    .getElementById("feedback-no")
    ?.addEventListener("click", handleFeedbackClick);
};

const renderError = (message) => {
  outputSection.innerHTML = `
    <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-fade-in" role="alert">
        <p class="font-bold">An Error Occurred</p>
        <p>${message}</p>
    </div>
  `;
};

// --- 7. "KINDNESS & TRUST LAYER" LOGIC ---
const createFeedbackHtml = () => `... [unchanged] ...`;
const handleFeedbackClick = () => {
  /* ... unchanged ... */
};
const createReportIssueHtml = () => `... [unchanged] ...`;

// --- 8. INITIALIZE THE APPLICATION ---
document.addEventListener("DOMContentLoaded", checkUser);
nameForm.addEventListener("submit", saveUserName);
explainForm.addEventListener("submit", handleExplain);

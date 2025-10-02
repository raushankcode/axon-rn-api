// script.js (The Ultimate Nursing Companion Version)

// --- 1. CONSTANTS & ELEMENTS ---
const API_URL = "https://axon-rn-api.vercel.app/api/explain";
const explainForm = document.getElementById("explain-form");
const conceptInput = document.getElementById("concept-input");
const explainButton = document.getElementById("explain-button");
const outputSection = document.getElementById("output-section");
const welcomeModal = document.getElementById("welcome-modal");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const welcomeMessageSpan = document.getElementById("welcome-message");

let currentExplanationData = null;
let currentMood = "confident"; // Default mood

// --- 2. PERSONAL TUTOR LOGIC WITH EMOTIONAL INTELLIGENCE ---
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
    setupEmotionalSupport();
  }
};

// --- 3. EMOTIONAL SUPPORT SYSTEM ---
const setupEmotionalSupport = () => {
  // Create mood selector if it doesn't exist
  if (!document.getElementById("mood-selector")) {
    const moodHTML = `
      <div id="mood-selector" class="mb-4 p-4 bg-white rounded-lg shadow-sm">
        <p class="text-sm text-gray-600 mb-2">How are you feeling about this?</p>
        <div class="flex space-x-2">
          <button class="mood-btn px-3 py-2 rounded-lg text-sm transition-all ${
            currentMood === "confident"
              ? "bg-green-100 border-2 border-green-500"
              : "bg-gray-100"
          }" data-mood="confident">
            😊 Confident
          </button>
          <button class="mood-btn px-3 py-2 rounded-lg text-sm transition-all ${
            currentMood === "stressed"
              ? "bg-orange-100 border-2 border-orange-500"
              : "bg-gray-100"
          }" data-mood="stressed">
            😥 Stressed
          </button>
          <button class="mood-btn px-3 py-2 rounded-lg text-sm transition-all ${
            currentMood === "confused"
              ? "bg-blue-100 border-2 border-blue-500"
              : "bg-gray-100"
          }" data-mood="confused">
            😵 Confused
          </button>
          <button class="mood-btn px-3 py-2 rounded-lg text-sm transition-all ${
            currentMood === "rushed"
              ? "bg-purple-100 border-2 border-purple-500"
              : "bg-gray-100"
          }" data-mood="rushed">
            ⏰ Rushed
          </button>
        </div>
        <div id="mood-display" class="mt-2 text-xs text-gray-500"></div>
      </div>
    `;
    conceptInput.insertAdjacentHTML("beforebegin", moodHTML);

    // Bind mood events
    document.querySelectorAll(".mood-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        setEmotionalState(e.target.dataset.mood);
      });
    });
  }
};

const setEmotionalState = (mood) => {
  currentMood = mood;
  const moods = {
    confident: "😊 Great! Let's build on that confidence!",
    stressed:
      "😥 I understand this can be overwhelming. We'll go step by step.",
    confused:
      "😵 No worries! Many students find this challenging. Let's clarify it together.",
    rushed:
      "⏰ Short on time? Let me give you the most essential insights first.",
  };

  // Update button states
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.remove(
      "bg-green-100",
      "bg-orange-100",
      "bg-blue-100",
      "bg-purple-100",
      "border-2",
      "border-green-500",
      "border-orange-500",
      "border-blue-500",
      "border-purple-500"
    );
    btn.classList.add("bg-gray-100");
    if (btn.dataset.mood === mood) {
      const colorClasses = {
        confident: "bg-green-100 border-2 border-green-500",
        stressed: "bg-orange-100 border-2 border-orange-500",
        confused: "bg-blue-100 border-2 border-blue-500",
        rushed: "bg-purple-100 border-2 border-purple-500",
      };
      btn.classList.add(colorClasses[mood]);
    }
  });

  document.getElementById("mood-display").textContent = moods[mood];
};

// --- 4. MAIN EXPLANATION LOGIC WITH ENHANCED COMPANION FEATURES ---
const handleExplain = async (event) => {
  event.preventDefault();
  const concept = conceptInput.value.trim();
  if (!concept) return;

  explainButton.disabled = true;
  explainButton.textContent = getLoadingMessage();

  // Show enhanced loading state based on mood
  outputSection.innerHTML = createLoadingScreen(currentMood);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        concept: concept,
        context: currentMood,
      }),
    });

    if (!response.ok) {
      const e = await response.json();
      throw new Error(e.message || "An error occurred.");
    }

    currentExplanationData = await response.json();

    // Track progress for analytics
    trackProgress(currentExplanationData);

    // Show mission modal with emotional context
    showMissionModal(currentExplanationData);
  } catch (error) {
    renderError(error.message);
  } finally {
    explainButton.disabled = false;
    explainButton.textContent = "Explain Concept";
  }
};

const getLoadingMessage = () => {
  const messages = {
    confident: "Building your expertise...",
    stressed: "Breaking this down gently...",
    confused: "Finding the perfect explanation...",
    rushed: "Getting the essentials ready...",
  };
  return messages[currentMood] || "Thinking...";
};

const createLoadingScreen = (mood) => {
  const loadingMessages = {
    confident: "You've got this! Crafting your learning experience...",
    stressed:
      "Taking a deep breath together. Breaking this into manageable pieces...",
    confused: "No worries! Finding the clearest way to explain this...",
    rushed: "Fast-tracking the most important insights for you...",
  };

  return `
    <div class="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md animate-fade-in">
      <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <h3 class="text-lg font-semibold text-gray-700">${loadingMessages[mood]}</h3>
      <p class="mt-2 text-sm text-gray-500">Your nursing companion is working hard for you 💙</p>
    </div>
  `;
};

// --- 5. ENHANCED MAGIC LOOP WITH CLINICAL COMPANION FEATURES ---
const showMissionModal = (data) => {
  const modalHtml = `
    <div id="mission-backdrop" class="fixed inset-0 bg-black bg-opacity-60 z-20 flex justify-center items-center p-4 animate-fade-in">
      <div class="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-auto">
        <!-- Emotional Hook -->
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-4">
          <p class="text-blue-800">${data.emotionalHook}</p>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-4">🚀 Your Clinical Mission</h2>
        <p class="text-gray-600 mb-2">Find the answer to this key clinical question in the visual map:</p>
        
        <!-- Mission Question -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-6 rounded-lg mb-6">
          <p class="text-blue-800 font-semibold text-lg text-center">${data.missionQuestion}</p>
        </div>
        
        <!-- Quick Preview -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
          <p class="text-yellow-800 text-sm">
            <span class="font-bold">💡 Pro Tip:</span> Look for the highlighted node in the diagram. This is your answer!
          </p>
        </div>
        
        <div class="flex space-x-4">
          <button id="start-mission-btn" class="flex-1 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Start Mission
          </button>
          <button id="need-hint-btn" class="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Need a Hint?
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  document
    .getElementById("start-mission-btn")
    .addEventListener("click", () => startMission(data));
  document
    .getElementById("need-hint-btn")
    .addEventListener("click", () => showHint(data));
};

const showHint = (data) => {
  // Remove existing hint if any
  document.getElementById("mission-hint")?.remove();

  const hintHtml = `
    <div id="mission-hint" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
      <p class="text-green-800 text-sm">
        <span class="font-bold">🧩 Hint:</span> Look for the node that explains "${data.explanationBullets[0]
          .split("→")[0]
          .trim()}"
      </p>
    </div>
  `;

  document
    .querySelector("#mission-backdrop .bg-gradient-to-r")
    .insertAdjacentHTML("afterend", hintHtml);
};

const startMission = (data) => {
  document.getElementById("mission-backdrop")?.remove();
  renderSuccess(data);
};

// --- 6. ENHANCED UI RENDERING WITH ALL COMPANION FEATURES ---
const renderSuccess = (data) => {
  const storyListHtml =
    data.explanationBullets && Array.isArray(data.explanationBullets)
      ? data.explanationBullets
          .map(
            (bullet, index) =>
              `<li class="mb-2 p-2 bg-white rounded border-l-4 border-blue-300">${bullet}</li>`
          )
          .join("")
      : "<li>The story for this topic will appear here.</li>";

  const successHtml = `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 class="text-3xl font-bold mb-2">${data.title || "Untitled"}</h2>
        <p class="text-blue-100 text-lg">${
          data.clinicalAnalogy || "No analogy provided."
        }</p>
      </div>

      <div class="p-6 space-y-8">
        <!-- Confidence Builder -->
        <div class="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-4 rounded-lg">
          <p class="text-green-800 font-semibold">${
            data.confidenceBuilder || "You're doing great! Keep going!"
          }</p>
        </div>

        <!-- Visual Map Section -->
        <section>
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="bg-blue-100 p-2 rounded-lg mr-3">🗺️</span>
            Clinical Pathway Map
          </h3>
          <div class="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-200">
            ${data.diagramHtml || "<p>No diagram provided.</p>"}
          </div>
        </section>

        <!-- The Clinical Story -->
        <section>
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="bg-purple-100 p-2 rounded-lg mr-3">📖</span>
            The Clinical Story
          </h3>
          <ol class="space-y-3 text-gray-700 bg-white p-4 rounded-lg border">${storyListHtml}</ol>
        </section>

        <!-- Quick Clinical Check -->
        <section>
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="bg-yellow-100 p-2 rounded-lg mr-3">⚡</span>
            Quick Clinical Check
          </h3>
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <ul class="list-disc list-inside space-y-2 text-yellow-800">
              ${
                data.quickClinicalCheck &&
                Array.isArray(data.quickClinicalCheck)
                  ? data.quickClinicalCheck
                      .map((item) => `<li>${item}</li>`)
                      .join("")
                  : "<li>No clinical checks provided.</li>"
              }
            </ul>
          </div>
        </section>

        <!-- Clinical Pearl & NCLEX Tip Side by Side -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Clinical Pearl -->
          <section>
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span class="bg-green-100 p-2 rounded-lg mr-3">💡</span>
              Clinical Pearl
            </h3>
            <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <p class="text-green-800">${
                data.clinicalPearl || "No clinical pearl provided."
              }</p>
            </div>
          </section>

          <!-- NCLEX Tip -->
          <section>
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span class="bg-red-100 p-2 rounded-lg mr-3">📝</span>
              NCLEX Success Tip
            </h3>
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p class="text-red-800">${
                data.nclexTip || "No NCLEX tip provided."
              }</p>
            </div>
          </section>
        </div>

        <!-- Next Steps -->
        <section>
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="bg-purple-100 p-2 rounded-lg mr-3">🚀</span>
            Your Next Steps
          </h3>
          <div class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
            <ul class="list-disc list-inside space-y-2 text-purple-800">
              ${
                data.nextSteps && Array.isArray(data.nextSteps)
                  ? data.nextSteps.map((step) => `<li>${step}</li>`).join("")
                  : "<li>No next steps provided.</li>"
              }
            </ul>
          </div>
        </section>

        <!-- Enhanced Feedback System -->
        <div class="border-t pt-6 mt-6">
          <div class="text-center">
            <p class="text-gray-600 mb-4">How was your learning experience?</p>
            <div class="flex justify-center space-x-4">
              <button class="feedback-btn px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" data-rating="1">
                😕 Still Confused
              </button>
              <button class="feedback-btn px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors" data-rating="2">
                😊 Helpful
              </button>
              <button class="feedback-btn px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors" data-rating="3">
                🌟 Game Changer!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  outputSection.innerHTML = successHtml;

  // Apply custom styles for diagram nodes
  applyDiagramStyles();

  // Bind enhanced feedback events
  bindFeedbackEvents();
};

// --- 7. ENHANCED DIAGRAM STYLING ---
const applyDiagramStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    .is-highlighted {
      border: 3px solid #2563eb !important;
      background-color: #dbeafe !important;
      transform: scale(1.05);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
    .is-clinical-pearl {
      border: 2px solid #059669 !important;
      background-color: #dcfce7 !important;
      box-shadow: 0 2px 8px rgba(5, 150, 105, 0.1);
    }
    .is-safety-alert {
      border: 2px solid #dc2626 !important;
      background-color: #fecaca !important;
      animation: pulse 2s infinite;
    }
    .is-confidence-builder {
      border: 2px solid #7c3aed !important;
      background-color: #ede9fe !important;
      box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    
    /* Enhanced diagram node styling */
    [class*="bg-"] {
      transition: all 0.3s ease;
    }
    [class*="bg-"]:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `;
  document.head.appendChild(style);
};

// --- 8. PROGRESS TRACKING & ANALYTICS ---
const trackProgress = (data) => {
  const progress = JSON.parse(localStorage.getItem("axon_progress") || "[]");
  const session = {
    concept: data.concept || data.title,
    timestamp: data.timestamp || new Date().toISOString(),
    mood: currentMood,
    confidence: "in-progress",
  };

  progress.push(session);
  localStorage.setItem("axon_progress", JSON.stringify(progress.slice(-50))); // Keep last 50 sessions
};

// --- 9. ENHANCED FEEDBACK SYSTEM ---
const bindFeedbackEvents = () => {
  document.querySelectorAll(".feedback-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      submitFeedback(e.target.dataset.rating);
    });
  });
};

const submitFeedback = (rating) => {
  const messages = {
    1: "Thanks for your honesty! Let's try a different approach. What specifically was confusing?",
    2: "Glad it helped! We'll keep improving for you 💙",
    3: "Amazing! Your future patients will benefit from this knowledge! 🏥",
  };

  // Show appreciation message
  const feedbackBtn = document.querySelector(
    `.feedback-btn[data-rating="${rating}"]`
  );
  const originalText = feedbackBtn.textContent;
  feedbackBtn.textContent = "✓ Thank you!";
  feedbackBtn.classList.add("opacity-50");

  // Track feedback
  const feedback = {
    rating: parseInt(rating),
    concept: currentExplanationData?.concept || currentExplanationData?.title,
    timestamp: new Date().toISOString(),
  };

  const allFeedback = JSON.parse(localStorage.getItem("axon_feedback") || "[]");
  allFeedback.push(feedback);
  localStorage.setItem("axon_feedback", JSON.stringify(allFeedback));

  setTimeout(() => {
    feedbackBtn.textContent = originalText;
    feedbackBtn.classList.remove("opacity-50");
  }, 2000);
};

// --- 10. ERROR HANDLING WITH EMOTIONAL SUPPORT ---
const renderError = (message) => {
  const errorHtml = `
    <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg animate-fade-in">
      <div class="flex items-center mb-3">
        <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
          <span class="text-red-500">⚠️</span>
        </div>
        <h3 class="text-lg font-semibold text-red-800">Temporary Learning Hurdle</h3>
      </div>
      <p class="text-red-700 mb-4">${message}</p>
      <div class="bg-red-100 p-4 rounded-md">
        <p class="text-red-600 text-sm">
          <span class="font-semibold">Don't worry!</span> Even the best nurses encounter obstacles. 
          Try rephrasing your question or take a quick break and come back. You've got this! 💪
        </p>
      </div>
      <button id="retry-btn" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
        Try Again
      </button>
    </div>
  `;

  outputSection.innerHTML = errorHtml;
  document.getElementById("retry-btn").addEventListener("click", () => {
    conceptInput.focus();
  });
};

// --- 11. INITIALIZE THE NURSING COMPANION ---
document.addEventListener("DOMContentLoaded", () => {
  checkUser();
  setupEmotionalSupport();
});

nameForm.addEventListener("submit", saveUserName);
explainForm.addEventListener("submit", handleExplain);

// Enter key support
conceptInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleExplain(e);
  }
});

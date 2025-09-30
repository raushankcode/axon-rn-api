// script.js

// --- 1. DEFINE THE API URL ---
// CRUCIAL: Replace this with your actual live Vercel API URL.
const API_URL = "https://axon-rn-api.vercel.app/api/explain";

// --- 2. GET REFERENCES TO OUR HTML ELEMENTS ---
// We get our "tools" from the HTML so we can work with them.
const explainForm = document.getElementById("explain-form");
const conceptInput = document.getElementById("concept-input");
const explainButton = document.getElementById("explain-button");
const outputSection = document.getElementById("output-section");

// --- 3. THE MAIN FUNCTION: HANDLE THE EXPLANATION ---
const handleExplain = async (event) => {
  // Prevent the form from reloading the page
  event.preventDefault();

  const concept = conceptInput.value.trim();
  if (!concept) {
    // Don't do anything if the input is empty
    return;
  }

  // --- Start the Loading State ---
  explainButton.disabled = true;
  explainButton.textContent = "Thinking...";
  outputSection.innerHTML = `
        <div class="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md animate-fade-in">
            <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <h3 class="mt-4 text-lg font-semibold text-gray-700">Forging Your Clarity Card...</h3>
            <p class="mt-1 text-sm text-gray-500">This can take a moment. Our AI is doing some deep thinking!</p>
        </div>
    `;

  // --- Call Our Brain (The API) ---
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept: concept }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Something went wrong on the server."
      );
    }

    const data = await response.json();
    renderSuccess(data);
  } catch (error) {
    console.error("Error fetching explanation:", error);
    renderError(error.message);
  } finally {
    // --- End the Loading State ---
    explainButton.disabled = false;
    explainButton.textContent = "Explain";
  }
};

// --- 4. HELPER FUNCTIONS TO RENDER THE UI ---

// This function builds the "Aha!" moment card
const renderSuccess = (data) => {
  // We build the final HTML for the explanation card as a string.
  const successHtml = `
        <div class="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${data.title}</h2>
            <p class="italic text-gray-600 mb-4">
                <strong>Analogy:</strong> ${data.analogy}
            </p>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
                        The Story
                    </h3>
                    <ol class="list-decimal pl-5 space-y-2 text-gray-700">
                        ${data.explanationBullets
                          .map((bullet) => `<li>${bullet}</li>`)
                          .join("")}
                    </ol>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
                        The Visual Map
                    </h3>
                    ${data.diagramHtml}
                </div>
            </div>
        </div>
    `;
  // We inject this beautiful HTML into our output section.
  outputSection.innerHTML = successHtml;
};

// This function builds the error message card
const renderError = (message) => {
  const errorHtml = `
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-fade-in" role="alert">
            <p class="font-bold">An Error Occurred</p>
            <p>${message}</p>
        </div>
    `;
  outputSection.innerHTML = errorHtml;
};

// --- 5. ATTACH THE EVENT LISTENER ---
// We tell the form to run our 'handleExplain' function when it is submitted.
explainForm.addEventListener("submit", handleExplain);

// api/explain.js (The Final, Victorious, Simplified Version)

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { concept } = req.body;
    if (!concept) {
      return res.status(400).json({ message: "Concept is required." });
    }

    /// The Final "Clinical Storyteller" Prompt for api/explain.js

    const prompt = `
      ROLE: You are "Axon," an expert nursing educator and a master of clinical reasoning.
      TASK: Generate a complete learning module as a single JSON object that tells a "cause and effect" story.

      CONCEPT: "${concept}"

      JSON STRUCTURE:
      Output a single, valid JSON object with the exact keys: "title", "analogy", "explanationBullets", and "diagramHtml".

      RULES FOR "diagramHtml":
      1.  **Tell a Story:** The diagram must not be a simple checklist. It must first show the underlying PATHOPHYSIOLOGY (the "problem cascade"). Then, it must show the NURSING INTERVENTIONS as actions that interrupt or solve steps in that cascade.
      2.  **Use Visual Language:**
          *   Problem/Pathophysiology steps should have a light red or yellow background (e.g., bg-red-50, bg-yellow-50).
          *   Nursing Intervention steps should have a light green or blue background (e.g., bg-green-50, bg-blue-50).
          *   Use emojis to add clarity (e.g., Problem 🔥, Intervention 🛡️).
      3.  **Layout is Key:** Use flexbox to create a clear, logical flow. Interventions can branch off or point to the problems they solve.
      4.  The entire output must be a single line of HTML text.

      RULES FOR OTHER KEYS:
      1.  "analogy": Create an analogy that explains the "cause and effect" relationship.
      2.  "explanationBullets": Write a narrative that explains the storyboard, step-by-step.

      EXAMPLE for "Nursing Priorities for DKA":
      {
        "title": "Nursing Priorities for Diabetic Ketoacidosis (DKA)",
        "analogy": "Imagine a city (the body) that can't use its main fuel (sugar). It starts burning garbage (fat) to survive, but this creates toxic smoke (ketones) that pollutes the entire city. Our job is to restore the main fuel line (insulin) and clean the air (fluids & electrolytes).",
        "explanationBullets": [
          "The core problem in DKA is a lack of insulin, which prevents the body from using glucose for energy.",
          "This forces the body to burn fat, producing acidic ketones as a byproduct.",
          "High ketones lead to metabolic acidosis, while high glucose leads to severe dehydration.",
          "Our primary interventions are to administer insulin to stop ketone production and to give IV fluids to rehydrate the patient."
        ],
        "diagramHtml": "<div class='font-sans'><div class='flex justify-center items-start space-x-4'><div class='flex flex-col items-center space-y-2'><div class='p-3 border rounded-lg bg-red-50 shadow-sm w-52 text-center'><p class='font-semibold text-red-800'>1. Lack of Insulin 🚫</p></div><p class='text-2xl'>↓</p><div class='p-3 border rounded-lg bg-yellow-50 shadow-sm w-52 text-center'><p class='font-semibold text-yellow-800'>2. Body Burns Fat 🔥</p></div><p class='text-2xl'>↓</p><div class='p-3 border rounded-lg bg-yellow-50 shadow-sm w-52 text-center'><p class='font-semibold text-yellow-800'>3. Ketones (Acid) Produced</p></div><p class='text-2xl'>↓</p><div class='p-3 border rounded-lg bg-red-50 shadow-sm w-52 text-center'><p class='font-semibold text-red-800'>4. Acidosis & Dehydration</p></div></div><div class='flex flex-col items-center space-y-2 mt-24'><div class='p-3 border rounded-lg bg-green-50 shadow-sm w-52 text-center'><p class='font-semibold text-green-800'>Intervention: Insulin 💉</p></div><p class='text-2xl text-green-500'>→</p><p class='text-2xl text-green-500'>→</p><div class='p-3 border rounded-lg bg-blue-50 shadow-sm w-52 text-center'><p class='font-semibold text-blue-800'>Intervention: IV Fluids 💧</p></div></div></div></div>"
      }
    `;
    // The rest of your api/explain.js file is unchanged

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        // We have REMOVED the strict 'response_format' to give the AI more flexibility.
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Error from OpenAI API.");
    }

    const data = await response.json();
    // We now have to parse the text content from the response.
    const rawContent = data.choices[0].message.content;
    const firstBrace = rawContent.indexOf("{");
    const lastBrace = rawContent.lastIndexOf("}");
    const jsonString = rawContent.substring(firstBrace, lastBrace + 1);

    res.status(200).json(JSON.parse(jsonString));
  } catch (error) {
    console.error("Server-side error:", error.message);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

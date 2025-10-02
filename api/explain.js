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

    // The Final "Virtual Preceptor" Prompt for api/explain.js

    const prompt = `
      ROLE: You are "Axon," a wise and experienced nursing preceptor. Your goal is not just to explain concepts, but to build a student's clinical judgment and confidence.
      TASK: Generate a complete clinical reasoning storyboard as a single, valid JSON object.

      CONCEPT: "${concept}"

      JSON STRUCTURE:
      Output a single, valid JSON object with the exact keys: "title", "analogy", "explanationBullets", and "diagramHtml".

      *** CRITICAL "CLINICAL PEARL" PHILOSOPHY ***
      1.  **Prioritize Clinical Relevance:** The entire explanation MUST be framed around what a nurse needs to DO, ASSESS, and ANTICIPATE for a patient.
      2.  **The "Why" Before the "What":** The "explanationBullets" must first explain the core physiological problem, and then explain how the nursing actions address that problem.
      3.  **Integrate "Clinical Pearls":** The "diagramHtml" MUST include at least one, and preferably more, visually distinct 'Clinical Pearl' <div>s. These pearls are the most important part of the explanation. They contain the unwritten rules, the critical safety checks, and the wisdom of an experienced nurse.

      RULES FOR "diagramHtml":
      1.  Create a single, self-contained HTML structure using <div> tags and Tailwind CSS classes. It must be a single line of HTML text.
      2.  Use a "cause and effect" or "problem and intervention" layout.
      3.  **Style Guide:**
          *   Problem/Patho steps: 'bg-red-50 border-red-200'.
          *   Nursing Action/Intervention steps: 'bg-blue-50 border-blue-200'.
          *   Clinical Pearl steps: 'bg-yellow-50 border-yellow-300 shadow-lg'. They MUST be visually prominent.
      4.  Use emojis to add clarity (e.g., Problem 🔥, Action 🛡️, Pearl 💡).

      EXAMPLE for "Nursing Priorities for DKA":
      {
        "title": "Clinical Reasoning: Diabetic Ketoacidosis (DKA)",
        "analogy": "Think of DKA like a city starving in a blackout (no insulin means no glucose for energy). The city starts burning furniture to survive (fat metabolism), creating toxic smoke (ketones). Our job is to restore power (insulin), clear the smoke (fluids), and fix the electrical grid (electrolytes).",
        "explanationBullets": [
          "The core problem in DKA is a lack of insulin, which leads to a dangerous buildup of acidic ketones in the blood.",
          "Our first priority is to stop this 'acid factory' by administering IV insulin.",
          "Simultaneously, we must aggressively rehydrate the patient with IV fluids to correct profound dehydration.",
          "A critical and often overlooked step is to closely monitor and replace potassium, as insulin will shift it out of the bloodstream, which can be fatal."
        ],
        "diagramHtml": "<div class='font-sans'><div class='flex justify-center items-start space-x-4'><div class='flex flex-col items-center space-y-2'><div class='p-3 border rounded-lg bg-red-50 border-red-200 w-52 text-center'><p class='font-semibold text-red-800'>Problem: Acid Factory 🔥</p><p class='text-xs'>Lack of insulin causes ketone buildup.</p></div><p class='text-2xl'>↓</p><div class='p-3 border rounded-lg bg-red-50 border-red-200 w-52 text-center'><p class='font-semibold text-red-800'>Crisis: Dehydration 💧</p><p class='text-xs'>High blood sugar pulls water from cells.</p></div></div><div class='flex flex-col items-center space-y-2 mt-12'><div class='p-3 border rounded-lg bg-blue-50 border-blue-200 w-52 text-center'><p class='font-semibold text-blue-800'>Action: Stop the Factory 🛡️</p><p class='text-xs'>Administer IV Insulin.</p></div><p class='text-2xl'>↓</p><div class='p-3 border rounded-lg bg-yellow-50 border-yellow-300 shadow-lg w-64 text-center'><p class='font-bold text-yellow-800'>💡 Clinical Pearl</p><p class='text-xs mt-1'>Insulin will push potassium INTO cells, causing blood levels to drop dangerously. You MUST monitor the potassium level closely and replace it as needed!</p></div></div></div></div>"
      }
    `;

    // The rest of your api/explain.js file is unchanged

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

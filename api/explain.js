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
    // The Final "Drill-Down" Prompt for api/explain.js

    const prompt = `
      ROLE: You are "Axon," a wise and experienced nursing preceptor. Your goal is to build a student's clinical judgment and confidence by creating an interactive learning storyboard.
      TASK: Generate a complete clinical reasoning storyboard as a single, valid JSON object.

      CONCEPT: "${concept}"

      JSON STRUCTURE:
      Output a single, valid JSON object with the exact keys: "title", "analogy", "explanationBullets", and "diagramHtml".

      *** CRITICAL INTERACTIVITY RULE ***
      Each node <div> in your "diagramHtml" MUST be wrapped in an <a> tag with two specific attributes:
      1. class="node-link"
      2. data-concept="..." - The value MUST be a concise, searchable topic for that specific node.
      Example: <a href="#" class="node-link" data-concept="Pathophysiology of Hypotension"><div class="...">...</div></a>

      RULES FOR "diagramHtml":
      1.  Tell a "cause and effect" story, showing pathophysiology first, then interventions.
      2.  Use a clean "Swimlane" layout with generous spacing.
      3.  Style nodes by type: Problem (red), Action (blue), Clinical Pearl (gold), etc.
      4.  The entire output must be a single line of HTML text.

      RULES FOR OTHER KEYS:
      1. "analogy": Create an analogy that explains the core clinical reasoning.
      2. "explanationBullets": Write a narrative that explains the visual storyboard, step-by-step.

      EXAMPLE for "Nursing Interventions for Sepsis":
      {
        "title": "Clinical Reasoning: Sepsis",
        "analogy": "Imagine the body as a city under attack. Our mission is to support the defences, reinforce the infrastructure, and restore order.",
        "explanationBullets": [
          "Sepsis begins with a systemic attack on the body's own tissues.",
          "This leads to a crisis of hypotension as blood vessels dilate.",
          "Our primary action is to reinforce the system with fluids and antibiotics.",
          "A key piece of wisdom is to always reassess the patient's response."
        ],
        "diagramHtml": "<div class='font-sans'><div class='flex justify-center items-start space-x-4'><div class='flex flex-col items-center space-y-2'><a href='#' class='node-link' data-concept='Systemic Inflammatory Response Syndrome'><div class='p-3 border rounded-lg bg-red-50 border-red-200 w-52 text-center'><p class='font-semibold text-red-800'>Problem: Systemic Attack 🔥</p><p class='text-xs'>Body's response to infection damages organs.</p></div></a><p class='text-2xl'>↓</p><a href='#' class='node-link' data-concept='Pathophysiology of Septic Shock'><div class='p-3 border rounded-lg bg-red-50 border-red-200 w-52 text-center'><p class='font-semibold text-red-800'>Crisis: Hypotension 💧</p><p class='text-xs'>Inflammation leads to fluid loss and low BP.</p></div></a></div><div class='flex flex-col items-center space-y-2 mt-24'><a href='#' class='node-link' data-concept='IV Fluid Resuscitation in Sepsis'><div class='p-3 border rounded-lg bg-blue-50 border-blue-200 w-52 text-center'><p class='font-semibold text-blue-800'>Action: Reinforce Infrastructure 🛡️</p><p class='text-xs'>Administer IV fluids and antibiotics promptly.</p></div></a><p class='text-2xl'>↓</p><a href='#' class='node-link' data-concept='Importance of Reassessment in Nursing'><div class='p-3 border rounded-lg bg-yellow-50 border-yellow-300 shadow-lg w-64 text-center'><p class='font-bold text-yellow-800'>💡 Clinical Pearl</p><p class='text-xs mt-1'>Always reassess the patient's response to treatment. Early recognition of changes can save lives!</p></div></a></div></div></div>"
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

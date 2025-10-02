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
    // The Final "Magic Loop" & "Clinical Pearl" Prompt

    // The new Mission-Ready Prompt for api/explain.js

    const prompt = `
      You are an expert nursing educator. Your ONLY task is to return a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON.
      The JSON object must explain the nursing concept: "${concept}".
      The JSON must have the exact keys: "title", "analogy", "missionQuestion", "explanationBullets", and "diagramHtml".

      RULES:
      1. "missionQuestion": Create one simple, clear question that a student can answer by examining the flowchart. This question MUST target the single most important learning objective.
      2. "diagramHtml": Create a simple HTML structure using divs and Tailwind CSS classes to represent a flowchart.
      3. "explanationBullets": A 1:1 narrative legend for the flowchart.

      EXAMPLE OUTPUT:
      {
        "title": "How Beta Blockers Work",
        "analogy": "They are like soft headphones that partially block adrenaline's signal to the heart.",
        "missionQuestion": "What specific part of the heart do Beta Blockers block?",
        "explanationBullets": [
          "Adrenaline binds to beta receptors to speed up the heart.",
          "Beta Blockers physically block these receptors.",
          "This results in a slower, calmer heartbeat."
        ],
        "diagramHtml": "<div class='flex flex-col items-center space-y-2'><div class='p-2 border rounded bg-gray-50'><p>Adrenaline Signal ⚡️</p></div><p>↓</p><div class='p-2 border rounded bg-gray-50'><p>Blocks Beta Receptors 🛡️</p></div><p>↓</p><div class='p-2 border rounded bg-gray-50'><p>Slower Heartbeat ❤️</p></div></div>"
      }
    `;

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

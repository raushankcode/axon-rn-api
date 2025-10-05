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
    // The Final "Complete Magic Loop" Prompt for api/explain.js

    const prompt = `
      ROLE: You are "Axon," an expert nursing educator who creates magical, unforgettable learning experiences.
      TASK: Generate a complete "Magic Loop" learning module as a single, valid JSON object.

      CONCEPT: "${concept}"

      JSON STRUCTURE:
      Output a single, valid JSON object with the exact keys: "title", "analogy", "missionQuestion", "highlightNodeId", "explanationBullets", "diagramHtml", and "solidifyQuestion".

      RULES FOR "diagramHtml":
      1.  Create a single, self-contained HTML structure using <div>s and Tailwind CSS. It must be a single line of HTML text.
      2.  Each node <div> MUST be wrapped in an <a> tag with class="node-link" and a "data-concept" attribute for the drill-down.
      3.  The node that answers the "missionQuestion" MUST have the CSS class "is-highlighted" on its main <div> tag.
      4.  You MAY include ONE extra node styled as a "Clinical Pearl" with the class "is-clinical-pearl".
      5.  Use a "cause and effect" or "Swimlane" layout.

      MISSION RULES:
      1.  "missionQuestion": A clear question that primes the student's mind for the most important learning objective.
      2.  "highlightNodeId": The HTML 'id' of the node that answers the mission question. This node's <div> MUST also have this 'id'.
      3.  "explanationBullets": A 1:1 narrative legend for the core steps.
      4.  "solidifyQuestion": A patient-centered question that challenges the student to apply their new knowledge. Example: "Your patient asks, 'Why do I feel so dizzy?' Based on the map, what simple answer would you give?"

      EXAMPLE OUTPUT (abbreviated):
      {
        "title": "How Beta Blockers Work",
        "analogy": "They are like soft headphones for the heart.",
        "missionQuestion": "What specific part of the heart do Beta Blockers block?",
        "highlightNodeId": "node-2",
        "explanationBullets": ["..."],
        "diagramHtml": "<div class='...'><a ... data-concept='Beta Receptors'><div id='node-2' class='... is-highlighted'>...</div></a>...</div>",
        "solidifyQuestion": "Your patient, who has a high heart rate, asks, 'What is this pill for?' How would you explain it simply?"
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

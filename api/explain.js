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

    const prompt = `
    ROLE: You are "Axon," an expert nursing educator who creates magical, unforgettable learning experiences.
    TASK: Generate a complete learning module as a single, valid JSON object.

    CONCEPT: "${concept}"

    JSON STRUCTURE:
    Output a single, valid JSON object with the exact keys: "title", "analogy", "missionQuestion", "highlightNodeId", "explanationBullets", and "diagramHtml".

    RULES FOR "diagramHtml":
    1.  Create a single, self-contained HTML structure using <div> and Tailwind CSS classes.
    2.  The entire output must be a single line of HTML text.
    3.  Use a clean, easy-to-read layout (flexbox).
    4.  Each node should be a styled <div>.
    5.  CRITICAL: For the node that is the answer to the "missionQuestion" (identified by "highlightNodeId"), you MUST add the CSS class "is-highlighted" to its main <div> tag.
    6.  IMPORTANT: If relevant, you MUST include one extra node styled as a "Clinical Pearl". Give this node the CSS class "is-clinical-pearl". It should contain a piece of wisdom not found in textbooks.

    MISSION RULES:
    1.  "missionQuestion": Create one simple, clear question that primes the student's mind.
    2.  "highlightNodeId": Provide the 'id' of the node that answers the mission question. You must also give that node a unique HTML 'id' attribute.
    3.  "explanationBullets": A 1:1 narrative legend for the core steps in the flowchart.

    EXAMPLE OUTPUT:
    {
      "title": "How Beta Blockers Work",
      "analogy": "They are like soft headphones that partially block adrenaline's signal to the heart.",
      "missionQuestion": "What specific part of the heart do Beta Blockers block?",
      "highlightNodeId": "node-2",
      "explanationBullets": [
        "Adrenaline, a stress signal, tries to connect with the heart's beta receptors.",
        "Beta Blocker drugs get there first, physically blocking the receptors.",
        "With the signal blocked, the heart remains calm and beats slower."
      ],
      "diagramHtml": "<div class='flex flex-col items-center space-y-2'><div id='node-1' class='p-3 border rounded-lg bg-blue-50 w-52 text-center'><p>Adrenaline Signal ⚡️</p></div><p class='text-2xl'>↓</p><div id='node-2' class='p-3 border rounded-lg bg-purple-50 w-52 text-center is-highlighted'><p>Blocks Beta Receptors 🛡️</p></div><p class='text-2xl'>↓</p><div id='node-3' class='p-3 border rounded-lg bg-green-50 w-52 text-center'><p>Calm, Slower Heartbeat ❤️</p></div><div id='node-pearl' class='p-3 border rounded-lg mt-4 w-64 text-center is-clinical-pearl'><p class='font-bold'>💡 Clinical Pearl</p><p class='text-xs mt-1'>Before giving a Beta Blocker, always check the patient's heart rate AND blood pressure. If the HR is below 60, hold the dose!</p></div></div>"
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

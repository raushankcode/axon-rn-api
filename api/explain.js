// api/explain.js (The Standalone, Heartfelt Brain)

// This is the Vercel Serverless Function syntax.
module.exports = async (req, res) => {
  // We only allow POST requests.
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { concept } = req.body;
    if (!concept) {
      return res.status(400).json({ message: "Concept is required." });
    }

    // --- THE HEARTFELT PROMPT ---
    const prompt = `
      ROLE: You are "Axon," an expert nursing educator and a master of simple, visual communication.
      TASK: Generate a complete learning module as a single JSON object.

      CONCEPT: "${concept}"

      JSON STRUCTURE:
      Output a single, valid JSON object with the exact keys: "title", "analogy", "explanationBullets", and "diagramHtml".

      RULES FOR "diagramHtml":
      1.  Create a single, self-contained HTML structure using <div> tags and Tailwind CSS classes.
      2.  The entire output must be a single line of HTML text, with no line breaks.
      3.  Use flexbox for layout (e.g., 'flex flex-col items-center space-y-2').
      4.  Each step (node) should be a <div> with rounded corners, a border, padding, and a light background color (e.g., 'p-3 border rounded-lg bg-gray-50 shadow-sm').
      5.  Use simple <p> tags with appropriate text size and weight for the content inside the nodes (e.g., 'text-sm font-semibold text-gray-800').
      6.  Connect nodes with simple arrow characters (↓ or →) inside their own <p> tags.
      7.  Include simple, relevant emojis to make it feel friendly and memorable.

      EXAMPLE OUTPUT:
      {
        "title": "How Beta Blockers Work",
        "analogy": "Imagine your heart is a drummer that adrenaline tells to beat faster. Beta Blockers are like soft headphones that partially block the signal, keeping the rhythm calm and steady.",
        "explanationBullets": [
          "Adrenaline binds to 'beta receptors' on the heart, signaling it to speed up.",
          "Beta Blocker drugs fit into these receptors, physically blocking adrenaline.",
          "With the signal blocked, the heart maintains a slower, more relaxed pace, reducing its workload."
        ],
        "diagramHtml": "<div class='flex flex-col items-center space-y-2 font-sans'><div class='p-3 border rounded-lg bg-blue-50 shadow-sm w-52 text-center'><p class='text-sm font-semibold text-blue-800'>Adrenaline Signal ⚡️</p></div><p class='text-2xl text-gray-400'>↓</p><div class='p-3 border rounded-lg bg-purple-50 shadow-sm w-52 text-center'><p class='text-sm font-semibold text-purple-800'>Blocks Beta Receptors 🛡️</p></div><p class='text-2xl text-gray-400'>↓</p><div class='p-3 border rounded-lg bg-green-50 shadow-sm w-52 text-center'><p class='text-sm font-semibold text-green-800'>Calm, Slower Heartbeat ❤️</p></div></div>"
      }
    `;

    // We will use the OpenAI API for this.
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Error from OpenAI API.");
    }

    const data = await response.json();
    const parsedContent = JSON.parse(data.choices[0].message.content);

    // Vercel's way of sending a successful response.
    res.status(200).json(parsedContent);
  } catch (error) {
    console.error("Server-side error:", error.message);
    // Vercel's way of sending an error response.
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

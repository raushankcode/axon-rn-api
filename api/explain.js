// api/explain.js (The Final Version with CORS Headers)

module.exports = async (req, res) => {
  // --- THE CORS FIX ---
  // These three lines are our "permission slip."
  // They tell the browser that any website ('*') is allowed to talk to our API.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");

  // We handle a special "preflight" request that browsers send for CORS checks.
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // The rest of our beautiful code is exactly the same.
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { concept } = req.body;
    if (!concept) {
      return res.status(400).json({ message: "Concept is required." });
    }

    const prompt = `... [Your final, Heartfelt Prompt is unchanged] ...`;

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

    res.status(200).json(parsedContent);
  } catch (error) {
    console.error("Server-side error:", error.message);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

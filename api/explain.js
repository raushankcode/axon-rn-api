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

    // The Final "Master Storyteller" Prompt for api/explain.js

    const prompt = `
      ROLE: You are "Axon," an expert nursing educator and a master of visual storytelling and information design.
      TASK: Generate a complete, cohesive learning module as a single JSON object.

      CONCEPT: "${concept}"

      JSON STRUCTURE:
      Output a single, valid JSON object with the exact keys: "title", "analogy", "explanationBullets", and "diagramHtml".

      RULES FOR "diagramHtml":
      1.  **Visual Language:** Use styled <div> tags with Tailwind CSS classes to create a beautiful and clear flowchart.
          *   Problem/Pathophysiology steps get 'bg-red-50' or 'bg-yellow-50'.
          *   Nursing Intervention steps get 'bg-green-50' or 'bg-blue-50'.
          *   Include relevant emojis for clarity.
      2.  **Layout is Key:** Use flexbox to create a clear, logical flow.

      *** CRITICAL STORYTELLING RULES ***
      3.  **For COMPARATIVE concepts (e.g., "difference between X and Y"):**
          a. You MUST create two parallel flowcharts side-by-side.
          b. The "explanationBullets" MUST be a unified narrative that guides the user through BOTH flowcharts simultaneously (e.g., "1. In an Ischemic Stroke (left), a clot blocks a vessel... while in a Hemorrhagic Stroke (right), a vessel ruptures...").
          c. Interventions MUST connect to an outcome. They cannot be dead ends.
          d. If possible, both pathways should converge on a single, shared "Outcome" node at the bottom to unify the story.
      4.  **For SINGLE concepts (e.g., "explain DKA"):**
          a. You MUST first show the underlying PATHOPHYSIOLOGY cascade.
          b. Then, you MUST show the NURSING INTERVENTIONS as actions that interrupt or solve steps in that cascade.

      RULES FOR OTHER KEYS:
      1.  "analogy": Create an analogy that explains the core relationship or process.
      2.  "explanationBullets": Write a narrative that perfectly explains the visual storyboard, step-by-step.

      EXAMPLE for "Explain the difference between an ischemic stroke and a hemorrhagic stroke.":
      {
        "title": "Understanding Ischemic vs. Hemorrhagic Stroke",
        "analogy": "Imagine a highway to the brain. An Ischemic Stroke is a traffic jam blocking a road. A Hemorrhagic Stroke is a car crash that destroys the road itself. Our job is to either clear the jam or repair the crash site.",
        "explanationBullets": [
          "1. The initial event in an Ischemic Stroke (left) is a clot blocking a vessel, while in a Hemorrhagic Stroke (right), a vessel ruptures.",
          "2. The Ischemic path leads to brain tissue being deprived of oxygen, while the Hemorrhagic path causes direct damage from bleeding and swelling.",
          "3. The primary intervention for an Ischemic Stroke is to dissolve the clot, while for a Hemorrhagic Stroke, it is to stop the bleeding.",
          "4. Both intervention paths aim for the same ultimate goal: to stabilize the patient and minimize long-term neurological damage."
        ],
        "diagramHtml": "<div class='font-sans flex justify-center space-x-8'><div class='flex flex-col items-center space-y-2'><div class='p-3 border rounded-lg bg-yellow-50 w-52 text-center'><p class='font-semibold'>1. Ischemic Stroke 🧠</p><p class='text-xs'>Clot Blocks Vessel</p></div><p class='text-2xl'>↓</p><div class='p-3 border rounded-lg bg-red-50 w-52 text-center'><p class='font-semibold'>2. Brain Tissue Deprived ❤️‍🩹</p></div><p class='text-2xl'>↓</p><div class='p-3 border rounded-lg bg-green-50 w-52 text-center'><p class='font-semibold'>3. Intervention: Clot-Busting Agents 💊</p></div></div><div class='flex flex-col items-center space-y-2'><div class='p-3 border rounded-lg bg-yellow-50 w-52 text-center'><p class='font-semibold'>1. Hemorrhagic Stroke 💥</p><p class='text-xs'>Vessel Ruptures</p></div><p class='text-2xl'>↓</p><div class='p-3 border rounded-lg bg-red-50 w-52 text-center'><p class='font-semibold'>2. Bleeding & Swelling 💧</p></div><p class='text-2xl'>↓</p><div class='p-3 border rounded-lg bg-blue-50 w-52 text-center'><p class='font-semibold'>3. Intervention: Manage Bleeding ⚙️</p></div></div></div><div class='flex justify-center mt-2'><div class='flex flex-col items-center'><p class='text-2xl'>↓</p><div class='p-3 border rounded-lg bg-yellow-50 w-64 text-center'><p class='font-semibold'>4. Outcome: Patient Stabilized ✅</p></div></div></div>"
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

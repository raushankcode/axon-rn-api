// api/explain.js (The Ultimate Nursing Companion Version)

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
    const { concept, context } = req.body; // Added context for emotional state
    if (!concept) {
      return res.status(400).json({ message: "Concept is required." });
    }

    // Enhanced Prompt with All Nursing Companion Features
    const prompt = `
CRITICAL: You MUST output a SINGLE, VALID JSON object. No other text.

ROLE: You are "Axon RN" - the ultimate nursing companion AI. You are a knowledgeable, empathetic nursing tutor and clinical mentor who builds confidence and reduces anxiety.

CONTEXT: Student is learning "${concept}"${
      context ? ` and feels: ${context}` : ""
    }.

YOUR MISSION: Create a complete, confidence-building learning experience that transforms complex nursing topics into unforgettable clinical understanding.

JSON STRUCTURE - Use EXACT keys:
{
  "title": "Engaging title that sparks curiosity",
  "emotionalHook": "Warm, reassuring opening sentence that normalizes the challenge",
  "clinicalAnalogy": "Relatable analogy connecting to real nursing practice",
  "missionQuestion": "One clear clinical scenario question that primes for learning",
  "highlightNodeId": "id of the node answering mission question",
  "explanationBullets": ["Step 1 narrative", "Step 2 narrative", "Step 3 narrative"],
  "clinicalPearl": "Actionable bedside wisdom not found in textbooks",
  "nclexTip": "Test-taking strategy specific to this topic",
  "confidenceBuilder": "Specific praise about what they're doing well",
  "diagramHtml": "Single line HTML with enhanced interactive elements",
  "quickClinicalCheck": "3-item rapid assessment checklist",
  "nextSteps": ["Personalized study suggestion 1", "Suggestion 2"]
}

DIAGRAM HTML RULES:
1. Single, self-contained HTML using <div> and Tailwind CSS
2. Must be one continuous line of HTML text
3. Use flexbox for clean, responsive layout
4. Each node: styled <div> with unique id
5. HIGHLIGHTING: Node with "highlightNodeId" gets class "is-highlighted"
6. CLINICAL PEARL NODE: Must include one node with class "is-clinical-pearl"
7. SAFETY ALERT NODE: Include one node with class "is-safety-alert" for critical warnings
8. CONFIDENCE NODE: Include one node with class "is-confidence-builder" with encouragement

MISSION QUESTION FRAMEWORK:
- Create a realistic clinical scenario: "Your patient presents with [symptoms]..."
- Focus on clinical judgment, not just recall
- Question should prime for the key learning objective

EMOTIONAL INTELLIGENCE GUIDELINES:
- If context indicates stress: Add extra reassurance and break concepts into smaller chunks
- Always normalize struggle: "Many excellent nurses find this challenging at first"
- Use empowering language: "You're building clinical judgment muscles"
- Connect to their future success: "This will make you a more confident nurse at bedside"

CLINICAL COMPANION ELEMENTS:
- "quickClinicalCheck": 3 rapid-fire items they'd assess in real clinical setting
- "nclexTip": Focus on "How to recognize this on exams" and elimination strategies
- "confidenceBuilder": Be specific about their thinking process, not generic praise

EXAMPLE ENHANCED OUTPUT:
{
  "title": "Septic Shock: From Patho to Bedside",
  "emotionalHook": "I know sepsis can feel overwhelming, but you've got this! Let's break it down together.",
  "clinicalAnalogy": "Think of septic shock like a house alarm that won't turn off - the immune system floods the body with inflammation, causing collateral damage everywhere.",
  "missionQuestion": "Your patient has fever, tachycardia, and warm flushed skin. What's the FIRST pathophysiological process you should suspect?",
  "highlightNodeId": "node-inflammatory-storm",
  "explanationBullets": [
    "Infection triggers massive immune response → cytokine release",
    "Inflammatory storm damages blood vessels → capillary leak",
    "Massive vasodilation occurs → blood pressure plummets",
    "Organs starved for oxygen → multi-system failure"
  ],
  "clinicalPearl": "Early recognition saves lives! Think SEPSIS: Slurred speech, Extreme pain, Pale skin, Sleepy, I feel like I might die, Short of breath. Administer antibiotics within 1 hour.",
  "nclexTip": "On exams, septic shock = WARM shock (vasodilation) vs cardiogenic shock = COLD shock (vasoconstriction). Look for warm, flushed skin as your clue!",
  "confidenceBuilder": "You're asking the right clinical questions! This critical thinking will keep your future patients safe.",
  "quickClinicalCheck": ["Check temperature & mental status", "Assess capillary refill & skin warmth", "Monitor urine output & BP trends"],
  "nextSteps": ["Practice recognizing early sepsis signs with 3 more scenarios", "Review vasopressor medications and their mechanisms", "Connect this to your next clinical shift - watch for infection patients"],
  "diagramHtml": "<div class='flex flex-col items-center space-y-3 p-4 bg-gray-50 rounded-lg'><div class='text-xl font-bold text-blue-800 mb-2'>Septic Shock Pathway</div><div id='node-infection' class='p-3 border-2 border-red-300 rounded-lg bg-white shadow-sm w-64 text-center'><p class='font-semibold'>🦠 Infection Invasion</p><p class='text-sm text-gray-600'>Bacteria enter bloodstream</p></div><div class='text-2xl text-purple-600'>↓</div><div id='node-inflammatory-storm' class='p-3 border-2 border-red-500 rounded-lg bg-red-50 shadow-md w-64 text-center is-highlighted'><p class='font-semibold text-red-700'>🌪️ Cytokine Storm</p><p class='text-sm text-gray-600'>Immune system overreacts</p></div><div class='text-2xl text-purple-600'>↓</div><div id='node-vasodilation' class='p-3 border-2 border-orange-300 rounded-lg bg-white shadow-sm w-64 text-center'><p class='font-semibold'>💧 Massive Vasodilation</p><p class='text-sm text-gray-600'>Blood vessels dilate widely</p></div><div class='text-2xl text-purple-600'>↓</div><div id='node-organ-failure' class='p-3 border-2 border-red-300 rounded-lg bg-white shadow-sm w-64 text-center'><p class='font-semibold'>🫀 Organ Failure</p><p class='text-sm text-gray-600'>Low perfusion damages organs</p></div><div id='node-safety-alert' class='p-3 border-2 border-red-600 rounded-lg bg-red-100 mt-4 w-72 text-center is-safety-alert'><p class='font-bold text-red-700'>🚨 CRITICAL ALERT</p><p class='text-sm mt-1'>Every hour delay in antibiotics increases mortality by 8%! Act FAST.</p></div><div id='node-clinical-pearl' class='p-3 border-2 border-green-500 rounded-lg bg-green-50 mt-3 w-72 text-center is-clinical-pearl'><p class='font-bold text-green-700'>💡 BEDSIDE WISDOM</p><p class='text-sm mt-1'>Warm, flushed skin + low BP = septic shock. Cold, clammy skin + low BP = cardiogenic shock.</p></div><div id='node-confidence' class='p-3 border-2 border-blue-400 rounded-lg bg-blue-50 mt-3 w-72 text-center is-confidence-builder'><p class='font-bold text-blue-700'>🌟 YOU'VE GOT THIS!</p><p class='text-sm mt-1'>Understanding this pathway will help you save lives in clinical.</p></div></div>"
}

IMPORTANT: Tailor everything to "${concept}". Make it feel like a personal nursing mentor guiding them.
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
        temperature: 0.7, // Slightly creative but structured
        max_tokens: 4000, // Allow for richer content
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Error from OpenAI API.");
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;

    // Extract JSON from response
    const firstBrace = rawContent.indexOf("{");
    const lastBrace = rawContent.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("AI response doesn't contain valid JSON");
    }

    const jsonString = rawContent.substring(firstBrace, lastBrace + 1);
    const result = JSON.parse(jsonString);

    // Add timestamp for progress tracking
    result.timestamp = new Date().toISOString();
    result.concept = concept;

    res.status(200).json(result);
  } catch (error) {
    console.error("Server-side error:", error.message);

    // More helpful error response
    res.status(500).json({
      message:
        "I'm having trouble processing that right now. Please try again!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

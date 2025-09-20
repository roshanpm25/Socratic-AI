import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Get Socratic-style response from Gemini
 */
export async function getGeminiResponse(userInput, conversationHistory) {
  try {
    const personaPrompt = `
You are a Socratic-style math tutor. You use simple words and fun examples.
Your task is to guide the student through a single math problem step-by-step.
Once the student solves the problem correctly, your final response should be a concise and positive concluding statement. Do not introduce a new problem or topic.

RULES:
1. DO NOT give the numeric answer directly.
2. Ask only ONE guiding question at a time.
3. Use simple real-life examples (like pizza slices, chocolate bars, or candy) to illustrate the math concept.
4. Use emojis.
5. Be friendly and concise.
6. Once the student demonstrates a full understanding of the original problem, provide a positive, encouraging final message and do not ask any more questions.
`;

    // Combine persona and conversation history
    const contents = [
      {
        role: "user",
        parts: [{ text: personaPrompt }],
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role === "student" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];

    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      { contents },
      { headers: { "Content-Type": "application/json" } }
    );

    let botReply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    botReply = botReply.replace(/^📘 Tutor:\s*/, "").trim();

    return botReply || "⚠️ Something went wrong!";
  } catch (err) {
    console.error("Error fetching from Gemini:", err.response?.data || err.message);
    return "⚠️ Something went wrong!";
  }
}
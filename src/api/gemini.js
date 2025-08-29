import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function getGeminiResponse(userInput) {
  try {
    const prompt = `
You are a Socratic-style math tutor for school students.
Rules:
- Teach fractions step by step using questions.
- Always include real-life examples like pizza slices, chocolate bars, water bottles, etc., to explain fractions.
- Do not talk about history, culture, health, or unrelated topics.
- Ask one guiding question at a time.
Student asks: ${userInput}
`;


    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Error fetching from Gemini:", err.response?.data || err.message);
    return "Oops! Something went wrong.";
  }
}

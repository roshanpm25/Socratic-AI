import axios from "axios"; 

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function getGeminiResponse(userInput, conversation = []) {
  try {
    // Separate previous student and tutor messages
    const previousStudent = conversation
      .filter(msg => msg.role === "user")
      .map(msg => msg.content)
      .join("\nStudent: ");

    const previousTutor = conversation
      .filter(msg => msg.role === "assistant")
      .map(msg => msg.content)
      .join("\nTutor: ");

    // Prepare the prompt including conversation history
    const prompt = `
        You are a Socratic-style math tutor.
        Rules:
        - Teach fractions step by step.
        - Ask only 1 guiding question at a time.
        - If the student answers correctly, acknowledge it and give the explanation; do not ask more questions.
        - Use a single real-life example (like pizza or chocolate bar).
        - Do not go off-topic.
        Conversation so far:
        Student: ${previousStudent}
        Tutor: ${previousTutor}
        Next student input: ${userInput}
        Next Tutor Response:
        `;

    // Call Gemini API
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.candidates[0].content.parts[0].text;
  } 
  catch (err) {
    console.error("Error fetching from Gemini:", err.response?.data || err.message);
    return "Oops! Something went wrong.";
  }
}

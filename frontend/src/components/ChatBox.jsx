import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./chatbox.css";
import axios from "axios";
import { getMCQQuestions } from "./getMCQQuestions.jsx";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const formatConversation = (conversation) => {
  return conversation.map((msg) => ({
    role: msg.role === "student" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));
};

export default function ChatBox() {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const [quizFlowState, setQuizFlowState] = useState('idle');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "student", text: input };
    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);
    setInput("");

    if (quizFlowState === 'waiting_for_standard') {
      const standard = input.trim();
      setQuizFlowState('idle');
      const botReply = `Generating a quiz for a ${standard} student. One moment...`;
      setConversation((prev) => [...prev, { role: "tutor", text: botReply }]);
      
      try {
        const questions = await getMCQQuestions(standard);
        navigate('/quiz', { state: { questions } });
      } catch (error) {
        const errorReply = "⚠️ Something went wrong generating the quiz. Please try again.";
        setConversation((prev) => [...prev, { role: "tutor", text: errorReply }]);
      }
      return;
    }

    const greeting = input.toLowerCase().trim();
    if (["hi", "hello", "hey", "hii", "heyy"].includes(greeting)) {
      const botReply = "Hello there! 👋 I'm ready for a math adventure whenever you are! 🚀";
      setConversation((prev) => [...prev, { role: "tutor", text: botReply }]);
      return;
    }

    try {
      const personaPrompt = `
You are a Socratic-style math tutor. You use simple words and fun examples.
Rules:
1. DO NOT give the numeric answer.
2. Ask only ONE guiding question at a time.
3. Use simple real-life examples.
4. Use emojis.
5. Be friendly and concise.
`;

      const recentConversation = newConversation.slice(-4);
      const contents = [
        {
          role: "user",
          parts: [{ text: personaPrompt }],
        },
        ...formatConversation(recentConversation),
      ];

      const response = await axios.post(
        `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
        { contents }
      );

      const botReply =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Oops! Something went wrong. Try again!";

      setConversation((prev) => [...prev, { role: "tutor", text: botReply }]);
    } catch (error) {
      console.error(
        "Error fetching from Gemini:",
        error.response?.data || error.message
      );
      setConversation((prev) => [
        ...prev,
        {
          role: "tutor",
          text: "⚠️ Something went wrong! Please check your API key and try again.",
        },
      ]);
    }
  };

  const handleStartQuiz = () => {
    setQuizFlowState('waiting_for_standard');
    const botReply = "Awesome! What grade level or standard are you looking for? (e.g., '3rd grade', 'high school algebra')";
    setConversation((prev) => [...prev, { role: "tutor", text: botReply }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClearChat = () => {
    setConversation([]);
    setInput("");
    setQuizFlowState('idle');
  };
  
  const handleQuickReply = async (replyText) => {
    const userMessage = { role: "student", text: replyText };
    setConversation((prev) => [...prev, userMessage]);

    // The image generation functionality has been removed.
    // The rest of the logic for quick replies can go here if needed.

    try {
      const personaPrompt = `...`; // your existing persona prompt
      const recentConversation = [...conversation, userMessage].slice(-4);
      const contents = [
        { role: "user", parts: [{ text: personaPrompt }] },
        ...formatConversation(recentConversation),
      ];

      const geminiResponse = await axios.post(
        `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
        { contents }
      );

      const botReply =
        geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Oops! Something went wrong. Try again!";
      setConversation((prev) => [...prev, { role: "tutor", text: botReply }]);
    } catch (error) {
      console.error(
        "Error fetching from Gemini:",
        error.response?.data || error.message
      );
      setConversation((prev) => [
        ...prev,
        {
          role: "tutor",
          text: "⚠️ Something went wrong! Please check your API key and try again.",
        },
      ]);
    }
  };

  return (
    <>
      <h1 className="chat-title">SOCRATIC AI TUTOR</h1>
      <div className="chat-container">
        <div className="chat-box">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.role === "student" ? "user" : "assistant"}`}
            >
              <span className="role">
                {msg.role === "student" ? "🧑 You:" : "📘 Tutor:"}
              </span>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="quick-replies">
          <button onClick={() => handleQuickReply("Explain more")}>Explain more</button>
          <button onClick={() => handleQuickReply("I don't understand")}>I don't understand</button>
          <button onClick={() => handleQuickReply("Let's try another problem")}>New problem</button>
        </div>

        <div className="input-box">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
          />
          <button onClick={sendMessage}>Send</button>
          <button onClick={handleStartQuiz}>Start Quiz</button>
          <button onClick={handleClearChat}>Start Over</button>
        </div>
      </div>
    </>
  );
}
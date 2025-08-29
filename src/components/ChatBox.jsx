import React, { useState } from "react";
import { getGeminiResponse } from "../api/gemini";
import "./chatbox.css"; // add this line

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // user message
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    // tutor response
    const reply = await getGeminiResponse(input);
    setMessages([...newMessages, { role: "assistant", content: reply }]);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <span className="role">
              {msg.role === "user" ? "🧑 You" : "📘 Tutor"}
            </span>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about fractions..."
        />
        <button onClick={handleSend}>Send ➤</button>
      </div>
    </div>
  );
}

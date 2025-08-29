import React, { useState } from "react";
import { getGeminiResponse } from "../api/gemini";
// import from gemini.js

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
    <div>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <p key={idx} className={msg.role}>
            <b>{msg.role === "user" ? "You: " : "Tutor: "}</b>
            {msg.content}
          </p>
        ))}
      </div>

      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

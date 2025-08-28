import React, { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I’m your Socratic Tutor. Let’s learn fractions together!" }
  ]);
  const [input, setInput] = useState("");

  // handle sending messages
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);

    // Dummy bot reply
    const botReply = {
      sender: "bot",
      text: "🤔 Interesting question! Can you explain what you already know about fractions?"
    };

    setMessages((prev) => [...prev, newMessage, botReply]);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4 flex flex-col">
        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-2 rounded-xl max-w-xs ${
                msg.sender === "bot"
                  ? "bg-blue-100 self-start"
                  : "bg-green-100 self-end"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-xl px-3 py-2 mr-2"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

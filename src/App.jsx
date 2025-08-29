import { useState } from "react";
import ChatBox from "./components/ChatBox";
import "./styles/app.css";

function App() {
  return (
    <div className="app">
      <h1 className="title">📚 Socratic AI Tutor</h1>
      <ChatBox />
    </div>
  );
}

export default App;

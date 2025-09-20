import { useState } from "react";
import ChatBox from "./components/ChatBox";
import "./styles/app.css";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import { BrowserRouter, Routes,Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
        <Routes> 
            <Route path="/" element={<Home/>}/>
            <Route path="/socraticBot" element={<ChatBox/>}/>
            <Route path="/quiz" element={<Quiz />} />
           
        </Routes>
    </BrowserRouter>
  );
}

export default App;

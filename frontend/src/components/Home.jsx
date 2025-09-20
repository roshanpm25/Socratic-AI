// src/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

// Import your assets
import tutorAvatar from '../../assets/robot.png'; 
import clickSound from '../../assets/mixkit.wav'; 

export default function Home() {
  const [welcomeText, setWelcomeText] = useState("");
  const fullWelcomeMessage = "Heello there, future mathematician! I'm your friendly tutor. Let's make math fun!";
  const projectName = "Socratic Math Bot"; // Your project name here

  const navigate = useNavigate();

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullWelcomeMessage.length) {
        setWelcomeText(prev => prev + fullWelcomeMessage.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []); 

  const handleStartClick = async () => {
    const audio = new Audio(clickSound);
    const playPromise = new Promise((resolve) => {
        audio.onended = () => {
            resolve();
        };
        audio.play();
    });

    try {
        await playPromise;
        navigate('/socraticBot');
    } catch (error) {
        console.error("Audio playback error:", error);
        navigate('/socraticBot');
    }
  };

  return (
    <div className="homepage-container">
      {/* Project Name */}
      <h1 className="project-title">{projectName}</h1>

      <div className="homepage-content">
        {/* Tutor Avatar - Left Side */}
        <div className="left-panel">
          <img src={tutorAvatar} alt="Friendly Math Tutor" className="tutor-avatar" />
        </div>

        {/* Welcome Message and Buttons - Right Side */}
        <div className="right-panel">
          <div className="welcome-message-box">
            <p className="welcome-text">{welcomeText}</p>
          </div>
          
          <p className="tagline">Let's solve some puzzles together with our Socratic AI tutor.</p>
          
          <button className="start-button" onClick={handleStartClick}>
            Start Your Adventure!
          </button>
        </div>
      </div>
    </div>
  );
}
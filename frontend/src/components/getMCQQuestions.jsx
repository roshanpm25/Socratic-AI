import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Quiz.css'; // Assuming you will create a CSS file for styling

export default function getMCQQuestions() {
  const location = useLocation();
  const [questions, setQuestions] = useState(location.state?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  // Conditional rendering check
  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <h1>Loading Quiz...</h1>
        <p>Please wait while the questions are generated.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const correct = option === currentQuestion.answer;
    setIsAnswerCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="quiz-container">
      {quizCompleted ? (
        <div className="results-container">
          <h2>Quiz Completed!</h2>
          <p>Your score: {score} out of {questions.length}</p>
        </div>
      ) : (
        <div className="question-container">
          <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <p className="question-text">{currentQuestion.question}</p>
          <div className="options-container">
            {Object.keys(currentQuestion.options).map((key) => (
              <button
                key={key}
                className={`option-button ${selectedOption === key ? (isAnswerCorrect ? 'correct' : 'incorrect') : ''}`}
                onClick={() => handleOptionClick(key)}
                disabled={selectedOption !== null}
              >
                {key}. {currentQuestion.options[key]}
              </button>
            ))}
          </div>
          {selectedOption && (
            <button onClick={handleNextQuestion} className="next-button">
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
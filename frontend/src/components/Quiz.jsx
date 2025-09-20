import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Quiz.css'; // You can add your own styling here

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the questions from the navigation state
  // Use a fallback to an empty array in case the state is null
  const { questions } = location.state || { questions: [] };
  
  // State to manage the quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // If no questions were passed, show an error and return
  if (questions.length === 0) {
    return (
      <div className="quiz-container error-message">
        <h2>Oops! No questions were found.</h2>
        <p>Please go back to the chat and ask for a quiz again.</p>
        <button onClick={() => navigate('/socraticBot')}>Return to Chat</button>
      </div>
    );
  }

  // Handle the user's answer
  const handleAnswerButtonClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      // End of the quiz, show the final score
      setShowScore(true);
    }
  };

  // Handle restarting the quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
  };
  
  // Handle returning to the chat page
  const handleReturnToChat = () => {
    navigate('/socraticBot');
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className='quiz-container'>
      {showScore ? (
        // Render the final score screen
        <div className='score-section'>
          <h2>You scored {score} out of {questions.length}</h2>
          <div className="score-buttons">
            <button onClick={handleRestartQuiz}>Restart Quiz</button>
            <button onClick={handleReturnToChat}>Return to Chat</button>
          </div>
        </div>
      ) : (
        // Render the current question and answer options
        <>
          <div className='question-section'>
            <div className='question-count'>
              <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
            </div>
            <div className='question-text'>
              {currentQuestion.questionText}
            </div>
          </div>
          <div className='answer-section'>
            {currentQuestion.answerOptions.map((answerOption, index) => (
              <button
                key={index}
                onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}
              >
                {answerOption.answerText}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;
import { useState } from 'react'

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // Sample quiz questions - you can modify these
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      answer: "Paris"
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4"
    },
    {
      question: "What color is the sky?",
      options: ["Green", "Blue", "Red", "Yellow"],
      answer: "Blue"
    }
  ];

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  return (
    <div className="project-content">
      <h2>Quiz App</h2>
      <div className="quiz-container">
        {showScore ? (
          <div className="quiz-score">
            <h3>Quiz Completed!</h3>
            <p>Your Score: {score} / {questions.length}</p>
            <button onClick={resetQuiz}>Restart Quiz</button>
          </div>
        ) : (
          <div className="quiz-question">
            <div className="question-header">
              <span>Question {currentQuestion + 1}/{questions.length}</span>
            </div>
            <h3>{questions[currentQuestion].question}</h3>
            <div className="quiz-options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="quiz-option"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;

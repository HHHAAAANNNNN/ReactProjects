import { useState, useEffect } from 'react'

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch questions from Open Trivia Database API
  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch 10 random questions (mixed difficulty and type)
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      
      if (data.response_code !== 0) {
        throw new Error('No questions available');
      }

      // Format questions to match our structure
      const formattedQuestions = data.results.map((q) => {
        // Decode HTML entities
        const decodeHTML = (html) => {
          const txt = document.createElement('textarea');
          txt.innerHTML = html;
          return txt.value;
        };

        // Combine correct and incorrect answers, then shuffle
        const allOptions = [
          decodeHTML(q.correct_answer),
          ...q.incorrect_answers.map(ans => decodeHTML(ans))
        ];
        
        // Shuffle options
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

        return {
          question: decodeHTML(q.question),
          options: shuffledOptions,
          answer: decodeHTML(q.correct_answer),
          category: decodeHTML(q.category),
          difficulty: q.difficulty
        };
      });

      setQuestions(formattedQuestions);
    } catch (err) {
      setError(err.message || 'Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

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
    fetchQuestions(); // Fetch new questions when restarting
  };

  // Show loading state
  if (loading) {
    return (
      <div className="project-content">
        <h2>Quiz App</h2>
        <div className="quiz-container">
          <div className="quiz-loading">
            <div className="spinner"></div>
            <p>Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="project-content">
        <h2>Quiz App</h2>
        <div className="quiz-container">
          <div className="quiz-error">
            <p>❌ {error}</p>
            <button onClick={fetchQuestions}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (questions.length === 0) {
    return (
      <div className="project-content">
        <h2>Quiz App</h2>
        <div className="quiz-container">
          <div className="quiz-error">
            <p>No questions available</p>
            <button onClick={fetchQuestions}>Reload</button>
          </div>
        </div>
      </div>
    );
  }

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

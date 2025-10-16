import { useState, useEffect } from 'react'

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [answerTimes, setAnswerTimes] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);

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

  // Reset timer when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  const getScoreGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A', color: 'hsl(120 70% 50%)', message: 'Excellent!' };
    if (percentage >= 80) return { grade: 'B', color: 'hsl(150 60% 50%)', message: 'Great Job!' };
    if (percentage >= 70) return { grade: 'C', color: 'hsl(60 70% 50%)', message: 'Good!' };
    if (percentage >= 60) return { grade: 'D', color: 'hsl(40 70% 50%)', message: 'Fair' };
    if (percentage >= 50) return { grade: 'E', color: 'hsl(20 70% 50%)', message: 'Needs Improvement' };
    return { grade: 'F', color: 'hsl(0 70% 50%)', message: 'Keep Practicing!' };
  };

  const handleAnswer = (selectedOption) => {
    // Prevent selecting another answer after one is selected
    if (showFeedback) return;

    // Calculate time spent on this question
    const timeSpent = (Date.now() - questionStartTime) / 1000; // in seconds
    setAnswerTimes([...answerTimes, timeSpent]);

    setSelectedAnswer(selectedOption);
    setShowFeedback(true);

    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    // Fade out animation before moving to next question (at 2s)
    setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Auto advance to next question after 2.5 seconds
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setFadeOut(false);
      } else {
        setShowScore(true);
      }
    }, 2500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswerTimes([]);
    setQuestionStartTime(Date.now());
    setFadeOut(false);
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
            <h3>🎉 Quiz Completed!</h3>
            
            {/* Score Breakdown */}
            <div className="score-breakdown">
              <div className="grade-display">
                <div 
                  className="grade-circle" 
                  style={{ borderColor: getScoreGrade((score / questions.length) * 100).color }}
                >
                  <span 
                    className="grade-letter"
                    style={{ color: getScoreGrade((score / questions.length) * 100).color }}
                  >
                    {getScoreGrade((score / questions.length) * 100).grade}
                  </span>
                </div>
                <p className="grade-message">
                  {getScoreGrade((score / questions.length) * 100).message}
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{((score / questions.length) * 100).toFixed(1)}%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">
                    {answerTimes.length > 0 
                      ? (answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length).toFixed(1) 
                      : '0'}s
                  </div>
                  <div className="stat-label">Avg Time/Question</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value correct">{score}</div>
                  <div className="stat-label">Correct</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value incorrect">{questions.length - score}</div>
                  <div className="stat-label">Incorrect</div>
                </div>
                
              </div>
            </div>

            <button onClick={resetQuiz} className="restart-btn">🔄 Restart Quiz</button>
          </div>
        ) : (
          <div className={`quiz-question ${fadeOut ? 'fade-out' : 'fade-in'}`}>
            <div className="question-header">
              <span>Question {currentQuestion + 1}/{questions.length}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <h3>{questions[currentQuestion].question}</h3>
            <div className="quiz-options">
              {questions[currentQuestion].options.map((option, index) => {
                const isCorrect = option === questions[currentQuestion].answer;
                const isSelected = option === selectedAnswer;
                
                let buttonClass = 'quiz-option';
                if (showFeedback && isSelected) {
                  buttonClass += isCorrect ? ' correct' : ' incorrect';
                }
                if (showFeedback && isCorrect && !isSelected) {
                  buttonClass += ' correct-answer';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={buttonClass}
                    disabled={showFeedback}
                  >
                    {option}
                    {showFeedback && isSelected && (
                      <span className="answer-icon">
                        {isCorrect ? ' ✓' : ' ✗'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="timer-indicator">
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle
                    cx="30"
                    cy="30"
                    r="26"
                    fill="none"
                    stroke="hsl(0 0% 20%)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="26"
                    fill="none"
                    stroke={selectedAnswer === questions[currentQuestion].answer ? 'hsl(120 60% 50%)' : 'hsl(0 60% 50%)'}
                    strokeWidth="4"
                    strokeDasharray="163.36"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                    className="timer-circle"
                  />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;

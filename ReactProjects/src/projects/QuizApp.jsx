import { useState, useEffect } from 'react'
import html2pdf from 'html2pdf.js'

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [answerTimes, setAnswerTimes] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Quiz setup states
  const [showSetup, setShowSetup] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSettings, setQuizSettings] = useState({
    amount: 10,
    type: 'multiple',
    category: '',
    difficulty: ''
  });
  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        setCategories(data.trivia_categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch questions from Open Trivia Database API with auto-retry
  const fetchQuestions = async (retryCount = 0) => {
    setLoading(true);
    setError(retryCount > 0 ? `Retrying... (Attempt ${retryCount + 1})` : '');
    
    try {
      // Build API URL with settings
      let apiUrl = `https://opentdb.com/api.php?amount=${quizSettings.amount}`;
      if (quizSettings.type) apiUrl += `&type=${quizSettings.type}`;
      if (quizSettings.category) apiUrl += `&category=${quizSettings.category}`;
      if (quizSettings.difficulty) apiUrl += `&difficulty=${quizSettings.difficulty}`;
      
      const response = await fetch(apiUrl);
          
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();

      const dataFetch = async (retryCountData = 0) => {
        setLoading(true);
        setError(retryCountData > 0 ? `Retrying... (Attempt ${retryCountData + 1})` : '');
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
      setError(''); // Clear error on success
      setLoading(false);
    } catch (err) {
      // Auto-retry after 1 second
      console.log(`Fetch failed (Attempt ${retryCount + 1}):`, err.message);
      setError(`Connection failed. Retrying in 1 second... (Attempt ${retryCount + 1})`);
      
      setTimeout(() => {
        fetchQuestions(retryCount + 1); // Retry with incremented count
      }, 1000);
    }
  };

  // Start quiz with selected settings
  const startQuiz = () => {
    setShowSetup(false);
    setQuizStarted(true);
    fetchQuestions();
  };

  // Check for shared results in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedScore = urlParams.get('score');
    const sharedTotal = urlParams.get('total');
    const sharedGrade = urlParams.get('grade');
    const sharedPercentage = urlParams.get('percentage');

    if (sharedScore && sharedTotal && sharedGrade) {
      // Show shared results
      setScore(parseInt(sharedScore));
      setShowScore(true);
      // Create dummy questions array for display purposes
      const dummyQuestions = Array(parseInt(sharedTotal)).fill({ question: '', options: [], answer: '' });
      setQuestions(dummyQuestions);
      setLoading(false);
    }
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

    // Store user answer
    setUserAnswers([...userAnswers, {
      question: questions[currentQuestion].question,
      userAnswer: selectedOption,
      correctAnswer: questions[currentQuestion].answer,
      isCorrect: selectedOption === questions[currentQuestion].answer,
      timeSpent: timeSpent
    }]);

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
    setUserAnswers([]);
    setShowHistory(false);
    setQuestionStartTime(Date.now());
    setFadeOut(false);
    fetchQuestions(); // Fetch new questions when restarting
  };

  const backToSetup = () => {
    setShowSetup(true);
    setQuizStarted(false);
    setShowScore(false);
    setCurrentQuestion(0);
    setScore(0);
    setQuestions([]);
    setUserAnswers([]);
    setAnswerTimes([]);
  };

  // Generate shareable result text
  const getShareText = () => {
    const percentage = ((score / questions.length) * 100).toFixed(1);
    const gradeInfo = getScoreGrade(percentage);
    return `🎯 Quiz Results 🎯\n\n` +
           `Grade: ${gradeInfo.grade} - ${gradeInfo.message}\n` +
           `Score: ${score}/${questions.length} (${percentage}%)\n` +
           `Accuracy: ${percentage}%\n\n` +
           `Check out this awesome Quiz App! 🚀`;
  };

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const text = getShareText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Share to Facebook
  const shareToFacebook = () => {
    const text = getShareText();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Share to X (Twitter)
  const shareToX = () => {
    const text = getShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const exportToPDF = () => {
    const percentage = ((score / questions.length) * 100).toFixed(1);
    const gradeInfo = getScoreGrade(percentage);
    const avgTime = answerTimes.length > 0 
      ? (answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length).toFixed(1) 
      : '0';
    
    // Get quiz settings display values
    const quizTypeDisplay = quizSettings.type === 'multiple' ? 'Multiple Choice' : 
                           quizSettings.type === 'boolean' ? 'True/False' : 'Any Type';
    const categoryDisplay = quizSettings.category ? 
                           categories.find(cat => cat.id === parseInt(quizSettings.category))?.name || 'Any Category' 
                           : 'Any Category';
    const difficultyDisplay = quizSettings.difficulty ? 
                             quizSettings.difficulty.charAt(0).toUpperCase() + quizSettings.difficulty.slice(1) 
                             : 'Any Difficulty';
    
    // Create HTML content for PDF
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              background: #4682B4;
              color: white;
              padding: 20px;
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
            }
            .header p {
              margin: 5px 0 0 0;
              font-size: 12px;
            }
            .grade-section {
              background: #f0f0f0;
              padding: 20px;
              margin-bottom: 30px;
              display: flex;
              align-items: center;
              border-radius: 8px;
            }
            .grade-circle {
              width: 80px;
              height: 80px;
              border: 4px solid ${gradeInfo.color};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
              font-weight: bold;
              color: ${gradeInfo.color};
              margin-right: 20px;
            }
            .grade-info h2 {
              margin: 0;
              font-size: 20px;
              color: #333;
            }
            .grade-info p {
              margin: 5px 0 0 0;
              font-size: 14px;
              color: #666;
            }
            .section-title {
              color: #4682B4;
              font-size: 20px;
              font-weight: bold;
              margin: 30px 0 15px 0;
              border-bottom: 2px solid #4682B4;
              padding-bottom: 5px;
            }
            .stats {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 30px;
            }
            .stat-box {
              background: #f9f9f9;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #4682B4;
            }
            .stat-box .label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
            }
            .stat-box .value {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-top: 5px;
            }
            .question-box {
              background: white;
              border: 2px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
              page-break-inside: avoid;
            }
            .question-box.correct {
              border-color: #4CAF50;
              background: #f1f8f4;
            }
            .question-box.incorrect {
              border-color: #f44336;
              background: #fef1f0;
            }
            .question-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }
            .question-number {
              font-weight: bold;
              color: #666;
            }
            .status-badge {
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .status-badge.correct {
              background: #4CAF50;
              color: white;
            }
            .status-badge.incorrect {
              background: #f44336;
              color: white;
            }
            .question-text {
              font-size: 14px;
              margin-bottom: 10px;
              line-height: 1.6;
            }
            .answer {
              padding: 8px 12px;
              margin: 5px 0;
              border-radius: 4px;
              font-size: 13px;
            }
            .answer.user-correct {
              background: #c8e6c9;
              border-left: 3px solid #4CAF50;
            }
            .answer.user-incorrect {
              background: #ffcdd2;
              border-left: 3px solid #f44336;
            }
            .answer.correct-answer {
              background: #c8e6c9;
              border-left: 3px solid #4CAF50;
            }
            .answer strong {
              color: #666;
            }
            .time {
              font-size: 11px;
              color: #999;
              text-align: right;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>QUIZ RESULTS</h1>
            <p>Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          </div>

          <div class="section-title">Quiz Information</div>
          <div class="stats">
            <div class="stat-box">
              <div class="label">Number of Questions</div>
              <div class="value">${quizSettings.amount}</div>
            </div>
            <div class="stat-box">
              <div class="label">Question Type</div>
              <div class="value">${quizTypeDisplay}</div>
            </div>
            <div class="stat-box">
              <div class="label">Category</div>
              <div class="value">${categoryDisplay}</div>
            </div>
            <div class="stat-box">
              <div class="label">Difficulty</div>
              <div class="value">${difficultyDisplay}</div>
            </div>
          </div>

          <div class="grade-section">
            <div class="grade-circle">${gradeInfo.grade}</div>
            <div class="grade-info">
              <h2>${gradeInfo.message}</h2>
              <p>${percentage}% Accuracy</p>
            </div>
          </div>

          <div class="section-title">Score Summary</div>
          <div class="stats">
            <div class="stat-box">
              <div class="label">Accuracy</div>
              <div class="value">${percentage}%</div>
            </div>
            <div class="stat-box">
              <div class="label">Avg Time / Question</div>
              <div class="value">${avgTime}s</div>
            </div>
            <div class="stat-box">
              <div class="label">Correct Answers</div>
              <div class="value" style="color: #4CAF50;">${score}</div>
            </div>
            <div class="stat-box">
              <div class="label">Incorrect Answers</div>
              <div class="value" style="color: #f44336;">${questions.length - score}</div>
            </div>
          </div>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>

          <div class="section-title">Answer History</div>
          ${userAnswers.map((answer, index) => `
            <div class="question-box ${answer.isCorrect ? 'correct' : 'incorrect'}">
              <div class="question-header">
                <span class="question-number">Question ${index + 1}</span>
                <span class="status-badge ${answer.isCorrect ? 'correct' : 'incorrect'}">
                  ${answer.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                </span>
              </div>
              <div class="question-text">${answer.question}</div>
              <div class="answer ${answer.isCorrect ? 'user-correct' : 'user-incorrect'}">
                <strong>Your Answer:</strong> ${answer.userAnswer}
              </div>
              ${!answer.isCorrect ? `
                <div class="answer correct-answer">
                  <strong>Correct Answer:</strong> ${answer.correctAnswer}
                </div>
              ` : ''}
              <div class="time">⏱️ ${answer.timeSpent.toFixed(1)}s</div>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    // Generate PDF from HTML
    const opt = {
      margin: 10,
      filename: `Quiz_Results_Grade_${gradeInfo.grade}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(htmlContent).save();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="project-content">
        <h2>Quiz App</h2>
        <div className="quiz-container">
          <div className="quiz-loading">
            <div className="spinner"></div>
            <p>{error || 'Loading questions...'}</p>
            {error && <p style={{ fontSize: '14px', marginTop: '10px' }}>Please wait...</p>}
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
            <button onClick={fetchQuestions}>You Ready?</button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-content">
      <h2>Quiz App</h2>
      <div className="quiz-container">
        {showSetup ? (
          <div className="quiz-setup">
            <div className="setup-header">
              <h3>⚙️ Quiz Settings</h3>
              <p>Customize your quiz before starting</p>
            </div>

            <form className="setup-form" onSubmit={(e) => { e.preventDefault(); startQuiz(); }}>
              <div className="form-group">
                <label className="form-label">Number of Questions</label>
                <input
                title='Number of Questions: Minimum 5, Maximum 50'
                  type="number"
                  className="form-input"
                  min="5"
                  max="50"
                  value={quizSettings.amount}
                  onChange={(e) => setQuizSettings({ ...quizSettings, amount: parseInt(e.target.value) || 10 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Question Type</label>
                <select
                  className="form-select"
                  value={quizSettings.type}
                  onChange={(e) => setQuizSettings({ ...quizSettings, type: e.target.value })}
                >
                  <option value="">Any Type</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="boolean">True / False</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={quizSettings.category}
                  onChange={(e) => setQuizSettings({ ...quizSettings, category: e.target.value })}
                >
                  <option value="">Any Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select
                  className="form-select"
                  value={quizSettings.difficulty}
                  onChange={(e) => setQuizSettings({ ...quizSettings, difficulty: e.target.value })}
                >
                  <option value="">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <button type="submit" className="start-quiz-btn">
                🚀 Start Quiz
              </button>
            </form>
          </div>
        ) : showScore ? (
          <div className="quiz-score">
            {/* Quiz Settings Info */}
            {!new URLSearchParams(window.location.search).get('score') && (
              <div className="quiz-info">
                <div className="info-item">
                  <span className="info-label">Questions:</span>
                  <span className="info-value">{quizSettings.amount}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Type:</span>
                  <span className="info-value">
                    {quizSettings.type === 'multiple' ? 'Multiple Choice' : 
                     quizSettings.type === 'boolean' ? 'True/False' : 'Any Type'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Category:</span>
                  <span className="info-value">
                    {quizSettings.category ? 
                      categories.find(cat => cat.id === parseInt(quizSettings.category))?.name || 'Any Category' 
                      : 'Any Category'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Difficulty:</span>
                  <span className="info-value">
                    {quizSettings.difficulty ? 
                      quizSettings.difficulty.charAt(0).toUpperCase() + quizSettings.difficulty.slice(1) 
                      : 'Any Difficulty'}
                  </span>
                </div>
              </div>
            )}

            <h3>
              {new URLSearchParams(window.location.search).get('score') 
                ? '👀 Shared Quiz Results' 
                : '🎉 Quiz Completed!'}
            </h3>
            
            {/* Show info for shared results */}
            {new URLSearchParams(window.location.search).get('score') && (
              <p style={{ 
                color: 'hsl(40 70% 60%)', 
                fontSize: '0.95rem', 
                marginTop: '-0.5rem',
                marginBottom: '1.5rem' 
              }}>
                Someone shared their quiz results with you!
              </p>
            )}
            
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

              {/* Toggle Buttons - Only show if NOT shared result and has answer history */}
              {!new URLSearchParams(window.location.search).get('score') && userAnswers.length > 0 && (
                <div className="view-toggle">
                  <button 
                    onClick={() => setShowHistory(false)} 
                    className={`toggle-btn ${!showHistory ? 'active' : ''}`}
                  >
                    📊 Show Results
                  </button>
                  <button 
                    onClick={() => setShowHistory(true)} 
                    className={`toggle-btn ${showHistory ? 'active' : ''}`}
                  >
                    📝 Answer History
                  </button>
                </div>
              )}

              {/* Conditional Rendering: Results or History */}
              {!showHistory ? (
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
              ) : (
                <div className="answer-history">
                  {userAnswers.map((answer, index) => (
                    <div key={index} className={`history-card ${answer.isCorrect ? 'correct-card' : 'incorrect-card'}`}>
                      <div className="history-header">
                        <span className="question-number">Question {index + 1}</span>
                        <span className={`history-badge ${answer.isCorrect ? 'badge-correct' : 'badge-incorrect'}`}>
                          {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <p className="history-question">{answer.question}</p>
                      <div className="history-answers">
                        <div className={`answer-item ${answer.isCorrect ? 'user-correct' : 'user-incorrect'}`}>
                          <span className="answer-label">Your Answer:</span>
                          <span className="answer-text">{answer.userAnswer}</span>
                        </div>
                        {!answer.isCorrect && (
                          <div className="answer-item correct-answer-item">
                            <span className="answer-label">Correct Answer:</span>
                            <span className="answer-text">{answer.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                      <div className="history-time">⏱️ {answer.timeSpent.toFixed(1)}s</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Only show action buttons if NOT a shared result */}
            {!new URLSearchParams(window.location.search).get('score') && (
              <>
                <div className="action-buttons">
                  <button onClick={backToSetup} className="setup-btn">⚙️ New Quiz</button>
                  <button onClick={resetQuiz} className="restart-btn">🔄 Restart Quiz</button>
                  <button onClick={exportToPDF} className="export-btn">📄 Export to PDF</button>
                </div>

                {/* Share Section */}
                <div className="share-section">
                  <h3 className="share-title">📢 Share Your Results</h3>
                  <div className="share-buttons">
                    <button onClick={shareToWhatsApp} className="share-btn whatsapp-btn">
                      <span className="share-icon">💬</span>
                      WhatsApp
                    </button>
                    <button onClick={shareToFacebook} className="share-btn facebook-btn">
                      <span className="share-icon">📘</span>
                      Facebook
                    </button>
                    <button onClick={shareToX} className="share-btn x-btn">
                      <span className="share-icon">𝕏</span>
                      X (Twitter)
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Show "Take Quiz" button for shared results */}
            {new URLSearchParams(window.location.search).get('score') && (
              <div className="action-buttons">
                <button 
                  onClick={() => {
                    // Clear URL params and restart quiz
                    window.history.replaceState({}, document.title, window.location.pathname);
                    resetQuiz();
                  }} 
                  className="restart-btn"
                  style={{ maxWidth: '100%' }}
                >
                  🎯 Take This Quiz Yourself!
                </button>
              </div>
            )}
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

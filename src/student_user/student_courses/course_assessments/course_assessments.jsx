import React, { useState, useEffect, useRef } from 'react';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import toast from 'react-hot-toast';
import { VideoPlayerModal } from '../../../components/student-components/student-courses-components/classroom-recordings-components';

const CourseAssessments = () => {
  const [currentPage, setCurrentPage] = useState('course-assessments');
  const [isLoading, setIsLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [viewingCompletedAssessment, setViewingCompletedAssessment] = useState(null);
  const [studyPlanModal, setStudyPlanModal] = useState(null);
  const [focusAreas, setFocusAreas] = useState({});
  const [currentNote, setCurrentNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const timerRef = useRef(null);
  const visibilityRef = useRef(true);

  // Dummy assessment data
  const dummyAssessments = [
    {
      id: 1,
      title: 'Amazon Ads Campaign Optimization Quiz',
      subject: 'Amazon Ads Fundamentals',
      subjectCode: 'ADS101',
      subjectColor: 'blue',
      teacher: 'Sarah Johnson',
      assignedDate: '2024-10-20',
      dueDate: '2024-10-28',
      duration: 30, // minutes
      totalQuestions: 15,
      passingScore: 70,
      status: 'pending', // pending, in-progress, completed
      difficulty: 'medium',
      topics: ['Campaign Setup', 'Bidding Strategies', 'Performance Analysis'],
      questions: [
        {
          id: 'q1',
          question: 'What is the primary goal of Amazon Sponsored Products?',
          options: [
            'Increase brand awareness',
            'Drive product sales directly',
            'Gather customer data',
            'Reduce advertising costs'
          ],
          correctAnswer: 1,
          topic: 'Campaign Setup'
        },
        {
          id: 'q2',
          question: 'Which bidding strategy is best for new campaigns with limited data?',
          options: [
            'Manual bidding',
            'Dynamic bids - down only',
            'Dynamic bids - up and down',
            'Fixed bids'
          ],
          correctAnswer: 2,
          topic: 'Bidding Strategies'
        },
        {
          id: 'q3',
          question: 'What does ACOS stand for in Amazon advertising?',
          options: [
            'Average Cost of Sales',
            'Advertising Cost of Sales',
            'Annual Cost of Service',
            'Automated Cost Optimization System'
          ],
          correctAnswer: 1,
          topic: 'Performance Analysis'
        },
        {
          id: 'q4',
          question: 'What is the recommended minimum daily budget for a new Sponsored Products campaign?',
          options: [
            '$5',
            '$10',
            '$25',
            '$50'
          ],
          correctAnswer: 1,
          topic: 'Campaign Setup'
        },
        {
          id: 'q5',
          question: 'Which metric indicates the effectiveness of your ad spend?',
          options: [
            'Impressions',
            'Click-through rate',
            'Return on Ad Spend (ROAS)',
            'Total sales'
          ],
          correctAnswer: 2,
          topic: 'Performance Analysis'
        }
      ]
    },
    {
      id: 2,
      title: 'SEO Keyword Research Assessment',
      subject: 'Amazon Search & SEO',
      subjectCode: 'SEO201',
      subjectColor: 'green',
      teacher: 'Michael Chen',
      assignedDate: '2024-10-22',
      dueDate: '2024-10-30',
      duration: 25,
      totalQuestions: 12,
      passingScore: 75,
      status: 'pending',
      difficulty: 'hard',
      topics: ['A9 Algorithm', 'Keyword Tools', 'Listing Optimization'],
      questions: [
        {
          id: 'q1',
          question: 'What is the primary ranking factor in Amazon\'s A9 algorithm?',
          options: [
            'Price',
            'Sales velocity',
            'Review count',
            'Seller rating'
          ],
          correctAnswer: 1,
          topic: 'A9 Algorithm'
        },
        {
          id: 'q2',
          question: 'Which tool is NOT commonly used for Amazon keyword research?',
          options: [
            'Helium 10',
            'Jungle Scout',
            'Google Keyword Planner',
            'Merchant Words'
          ],
          correctAnswer: 2,
          topic: 'Keyword Tools'
        },
        {
          id: 'q3',
          question: 'Where should your most important keywords be placed in a product listing?',
          options: [
            'In bullet points only',
            'In the description only',
            'In the title and first bullet point',
            'In backend search terms only'
          ],
          correctAnswer: 2,
          topic: 'Listing Optimization'
        }
      ]
    },
    {
      id: 3,
      title: 'DSP Campaign Strategy Test',
      subject: 'Amazon DSP (Demand-Side Platform)',
      subjectCode: 'DSP301',
      subjectColor: 'purple',
      teacher: 'Emily Rodriguez',
      assignedDate: '2024-10-18',
      dueDate: '2024-10-26',
      duration: 40,
      totalQuestions: 5,
      passingScore: 80,
      status: 'completed',
      difficulty: 'hard',
      score: 60,
      completedDate: '2024-10-24',
      topics: ['Programmatic Advertising', 'Audience Targeting', 'Campaign Analytics'],
      userAnswers: {
        'q1': 1,  // Correct
        'q2': 1,  // Wrong - answered "Demographic audiences" instead of "In-market audiences"
        'q3': 2,  // Correct
        'q4': 0,  // Wrong - answered "7 days" instead of "14 days"
        'q5': 2   // Correct
      },
      questions: [
        {
          id: 'q1',
          question: 'What is the primary benefit of using Amazon DSP?',
          options: [
            'Lower advertising costs',
            'Access to Amazon and third-party inventory',
            'Easier campaign setup',
            'Automatic bidding'
          ],
          correctAnswer: 1,
          topic: 'Programmatic Advertising'
        },
        {
          id: 'q2',
          question: 'Which audience type is unique to Amazon DSP?',
          options: [
            'In-market audiences',
            'Demographic audiences',
            'Location-based audiences',
            'Interest-based audiences'
          ],
          correctAnswer: 0,
          topic: 'Audience Targeting'
        },
        {
          id: 'q3',
          question: 'What does viewable CPM mean in DSP campaigns?',
          options: [
            'Cost per thousand clicks',
            'Cost per million views',
            'Cost per thousand viewable impressions',
            'Cost per mille conversions'
          ],
          correctAnswer: 2,
          topic: 'Campaign Analytics'
        },
        {
          id: 'q4',
          question: 'How long is the Amazon attribution window for DSP campaigns?',
          options: [
            '7 days',
            '14 days',
            '30 days',
            '90 days'
          ],
          correctAnswer: 1,
          topic: 'Campaign Analytics'
        },
        {
          id: 'q5',
          question: 'Which is NOT a valid DSP campaign goal?',
          options: [
            'Brand awareness',
            'Product consideration',
            'Direct product sales',
            'Retargeting'
          ],
          correctAnswer: 2,
          topic: 'Programmatic Advertising'
        }
      ],
      relatedVideos: [
        {
          id: 'v1',
          title: 'Introduction to Amazon DSP',
          videoId: 'y9Dk6wMc8UM',
          duration: '18:30',
          topic: 'Programmatic Advertising'
        },
        {
          id: 'v2',
          title: 'Advanced Audience Targeting Strategies',
          videoId: 'dQw4w9WgXcQ',
          duration: '22:15',
          topic: 'Audience Targeting'
        },
        {
          id: 'v3',
          title: 'Understanding DSP Analytics',
          videoId: 'y9Dk6wMc8UM',
          duration: '15:45',
          topic: 'Campaign Analytics'
        }
      ]
    }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setAssessments(dummyAssessments);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isAssessmentStarted && !showResults) {
        // User left the tab/page during assessment
        setShowWarning(true);
        handleRestartAssessment();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAssessmentStarted, showResults]);

  // Timer countdown
  useEffect(() => {
    if (isAssessmentStarted && timeRemaining > 0 && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isAssessmentStarted, timeRemaining, showResults]);

  const handleStartAssessment = (assessment) => {
    setActiveAssessment(assessment);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(assessment.duration * 60); // Convert minutes to seconds
    setIsAssessmentStarted(true);
    setShowResults(false);
    setShowWarning(false);
  };

  const handleRestartAssessment = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(activeAssessment.duration * 60);
    setShowWarning(false);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeAssessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Calculate results
    let correctAnswers = 0;
    activeAssessment.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / activeAssessment.questions.length) * 100);
    const passed = score >= activeAssessment.passingScore;

    setAssessmentResults({
      score,
      correctAnswers,
      totalQuestions: activeAssessment.questions.length,
      passed,
      answers: answers
    });

    setShowResults(true);
    setIsAssessmentStarted(false);

    // Update assessment status
    setAssessments(prev => prev.map(a => 
      a.id === activeAssessment.id 
        ? { ...a, status: 'completed', score, completedDate: new Date().toISOString().split('T')[0] }
        : a
    ));
  };

  const handleBackToList = () => {
    setActiveAssessment(null);
    setIsAssessmentStarted(false);
    setShowResults(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setViewingCompletedAssessment(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCompletedAssessment = (assessment) => {
    setViewingCompletedAssessment(assessment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestRetake = () => {
    toast.error('Please contact your teacher to request permission to retake this assessment.', {
      duration: 5000,
      icon: '📧'
    });
  };

  const handleCreateStudyPlan = () => {
    setStudyPlanModal(viewingCompletedAssessment);
    setCurrentNote('');
    setEditingNoteId(null);
    if (!focusAreas[viewingCompletedAssessment.id]) {
      setFocusAreas(prev => ({
        ...prev,
        [viewingCompletedAssessment.id]: []
      }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseStudyPlan = () => {
    setStudyPlanModal(null);
    setCurrentNote('');
    setEditingNoteId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNote = (assessmentId) => {
    if (currentNote.trim().length === 0) {
      toast.error('Please enter a note');
      return;
    }

    const newNote = {
      id: Date.now(),
      text: currentNote.trim(),
      createdAt: new Date().toISOString()
    };

    setFocusAreas(prev => ({
      ...prev,
      [assessmentId]: [...(prev[assessmentId] || []), newNote]
    }));

    setCurrentNote('');
    toast.success('Note added successfully');
  };

  const handleEditNote = (assessmentId, noteId) => {
    const note = focusAreas[assessmentId]?.find(n => n.id === noteId);
    if (note) {
      setCurrentNote(note.text);
      setEditingNoteId(noteId);
    }
  };

  const handleUpdateNote = (assessmentId) => {
    if (currentNote.trim().length === 0) {
      toast.error('Please enter a note');
      return;
    }

    setFocusAreas(prev => ({
      ...prev,
      [assessmentId]: prev[assessmentId].map(note =>
        note.id === editingNoteId
          ? { ...note, text: currentNote.trim(), updatedAt: new Date().toISOString() }
          : note
      )
    }));

    setCurrentNote('');
    setEditingNoteId(null);
    toast.success('Note updated successfully');
  };

  const handleDeleteNote = (assessmentId, noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setFocusAreas(prev => ({
        ...prev,
        [assessmentId]: prev[assessmentId].filter(note => note.id !== noteId)
      }));
      toast.success('Note deleted');
    }
  };

  const handleCancelEdit = () => {
    setCurrentNote('');
    setEditingNoteId(null);
  };

  const handlePlayVideo = (video) => {
    setPlayingVideo(video);
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'yellow';
      case 'hard': return 'red';
      default: return 'slate';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'blue';
      case 'in-progress': return 'orange';
      case 'completed': return 'green';
      default: return 'slate';
    }
  };

  const pendingAssessments = assessments.filter(a => a.status === 'pending');
  const completedAssessments = assessments.filter(a => a.status === 'completed');

  if (activeAssessment && isAssessmentStarted && !showResults) {
    // Assessment Taking View
    const currentQuestion = activeAssessment.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeAssessment.questions.length) * 100;
    const isTimeLow = timeRemaining <= 300; // 5 minutes

    return (
      <>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Header with Timer */}
          <div className="bg-white shadow-md border-b-2 border-slate-200 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900">{activeAssessment.title}</h2>
                  <p className="text-sm text-slate-600">
                    Question {currentQuestionIndex + 1} of {activeAssessment.questions.length}
                  </p>
                </div>
                <div className={`text-right ${isTimeLow ? 'animate-pulse' : ''}`}>
                  <div className={`text-2xl font-bold ${isTimeLow ? 'text-red-600' : 'text-blue-600'}`}>
                    <i className="fas fa-clock mr-2"></i>
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-xs text-slate-600">Time Remaining</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-3 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          {showWarning && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-600 text-xl mr-3"></i>
                <div>
                  <p className="text-red-800 font-semibold">Assessment Restarted</p>
                  <p className="text-red-700 text-sm">You left the page. Your assessment has been restarted for integrity purposes.</p>
                </div>
              </div>
            </div>
          )}

          {/* Question Content */}
          <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 lg:p-8">
              {/* Topic Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  <i className="fas fa-tag mr-1"></i>
                  {currentQuestion.topic}
                </span>
              </div>

              {/* Question */}
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-6">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion.id] === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-300'
                        }`}>
                          {isSelected && <i className="fas fa-check text-white text-xs"></i>}
                        </div>
                        <span className={`text-sm lg:text-base ${isSelected ? 'text-blue-900 font-medium' : 'text-slate-700'}`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 gap-4">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:shadow-md'
                }`}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Previous
              </button>

              {currentQuestionIndex === activeAssessment.questions.length - 1 ? (
                <button
                  onClick={handleSubmitAssessment}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Submit Assessment
                  <i className="fas fa-check ml-2"></i>
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Next
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              )}
            </div>

            {/* Question Navigator */}
            <div className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Question Navigator</h4>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {activeAssessment.questions.map((q, index) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = index === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-md scale-110'
                          : isAnswered
                          ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-600 border-2 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-slate-100 border-2 border-slate-200 rounded"></div>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Current</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (showResults && assessmentResults) {
    // Results View
    return (
      <>
        <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
        <div className="min-h-screen bg-slate-50 lg:ml-72">
          <div className="max-w-4xl mx-auto px-4 py-8 pt-20 lg:pt-8">
            <div className="text-center mb-8">
              {/* Score Circle */}
              <div className="inline-block relative">
                <svg className="w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke={assessmentResults.passed ? '#10b981' : '#ef4444'}
                    strokeWidth="12"
                    strokeDasharray={`${(assessmentResults.score / 100) * 553} 553`}
                    strokeLinecap="round"
                    transform="rotate(-90 96 96)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${assessmentResults.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {assessmentResults.score}%
                  </span>
                  <span className="text-sm text-slate-600 mt-1">Your Score</span>
                </div>
              </div>

              {/* Result Message */}
              <div className="mt-6">
                {assessmentResults.passed ? (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-full font-semibold">
                    <i className="fas fa-check-circle text-xl"></i>
                    Congratulations! You Passed
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 text-red-800 rounded-full font-semibold">
                    <i className="fas fa-times-circle text-xl"></i>
                    You Did Not Pass
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
                <i className="fas fa-check-circle text-green-600 text-3xl mb-2"></i>
                <p className="text-3xl font-bold text-slate-900">{assessmentResults.correctAnswers}</p>
                <p className="text-sm text-slate-600">Correct Answers</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
                <i className="fas fa-times-circle text-red-600 text-3xl mb-2"></i>
                <p className="text-3xl font-bold text-slate-900">
                  {assessmentResults.totalQuestions - assessmentResults.correctAnswers}
                </p>
                <p className="text-sm text-slate-600">Incorrect Answers</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
                <i className="fas fa-clipboard-check text-blue-600 text-3xl mb-2"></i>
                <p className="text-3xl font-bold text-slate-900">{assessmentResults.totalQuestions}</p>
                <p className="text-sm text-slate-600">Total Questions</p>
              </div>
            </div>

            {/* Detailed Review */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-list-check text-blue-600"></i>
                Detailed Review
              </h3>
              <div className="space-y-4">
                {activeAssessment.questions.map((question, index) => {
                  const userAnswer = assessmentResults.answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          <i className={`fas ${isCorrect ? 'fa-check' : 'fa-times'} text-white`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 mb-2">Q{index + 1}. {question.question}</p>
                          <div className="space-y-1 text-sm">
                            <p className={userAnswer !== undefined ? (isCorrect ? 'text-green-700' : 'text-red-700') : 'text-slate-600'}>
                              <strong>Your Answer:</strong> {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                            </p>
                            {!isCorrect && (
                              <p className="text-green-700">
                                <strong>Correct Answer:</strong> {question.options[question.correctAnswer]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBackToList}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Assessments
              </button>
              {!assessmentResults.passed && (
                <button
                  onClick={handleRequestRetake}
                  className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Request Retake
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Completed Assessment Details View
  if (viewingCompletedAssessment && !studyPlanModal) {
    const correctAnswers = viewingCompletedAssessment.questions.filter(
      q => viewingCompletedAssessment.userAnswers[q.id] === q.correctAnswer
    ).length;

    return (
      <>
        {!playingVideo && (
          <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        <div className={`min-h-screen bg-slate-50 ${!playingVideo ? 'lg:ml-72' : ''}`}>
          <div className="max-w-4xl mx-auto px-4 py-8 pt-20 lg:pt-8">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Review Results</h1>
              <button
                onClick={handleBackToList}
                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 transition-all"
                title="Close"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="text-center mb-8">
              {/* Score Circle */}
              <div className="inline-block relative">
                <svg className="w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke={viewingCompletedAssessment.score >= viewingCompletedAssessment.passingScore ? '#10b981' : '#ef4444'}
                    strokeWidth="12"
                    strokeDasharray={`${(viewingCompletedAssessment.score / 100) * 553} 553`}
                    strokeLinecap="round"
                    transform="rotate(-90 96 96)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${viewingCompletedAssessment.score >= viewingCompletedAssessment.passingScore ? 'text-green-600' : 'text-red-600'}`}>
                    {viewingCompletedAssessment.score}%
                  </span>
                  <span className="text-sm text-slate-600 mt-1">Your Score</span>
                </div>
              </div>

              {/* Result Message */}
              <div className="mt-6">
                {viewingCompletedAssessment.score >= viewingCompletedAssessment.passingScore ? (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-full font-semibold">
                    <i className="fas fa-check-circle text-xl"></i>
                    You Passed!
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 text-red-800 rounded-full font-semibold">
                    <i className="fas fa-times-circle text-xl"></i>
                    You Did Not Pass
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
              <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-200 p-3 md:p-6 text-center">
                <i className="fas fa-check-circle text-green-600 text-xl md:text-3xl mb-1 md:mb-2"></i>
                <p className="text-xl md:text-3xl font-bold text-slate-900">{correctAnswers}</p>
                <p className="text-xs md:text-sm text-slate-600">Correct</p>
              </div>
              <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-200 p-3 md:p-6 text-center">
                <i className="fas fa-times-circle text-red-600 text-xl md:text-3xl mb-1 md:mb-2"></i>
                <p className="text-xl md:text-3xl font-bold text-slate-900">
                  {viewingCompletedAssessment.totalQuestions - correctAnswers}
                </p>
                <p className="text-xs md:text-sm text-slate-600">Incorrect</p>
              </div>
              <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-200 p-3 md:p-6 text-center">
                <i className="fas fa-clipboard-check text-blue-600 text-xl md:text-3xl mb-1 md:mb-2"></i>
                <p className="text-xl md:text-3xl font-bold text-slate-900">{viewingCompletedAssessment.totalQuestions}</p>
                <p className="text-xs md:text-sm text-slate-600">Total</p>
              </div>
            </div>

            {/* Detailed Review */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-list-check text-blue-600"></i>
                Detailed Review
              </h3>
              <div className="space-y-4">
                {viewingCompletedAssessment.questions.map((question, index) => {
                  const userAnswer = viewingCompletedAssessment.userAnswers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          <i className={`fas ${isCorrect ? 'fa-check' : 'fa-times'} text-white`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 mb-2">Q{index + 1}. {question.question}</p>
                          <div className="space-y-1 text-sm">
                            <p className={userAnswer !== undefined ? (isCorrect ? 'text-green-700' : 'text-red-700') : 'text-slate-600'}>
                              <strong>Your Answer:</strong> {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                            </p>
                            {!isCorrect && (
                              <p className="text-green-700">
                                <strong>Correct Answer:</strong> {question.options[question.correctAnswer]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={handleBackToList}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Assessments
              </button>
              <button
                onClick={handleCreateStudyPlan}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                <i className="fas fa-book-reader mr-2"></i>
                Create Study Plan
              </button>
            </div>
          </div>
        </div>

        {/* Video Player Modal */}
        <VideoPlayerModal
          video={playingVideo}
          onClose={handleCloseVideo}
        />
      </>
    );
  }

  // Study Plan Modal View
  if (studyPlanModal) {
    const wrongQuestions = studyPlanModal.questions.filter(
      q => studyPlanModal.userAnswers[q.id] !== q.correctAnswer
    );

    return (
      <>
        {!playingVideo && (
          <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        <div className={`min-h-screen bg-slate-50 ${!playingVideo ? 'lg:ml-72' : ''}`}>
          <div className="max-w-6xl mx-auto px-4 py-8 pt-20 lg:pt-8">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={handleCloseStudyPlan}
                className="mb-4 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <i className="fas fa-arrow-left"></i>
                Back to Review
              </button>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Study Plan</h1>
              <p className="text-slate-600">{studyPlanModal.title}</p>
            </div>

            {/* Questions You Got Wrong */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-times-circle text-red-600"></i>
                Questions You Got Wrong
              </h3>
              {wrongQuestions.length > 0 ? (
                <div className="space-y-3">
                  {wrongQuestions.map((question, index) => (
                    <div key={question.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-medium text-slate-900 mb-2">Q. {question.question}</p>
                      <div className="text-sm space-y-1">
                        <p className="text-red-700">
                          <strong>Your Answer:</strong> {studyPlanModal.userAnswers[question.id] !== undefined ? question.options[studyPlanModal.userAnswers[question.id]] : 'Not answered'}
                        </p>
                        <p className="text-green-700">
                          <strong>Correct Answer:</strong> {question.options[question.correctAnswer]}
                        </p>
                        <p className="text-purple-700">
                          <strong>Topic:</strong> {question.topic}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-600 py-4">You answered all questions correctly! 🎉</p>
              )}
            </div>

            {/* Focus Areas Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-clipboard-list text-orange-600"></i>
                Focus Areas & Study Notes
              </h3>
              
              {/* Add/Edit Note Form */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {editingNoteId ? 'Edit Note' : 'Add a New Note'} (Max 300 characters)
                </label>
                <textarea
                  value={currentNote}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      setCurrentNote(e.target.value);
                    }
                  }}
                  placeholder="E.g., Need to review audience targeting strategies, confused about attribution windows..."
                  className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows="3"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs ${currentNote.length >= 300 ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                    {currentNote.length}/300 characters
                  </span>
                  <div className="flex gap-2">
                    {editingNoteId && (
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => editingNoteId ? handleUpdateNote(studyPlanModal.id) : handleAddNote(studyPlanModal.id)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <i className={`fas ${editingNoteId ? 'fa-check' : 'fa-plus'}`}></i>
                      {editingNoteId ? 'Update Note' : 'Add Note'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Saved Notes */}
              {focusAreas[studyPlanModal.id] && focusAreas[studyPlanModal.id].length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Your Notes:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {focusAreas[studyPlanModal.id].map((note) => (
                      <div
                        key={note.id}
                        className="bg-white border border-orange-200 rounded-lg p-3 hover:shadow-md transition-shadow flex flex-col h-full"
                      >
                        <div className="flex-1 mb-3">
                          <p className="text-slate-900 text-sm whitespace-pre-wrap break-words">{note.text}</p>
                        </div>
                        <div className="border-t border-orange-100 pt-2 mt-auto">
                          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                            <i className="fas fa-clock"></i>
                            <span className="truncate">
                              {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {note.updatedAt && ' (edited)'}
                            </span>
                          </p>
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditNote(studyPlanModal.id, note.id)}
                              className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-center"
                              title="Edit note"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteNote(studyPlanModal.id, note.id)}
                              className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-center"
                              title="Delete note"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-slate-600">
                  <i className="fas fa-sticky-note text-slate-400 text-2xl mb-2"></i>
                  <p className="text-sm">No notes yet. Add your first note above!</p>
                </div>
              )}
            </div>

            {/* Related Videos Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-video text-blue-600"></i>
                Recommended Videos to Review
              </h3>
              {studyPlanModal.relatedVideos && studyPlanModal.relatedVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studyPlanModal.relatedVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handlePlayVideo(video)}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fab fa-youtube text-white text-xl"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{video.title}</p>
                          <p className="text-xs text-slate-600">{video.duration}</p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 font-medium">
                        <i className="fas fa-tag mr-1"></i>
                        {video.topic}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-600 py-4">No videos available for this assessment.</p>
              )}
            </div>
          </div>
        </div>

        {/* Video Player Modal */}
        <VideoPlayerModal
          video={playingVideo}
          onClose={handleCloseVideo}
        />
      </>
    );
  }

  // Main Assessment List View
  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="Course Assessments" subtitle="Loading assessments..." />
      
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4 pt-16 lg:pt-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <i className="fas fa-clipboard-check text-blue-600"></i>
              Course Assessments
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Complete your assigned assessments and track your progress
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 text-white">
              <div className="flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                <div className="w-full">
                  <p className="hidden md:block text-blue-100 text-sm font-medium">Pending Assessments</p>
                  <p className="text-2xl md:text-4xl font-bold mt-1 md:mt-2">{pendingAssessments.length}</p>
                </div>
                <i className="fas fa-clock text-3xl md:text-5xl text-blue-300 opacity-50 mt-2 md:mt-0"></i>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 text-white">
              <div className="flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                <div className="w-full">
                  <p className="hidden md:block text-green-100 text-sm font-medium">Completed</p>
                  <p className="text-2xl md:text-4xl font-bold mt-1 md:mt-2">{completedAssessments.length}</p>
                </div>
                <i className="fas fa-check-circle text-3xl md:text-5xl text-green-300 opacity-50 mt-2 md:mt-0"></i>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 text-white">
              <div className="flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                <div className="w-full">
                  <p className="hidden md:block text-purple-100 text-sm font-medium">Average Score</p>
                  <p className="text-2xl md:text-4xl font-bold mt-1 md:mt-2">
                    {completedAssessments.length > 0 
                      ? Math.round(completedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssessments.length)
                      : 0}%
                  </p>
                </div>
                <i className="fas fa-chart-line text-3xl md:text-5xl text-purple-300 opacity-50 mt-2 md:mt-0"></i>
              </div>
            </div>
          </div>

          {/* Pending Assessments */}
          {pendingAssessments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-exclamation-circle text-orange-600"></i>
                Pending Assessments
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingAssessments.map(assessment => {
                  const daysRemaining = getDaysRemaining(assessment.dueDate);
                  const isUrgent = daysRemaining <= 2;
                  
                  return (
                    <div
                      key={assessment.id}
                      className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden hover:shadow-lg transition-all ${
                        isUrgent ? 'border-red-300' : 'border-slate-200'
                      }`}
                    >
                      {isUrgent && (
                        <div className="bg-red-500 text-white text-xs font-bold px-4 py-1 text-center">
                          <i className="fas fa-exclamation-triangle mr-1"></i>
                          DUE SOON!
                        </div>
                      )}
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br from-${assessment.subjectColor}-500 to-${assessment.subjectColor}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white font-bold text-xs">{assessment.subjectCode}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{assessment.title}</h3>
                            <p className="text-sm text-slate-600">{assessment.subject}</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <i className="fas fa-user-tie w-4"></i>
                            <span>{assessment.teacher}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <i className="fas fa-clock w-4"></i>
                            <span>{assessment.duration} minutes</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <i className="fas fa-question-circle w-4"></i>
                            <span>{assessment.totalQuestions} questions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className={`fas fa-calendar w-4 ${isUrgent ? 'text-red-600' : 'text-slate-600'}`}></i>
                            <span className={isUrgent ? 'text-red-600 font-semibold' : 'text-slate-600'}>
                              Due: {new Date(assessment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {daysRemaining >= 0 && ` (${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left)`}
                            </span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getDifficultyColor(assessment.difficulty)}-100 text-${getDifficultyColor(assessment.difficulty)}-700 capitalize`}>
                            {assessment.difficulty}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                            Passing: {assessment.passingScore}%
                          </span>
                        </div>

                        {/* Topics */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-700 mb-2">Topics Covered:</p>
                          <div className="flex flex-wrap gap-1">
                            {assessment.topics.map((topic, idx) => (
                              <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleStartAssessment(assessment)}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <i className="fas fa-play-circle"></i>
                          Start Assessment
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Assessments */}
          {completedAssessments.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-check-circle text-green-600"></i>
                Completed Assessments
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completedAssessments.map(assessment => (
                  <div
                    key={assessment.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br from-${assessment.subjectColor}-500 to-${assessment.subjectColor}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-xs">{assessment.subjectCode}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-lg mb-1">{assessment.title}</h3>
                          <p className="text-sm text-slate-600">{assessment.subject}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${assessment.score >= assessment.passingScore ? 'text-green-600' : 'text-red-600'}`}>
                            {assessment.score}%
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <i className="fas fa-calendar-check w-4"></i>
                          <span>Completed: {new Date(assessment.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className={`fas ${assessment.score >= assessment.passingScore ? 'fa-check-circle text-green-600' : 'fa-times-circle text-red-600'} w-4`}></i>
                          <span className={assessment.score >= assessment.passingScore ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {assessment.score >= assessment.passingScore ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => handleViewCompletedAssessment(assessment)}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-eye"></i>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {assessments.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <i className="fas fa-clipboard-list text-slate-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Assessments Yet</h3>
              <p className="text-slate-600">Your teachers haven't assigned any assessments yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseAssessments;


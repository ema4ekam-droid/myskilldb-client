import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';

const JobAssessments = () => {
  const [currentPage, setCurrentPage] = useState('job-assessments');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [expandedSkills, setExpandedSkills] = useState({});
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);

  useEffect(() => {
    fetchJobsAndAssessments();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isAssessmentActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAssessmentActive, timeRemaining]);

  const fetchJobsAndAssessments = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Organize assessments by Job > Skills > Tests
      const jobsData = [
        {
          id: 'job-1',
          title: 'Frontend Developer',
          company: 'TechCorp Solutions',
          location: 'Bangalore, India',
          skills: [
            {
              id: 'skill-1',
              name: 'React Fundamentals',
              assessments: [
                {
                  id: 'test-1',
                  topic: 'Components & Props',
                  difficulty: 'intermediate',
                  duration: 20,
                  totalQuestions: 10,
                  passingScore: 70,
                  status: 'pending',
                  questions: [
                    {
                      id: 'q1',
                      question: 'What is the correct way to create a functional component in React?',
                      options: [
                        'function MyComponent() { return <div>Hello</div>; }',
                        'const MyComponent = () => { return <div>Hello</div>; }',
                        'class MyComponent extends React.Component { render() { return <div>Hello</div>; } }',
                        'Both A and B'
                      ],
                      correctAnswer: 3
                    },
                    {
                      id: 'q2',
                      question: 'Which hook is used to manage state in a functional component?',
                      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q3',
                      question: 'What does props stand for in React?',
                      options: ['Properties', 'Propositions', 'Protocols', 'Projections'],
                      correctAnswer: 0
                    },
                    {
                      id: 'q4',
                      question: 'How do you pass data from a parent component to a child component?',
                      options: ['Using state', 'Using props', 'Using context', 'Using refs'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q5',
                      question: 'What is the purpose of useEffect hook?',
                      options: [
                        'To manage component state',
                        'To handle side effects',
                        'To create context',
                        'To optimize performance'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q6',
                      question: 'Which method is called when a component is removed from the DOM?',
                      options: ['componentDidMount', 'componentWillUnmount', 'componentDidUpdate', 'constructor'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q7',
                      question: 'What is JSX?',
                      options: [
                        'A programming language',
                        'A syntax extension for JavaScript',
                        'A CSS framework',
                        'A database query language'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q8',
                      question: 'How do you update state in a functional component?',
                      options: [
                        'this.setState()',
                        'Using the setter function from useState',
                        'Directly modifying the state variable',
                        'Using useReducer only'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q9',
                      question: 'What is the virtual DOM?',
                      options: [
                        'A copy of the real DOM kept in memory',
                        'A database for storing component data',
                        'A CSS styling technique',
                        'A routing mechanism'
                      ],
                      correctAnswer: 0
                    },
                    {
                      id: 'q10',
                      question: 'Which hook would you use to access context values?',
                      options: ['useState', 'useEffect', 'useContext', 'useRef'],
                      correctAnswer: 2
                    }
                  ]
                },
                {
                  id: 'test-2',
                  topic: 'Hooks & State Management',
                  difficulty: 'advanced',
                  duration: 25,
                  totalQuestions: 12,
                  passingScore: 75,
                  status: 'completed',
                  score: 91.7,
                  completedDate: '2024-01-28'
                }
              ]
            },
            {
              id: 'skill-2',
              name: 'JavaScript ES6+',
              assessments: [
                {
                  id: 'test-3',
                  topic: 'Arrow Functions & Promises',
                  difficulty: 'intermediate',
                  duration: 15,
                  totalQuestions: 8,
                  passingScore: 75,
                  status: 'completed',
                  score: 87.5,
                  completedDate: '2024-01-27',
                  questions: [
                    {
                      id: 'q1',
                      question: 'What is the output of: const arr = [1, 2, 3]; console.log(arr.map(x => x * 2));',
                      options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', 'undefined'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q2',
                      question: 'What does the spread operator (...) do?',
                      options: [
                        'Multiplies numbers',
                        'Expands an iterable into individual elements',
                        'Creates a new array',
                        'Divides numbers'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q3',
                      question: 'What is a Promise in JavaScript?',
                      options: [
                        'A guarantee that code will run',
                        'An object representing eventual completion or failure of an async operation',
                        'A function that returns a value',
                        'A type of loop'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q4',
                      question: 'What is the difference between let and const?',
                      options: [
                        'No difference',
                        'let can be reassigned, const cannot',
                        'const is faster',
                        'let is block-scoped, const is not'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q5',
                      question: 'What does async/await do?',
                      options: [
                        'Makes code run faster',
                        'Handles asynchronous operations in a synchronous manner',
                        'Creates multiple threads',
                        'Optimizes memory usage'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q6',
                      question: 'What is destructuring in JavaScript?',
                      options: [
                        'Breaking code into pieces',
                        'Extracting values from arrays or objects',
                        'Deleting variables',
                        'Creating new objects'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q7',
                      question: 'What is the purpose of template literals?',
                      options: [
                        'To create HTML templates',
                        'To enable string interpolation and multi-line strings',
                        'To optimize performance',
                        'To create arrays'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q8',
                      question: 'What does the filter() method do?',
                      options: [
                        'Removes all elements',
                        'Creates a new array with elements that pass a test',
                        'Sorts an array',
                        'Modifies the original array'
                      ],
                      correctAnswer: 1
                    }
                  ]
                }
              ]
            },
            {
              id: 'skill-3',
              name: 'CSS Flexbox & Grid',
              assessments: [
                {
                  id: 'test-4',
                  topic: 'Modern Layout Techniques',
                  difficulty: 'beginner',
                  duration: 15,
                  totalQuestions: 8,
                  passingScore: 70,
                  status: 'completed',
                  score: 100,
                  completedDate: '2024-01-25',
                  questions: [
                    {
                      id: 'q1',
                      question: 'What CSS property is used to create a flex container?',
                      options: ['display: flex', 'flex: container', 'display: flexbox', 'flex-container: true'],
                      correctAnswer: 0
                    },
                    {
                      id: 'q2',
                      question: 'Which property aligns items along the main axis in Flexbox?',
                      options: ['align-items', 'justify-content', 'align-content', 'flex-align'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q3',
                      question: 'What is the default flex-direction?',
                      options: ['column', 'row', 'row-reverse', 'column-reverse'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q4',
                      question: 'How do you create a CSS Grid container?',
                      options: ['display: grid', 'grid: container', 'display: css-grid', 'grid-container: true'],
                      correctAnswer: 0
                    },
                    {
                      id: 'q5',
                      question: 'What does justify-content: space-between do?',
                      options: [
                        'Centers all items',
                        'Distributes items with space between them',
                        'Aligns items to the start',
                        'Stacks items vertically'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q6',
                      question: 'Which property controls the size of a flex item?',
                      options: ['flex-size', 'flex', 'size', 'flex-grow'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q7',
                      question: 'What is gap property used for in Grid?',
                      options: [
                        'To create empty cells',
                        'To set spacing between grid items',
                        'To set the grid width',
                        'To align items'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q8',
                      question: 'How do you make a flex item grow to fill available space?',
                      options: ['flex-grow: 1', 'flex: auto', 'flex-fill: true', 'grow: 1'],
                      correctAnswer: 0
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'job-2',
          title: 'Full Stack Developer',
          company: 'Innovation Labs',
          location: 'Remote',
          skills: [
            {
              id: 'skill-4',
              name: 'Node.js Basics',
              assessments: [
                {
                  id: 'test-5',
                  topic: 'Server-side JavaScript',
                  difficulty: 'intermediate',
                  duration: 20,
                  totalQuestions: 10,
                  passingScore: 70,
                  status: 'pending',
                  questions: [
                    {
                      id: 'q1',
                      question: 'What is Node.js?',
                      options: [
                        'A JavaScript framework',
                        'A JavaScript runtime built on Chrome V8 engine',
                        'A database',
                        'A programming language'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q2',
                      question: 'What is npm?',
                      options: [
                        'Node Package Manager',
                        'New Programming Method',
                        'Node Protocol Manager',
                        'Network Package Module'
                      ],
                      correctAnswer: 0
                    },
                    {
                      id: 'q3',
                      question: 'Which module is used to create a web server in Node.js?',
                      options: ['fs', 'http', 'path', 'url'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q4',
                      question: 'What is the purpose of package.json?',
                      options: [
                        'To store application data',
                        'To manage project metadata and dependencies',
                        'To configure the database',
                        'To handle routing'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q5',
                      question: 'Which keyword is used to import modules in Node.js?',
                      options: ['import', 'require', 'include', 'use'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q6',
                      question: 'What is Express.js?',
                      options: [
                        'A database',
                        'A web application framework for Node.js',
                        'A testing library',
                        'A CSS framework'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q7',
                      question: 'What does the fs module do?',
                      options: [
                        'Handles HTTP requests',
                        'Provides file system operations',
                        'Manages databases',
                        'Handles routing'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q8',
                      question: 'What is middleware in Express?',
                      options: [
                        'A database connector',
                        'Functions that execute during request-response cycle',
                        'A routing mechanism',
                        'A template engine'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q9',
                      question: 'Which method is used to handle POST requests in Express?',
                      options: ['app.post()', 'app.get()', 'app.request()', 'app.send()'],
                      correctAnswer: 0
                    },
                    {
                      id: 'q10',
                      question: 'What is the purpose of process.env?',
                      options: [
                        'To process data',
                        'To access environment variables',
                        'To manage processes',
                        'To configure the server'
                      ],
                      correctAnswer: 1
                    }
                  ]
                }
              ]
            },
            {
              id: 'skill-5',
              name: 'REST APIs & HTTP',
              assessments: [
                {
                  id: 'test-6',
                  topic: 'API Integration Basics',
                  difficulty: 'intermediate',
                  duration: 25,
                  totalQuestions: 12,
                  passingScore: 75,
                  status: 'pending',
                  questions: [
                    {
                      id: 'q1',
                      question: 'What does REST stand for?',
                      options: [
                        'Rapid Execution Service Technology',
                        'Representational State Transfer',
                        'Remote Execution State Transfer',
                        'Resource Execution Service Technology'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q2',
                      question: 'Which HTTP method is used to retrieve data?',
                      options: ['POST', 'PUT', 'GET', 'DELETE'],
                      correctAnswer: 2
                    },
                    {
                      id: 'q3',
                      question: 'What status code indicates a successful request?',
                      options: ['404', '500', '200', '301'],
                      correctAnswer: 2
                    },
                    {
                      id: 'q4',
                      question: 'Which HTTP method is idempotent?',
                      options: ['POST', 'PUT', 'PATCH', 'Both B and C'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q5',
                      question: 'What does a 404 status code mean?',
                      options: ['Server Error', 'Not Found', 'Unauthorized', 'Bad Request'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q6',
                      question: 'Which header specifies the format of the request body?',
                      options: ['Accept', 'Content-Type', 'Authorization', 'User-Agent'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q7',
                      question: 'What is the purpose of the Authorization header?',
                      options: [
                        'To specify content type',
                        'To send authentication credentials',
                        'To cache responses',
                        'To compress data'
                      ],
                      correctAnswer: 1
                    },
                    {
                      id: 'q8',
                      question: 'Which method is used to update a resource partially?',
                      options: ['PUT', 'PATCH', 'UPDATE', 'POST'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q9',
                      question: 'What does CORS stand for?',
                      options: [
                        'Cross-Origin Resource Sharing',
                        'Common Origin Resource System',
                        'Cross-Origin Request Security',
                        'Common Object Resource Sharing'
                      ],
                      correctAnswer: 0
                    },
                    {
                      id: 'q10',
                      question: 'What is JSON?',
                      options: [
                        'JavaScript Object Notation',
                        'Java Syntax Object Notation',
                        'JavaScript Oriented Notation',
                        'Java Script Object Network'
                      ],
                      correctAnswer: 0
                    },
                    {
                      id: 'q11',
                      question: 'Which status code indicates resource created successfully?',
                      options: ['200', '201', '204', '301'],
                      correctAnswer: 1
                    },
                    {
                      id: 'q12',
                      question: 'What is an endpoint in REST API?',
                      options: [
                        'The final destination',
                        'A URL where an API resource can be accessed',
                        'The server location',
                        'The database connection'
                      ],
                      correctAnswer: 1
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];

      setJobs(jobsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load assessments');
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleJob = (jobId) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const toggleSkill = (skillId) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skillId]: !prev[skillId]
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusColor = (status) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-700 border-green-300' 
      : 'bg-orange-100 text-orange-700 border-orange-300';
  };

  const handleStartAssessment = (job, skill, assessment) => {
    setSelectedAssessment({ ...assessment, job, skill });
    setIsAssessmentActive(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeRemaining(assessment.duration * 60);
    setShowResults(false);
    toast.success(`Assessment started! You have ${assessment.duration} minutes.`);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedAssessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = () => {
    if (!selectedAssessment) return;

    let correctCount = 0;
    selectedAssessment.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / selectedAssessment.questions.length) * 100;
    const passed = score >= selectedAssessment.passingScore;

    const results = {
      score: score,
      correctCount: correctCount,
      totalQuestions: selectedAssessment.questions.length,
      passed: passed,
      passingScore: selectedAssessment.passingScore,
      timeTaken: (selectedAssessment.duration * 60) - timeRemaining,
      answers: userAnswers
    };

    setAssessmentResults(results);
    setShowResults(true);
    setIsAssessmentActive(false);

    // Update assessment status in the jobs data
    const updatedJobs = jobs.map(job => ({
      ...job,
      skills: job.skills.map(skill => ({
        ...skill,
        assessments: skill.assessments.map(a => {
          if (a.id === selectedAssessment.id) {
            return {
              ...a,
              status: 'completed',
              score: score.toFixed(1),
              completedDate: new Date().toISOString()
            };
          }
          return a;
        })
      }))
    }));
    setJobs(updatedJobs);

    if (passed) {
      toast.success(`🎉 Congratulations! You passed with ${score.toFixed(1)}%`);
    } else {
      toast.error(`You scored ${score.toFixed(1)}%. Keep practicing!`);
    }
  };

  const handleCloseAssessment = () => {
    setIsAssessmentActive(false);
    setShowResults(false);
    setSelectedAssessment(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(null);
    setAssessmentResults(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate stats
  const totalTests = jobs.reduce((sum, job) => 
    sum + job.skills.reduce((s, skill) => s + skill.assessments.length, 0), 0
  );
  const completedTests = jobs.reduce((sum, job) => 
    sum + job.skills.reduce((s, skill) => 
      s + skill.assessments.filter(a => a.status === 'completed').length, 0
    ), 0
  );
  const pendingTests = totalTests - completedTests;
  const completedAssessments = jobs.flatMap(job => 
    job.skills.flatMap(skill => skill.assessments.filter(a => a.status === 'completed' && a.score))
  );
  const averageScore = completedAssessments.length > 0
    ? completedAssessments.reduce((sum, a) => sum + parseFloat(a.score), 0) / completedAssessments.length
    : 0;

  // Assessment taking interface (same as before)
  if (isAssessmentActive && selectedAssessment) {
    const currentQuestion = selectedAssessment.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100;

    return (
      <>
        <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-slate-900">{selectedAssessment.skill.name}</h2>
                <p className="text-xs lg:text-sm text-slate-600">{selectedAssessment.topic}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  <i className="fas fa-clock mr-2"></i>
                  {formatTime(timeRemaining)}
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
                      handleCloseAssessment();
                    }
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl text-slate-700"></i>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto mt-4">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}
              </p>
            </div>
          </div>

          {/* Question Content */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                  Question {currentQuestionIndex + 1}
                </span>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-6">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      userAnswers[currentQuestion.id] === index
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        userAnswers[currentQuestion.id] === index
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-slate-300'
                      }`}>
                        {userAnswers[currentQuestion.id] === index && (
                          <i className="fas fa-check text-white text-xs"></i>
                        )}
                      </div>
                      <span className="text-sm lg:text-base text-slate-700">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentQuestionIndex === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Previous
                </button>

                {currentQuestionIndex === selectedAssessment.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitAssessment}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <i className="fas fa-check mr-2"></i>
                    Submit Assessment
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Next
                    <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Question Navigation Grid */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-4">Question Navigation</h4>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {selectedAssessment.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-full aspect-square rounded-lg font-medium text-sm transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-indigo-600 text-white'
                        : userAnswers[q.id] !== undefined
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-600">
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                  Current
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  Answered
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-100 rounded"></div>
                  Not Answered
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Results view (keeping the existing results interface)
  if (showResults && assessmentResults && selectedAssessment) {
    return (
      <>
        <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Results Header */}
            <div className={`rounded-xl shadow-lg p-8 text-center mb-6 ${
              assessmentResults.passed 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-red-500 to-orange-500'
            }`}>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`fas ${assessmentResults.passed ? 'fa-check' : 'fa-times'} text-4xl ${
                  assessmentResults.passed ? 'text-green-500' : 'text-red-500'
                }`}></i>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {assessmentResults.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h2>
              <p className="text-white text-opacity-90 mb-1">
                {selectedAssessment.skill.name} - {selectedAssessment.topic}
              </p>
              <p className="text-white text-opacity-75 text-sm mb-4">
                {selectedAssessment.job.title} at {selectedAssessment.job.company}
              </p>
              <div className="text-5xl font-bold text-white mb-2">
                {assessmentResults.score.toFixed(1)}%
              </div>
              <p className="text-white text-opacity-90">
                {assessmentResults.correctCount} out of {assessmentResults.totalQuestions} correct
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="text-center">
                  <i className="fas fa-bullseye text-indigo-600 text-2xl mb-2"></i>
                  <p className="text-2xl font-bold text-slate-900">{assessmentResults.score.toFixed(1)}%</p>
                  <p className="text-xs text-slate-600">Your Score</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="text-center">
                  <i className="fas fa-flag text-green-600 text-2xl mb-2"></i>
                  <p className="text-2xl font-bold text-slate-900">{assessmentResults.passingScore}%</p>
                  <p className="text-xs text-slate-600">Passing Score</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="text-center">
                  <i className="fas fa-clock text-blue-600 text-2xl mb-2"></i>
                  <p className="text-2xl font-bold text-slate-900">{formatTime(assessmentResults.timeTaken)}</p>
                  <p className="text-xs text-slate-600">Time Taken</p>
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Question Review</h3>
              <div className="space-y-4">
                {selectedAssessment.questions.map((question, index) => {
                  const userAnswer = assessmentResults.answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div
                      key={question.id}
                      className={`border-l-4 p-4 rounded-lg ${
                        isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                          isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 mb-3">{question.question}</p>
                          
                          {userAnswer !== undefined ? (
                            <>
                              <div className={`p-2 rounded mb-2 ${
                                isCorrect ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                <p className="text-sm">
                                  <span className="font-medium">Your Answer:</span>{' '}
                                  {question.options[userAnswer]}
                                  {isCorrect ? (
                                    <i className="fas fa-check-circle text-green-600 ml-2"></i>
                                  ) : (
                                    <i className="fas fa-times-circle text-red-600 ml-2"></i>
                                  )}
                                </p>
                              </div>
                              {!isCorrect && (
                                <div className="p-2 rounded bg-green-100">
                                  <p className="text-sm">
                                    <span className="font-medium">Correct Answer:</span>{' '}
                                    {question.options[question.correctAnswer]}
                                    <i className="fas fa-lightbulb text-green-600 ml-2"></i>
                                  </p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="p-2 rounded bg-orange-100">
                              <p className="text-sm">
                                <span className="font-medium">Not Answered</span>
                                <i className="fas fa-exclamation-triangle text-orange-600 ml-2"></i>
                              </p>
                              <p className="text-sm mt-1">
                                <span className="font-medium">Correct Answer:</span>{' '}
                                {question.options[question.correctAnswer]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCloseAssessment}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                <i className="fas fa-home mr-2"></i>
                Back to Assessments
              </button>
              {!assessmentResults.passed && (
                <button
                  onClick={() => {
                    handleCloseAssessment();
                    setTimeout(() => handleStartAssessment(selectedAssessment.job, selectedAssessment.skill, selectedAssessment), 100);
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Retake Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main list view with Job > Skills > Tests hierarchy
  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="Job Assessments" subtitle="Loading skill assessments..." />
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Skill Assessments</h1>
          <p className="text-sm text-slate-600">Test your knowledge on job-related skills organized by position</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clipboard-list text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalTests}</p>
                <p className="text-xs text-slate-600">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{completedTests}</p>
                <p className="text-xs text-slate-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-orange-600 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{pendingTests}</p>
                <p className="text-xs text-slate-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-star text-purple-600 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{averageScore.toFixed(0)}%</p>
                <p className="text-xs text-slate-600">Avg Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List with Accordions */}
        <div className="space-y-4">
          {jobs.map((job) => {
            const jobCompleted = job.skills.reduce((sum, skill) => 
              sum + skill.assessments.filter(a => a.status === 'completed').length, 0
            );
            const jobTotal = job.skills.reduce((sum, skill) => sum + skill.assessments.length, 0);

            return (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border-2 border-slate-200 overflow-hidden">
                {/* Job Header */}
                <button
                  onClick={() => toggleJob(job.id)}
                  className="w-full p-4 lg:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-briefcase text-indigo-600 text-xl"></i>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg lg:text-xl font-bold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-600">
                        <i className="fas fa-building mr-2"></i>
                        {job.company} • {job.location}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {jobCompleted}/{jobTotal} tests completed • {job.skills.length} skills
                      </p>
                    </div>
                  </div>
                  <i className={`fas fa-chevron-${expandedJobs[job.id] ? 'up' : 'down'} text-slate-400 text-xl`}></i>
                </button>

                {/* Skills List */}
                {expandedJobs[job.id] && (
                  <div className="border-t border-slate-200 bg-slate-50 p-4">
                    <div className="space-y-3">
                      {job.skills.map((skill) => {
                        const skillCompleted = skill.assessments.filter(a => a.status === 'completed').length;
                        const skillTotal = skill.assessments.length;

                        return (
                          <div key={skill.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            {/* Skill Header */}
                            <button
                              onClick={() => toggleSkill(skill.id)}
                              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <i className="fas fa-code text-blue-600"></i>
                                </div>
                                <div className="text-left">
                                  <h4 className="font-bold text-slate-900">{skill.name}</h4>
                                  <p className="text-xs text-slate-600">
                                    {skillCompleted}/{skillTotal} tests completed
                                  </p>
                                </div>
                              </div>
                              <i className={`fas fa-chevron-${expandedSkills[skill.id] ? 'up' : 'down'} text-slate-400`}></i>
                            </button>

                            {/* Tests List */}
                            {expandedSkills[skill.id] && (
                              <div className="border-t border-slate-200 bg-slate-50 p-4">
                                <div className="space-y-3">
                                  {skill.assessments.map((assessment) => (
                                    <div
                                      key={assessment.id}
                                      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
                                    >
                                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                        <div className="flex-1">
                                          <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(assessment.status)}`}>
                                              {assessment.status === 'completed' ? (
                                                <>
                                                  <i className="fas fa-check-circle mr-1"></i>
                                                  Completed
                                                </>
                                              ) : (
                                                <>
                                                  <i className="fas fa-clock mr-1"></i>
                                                  Pending
                                                </>
                                              )}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(assessment.difficulty)}`}>
                                              {assessment.difficulty}
                                            </span>
                                            {assessment.status === 'completed' && assessment.score && (
                                              <span className="px-2 py-1 rounded-full text-xs font-semibold border bg-purple-100 text-purple-700 border-purple-300">
                                                <i className="fas fa-star mr-1"></i>
                                                {assessment.score}%
                                              </span>
                                            )}
                                          </div>

                                          <h5 className="font-bold text-slate-900 mb-1">{assessment.topic}</h5>
                                          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                                            <span>
                                              <i className="fas fa-clock mr-1"></i>
                                              {assessment.duration} min
                                            </span>
                                            <span>
                                              <i className="fas fa-question-circle mr-1"></i>
                                              {assessment.totalQuestions} questions
                                            </span>
                                            <span>
                                              <i className="fas fa-chart-line mr-1"></i>
                                              Pass: {assessment.passingScore}%
                                            </span>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => handleStartAssessment(job, skill, assessment)}
                                          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                            assessment.status === 'pending'
                                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                              : 'bg-green-600 hover:bg-green-700 text-white'
                                          }`}
                                        >
                                          <i className={`fas ${assessment.status === 'pending' ? 'fa-play' : 'fa-redo'} mr-2`}></i>
                                          {assessment.status === 'pending' ? 'Start' : 'Retake'}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default JobAssessments;

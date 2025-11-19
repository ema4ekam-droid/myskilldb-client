import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import toast from 'react-hot-toast';
import { getRequest, postRequest } from '../../../api/apiRequests';
import { VideoPlayerModal } from '../../../components/student-components/student-courses-components/course-assessments-components';

const CourseAssessments = () => {
  const [currentPage, setCurrentPage] = useState('course-assessments');
  const [isLoading, setIsLoading] = useState(true);
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
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  // Redux state
  const user = useSelector((state) => state.user);
  const assignment = useSelector((state) => state.assignment);

  // State for subjects and topics
  const [subjects, setSubjects] = useState([]);
  const [subjectAssessments, setSubjectAssessments] = useState([]);
  const [topicAssessments, setTopicAssessments] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!user?.organizationId || !assignment?._id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getRequest(
          `/organization-setup/teachingAssignments/${user.organizationId}/${assignment._id}`
        );
        
        if (response.data.success && response.data.data) {
          // Now response.data.data is an array of teaching assignments
          const teachingAssignments = Array.isArray(response.data.data) ? response.data.data : [];

          // Transform API data to subjects format
          const transformedSubjects = teachingAssignments.map((item, index) => {
            const subjectId = item.subjectId?._id || item.subjectId;
            const subjectName = item.subjectId?.name || 'Unknown Subject';
            const subjectCode = item.subjectId?.code || `SUB${String(index + 1).padStart(3, '0')}`;
            const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'red', 'yellow', 'indigo'];
            const color = colors[index % colors.length];

            return {
              _id: subjectId,
              name: subjectName,
              code: subjectCode,
              color: color,
              topics: [] // Will be fetched when subject is selected
            };
          });

          setSubjects(transformedSubjects);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Failed to load subjects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [user?.organizationId, assignment?._id]);

  // Fetch topics when subject is selected
  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedSubject) {
        return;
      }

      try {
        const response = await getRequest(`/topics/subject/${selectedSubject}`);
        
        if (response.data.success) {
          const apiTopics = response.data.data || [];
          const mappedTopics = apiTopics.map((topic) => ({
            ...topic,
            title: topic.name || topic.title,
            _id: topic._id,
          }));

          // Update subjects with topics for the selected subject
          setSubjects(prev => prev.map(subject => 
            subject._id === selectedSubject
              ? { ...subject, topics: mappedTopics }
              : subject
          ));
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
        toast.error('Failed to load topics');
      }
    };

    fetchTopics();
  }, [selectedSubject]);

  // Fetch subject-level assessments when subject is selected
  useEffect(() => {
    const fetchSubjectAssessments = async () => {
      if (!selectedSubject || !user?._id || !user?.organizationId) {
        setSubjectAssessments([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getRequest(
          `/student-test-history/tests/${selectedSubject}?studentId=${user._id}&organizationId=${user.organizationId}`
        );
        if (response.data.success && response.data.data) {
          const assessments = response.data.data || [];
          
          // Transform API data to match component's expected format
          const transformedAssessments = assessments.map((item, index) => {
              const selectedSubjectData = subjects.find(s => s._id === selectedSubject);
              
              // Determine status
              let status = 'pending';
              if (item.status === 'Completed') {
                status = 'completed';
              } else if (item.status === 'Pending' && item.startedAt) {
                status = 'in-progress';
              }

              return {
                id: index + 1,
                _id: item._id,
                title: item.testName || 'Untitled Assessment',
                subject: selectedSubjectData?.name || 'Unknown Subject',
                subjectId: selectedSubject,
                subjectCode: selectedSubjectData?.code || 'SUB001',
                subjectColor: selectedSubjectData?.color || 'blue',
                assignedDate: new Date().toISOString().split('T')[0], // Default to today
                totalQuestions: item.questionCount || 0,
                status: status,
                difficulty: item.difficultyLevel?.toLowerCase() || 'medium',
                type: 'subject',
                score: item.score ?? undefined,
                completedDate: undefined, // Will be set when completed
                userAnswers: {}, // Will be populated when viewing completed assessment
                questions: [], // Questions would need to be fetched separately
                testId: item.testId,
                studentTestHistoryId: item._id
              };
            });

          setSubjectAssessments(transformedAssessments);
        } else {
          setSubjectAssessments([]);
        }
      } catch (error) {
        console.error('Error fetching subject assessments:', error);
        toast.error('Failed to load assessments');
        setSubjectAssessments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectAssessments();
  }, [selectedSubject, user?._id, user?.organizationId, subjects]);

  // Fetch topic-level assessments when topic is selected
  useEffect(() => {
    const fetchTopicAssessments = async () => {
      if (!selectedTopic || !selectedSubject || !user?._id || !user?.organizationId) {
        setTopicAssessments([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getRequest(
          `/student-test-history/tests/${selectedSubject}?studentId=${user._id}&organizationId=${user.organizationId}&topicId=${selectedTopic}`
        );
        if (response.data.success && response.data.data) {
          const assessments = response.data.data || [];
          
          // Transform API data to match component's expected format
          const transformedAssessments = assessments.map((item, index) => {
              const selectedSubjectData = subjects.find(s => s._id === selectedSubject);
              const currentTopics = selectedSubjectData?.topics || [];
              const selectedTopicData = currentTopics.find(t => t._id === selectedTopic);
              
              // Determine status
              let status = 'pending';
              if (item.status === 'Completed') {
                status = 'completed';
              } else if (item.status === 'Pending' && item.startedAt) {
                status = 'in-progress';
              }

              return {
                id: index + 1,
                _id: item._id,
                title: item.testName || 'Untitled Assessment',
                subject: selectedSubjectData?.name || 'Unknown Subject',
                subjectId: selectedSubject,
                topicId: selectedTopic,
                topicName: selectedTopicData?.name || 'Unknown Topic',
                subjectCode: selectedSubjectData?.code || 'SUB001',
                subjectColor: selectedSubjectData?.color || 'blue',
                assignedDate: new Date().toISOString().split('T')[0], // Default to today
                totalQuestions: item.questionCount || 0,
                status: status,
                difficulty: item.difficultyLevel?.toLowerCase() || 'medium',
                type: 'topic',
                score: item.score ?? undefined,
                completedDate: undefined, // Will be set when completed
                userAnswers: {}, // Will be populated when viewing completed assessment
                questions: [], // Questions would need to be fetched separately
                testId: item.testId,
                studentTestHistoryId: item._id
              };
            });

          setTopicAssessments(transformedAssessments);
        } else {
          setTopicAssessments([]);
        }
      } catch (error) {
        console.error('Error fetching topic assessments:', error);
        toast.error('Failed to load topic assessments');
        setTopicAssessments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopicAssessments();
  }, [selectedTopic, selectedSubject, user?._id, user?.organizationId, subjects]);

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

  const handleStartAssessment = async (assessment) => {
    try {
      setIsLoading(true);
      
      // Fetch test details including questions
      const response = await getRequest(`/tests/${assessment.testId}`);
      if (response.data.success && response.data.data) {
        const testData = response.data.data;
        
        // Transform questions to match component's expected format
        const transformedQuestions = (testData.questions || []).map((q, index) => {
          const correctAnswerText = q.answer?.correctAnswer || '';
          const correctAnswerIndex = q.options?.findIndex(opt => opt === correctAnswerText) ?? -1;
          
          return {
            id: q._id || `q${index + 1}`,
            question: q.questionText || '',
            options: q.options || [],
            correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
            topic: q.topicId?.name || 'General',
          };
        });
        
        // Merge test data with assessment data
        const fullAssessment = {
          ...assessment,
          questions: transformedQuestions,
          duration: 30, // Default duration
          passingScore: 70, // Default passing score
        };
        
        setActiveAssessment(fullAssessment);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setTimeRemaining(30 * 60); // Default 30 minutes in seconds
        setIsAssessmentStarted(true);
        setShowResults(false);
        setShowWarning(false);
      } else {
        toast.error('Failed to load test details');
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
      toast.error('Failed to load test details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartAssessment = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining((activeAssessment?.duration || 30) * 60);
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

  const handleSubmitAssessment = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Calculate results
    let correctAnswers = 0;
    const answerRecords = activeAssessment.questions.map(question => {
      const userAnswerIndex = answers[question.id];
      const isCorrect = userAnswerIndex === question.correctAnswer;
      if (isCorrect) {
        correctAnswers++;
      }
      
      return {
        questionId: question.id,
        selectedAnswer: userAnswerIndex !== undefined ? question.options[userAnswerIndex] : '',
        isCorrect: isCorrect
      };
    });

    const score = Math.round((correctAnswers / activeAssessment.questions.length) * 100);
    const passed = score >= activeAssessment.passingScore;

    // Save to backend
    if (activeAssessment.studentTestHistoryId) {
      try {
        await postRequest(
          `/student-test-history/${activeAssessment.studentTestHistoryId}/complete`,
          {
            answers: answerRecords,
            score,
            correctAnswers,
            totalQuestions: activeAssessment.questions.length
          }
        );
      } catch (error) {
        console.error('Error saving test results:', error);
        toast.error('Failed to save test results');
      }
    }

    setAssessmentResults({
      score,
      correctAnswers,
      totalQuestions: activeAssessment.questions.length,
      passed,
      answers: answers
    });

    setShowResults(true);
    setIsAssessmentStarted(false);

    // Update subjectAssessments
    setSubjectAssessments(prev => prev.map(a => 
      a._id === activeAssessment.studentTestHistoryId
        ? { ...a, status: 'completed', score, completedDate: new Date().toISOString().split('T')[0] }
        : a
    ));
    
    // Update topicAssessments if it's a topic-level assessment
    if (activeAssessment.type === 'topic') {
      setTopicAssessments(prev => prev.map(a => 
      a._id === activeAssessment.studentTestHistoryId
        ? { ...a, status: 'completed', score, completedDate: new Date().toISOString().split('T')[0] }
        : a
    ));
    }
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

  const handleViewCompletedAssessment = async (assessment) => {
    try {
      setIsLoading(true);
      
      // Fetch test details with student answers
      const response = await getRequest(`/student-test-history/${assessment.studentTestHistoryId}`);
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        const questions = data.questions || [];
        
        // Transform questions to match component format
        const transformedQuestions = questions.map((q) => ({
          id: q.id || q._id,
          question: q.question || q.questionText,
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          topic: q.topic || 'General',
          topicId: q.topicId || null,
        }));
        console.log("transformedQuestions", transformedQuestions);
        // Create userAnswers object from student answers
        const userAnswers = {};
        questions.forEach((q) => {
          if (q.studentAnswer) {
            // Find the index of the selected answer in options
            const selectedIndex = q.options.findIndex(opt => opt === q.studentAnswer.selectedAnswer);
            if (selectedIndex >= 0) {
              userAnswers[q.id || q._id] = selectedIndex;
            }
          }
        });
        
        const completedAssessment = {
          ...assessment,
          questions: transformedQuestions,
          userAnswers: userAnswers,
          score: data.score || assessment.score,
          totalQuestions: data.totalQuestions || assessment.totalQuestions,
          correctAnswers: data.correctAnswers || 0,
          passingScore: 70, // Default, can be updated if available in API
          completedDate: data.completedAt ? new Date(data.completedAt).toISOString().split('T')[0] : assessment.completedDate,
        };
        
        setViewingCompletedAssessment(completedAssessment);
      } else {
        toast.error('Failed to load assessment details');
        setViewingCompletedAssessment(assessment);
      }
    } catch (error) {
      console.error('Error fetching assessment details:', error);
      toast.error('Failed to load assessment details');
      setViewingCompletedAssessment(assessment);
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRequestRetake = () => {
    toast.error('Please contact your teacher to request permission to retake this assessment.', {
      duration: 5000,
      icon: '📧'
    });
  };

  const handleCreateStudyPlan = async () => {
    // Get all wrong answers and extract their topic IDs
    const wrongQuestions = viewingCompletedAssessment.questions.filter(
      q => viewingCompletedAssessment.userAnswers[q.id] !== q.correctAnswer
    );
    const topicIds = [...new Set(
      wrongQuestions
        .map(q => q.topicId)
        .filter(id => id !== null && id !== undefined)
    )];
    
    // Fetch videos for these topic IDs
    if (topicIds.length > 0) {
      try {
        setIsLoading(true);
        const topicIdsQuery = topicIds.map(id => `topicIds=${id}`).join('&');
        console.log("topicIdsQuery", topicIdsQuery);
        const response = await getRequest(`/recordings/topics?${topicIdsQuery}`);
        if (response.data.success && response.data.data) {
          setRecommendedVideos(response.data.data || []);
        } else {
          setRecommendedVideos([]);
        }
      } catch (error) {
        console.error('Error fetching recommended videos:', error);
        setRecommendedVideos([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setRecommendedVideos([]);
    }
        
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
    setRecommendedVideos([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Group videos by topic
  const groupVideosByTopic = (videos) => {
    const grouped = {};
    videos.forEach((video) => {
      const topicId = String(video.topicId?._id || video.topicId);
      const topicName = video.topicId?.name || 'General';
      if (!grouped[topicId]) {
        grouped[topicId] = {
          topicId,
          topicName,
          videos: []
        };
      }
      grouped[topicId].videos.push(video);
    });
    return Object.values(grouped);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  // Get selected subject data
  const selectedSubjectData = subjects.find(s => s._id === selectedSubject);
  
  // Get topics for selected subject
  const currentTopics = selectedSubjectData?.topics || [];
  
  // Filter subject-level tests by selected subject
  const displayedSubjectTests = selectedSubject ? subjectAssessments : [];
  
  // Filter topic-level tests by selected topic
  const displayedTopicTests = selectedTopic ? topicAssessments : [];

  // Render test card component
  const renderTestCard = (assessment) => {
    const isPending = assessment.status === 'pending';
    const isCompleted = assessment.status === 'completed';
    
    if (isPending) {
      return (
        <div
          key={assessment.id || assessment._id}
          className="bg-white rounded-xl shadow-sm border-2 border-slate-200 overflow-hidden hover:shadow-lg transition-all"
        >
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br from-${assessment.subjectColor}-500 to-${assessment.subjectColor}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-xs">{assessment.subjectCode}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{assessment.title}</h3>
                <p className="text-sm text-slate-600">{assessment.subject}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <i className="fas fa-question-circle w-4"></i>
                <span>{assessment.totalQuestions} questions</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getDifficultyColor(assessment.difficulty)}-100 text-${getDifficultyColor(assessment.difficulty)}-700 capitalize`}>
                {assessment.difficulty}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getStatusColor(assessment.status)}-100 text-${getStatusColor(assessment.status)}-700 capitalize`}>
                {assessment.status === 'pending' ? 'Pending' : assessment.status === 'in-progress' ? 'In Progress' : 'Completed'}
              </span>
            </div>
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
    } else if (isCompleted) {
      return (
        <div
          key={assessment.id || assessment._id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
        >
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br from-${assessment.subjectColor}-500 to-${assessment.subjectColor}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-xs">{assessment.subjectCode}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{assessment.title}</h3>
                <p className="text-sm text-slate-600">{assessment.subject}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {assessment.score}%
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <i className="fas fa-calendar-check w-4"></i>
                <span>Completed: {assessment.completedDate ? new Date(assessment.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getStatusColor(assessment.status)}-100 text-${getStatusColor(assessment.status)}-700 capitalize`}>
                {assessment.status === 'completed' ? 'Completed' : assessment.status === 'in-progress' ? 'In Progress' : 'Pending'}
              </span>
            </div>
            <button
              onClick={() => handleViewCompletedAssessment(assessment)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-eye"></i>
              View Details
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

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

            {/* Related Videos Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-video text-blue-600"></i>
                Recommended Videos to Review
              </h3>
              {recommendedVideos.length > 0 ? (
                <div className="space-y-6">
                  {groupVideosByTopic(recommendedVideos).map((topicGroup) => (
                    <div key={topicGroup.topicId}>
                      <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <i className="fas fa-tag text-purple-600"></i>
                        {topicGroup.topicName}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topicGroup.videos.map((video) => {
                          const videoId = getYouTubeVideoId(video.link);
                          return (
                            <div
                              key={video._id}
                              onClick={() => setPlayingVideo({
                                videoId: videoId,
                                title: video.name,
                                duration: video.duration,
                                topic: topicGroup.topicName,
                                description: video.description
                              })}
                              className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <i className="fab fa-youtube text-white text-xl"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-900 text-sm mb-1">{video.name}</p>
                                  {video.description && (
                                    <p className="text-xs text-slate-600 mb-2 line-clamp-2">{video.description}</p>
                                  )}
                                  <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <span className="flex items-center gap-1">
                                      <i className="fas fa-clock"></i>
                                      {video.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <i className="fas fa-play-circle"></i>
                                      Watch Now
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-600 py-4">No videos available for these topics.</p>
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
          {/* Subject Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic(''); // Reset topic when subject changes
              }}
              className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Select a Subject --</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          {/* Subject-Level Tests */}
          {selectedSubject && displayedSubjectTests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-book text-blue-600"></i>
                Subject-Level Tests
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {displayedSubjectTests.map(assessment => renderTestCard(assessment))}
              </div>
            </div>
          )}

          {/* No Subject Tests Available */}
          {selectedSubject && displayedSubjectTests.length === 0 && !isLoading && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-book text-blue-600"></i>
                Subject-Level Tests
              </h2>
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                <i className="fas fa-clipboard-list text-slate-300 text-5xl mb-3"></i>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Subject Tests Available</h3>
                <p className="text-slate-600">There are no subject-level tests available for this subject.</p>
              </div>
            </div>
          )}

          {/* Topics List */}
          {selectedSubject && currentTopics.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-tags text-purple-600"></i>
                Topics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {currentTopics.map((topic) => (
                  <button
                    key={topic._id}
                    onClick={() => setSelectedTopic(topic._id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTopic === topic._id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <i className={`fas fa-tag ${selectedTopic === topic._id ? 'text-purple-600' : 'text-slate-500'}`}></i>
                      <span className={`font-medium ${selectedTopic === topic._id ? 'text-purple-900' : 'text-slate-700'}`}>
                        {topic.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topic-Level Tests */}
          {selectedTopic && displayedTopicTests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-clipboard-list text-green-600"></i>
                Topic-Level Tests
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {displayedTopicTests.map(assessment => renderTestCard(assessment))}
              </div>
            </div>
          )}

          {/* Empty States */}
          {!selectedSubject && !isLoading && (
            <div className="text-center py-16">
              <i className="fas fa-clipboard-list text-slate-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Subject</h3>
              <p className="text-slate-600">Please select a subject to view assessments.</p>
            </div>
          )}

          {selectedSubject && displayedSubjectTests.length === 0 && currentTopics.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <i className="fas fa-clipboard-list text-slate-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Tests Available</h3>
              <p className="text-slate-600">No tests available for this subject.</p>
            </div>
          )}

          {selectedTopic && displayedTopicTests.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <i className="fas fa-clipboard-list text-slate-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Topic Tests Available</h3>
              <p className="text-slate-600">No tests available for this topic.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseAssessments;


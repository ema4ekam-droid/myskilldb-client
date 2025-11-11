import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import { getRequest, postRequest } from '../../../api/apiRequests';
import { VideoPlayerModal } from '../../../components/student-components/student-courses-components/course-assessments-components';

const JobAssessments = () => {
  const [currentPage, setCurrentPage] = useState('job-assessments');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [viewingCompletedAssessment, setViewingCompletedAssessment] = useState(null);
  const [studyPlanModal, setStudyPlanModal] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  // Redux state
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.organizationId) {
      fetchJobs();
    } else {
      setIsLoading(false);
    }
  }, [user?.organizationId]);

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

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      if (!user?.organizationId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Fetch jobs - use department endpoint if departmentId is available, otherwise use organization endpoint
      let response;
      if (user?.departmentId) {
        try {
          response = await getRequest(`/jobs/departments/${user.organizationId}/${user.departmentId}`);
        } catch (error) {
          // Fallback to organization endpoint if department endpoint fails (e.g., auth issue)
          console.warn('Department endpoint failed, using organization endpoint:', error);
          response = await getRequest(`/jobs/organization/${user.organizationId}`);
        }
      } else {
        // Fetch jobs by organization (students can see all jobs in their organization)
        response = await getRequest(`/jobs/organization/${user.organizationId}`);
      }
      
      if (response.data?.success && response.data?.data) {
        const apiJobs = response.data.data || [];
        
        // Transform API jobs to match component structure
        const transformedJobs = await Promise.all(
          apiJobs.map(async (job) => {
            // Fetch topics for this job
            let topics = [];
            try {
              const topicsResponse = await getRequest(`/topics/job/${job._id}`);
              if (topicsResponse.data?.success && topicsResponse.data?.data) {
                topics = (topicsResponse.data.data || []).map(topic => ({
                  id: topic._id,
                  _id: topic._id,
                  name: topic.name || topic.title,
                  assessments: [] // Will be fetched when topic is selected
                }));
              }
            } catch (error) {
              console.error(`Error fetching topics for job ${job._id}:`, error);
            }

            return {
              id: job._id,
              _id: job._id,
              title: job.name || job.title,
              company: job.companyName || job.company || 'Company',
              location: job.place || job.location || 'Location',
              jobAssessments: [], // Will be fetched when job is selected
              topics: topics
            };
          })
        );

        setJobs(transformedJobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const handleStartAssessment = async (job, topic, assessment) => {
    try {
      setIsLoading(true);
      
      // Fetch test details including questions
      const response = await getRequest(`/tests/${assessment.testId}`);
      if (response.data.success && response.data.data) {
        const testData = response.data.data;
        const test = testData.test || testData;
        
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
            topicId: q.topicId?._id || q.topicId || null,
          };
        });
        
        // Merge test data with assessment data
        const fullAssessment = {
          ...assessment,
          questions: transformedQuestions,
          duration: 30, // Default duration
          passingScore: 70, // Default passing score
          job,
          topic
        };
        
        setSelectedAssessment(fullAssessment);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setTimeRemaining(30 * 60); // Default 30 minutes in seconds
        setIsAssessmentActive(true);
        setShowResults(false);
        toast.success(`Assessment started! You have 30 minutes.`);
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

  const handleSubmitAssessment = async () => {
    if (!selectedAssessment) return;

    let correctCount = 0;
    const answerRecords = selectedAssessment.questions.map(question => {
      const userAnswerIndex = userAnswers[question.id];
      const isCorrect = userAnswerIndex === question.correctAnswer;
      if (isCorrect) {
        correctCount++;
      }
      
      return {
        questionId: question.id,
        selectedAnswer: userAnswerIndex !== undefined ? question.options[userAnswerIndex] : '',
        isCorrect: isCorrect
      };
    });

    const score = Math.round((correctCount / selectedAssessment.questions.length) * 100);
    const passed = score >= selectedAssessment.passingScore;

    // Save to backend
    if (selectedAssessment.studentTestHistoryId) {
      try {
        await postRequest(
          `/student-test-history/${selectedAssessment.studentTestHistoryId}/complete`,
          {
            answers: answerRecords,
            score,
            correctAnswers: correctCount,
            totalQuestions: selectedAssessment.questions.length
          }
        );
      } catch (error) {
        console.error('Error saving test results:', error);
        toast.error('Failed to save test results');
      }
    }

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

    // Update job-level assessments
    if (selectedAssessment.type === 'job') {
      setJobLevelAssessments(prev => prev.map(a => 
        a._id === selectedAssessment.studentTestHistoryId
          ? { ...a, status: 'completed', score, completedDate: new Date().toISOString().split('T')[0] }
          : a
      ));
    }
    
    // Update topic-level assessments
    if (selectedAssessment.type === 'topic') {
      setTopicLevelAssessments(prev => prev.map(a => 
        a._id === selectedAssessment.studentTestHistoryId
          ? { ...a, status: 'completed', score, completedDate: new Date().toISOString().split('T')[0] }
          : a
      ));
    }

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
    setViewingCompletedAssessment(null);
    setStudyPlanModal(null);
    setPlayingVideo(null);
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
        setShowResults(false);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseStudyPlan = () => {
    setStudyPlanModal(null);
    setRecommendedVideos([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayVideo = (video) => {
    setPlayingVideo(video);
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

  // State for assessments
  const [jobLevelAssessments, setJobLevelAssessments] = useState([]);
  const [topicLevelAssessments, setTopicLevelAssessments] = useState([]);

  // Get selected job data
  const selectedJobData = jobs.find(j => j.id === selectedJob || j._id === selectedJob);
  
  // Get topics for selected job
  const currentTopics = selectedJobData?.topics || [];

  // Fetch job-level assessments when job is selected
  useEffect(() => {
    const fetchJobLevelAssessments = async () => {
      if (!selectedJob || !user?._id || !user?.organizationId) {
        setJobLevelAssessments([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getRequest(
          `/student-test-history/tests/job/${selectedJob}?studentId=${user._id}&organizationId=${user.organizationId}`
        );
        
        if (response.data.success && response.data.data) {
          const assessments = response.data.data || [];
          
          // Transform API data to match component's expected format
          const transformedAssessments = assessments.map((item, index) => {
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
              job: selectedJobData,
              assignedDate: new Date().toISOString().split('T')[0],
              totalQuestions: item.questionCount || 0,
              status: status,
              difficulty: item.difficultyLevel?.toLowerCase() || 'medium',
              type: 'job',
              score: item.score ?? undefined,
              completedDate: undefined,
              userAnswers: {},
              questions: [],
              testId: item.testId,
              studentTestHistoryId: item._id,
              duration: 30, // Default, can be updated if available in API
              passingScore: 70 // Default, can be updated if available in API
            };
          });

          setJobLevelAssessments(transformedAssessments);
        } else {
          setJobLevelAssessments([]);
        }
      } catch (error) {
        console.error('Error fetching job-level assessments:', error);
        toast.error('Failed to load job assessments');
        setJobLevelAssessments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobLevelAssessments();
  }, [selectedJob, user?._id, user?.organizationId, selectedJobData]);

  // Fetch topic-level assessments when topic is selected
  useEffect(() => {
    const fetchTopicLevelAssessments = async () => {
      if (!selectedTopic || !selectedJob || !user?._id || !user?.organizationId) {
        setTopicLevelAssessments([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getRequest(
          `/student-test-history/tests/job/${selectedJob}?studentId=${user._id}&organizationId=${user.organizationId}&topicId=${selectedTopic}`
        );
        
        if (response.data.success && response.data.data) {
          const assessments = response.data.data || [];
          
          // Transform API data to match component's expected format
          const transformedAssessments = assessments.map((item, index) => {
            const selectedTopicData = currentTopics.find(t => t.id === selectedTopic || t._id === selectedTopic);
            
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
              job: selectedJobData,
              topicId: selectedTopic,
              topic: selectedTopicData,
              topicName: selectedTopicData?.name || 'Unknown Topic',
              assignedDate: new Date().toISOString().split('T')[0],
              totalQuestions: item.questionCount || 0,
              status: status,
              difficulty: item.difficultyLevel?.toLowerCase() || 'medium',
              type: 'topic',
              score: item.score ?? undefined,
              completedDate: undefined,
              userAnswers: {},
              questions: [],
              testId: item.testId,
              studentTestHistoryId: item._id,
              duration: 30, // Default
              passingScore: 70 // Default
            };
          });

          setTopicLevelAssessments(transformedAssessments);
        } else {
          setTopicLevelAssessments([]);
        }
      } catch (error) {
        console.error('Error fetching topic-level assessments:', error);
        toast.error('Failed to load topic assessments');
        setTopicLevelAssessments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopicLevelAssessments();
  }, [selectedTopic, selectedJob, user?._id, user?.organizationId, currentTopics, selectedJobData]);

  // Render assessment card component
  const renderAssessmentCard = (assessment) => {
    const isPending = assessment.status === 'pending';
    const isCompleted = assessment.status === 'completed';
    
    if (isPending) {
      return (
        <div
          key={assessment.id}
          className="bg-white rounded-xl shadow-sm border-2 border-slate-200 overflow-hidden hover:shadow-lg transition-all"
        >
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-briefcase text-white text-lg"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{assessment.title || assessment.topic}</h3>
                <p className="text-sm text-slate-600">{assessment.topic?.name || assessment.job?.title || 'Job Assessment'}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <i className="fas fa-question-circle w-4"></i>
                <span>{assessment.totalQuestions} questions</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <i className="fas fa-clock w-4"></i>
                <span>{assessment.duration} minutes</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(assessment.difficulty)}`}>
                {assessment.difficulty}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(assessment.status)}`}>
                {assessment.status === 'pending' ? 'Pending' : 'Completed'}
              </span>
            </div>
            <button
              onClick={() => handleStartAssessment(assessment.job || selectedJobData, assessment.topic || null, assessment)}
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
          key={assessment.id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
        >
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-briefcase text-white text-lg"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{assessment.title || assessment.topic}</h3>
                <p className="text-sm text-slate-600">{assessment.topic?.name || assessment.job?.title || 'Job Assessment'}</p>
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
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(assessment.status)}`}>
                Completed
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
                <h2 className="text-lg lg:text-xl font-bold text-slate-900">{selectedAssessment.title || selectedAssessment.topic?.name || 'Assessment'}</h2>
                <p className="text-xs lg:text-sm text-slate-600">{selectedAssessment.topic?.name || selectedAssessment.job?.title || 'Job Assessment'}</p>
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
                {selectedAssessment.title || selectedAssessment.topic?.name || 'Assessment'}
              </p>
              <p className="text-white text-opacity-75 text-sm mb-4">
                {selectedAssessment.job?.title || 'Job'} at {selectedAssessment.job?.company || 'Company'}
                {selectedAssessment.topic && ` • ${selectedAssessment.topic.name}`}
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
              <button
                onClick={() => handleViewCompletedAssessment(selectedAssessment)}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <i className="fas fa-eye mr-2"></i>
                View Details
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
                onClick={handleCloseAssessment}
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
                onClick={handleCloseAssessment}
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
      <LoaderOverlay isVisible={isLoading} title="Job Assessments" subtitle="Loading skill assessments..." />
      
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4 pt-16 lg:pt-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <i className="fas fa-clipboard-check text-blue-600"></i>
              Job Assessments
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Test your knowledge on job-related skills organized by position
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Job Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Job
            </label>
            <select
              value={selectedJob}
              onChange={(e) => {
                setSelectedJob(e.target.value);
                setSelectedTopic(''); // Reset topic when job changes
                setJobLevelAssessments([]); // Clear assessments
                setTopicLevelAssessments([]); // Clear topic assessments
              }}
              className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Select a Job --</option>
              {jobs.map((job) => (
                <option key={job.id || job._id} value={job.id || job._id}>
                  {job.title} - {job.company}
                </option>
              ))}
            </select>
          </div>

          {/* Job-Level Assessments */}
          {selectedJob && jobLevelAssessments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-briefcase text-blue-600"></i>
                Job-Level Assessments
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {jobLevelAssessments.map(assessment => renderAssessmentCard({
                  ...assessment,
                  job: selectedJobData
                }))}
              </div>
            </div>
          )}

          {/* Topics List */}
          {selectedJob && currentTopics.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-tags text-purple-600"></i>
                Topics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {currentTopics.map((topic) => {
                  return (
                    <button
                      key={topic.id || topic._id}
                      onClick={() => {
                        const topicId = topic.id || topic._id;
                        setSelectedTopic(selectedTopic === topicId ? '' : topicId);
                        if (selectedTopic !== topicId) {
                          setTopicLevelAssessments([]); // Clear when switching topics
                        }
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedTopic === (topic.id || topic._id)
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <i className={`fas fa-tag ${selectedTopic === (topic.id || topic._id) ? 'text-purple-600' : 'text-slate-500'}`}></i>
                        <span className={`font-medium ${selectedTopic === (topic.id || topic._id) ? 'text-purple-900' : 'text-slate-700'}`}>
                          {topic.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Topic-Level Assessments */}
          {selectedTopic && topicLevelAssessments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-clipboard-list text-green-600"></i>
                Topic-Level Assessments
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {topicLevelAssessments.map(assessment => renderAssessmentCard(assessment))}
              </div>
            </div>
          )}

          {/* No Assessments Available */}
          {selectedJob && jobLevelAssessments.length === 0 && currentTopics.length === 0 && !isLoading && (
            <div className="mb-8">
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                <i className="fas fa-clipboard-list text-slate-300 text-5xl mb-3"></i>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Assessments Available</h3>
                <p className="text-slate-600">There are no assessments available for this job.</p>
              </div>
            </div>
          )}

          {selectedTopic && topicLevelAssessments.length === 0 && !isLoading && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-clipboard-list text-green-600"></i>
                Topic-Level Assessments
              </h2>
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                <i className="fas fa-clipboard-list text-slate-300 text-5xl mb-3"></i>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Topic Assessments Available</h3>
                <p className="text-slate-600">There are no assessments available for this topic.</p>
              </div>
            </div>
          )}

          {/* Empty States */}
          {!selectedJob && !isLoading && (
            <div className="text-center py-16">
              <i className="fas fa-briefcase text-slate-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Job</h3>
              <p className="text-slate-600">Please select a job to view assessments.</p>
            </div>
          )}

          {selectedJob && currentTopics.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <i className="fas fa-tags text-slate-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Topics Available</h3>
              <p className="text-slate-600">No topics available for this job.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobAssessments;

import React, { useState, useEffect } from 'react';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import {
  AssessmentDetailsModal,
  SubjectAssessmentsModal,
  StudyPlanModal
} from '../../../components/student-components/student-courses-components/course-assessments-components';
import { VideoPlayerModal } from '../../../components/student-components/student-courses-components/classroom-recordings-components';

const MyCourses = () => {
  const [currentPage, setCurrentPage] = useState('my-courses');
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedTopicAssessments, setExpandedTopicAssessments] = useState({});
  const [viewingSubjectAssessments, setViewingSubjectAssessments] = useState(null);
  const [viewingAssessment, setViewingAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studyPlanModal, setStudyPlanModal] = useState(null);
  const [focusAreas, setFocusAreas] = useState({});
  const [currentNote, setCurrentNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  
  const [studentInfo, setStudentInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+1 (555) 123-4567',
    department: 'Digital Marketing',
    class: 'Advanced Digital Marketing',
    section: 'Batch A - Morning'
  });

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: 'Amazon Ads Fundamentals',
      code: 'ADS101',
      description: 'Master Amazon Advertising from basics to advanced campaigns',
      instructor: 'Sarah Johnson',
      progress: 65,
      color: 'blue',
      subjectAssessments: [
        {
          id: 10001,
          title: 'Amazon Ads Fundamentals - Final Exam',
          date: '2024-10-22',
          score: 88,
          totalQuestions: 50,
          correctAnswers: 44,
          subjectLevel: true,
          relatedVideos: [
            { id: 'v1', title: 'Amazon Ads Overview & Ecosystem', videoId: 'y9Dk6wMc8UM', duration: '15:32' },
            { id: 'v3', title: 'Automatic vs Manual Targeting', videoId: 'y9Dk6wMc8UM', duration: '20:15' },
            { id: 'v5', title: 'Building Brand Awareness', videoId: 'y9Dk6wMc8UM', duration: '16:45' }
          ],
          questions: [
            { id: 1, question: 'What are the main types of Amazon ads?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
            { id: 2, question: 'How do you optimize ACOS?', userAnswer: 'B', correctAnswer: 'A', isCorrect: false },
            { id: 3, question: 'What is the difference between automatic and manual targeting?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true }
          ]
        },
        {
          id: 10002,
          title: 'Amazon Ads Fundamentals - Midterm Assessment',
          date: '2024-10-12',
          score: 82,
          totalQuestions: 30,
          correctAnswers: 25,
          subjectLevel: true,
          relatedVideos: [
            { id: 'v1', title: 'Amazon Ads Overview & Ecosystem', videoId: 'y9Dk6wMc8UM', duration: '15:32' },
            { id: 'v2', title: 'Types of Amazon Ads Explained', videoId: 'dQw4w9WgXcQ', duration: '12:45' }
          ],
          questions: [
            { id: 1, question: 'What is CPC in Amazon Ads?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
            { id: 2, question: 'How to set up a Sponsored Products campaign?', userAnswer: 'B', correctAnswer: 'B', isCorrect: true }
          ]
        }
      ],
      topics: [
        {
          id: 101,
          title: 'Introduction to Amazon Advertising',
          description: 'Overview of Amazon Ad ecosystem and opportunities',
          duration: '2 hours',
          status: 'completed',
          videoCount: 3,
          assessments: [
            {
              id: 1011,
              title: 'Amazon Ads Basics Quiz',
              date: '2024-10-15',
              score: 85,
              totalQuestions: 20,
              correctAnswers: 17,
              topicId: 101,
              relatedVideos: [
                { id: 'v1', title: 'Amazon Ads Overview & Ecosystem', videoId: 'y9Dk6wMc8UM', duration: '15:32' },
                { id: 'v2', title: 'Types of Amazon Ads Explained', videoId: 'dQw4w9WgXcQ', duration: '12:45' }
              ],
              questions: [
                { id: 1, question: 'What is Amazon Advertising?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
                { id: 2, question: 'Which ad type appears in search results?', userAnswer: 'B', correctAnswer: 'A', isCorrect: false },
                { id: 3, question: 'What is the minimum daily budget?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true }
              ]
            },
            {
              id: 1012,
              title: 'Introduction Assessment',
              date: '2024-10-10',
              score: 75,
              totalQuestions: 20,
              correctAnswers: 15,
              topicId: 101,
              relatedVideos: [
                { id: 'v1', title: 'Amazon Ads Overview & Ecosystem', videoId: 'y9Dk6wMc8UM', duration: '15:32' },
                { id: 'v2', title: 'Types of Amazon Ads Explained', videoId: 'dQw4w9WgXcQ', duration: '12:45' }
              ],
              questions: [
                { id: 1, question: 'What does PPC stand for?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
                { id: 2, question: 'Amazon launched ads in which year?', userAnswer: 'C', correctAnswer: 'B', isCorrect: false }
              ]
            }
          ]
        },
        {
          id: 102,
          title: 'Sponsored Products Campaigns',
          description: 'Creating and optimizing sponsored product ads',
          duration: '3 hours',
          status: 'completed',
          videoCount: 5,
          assessments: [
            {
              id: 1021,
              title: 'Sponsored Products Final Test',
              date: '2024-10-20',
              score: 92,
              totalQuestions: 25,
              correctAnswers: 23,
              topicId: 102,
              relatedVideos: [
                { id: 'v3', title: 'Automatic vs Manual Targeting', videoId: 'y9Dk6wMc8UM', duration: '20:15' },
                { id: 'v4', title: 'Keyword Research for Sponsored Products', videoId: 'dQw4w9WgXcQ', duration: '22:30' }
              ],
              questions: [
                { id: 1, question: 'What is automatic targeting?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
                { id: 2, question: 'How to optimize bids?', userAnswer: 'B', correctAnswer: 'B', isCorrect: true }
              ]
            }
          ]
        },
        {
          id: 103,
          title: 'Sponsored Brands Strategy',
          description: 'Building brand awareness through sponsored brands',
          duration: '2.5 hours',
          status: 'in-progress',
          videoCount: 4
        },
        {
          id: 104,
          title: 'Campaign Optimization & A/B Testing',
          description: 'Advanced techniques for campaign performance',
          duration: '3 hours',
          status: 'locked',
          videoCount: 6
        }
      ]
    },
    {
      id: 2,
      name: 'Amazon Search & SEO',
      code: 'SEO201',
      description: 'Optimize product listings for maximum visibility on Amazon',
      instructor: 'Michael Chen',
      progress: 40,
      color: 'green',
      topics: [
        {
          id: 201,
          title: 'Amazon A9 Algorithm Basics',
          description: 'Understanding how Amazon search works',
          duration: '2 hours',
          status: 'completed',
          videoCount: 3
        },
        {
          id: 202,
          title: 'Keyword Research & Strategy',
          description: 'Finding and targeting the right keywords',
          duration: '3 hours',
          status: 'in-progress',
          videoCount: 5
        },
        {
          id: 203,
          title: 'Product Listing Optimization',
          description: 'Writing compelling titles and descriptions',
          duration: '2.5 hours',
          status: 'locked',
          videoCount: 4
        },
        {
          id: 204,
          title: 'Backend Search Terms',
          description: 'Maximizing discoverability with backend keywords',
          duration: '2 hours',
          status: 'locked',
          videoCount: 3
        }
      ]
    },
    {
      id: 3,
      name: 'Amazon DSP (Demand-Side Platform)',
      code: 'DSP301',
      description: 'Programmatic advertising with Amazon DSP',
      instructor: 'Emily Rodriguez',
      progress: 20,
      color: 'purple',
      topics: [
        {
          id: 301,
          title: 'Introduction to Programmatic Advertising',
          description: 'What is DSP and how it works',
          duration: '2 hours',
          status: 'completed',
          videoCount: 4
        },
        {
          id: 302,
          title: 'Audience Targeting Strategies',
          description: 'Building and targeting custom audiences',
          duration: '3 hours',
          status: 'locked',
          videoCount: 5
        },
        {
          id: 303,
          title: 'Creative Best Practices',
          description: 'Designing effective display ads',
          duration: '2.5 hours',
          status: 'locked',
          videoCount: 4
        },
        {
          id: 304,
          title: 'Campaign Management & Reporting',
          description: 'Managing DSP campaigns and analyzing results',
          duration: '3 hours',
          status: 'locked',
          videoCount: 6
        }
      ]
    },
    {
      id: 4,
      name: 'Amazon Marketing Cloud (AMC)',
      code: 'AMC401',
      description: 'Advanced analytics and measurement with AMC',
      instructor: 'David Park',
      progress: 0,
      color: 'orange',
      topics: [
        {
          id: 401,
          title: 'AMC Overview & Setup',
          description: 'Getting started with Amazon Marketing Cloud',
          duration: '2 hours',
          status: 'locked',
          videoCount: 3
        },
        {
          id: 402,
          title: 'Data Analysis with SQL',
          description: 'Writing queries to analyze campaign data',
          duration: '4 hours',
          status: 'locked',
          videoCount: 7
        },
        {
          id: 403,
          title: 'Attribution Modeling',
          description: 'Understanding customer journey and touchpoints',
          duration: '3 hours',
          status: 'locked',
          videoCount: 5
        },
        {
          id: 404,
          title: 'Advanced Analytics & Insights',
          description: 'Creating custom reports and dashboards',
          duration: '3.5 hours',
          status: 'locked',
          videoCount: 6
        }
      ]
    },
    {
      id: 5,
      name: 'Amazon Brand Registry & IP',
      code: 'BRD501',
      description: 'Protecting your brand and intellectual property on Amazon',
      instructor: 'Lisa Anderson',
      progress: 0,
      color: 'pink',
      topics: [
        {
          id: 501,
          title: 'Brand Registry Fundamentals',
          description: 'Why and how to register your brand',
          duration: '1.5 hours',
          status: 'locked',
          videoCount: 3
        },
        {
          id: 502,
          title: 'Enhanced Brand Content (A+ Content)',
          description: 'Creating rich product descriptions',
          duration: '2.5 hours',
          status: 'locked',
          videoCount: 4
        },
        {
          id: 503,
          title: 'Brand Analytics & Insights',
          description: 'Leveraging brand analytics data',
          duration: '2 hours',
          status: 'locked',
          videoCount: 4
        },
        {
          id: 504,
          title: 'IP Protection & Enforcement',
          description: 'Protecting against counterfeit and violations',
          duration: '2 hours',
          status: 'locked',
          videoCount: 3
        }
      ]
    }
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSubject = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  const toggleTopicAssessments = (topicId) => {
    setExpandedTopicAssessments(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const handleOpenSubjectAssessments = (subject) => {
    setViewingSubjectAssessments(subject);
  };

  const handleCloseSubjectAssessments = () => {
    setViewingSubjectAssessments(null);
  };

  const handleViewAssessmentDetails = (assessment) => {
    setViewingAssessment(assessment);
  };

  const handleCloseAssessmentDetails = () => {
    setViewingAssessment(null);
  };

  const handleCreateStudyPlan = (assessment) => {
    setStudyPlanModal(assessment);
    setCurrentNote('');
    setEditingNoteId(null);
    // Initialize notes array if it doesn't exist
    if (!focusAreas[assessment.id]) {
      setFocusAreas(prev => ({
        ...prev,
        [assessment.id]: []
      }));
    }
  };

  const handleCloseStudyPlan = () => {
    setStudyPlanModal(null);
    setCurrentNote('');
    setEditingNoteId(null);
  };

  const handleAddNote = (assessmentId) => {
    if (currentNote.trim().length === 0) {
      alert('Please enter a note');
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
      alert('Please enter a note');
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
  };

  const handleDeleteNote = (assessmentId, noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setFocusAreas(prev => ({
        ...prev,
        [assessmentId]: prev[assessmentId].filter(note => note.id !== noteId)
      }));
    }
  };

  const handleCancelEdit = () => {
    setCurrentNote('');
    setEditingNoteId(null);
  };

  const [playingVideo, setPlayingVideo] = useState(null);

  const handlePlayVideo = (video) => {
    setPlayingVideo(video);
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'locked':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'fas fa-check-circle';
      case 'in-progress':
        return 'fas fa-play-circle';
      case 'locked':
        return 'fas fa-lock';
      default:
        return 'fas fa-circle';
    }
  };

  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="My Courses" subtitle="Loading your courses..." />
      
      {!viewingAssessment && !viewingSubjectAssessments && !studyPlanModal && !playingVideo && (
        <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      )}
      
      <div className={`min-h-screen bg-slate-50 ${!viewingAssessment && !viewingSubjectAssessments && !studyPlanModal && !playingVideo ? 'lg:ml-72' : ''}`}>
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <i className="fas fa-graduation-cap text-blue-600"></i>
                My Courses
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Track your learning progress and access course materials
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Student Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {studentInfo.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{studentInfo.name}</h2>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <i className="fas fa-envelope text-slate-400 text-xs"></i>
                      {studentInfo.email}
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <i className="fas fa-phone text-slate-400 text-xs"></i>
                      {studentInfo.mobile}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Department</p>
                  <p className="font-semibold text-slate-900">{studentInfo.department}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Class</p>
                  <p className="font-semibold text-slate-900">{studentInfo.class}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Section</p>
                  <p className="font-semibold text-slate-900">{studentInfo.section}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="space-y-6">
            {subjects.map((subject) => {
              const isExpanded = expandedSubjects[subject.id];
              const completedTopics = subject.topics.filter(t => t.status === 'completed').length;
              const totalTopics = subject.topics.length;

              return (
                <div
                  key={subject.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Subject Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleSubject(subject.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon - Subject Code */}
                      <div className={`hidden md:flex w-16 h-16 bg-gradient-to-br from-${subject.color}-500 to-${subject.color}-600 rounded-xl items-center justify-center text-white flex-shrink-0 font-bold text-xs`}>
                        {subject.code}
                      </div>

                      {/* Subject Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-slate-900">{subject.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${subject.color}-100 text-${subject.color}-700 border border-${subject.color}-200 flex items-center gap-1.5 w-fit`}>
                                <i className="fas fa-book-open text-xs"></i>
                                {totalTopics} {totalTopics === 1 ? 'Topic' : 'Topics'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{subject.description}</p>
                          </div>
                          <button
                            className={`w-10 h-10 flex items-center justify-center border-2 border-${subject.color}-300 hover:border-${subject.color}-400 rounded-lg transition-all ${isExpanded ? `bg-${subject.color}-100` : 'bg-white hover:bg-' + subject.color + '-50'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubject(subject.id);
                            }}
                          >
                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-${subject.color}-600 text-lg`}></i>
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm mt-3">
                          <span className="text-slate-600">
                            <i className="fas fa-code text-slate-400 mr-2 hidden md:inline"></i>
                            {subject.code}
                          </span>
                          <span className="text-slate-600">
                            <i className="fas fa-user-tie text-slate-400 mr-2"></i>
                            {subject.instructor}
                          </span>
                          <span className="text-slate-600">
                            <i className="fas fa-list-ul text-slate-400 mr-2"></i>
                            {completedTopics}/{totalTopics} Topics
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-slate-600 font-medium">Progress</span>
                            <span className="text-slate-900 font-bold">{subject.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-600 h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Subject-Level Assessments Button */}
                        {subject.subjectAssessments && subject.subjectAssessments.length > 0 && (
                          <div className="mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenSubjectAssessments(subject);
                              }}
                              className={`w-full px-4 py-3 bg-white border-2 border-${subject.color}-300 hover:border-${subject.color}-400 hover:bg-${subject.color}-50 text-slate-700 rounded-lg transition-all font-medium flex items-center justify-between`}
                            >
                              <span className="flex items-center gap-2">
                                <i className={`fas fa-clipboard-list text-${subject.color}-600`}></i>
                                <span>Review Subject-Level Assessments</span>
                                <span className={`text-xs bg-${subject.color}-100 text-${subject.color}-700 px-2 py-0.5 rounded-full`}>
                                  {subject.subjectAssessments.length}
                                </span>
                              </span>
                              <i className={`fas fa-chevron-right text-sm text-${subject.color}-600`}></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Topics List - Accordion */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50 p-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-book-open text-blue-600"></i>
                        Subject Topics
                      </h4>
                      <div className="space-y-3">
                        {subject.topics.map((topic, index) => {
                          // Calculate average assessment score
                          const avgScore = topic.assessments && topic.assessments.length > 0
                            ? Math.round(topic.assessments.reduce((sum, a) => sum + a.score, 0) / topic.assessments.length)
                            : null;
                          
                          return (
                            <>
                            <div
                              key={topic.id}
                              className={`bg-white rounded-lg border p-4 ${
                                topic.status === 'locked' ? 'opacity-60' : ''
                              } hover:border-${subject.color}-300 transition-colors`}
                            >
                              <div className="flex items-start gap-4">
                                {/* Topic Number */}
                                <div className={`hidden md:flex w-10 h-10 bg-gradient-to-br from-${subject.color}-500 to-${subject.color}-600 rounded-lg items-center justify-center text-white font-bold flex-shrink-0`}>
                                  {index + 1}
                                </div>

                                {/* Topic Info */}
                                <div className="flex-1 min-w-0">
                                  {/* Title and Description */}
                                  <div className="mb-2">
                                    <h5 className="font-semibold text-slate-900 text-sm md:text-base">{topic.title}</h5>
                                    <p className="text-xs md:text-sm text-slate-600 mt-1">{topic.description}</p>
                                  </div>
                                  
                                  {/* Badges - Below title/description on mobile, side on desktop */}
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    {/* Assessment Score Badge */}
                                    {avgScore !== null && (
                                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                        avgScore >= 80 ? 'bg-green-100 text-green-700 border-green-300' 
                                        : avgScore >= 60 ? 'bg-yellow-100 text-yellow-700 border-yellow-300' 
                                        : 'bg-red-100 text-red-700 border-red-300'
                                      } flex items-center gap-1.5`}>
                                        <i className="fas fa-chart-line text-xs"></i>
                                        {avgScore}%
                                      </div>
                                    )}
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(topic.status)} flex items-center gap-1.5 whitespace-nowrap`}>
                                      <i className={`${getStatusIcon(topic.status)} text-xs`}></i>
                                      {topic.status === 'completed' ? 'Completed' : topic.status === 'in-progress' ? 'In Progress' : 'Locked'}
                                    </span>
                                  </div>

                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-3">
                                  <span className="flex items-center gap-1.5">
                                    <i className="fas fa-clock"></i>
                                    {topic.duration}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <i className="fas fa-video"></i>
                                    {topic.videoCount} Videos
                                  </span>
                                  {topic.status === 'completed' && topic.assessments && (
                                    <span className="flex items-center gap-1.5">
                                      <i className="fas fa-clipboard-check text-green-600"></i>
                                      {topic.assessments.length} Assessment{topic.assessments.length > 1 ? 's' : ''}
                                    </span>
                                  )}
                                  {topic.status !== 'locked' && (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (topic.status === 'completed' && topic.assessments) {
                                          toggleTopicAssessments(topic.id);
                                        }
                                      }}
                                      className={`ml-auto px-4 py-1.5 ${
                                        topic.status === 'completed' 
                                          ? 'bg-white border border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-700' 
                                          : `bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-600 text-white`
                                      } rounded-lg hover:shadow-md transition-all font-medium flex items-center gap-2`}
                                    >
                                      {topic.status === 'completed' ? (
                                        <>
                                          <span>Review Assessments</span>
                                          <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${
                                            expandedTopicAssessments[topic.id] ? 'rotate-180' : ''
                                          }`}></i>
                                        </>
                                      ) : (
                                        'Continue'
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Assessments Accordion - Only show for completed topics */}
                            {topic.status === 'completed' && topic.assessments && expandedTopicAssessments[topic.id] && (
                              <div className="mt-4 border-t border-slate-200 pt-4">
                                <h6 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                  <i className="fas fa-chart-bar text-blue-600"></i>
                                  Assessment History
                                </h6>
                                <div className="space-y-3">
                                  {topic.assessments.map((assessment) => (
                                    <div
                                      key={assessment.id}
                                      className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                                    >
                                      <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex-1">
                                          <h6 className="font-semibold text-slate-900 text-sm">{assessment.title}</h6>
                                          <p className="text-xs text-slate-600 mt-1">
                                            <i className="fas fa-calendar text-slate-400 mr-1"></i>
                                            Taken on {new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <div className={`text-2xl font-bold ${assessment.score >= 80 ? 'text-green-600' : assessment.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {assessment.score}%
                                          </div>
                                          <p className="text-xs text-slate-600">
                                            {assessment.correctAnswers}/{assessment.totalQuestions} correct
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap gap-2">
                                        <button
                                          onClick={() => handleViewAssessmentDetails(assessment)}
                                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                                        >
                                          <i className="fas fa-eye"></i>
                                          View Details
                                        </button>
                                        <button
                                          onClick={() => handleCreateStudyPlan(assessment)}
                                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                                        >
                                          <i className="fas fa-book-reader"></i>
                                          Create Study Plan
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          </>
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
      </div>

      {/* Assessment Details Modal */}
      <AssessmentDetailsModal
        assessment={viewingAssessment}
        onClose={handleCloseAssessmentDetails}
        onCreateStudyPlan={handleCreateStudyPlan}
      />

      {/* Subject-Level Assessments Modal */}
      <SubjectAssessmentsModal
        subject={viewingSubjectAssessments}
        onClose={handleCloseSubjectAssessments}
        onViewDetails={handleViewAssessmentDetails}
        onCreateStudyPlan={handleCreateStudyPlan}
      />

      {/* Study Plan Modal */}
      <StudyPlanModal
        assessment={studyPlanModal}
        onClose={handleCloseStudyPlan}
        focusAreas={focusAreas}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        editingNoteId={editingNoteId}
        onAddNote={handleAddNote}
        onUpdateNote={handleUpdateNote}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
        onCancelEdit={handleCancelEdit}
        onPlayVideo={handlePlayVideo}
      />

      {/* TEMP Old Study Plan Modal - TO BE REMOVED */}
      {false && studyPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-8 relative">
            {/* Close Button */}
            <button
              onClick={handleCloseStudyPlan}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white hover:bg-blue-50 border border-slate-200 rounded-full flex items-center justify-center text-blue-600 transition-all hover:scale-110 shadow-md"
              aria-label="Close modal"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl">
              <div className="pr-12">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <i className="fas fa-book-reader"></i>
                  Study Plan: {studyPlanModal.title}
                </h3>
                <p className="text-blue-100 text-sm">
                  Score: {studyPlanModal.score}% • {studyPlanModal.correctAnswers}/{studyPlanModal.totalQuestions} Correct
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Wrong Answers Section */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-exclamation-circle text-red-600"></i>
                  Questions You Got Wrong
                </h4>
                <div className="space-y-3">
                  {studyPlanModal.questions.filter(q => !q.isCorrect).length === 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <i className="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
                      <p className="text-green-700 font-medium">Perfect! You got all questions correct! 🎉</p>
                    </div>
                  ) : (
                    studyPlanModal.questions.filter(q => !q.isCorrect).map((question, index) => (
                      <div
                        key={question.id}
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                      >
                        <p className="font-semibold text-slate-900 mb-2">
                          <span className="text-red-600">Q{index + 1}:</span> {question.question}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 p-2 rounded bg-red-100 border border-red-300">
                            <i className="fas fa-times-circle text-red-600"></i>
                            <span className="font-medium">
                              Your Answer: <span className="font-bold">Option {question.userAnswer}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded bg-green-100 border border-green-300">
                            <i className="fas fa-check-circle text-green-600"></i>
                            <span className="font-medium">
                              Correct Answer: <span className="font-bold">Option {question.correctAnswer}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Focus Areas / Doubts Section */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-clipboard-list text-orange-600"></i>
                  Focus Areas & Doubts
                </h4>
                
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
                    placeholder="E.g., Need to understand ACOS optimization better, confused about bidding strategies..."
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
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-video text-blue-600"></i>
                  Recommended Videos to Review
                </h4>
                {studyPlanModal.relatedVideos && studyPlanModal.relatedVideos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studyPlanModal.relatedVideos.map((video) => (
                      <div
                        key={video.id}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handlePlayVideo(video)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i className="fab fa-youtube text-white text-xl"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm mb-1">{video.title}</p>
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
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-slate-600">
                    <i className="fas fa-info-circle text-slate-400 mb-2"></i>
                    <p>No related videos available for this assessment.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 rounded-b-xl flex justify-between items-center">
              <div className="text-sm text-slate-600">
                <i className="fas fa-lightbulb text-blue-600 mr-2"></i>
                Review videos and save your focus areas to track your learning progress
              </div>
              <button
                onClick={handleCloseStudyPlan}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={playingVideo}
        onClose={handleCloseVideo}
      />
    </>
  );
};

export default MyCourses;


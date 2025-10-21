import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { ManualTestModal, AITestModal, ViewTestModal, PublishTestModal } from '../../components/org-admin-components/test-management-components';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';

const TestManagement = () => {
  // State for navigation
  const [currentPage, setCurrentPage] = useState('test-management');

  // State for filters
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // State for data
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tests, setTests] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [pendingTestRequests, setPendingTestRequests] = useState([]);

  // State for UI
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const [expandedPendingSubjects, setExpandedPendingSubjects] = useState(new Set());
  const [loading, setLoading] = useState(false);
  
  // State for subject-level filters
  const [subjectFilters, setSubjectFilters] = useState({}); // { subjectId: { showPending, createdBy, dateFrom, dateTo } }
  const [activeFilterSubject, setActiveFilterSubject] = useState(null); // Currently filtering subject

  // State for test creation
  const [isManualTestModalOpen, setIsManualTestModalOpen] = useState(false);
  const [isAITestModalOpen, setIsAITestModalOpen] = useState(false);
  const [testCreationContext, setTestCreationContext] = useState(null); // { type: 'subject' | 'topic', subjectId, topicIds, subjectName, topicNames }
  
  // State for test viewing/editing
  const [isViewTestModalOpen, setIsViewTestModalOpen] = useState(false);
  const [viewingTest, setViewingTest] = useState(null);
  
  // State for test publishing
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishingTest, setPublishingTest] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchDepartments();
    fetchClasses();
    fetchSections();
    fetchSubjects();
    fetchTopics();
    fetchTests();
    fetchJobs();
    fetchPendingTestRequests();
  }, []);

  const fetchDepartments = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dummyDepartments = [
        { _id: 'dept-1', name: 'Web Development', code: 'WEB' },
        { _id: 'dept-2', name: 'Data Science', code: 'DS' },
        { _id: 'dept-3', name: 'Mobile Development', code: 'MOB' }
      ];
      
      setDepartments(dummyDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const dummyClasses = [
        { _id: 'class-1', name: 'Semester 1', departmentId: 'dept-1' },
        { _id: 'class-2', name: 'Semester 2', departmentId: 'dept-1' },
        { _id: 'class-3', name: 'Semester 1', departmentId: 'dept-2' },
        { _id: 'class-4', name: 'Semester 1', departmentId: 'dept-3' }
      ];
      
      setClasses(dummyClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const dummySections = [
        { _id: 'section-1', name: 'Section A', classId: 'class-1' },
        { _id: 'section-2', name: 'Section B', classId: 'class-1' },
        { _id: 'section-3', name: 'Section A', classId: 'class-2' },
        { _id: 'section-4', name: 'Section A', classId: 'class-3' },
        { _id: 'section-5', name: 'Section A', classId: 'class-4' }
      ];
      
      setSections(dummySections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const dummySubjects = [
        { 
          _id: 'subject-1', 
          name: 'HTML & CSS Fundamentals', 
          code: 'WEB101',
          departmentId: 'dept-1',
          classId: 'class-1'
        },
        { 
          _id: 'subject-2', 
          name: 'JavaScript Basics', 
          code: 'WEB102',
          departmentId: 'dept-1',
          classId: 'class-1'
        },
        { 
          _id: 'subject-3', 
          name: 'React Framework', 
          code: 'WEB201',
          departmentId: 'dept-1',
          classId: 'class-2'
        }
      ];
      
      setSubjects(dummySubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const dummyTopics = [
        {
          _id: 'topic-1',
          title: 'HTML Tags & Attributes',
          description: 'Learn about HTML tags and attributes',
          subjectId: 'subject-1',
          sectionIds: ['section-1', 'section-2'],
          difficulty: 'beginner',
          estimatedTime: '15 hours'
        },
        {
          _id: 'topic-2',
          title: 'CSS Selectors & Properties',
          description: 'Master CSS selectors and styling properties',
          subjectId: 'subject-1',
          sectionIds: ['section-1', 'section-2'],
          difficulty: 'intermediate',
          estimatedTime: '18 hours'
        },
        {
          _id: 'topic-3',
          title: 'Variables & Data Types',
          description: 'JavaScript variables and data types',
          subjectId: 'subject-2',
          sectionIds: ['section-1'],
          difficulty: 'beginner',
          estimatedTime: '12 hours'
        },
        {
          _id: 'topic-4',
          title: 'Functions & Scope',
          description: 'Understanding JavaScript functions',
          subjectId: 'subject-2',
          sectionIds: ['section-1', 'section-2'],
          difficulty: 'intermediate',
          estimatedTime: '20 hours'
        }
      ];
      
      setTopics(dummyTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchTests = async () => {
    try {
      const dummyTests = [
        {
          _id: 'test-1',
          title: 'HTML Basics Assessment',
          subjectId: 'subject-1',
          topicIds: ['topic-1'],
          difficulty: 'easy',
          questionCount: 3,
          type: 'topic',
          isAIGenerated: false,
          createdBy: 'Admin',
          createdAt: '2024-01-15T10:00:00Z',
          questions: [
            {
              id: 'q1',
              questionNumber: 1,
              question: 'What does HTML stand for?',
              options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
              correctAnswer: 0,
              topicId: 'topic-1'
            },
            {
              id: 'q2',
              questionNumber: 2,
              question: 'Which HTML tag is used for the largest heading?',
              options: ['<h1>', '<h6>', '<heading>', '<head>'],
              correctAnswer: 0,
              topicId: 'topic-1'
            },
            {
              id: 'q3',
              questionNumber: 3,
              question: 'What is the correct HTML element for inserting a line break?',
              options: ['<br>', '<lb>', '<break>', '<newline>'],
              correctAnswer: 0,
              topicId: 'topic-1'
            }
          ]
        },
        {
          _id: 'test-2',
          title: 'CSS Comprehensive Test',
          subjectId: 'subject-1',
          topicIds: ['topic-2'],
          difficulty: 'medium',
          questionCount: 2,
          type: 'topic',
          isAIGenerated: true,
          createdBy: 'Sarah Johnson',
          createdAt: '2024-01-16T14:00:00Z',
          questions: [
            {
              id: 'q4',
              questionNumber: 1,
              question: 'What property is used to change the background color in CSS?',
              options: ['bgcolor', 'background-color', 'color', 'bg-color'],
              correctAnswer: 1,
              topicId: 'topic-2'
            },
            {
              id: 'q5',
              questionNumber: 2,
              question: 'How do you make text bold in CSS?',
              options: ['font-weight: bold', 'text-style: bold', 'font: bold', 'text-weight: bold'],
              correctAnswer: 0,
              topicId: 'topic-2'
            }
          ]
        },
        {
          _id: 'test-3',
          title: 'HTML & CSS Full Assessment',
          subjectId: 'subject-1',
          topicIds: ['topic-1', 'topic-2'],
          difficulty: 'medium',
          questionCount: 4,
          type: 'subject',
          isAIGenerated: true,
          createdBy: 'Admin',
          createdAt: '2024-01-18T09:00:00Z',
          questions: [
            {
              id: 'q6',
              questionNumber: 1,
              question: 'Which HTML tag is used to define an internal style sheet?',
              options: ['<style>', '<css>', '<script>', '<link>'],
              correctAnswer: 0,
              topicId: 'topic-1'
            },
            {
              id: 'q7',
              questionNumber: 2,
              question: 'Which CSS property controls the text size?',
              options: ['text-size', 'font-size', 'text-style', 'font-style'],
              correctAnswer: 1,
              topicId: 'topic-2'
            },
            {
              id: 'q8',
              questionNumber: 3,
              question: 'What is the correct HTML for creating a hyperlink?',
              options: ['<a url="http://www.example.com">Example</a>', '<a href="http://www.example.com">Example</a>', '<link>http://www.example.com</link>', '<a>http://www.example.com</a>'],
              correctAnswer: 1,
              topicId: 'topic-1'
            },
            {
              id: 'q9',
              questionNumber: 4,
              question: 'How do you select an element with id "demo" in CSS?',
              options: ['.demo', '#demo', 'demo', '*demo'],
              correctAnswer: 1,
              topicId: 'topic-2'
            }
          ]
        }
      ];
      
      setTests(dummyTests);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const dummyJobs = [
        {
          _id: 'job-1',
          jobTitle: 'Frontend Developer',
          company: 'TechCorp',
          departmentId: 'dept-1',
          classId: 'class-1',
          sectionId: 'section-1'
        },
        {
          _id: 'job-2',
          jobTitle: 'Full-Stack Developer',
          company: 'WebCo',
          departmentId: 'dept-1',
          classId: 'class-1',
          sectionId: 'section-1'
        }
      ];
      
      setJobs(dummyJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchPendingTestRequests = async () => {
    try {
      const dummyPendingTests = [
        // Subject-level pending tests
        {
          _id: 'pending-test-1',
          title: 'Frontend Basics Complete Assessment',
          subjectId: 'subject-1',
          topicIds: ['topic-1', 'topic-2'],
          difficulty: 'medium',
          questionCount: 10,
          type: 'subject',
          isAIGenerated: false,
          createdBy: 'Michael Brown',
          createdAt: '2024-01-20T11:00:00Z',
          status: 'pending',
          questions: [
            {
              id: 'pq1',
              questionNumber: 1,
              question: 'What is the purpose of semantic HTML?',
              options: ['Better SEO and accessibility', 'Faster loading', 'Better styling', 'None of the above'],
              correctAnswer: 0,
              topicId: 'topic-1'
            },
            {
              id: 'pq2',
              questionNumber: 2,
              question: 'Which CSS property is used for flexbox?',
              options: ['display: flex', 'flex: box', 'position: flex', 'layout: flexbox'],
              correctAnswer: 0,
              topicId: 'topic-2'
            }
          ]
        },
        {
          _id: 'pending-test-2',
          title: 'React Advanced Concepts',
          subjectId: 'subject-3',
          topicIds: ['topic-4', 'topic-5'],
          difficulty: 'hard',
          questionCount: 8,
          type: 'subject',
          isAIGenerated: true,
          createdBy: 'Emily Davis',
          createdAt: '2024-01-21T09:30:00Z',
          status: 'pending',
          questions: [
            {
              id: 'pq5',
              questionNumber: 1,
              question: 'What is the purpose of React Hooks?',
              options: ['To manage state in functional components', 'To style components', 'To optimize performance', 'To handle routing'],
              correctAnswer: 0,
              topicId: 'topic-4'
            },
            {
              id: 'pq6',
              questionNumber: 2,
              question: 'Which hook is used for side effects?',
              options: ['useState', 'useEffect', 'useContext', 'useReducer'],
              correctAnswer: 1,
              topicId: 'topic-4'
            }
          ]
        },
        {
          _id: 'pending-test-3',
          title: 'Web Development Fundamentals',
          subjectId: 'subject-2',
          topicIds: ['topic-3'],
          difficulty: 'easy',
          questionCount: 12,
          type: 'subject',
          isAIGenerated: true,
          createdBy: 'John Williams',
          createdAt: '2024-01-22T14:00:00Z',
          status: 'pending',
          questions: [
            {
              id: 'pq7',
              questionNumber: 1,
              question: 'What is the main purpose of HTTP?',
              options: ['To transfer web pages', 'To compile code', 'To store data', 'To debug applications'],
              correctAnswer: 0,
              topicId: 'topic-3'
            },
            {
              id: 'pq8',
              questionNumber: 2,
              question: 'Which method is used to send data to a server?',
              options: ['GET', 'POST', 'DELETE', 'PATCH'],
              correctAnswer: 1,
              topicId: 'topic-3'
            }
          ]
        },
        // Topic-level pending tests
        {
          _id: 'pending-test-4',
          title: 'HTML Tags Deep Dive',
          subjectId: 'subject-1',
          topicIds: ['topic-1'],
          difficulty: 'easy',
          questionCount: 5,
          type: 'topic',
          isAIGenerated: false,
          createdBy: 'Sarah Johnson',
          createdAt: '2024-01-19T10:00:00Z',
          status: 'pending',
          questions: [
            {
              id: 'pq3',
              questionNumber: 1,
              question: 'Which HTML tag is used for creating a table?',
              options: ['<table>', '<tab>', '<grid>', '<data>'],
              correctAnswer: 0,
              topicId: 'topic-1'
            },
            {
              id: 'pq4',
              questionNumber: 2,
              question: 'What does the <a> tag represent?',
              options: ['Article', 'Anchor/Link', 'Audio', 'Animation'],
              correctAnswer: 1,
              topicId: 'topic-1'
            }
          ]
        },
        {
          _id: 'pending-test-5',
          title: 'CSS Flexbox Mastery',
          subjectId: 'subject-1',
          topicIds: ['topic-2'],
          difficulty: 'medium',
          questionCount: 7,
          type: 'topic',
          isAIGenerated: true,
          createdBy: 'Robert Chen',
          createdAt: '2024-01-20T15:30:00Z',
          status: 'pending',
          questions: [
            {
              id: 'pq9',
              questionNumber: 1,
              question: 'What does "display: flex" do?',
              options: ['Creates a flexbox container', 'Makes text flexible', 'Hides elements', 'Changes font size'],
              correctAnswer: 0,
              topicId: 'topic-2'
            },
            {
              id: 'pq10',
              questionNumber: 2,
              question: 'Which property aligns items along the main axis in flexbox?',
              options: ['align-items', 'justify-content', 'flex-direction', 'flex-wrap'],
              correctAnswer: 1,
              topicId: 'topic-2'
            }
          ]
        },
        {
          _id: 'pending-test-6',
          title: 'JavaScript Array Methods Quiz',
          subjectId: 'subject-2',
          topicIds: ['topic-3'],
          difficulty: 'medium',
          questionCount: 6,
          type: 'topic',
          isAIGenerated: false,
          createdBy: 'Lisa Martinez',
          createdAt: '2024-01-21T11:00:00Z',
          status: 'pending',
          questions: [
            {
              id: 'pq11',
              questionNumber: 1,
              question: 'Which array method returns a new array with transformed elements?',
              options: ['forEach', 'map', 'filter', 'reduce'],
              correctAnswer: 1,
              topicId: 'topic-3'
            },
            {
              id: 'pq12',
              questionNumber: 2,
              question: 'What does the filter() method do?',
              options: ['Modifies array in place', 'Returns a new array with elements that pass a test', 'Sorts the array', 'Finds the first element'],
              correctAnswer: 1,
              topicId: 'topic-3'
            }
          ]
        },
        {
          _id: 'pending-test-7',
          title: 'React Hooks Essentials',
          subjectId: 'subject-3',
          topicIds: ['topic-4'],
          difficulty: 'hard',
          questionCount: 8,
          type: 'topic',
          isAIGenerated: true,
          createdBy: 'David Kim',
          createdAt: '2024-01-22T09:00:00Z',
          status: 'pending',
          questions: [
            {
              id: 'pq13',
              questionNumber: 1,
              question: 'What is the correct syntax for useState?',
              options: ['const [value, setValue] = useState(0)', 'const value = useState(0)', 'useState(value, 0)', 'const setValue = useState(0)'],
              correctAnswer: 0,
              topicId: 'topic-4'
            },
            {
              id: 'pq14',
              questionNumber: 2,
              question: 'When does useEffect run by default?',
              options: ['Only on mount', 'After every render', 'Only on unmount', 'Never automatically'],
              correctAnswer: 1,
              topicId: 'topic-4'
            }
          ]
        }
      ];
      
      setPendingTestRequests(dummyPendingTests);
    } catch (error) {
      console.error('Error fetching pending test requests:', error);
    }
  };

  // Filter subjects based on selection
  const filteredSubjects = useMemo(() => {
    if (!selectedDepartment || !selectedClass) return [];
    
    return subjects.filter(s => 
      s.departmentId === selectedDepartment && 
      s.classId === selectedClass
    );
  }, [subjects, selectedDepartment, selectedClass]);

  // Get topics for a subject filtered by section
  const getTopicsForSubject = (subjectId) => {
    if (!selectedSection) return [];
    
    return topics.filter(t => 
      t.subjectId === subjectId && 
      t.sectionIds?.includes(selectedSection)
    );
  };

  // Get tests for a topic
  const getTestsForTopic = (topicId) => {
    return tests.filter(t => t.topicIds.includes(topicId));
  };

  // Get tests for a subject
  const getTestsForSubject = (subjectId) => {
    return tests.filter(t => t.subjectId === subjectId && t.type === 'subject');
  };

  // Get pending tests for a subject
  const getPendingTestsForSubject = (subjectId) => {
    return pendingTestRequests.filter(t => t.subjectId === subjectId && t.type === 'subject');
  };

  // Get pending tests for a topic
  const getPendingTestsForTopic = (topicId) => {
    return pendingTestRequests.filter(t => t.topicIds.includes(topicId) && t.type === 'topic');
  };

  // Get jobs connected to a topic
  const getJobsForTopic = (topicId) => {
    const topic = topics.find(t => t._id === topicId);
    if (!topic) return [];
    
    return jobs.filter(j => 
      j.departmentId === selectedDepartment && 
      j.classId === selectedClass && 
      j.sectionId === selectedSection
    );
  };

  // Toggle subject accordion
  const toggleSubject = (subjectId) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  // Open manual test modal
  const openManualTestModal = (context) => {
    setTestCreationContext(context);
    setIsManualTestModalOpen(true);
  };

  // Open AI test modal
  const openAITestModal = (context) => {
    setTestCreationContext(context);
    setIsAITestModalOpen(true);
  };

  // Handle test save (create or update)
  const handleSaveTest = (testData) => {
    if (viewingTest) {
      // Update existing test
      handleUpdateTest(testData);
    } else {
      // Create new test
      setTests(prev => [...prev, testData]);
      toast.success(`Test "${testData.title}" created successfully!`);
      setIsManualTestModalOpen(false);
      setIsAITestModalOpen(false);
      setTestCreationContext(null);
    }
  };

  // Handle view test
  const handleViewTest = (test) => {
    setViewingTest(test);
    setIsViewTestModalOpen(true);
  };

  // Handle edit test
  const handleEditTest = (test) => {
    setViewingTest(test);
    setTestCreationContext({
      type: test.type,
      subjectId: test.subjectId,
      topicIds: test.topicIds,
      subjectName: subjects.find(s => s._id === test.subjectId)?.name || '',
      topicNames: test.topicIds.map(tid => topics.find(t => t._id === tid)?.title || '').filter(Boolean)
    });
    setIsManualTestModalOpen(true);
  };

  // Handle delete test
  const handleDeleteTest = (testId) => {
    if (window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      setTests(prev => prev.filter(t => t._id !== testId));
      toast.success('Test deleted successfully');
    }
  };

  // Handle update test (from edit)
  const handleUpdateTest = (updatedTestData) => {
    setTests(prev => prev.map(t => t._id === updatedTestData._id ? updatedTestData : t));
    toast.success(`Test "${updatedTestData.title}" updated successfully!`);
    setIsManualTestModalOpen(false);
    setViewingTest(null);
    setTestCreationContext(null);
  };

  // Handle publish test
  const handlePublishTest = (test) => {
    setPublishingTest(test);
    setIsPublishModalOpen(true);
  };

  // Handle confirm publish
  const handleConfirmPublish = (test) => {
    // Update test to mark as published
    setTests(prev => prev.map(t => 
      t._id === test._id 
        ? { ...t, isPublished: true, publishedAt: new Date().toISOString() } 
        : t
    ));
    setIsPublishModalOpen(false);
    setPublishingTest(null);
  };

  // Handle approve test request
  const handleApproveTest = (test) => {
    // Move from pending to approved tests
    setPendingTestRequests(prev => prev.filter(t => t._id !== test._id));
    setTests(prev => [...prev, { ...test, status: 'approved' }]);
    toast.success(`Test "${test.title}" by ${test.createdBy} has been approved!`);
  };

  // Handle reject test request
  const handleRejectTest = (testId) => {
    if (window.confirm('Are you sure you want to reject this test request? This action cannot be undone.')) {
      setPendingTestRequests(prev => prev.filter(t => t._id !== testId));
      toast.success('Test request rejected');
    }
  };

  // Handle subject filter toggle
  const toggleSubjectFilter = (subjectId, filterType, value = null) => {
    setSubjectFilters(prev => {
      const current = prev[subjectId] || {};
      
      if (filterType === 'showPending') {
        return {
          ...prev,
          [subjectId]: { ...current, showPending: !current.showPending, createdBy: null }
        };
      } else if (filterType === 'createdBy') {
        return {
          ...prev,
          [subjectId]: { ...current, createdBy: current.createdBy === value ? null : value, showPending: false }
        };
      } else if (filterType === 'testType') {
        return {
          ...prev,
          [subjectId]: { ...current, testType: current.testType === value ? null : value }
        };
      } else if (filterType === 'dateRange') {
        return {
          ...prev,
          [subjectId]: { ...current, dateFrom: value?.from || null, dateTo: value?.to || null }
        };
      } else if (filterType === 'clear') {
        const { [subjectId]: removed, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  };

  // Get filtered tests for a subject
  const getFilteredTestsForSubject = (subjectId) => {
    const filters = subjectFilters[subjectId];
    if (!filters) return getTestsForSubject(subjectId);
    
    let filtered = getTestsForSubject(subjectId);
    
    // Filter by test type (subject-level vs topic-level)
    if (filters.testType) {
      filtered = filtered.filter(t => t.type === filters.testType);
    }
    
    if (filters.createdBy) {
      if (filters.createdBy === 'Admin') {
        filtered = filtered.filter(t => t.createdBy === 'Admin');
      } else if (filters.createdBy === 'Teacher') {
        // Filter for any creator that's not Admin (i.e., all teachers)
        filtered = filtered.filter(t => t.createdBy !== 'Admin');
      }
    }
    
    if (filters.dateFrom || filters.dateTo) {
      filtered = filtered.filter(t => {
        const testDate = new Date(t.createdAt);
        const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const to = filters.dateTo ? new Date(filters.dateTo) : null;
        
        if (from && to) {
          return testDate >= from && testDate <= to;
        } else if (from) {
          return testDate >= from;
        } else if (to) {
          return testDate <= to;
        }
        return true;
      });
    }
    
    return filtered;
  };

  // Handle page change from menu
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Navigation Component */}
      {!isManualTestModalOpen && !isAITestModalOpen && !isViewTestModalOpen && !isPublishModalOpen && (
        <OrgMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:ml-72 pt-16 md:pt-6">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Test Management</h1>
            <p className="text-sm md:text-base text-slate-600">
              Create and manage assessments for your students
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedClass('');
                  setSelectedSection('');
                }}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedSection('');
                }}
                disabled={!selectedDepartment}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Class</option>
                {selectedDepartment && classes.filter(c => c.departmentId === selectedDepartment).map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Section *</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Section</option>
                {selectedClass && sections.filter(s => s.classId === selectedClass).map(section => (
                  <option key={section._id} value={section._id}>{section.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Subjects and Topics List */}
        {selectedSection && filteredSubjects.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4">Subjects & Tests</h2>
            
            <div className="space-y-3">
              {filteredSubjects.map(subject => {
                const subjectTopics = getTopicsForSubject(subject._id);
                const subjectTests = getTestsForSubject(subject._id);
                const pendingSubjectTests = getPendingTestsForSubject(subject._id);
                const isExpanded = expandedSubjects.has(subject._id);

                return (
                  <div key={subject._id} className="border border-slate-200 rounded-lg overflow-hidden">
                    {/* Subject Header */}
                    <button
                      onClick={() => toggleSubject(subject._id)}
                      className="w-full bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 p-4 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1 text-left">
                        <i className="fas fa-book text-indigo-600 text-lg mt-0.5"></i>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-sm md:text-base mb-1">{subject.name}</h3>
                          <p className="text-xs text-slate-600">Code: {subject.code}</p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                              <i className="fas fa-list text-[10px]"></i>
                              {subjectTopics.length} topic{subjectTopics.length !== 1 ? 's' : ''}
                            </span>
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <i className="fas fa-check-circle text-[10px]"></i>
                              {subjectTests.length} approved
                            </span>
                            {pendingSubjectTests.length > 0 && (
                              <span className="text-xs text-orange-600 font-medium flex items-center gap-1 bg-orange-100 px-2 py-0.5 rounded-full">
                                <i className="fas fa-clock text-[10px]"></i>
                                {pendingSubjectTests.length} pending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-slate-400 ml-3 flex-shrink-0`}></i>
                    </button>

                    {/* Subject Content */}
                    {isExpanded && (
                      <div className="p-4 bg-white space-y-4">
                        {/* Filter Buttons */}
                        <div className="bg-slate-50 rounded-lg p-3 mb-4">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs font-semibold text-slate-700 mr-2">Filter Tests:</span>
                            <button
                              onClick={() => toggleSubjectFilter(subject._id, 'showPending')}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                subjectFilters[subject._id]?.showPending
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'
                              }`}
                            >
                              <i className="fas fa-clock mr-1"></i>
                              Pending Approval
                            </button>
                            <button
                              onClick={() => toggleSubjectFilter(subject._id, 'createdBy', 'Admin')}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                subjectFilters[subject._id]?.createdBy === 'Admin'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-50'
                              }`}
                            >
                              <i className="fas fa-user-shield mr-1"></i>
                              Admin Created
                            </button>
                            <button
                              onClick={() => toggleSubjectFilter(subject._id, 'createdBy', 'Teacher')}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                subjectFilters[subject._id]?.createdBy === 'Teacher'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              <i className="fas fa-chalkboard-teacher mr-1"></i>
                              Teacher Created
                            </button>
                            <div className="h-6 border-l border-slate-300"></div>
                            <button
                              onClick={() => toggleSubjectFilter(subject._id, 'testType', 'subject')}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                subjectFilters[subject._id]?.testType === 'subject'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-white text-green-600 border border-green-300 hover:bg-green-50'
                              }`}
                            >
                              <i className="fas fa-book mr-1"></i>
                              Subject-Level
                            </button>
                            <button
                              onClick={() => toggleSubjectFilter(subject._id, 'testType', 'topic')}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                subjectFilters[subject._id]?.testType === 'topic'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white text-purple-600 border border-purple-300 hover:bg-purple-50'
                              }`}
                            >
                              <i className="fas fa-tag mr-1"></i>
                              Topic-Level
                            </button>
                            <div className="flex items-center gap-2">
                              <input
                                type="date"
                                value={subjectFilters[subject._id]?.dateFrom || ''}
                                onChange={(e) => toggleSubjectFilter(subject._id, 'dateRange', { 
                                  from: e.target.value, 
                                  to: subjectFilters[subject._id]?.dateTo 
                                })}
                                className="px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="From date"
                              />
                              <span className="text-xs text-slate-500">to</span>
                              <input
                                type="date"
                                value={subjectFilters[subject._id]?.dateTo || ''}
                                onChange={(e) => toggleSubjectFilter(subject._id, 'dateRange', { 
                                  from: subjectFilters[subject._id]?.dateFrom,
                                  to: e.target.value 
                                })}
                                className="px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="To date"
                              />
                            </div>
                            {(subjectFilters[subject._id]?.showPending || subjectFilters[subject._id]?.createdBy || subjectFilters[subject._id]?.testType || subjectFilters[subject._id]?.dateFrom || subjectFilters[subject._id]?.dateTo) && (
                              <button
                                onClick={() => toggleSubjectFilter(subject._id, 'clear')}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                              >
                                <i className="fas fa-times mr-1"></i>
                                Clear Filters
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Create Test Buttons for Subject */}
                        <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200">
                          <button
                            onClick={() => openManualTestModal({
                              type: 'subject',
                              subjectId: subject._id,
                              topicIds: subjectTopics.map(t => t._id),
                              subjectName: subject.name,
                              topicNames: subjectTopics.map(t => t.title)
                            })}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                          >
                            <i className="fas fa-plus"></i>
                            <span>Create Manual Test (Subject)</span>
                          </button>
                          <button
                            onClick={() => openAITestModal({
                              type: 'subject',
                              subjectId: subject._id,
                              topicIds: subjectTopics.map(t => t._id),
                              subjectName: subject.name,
                              topicNames: subjectTopics.map(t => t.title)
                            })}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                          >
                            <i className="fas fa-robot"></i>
                            <span>Create AI Test (Subject)</span>
                            <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-0.5 rounded-full">AI</span>
                          </button>
                        </div>

                        {/* Pending Test Requests - Subject Level */}
                        {(() => {
                          const pendingSubjectTests = getPendingTestsForSubject(subject._id);
                          const showPendingOnly = subjectFilters[subject._id]?.showPending;
                          
                          return pendingSubjectTests.length > 0 && (!subjectFilters[subject._id] || showPendingOnly) && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                                <i className="fas fa-clock"></i>
                                Pending Approvals - Subject Level
                              </h4>
                              <div className="relative">
                              {/* Scroll Indicator */}
                              {pendingSubjectTests.length > 1 && (
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none flex items-center justify-end pr-1 z-10">
                                    <div className="bg-white rounded-full p-1 shadow-md">
                                      <i className="fas fa-chevron-right text-slate-600 text-xs"></i>
                                    </div>
                                  </div>
                                )}
                                <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
                                  {pendingSubjectTests.map(test => (
                                    <div key={test._id} className="bg-orange-50 border border-orange-300 rounded-lg p-3 w-[63vw] md:w-[21vw] flex-shrink-0">
                                      <div className="mb-3 text-center">
                                        <h5 className="font-semibold text-slate-900 text-sm mb-2">{test.title}</h5>
                                        <p className="text-xs text-slate-600 mb-3">
                                          <span className="font-medium">Requested by:</span> <span className="text-blue-600">{test.createdBy}</span>
                                        </p>
                                        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
                                          <span className={`px-2 py-1 rounded-full ${
                                            test.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                            test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                          }`}>
                                            {test.difficulty}
                                          </span>
                                          <span className="text-slate-600">
                                            <i className="fas fa-question-circle mr-1"></i>
                                            {test.questionCount} questions
                                          </span>
                                          {test.isAIGenerated && (
                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                              <i className="fas fa-robot mr-1"></i>
                                              AI
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex justify-center gap-1.5">
                                        <button
                                          onClick={() => handleViewTest(test)}
                                          className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                          title="View Test"
                                        >
                                          <i className="fas fa-eye"></i>
                                        </button>
                                        <button
                                          onClick={() => handleApproveTest(test)}
                                          className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                          title="Approve Test"
                                        >
                                          <i className="fas fa-check"></i>
                                        </button>
                                        <button
                                          onClick={() => handleRejectTest(test._id)}
                                          className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                          title="Reject Test"
                                        >
                                          <i className="fas fa-times"></i>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Subject-Level Tests */}
                        {(() => {
                          const filteredSubjectTests = getFilteredTestsForSubject(subject._id);
                          const showPendingOnly = subjectFilters[subject._id]?.showPending;
                          const testTypeFilter = subjectFilters[subject._id]?.testType;
                          
                          // Hide this section if topic-level filter is active
                          if (testTypeFilter === 'topic') return null;
                          
                          return filteredSubjectTests.length > 0 && !showPendingOnly && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                                Subject-Level Tests
                                {subjectFilters[subject._id] && (
                                  <span className="ml-2 text-xs font-normal text-slate-500">
                                    ({filteredSubjectTests.length} test{filteredSubjectTests.length !== 1 ? 's' : ''})
                                  </span>
                                )}
                              </h4>
                            <div className="relative">
                              {/* Scroll Indicator */}
                              {filteredSubjectTests.length > 1 && (
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none flex items-center justify-end pr-1 z-10">
                                  <div className="bg-white rounded-full p-1 shadow-md">
                                    <i className="fas fa-chevron-right text-slate-600 text-xs"></i>
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
                                {filteredSubjectTests.map(test => (
                                  <div key={test._id} className={`${
                                    test.type === 'subject' 
                                      ? 'bg-green-50 border-green-200' 
                                      : 'bg-purple-50 border-purple-200'
                                  } border rounded-lg p-3 w-[63vw] md:w-[21vw] flex-shrink-0`}>
                                  {/* Title */}
                                  <div className="mb-2 text-center">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full mb-1 inline-block ${
                                      test.type === 'subject'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-purple-100 text-purple-700'
                                    }`}>
                                      <i className={`fas ${test.type === 'subject' ? 'fa-book' : 'fa-tag'} mr-1`}></i>
                                      {test.type === 'subject' ? 'Subject-Level' : 'Topic-Level'}
                                    </span>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">{test.title}</h5>
                                    <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
                                      <i className="fas fa-user"></i>
                                      {test.createdBy}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                                      <i className="fas fa-calendar-alt"></i>
                                      {new Date(test.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex justify-center gap-2 mb-3">
                                    <button 
                                      onClick={() => handleViewTest(test)}
                                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                      title="View Test"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => handleEditTest(test)}
                                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                      title="Edit Test"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteTest(test._id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete Test"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>

                                  {/* Badges */}
                                  <div className={`mb-3 pb-3 border-b ${test.type === 'subject' ? 'border-green-300' : 'border-purple-300'}`}>
                                    <div className="flex items-center justify-center gap-3 flex-wrap text-xs">
                                      <span className={`px-2 py-1 rounded-full ${
                                        test.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                        test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {test.difficulty}
                                      </span>
                                      <span className="text-slate-600">
                                        <i className="fas fa-question-circle mr-1"></i>
                                        {test.questionCount} questions
                                      </span>
                                      {test.isAIGenerated && (
                                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                          <i className="fas fa-robot mr-1"></i>
                                          AI Generated
                                        </span>
                                      )}
                                      {test.isPublished && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                          <i className="fas fa-check-circle mr-1"></i>
                                          Published
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Publish Button - Centered and Highlighted */}
                                  <div className="flex justify-center">
                                    <button 
                                      onClick={() => handlePublishTest(test)}
                                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all inline-flex items-center gap-2 ${
                                        test.isPublished 
                                          ? 'bg-green-200 text-green-700 cursor-not-allowed opacity-60' 
                                          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
                                      }`}
                                      title={test.isPublished ? 'Already Published to Students' : 'Publish Test to Students'}
                                      disabled={test.isPublished}
                                    >
                                      <i className="fas fa-paper-plane"></i>
                                      {test.isPublished ? 'Published' : 'Publish to Students'}
                                    </button>
                                  </div>
                                </div>
                              ))}
                              </div>
                            </div>
                          </div>
                          );
                        })()}

                        {/* Topic Level Tests */}
                        {(() => {
                          const testTypeFilter = subjectFilters[subject._id]?.testType;
                          
                          // Hide this section if subject-level filter is active
                          if (testTypeFilter === 'subject') return null;
                          
                          return (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-3">Topic Level Tests</h4>
                              {subjectTopics.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No topics found for this section</p>
                              ) : (
                            <div className="space-y-3">
                              {subjectTopics.map(topic => {
                                const topicTests = getTestsForTopic(topic._id);
                                const pendingTopicTests = getPendingTestsForTopic(topic._id);
                                const topicJobs = getJobsForTopic(topic._id);
                                
                                return (
                                  <div key={topic._id} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                                    <div className="mb-3 pb-3 border-b border-slate-300">
                                      <h5 className="font-semibold text-slate-900 text-sm mb-2 bg-purple-100 px-3 py-2 rounded-lg inline-block">{topic.title}</h5>
                                      <div className="flex items-center gap-3 mt-2">
                                        {topicTests.length > 0 && (
                                          <span className="text-green-600 font-medium text-xs">
                                            <i className="fas fa-check-circle mr-1"></i>
                                            {topicTests.length} approved
                                          </span>
                                        )}
                                        {pendingTopicTests.length > 0 && (
                                          <span className="text-orange-600 font-medium bg-orange-100 px-2 py-0.5 rounded-full text-xs">
                                            <i className="fas fa-clock mr-1"></i>
                                            {pendingTopicTests.length} pending
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Create Test Buttons for Topic */}
                                    <div className="flex justify-center gap-2 mb-3">
                                      <button
                                        onClick={() => openManualTestModal({
                                          type: 'topic',
                                          subjectId: subject._id,
                                          topicIds: [topic._id],
                                          subjectName: subject.name,
                                          topicNames: [topic.title]
                                        })}
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        title="Create Test Manually"
                                      >
                                        <i className="fas fa-plus text-sm"></i>
                                      </button>
                                      <button
                                        onClick={() => openAITestModal({
                                          type: 'topic',
                                          subjectId: subject._id,
                                          topicIds: [topic._id],
                                          subjectName: subject.name,
                                          topicNames: [topic.title],
                                          topicJobs: topicJobs
                                        })}
                                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                        title="Create Test using AI"
                                      >
                                        <i className="fas fa-robot text-sm"></i>
                                      </button>
                                    </div>

                                    {/* Pending Test Requests - Topic Level */}
                                    {(() => {
                                      const pendingTopicTests = getPendingTestsForTopic(topic._id);
                                      return pendingTopicTests.length > 0 && (
                                        <div className="mb-3">
                                          <h6 className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-1">
                                            <i className="fas fa-clock"></i>
                                            Pending Approvals
                                          </h6>
                                           <div className="relative">
                                             {/* Scroll Indicator */}
                                             {pendingTopicTests.length > 1 && (
                                               <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none flex items-center justify-end pr-1 z-10">
                                                 <div className="bg-white rounded-full p-1 shadow-md">
                                                   <i className="fas fa-chevron-right text-slate-600 text-xs"></i>
                                                 </div>
                                               </div>
                                             )}
                                            <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
                                              {pendingTopicTests.map(test => (
                                                <div key={test._id} className="bg-orange-50 border border-orange-300 rounded-lg p-2 w-[57vw] md:w-[19vw] flex-shrink-0">
                                                  <div className="mb-2 text-center">
                                                    <h6 className="font-semibold text-slate-900 text-xs mb-2">{test.title}</h6>
                                                    <p className="text-xs text-slate-600 mb-2">
                                                      <span className="font-medium">Requested by:</span> <span className="text-blue-600">{test.createdBy}</span>
                                                    </p>
                                                    <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
                                                      <span className={`px-2 py-0.5 rounded-full ${
                                                        test.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                                        test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                      }`}>
                                                        {test.difficulty}
                                                      </span>
                                                      <span className="text-slate-600">
                                                        {test.questionCount} questions
                                                      </span>
                                                      {test.isAIGenerated && (
                                                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                                          AI
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="flex justify-center gap-1">
                                                    <button
                                                      onClick={() => handleViewTest(test)}
                                                      className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                                      title="View Test"
                                                    >
                                                      <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button
                                                      onClick={() => handleApproveTest(test)}
                                                      className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                                      title="Approve Test"
                                                    >
                                                      <i className="fas fa-check"></i>
                                                    </button>
                                                    <button
                                                      onClick={() => handleRejectTest(test._id)}
                                                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                                      title="Reject Test"
                                                    >
                                                      <i className="fas fa-times"></i>
                                                    </button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Topic Tests */}
                                    {topicTests.length > 0 && (
                                      <div>
                                        <h6 className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                                          <i className="fas fa-check-circle"></i>
                                          Approved Tests for this topic
                                        </h6>
                                        <div className="relative">
                                          {/* Scroll Indicator */}
                                          {topicTests.length > 1 && (
                                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none flex items-center justify-end pr-1 z-10">
                                              <div className="bg-white rounded-full p-1 shadow-md">
                                                <i className="fas fa-chevron-right text-slate-600 text-xs"></i>
                                              </div>
                                            </div>
                                          )}
                                          <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
                                            {topicTests.map(test => (
                                              <div key={test._id} className="bg-purple-50 border border-purple-200 rounded-lg p-2 w-[57vw] md:w-[19vw] flex-shrink-0">
                                            {/* Title */}
                                            <div className="mb-2 text-center">
                                              <h6 className="font-semibold text-slate-900 text-xs mb-1">{test.title}</h6>
                                              <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
                                                <i className="fas fa-user text-[10px]"></i>
                                                {test.createdBy}
                                              </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-center gap-1 mb-2">
                                              <button 
                                                onClick={() => handleViewTest(test)}
                                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                title="View Test"
                                              >
                                                <i className="fas fa-eye text-xs"></i>
                                              </button>
                                              <button 
                                                onClick={() => handleEditTest(test)}
                                                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                                title="Edit Test"
                                              >
                                                <i className="fas fa-edit text-xs"></i>
                                              </button>
                                              <button 
                                                onClick={() => handleDeleteTest(test._id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete Test"
                                              >
                                                <i className="fas fa-trash text-xs"></i>
                                              </button>
                                            </div>

                                            {/* Badges */}
                                            <div className="mb-2">
                                              <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
                                                <span className={`px-2 py-0.5 rounded-full ${
                                                  test.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                                  test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                  'bg-red-100 text-red-800'
                                                }`}>
                                                  {test.difficulty}
                                                </span>
                                                <span className="text-slate-600">
                                                  {test.questionCount} questions
                                                </span>
                                                {test.isAIGenerated && (
                                                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                                    AI
                                                  </span>
                                                )}
                                                {test.isPublished && (
                                                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                    <i className="fas fa-check-circle mr-1"></i>
                                                    Published
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            
                                            {/* Publish Button - Centered and Highlighted */}
                                            <div className="flex justify-center mt-2 pt-2 border-t border-purple-300">
                                              <button 
                                                onClick={() => handlePublishTest(test)}
                                                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all inline-flex items-center gap-1.5 ${
                                                  test.isPublished 
                                                    ? 'bg-green-200 text-green-700 cursor-not-allowed opacity-60' 
                                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-sm hover:shadow-md'
                                                }`}
                                                title={test.isPublished ? 'Already Published to Students' : 'Publish Test to Students'}
                                                disabled={test.isPublished}
                                              >
                                                <i className="fas fa-paper-plane text-xs"></i>
                                                {test.isPublished ? 'Published' : 'Publish to Students'}
                                              </button>
                                            </div>
                                          </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedSection && filteredSubjects.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-book text-slate-400 text-2xl"></i>
            </div>
            <p className="text-slate-600">No subjects found for this selection</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ManualTestModal
        isOpen={isManualTestModalOpen}
        onClose={() => {
          setIsManualTestModalOpen(false);
          setTestCreationContext(null);
          setViewingTest(null);
        }}
        context={testCreationContext}
        topics={topics}
        editingTest={viewingTest}
        onSave={handleSaveTest}
      />

      <AITestModal
        isOpen={isAITestModalOpen}
        onClose={() => {
          setIsAITestModalOpen(false);
          setTestCreationContext(null);
        }}
        context={testCreationContext}
        onSave={handleSaveTest}
        jobs={jobs}
        topics={topics}
      />

      <ViewTestModal
        isOpen={isViewTestModalOpen}
        onClose={() => {
          setIsViewTestModalOpen(false);
          setViewingTest(null);
        }}
        test={viewingTest}
      />

      <PublishTestModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setPublishingTest(null);
        }}
        test={publishingTest}
        classInfo={{
          departmentName: departments.find(d => d._id === selectedDepartment)?.name || '',
          className: classes.find(c => c._id === selectedClass)?.name || '',
          sectionName: sections.find(s => s._id === selectedSection)?.name || ''
        }}
        onPublish={handleConfirmPublish}
      />
      </div>
    </>
  );
};

export default TestManagement;


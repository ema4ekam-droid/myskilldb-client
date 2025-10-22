import { useState, useEffect, useMemo } from 'react';
import OrgMenuNavigation from '../../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import TopicModal from '../../../components/org-admin-components/skills-academics-components/TopicModal';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import toast, { Toaster } from 'react-hot-toast';
import { postRequest } from '../../../api/apiRequests';

const TopicManagement = () => {
  // State for global entities
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [departmentClassSectionJobs, setDepartmentClassSectionJobs] = useState([]);
  const [topicJobAssignments, setTopicJobAssignments] = useState([]);

  // Selection states - New filtering flow: Class → Section → Subject
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Job view filters
  const [jobViewDepartment, setJobViewDepartment] = useState('');
  const [jobViewClass, setJobViewClass] = useState('');
  const [jobViewSection, setJobViewSection] = useState('');
  const [expandedJobs, setExpandedJobs] = useState(new Set());
  const [expandedJobDescriptions, setExpandedJobDescriptions] = useState(new Set());
  const [isNoJobsAccordionOpen, setIsNoJobsAccordionOpen] = useState(false);
  
  // Topic view/edit modals
  const [isTopicViewModalOpen, setIsTopicViewModalOpen] = useState(false);
  const [viewingTopic, setViewingTopic] = useState(null);
  
  // Multi-select for unassigned topics
  const [selectedUnassignedTopics, setSelectedUnassignedTopics] = useState([]);
  const [isAssignToJobModalOpen, setIsAssignToJobModalOpen] = useState(false);
  
  // Manual job creation modal
  const [isManualJobModalOpen, setIsManualJobModalOpen] = useState(false);
  const [manualJobFormData, setManualJobFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    company: '',
    jobPostingLink: '',
    departmentId: '',
    classId: '',
    sectionId: '',
    requirements: []
  });
  
  // Quick Job creation modal (non-AI)
  const [isQuickJobModalOpen, setIsQuickJobModalOpen] = useState(false);
  const [quickJobFormData, setQuickJobFormData] = useState({
    company: '',
    jobTitle: '',
    jobDescription: ''
  });
  
  // Section toggle for viewing jobs
  const [sectionToggleModalOpen, setSectionToggleModalOpen] = useState(false);
  const [currentToggleDepartment, setCurrentToggleDepartment] = useState(null);
  const [currentToggleClass, setCurrentToggleClass] = useState(null);

  // Modal states
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isJobAssignmentModalOpen, setIsJobAssignmentModalOpen] = useState(false);
  const [isJobViewModalOpen, setIsJobViewModalOpen] = useState(false);
  const [isBulkJobAssignmentModalOpen, setIsBulkJobAssignmentModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [selectedTopicForJob, setSelectedTopicForJob] = useState(null);
  const [selectedTopicForJobView, setSelectedTopicForJobView] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isEditingUnassignedTopic, setIsEditingUnassignedTopic] = useState(false);

  // Form data for topic modal
  const [topicFormData, setTopicFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    subjectId: '',
    classId: '',
    sectionIds: [],
    difficulty: 'medium',
    estimatedTime: '',
    jobId: '',
    isActive: true
  });

  // Sorting and filtering states
  const [sortBy, setSortBy] = useState('title'); // 'title', 'subject', 'class', 'sectionsCount'
  const [searchTerm, setSearchTerm] = useState('');

  // AI Generation states
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGeneratedTopics, setAiGeneratedTopics] = useState([]);
  const [aiGeneratedSubjects, setAiGeneratedSubjects] = useState([]); // New: subjects with topics
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newJobFormData, setNewJobFormData] = useState({
    name: '',
    description: '',
    company: '',
    departmentId: '',
    classId: '',
    sectionId: '',
    jobPostingLink: ''
  });
  
  // Subject confirmation modal states
  const [isSubjectConfirmModalOpen, setIsSubjectConfirmModalOpen] = useState(false);
  const [pendingSubjectToAdd, setPendingSubjectToAdd] = useState(null);
  
  // Topic selection and confirmation states
  const [selectedTopicsForSave, setSelectedTopicsForSave] = useState([]);
  
  // Existing subject mapping for AI-generated subjects
  const [subjectMappings, setSubjectMappings] = useState({}); // { aiSubjectId: existingSubjectId or 'new' }

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState({
    subjects: false,
    classes: false,
    sections: false,
    topics: false
  });

  // Current organization ID (would come from context/auth in real app)
  const [currentOrganizationId, setCurrentOrganizationId] = useState('org-123');

  // --- API CALLS ---

  const fetchDepartments = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, departments: true }));
      
      // Dummy data for departments (Programming Training Departments)
      const dummyDepartments = [
        { _id: 'dept-1', name: 'Web Development', description: 'Frontend and Backend Web Development', code: 'WEB' },
        { _id: 'dept-2', name: 'Full-Stack Development', description: 'Complete Full-Stack Programming Solutions', code: 'FS' },
        { _id: 'dept-3', name: 'Data Science & AI', description: 'Data Analysis, Machine Learning and AI', code: 'DS' },
        { _id: 'dept-4', name: 'DevOps & Cloud', description: 'DevOps Practices and Cloud Computing', code: 'DEVOPS' },
        { _id: 'dept-5', name: 'Mobile Development', description: 'iOS and Android Mobile App Development', code: 'MOBILE' },
        { _id: 'dept-6', name: 'Cybersecurity', description: 'Information Security and Ethical Hacking', code: 'SEC' },
        { _id: 'dept-7', name: 'Cloud Computing', description: 'AWS, Azure, and GCP Cloud Technologies', code: 'CLOUD' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 400));
      setDepartments(dummyDepartments);
      
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    } finally {
      setLoadingEntities(prev => ({ ...prev, departments: false }));
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, subjects: true }));
      
      // Dummy data for subjects (Programming Languages & Technologies)
      const dummySubjects = [
        // Web Development Department
        { _id: 'subject-1', name: 'HTML & CSS', code: 'HTML', departmentId: 'dept-1', classId: 'class-1', sectionIds: ['section-1', 'section-2'], description: 'Web markup and styling fundamentals' },
        { _id: 'subject-2', name: 'JavaScript Fundamentals', code: 'JS', departmentId: 'dept-1', classId: 'class-2', sectionIds: ['section-3', 'section-4'], description: 'Core JavaScript programming concepts' },
        { _id: 'subject-3', name: 'Advanced JavaScript', code: 'AJS', departmentId: 'dept-1', classId: 'class-3', sectionIds: ['section-5', 'section-6'], description: 'ES6+, async programming, and modern JS' },
        { _id: 'subject-4', name: 'Web APIs & Integration', code: 'API', departmentId: 'dept-1', classId: 'class-4', sectionIds: ['section-7', 'section-8'], description: 'REST APIs, GraphQL, and web integrations' },

        // Full-Stack Development Department
        { _id: 'subject-5', name: 'React.js', code: 'REACT', departmentId: 'dept-2', classId: 'class-2', sectionIds: ['section-1', 'section-3'], description: 'React frontend framework and ecosystem' },
        { _id: 'subject-6', name: 'Node.js', code: 'NODE', departmentId: 'dept-2', classId: 'class-2', sectionIds: ['section-2', 'section-4'], description: 'Server-side JavaScript development' },
        { _id: 'subject-7', name: 'MERN Stack', code: 'MERN', departmentId: 'dept-2', classId: 'class-3', sectionIds: ['section-5', 'section-6'], description: 'Complete MERN stack development' },
        { _id: 'subject-8', name: 'Database Design', code: 'DB', departmentId: 'dept-2', classId: 'class-3', sectionIds: ['section-7', 'section-8'], description: 'SQL and NoSQL database management' },

        // Data Science & AI Department
        { _id: 'subject-9', name: 'Python Programming', code: 'PY', departmentId: 'dept-3', classId: 'class-1', sectionIds: ['section-1', 'section-5'], description: 'Python programming fundamentals' },
        { _id: 'subject-10', name: 'Data Analysis', code: 'DA', departmentId: 'dept-3', classId: 'class-2', sectionIds: ['section-2', 'section-6'], description: 'Pandas, NumPy, and data manipulation' },
        { _id: 'subject-11', name: 'Machine Learning', code: 'ML', departmentId: 'dept-3', classId: 'class-3', sectionIds: ['section-3', 'section-7'], description: 'Scikit-learn, TensorFlow, and ML algorithms' },
        { _id: 'subject-12', name: 'Deep Learning', code: 'DL', departmentId: 'dept-3', classId: 'class-4', sectionIds: ['section-4', 'section-8'], description: 'Neural networks and deep learning frameworks' },

        // DevOps & Cloud Department
        { _id: 'subject-13', name: 'Linux Administration', code: 'LINUX', departmentId: 'dept-4', classId: 'class-1', sectionIds: ['section-1', 'section-2'], description: 'Linux system administration and shell scripting' },
        { _id: 'subject-14', name: 'Docker & Kubernetes', code: 'DOCKER', departmentId: 'dept-4', classId: 'class-2', sectionIds: ['section-3', 'section-4'], description: 'Containerization and orchestration' },
        { _id: 'subject-15', name: 'CI/CD Pipelines', code: 'CICD', departmentId: 'dept-4', classId: 'class-3', sectionIds: ['section-5', 'section-6'], description: 'Continuous integration and deployment' },
        { _id: 'subject-16', name: 'Infrastructure as Code', code: 'IAC', departmentId: 'dept-4', classId: 'class-4', sectionIds: ['section-7', 'section-8'], description: 'Terraform, Ansible, and IaC practices' },

        // Mobile Development Department
        { _id: 'subject-17', name: 'React Native', code: 'RN', departmentId: 'dept-5', classId: 'class-2', sectionIds: ['section-1', 'section-3'], description: 'Cross-platform mobile development with React Native' },
        { _id: 'subject-18', name: 'Flutter', code: 'FLUTTER', departmentId: 'dept-5', classId: 'class-2', sectionIds: ['section-2', 'section-4'], description: 'Dart and Flutter mobile app development' },
        { _id: 'subject-19', name: 'iOS Development', code: 'IOS', departmentId: 'dept-5', classId: 'class-3', sectionIds: ['section-5', 'section-6'], description: 'Swift and iOS app development' },
        { _id: 'subject-20', name: 'Android Development', code: 'ANDROID', departmentId: 'dept-5', classId: 'class-3', sectionIds: ['section-7', 'section-8'], description: 'Kotlin and Android app development' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setSubjects(dummySubjects);
      
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    } finally {
      setLoadingEntities(prev => ({ ...prev, subjects: false }));
    }
  };

  const fetchClasses = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, classes: true }));
      
      const dummyClasses = [
        // Web Development Department
        { _id: 'class-1', name: 'Foundation Level', description: 'Beginner programming concepts and basics', code: 'FOUND', departmentId: 'dept-1' },
        { _id: 'class-2', name: 'Intermediate Level', description: 'Intermediate programming skills and frameworks', code: 'INTER', departmentId: 'dept-1' },
        { _id: 'class-3', name: 'Advanced Level', description: 'Advanced programming concepts and architecture', code: 'ADV', departmentId: 'dept-1' },
        
        // Full-Stack Development Department
        { _id: 'class-4', name: 'Foundation Level', description: 'Full-stack basics and fundamentals', code: 'FOUND-FS', departmentId: 'dept-2' },
        { _id: 'class-5', name: 'Intermediate Level', description: 'Full-stack intermediate skills', code: 'INTER-FS', departmentId: 'dept-2' },
        { _id: 'class-6', name: 'Advanced Level', description: 'Full-stack advanced architecture', code: 'ADV-FS', departmentId: 'dept-2' },
        
        // Data Science & AI Department
        { _id: 'class-7', name: 'Foundation Level', description: 'Data science fundamentals', code: 'FOUND-DS', departmentId: 'dept-3' },
        { _id: 'class-8', name: 'Intermediate Level', description: 'Data science intermediate concepts', code: 'INTER-DS', departmentId: 'dept-3' },
        { _id: 'class-9', name: 'Advanced Level', description: 'Advanced ML and AI', code: 'ADV-DS', departmentId: 'dept-3' },
        
        // DevOps & Cloud Department
        { _id: 'class-10', name: 'Foundation Level', description: 'DevOps basics', code: 'FOUND-DO', departmentId: 'dept-4' },
        { _id: 'class-11', name: 'Intermediate Level', description: 'DevOps intermediate practices', code: 'INTER-DO', departmentId: 'dept-4' },
        
        // Mobile Development Department
        { _id: 'class-12', name: 'Foundation Level', description: 'Mobile development basics', code: 'FOUND-MOB', departmentId: 'dept-5' },
        { _id: 'class-13', name: 'Intermediate Level', description: 'Mobile development intermediate', code: 'INTER-MOB', departmentId: 'dept-5' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setClasses(dummyClasses);
      
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    } finally {
      setLoadingEntities(prev => ({ ...prev, classes: false }));
    }
  };

  const fetchSections = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, sections: true }));
      
      const dummySections = [
        // Class 1 - Web Dev Foundation
        { _id: 'section-1', name: 'Batch A101', description: 'Morning sessions (9 AM - 12 PM)', code: 'A101', classId: 'class-1' },
        { _id: 'section-2', name: 'Batch A102', description: 'Afternoon sessions (2 PM - 5 PM)', code: 'A102', classId: 'class-1' },
        { _id: 'section-3', name: 'Batch A103', description: 'Evening sessions (6 PM - 9 PM)', code: 'A103', classId: 'class-1' },
        
        // Class 2 - Web Dev Intermediate
        { _id: 'section-4', name: 'Batch B201', description: 'Morning sessions (9 AM - 12 PM)', code: 'B201', classId: 'class-2' },
        { _id: 'section-5', name: 'Batch B202', description: 'Evening sessions (6 PM - 9 PM)', code: 'B202', classId: 'class-2' },
        
        // Class 3 - Web Dev Advanced
        { _id: 'section-6', name: 'Batch C301', description: 'Weekend intensive sessions', code: 'C301', classId: 'class-3' },
        { _id: 'section-7', name: 'Batch C302', description: 'Online live sessions', code: 'C302', classId: 'class-3' },
        
        // Class 4 - Full-Stack Foundation
        { _id: 'section-8', name: 'Batch D401', description: 'Morning sessions (9 AM - 12 PM)', code: 'D401', classId: 'class-4' },
        { _id: 'section-9', name: 'Batch D402', description: 'Afternoon sessions (2 PM - 5 PM)', code: 'D402', classId: 'class-4' },
        
        // Class 5 - Full-Stack Intermediate
        { _id: 'section-10', name: 'Batch E501', description: 'Evening sessions (6 PM - 9 PM)', code: 'E501', classId: 'class-5' },
        { _id: 'section-11', name: 'Batch E502', description: 'Weekend sessions', code: 'E502', classId: 'class-5' },
        
        // Class 6 - Full-Stack Advanced
        { _id: 'section-12', name: 'Batch F601', description: 'Bootcamp intensive', code: 'F601', classId: 'class-6' },
        
        // Class 7 - Data Science Foundation
        { _id: 'section-13', name: 'Batch G701', description: 'Morning sessions (9 AM - 12 PM)', code: 'G701', classId: 'class-7' },
        { _id: 'section-14', name: 'Batch G702', description: 'Evening sessions (6 PM - 9 PM)', code: 'G702', classId: 'class-7' },
        
        // Class 8 - Data Science Intermediate
        { _id: 'section-15', name: 'Batch H801', description: 'Online sessions', code: 'H801', classId: 'class-8' },
        { _id: 'section-16', name: 'Batch H802', description: 'Weekend sessions', code: 'H802', classId: 'class-8' },
        
        // Class 9 - Data Science Advanced
        { _id: 'section-17', name: 'Batch I901', description: 'Corporate training', code: 'I901', classId: 'class-9' },
        
        // Class 10 - DevOps Foundation
        { _id: 'section-18', name: 'Batch J101', description: 'Morning sessions', code: 'J101', classId: 'class-10' },
        { _id: 'section-19', name: 'Batch J102', description: 'Evening sessions', code: 'J102', classId: 'class-10' },
        
        // Class 11 - DevOps Intermediate
        { _id: 'section-20', name: 'Batch K111', description: 'Online sessions', code: 'K111', classId: 'class-11' },
        
        // Class 12 - Mobile Foundation
        { _id: 'section-21', name: 'Batch L121', description: 'Morning sessions', code: 'L121', classId: 'class-12' },
        { _id: 'section-22', name: 'Batch L122', description: 'Evening sessions', code: 'L122', classId: 'class-12' },
        
        // Class 13 - Mobile Intermediate
        { _id: 'section-23', name: 'Batch M131', description: 'Weekend bootcamp', code: 'M131', classId: 'class-13' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setSections(dummySections);
      
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
    } finally {
      setLoadingEntities(prev => ({ ...prev, sections: false }));
    }
  };

  const fetchTopics = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, topics: true }));
      
      // Comprehensive dummy topics for different departments
      const dummyTopics = [
        // Web Development Topics (dept-1, class-1)
        {
          _id: 'topic-1',
          title: 'HTML5 Semantic Elements',
          description: 'Learn the basics of HTML5 including semantic tags, forms, and multimedia elements. Understand how to structure web pages using proper HTML5 semantics for better accessibility and SEO.',
          departmentId: 'dept-1',
          classId: 'class-1',
          subjectId: 'subject-1', // HTML & CSS
          sectionIds: ['section-1', 'section-2'],
          difficulty: 'beginner',
          estimatedTime: '20 hours',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          _id: 'topic-2',
          title: 'CSS Flexbox & Grid',
          description: 'Master CSS3 features including Flexbox, Grid, animations, and responsive design. Create modern, flexible layouts that adapt to different screen sizes and devices.',
          departmentId: 'dept-1',
          classId: 'class-1',
          subjectId: 'subject-1', // HTML & CSS
          sectionIds: ['section-1', 'section-2'],
          difficulty: 'beginner',
          estimatedTime: '25 hours',
          isActive: true,
          createdAt: '2024-01-02T00:00:00Z'
        },
        {
          _id: 'topic-3',
          title: 'JavaScript Variables & Functions',
          description: 'Introduction to modern JavaScript including variables, functions, arrow functions, and ES6+ syntax. Build a strong foundation in JavaScript programming.',
          departmentId: 'dept-1',
          classId: 'class-2',
          subjectId: 'subject-2', // JavaScript Fundamentals
          sectionIds: ['section-3'],
          difficulty: 'beginner',
          estimatedTime: '30 hours',
          isActive: true,
          createdAt: '2024-01-03T00:00:00Z'
        },
        {
          _id: 'topic-4',
          title: 'DOM Events & Manipulation',
          description: 'Learn how to manipulate the Document Object Model using JavaScript. Handle user events, create dynamic content, and build interactive web applications.',
          departmentId: 'dept-1',
          classId: 'class-2',
          subjectId: 'subject-2', // JavaScript Fundamentals
          sectionIds: ['section-3'],
          difficulty: 'intermediate',
          estimatedTime: '18 hours',
          isActive: true,
          createdAt: '2024-01-04T00:00:00Z'
        },
        {
          _id: 'topic-5',
          title: 'Mobile-First Design',
          description: 'Creating mobile-friendly websites using media queries and responsive techniques. Learn mobile-first development approach and best practices for responsive web design.',
          departmentId: 'dept-1',
          classId: 'class-1',
          subjectId: 'subject-1', // HTML & CSS
          sectionIds: ['section-1', 'section-2'],
          difficulty: 'intermediate',
          estimatedTime: '15 hours',
          isActive: true,
          createdAt: '2024-01-05T00:00:00Z'
        },

        // Full-Stack Topics (dept-2, class-5, section-1 which maps to class-2 in old data)
        {
          _id: 'topic-6',
          title: 'React Components & Props',
          description: 'Introduction to React including components, props, state, and hooks. Build modern single-page applications with React and understand component lifecycle.',
          departmentId: 'dept-2',
          classId: 'class-5',
          subjectId: 'subject-5', // React.js
          sectionIds: ['section-1'],
          difficulty: 'intermediate',
          estimatedTime: '35 hours',
          isActive: true,
          createdAt: '2024-01-06T00:00:00Z'
        },
        {
          _id: 'topic-7',
          title: 'Express.js REST APIs',
          description: 'Building RESTful APIs with Node.js and Express.js. Learn server-side JavaScript development, routing, middleware, and API design patterns.',
          departmentId: 'dept-2',
          classId: 'class-5',
          subjectId: 'subject-6', // Node.js
          sectionIds: ['section-1'],
          difficulty: 'intermediate',
          estimatedTime: '40 hours',
          isActive: true,
          createdAt: '2024-01-07T00:00:00Z'
        },
        {
          _id: 'topic-8',
          title: 'MongoDB Schema Design',
          description: 'NoSQL database design patterns and CRUD operations with MongoDB. Understand document-based databases, indexing, and query optimization.',
          departmentId: 'dept-2',
          classId: 'class-6',
          subjectId: 'subject-8', // Database Design
          sectionIds: ['section-1'],
          difficulty: 'intermediate',
          estimatedTime: '28 hours',
          isActive: true,
          createdAt: '2024-01-08T00:00:00Z'
        },

        // Data Science Topics (dept-3, class-7, section-1 which maps to class-1)
        {
          _id: 'topic-9',
          title: 'Python Data Structures',
          description: 'Fundamentals of Python programming language including syntax and data structures. Learn lists, dictionaries, sets, tuples, and Python built-in functions.',
          departmentId: 'dept-3',
          classId: 'class-7',
          subjectId: 'subject-9', // Python Programming
          sectionIds: ['section-1'],
          difficulty: 'beginner',
          estimatedTime: '32 hours',
          isActive: true,
          createdAt: '2024-01-09T00:00:00Z'
        },
        {
          _id: 'topic-10',
          title: 'Pandas DataFrames',
          description: 'Learn data manipulation and analysis using the Pandas library. Master DataFrame operations, data cleaning, transformation, and aggregation techniques.',
          departmentId: 'dept-3',
          classId: 'class-8',
          subjectId: 'subject-10', // Data Analysis
          sectionIds: ['section-1'],
          difficulty: 'intermediate',
          estimatedTime: '26 hours',
          isActive: true,
          createdAt: '2024-01-10T00:00:00Z'
        },
        {
          _id: 'topic-11',
          title: 'SQL Joins & Aggregations',
          description: 'Master SQL queries, joins, and aggregations for data analysis. Learn advanced SQL techniques for extracting insights from relational databases.',
          departmentId: 'dept-3',
          classId: 'class-7',
          subjectId: 'subject-9', // Python Programming
          sectionIds: ['section-1'],
          difficulty: 'beginner',
          estimatedTime: '22 hours',
          isActive: true,
          createdAt: '2024-01-11T00:00:00Z'
        },

        // More Data Science Topics (dept-3, class-9, section-3 which maps to class-3)
        {
          _id: 'topic-12',
          title: 'Supervised Learning Algorithms',
          description: 'Introduction to supervised and unsupervised learning algorithms. Learn regression, classification, clustering, and model evaluation techniques.',
          departmentId: 'dept-3',
          classId: 'class-9',
          subjectId: 'subject-11', // Machine Learning
          sectionIds: ['section-3'],
          difficulty: 'advanced',
          estimatedTime: '50 hours',
          isActive: true,
          createdAt: '2024-01-12T00:00:00Z'
        },
        {
          _id: 'topic-13',
          title: 'Neural Networks with TensorFlow',
          description: 'Build neural networks and deep learning models using TensorFlow. Understand backpropagation, activation functions, and training deep learning models.',
          departmentId: 'dept-3',
          classId: 'class-9',
          subjectId: 'subject-12', // Deep Learning
          sectionIds: ['section-3'],
          difficulty: 'advanced',
          estimatedTime: '60 hours',
          isActive: true,
          createdAt: '2024-01-13T00:00:00Z'
        },

        // DevOps Topics (dept-4, class-11, section-3 which maps to class-2)
        {
          _id: 'topic-14',
          title: 'Docker Images & Containers',
          description: 'Learn containerization concepts and Docker fundamentals. Create, manage, and deploy Docker containers for consistent application environments.',
          departmentId: 'dept-4',
          classId: 'class-11',
          subjectId: 'subject-14', // Docker & Kubernetes
          sectionIds: ['section-3'],
          difficulty: 'intermediate',
          estimatedTime: '24 hours',
          isActive: true,
          createdAt: '2024-01-14T00:00:00Z'
        },
        {
          _id: 'topic-15',
          title: 'Kubernetes Deployments',
          description: 'Container orchestration and management with Kubernetes. Learn pods, services, deployments, and scaling applications in Kubernetes clusters.',
          departmentId: 'dept-4',
          classId: 'class-11',
          subjectId: 'subject-14', // Docker & Kubernetes
          sectionIds: ['section-3'],
          difficulty: 'advanced',
          estimatedTime: '45 hours',
          isActive: true,
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          _id: 'topic-16',
          title: 'Jenkins Pipeline Setup',
          description: 'Building automated deployment pipelines with Jenkins and GitLab CI. Implement continuous integration and continuous deployment best practices.',
          departmentId: 'dept-4',
          classId: 'class-11',
          subjectId: 'subject-15', // CI/CD Pipelines
          sectionIds: ['section-3'],
          difficulty: 'intermediate',
          estimatedTime: '35 hours',
          isActive: true,
          createdAt: '2024-01-16T00:00:00Z'
        },

        // Mobile Development Topics (dept-5, class-13, section-1 which maps to class-2)
        {
          _id: 'topic-17',
          title: 'React Native Components',
          description: 'Cross-platform mobile development with React Native. Build iOS and Android apps using JavaScript and React Native components and APIs.',
          departmentId: 'dept-5',
          classId: 'class-13',
          subjectId: 'subject-17', // React Native
          sectionIds: ['section-1'],
          difficulty: 'intermediate',
          estimatedTime: '38 hours',
          isActive: true,
          createdAt: '2024-01-17T00:00:00Z'
        },
        {
          _id: 'topic-18',
          title: 'Mobile Navigation Patterns',
          description: 'Designing beautiful and intuitive mobile user interfaces. Learn mobile UX principles, navigation patterns, and creating engaging mobile experiences.',
          departmentId: 'dept-5',
          classId: 'class-13',
          subjectId: 'subject-17', // React Native
          sectionIds: ['section-1'],
          difficulty: 'beginner',
          estimatedTime: '22 hours',
          isActive: true,
          createdAt: '2024-01-18T00:00:00Z'
        },

        // Topics without jobs (for testing the "No Jobs Assigned" section)
        {
          _id: 'topic-19',
          title: 'Git Basics & Commits',
          description: 'Version control basics with Git and GitHub. Learn how to track changes, create commits, and collaborate with other developers using Git.',
          departmentId: 'dept-1',
          classId: 'class-1',
          subjectId: 'subject-1', // HTML & CSS
          sectionIds: ['section-1'],
          difficulty: 'beginner',
          estimatedTime: '12 hours',
          isActive: true,
          createdAt: '2024-01-19T00:00:00Z'
        },
        {
          _id: 'topic-20',
          title: 'Git Branching Strategies',
          description: 'Branching strategies, rebasing, and advanced Git techniques. Master Git workflows for team collaboration and efficient code management.',
          departmentId: 'dept-1',
          classId: 'class-1',
          subjectId: 'subject-1', // HTML & CSS
          sectionIds: ['section-1'],
          difficulty: 'intermediate',
          estimatedTime: '18 hours',
          isActive: true,
          createdAt: '2024-01-20T00:00:00Z'
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setTopics(dummyTopics);
      
      // Set topic-job assignments
      const dummyAssignments = [
        // Assignments for Job dcsj-1 (Junior Frontend Developer)
        { _id: 'assign-1', topicId: 'topic-1', jobId: 'dcsj-1', createdAt: '2024-01-15T10:30:00Z' },
        { _id: 'assign-2', topicId: 'topic-2', jobId: 'dcsj-1', createdAt: '2024-01-15T10:30:00Z' },
        { _id: 'assign-3', topicId: 'topic-3', jobId: 'dcsj-1', createdAt: '2024-01-15T10:30:00Z' },
        { _id: 'assign-4', topicId: 'topic-4', jobId: 'dcsj-1', createdAt: '2024-01-15T10:30:00Z' },
        { _id: 'assign-5', topicId: 'topic-5', jobId: 'dcsj-1', createdAt: '2024-01-15T10:30:00Z' },

        // Assignments for Job dcsj-3 (Full-Stack Developer)
        { _id: 'assign-6', topicId: 'topic-6', jobId: 'dcsj-3', createdAt: '2024-01-17T09:15:00Z' },
        { _id: 'assign-7', topicId: 'topic-7', jobId: 'dcsj-3', createdAt: '2024-01-17T09:15:00Z' },
        { _id: 'assign-8', topicId: 'topic-8', jobId: 'dcsj-3', createdAt: '2024-01-17T09:15:00Z' },

        // Assignments for Job dcsj-5 (Junior Data Analyst)
        { _id: 'assign-9', topicId: 'topic-9', jobId: 'dcsj-5', createdAt: '2024-01-19T11:30:00Z' },
        { _id: 'assign-10', topicId: 'topic-10', jobId: 'dcsj-5', createdAt: '2024-01-19T11:30:00Z' },
        { _id: 'assign-11', topicId: 'topic-11', jobId: 'dcsj-5', createdAt: '2024-01-19T11:30:00Z' },

        // Assignments for Job dcsj-6 (Machine Learning Engineer)
        { _id: 'assign-12', topicId: 'topic-12', jobId: 'dcsj-6', createdAt: '2024-01-20T13:20:00Z' },
        { _id: 'assign-13', topicId: 'topic-13', jobId: 'dcsj-6', createdAt: '2024-01-20T13:20:00Z' },

        // Assignments for Job dcsj-7 (DevOps Engineer)
        { _id: 'assign-14', topicId: 'topic-14', jobId: 'dcsj-7', createdAt: '2024-01-21T15:10:00Z' },
        { _id: 'assign-15', topicId: 'topic-15', jobId: 'dcsj-7', createdAt: '2024-01-21T15:10:00Z' },
        { _id: 'assign-16', topicId: 'topic-16', jobId: 'dcsj-7', createdAt: '2024-01-21T15:10:00Z' },

        // Assignments for Job dcsj-8 (React Native Developer)
        { _id: 'assign-17', topicId: 'topic-17', jobId: 'dcsj-8', createdAt: '2024-01-22T10:45:00Z' },
        { _id: 'assign-18', topicId: 'topic-18', jobId: 'dcsj-8', createdAt: '2024-01-22T10:45:00Z' }

        // topic-19 and topic-20 are intentionally not assigned to any job (for "No Jobs Assigned" section)
      ];
      
      setTopicJobAssignments(dummyAssignments);
      
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to fetch topics');
    } finally {
      setLoadingEntities(prev => ({ ...prev, topics: false }));
    }
  };

  const fetchJobs = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, jobs: true }));
      
      // Dummy data for jobs (mapped to departments and classes)
      const dummyJobs = [
        { _id: 'job-1', name: 'Frontend Developer', description: 'Web Development - Foundation Level', departmentId: 'dept-1', classId: 'class-1' },
        { _id: 'job-2', name: 'Full-Stack Developer', description: 'Full-Stack Development - Intermediate Level', departmentId: 'dept-2', classId: 'class-2' },
        { _id: 'job-3', name: 'Data Scientist', description: 'Data Science & AI - Advanced Level', departmentId: 'dept-3', classId: 'class-3' },
        { _id: 'job-4', name: 'DevOps Engineer', description: 'DevOps & Cloud - Expert Level', departmentId: 'dept-4', classId: 'class-4' },
        { _id: 'job-5', name: 'Mobile App Developer', description: 'Mobile Development - Specialization Track', departmentId: 'dept-5', classId: 'class-5' },
        { _id: 'job-6', name: 'Senior Software Engineer', description: 'Full-Stack Development - Industry Preparation', departmentId: 'dept-2', classId: 'class-7' },
        { _id: 'job-7', name: 'Machine Learning Engineer', description: 'Data Science & AI - Project-Based Learning', departmentId: 'dept-3', classId: 'class-6' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setJobs(dummyJobs);
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoadingEntities(prev => ({ ...prev, jobs: false }));
    }
  };

  const fetchDepartmentClassSectionJobs = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, departmentClassSectionJobs: true }));
      
      // Dummy data for jobs under specific department/class/section combinations
      const dummyDepartmentClassSectionJobs = [
        // Web Development Department
        { 
          _id: 'dcsj-1', 
          departmentId: 'dept-1', 
          classId: 'class-1',
          sectionId: 'section-1',
          jobTitle: 'Junior Frontend Developer',
          jobDescription: 'Entry-level frontend development role focusing on HTML, CSS, and JavaScript',
          requirements: ['HTML5', 'CSS3', 'JavaScript basics', 'Responsive design'],
          company: 'TechCorp Solutions',
          jobPostingLink: 'https://techcorp.com/careers/junior-frontend-developer',
          createdAt: '2024-01-15T10:30:00Z'
        },
        { 
          _id: 'dcsj-2', 
          departmentId: 'dept-1', 
          classId: 'class-2',
          sectionId: 'section-3',
          jobTitle: 'Frontend Developer',
          jobDescription: 'Mid-level frontend developer with React.js experience',
          requirements: ['React.js', 'JavaScript ES6+', 'CSS frameworks', 'Git'],
          company: 'Digital Innovations Inc',
          jobPostingLink: 'https://digitalinnovations.com/jobs/frontend-developer',
          createdAt: '2024-01-16T14:20:00Z'
        },

        // Full-Stack Development Department
        { 
          _id: 'dcsj-3', 
          departmentId: 'dept-2', 
          classId: 'class-2', 
          sectionId: 'section-1',
          jobTitle: 'Full-Stack Developer',
          jobDescription: 'Full-stack development role with MERN stack expertise',
          requirements: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Git'],
          company: 'StartupXYZ',
          jobPostingLink: 'https://startupxyz.com/careers/fullstack-developer',
          createdAt: '2024-01-17T09:15:00Z'
        },
        { 
          _id: 'dcsj-4', 
          departmentId: 'dept-2', 
          classId: 'class-3', 
          sectionId: 'section-5',
          jobTitle: 'Senior Full-Stack Developer',
          jobDescription: 'Senior role leading full-stack development projects',
          requirements: ['5+ years experience', 'MERN/MEAN stack', 'AWS/Cloud', 'Team leadership'],
          company: 'Enterprise Solutions Ltd',
          jobPostingLink: 'https://enterprisesolutions.com/jobs/senior-fullstack',
          createdAt: '2024-01-18T16:45:00Z'
        },

        // Data Science & AI Department
        { 
          _id: 'dcsj-5', 
          departmentId: 'dept-3', 
          classId: 'class-1',
          sectionId: 'section-1',
          jobTitle: 'Junior Data Analyst',
          jobDescription: 'Entry-level data analysis role with Python and SQL',
          requirements: ['Python', 'SQL', 'Pandas', 'NumPy', 'Basic statistics'],
          company: 'DataInsights Corp',
          jobPostingLink: 'https://datainsights.com/careers/junior-data-analyst',
          createdAt: '2024-01-19T11:30:00Z'
        },
        { 
          _id: 'dcsj-6', 
          departmentId: 'dept-3', 
          classId: 'class-3', 
          sectionId: 'section-3',
          jobTitle: 'Machine Learning Engineer',
          jobDescription: 'ML engineer role focusing on model development and deployment',
          requirements: ['Python', 'Scikit-learn', 'TensorFlow', 'MLOps', 'Docker'],
          company: 'AI Innovations',
          jobPostingLink: 'https://aiinnovations.com/jobs/ml-engineer',
          createdAt: '2024-01-20T13:20:00Z'
        },

        // DevOps & Cloud Department
        { 
          _id: 'dcsj-7', 
          departmentId: 'dept-4', 
          classId: 'class-2', 
          sectionId: 'section-3',
          jobTitle: 'DevOps Engineer',
          jobDescription: 'DevOps role with Docker, Kubernetes, and CI/CD experience',
          requirements: ['Docker', 'Kubernetes', 'AWS/Azure', 'CI/CD', 'Linux'],
          company: 'CloudTech Solutions',
          jobPostingLink: 'https://cloudtechsolutions.com/careers/devops-engineer',
          createdAt: '2024-01-21T15:10:00Z'
        },

        // Mobile Development Department
        { 
          _id: 'dcsj-8', 
          departmentId: 'dept-5', 
          classId: 'class-2', 
          sectionId: 'section-1',
          jobTitle: 'React Native Developer',
          jobDescription: 'Cross-platform mobile development with React Native',
          requirements: ['React Native', 'JavaScript', 'Mobile UI/UX', 'App Store deployment'],
          company: 'MobileFirst Inc',
          jobPostingLink: 'https://mobilefirst.com/jobs/react-native-developer',
          createdAt: '2024-01-22T10:45:00Z'
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setDepartmentClassSectionJobs(dummyDepartmentClassSectionJobs);
      
    } catch (error) {
      console.error('Error fetching department-class-section jobs:', error);
      toast.error('Failed to fetch department-class-section jobs');
    } finally {
      setLoadingEntities(prev => ({ ...prev, departmentClassSectionJobs: false }));
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchDepartments(),
        fetchSubjects(),
        fetchClasses(),
        fetchSections(),
        fetchTopics(),
        fetchJobs(),
        fetchDepartmentClassSectionJobs()
      ]);
    } catch (error) {
      console.error('Error in fetchAllData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS ---

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    setSelectedSection('');
    setSelectedSubject('');
  };

  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
    setSelectedSubject('');
  };

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(subjectId);
  };

  const openTopicModal = (topic = null, fromUnassignedSection = false) => {
    if (topic) {
      setEditingTopic(topic);
      setIsEditingUnassignedTopic(fromUnassignedSection);
      
      // Find if this topic is assigned to a job
      const topicJobAssignment = topicJobAssignments.find(a => a.topicId === topic._id);
      
      setTopicFormData({
        title: topic.name || topic.title,
        description: topic.description,
        departmentId: topic.departmentId,
        subjectId: topic.subjectId,
        classId: topic.classId,
        sectionIds: topic.sectionIds || [],
        difficulty: topic.difficulty,
        estimatedTime: topic.estimatedTime,
        jobId: topicJobAssignment?.jobId || '',
        isActive: topic.isActive
      });
    } else {
      setEditingTopic(null);
      setIsEditingUnassignedTopic(false);
      setTopicFormData({
        title: '',
        description: '',
        departmentId: selectedSubject || '',
        subjectId: selectedSubject || '',
        classId: selectedClass || '',
        sectionIds: selectedSection ? [selectedSection] : [],
        difficulty: 'medium',
        estimatedTime: '',
        jobId: '',
        isActive: true
      });
    }
    setIsTopicModalOpen(true);
  };

  const closeTopicModal = () => {
    setIsTopicModalOpen(false);
    setEditingTopic(null);
    setIsEditingUnassignedTopic(false);
    setTopicFormData({
      title: '',
      description: '',
      departmentId: '',
      subjectId: '',
      classId: '',
      sectionIds: [],
      difficulty: 'medium',
      estimatedTime: '',
      jobId: '',
      isActive: true
    });
  };

  const openJobAssignmentModal = (topic) => {
    setSelectedTopicForJob(topic);
    setIsJobAssignmentModalOpen(true);
  };

  const closeJobAssignmentModal = () => {
    setIsJobAssignmentModalOpen(false);
    setSelectedTopicForJob(null);
  };

  const openJobViewModal = (topic) => {
    setSelectedTopicForJobView(topic);
    setIsJobViewModalOpen(true);
  };

  const closeJobViewModal = () => {
    setIsJobViewModalOpen(false);
    setSelectedTopicForJobView(null);
  };

  const openBulkJobAssignmentModal = () => {
    setIsBulkJobAssignmentModalOpen(true);
  };

  const closeBulkJobAssignmentModal = () => {
    setIsBulkJobAssignmentModalOpen(false);
    setSelectedTopics([]);
  };

  const toggleBulkTopicSelection = (topic) => {
    setSelectedTopics(prev => {
      const isSelected = prev.some(t => t._id === topic._id);
      if (isSelected) {
        return prev.filter(t => t._id !== topic._id);
      } else {
        return [...prev, topic];
      }
    });
  };

  const selectAllTopics = () => {
    setSelectedTopics([...sortedTopics]);
  };

  const clearSelection = () => {
    setSelectedTopics([]);
  };

  const handleBulkAssignTopicsToJob = async (jobId) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the job
      const job = jobs.find(j => j._id === jobId);
      if (job) {
        // Create assignments for all selected topics
        const newAssignments = selectedTopics.map(topic => {
          // Check if assignment already exists
          const existingAssignment = topicJobAssignments.find(
            assignment => assignment.topicId === topic._id && assignment.jobId === jobId
          );
          
          if (existingAssignment) {
            return null; // Skip existing assignments
          }
          
          return {
            _id: `assignment-${Date.now()}-${topic._id}`,
            topicId: topic._id,
            jobId: jobId,
            topicTitle: topic.name || topic.title,
            jobName: job.name,
            createdAt: new Date().toISOString()
          };
        }).filter(Boolean); // Remove null values
        
        // Add new assignments
        setTopicJobAssignments(prev => [...prev, ...newAssignments]);
        
        toast.success(`Successfully assigned ${newAssignments.length} topic(s) to "${job.name}"`);
      }
      
      closeBulkJobAssignmentModal();
    } catch (error) {
      toast.error('Failed to assign topics to job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTopicToJob = async (jobId) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the job and create the assignment
      const job = jobs.find(j => j._id === jobId);
      if (job) {
        // Check if assignment already exists
        const existingAssignment = topicJobAssignments.find(
          assignment => assignment.topicId === selectedTopicForJob._id && assignment.jobId === jobId
        );
        
        if (existingAssignment) {
          toast.error('This topic is already assigned to this job');
          return;
        }
        
        // Create new assignment
        const newAssignment = {
          _id: `assignment-${Date.now()}`,
          topicId: selectedTopicForJob._id,
          jobId: jobId,
          topicTitle: selectedTopicForJob.name || selectedTopicForJob.title,
          jobName: job.name,
          createdAt: new Date().toISOString()
        };
        
        // Add to assignments
        setTopicJobAssignments(prev => [...prev, newAssignment]);
        
        toast.success(`Topic "${selectedTopicForJob.name || selectedTopicForJob.title}" assigned to job "${job.name}"`);
      }
      
      closeJobAssignmentModal();
    } catch (error) {
      toast.error('Failed to assign topic to job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTopic = async (formData) => {
    try {
      setIsLoading(true);
      
      if (editingTopic) {
        // Update existing topic - using PUT request
        const updateData = {
          name: formData.title,
          description: formData.description,
          subjectId: formData.subjectId,
          difficultyLevel: formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)
        };
        
        const response = await postRequest(`/topics/${editingTopic._id}`, updateData);
        
        if (response.data.success) {
          // Update local state with the response data
        setTopics(prev => 
          prev.map(topic => 
            topic._id === editingTopic._id
                ? { ...topic, ...response.data.data, updatedAt: new Date().toISOString() }
              : topic
          )
        );
        
          toast.success('Topic updated successfully!');
        } else {
          throw new Error(response.data.message || 'Failed to update topic');
        }
      } else {
        // Create new topic using the specified API format
        const topicData = {
          name: formData.title,
          description: formData.description,
          subjectId: formData.subjectId,
          difficultyLevel: formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)
        };
        
        const response = await postRequest("/topics", topicData);
        
        if (response.data.success) {
          // Add the new topic to local state
        const newTopic = {
            ...response.data.data,
          createdAt: new Date().toISOString()
        };
        setTopics(prev => [...prev, newTopic]);
        
          toast.success('Topic created successfully!');
        } else {
          throw new Error(response.data.message || 'Failed to create topic');
        }
      }
      
      closeTopicModal();
    } catch (error) {
      console.error('Error saving topic:', error);
      toast.error(error.message || 'Failed to save topic');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTopics(prev => 
          prev.filter(topic => topic._id !== topicId)
        );
        
        toast.success('Topic deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete topic');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // AI Generation Functions
  const generateTopicsWithAI = async () => {
    if (!newJobFormData.name.trim() || !newJobFormData.description.trim()) {
      toast.error('Please fill in job title and description');
      return;
    }

    if (!newJobFormData.departmentId) {
      toast.error('Please select a department');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Simulate Gemini API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const department = departments.find(d => d._id === newJobFormData.departmentId);
      
      // Mock AI-generated subjects with topics
      const mockGeneratedSubjects = [
        {
          _id: `ai-subject-${Date.now()}-1`,
          name: `${department?.name} Core Concepts`,
          code: `${department?.code}-CORE`,
          description: `Essential foundational concepts for ${newJobFormData.name}`,
          departmentId: newJobFormData.departmentId,
          isAIGenerated: true,
          topics: [
            {
              _id: `ai-topic-${Date.now()}-1-1`,
              title: 'Fundamentals and Basics',
              description: `Core fundamentals required for ${newJobFormData.name} role`,
              difficulty: 'beginner',
              estimatedTime: '20 hours',
          isAIGenerated: true
        },
        {
              _id: `ai-topic-${Date.now()}-1-2`,
              title: 'Key Principles',
              description: 'Understanding the key principles and methodologies',
          difficulty: 'intermediate',
              estimatedTime: '25 hours',
          isAIGenerated: true
            }
          ]
        },
        {
          _id: `ai-subject-${Date.now()}-2`,
          name: `Advanced ${department?.name} Techniques`,
          code: `${department?.code}-ADV`,
          description: `Advanced techniques and best practices for ${newJobFormData.name}`,
          departmentId: newJobFormData.departmentId,
          isAIGenerated: true,
          topics: [
            {
              _id: `ai-topic-${Date.now()}-2-1`,
              title: 'Problem Solving Strategies',
              description: `Advanced problem-solving specific to ${newJobFormData.name}`,
          difficulty: 'advanced',
              estimatedTime: '30 hours',
              isAIGenerated: true
            },
            {
              _id: `ai-topic-${Date.now()}-2-2`,
              title: 'Industry Best Practices',
              description: 'Current industry standards and methodologies',
              difficulty: 'advanced',
              estimatedTime: '35 hours',
              isAIGenerated: true
            },
            {
              _id: `ai-topic-${Date.now()}-2-3`,
              title: 'Optimization Techniques',
              description: 'Performance optimization and efficiency improvements',
              difficulty: 'expert',
              estimatedTime: '40 hours',
          isAIGenerated: true
            }
          ]
        },
        {
          _id: `ai-subject-${Date.now()}-3`,
          name: `${department?.name} Tools & Technologies`,
          code: `${department?.code}-TOOLS`,
          description: `Essential tools and technologies for ${newJobFormData.name}`,
          departmentId: newJobFormData.departmentId,
          isAIGenerated: true,
          topics: [
            {
              _id: `ai-topic-${Date.now()}-3-1`,
              title: 'Essential Tools',
              description: 'Mastering the essential tools and frameworks',
              difficulty: 'intermediate',
              estimatedTime: '28 hours',
              isAIGenerated: true
            },
            {
              _id: `ai-topic-${Date.now()}-3-2`,
              title: 'Technology Stack',
              description: 'Understanding the complete technology stack',
              difficulty: 'intermediate',
              estimatedTime: '32 hours',
              isAIGenerated: true
            }
          ]
        }
      ];

      setAiGeneratedSubjects(mockGeneratedSubjects);
      toast.success('AI has generated subject and topic suggestions!');
      
    } catch (error) {
      console.error('Error generating topics:', error);
      toast.error('Failed to generate topics with AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const acceptAITopic = (topic) => {
    const newTopic = {
      _id: `topic-${Date.now()}-${Math.random()}`,
      ...topic,
      organizationId: currentOrganizationId,
      createdAt: new Date().toISOString()
    };
    
    setTopics(prev => [...prev, newTopic]);
    setAiGeneratedTopics(prev => prev.filter(t => t !== topic));
    
    // Auto-assign the topic to the newly created job
    const newJob = jobs.find(j => j.name === newJobFormData.name);
    if (newJob) {
      const newAssignment = {
        _id: `assignment-${Date.now()}-${(topic.name || topic.title || '').replace(/\s+/g, '-')}`,
        topicId: newTopic._id,
        jobId: newJob._id,
        topicTitle: newTopic.name || newTopic.title,
        jobName: newJob.name,
        createdAt: new Date().toISOString()
      };
      setTopicJobAssignments(prev => [...prev, newAssignment]);
    }
    
    toast.success('Topic added and assigned to job successfully!');
  };

  // Subject mapping handlers
  const handleSubjectMappingChange = (aiSubjectId, mappingValue) => {
    setSubjectMappings(prev => ({
      ...prev,
      [aiSubjectId]: mappingValue
    }));
    
    // If mapped to existing or 'new', mark as ready for topic selection
    if (mappingValue) {
      setAiGeneratedSubjects(prev => prev.map(subj => 
        subj._id === aiSubjectId 
          ? { ...subj, isMapped: true, mappedTo: mappingValue }
          : subj
      ));
    }
  };

  // Subject addition with confirmation
  const handleAddSubjectClick = (subject) => {
    setPendingSubjectToAdd(subject);
    setIsSubjectConfirmModalOpen(true);
  };

  const confirmAddSubject = async () => {
    if (!pendingSubjectToAdd) return;
    
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add subject to the subjects list
      const newSubject = {
        _id: pendingSubjectToAdd._id,
        name: pendingSubjectToAdd.name,
        code: pendingSubjectToAdd.code,
        description: pendingSubjectToAdd.description,
        departmentId: pendingSubjectToAdd.departmentId,
        createdAt: new Date().toISOString(),
        isAIGenerated: true
      };
      
      setSubjects(prev => [...prev, newSubject]);
      
      // Mark subject as added and mapped to itself (new)
      setAiGeneratedSubjects(prev => prev.map(subj => 
        subj._id === pendingSubjectToAdd._id 
          ? { ...subj, isAdded: true, isMapped: true, mappedTo: 'new' }
          : subj
      ));
      
      // Set mapping to 'new'
      setSubjectMappings(prev => ({
        ...prev,
        [pendingSubjectToAdd._id]: 'new'
      }));
      
      toast.success(`Subject "${pendingSubjectToAdd.name}" added to department successfully!`);
      setIsSubjectConfirmModalOpen(false);
      setPendingSubjectToAdd(null);
      
    } catch (error) {
      toast.error('Failed to add subject');
    } finally {
      setIsLoading(false);
    }
  };

  // Topic selection handlers
  const toggleTopicSelection = (subjectId, topic) => {
    setSelectedTopicsForSave(prev => {
      const existingIndex = prev.findIndex(t => t._id === topic._id);
      if (existingIndex > -1) {
        return prev.filter(t => t._id !== topic._id);
      } else {
        return [...prev, { ...topic, subjectId }];
      }
    });
  };

  const isTopicSelected = (topicId) => {
    return selectedTopicsForSave.some(t => t._id === topicId);
  };

  const handleSaveSelectedTopics = async () => {
    if (selectedTopicsForSave.length === 0) {
      toast.error('Please select at least one topic to save');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 1: Create the job first
      const newJob = {
        _id: `dcsj-${Date.now()}`,
        jobTitle: newJobFormData.name,
        jobDescription: newJobFormData.description,
        company: newJobFormData.company,
        departmentId: newJobFormData.departmentId,
        classId: newJobFormData.classId,
        sectionId: newJobFormData.sectionId,
        requirements: [],
        jobPostingLink: newJobFormData.jobPostingLink || '',
        createdAt: new Date().toISOString(),
        isAIGenerated: true
      };
      
      setDepartmentClassSectionJobs(prev => [...prev, newJob]);
      
      // Count new subjects being created (only those that have been confirmed/added)
      const newSubjectsCount = aiGeneratedSubjects.filter(s => s.isAdded).length;
      
      // Step 2: Create topics with their subject assignments AND job association
      const newTopics = selectedTopicsForSave.map(topic => {
        const aiSubject = aiGeneratedSubjects.find(s => s._id === topic.subjectId);
        const mapping = subjectMappings[topic.subjectId];
        
        // Determine the actual subject ID to use
        let actualSubjectId = topic.subjectId; // Default to AI subject ID
        
        if (mapping && mapping !== 'new') {
          // Mapped to an existing subject
          actualSubjectId = mapping;
        }
        
        return {
          _id: topic._id,
          title: topic.name || topic.title,
          description: topic.description,
          departmentId: newJobFormData.departmentId,
          subjectId: actualSubjectId,
          classId: newJobFormData.classId,
          sectionIds: newJobFormData.sectionId ? [newJobFormData.sectionId] : [],
          // Note: No jobId here - topics can be assigned to multiple jobs via topicJobAssignments
          difficulty: topic.difficulty,
          estimatedTime: topic.estimatedTime,
          isActive: true,
          isAIGenerated: true,
          createdAt: new Date().toISOString()
        };
      });
      
      setTopics(prev => [...prev, ...newTopics]);
      
      // Step 3: Create topic-job assignment records
      const newAssignments = newTopics.map(topic => ({
        _id: `assign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        topicId: topic._id,
        jobId: newJob._id,
        createdAt: new Date().toISOString()
      }));
      
      setTopicJobAssignments(prev => [...prev, ...newAssignments]);
      
      // Show detailed success message
      const department = departments.find(d => d._id === newJobFormData.departmentId);
      const selectedClass = classes.find(c => c._id === newJobFormData.classId);
      const selectedSection = sections.find(s => s._id === newJobFormData.sectionId);
      
      let successMessage = `✅ Successfully created with AI:\n`;
      successMessage += `• 1 Job: "${newJobFormData.name}"\n`;
      if (newSubjectsCount > 0) {
        successMessage += `• ${newSubjectsCount} new subject${newSubjectsCount !== 1 ? 's' : ''}\n`;
      }
      successMessage += `• ${newTopics.length} topic${newTopics.length !== 1 ? 's' : ''}\n`;
      successMessage += `\nDepartment: ${department?.name || 'N/A'}`;
      if (selectedClass) {
        successMessage += `\nClass: ${selectedClass.name}`;
      }
      if (selectedSection) {
        successMessage += `\nSection: ${selectedSection.name}`;
      }
      
      toast.success(successMessage, {
        duration: 5000,
        style: {
          whiteSpace: 'pre-line'
        }
      });
      
      // Navigate to the section where topics were saved
      setJobViewDepartment(newJobFormData.departmentId);
      setJobViewClass(newJobFormData.classId);
      setJobViewSection(newJobFormData.sectionId);
      
      // Open the newly created job accordion to show the topics
      setExpandedJobs(prev => new Set([...prev, newJob._id]));
      
      // Also open "No Jobs Assigned" if there are any unassigned topics
      setIsNoJobsAccordionOpen(true);
      
      // Close the AI Generator accordion and reset
      closeAIGenerator();
      
      // Scroll to the view section after a short delay
      setTimeout(() => {
        const viewSection = document.getElementById('view-jobs-topics-section');
        if (viewSection) {
          viewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      
    } catch (error) {
      toast.error('Failed to save job and topics');
    } finally {
      setIsLoading(false);
    }
  };

  const openAIGenerator = () => {
    setIsAIGeneratorOpen(true);
    setAiPrompt('');
    setAiGeneratedTopics([]);
    setAiGeneratedSubjects([]);
    setAiSuggestions([]);
    setSelectedTopicsForSave([]);
    setSubjectMappings({});
    setNewJobFormData({
      name: '',
      description: '',
      company: '',
      departmentId: '',
      classId: '',
      sectionId: '',
      jobPostingLink: ''
    });
  };

  // Handlers for unassigned topics multi-select
  const toggleUnassignedTopicSelection = (topicId) => {
    setSelectedUnassignedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };

  const selectAllUnassignedTopics = (topicIds) => {
    setSelectedUnassignedTopics(topicIds);
  };

  const clearUnassignedTopicSelection = () => {
    setSelectedUnassignedTopics([]);
  };

  const handleAssignSelectedTopicsToJob = async (jobId) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const job = departmentClassSectionJobs.find(j => j._id === jobId);
      if (!job) {
        toast.error('Job not found');
        return;
      }
      
      // Create assignments for selected topics (only if they don't already exist)
      const newAssignments = selectedUnassignedTopics
        .filter(topicId => !topicJobAssignments.some(a => a.topicId === topicId && a.jobId === jobId))
        .map(topicId => ({
          _id: `assign-${Date.now()}-${topicId}-${Math.random().toString(36).substr(2, 9)}`,
          topicId: topicId,
          jobId: jobId,
          createdAt: new Date().toISOString()
        }));
      
      if (newAssignments.length === 0) {
        toast.info(`All selected topics are already assigned to "${job.jobTitle}"`);
      } else {
        setTopicJobAssignments(prev => [...prev, ...newAssignments]);
        toast.success(`Successfully assigned ${newAssignments.length} topic(s) to "${job.jobTitle}"`);
      }
      
      // Clear selection and close modal
      setSelectedUnassignedTopics([]);
      setIsAssignToJobModalOpen(false);
      
    } catch (error) {
      toast.error('Failed to assign topics to job');
    } finally {
      setIsLoading(false);
    }
  };

  // Manual job creation handlers
  const openManualJobModal = () => {
    setManualJobFormData({
      jobTitle: '',
      jobDescription: '',
      company: '',
      jobPostingLink: '',
      departmentId: jobViewDepartment || '',
      classId: jobViewClass || '',
      sectionId: jobViewSection || '',
      requirements: []
    });
    setIsManualJobModalOpen(true);
  };

  const closeManualJobModal = () => {
    setIsManualJobModalOpen(false);
    setManualJobFormData({
      jobTitle: '',
      jobDescription: '',
      company: '',
      jobPostingLink: '',
      departmentId: '',
      classId: '',
      sectionId: '',
      requirements: []
    });
  };

  const handleCreateManualJob = async () => {
    if (!manualJobFormData.jobTitle.trim() || !manualJobFormData.company.trim() || 
        !manualJobFormData.departmentId || !manualJobFormData.classId || !manualJobFormData.sectionId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newJob = {
        _id: `dcsj-${Date.now()}`,
        ...manualJobFormData,
        createdAt: new Date().toISOString()
      };
      
      setDepartmentClassSectionJobs(prev => [...prev, newJob]);
      
      toast.success(`Job "${manualJobFormData.jobTitle}" created successfully!`);
      closeManualJobModal();
      
    } catch (error) {
      toast.error('Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Job creation handlers (non-AI)
  const openQuickJobModal = () => {
    setQuickJobFormData({
      company: '',
      jobTitle: '',
      jobDescription: ''
    });
    setIsQuickJobModalOpen(true);
  };

  const closeQuickJobModal = () => {
    setIsQuickJobModalOpen(false);
    setQuickJobFormData({
      company: '',
      jobTitle: '',
      jobDescription: ''
    });
  };

  const handleCreateQuickJob = async () => {
    if (!quickJobFormData.company.trim() || !quickJobFormData.jobTitle.trim() || 
        !quickJobFormData.jobDescription.trim()) {
      toast.error('Please fill in company name, job title, and job description');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newJob = {
        _id: `dcsj-${Date.now()}`,
        jobTitle: quickJobFormData.jobTitle,
        jobDescription: quickJobFormData.jobDescription,
        company: quickJobFormData.company,
        departmentId: jobViewDepartment,
        classId: jobViewClass,
        sectionId: jobViewSection,
        requirements: [],
        jobPostingLink: '',
        createdAt: new Date().toISOString()
      };
      
      setDepartmentClassSectionJobs(prev => [...prev, newJob]);
      
      toast.success(`Job "${quickJobFormData.jobTitle}" created successfully!`);
      closeQuickJobModal();
      
    } catch (error) {
      toast.error('Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  // AI Topic Generation (opens the AI accordion)
  const openAITopicGenerator = () => {
    // Pre-fill the AI generator form with the selected filters
    setNewJobFormData(prev => ({
      ...prev,
      departmentId: jobViewDepartment,
      classId: jobViewClass,
      sectionId: jobViewSection
    }));
    setIsAIGeneratorOpen(true);
    
    // Scroll to AI Generator section
    setTimeout(() => {
      const aiGeneratorElement = document.getElementById('ai-generator-section');
      if (aiGeneratorElement) {
        aiGeneratorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Section toggle handlers
  const openSectionToggleModal = (departmentId, classId) => {
    setCurrentToggleDepartment(departmentId);
    setCurrentToggleClass(classId);
    setSectionToggleModalOpen(true);
  };

  const closeSectionToggleModal = () => {
    setSectionToggleModalOpen(false);
    setCurrentToggleDepartment(null);
    setCurrentToggleClass(null);
  };

  const handleToggleToSection = (newSectionId) => {
    if (!newSectionId) {
      toast.error('Please select a section');
      return;
    }

    // Update the view filters to show the selected section
    setJobViewSection(newSectionId);
    closeSectionToggleModal();
    toast.success('View updated to show selected section');
  };

  const closeAIGenerator = () => {
    setIsAIGeneratorOpen(false);
    setAiPrompt('');
    setAiGeneratedTopics([]);
    setAiGeneratedSubjects([]);
    setAiSuggestions([]);
    setSelectedTopicsForSave([]);
    setSubjectMappings({});
    setIsSubjectConfirmModalOpen(false);
    setPendingSubjectToAdd(null);
    setNewJobFormData({
      name: '',
      description: '',
      company: '',
      departmentId: '',
      classId: '',
      sectionId: '',
      jobPostingLink: ''
    });
  };

  // --- COMPUTED VALUES ---

  // Get subjects that have topics for the selected class and section
  const availableSubjects = useMemo(() => {
    if (!selectedClass || !selectedSection) return [];
    
    // Find subjects that have topics for the selected department and class
    const subjectsWithTopics = topics
      .filter(topic => 
        topic.departmentId === selectedClass && 
        topic.classId === selectedSection
      )
      .map(topic => topic.subjectId);
    
    const uniqueSubjectIds = [...new Set(subjectsWithTopics)];
    return subjects.filter(subject => uniqueSubjectIds.includes(subject._id));
  }, [topics, selectedClass, selectedSection, subjects]);

  const filteredTopics = useMemo(() => {
    let filtered = topics;
    
    // Apply filters in order: Department → Class → Section → Subject
    // Note: selectedClass is actually department in the dropdown
    if (selectedClass) {
      filtered = filtered.filter(topic => topic.departmentId === selectedClass);
    }
    // selectedSection is actually class in the dropdown
    if (selectedSection) {
      filtered = filtered.filter(topic => topic.classId === selectedSection);
    }
    // selectedSubject is actually section in the dropdown
    if (selectedSubject) {
      filtered = filtered.filter(topic => topic.sectionIds?.includes(selectedSubject));
    }
    if (searchTerm) {
      filtered = filtered.filter(topic => 
        (topic.name || topic.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (topic.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [topics, selectedClass, selectedSection, selectedSubject, searchTerm]);

  const sortedTopics = useMemo(() => {
    const sorted = [...filteredTopics];
    
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || ''));
      case 'subject':
        return sorted.sort((a, b) => {
          const subjectA = subjects.find(s => s._id === a.subjectId);
          const subjectB = subjects.find(s => s._id === b.subjectId);
          return (subjectA?.name || '').localeCompare(subjectB?.name || '');
        });
      case 'class':
        return sorted.sort((a, b) => {
          const classA = classes.find(c => c._id === a.classId);
          const classB = classes.find(c => c._id === b.classId);
          return (classA?.name || '').localeCompare(classB?.name || '');
        });
      case 'sectionsCount':
        return sorted.sort((a, b) => (b.sectionIds?.length || 0) - (a.sectionIds?.length || 0));
      default:
        return sorted;
    }
  }, [filteredTopics, sortBy, subjects, classes]);

  // --- EFFECTS ---

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- STYLES ---
  const inputBaseClass = "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none";
  const btnBaseClass = "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;
  const btnTealClass = `${btnBaseClass} bg-teal-500 hover:bg-teal-600 text-white`;

  // --- NAVIGATION HANDLER ---
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <LoaderOverlay isVisible={isLoading || isGenerating} title="MySkillDB" subtitle={isGenerating ? "AI is generating topics..." : "Loading your data, please wait…"} />
      
      {/* Navigation Component */}
      {!isTopicModalOpen && !isAIGeneratorOpen && !isJobAssignmentModalOpen && !isJobViewModalOpen && !isBulkJobAssignmentModalOpen && <OrgMenuNavigation currentPage="topic-management" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isTopicModalOpen || isAIGeneratorOpen || isJobAssignmentModalOpen || isJobViewModalOpen || isBulkJobAssignmentModalOpen ? "flex-1 flex flex-col" : "lg:ml-72 flex-1 flex flex-col"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex flex-col items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Topic Generator</h1>
              <p className="text-slate-500 text-sm">Add or refine topics to your subjects based on jobs</p>
            </div>
          </header>

          {/* Quick Stats - Simplified */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="bg-blue-100 p-2 md:p-4 rounded-full flex-shrink-0">
                <i className="fas fa-tags text-lg md:text-2xl text-blue-500"></i>
              </div>
              <div className="min-w-0 flex-1 text-center md:text-left">
                <p className="text-slate-500 text-xs md:text-base truncate hidden md:block">Total Topics</p>
                <p className="text-lg md:text-3xl font-bold text-slate-900">{topics.length}</p>
                <p className="text-xs md:text-sm text-slate-400 hidden md:block">exist in the system</p>
              </div>
            </div>

            <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="bg-purple-100 p-2 md:p-4 rounded-full flex-shrink-0">
                <i className="fas fa-robot text-lg md:text-2xl text-purple-500"></i>
              </div>
              <div className="min-w-0 flex-1 text-center md:text-left">
                <p className="text-slate-500 text-xs md:text-base truncate hidden md:block">JD to Skill Mapping</p>
                <p className="text-lg md:text-3xl font-bold text-slate-900">1,247</p>
                <p className="text-xs md:text-sm text-slate-400 hidden md:block">AI tokens remaining</p>
              </div>
            </div>

            <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="bg-orange-100 p-2 md:p-4 rounded-full flex-shrink-0">
                <i className="fas fa-clock text-lg md:text-2xl text-orange-500"></i>
              </div>
              <div className="min-w-0 flex-1 text-center md:text-left">
                <p className="text-slate-500 text-xs md:text-base truncate hidden md:block">Pending Topic Requests</p>
                <p className="text-lg md:text-3xl font-bold text-slate-900">23</p>
                <p className="text-xs md:text-sm text-slate-400 hidden md:block">awaiting approval</p>
              </div>
            </div>
          </div>

          {/* AI Mapping Button */}
          {/* AI Generator Accordion */}
          <div id="ai-generator-section" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <button
              onClick={() => setIsAIGeneratorOpen(!isAIGeneratorOpen)}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold px-4 md:px-6 py-3 md:py-4 flex items-center justify-between transition-all duration-200 relative"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <i className="fas fa-robot text-base md:text-lg"></i>
                <span className="text-sm md:text-base">Job Description to Topic Mapping</span>
                <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  AI
                </span>
              </div>
              <i className={`fas fa-chevron-${isAIGeneratorOpen ? 'up' : 'down'} transition-transform duration-200`}></i>
              </button>
            
            {isAIGeneratorOpen && (
              <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-50">
                {/* Step 1: Job Input Form */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 md:p-6 border border-blue-200">
                  <h4 className="text-sm md:text-base font-semibold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                    <span>Enter Job Details</span>
                  </h4>
                  
                  <div className="space-y-3 md:space-y-4">
              <div>
                      <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">
                        Department *
                      </label>
                <select
                        value={newJobFormData.departmentId}
                        onChange={(e) => setNewJobFormData(prev => ({ 
                          ...prev, 
                          departmentId: e.target.value,
                          classId: '',
                          sectionId: ''
                        }))}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>

                    {newJobFormData.departmentId && (
              <div>
                        <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">
                          Class/Grade *
                        </label>
                <select
                          value={newJobFormData.classId}
                          onChange={(e) => setNewJobFormData(prev => ({ 
                            ...prev, 
                            classId: e.target.value,
                            sectionId: ''
                          }))}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        >
                          <option value="">Select Class</option>
                          {classes.filter(c => c.departmentId === newJobFormData.departmentId).map(cls => (
                            <option key={cls._id} value={cls._id}>{cls.name}</option>
                          ))}
                </select>
              </div>
                    )}
                    
                    {newJobFormData.classId && (
              <div>
                        <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">
                          Section/Batch *
                        </label>
                <select
                          value={newJobFormData.sectionId}
                          onChange={(e) => setNewJobFormData(prev => ({ ...prev, sectionId: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        >
                          <option value="">Select Section</option>
                          {sections.filter(s => s.classId === newJobFormData.classId).map(section => (
                            <option key={section._id} value={section._id}>{section.name}</option>
                  ))}
                </select>
              </div>
                    )}

                    {/* Job Details Section - Shows after section is selected */}
                    {newJobFormData.sectionId && (
                      <>
                        <div className="col-span-full border-t border-slate-300 pt-4 mt-2">
                          <h5 className="text-xs md:text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <i className="fas fa-briefcase text-purple-600"></i>
                            <span>Job Details</span>
                          </h5>
                        </div>

                        <div>
                          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            value={newJobFormData.company}
                            onChange={(e) => setNewJobFormData(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="e.g., TechCorp Solutions, Google, Microsoft"
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">
                            Job Title *
                          </label>
                          <input
                            type="text"
                            value={newJobFormData.name}
                            onChange={(e) => setNewJobFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Frontend Developer"
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5">
                            Link to Job Posting
                          </label>
                          <input
                            type="url"
                            value={newJobFormData.jobPostingLink}
                            onChange={(e) => setNewJobFormData(prev => ({ ...prev, jobPostingLink: e.target.value }))}
                            placeholder="e.g., https://company.com/careers/job-id"
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                          />
                        </div>

                        {/* AI-Highlighted Job Description */}
                        <div className="col-span-full bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg p-4 shadow-sm">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-purple-600 text-white rounded-full p-2 flex-shrink-0">
                              <i className="fas fa-robot text-sm"></i>
                            </div>
                            <div className="flex-1">
                              <h5 className="text-xs md:text-sm font-bold text-purple-900 mb-1 flex items-center gap-2">
                                <span>AI-Powered Analysis</span>
                                <span className="bg-yellow-400 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-full">AI</span>
                              </h5>
                              <p className="text-xs text-purple-700">
                                Our AI will analyze this job description to generate relevant subjects and topics
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-purple-900 mb-2">
                              <i className="fas fa-file-alt mr-2 text-xs"></i>
                              <span>Job Description & Requirements *</span>
                            </label>
                            <textarea
                              value={newJobFormData.description}
                              onChange={(e) => setNewJobFormData(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Paste the complete job description here including responsibilities, requirements, and qualifications..."
                              className="w-full p-3 bg-white border-2 border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none shadow-inner"
                              rows={6}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex justify-center pt-2">
                <button
                        onClick={generateTopicsWithAI}
                        disabled={!newJobFormData.name.trim() || !newJobFormData.description.trim() || !newJobFormData.company.trim() || !newJobFormData.departmentId || !newJobFormData.classId || !newJobFormData.sectionId || isGenerating}
                        className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold px-6 md:px-8 py-2.5 md:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base disabled:transform-none"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-robot"></i>
                            <span>Generate with AI</span>
                          </>
                        )}
                </button>
              </div>
              </div>
            </div>

                {/* Step 2: AI Generated Subjects with Topics */}
                {aiGeneratedSubjects.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 md:p-6 border border-green-200">
                    <h4 className="text-sm md:text-base font-semibold text-slate-900 mb-3 md:mb-4 flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                      <span className="flex-1 min-w-0">AI Generated Subjects & Topics</span>
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full whitespace-nowrap">
                        <i className="fas fa-robot mr-1"></i>
                        Gemini AI
                      </span>
                    </h4>
                    
                    <div className="space-y-3 md:space-y-4">
                      {aiGeneratedSubjects.map((subject) => {
                        const existingSubjects = subjects.filter(s => s.departmentId === newJobFormData.departmentId);
                        const currentMapping = subjectMappings[subject._id] || '';
                        const isMapped = subject.isMapped || false;
                        
                  return (
                          <div key={subject._id} className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
                            {/* Subject Header */}
                            <div className={`p-3 md:p-4 ${isMapped ? 'bg-green-50 border-b-2 border-green-200' : 'bg-slate-50 border-b-2 border-slate-200'}`}>
                              <div className="space-y-2 md:space-y-3">
                                <div className="flex items-start justify-between gap-2 md:gap-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      <h5 className="font-bold text-slate-900 text-sm md:text-base">{subject.name}</h5>
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{subject.code}</span>
                                      {isMapped && currentMapping === 'new' && (
                                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1">
                                          <i className="fas fa-check text-xs"></i>
                                          New Subject
                                        </span>
                                      )}
                                      {isMapped && currentMapping !== 'new' && (
                                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded flex items-center gap-1">
                                          <i className="fas fa-link text-xs"></i>
                                          Mapped to Existing
                                        </span>
                                      )}
                    </div>
                                    <p className="text-xs md:text-sm text-slate-600 leading-tight">{subject.description}</p>
                                  </div>
                                </div>
                                
                                {/* Subject Mapping Options */}
                                {!isMapped && (
                                  <div className="space-y-2 pt-2 border-t border-slate-200">
                                    <label className="block text-xs md:text-sm font-medium text-slate-700">
                                      <i className="fas fa-map-marker-alt mr-1 text-indigo-600 text-xs"></i>
                                      Choose where to save these topics:
                                    </label>
                                    <div className="flex flex-col md:flex-row gap-2">
                <select
                                        value={currentMapping}
                                        onChange={(e) => handleSubjectMappingChange(subject._id, e.target.value)}
                                        className="flex-1 p-2.5 bg-white border border-slate-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                      >
                                        <option value="">Select an option...</option>
                                        <optgroup label="Create New Subject">
                                          <option value="new">➕ Create as New Subject "{subject.name}"</option>
                                        </optgroup>
                                        {existingSubjects.length > 0 && (
                                          <optgroup label="Use Existing Subject">
                                            {existingSubjects.map(existing => (
                                              <option key={existing._id} value={existing._id}>
                                                🔗 Add to "{existing.name}" ({existing.code})
                                              </option>
                                            ))}
                                          </optgroup>
                                        )}
                </select>
                                      {currentMapping === 'new' && (
                                        <button
                                          onClick={() => handleAddSubjectClick(subject)}
                                          className="w-full md:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                                        >
                                          <i className="fas fa-check"></i>
                                          Confirm
                                        </button>
                                      )}
              </div>
                                    {currentMapping && currentMapping !== 'new' && (
                                      <div className="bg-blue-50 border border-blue-200 rounded p-2 flex items-start gap-2">
                                        <i className="fas fa-info-circle text-blue-600 mt-0.5 text-xs md:text-sm flex-shrink-0"></i>
                                        <p className="text-xs text-blue-800">
                                          Topics will be added to <span className="font-semibold">{existingSubjects.find(s => s._id === currentMapping)?.name}</span>
                                        </p>
              </div>
                                    )}
                            </div>
                                )}
            </div>
          </div>

                            {/* Topics List */}
                            <div className="p-3 md:p-4">
                              <p className="text-xs text-slate-600 mb-3 font-medium">
                                <i className="fas fa-lightbulb text-yellow-500 mr-1"></i>
                                Topics in this subject ({subject.topics.length}):
                              </p>
                          <div className="space-y-2">
                                {subject.topics.map((topic) => {
                                  const selected = isTopicSelected(topic._id);
                                  const canSelect = isMapped;
                                  
                  return (
                                    <div 
                                      key={topic._id} 
                                      className={`p-3 rounded-lg border-2 transition-all ${
                                        selected 
                                          ? 'border-purple-500 bg-purple-50' 
                                          : canSelect
                                          ? 'border-slate-200 bg-slate-50 hover:border-purple-300 cursor-pointer'
                                          : 'border-slate-200 bg-slate-100 opacity-60'
                                      }`}
                                      onClick={() => canSelect && toggleTopicSelection(subject._id, topic)}
                                    >
                                      <div className="flex items-start gap-2 md:gap-3">
                                        <input
                                          type="checkbox"
                                          checked={selected}
                                          onChange={() => canSelect && toggleTopicSelection(subject._id, topic)}
                                          disabled={!canSelect}
                                          className="mt-1 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <h6 className="font-semibold text-slate-900 text-xs md:text-sm mb-1 leading-tight">{topic.name || topic.title}</h6>
                                          <p className="text-xs text-slate-600 mb-2 line-clamp-2">{topic.description}</p>
                                          <div className="flex flex-wrap gap-2 text-xs">
                                            <span className={`px-2 py-1 rounded-full ${
                                              topic.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                              topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                              topic.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                                              'bg-red-100 text-red-800'
                                            }`}>
                                              {topic.difficulty}
                                  </span>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                              {topic.estimatedTime}
                                  </span>
                              </div>
                            </div>
                          </div>
                                      {!canSelect && (
                                        <p className="text-xs text-orange-600 mt-2 italic ml-6 md:ml-8">
                                          <i className="fas fa-info-circle mr-1"></i>
                                          Choose subject mapping first
                                        </p>
                                      )}
                    </div>
                  );
                                })}
                        </div>
                    </div>
                  </div>
                );
                      })}
                    </div>
            </div>
          )}

                {/* Step 3: Save Selected Topics */}
                {aiGeneratedSubjects.length > 0 && selectedTopicsForSave.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 md:p-6 border border-purple-200">
                    <h4 className="text-sm md:text-base font-semibold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                      <span>Selected Topics ({selectedTopicsForSave.length})</span>
                    </h4>
                    
                    <div className="mb-3 md:mb-4 max-h-60 overflow-y-auto space-y-2">
                      {selectedTopicsForSave.map((topic) => {
                        const aiSubject = aiGeneratedSubjects.find(s => s._id === topic.subjectId);
                        const mapping = subjectMappings[topic.subjectId];
                        
                        // Determine the actual subject name to display
                        let displaySubjectName = aiSubject?.name || 'Unknown';
                        let subjectIcon = 'plus-circle';
                        
                        if (mapping && mapping !== 'new') {
                          const existingSubject = subjects.find(s => s._id === mapping);
                          displaySubjectName = existingSubject?.name || displaySubjectName;
                          subjectIcon = 'link';
                }
                
                return (
                          <div key={topic._id} className="bg-white p-3 rounded border border-purple-200 flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs md:text-sm text-slate-900 truncate leading-tight">{topic.name || topic.title}</p>
                              <p className="text-xs text-slate-600 flex items-center gap-1 truncate mt-0.5">
                                <i className={`fas fa-${subjectIcon} text-purple-600 flex-shrink-0 text-xs`}></i>
                                <span className="truncate">{displaySubjectName}</span>
                              </p>
                            </div>
                <button
                              onClick={() => toggleTopicSelection(topic.subjectId, topic)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded flex-shrink-0"
                >
                              <i className="fas fa-times text-sm"></i>
                </button>
                          </div>
                        );
                      })}
                    </div>
                    
                <button
                      onClick={handleSaveSelectedTopics}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:transform-none text-sm md:text-base"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          <span>Save {selectedTopicsForSave.length} Topic{selectedTopicsForSave.length !== 1 ? 's' : ''}</span>
                        </>
                      )}
                </button>
                            </div>
                )}
              </div>
            )}
                          </div>
                          
          {/* Action Buttons Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
            <div className="text-center">
              <h2 className="text-base md:text-lg font-bold text-slate-900 mb-2">Quick Actions</h2>
              <p className="text-xs md:text-sm text-slate-600 mb-4">
                Manually create jobs and topics for your organization
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
                <button
                  onClick={openManualJobModal}
                  className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-xs md:text-sm shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-briefcase"></i>
                  <span>Add Job</span>
                </button>
                <button
                  onClick={() => {
                    // Pre-fill the topic form with selected filters if available
                    setTopicFormData(prev => ({
                      ...prev,
                      departmentId: jobViewDepartment || '',
                      classId: jobViewClass || '',
                      sectionIds: jobViewSection ? [jobViewSection] : []
                    }));
                    openTopicModal();
                  }}
                  className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-xs md:text-sm shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-plus"></i>
                  <span>Add Topic</span>
                </button>
              </div>
            </div>
          </div>

          {/* Job View Section */}
          <div id="view-jobs-topics-section" className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
            <div className="text-center mb-6">
              <h2 className="text-base md:text-lg font-bold text-slate-900 mb-2">View Jobs & Topics</h2>
              <p className="text-xs md:text-sm text-slate-600">
                Select department, class, and section to view all jobs and their associated topics
              </p>
                            </div>
                            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                            <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Department *</label>
                <select
                  value={jobViewDepartment}
                  onChange={(e) => {
                    setJobViewDepartment(e.target.value);
                    setJobViewClass('');
                    setJobViewSection('');
                  }}
                  className="w-full p-2.5 md:p-3 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
                          </div>
                          
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Class/Grade *</label>
                <select
                  value={jobViewClass}
                  onChange={(e) => {
                    setJobViewClass(e.target.value);
                    setJobViewSection('');
                  }}
                  disabled={!jobViewDepartment}
                  className="w-full p-2.5 md:p-3 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Class</option>
                  {jobViewDepartment && classes.filter(c => c.departmentId === jobViewDepartment).map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
                          </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Section/Batch *</label>
                <select
                  value={jobViewSection}
                  onChange={(e) => setJobViewSection(e.target.value)}
                  disabled={!jobViewClass}
                  className="w-full p-2.5 md:p-3 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Section</option>
                  {jobViewClass && sections.filter(s => s.classId === jobViewClass).map(section => (
                    <option key={section._id} value={section._id}>{section.name}</option>
                  ))}
                </select>
                    </div>
                  </div>

            {/* Jobs Display */}
            {jobViewDepartment && jobViewClass && jobViewSection && (
              <div className="space-y-4">
                {(() => {
                  // Get jobs for selected filters
                  const filteredJobs = departmentClassSectionJobs.filter(job => 
                    job.departmentId === jobViewDepartment && 
                    job.classId === jobViewClass && 
                    job.sectionId === jobViewSection
                  );
                  
                  // Get topics with job assignments for this selection
                  const topicsWithJobs = topics.filter(t => 
                    t.departmentId === jobViewDepartment && 
                    t.classId === jobViewClass && 
                    t.sectionIds?.includes(jobViewSection) &&
                    topicJobAssignments.some(a => a.topicId === t._id)
                  );
                  
                  // Get topics without job assignments
                  const topicsWithoutJobs = topics.filter(t => 
                    t.departmentId === jobViewDepartment && 
                    t.classId === jobViewClass && 
                    t.sectionIds?.includes(jobViewSection) &&
                    !topicJobAssignments.some(a => a.topicId === t._id)
                  );

                  return (
                    <>
                      {/* Jobs Accordions */}
                      {filteredJobs.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-lg">
                          <i className="fas fa-briefcase text-4xl text-slate-300 mb-3"></i>
                          <p className="text-slate-600 text-sm mb-4">No jobs found for this selection</p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                              onClick={openQuickJobModal}
                              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
                            >
                              <i className="fas fa-plus-circle"></i>
                              <span>Create Job</span>
                            </button>
                            <button
                              onClick={openAITopicGenerator}
                              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
                            >
                              <i className="fas fa-robot"></i>
                              <span>Create Job & Topics with AI</span>
                              <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-0.5 rounded-full">AI</span>
                            </button>
                          </div>
            </div>
            ) : (
                        <div className="space-y-3">
                          {filteredJobs.map(job => {
                            const isExpanded = expandedJobs.has(job._id);
                            
                            // Get topics assigned to this job
                            const jobTopics = topicJobAssignments
                              .filter(a => a.jobId === job._id)
                              .map(a => topics.find(t => t._id === a.topicId))
                              .filter(Boolean);
                            
                            // Group topics by subject
                            const topicsBySubject = jobTopics.reduce((acc, topic) => {
                              const subjectId = topic.subjectId;
                              if (!acc[subjectId]) {
                                acc[subjectId] = [];
                              }
                              acc[subjectId].push(topic);
                              return acc;
                            }, {});
                  
                  return (
                              <div key={job._id} className="border border-slate-200 rounded-lg overflow-hidden">
                                {/* Job Header */}
                <button
                                  onClick={() => {
                                    const newExpanded = new Set(expandedJobs);
                                    if (isExpanded) {
                                      newExpanded.delete(job._id);
                                    } else {
                                      newExpanded.add(job._id);
                                    }
                                    setExpandedJobs(newExpanded);
                                  }}
                                  className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 p-4 flex items-center justify-between transition-colors"
                                >
                                  <div className="flex items-start gap-3 flex-1 text-left">
                                    <i className="fas fa-briefcase text-blue-600 text-lg mt-0.5"></i>
                        <div className="flex-1 min-w-0">
                                      <h3 className="font-bold text-slate-900 text-sm md:text-base mb-1">{job.jobTitle}</h3>
                                      <p className="text-xs md:text-sm text-slate-600 mb-1">{job.company}</p>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {job.jobPostingLink && (
                                          <>
                                            <a
                                              href={job.jobPostingLink}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={(e) => e.stopPropagation()}
                                              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
                                            >
                                              <i className="fas fa-external-link-alt text-[10px]"></i>
                                              Job Posting
                                            </a>
                                            <span className="text-slate-300">•</span>
                                          </>
                                        )}
                                        <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                          <i className="fas fa-book-open text-[10px]"></i>
                                          {jobTopics.length} topic{jobTopics.length !== 1 ? 's' : ''}
                                        </span>
                          </div>
                        </div>
                </div>
                                  <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-slate-400 ml-3 flex-shrink-0`}></i>
                </button>

                                {/* Job Content */}
                                {isExpanded && (
                                  <div className="p-4 bg-white space-y-4">
                                    {/* Section/Batch Clickable Button */}
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs md:text-sm font-medium text-slate-700">Section/Batch:</span>
                                      <button
                                        onClick={() => openSectionToggleModal(job.departmentId, job.classId)}
                                        className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs md:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                                      >
                                        <i className="fas fa-users text-xs"></i>
                                        {sections.find(s => s._id === job.sectionId)?.name || 'Unknown'}
                                        <i className="fas fa-exchange-alt text-xs ml-auto"></i>
                                      </button>
                                    </div>

                                    {/* Job Description - Collapsible */}
                                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                                      <button
                                        onClick={() => {
                                          const newExpanded = new Set(expandedJobDescriptions);
                                          if (newExpanded.has(job._id)) {
                                            newExpanded.delete(job._id);
                                          } else {
                                            newExpanded.add(job._id);
                                          }
                                          setExpandedJobDescriptions(newExpanded);
                                        }}
                                        className="w-full px-3 py-2 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between text-left"
                                      >
                                        <span className="text-xs md:text-sm font-semibold text-slate-700">
                                          <i className="fas fa-file-alt text-slate-500 mr-2"></i>
                                          Job Description
                                        </span>
                                        <i className={`fas fa-chevron-${expandedJobDescriptions.has(job._id) ? 'up' : 'down'} text-slate-400 text-xs`}></i>
                                      </button>
                                      
                                      {expandedJobDescriptions.has(job._id) && (
                                        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200">
                                          <p className="text-[11px] md:text-xs text-slate-700 leading-relaxed text-left">
                                            {job.jobDescription}
                                          </p>
                                        </div>
                                      )}
              </div>

                                    {/* Subjects & Topics */}
                                    {Object.keys(topicsBySubject).length === 0 ? (
                                      <p className="text-sm text-slate-500 italic text-center py-4">No topics assigned to this job yet</p>
                                    ) : (
                                      <div className="space-y-4">
                                        {Object.entries(topicsBySubject).map(([subjectId, subjectTopics]) => {
                                          const subject = subjects.find(s => s._id === subjectId);
                  
                  return (
                                            <div key={subjectId} className="border border-slate-200 rounded-lg p-3 md:p-4">
                                              <div className="flex items-center gap-2 mb-3">
                                                <i className="fas fa-book text-indigo-600 text-sm"></i>
                                                <h4 className="font-semibold text-slate-900 text-sm md:text-base">
                                                  {subject?.name || 'Unknown Subject'}
                                                </h4>
                                                <span className="text-xs text-slate-500">({subject?.code})</span>
                          </div>
                                              
                                              {/* Horizontal Scrollable Topics */}
                                              <div className="overflow-x-auto pb-2">
                                                <div className="flex gap-3 min-w-max">
                                                  {subjectTopics.map(topic => (
                                                    <div 
                                                      key={topic._id} 
                                                      className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3 min-w-[180px] md:min-w-[200px] flex-shrink-0"
                                                    >
                                                      <h5 className="font-semibold text-slate-900 text-xs md:text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                                                        {topic.name || topic.title}
                                                      </h5>
                                                      <div className="flex items-center gap-1 mb-3">
                                                        <i className="fas fa-clock text-blue-600 text-xs"></i>
                                                        <span className="text-xs text-slate-700 font-medium">{topic.estimatedTime}</span>
                        </div>
                                                      <div className="flex gap-2">
                <button
                                                          onClick={() => {
                                                            setViewingTopic(topic);
                                                            setIsTopicViewModalOpen(true);
                                                          }}
                                                          className="flex-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex items-center justify-center gap-1"
                                                        >
                                                          <i className="fas fa-eye text-[10px]"></i>
                                                          <span>View</span>
                </button>
                <button
                            onClick={() => openTopicModal(topic)}
                                                          className="flex-1 px-2 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition-colors flex items-center justify-center gap-1"
                >
                                                          <i className="fas fa-edit text-[10px]"></i>
                                                          <span>Edit</span>
                </button>
              </div>
            </div>
                                                  ))}
                </div>
              </div>
                        </div>
                                          );
                                        })}
                          </div>
                        )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* No Jobs Assigned Accordion */}
                      {topicsWithoutJobs.length > 0 && (
                        <div className="mt-6 border border-orange-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setIsNoJobsAccordionOpen(!isNoJobsAccordionOpen)}
                            className="w-full bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 p-4 flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-start gap-3 flex-1 text-left">
                              <i className="fas fa-exclamation-triangle text-orange-600 text-lg mt-0.5"></i>
                        <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 text-sm md:text-base mb-1">No Jobs Assigned</h3>
                                <p className="text-xs md:text-sm text-slate-600 mb-1">Topics not connected to any job</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-orange-600 font-medium flex items-center gap-1">
                                    <i className="fas fa-book-open text-[10px]"></i>
                                    {topicsWithoutJobs.length} topic{topicsWithoutJobs.length !== 1 ? 's' : ''} need assignment
                            </span>
                          </div>
                        </div>
                            </div>
                            <i className={`fas fa-chevron-${isNoJobsAccordionOpen ? 'up' : 'down'} text-slate-400 ml-3 flex-shrink-0`}></i>
                          </button>

                          {isNoJobsAccordionOpen && (
                            <div className="p-4 bg-white space-y-4">
                              {/* Info Banner */}
                              <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-l-4 border-orange-500 rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                  <i className="fas fa-info-circle text-orange-600 text-xl mt-0.5 flex-shrink-0"></i>
                                  <div className="flex-1">
                                    <h4 className="text-sm md:text-base font-bold text-orange-900 mb-1">Action Required</h4>
                                    <p className="text-xs md:text-sm text-orange-800 leading-relaxed">
                                      Reverify your subjects and topics to assign them to a job. These topics are currently not connected to any job posting.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Selection Controls */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                                <div className="text-xs md:text-sm text-slate-600">
                                  {selectedUnassignedTopics.length > 0 ? (
                                    <span className="font-semibold text-orange-600">
                                      {selectedUnassignedTopics.length} topic{selectedUnassignedTopics.length !== 1 ? 's' : ''} selected
                                    </span>
                                  ) : (
                                    <span>Select topics to assign to a job</span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                          <button
                                    onClick={() => selectAllUnassignedTopics(topicsWithoutJobs.map(t => t._id))}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                          >
                                    Select All
                          </button>
                          <button
                                    onClick={clearUnassignedTopicSelection}
                                    disabled={selectedUnassignedTopics.length === 0}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Clear
                          </button>
                                  {selectedUnassignedTopics.length > 0 && (
                          <button
                                      onClick={() => setIsAssignToJobModalOpen(true)}
                                      className="px-3 py-1.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                          >
                                      <i className="fas fa-link"></i>
                                      <span>Assign to Job</span>
                          </button>
                                  )}
                        </div>
                      </div>

                              {(() => {
                                // Group topics by subject
                                const topicsBySubject = topicsWithoutJobs.reduce((acc, topic) => {
                                  const subjectId = topic.subjectId;
                                  if (!acc[subjectId]) {
                                    acc[subjectId] = [];
                                  }
                                  acc[subjectId].push(topic);
                                  return acc;
                                }, {});

                                return Object.entries(topicsBySubject).map(([subjectId, subjectTopics]) => {
                                  const subject = subjects.find(s => s._id === subjectId);
                                  
                                  return (
                                    <div key={subjectId} className="border border-slate-200 rounded-lg p-3 md:p-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-book text-indigo-600 text-sm"></i>
                                        <h4 className="font-semibold text-slate-900 text-sm md:text-base">
                                          {subject?.name || 'Unknown Subject'}
                                        </h4>
                                        <span className="text-xs text-slate-500">({subject?.code})</span>
                                        <span className="ml-auto bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                          {subjectTopics.length} topic{subjectTopics.length !== 1 ? 's' : ''}
                                        </span>
                        </div>
                                      
                                      {/* Horizontal Scrollable Topics */}
                                      <div className="overflow-x-auto pb-2">
                                        <div className="flex gap-3 min-w-max">
                                          {subjectTopics.map(topic => {
                                            const isSelected = selectedUnassignedTopics.includes(topic._id);
                                            return (
                                              <div 
                                                key={topic._id} 
                                                onClick={() => toggleUnassignedTopicSelection(topic._id)}
                                                className={`relative rounded-lg p-3 min-w-[180px] md:min-w-[200px] flex-shrink-0 cursor-pointer transition-all ${
                                                  isSelected 
                                                    ? 'bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-500 shadow-md' 
                                                    : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-300 hover:border-orange-400'
                                                }`}
                                              >
                                                {/* Checkbox */}
                                                <div className="absolute top-2 right-2">
                                                  <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleUnassignedTopicSelection(topic._id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                                  />
                        </div>
                                                
                                                <h5 className="font-semibold text-slate-900 text-xs md:text-sm mb-2 line-clamp-2 min-h-[2.5rem] pr-6">
                                                  {topic.name || topic.title}
                                                </h5>
                                                <div className="flex items-center gap-1 mb-3">
                                                  <i className="fas fa-clock text-orange-600 text-xs"></i>
                                                  <span className="text-xs text-slate-700 font-medium">{topic.estimatedTime}</span>
                        </div>
                                                <div className="flex gap-2">
                          <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setViewingTopic(topic);
                                                      setIsTopicViewModalOpen(true);
                                                    }}
                                                    className="flex-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex items-center justify-center gap-1"
                                                  >
                                                    <i className="fas fa-eye text-[10px]"></i>
                                                    <span>View</span>
                                                  </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    openTopicModal(topic, true);
                                                  }}
                                                  className="flex-1 px-2 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition-colors flex items-center justify-center gap-1"
                                                >
                                                  <i className="fas fa-edit text-[10px]"></i>
                                                  <span>Edit</span>
                                                </button>
                        </div>
                      </div>
                                            );
                                          })}
                        </div>
                      </div>
                    </div>
                  );
                                });
                              })()}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="px-4 md:px-8 py-4">
            <p className="text-center text-xs md:text-sm text-slate-500">
              © 2024 MySkillDB. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Topic Modal */}
      {isTopicModalOpen && (
        <TopicModal
          isOpen={isTopicModalOpen}
          onClose={closeTopicModal}
          onSubmit={handleCreateTopic}
          formData={topicFormData}
          setFormData={setTopicFormData}
          subjects={subjects}
          classes={classes}
          sections={sections}
          departments={departments}
          jobs={departmentClassSectionJobs}
          editingTopic={editingTopic}
          isLoading={isLoading}
          inputBaseClass={inputBaseClass}
          btnIndigoClass={btnIndigoClass}
          btnSlateClass={btnSlateClass}
          onDelete={handleDeleteTopic}
          hideJobSelection={isEditingUnassignedTopic}
        />
      )}

      {/* Topic View Modal */}
      {isTopicViewModalOpen && viewingTopic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-4 md:px-6 py-4 border-b border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900">{viewingTopic.name || viewingTopic.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      viewingTopic.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      viewingTopic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      viewingTopic.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {viewingTopic.difficulty}
                    </span>
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <i className="fas fa-clock text-blue-600"></i>
                      {viewingTopic.estimatedTime}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsTopicViewModalOpen(false);
                    setViewingTopic(null);
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors flex-shrink-0"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
              {/* Description */}
                <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <i className="fas fa-align-left text-indigo-600"></i>
                  Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">{viewingTopic.description}</p>
                </div>
                
              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Department</p>
                  <p className="text-sm font-medium text-slate-900">
                    {departments.find(d => d._id === viewingTopic.departmentId)?.name || 'Unknown'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Class</p>
                  <p className="text-sm font-medium text-slate-900">
                    {classes.find(c => c._id === viewingTopic.classId)?.name || 'Unknown'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Subject</p>
                  <p className="text-sm font-medium text-slate-900">
                    {subjects.find(s => s._id === viewingTopic.subjectId)?.name || 'Unknown'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Sections</p>
                  <p className="text-sm font-medium text-slate-900">
                    {viewingTopic.sectionIds?.length || 0} section{viewingTopic.sectionIds?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setIsTopicViewModalOpen(false);
                    openTopicModal(viewingTopic);
                  }}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-edit"></i>
                  Edit Topic
                </button>
                <button
                  onClick={() => {
                    setIsTopicViewModalOpen(false);
                    setViewingTopic(null);
                  }}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Confirmation Modal */}
      {isSubjectConfirmModalOpen && pendingSubjectToAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-3 py-2.5 sm:p-6 border-b border-slate-200">
              <h3 className="text-sm sm:text-xl font-bold text-slate-900 leading-tight">Confirm Subject Addition</h3>
              <p className="text-slate-500 text-[10px] sm:text-sm mt-0.5 sm:mt-1">Review existing subjects before adding</p>
            </div>
            
            <div className="p-3 sm:p-6 space-y-2.5 sm:space-y-4">
              {/* New Subject Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-4">
                <h4 className="font-semibold text-xs sm:text-base text-slate-900 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                  <i className="fas fa-plus-circle text-blue-600 text-xs sm:text-base"></i>
                  <span className="text-xs sm:text-base">Subject to be Added</span>
                  </h4>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-[11px] sm:text-sm leading-tight"><span className="font-medium">Name:</span> {pendingSubjectToAdd.name}</p>
                  <p className="text-[11px] sm:text-sm leading-tight"><span className="font-medium">Code:</span> {pendingSubjectToAdd.code}</p>
                  <p className="text-[11px] sm:text-sm leading-tight"><span className="font-medium">Description:</span> {pendingSubjectToAdd.description}</p>
                  <p className="text-[11px] sm:text-sm leading-tight"><span className="font-medium">Topics:</span> {pendingSubjectToAdd.topics?.length || 0} topics</p>
                            </div>
                          </div>
              
              {/* Existing Subjects Warning */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 sm:p-4">
                <h4 className="font-semibold text-xs sm:text-base text-slate-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <i className="fas fa-exclamation-triangle text-orange-600 flex-shrink-0 text-xs sm:text-base"></i>
                  <span className="line-clamp-1 text-xs sm:text-base">Existing Subjects in Department</span>
                </h4>
                {(() => {
                  const existingSubjects = subjects.filter(s => s.departmentId === newJobFormData.departmentId);
                  if (existingSubjects.length === 0) {
                    return (
                      <p className="text-[11px] sm:text-sm text-slate-600 italic">No existing subjects in this department yet.</p>
                    );
                  }
                  return (
                    <div className="space-y-1.5 sm:space-y-2 max-h-32 sm:max-h-60 overflow-y-auto">
                      {existingSubjects.map(subj => (
                        <div key={subj._id} className="bg-white p-2 sm:p-3 rounded border border-slate-200">
                          <p className="text-[11px] sm:text-sm font-medium text-slate-900 leading-tight">{subj.name}</p>
                          <p className="text-[10px] sm:text-xs text-slate-600 leading-tight">{subj.code} • {subj.description}</p>
                      </div>
                    ))}
                  </div>
                  );
                })()}
                </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3">
                <p className="text-[11px] sm:text-sm text-yellow-800 leading-tight">
                  <i className="fas fa-info-circle mr-0.5 sm:mr-1 text-[10px] sm:text-xs"></i>
                  Are you sure this subject is not similar to any existing subjects?
                </p>
              </div>
            </div>
            
            <div className="p-3 sm:p-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                onClick={() => {
                  setIsSubjectConfirmModalOpen(false);
                  setPendingSubjectToAdd(null);
                }}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors text-xs sm:text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmAddSubject}
                className="w-full sm:w-auto px-3 sm:px-6 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                    <span className="text-xs sm:text-sm">Adding...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check text-xs sm:text-sm"></i>
                    <span className="text-xs sm:text-sm">Yes, Add Subject</span>
                  </>
                )}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Assignment Modal */}
      {isJobAssignmentModalOpen && selectedTopicForJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Assign Skill/Topic to Job</h2>
                  <p className="text-slate-500 text-sm mt-1">Select a job to assign "{selectedTopicForJob.name || selectedTopicForJob.title}" to</p>
                </div>
                <button
                  onClick={closeJobAssignmentModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Topic Preview */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Topic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Title:</span>
                    <span className="ml-2 font-medium">{selectedTopicForJob.name || selectedTopicForJob.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Difficulty:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTopicForJob.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      selectedTopicForJob.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedTopicForJob.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Estimated Time:</span>
                    <span className="ml-2">{selectedTopicForJob.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Department:</span>
                    <span className="ml-2">{departments.find(d => d._id === selectedTopicForJob.departmentId)?.name || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              {/* Available Jobs */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Jobs</h3>
                
                {jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-briefcase text-slate-400"></i>
                    </div>
                    <p className="text-slate-600">No jobs available for assignment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.map(job => {
                      const jobDepartment = departments.find(d => d._id === job.departmentId);
                      const jobClass = classes.find(c => c._id === job.classId);
                      
                      // Check if this topic is already assigned to this job
                      const isAlreadyAssigned = topicJobAssignments.some(
                        assignment => assignment.topicId === selectedTopicForJob._id && assignment.jobId === job._id
                      );
                      
                      return (
                        <div key={job._id} className={`border rounded-lg p-4 transition-all ${
                          isAlreadyAssigned 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-slate-200 hover:border-green-300 hover:shadow-md'
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900">{job.name}</h4>
                              <p className="text-sm text-slate-600 mt-1">{job.description}</p>
                              {isAlreadyAssigned && (
                                <div className="flex items-center gap-1 mt-2">
                                  <i className="fas fa-check-circle text-green-600 text-xs"></i>
                                  <span className="text-xs text-green-600 font-medium">Already assigned</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleAssignTopicToJob(job._id)}
                              disabled={isAlreadyAssigned}
                              className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                                isAlreadyAssigned
                                  ? 'bg-green-100 text-green-600 cursor-not-allowed'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {isAlreadyAssigned ? 'Assigned' : 'Assign'}
                            </button>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-slate-500">
                              <i className="fas fa-building mr-2 w-3"></i>
                              {jobDepartment?.name || 'Unknown Department'}
                            </div>
                            <div className="flex items-center text-xs text-slate-500">
                              <i className="fas fa-graduation-cap mr-2 w-3"></i>
                              {jobClass?.name || 'Unknown Class'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={closeJobAssignmentModal}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job View Modal */}
      {isJobViewModalOpen && selectedTopicForJobView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Connected Jobs</h2>
                  <p className="text-slate-500 text-sm mt-1">Jobs assigned to "{selectedTopicForJobView.name || selectedTopicForJobView.title}"</p>
                </div>
                <button
                  onClick={closeJobViewModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Topic Preview */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Topic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Title:</span>
                    <span className="ml-2 font-medium">{selectedTopicForJobView.name || selectedTopicForJobView.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Difficulty:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTopicForJobView.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      selectedTopicForJobView.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedTopicForJobView.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Estimated Time:</span>
                    <span className="ml-2">{selectedTopicForJobView.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Department:</span>
                    <span className="ml-2">{departments.find(d => d._id === selectedTopicForJobView.departmentId)?.name || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              {/* Connected Jobs */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Connected Jobs</h3>
                
                {(() => {
                  const connectedJobs = topicJobAssignments.filter(
                    assignment => assignment.topicId === selectedTopicForJobView._id
                  );
                  
                  if (connectedJobs.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <i className="fas fa-briefcase text-slate-400"></i>
                        </div>
                        <p className="text-slate-600">No jobs are currently connected to this topic</p>
                        <button
                          onClick={() => {
                            closeJobViewModal();
                            openJobAssignmentModal(selectedTopicForJobView);
                          }}
                          className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto"
                        >
                          <i className="fas fa-plus"></i>
                          Assign to Job
                        </button>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {connectedJobs.map(assignment => {
                        const job = jobs.find(j => j._id === assignment.jobId);
                        const jobDepartment = departments.find(d => d._id === job?.departmentId);
                        const jobClass = classes.find(c => c._id === job?.classId);
                        
                        return (
                          <div key={assignment._id} className="border border-green-300 bg-green-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-slate-900">{job?.name || 'Unknown Job'}</h4>
                                  <i className="fas fa-check-circle text-green-600 text-sm"></i>
                                </div>
                                <p className="text-sm text-slate-600">{job?.description || 'No description available'}</p>
                                <div className="flex items-center gap-1 mt-2">
                                  <span className="text-xs text-green-600 font-medium">Connected on:</span>
                                  <span className="text-xs text-slate-500">
                                    {new Date(assignment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-slate-500">
                                <i className="fas fa-building mr-2 w-3"></i>
                                {jobDepartment?.name || 'Unknown Department'}
                              </div>
                              <div className="flex items-center text-xs text-slate-500">
                                <i className="fas fa-graduation-cap mr-2 w-3"></i>
                                {jobClass?.name || 'Unknown Class'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => {
                  closeJobViewModal();
                  openJobAssignmentModal(selectedTopicForJobView);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Assign to More Jobs
              </button>
              <button
                onClick={closeJobViewModal}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Job Assignment Modal */}
      {isBulkJobAssignmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Bulk Assign Skills/Topics to Job</h2>
                  <p className="text-slate-500 text-sm mt-1">Select multiple topics and assign them to a job</p>
                </div>
                <button
                  onClick={closeBulkJobAssignmentModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Selection Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">
                    {selectedTopics.length} of {sortedTopics.length} topics selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllTopics}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              {/* Topics Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-h-96 overflow-y-auto border border-slate-200 rounded-lg p-4">
                {sortedTopics.map((topic) => {
                  const department = departments.find(d => d._id === topic.departmentId);
                  const subject = subjects.find(s => s._id === topic.subjectId);
                  const classInfo = classes.find(c => c._id === topic.classId);
                  const isSelected = selectedTopics.some(t => t._id === topic._id);
                  
                  return (
                    <div 
                      key={topic._id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                      }`}
                      onClick={() => toggleBulkTopicSelection(topic)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleBulkTopicSelection(topic)}
                          className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm leading-tight mb-1">{topic.name || topic.title}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              topic.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                              topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {topic.difficulty}
                            </span>
                            <span className="text-xs text-slate-500">{topic.estimatedTime}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <i className="fas fa-building text-slate-400 w-3"></i>
                              <span className="text-slate-600">{department?.name || 'Unknown Department'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <i className="fas fa-book text-slate-400 w-3"></i>
                              <span className="text-slate-600">{subject?.name || 'Unknown Subject'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Job Selection */}
              {selectedTopics.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Job to Assign Topics To</h3>
                  
                  {jobs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-briefcase text-slate-400"></i>
                      </div>
                      <p className="text-slate-600">No jobs available for assignment</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {jobs.map(job => {
                        const jobDepartment = departments.find(d => d._id === job.departmentId);
                        const jobClass = classes.find(c => c._id === job.classId);
                        
                        return (
                          <div key={job._id} className="border border-slate-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-900">{job.name}</h4>
                                <p className="text-sm text-slate-600 mt-1">{job.description}</p>
                              </div>
                              <button
                                onClick={() => handleBulkAssignTopicsToJob(job._id)}
                                disabled={isLoading}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                              >
                                {isLoading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Assigning...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-layer-group"></i>
                                    Assign {selectedTopics.length} Topics
                                  </>
                                )}
                              </button>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-slate-500">
                                <i className="fas fa-building mr-2 w-3"></i>
                                {jobDepartment?.name || 'Unknown Department'}
                              </div>
                              <div className="flex items-center text-xs text-slate-500">
                                <i className="fas fa-graduation-cap mr-2 w-3"></i>
                                {jobClass?.name || 'Unknown Class'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedTopics.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-check-square text-slate-400"></i>
                  </div>
                  <p className="text-slate-600">Select topics above to assign them to a job</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={closeBulkJobAssignmentModal}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Unassigned Topics to Job Modal */}
      {isAssignToJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Assign Topics to Job</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Assign {selectedUnassignedTopics.length} selected topic{selectedUnassignedTopics.length !== 1 ? 's' : ''} to a job
                  </p>
                </div>
                <button
                  onClick={() => setIsAssignToJobModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Available Jobs */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Jobs</h3>
                
                {(() => {
                  const availableJobs = departmentClassSectionJobs.filter(job => 
                    job.departmentId === jobViewDepartment && 
                    job.classId === jobViewClass && 
                    job.sectionId === jobViewSection
                  );
                  
                  if (availableJobs.length === 0) {
                    return (
                      <div className="text-center py-8 bg-slate-50 rounded-lg">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <i className="fas fa-briefcase text-slate-400 text-xl"></i>
                        </div>
                        <p className="text-slate-600 mb-4">No jobs available for this selection</p>
                        <button
                          onClick={() => {
                            setIsAssignToJobModalOpen(false);
                            setIsAIGeneratorOpen(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                          <i className="fas fa-plus"></i>
                          Create New Job
                        </button>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableJobs.map(job => (
                        <div key={job._id} className="border border-slate-200 rounded-lg p-4 hover:border-orange-400 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900">{job.jobTitle}</h4>
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">{job.jobDescription}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <i className="fas fa-building text-[10px]"></i>
                                  {job.company}
                                </span>
                                {job.jobPostingLink && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <a
                                      href={job.jobPostingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                                    >
                                      <i className="fas fa-external-link-alt text-[10px]"></i>
                                      Job Link
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleAssignSelectedTopicsToJob(job._id)}
                            disabled={isLoading}
                            className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Assigning...</span>
                              </>
                            ) : (
                              <>
                                <i className="fas fa-link"></i>
                                <span>Assign {selectedUnassignedTopics.length} Topic{selectedUnassignedTopics.length !== 1 ? 's' : ''}</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsAssignToJobModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Job Creation Modal */}
      {isManualJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Create New Job</h2>
                  <p className="text-slate-500 text-sm mt-1">Manually add a job to your organization</p>
                </div>
                <button
                  onClick={closeManualJobModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                <select
                  value={manualJobFormData.departmentId}
                  onChange={(e) => setManualJobFormData(prev => ({ 
                    ...prev, 
                    departmentId: e.target.value,
                    classId: '',
                    sectionId: ''
                  }))}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Class/Grade *</label>
                <select
                  value={manualJobFormData.classId}
                  onChange={(e) => setManualJobFormData(prev => ({ 
                    ...prev, 
                    classId: e.target.value,
                    sectionId: ''
                  }))}
                  disabled={!manualJobFormData.departmentId}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Class</option>
                  {manualJobFormData.departmentId && classes.filter(c => c.departmentId === manualJobFormData.departmentId).map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Section/Batch *</label>
                <select
                  value={manualJobFormData.sectionId}
                  onChange={(e) => setManualJobFormData(prev => ({ ...prev, sectionId: e.target.value }))}
                  disabled={!manualJobFormData.classId}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Section</option>
                  {manualJobFormData.classId && sections.filter(s => s.classId === manualJobFormData.classId).map(section => (
                    <option key={section._id} value={section._id}>{section.name}</option>
                  ))}
                </select>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={manualJobFormData.jobTitle}
                  onChange={(e) => setManualJobFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g., Senior Frontend Developer"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={manualJobFormData.company}
                  onChange={(e) => setManualJobFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., TechCorp Solutions"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Job Posting Link */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Link to Job Posting</label>
                <input
                  type="url"
                  value={manualJobFormData.jobPostingLink}
                  onChange={(e) => setManualJobFormData(prev => ({ ...prev, jobPostingLink: e.target.value }))}
                  placeholder="e.g., https://company.com/careers/job-123"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
                <textarea
                  value={manualJobFormData.jobDescription}
                  onChange={(e) => setManualJobFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  placeholder="Describe the job role and responsibilities..."
                  rows={4}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={closeManualJobModal}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateManualJob}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    <span>Create Job</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Job Creation Modal (Non-AI) */}
      {isQuickJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="fas fa-briefcase"></i>
                    Create Job
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">Manually create a job posting for this section</p>
                </div>
                <button
                  onClick={closeQuickJobModal}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <i className="fas fa-info-circle mr-2"></i>
                  This job will be created for <span className="font-semibold">{departments.find(d => d._id === jobViewDepartment)?.name}</span> → <span className="font-semibold">{classes.find(c => c._id === jobViewClass)?.name}</span> → <span className="font-semibold">{sections.find(s => s._id === jobViewSection)?.name}</span>
                </p>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={quickJobFormData.company}
                  onChange={(e) => setQuickJobFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., Google, Microsoft, Amazon"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={quickJobFormData.jobTitle}
                  onChange={(e) => setQuickJobFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g., Senior Full-Stack Developer"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Description *</label>
                <textarea
                  value={quickJobFormData.jobDescription}
                  onChange={(e) => setQuickJobFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  placeholder="Paste or describe the job responsibilities, qualifications, and expectations..."
                  rows={5}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={closeQuickJobModal}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuickJob}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    <span>Create Job</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Toggle Modal */}
      {sectionToggleModalOpen && currentToggleDepartment && currentToggleClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Toggle to Different Section</h2>
                  <p className="text-slate-500 text-sm mt-1">View jobs from different sections/batches</p>
                </div>
                <button
                  onClick={closeSectionToggleModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Current Department and Class Info */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="font-semibold text-indigo-600">Department: </span>
                  <span className="font-medium text-slate-900">{departments.find(d => d._id === currentToggleDepartment)?.name || 'Unknown'}</span>
                </p>
                <div className="flex items-center justify-center">
                  <i className="fas fa-arrow-down text-indigo-400 text-xs"></i>
                </div>
                <p className="text-sm">
                  <span className="font-semibold text-indigo-600">Class: </span>
                  <span className="font-medium text-slate-900">{classes.find(c => c._id === currentToggleClass)?.name || 'Unknown'}</span>
                </p>
              </div>

              {/* Section Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <i className="fas fa-exchange-alt mr-1.5"></i>
                  Select Section to View *
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sections
                    .filter(s => s.classId === currentToggleClass)
                    .map(section => {
                      const jobCount = departmentClassSectionJobs.filter(
                        job => job.departmentId === currentToggleDepartment && 
                               job.classId === currentToggleClass && 
                               job.sectionId === section._id
                      ).length;
                      
                      const isCurrentSection = section._id === jobViewSection;
                      
                      return (
                        <button
                          key={section._id}
                          onClick={() => handleToggleToSection(section._id)}
                          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                            isCurrentSection
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <i className={`fas fa-users ${isCurrentSection ? 'text-indigo-600' : 'text-slate-400'}`}></i>
                              <span className={`font-semibold text-sm ${isCurrentSection ? 'text-indigo-900' : 'text-slate-900'}`}>
                                {section.name}
                              </span>
                              {isCurrentSection && (
                                <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                              {jobCount} job{jobCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  <i className="fas fa-info-circle mr-1"></i>
                  Click on any section to view its jobs
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={closeSectionToggleModal}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicManagement;

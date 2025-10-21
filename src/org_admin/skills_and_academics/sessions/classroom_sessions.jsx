import { useState, useEffect } from 'react';
import OrgMenuNavigation from '../../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import AddRecordingModal from '../../../components/org-admin-components/session-components/AddRecordingModal';
import toast, { Toaster } from 'react-hot-toast';

const ClassroomRecordings = () => {
  const [currentPage, setCurrentPage] = useState('classroom-sessions');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFABModalOpen, setIsFABModalOpen] = useState(false);
  const [selectedRecordingContext, setSelectedRecordingContext] = useState(null);
  
  // Accordion states
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [expandedSemesters, setExpandedSemesters] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  
  // Video player states
  const [playingVideo, setPlayingVideo] = useState(null);
  
  // FAB modal selection states
  const [fabFormData, setFABFormData] = useState({
    departmentId: '',
    semesterId: '',
    sectionId: '',
    subjectId: '',
    teacherId: '',
    topicId: '',
  });
  
  // Data states
  const [recordings, setRecordings] = useState([]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');

  // Dummy data
  const departments = [
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Electronics' },
    { id: 3, name: 'Mechanical' },
  ];

  const semesters = [
    { id: 1, name: 'Semester 1', departmentId: 1 },
    { id: 2, name: 'Semester 2', departmentId: 1 },
    { id: 3, name: 'Semester 3', departmentId: 1 },
    { id: 4, name: 'Semester 4', departmentId: 1 },
    { id: 5, name: 'Semester 1', departmentId: 2 },
    { id: 6, name: 'Semester 2', departmentId: 2 },
    { id: 7, name: 'Semester 1', departmentId: 3 },
    { id: 8, name: 'Semester 2', departmentId: 3 },
  ];

  const sections = [
    { id: 1, name: 'Section A', semesterId: 1 },
    { id: 2, name: 'Section B', semesterId: 1 },
    { id: 3, name: 'Section A', semesterId: 2 },
    { id: 4, name: 'Section B', semesterId: 2 },
    { id: 5, name: 'Section A', semesterId: 3 },
    { id: 6, name: 'Section A', semesterId: 4 },
    { id: 7, name: 'Section A', semesterId: 5 },
    { id: 8, name: 'Section B', semesterId: 5 },
    { id: 9, name: 'Section A', semesterId: 6 },
    { id: 10, name: 'Section A', semesterId: 7 },
    { id: 11, name: 'Section A', semesterId: 8 },
  ];

  const subjects = [
    { id: 1, name: 'Web Development', sectionId: 1 },
    { id: 2, name: 'Data Structures', sectionId: 1 },
    { id: 3, name: 'Python Programming', sectionId: 2 },
    { id: 4, name: 'Machine Learning', sectionId: 3 },
    { id: 5, name: 'Digital Electronics', sectionId: 6 },
    { id: 6, name: 'Thermodynamics', sectionId: 8 },
  ];

  const teachers = [
    { id: 1, name: 'John Smith', email: 'john@school.com', subjectId: 1 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@school.com', subjectId: 2 },
    { id: 3, name: 'Mike Brown', email: 'mike@school.com', subjectId: 3 },
    { id: 4, name: 'Emily Davis', email: 'emily@school.com', subjectId: 4 },
    { id: 5, name: 'Robert Wilson', email: 'robert@school.com', subjectId: 5 },
    { id: 6, name: 'Lisa Anderson', email: 'lisa@school.com', subjectId: 6 },
  ];

  const topics = [
    { id: 1, name: 'HTML Basics', subjectId: 1 },
    { id: 2, name: 'CSS Styling', subjectId: 1 },
    { id: 3, name: 'JavaScript Fundamentals', subjectId: 1 },
    { id: 4, name: 'Arrays', subjectId: 2 },
    { id: 5, name: 'Linked Lists', subjectId: 2 },
    { id: 6, name: 'Variables & Data Types', subjectId: 3 },
    { id: 7, name: 'Neural Networks', subjectId: 4 },
    { id: 8, name: 'Logic Gates', subjectId: 5 },
    { id: 9, name: 'Heat Transfer', subjectId: 6 },
  ];

  // Dummy recordings data
  const dummyRecordings = [
    {
      id: 1,
      title: 'Introduction to HTML & CSS',
      videoLink: 'https://youtu.be/y9Dk6wMc8UM',
      duration: '45 mins',
      uploadedDate: '2024-10-15',
      teacherId: 1,
      subjectId: 1,
      topicId: 1,
      addedBy: 'admin',
    },
    {
      id: 2,
      title: 'JavaScript DOM Manipulation',
      videoLink: 'https://youtu.be/y9Dk6wMc8UM',
      duration: '60 mins',
      uploadedDate: '2024-10-16',
      teacherId: 1,
      subjectId: 1,
      topicId: 3,
      addedBy: 'teacher',
    },
    {
      id: 3,
      title: 'CSS Flexbox Complete Guide',
      videoLink: 'https://youtu.be/y9Dk6wMc8UM',
      duration: '50 mins',
      uploadedDate: '2024-10-17',
      teacherId: 1,
      subjectId: 1,
      topicId: 2,
      addedBy: 'teacher',
    },
    {
      id: 4,
      title: 'Arrays and Operations',
      videoLink: 'https://youtu.be/y9Dk6wMc8UM',
      duration: '50 mins',
      uploadedDate: '2024-10-14',
      teacherId: 2,
      subjectId: 2,
      topicId: 4,
      addedBy: 'teacher',
    },
    {
      id: 5,
      title: 'Linked Lists Implementation',
      videoLink: 'https://youtu.be/y9Dk6wMc8UM',
      duration: '55 mins',
      uploadedDate: '2024-10-18',
      teacherId: 2,
      subjectId: 2,
      topicId: 5,
      addedBy: 'admin',
    },
    {
      id: 6,
      title: 'Python Basics - Variables',
      videoLink: 'https://youtu.be/y9Dk6wMc8UM',
      duration: '40 mins',
      uploadedDate: '2024-10-17',
      teacherId: 3,
      subjectId: 3,
      topicId: 6,
      addedBy: 'teacher',
    },
    {
      id: 7,
      title: 'Introduction to Neural Networks',
      videoLink: 'https://youtu.be/y9Dk6wMc8UM',
      duration: '70 mins',
      uploadedDate: '2024-10-19',
      teacherId: 4,
      subjectId: 4,
      topicId: 7,
      addedBy: 'teacher',
    },
    {
      id: 8,
      title: 'Logic Gates Explained',
      videoLink: 'https://youtu.be/y9Dk6wMc8UM',
      duration: '45 mins',
      uploadedDate: '2024-10-20',
      teacherId: 5,
      subjectId: 5,
      topicId: 8,
      addedBy: 'teacher',
    },
    {
      id: 9,
      title: 'Heat Transfer Mechanisms',
      videoLink: 'https://youtu.be/y9Dk6wMc8UM',
      duration: '60 mins',
      uploadedDate: '2024-10-21',
      teacherId: 6,
      subjectId: 6,
      topicId: 9,
      addedBy: 'admin',
    },
  ];

  useEffect(() => {
    setRecordings(dummyRecordings);
  }, []);

  // Handle search button click
  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setAppliedSearchTerm('');
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Auto-expand accordions when searching
  useEffect(() => {
    if (appliedSearchTerm) {
      const matchingRecordings = recordings.filter(r => 
        r.title.toLowerCase().includes(appliedSearchTerm.toLowerCase())
      );
      
      if (matchingRecordings.length > 0) {
        const newExpandedDepts = new Set();
        const newExpandedSemesters = new Set();
        const newExpandedSections = new Set();
        const newExpandedSubjects = new Set();

        matchingRecordings.forEach(recording => {
          // Find subject
          const subject = subjects.find(s => s.id === recording.subjectId);
          if (subject) {
            newExpandedSubjects.add(subject.id);
            
            // Find section
            const section = sections.find(s => s.id === subject.sectionId);
            if (section) {
              newExpandedSections.add(section.id);
              
              // Find semester
              const semester = semesters.find(sem => sem.id === section.semesterId);
              if (semester) {
                newExpandedSemesters.add(semester.id);
                
                // Find department
                const dept = departments.find(d => d.id === semester.departmentId);
                if (dept) {
                  newExpandedDepts.add(dept.id);
                }
              }
            }
          }
        });

        setExpandedDepartments(newExpandedDepts);
        setExpandedSemesters(newExpandedSemesters);
        setExpandedSections(newExpandedSections);
        setExpandedSubjects(newExpandedSubjects);
      }
    }
  }, [appliedSearchTerm, recordings]);

  // Handle page changes from menu
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Open add recording modal
  const openAddModal = (context) => {
    setSelectedRecordingContext(context);
    setIsAddModalOpen(true);
  };

  // Get available topics for selected subject
  const getAvailableTopicsForSubject = () => {
    if (selectedRecordingContext?.subjectId) {
      return topics.filter(t => t.subjectId === selectedRecordingContext.subjectId);
    }
    return [];
  };

  // Close add recording modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedRecordingContext(null);
  };

  // Handle adding a new recording
  const handleAddRecording = (recordingData) => {
    const newRecording = {
      id: Date.now(),
      ...recordingData,
      uploadedDate: new Date().toISOString().split('T')[0],
      addedBy: 'admin',
      subjectId: selectedRecordingContext?.subjectId,
      teacherId: selectedRecordingContext?.teacherId,
      // topicId now comes from recordingData.topicId (selected in dropdown)
    };
    setRecordings([...recordings, newRecording]);
    toast.success('Recording added successfully!');
    closeAddModal();
  };

  // Handle recording deletion
  const handleDeleteRecording = (recordingId) => {
    if (window.confirm('Are you sure you want to delete this recording?')) {
      setRecordings(recordings.filter(r => r.id !== recordingId));
      toast.success('Recording deleted successfully!');
    }
  };

  // Toggle accordions
  const toggleDepartment = (deptId) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepartments(newExpanded);
  };

  const toggleSemester = (semesterId) => {
    const newExpanded = new Set(expandedSemesters);
    if (newExpanded.has(semesterId)) {
      newExpanded.delete(semesterId);
    } else {
      newExpanded.add(semesterId);
    }
    setExpandedSemesters(newExpanded);
  };

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleSubject = (subjectId) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  // Get recordings count by department
  const getRecordingsByDepartment = (deptId) => {
    const deptSemesters = semesters.filter(c => c.departmentId === deptId);
    const deptSemesterIds = deptSemesters.map(c => c.id);
    const deptSections = sections.filter(s => deptSemesterIds.includes(s.semesterId));
    const deptSectionIds = deptSections.map(s => s.id);
    const deptSubjects = subjects.filter(s => deptSectionIds.includes(s.sectionId));
    const deptSubjectIds = deptSubjects.map(s => s.id);
    return recordings.filter(r => deptSubjectIds.includes(r.subjectId));
  };

  // Get subject hierarchy info
  const getSubjectInfo = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    const section = sections.find(s => s.id === subject?.sectionId);
    const semesterInfo = semesters.find(c => c.id === section?.semesterId);
    const dept = departments.find(d => d.id === semesterInfo?.departmentId);
    return { subject, section, semesterInfo, dept };
  };

  // Get topic info
  const getTopic = (topicId) => topics.find(t => t.id === topicId);
  const getTeacher = (teacherId) => teachers.find(t => t.id === teacherId);
  
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Close video player
  const closeVideoPlayer = () => {
    setPlayingVideo(null);
  };

  // Open FAB modal
  const openFABModal = () => {
    setIsFABModalOpen(true);
  };

  // Close FAB modal
  const closeFABModal = () => {
    setIsFABModalOpen(false);
    setFABFormData({
      departmentId: '',
      semesterId: '',
      sectionId: '',
      subjectId: '',
      teacherId: '',
      topicId: '',
    });
  };

  // Handle FAB form changes
  const handleFABFormChange = (field, value) => {
    setFABFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'departmentId') {
        updated.semesterId = '';
        updated.sectionId = '';
        updated.subjectId = '';
        updated.teacherId = '';
        updated.topicId = '';
      } else if (field === 'semesterId') {
        updated.sectionId = '';
        updated.subjectId = '';
        updated.teacherId = '';
        updated.topicId = '';
      } else if (field === 'sectionId') {
        updated.subjectId = '';
        updated.teacherId = '';
        updated.topicId = '';
      } else if (field === 'subjectId') {
        updated.teacherId = '';
        updated.topicId = '';
      }
      
      return updated;
    });
  };

  // Submit FAB form and open recording modal
  const handleFABFormSubmit = () => {
    if (!fabFormData.departmentId || !fabFormData.semesterId || !fabFormData.sectionId || 
        !fabFormData.subjectId || !fabFormData.teacherId || !fabFormData.topicId) {
      toast.error('Please fill all fields');
      return;
    }
    
    setSelectedRecordingContext({
      subjectId: parseInt(fabFormData.subjectId),
      teacherId: parseInt(fabFormData.teacherId),
      topicId: parseInt(fabFormData.topicId),
    });
    
    closeFABModal();
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster position="top-center" />
      
      {/* Menu Navigation */}
      <OrgMenuNavigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Main Content */}
      <main className="lg:ml-72 flex-1 p-4 md:p-8 pt-16 md:pt-8 space-y-8">
        {/* Header - Matching Topic Generator Style */}
        <header className="flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Classroom Recordings</h1>
            <p className="text-slate-500 text-sm">View and manage classroom video recordings across departments</p>
          </div>
        </header>

        {/* Department Stats Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {departments.map((dept) => {
            const deptRecordings = getRecordingsByDepartment(dept.id);
            const colors = {
              1: { bg: 'from-blue-500 to-indigo-500', light: 'bg-blue-50', text: 'text-blue-700' },
              2: { bg: 'from-purple-500 to-pink-500', light: 'bg-purple-50', text: 'text-purple-700' },
              3: { bg: 'from-green-500 to-teal-500', light: 'bg-green-50', text: 'text-green-700' },
            };
            const color = colors[dept.id] || colors[1];

            return (
              <div
                key={dept.id}
                className="bg-white rounded-lg md:rounded-xl shadow-md border border-slate-200 p-2 md:p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => toggleDepartment(dept.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  {/* Desktop View */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color.bg} flex items-center justify-center text-white`}>
                      <i className="fas fa-video text-xl"></i>
                    </div>
            <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{dept.name}</h3>
                      <p className="text-xs text-slate-500">Click to view</p>
                    </div>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-2xl font-bold text-slate-900">{deptRecordings.length}</p>
                    <p className="text-xs text-slate-500">recordings</p>
            </div>

                  {/* Mobile View - No Icon */}
                  <div className="md:hidden text-center">
                    <p className="text-lg font-bold text-slate-900">{deptRecordings.length}</p>
                    <h3 className="text-xs font-semibold text-slate-700 leading-tight">{dept.name}</h3>
                  </div>
                </div>
          </div>
            );
          })}
        </div>

        {/* How to Upload Videos - Accordion */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-md border border-indigo-200 overflow-hidden">
          <button
            onClick={() => setIsExplainerOpen(!isExplainerOpen)}
            className="w-full px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <i className="fas fa-question-circle text-base sm:text-xl"></i>
              </div>
              <div className="text-left flex-1 min-w-0">
                <h3 className="text-sm sm:text-lg font-bold text-slate-900">
                  How to Upload Videos
              </h3>
                <p className="text-xs text-slate-600 hidden sm:block">
                  Step-by-step guide for uploading classroom recordings
              </p>
              </div>
            </div>
            <i className={`fas fa-chevron-${isExplainerOpen ? 'up' : 'down'} text-slate-600 flex-shrink-0`}></i>
          </button>

          {isExplainerOpen && (
            <div className="p-3 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                {/* YouTube Upload */}
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-indigo-200">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fab fa-youtube text-red-600 text-sm sm:text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-xs sm:text-sm mb-1 sm:mb-2">YouTube Upload</h4>
                      <ol className="text-[10px] sm:text-xs text-slate-600 space-y-0.5 sm:space-y-1 list-decimal list-inside mb-1 sm:mb-2">
                        <li>Go to YouTube Studio</li>
                        <li>Click "Create" → "Upload videos"</li>
                        <li>Select your recording file</li>
                        <li>Set visibility (Public/Unlisted)</li>
                        <li>Copy the video link and paste it here</li>
                      </ol>
                      <a
                        href="https://support.google.com/youtube/answer/57407"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        <i className="fas fa-external-link-alt text-[8px] sm:text-xs"></i>
                        Help Guide
                      </a>
                    </div>
                  </div>
                </div>

                {/* Google Drive Upload */}
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-indigo-200">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fab fa-google-drive text-blue-600 text-sm sm:text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-xs sm:text-sm mb-1 sm:mb-2">Google Drive Upload</h4>
                      <ol className="text-[10px] sm:text-xs text-slate-600 space-y-0.5 sm:space-y-1 list-decimal list-inside mb-1 sm:mb-2">
                        <li>Upload video to Google Drive</li>
                        <li>Right-click → "Get link"</li>
                        <li>Set permission to "Anyone with link"</li>
                        <li>Click "Copy link"</li>
                        <li>Paste the link here</li>
                      </ol>
                      <a
                        href="https://support.google.com/drive/answer/2494822"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        <i className="fas fa-external-link-alt text-[8px] sm:text-xs"></i>
                        Help Guide
                      </a>
                    </div>
                  </div>
                </div>

                {/* Zoom Recording */}
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-indigo-200">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-video text-indigo-600 text-sm sm:text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-xs sm:text-sm mb-1 sm:mb-2">Zoom Recording</h4>
                      <ol className="text-[10px] sm:text-xs text-slate-600 space-y-0.5 sm:space-y-1 list-decimal list-inside mb-1 sm:mb-2">
                        <li>Record your Zoom session</li>
                        <li>Find recording in Zoom folder</li>
                        <li>Upload to YouTube/Drive</li>
                        <li>Get shareable link</li>
                        <li>Add link to MySkillDB</li>
                      </ol>
                      <a
                        href="https://support.zoom.us/hc/en-us/articles/201362473-Local-recording"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        <i className="fas fa-external-link-alt text-[8px] sm:text-xs"></i>
                        Help Guide
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-indigo-200">
                <p className="text-[10px] sm:text-xs text-slate-600">
                  <i className="fas fa-info-circle text-indigo-600 mr-1"></i>
                  <strong>Note:</strong> For best results, use YouTube as it provides built-in video player, automatic quality adjustment, and reliable streaming.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Search Filter */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-md border border-slate-200 p-3 md:p-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search videos by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <i className="fas fa-search"></i>
              <span className="hidden sm:inline">Search</span>
            </button>
            {appliedSearchTerm && (
              <button
                onClick={handleClearSearch}
                className="px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
              >
                Clear
              </button>
            )}
          </div>
          {appliedSearchTerm && (
            <p className="text-xs text-slate-500 mt-2">
              {recordings.filter(r => r.title.toLowerCase().includes(appliedSearchTerm.toLowerCase())).length} video(s) found
            </p>
          )}
        </div>

        {/* Department Accordions */}
        <div className="space-y-4">
          {departments.map((dept) => {
            const isDeptExpanded = expandedDepartments.has(dept.id);
            const deptSemesters = semesters.filter(c => c.departmentId === dept.id);
            const deptRecordings = getRecordingsByDepartment(dept.id);
            
            const colors = {
              1: { 
                bg: 'from-blue-500 to-indigo-500', 
                light: 'from-blue-50 to-indigo-50',
                hover: 'from-blue-100 to-indigo-100',
                border: 'border-blue-200'
              },
              2: { 
                bg: 'from-purple-500 to-pink-500', 
                light: 'from-purple-50 to-pink-50',
                hover: 'from-purple-100 to-pink-100',
                border: 'border-purple-200'
              },
              3: { 
                bg: 'from-green-500 to-teal-500', 
                light: 'from-green-50 to-teal-50',
                hover: 'from-green-100 to-teal-100',
                border: 'border-green-200'
              },
            };
            const color = colors[dept.id] || colors[1];

            return (
              <div key={dept.id} className={`border ${color.border} rounded-lg md:rounded-2xl overflow-hidden shadow-lg bg-white`}>
                {/* Department Header */}
                <button
                  onClick={() => toggleDepartment(dept.id)}
                  className={`w-full px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r ${isDeptExpanded ? color.hover : color.light} hover:${color.hover} flex items-center justify-between transition-all`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${color.bg} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <i className="fas fa-building text-base sm:text-xl"></i>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{dept.name}</h3>
                      <p className="text-xs text-slate-600">{deptRecordings.length} recordings</p>
                    </div>
                  </div>
                  <i className={`fas fa-chevron-${isDeptExpanded ? 'up' : 'down'} text-slate-600 flex-shrink-0`}></i>
                </button>

                {/* Department Content - Semesters */}
                {isDeptExpanded && (
                  <div className="p-4 space-y-3 bg-slate-50">
                    {deptSemesters.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No semesters available</p>
                    ) : (
                      deptSemesters.map((semester) => {
                        const isSemesterExpanded = expandedSemesters.has(semester.id);
                        const semesterSections = sections.filter(s => s.semesterId === semester.id);

                        return (
                          <div key={semester.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                            {/* Semester Header */}
                            <button
                              onClick={() => toggleSemester(semester.id)}
                              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                  <i className="fas fa-calendar-alt text-indigo-600"></i>
                                </div>
                                <div className="text-left">
                                  <h4 className="font-semibold text-slate-900 text-sm">{semester.name}</h4>
                                  <p className="text-xs text-slate-500">{semesterSections.length} sections</p>
                                </div>
                              </div>
                              <i className={`fas fa-chevron-${isSemesterExpanded ? 'up' : 'down'} text-slate-500 text-sm`}></i>
                            </button>

                            {/* Semester Content - Sections */}
                            {isSemesterExpanded && (
                              <div className="p-3 space-y-2 bg-white">
                                {semesterSections.map((section) => {
                                  const isSectionExpanded = expandedSections.has(section.id);
                                  const sectionSubjects = subjects.filter(s => s.sectionId === section.id);

                                  return (
                                    <div key={section.id} className="border border-slate-200 rounded-lg overflow-hidden">
                                      {/* Section Header */}
                                      <button
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors"
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <i className="fas fa-users text-purple-600 text-sm"></i>
                                          </div>
                                          <div className="text-left">
                                            <h5 className="font-semibold text-slate-900 text-sm">{section.name}</h5>
                                            <p className="text-xs text-slate-500">{sectionSubjects.length} subjects</p>
                                          </div>
                                        </div>
                                        <i className={`fas fa-chevron-${isSectionExpanded ? 'up' : 'down'} text-slate-500 text-xs`}></i>
                                      </button>

                                      {/* Section Content - Subjects */}
                                      {isSectionExpanded && (
                                        <div className="p-2 space-y-2 bg-white">
                                          {sectionSubjects.length === 0 ? (
                                            <p className="text-xs text-slate-500 text-center py-2">No subjects available</p>
                                          ) : (
                                            sectionSubjects.map((subject) => {
                                              const isSubjectExpanded = expandedSubjects.has(subject.id);
                                              const subjectRecordings = recordings.filter(r => r.subjectId === subject.id);
                                              const teacher = teachers.find(t => t.subjectId === subject.id);

                                              return (
                                                <div key={subject.id} className="border border-slate-200 rounded-lg overflow-hidden w-[80%] sm:w-full">
                                                  {/* Subject Header */}
                                                  <button
                                                    onClick={() => toggleSubject(subject.id)}
                                                    className="w-full px-3 py-2 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-between transition-colors"
                                                  >
                                                    <div className="flex items-center gap-2">
                                                      <div className="w-8 h-8 bg-indigo-200 rounded-lg flex items-center justify-center">
                                                        <i className="fas fa-book text-indigo-700 text-sm"></i>
                                                      </div>
                                                      <div className="text-left">
                                                        <h6 className="font-semibold text-slate-900 text-sm">{subject.name}</h6>
                                                        <p className="text-xs text-slate-600">
                                                          {teacher?.name} • {subjectRecordings.length} recordings
                                                        </p>
                                                      </div>
                                                    </div>
                                                    <i className={`fas fa-chevron-${isSubjectExpanded ? 'up' : 'down'} text-slate-500 text-xs`}></i>
                                                  </button>

                                                  {/* Subject Content - Topics with Recordings */}
                                                  {isSubjectExpanded && (
                                                    <div className="p-3 bg-white space-y-2">
                                                      {/* Add Recording Button */}
                                                      <button
                                                        onClick={() => openAddModal({
                                                          subjectId: subject.id,
                                                          teacherId: teacher?.id,
                                                        })}
                                                        className="w-full px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                                                      >
                                                        <i className="fas fa-plus"></i>
                                                        Add Recording for {subject.name}
                                                      </button>

                                                                {/* Topics with Recordings */}
                                                              {subjectRecordings.length === 0 ? (
                                                                <p className="text-xs text-slate-500 text-center py-4">No recordings yet</p>
                                                              ) : (
                                                                <div className="space-y-2">
                                                                  {topics
                                                                    .filter(t => t.subjectId === subject.id)
                                                                    .map((topic) => {
                                                                      const topicRecordings = subjectRecordings.filter(r => r.topicId === topic.id);
                                                                      const filteredTopicRecordings = topicRecordings.filter(recording => 
                                                                        !appliedSearchTerm || 
                                                                        recording.title.toLowerCase().includes(appliedSearchTerm.toLowerCase())
                                                                      );
                                                                      
                                                                      if (filteredTopicRecordings.length === 0) return null;

                                                                      return (
                                                                        <div key={topic.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                                                                          <div className="flex items-center gap-2 mb-2">
                                                                            <i className="fas fa-bookmark text-indigo-600 text-xs"></i>
                                                                            <h6 className="font-semibold text-slate-900 text-xs">{topic.name}</h6>
                                                                            <span className="ml-auto bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                                                              {filteredTopicRecordings.length}
                                                                            </span>
                                                                          </div>
                                                                          
                                                                  <div className="space-y-3">
                                                                    {filteredTopicRecordings.map((recording) => {
                                                                      return (
                                                                        <div
                                                                          key={recording.id}
                                                                          onClick={() => setPlayingVideo(recording)}
                                                                          className="bg-white border border-slate-200 rounded-lg p-3 sm:p-2 hover:shadow-md hover:bg-slate-50 transition-all cursor-pointer min-h-[70px] sm:min-h-[60px]"
                                                                        >
                                                                          <div className="flex items-center gap-3 sm:gap-2">
                                                                            {/* YouTube Icon */}
                                                                            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                              <i className="fab fa-youtube text-red-600 text-2xl sm:text-xl"></i>
                                                                            </div>
                                                                            
                                                                            {/* Recording Info */}
                                                                            <div className="flex-1 min-w-0 flex flex-col items-start sm:items-center">
                                                                              <h6 className="font-semibold text-slate-900 text-sm sm:text-xs truncate mb-1 w-full text-left sm:text-center">
                                                                                {recording.title}
                                                                              </h6>
                                                                              <div className="flex items-center gap-3 sm:gap-2 text-xs sm:text-[10px] text-slate-500">
                                                                                <span className="flex items-center gap-1">
                                                                                  <i className="fas fa-clock"></i>
                                                                                  {recording.duration}
                                                                                </span>
                                                                                <span className="flex items-center gap-1">
                                                                                  <i className={`fas fa-${recording.addedBy === 'admin' ? 'user-shield' : 'chalkboard-teacher'}`}></i>
                                                                                  {recording.addedBy}
                                                                                </span>
                                                                              </div>
                                                                            </div>
                                                                            
                                                                            {/* Delete Button */}
                                                                            <button
                                                                              onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteRecording(recording.id);
                                                                              }}
                                                                              className="w-9 h-9 sm:w-8 sm:h-8 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center flex-shrink-0"
                                                                            >
                                                                              <i className="fas fa-trash text-sm sm:text-xs"></i>
                                                                            </button>
                                                                          </div>
                                                                        </div>
                                                                      );
                                                                    })}
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
                                            })
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Action Button (FAB) - Mobile & Desktop */}
      <button
        onClick={openFABModal}
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 active:scale-95 transition-all duration-200 z-50 flex items-center justify-center"
        aria-label="Add New Recording"
      >
        <i className="fas fa-plus text-2xl"></i>
      </button>

      {/* FAB Selection Modal */}
      {isFABModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100]"
            onClick={closeFABModal}
          ></div>
          
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-2xl">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-base sm:text-xl font-bold">Add New Recording</h2>
                    <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">Select details to add a video</p>
                  </div>
                  <button
                    onClick={closeFABModal}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all flex-shrink-0"
                  >
                    <i className="fas fa-times text-lg"></i>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Department Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Department *
                    </label>
                    <select
                      value={fabFormData.departmentId}
                      onChange={(e) => handleFABFormChange('departmentId', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Semester *
                    </label>
                    <select
                      value={fabFormData.semesterId}
                      onChange={(e) => handleFABFormChange('semesterId', e.target.value)}
                      disabled={!fabFormData.departmentId}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
                    >
                      <option value="">Select Semester</option>
                      {semesters
                        .filter(s => s.departmentId === parseInt(fabFormData.departmentId))
                        .map(sem => (
                          <option key={sem.id} value={sem.id}>{sem.name}</option>
                        ))}
                    </select>
                  </div>

                  {/* Section Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Section *
                    </label>
                    <select
                      value={fabFormData.sectionId}
                      onChange={(e) => handleFABFormChange('sectionId', e.target.value)}
                      disabled={!fabFormData.semesterId}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
                    >
                      <option value="">Select Section</option>
                      {sections
                        .filter(s => s.semesterId === parseInt(fabFormData.semesterId))
                        .map(sec => (
                          <option key={sec.id} value={sec.id}>{sec.name}</option>
                        ))}
                    </select>
                  </div>

                  {/* Subject Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Subject *
                    </label>
                    <select
                      value={fabFormData.subjectId}
                      onChange={(e) => handleFABFormChange('subjectId', e.target.value)}
                      disabled={!fabFormData.sectionId}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
                    >
                      <option value="">Select Subject</option>
                      {subjects
                        .filter(s => s.sectionId === parseInt(fabFormData.sectionId))
                        .map(subj => (
                          <option key={subj.id} value={subj.id}>{subj.name}</option>
                        ))}
                    </select>
                  </div>

                  {/* Teacher Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Teacher *
                    </label>
                    <select
                      value={fabFormData.teacherId}
                      onChange={(e) => handleFABFormChange('teacherId', e.target.value)}
                      disabled={!fabFormData.subjectId}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
                    >
                      <option value="">Select Teacher</option>
                      {teachers
                        .filter(t => t.subjectId === parseInt(fabFormData.subjectId))
                        .map(teacher => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name} ({teacher.email})
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Topic Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Topic *
                    </label>
                    <select
                      value={fabFormData.topicId}
                      onChange={(e) => handleFABFormChange('topicId', e.target.value)}
                      disabled={!fabFormData.subjectId}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
                    >
                      <option value="">Select Topic</option>
                      {topics
                        .filter(t => t.subjectId === parseInt(fabFormData.subjectId))
                        .map(topic => (
                          <option key={topic.id} value={topic.id}>{topic.name}</option>
                        ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeFABModal}
                      className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleFABFormSubmit}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all text-sm"
                    >
                      <i className="fas fa-arrow-right mr-2"></i>
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Recording Modal - with backdrop above menu */}
      {isAddModalOpen && (
        <>
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100]"
            onClick={closeAddModal}
          ></div>
          
          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto">
              <AddRecordingModal
                onClose={closeAddModal}
                onSubmit={handleAddRecording}
                selectedTeacher={getTeacher(selectedRecordingContext?.teacherId)}
                selectedSubject={subjects.find(s => s.id === selectedRecordingContext?.subjectId)}
                availableTopics={getAvailableTopicsForSubject()}
              />
            </div>
          </div>
        </>
      )}

      {/* YouTube Video Player Modal */}
      {playingVideo && (
        <>
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-[100]"
            onClick={closeVideoPlayer}
          ></div>
          
          {/* Video Player */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-5xl">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Player Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-lg font-bold text-white truncate">{playingVideo.title}</h3>
                    <p className="text-xs sm:text-sm text-indigo-100 truncate">{playingVideo.description}</p>
                  </div>
                  <button
                    onClick={closeVideoPlayer}
                    className="ml-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all flex-shrink-0"
                  >
                    <i className="fas fa-times text-lg sm:text-xl"></i>
                  </button>
                </div>
                
                {/* Video Player */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  {getYouTubeVideoId(playingVideo.videoLink) ? (
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(playingVideo.videoLink)}?autoplay=1&rel=0`}
                      title={playingVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-slate-100">
                      <div className="text-center p-4">
                        <i className="fas fa-exclamation-triangle text-4xl text-slate-400 mb-3"></i>
                        <p className="text-slate-600 mb-2">Unable to play video</p>
                        <a
                          href={playingVideo.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        >
                          Open in new tab <i className="fas fa-external-link-alt ml-1"></i>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Video Info */}
                <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200">
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
                    <span>
                      <i className="fas fa-clock mr-1 text-indigo-600"></i>
                      Duration: {playingVideo.duration}
                    </span>
                    <span>
                      <i className="fas fa-calendar mr-1 text-indigo-600"></i>
                      {new Date(playingVideo.uploadedDate).toLocaleDateString()}
                    </span>
                    <span>
                      <i className={`fas fa-${playingVideo.addedBy === 'admin' ? 'user-shield' : 'chalkboard-teacher'} mr-1 text-indigo-600`}></i>
                      Added by {playingVideo.addedBy}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassroomRecordings;

import { useState, useEffect, useMemo } from 'react';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import TopicModal from '../../components/org-admin-components/skills-academics-components/TopicModal';
import TopicDisplay from '../../components/org-admin-components/skills-academics-components/TopicDisplay';
import toast, { Toaster } from 'react-hot-toast';

const TopicManagement = () => {
  // State for global entities
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [topics, setTopics] = useState([]);

  // Selection states - New filtering flow: Class → Section → Subject
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Modal states
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  // Form data for topic modal
  const [topicFormData, setTopicFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    classId: '',
    sectionIds: [],
    difficulty: 'medium',
    estimatedTime: '',
    learningObjectives: '',
    prerequisites: '',
    resources: '',
    isActive: true
  });

  // Sorting and filtering states
  const [sortBy, setSortBy] = useState('title'); // 'title', 'subject', 'class', 'sectionsCount'
  const [searchTerm, setSearchTerm] = useState('');

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

  const fetchSubjects = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, subjects: true }));
      
      // Dummy data for subjects
      const dummySubjects = [
        { _id: 'subject-1', name: 'Physics', code: 'PHY', departmentId: 'dept-1', description: 'Physics Subject' },
        { _id: 'subject-2', name: 'Chemistry', code: 'CHEM', departmentId: 'dept-1', description: 'Chemistry Subject' },
        { _id: 'subject-3', name: 'Biology', code: 'BIO', departmentId: 'dept-1', description: 'Biology Subject' },
        { _id: 'subject-4', name: 'Mathematics', code: 'MATH', departmentId: 'dept-2', description: 'Mathematics Subject' },
        { _id: 'subject-5', name: 'English', code: 'ENG', departmentId: 'dept-3', description: 'English Language' },
        { _id: 'subject-6', name: 'History', code: 'HIST', departmentId: 'dept-4', description: 'World History' },
        { _id: 'subject-7', name: 'Geography', code: 'GEO', departmentId: 'dept-4', description: 'Geography Subject' }
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
        { _id: 'class-1', name: 'Grade 6', description: 'Sixth Grade Class' },
        { _id: 'class-2', name: 'Grade 7', description: 'Seventh Grade Class' },
        { _id: 'class-3', name: 'Grade 8', description: 'Eighth Grade Class' },
        { _id: 'class-4', name: 'Grade 9', description: 'Ninth Grade Class' },
        { _id: 'class-5', name: 'Grade 10', description: 'Tenth Grade Class' },
        { _id: 'class-6', name: 'Grade 11', description: 'Eleventh Grade Class' },
        { _id: 'class-7', name: 'Grade 12', description: 'Twelfth Grade Class' }
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
        { _id: 'section-1', name: 'Section A', description: 'Section A' },
        { _id: 'section-2', name: 'Section B', description: 'Section B' },
        { _id: 'section-3', name: 'Section C', description: 'Section C' },
        { _id: 'section-4', name: 'Section D', description: 'Section D' },
        { _id: 'section-5', name: 'Section E', description: 'Section E' },
        { _id: 'section-6', name: 'Section F', description: 'Section F' },
        { _id: 'section-7', name: 'Section G', description: 'Section G' },
        { _id: 'section-8', name: 'Section H', description: 'Section H' }
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
      
      // Dummy data for topics
      const dummyTopics = [
        { 
          _id: 'topic-1', 
          title: 'Introduction to Forces', 
          description: 'Understanding different types of forces and their effects',
          subjectId: 'subject-1',
          classId: 'class-1',
          sectionIds: ['section-1', 'section-2'],
          difficulty: 'medium',
          estimatedTime: '2 hours',
          learningObjectives: 'Students will understand basic force concepts',
          prerequisites: 'Basic understanding of motion',
          resources: 'Physics textbook, lab equipment',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z'
        },
        { 
          _id: 'topic-2', 
          title: 'Chemical Bonding', 
          description: 'Types of chemical bonds and their properties',
          subjectId: 'subject-2',
          classId: 'class-2',
          sectionIds: ['section-3', 'section-4', 'section-5'],
          difficulty: 'hard',
          estimatedTime: '3 hours',
          learningObjectives: 'Students will understand ionic and covalent bonds',
          prerequisites: 'Atomic structure knowledge',
          resources: 'Chemistry lab, molecular models',
          isActive: true,
          createdAt: '2024-01-16T09:15:00Z'
        },
        { 
          _id: 'topic-3', 
          title: 'Algebra Basics', 
          description: 'Introduction to algebraic expressions and equations',
          subjectId: 'subject-4',
          classId: 'class-1',
          sectionIds: ['section-1', 'section-2', 'section-3'],
          difficulty: 'easy',
          estimatedTime: '1.5 hours',
          learningObjectives: 'Students will solve basic algebraic equations',
          prerequisites: 'Basic arithmetic',
          resources: 'Math workbook, calculator',
          isActive: true,
          createdAt: '2024-01-17T11:20:00Z'
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setTopics(dummyTopics);
      
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to fetch topics');
    } finally {
      setLoadingEntities(prev => ({ ...prev, topics: false }));
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchSubjects(),
        fetchClasses(),
        fetchSections(),
        fetchTopics()
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

  const openTopicModal = (topic = null) => {
    if (topic) {
      setEditingTopic(topic);
      setTopicFormData({
        title: topic.title,
        description: topic.description,
        subjectId: topic.subjectId,
        classId: topic.classId,
        sectionIds: topic.sectionIds || [],
        difficulty: topic.difficulty,
        estimatedTime: topic.estimatedTime,
        learningObjectives: topic.learningObjectives,
        prerequisites: topic.prerequisites,
        resources: topic.resources,
        isActive: topic.isActive
      });
    } else {
      setEditingTopic(null);
      setTopicFormData({
        title: '',
        description: '',
        subjectId: selectedSubject || '',
        classId: selectedClass || '',
        sectionIds: selectedSection ? [selectedSection] : [],
        difficulty: 'medium',
        estimatedTime: '',
        learningObjectives: '',
        prerequisites: '',
        resources: '',
        isActive: true
      });
    }
    setIsTopicModalOpen(true);
  };

  const closeTopicModal = () => {
    setIsTopicModalOpen(false);
    setEditingTopic(null);
    setTopicFormData({
      title: '',
      description: '',
      subjectId: '',
      classId: '',
      sectionIds: [],
      difficulty: 'medium',
      estimatedTime: '',
      learningObjectives: '',
      prerequisites: '',
      resources: '',
      isActive: true
    });
  };

  const handleCreateTopic = async (formData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingTopic) {
        // Update existing topic
        setTopics(prev => 
          prev.map(topic => 
            topic._id === editingTopic._id
              ? { ...topic, ...formData, updatedAt: new Date().toISOString() }
              : topic
          )
        );
        toast.success('Topic updated successfully!');
      } else {
        // Create new topic
        const newTopic = {
          _id: `topic-${Date.now()}`,
          ...formData,
          organizationId: currentOrganizationId,
          createdAt: new Date().toISOString()
        };
        setTopics(prev => [...prev, newTopic]);
        toast.success('Topic created successfully!');
      }
      
      closeTopicModal();
    } catch (error) {
      toast.error('Failed to save topic');
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

  // --- COMPUTED VALUES ---

  // Get subjects that have topics for the selected class and section
  const availableSubjects = useMemo(() => {
    if (!selectedClass || !selectedSection) return [];
    
    const subjectsWithTopics = topics
      .filter(topic => 
        topic.classId === selectedClass && 
        topic.sectionIds?.includes(selectedSection)
      )
      .map(topic => topic.subjectId);
    
    const uniqueSubjectIds = [...new Set(subjectsWithTopics)];
    return subjects.filter(subject => uniqueSubjectIds.includes(subject._id));
  }, [topics, selectedClass, selectedSection, subjects]);

  const filteredTopics = useMemo(() => {
    let filtered = topics;
    
    // Apply filters in order: Class → Section → Subject
    if (selectedClass) {
      filtered = filtered.filter(topic => topic.classId === selectedClass);
    }
    if (selectedSection) {
      filtered = filtered.filter(topic => topic.sectionIds?.includes(selectedSection));
    }
    if (selectedSubject) {
      filtered = filtered.filter(topic => topic.subjectId === selectedSubject);
    }
    if (searchTerm) {
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [topics, selectedClass, selectedSection, selectedSubject, searchTerm]);

  const sortedTopics = useMemo(() => {
    const sorted = [...filteredTopics];
    
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
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
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />
      
      {/* Navigation Component */}
      {!isTopicModalOpen && <OrgMenuNavigation currentPage="topic-management" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isTopicModalOpen ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Topic Management</h1>
              <p className="text-slate-500 text-sm">Define and manage topics for subjects across classes and sections</p>
            </div>
            <button
              onClick={() => openTopicModal()}
              className={btnTealClass}
              title="Create new topic"
            >
              <i className="fas fa-plus"></i>
              Create Topic
            </button>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                <i className="fas fa-tags text-xl text-blue-500"></i>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-500 text-sm truncate">Total Topics</p>
                <p className="text-2xl font-bold text-slate-900">{topics.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                <i className="fas fa-book text-xl text-green-500"></i>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-500 text-sm truncate">Subjects</p>
                <p className="text-2xl font-bold text-slate-900">{subjects.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                <i className="fas fa-graduation-cap text-xl text-purple-500"></i>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-500 text-sm truncate">Classes</p>
                <p className="text-2xl font-bold text-slate-900">{classes.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <i className="fas fa-layer-group text-xl text-orange-500"></i>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-500 text-sm truncate">Sections</p>
                <p className="text-2xl font-bold text-slate-900">{sections.length}</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Topic Filters</h2>
            <p className="text-sm text-slate-600 mb-4">
              Select class and section first, then choose from available subjects that have topics. This shows only topics saved for your selection.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className={inputBaseClass}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => handleSectionChange(e.target.value)}
                  className={inputBaseClass}
                  disabled={!selectedClass}
                >
                  <option value="">Select Section</option>
                  {sections.map(section => (
                    <option key={section._id} value={section._id}>{section.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subjects with Topics
                  {selectedClass && selectedSection && (
                    <span className="text-xs text-slate-500 ml-2">({availableSubjects.length} available)</span>
                  )}
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className={inputBaseClass}
                  disabled={!selectedClass || !selectedSection}
                >
                  <option value="">
                    {!selectedClass || !selectedSection 
                      ? 'Select class and section first' 
                      : `All subjects (${availableSubjects.length} available)`}
                  </option>
                  {availableSubjects.map(subject => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                  ))}
                </select>
                {selectedClass && selectedSection && availableSubjects.length === 0 && (
                  <p className="text-xs text-slate-500 mt-1">No topics found for this class and section combination</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search Topics</label>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={inputBaseClass}
                  disabled={!selectedClass || !selectedSection}
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedClass('');
                    setSelectedSection('');
                    setSelectedSubject('');
                    setSearchTerm('');
                  }}
                  className={btnSlateClass}
                >
                  <i className="fas fa-filter-slash"></i>
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-100 border-slate-200 rounded-md p-2 text-sm"
                >
                  <option value="title">Title</option>
                  <option value="subject">Subject</option>
                  <option value="class">Class</option>
                  <option value="sectionsCount">Sections Count</option>
                </select>
              </div>
              
              <div className="text-sm text-slate-600">
                Showing {sortedTopics.length} of {topics.length} topics
              </div>
            </div>
          </div>

          {/* Topics Display */}
          <TopicDisplay
            topics={sortedTopics}
            subjects={subjects}
            classes={classes}
            sections={sections}
            onEdit={openTopicModal}
            onDelete={handleDeleteTopic}
            isLoading={loadingEntities.topics}
            sortBy={sortBy}
          />
        </main>
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
          editingTopic={editingTopic}
          isLoading={isLoading}
          inputBaseClass={inputBaseClass}
          btnIndigoClass={btnIndigoClass}
          btnSlateClass={btnSlateClass}
        />
      )}
    </div>
  );
};

export default TopicManagement;

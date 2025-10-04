import { useState, useEffect, useMemo } from 'react';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AdminSubjectAssign = () => {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);
  
  // State for data
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectAssignments, setSubjectAssignments] = useState([]);

  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Assignment modal states
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Current organization ID (would come from context/auth in real app)
  const [currentOrganizationId, setCurrentOrganizationId] = useState('org-123');

  // --- API CALLS ---
  
  const fetchDepartments = async () => {
    try {
      // Dummy data for departments
      const dummyDepartments = [
        { _id: 'dept-1', name: 'Science', description: 'Science and Technology Department' },
        { _id: 'dept-2', name: 'Mathematics', description: 'Mathematics Department' },
        { _id: 'dept-3', name: 'Languages', description: 'Languages and Literature Department' },
        { _id: 'dept-4', name: 'Social Studies', description: 'Social Studies Department' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setDepartments(dummyDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    }
  };

  const fetchClasses = async () => {
    try {
      // Dummy data for classes
      const dummyClasses = [
        { _id: 'class-1', name: 'Grade 6', description: 'Sixth Grade Class' },
        { _id: 'class-2', name: 'Grade 7', description: 'Seventh Grade Class' },
        { _id: 'class-3', name: 'Grade 8', description: 'Eighth Grade Class' },
        { _id: 'class-4', name: 'Grade 9', description: 'Ninth Grade Class' },
        { _id: 'class-5', name: 'Grade 10', description: 'Tenth Grade Class' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setClasses(dummyClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    }
  };

  const fetchSections = async () => {
    try {
      // Dummy data for sections
      const dummySections = [
        { _id: 'section-1', name: 'Section A', description: 'Section A' },
        { _id: 'section-2', name: 'Section B', description: 'Section B' },
        { _id: 'section-3', name: 'Section C', description: 'Section C' },
        { _id: 'section-4', name: 'Section D', description: 'Section D' },
        { _id: 'section-5', name: 'Section E', description: 'Section E' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setSections(dummySections);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
    }
  };

  const fetchSubjects = async () => {
    try {
      // Dummy data for subjects
      const dummySubjects = [
        { _id: 'subject-1', name: 'Physics', code: 'PHY', departmentId: 'dept-1', description: 'Physics Subject' },
        { _id: 'subject-2', name: 'Chemistry', code: 'CHEM', departmentId: 'dept-1', description: 'Chemistry Subject' },
        { _id: 'subject-3', name: 'Biology', code: 'BIO', departmentId: 'dept-1', description: 'Biology Subject' },
        { _id: 'subject-4', name: 'Mathematics', code: 'MATH', departmentId: 'dept-2', description: 'Mathematics Subject' },
        { _id: 'subject-5', name: 'Statistics', code: 'STAT', departmentId: 'dept-2', description: 'Statistics Subject' },
        { _id: 'subject-6', name: 'English', code: 'ENG', departmentId: 'dept-3', description: 'English Language' },
        { _id: 'subject-7', name: 'Literature', code: 'LIT', departmentId: 'dept-3', description: 'English Literature' },
        { _id: 'subject-8', name: 'History', code: 'HIST', departmentId: 'dept-4', description: 'World History' },
        { _id: 'subject-9', name: 'Geography', code: 'GEO', departmentId: 'dept-4', description: 'Geography Subject' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setSubjects(dummySubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  const fetchSubjectAssignments = async () => {
    try {
      // Dummy data for existing subject assignments
      const dummyAssignments = [
        { _id: 'assign-1', subjectId: 'subject-1', departmentId: 'dept-1', classId: 'class-1', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-2', subjectId: 'subject-4', departmentId: 'dept-2', classId: 'class-1', sectionIds: ['section-1', 'section-2', 'section-3'] },
        { _id: 'assign-3', subjectId: 'subject-6', departmentId: 'dept-3', classId: 'class-2', sectionIds: ['section-1'] },
        { _id: 'assign-4', subjectId: 'subject-8', departmentId: 'dept-4', classId: 'class-3', sectionIds: ['section-2', 'section-4'] }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setSubjectAssignments(dummyAssignments);
    } catch (error) {
      console.error('Error fetching subject assignments:', error);
      toast.error('Failed to fetch subject assignments');
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchDepartments(),
      fetchClasses(),
      fetchSections(),
      fetchSubjects(),
      fetchSubjectAssignments()
    ]);
    setIsLoading(false);
  };

  // --- HANDLERS ---
  
  const handleDepartmentChange = (deptId) => {
    setSelectedDepartment(deptId);
    setSelectedClass('');
    setSelectedSection('');
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    setSelectedSection('');
  };

  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
  };

  const openAssignmentModal = (subjectId) => {
    setSelectedSubject(subjectId);
    setSelectedSections([]);
    setIsAssignmentModalOpen(true);
  };

  const closeAssignmentModal = () => {
    setIsAssignmentModalOpen(false);
    setSelectedSubject('');
    setSelectedSections([]);
  };

  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleCreateAssignment = async () => {
    if (!selectedSubject || selectedSections.length === 0) {
      toast.error('Please select a subject and at least one section');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create assignments for each selected section
      const newAssignments = selectedSections.map(sectionId => ({
        _id: `assign-${Date.now()}-${sectionId}`,
        subjectId: selectedSubject,
        departmentId: selectedDepartment,
        classId: selectedClass,
        sectionIds: [sectionId]
      }));
      
      setSubjectAssignments(prev => [...prev, ...newAssignments]);
      toast.success('Subject assignment created successfully!');
      closeAssignmentModal();
    } catch (error) {
      toast.error('Failed to create assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSubjectAssignments(prev => 
        prev.filter(assignment => assignment._id !== assignmentId)
      );
      
      toast.success('Assignment deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete assignment');
    } finally {
      setIsLoading(false);
    }
  };

  // --- COMPUTED VALUES ---
  
  const filteredSubjects = useMemo(() => {
    if (!selectedDepartment) return subjects;
    return subjects.filter(subject => subject.departmentId === selectedDepartment);
  }, [subjects, selectedDepartment]);

  const filteredAssignments = useMemo(() => {
    let filtered = subjectAssignments;
    
    if (selectedDepartment) {
      filtered = filtered.filter(assignment => assignment.departmentId === selectedDepartment);
    }
    if (selectedClass) {
      filtered = filtered.filter(assignment => assignment.classId === selectedClass);
    }
    if (selectedSection) {
      filtered = filtered.filter(assignment => assignment.sectionIds.includes(selectedSection));
    }
    
    return filtered;
  }, [subjectAssignments, selectedDepartment, selectedClass, selectedSection]);

  const availableSections = useMemo(() => {
    // Return sections that are available for the selected department/class
    return sections;
  }, [sections, selectedDepartment, selectedClass]);

  // --- EFFECTS ---
  
  useEffect(() => {
    fetchAllData();
  }, []);

  // --- STYLES ---
  const inputBaseClass = "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none";
  const btnBaseClass = "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;
  const btnRedClass = `${btnBaseClass} bg-red-500 hover:bg-red-600 text-white`;

  // --- NAVIGATION HANDLER ---
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />
      
      {/* Navigation Component */}
      {!isAssignmentModalOpen && <OrgMenuNavigation currentPage="define-subjects" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isAssignmentModalOpen ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Define Subjects</h1>
              <p className="text-slate-500 text-sm">Assign subjects to sections within departments and classes</p>
            </div>
          </header>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className={inputBaseClass}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className={inputBaseClass}
                  disabled={!selectedDepartment}
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => handleSectionChange(e.target.value)}
                  className={inputBaseClass}
                  disabled={!selectedClass}
                >
                  <option value="">All Sections</option>
                  {sections.map(section => (
                    <option key={section._id} value={section._id}>{section.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Subjects List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Available Subjects</h2>
                  <p className="text-slate-500 text-sm">Click on a subject to assign it to sections</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-slate-600">Loading subjects...</span>
                </div>
              ) : !selectedDepartment ? (
                <div className="text-center py-8 text-slate-500">
                  <i className="fas fa-filter text-4xl mb-4 text-slate-300"></i>
                  <p className="font-medium mb-2">Please select a department to view subjects</p>
                  <p className="text-sm">Choose a Department above to see available subjects for assignment.</p>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <i className="fas fa-book text-4xl mb-4 text-slate-300"></i>
                  <p>No subjects found for the selected department.</p>
                  <p className="text-sm">Try selecting a different department or add subjects to this department.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSubjects.map(subject => {
                    const department = departments.find(d => d._id === subject.departmentId);
                    return (
                      <div key={subject._id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{subject.name}</h3>
                            <p className="text-sm text-slate-500">{subject.code}</p>
                            <p className="text-xs text-slate-400 mt-1">{department?.name}</p>
                          </div>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {subject.code}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                          {subject.description}
                        </p>
                        
                        <button
                          onClick={() => openAssignmentModal(subject._id)}
                          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                          disabled={!selectedDepartment || !selectedClass}
                        >
                          Assign to Sections
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Current Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Current Assignments</h2>
                  <p className="text-slate-500 text-sm">View and manage existing subject assignments</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!selectedDepartment || !selectedClass ? (
                <div className="text-center py-8 text-slate-500">
                  <i className="fas fa-filter text-4xl mb-4 text-slate-300"></i>
                  <p className="font-medium mb-2">Please select filters to view assignments</p>
                  <p className="text-sm">Choose a Department and Class above to see current subject assignments.</p>
                </div>
              ) : filteredAssignments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <i className="fas fa-book text-4xl mb-4 text-slate-300"></i>
                  <p>No assignments found for the selected filters.</p>
                  <p className="text-sm">Try adjusting the filters or assign subjects to sections.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAssignments.map(assignment => {
                    const subject = subjects.find(s => s._id === assignment.subjectId);
                    const department = departments.find(d => d._id === assignment.departmentId);
                    const classItem = classes.find(c => c._id === assignment.classId);
                    const assignmentSections = sections.filter(s => assignment.sectionIds.includes(s._id));
                    
                    return (
                      <div key={assignment._id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-slate-900">{subject?.name}</h3>
                              <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                {subject?.code}
                              </span>
                            </div>
                            
                            <div className="text-sm text-slate-600 mb-2">
                              <span className="font-medium">{department?.name}</span> → 
                              <span className="font-medium">{classItem?.name}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {assignmentSections.map(section => (
                                <span key={section._id} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                  {section.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteAssignment(assignment._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Assignment"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Assignment Modal */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Assign Subject to Sections</h2>
                  <p className="text-slate-500 text-sm">
                    {(() => {
                      const subject = subjects.find(s => s._id === selectedSubject);
                      const department = departments.find(d => d._id === selectedDepartment);
                      const classItem = classes.find(c => c._id === selectedClass);
                      return `${subject?.name} - ${department?.name} → ${classItem?.name}`;
                    })()}
                  </p>
                </div>
                <button
                  onClick={closeAssignmentModal}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Select Sections to Assign
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-md p-3 space-y-2">
                    {availableSections.map(section => (
                      <label key={section._id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSections.includes(section._id)}
                          onChange={() => handleSectionToggle(section._id)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-slate-700">{section.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {selectedSections.length} section(s) selected
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={closeAssignmentModal}
                  className={btnSlateClass}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAssignment}
                  className={btnIndigoClass}
                  disabled={selectedSections.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Assigning...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-link"></i>
                      Assign Subject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubjectAssign;

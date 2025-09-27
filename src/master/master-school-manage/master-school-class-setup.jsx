import React, { useState, useEffect } from 'react';
import Navigation from '../../components/master-user-components/master-dashboard-components/master-navigation/Navigation';
import {
  SetupStatusFilter,
  LocationFilter,
  SchoolsTable,
  ClassSetupSection,
  DepartmentModal,
  ClassModal,
  SectionModal,
  SubjectModal,
  DeleteConfirmationModal
} from '../../components/master-user-components/master-class-setup-components';

const MasterSchoolClassSetup = () => {
  // State for global entities
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // School selection states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  
  // Junction table for section-class assignments
  const [sectionClassAssignments, setSectionClassAssignments] = useState([]);

  // Modal states
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  
  // View modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewModalType, setViewModalType] = useState(''); // 'department', 'class', 'section', 'subject'
  const [viewingItem, setViewingItem] = useState(null);
  
  // Bulk operations states
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkOperationType, setBulkOperationType] = useState(''); // 'department', 'class', 'section', 'subject'
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Edit list modal states
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [editListType, setEditListType] = useState(''); // 'department', 'class', 'section', 'subject'
  const [editListItems, setEditListItems] = useState([]);

  // Form data states
  const [departmentFormData, setDepartmentFormData] = useState({ name: '', description: '' });
  const [classFormData, setClassFormData] = useState({ name: '', description: '' });
  const [sectionFormData, setSectionFormData] = useState({ name: '', description: '' });
  const [subjectFormData, setSubjectFormData] = useState({ 
    name: '', 
    code: '', 
    departmentId: '', 
    description: '',
    credits: '',
    type: 'core'
  });
  const [assignmentFormData, setAssignmentFormData] = useState({ 
    sectionIds: [], 
    classId: '', 
    departmentId: '' 
  });

  // File upload states for subjects
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Editing states
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Filter states for global entities
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  
  // Confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'department', 'class', 'section', 'subject', 'assignment'

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Mock data initialization
  useEffect(() => {
    // Initialize countries, states, and schools
    setCountries([
      { id: 1, name: 'India' },
      { id: 2, name: 'United States' },
      { id: 3, name: 'United Kingdom' }
    ]);

    setStates([
      { id: 1, name: 'Karnataka', countryId: 1 },
      { id: 2, name: 'Tamil Nadu', countryId: 1 },
      { id: 3, name: 'Maharashtra', countryId: 1 },
      { id: 4, name: 'California', countryId: 2 },
      { id: 5, name: 'Texas', countryId: 2 },
      { id: 6, name: 'England', countryId: 3 },
      { id: 7, name: 'Scotland', countryId: 3 }
    ]);

    setSchools([
      { id: 1, name: 'Bangalore International School', stateId: 1, countryId: 1, countryName: 'India', stateName: 'Karnataka' },
      { id: 2, name: 'Delhi Public School', stateId: 1, countryId: 1, countryName: 'India', stateName: 'Karnataka' },
      { id: 3, name: 'Chennai Central School', stateId: 2, countryId: 1, countryName: 'India', stateName: 'Tamil Nadu' },
      { id: 4, name: 'Mumbai High School', stateId: 3, countryId: 1, countryName: 'India', stateName: 'Maharashtra' },
      { id: 5, name: 'Stanford Elementary', stateId: 4, countryId: 2, countryName: 'United States', stateName: 'California' },
      { id: 6, name: 'Harvard Prep School', stateId: 4, countryId: 2, countryName: 'United States', stateName: 'California' },
      { id: 7, name: 'Oxford Academy', stateId: 6, countryId: 3, countryName: 'United Kingdom', stateName: 'England' }
    ]);

    // Initialize global departments
    setDepartments([
      { id: 1, name: 'Science', description: 'Science department' },
      { id: 2, name: 'Mathematics', description: 'Mathematics department' },
      { id: 3, name: 'Languages', description: 'Languages department' },
      { id: 4, name: 'Social Studies', description: 'Social Studies department' }
    ]);

    // Initialize global classes
    setClasses([
      { id: 1, name: 'Class 1', description: 'First grade' },
      { id: 2, name: 'Class 2', description: 'Second grade' },
      { id: 3, name: 'Class 3', description: 'Third grade' },
      { id: 4, name: 'Class 4', description: 'Fourth grade' },
      { id: 5, name: 'Class 5', description: 'Fifth grade' }
    ]);

    // Initialize global sections
    setSections([
      { id: 1, name: 'Section A', description: 'Section A' },
      { id: 2, name: 'Section B', description: 'Section B' },
      { id: 3, name: 'Section C', description: 'Section C' },
      { id: 4, name: 'Section D', description: 'Section D' }
    ]);

    // Initialize global subjects
    setSubjects([
      { id: 1, name: 'Physics', code: 'PHY101', departmentId: 1, departmentName: 'Science', description: 'Basic Physics', credits: '4', type: 'core' },
      { id: 2, name: 'Chemistry', code: 'CHE101', departmentId: 1, departmentName: 'Science', description: 'Basic Chemistry', credits: '4', type: 'core' },
      { id: 3, name: 'Algebra', code: 'MATH101', departmentId: 2, departmentName: 'Mathematics', description: 'Basic Algebra', credits: '3', type: 'core' },
      { id: 4, name: 'English', code: 'ENG101', departmentId: 3, departmentName: 'Languages', description: 'English Language', credits: '3', type: 'core' },
      { id: 5, name: 'History', code: 'HIS101', departmentId: 4, departmentName: 'Social Studies', description: 'World History', credits: '3', type: 'core' }
    ]);

    // Initialize section-class assignments (junction table)
    setSectionClassAssignments([
      { id: 1, sectionId: 1, classId: 1, departmentId: 1, sectionName: 'Section A', className: 'Class 1', departmentName: 'Science' },
      { id: 2, sectionId: 2, classId: 1, departmentId: 1, sectionName: 'Section B', className: 'Class 1', departmentName: 'Science' },
      { id: 3, sectionId: 1, classId: 2, departmentId: 2, sectionName: 'Section A', className: 'Class 2', departmentName: 'Mathematics' },
      { id: 4, sectionId: 3, classId: 2, departmentId: 2, sectionName: 'Section C', className: 'Class 2', departmentName: 'Mathematics' }
    ]);
  }, []);

  // Department handlers
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setDepartmentFormData({ name: '', description: '' });
    setIsDepartmentModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setDepartmentFormData({ name: department.name, description: department.description });
    setIsDepartmentModalOpen(true);
  };

  const handleDeleteDepartment = (department) => {
    setItemToDelete(department);
    setDeleteType('department');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDepartment = (id) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
    // Also remove related classes, sections, and subjects
    setClasses(prev => prev.filter(cls => cls.departmentId !== id));
    setSections(prev => prev.filter(sec => {
      const relatedClass = classes.find(cls => cls.id === sec.classId);
      return relatedClass && relatedClass.departmentId !== id;
    }));
    setSubjects(prev => prev.filter(sub => sub.departmentId !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleDepartmentSubmit = (e) => {
    e.preventDefault();
    if (editingDepartment) {
      setDepartments(prev => prev.map(dept => 
        dept.id === editingDepartment.id 
          ? { ...dept, ...departmentFormData }
          : dept
      ));
    } else {
      const newDepartment = {
        id: Date.now(),
        ...departmentFormData
      };
      setDepartments(prev => [...prev, newDepartment]);
    }
    setIsDepartmentModalOpen(false);
    setDepartmentFormData({ name: '', description: '' });
  };

  // Class handlers
  const handleAddClass = () => {
    setEditingClass(null);
    setClassFormData({ name: '', description: '' });
    setIsClassModalOpen(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setClassFormData({ 
      name: classItem.name, 
      description: classItem.description 
    });
    setIsClassModalOpen(true);
  };

  const handleDeleteClass = (classItem) => {
    setItemToDelete(classItem);
    setDeleteType('class');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteClass = (id) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
    // Also remove related sections
    setSections(prev => prev.filter(sec => sec.classId !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleClassSubmit = (e) => {
    e.preventDefault();
    if (editingClass) {
      setClasses(prev => prev.map(cls => 
        cls.id === editingClass.id 
          ? { ...cls, ...classFormData }
          : cls
      ));
    } else {
      const newClass = {
        id: Date.now(),
        ...classFormData
      };
      setClasses(prev => [...prev, newClass]);
    }
    setIsClassModalOpen(false);
    setClassFormData({ name: '', description: '' });
  };

  // Section handlers (now global)
  const handleAddSection = () => {
    setEditingSection(null);
    setSectionFormData({ name: '', description: '' });
    setIsSectionModalOpen(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setSectionFormData({ 
      name: section.name, 
      description: section.description 
    });
    setIsSectionModalOpen(true);
  };

  const handleDeleteSection = (section) => {
    setItemToDelete(section);
    setDeleteType('section');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSection = (id) => {
    setSections(prev => prev.filter(sec => sec.id !== id));
    // Also remove related assignments
    setSectionClassAssignments(prev => prev.filter(assignment => assignment.sectionId !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleSectionSubmit = (e) => {
    e.preventDefault();
    
    if (editingSection) {
      setSections(prev => prev.map(sec => 
        sec.id === editingSection.id 
          ? { ...sec, ...sectionFormData }
          : sec
      ));
    } else {
      const newSection = {
        id: Date.now(),
        ...sectionFormData
      };
      setSections(prev => [...prev, newSection]);
    }
    setIsSectionModalOpen(false);
    setSectionFormData({ name: '', description: '' });
  };

  // Assignment handlers (junction table)
  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setAssignmentFormData({ sectionIds: [], classId: '', departmentId: '' });
    setIsAssignmentModalOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setAssignmentFormData({ 
      sectionIds: [assignment.sectionId], 
      classId: assignment.classId, 
      departmentId: assignment.departmentId 
    });
    setIsAssignmentModalOpen(true);
  };

  const handleDeleteAssignment = (assignment) => {
    setItemToDelete(assignment);
    setDeleteType('assignment');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAssignment = (id) => {
    setSectionClassAssignments(prev => prev.filter(assignment => assignment.id !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    const classItem = classes.find(cls => cls.id === parseInt(assignmentFormData.classId));
    const department = departments.find(dept => dept.id === parseInt(assignmentFormData.departmentId));
    
    if (editingAssignment) {
      // For editing, update the single assignment
      const section = sections.find(sec => sec.id === parseInt(assignmentFormData.sectionIds[0]));
      setSectionClassAssignments(prev => prev.map(assignment => 
        assignment.id === editingAssignment.id 
          ? { 
              ...assignment, 
              sectionId: assignmentFormData.sectionIds[0],
              classId: assignmentFormData.classId,
              departmentId: assignmentFormData.departmentId,
              sectionName: section?.name || '',
              className: classItem?.name || '',
              departmentName: department?.name || ''
            }
          : assignment
      ));
    } else {
      // For creating, create multiple assignments for each selected section
      const newAssignments = assignmentFormData.sectionIds.map(sectionId => {
        const section = sections.find(sec => sec.id === parseInt(sectionId));
        return {
          id: Date.now() + Math.random(), // Unique ID for each assignment
          sectionId: parseInt(sectionId),
          classId: parseInt(assignmentFormData.classId),
          departmentId: parseInt(assignmentFormData.departmentId),
          sectionName: section?.name || '',
          className: classItem?.name || '',
          departmentName: department?.name || ''
        };
      });
      setSectionClassAssignments(prev => [...prev, ...newAssignments]);
    }
    setIsAssignmentModalOpen(false);
    setAssignmentFormData({ sectionIds: [], classId: '', departmentId: '' });
  };

  // Subject handlers
  const handleAddSubject = () => {
    setEditingSubject(null);
    setSubjectFormData({ 
      name: '', 
      code: '', 
      departmentId: '', 
      description: '',
      credits: '',
      type: 'core'
    });
    setIsSubjectModalOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectFormData({ 
      name: subject.name, 
      code: subject.code, 
      departmentId: subject.departmentId, 
      description: subject.description,
      credits: subject.credits,
      type: subject.type
    });
    setIsSubjectModalOpen(true);
  };

  const handleDeleteSubject = (subject) => {
    setItemToDelete(subject);
    setDeleteType('subject');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSubject = (id) => {
    setSubjects(prev => prev.filter(sub => sub.id !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    const department = departments.find(dept => dept.id === parseInt(subjectFormData.departmentId));
    if (editingSubject) {
      setSubjects(prev => prev.map(sub => 
        sub.id === editingSubject.id 
          ? { ...sub, ...subjectFormData, departmentName: department?.name || 'No Department' }
          : sub
      ));
    } else {
      const newSubject = {
        id: Date.now(),
        ...subjectFormData,
        departmentName: department?.name || 'No Department'
      };
      setSubjects(prev => [...prev, newSubject]);
    }
    setIsSubjectModalOpen(false);
    setSubjectFormData({ 
      name: '', 
      code: '', 
      departmentId: '', 
      description: '',
      credits: '',
      type: 'core'
    });
  };

  // CSV download and upload handlers
  const handleDownloadTemplate = () => {
    const csvContent = "Subject Name,Subject Code,Department,Description,Credits,Type\nPhysics,PHY101,Science,Basic Physics,4,core\nChemistry,CHE101,Science,Basic Chemistry,4,core\nMathematics,MATH101,Mathematics,Basic Math,3,core";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subjects_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      setIsUploading(true);
      
      // Simulate CSV processing
      setTimeout(() => {
        const newSubjects = [
          { id: Date.now() + 1, name: 'Biology', code: 'BIO101', departmentName: 'Science', description: 'Basic Biology', credits: '4', type: 'core' },
          { id: Date.now() + 2, name: 'History', code: 'HIS101', departmentName: 'No Department', description: 'World History', credits: '3', type: 'core' }
        ];
        setSubjects(prev => [...prev, ...newSubjects]);
        setIsUploading(false);
        setCsvFile(null);
        alert('Subjects uploaded successfully!');
      }, 2000);
    }
  };

  // School selection handlers
  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedState('');
    setSelectedSchool('');
  };

  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    setSelectedSchool('');
  };

  const handleSchoolChange = (schoolId) => {
    setSelectedSchool(schoolId);
  };

  // Helper functions to get filtered states and schools
  const getFilteredStates = () => {
    if (!selectedCountry) return [];
    return states.filter(state => state.countryId === parseInt(selectedCountry));
  };

  const getFilteredSchools = () => {
    if (!selectedState) return [];
    return schools.filter(school => school.stateId === parseInt(selectedState));
  };

  const getSelectedSchoolInfo = () => {
    if (!selectedSchool) return null;
    return schools.find(school => school.id === parseInt(selectedSchool));
  };

  // Filter handlers for global entities
  const handleDepartmentFilter = (departmentId) => {
    setSelectedDepartment(departmentId);
    setSelectedClass('');
    setSelectedSection('');
  };

  const handleClassFilter = (classId) => {
    setSelectedClass(classId);
    setSelectedSection('');
  };

  const handleSectionFilter = (sectionId) => {
    setSelectedSection(sectionId);
  };

  // Get filtered assignments based on selections
  const getFilteredAssignments = () => {
    let filtered = sectionClassAssignments;
    
    if (selectedDepartment) {
      filtered = filtered.filter(assignment => assignment.departmentId === parseInt(selectedDepartment));
    }
    
    if (selectedClass) {
      filtered = filtered.filter(assignment => assignment.classId === parseInt(selectedClass));
    }
    
    if (selectedSection) {
      filtered = filtered.filter(assignment => assignment.sectionId === parseInt(selectedSection));
    }
    
    return filtered;
  };

  const filteredAssignments = getFilteredAssignments();

  // View handlers
  const handleViewEntity = (type, item) => {
    setViewModalType(type);
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const handleEditEntity = (type, items) => {
    setEditListType(type);
    setEditListItems(items);
    setIsEditListModalOpen(true);
  };

  const handleDeleteEntity = (type, item) => {
    switch (type) {
      case 'department':
        handleDeleteDepartment(item);
        break;
      case 'class':
        handleDeleteClass(item);
        break;
      case 'section':
        handleDeleteSection(item);
        break;
      case 'subject':
        handleDeleteSubject(item);
        break;
      default:
        break;
    }
  };


  const handleBulkDelete = (type) => {
    setBulkOperationType(type);
    setSelectedItems([]);
    setIsBulkDeleteModalOpen(true);
  };

  const getEntityList = (type) => {
    switch (type) {
      case 'department':
        return departments;
      case 'class':
        return classes;
      case 'section':
        return sections;
      case 'subject':
        return subjects;
      default:
        return [];
    }
  };


  const handleBulkDeleteSubmit = (e) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      alert('Please select at least one item to delete');
      return;
    }

    // Perform bulk delete based on entity type
    switch (bulkOperationType) {
      case 'department':
        setDepartments(prev => prev.filter(dept => !selectedItems.includes(dept.id)));
        // Also remove related assignments
        setSectionClassAssignments(prev => prev.filter(assignment => !selectedItems.includes(assignment.departmentId)));
        break;
      case 'class':
        setClasses(prev => prev.filter(cls => !selectedItems.includes(cls.id)));
        // Also remove related assignments
        setSectionClassAssignments(prev => prev.filter(assignment => !selectedItems.includes(assignment.classId)));
        break;
      case 'section':
        setSections(prev => prev.filter(sec => !selectedItems.includes(sec.id)));
        // Also remove related assignments
        setSectionClassAssignments(prev => prev.filter(assignment => !selectedItems.includes(assignment.sectionId)));
        break;
      case 'subject':
        setSubjects(prev => prev.filter(sub => !selectedItems.includes(sub.id)));
        break;
      default:
        break;
    }

    alert(`Successfully deleted ${selectedItems.length} ${bulkOperationType}(s)`);
    setIsBulkDeleteModalOpen(false);
    setSelectedItems([]);
  };

  // Navigation handler
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  // Base styles
  const inputBaseClass = "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed";
  const btnBaseClass = "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnTealClass = `${btnBaseClass} bg-teal-500 hover:bg-teal-600 text-white`;
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnRoseClass = `${btnBaseClass} bg-rose-500 hover:bg-rose-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;

  // Check if any modal is open
  const isAnyModalOpen = isDepartmentModalOpen || isClassModalOpen || isSectionModalOpen || isSubjectModalOpen || isAssignmentModalOpen || isViewModalOpen || isEditListModalOpen || isBulkDeleteModalOpen;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      {/* Navigation Component - hidden when modal is open */}
      {!isAnyModalOpen && <Navigation currentPage="school-class-setup" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isAnyModalOpen ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">School Class Setup</h1>
              <p className="text-slate-500 text-sm">Select a school first, then manage departments, classes, sections, subjects, and assignments</p>
            </div>
          </header>

          {/* School Selection Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Select School</h2>
                <p className="text-slate-500 text-sm">Choose country, state, and school to manage class setup</p>
              </div>
              {selectedSchool && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <span className="text-green-800 font-medium">
                      {getSelectedSchoolInfo()?.name}
                    </span>
                  </div>
                  <p className="text-green-600 text-sm">
                    {getSelectedSchoolInfo()?.stateName}, {getSelectedSchoolInfo()?.countryName}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country *
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className={inputBaseClass}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className={inputBaseClass}
                  disabled={!selectedCountry}
                  required
                >
                  <option value="">Select State</option>
                  {getFilteredStates().map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  School *
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => handleSchoolChange(e.target.value)}
                  className={inputBaseClass}
                  disabled={!selectedState}
                  required
                >
                  <option value="">Select School</option>
                  {getFilteredSchools().map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {!selectedSchool && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <i className="fas fa-info-circle text-amber-600"></i>
                  <div>
                    <h3 className="font-semibold text-amber-900">School Selection Required</h3>
                    <p className="text-sm text-amber-700">Please select a country, state, and school to manage class setup and assignments.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Global Entity Management Tabs - Only show when school is selected */}
          {selectedSchool && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Entity Management</h2>
                <p className="text-slate-500 text-sm">Manage departments, classes, sections, and subjects for {getSelectedSchoolInfo()?.name}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <span className="text-blue-800 text-sm font-medium">
                  School: {getSelectedSchoolInfo()?.name}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Departments Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-blue-900">Departments</h3>
                  <i className="fas fa-building text-blue-600"></i>
                </div>
                <p className="text-blue-700 text-sm mb-3">{departments.length} departments</p>
                <div className="space-y-2">
                  <button
                    onClick={handleAddDepartment}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add Department
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewEntity('department', departments)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="View all departments"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={() => handleEditEntity('department', departments)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Edit departments"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleAddDepartment()}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Add new department"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button
                      onClick={() => handleBulkDelete('department')}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Bulk delete departments"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Classes Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-green-900">Classes</h3>
                  <i className="fas fa-graduation-cap text-green-600"></i>
                </div>
                <p className="text-green-700 text-sm mb-3">{classes.length} classes</p>
                <div className="space-y-2">
                  <button
                    onClick={handleAddClass}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add Class
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewEntity('class', classes)}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="View all classes"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={() => handleEditEntity('class', classes)}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Edit classes"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleAddClass()}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Add new class"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button
                      onClick={() => handleBulkDelete('class')}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Bulk delete classes"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sections Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-purple-900">Sections</h3>
                  <i className="fas fa-layer-group text-purple-600"></i>
                </div>
                <p className="text-purple-700 text-sm mb-3">{sections.length} sections</p>
                <div className="space-y-2">
                  <button
                    onClick={handleAddSection}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add Section
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewEntity('section', sections)}
                      className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="View all sections"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={() => handleEditEntity('section', sections)}
                      className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Edit sections"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleAddSection()}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Add new section"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button
                      onClick={() => handleBulkDelete('section')}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Bulk delete sections"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Subjects Card */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-orange-900">Subjects</h3>
                  <i className="fas fa-book text-orange-600"></i>
                </div>
                <p className="text-orange-700 text-sm mb-3">{subjects.length} subjects</p>
                <div className="space-y-2">
                  <button
                    onClick={handleAddSubject}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add Subject
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewEntity('subject', subjects)}
                      className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="View all subjects"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={() => handleEditEntity('subject', subjects)}
                      className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Edit subjects"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleAddSubject()}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Add new subject"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button
                      onClick={() => handleBulkDelete('subject')}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      title="Bulk delete subjects"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Assignment Management - Only show when school is selected */}
          {selectedSchool && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Section-Class Assignments</h2>
                <p className="text-slate-500 text-sm">Assign sections to classes under specific departments for {getSelectedSchoolInfo()?.name}</p>
              </div>
              <button
                onClick={handleAddAssignment}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Add Assignment
              </button>
            </div>

            {/* Assignment Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => handleDepartmentFilter(e.target.value)}
                  className={inputBaseClass}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassFilter(e.target.value)}
                  className={inputBaseClass}
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => handleSectionFilter(e.target.value)}
                  className={inputBaseClass}
                >
                  <option value="">All Sections</option>
                  {sections.map(sec => (
                    <option key={sec.id} value={sec.id}>{sec.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assignments Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    <th className="p-3 text-left font-semibold">Section</th>
                    <th className="p-3 text-left font-semibold">Class</th>
                    <th className="p-3 text-left font-semibold">Department</th>
                    <th className="p-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map(assignment => (
                    <tr key={assignment.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-3">{assignment.sectionName}</td>
                      <td className="p-3">{assignment.className}</td>
                      <td className="p-3">{assignment.departmentName}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditAssignment(assignment)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Assignment"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Assignment"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAssignments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center p-8 text-slate-500">
                        No assignments found. Create your first assignment to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <DepartmentModal 
        isOpen={isDepartmentModalOpen}
        editingDepartment={editingDepartment}
        departmentFormData={departmentFormData}
        setDepartmentFormData={setDepartmentFormData}
        onSubmit={handleDepartmentSubmit}
        onClose={() => setIsDepartmentModalOpen(false)}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />

      <ClassModal 
        isOpen={isClassModalOpen}
        editingClass={editingClass}
        classFormData={classFormData}
        setClassFormData={setClassFormData}
        onSubmit={handleClassSubmit}
        onClose={() => setIsClassModalOpen(false)}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />

      <SectionModal 
        isOpen={isSectionModalOpen}
        editingSection={editingSection}
        sectionFormData={sectionFormData}
        setSectionFormData={setSectionFormData}
        onSubmit={handleSectionSubmit}
        onClose={() => setIsSectionModalOpen(false)}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />

      <SubjectModal 
        isOpen={isSubjectModalOpen}
        editingSubject={editingSubject}
        subjectFormData={subjectFormData}
        setSubjectFormData={setSubjectFormData}
        onSubmit={handleSubjectSubmit}
        onClose={() => setIsSubjectModalOpen(false)}
        departments={departments}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />

      {/* Assignment Modal - Simple form for creating assignments */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingAssignment ? 'Edit Assignment' : 'Add Assignment'}
                </h2>
                <button
                  onClick={() => setIsAssignmentModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                  <select
                    value={assignmentFormData.departmentId}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                    className={inputBaseClass}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Class *</label>
                  <select
                    value={assignmentFormData.classId}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, classId: e.target.value }))}
                    className={inputBaseClass}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sections *</label>
                  <div className="border border-slate-200 rounded-md">
                    {/* Select All Option */}
                    <div className="p-2 border-b border-slate-200 bg-slate-50">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={sections.length > 0 && assignmentFormData.sectionIds.length === sections.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignmentFormData(prev => ({ 
                                ...prev, 
                                sectionIds: sections.map(sec => sec.id)
                              }));
                            } else {
                              setAssignmentFormData(prev => ({ 
                                ...prev, 
                                sectionIds: []
                              }));
                            }
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Select All Sections</span>
                      </label>
                    </div>
                    
                    {/* Scrollable Sections List */}
                    <div className="max-h-40 overflow-y-auto p-2">
                      {sections.length > 0 ? (
                        <div className="space-y-2">
                          {sections.map((sec) => (
                            <label key={sec.id} className="flex items-center space-x-2 hover:bg-slate-50 p-1 rounded">
                              <input
                                type="checkbox"
                                checked={assignmentFormData.sectionIds.includes(sec.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setAssignmentFormData(prev => ({ 
                                      ...prev, 
                                      sectionIds: [...prev.sectionIds, sec.id] 
                                    }));
                                  } else {
                                    setAssignmentFormData(prev => ({ 
                                      ...prev, 
                                      sectionIds: prev.sectionIds.filter(id => id !== sec.id) 
                                    }));
                                  }
                                }}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm text-slate-700">{sec.name}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500 text-center py-2">
                          No sections available. Please add sections first.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAssignmentModalOpen(false)}
                    className={btnSlateClass}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={btnIndigoClass}
                  >
                    {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  View All {viewModalType.charAt(0).toUpperCase() + viewModalType.slice(1)}s
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600">
                      <th className="p-3 text-left font-semibold">Name</th>
                      <th className="p-3 text-left font-semibold">Description</th>
                      {viewModalType === 'subject' && (
                        <>
                          <th className="p-3 text-left font-semibold">Code</th>
                          <th className="p-3 text-left font-semibold">Department</th>
                          <th className="p-3 text-left font-semibold">Credits</th>
                          <th className="p-3 text-left font-semibold">Type</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {viewingItem && viewingItem.map((item, index) => (
                      <tr key={item.id || index} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3 text-slate-600">{item.description || '-'}</td>
                        {viewModalType === 'subject' && (
                          <>
                            <td className="p-3 text-slate-600">{item.code}</td>
                            <td className="p-3 text-slate-600">{item.departmentName}</td>
                            <td className="p-3 text-slate-600">{item.credits}</td>
                            <td className="p-3 text-slate-600 capitalize">{item.type}</td>
                          </>
                        )}
                      </tr>
                    ))}
                    {(!viewingItem || viewingItem.length === 0) && (
                      <tr>
                        <td colSpan={viewModalType === 'subject' ? 6 : 2} className="text-center p-8 text-slate-500">
                          No {viewModalType}s found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit List Modal */}
      {isEditListModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Edit {editListType.charAt(0).toUpperCase() + editListType.slice(1)}s
                </h2>
                <button
                  onClick={() => setIsEditListModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              <div className="space-y-4">
                {editListItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <i className="fas fa-inbox text-4xl mb-4"></i>
                    <p>No {editListType}s found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editListItems.map((item, index) => (
                      <div key={item.id || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{item.name}</h3>
                          <p className="text-sm text-slate-600">{item.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsEditListModalOpen(false);
                              // Call the appropriate edit handler based on type
                              switch (editListType) {
                                case 'department':
                                  handleEditDepartment(item);
                                  break;
                                case 'class':
                                  handleEditClass(item);
                                  break;
                                case 'section':
                                  handleEditSection(item);
                                  break;
                                case 'subject':
                                  handleEditSubject(item);
                                  break;
                                default:
                                  break;
                              }
                            }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit this item"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => {
                              // Call the appropriate delete handler based on type
                              switch (editListType) {
                                case 'department':
                                  handleDeleteDepartment(item);
                                  break;
                                case 'class':
                                  handleDeleteClass(item);
                                  break;
                                case 'section':
                                  handleDeleteSection(item);
                                  break;
                                case 'subject':
                                  handleDeleteSubject(item);
                                  break;
                                default:
                                  break;
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete this item"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsEditListModalOpen(false)}
                  className={btnSlateClass}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}

      {/* Bulk Delete Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Bulk Delete {bulkOperationType.charAt(0).toUpperCase() + bulkOperationType.slice(1)}s
                </h2>
                <button
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              <form onSubmit={handleBulkDeleteSubmit} className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-exclamation-triangle text-red-500 text-lg"></i>
                    <div>
                      <h3 className="font-semibold text-red-900">Warning</h3>
                      <p className="text-sm text-red-700">This action cannot be undone. Selected items will be permanently deleted.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Select {bulkOperationType}s to delete:
                  </label>
                  <div className="border border-slate-200 rounded-md max-h-60 overflow-y-auto">
                    {getEntityList(bulkOperationType).map((item, index) => (
                      <label key={item.id || index} className="flex items-center space-x-3 p-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(prev => [...prev, item.id]);
                            } else {
                              setSelectedItems(prev => prev.filter(id => id !== item.id));
                            }
                          }}
                          className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{item.name}</div>
                          <div className="text-sm text-slate-500">{item.description || 'No description'}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBulkDeleteModalOpen(false)}
                    className={btnSlateClass}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={selectedItems.length === 0}
                    className={`${btnRoseClass} ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Delete Selected ({selectedItems.length})
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal 
        isOpen={showDeleteConfirm}
        itemToDelete={itemToDelete}
        deleteType={deleteType}
        onConfirm={() => {
          if (deleteType === 'department') confirmDeleteDepartment(itemToDelete.id);
          if (deleteType === 'class') confirmDeleteClass(itemToDelete.id);
          if (deleteType === 'section') confirmDeleteSection(itemToDelete.id);
          if (deleteType === 'subject') confirmDeleteSubject(itemToDelete.id);
          if (deleteType === 'assignment') confirmDeleteAssignment(itemToDelete.id);
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
          setDeleteType('');
        }}
      />
    </div>
  );
};

export default MasterSchoolClassSetup;

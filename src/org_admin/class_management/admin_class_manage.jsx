import { useState, useEffect, useMemo } from 'react';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import {
  DepartmentModal,
  ClassModal,
  SectionModal,
  SubjectModal,
  DeleteConfirmationModal
} from '../../components/master-user-components/master-class-setup-components';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AdminClassManage = () => {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);
  
  // State for global entities
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
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
  
  // Sections view modal state
  const [isSectionsViewModalOpen, setIsSectionsViewModalOpen] = useState(false);
  const [viewingSections, setViewingSections] = useState([]);
  const [viewingDepartment, setViewingDepartment] = useState(null);
  const [viewingClass, setViewingClass] = useState(null);
  
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
  const [isUploading, setIsUploading] = useState(false);

  // Editing states
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Filter states for assignments
  const [assignmentFilters, setAssignmentFilters] = useState({
    departmentId: '',
    classId: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    departmentId: '',
    classId: ''
  });
  
  // Confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'department', 'class', 'section', 'subject', 'assignment'

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState({
    departments: false,
    classes: false,
    sections: false,
    subjects: false,
    assignments: false
  });

  // Current organization ID (would come from context/auth in real app)
  const [currentOrganizationId, setCurrentOrganizationId] = useState('org-123');

  // --- API CALLS FOR ENTITIES ---
  
  const fetchDepartments = async () => {
    if (!currentOrganizationId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, departments: true }));
      
      // Dummy data for departments (School Levels)
      const dummyDepartments = [
        { _id: 'dept-1', name: 'Nursery', description: 'Nursery Level' },
        { _id: 'dept-2', name: 'Lower Primary', description: 'Lower Primary Level (Grades 1-5)' },
        { _id: 'dept-3', name: 'Upper Primary', description: 'Upper Primary Level (Grades 6-7)' },
        { _id: 'dept-4', name: 'High School', description: 'High School Level (Grades 8-10)' },
        { _id: 'dept-5', name: 'Higher Secondary', description: 'Higher Secondary Level (Grades 11-12)' }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setDepartments(dummyDepartments);
      
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    } finally {
      setLoadingEntities(prev => ({ ...prev, departments: false }));
    }
  };

  const fetchClasses = async () => {
    if (!currentOrganizationId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, classes: true }));
      
      // Dummy data for classes
      const dummyClasses = [
        // Nursery
        { _id: 'class-1', name: 'LKG', description: 'Lower Kindergarten', departmentId: 'dept-1' },
        { _id: 'class-2', name: 'UKG', description: 'Upper Kindergarten', departmentId: 'dept-1' },
        // Lower Primary
        { _id: 'class-3', name: 'Grade 1', description: 'First Grade', departmentId: 'dept-2' },
        { _id: 'class-4', name: 'Grade 2', description: 'Second Grade', departmentId: 'dept-2' },
        { _id: 'class-5', name: 'Grade 3', description: 'Third Grade', departmentId: 'dept-2' },
        { _id: 'class-6', name: 'Grade 4', description: 'Fourth Grade', departmentId: 'dept-2' },
        { _id: 'class-7', name: 'Grade 5', description: 'Fifth Grade', departmentId: 'dept-2' },
        // Upper Primary
        { _id: 'class-8', name: 'Grade 6', description: 'Sixth Grade', departmentId: 'dept-3' },
        { _id: 'class-9', name: 'Grade 7', description: 'Seventh Grade', departmentId: 'dept-3' },
        // High School
        { _id: 'class-10', name: 'Grade 8', description: 'Eighth Grade', departmentId: 'dept-4' },
        { _id: 'class-11', name: 'Grade 9', description: 'Ninth Grade', departmentId: 'dept-4' },
        { _id: 'class-12', name: 'Grade 10', description: 'Tenth Grade', departmentId: 'dept-4' },
        // Higher Secondary
        { _id: 'class-13', name: 'Grade 11 Bio Math', description: 'Biology with Mathematics Stream', departmentId: 'dept-5' },
        { _id: 'class-14', name: 'Grade 11 Bio Language', description: 'Biology with Language Stream', departmentId: 'dept-5' },
        { _id: 'class-15', name: 'Grade 11 Computer Maths', description: 'Computer Science with Mathematics Stream', departmentId: 'dept-5' },
        { _id: 'class-16', name: 'Grade 11 Commerce', description: 'Commerce Stream', departmentId: 'dept-5' },
        { _id: 'class-17', name: 'Grade 12 Bio Math', description: 'Biology with Mathematics Stream', departmentId: 'dept-5' },
        { _id: 'class-18', name: 'Grade 12 Bio Language', description: 'Biology with Language Stream', departmentId: 'dept-5' },
        { _id: 'class-19', name: 'Grade 12 Computer Maths', description: 'Computer Science with Mathematics Stream', departmentId: 'dept-5' },
        { _id: 'class-20', name: 'Grade 12 Commerce', description: 'Commerce Stream', departmentId: 'dept-5' }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      setClasses(dummyClasses);
      
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    } finally {
      setLoadingEntities(prev => ({ ...prev, classes: false }));
    }
  };

  const fetchSections = async () => {
    if (!currentOrganizationId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, sections: true }));
      
      // Dummy data for sections (All classes have Section A and B)
      const dummySections = [
        { _id: 'section-1', name: 'Section A', description: 'Section A' },
        { _id: 'section-2', name: 'Section B', description: 'Section B' }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      setSections(dummySections);
      
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
    } finally {
      setLoadingEntities(prev => ({ ...prev, sections: false }));
    }
  };

  const fetchSubjects = async () => {
    if (!currentOrganizationId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, subjects: true }));
      
      // Dummy data for subjects
      const dummySubjects = [
        // Lower Primary subjects (Grades 1-5)
        { _id: 'subject-1', name: 'English', code: 'ENG', departmentId: 'dept-2', description: 'English Language', credits: '4', type: 'core' },
        { _id: 'subject-2', name: 'Malayalam', code: 'MAL', departmentId: 'dept-2', description: 'Malayalam Language', credits: '4', type: 'core' },
        { _id: 'subject-3', name: 'Mathematics', code: 'MATH', departmentId: 'dept-2', description: 'Mathematics', credits: '5', type: 'core' },
        { _id: 'subject-4', name: 'Science', code: 'SCI', departmentId: 'dept-2', description: 'General Science', credits: '4', type: 'core' },
        { _id: 'subject-5', name: 'Social Science', code: 'SOC', departmentId: 'dept-2', description: 'Social Studies', credits: '3', type: 'core' },
        
        // Upper Primary subjects (Grades 6-7)
        { _id: 'subject-6', name: 'English', code: 'ENG', departmentId: 'dept-3', description: 'English Language', credits: '4', type: 'core' },
        { _id: 'subject-7', name: 'Malayalam', code: 'MAL', departmentId: 'dept-3', description: 'Malayalam Language', credits: '4', type: 'core' },
        { _id: 'subject-8', name: 'Mathematics', code: 'MATH', departmentId: 'dept-3', description: 'Mathematics', credits: '5', type: 'core' },
        { _id: 'subject-9', name: 'Science', code: 'SCI', departmentId: 'dept-3', description: 'General Science', credits: '4', type: 'core' },
        { _id: 'subject-10', name: 'Social Science', code: 'SOC', departmentId: 'dept-3', description: 'Social Studies', credits: '3', type: 'core' },
        
        // High School subjects (Grades 8-10)
        { _id: 'subject-11', name: 'English', code: 'ENG', departmentId: 'dept-4', description: 'English Language', credits: '4', type: 'core' },
        { _id: 'subject-12', name: 'Malayalam', code: 'MAL', departmentId: 'dept-4', description: 'Malayalam Language', credits: '4', type: 'core' },
        { _id: 'subject-13', name: 'Mathematics', code: 'MATH', departmentId: 'dept-4', description: 'Mathematics', credits: '5', type: 'core' },
        { _id: 'subject-14', name: 'Science', code: 'SCI', departmentId: 'dept-4', description: 'General Science', credits: '4', type: 'core' },
        { _id: 'subject-15', name: 'Social Science', code: 'SOC', departmentId: 'dept-4', description: 'Social Studies', credits: '3', type: 'core' },
        
        // Higher Secondary subjects (Grades 11-12)
        { _id: 'subject-16', name: 'Physics', code: 'PHY', departmentId: 'dept-5', description: 'Physics', credits: '5', type: 'core' },
        { _id: 'subject-17', name: 'Chemistry', code: 'CHEM', departmentId: 'dept-5', description: 'Chemistry', credits: '5', type: 'core' },
        { _id: 'subject-18', name: 'Biology', code: 'BIO', departmentId: 'dept-5', description: 'Biology', credits: '5', type: 'core' },
        { _id: 'subject-19', name: 'Mathematics', code: 'MATH', departmentId: 'dept-5', description: 'Mathematics', credits: '5', type: 'core' },
        { _id: 'subject-20', name: 'English', code: 'ENG', departmentId: 'dept-5', description: 'English Language', credits: '4', type: 'core' },
        { _id: 'subject-21', name: 'Malayalam', code: 'MAL', departmentId: 'dept-5', description: 'Malayalam Language', credits: '4', type: 'core' },
        { _id: 'subject-22', name: 'Computer Science', code: 'CS', departmentId: 'dept-5', description: 'Computer Science', credits: '5', type: 'core' },
        { _id: 'subject-23', name: 'Accountancy', code: 'ACC', departmentId: 'dept-5', description: 'Accountancy', credits: '5', type: 'core' },
        { _id: 'subject-24', name: 'Business Studies', code: 'BS', departmentId: 'dept-5', description: 'Business Studies', credits: '5', type: 'core' },
        { _id: 'subject-25', name: 'Economics', code: 'ECON', departmentId: 'dept-5', description: 'Economics', credits: '4', type: 'core' }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setSubjects(dummySubjects);
      
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    } finally {
      setLoadingEntities(prev => ({ ...prev, subjects: false }));
    }
  };

  const fetchAssignments = async () => {
    if (!currentOrganizationId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, assignments: true }));
      
      // Dummy data for section-class assignments
      const dummyAssignments = [
        // Lower Primary
        { _id: 'assign-1', departmentId: 'dept-2', classId: 'class-3', sectionIds: ['section-1'], sectionName: 'Section A' },
        { _id: 'assign-2', departmentId: 'dept-2', classId: 'class-3', sectionIds: ['section-2'], sectionName: 'Section B' },
        { _id: 'assign-3', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1'], sectionName: 'Section A' },
        { _id: 'assign-4', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-2'], sectionName: 'Section B' },
        
        // Upper Primary - Grade 6
        { _id: 'assign-5', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1'], sectionName: 'Section A' },
        { _id: 'assign-6', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-2'], sectionName: 'Section B' },
        
        // Upper Primary - Grade 7
        { _id: 'assign-7', departmentId: 'dept-3', classId: 'class-9', sectionIds: ['section-1'], sectionName: 'Section A' },
        { _id: 'assign-8', departmentId: 'dept-3', classId: 'class-9', sectionIds: ['section-2'], sectionName: 'Section B' },
        
        // High School - Grade 10
        { _id: 'assign-9', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1'], sectionName: 'Section A' },
        { _id: 'assign-10', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-2'], sectionName: 'Section B' },
        
        // Higher Secondary - Grade 11 Bio Math
        { _id: 'assign-11', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1'], sectionName: 'Section A' },
        { _id: 'assign-12', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-2'], sectionName: 'Section B' },
        
        // Higher Secondary - Grade 12 Bio Math
        { _id: 'assign-13', departmentId: 'dept-5', classId: 'class-17', sectionIds: ['section-1'], sectionName: 'Section A' },
        { _id: 'assign-14', departmentId: 'dept-5', classId: 'class-17', sectionIds: ['section-2'], sectionName: 'Section B' }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSectionClassAssignments(dummyAssignments);
      
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoadingEntities(prev => ({ ...prev, assignments: false }));
    }
  };

  // Fetch all data when organization is selected
  const fetchAllData = async () => {
    if (!currentOrganizationId) return;
    
    await Promise.all([
      fetchDepartments(),
      fetchClasses(),
      fetchSections(),
      fetchSubjects(),
      fetchAssignments()
    ]);
  };

  // --- MODAL HANDLERS ---
  
  const openModal = (modalType, item = null) => {
    switch (modalType) {
      case 'department':
        if (item) {
          setEditingDepartment(item);
          setDepartmentFormData({
            name: item.name || '',
            description: item.description || ''
          });
        } else {
          setEditingDepartment(null);
          setDepartmentFormData({ name: '', description: '' });
        }
        setIsDepartmentModalOpen(true);
        break;
        
      case 'class':
        if (item) {
          setEditingClass(item);
          setClassFormData({
            name: item.name || '',
            description: item.description || ''
          });
        } else {
          setEditingClass(null);
          setClassFormData({ name: '', description: '' });
        }
        setIsClassModalOpen(true);
        break;
        
      case 'section':
        if (item) {
          setEditingSection(item);
          setSectionFormData({
            name: item.name || '',
            description: item.description || ''
          });
        } else {
          setEditingSection(null);
          setSectionFormData({ name: '', description: '' });
        }
        setIsSectionModalOpen(true);
        break;
        
      case 'subject':
        if (item) {
          setEditingSubject(item);
          setSubjectFormData({
            name: item.name || '',
            code: item.code || '',
            departmentId: item.departmentId || '',
            description: item.description || '',
            credits: item.credits || '',
            type: item.type || 'core'
          });
        } else {
          setEditingSubject(null);
          setSubjectFormData({
            name: '', 
            code: '', 
            departmentId: '', 
            description: '',
            credits: '',
            type: 'core'
          });
        }
        setIsSubjectModalOpen(true);
        break;
        
      case 'assignment':
        if (item) {
          setEditingAssignment(item);
          setAssignmentFormData({
            sectionIds: item.sectionIds || [],
            classId: item.classId || '',
            departmentId: item.departmentId || ''
          });
        } else {
          setEditingAssignment(null);
          setAssignmentFormData({
            sectionIds: [], 
            classId: '', 
            departmentId: '' 
          });
        }
        setIsAssignmentModalOpen(true);
        break;
    }
  };

  const closeModal = (modalType) => {
    switch (modalType) {
      case 'department':
        setIsDepartmentModalOpen(false);
        setEditingDepartment(null);
        setDepartmentFormData({ name: '', description: '' });
        break;
      case 'class':
        setIsClassModalOpen(false);
        setEditingClass(null);
        setClassFormData({ name: '', description: '' });
        break;
      case 'section':
        setIsSectionModalOpen(false);
        setEditingSection(null);
        setSectionFormData({ name: '', description: '' });
        break;
      case 'subject':
        setIsSubjectModalOpen(false);
        setEditingSubject(null);
        setSubjectFormData({ name: '', code: '', departmentId: '', description: '', credits: '', type: 'core' });
        break;
      case 'assignment':
        setIsAssignmentModalOpen(false);
        setEditingAssignment(null);
        setAssignmentFormData({ sectionIds: [], classId: '', departmentId: '' });
        break;
    }
  };

  // --- VIEW MODAL HANDLERS ---
  
  const handleViewSections = (departmentId, classId) => {
    const department = departments.find(d => d._id === departmentId);
    const classItem = classes.find(c => c._id === classId);
    
    if (!department || !classItem) return;
    
    // Find all assignments for this department-class combination
    const relevantAssignments = sectionClassAssignments.filter(assignment => 
      assignment.departmentId === departmentId && assignment.classId === classId
    );
    
    setViewingSections(relevantAssignments);
    setViewingDepartment(department);
    setViewingClass(classItem);
    setIsSectionsViewModalOpen(true);
  };

  // --- DELETE HANDLERS ---
  
  const handleDeleteAssignment = (assignment) => {
    setItemToDelete(assignment);
    setDeleteType('assignment');
    setShowDeleteConfirm(true);
  };

  // --- FILTER HANDLERS ---
  
  const handleFilterChange = (filterType, value) => {
    setAssignmentFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...assignmentFilters });
  };

  const clearFilters = () => {
    setAssignmentFilters({ departmentId: '', classId: '' });
    setAppliedFilters({ departmentId: '', classId: '' });
  };

  // --- NAVIGATION HANDLERS ---
  
  const navigateToSubjectAssign = (departmentId, classId) => {
    // Store the selected department and class in localStorage for the subject assign page
    localStorage.setItem('preselectedDepartment', departmentId);
    localStorage.setItem('preselectedClass', classId);
    
    // Navigate to the subject assign page
    window.location.href = '/admin/classrooms/subjects';
  };

  // --- HELPER FUNCTIONS ---
  
  const getGroupedAssignments = () => {
    const grouped = {};
    
    // Filter assignments based on applied filters
    const filteredAssignments = sectionClassAssignments.filter(assignment => {
      if (appliedFilters.departmentId && assignment.departmentId !== appliedFilters.departmentId) {
        return false;
      }
      if (appliedFilters.classId && assignment.classId !== appliedFilters.classId) {
        return false;
      }
      return true;
    });
    
    filteredAssignments.forEach(assignment => {
      const { departmentId, classId } = assignment;
      
      if (!grouped[departmentId]) {
        grouped[departmentId] = {};
      }
      
      if (!grouped[departmentId][classId]) {
        grouped[departmentId][classId] = [];
      }
      
      grouped[departmentId][classId].push(assignment);
    });
    
    return grouped;
  };

  // Check if any modal is open
  const isAnyModalOpen = isDepartmentModalOpen || isClassModalOpen || isSectionModalOpen || 
                        isSubjectModalOpen || isAssignmentModalOpen || isViewModalOpen || 
                        isEditListModalOpen || isSectionsViewModalOpen || showDeleteConfirm;

  // --- EFFECTS ---
  
  useEffect(() => {
    // Fetch data when component mounts
    fetchAllData();
  }, [currentOrganizationId]);

  // --- STYLES ---
  const inputBaseClass = "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed";
  const btnBaseClass = "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnTealClass = `${btnBaseClass} bg-teal-500 hover:bg-teal-600 text-white`;
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnRoseClass = `${btnBaseClass} bg-rose-500 hover:bg-rose-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;

  // --- NAVIGATION HANDLER ---
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />
      
      {/* Navigation Component - hidden when modal is open */}
      {!isAnyModalOpen && <OrgMenuNavigation currentPage="view-classrooms" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isAnyModalOpen ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">View Classrooms</h1>
              <p className="text-slate-500 text-sm">Manage departments, classes, sections, subjects, and assignments for your organization</p>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="bg-indigo-100 p-4 rounded-full">
                <i className="fas fa-building fa-2x text-indigo-500"></i>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Departments</p>
                <p className="text-3xl font-bold text-slate-900">{departments.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="bg-emerald-100 p-4 rounded-full">
                <i className="fas fa-graduation-cap fa-2x text-emerald-500"></i>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Classes</p>
                <p className="text-3xl font-bold text-slate-900">{classes.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="bg-purple-100 p-4 rounded-full">
                <i className="fas fa-layer-group fa-2x text-purple-500"></i>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Sections</p>
                <p className="text-3xl font-bold text-slate-900">{sections.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="bg-amber-100 p-4 rounded-full">
                <i className="fas fa-book fa-2x text-amber-500"></i>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Subjects</p>
                <p className="text-3xl font-bold text-slate-900">{subjects.length}</p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Workflow Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-route text-white"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Classroom Setup Workflow</h2>
                <p className="text-sm text-slate-600">Follow these 2 simple steps to set up your classrooms</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-100 border-2 border-green-500">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-green-500 text-white">
                  1
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-green-900 block">Create Entities</span>
                  <span className="text-xs text-green-700">Departments, Classes, Sections & Subjects</span>
                </div>
              </div>
              
              <i className="fas fa-arrow-right text-slate-400 text-xl"></i>
              
              <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-100 border-2 border-blue-300">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-blue-500 text-white">
                  2
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-blue-900 block">Assign & Define</span>
                  <span className="text-xs text-blue-700">Map Sections to Classes, then Assign Subjects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Create Entities */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-green-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Step 1: Create Base Entities</h2>
                  <p className="text-white text-opacity-90 text-sm">Create departments, classes, sections, and subjects</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => openModal('department')}
                  className="relative flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition-all hover:shadow-md group"
                >
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <i className="fas fa-plus text-white text-sm"></i>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fas fa-building text-white text-xl"></i>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-900">Department</p>
                    <p className="text-xs text-slate-600">{departments.length} created</p>
                  </div>
              </button>

              <button
                onClick={() => openModal('class')}
                  className="relative flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg transition-all hover:shadow-md group"
                >
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <i className="fas fa-plus text-white text-sm"></i>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fas fa-graduation-cap text-white text-xl"></i>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-900">Class</p>
                    <p className="text-xs text-slate-600">{classes.length} created</p>
                  </div>
              </button>

              <button
                onClick={() => openModal('section')}
                  className="relative flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg transition-all hover:shadow-md group"
                >
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <i className="fas fa-plus text-white text-sm"></i>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fas fa-layer-group text-white text-xl"></i>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-900">Section</p>
                    <p className="text-xs text-slate-600">{sections.length} created</p>
                  </div>
              </button>

              <button
                onClick={() => openModal('subject')}
                  className="relative flex items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 rounded-lg transition-all hover:shadow-md group"
                >
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <i className="fas fa-plus text-white text-sm"></i>
                  </div>
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fas fa-book text-white text-xl"></i>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-900">Subject</p>
                    <p className="text-xs text-slate-600">{subjects.length} created</p>
                  </div>
              </button>
            </div>
            
            {/* Quick Edit Options */}
            <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <i className="fas fa-edit text-slate-500"></i>
                  Quick Edit Existing Entities
                </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Edit Department</label>
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        const dept = departments.find(d => d._id === e.target.value);
                        if (dept) openModal('department', dept);
                        e.target.value = '';
                      }
                    }}
                      className="w-full text-sm p-2 border border-slate-200 rounded-md bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Edit Class</label>
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        const cls = classes.find(c => c._id === e.target.value);
                        if (cls) openModal('class', cls);
                        e.target.value = '';
                      }
                    }}
                      className="w-full text-sm p-2 border border-slate-200 rounded-md bg-white"
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Edit Section</label>
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        const section = sections.find(s => s._id === e.target.value);
                        if (section) openModal('section', section);
                        e.target.value = '';
                      }
                    }}
                      className="w-full text-sm p-2 border border-slate-200 rounded-md bg-white"
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section._id} value={section._id}>{section.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Edit Subject</label>
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        const subject = subjects.find(s => s._id === e.target.value);
                        if (subject) openModal('subject', subject);
                        e.target.value = '';
                      }
                    }}
                      className="w-full text-sm p-2 border border-slate-200 rounded-md bg-white"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject._id} value={subject._id}>{subject.name}</option>
                    ))}
                  </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Assign Sections to Classes & Step 3: Assign Subjects */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Step 2: Assign Sections & Define Subjects</h2>
                    <p className="text-white text-opacity-90 text-sm">Map sections to classes, then assign subjects to each section</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal('assignment')}
                  className="bg-white hover:bg-blue-50 text-blue-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                >
                  <i className="fas fa-link text-lg"></i>
                  <span>Assign Sections</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900 flex items-center gap-2">
                  <i className="fas fa-info-circle"></i>
                  <strong>Workflow:</strong> First assign sections to classes, then click "Assign Subjects" on each class to define which subjects are taught.
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Current Section Assignments</h3>
                  <p className="text-slate-500 text-sm">View sections assigned to classes and proceed to assign subjects</p>
                </div>
              </div>
              
              {/* Filter Controls */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-48">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Filter by Department
                    </label>
                    <select
                      value={assignmentFilters.departmentId}
                      onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                      className={inputBaseClass}
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1 min-w-48">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Filter by Class
                    </label>
                    <select
                      value={assignmentFilters.classId}
                      onChange={(e) => handleFilterChange('classId', e.target.value)}
                      className={inputBaseClass}
                    >
                      <option value="">All Classes</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={applyFilters}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-sm font-medium transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loadingEntities.assignments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-slate-600">Loading assignments...</span>
                </div>
              ) : (
                /* Hierarchical Assignments Table */
                <div className="overflow-x-auto">
                  {(() => {
                    const groupedAssignments = getGroupedAssignments();
                    const departmentIds = Object.keys(groupedAssignments);

                    if (departmentIds.length === 0) {
                      return (
                        <div className="text-center p-8 text-slate-500">
                          No assignments found. Create your first assignment or adjust your filters to see results.
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {departmentIds.map(departmentId => {
                          const department = departments.find(d => d._id === departmentId);
                          const classIds = Object.keys(groupedAssignments[departmentId]);

                          return (
                            <div key={departmentId} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                              {/* Department Header */}
                              <div className="bg-blue-50 px-4 py-3 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <i className="fas fa-building text-blue-600"></i>
                                    <h3 className="font-semibold text-blue-900">{department?.name}</h3>
                                  </div>
                                  <div className="text-sm text-blue-700">
                                    {classIds.length} class{classIds.length !== 1 ? 'es' : ''}
                                  </div>
                                </div>
                              </div>

                              {/* Classes under this department */}
                              <div className="divide-y divide-slate-200">
                                {classIds.map(classId => {
                                  const classItem = classes.find(c => c._id === classId);
                                  const assignments = groupedAssignments[departmentId][classId];
                                  const sectionsCount = assignments.length;

                                  return (
                                    <div key={classId} className="p-4 bg-gradient-to-r from-white to-slate-50">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                          <i className="fas fa-graduation-cap text-green-600 text-lg"></i>
                                          <h4 className="font-semibold text-slate-900">{classItem?.name}</h4>
                                          <span className="text-sm text-slate-500">
                                            ({sectionsCount} section{sectionsCount !== 1 ? 's' : ''})
                                          </span>
                                        </div>
                                          <button
                                            onClick={() => handleDeleteAssignment(assignments[0])}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Assignment"
                                          >
                                            <i className="fas fa-trash"></i>
                                          </button>
                                      </div>

                                      {/* Sections Preview with Action Buttons */}
                                      <div className="pl-8">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                          {assignments.slice(0, 5).map((assignment, index) => (
                                            <span
                                              key={assignment._id}
                                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm font-medium border border-purple-200"
                                            >
                                              <i className="fas fa-layer-group mr-1 text-xs"></i>
                                              {assignment.sectionName}
                                            </span>
                                          ))}
                                          {assignments.length > 5 && (
                                            <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-medium">
                                              +{assignments.length - 5} more
                                            </span>
                                          )}
                                        </div>
                                        
                                        {/* Action Buttons Row */}
                                        <div className="bg-white border-2 border-blue-200 rounded-lg p-3 mt-3">
                                          <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-600 flex items-center gap-2">
                                              <i className="fas fa-info-circle text-blue-500"></i>
                                              <span><strong>Next:</strong> View sections details or assign subjects to this class</span>
                                            </p>
                                            <div className="flex items-center gap-2">
                                              <button
                                                onClick={() => handleViewSections(departmentId, classId)}
                                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-slate-200"
                                                title="View all sections assigned to this class"
                                              >
                                                <i className="fas fa-eye"></i>
                                                View Sections
                                              </button>
                                              <button
                                                onClick={() => navigateToSubjectAssign(departmentId, classId)}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                                                title="Assign subjects to sections in this class"
                                              >
                                                <i className="fas fa-book"></i>
                                                Assign Subjects
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Sections View Modal */}
      {isSectionsViewModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">View Sections</h2>
                  <p className="text-slate-500 text-sm">
                    Sections assigned to <span className="font-medium text-slate-700">{viewingClass?.name}</span>
                    under <span className="font-medium text-slate-700">{viewingDepartment?.name}</span> department
                  </p>
                </div>
                <button
                  onClick={() => setIsSectionsViewModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              <div className="space-y-4">
                {/* Department and Class Info */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Department</label>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-building text-blue-600"></i>
                        <span className="font-medium text-slate-900">{viewingDepartment?.name}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Class</label>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-graduation-cap text-green-600"></i>
                        <span className="font-medium text-slate-900">{viewingClass?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sections List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Assigned Sections</h3>
                    <span className="text-sm text-slate-500">
                      {viewingSections.length} section{viewingSections.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {viewingSections.length > 0 ? (
                    <div className="space-y-2">
                      {viewingSections.map((assignment, index) => (
                        <div key={assignment._id || index} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <i className="fas fa-layer-group text-purple-600"></i>
                            <span className="font-medium text-slate-900">{assignment.sectionName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                // Edit the assignment
                                setEditingAssignment(assignment);
                                setAssignmentFormData({
                                  sectionIds: assignment.sectionIds,
                                  classId: assignment.classId,
                                  departmentId: assignment.departmentId
                                });
                                setIsSectionsViewModalOpen(false);
                                setIsAssignmentModalOpen(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <i className="fas fa-layer-group text-4xl mb-4 text-slate-300"></i>
                      <p>No sections assigned to this class yet.</p>
                      <p className="text-sm">Use the "Add Assignment" button to assign sections.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsSectionsViewModalOpen(false)}
                  className={btnSlateClass}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsSectionsViewModalOpen(false);
                    openModal('assignment');
                  }}
                  className={btnIndigoClass}
                >
                  <i className="fas fa-plus"></i>
                  Add More Sections
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Components */}
      {isDepartmentModalOpen && (
        <DepartmentModal
          isOpen={isDepartmentModalOpen}
          onClose={() => closeModal('department')}
          departmentFormData={departmentFormData}
          setDepartmentFormData={setDepartmentFormData}
          onSubmit={async (data) => {
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              if (editingDepartment) {
                // Update existing department
                setDepartments(prev => 
                  prev.map(dept => 
                    dept._id === editingDepartment._id
                      ? { ...dept, ...data }
                      : dept
                  )
                );
                toast.success('Department updated successfully!');
              } else {
                // Create new department
                const newDepartment = {
                  _id: `dept-${Date.now()}`,
                  ...data,
                  organizationId: currentOrganizationId
                };
                setDepartments(prev => [...prev, newDepartment]);
                toast.success('Department created successfully!');
              }
              closeModal('department');
            } catch (error) {
              toast.error('Failed to save department');
            }
          }}
          editingDepartment={editingDepartment}
          inputBaseClass={inputBaseClass}
          btnTealClass={btnTealClass}
          btnSlateClass={btnSlateClass}
        />
      )}

      {isClassModalOpen && (
        <ClassModal
          isOpen={isClassModalOpen}
          onClose={() => closeModal('class')}
          classFormData={classFormData}
          setClassFormData={setClassFormData}
          onSubmit={async (data) => {
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              if (editingClass) {
                // Update existing class
                setClasses(prev => 
                  prev.map(cls => 
                    cls._id === editingClass._id
                      ? { ...cls, ...data }
                      : cls
                  )
                );
                toast.success('Class updated successfully!');
              } else {
                // Create new class
                const newClass = {
                  _id: `class-${Date.now()}`,
                  ...data,
                  organizationId: currentOrganizationId
                };
                setClasses(prev => [...prev, newClass]);
                toast.success('Class created successfully!');
              }
              closeModal('class');
            } catch (error) {
              toast.error('Failed to save class');
            }
          }}
          editingClass={editingClass}
          inputBaseClass={inputBaseClass}
          btnTealClass={btnTealClass}
          btnSlateClass={btnSlateClass}
        />
      )}

      {isSectionModalOpen && (
        <SectionModal
          isOpen={isSectionModalOpen}
          onClose={() => closeModal('section')}
          sectionFormData={sectionFormData}
          setSectionFormData={setSectionFormData}
          onSubmit={async (data) => {
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              if (editingSection) {
                // Update existing section
                setSections(prev => 
                  prev.map(section => 
                    section._id === editingSection._id
                      ? { ...section, ...data }
                      : section
                  )
                );
                toast.success('Section updated successfully!');
              } else {
                // Create new section
                const newSection = {
                  _id: `section-${Date.now()}`,
                  ...data,
                  organizationId: currentOrganizationId
                };
                setSections(prev => [...prev, newSection]);
                toast.success('Section created successfully!');
              }
              closeModal('section');
            } catch (error) {
              toast.error('Failed to save section');
            }
          }}
          editingSection={editingSection}
          inputBaseClass={inputBaseClass}
          btnTealClass={btnTealClass}
          btnSlateClass={btnSlateClass}
        />
      )}

      {isSubjectModalOpen && (
        <SubjectModal
          isOpen={isSubjectModalOpen}
          onClose={() => closeModal('subject')}
          subjectFormData={subjectFormData}
          setSubjectFormData={setSubjectFormData}
          departments={departments}
          onSubmit={async (data) => {
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              if (editingSubject) {
                // Update existing subject
                setSubjects(prev => 
                  prev.map(subject => 
                    subject._id === editingSubject._id
                      ? { ...subject, ...data }
                      : subject
                  )
                );
                toast.success('Subject updated successfully!');
              } else {
                // Create new subject
                const newSubject = {
                  _id: `subject-${Date.now()}`,
                  ...data,
                  organizationId: currentOrganizationId
                };
                setSubjects(prev => [...prev, newSubject]);
                toast.success('Subject created successfully!');
              }
              closeModal('subject');
            } catch (error) {
              toast.error('Failed to save subject');
            }
          }}
          editingSubject={editingSubject}
          inputBaseClass={inputBaseClass}
          btnTealClass={btnTealClass}
          btnSlateClass={btnSlateClass}
        />
      )}

      {isAssignmentModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingAssignment ? 'Edit Assignment' : 'Assign Sections to Class'}
                  </h2>
                  <p className="text-slate-500 text-sm">Select sections to assign to a class within a department</p>
                </div>
                <button
                  onClick={() => closeModal('assignment')}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Department Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={assignmentFormData.departmentId}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                    className={inputBaseClass}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Class *
                  </label>
                  <select
                    value={assignmentFormData.classId}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, classId: e.target.value }))}
                    className={inputBaseClass}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sections Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sections *
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-md p-3 space-y-2">
                    {sections.map(section => (
                      <label key={section._id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assignmentFormData.sectionIds.includes(section._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignmentFormData(prev => ({
                                ...prev,
                                sectionIds: [...prev.sectionIds, section._id]
                              }));
                            } else {
                              setAssignmentFormData(prev => ({
                                ...prev,
                                sectionIds: prev.sectionIds.filter(id => id !== section._id)
                              }));
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-slate-700">{section.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {assignmentFormData.sectionIds.length} section(s) selected
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => closeModal('assignment')}
                  className={btnSlateClass}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!assignmentFormData.departmentId || !assignmentFormData.classId || assignmentFormData.sectionIds.length === 0) {
                      toast.error('Please fill all required fields');
                      return;
                    }
                    
                    try {
                      // Simulate API call
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      
                      if (editingAssignment) {
                        // Update existing assignment
                        setSectionClassAssignments(prev => 
                          prev.map(assignment => 
                            assignment._id === editingAssignment._id
                              ? {
                                  ...assignment,
                                  departmentId: assignmentFormData.departmentId,
                                  classId: assignmentFormData.classId,
                                  sectionIds: assignmentFormData.sectionIds,
                                  sectionName: sections.find(s => s._id === assignmentFormData.sectionIds[0])?.name || assignment.sectionName
                                }
                              : assignment
                          )
                        );
                        toast.success('Assignment updated successfully!');
                      } else {
                        // Create new assignments for each selected section
                        const newAssignments = assignmentFormData.sectionIds.map(sectionId => {
                          const section = sections.find(s => s._id === sectionId);
                          return {
                            _id: `assign-${Date.now()}-${sectionId}`,
                            departmentId: assignmentFormData.departmentId,
                            classId: assignmentFormData.classId,
                            sectionIds: [sectionId],
                            sectionName: section.name,
                            organizationId: currentOrganizationId
                          };
                        });
                        
                        setSectionClassAssignments(prev => [...prev, ...newAssignments]);
                        toast.success('Assignment created successfully!');
                      }
                      closeModal('assignment');
                    } catch (error) {
                      toast.error('Failed to create assignment');
                    }
                  }}
                  className={btnIndigoClass}
                  disabled={!assignmentFormData.departmentId || !assignmentFormData.classId || assignmentFormData.sectionIds.length === 0}
                >
                  <i className="fas fa-link"></i>
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Confirm Deletion</h3>
                  <p className="text-slate-500 text-sm">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-slate-700 mb-6">
                Are you sure you want to delete this {deleteType}?
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={btnSlateClass}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    try {
                      // Handle deletion based on type
                      if (deleteType === 'assignment' && itemToDelete) {
                        setSectionClassAssignments(prev => 
                          prev.filter(assignment => assignment._id !== itemToDelete._id)
                        );
                      } else if (deleteType === 'department' && itemToDelete) {
                        setDepartments(prev => 
                          prev.filter(dept => dept._id !== itemToDelete._id)
                        );
                        // Also remove related subjects
                        setSubjects(prev => 
                          prev.filter(subject => subject.departmentId !== itemToDelete._id)
                        );
                      } else if (deleteType === 'class' && itemToDelete) {
                        setClasses(prev => 
                          prev.filter(cls => cls._id !== itemToDelete._id)
                        );
                      } else if (deleteType === 'section' && itemToDelete) {
                        setSections(prev => 
                          prev.filter(section => section._id !== itemToDelete._id)
                        );
                      } else if (deleteType === 'subject' && itemToDelete) {
                        setSubjects(prev => 
                          prev.filter(subject => subject._id !== itemToDelete._id)
                        );
                      }
                      
                      setShowDeleteConfirm(false);
                      setItemToDelete(null);
                      setDeleteType('');
                      toast.success(`${deleteType} deleted successfully`);
                    } catch (error) {
                      toast.error('Failed to delete item');
                    }
                  }}
                  className={btnRoseClass}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClassManage;

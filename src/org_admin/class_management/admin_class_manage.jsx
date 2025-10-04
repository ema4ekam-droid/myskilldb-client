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
      
      // Dummy data for departments
      const dummyDepartments = [
        { _id: 'dept-1', name: 'Science', description: 'Science and Technology Department' },
        { _id: 'dept-2', name: 'Mathematics', description: 'Mathematics Department' },
        { _id: 'dept-3', name: 'Languages', description: 'Languages and Literature Department' },
        { _id: 'dept-4', name: 'Social Studies', description: 'Social Studies Department' }
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
        { _id: 'class-1', name: 'Grade 6', description: 'Sixth Grade Class' },
        { _id: 'class-2', name: 'Grade 7', description: 'Seventh Grade Class' },
        { _id: 'class-3', name: 'Grade 8', description: 'Eighth Grade Class' },
        { _id: 'class-4', name: 'Grade 9', description: 'Ninth Grade Class' },
        { _id: 'class-5', name: 'Grade 10', description: 'Tenth Grade Class' },
        { _id: 'class-6', name: 'Grade 11', description: 'Eleventh Grade Class' },
        { _id: 'class-7', name: 'Grade 12', description: 'Twelfth Grade Class' }
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
      
      // Dummy data for sections
      const dummySections = [
        { _id: 'section-1', name: 'Section A', description: 'Section A' },
        { _id: 'section-2', name: 'Section B', description: 'Section B' },
        { _id: 'section-3', name: 'Section C', description: 'Section C' },
        { _id: 'section-4', name: 'Section D', description: 'Section D' },
        { _id: 'section-5', name: 'Section E', description: 'Section E' },
        { _id: 'section-6', name: 'Section F', description: 'Section F' },
        { _id: 'section-7', name: 'Section G', description: 'Section G' },
        { _id: 'section-8', name: 'Section H', description: 'Section H' },
        { _id: 'section-9', name: 'Section I', description: 'Section I' },
        { _id: 'section-10', name: 'Section J', description: 'Section J' }
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
        { _id: 'subject-1', name: 'Physics', code: 'PHY', departmentId: 'dept-1', description: 'Physics Subject', credits: '4', type: 'core' },
        { _id: 'subject-2', name: 'Chemistry', code: 'CHEM', departmentId: 'dept-1', description: 'Chemistry Subject', credits: '4', type: 'core' },
        { _id: 'subject-3', name: 'Biology', code: 'BIO', departmentId: 'dept-1', description: 'Biology Subject', credits: '4', type: 'core' },
        { _id: 'subject-4', name: 'Mathematics', code: 'MATH', departmentId: 'dept-2', description: 'Mathematics Subject', credits: '5', type: 'core' },
        { _id: 'subject-5', name: 'Statistics', code: 'STAT', departmentId: 'dept-2', description: 'Statistics Subject', credits: '3', type: 'elective' },
        { _id: 'subject-6', name: 'English', code: 'ENG', departmentId: 'dept-3', description: 'English Language', credits: '4', type: 'core' },
        { _id: 'subject-7', name: 'Literature', code: 'LIT', departmentId: 'dept-3', description: 'English Literature', credits: '3', type: 'elective' },
        { _id: 'subject-8', name: 'History', code: 'HIST', departmentId: 'dept-4', description: 'World History', credits: '3', type: 'core' },
        { _id: 'subject-9', name: 'Geography', code: 'GEO', departmentId: 'dept-4', description: 'Geography Subject', credits: '3', type: 'core' }
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
        // Science Department - Grade 6
        { _id: 'assign-1', departmentId: 'dept-1', classId: 'class-1', sectionIds: ['section-1', 'section-2'], sectionName: 'Section A' },
        { _id: 'assign-2', departmentId: 'dept-1', classId: 'class-1', sectionIds: ['section-2'], sectionName: 'Section B' },
        
        // Science Department - Grade 7
        { _id: 'assign-3', departmentId: 'dept-1', classId: 'class-2', sectionIds: ['section-1', 'section-3'], sectionName: 'Section A' },
        { _id: 'assign-4', departmentId: 'dept-1', classId: 'class-2', sectionIds: ['section-4'], sectionName: 'Section D' },
        { _id: 'assign-5', departmentId: 'dept-1', classId: 'class-2', sectionIds: ['section-5'], sectionName: 'Section E' },
        
        // Mathematics Department - Grade 8
        { _id: 'assign-6', departmentId: 'dept-2', classId: 'class-3', sectionIds: ['section-1'], sectionName: 'Section A' },
        { _id: 'assign-7', departmentId: 'dept-2', classId: 'class-3', sectionIds: ['section-2', 'section-3'], sectionName: 'Section B' },
        { _id: 'assign-8', departmentId: 'dept-2', classId: 'class-3', sectionIds: ['section-6'], sectionName: 'Section F' },
        
        // Mathematics Department - Grade 9
        { _id: 'assign-9', departmentId: 'dept-2', classId: 'class-4', sectionIds: ['section-1', 'section-2'], sectionName: 'Section A' },
        { _id: 'assign-10', departmentId: 'dept-2', classId: 'class-4', sectionIds: ['section-3', 'section-4', 'section-5'], sectionName: 'Section C' },
        
        // Languages Department - Grade 10
        { _id: 'assign-11', departmentId: 'dept-3', classId: 'class-5', sectionIds: ['section-1'], sectionName: 'Section A' },
        { _id: 'assign-12', departmentId: 'dept-3', classId: 'class-5', sectionIds: ['section-2'], sectionName: 'Section B' },
        { _id: 'assign-13', departmentId: 'dept-3', classId: 'class-5', sectionIds: ['section-7', 'section-8'], sectionName: 'Section G' },
        
        // Social Studies Department - Grade 11
        { _id: 'assign-14', departmentId: 'dept-4', classId: 'class-6', sectionIds: ['section-1', 'section-2', 'section-3'], sectionName: 'Section A' },
        { _id: 'assign-15', departmentId: 'dept-4', classId: 'class-6', sectionIds: ['section-4'], sectionName: 'Section D' },
        
        // Social Studies Department - Grade 12
        { _id: 'assign-16', departmentId: 'dept-4', classId: 'class-7', sectionIds: ['section-1'], sectionName: 'Section A' },
        { _id: 'assign-17', departmentId: 'dept-4', classId: 'class-7', sectionIds: ['section-5', 'section-6', 'section-7', 'section-8'], sectionName: 'Section E' },
        { _id: 'assign-18', departmentId: 'dept-4', classId: 'class-7', sectionIds: ['section-9', 'section-10'], sectionName: 'Section I' }
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

  // --- HELPER FUNCTIONS ---
  
  const getGroupedAssignments = () => {
    const grouped = {};
    
    sectionClassAssignments.forEach(assignment => {
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

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openModal('department')}
                className={btnTealClass}
              >
                <i className="fas fa-plus"></i>
                Add Department
              </button>
              <button
                onClick={() => openModal('class')}
                className={btnIndigoClass}
              >
                <i className="fas fa-plus"></i>
                Add Class
              </button>
              <button
                onClick={() => openModal('section')}
                className={btnTealClass}
              >
                <i className="fas fa-plus"></i>
                Add Section
              </button>
              <button
                onClick={() => openModal('subject')}
                className={btnIndigoClass}
              >
                <i className="fas fa-plus"></i>
                Add Subject
              </button>
              <button
                onClick={() => openModal('assignment')}
                className={btnTealClass}
              >
                <i className="fas fa-link"></i>
                Assign Sections
              </button>
            </div>
            
            {/* Quick Edit Options */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-md font-semibold text-slate-900 mb-3">Quick Edit</h3>
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
                    className="w-full text-sm p-2 border border-slate-200 rounded-md"
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
                    className="w-full text-sm p-2 border border-slate-200 rounded-md"
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
                    className="w-full text-sm p-2 border border-slate-200 rounded-md"
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
                    className="w-full text-sm p-2 border border-slate-200 rounded-md"
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

          {/* Assignments View */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Class-Section Assignments</h2>
                  <p className="text-slate-500 text-sm">View and manage section assignments to classes</p>
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
                                    <div key={classId} className="p-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                          <i className="fas fa-graduation-cap text-green-600"></i>
                                          <h4 className="font-medium text-slate-900">{classItem?.name}</h4>
                                          <span className="text-sm text-slate-500">
                                            ({sectionsCount} section{sectionsCount !== 1 ? 's' : ''})
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleViewSections(departmentId, classId)}
                                            className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                                            title="View Sections"
                                          >
                                            <i className="fas fa-eye"></i>
                                            View Sections
                                          </button>
                                          <button
                                            onClick={() => handleDeleteAssignment(assignments[0])}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Assignment"
                                          >
                                            <i className="fas fa-trash"></i>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Quick preview of sections */}
                                      <div className="pl-8">
                                        <div className="flex flex-wrap gap-2">
                                          {assignments.slice(0, 3).map((assignment, index) => (
                                            <span
                                              key={assignment._id}
                                              className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm"
                                            >
                                              {assignment.sectionName}
                                            </span>
                                          ))}
                                          {assignments.length > 3 && (
                                            <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-sm">
                                              +{assignments.length - 3} more
                                            </span>
                                          )}
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

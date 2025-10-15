import { useState, useEffect, useMemo } from 'react';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import { TeacherAssignmentModal } from '../../components/org-admin-components/teacher-management-components';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import LoaderOverlay from '../../components/loader/LoaderOverlay';

const AdminSubjectAssign = () => {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);
  
  // State for data
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectAssignments, setSubjectAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjectTeacherAssignments, setSubjectTeacherAssignments] = useState([]);

  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Assignment modal states
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);

  // Multi-section selection for assignment flow
  const [sectionsToAssign, setSectionsToAssign] = useState([]);
  
  // Multi-subject selection for assignment
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  
  // Search and filter for subjects
  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
  
  // Collapsible state for teacher setup section - All departments open, all classes closed by default
  const [collapsedDepartments, setCollapsedDepartments] = useState({});
  const [collapsedClasses, setCollapsedClasses] = useState({
    'class-1': true, 'class-2': true, 'class-3': true, 'class-4': true, 'class-5': true,
    'class-6': true, 'class-7': true, 'class-8': true, 'class-9': true, 'class-10': true,
    'class-11': true, 'class-12': true, 'class-13': true, 'class-14': true, 'class-15': true,
    'class-16': true, 'class-17': true, 'class-18': true, 'class-19': true, 'class-20': true
  });
  
  // Teacher assignment modal state
  const [isTeacherAssignModalOpen, setIsTeacherAssignModalOpen] = useState(false);
  const [teacherAssignmentData, setTeacherAssignmentData] = useState({
    departmentId: '',
    classId: '',
    sectionId: '',
    subjectId: ''
  });

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [deleteAnswer, setDeleteAnswer] = useState('');
  const [deleteQuestion, setDeleteQuestion] = useState({ num1: 0, num2: 0, answer: 0 });

  // Accordion state for setup section - closed by default
  const [isSetupAccordionOpen, setIsSetupAccordionOpen] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Current organization ID (would come from context/auth in real app)
  const [currentOrganizationId, setCurrentOrganizationId] = useState('org-123');

  // Quick action modals (local popups)
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [subjectFormData, setSubjectFormData] = useState({
    name: '',
    code: '',
    departmentId: '',
    description: '',
    credits: '',
    type: 'core'
  });

  const [isCreateTeacherModalOpen, setIsCreateTeacherModalOpen] = useState(false);
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    departmentId: '',
    password: ''
  });

  // --- API CALLS ---
  
  const fetchDepartments = async () => {
    try {
      // Dummy data for departments (School Levels)
      const dummyDepartments = [
        { _id: 'dept-1', name: 'Nursery', description: 'Nursery Level' },
        { _id: 'dept-2', name: 'Lower Primary', description: 'Lower Primary Level (Grades 1-5)' },
        { _id: 'dept-3', name: 'Upper Primary', description: 'Upper Primary Level (Grades 6-7)' },
        { _id: 'dept-4', name: 'High School', description: 'High School Level (Grades 8-10)' },
        { _id: 'dept-5', name: 'Higher Secondary', description: 'Higher Secondary Level (Grades 11-12)' }
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
      // Dummy data for classes (LKG to Grade 12)
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
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setClasses(dummyClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    }
  };

  const fetchSections = async () => {
    try {
      // Dummy data for sections (Only A and B for each class)
      const dummySections = [
        { _id: 'section-1', name: 'Section A', description: 'Section A' },
        { _id: 'section-2', name: 'Section B', description: 'Section B' }
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
      // Dummy data for subjects based on grade levels
      const dummySubjects = [
        // Common subjects for Grades 1-10
        { _id: 'subject-1', name: 'English', code: 'ENG', departmentId: 'dept-2', description: 'English Language' },
        { _id: 'subject-2', name: 'Malayalam', code: 'MAL', departmentId: 'dept-2', description: 'Malayalam Language' },
        { _id: 'subject-3', name: 'Mathematics', code: 'MATH', departmentId: 'dept-2', description: 'Mathematics' },
        { _id: 'subject-4', name: 'Science', code: 'SCI', departmentId: 'dept-2', description: 'General Science' },
        { _id: 'subject-5', name: 'Social Science', code: 'SOC', departmentId: 'dept-2', description: 'Social Studies' },
        
        // Upper Primary subjects
        { _id: 'subject-6', name: 'English', code: 'ENG', departmentId: 'dept-3', description: 'English Language' },
        { _id: 'subject-7', name: 'Malayalam', code: 'MAL', departmentId: 'dept-3', description: 'Malayalam Language' },
        { _id: 'subject-8', name: 'Mathematics', code: 'MATH', departmentId: 'dept-3', description: 'Mathematics' },
        { _id: 'subject-9', name: 'Science', code: 'SCI', departmentId: 'dept-3', description: 'General Science' },
        { _id: 'subject-10', name: 'Social Science', code: 'SOC', departmentId: 'dept-3', description: 'Social Studies' },
        
        // High School subjects
        { _id: 'subject-11', name: 'English', code: 'ENG', departmentId: 'dept-4', description: 'English Language' },
        { _id: 'subject-12', name: 'Malayalam', code: 'MAL', departmentId: 'dept-4', description: 'Malayalam Language' },
        { _id: 'subject-13', name: 'Mathematics', code: 'MATH', departmentId: 'dept-4', description: 'Mathematics' },
        { _id: 'subject-14', name: 'Science', code: 'SCI', departmentId: 'dept-4', description: 'General Science' },
        { _id: 'subject-15', name: 'Social Science', code: 'SOC', departmentId: 'dept-4', description: 'Social Studies' },
        
        // Grade 11 & 12 - Higher Secondary (Unique subjects shared across streams)
        { _id: 'subject-16', name: 'Physics', code: 'PHY', departmentId: 'dept-5', description: 'Physics' },
        { _id: 'subject-17', name: 'Chemistry', code: 'CHEM', departmentId: 'dept-5', description: 'Chemistry' },
        { _id: 'subject-18', name: 'Biology', code: 'BIO', departmentId: 'dept-5', description: 'Biology' },
        { _id: 'subject-19', name: 'Mathematics', code: 'MATH', departmentId: 'dept-5', description: 'Mathematics' },
        { _id: 'subject-20', name: 'English', code: 'ENG', departmentId: 'dept-5', description: 'English Language' },
        { _id: 'subject-21', name: 'Malayalam', code: 'MAL', departmentId: 'dept-5', description: 'Malayalam Language' },
        { _id: 'subject-22', name: 'Computer Science', code: 'CS', departmentId: 'dept-5', description: 'Computer Science' },
        { _id: 'subject-23', name: 'Accountancy', code: 'ACC', departmentId: 'dept-5', description: 'Accountancy' },
        { _id: 'subject-24', name: 'Business Studies', code: 'BS', departmentId: 'dept-5', description: 'Business Studies' },
        { _id: 'subject-25', name: 'Economics', code: 'ECON', departmentId: 'dept-5', description: 'Economics' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setSubjects(dummySubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  const fetchTeachers = async () => {
    try {
      // Dummy data for teachers
      const dummyTeachers = [
        { _id: 'teacher-1', name: 'Ms. Priya Nair', email: 'priya.nair@school.edu', departmentId: 'dept-2' },
        { _id: 'teacher-2', name: 'Mr. Rajan Kumar', email: 'rajan.kumar@school.edu', departmentId: 'dept-2' },
        { _id: 'teacher-3', name: 'Ms. Lakshmi Menon', email: 'lakshmi.menon@school.edu', departmentId: 'dept-3' },
        { _id: 'teacher-4', name: 'Mr. Suresh Pillai', email: 'suresh.pillai@school.edu', departmentId: 'dept-3' },
        { _id: 'teacher-5', name: 'Dr. Anjali Varma', email: 'anjali.varma@school.edu', departmentId: 'dept-4' },
        { _id: 'teacher-6', name: 'Prof. Ramesh Iyer', email: 'ramesh.iyer@school.edu', departmentId: 'dept-4' },
        { _id: 'teacher-7', name: 'Dr. Kavita Sharma', email: 'kavita.sharma@school.edu', departmentId: 'dept-5' },
        { _id: 'teacher-8', name: 'Mr. Arun Krishnan', email: 'arun.krishnan@school.edu', departmentId: 'dept-5' },
        { _id: 'teacher-9', name: 'Ms. Divya Thomas', email: 'divya.thomas@school.edu', departmentId: 'dept-5' },
        { _id: 'teacher-10', name: 'Dr. Vinod Menon', email: 'vinod.menon@school.edu', departmentId: 'dept-5' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setTeachers(dummyTeachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
    }
  };

  const fetchSubjectAssignments = async () => {
    try {
      // Dummy data for existing subject assignments
      const dummyAssignments = [
        // Lower Primary - Grade 5 (all 5 subjects to both sections)
        { _id: 'assign-1', subjectId: 'subject-1', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-2', subjectId: 'subject-2', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-3', subjectId: 'subject-3', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-4', subjectId: 'subject-4', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-5', subjectId: 'subject-5', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1', 'section-2'] },
        
        // Upper Primary - Grade 6 (all 5 subjects to both sections)
        { _id: 'assign-6', subjectId: 'subject-6', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-7', subjectId: 'subject-7', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-8', subjectId: 'subject-8', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-9', subjectId: 'subject-9', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-10', subjectId: 'subject-10', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1', 'section-2'] },
        
        // High School - Grade 10 (all 5 subjects to both sections)
        { _id: 'assign-11', subjectId: 'subject-11', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-12', subjectId: 'subject-12', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-13', subjectId: 'subject-13', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-14', subjectId: 'subject-14', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-15', subjectId: 'subject-15', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1', 'section-2'] },
        
        // Higher Secondary - Grade 11 Bio Math (Physics, Chemistry, Biology, Mathematics, English)
        { _id: 'assign-16', subjectId: 'subject-16', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-17', subjectId: 'subject-17', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-18', subjectId: 'subject-18', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-19', subjectId: 'subject-19', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-20', subjectId: 'subject-20', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1', 'section-2'] },
        
        // Higher Secondary - Grade 11 Bio Language (Biology, Physics, Chemistry, Malayalam, English)
        { _id: 'assign-21', subjectId: 'subject-18', departmentId: 'dept-5', classId: 'class-14', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-22', subjectId: 'subject-16', departmentId: 'dept-5', classId: 'class-14', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-23', subjectId: 'subject-17', departmentId: 'dept-5', classId: 'class-14', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-24', subjectId: 'subject-21', departmentId: 'dept-5', classId: 'class-14', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-25', subjectId: 'subject-20', departmentId: 'dept-5', classId: 'class-14', sectionIds: ['section-1', 'section-2'] },
        
        // Higher Secondary - Grade 11 Computer Maths (Computer Science, Mathematics, Physics, Chemistry, English)
        { _id: 'assign-26', subjectId: 'subject-22', departmentId: 'dept-5', classId: 'class-15', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-27', subjectId: 'subject-19', departmentId: 'dept-5', classId: 'class-15', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-28', subjectId: 'subject-16', departmentId: 'dept-5', classId: 'class-15', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-29', subjectId: 'subject-17', departmentId: 'dept-5', classId: 'class-15', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-30', subjectId: 'subject-20', departmentId: 'dept-5', classId: 'class-15', sectionIds: ['section-1', 'section-2'] },
        
        // Higher Secondary - Grade 11 Commerce (Accountancy, Business Studies, Economics, Mathematics, English)
        { _id: 'assign-31', subjectId: 'subject-23', departmentId: 'dept-5', classId: 'class-16', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-32', subjectId: 'subject-24', departmentId: 'dept-5', classId: 'class-16', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-33', subjectId: 'subject-25', departmentId: 'dept-5', classId: 'class-16', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-34', subjectId: 'subject-19', departmentId: 'dept-5', classId: 'class-16', sectionIds: ['section-1', 'section-2'] },
        { _id: 'assign-35', subjectId: 'subject-20', departmentId: 'dept-5', classId: 'class-16', sectionIds: ['section-1', 'section-2'] }
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
      fetchSubjectAssignments(),
      fetchTeachers()
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

  const toggleSubjectSelection = (subjectId) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const selectAllSubjects = () => {
    const allSubjectIds = filteredAndSearchedSubjects.map(s => s._id);
    setSelectedSubjects(allSubjectIds);
  };

  const clearAllSubjects = () => {
    setSelectedSubjects([]);
  };

  const handleBatchAssignment = async () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create assignments for each selected subject
      const newAssignments = selectedSubjects.map(subjectId => ({
        _id: `sa-${Date.now()}-${subjectId}`,
        subjectId,
        departmentId: selectedDepartment,
        classId: selectedClass,
        sectionIds: sectionsToAssign,
        organizationId: currentOrganizationId
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubjectAssignments(prev => [...prev, ...newAssignments]);
      toast.success(`${selectedSubjects.length} subject${selectedSubjects.length !== 1 ? 's' : ''} assigned successfully!`);
      
      // Clear selections
      setSelectedSubjects([]);
      
    } catch (error) {
      toast.error('Failed to create assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const openAssignmentModal = (subjectId) => {
    setSelectedSubject(subjectId);
    // Pre-fill with selected sections from Step 3
    setSelectedSections(sectionsToAssign.length > 0 ? [...sectionsToAssign] : []);
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

  const generateDeleteQuestion = () => {
    const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
    setDeleteQuestion({ num1, num2, answer: num1 * num2 });
    setDeleteAnswer('');
  };

  const openDeleteConfirmation = (assignmentId) => {
    setAssignmentToDelete(assignmentId);
    generateDeleteQuestion();
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteModalOpen(false);
    setAssignmentToDelete(null);
    setDeleteAnswer('');
  };

  const confirmDelete = async () => {
    if (parseInt(deleteAnswer) !== deleteQuestion.answer) {
      toast.error('Incorrect answer. Please try again.');
      generateDeleteQuestion();
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSubjectAssignments(prev => 
        prev.filter(assignment => assignment._id !== assignmentToDelete)
      );
      
      toast.success('Assignment deleted successfully!');
      closeDeleteConfirmation();
    } catch (error) {
      toast.error('Failed to delete assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    // This function is now replaced by openDeleteConfirmation
    openDeleteConfirmation(assignmentId);
  };

  const toggleDepartmentCollapse = (deptId) => {
    setCollapsedDepartments(prev => ({
      ...prev,
      [deptId]: !prev[deptId]
    }));
  };

  const toggleClassCollapse = (classId) => {
    setCollapsedClasses(prev => ({
      ...prev,
      [classId]: !prev[classId]
    }));
  };

  const openTeacherAssignModal = (departmentId, classId, sectionId, subjectId) => {
    setTeacherAssignmentData({
      departmentId,
      classId,
      sectionId,
      subjectId
    });
    setIsTeacherAssignModalOpen(true);
  };

  const closeTeacherAssignModal = () => {
    setIsTeacherAssignModalOpen(false);
    setTeacherAssignmentData({
      departmentId: '',
      classId: '',
      sectionId: '',
      subjectId: ''
    });
  };
  
  const navigateToTeacherAssign = (departmentId, classId, sectionId, subjectId) => {
    // Store the selected filters in localStorage for the teacher assign page
    localStorage.setItem('preselectedDepartment', departmentId);
    localStorage.setItem('preselectedClass', classId);
    localStorage.setItem('preselectedSection', sectionId);
    localStorage.setItem('preselectedSubject', subjectId);
    
    // Navigate to the teacher assign page
    window.location.href = '/admin/classrooms/teacher-assignments';
  };

  // --- COMPUTED VALUES ---
  
  const filteredSubjects = useMemo(() => {
    if (!selectedDepartment) return subjects;
    return subjects.filter(subject => subject.departmentId === selectedDepartment);
  }, [subjects, selectedDepartment]);

  const filteredAndSearchedSubjects = useMemo(() => {
    let filtered = filteredSubjects;
    
    // Apply search filter
    if (subjectSearchTerm.trim()) {
      const searchLower = subjectSearchTerm.toLowerCase();
      filtered = filtered.filter(subject => 
        subject.name.toLowerCase().includes(searchLower) ||
        subject.code.toLowerCase().includes(searchLower) ||
        subject.description?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [filteredSubjects, subjectSearchTerm]);

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
    
    // Check for preselected filters from navigation
    const preselectedDepartment = localStorage.getItem('preselectedDepartment');
    const preselectedClass = localStorage.getItem('preselectedClass');
    
    if (preselectedDepartment && preselectedClass) {
      setSelectedDepartment(preselectedDepartment);
      setSelectedClass(preselectedClass);
      
      // Clear the localStorage after using the values
      localStorage.removeItem('preselectedDepartment');
      localStorage.removeItem('preselectedClass');
    }
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

  // --- QUICK ACTIONS ---
  const openAddSubjectModal = () => {
    setSubjectFormData({
      name: '',
      code: '',
      departmentId: selectedDepartment || '',
      description: '',
      credits: '',
      type: 'core'
    });
    setIsAddSubjectModalOpen(true);
  };

  const openCreateTeacherModal = () => {
    setTeacherFormData({
      name: '',
      email: '',
      mobile: '',
      departmentId: selectedDepartment || '',
      password: ''
    });
    setIsCreateTeacherModalOpen(true);
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <LoaderOverlay isVisible={isLoading} title="MySkillDB" subtitle="Loading your data, please wait…" />
      
      {/* Navigation Component */}
      {!isAssignmentModalOpen && !isTeacherAssignModalOpen && !isAddSubjectModalOpen && !isCreateTeacherModalOpen && <OrgMenuNavigation currentPage="define-subjects" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={(isAssignmentModalOpen || isTeacherAssignModalOpen || isAddSubjectModalOpen || isCreateTeacherModalOpen) ? "flex-1 flex flex-col" : "lg:ml-72 flex-1 flex flex-col"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Subject Setup</h1>
              <p className="text-slate-500 text-sm">Assign subjects to sections within departments and classes</p>
            </div>
          </header>

          {/* Quick Actions - Create Subject / Create Teacher */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button
              onClick={openAddSubjectModal}
              className="relative flex items-center gap-3 p-4 md:p-5 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 rounded-lg transition-all hover:shadow-md group"
            >
              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-7 h-7 md:w-8 md:h-8 bg-amber-500 rounded-full hidden sm:flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <i className="fas fa-plus text-white text-xs md:text-sm"></i>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-lg hidden sm:flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-book text-white text-lg md:text-xl"></i>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 text-sm md:text-base">Create New Subject</p>
                <p className="text-xs text-slate-600">Add a subject before assigning</p>
              </div>
            </button>

            <button
              onClick={openCreateTeacherModal}
              className="relative flex items-center gap-3 p-4 md:p-5 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 rounded-lg transition-all hover:shadow-md group"
            >
              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-7 h-7 md:w-8 md:h-8 bg-indigo-500 rounded-full hidden sm:flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <i className="fas fa-plus text-white text-xs md:text-sm"></i>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500 rounded-lg hidden sm:flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-chalkboard-teacher text-white text-lg md:text-xl"></i>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 text-sm md:text-base">Create New Teacher</p>
                <p className="text-xs text-slate-600">Set up a teacher account</p>
              </div>
            </button>
          </div>

          {/* Add Subject Modal */}
          {isAddSubjectModalOpen && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Create New Subject</h3>
                  <button onClick={() => setIsAddSubjectModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="p-6 space-y-4">
              <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                <select
                      value={subjectFormData.departmentId}
                      onChange={(e) => setSubjectFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                  className={inputBaseClass}
                >
                      <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject Name *</label>
                    <input
                      type="text"
                      value={subjectFormData.name}
                      onChange={(e) => setSubjectFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={inputBaseClass}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Code</label>
                      <input
                        type="text"
                        value={subjectFormData.code}
                        onChange={(e) => setSubjectFormData(prev => ({ ...prev, code: e.target.value }))}
                        className={inputBaseClass}
                        placeholder="e.g., CS"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Credits</label>
                      <input
                        type="text"
                        value={subjectFormData.credits}
                        onChange={(e) => setSubjectFormData(prev => ({ ...prev, credits: e.target.value }))}
                        className={inputBaseClass}
                        placeholder="e.g., 5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      value={subjectFormData.description}
                      onChange={(e) => setSubjectFormData(prev => ({ ...prev, description: e.target.value }))}
                      className={inputBaseClass}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                  <button onClick={() => setIsAddSubjectModalOpen(false)} className={btnSlateClass}>Cancel</button>
                  <button
                    onClick={() => {
                      if (!subjectFormData.departmentId || !subjectFormData.name) {
                        toast.error('Please fill required fields');
                        return;
                      }
                      const newSubject = {
                        _id: `subject-${Date.now()}`,
                        ...subjectFormData,
                        organizationId: currentOrganizationId
                      };
                      setSubjects(prev => [...prev, newSubject]);
                      toast.success('Subject created');
                      setIsAddSubjectModalOpen(false);
                    }}
                    className={btnIndigoClass}
                  >
                    <i className="fas fa-save"></i>
                    Save Subject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Teacher Modal */}
          {isCreateTeacherModalOpen && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Create New Teacher</h3>
                  <button onClick={() => setIsCreateTeacherModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={teacherFormData.name}
                      onChange={(e) => setTeacherFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={inputBaseClass}
                      placeholder="e.g., John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={teacherFormData.email}
                      onChange={(e) => setTeacherFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={inputBaseClass}
                      placeholder="e.g., john@school.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      value={teacherFormData.mobile}
                      onChange={(e) => setTeacherFormData(prev => ({ ...prev, mobile: e.target.value }))}
                      className={inputBaseClass}
                      placeholder="e.g., +1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                    <select
                      value={teacherFormData.departmentId}
                      onChange={(e) => setTeacherFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                      className={inputBaseClass}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Temporary Password *</label>
                    <input
                      type="text"
                      value={teacherFormData.password}
                      onChange={(e) => setTeacherFormData(prev => ({ ...prev, password: e.target.value }))}
                      className={inputBaseClass}
                      placeholder="Enter temporary password"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                  <button onClick={() => setIsCreateTeacherModalOpen(false)} className={btnSlateClass}>Cancel</button>
                  <button
                    onClick={() => {
                      if (!teacherFormData.name || !teacherFormData.email || !teacherFormData.mobile || !teacherFormData.departmentId || !teacherFormData.password) {
                        toast.error('Please fill all required fields');
                        return;
                      }
                      const newTeacher = {
                        _id: `teacher-${Date.now()}`,
                        ...teacherFormData,
                        organizationId: currentOrganizationId
                      };
                      setTeachers(prev => [...prev, newTeacher]);
                      toast.success('Teacher created successfully');
                      setIsCreateTeacherModalOpen(false);
                    }}
                    className={btnIndigoClass}
                  >
                    <i className="fas fa-save"></i>
                    Save Teacher
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Accordion: Setup new subject inside a class */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => setIsSetupAccordionOpen(!isSetupAccordionOpen)}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 px-4 md:px-6 py-4 flex items-center justify-between transition-colors"
            >
              <h2 className="text-lg md:text-xl font-bold text-white">Setup new subject inside a class</h2>
              <i className={`fas fa-chevron-${isSetupAccordionOpen ? 'up' : 'down'} text-white text-lg`}></i>
            </button>

            {/* Accordion Content */}
            {isSetupAccordionOpen && (
              <div className="p-4 md:p-6 space-y-6">
                {/* Filters: Department and Class */}
                <div className="bg-slate-50 rounded-lg p-4 md:p-6 border border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Choose Department and Class</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department *
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className={inputBaseClass}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class *
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className={inputBaseClass}
                  disabled={!selectedDepartment}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>
                  </div>
                </div>

                {/* Select Sections */}
                {selectedDepartment && selectedClass && (
                  <div className="bg-slate-50 rounded-lg p-4 md:p-6 border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Select Sections</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {sections.map(section => {
                  const isSelected = sectionsToAssign.includes(section._id);
                  return (
                    <button
                      key={section._id}
                      onClick={() => {
                        if (isSelected) {
                          setSectionsToAssign(prev => prev.filter(id => id !== section._id));
                        } else {
                          setSectionsToAssign(prev => [...prev, section._id]);
                        }
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-green-500' : 'bg-slate-100'
                        }`}>
                          <i className={`fas fa-layer-group ${isSelected ? 'text-white' : 'text-slate-600'}`}></i>
              </div>
                        <span className={`text-sm font-medium ${isSelected ? 'text-green-900' : 'text-slate-700'}`}>
                          {section.name}
                        </span>
                        {isSelected && (
                          <i className="fas fa-check-circle text-green-600"></i>
                        )}
            </div>
                    </button>
                  );
                })}
                    </div>
                  </div>
                )}

                {/* Assign Subjects */}
                {sectionsToAssign.length > 0 && (
                  <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-slate-200 bg-white">
                      <h2 className="text-lg font-bold text-slate-900">Assign Subjects</h2>
                    </div>

            <div className="p-4 md:p-6">
                {/* Search and Actions */}
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input
                        type="text"
                        placeholder="Search subjects by name, code, or description..."
                        value={subjectSearchTerm}
                        onChange={(e) => setSubjectSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      {subjectSearchTerm && (
                        <button
                          onClick={() => setSubjectSearchTerm('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllSubjects}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAllSubjects}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Subjects Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-slate-600">Loading subjects...</span>
                </div>
                ) : filteredAndSearchedSubjects.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <i className="fas fa-book text-4xl mb-4 text-slate-300"></i>
                  <p className="font-medium mb-2">
                    {subjectSearchTerm ? 'No subjects match your search' : 'No subjects found for the selected department'}
                  </p>
                  <p className="text-sm">
                    {subjectSearchTerm ? 'Try a different search term' : 'Try selecting a different department or add subjects to this department'}
                  </p>
                  {!subjectSearchTerm && (
                    <div className="mt-4">
                      <button
                        onClick={openAddSubjectModal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium border border-slate-200"
                      >
                        <span className="text-gray-500 text-lg">+</span>
                        <span>Add subjects to this department</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 mb-6 max-h-96 overflow-y-auto p-2">
                      {filteredAndSearchedSubjects.map(subject => {
                        const isSelected = selectedSubjects.includes(subject._id);
                        
                    return (
                          <button
                            key={subject._id}
                            onClick={() => toggleSubjectSelection(subject._id)}
                            className={`p-2 md:p-3 rounded-lg border-2 transition-all text-left ${
                              isSelected 
                                ? 'border-green-500 bg-green-50 shadow-md' 
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className={`hidden md:flex w-8 h-8 rounded-lg items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-green-500' : 'bg-slate-100'
                              }`}>
                                <i className={`fas fa-book text-sm ${isSelected ? 'text-white' : 'text-slate-600'}`}></i>
                          </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-xs md:text-sm mb-1 ${isSelected ? 'text-green-900' : 'text-slate-900'} truncate`}>
                                  {subject.name}
                                </h3>
                                <p className={`text-xs mb-1 md:mb-2 ${isSelected ? 'text-green-700' : 'text-slate-500'} truncate`}>
                            {subject.code}
                                </p>
                                {isSelected && (
                                  <div className="flex items-center gap-1">
                                    <i className="fas fa-check-circle text-green-600 text-xs"></i>
                                    <span className="text-xs text-green-700 font-medium">Selected</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                        </div>
                        
                    {/* Assignment Action */}
                    {selectedSubjects.length > 0 && (
                      <div className="flex justify-end">
                        <button
                            onClick={handleBatchAssignment}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <i className="fas fa-save"></i>
                            <span>Save</span>
                        </button>
                      </div>
                    )}
                  </>
              )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Setup teachers for a classroom */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Setup/View teachers in a classroom</h2>
              <p className="text-slate-600 text-sm">Review and assign teachers for subjects</p>
            </div>

            <div className="p-4 md:p-6">
                {subjectAssignments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <i className="fas fa-book text-4xl mb-4 text-slate-300"></i>
                    <p className="font-medium mb-2">No assignments found</p>
                    <p className="text-sm">Create subject assignments using the accordion above.</p>
                </div>
              ) : (
                  <div className="space-y-6">
                    {/* Group assignments by department, then class, then section */}
                    {(() => {
                      // Group by department - show all assignments, not just filtered
                      const displayAssignments = selectedDepartment ? filteredAssignments : subjectAssignments;
                      const groupedByDept = displayAssignments.reduce((acc, assignment) => {
                        if (!acc[assignment.departmentId]) {
                          acc[assignment.departmentId] = {};
                        }
                        if (!acc[assignment.departmentId][assignment.classId]) {
                          acc[assignment.departmentId][assignment.classId] = {};
                        }
                        
                        // Group by sections
                        assignment.sectionIds.forEach(sectionId => {
                          if (!acc[assignment.departmentId][assignment.classId][sectionId]) {
                            acc[assignment.departmentId][assignment.classId][sectionId] = [];
                          }
                          acc[assignment.departmentId][assignment.classId][sectionId].push(assignment);
                        });
                        
                        return acc;
                      }, {});

                      return Object.entries(groupedByDept).map(([deptId, deptClasses]) => {
                        const department = departments.find(d => d._id === deptId);
                        const isHigherSecondary = deptId === 'dept-5';
                        const isDeptCollapsed = collapsedDepartments[deptId];
                    
                    return (
                          <div key={deptId} className="border-2 border-purple-200 rounded-xl overflow-hidden bg-white">
                            {/* Department Header - Always Collapsible */}
                            <button
                              onClick={() => toggleDepartmentCollapse(deptId)}
                              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 md:px-6 py-3 md:py-4 cursor-pointer hover:from-blue-600 hover:to-blue-700"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="text-base md:text-xl font-bold text-white">{department?.name}</h3>
                                <i className={`fas fa-chevron-${isDeptCollapsed ? 'down' : 'up'} text-white text-sm md:text-lg`}></i>
                            </div>
                            </button>

                            {/* Classes */}
                            {!isDeptCollapsed && (
                              <div className="divide-y divide-slate-200">
                                {Object.entries(deptClasses).map(([classId, classSections]) => {
                                  const classItem = classes.find(c => c._id === classId);
                                  const isGrade11 = classItem?.name.includes('Grade 11');
                                  const isClassCollapsed = collapsedClasses[classId];
                                  
                                  return (
                                    <div key={classId} className="bg-white">
                                      {/* Class Header - Always Collapsible */}
                                      <button
                                        onClick={() => toggleClassCollapse(classId)}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 md:px-6 py-2 md:py-3 cursor-pointer hover:from-green-600 hover:to-emerald-600"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm md:text-lg font-semibold text-white">{classItem?.name}</span>
                                          <i className={`fas fa-chevron-${isClassCollapsed ? 'down' : 'up'} text-white text-sm`}></i>
                            </div>
                                      </button>
                            
                                      {/* Sections */}
                                      {!isClassCollapsed && (
                                        <div className="p-2 md:p-4">
                                          {Object.entries(classSections).map(([sectionId, sectionAssignments]) => {
                                            const section = sections.find(s => s._id === sectionId);
                                            const uniqueSubjects = [...new Set(sectionAssignments.map(a => a.subjectId))];
                                            
                                            return (
                                              <div key={sectionId} className="mb-4 last:mb-0 border border-slate-200 rounded-lg overflow-hidden">
                                                {/* Section Header */}
                                                <div className="bg-purple-50 px-3 md:px-4 py-2 md:py-3 border-b border-slate-200">
                                                  <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                                      <i className="fas fa-layer-group text-white text-xs md:text-sm"></i>
                                                    </div>
                                                    <span className="font-semibold text-slate-900">{section?.name}</span>
                                                    <span className="text-xs text-slate-500">
                                                      ({uniqueSubjects.length} subject{uniqueSubjects.length !== 1 ? 's' : ''})
                                                    </span>
                                                  </div>
                                                </div>
                          
                                                {/* Subjects in this section */}
                                                <div className="p-2 md:p-4 bg-white">
                                                  <div className="flex flex-wrap gap-2">
                                                    {uniqueSubjects.map(subjectId => {
                                                      const subject = subjects.find(s => s._id === subjectId);
                                                      const assignment = sectionAssignments.find(a => a.subjectId === subjectId);
                                                      const teacherAssignment = subjectTeacherAssignments.find(
                                                        ta => ta.subjectId === subjectId && ta.sectionId === sectionId
                                                      );
                                                      const assignedTeacher = teacherAssignment ? teachers.find(t => t._id === teacherAssignment.teacherId) : null;
                                                      
                                                      return (
                                                        <div key={subjectId} className="flex items-center justify-between gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                                                          <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1">
                                                              <span className="text-sm font-medium text-indigo-900 truncate">{subject?.name}</span>
                                                              <span className="text-xs text-indigo-600 flex-shrink-0">({subject?.code})</span>
                                                            </div>
                                                            {assignedTeacher ? (
                                                              <div className="text-xs mt-1 flex items-center gap-1 text-green-600">
                                                                <i className="fas fa-user-tie"></i>
                                                                <span className="truncate">{assignedTeacher.name}</span>
                                                              </div>
                                                            ) : (
                                                              <button
                                                                onClick={() => openTeacherAssignModal(deptId, classId, sectionId, subjectId)}
                                                                className="mt-1 text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                                                              >
                                                                <i className="fas fa-plus"></i>
                                                                Add Teacher
                                                              </button>
                                                            )}
                                                          </div>
                                                          <div className="flex gap-1 flex-shrink-0">
                                                            {assignedTeacher && (
                                                              <button
                                                                onClick={() => openTeacherAssignModal(deptId, classId, sectionId, subjectId)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                                title="Edit Teacher Assignment"
                                                              >
                                                                <i className="fas fa-edit text-xs"></i>
                                                              </button>
                                                            )}
                                                            <button
                                                              onClick={() => handleDeleteAssignment(assignment._id)}
                                                              className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                              title="Delete Assignment"
                                                            >
                                                              <i className="fas fa-trash text-xs"></i>
                                                            </button>
                                                          </div>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
                                  );
                                })}
          </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                </div>
              )}
            </div>
          </div>

        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 px-4 md:px-8 mt-auto">
          <div className="text-center">
            <p className="text-slate-500 text-sm">© 2024 MySkillDB. All rights reserved.</p>
          </div>
        </footer>
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

      {/* Teacher Assignment Modal */}
      {isTeacherAssignModalOpen && (
        <TeacherAssignmentModal
          isOpen={isTeacherAssignModalOpen}
          onClose={closeTeacherAssignModal}
          onSubmit={async (formData) => {
            try {
              setIsLoading(true);
              
              // Find the existing assignment being edited
              const existingAssignment = subjectTeacherAssignments.find(
                ta => ta.subjectId === teacherAssignmentData.subjectId && 
                      ta.sectionId === teacherAssignmentData.sectionId
              );
              
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              if (existingAssignment) {
                // EDITING MODE: Update all assignments for this teacher in this section
                setSubjectTeacherAssignments(prev => {
                  // Step 1: Remove all assignments for this teacher in this section
                  let filtered = prev.filter(assignment => 
                    !(assignment.teacherId === existingAssignment.teacherId && 
                      assignment.sectionId === formData.sectionId)
                  );
                  
                  // Step 2: Remove any subjects from other teachers that are being reassigned to this teacher
                  filtered = filtered.filter(assignment => 
                    !(formData.subjectIds.includes(assignment.subjectId) && 
                      assignment.sectionId === formData.sectionId)
                  );
                  
                  // Step 3: Add new assignments with the updated subject list
                  const newAssignments = formData.subjectIds.map(subjectId => ({
                    _id: `ta-${Date.now()}-${subjectId}-${Math.random()}`,
                    teacherId: formData.teacherId,
                    subjectId: subjectId,
                    sectionId: formData.sectionId,
                    classId: formData.classId,
                    departmentId: formData.departmentId,
                    isClassTeacher: formData.isClassTeacher
                  }));
                  
                  return [...filtered, ...newAssignments];
                });
                
                toast.success('Teacher assignment updated successfully!');
              } else {
                // CREATE MODE: Save new teacher assignments
                const newAssignments = formData.subjectIds.map(subjectId => ({
                  _id: `ta-${Date.now()}-${subjectId}-${Math.random()}`,
                  teacherId: formData.teacherId,
                  subjectId: subjectId,
                  sectionId: formData.sectionId,
                  classId: formData.classId,
                  departmentId: formData.departmentId,
                  isClassTeacher: formData.isClassTeacher
                }));
                
                setSubjectTeacherAssignments(prev => {
                  // Remove any existing assignments for these subjects in this section
                  const filtered = prev.filter(assignment => 
                    !(formData.subjectIds.includes(assignment.subjectId) && 
                      assignment.sectionId === formData.sectionId)
                  );
                  return [...filtered, ...newAssignments];
                });
                
                toast.success('Teacher assigned successfully!');
              }
              
              closeTeacherAssignModal();
            } catch (error) {
              toast.error('Failed to assign teacher');
            } finally {
              setIsLoading(false);
            }
          }}
          formData={(() => {
            const existingAssignment = subjectTeacherAssignments.find(
              ta => ta.subjectId === teacherAssignmentData.subjectId && 
                    ta.sectionId === teacherAssignmentData.sectionId
            );
            
            // When editing, get all subjects assigned to this teacher in this section
            const teacherSubjectsInSection = existingAssignment 
              ? subjectTeacherAssignments
                  .filter(ta => 
                    ta.teacherId === existingAssignment.teacherId &&
                    ta.sectionId === teacherAssignmentData.sectionId
                  )
                  .map(ta => ta.subjectId)
              : [teacherAssignmentData.subjectId];
            
            return {
              teacherId: existingAssignment?.teacherId || '',
              departmentId: teacherAssignmentData.departmentId,
              classId: teacherAssignmentData.classId,
              sectionId: teacherAssignmentData.sectionId,
              subjectIds: teacherSubjectsInSection,
              isClassTeacher: existingAssignment?.isClassTeacher || false
            };
          })()}
          setFormData={() => {}}
          teachers={teachers}
          departments={departments}
          classes={classes}
          sections={sections}
          subjects={subjects}
          subjectAssignments={subjectAssignments}
          teacherAssignments={subjectTeacherAssignments}
          editingAssignment={(() => {
            const existingAssignment = subjectTeacherAssignments.find(
              ta => ta.subjectId === teacherAssignmentData.subjectId && 
                    ta.sectionId === teacherAssignmentData.sectionId
            );
            return existingAssignment || null;
          })()}
          isLoading={isLoading}
          inputBaseClass="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          btnIndigoClass="font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95 bg-indigo-500 hover:bg-indigo-600 text-white"
          btnSlateClass="font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95 bg-slate-200 hover:bg-slate-300 text-slate-800"
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Confirm Deletion</h2>
                  <p className="text-slate-500 text-sm">Please solve this math problem to confirm deletion</p>
                </div>
                <button
                  onClick={closeDeleteConfirmation}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-lg font-semibold text-red-900 mb-2">Delete Subject Assignment?</p>
                  <p className="text-sm text-red-700">This action cannot be undone.</p>
                </div>

                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                  <p className="text-center text-slate-700 mb-4">Solve this multiplication problem:</p>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-4">
                      {deleteQuestion.num1} × {deleteQuestion.num2} = ?
                    </div>
                    <input
                      type="number"
                      value={deleteAnswer}
                      onChange={(e) => setDeleteAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      className="w-full p-3 border border-slate-300 rounded-lg text-center text-lg font-semibold focus:ring-2 focus:ring-red-500 outline-none"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={closeDeleteConfirmation}
                  className="font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95 bg-slate-200 hover:bg-slate-300 text-slate-800 flex-1 sm:flex-none"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95 bg-red-500 hover:bg-red-600 text-white flex-1"
                  disabled={!deleteAnswer || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash"></i>
                      Delete Assignment
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

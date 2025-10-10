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
  
  // Collapsible state for Step 4 sections
  const [collapsedDepartments, setCollapsedDepartments] = useState({});
  const [collapsedClasses, setCollapsedClasses] = useState({});
  
  // Teacher assignment modal state
  const [isTeacherAssignModalOpen, setIsTeacherAssignModalOpen] = useState(false);
  const [teacherAssignmentData, setTeacherAssignmentData] = useState({
    departmentId: '',
    classId: '',
    sectionId: '',
    subjectId: ''
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Current organization ID (would come from context/auth in real app)
  const [currentOrganizationId, setCurrentOrganizationId] = useState('org-123');

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

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />
      <LoaderOverlay isVisible={isLoading} title="MySkillDB" subtitle="Loading your data, please wait…" />
      
      {/* Navigation Component */}
      {!isAssignmentModalOpen && !isTeacherAssignModalOpen && <OrgMenuNavigation currentPage="define-subjects" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={(isAssignmentModalOpen || isTeacherAssignModalOpen) ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Subject Setup</h1>
              <p className="text-slate-500 text-sm">Assign subjects to sections within departments and classes</p>
            </div>
          </header>

          {/* Step-by-Step Guide Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-route text-white"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Assignment Flow Guide</h2>
                <p className="text-sm text-slate-600">Follow these steps to assign subjects</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${selectedDepartment ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedDepartment ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  1
                </div>
                <span className={`text-sm font-medium ${selectedDepartment ? 'text-green-900' : 'text-red-900'}`}>
                  Department & Class
                </span>
                {selectedDepartment && selectedClass && <i className="fas fa-check text-green-600"></i>}
              </div>
              
              <i className="fas fa-arrow-right text-slate-400"></i>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${sectionsToAssign.length > 0 ? 'bg-green-100 border-2 border-green-500' : selectedClass ? 'bg-blue-100 border-2 border-blue-300' : 'bg-slate-100 border-2 border-slate-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${sectionsToAssign.length > 0 ? 'bg-green-500 text-white' : selectedClass ? 'bg-blue-500 text-white' : 'bg-slate-400 text-white'}`}>
                  2
                </div>
                <span className={`text-sm font-medium ${sectionsToAssign.length > 0 ? 'text-green-900' : selectedClass ? 'text-blue-900' : 'text-slate-500'}`}>
                  Select Sections ({sectionsToAssign.length})
                </span>
                {sectionsToAssign.length > 0 && <i className="fas fa-check text-green-600"></i>}
              </div>
              
              <i className="fas fa-arrow-right text-slate-400"></i>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${sectionsToAssign.length > 0 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-slate-100 border-2 border-slate-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${sectionsToAssign.length > 0 ? 'bg-blue-500 text-white' : 'bg-slate-400 text-white'}`}>
                  3
                </div>
                <span className={`text-sm font-medium ${sectionsToAssign.length > 0 ? 'text-blue-900' : 'text-slate-500'}`}>
                  Assign Subjects
                </span>
              </div>
              
              <i className="fas fa-arrow-right text-slate-400"></i>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${selectedDepartment && selectedClass ? 'bg-purple-100 border-2 border-purple-300' : 'bg-slate-100 border-2 border-slate-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedDepartment && selectedClass ? 'bg-purple-500 text-white' : 'bg-slate-400 text-white'}`}>
                  4
                </div>
                <span className={`text-sm font-medium ${selectedDepartment && selectedClass ? 'text-purple-900' : 'text-slate-500'}`}>
                  Review Assignments
                </span>
              </div>
            </div>
          </div>

          {/* Filters with Visual Guidance */}
          <div className={`bg-white rounded-xl shadow-sm p-6 ${!selectedDepartment || !selectedClass ? 'border-2 border-red-300' : 'border border-slate-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Step 1 & 2: Select Department and Class</h2>
                {!selectedDepartment || !selectedClass ? (
                  <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <i className="fas fa-exclamation-circle"></i>
                    Required
                  </span>
                ) : null}
              </div>
              {selectedDepartment && selectedClass && (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <i className="fas fa-check-circle"></i>
                  Ready to select sections
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border-2 ${!selectedDepartment ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedDepartment ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                    1
                  </div>
                  Department *
                  {!selectedDepartment && <span className="text-xs text-blue-600 font-medium">← Start here</span>}
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className={`${inputBaseClass} ${selectedDepartment ? 'border-green-300' : 'border-blue-300'}`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
                {selectedDepartment && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
                    <i className="fas fa-check"></i>
                    <span>Department selected</span>
                  </div>
                )}
              </div>

              <div className={`p-4 rounded-lg border-2 ${!selectedClass ? selectedDepartment ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50' : 'border-green-300 bg-green-50'}`}>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedClass ? 'bg-green-500 text-white' : selectedDepartment ? 'bg-blue-500 text-white' : 'bg-slate-400 text-white'}`}>
                    2
                  </div>
                  Class *
                  {selectedDepartment && !selectedClass && <span className="text-xs text-blue-600 font-medium">← Next step</span>}
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className={`${inputBaseClass} ${selectedClass ? 'border-green-300' : selectedDepartment ? 'border-blue-300' : 'border-slate-300'}`}
                  disabled={!selectedDepartment}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
                {selectedClass && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
                    <i className="fas fa-check"></i>
                    <span>Class selected</span>
              </div>
                )}
              </div>
            </div>
              </div>

          {/* Section Selection */}
          {selectedDepartment && selectedClass && (
            <div className="bg-white rounded-xl shadow-sm border-2 border-blue-300 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
              <div>
                    <h2 className="text-lg font-bold text-slate-900">Step 2: Select Sections</h2>
                    <p className="text-sm text-slate-600">Choose sections in {classes.find(c => c._id === selectedClass)?.name} to which you want to assign subjects</p>
                  </div>
                </div>
                {sectionsToAssign.length > 0 && (
                  <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <i className="fas fa-check-circle"></i>
                    {sectionsToAssign.length} section{sectionsToAssign.length !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              
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

              {sectionsToAssign.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium">
                    <i className="fas fa-info-circle mr-2"></i>
                    Now scroll down to "Available Subjects" and click on any subject to assign it to the selected {sectionsToAssign.length} section{sectionsToAssign.length !== 1 ? 's' : ''}.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Subject Selection - Step 3 */}
          {sectionsToAssign.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border-2 border-blue-300 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-blue-50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                <div>
                      <h2 className="text-lg font-bold text-slate-900">Step 3: Select Subjects to Assign</h2>
                      <p className="text-slate-600 text-sm">
                        Choose subjects from {departments.find(d => d._id === selectedDepartment)?.name} department to assign to {sectionsToAssign.length} section{sectionsToAssign.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-700">
                      {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
                    </span>
                </div>
              </div>
            </div>

            <div className="p-6">
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
                        onClick={() => {
                          try {
                            if (selectedDepartment) {
                              localStorage.setItem('preselectedDepartment', selectedDepartment);
                            }
                            localStorage.setItem('openSubjectModal', '1');
                          } catch {}
                          window.location.href = '/admin/classrooms/view';
                        }}
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
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6 max-h-96 overflow-y-auto p-2">
                      {filteredAndSearchedSubjects.map(subject => {
                        const isSelected = selectedSubjects.includes(subject._id);
                        
                    return (
                          <button
                            key={subject._id}
                            onClick={() => toggleSubjectSelection(subject._id)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              isSelected 
                                ? 'border-green-500 bg-green-50 shadow-md' 
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-green-500' : 'bg-slate-100'
                              }`}>
                                <i className={`fas fa-book ${isSelected ? 'text-white' : 'text-slate-600'}`}></i>
                          </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-green-900' : 'text-slate-900'}`}>
                                  {subject.name}
                                </h3>
                                <p className={`text-xs mb-2 ${isSelected ? 'text-green-700' : 'text-slate-500'}`}>
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
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <p className="font-medium text-slate-900 mb-1">
                              Ready to assign {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-slate-600">
                              To {sectionsToAssign.length} section{sectionsToAssign.length !== 1 ? 's' : ''}: {sectionsToAssign.map(id => sections.find(s => s._id === id)?.name).join(', ')}
                            </p>
                          </div>
                        <button
                            onClick={handleBatchAssignment}
                            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                        >
                            <i className="fas fa-check-circle text-lg"></i>
                            <span>Assign {selectedSubjects.length} Subject{selectedSubjects.length !== 1 ? 's' : ''}</span>
                        </button>
                      </div>
                </div>
                    )}
                  </>
              )}
            </div>
          </div>
          )}

          {/* Current Assignments - Step 4 */}
          {selectedDepartment && selectedClass && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-purple-200 bg-white bg-opacity-50">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">4</span>
                    </div>
                <div>
                      <h2 className="text-lg font-bold text-slate-900">Step 4: Review and Assign Teachers for Subjects</h2>
                      <p className="text-slate-600 text-sm">
                        Review subjects assigned to {classes.find(c => c._id === selectedClass)?.name} in {departments.find(d => d._id === selectedDepartment)?.name} and assign teachers
                      </p>
                </div>
                  </div>
                  <span className="text-sm font-medium text-purple-700">
                    {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''}
                  </span>
              </div>
            </div>

            <div className="p-6">
                {filteredAssignments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <i className="fas fa-book text-4xl mb-4 text-slate-300"></i>
                    <p className="font-medium mb-2">No assignments found</p>
                    <p className="text-sm">Assign subjects to sections using Step 3 above.</p>
                </div>
              ) : (
                  <div className="space-y-6">
                    {/* Group assignments by department, then class, then section */}
                    {(() => {
                      // Group by department
                      const groupedByDept = filteredAssignments.reduce((acc, assignment) => {
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
                            {/* Department Header - Collapsible for Higher Secondary */}
                            <button
                              onClick={() => isHigherSecondary && toggleDepartmentCollapse(deptId)}
                              className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 ${isHigherSecondary ? 'cursor-pointer hover:from-blue-600 hover:to-blue-700' : 'cursor-default'}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-building text-white text-lg"></i>
                            </div>
                                  <h3 className="text-xl font-bold text-white">{department?.name}</h3>
                                </div>
                                {isHigherSecondary && (
                                  <i className={`fas fa-chevron-${isDeptCollapsed ? 'down' : 'up'} text-white text-lg`}></i>
                                )}
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
                                      {/* Class Header - Collapsible for Grade 11 */}
                                      <button
                                        onClick={() => isGrade11 && toggleClassCollapse(classId)}
                                        className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 ${isGrade11 ? 'cursor-pointer hover:from-green-600 hover:to-emerald-600' : 'cursor-default'}`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                              <i className="fas fa-graduation-cap text-white"></i>
                            </div>
                                            <span className="text-lg font-semibold text-white">{classItem?.name}</span>
                                          </div>
                                          {isGrade11 && (
                                            <i className={`fas fa-chevron-${isClassCollapsed ? 'down' : 'up'} text-white`}></i>
                                          )}
                                        </div>
                                      </button>
                            
                                      {/* Sections */}
                                      {!isClassCollapsed && (
                                        <div className="p-4">
                                          {Object.entries(classSections).map(([sectionId, sectionAssignments]) => {
                                            const section = sections.find(s => s._id === sectionId);
                                            const uniqueSubjects = [...new Set(sectionAssignments.map(a => a.subjectId))];
                                            
                                            return (
                                              <div key={sectionId} className="mb-4 last:mb-0 border border-slate-200 rounded-lg overflow-hidden">
                                                {/* Section Header */}
                                                <div className="bg-purple-50 px-4 py-3 border-b border-slate-200">
                                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                                    <div className="flex items-center gap-2">
                                                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                                        <i className="fas fa-layer-group text-white text-sm"></i>
                                                      </div>
                                                      <span className="font-semibold text-slate-900">{section?.name}</span>
                                                      <span className="text-xs text-slate-500">
                                                        ({uniqueSubjects.length} subject{uniqueSubjects.length !== 1 ? 's' : ''})
                                </span>
                                                    </div>
                                                    <div className="text-xs text-slate-600 bg-white px-3 py-1 rounded-full">
                                                      <i className="fas fa-info-circle mr-1"></i>
                                                      Click <i className="fas fa-chalkboard-teacher mx-1"></i> to assign a teacher to each subject
                                                    </div>
                            </div>
                          </div>
                          
                                                {/* Subjects in this section */}
                                                <div className="p-4 bg-white">
                                                  <div className="flex flex-wrap gap-2">
                                                    {uniqueSubjects.map(subjectId => {
                                                      const subject = subjects.find(s => s._id === subjectId);
                                                      const assignment = sectionAssignments.find(a => a.subjectId === subjectId);
                                                      
                                                      return (
                                                        <div key={subjectId} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                                                          <i className="fas fa-book text-indigo-600 text-sm"></i>
                                                          <span className="text-sm font-medium text-indigo-900">{subject?.name}</span>
                                                          <span className="text-xs text-indigo-600">({subject?.code})</span>
                                                          <div className="flex gap-1 ml-2">
                                                            <button
                                                              onClick={() => openTeacherAssignModal(deptId, classId, sectionId, subjectId)}
                                                              className="p-1 text-orange-600 hover:bg-orange-100 rounded transition-colors"
                                                              title="Assign a teacher to teach this subject"
                                                            >
                                                              <i className="fas fa-chalkboard-teacher text-xs"></i>
                                                            </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment._id)}
                                                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
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
          )}

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

      {/* Teacher Assignment Modal */}
      {isTeacherAssignModalOpen && (
        <TeacherAssignmentModal
          isOpen={isTeacherAssignModalOpen}
          onClose={closeTeacherAssignModal}
          onSubmit={async (formData) => {
            try {
              setIsLoading(true);
              
              // Simulate API call to create teacher assignment
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              toast.success('Teacher assigned successfully!');
              closeTeacherAssignModal();
              
              // Optionally refresh data
              // await fetchAllData();
            } catch (error) {
              toast.error('Failed to assign teacher');
            } finally {
              setIsLoading(false);
            }
          }}
          formData={{
            teacherId: '',
            departmentId: teacherAssignmentData.departmentId,
            classId: teacherAssignmentData.classId,
            sectionId: teacherAssignmentData.sectionId,
            subjectIds: [teacherAssignmentData.subjectId],
            isClassTeacher: false
          }}
          setFormData={() => {}}
          teachers={teachers}
          departments={departments}
          classes={classes}
          sections={sections}
          subjects={subjects}
          subjectAssignments={subjectAssignments}
          teacherAssignments={[]}
          editingAssignment={null}
          isLoading={isLoading}
          inputBaseClass="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          btnIndigoClass="font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95 bg-indigo-500 hover:bg-indigo-600 text-white"
          btnSlateClass="font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95 bg-slate-200 hover:bg-slate-300 text-slate-800"
        />
      )}
    </div>
  );
};

export default AdminSubjectAssign;

import { useState, useEffect, useMemo } from 'react';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import {
  TeacherSelector,
  SubjectAssignment,
  AssignmentDisplay,
  TeacherAssignmentModal
} from '../../components/org-admin-components/teacher-management-components';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import LoaderOverlay from '../../components/loader/LoaderOverlay';

const TeacherAssignments = () => {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);

  // State for global entities
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacherAssignments, setTeacherAssignments] = useState([]);
  const [subjectAssignments, setSubjectAssignments] = useState([]);

  // Selection states
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');

  // Modal states
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Form data for assignment modal
  const [assignmentFormData, setAssignmentFormData] = useState({
    teacherId: '',
    departmentId: '',
    classId: '',
    sectionId: '',
    subjectIds: [],
    isClassTeacher: false
  });

  // Sorting state
  const [sortBy, setSortBy] = useState('subjectsCount'); // 'subjectsCount', 'teacherName', 'department'

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState({
    teachers: false,
    departments: false,
    classes: false,
    sections: false,
    subjects: false,
    assignments: false
  });

  // Current organization ID (would come from context/auth in real app)
  const [currentOrganizationId, setCurrentOrganizationId] = useState('org-123');

  // --- API CALLS ---

  const fetchTeachers = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, teachers: true }));
      
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
        { _id: 'teacher-10', name: 'Dr. Vinod Menon', email: 'vinod.menon@school.edu', departmentId: 'dept-5' },
        // Additional unassigned teachers for testing
        { _id: 'teacher-11', name: 'Ms. Sunita Patel', email: 'sunita.patel@school.edu', departmentId: 'dept-2' },
        { _id: 'teacher-12', name: 'Mr. Vikram Singh', email: 'vikram.singh@school.edu', departmentId: 'dept-2' },
        { _id: 'teacher-13', name: 'Dr. Meera Nair', email: 'meera.nair@school.edu', departmentId: 'dept-3' },
        { _id: 'teacher-14', name: 'Prof. Suresh Kumar', email: 'suresh.kumar@school.edu', departmentId: 'dept-4' },
        { _id: 'teacher-15', name: 'Ms. Radha Iyer', email: 'radha.iyer@school.edu', departmentId: 'dept-4' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setTeachers(dummyTeachers);
      
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
    } finally {
      setLoadingEntities(prev => ({ ...prev, teachers: false }));
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, departments: true }));
      
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
    } finally {
      setLoadingEntities(prev => ({ ...prev, departments: false }));
    }
  };

  const fetchClasses = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, classes: true }));
      
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
    } finally {
      setLoadingEntities(prev => ({ ...prev, classes: false }));
    }
  };

  const fetchSections = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, sections: true }));
      
      const dummySections = [
        { _id: 'section-1', name: 'Section A', description: 'Section A' },
        { _id: 'section-2', name: 'Section B', description: 'Section B' }
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

  const fetchSubjects = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, subjects: true }));
      
      const dummySubjects = [
        // Common subjects for Grades 1-10 (Lower Primary)
        { _id: 'subject-1', name: 'English', code: 'ENG', departmentId: 'dept-2', description: 'English Language', credits: '4', type: 'core' },
        { _id: 'subject-2', name: 'Malayalam', code: 'MAL', departmentId: 'dept-2', description: 'Malayalam Language', credits: '4', type: 'core' },
        { _id: 'subject-3', name: 'Mathematics', code: 'MATH', departmentId: 'dept-2', description: 'Mathematics', credits: '5', type: 'core' },
        { _id: 'subject-4', name: 'Science', code: 'SCI', departmentId: 'dept-2', description: 'General Science', credits: '4', type: 'core' },
        { _id: 'subject-5', name: 'Social Science', code: 'SOC', departmentId: 'dept-2', description: 'Social Studies', credits: '3', type: 'core' },
        
        // Upper Primary subjects
        { _id: 'subject-6', name: 'English', code: 'ENG', departmentId: 'dept-3', description: 'English Language', credits: '4', type: 'core' },
        { _id: 'subject-7', name: 'Malayalam', code: 'MAL', departmentId: 'dept-3', description: 'Malayalam Language', credits: '4', type: 'core' },
        { _id: 'subject-8', name: 'Mathematics', code: 'MATH', departmentId: 'dept-3', description: 'Mathematics', credits: '5', type: 'core' },
        { _id: 'subject-9', name: 'Science', code: 'SCI', departmentId: 'dept-3', description: 'General Science', credits: '4', type: 'core' },
        { _id: 'subject-10', name: 'Social Science', code: 'SOC', departmentId: 'dept-3', description: 'Social Studies', credits: '3', type: 'core' },
        
        // High School subjects
        { _id: 'subject-11', name: 'English', code: 'ENG', departmentId: 'dept-4', description: 'English Language', credits: '4', type: 'core' },
        { _id: 'subject-12', name: 'Malayalam', code: 'MAL', departmentId: 'dept-4', description: 'Malayalam Language', credits: '4', type: 'core' },
        { _id: 'subject-13', name: 'Mathematics', code: 'MATH', departmentId: 'dept-4', description: 'Mathematics', credits: '5', type: 'core' },
        { _id: 'subject-14', name: 'Science', code: 'SCI', departmentId: 'dept-4', description: 'General Science', credits: '4', type: 'core' },
        { _id: 'subject-15', name: 'Social Science', code: 'SOC', departmentId: 'dept-4', description: 'Social Studies', credits: '3', type: 'core' },
        
        // Grade 11 & 12 - Higher Secondary (Unique subjects shared across streams)
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
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setSubjects(dummySubjects);
      
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    } finally {
      setLoadingEntities(prev => ({ ...prev, subjects: false }));
    }
  };

  const fetchTeacherAssignments = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, assignments: true }));
      
      // Dummy data for teacher assignments
      const dummyAssignments = [
        // Lower Primary - Grade 5 Section A (5 teachers)
        { _id: 'ta-1', teacherId: 'teacher-1', departmentId: 'dept-2', classId: 'class-7', sectionId: 'section-1', subjectIds: ['subject-1'], isClassTeacher: true },
        { _id: 'ta-2', teacherId: 'teacher-2', departmentId: 'dept-2', classId: 'class-7', sectionId: 'section-1', subjectIds: ['subject-2'], isClassTeacher: false },
        { _id: 'ta-3', teacherId: 'teacher-11', departmentId: 'dept-2', classId: 'class-7', sectionId: 'section-1', subjectIds: ['subject-3'], isClassTeacher: false },
        { _id: 'ta-4', teacherId: 'teacher-12', departmentId: 'dept-2', classId: 'class-7', sectionId: 'section-1', subjectIds: ['subject-4'], isClassTeacher: false },
        { _id: 'ta-5', teacherId: 'teacher-1', departmentId: 'dept-2', classId: 'class-7', sectionId: 'section-1', subjectIds: ['subject-5'], isClassTeacher: false },
        
        // Lower Primary - Grade 5 Section B (5 teachers)
        { _id: 'ta-6', teacherId: 'teacher-2', departmentId: 'dept-2', classId: 'class-7', sectionId: 'section-2', subjectIds: ['subject-1'], isClassTeacher: true },
        { _id: 'ta-7', teacherId: 'teacher-1', departmentId: 'dept-2', classId: 'class-7', sectionId: 'section-2', subjectIds: ['subject-2'], isClassTeacher: false },
        { _id: 'ta-8', teacherId: 'teacher-11', departmentId: 'dept-2', classId: 'class-7', sectionId: 'section-2', subjectIds: ['subject-3'], isClassTeacher: false },
        { _id: 'ta-9', teacherId: 'teacher-12', departmentId: 'dept-2', classId: 'class-7', sectionId: 'section-2', subjectIds: ['subject-4'], isClassTeacher: false },
        { _id: 'ta-10', teacherId: 'teacher-2', departmentId: 'dept-2', classId: 'class-7', sectionId: 'section-2', subjectIds: ['subject-5'], isClassTeacher: false },
        
        // Upper Primary - Grade 6 Section A (5 teachers)
        { _id: 'ta-11', teacherId: 'teacher-3', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-1', subjectIds: ['subject-6'], isClassTeacher: true },
        { _id: 'ta-12', teacherId: 'teacher-4', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-1', subjectIds: ['subject-7'], isClassTeacher: false },
        { _id: 'ta-13', teacherId: 'teacher-13', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-1', subjectIds: ['subject-8'], isClassTeacher: false },
        { _id: 'ta-14', teacherId: 'teacher-3', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-1', subjectIds: ['subject-9'], isClassTeacher: false },
        { _id: 'ta-15', teacherId: 'teacher-4', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-1', subjectIds: ['subject-10'], isClassTeacher: false },
        
        // Upper Primary - Grade 6 Section B (5 teachers)
        { _id: 'ta-16', teacherId: 'teacher-4', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-2', subjectIds: ['subject-6'], isClassTeacher: true },
        { _id: 'ta-17', teacherId: 'teacher-3', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-2', subjectIds: ['subject-7'], isClassTeacher: false },
        { _id: 'ta-18', teacherId: 'teacher-13', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-2', subjectIds: ['subject-8'], isClassTeacher: false },
        { _id: 'ta-19', teacherId: 'teacher-4', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-2', subjectIds: ['subject-9'], isClassTeacher: false },
        { _id: 'ta-20', teacherId: 'teacher-3', departmentId: 'dept-3', classId: 'class-8', sectionId: 'section-2', subjectIds: ['subject-10'], isClassTeacher: false },
        
        // High School - Grade 10 Section A (5 teachers)
        { _id: 'ta-21', teacherId: 'teacher-5', departmentId: 'dept-4', classId: 'class-12', sectionId: 'section-1', subjectIds: ['subject-11'], isClassTeacher: true },
        { _id: 'ta-22', teacherId: 'teacher-6', departmentId: 'dept-4', classId: 'class-12', sectionId: 'section-1', subjectIds: ['subject-12'], isClassTeacher: false },
        { _id: 'ta-23', teacherId: 'teacher-14', departmentId: 'dept-4', classId: 'class-12', sectionId: 'section-1', subjectIds: ['subject-13'], isClassTeacher: false },
        { _id: 'ta-24', teacherId: 'teacher-15', departmentId: 'dept-4', classId: 'class-12', sectionId: 'section-1', subjectIds: ['subject-14'], isClassTeacher: false },
        { _id: 'ta-25', teacherId: 'teacher-5', departmentId: 'dept-4', classId: 'class-12', sectionId: 'section-1', subjectIds: ['subject-15'], isClassTeacher: false },
        
        // High School - Grade 10 Section B (5 teachers)
        { _id: 'ta-26', teacherId: 'teacher-6', departmentId: 'dept-4', classId: 'class-12', sectionId: 'section-2', subjectIds: ['subject-11'], isClassTeacher: true },
        { _id: 'ta-27', teacherId: 'teacher-5', departmentId: 'dept-4', classId: 'class-12', sectionId: 'section-2', subjectIds: ['subject-12'], isClassTeacher: false },
        { _id: 'ta-28', teacherId: 'teacher-14', departmentId: 'dept-4', classId: 'class-12', sectionId: 'section-2', subjectIds: ['subject-13'], isClassTeacher: false },
        { _id: 'ta-29', teacherId: 'teacher-15', departmentId: 'dept-4', classId: 'class-12', sectionId: 'section-2', subjectIds: ['subject-14'], isClassTeacher: false },
        { _id: 'ta-30', teacherId: 'teacher-6', departmentId: 'dept-4', classId: 'class-12', sectionId: 'section-2', subjectIds: ['subject-15'], isClassTeacher: false },
        
        // Higher Secondary - Grade 11 Bio Math Section A (5 teachers)
        { _id: 'ta-31', teacherId: 'teacher-7', departmentId: 'dept-5', classId: 'class-13', sectionId: 'section-1', subjectIds: ['subject-16'], isClassTeacher: true },
        { _id: 'ta-32', teacherId: 'teacher-8', departmentId: 'dept-5', classId: 'class-13', sectionId: 'section-1', subjectIds: ['subject-17'], isClassTeacher: false },
        { _id: 'ta-33', teacherId: 'teacher-9', departmentId: 'dept-5', classId: 'class-13', sectionId: 'section-1', subjectIds: ['subject-18'], isClassTeacher: false },
        { _id: 'ta-34', teacherId: 'teacher-10', departmentId: 'dept-5', classId: 'class-13', sectionId: 'section-1', subjectIds: ['subject-19'], isClassTeacher: false },
        { _id: 'ta-35', teacherId: 'teacher-7', departmentId: 'dept-5', classId: 'class-13', sectionId: 'section-1', subjectIds: ['subject-20'], isClassTeacher: false },
        
        // Higher Secondary - Grade 11 Bio Math Section B (5 teachers)
        { _id: 'ta-36', teacherId: 'teacher-8', departmentId: 'dept-5', classId: 'class-13', sectionId: 'section-2', subjectIds: ['subject-16'], isClassTeacher: true },
        { _id: 'ta-37', teacherId: 'teacher-7', departmentId: 'dept-5', classId: 'class-13', sectionId: 'section-2', subjectIds: ['subject-17'], isClassTeacher: false },
        { _id: 'ta-38', teacherId: 'teacher-9', departmentId: 'dept-5', classId: 'class-13', sectionId: 'section-2', subjectIds: ['subject-18'], isClassTeacher: false },
        { _id: 'ta-39', teacherId: 'teacher-10', departmentId: 'dept-5', classId: 'class-13', sectionId: 'section-2', subjectIds: ['subject-19'], isClassTeacher: false },
        { _id: 'ta-40', teacherId: 'teacher-8', departmentId: 'dept-5', classId: 'class-13', sectionId: 'section-2', subjectIds: ['subject-20'], isClassTeacher: false }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setTeacherAssignments(dummyAssignments);
      
    } catch (error) {
      console.error('Error fetching teacher assignments:', error);
      toast.error('Failed to fetch teacher assignments');
    } finally {
      setLoadingEntities(prev => ({ ...prev, assignments: false }));
    }
  };

  const fetchSubjectAssignments = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, assignments: true }));
      
      // Dummy data for subject assignments (from the subject assignment page)
      const dummySubjectAssignments = [
        // Lower Primary - Grade 5 (all 5 subjects to both sections)
        { _id: 'sa-1', subjectId: 'subject-1', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-2', subjectId: 'subject-2', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-3', subjectId: 'subject-3', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-4', subjectId: 'subject-4', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-5', subjectId: 'subject-5', departmentId: 'dept-2', classId: 'class-7', sectionIds: ['section-1', 'section-2'] },
        
        // Upper Primary - Grade 6 (all 5 subjects to both sections)
        { _id: 'sa-6', subjectId: 'subject-6', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-7', subjectId: 'subject-7', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-8', subjectId: 'subject-8', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-9', subjectId: 'subject-9', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-10', subjectId: 'subject-10', departmentId: 'dept-3', classId: 'class-8', sectionIds: ['section-1', 'section-2'] },
        
        // High School - Grade 10 (all 5 subjects to both sections)
        { _id: 'sa-11', subjectId: 'subject-11', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-12', subjectId: 'subject-12', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-13', subjectId: 'subject-13', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-14', subjectId: 'subject-14', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-15', subjectId: 'subject-15', departmentId: 'dept-4', classId: 'class-12', sectionIds: ['section-1', 'section-2'] },
        
        // Higher Secondary - Grade 11 Bio Math (Physics, Chemistry, Biology, Mathematics, English)
        { _id: 'sa-16', subjectId: 'subject-16', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-17', subjectId: 'subject-17', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-18', subjectId: 'subject-18', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-19', subjectId: 'subject-19', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-20', subjectId: 'subject-20', departmentId: 'dept-5', classId: 'class-13', sectionIds: ['section-1', 'section-2'] },
        
        // Higher Secondary - Grade 11 Bio Language (Biology, Physics, Chemistry, Malayalam, English)
        { _id: 'sa-21', subjectId: 'subject-18', departmentId: 'dept-5', classId: 'class-14', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-22', subjectId: 'subject-16', departmentId: 'dept-5', classId: 'class-14', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-23', subjectId: 'subject-17', departmentId: 'dept-5', classId: 'class-14', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-24', subjectId: 'subject-21', departmentId: 'dept-5', classId: 'class-14', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-25', subjectId: 'subject-20', departmentId: 'dept-5', classId: 'class-14', sectionIds: ['section-1', 'section-2'] },
        
        // Higher Secondary - Grade 11 Computer Maths (Computer Science, Mathematics, Physics, Chemistry, English)
        { _id: 'sa-26', subjectId: 'subject-22', departmentId: 'dept-5', classId: 'class-15', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-27', subjectId: 'subject-19', departmentId: 'dept-5', classId: 'class-15', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-28', subjectId: 'subject-16', departmentId: 'dept-5', classId: 'class-15', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-29', subjectId: 'subject-17', departmentId: 'dept-5', classId: 'class-15', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-30', subjectId: 'subject-20', departmentId: 'dept-5', classId: 'class-15', sectionIds: ['section-1', 'section-2'] },
        
        // Higher Secondary - Grade 11 Commerce (Accountancy, Business Studies, Economics, Mathematics, English)
        { _id: 'sa-31', subjectId: 'subject-23', departmentId: 'dept-5', classId: 'class-16', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-32', subjectId: 'subject-24', departmentId: 'dept-5', classId: 'class-16', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-33', subjectId: 'subject-25', departmentId: 'dept-5', classId: 'class-16', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-34', subjectId: 'subject-19', departmentId: 'dept-5', classId: 'class-16', sectionIds: ['section-1', 'section-2'] },
        { _id: 'sa-35', subjectId: 'subject-20', departmentId: 'dept-5', classId: 'class-16', sectionIds: ['section-1', 'section-2'] }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setSubjectAssignments(dummySubjectAssignments);
      
    } catch (error) {
      console.error('Error fetching subject assignments:', error);
      toast.error('Failed to fetch subject assignments');
    } finally {
      setLoadingEntities(prev => ({ ...prev, assignments: false }));
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchTeachers(),
      fetchDepartments(),
      fetchClasses(),
      fetchSections(),
      fetchSubjects(),
      fetchTeacherAssignments(),
      fetchSubjectAssignments()
    ]);
    setIsLoading(false);
  };

  // --- HANDLERS ---

  const handleTeacherChange = (teacherId) => {
    setSelectedTeacher(teacherId);
    setSelectedDepartment('');
    setSelectedClass('');
    setSelectedSection('');
  };

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

  const openAssignmentModal = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setAssignmentFormData({
        teacherId: assignment.teacherId,
        departmentId: assignment.departmentId,
        classId: assignment.classId,
        sectionId: assignment.sectionId,
        subjectIds: assignment.subjectIds,
        isClassTeacher: assignment.isClassTeacher
      });
    } else {
      setEditingAssignment(null);
      setAssignmentFormData({
        teacherId: selectedTeacher || '',
        departmentId: selectedDepartment || '',
        classId: selectedClass || '',
        sectionId: selectedSection || '',
        subjectIds: [],
        isClassTeacher: false
      });
    }
    setIsAssignmentModalOpen(true);
  };

  const closeAssignmentModal = () => {
    setIsAssignmentModalOpen(false);
    setEditingAssignment(null);
    setAssignmentFormData({
      teacherId: '',
      departmentId: '',
      classId: '',
      sectionId: '',
      subjectIds: [],
      isClassTeacher: false
    });
  };

  const handleCreateAssignment = async (formData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingAssignment) {
        // Update existing assignment
        setTeacherAssignments(prev => 
          prev.map(assignment => 
            assignment._id === editingAssignment._id
              ? { ...assignment, ...formData }
              : assignment
          )
        );
        toast.success('Teacher assignment updated successfully!');
      } else {
        // Create new assignment
        const newAssignment = {
          _id: `ta-${Date.now()}`,
          ...formData,
          organizationId: currentOrganizationId
        };
        setTeacherAssignments(prev => [...prev, newAssignment]);
        toast.success('Teacher assignment created successfully!');
      }
      
      closeAssignmentModal();
    } catch (error) {
      toast.error('Failed to save teacher assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTeacherAssignments(prev => 
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

  const filteredTeachers = useMemo(() => {
    if (!selectedDepartment && !selectedClass && !selectedSection) return teachers;
    
    // If section is selected, show only teachers assigned to that section
    if (selectedSection) {
      const sectionAssignments = teacherAssignments.filter(
        assignment => assignment.sectionId === selectedSection
      );
      const assignedTeacherIds = sectionAssignments.map(assignment => assignment.teacherId);
      return teachers.filter(teacher => assignedTeacherIds.includes(teacher._id));
    }
    
    // If class is selected, show teachers assigned to any section in that class
    if (selectedClass) {
      const classAssignments = teacherAssignments.filter(
        assignment => assignment.classId === selectedClass
      );
      const assignedTeacherIds = classAssignments.map(assignment => assignment.teacherId);
      return teachers.filter(teacher => assignedTeacherIds.includes(teacher._id));
    }
    
    // If only department is selected, filter by department
    if (selectedDepartment) {
      return teachers.filter(teacher => teacher.departmentId === selectedDepartment);
    }
    
    return teachers;
  }, [teachers, selectedDepartment, selectedClass, selectedSection, teacherAssignments]);


  // Overall teacher counts (all departments)
  const overallTeacherStats = useMemo(() => {
    const total = teachers.length;
    const assignedTeacherIds = [...new Set(teacherAssignments.map(a => a.teacherId))];
    const assigned = assignedTeacherIds.length;
    const unassigned = Math.max(total - assigned, 0);
    return { total, assigned, unassigned };
  }, [teachers, teacherAssignments]);

  const filteredSubjects = useMemo(() => {
    if (!selectedDepartment) return subjects;
    
    // If section is selected, show only subjects assigned to that section
    if (selectedSection) {
      // Get all subject assignments for the selected section
      const sectionSubjectAssignments = subjectAssignments.filter(
        assignment => assignment.sectionIds.includes(selectedSection)
      );
      const assignedSubjectIds = sectionSubjectAssignments.map(assignment => assignment.subjectId);
      
      // Return subjects that are assigned to this section and belong to the selected department
      return subjects.filter(subject => 
        subject.departmentId === selectedDepartment && 
        assignedSubjectIds.includes(subject._id)
      );
    }
    
    // If only department is selected, show all subjects in that department
    return subjects.filter(subject => subject.departmentId === selectedDepartment);
  }, [subjects, selectedDepartment, selectedSection, subjectAssignments]);

  const filteredAssignments = useMemo(() => {
    let filtered = teacherAssignments;
    
    if (selectedTeacher) {
      filtered = filtered.filter(assignment => assignment.teacherId === selectedTeacher);
    }
    if (selectedDepartment) {
      filtered = filtered.filter(assignment => assignment.departmentId === selectedDepartment);
    }
    if (selectedClass) {
      filtered = filtered.filter(assignment => assignment.classId === selectedClass);
    }
    if (selectedSection) {
      filtered = filtered.filter(assignment => assignment.sectionId === selectedSection);
    }
    
    // Filter by teacher search term
    if (teacherSearchTerm) {
      filtered = filtered.filter(assignment => {
        const teacher = teachers.find(t => t._id === assignment.teacherId);
        return teacher?.name.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
               teacher?.email.toLowerCase().includes(teacherSearchTerm.toLowerCase());
      });
    }
    
    return filtered;
  }, [teacherAssignments, selectedTeacher, selectedDepartment, selectedClass, selectedSection, teacherSearchTerm, teachers]);

  const sortedAssignments = useMemo(() => {
    const sorted = [...filteredAssignments];
    
    switch (sortBy) {
      case 'subjectsCount':
        return sorted.sort((a, b) => b.subjectIds.length - a.subjectIds.length);
      case 'teacherName':
        return sorted.sort((a, b) => {
          const teacherA = teachers.find(t => t._id === a.teacherId);
          const teacherB = teachers.find(t => t._id === b.teacherId);
          return (teacherA?.name || '').localeCompare(teacherB?.name || '');
        });
      case 'department':
        return sorted.sort((a, b) => {
          const deptA = departments.find(d => d._id === a.departmentId);
          const deptB = departments.find(d => d._id === b.departmentId);
          return (deptA?.name || '').localeCompare(deptB?.name || '');
        });
      default:
        return sorted;
    }
  }, [filteredAssignments, sortBy, teachers, departments]);

  // --- EFFECTS ---

  useEffect(() => {
    fetchAllData();
    
    // Check for preselected filters from navigation
    const preselectedDepartment = localStorage.getItem('preselectedDepartment');
    const preselectedClass = localStorage.getItem('preselectedClass');
    const preselectedSection = localStorage.getItem('preselectedSection');
    const preselectedSubject = localStorage.getItem('preselectedSubject');
    
    if (preselectedDepartment && preselectedClass && preselectedSection && preselectedSubject) {
      setSelectedDepartment(preselectedDepartment);
      setSelectedClass(preselectedClass);
      setSelectedSection(preselectedSection);
      
      // Clear the localStorage after using the values
      localStorage.removeItem('preselectedDepartment');
      localStorage.removeItem('preselectedClass');
      localStorage.removeItem('preselectedSection');
      localStorage.removeItem('preselectedSubject');
    }
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
      <LoaderOverlay isVisible={isLoading || loadingEntities.teachers || loadingEntities.departments || loadingEntities.classes || loadingEntities.sections || loadingEntities.subjects || loadingEntities.assignments} title="MySkillDB" subtitle="Loading your data, please wait…" />
      
      {/* Navigation Component */}
      {!isAssignmentModalOpen && <OrgMenuNavigation currentPage="teacher-assignments" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isAssignmentModalOpen ? "flex-1 flex flex-col" : "lg:ml-72 flex-1 flex flex-col"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">View/Edit Teachers</h1>
              <p className="text-slate-500 text-sm">Manage teacher assignments to classes, sections, and subjects</p>
            </div>
          </header>

          {/* Quick Stats - Mobile Optimized */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="bg-blue-100 p-2 md:p-3 rounded-full flex-shrink-0">
                <i className="fas fa-chalkboard-teacher text-lg md:text-xl text-blue-500"></i>
              </div>
              <div className="min-w-0 flex-1 text-center md:text-left">
                <p className="text-slate-500 text-xs md:text-sm truncate hidden md:block">Teachers in Org</p>
                <p className="text-lg md:text-2xl font-bold text-slate-900">{overallTeacherStats.total}</p>
              </div>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="bg-green-100 p-2 md:p-3 rounded-full flex-shrink-0">
                <i className="fas fa-user-check text-lg md:text-xl text-green-500"></i>
              </div>
              <div className="min-w-0 flex-1 text-center md:text-left">
                <p className="text-slate-500 text-xs md:text-sm truncate hidden md:block">Assigned Teachers</p>
                <p className="text-lg md:text-2xl font-bold text-slate-900">{overallTeacherStats.assigned}</p>
              </div>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="bg-orange-100 p-2 md:p-3 rounded-full flex-shrink-0">
                <i className="fas fa-user-times text-lg md:text-xl text-orange-500"></i>
              </div>
              <div className="min-w-0 flex-1 text-center md:text-left">
                <p className="text-slate-500 text-xs md:text-sm truncate hidden md:block">Unassigned Teachers</p>
                <p className="text-lg md:text-2xl font-bold text-slate-900">{overallTeacherStats.unassigned}</p>
              </div>
            </div>
          </div>

          {/* Selection Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
              <h2 className="text-base md:text-lg font-bold text-slate-900">View/Edit Teachers</h2>
              <button
                onClick={() => {
                  setSelectedDepartment('');
                  setSelectedClass('');
                  setSelectedSection('');
                  setSelectedTeacher('');
                  setTeacherSearchTerm('');
                }}
                className="text-xs md:text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 self-start md:self-auto"
              >
                <i className="fas fa-redo"></i>
                Clear All
              </button>
            </div>
            
            {/* Teacher Search */}
            <div className="mb-4">
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                Search Teacher
              </label>
              <div className="relative">
                <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  placeholder="Search by teacher name or email..."
                  value={teacherSearchTerm}
                  onChange={(e) => setTeacherSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                {teacherSearchTerm && (
                  <button
                    onClick={() => setTeacherSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
            
            {/* Department Filter */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full block p-3 min-h-[44px] bg-slate-100 border-slate-200 rounded-md text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Teacher Assignments Display */}
          <AssignmentDisplay
            assignments={sortedAssignments}
            teachers={teachers}
            departments={departments}
            classes={classes}
            sections={sections}
            subjects={subjects}
            onEdit={openAssignmentModal}
            onDelete={handleDeleteAssignment}
            isLoading={loadingEntities.assignments}
            sortBy={sortBy}
          />
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

      {/* Assignment Modal */}
      {isAssignmentModalOpen && (
        <TeacherAssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={closeAssignmentModal}
          onSubmit={handleCreateAssignment}
          formData={assignmentFormData}
          setFormData={setAssignmentFormData}
          teachers={filteredTeachers}
          departments={departments}
          classes={classes}
          sections={sections}
          subjects={filteredSubjects}
          subjectAssignments={subjectAssignments}
          teacherAssignments={teacherAssignments}
          editingAssignment={editingAssignment}
          isLoading={isLoading}
          inputBaseClass={inputBaseClass}
          btnIndigoClass={btnIndigoClass}
          btnSlateClass={btnSlateClass}
        />
      )}
    </div>
  );
};

export default TeacherAssignments;

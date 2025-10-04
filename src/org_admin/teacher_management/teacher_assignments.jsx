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

const TeacherAssignments = () => {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);

  // State for global entities
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacherAssignments, setTeacherAssignments] = useState([]);

  // Selection states
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

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
        { _id: 'teacher-1', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@school.edu', departmentId: 'dept-1' },
        { _id: 'teacher-2', name: 'Prof. Michael Chen', email: 'michael.chen@school.edu', departmentId: 'dept-2' },
        { _id: 'teacher-3', name: 'Ms. Emily Rodriguez', email: 'emily.rodriguez@school.edu', departmentId: 'dept-3' },
        { _id: 'teacher-4', name: 'Mr. David Wilson', email: 'david.wilson@school.edu', departmentId: 'dept-1' },
        { _id: 'teacher-5', name: 'Dr. Lisa Anderson', email: 'lisa.anderson@school.edu', departmentId: 'dept-4' },
        { _id: 'teacher-6', name: 'Mr. James Brown', email: 'james.brown@school.edu', departmentId: 'dept-2' },
        { _id: 'teacher-7', name: 'Ms. Maria Garcia', email: 'maria.garcia@school.edu', departmentId: 'dept-3' },
        { _id: 'teacher-8', name: 'Dr. Robert Taylor', email: 'robert.taylor@school.edu', departmentId: 'dept-1' }
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
    } finally {
      setLoadingEntities(prev => ({ ...prev, departments: false }));
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

  const fetchSubjects = async () => {
    try {
      setLoadingEntities(prev => ({ ...prev, subjects: true }));
      
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
        { _id: 'ta-1', teacherId: 'teacher-1', departmentId: 'dept-1', classId: 'class-1', sectionId: 'section-1', subjectIds: ['subject-1'], isClassTeacher: true },
        { _id: 'ta-2', teacherId: 'teacher-1', departmentId: 'dept-1', classId: 'class-2', sectionId: 'section-1', subjectIds: ['subject-1', 'subject-2'], isClassTeacher: false },
        { _id: 'ta-3', teacherId: 'teacher-2', departmentId: 'dept-2', classId: 'class-1', sectionId: 'section-2', subjectIds: ['subject-4'], isClassTeacher: true },
        { _id: 'ta-4', teacherId: 'teacher-3', departmentId: 'dept-3', classId: 'class-2', sectionId: 'section-3', subjectIds: ['subject-6', 'subject-7'], isClassTeacher: true },
        { _id: 'ta-5', teacherId: 'teacher-4', departmentId: 'dept-1', classId: 'class-3', sectionId: 'section-4', subjectIds: ['subject-2'], isClassTeacher: false },
        { _id: 'ta-6', teacherId: 'teacher-5', departmentId: 'dept-4', classId: 'class-4', sectionId: 'section-5', subjectIds: ['subject-8', 'subject-9'], isClassTeacher: true }
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

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchTeachers(),
      fetchDepartments(),
      fetchClasses(),
      fetchSections(),
      fetchSubjects(),
      fetchTeacherAssignments()
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

  const filteredSubjects = useMemo(() => {
    if (!selectedDepartment) return subjects;
    return subjects.filter(subject => subject.departmentId === selectedDepartment);
  }, [subjects, selectedDepartment]);

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
    
    return filtered;
  }, [teacherAssignments, selectedTeacher, selectedDepartment, selectedClass, selectedSection]);

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
      {!isAssignmentModalOpen && <OrgMenuNavigation currentPage="teacher-assignments" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isAssignmentModalOpen ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Teacher Assignments</h1>
              <p className="text-slate-500 text-sm">Manage teacher assignments to classes, sections, and subjects</p>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                <i className="fas fa-chalkboard-teacher text-xl text-blue-500"></i>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-500 text-sm truncate">Teachers</p>
                <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                <i className="fas fa-building text-xl text-green-500"></i>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-500 text-sm truncate">Departments</p>
                <p className="text-2xl font-bold text-slate-900">{departments.length}</p>
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
                <i className="fas fa-link text-xl text-orange-500"></i>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-500 text-sm truncate">Assignments</p>
                <p className="text-2xl font-bold text-slate-900">{teacherAssignments.length}</p>
              </div>
            </div>
          </div>

          {/* Selection Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Assignment Filters</h2>
            <p className="text-sm text-slate-600 mb-4">
              Filter assignments by department, class, section, and teacher. When a section is selected, the teacher dropdown shows only teachers assigned to that section.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department/Level
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
                  {selectedSection ? 'Assigned Teachers' : 'Teacher'}
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => handleTeacherChange(e.target.value)}
                  className={inputBaseClass}
                >
                  <option value="">
                    {selectedSection ? 'All Assigned Teachers' : 'All Teachers'}
                  </option>
                  {filteredTeachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                  ))}
                </select>
                {selectedSection && filteredTeachers.length === 0 && (
                  <p className="text-xs text-slate-500 mt-1">No teachers assigned to this section</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className={inputBaseClass}
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

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-100 border-slate-200 rounded-md p-2 text-sm"
                >
                  <option value="subjectsCount">Subjects Count</option>
                  <option value="teacherName">Teacher Name</option>
                  <option value="department">Department</option>
                </select>
              </div>
              
              <button
                onClick={() => openAssignmentModal()}
                className={btnTealClass}
                title="Create new teacher assignment"
              >
                <i className="fas fa-plus"></i>
                Create Assignment
              </button>
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

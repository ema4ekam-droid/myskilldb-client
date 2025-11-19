import { useState, useEffect, useMemo } from 'react';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import { TeacherAssignmentModal } from '../../components/org-admin-components/teacher-management-components';
import toast, { Toaster } from 'react-hot-toast';
import LoaderOverlay from '../../components/loader/LoaderOverlay';
import { useSelector } from 'react-redux';
import { getRequest, postRequest, deleteRequest, patchRequest } from '../../api/apiRequests';

const AdminSubjectAssign = () => {
  const organization = useSelector((state) => state.organization);
  const organizationId = organization?._id;

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
  
  // Collapsible state for teacher setup section
  const [collapsedDepartments, setCollapsedDepartments] = useState({});
  const [collapsedClasses, setCollapsedClasses] = useState({});
  
  // Teacher assignment modal state
  const [isTeacherAssignModalOpen, setIsTeacherAssignModalOpen] = useState(false);
  const [teacherAssignmentData, setTeacherAssignmentData] = useState({
    assignmentId: '',
    subjectId: '',
    departmentId: '',
    classId: '',
    sectionId: '',
    departmentName: '',
    className: '',
    sectionName: '',
    subjectName: ''
  });
  const [teacherFormData, setTeacherFormData] = useState({
    teacherId: '',
    departmentId: '',
    classId: '',
    sectionId: '',
    subjectIds: [],
    isClassTeacher: false,
    // Display fields for modal
    departmentName: '',
    className: '',
    sectionName: '',
    subjectName: ''
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

  // Quick action modals
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [subjectFormData, setSubjectFormData] = useState({
    name: '',
    code: '',
    departmentId: '',
    description: '',
    type: 'core'
  });

  const [isCreateTeacherModalOpen, setIsCreateTeacherModalOpen] = useState(false);
  const [createTeacherFormData, setCreateTeacherFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    departmentId: '',
    password: ''
  });

  // --- API CALLS ---
  
  const fetchDepartments = async () => {
    try {
      const response = await getRequest(
        `/organization-setup/departments/${organizationId}`
      );

      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    }
  };

  const fetchClasses = async (departmentId = null) => {
    try {
      if (departmentId) {
        const response = await getRequest(
          `/organization-setup/classes/${organizationId}/${departmentId}`
        );

        if (response.data.success) {
          setClasses(response.data.data);
        }
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    }
  };

  const fetchSections = async (departmentId = null, classId = null) => {
    try {
      if (departmentId && classId) {
        const response = await getRequest(
          `/organization-setup/sections/${organizationId}/${departmentId}/${classId}`
        );

        if (response.data.success) {
          setSections(response.data.data);
        }
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
    }
  };

  const fetchSubjects = async (departmentId = null) => {
    try {
      if (departmentId) {
        const response = await getRequest(
          `/organization-setup/subjects/${organizationId}/${departmentId}`
        );
        if (response.data.success) {
          setSubjects(response.data.data);
        }
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await getRequest(`/users?organizationId=${organizationId}&role=teacher`);
      if (response.data.success) {
        setTeachers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
    }
  };

  const fetchTeachersByDepartment = async (departmentId) => {
    try {
      console.log('Fetching teachers for department:', departmentId);
      const response = await getRequest(`/users?departmentId=${departmentId}&role=teacher`);
      if (response.data.success) {
        // Update teachers list with filtered results
        setTeachers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching teachers by department:', error);
      toast.error('Failed to fetch teachers');
    }
  };

  const fetchSubjectAssignments = async () => {
    try {
      const response = await getRequest(`/organization-setup/teachingAssignments/${organizationId}`);
      console.log('Fetched subject assignments:', response.data);
      if (response.data.success) {
        // Transform API data to match our component structure
        const transformedAssignments = transformAssignmentsData(response.data.data);
        setSubjectAssignments(transformedAssignments);
      }
    } catch (error) {
      console.error('Error fetching subject assignments:', error);
      toast.error('Failed to fetch subject assignments');
    }
  };

  // Transform API data to match our component structure
  const transformAssignmentsData = (apiData) => {
    const assignments = [];
    
    // Now each item in apiData is a separate teaching assignment document
    apiData.forEach(assignment => {
      const { assignmentId, subjectId, teacherId } = assignment;

      // Skip invalid records where assignmentId or its nested fields are missing
      if (!assignmentId || !assignmentId.departmentId || !assignmentId.classId || !assignmentId.sectionId) {
        console.warn('Skipping invalid teaching assignment record (missing assignmentId or nested ids):', assignment);
        return;
      }

      // Skip if subject is missing
      const subjectObj = subjectId;
      const subjectIdValue = subjectObj?._id || subjectObj;
      const subjectName = subjectObj?.name;

      if (!subjectIdValue) {
        console.warn('Skipping invalid teaching assignment record (missing subjectId):', assignment);
        return;
      }

      assignments.push({
        _id: assignment._id,
        subjectId: subjectIdValue,
        subjectName: subjectName || '',
        departmentId: assignmentId.departmentId._id,
        departmentName: assignmentId.departmentId.name,
        classId: assignmentId.classId._id,
        className: assignmentId.classId.name,
        sectionId: assignmentId.sectionId._id,
        sectionName: assignmentId.sectionId.name,
        assignmentId: assignmentId._id,
        teachingAssignmentId: assignment._id,
        teacherId: teacherId?._id || teacherId || null,
        teacherName: teacherId?.name || null
      });
    });
    
    return assignments;
  };

  const fetchAllData = async () => {
    if (!organizationId) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        fetchDepartments(),
        fetchClasses(),
        fetchSubjectAssignments(),
        fetchTeachers()
      ]);
    } catch (error) {
      console.error('Error fetching all data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS ---
  
  const handleDepartmentChange = async (deptId) => {
    setSelectedDepartment(deptId);
    setSelectedClass('');
    setSelectedSection('');
    setSelectedSubjects([]);
    
    if (deptId) {
      await Promise.all([
        fetchClasses(deptId),
        fetchSubjects(deptId)
      ]);
    } else {
      await fetchClasses();
      setSubjects([]);
    }
  };

  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    setSelectedSection('');
    
    if (selectedDepartment && classId) {
      await fetchSections(selectedDepartment, classId);
    } else {
      await fetchSections();
    }
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
    // Select all subjects except those already assigned to any of the target sections
    const allSubjectIds = filteredAndSearchedSubjects
      .map(s => s._id)
      .filter(subjectId => {
        // Check if subject is already assigned to any of the selected sections using assignmentId
        return !sectionsToAssign.some(sectionId => {
          const section = sections.find(s => s._id === sectionId);
          if (!section || !section.assignmentId) return false;
          
          return subjectAssignments.some(a => 
            a.assignmentId === section.assignmentId && 
            a.subjectId === subjectId
          );
        });
      });
    setSelectedSubjects(allSubjectIds);
  };

  const clearAllSubjects = () => {
    setSelectedSubjects([]);
  };

  // Handle batch assignment with API calls for each section
  const handleBatchAssignment = async () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    if (sectionsToAssign.length === 0) {
      toast.error('Please select at least one section');
      return;
    }

    try {
      setIsLoading(true);
      
      // Filter out subjects that are already assigned to the same specific sections
      const subjectsToAssign = selectedSubjects.filter(subjectId => {
        return !sectionsToAssign.some(sectionId => {
          // Find the section to get its assignmentId
          const section = sections.find(s => s._id === sectionId);
          if (!section || !section.assignmentId) return false;
          
          // Check if this subject is already assigned to this exact assignment (same assignmentId)
          return subjectAssignments.some(a => 
            a.assignmentId === section.assignmentId && 
            a.subjectId === subjectId
          );
        });
      });
      
      if (subjectsToAssign.length === 0) {
        toast.error('Selected subjects are already assigned to the selected sections');
        setIsLoading(false);
        return;
      }

      // Create individual API calls for each section-subject combination
      const apiCalls = [];
      sectionsToAssign.forEach(sectionId => {
        const section = sections.find(s => s._id === sectionId);
        if (!section || !section.assignmentId) {
          console.error(`No assignmentId found for section: ${sectionId}`);
          return;
        }

        // Create API call for each subject
        subjectsToAssign.forEach(subjectId => {
          const requestData = {
            organizationId: organizationId,
            assignmentId: section.assignmentId,
            subjectId: subjectId
          };
          apiCalls.push(postRequest('/organization-setup/teachingAssignments', requestData));
        });
      });

      // Execute all API calls
      const responses = await Promise.all(apiCalls);
      
      // Check if all API calls were successful
      const allSuccess = responses.every(response => response?.data?.success);
      
      if (allSuccess) {
        toast.success(`${selectedSubjects.length} subject${selectedSubjects.length !== 1 ? 's' : ''} assigned to ${sectionsToAssign.length} section${sectionsToAssign.length !== 1 ? 's' : ''} successfully!`);
        
        // Refresh assignments data
        await fetchSubjectAssignments();
        
        // Clear selections
        setSelectedSubjects([]);
        setSectionsToAssign([]);
      } else {
        toast.error('Some assignments failed to save');
      }
      
    } catch (error) {
      console.error('Error creating assignments:', error);
      toast.error('Failed to create assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const openAssignmentModal = (subjectId) => {
    setSelectedSubject(subjectId);
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

  // Handle single assignment with API call
  const handleCreateAssignment = async () => {
    if (!selectedSubject || selectedSections.length === 0) {
      toast.error('Please select a subject and at least one section');
      return;
    }

    // Prevent assigning a subject to sections where it already exists in the same assignment
    const alreadyAssignedInSelected = selectedSections.some(sectionId => {
      const section = sections.find(s => s._id === sectionId);
      if (!section || !section.assignmentId) return false;
      
      return subjectAssignments.some(a => 
        a.assignmentId === section.assignmentId && 
        a.subjectId === selectedSubject
      );
    });
    if (alreadyAssignedInSelected) {
      toast.error('Selected subject is already assigned to one or more of the selected sections');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create API calls for each selected section
      const apiCalls = selectedSections.map(sectionId => {
        const section = sections.find(s => s._id === sectionId);
        if (!section || !section.assignmentId) {
          console.error(`No assignmentId found for section: ${sectionId}`);
          return Promise.reject(`No assignmentId for section ${sectionId}`);
        }

        const requestData = {
          organizationId: organizationId,
          assignmentId: section.assignmentId,
          subjectId: selectedSubject
        };

        return postRequest('/organization-setup/teachingAssignments', requestData);
      });

      // Execute all API calls
      const responses = await Promise.all(apiCalls);
      
      // Check if all API calls were successful
      const allSuccess = responses.every(response => response.data.success);
      
      if (allSuccess) {
        toast.success('Subject assignment created successfully!');
        await fetchSubjectAssignments();
        closeAssignmentModal();
      } else {
        toast.error('Some assignments failed to save');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDeleteQuestion = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
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
      
      // Find the assignment to get assignmentId and subjectId
      const assignment = subjectAssignments.find(a => a._id === assignmentToDelete);
      if (!assignment) {
        toast.error('Assignment not found');
        return;
      }

      // Remove the subject from assignedSubTeachers using PATCH
      await patchRequest(
        `/organization-setup/teachingAssignments/${assignment.assignmentId}/subjects/${assignment.subjectId}`,
        {
          organizationId: organizationId
        }
      );
      
      toast.success('Subject removed from assignment successfully!');
      await fetchSubjectAssignments();
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Error removing subject from assignment:', error);
      toast.error('Failed to remove subject from assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
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

// UPDATED: Derive assignmentId from subjectAssignments instead of sections state
const openTeacherAssignModal = (departmentId, classId, sectionId, subjectId) => {
  console.log('Opening teacher modal with:', { departmentId, classId, sectionId, subjectId });

  // Prefer the flattened subjectAssignments which already include assignmentId
  const assignment = subjectAssignments.find(a =>
    a.departmentId === departmentId &&
    a.classId === classId &&
    a.sectionId === sectionId &&
    a.subjectId === subjectId
  );

  if (!assignment || !assignment.assignmentId) {
    // As a fallback, try to read from sections if present
    const fallbackSection = sections.find(s => s._id === sectionId);
    const fallbackAssignmentId = fallbackSection?.assignmentId;
    if (!fallbackAssignmentId) {
      toast.error('Section or assignment not found');
      return;
    }

    // Still set up modal with limited info
    const department = departments.find(d => d._id === departmentId);
    const classItem = classes.find(c => c._id === classId);
    const subject = subjects.find(s => s._id === subjectId);

    setTeacherAssignmentData({
      assignmentId: fallbackAssignmentId,
      subjectId: subjectId,
      departmentId: departmentId,
      classId: classId,
      sectionId: sectionId,
      departmentName: department?.name || '',
      className: classItem?.name || '',
      sectionName: fallbackSection?.name || '',
      subjectName: subject?.name || ''
    });

    setTeacherFormData({
      teacherId: '',
      departmentId: departmentId,
      classId: classId,
      sectionId: sectionId,
      subjectIds: [subjectId],
      isClassTeacher: false,
      departmentName: department?.name || '',
      className: classItem?.name || '',
      sectionName: fallbackSection?.name || '',
      subjectName: subject?.name || ''
    });

    setIsTeacherAssignModalOpen(true);
    return;
  }

  // Find details from arrays as fallback for display names
  const department = departments.find(d => d._id === departmentId);
  const classItem = classes.find(c => c._id === classId);
  const subject = subjects.find(s => s._id === subjectId);

  setTeacherAssignmentData({
    assignmentId: assignment.assignmentId,
    subjectId: subjectId,
    departmentId: departmentId,
    classId: classId,
    sectionId: sectionId,
    departmentName: assignment.departmentName || department?.name || '',
    className: assignment.className || classItem?.name || '',
    sectionName: assignment.sectionName || '',
    subjectName: assignment.subjectName || subject?.name || ''
  });

  setTeacherFormData({
    teacherId: assignment.teacherId || '',
    departmentId: departmentId,
    classId: classId,
    sectionId: sectionId,
    subjectIds: [subjectId],
    isClassTeacher: false,
    departmentName: assignment.departmentName || department?.name || '',
    className: assignment.className || classItem?.name || '',
    sectionName: assignment.sectionName || '',
    subjectName: assignment.subjectName || subject?.name || ''
  });

  setIsTeacherAssignModalOpen(true);
};



  const closeTeacherAssignModal = () => {
    setIsTeacherAssignModalOpen(false);
    setTeacherAssignmentData({
      assignmentId: '',
      subjectId: '',
      departmentId: '',
      classId: '',
      sectionId: '',
      departmentName: '',
      className: '',
      sectionName: '',
      subjectName: ''
    });
    setTeacherFormData({
      teacherId: '',
      departmentId: '',
      classId: '',
      sectionId: '',
      subjectIds: [],
      isClassTeacher: false,
      departmentName: '',
      className: '',
      sectionName: '',
      subjectName: ''
    });
  };

  // UPDATED: Modified handleTeacherAssignmentSubmit to use correct API endpoint
 // UPDATED: Modified handleTeacherAssignmentSubmit to use correct API endpoint
const handleTeacherAssignmentSubmit = async (formData) => {
  try {
    setIsLoading(true);
    
    console.log('Submitting teacher assignment with data:', {
      assignmentId: teacherAssignmentData.assignmentId,
      subjectId: teacherAssignmentData.subjectId,
      teacherId: formData.teacherId,
      organizationId: organizationId
    });

    // Call the API to assign teacher using PATCH method
    const response = await patchRequest(
      `/organization-setup/teachingAssignments/${teacherAssignmentData.assignmentId}/teachers/${teacherAssignmentData.subjectId}`,
      {
        organizationId: organizationId,
        teacherId: formData.teacherId
      }
    );

    if (response.data.success) {
      toast.success('Teacher assigned successfully!');
      // Refresh assignments to get updated teacher information
      await fetchSubjectAssignments();
      closeTeacherAssignModal();
    } else {
      toast.error('Failed to assign teacher');
    }
  } catch (error) {
    console.error('Error assigning teacher:', error);
    toast.error('Failed to assign teacher');
  } finally {
    setIsLoading(false);
  }
};
  
  const navigateToTeacherAssign = (departmentId, classId, sectionId, subjectId) => {
    localStorage.setItem('preselectedDepartment', departmentId);
    localStorage.setItem('preselectedClass', classId);
    localStorage.setItem('preselectedSection', sectionId);
    localStorage.setItem('preselectedSubject', subjectId);
    
    window.location.href = '/admin/classrooms/teacher-assignments';
  };

  // --- COMPUTED VALUES ---
  
  const filteredSubjects = useMemo(() => {
    return subjects;
  }, [subjects]);

  const filteredAndSearchedSubjects = useMemo(() => {
    return filteredSubjects;
  }, [filteredSubjects]);

  const filteredAssignments = useMemo(() => {
    let filtered = subjectAssignments;
    
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
  }, [subjectAssignments, selectedDepartment, selectedClass, selectedSection]);

  const availableSections = useMemo(() => {
    return sections;
  }, [sections, selectedDepartment, selectedClass]);

  // Get grouped assignments for display
  const getGroupedAssignments = () => {
    const grouped = {};

    subjectAssignments.forEach(assignment => {
      const { departmentId, departmentName, classId, className, sectionId, sectionName } = assignment;

      if (!grouped[departmentId]) {
        grouped[departmentId] = {
          name: departmentName,
          classes: {},
        };
      }

      if (!grouped[departmentId].classes[classId]) {
        grouped[departmentId].classes[classId] = {
          name: className,
          sections: {},
        };
      }

      if (!grouped[departmentId].classes[classId].sections[sectionId]) {
        grouped[departmentId].classes[classId].sections[sectionId] = {
          name: sectionName,
          assignments: [],
        };
      }

      grouped[departmentId].classes[classId].sections[sectionId].assignments.push(assignment);
    });

    return grouped;
  };

  const groupedAssignments = useMemo(() => {
    return getGroupedAssignments();
  }, [subjectAssignments]);

  // --- EFFECTS ---
  
  useEffect(() => {
    fetchAllData();
    
    const preselectedDepartment = localStorage.getItem('preselectedDepartment');
    const preselectedClass = localStorage.getItem('preselectedClass');
    
    if (preselectedDepartment && preselectedClass) {
      setSelectedDepartment(preselectedDepartment);
      setSelectedClass(preselectedClass);
      
      localStorage.removeItem('preselectedDepartment');
      localStorage.removeItem('preselectedClass');
    }
  }, [organizationId]);

  // Initialize collapsed states when departments and classes are loaded
  useEffect(() => {
    if (departments.length > 0) {
      const initialCollapsedDepartments = {};
      departments.forEach(dept => {
        initialCollapsedDepartments[dept._id] = true;
      });
      setCollapsedDepartments(initialCollapsedDepartments);
    }
  }, [departments]);

  useEffect(() => {
    if (classes.length > 0) {
      const initialCollapsedClasses = {};
      classes.forEach(cls => {
        initialCollapsedClasses[cls._id] = true;
      });
      setCollapsedClasses(initialCollapsedClasses);
    }
  }, [classes]);

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
      type: 'core'
    });
    setIsAddSubjectModalOpen(true);
  };

  const openCreateTeacherModal = () => {
    setCreateTeacherFormData({
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
                    onClick={async () => {
                      if (!subjectFormData.departmentId || !subjectFormData.name) {
                        toast.error('Please fill required fields');
                        return;
                      }
                      
                      try {
                        setIsLoading(true);
                        
                        const response = await postRequest(`/organization-setup/subjects`, {
                          name: subjectFormData.name,
                          code: subjectFormData.code,
                          description: subjectFormData.description,
                          organizationId: organizationId,
                          departmentId: subjectFormData.departmentId
                        });

                        if (response.data.success) {
                          const newSubject = response.data.data;
                          setSubjects(prev => [...prev, newSubject]);
                          toast.success('Subject created successfully!');
                          setIsAddSubjectModalOpen(false);
                        }
                      } catch (error) {
                        console.error('Error creating subject:', error);
                        toast.error('Failed to create subject');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className={btnIndigoClass}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        Save Subject
                      </>
                    )}
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
                      value={createTeacherFormData.name}
                      onChange={(e) => setCreateTeacherFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={inputBaseClass}
                      placeholder="e.g., John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={createTeacherFormData.email}
                      onChange={(e) => setCreateTeacherFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={inputBaseClass}
                      placeholder="e.g., john@school.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      value={createTeacherFormData.mobile}
                      onChange={(e) => setCreateTeacherFormData(prev => ({ ...prev, mobile: e.target.value }))}
                      className={inputBaseClass}
                      placeholder="e.g., +1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                    <select
                      value={createTeacherFormData.departmentId}
                      onChange={(e) => setCreateTeacherFormData(prev => ({ ...prev, departmentId: e.target.value }))}
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
                      value={createTeacherFormData.password}
                      onChange={(e) => setCreateTeacherFormData(prev => ({ ...prev, password: e.target.value }))}
                      className={inputBaseClass}
                      placeholder="Enter temporary password"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                  <button onClick={() => setIsCreateTeacherModalOpen(false)} className={btnSlateClass}>Cancel</button>
                  <button
                    onClick={async () => {
                      if (!createTeacherFormData.name || !createTeacherFormData.email || !createTeacherFormData.mobile || !createTeacherFormData.departmentId || !createTeacherFormData.password) {
                        toast.error('Please fill all required fields');
                        return;
                      }
                      
                      try {
                        setIsLoading(true);
                        
                        const response = await postRequest(`/users`, {
                          organizationId: organizationId,
                          role: "teacher",
                          name: createTeacherFormData.name,
                          email: createTeacherFormData.email,
                          departmentId: createTeacherFormData.departmentId
                        });

                        if (response.data.success) {
                          const newTeacher = response.data.data;
                          setTeachers(prev => [...prev, newTeacher]);
                          toast.success('Teacher created successfully!');
                          setIsCreateTeacherModalOpen(false);
                        }
                      } catch (error) {
                        console.error('Error creating teacher:', error);
                        toast.error('Failed to create teacher');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className={btnIndigoClass}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        Save Teacher
                      </>
                    )}
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
                      {/* Department Selector and Actions */}
                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <div className="flex-1 min-w-64">
                          <div className="relative">
                            <select
                              value={selectedDepartment}
                              onChange={(e) => handleDepartmentChange(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              <option value="">Select Department to view subjects</option>
                              {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                              ))}
                            </select>
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
                            {selectedDepartment ? 'No subjects found for the selected department' : 'Please select a department to view subjects'}
                          </p>
                          <p className="text-sm">
                            {selectedDepartment ? 'Add subjects to this department using the "Create New Subject" button above' : 'Choose a department from the dropdown above'}
                          </p>
                          {selectedDepartment && (
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
                              // Check if subject is already assigned to any of the selected sections using assignmentId
                              const isAlreadyAssigned = sectionsToAssign.some(sectionId => {
                                const section = sections.find(s => s._id === sectionId);
                                if (!section || !section.assignmentId) return false;
                                
                                return subjectAssignments.some(a => 
                                  a.assignmentId === section.assignmentId && 
                                  a.subjectId === subject._id
                                );
                              });
                              
                              return (
                                <button
                                  key={subject._id}
                                  onClick={() => toggleSubjectSelection(subject._id)}
                                  className={`p-2 md:p-3 rounded-lg border-2 transition-all text-left ${
                                    isAlreadyAssigned ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-80 pointer-events-none' : (
                                      isSelected ? 'border-green-500 bg-green-50 shadow-md' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
                                    )
                                  }`}
                                  aria-disabled={isAlreadyAssigned}
                                  title={isAlreadyAssigned ? 'Already assigned to one of the selected sections' : ''}
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
                                      {isAlreadyAssigned && (
                                        <div className="inline-block mt-2">
                                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Assigned</span>
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
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-save"></i>
                                    <span>Save</span>
                                  </>
                                )}
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
                  {Object.entries(groupedAssignments).map(([deptId, deptData]) => {
                    const isDeptCollapsed = collapsedDepartments[deptId];
                    
                    return (
                      <div key={deptId} className="border-2 border-purple-200 rounded-xl overflow-hidden bg-white">
                        {/* Department Header - Always Collapsible */}
                        <button
                          onClick={() => toggleDepartmentCollapse(deptId)}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 md:px-6 py-3 md:py-4 cursor-pointer hover:from-blue-600 hover:to-blue-700"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-base md:text-xl font-bold text-white">{deptData.name}</h3>
                            <i className={`fas fa-chevron-${isDeptCollapsed ? 'down' : 'up'} text-white text-sm md:text-lg`}></i>
                          </div>
                        </button>

                        {/* Classes */}
                        {!isDeptCollapsed && (
                          <div className="divide-y divide-slate-200">
                            {Object.entries(deptData.classes).map(([classId, classData]) => {
                              const isClassCollapsed = collapsedClasses[classId];
                              
                              return (
                                <div key={classId} className="bg-white">
                                  {/* Class Header - Always Collapsible */}
                                  <button
                                    onClick={() => toggleClassCollapse(classId)}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 md:px-6 py-2 md:py-3 cursor-pointer hover:from-green-600 hover:to-emerald-600"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm md:text-lg font-semibold text-white">{classData.name}</span>
                                      <i className={`fas fa-chevron-${isClassCollapsed ? 'down' : 'up'} text-white text-sm`}></i>
                                    </div>
                                  </button>
                            
                                  {/* Sections */}
                                  {!isClassCollapsed && (
                                    <div className="p-2 md:p-4">
                                      {Object.entries(classData.sections).map(([sectionId, sectionData]) => {
                                        const uniqueSubjects = [...new Set(sectionData.assignments.map(a => a.subjectId))];
                                        
                                        return (
                                          <div key={sectionId} className="mb-4 last:mb-0 border border-slate-200 rounded-lg overflow-hidden">
                                            {/* Section Header */}
                                            <div className="bg-purple-50 px-3 md:px-4 py-2 md:py-3 border-b border-slate-200">
                                              <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                                  <i className="fas fa-layer-group text-white text-xs md:text-sm"></i>
                                                </div>
                                                <span className="font-semibold text-slate-900">{sectionData.name}</span>
                                                <span className="text-xs text-slate-500">
                                                  ({uniqueSubjects.length} subject{uniqueSubjects.length !== 1 ? 's' : ''})
                                                </span>
                                              </div>
                                            </div>
                          
                                            {/* Subjects in this section */}
                                            <div className="p-2 md:p-4 bg-white">
                                              <div className="flex flex-wrap gap-2">
                                                {sectionData.assignments.map(assignment => {
                                                  const subject = subjects.find(s => s._id === assignment.subjectId);
                                                  const assignedTeacher = assignment.teacherId ? teachers.find(t => t._id === assignment.teacherId) : null;
                                                  
                                                  return (
                                                    <div key={assignment._id} className="flex items-center justify-between gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                                                      <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1">
                                                          <span className="text-sm font-medium text-indigo-900 truncate">{subject?.name || assignment.subjectName}</span>
                                                        </div>
                                                        {assignedTeacher ? (
                                                          <div className="text-xs mt-1 flex items-center gap-1 text-green-600">
                                                            <i className="fas fa-user-tie"></i>
                                                            <span className="truncate">{assignedTeacher.name}</span>
                                                          </div>
                                                        ) : (
                                                          <button
                                                            onClick={() => openTeacherAssignModal(deptId, classId, sectionId, assignment.subjectId)}
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
                                                            onClick={() => openTeacherAssignModal(deptId, classId, sectionId, assignment.subjectId)}
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
                  })}
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

      {/* Teacher Assignment Modal - UPDATED: Pass assignmentId and subjectId */}
      {isTeacherAssignModalOpen && (
        <TeacherAssignmentModal
          isOpen={isTeacherAssignModalOpen}
          onClose={closeTeacherAssignModal}
          onSubmit={handleTeacherAssignmentSubmit}
          formData={teacherFormData}
          setFormData={setTeacherFormData}
          teachers={teachers}
          departments={departments}
          isLoading={isLoading}
          inputBaseClass={inputBaseClass}
          btnIndigoClass={btnIndigoClass}
          btnSlateClass={btnSlateClass}
          fetchTeachersByDepartment={fetchTeachersByDepartment}
          assignmentData={teacherAssignmentData} // Pass assignment data to modal
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
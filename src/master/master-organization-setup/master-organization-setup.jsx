import { useState, useEffect, useMemo } from 'react';
import Navigation from "../../components/master-user-components/common/master-navigation/Navigation";
import {
  DepartmentModal,
  ClassModal,
  SectionModal,
  SubjectModal,
  DeleteConfirmationModal
} from '../../components/master-user-components/master-class-setup-components';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const MasterOrganizationSetup = () => {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);
  
  // State for global entities
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Location and organization selection states
  const [locations, setLocations] = useState({
    countries: [],
    states: [],
    districts: [],
    filterStates: [],
    filterDistricts: []
  });
  const [organizations, setOrganizations] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  
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
  const [viewModalType, setViewModalType] = useState('');
  const [viewingItem, setViewingItem] = useState(null);
  
  // Sections view modal state
  const [isSectionsViewModalOpen, setIsSectionsViewModalOpen] = useState(false);
  const [viewingSections, setViewingSections] = useState([]);
  const [viewingDepartment, setViewingDepartment] = useState(null);
  const [viewingClass, setViewingClass] = useState(null);
  
  // Edit list modal states
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [editListType, setEditListType] = useState('');
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
  const [deleteType, setDeleteType] = useState('');

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState({
    departments: false,
    classes: false,
    sections: false,
    subjects: false,
    assignments: false
  });

  // State to track expanded departments in assignment view
  const [expandedDepartments, setExpandedDepartments] = useState({});

  // --- API CALLS FOR LOCATIONS ---
  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/countries`);
      if (response.data.success) {
        const countries = response.data.data;
        setLocations(prev => ({ ...prev, countries }));
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to fetch countries');
    }
  };

  const fetchStates = async (countryCode, forFilter = false) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/states/${countryCode}`);
      if (response.data.success) {
        const states = response.data.data;
        if (forFilter) {
          setLocations(prev => ({ ...prev, filterStates: states }));
        } else {
          setLocations(prev => ({ ...prev, states }));
        }
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      toast.error('Failed to fetch states');
    }
  };

  const fetchDistricts = async (stateCode, forFilter = false) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/districts/state/${stateCode}`);
      if (response.data.success) {
        const districts = response.data.data;
        if (forFilter) {
          setLocations(prev => ({ ...prev, filterDistricts: districts }));
        } else {
          setLocations(prev => ({ ...prev, districts }));
        }
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast.error('Failed to fetch districts');
    }
  };

  const fetchOrganizations = async (filterParams = {}) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value.trim()) {
          params.append(key, value);
        }
      });
      params.append("status", "active");

      const response = await axios.get(`${API_BASE_URL}/organization?${params}`);
      
      if (response.data.success) {
        const allOrgs = response.data.data;
        setOrganizations(allOrgs);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Failed to fetch organizations');
    } finally {
      setIsLoading(false);
    }
  };

  // --- API CALLS FOR ENTITIES ---
  
  // Department API calls
  const fetchDepartments = async (organizationId) => {
    if (!organizationId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, departments: true }));
      const response = await axios.get(`${API_BASE_URL}/organization-setup/departments/${organizationId}`);
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    } finally {
      setLoadingEntities(prev => ({ ...prev, departments: false }));
    }
  };

  const createDepartment = async (departmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/organization-setup/departments`, {
        ...departmentData,
        organizationId: selectedOrganization
      });
      if (response.data.success) {
        toast.success('Department created successfully');
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateDepartment = async (departmentId, departmentData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/organization-setup/departments/${departmentId}`, departmentData);
      if (response.data.success) {
        toast.success('Department updated successfully');
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteDepartment = async (departmentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/organization-setup/departments/${departmentId}`);
      toast.success('Department deleted successfully');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Class API calls
  const fetchClasses = async (organizationId) => {
    if (!organizationId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, classes: true }));
      const response = await axios.get(`${API_BASE_URL}/organization-setup/classes/${organizationId}`);
      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    } finally {
      setLoadingEntities(prev => ({ ...prev, classes: false }));
    }
  };

  const createClass = async (classData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/organization-setup/classes`, {
        ...classData,
        organizationId: selectedOrganization
      });
      if (response.data.success) {
        toast.success('Class created successfully');
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateClass = async (classId, classData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/organization-setup/classes/${classId}`, classData);
      if (response.data.success) {
        toast.success('Class updated successfully');
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteClass = async (classId) => {
    try {
      await axios.delete(`${API_BASE_URL}/organization-setup/classes/${classId}`);
      toast.success('Class deleted successfully');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Section API calls
  const fetchSections = async (organizationId) => {
    if (!organizationId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, sections: true }));
      const response = await axios.get(`${API_BASE_URL}/organization-setup/sections/${organizationId}`);
      if (response.data.success) {
        setSections(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
    } finally {
      setLoadingEntities(prev => ({ ...prev, sections: false }));
    }
  };

  const createSection = async (sectionData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/organization-setup/sections`, {
        ...sectionData,
        organizationId: selectedOrganization
      });
      if (response.data.success) {
        toast.success('Section created successfully');
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateSection = async (sectionId, sectionData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/organization-setup/sections/${sectionId}`, sectionData);
      if (response.data.success) {
        toast.success('Section updated successfully');
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      await axios.delete(`${API_BASE_URL}/organization-setup/sections/${sectionId}`);
      toast.success('Section deleted successfully');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Subject API calls
  const fetchSubjects = async (organizationId) => {
    if (!organizationId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, subjects: true }));
      const response = await axios.get(`${API_BASE_URL}/organization-setup/subjects/${organizationId}`);
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    } finally {
      setLoadingEntities(prev => ({ ...prev, subjects: false }));
    }
  };

  const createSubject = async (subjectData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/organization-setup/subjects`, {
        ...subjectData,
        organizationId: selectedOrganization
      });
      if (response.data.success) {
        toast.success('Subject created successfully');
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateSubject = async (subjectId, subjectData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/organization-setup/subjects/${subjectId}`, subjectData);
      if (response.data.success) {
        toast.success('Subject updated successfully');
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteSubject = async (subjectId) => {
    try {
      await axios.delete(`${API_BASE_URL}/organization-setup/subjects/${subjectId}`);
      toast.success('Subject deleted successfully');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Assignment API calls
  const fetchAssignments = async (organizationId, filterParams = {}) => {
    if (!organizationId) return;
    
    try {
      setLoadingEntities(prev => ({ ...prev, assignments: true }));
      
      const params = new URLSearchParams();

      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value.trim()) {
          params.append(key, value);
        }
      });
      
      const response = await axios.get(`${API_BASE_URL}/organization-setup/assignments/${organizationId}?${params}`);
      if (response.data.success) {
        setSectionClassAssignments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoadingEntities(prev => ({ ...prev, assignments: false }));
    }
  };

  const createAssignment = async (assignmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/organization-setup/assignments`, {
        ...assignmentData,
        organizationId: selectedOrganization
      });
      if (response.data.success) {
        toast.success('Assignment(s) created successfully');
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateAssignment = async (assignmentId, assignmentData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/organization-setup/assignments/${assignmentId}`, assignmentData);
      if (response.data.success) {
        toast.success('Assignment updated successfully');
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteAssignment = async (assignmentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/organization-setup/assignments/${assignmentId}`);
      toast.success('Assignment deleted successfully');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const handleApiError = (error) => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      if (responseData?.message) {
        toast.error(responseData.message);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  };

  // Location change handlers
  const handleCountryChange = async (countryName) => {
    setSelectedCountry(countryName);
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedOrganization('');
    setOrganizations([]);
    clearAllEntities();

    if (countryName) {
      const selectedCountryObj = locations.countries.find(c => c.name === countryName);
      if (selectedCountryObj) {
        await fetchStates(selectedCountryObj.code, false);
      }
    }
  };

  const handleStateChange = async (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict('');
    setSelectedOrganization('');
    setOrganizations([]);
    clearAllEntities();

    if (stateName) {
      const selectedStateObj = locations.states.find(s => s.name === stateName);
      if (selectedStateObj) {
        await fetchDistricts(selectedStateObj.code, false);
      }
    }
  };

  const handleDistrictChange = async (districtName) => {
    setSelectedDistrict(districtName);
    setSelectedOrganization('');
    clearAllEntities();

    if (districtName && selectedCountry && selectedState) {
      await fetchOrganizations({
        country: selectedCountry,
        state: selectedState,
        district: districtName
      });
    }
  };

  const handleOrganizationChange = async (orgId) => {
    setSelectedOrganization(orgId);
    clearAllEntities();
    setAssignmentFilters({ departmentId: '', classId: '' });
    setAppliedFilters({ departmentId: '', classId: '' });
    
    if (orgId) {
      await Promise.all([
        fetchDepartments(orgId),
        fetchClasses(orgId),
        fetchSections(orgId),
        fetchSubjects(orgId),
        fetchAssignments(orgId)
      ]);
    }
  };

  const clearAllEntities = () => {
    setDepartments([]);
    setClasses([]);
    setSections([]);
    setSubjects([]);
    setSectionClassAssignments([]);
  };

  // Get selected organization info
  const getSelectedOrganizationInfo = () => {
    if (!selectedOrganization) return null;
    return organizations.find(org => org._id === selectedOrganization);
  };

  // Helper function to get display value from entity
  const getEntityDisplayValue = (entity, field) => {
    if (typeof entity[field] === 'object' && entity[field] !== null) {
      return entity[field].name || entity[field];
    }
    return entity[`${field}Name`] || entity[field] || '';
  };

  // Get already assigned sections for a specific department and class
  const getAssignedSectionIds = (departmentId, classId) => {
    return sectionClassAssignments
      .filter(assignment => 
        (assignment.departmentId === departmentId || assignment.department?._id === departmentId) &&
        (assignment.classId === classId || assignment.class?._id === classId)
      )
      .map(assignment => assignment.sectionId || assignment.section?._id);
  };

  // Helper function to group assignments by department and class
  const getGroupedAssignments = () => {
    const grouped = {};
    
    sectionClassAssignments.forEach(assignment => {
      const departmentId = assignment.departmentId || assignment.department?._id;
      const departmentName = getEntityDisplayValue(assignment, 'department');
      const classId = assignment.classId || assignment.class?._id;
      const className = getEntityDisplayValue(assignment, 'class');
      const sectionName = getEntityDisplayValue(assignment, 'section');
      
      if (!grouped[departmentId]) {
        grouped[departmentId] = {
          name: departmentName,
          classes: {}
        };
      }
      
      if (!grouped[departmentId].classes[classId]) {
        grouped[departmentId].classes[classId] = {
          name: className,
          sections: []
        };
      }
      
      grouped[departmentId].classes[classId].sections.push({
        id: assignment._id,
        name: sectionName,
        assignmentData: assignment
      });
    });
    
    return grouped;
  };

  // Toggle department expansion
  const toggleDepartment = (departmentId) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [departmentId]: !prev[departmentId]
    }));
  };

  // Handler to view sections for a department-class combination
  const handleViewSections = (departmentId, classId) => {
    const groupedAssignments = getGroupedAssignments();
    const sections = groupedAssignments[departmentId]?.[classId] || [];
    
    setViewingSections(sections);
    setViewingDepartment(departments.find(d => d._id === departmentId));
    setViewingClass(classes.find(c => c._id === classId));
    setIsSectionsViewModalOpen(true);
  };

  useEffect(() => {
    fetchCountries();
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

  const confirmDeleteDepartment = async () => {
    try {
      await deleteDepartment(itemToDelete._id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType('');
      await fetchDepartments(selectedOrganization);
      await fetchAssignments(selectedOrganization, appliedFilters);
    } catch (error) {
      // Error already handled in deleteDepartment
    }
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment._id, departmentFormData);
      } else {
        await createDepartment(departmentFormData);
      }
      setIsDepartmentModalOpen(false);
      setDepartmentFormData({ name: '', description: '' });
      setEditingDepartment(null);
      await fetchDepartments(selectedOrganization);
    } catch (error) {
      // Error already handled in API functions
    }
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

  const confirmDeleteClass = async () => {
    try {
      await deleteClass(itemToDelete._id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType('');
      await fetchClasses(selectedOrganization);
      await fetchAssignments(selectedOrganization, appliedFilters);
    } catch (error) {
      // Error already handled
    }
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await updateClass(editingClass._id, classFormData);
      } else {
        await createClass(classFormData);
      }
      setIsClassModalOpen(false);
      setClassFormData({ name: '', description: '' });
      setEditingClass(null);
      await fetchClasses(selectedOrganization);
    } catch (error) {
      // Error already handled in API functions
    }
  };

  // Section handlers
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

  const confirmDeleteSection = async () => {
    try {
      await deleteSection(itemToDelete._id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType('');
      await fetchSections(selectedOrganization);
      await fetchAssignments(selectedOrganization, appliedFilters);
    } catch (error) {
      // Error already handled
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSection) {
        await updateSection(editingSection._id, sectionFormData);
      } else {
        await createSection(sectionFormData);
      }
      setIsSectionModalOpen(false);
      setSectionFormData({ name: '', description: '' });
      setEditingSection(null);
      await fetchSections(selectedOrganization);
    } catch (error) {
      // Error already handled in API functions
    }
  };

  // Assignment handlers
  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setAssignmentFormData({ sectionIds: [], classId: '', departmentId: '' });
    setIsAssignmentModalOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setAssignmentFormData({ 
      sectionIds: [assignment.sectionId || assignment.section?._id], 
      classId: assignment.classId || assignment.class?._id, 
      departmentId: assignment.departmentId || assignment.department?._id
    });
    setIsAssignmentModalOpen(true);
  };

  const handleDeleteAssignment = (assignment) => {
    setItemToDelete(assignment);
    setDeleteType('assignment');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAssignment = async () => {
    try {
      await deleteAssignment(itemToDelete._id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType('');
      await fetchAssignments(selectedOrganization, appliedFilters);
    } catch (error) {
      // Error already handled
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await updateAssignment(editingAssignment._id, {
          sectionId: assignmentFormData.sectionIds[0],
          classId: assignmentFormData.classId,
          departmentId: assignmentFormData.departmentId
        });
      } else {
        await createAssignment(assignmentFormData);
      }
      setIsAssignmentModalOpen(false);
      setAssignmentFormData({ sectionIds: [], classId: '', departmentId: '' });
      setEditingAssignment(null);
      await fetchAssignments(selectedOrganization, appliedFilters);
    } catch (error) {
      // Error already handled in API functions
    }
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
      departmentId: subject.departmentId || subject.department?._id, 
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

  const confirmDeleteSubject = async () => {
    try {
      await deleteSubject(itemToDelete._id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType('');
      await fetchSubjects(selectedOrganization);
    } catch (error) {
      // Error already handled
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await updateSubject(editingSubject._id, subjectFormData);
      } else {
        await createSubject(subjectFormData);
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
      setEditingSubject(null);
      await fetchSubjects(selectedOrganization);
    } catch (error) {
      // Error already handled in API functions
    }
  };

  // CSV download handler
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

  // Assignment filter handlers
  const handleApplyFilters = async () => {
    if (!selectedOrganization) return;
    
    setAppliedFilters(assignmentFilters);
    await fetchAssignments(selectedOrganization, assignmentFilters);
  };

  const handleClearFilters = async () => {
    if (!selectedOrganization) return;
    
    const emptyFilters = { departmentId: '', classId: '' };
    setAssignmentFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    await fetchAssignments(selectedOrganization, emptyFilters);
  };

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
  const isAnyModalOpen = isDepartmentModalOpen || isClassModalOpen || isSectionModalOpen || isSubjectModalOpen || isAssignmentModalOpen || isViewModalOpen || isEditListModalOpen || isSectionsViewModalOpen;

  // Get grouped assignments for display
  const groupedAssignments = getGroupedAssignments();

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />
      
      {/* Navigation Component - hidden when modal is open */}
      {!isAnyModalOpen && <Navigation currentPage="organization-setup" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isAnyModalOpen ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Organization Setup</h1>
              <p className="text-slate-500 text-sm">Select an organization first, then manage departments, classes, sections, subjects, and assignments</p>
            </div>
          </header>

          {/* Organization Selection Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Select Organization</h2>
                <p className="text-slate-500 text-sm">Choose country, state, district, and organization to manage class setup</p>
              </div>
              {selectedOrganization && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <span className="text-green-800 font-medium">
                      {getSelectedOrganizationInfo()?.name}
                    </span>
                  </div>
                  <p className="text-green-600 text-sm">
                    {selectedState}, {selectedCountry}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  {locations.countries.map((country) => (
                    <option key={country.code} value={country.name}>{country.name}</option>
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
                  {locations.states.map((state) => (
                    <option key={state.code} value={state.name}>{state.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  District *
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className={inputBaseClass}
                  disabled={!selectedState}
                  required
                >
                  <option value="">Select District</option>
                  {locations.districts.map((district) => (
                    <option key={district.code} value={district.name}>{district.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Organization *
                </label>
                <select
                  value={selectedOrganization}
                  onChange={(e) => handleOrganizationChange(e.target.value)}
                  className={inputBaseClass}
                  disabled={!selectedDistrict || isLoading}
                  required
                >
                  <option value="">Select Organization</option>
                  {organizations.map(org => (
                    <option key={org._id} value={org._id}>{org.name}</option>
                  ))}
                </select>
                {isLoading && selectedDistrict && (
                  <p className="text-sm text-slate-500 mt-1">Loading organizations...</p>
                )}
              </div>
            </div>

            {!selectedOrganization && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <i className="fas fa-info-circle text-amber-600"></i>
                  <div>
                    <h3 className="font-semibold text-amber-900">Organization Selection Required</h3>
                    <p className="text-sm text-amber-700">Please select a country, state, district, and organization to manage class setup and assignments.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Global Entity Management Tabs - Only show when organization is selected */}
          {selectedOrganization && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Entity Management</h2>
                  <p className="text-slate-500 text-sm">Manage departments, classes, sections, and subjects for {getSelectedOrganizationInfo()?.name}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <span className="text-blue-800 text-sm font-medium">
                    Organization: {getSelectedOrganizationInfo()?.name}
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
                  <p className="text-blue-700 text-sm mb-3">
                    {loadingEntities.departments ? 'Loading...' : `${departments.length} departments`}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={handleAddDepartment}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      disabled={loadingEntities.departments}
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
                    </div>
                  </div>
                </div>

                {/* Classes Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-green-900">Classes</h3>
                    <i className="fas fa-graduation-cap text-green-600"></i>
                  </div>
                  <p className="text-green-700 text-sm mb-3">
                    {loadingEntities.classes ? 'Loading...' : `${classes.length} classes`}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={handleAddClass}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      disabled={loadingEntities.classes}
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
                    </div>
                  </div>
                </div>

                {/* Sections Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-purple-900">Sections</h3>
                    <i className="fas fa-layer-group text-purple-600"></i>
                  </div>
                  <p className="text-purple-700 text-sm mb-3">
                    {loadingEntities.sections ? 'Loading...' : `${sections.length} sections`}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={handleAddSection}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      disabled={loadingEntities.sections}
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
                    </div>
                  </div>
                </div>

                {/* Subjects Card */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-orange-900">Subjects</h3>
                    <i className="fas fa-book text-orange-600"></i>
                  </div>
                  <p className="text-orange-700 text-sm mb-3">
                    {loadingEntities.subjects ? 'Loading...' : `${subjects.length} subjects`}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={handleAddSubject}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      disabled={loadingEntities.subjects}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assignment Management - Only show when organization is selected */}
          {selectedOrganization && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Section-Class Assignments</h2>
                  <p className="text-slate-500 text-sm">Assign sections to classes under specific departments for {getSelectedOrganizationInfo()?.name}</p>
                </div>
                <button
                  onClick={handleAddAssignment}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  disabled={loadingEntities.assignments}
                >
                  <i className="fas fa-plus"></i>
                  Add Assignment
                </button>
              </div>

              {/* Assignment Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Department</label>
                  <select
                    value={assignmentFilters.departmentId}
                    onChange={(e) => setAssignmentFilters(prev => ({ ...prev, departmentId: e.target.value }))}
                    className={inputBaseClass}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Class</label>
                  <select
                    value={assignmentFilters.classId}
                    onChange={(e) => setAssignmentFilters(prev => ({ ...prev, classId: e.target.value }))}
                    className={inputBaseClass}
                  >
                    <option value="">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleApplyFilters}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 w-full"
                    disabled={loadingEntities.assignments}
                  >
                    <i className="fas fa-filter"></i>
                    Apply Filters
                  </button>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 w-full"
                    disabled={loadingEntities.assignments}
                  >
                    <i className="fas fa-times"></i>
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Active filters indicator */}
              {(appliedFilters.departmentId || appliedFilters.classId) && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-filter text-blue-600"></i>
                    <span className="font-medium text-blue-900">Active Filters:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {appliedFilters.departmentId && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Department: {departments.find(d => d._id === appliedFilters.departmentId)?.name}
                      </span>
                    )}
                    {appliedFilters.classId && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Class: {classes.find(c => c._id === appliedFilters.classId)?.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Loading state for assignments */}
              {loadingEntities.assignments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-slate-600">Loading assignments...</span>
                </div>
              ) : (
                /* Hierarchical Assignments View */
                <div className="space-y-4">
                  {Object.keys(groupedAssignments).length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <i className="fas fa-inbox text-4xl mb-4"></i>
                      <p>No assignments found. Create your first assignment or adjust your filters to see results.</p>
                    </div>
                  ) : (
                    Object.entries(groupedAssignments).map(([deptId, deptData]) => (
                      <div key={deptId} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        {/* Department Header */}
                        <div 
                          className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                          onClick={() => toggleDepartment(deptId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <i className={`fas fa-chevron-${expandedDepartments[deptId] ? 'down' : 'right'} text-blue-600 transition-transform`}></i>
                              <h3 className="text-lg font-semibold text-blue-900">{deptData.name}</h3>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                                {Object.keys(deptData.classes).length} classes
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddAssignment();
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                                title="Add assignment to this department"
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Classes and Sections - Collapsible */}
                        {expandedDepartments[deptId] && (
                          <div className="divide-y divide-slate-100">
                            {Object.entries(deptData.classes).map(([classId, classData]) => (
                              <div key={classId} className="p-4 bg-slate-50">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <i className="fas fa-graduation-cap text-green-600"></i>
                                    <h4 className="font-semibold text-slate-900">{classData.name}</h4>
                                    <span className="text-sm text-slate-600 bg-slate-200 px-2 py-1 rounded-full">
                                      {classData.sections.length} sections
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setAssignmentFormData({ 
                                        sectionIds: [], 
                                        classId: classId, 
                                        departmentId: deptId 
                                      });
                                      setIsAssignmentModalOpen(true);
                                    }}
                                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors flex items-center gap-2"
                                  >
                                    <i className="fas fa-plus"></i>
                                    Add Section
                                  </button>
                                </div>

                                {/* Sections Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                  {classData.sections.map((section) => (
                                    <div key={section.id} className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <i className="fas fa-layer-group text-purple-500"></i>
                                        <span className="font-medium text-slate-700">{section.name}</span>
                                      </div>
                                      <button
                                        onClick={() => handleDeleteAssignment(section.assignmentData)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title="Delete assignment"
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
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
        onDownloadTemplate={handleDownloadTemplate}
        isUploading={false}
      />

      {/* Assignment Modal */}
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
                    disabled={editingAssignment}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
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
                    disabled={editingAssignment}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>{cls.name}</option>
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
                          checked={(() => {
                            if (!assignmentFormData.departmentId || !assignmentFormData.classId) {
                              return sections.length > 0 && assignmentFormData.sectionIds.length === sections.length;
                            }
                            
                            const availableSections = sections.filter(sec => 
                              !getAssignedSectionIds(assignmentFormData.departmentId, assignmentFormData.classId).includes(sec._id)
                            );
                            
                            return availableSections.length > 0 && 
                              assignmentFormData.sectionIds.length === availableSections.length;
                          })()}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (assignmentFormData.departmentId && assignmentFormData.classId) {
                                const availableSections = sections.filter(sec => 
                                  !getAssignedSectionIds(assignmentFormData.departmentId, assignmentFormData.classId).includes(sec._id)
                                );
                                setAssignmentFormData(prev => ({ 
                                  ...prev, 
                                  sectionIds: availableSections.map(sec => sec._id)
                                }));
                              } else {
                                setAssignmentFormData(prev => ({ 
                                  ...prev, 
                                  sectionIds: sections.map(sec => sec._id)
                                }));
                              }
                            } else {
                              setAssignmentFormData(prev => ({ 
                                ...prev, 
                                sectionIds: []
                              }));
                            }
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          disabled={
                            editingAssignment || 
                            sections.length === 0 ||
                            (assignmentFormData.departmentId && assignmentFormData.classId && 
                             sections.filter(sec => 
                               !getAssignedSectionIds(assignmentFormData.departmentId, assignmentFormData.classId).includes(sec._id)
                             ).length === 0)
                          }
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {assignmentFormData.departmentId && assignmentFormData.classId 
                            ? 'Select All Available Sections'
                            : 'Select All Sections'
                          }
                        </span>
                      </label>
                      {assignmentFormData.departmentId && assignmentFormData.classId && (
                        <p className="text-xs text-slate-500 mt-1">
                          Only selects sections that are not already assigned to this department and class
                        </p>
                      )}
                    </div>
                    
                    {/* Scrollable Sections List */}
                    <div className="max-h-40 overflow-y-auto p-2">
                      {sections.length > 0 ? (
                        <div className="space-y-2">
                          {sections.map((sec) => {
                            const isAlreadyAssigned = assignmentFormData.departmentId && assignmentFormData.classId && 
                              getAssignedSectionIds(assignmentFormData.departmentId, assignmentFormData.classId).includes(sec._id);
                            
                            const isSelected = assignmentFormData.sectionIds.includes(sec._id);
                            const isAvailable = !isAlreadyAssigned;
                            
                            return (
                              <label 
                                key={sec._id} 
                                className={`flex items-center space-x-2 p-1 rounded ${
                                  !isAvailable ? 'bg-amber-50 cursor-not-allowed' : 'hover:bg-slate-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (editingAssignment) {
                                      setAssignmentFormData(prev => ({ 
                                        ...prev, 
                                        sectionIds: e.target.checked ? [sec._id] : []
                                      }));
                                    } else {
                                      if (e.target.checked) {
                                        setAssignmentFormData(prev => ({ 
                                          ...prev, 
                                          sectionIds: [...prev.sectionIds, sec._id] 
                                        }));
                                      } else {
                                        setAssignmentFormData(prev => ({ 
                                          ...prev, 
                                          sectionIds: prev.sectionIds.filter(id => id !== sec._id) 
                                        }));
                                      }
                                    }
                                  }}
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                  disabled={
                                    (editingAssignment && assignmentFormData.sectionIds.length > 0 && !assignmentFormData.sectionIds.includes(sec._id)) ||
                                    !isAvailable
                                  }
                                />
                                <span className={`text-sm ${!isAvailable ? 'text-amber-600' : 'text-slate-700'}`}>
                                  {sec.name}
                                  {!isAvailable && (
                                    <span className="text-xs text-amber-500 ml-1">(already assigned)</span>
                                  )}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500 text-center py-2">
                          No sections available. Please add sections first.
                        </div>
                      )}
                    </div>
                  </div>
                  {editingAssignment && (
                    <p className="text-xs text-slate-500 mt-1">
                      Note: When editing, you can only select one section.
                    </p>
                  )}
                  {assignmentFormData.departmentId && assignmentFormData.classId && (
                    <p className="text-xs text-amber-600 mt-1">
                      Note: Sections already assigned to this department and class are disabled and cannot be selected.
                    </p>
                  )}
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
                    disabled={assignmentFormData.sectionIds.length === 0}
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
                      <tr key={item._id || index} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3 text-slate-600">{item.description || '-'}</td>
                        {viewModalType === 'subject' && (
                          <>
                            <td className="p-3 text-slate-600">{item.code}</td>
                            <td className="p-3 text-slate-600">{getEntityDisplayValue(item, 'department')}</td>
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
                      <div key={item._id || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{item.name}</h3>
                          <p className="text-sm text-slate-600">{item.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsEditListModalOpen(false);
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
                    handleAddAssignment();
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

      <DeleteConfirmationModal 
        isOpen={showDeleteConfirm}
        itemToDelete={itemToDelete}
        deleteType={deleteType}
        onConfirm={() => {
          if (deleteType === 'department') confirmDeleteDepartment();
          if (deleteType === 'class') confirmDeleteClass();
          if (deleteType === 'section') confirmDeleteSection();
          if (deleteType === 'subject') confirmDeleteSubject();
          if (deleteType === 'assignment') confirmDeleteAssignment();
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

export default MasterOrganizationSetup;
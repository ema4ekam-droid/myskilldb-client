import { useState, useEffect } from "react";
import Navigation from "../../components/master-user-components/common/master-navigation/Navigation";
import {
  DepartmentModal,
  ClassModal,
  SectionModal,
  SubjectModal,
  DeleteConfirmationModal,
  OrganizationSelection,
  AssignmentManagement,
  AssignmentModal,
  ViewModal,
  EditListModal,
  SectionsViewModal,
  EntityManagement,
} from "../../components/master-user-components/master-class-setup-components";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../api/apiRequests";

const MasterOrganizationSetup = () => {

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
    filterDistricts: [],
  });
  const [organizations, setOrganizations] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");

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
  const [viewModalType, setViewModalType] = useState("");
  const [viewingItem, setViewingItem] = useState(null);

  // Sections view modal state
  const [isSectionsViewModalOpen, setIsSectionsViewModalOpen] = useState(false);
  const [viewingSections, setViewingSections] = useState([]);
  const [viewingDepartment, setViewingDepartment] = useState(null);
  const [viewingClass, setViewingClass] = useState(null);

  // Edit list modal states
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [editListType, setEditListType] = useState("");
  const [editListItems, setEditListItems] = useState([]);

  // Form data states
  const [departmentFormData, setDepartmentFormData] = useState({
    name: "",
    description: "",
  });
  const [classFormData, setClassFormData] = useState({
    name: "",
    description: "",
  });
  const [sectionFormData, setSectionFormData] = useState({
    name: "",
    description: "",
  });
  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    code: "",
    departmentId: "",
    description: "",
  });
  const [assignmentFormData, setAssignmentFormData] = useState({
    sectionIds: [],
    classId: "",
    departmentId: "",
  });

  // Editing states
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);

  // Filter states for assignments
  const [assignmentFilters, setAssignmentFilters] = useState({
    departmentId: "",
    classId: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    departmentId: "",
    classId: "",
  });

  // Confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState({
    departments: false,
    classes: false,
    sections: false,
    subjects: false,
    assignments: false,
  });

  // State to track expanded departments in assignment view
  const [expandedDepartments, setExpandedDepartments] = useState({});

  // --- API CALLS FOR LOCATIONS ---
  const fetchCountries = async () => {
    try {
      const response = await getRequest(`/locations/countries`);
      if (response.data.success) {
        const countries = response.data.data;
        setLocations((prev) => ({ ...prev, countries }));
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to fetch countries");
    }
  };

  const fetchStates = async (countryCode, forFilter = false) => {
    try {
      const response = await getRequest(`/locations/states/${countryCode}`);

      if (response.data.success) {
        const states = response.data.data;
        if (forFilter) {
          setLocations((prev) => ({ ...prev, filterStates: states }));
        } else {
          setLocations((prev) => ({ ...prev, states }));
        }
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Failed to fetch states");
    }
  };

  const fetchDistricts = async (stateCode, forFilter = false) => {
    try {
      const response = await getRequest(
        `/locations/districts/state/${stateCode}`
      );

      if (response.data.success) {
        const districts = response.data.data;
        if (forFilter) {
          setLocations((prev) => ({ ...prev, filterDistricts: districts }));
        } else {
          setLocations((prev) => ({ ...prev, districts }));
        }
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to fetch districts");
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

      const response = await getRequest(`/organization?${params}`);

      if (response.data.success) {
        const allOrgs = response.data.data;
        setOrganizations(allOrgs);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations");
    } finally {
      setIsLoading(false);
    }
  };

  // --- API CALLS FOR ENTITIES ---

  // Department API calls
  const fetchDepartments = async (organizationId) => {
    if (!organizationId) return;

    try {
      setLoadingEntities((prev) => ({ ...prev, departments: true }));
      const response = await getRequest(
        `/organization-setup/departments/${organizationId}`
      );

      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    } finally {
      setLoadingEntities((prev) => ({ ...prev, departments: false }));
    }
  };

  const createDepartment = async (departmentData) => {
    try {
      const response = await postRequest(`/organization-setup/departments`, {
        ...departmentData,
        organizationId: selectedOrganization,
      });

      if (response.data.success) {
        toast.success("Department created successfully");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateDepartment = async (departmentId, departmentData) => {
    try {
      const response = await putRequest(
        `/organization-setup/departments/${departmentId}`,
        {
          ...departmentData,
          organizationId: selectedOrganization,
        }
      );

      if (response.data.success) {
        toast.success("Department updated successfully");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteDepartment = async (departmentId) => {
    try {
      await deleteRequest(`/organization-setup/departments/${departmentId}`);

      toast.success("Department deleted successfully");
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Class API calls
  const fetchClasses = async (organizationId) => {
    if (!organizationId) return;

    try {
      setLoadingEntities((prev) => ({ ...prev, classes: true }));
      const response = await getRequest(
        `/organization-setup/classes/${organizationId}`
      );

      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");
    } finally {
      setLoadingEntities((prev) => ({ ...prev, classes: false }));
    }
  };

  const createClass = async (classData) => {
    try {
      const response = await postRequest(`/organization-setup/classes`, {
        ...classData,
        organizationId: selectedOrganization,
      });

      if (response.data.success) {
        toast.success("Class created successfully");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateClass = async (classId, classData) => {
    try {
      const response = await putRequest(
        `/organization-setup/classes/${classId}`,
        {
          ...classData,
          organizationId: selectedOrganization,
        }
      );

      if (response.data.success) {
        toast.success("Class updated successfully");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteClass = async (classId) => {
    try {
      await deleteRequest(`/organization-setup/classes/${classId}`);
      toast.success("Class deleted successfully");
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Section API calls
  const fetchSections = async (organizationId) => {
    if (!organizationId) return;

    try {
      setLoadingEntities((prev) => ({ ...prev, sections: true }));
      const response = await getRequest(
        `/organization-setup/sections/${organizationId}`
      );

      if (response.data.success) {
        setSections(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Failed to fetch sections");
    } finally {
      setLoadingEntities((prev) => ({ ...prev, sections: false }));
    }
  };

  const createSection = async (sectionData) => {
    try {
      const response = await postRequest(`/organization-setup/sections`, {
        ...sectionData,
        organizationId: selectedOrganization,
      });

      if (response.data.success) {
        toast.success("Section created successfully");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateSection = async (sectionId, sectionData) => {
    try {
      const response = await putRequest(
        `/organization-setup/sections/${sectionId}`,
        {
          ...sectionData,
          organizationId: selectedOrganization,
        }
      );

      if (response.data.success) {
        toast.success("Section updated successfully");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      await deleteRequest(`/organization-setup/sections/${sectionId}`);
      toast.success("Section deleted successfully");
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Subject API calls
  const fetchSubjects = async (organizationId) => {
    if (!organizationId) return;

    try {
      setLoadingEntities((prev) => ({ ...prev, subjects: true }));
      const response = await getRequest(
        `/organization-setup/subjects/${organizationId}`
      );

      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects");
    } finally {
      setLoadingEntities((prev) => ({ ...prev, subjects: false }));
    }
  };

  const createSubject = async (subjectData) => {
    try {
      const response = await postRequest(`/organization-setup/subjects`, {
        ...subjectData,
        organizationId: selectedOrganization,
      });

      if (response.data.success) {
        toast.success("Subject created successfully");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateSubject = async (subjectId, subjectData) => {
    try {
      const response = await putRequest(
        `/organization-setup/subjects/${subjectId}`,
        {
          ...subjectData,
          organizationId: selectedOrganization,
        }
      );

      if (response.data.success) {
        toast.success("Subject updated successfully");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteSubject = async (subjectId) => {
    try {
      await deleteRequest(`/organization-setup/subjects/${subjectId}`);
      toast.success("Subject deleted successfully");
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Assignment API calls
  const fetchAssignments = async (organizationId, filterParams = {}) => {
    if (!organizationId) return;

    try {
      setLoadingEntities((prev) => ({ ...prev, assignments: true }));

      const params = new URLSearchParams();

      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value.trim()) {
          params.append(key, value);
        }
      });

      const response = await getRequest(
        `/organization-setup/assignments/${organizationId}?${params}`
      );

      if (response.data.success) {
        setSectionClassAssignments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to fetch assignments");
    } finally {
      setLoadingEntities((prev) => ({ ...prev, assignments: false }));
    }
  };

  const createAssignment = async (assignmentData) => {
    try {
      const response = await postRequest(`/organization-setup/assignments`, {
        ...assignmentData,
        organizationId: selectedOrganization,
      });

      if (response.data.success) {
        toast.success("Assignment(s) created successfully");
        return response.data.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteAssignment = async (assignmentId) => {
    try {
      await deleteRequest(`/organization-setup/assignments/${assignmentId}`);
      toast.success("Assignment deleted successfully");
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
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Location change handlers
  const handleCountryChange = async (countryName) => {
    setSelectedCountry(countryName);
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedOrganization("");
    setOrganizations([]);
    clearAllEntities();

    if (countryName) {
      const selectedCountryObj = locations.countries.find(
        (c) => c.name === countryName
      );
      if (selectedCountryObj) {
        await fetchStates(selectedCountryObj.code, false);
      }
    }
  };

  const handleStateChange = async (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict("");
    setSelectedOrganization("");
    setOrganizations([]);
    clearAllEntities();

    if (stateName) {
      const selectedStateObj = locations.states.find(
        (s) => s.name === stateName
      );
      if (selectedStateObj) {
        await fetchDistricts(selectedStateObj.code, false);
      }
    }
  };

  const handleDistrictChange = async (districtName) => {
    setSelectedDistrict(districtName);
    setSelectedOrganization("");
    clearAllEntities();

    if (districtName && selectedCountry && selectedState) {
      await fetchOrganizations({
        country: selectedCountry,
        state: selectedState,
        district: districtName,
      });
    }
  };

  const handleOrganizationChange = async (orgId) => {
    setSelectedOrganization(orgId);
    clearAllEntities();
    setAssignmentFilters({ departmentId: "", classId: "" });
    setAppliedFilters({ departmentId: "", classId: "" });

    if (orgId) {
      await Promise.all([
        fetchDepartments(orgId),
        fetchClasses(orgId),
        fetchSections(orgId),
        fetchSubjects(orgId),
        fetchAssignments(orgId),
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
    return organizations.find((org) => org._id === selectedOrganization);
  };

  // Helper function to get display value from entity
  const getEntityDisplayValue = (entity, field) => {
    if (typeof entity[field] === "object" && entity[field] !== null) {
      return entity[field].name || entity[field];
    }
    return entity[`${field}Name`] || entity[field] || "";
  };

  // Get already assigned sections for a specific department and class
  const getAssignedSectionIds = (departmentId, classId) => {
    return sectionClassAssignments
      .filter(
        (assignment) =>
          (assignment.departmentId === departmentId ||
            assignment.department?._id === departmentId) &&
          (assignment.classId === classId || assignment.class?._id === classId)
      )
      .map((assignment) => assignment.sectionId || assignment.section?._id);
  };

  // Helper function to group assignments by department and class
  const getGroupedAssignments = () => {
    const grouped = {};

    sectionClassAssignments.forEach((assignment) => {
      const departmentId =
        assignment.departmentId || assignment.department?._id;
      const departmentName = getEntityDisplayValue(assignment, "department");
      const classId = assignment.classId || assignment.class?._id;
      const className = getEntityDisplayValue(assignment, "class");
      const sectionName = getEntityDisplayValue(assignment, "section");

      if (!grouped[departmentId]) {
        grouped[departmentId] = {
          name: departmentName,
          classes: {},
        };
      }

      if (!grouped[departmentId].classes[classId]) {
        grouped[departmentId].classes[classId] = {
          name: className,
          sections: [],
        };
      }

      grouped[departmentId].classes[classId].sections.push({
        id: assignment._id,
        name: sectionName,
        assignmentData: assignment,
      });
    });

    return grouped;
  };

  // Toggle department expansion
  const toggleDepartment = (departmentId) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId],
    }));
  };

  // Handler to view sections for a department-class combination
  const handleViewSections = (departmentId, classId) => {
    const groupedAssignments = getGroupedAssignments();
    const sections =
      groupedAssignments[departmentId]?.classes[classId]?.sections || [];

    setViewingSections(sections);
    setViewingDepartment(departments.find((d) => d._id === departmentId));
    setViewingClass(classes.find((c) => c._id === classId));
    setIsSectionsViewModalOpen(true);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Department handlers
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setDepartmentFormData({ name: "", description: "" });
    setIsDepartmentModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setDepartmentFormData({
      name: department.name,
      description: department.description,
    });
    setIsDepartmentModalOpen(true);
  };

  const handleDeleteDepartment = (department) => {
    setItemToDelete(department);
    setDeleteType("department");
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDepartment = async () => {
    try {
      await deleteDepartment(itemToDelete._id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType("");
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
      setDepartmentFormData({ name: "", description: "" });
      setEditingDepartment(null);
      await fetchDepartments(selectedOrganization);
    } catch (error) {
      // Error already handled in API functions
    }
  };

  // Class handlers
  const handleAddClass = () => {
    setEditingClass(null);
    setClassFormData({ name: "", description: "" });
    setIsClassModalOpen(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setClassFormData({
      name: classItem.name,
      description: classItem.description,
    });
    setIsClassModalOpen(true);
  };

  const handleDeleteClass = (classItem) => {
    setItemToDelete(classItem);
    setDeleteType("class");
    setShowDeleteConfirm(true);
  };

  const confirmDeleteClass = async () => {
    try {
      await deleteClass(itemToDelete._id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType("");
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
      setClassFormData({ name: "", description: "" });
      setEditingClass(null);
      await fetchClasses(selectedOrganization);
    } catch (error) {
      // Error already handled in API functions
    }
  };

  // Section handlers
  const handleAddSection = () => {
    setEditingSection(null);
    setSectionFormData({ name: "", description: "" });
    setIsSectionModalOpen(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setSectionFormData({
      name: section.name,
      description: section.description,
    });
    setIsSectionModalOpen(true);
  };

  const handleDeleteSection = (section) => {
    setItemToDelete(section);
    setDeleteType("section");
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSection = async () => {
    try {
      await deleteSection(itemToDelete._id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType("");
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
      setSectionFormData({ name: "", description: "" });
      setEditingSection(null);
      await fetchSections(selectedOrganization);
    } catch (error) {
      // Error already handled in API functions
    }
  };

  // Assignment handlers
  const handleAddAssignment = () => {
    setAssignmentFormData({ sectionIds: [], classId: "", departmentId: "" });
    setIsAssignmentModalOpen(true);
  };

  const handleDeleteAssignment = (assignment) => {
    setItemToDelete(assignment);
    setDeleteType("assignment");
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAssignment = async () => {
    try {
      await deleteAssignment(itemToDelete._id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType("");
      await fetchAssignments(selectedOrganization, appliedFilters);
    } catch (error) {
      // Error already handled
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAssignment(assignmentFormData);
      setIsAssignmentModalOpen(false);
      setAssignmentFormData({ sectionIds: [], classId: "", departmentId: "" });
      await fetchAssignments(selectedOrganization, appliedFilters);
    } catch (error) {
      // Error already handled in API functions
    }
  };

  // Subject handlers
  const handleAddSubject = () => {
    setEditingSubject(null);
    setSubjectFormData({
      name: "",
      code: "",
      departmentId: "",
      description: "",
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
    });
    setIsSubjectModalOpen(true);
  };

  const handleDeleteSubject = (subject) => {
    setItemToDelete(subject);
    setDeleteType("subject");
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSubject = async () => {
    try {
      await deleteSubject(itemToDelete._id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType("");
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
        name: "",
        code: "",
        departmentId: "",
        description: "",
      });
      setEditingSubject(null);
      await fetchSubjects(selectedOrganization);
    } catch (error) {
      // Error already handled in API functions
    }
  };

  // CSV download handler
  const handleDownloadTemplate = () => {
    const csvContent =
      "Subject Name,Subject Code,Department,Description\nPhysics,PHY101,Science,Basic Physics\nChemistry,CHE101,Science,Basic Chemistry\nMathematics,MATH101,Mathematics,Basic Math";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subjects_template.csv";
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

    const emptyFilters = { departmentId: "", classId: "" };
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
      case "department":
        handleDeleteDepartment(item);
        break;
      case "class":
        handleDeleteClass(item);
        break;
      case "section":
        handleDeleteSection(item);
        break;
      case "subject":
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
  const inputBaseClass =
    "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed";
  const btnBaseClass =
    "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnTealClass = `${btnBaseClass} bg-teal-500 hover:bg-teal-600 text-white`;
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnRoseClass = `${btnBaseClass} bg-rose-500 hover:bg-rose-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;

  // Check if any modal is open
  const isAnyModalOpen =
    isDepartmentModalOpen ||
    isClassModalOpen ||
    isSectionModalOpen ||
    isSubjectModalOpen ||
    isAssignmentModalOpen ||
    isViewModalOpen ||
    isEditListModalOpen ||
    isSectionsViewModalOpen;

  // Get grouped assignments for display
  const groupedAssignments = getGroupedAssignments();

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />

      {/* Navigation Component - hidden when modal is open */}
      {!isAnyModalOpen && (
        <Navigation
          currentPage="organization-setup"
          onPageChange={handlePageChange}
        />
      )}

      {/* Main Content */}
      <div className={isAnyModalOpen ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Organization Setup
              </h1>
              <p className="text-slate-500 text-sm">
                Select an organization first, then manage departments, classes,
                sections, subjects, and assignments
              </p>
            </div>
          </header>

          {/* Organization Selection */}
          <OrganizationSelection
            locations={locations}
            selectedCountry={selectedCountry}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedOrganization={selectedOrganization}
            organizations={organizations}
            isLoading={isLoading}
            onCountryChange={handleCountryChange}
            onStateChange={handleStateChange}
            onDistrictChange={handleDistrictChange}
            onOrganizationChange={handleOrganizationChange}
            getSelectedOrganizationInfo={getSelectedOrganizationInfo}
            inputBaseClass={inputBaseClass}
          />

          {/* Entity Management */}
          {selectedOrganization && (
            <EntityManagement
              departments={departments}
              classes={classes}
              sections={sections}
              subjects={subjects}
              loadingEntities={loadingEntities}
              onAddDepartment={handleAddDepartment}
              onAddClass={handleAddClass}
              onAddSection={handleAddSection}
              onAddSubject={handleAddSubject}
              onViewEntity={handleViewEntity}
              onEditEntity={handleEditEntity}
              getSelectedOrganizationInfo={getSelectedOrganizationInfo}
            />
          )}

          {/* Assignment Management */}
          {selectedOrganization && (
            <AssignmentManagement
              departments={departments}
              classes={classes}
              sections={sections}
              loadingEntities={loadingEntities}
              assignmentFilters={assignmentFilters}
              appliedFilters={appliedFilters}
              groupedAssignments={groupedAssignments}
              expandedDepartments={expandedDepartments}
              onAddAssignment={handleAddAssignment}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              onFilterChange={setAssignmentFilters}
              onToggleDepartment={toggleDepartment}
              onViewSections={handleViewSections}
              onDeleteAssignment={handleDeleteAssignment}
              getSelectedOrganizationInfo={getSelectedOrganizationInfo}
              inputBaseClass={inputBaseClass}
            />
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
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        assignmentFormData={assignmentFormData}
        setAssignmentFormData={setAssignmentFormData}
        onSubmit={handleAssignmentSubmit}
        onClose={() => setIsAssignmentModalOpen(false)}
        departments={departments}
        classes={classes}
        sections={sections}
        getAssignedSectionIds={getAssignedSectionIds}
        inputBaseClass={inputBaseClass}
        btnIndigoClass={btnIndigoClass}
        btnSlateClass={btnSlateClass}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={isViewModalOpen}
        viewModalType={viewModalType}
        viewingItem={viewingItem}
        onClose={() => setIsViewModalOpen(false)}
        getEntityDisplayValue={getEntityDisplayValue}
      />

      {/* Edit List Modal */}
      <EditListModal
        isOpen={isEditListModalOpen}
        editListType={editListType}
        editListItems={editListItems}
        onClose={() => setIsEditListModalOpen(false)}
        onEditDepartment={handleEditDepartment}
        onEditClass={handleEditClass}
        onEditSection={handleEditSection}
        onEditSubject={handleEditSubject}
        onDeleteDepartment={handleDeleteDepartment}
        onDeleteClass={handleDeleteClass}
        onDeleteSection={handleDeleteSection}
        onDeleteSubject={handleDeleteSubject}
        btnSlateClass={btnSlateClass}
      />

      {/* Sections View Modal */}
      <SectionsViewModal
        isOpen={isSectionsViewModalOpen}
        viewingSections={viewingSections}
        viewingDepartment={viewingDepartment}
        viewingClass={viewingClass}
        onClose={() => setIsSectionsViewModalOpen(false)}
        onAddAssignment={handleAddAssignment}
        onDeleteAssignment={handleDeleteAssignment}
        btnSlateClass={btnSlateClass}
        btnIndigoClass={btnIndigoClass}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        itemToDelete={itemToDelete}
        deleteType={deleteType}
        onConfirm={() => {
          if (deleteType === "department") confirmDeleteDepartment();
          if (deleteType === "class") confirmDeleteClass();
          if (deleteType === "section") confirmDeleteSection();
          if (deleteType === "subject") confirmDeleteSubject();
          if (deleteType === "assignment") confirmDeleteAssignment();
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
          setDeleteType("");
        }}
      />
    </div>
  );
};

export default MasterOrganizationSetup;

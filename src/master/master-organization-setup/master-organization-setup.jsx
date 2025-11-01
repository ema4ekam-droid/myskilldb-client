import { useState, useEffect, useRef } from "react";
import Navigation from "../../components/master-user-components/common/master-navigation/Navigation";
import {
  DepartmentModal,
  ClassModal,
  SectionModal,
  SubjectModal,
  AssignmentModal,
  ViewModal,
  HeaderSection,
  QuickEditSection
} from "../../components/common/org_setup";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  OrganizationSelection,
  AssignmentManagement,
  EntityManagement
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
  });
  const [organizations, setOrganizations] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");


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


  // State for quick edit dropdowns
  const [selectedDepartmentEdit, setSelectedDepartmentEdit] = useState("");
  const [selectedClassEdit, setSelectedClassEdit] = useState("");
  const [selectedSectionEdit, setSelectedSectionEdit] = useState("");
  const [selectedSubjectEdit, setSelectedSubjectEdit] = useState("");

  // Ref to store assignment delete promise resolver
  const assignmentDeleteResolverRef = useRef(null);

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

  const fetchStates = async (countryCode) => {
    try {
      const response = await getRequest(`/locations/states/${countryCode}`);
      if (response.data.success) {
        setLocations((prev) => ({ ...prev, states: response.data.data }));
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Failed to fetch states");
    }
  };

  const fetchDistricts = async (stateCode) => {
    try {
      const response = await getRequest(`/locations/districts/state/${stateCode}`);
      if (response.data.success) {
        setLocations((prev) => ({ ...prev, districts: response.data.data }));
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
  const fetchClassesByDepartment = async (organizationId, departmentId) => {
    if (!organizationId || !departmentId) return [];

    try {
      const response = await getRequest(
        `/organization-setup/classes/${organizationId}/${departmentId}`
      );

      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching classes by department:", error);
      toast.error("Failed to fetch classes");
      return [];
    }
  };

  const fetchSectionsByAssignment = async (organizationId, departmentId, classId) => {
    if (!organizationId || !departmentId || !classId) return [];

    try {
      const response = await getRequest(
        `/organization-setup/assignments/${organizationId}/${departmentId}/${classId}`
      );
      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching sections by assignment:", error);
      toast.error("Failed to fetch sections");
      return [];
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
        await fetchStates(selectedCountryObj.code);
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
        await fetchDistricts(selectedStateObj.code);
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

    if (orgId) {
      await Promise.all([
        fetchDepartments(orgId),
        fetchClasses(orgId),
        fetchSections(orgId),
        fetchSubjects(orgId),
      ]);
    }
  };

  const clearAllEntities = () => {
    setDepartments([]);
    setClasses([]);
    setSections([]);
    setSubjects([]);
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
  // Note: With new structure, this is simplified since AssignmentModal handles section selection
  // The API will prevent duplicate assignments
  const getAssignedSectionIds = (departmentId, classId) => {
    // Return empty array - AssignmentModal will work with all available sections
    // Duplicate assignments will be handled by the API validation
    return [];
  };

  // Quick Edit Handlers
  const handleQuickEditDepartment = (departmentId) => {
    if (!departmentId) return;
    const department = departments.find(d => d._id === departmentId);
    if (department) {
      handleEditDepartment(department);
    }
    setSelectedDepartmentEdit("");
  };

  const handleQuickEditClass = (classId) => {
    if (!classId) return;
    const classItem = classes.find(c => c._id === classId);
    if (classItem) {
      handleEditClass(classItem);
    }
    setSelectedClassEdit("");
  };

  const handleQuickEditSection = (sectionId) => {
    if (!sectionId) return;
    const section = sections.find(s => s._id === sectionId);
    if (section) {
      handleEditSection(section);
    }
    setSelectedSectionEdit("");
  };

  const handleQuickEditSubject = (subjectId) => {
    if (!subjectId) return;
    const subject = subjects.find(s => s._id === subjectId);
    if (subject) {
      handleEditSubject(subject);
    }
    setSelectedSubjectEdit("");
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
    if (!itemToDelete) return;
    const deleteId = itemToDelete._id;
    try {
      await deleteDepartment(deleteId);
      setDepartments(prev => prev.filter(dept => dept._id !== deleteId));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType("");
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
    if (!itemToDelete) return;
    const deleteId = itemToDelete._id;
    try {
      await deleteClass(deleteId);
      setClasses(prev => prev.filter(cls => cls._id !== deleteId));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType("");
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
    if (!itemToDelete) return;
    const deleteId = itemToDelete._id;
    try {
      await deleteSection(deleteId);
      setSections(prev => prev.filter(sec => sec._id !== deleteId));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType("");
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


  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAssignment(assignmentFormData);
      setIsAssignmentModalOpen(false);
      setAssignmentFormData({ sectionIds: [], classId: "", departmentId: "" });
      // The AssignmentManagement component will handle refreshing if needed
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
    if (!itemToDelete) return;
    const deleteId = itemToDelete._id;
    try {
      await deleteSubject(deleteId);
      setSubjects(prev => prev.filter(sub => sub._id !== deleteId));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType("");
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


  // View handler
  const handleViewEntity = (type, items) => {
    setViewModalType(type);
    setViewingItem(items);
    setIsViewModalOpen(true);
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
    isViewModalOpen;


  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />

      {/* Navigation Component - hidden when modal is open */}
      {!isAnyModalOpen && <Navigation currentPage="organization-setup" />}

      {/* Main Content */}
      <div className={isAnyModalOpen ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header Section */}
          <HeaderSection />

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
              getSelectedOrganizationInfo={getSelectedOrganizationInfo}
            />
          )}

          {/* Quick Edit Section */}
          {selectedOrganization && (
            <QuickEditSection
              departments={departments}
              classes={classes}
              sections={sections}
              subjects={subjects}
              selectedDepartmentEdit={selectedDepartmentEdit}
              selectedClassEdit={selectedClassEdit}
              selectedSectionEdit={selectedSectionEdit}
              selectedSubjectEdit={selectedSubjectEdit}
              setSelectedDepartmentEdit={setSelectedDepartmentEdit}
              setSelectedClassEdit={setSelectedClassEdit}
              setSelectedSectionEdit={setSelectedSectionEdit}
              setSelectedSubjectEdit={setSelectedSubjectEdit}
              onQuickEditDepartment={handleQuickEditDepartment}
              onQuickEditClass={handleQuickEditClass}
              onQuickEditSection={handleQuickEditSection}
              onQuickEditSubject={handleQuickEditSubject}
              inputBaseClass={inputBaseClass}
            />
          )}

          {/* Assignment Management */}
          {selectedOrganization && (
            <AssignmentManagement
              departments={departments}
              organizationId={selectedOrganization}
              loadingEntities={loadingEntities}
              onAddAssignment={handleAddAssignment}
              onDeleteAssignment={async (assignmentId) => {
                return new Promise((resolve, reject) => {
                  assignmentDeleteResolverRef.current = { resolve, reject, assignmentId };
                  setItemToDelete({ _id: assignmentId });
                  setDeleteType("assignment");
                  setShowDeleteConfirm(true);
                });
              }}
              onFetchClassesByDepartment={fetchClassesByDepartment}
              onFetchSectionsByAssignment={fetchSectionsByAssignment}
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

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Confirm Deletion"
        message={
          deleteType === "assignment"
            ? "Are you sure you want to delete this assignment?"
            : `Are you sure you want to delete this ${deleteType}? ${itemToDelete?.name ? `(${itemToDelete.name})` : ""}`
        }
        onConfirm={async () => {
          if (deleteType === "department") {
            await confirmDeleteDepartment();
          } else if (deleteType === "class") {
            await confirmDeleteClass();
          } else if (deleteType === "section") {
            await confirmDeleteSection();
          } else if (deleteType === "subject") {
            await confirmDeleteSubject();
          } else if (deleteType === "assignment") {
            if (assignmentDeleteResolverRef.current) {
              const { resolve, reject, assignmentId } = assignmentDeleteResolverRef.current;
              try {
                await deleteAssignment(assignmentId);
                setShowDeleteConfirm(false);
                setItemToDelete(null);
                setDeleteType("");
                assignmentDeleteResolverRef.current = null;
                resolve();
              } catch (error) {
                assignmentDeleteResolverRef.current = null;
                reject(error);
              }
            }
          }
        }}
        onClose={() => {
          if (assignmentDeleteResolverRef.current) {
            assignmentDeleteResolverRef.current.reject(new Error("Deletion cancelled"));
            assignmentDeleteResolverRef.current = null;
          }
          setShowDeleteConfirm(false);
          setItemToDelete(null);
          setDeleteType("");
        }}
        btnSlateClass={btnSlateClass}
        btnRoseClass={btnRoseClass}
      />
    </div>
  );
};

export default MasterOrganizationSetup;
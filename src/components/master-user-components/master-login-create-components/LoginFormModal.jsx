import React, { useState, useEffect } from "react";
import axios from "axios";

const LoginFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  organizations,
  isLoading,
  inputBaseClass,
  btnTealClass,
  btnSlateClass,
}) => {
  const [localFormData, setLocalFormData] = useState({
    organizationId: "",
    role: "",
    name: "",
    email: "",
    mobileNumber: "",
    departmentId: "",
    assignmentId: "", // New field for student assignment
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingSections, setIsLoadingSections] = useState(false);

  const API_BASE_URL = `${import.meta.env.VITE_SERVER_API_URL}/api`;

  const roles = [
    {
      key: "principal",
      label: "Principal",
      icon: "fas fa-user-tie",
      description: "Organization principal login",
    },
    {
      key: "hod",
      label: "Head of Department",
      icon: "fas fa-user-graduate",
      description: "Department head login",
    },
    {
      key: "teacher",
      label: "Teacher",
      icon: "fas fa-chalkboard-teacher",
      description: "Teacher login",
    },
    {
      key: "student",
      label: "Student",
      icon: "fas fa-user-graduate",
      description: "Student login",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setLocalFormData(formData);
      setErrors({});
    }
  }, [isOpen, formData]);

  // Fetch departments when organization is selected
  useEffect(() => {
    if (localFormData.organizationId) {
      fetchDepartments(localFormData.organizationId);
    } else {
      // Reset all data when no organization is selected
      setDepartments([]);
      setClasses([]);
      setSections([]);
      setLocalFormData((prev) => ({
        ...prev,
        departmentId: "",
        assignmentId: "",
      }));
    }
  }, [localFormData.organizationId]);

  // Fetch classes when department is selected (for student role)
  useEffect(() => {
    if (
      localFormData.role === "student" &&
      localFormData.departmentId &&
      localFormData.organizationId
    ) {
      fetchClasses(localFormData.organizationId, localFormData.departmentId);
    } else {
      // Reset classes and sections when department changes
      setClasses([]);
      setSections([]);
      setLocalFormData((prev) => ({
        ...prev,
        assignmentId: "",
      }));
    }
  }, [
    localFormData.departmentId,
    localFormData.organizationId,
    localFormData.role,
  ]);

  // Fetch sections (which contain assignmentId) when class is selected (for student role)
  useEffect(() => {
    if (
      localFormData.role === "student" &&
      localFormData.classId &&
      localFormData.departmentId &&
      localFormData.organizationId
    ) {
      fetchSections(
        localFormData.organizationId,
        localFormData.departmentId,
        localFormData.classId
      );
    } else {
      // Reset sections when class changes
      setSections([]);
      setLocalFormData((prev) => ({
        ...prev,
        assignmentId: "",
      }));
    }
  }, [
    localFormData.classId,
    localFormData.departmentId,
    localFormData.organizationId,
    localFormData.role,
  ]);

  const fetchDepartments = async (organizationId) => {
    try {
      setIsLoadingData(true);
      const response = await axios.get(
        `${API_BASE_URL}/organization-setup/departments/${organizationId}`
      );

      if (response.data.success) {
        setDepartments(response.data.data || []);
      } else {
        setDepartments([]);
        console.error("Failed to fetch departments:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchClasses = async (organizationId, departmentId) => {
    try {
      setIsLoadingClasses(true);
      const response = await axios.get(
        `${API_BASE_URL}/organization-setup/classes/${organizationId}/${departmentId}`
      );

      if (response.data.success) {
        setClasses(response.data.data || []);
      } else {
        setClasses([]);
        console.error("Failed to fetch classes:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const fetchSections = async (organizationId, departmentId, classId) => {
    try {
      setIsLoadingSections(true);
      const response = await axios.get(
        `${API_BASE_URL}/organization-setup/sections/${organizationId}/${departmentId}/${classId}`
      );

      if (response.data.success) {
        setSections(response.data.data || []);
      } else {
        setSections([]);
        console.error("Failed to fetch sections:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setSections([]);
    } finally {
      setIsLoadingSections(false);
    }
  };

  const handleInputChange = (field, value) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Reset dependent fields when organization or department changes
    if (field === "organizationId") {
      setLocalFormData((prev) => ({
        ...prev,
        departmentId: "",
        assignmentId: "",
      }));
      setDepartments([]);
      setClasses([]);
      setSections([]);
    } else if (field === "departmentId") {
      setLocalFormData((prev) => ({
        ...prev,
        assignmentId: "",
      }));
      setClasses([]);
      setSections([]);
    } else if (field === "classId") {
      setLocalFormData((prev) => ({
        ...prev,
        assignmentId: "",
      }));
      setSections([]);
    } else if (field === "role") {
      // Reset department and assignment when role changes
      if (value !== "student") {
        setLocalFormData((prev) => ({
          ...prev,
          departmentId: "",
          assignmentId: "",
        }));
        setClasses([]);
        setSections([]);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!localFormData.organizationId) {
      newErrors.organizationId = "Please select an organization";
    }

    if (!localFormData.role) {
      newErrors.role = "Please select a role";
    }

    if (!localFormData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!localFormData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Mobile number is required
    if (!localFormData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[+]?[\d\s\-()]{10,}$/.test(localFormData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid mobile number";
    }

    // Department validation based on role
    if ((localFormData.role === "hod" || localFormData.role === "teacher") && !localFormData.departmentId) {
      newErrors.departmentId = "Department is required";
    }

    // Assignment validation for student
    if (localFormData.role === "student") {
      if (!localFormData.departmentId) {
        newErrors.departmentId = "Department is required for Student";
      }
      if (!localFormData.classId) {
        newErrors.classId = "Class is required for Student";
      }
      if (!localFormData.assignmentId) {
        newErrors.assignmentId = "Section is required for Student";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Prepare the data with IDs for API submission
      const submissionData = {
        organizationId: localFormData.organizationId,
        role: localFormData.role,
        name: localFormData.name,
        email: localFormData.email,
        mobile: localFormData.mobileNumber,
      };

      // Add role-specific fields
      if (localFormData.role === "student") {
        // For student, use assignmentId instead of departmentId, classId, sectionId
        submissionData.assignmentId = localFormData.assignmentId;
      } else if (localFormData.role === "hod" || localFormData.role === "teacher") {
        // For HOD and Teacher, use departmentId
        submissionData.departmentId = localFormData.departmentId;
      }

      onSubmit(submissionData);
    }
  };

  const handleClose = () => {
    setLocalFormData({
      organizationId: "",
      role: "",
      name: "",
      email: "",
      mobileNumber: "",
      departmentId: "",
      assignmentId: "",
    });
    setErrors({});
    setDepartments([]);
    setClasses([]);
    setSections([]);
    onClose();
  };

  const selectedRole = roles.find((r) => r.key === localFormData.role);
  const selectedOrganization = organizations.find(
    (org) => org._id === localFormData.organizationId
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Create User Login
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Add a new user login for the selected organization
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-slate-500"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Organization Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Organization *
            </label>
            <select
              className={`${inputBaseClass} ${
                errors.organizationId ? "border-red-300 focus:ring-red-500" : ""
              }`}
              value={localFormData.organizationId}
              onChange={(e) =>
                handleInputChange("organizationId", e.target.value)
              }
              disabled={!!formData.organizationId}
            >
              <option value="">Choose an organization...</option>
              {organizations.map((organization) => (
                <option key={organization._id} value={organization._id}>
                  {organization.name} - {organization.district},{" "}
                  {organization.state}
                </option>
              ))}
            </select>
            {errors.organizationId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.organizationId}
              </p>
            )}
            {selectedOrganization && (
              <p className="mt-1 text-sm text-slate-500">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {selectedOrganization.address}, {selectedOrganization.district},{" "}
                {selectedOrganization.state}, {selectedOrganization.country}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Role *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => handleInputChange("role", role.key)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    localFormData.role === role.key
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i
                      className={`${role.icon} text-lg ${
                        localFormData.role === role.key
                          ? "text-indigo-500"
                          : "text-slate-400"
                      }`}
                    ></i>
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-xs text-slate-500">
                        {role.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                className={`${inputBaseClass} ${
                  errors.name ? "border-red-300 focus:ring-red-500" : ""
                }`}
                placeholder="Enter full name"
                value={localFormData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                className={`${inputBaseClass} ${
                  errors.email ? "border-red-300 focus:ring-red-500" : ""
                }`}
                placeholder="Enter email address"
                value={localFormData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              className={`${inputBaseClass} ${
                errors.mobileNumber ? "border-red-300 focus:ring-red-500" : ""
              }`}
              placeholder="Enter mobile number"
              value={localFormData.mobileNumber}
              onChange={(e) =>
                handleInputChange("mobileNumber", e.target.value)
              }
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Department (for HOD, Teacher and Student) */}
          {(localFormData.role === "hod" ||
            localFormData.role === "student" ||
            localFormData.role === "teacher") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Department{" "}
                {localFormData.role === "teacher" ? "(Optional)" : "*"}
                {isLoadingData && (
                  <span className="text-slate-400 text-xs ml-2">
                    Loading...
                  </span>
                )}
              </label>
              <select
                className={`${inputBaseClass} ${
                  errors.departmentId ? "border-red-300 focus:ring-red-500" : ""
                } ${
                  !localFormData.organizationId || isLoadingData
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                value={localFormData.departmentId}
                onChange={(e) =>
                  handleInputChange("departmentId", e.target.value)
                }
                disabled={!localFormData.organizationId || isLoadingData}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.departmentId}
                </p>
              )}
              {!localFormData.organizationId && (
                <p className="mt-1 text-xs text-slate-500">
                  Please select an organization first
                </p>
              )}
            </div>
          )}

          {/* Class and Section (for Student only) */}
          {localFormData.role === "student" && (
            <>
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class *
                  {isLoadingClasses && (
                    <span className="text-slate-400 text-xs ml-2">
                      Loading...
                    </span>
                  )}
                </label>
                <select
                  className={`${inputBaseClass} ${
                    errors.classId ? "border-red-300 focus:ring-red-500" : ""
                  } ${
                    !localFormData.departmentId || isLoadingClasses
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  value={localFormData.classId}
                  onChange={(e) => handleInputChange("classId", e.target.value)}
                  disabled={!localFormData.departmentId || isLoadingClasses}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {errors.classId && (
                  <p className="mt-1 text-sm text-red-600">{errors.classId}</p>
                )}
                {!localFormData.departmentId && (
                  <p className="mt-1 text-xs text-slate-500">
                    Please select a department first
                  </p>
                )}
              </div>

              {/* Section Selection (now with assignmentId) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Section *
                  {isLoadingSections && (
                    <span className="text-slate-400 text-xs ml-2">
                      Loading...
                    </span>
                  )}
                </label>
                <select
                  className={`${inputBaseClass} ${
                    errors.assignmentId ? "border-red-300 focus:ring-red-500" : ""
                  } ${
                    !localFormData.classId || isLoadingSections
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  value={localFormData.assignmentId}
                  onChange={(e) =>
                    handleInputChange("assignmentId", e.target.value)
                  }
                  disabled={!localFormData.classId || isLoadingSections}
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section._id} value={section.assignmentId}>
                      {section.name}
                    </option>
                  ))}
                </select>
                {errors.assignmentId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.assignmentId}
                  </p>
                )}
                {!localFormData.classId && (
                  <p className="mt-1 text-xs text-slate-500">
                    Please select a class first
                  </p>
                )}
              </div>
            </>
          )}

          {/* Information Box */}
          {selectedRole && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start gap-3">
                <i
                  className={`${selectedRole.icon} text-lg text-indigo-500 mt-1`}
                ></i>
                <div>
                  <h4 className="font-medium text-slate-900">
                    {selectedRole.label} Login
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedRole.description}. Login credentials will be
                    automatically generated and can be emailed to the user.
                  </p>
                  <div className="mt-2 text-xs text-slate-500">
                    <div>
                      <strong>Required:</strong> Name, Email, Mobile Number
                    </div>
                    {(localFormData.role === "hod" || localFormData.role === "teacher") && (
                      <div>
                        <strong>Also Required:</strong> Department
                      </div>
                    )}
                    {localFormData.role === "student" && (
                      <>
                        <div>
                          <strong>Also Required:</strong> Department, Class, Section
                        </div>
                        <div>
                          <strong>Note:</strong> Section selection provides the assignment ID
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className={btnSlateClass}
              disabled={isLoading}
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button
              type="submit"
              className={btnTealClass}
              disabled={
                isLoading ||
                isLoadingData ||
                isLoadingClasses ||
                isLoadingSections
              }
            >
              <i className="fas fa-user-plus"></i>
              {isLoading ? "Creating..." : "Create Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginFormModal;
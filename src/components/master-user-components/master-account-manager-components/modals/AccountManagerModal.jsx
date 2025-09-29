import React, { useState, useEffect, useMemo } from "react";

const AccountManagerModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingAccountManager,
  isLoading,
  inputBaseClass,
  btnPrimaryClass,
  btnSecondaryClass,
}) => {
  const API_BASE_URL = useMemo(
    () => `${import.meta.env.VITE_SERVER_API_URL}/api`,
    []
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    aadharCardNumber: "",
    organizationIds: [], // Changed to array for multiple selection
  });
  const [errors, setErrors] = useState({});

  // Organization related states
  const [organizations, setOrganizations] = useState([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);
  const [organizationFilters, setOrganizationFilters] = useState({
    name: "",
    country: "",
    state: "",
    district: "",
  });

  // Initialize form data when editing
  useEffect(() => {
    if (editingAccountManager) {
      console.log("Editing account manager:", editingAccountManager);
      
      // Extract organization IDs properly - handle both object array and ID array
      let organizationIds = [];
      if (editingAccountManager.organizationIds && Array.isArray(editingAccountManager.organizationIds)) {
        // If organizationIds contains objects with _id property
        organizationIds = editingAccountManager.organizationIds.map(org => 
          typeof org === 'object' && org._id ? org._id : org
        );
      } else if (editingAccountManager.organizationId) {
        // Fallback to single organizationId for backward compatibility
        organizationIds = [editingAccountManager.organizationId];
      }
      
      setFormData({
        name: editingAccountManager.name || "",
        email: editingAccountManager.email || "",
        mobile: editingAccountManager.mobile ? editingAccountManager.mobile.toString() : "",
        aadharCardNumber: editingAccountManager.aadharCardNumber || "",
        organizationIds: organizationIds,
      });
      
      console.log("Extracted organization IDs:", organizationIds);
    } else {
      setFormData({
        name: "",
        email: "",
        mobile: "",
        aadharCardNumber: "",
        organizationIds: [],
      });
    }
    setErrors({});
  }, [editingAccountManager, isOpen]);

  // Fetch organizations when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchOrganizations();
    }
  }, [isOpen]);

  const fetchOrganizations = async (filterParams = {}) => {
    try {
      setIsLoadingOrganizations(true);
      
      const queryParams = new URLSearchParams(filterParams);
      const response = await fetch(
        `${API_BASE_URL}/organization?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }

      const result = await response.json();
      setOrganizations(result.data || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
    } finally {
      setIsLoadingOrganizations(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      aadharCardNumber: "",
      organizationIds: [],
    });
    setErrors({});
    setOrganizationFilters({
      name: "",
      country: "",
      state: "",
      district: "",
    });
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    if (formData.aadharCardNumber && !/^\d{12}$/.test(formData.aadharCardNumber.replace(/\D/g, ''))) {
      newErrors.aadharCardNumber = 'Aadhar card number must be 12 digits';
    }

    if (formData.organizationIds.length === 0) {
      newErrors.organizationIds = 'At least one organization must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    console.log("Submitting form data:", formData);
    const formattedData = {
      ...formData,
      mobile: formData.mobile.replace(/\D/g, ''), // Remove non-digits
      aadharCardNumber: formData.aadharCardNumber ? formData.aadharCardNumber.replace(/\D/g, '') : '',
      // For backward compatibility, also include the first organizationId as organizationId
      organizationId: formData.organizationIds[0] || ''
    };
    console.log("Formatted data to submit:", formattedData);
    onSubmit(formattedData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAadharChange = (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
    handleInputChange("aadharCardNumber", digitsOnly);
  };

  const handleMobileChange = (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    handleInputChange("mobile", digitsOnly);
  };

  const handleOrganizationFilterChange = (field, value) => {
    setOrganizationFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrganizationSearch = () => {
    fetchOrganizations(organizationFilters);
  };

  const handleClearOrganizationFilters = () => {
    setOrganizationFilters({
      name: "",
      country: "",
      state: "",
      district: "",
    });
    fetchOrganizations({});
  };

  const handleToggleOrganization = (organizationId) => {
    const isSelected = formData.organizationIds.includes(organizationId);
    let newOrganizationIds;
    
    if (isSelected) {
      newOrganizationIds = formData.organizationIds.filter(id => id !== organizationId);
    } else {
      newOrganizationIds = [...formData.organizationIds, organizationId];
    }
    
    handleInputChange("organizationIds", newOrganizationIds);
  };

  const getSelectedOrganizations = () => {
    return organizations.filter(org => formData.organizationIds.includes(org._id));
  };

  const handleRemoveSelectedOrganization = (organizationId) => {
    const newOrganizationIds = formData.organizationIds.filter(id => id !== organizationId);
    handleInputChange("organizationIds", newOrganizationIds);
  };

  const handleSelectAll = () => {
    const allOrgIds = organizations.map(org => org._id);
    handleInputChange("organizationIds", allOrgIds);
  };

  const handleDeselectAll = () => {
    handleInputChange("organizationIds", []);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingAccountManager
                ? "Edit Account Manager"
                : "Add Account Manager"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {editingAccountManager
                ? "Update account manager information"
                : "Create a new account manager"}
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
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  value={formData.name}
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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  className={`${inputBaseClass} ${
                    errors.mobile ? "border-red-300 focus:ring-red-500" : ""
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => handleMobileChange(e.target.value)}
                  maxLength={10}
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  Enter 10 digits without country code
                </p>
              </div>

              {/* Aadhar Card Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Aadhar Card Number
                </label>
                <input
                  type="text"
                  className={`${inputBaseClass} ${
                    errors.aadharCardNumber
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="Enter 12-digit Aadhar number (optional)"
                  value={formData.aadharCardNumber}
                  onChange={(e) => handleAadharChange(e.target.value)}
                  maxLength={12}
                />
                {errors.aadharCardNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.aadharCardNumber}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  Enter 12 digits without spaces or dashes (optional)
                </p>
              </div>
            </div>

            {/* Organization Selection */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Organizations *
                </label>
                {errors.organizationIds && (
                  <p className="mt-1 text-sm text-red-600">{errors.organizationIds}</p>
                )}

                {/* Organization Filters */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Filter Organizations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Filter by name..."
                      value={organizationFilters.name}
                      onChange={(e) => handleOrganizationFilterChange("name", e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Filter by country..."
                      value={organizationFilters.country}
                      onChange={(e) => handleOrganizationFilterChange("country", e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Filter by state..."
                      value={organizationFilters.state}
                      onChange={(e) => handleOrganizationFilterChange("state", e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Filter by district..."
                      value={organizationFilters.district}
                      onChange={(e) => handleOrganizationFilterChange("district", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleOrganizationSearch}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      disabled={isLoadingOrganizations}
                    >
                      <i className="fas fa-search"></i>
                      {isLoadingOrganizations ? "Searching..." : "Search Organizations"}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearOrganizationFilters}
                      className="px-4 py-2 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                      <i className="fas fa-filter-slash"></i>
                      Clear Filters
                    </button>
                    {organizations.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <i className="fas fa-check-square"></i>
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={handleDeselectAll}
                          className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                          <i className="fas fa-square"></i>
                          Deselect All
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Organization List */}
                <div className="border border-slate-200 rounded-lg max-h-80 overflow-y-auto mb-6">
                  {isLoadingOrganizations ? (
                    <div className="p-8 text-center text-slate-500">
                      <i className="fas fa-spinner fa-spin mr-2 text-lg"></i>
                      <p>Loading organizations...</p>
                    </div>
                  ) : organizations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <i className="fas fa-building text-2xl mb-2 block"></i>
                      <p>No organizations found</p>
                      <p className="text-xs mt-1">Try adjusting your filters</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {organizations.map((org) => {
                        const isSelected = formData.organizationIds.includes(org._id);
                        return (
                          <div
                            key={org._id}
                            className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => handleToggleOrganization(org._id)}
                          >
                            <div className="flex items-center gap-3">
                              {/* Custom Square Checkbox */}
                              <div
                                className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-slate-300 hover:border-blue-400'
                                }`}
                              >
                                {isSelected && (
                                  <i className="fas fa-check text-white text-xs"></i>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-medium transition-colors ${
                                    isSelected ? 'text-blue-900' : 'text-slate-900'
                                  }`}>
                                    {org.name}
                                  </h4>
                                  {isSelected && (
                                    <div className="flex items-center gap-1 text-blue-600 text-sm">
                                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                        Selected
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm text-slate-600 mt-1">
                                  <i className="fas fa-map-marker-alt mr-1"></i>
                                  {org.district}, {org.state}, {org.country}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Selected Organizations Display */}
                {formData.organizationIds.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-check-circle text-blue-600"></i>
                        <span className="font-medium text-blue-900">
                          Selected Organizations ({formData.organizationIds.length})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleDeselectAll}
                        className="text-sm text-blue-700 hover:text-blue-900 underline"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                      {getSelectedOrganizations().map((org) => (
                        <div
                          key={org._id}
                          className="bg-white border border-blue-200 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-blue-900 text-sm">
                              {org.name}
                            </div>
                            <div className="text-xs text-blue-700 mt-1">
                              <i className="fas fa-map-marker-alt mr-1"></i>
                              {org.district}, {org.state}, {org.country}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSelectedOrganization(org._id);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors ml-2"
                            title="Remove selection"
                          >
                            <i className="fas fa-times text-sm"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer with Form Actions */}
        <div className="border-t border-slate-200 p-6 bg-white">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className={btnSecondaryClass}
              disabled={isLoading}
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className={btnPrimaryClass}
              disabled={isLoading}
            >
              <i
                className={
                  editingAccountManager ? "fas fa-save" : "fas fa-plus"
                }
              ></i>
              {isLoading
                ? "Saving..."
                : editingAccountManager
                ? "Update Account Manager"
                : "Create Account Manager"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagerModal;
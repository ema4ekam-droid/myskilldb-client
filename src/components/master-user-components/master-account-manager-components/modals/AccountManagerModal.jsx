import React, { useState, useEffect } from 'react';

const AccountManagerModal = ({
  isOpen,
  onClose,
  onSubmit,
  schools,
  editingAccountManager,
  isLoading,
  inputBaseClass,
  btnPrimaryClass,
  btnSecondaryClass
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    adharCardNumber: '',
    assignedSchools: [],
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when editing
  useEffect(() => {
    if (editingAccountManager) {
      setFormData({
        name: editingAccountManager.name || '',
        email: editingAccountManager.email || '',
        mobileNumber: editingAccountManager.mobileNumber || '',
        adharCardNumber: editingAccountManager.adharCardNumber || '',
        assignedSchools: editingAccountManager.assignedSchools || [],
        status: editingAccountManager.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        mobileNumber: '',
        adharCardNumber: '',
        assignedSchools: [],
        status: 'active'
      });
    }
    setErrors({});
  }, [editingAccountManager, isOpen]);

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      adharCardNumber: '',
      assignedSchools: [],
      status: 'active'
    });
    setErrors({});
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile number validation
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[+]?[\d\s\-()]{10,}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }

    // Aadhar card validation
    if (!formData.adharCardNumber.trim()) {
      newErrors.adharCardNumber = 'Aadhar card number is required';
    } else if (!/^\d{12}$/.test(formData.adharCardNumber.replace(/\D/g, ''))) {
      newErrors.adharCardNumber = 'Aadhar card number must be 12 digits';
    }

    // Assigned schools validation
    if (formData.assignedSchools.length === 0) {
      newErrors.assignedSchools = 'At least one school must be assigned';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Format Aadhar card number (remove any non-digits)
    const formattedData = {
      ...formData,
      adharCardNumber: formData.adharCardNumber.replace(/\D/g, '')
    };

    onSubmit(formattedData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAadharChange = (value) => {
    // Remove any non-digits and limit to 12 digits
    const digitsOnly = value.replace(/\D/g, '').slice(0, 12);
    handleInputChange('adharCardNumber', digitsOnly);
  };

  const handleSchoolToggle = (schoolId) => {
    setFormData(prev => ({
      ...prev,
      assignedSchools: prev.assignedSchools.includes(schoolId)
        ? prev.assignedSchools.filter(id => id !== schoolId)
        : [...prev.assignedSchools, schoolId]
    }));
    
    if (errors.assignedSchools) {
      setErrors(prev => ({ ...prev, assignedSchools: '' }));
    }
  };

  const handleSelectAllSchools = () => {
    setFormData(prev => ({
      ...prev,
      assignedSchools: schools.map(school => school._id)
    }));
    
    if (errors.assignedSchools) {
      setErrors(prev => ({ ...prev, assignedSchools: '' }));
    }
  };

  const handleDeselectAllSchools = () => {
    setFormData(prev => ({
      ...prev,
      assignedSchools: []
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingAccountManager ? 'Edit Account Manager' : 'Add Account Manager'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {editingAccountManager ? 'Update account manager information' : 'Create a new account manager'}
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                className={`${inputBaseClass} ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
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
                className={`${inputBaseClass} ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                className={`${inputBaseClass} ${errors.mobileNumber ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
              )}
            </div>

            {/* Aadhar Card Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Aadhar Card Number *
              </label>
              <input
                type="text"
                className={`${inputBaseClass} ${errors.adharCardNumber ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Enter 12-digit Aadhar number"
                value={formData.adharCardNumber}
                onChange={(e) => handleAadharChange(e.target.value)}
                maxLength={12}
              />
              {errors.adharCardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.adharCardNumber}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">Enter 12 digits without spaces or dashes</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              className={inputBaseClass}
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* School Assignment */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-700">
                Assigned Schools *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllSchools}
                  className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllSchools}
                  className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-4">
              {schools.map(school => (
                <label key={school._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={formData.assignedSchools.includes(school._id)}
                    onChange={() => handleSchoolToggle(school._id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{school.name}</div>
                    <div className="text-sm text-slate-500">{school.district}, {school.state}</div>
                  </div>
                </label>
              ))}
            </div>
            
            {errors.assignedSchools && (
              <p className="mt-2 text-sm text-red-600">{errors.assignedSchools}</p>
            )}
            
            {formData.assignedSchools.length > 0 && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">
                  <strong>{formData.assignedSchools.length}</strong> school(s) selected:
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.assignedSchools.map(schoolId => {
                    const school = schools.find(s => s._id === schoolId);
                    return school ? (
                      <span key={schoolId} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">
                        <i className="fas fa-school"></i>
                        {school.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
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
              className={btnPrimaryClass}
              disabled={isLoading}
            >
              <i className={editingAccountManager ? "fas fa-save" : "fas fa-plus"}></i>
              {isLoading ? 'Saving...' : (editingAccountManager ? 'Update Account Manager' : 'Create Account Manager')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountManagerModal;

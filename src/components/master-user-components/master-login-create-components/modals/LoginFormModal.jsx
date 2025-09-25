import React, { useState, useEffect } from 'react';

const LoginFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  schools,
  isLoading,
  inputBaseClass,
  btnTealClass,
  btnSlateClass
}) => {
  const [localFormData, setLocalFormData] = useState({
    schoolId: '',
    userType: '',
    name: '',
    email: '',
    mobileNumber: '',
    department: ''
  });

  const [errors, setErrors] = useState({});

  const userTypes = [
    { key: 'principal', label: 'Principal', icon: 'fas fa-user-tie', description: 'School principal login' },
    { key: 'hod', label: 'Head of Department', icon: 'fas fa-user-graduate', description: 'Department head login' },
    { key: 'teacher', label: 'Teacher', icon: 'fas fa-chalkboard-teacher', description: 'Teacher login' },
    { key: 'parent', label: 'Parent/Student', icon: 'fas fa-users', description: 'Parent or student login' }
  ];

  const departments = [
    'Mathematics', 'Science', 'English', 'Social Studies', 'Physical Education',
    'Computer Science', 'Art', 'Music', 'Languages', 'Commerce', 'Biology',
    'Chemistry', 'Physics', 'History', 'Geography', 'Economics', 'Business Studies'
  ];

  useEffect(() => {
    if (isOpen) {
      setLocalFormData(formData);
      setErrors({});
    }
  }, [isOpen, formData]);

  const handleInputChange = (field, value) => {
    setLocalFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!localFormData.schoolId) {
      newErrors.schoolId = 'Please select a school';
    }

    if (!localFormData.userType) {
      newErrors.userType = 'Please select a user type';
    }

    if (!localFormData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!localFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile number is required
    if (!localFormData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[+]?[\d\s\-()]{10,}$/.test(localFormData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }

    // Department is required for HOD
    if (localFormData.userType === 'hod' && !localFormData.department) {
      newErrors.department = 'Department is required for HOD';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(localFormData);
    }
  };

  const handleClose = () => {
    setLocalFormData({
      schoolId: '',
      userType: '',
      name: '',
      email: '',
      mobileNumber: '',
      department: ''
    });
    setErrors({});
    onClose();
  };

  const selectedUserType = userTypes.find(ut => ut.key === localFormData.userType);
  const selectedSchool = schools.find(s => s._id === localFormData.schoolId);

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
            <h2 className="text-xl font-bold text-slate-900">Create User Login</h2>
            <p className="text-sm text-slate-500 mt-1">Add a new user login for the selected school</p>
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
          {/* School Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select School *
            </label>
            <select
              className={`${inputBaseClass} ${errors.schoolId ? 'border-red-300 focus:ring-red-500' : ''}`}
              value={localFormData.schoolId}
              onChange={(e) => handleInputChange('schoolId', e.target.value)}
              disabled={!!formData.schoolId} // Disable if pre-selected
            >
              <option value="">Choose a school...</option>
              {schools.map(school => (
                <option key={school._id} value={school._id}>
                  {school.name} - {school.district}, {school.state}
                </option>
              ))}
            </select>
            {errors.schoolId && (
              <p className="mt-1 text-sm text-red-600">{errors.schoolId}</p>
            )}
            {selectedSchool && (
              <p className="mt-1 text-sm text-slate-500">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {selectedSchool.address}, {selectedSchool.district}, {selectedSchool.state}, {selectedSchool.country}
              </p>
            )}
          </div>

          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              User Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {userTypes.map(userType => (
                <button
                  key={userType.key}
                  type="button"
                  onClick={() => handleInputChange('userType', userType.key)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    localFormData.userType === userType.key
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`${userType.icon} text-lg ${
                      localFormData.userType === userType.key ? 'text-indigo-500' : 'text-slate-400'
                    }`}></i>
                    <div>
                      <div className="font-medium">{userType.label}</div>
                      <div className="text-xs text-slate-500">{userType.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.userType && (
              <p className="mt-1 text-sm text-red-600">{errors.userType}</p>
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
                className={`${inputBaseClass} ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Enter full name"
                value={localFormData.name}
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
                value={localFormData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
              className={`${inputBaseClass} ${errors.mobileNumber ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Enter mobile number"
              value={localFormData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Department (for HOD only) */}
          {localFormData.userType === 'hod' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Department *
              </label>
              <select
                className={`${inputBaseClass} ${errors.department ? 'border-red-300 focus:ring-red-500' : ''}`}
                value={localFormData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>
          )}

          {/* Information Box */}
          {selectedUserType && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start gap-3">
                <i className={`${selectedUserType.icon} text-lg text-indigo-500 mt-1`}></i>
                <div>
                  <h4 className="font-medium text-slate-900">{selectedUserType.label} Login</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedUserType.description}. Login credentials will be automatically generated and can be emailed to the user.
                  </p>
                  <div className="mt-2 text-xs text-slate-500">
                    <div><strong>Required:</strong> Name, Email, Mobile Number</div>
                    {localFormData.userType === 'hod' && <div><strong>Also Required:</strong> Department</div>}
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
              disabled={isLoading}
            >
              <i className="fas fa-user-plus"></i>
              {isLoading ? 'Creating...' : 'Create Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginFormModal;

import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_SERVER_API_URL}/api`;

// School Login API utilities
export const schoolLoginApi = {
  // Get login counts for a school
  getSchoolLoginCounts: async (schoolId) => {
    const response = await axios.get(`${API_BASE_URL}/schools/${schoolId}/login-counts`);
    return response;
  },

  // Create individual login
  createLogin: async (loginData) => {
    const response = await axios.post(`${API_BASE_URL}/school-logins`, loginData);
    return response;
  },

  // Bulk upload logins
  bulkUpload: async (file, userType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userType', userType);
    
    const response = await axios.post(`${API_BASE_URL}/school-logins/bulk-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Download template
  downloadTemplate: async (userType) => {
    const response = await axios.get(`${API_BASE_URL}/school-logins/template/${userType}`, {
      responseType: 'blob',
    });
    return response;
  },

  // Get users by school and type
  getSchoolUsers: async (schoolId, userType) => {
    const response = await axios.get(`${API_BASE_URL}/schools/${schoolId}/users/${userType}`);
    return response;
  },

  // Bulk delete users
  bulkDelete: async (schoolId, userType, userIds) => {
    const response = await axios.delete(`${API_BASE_URL}/school-logins/bulk-delete`, {
      data: {
        schoolId,
        userType,
        userIds
      }
    });
    return response;
  },

  // Email credentials
  emailCredentials: async (schoolId, userType, userIds) => {
    const response = await axios.post(`${API_BASE_URL}/school-logins/email-credentials`, {
      schoolId,
      userType,
      userIds
    });
    return response;
  },

  // Get individual user details
  getUserDetails: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/school-logins/${userId}`);
    return response;
  },

  // Update user details
  updateUser: async (userId, userData) => {
    const response = await axios.put(`${API_BASE_URL}/school-logins/${userId}`, userData);
    return response;
  },

  // Delete individual user
  deleteUser: async (userId) => {
    const response = await axios.delete(`${API_BASE_URL}/school-logins/${userId}`);
    return response;
  },

  // Reset password
  resetPassword: async (userId) => {
    const response = await axios.post(`${API_BASE_URL}/school-logins/${userId}/reset-password`);
    return response;
  },

  // Get login history
  getLoginHistory: async (schoolId, userType, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_BASE_URL}/schools/${schoolId}/login-history/${userType}?${params}`);
    return response;
  },

  // Get system statistics
  getLoginStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/school-logins/stats`);
    return response;
  }
};

// Form validation utilities
export const validationUtils = {
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateMobile: (mobile) => {
    const mobileRegex = /^[+]?[\d\s\-()]{10,}$/;
    return mobileRegex.test(mobile);
  },

  validateName: (name) => {
    return name.trim().length >= 2;
  },

  validatePassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  validateFormData: (formData, userType) => {
    const errors = {};

    if (!validationUtils.validateName(formData.name)) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!validationUtils.validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.mobileNumber && !validationUtils.validateMobile(formData.mobileNumber)) {
      errors.mobileNumber = 'Please enter a valid mobile number';
    }

    if (userType === 'hod' && !formData.department) {
      errors.department = 'Department is required for HOD';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Excel template generation utilities
export const excelUtils = {
  generateTemplate: (userType) => {
    const headers = {
      principal: ['Name *', 'Email *', 'Mobile Number *'],
      hod: ['Name *', 'Email *', 'Mobile Number *', 'Department *'],
      teacher: ['Name *', 'Email *', 'Mobile Number *'],
      parent: ['Name *', 'Email *', 'Mobile Number *'],
      all: ['Name *', 'Email *', 'Mobile Number *', 'User Type *', 'Department *']
    };

    return headers[userType] || headers.all;
  },

  validateExcelData: (data, userType) => {
    const errors = [];
    const headers = excelUtils.generateTemplate(userType);

    data.forEach((row, index) => {
      const rowErrors = [];

      // Check required fields
      if (!row.Name || !row.Email || !row.Mobile) {
        rowErrors.push('Name, Email, and Mobile Number are required');
      }

      // Validate email format
      if (row.Email && !validationUtils.validateEmail(row.Email)) {
        rowErrors.push('Invalid email format');
      }

      // Validate mobile number (required for all user types)
      if (row.Mobile && !validationUtils.validateMobile(row.Mobile)) {
        rowErrors.push('Invalid mobile number format');
      }

      // Check department for HOD
      if (userType === 'hod' && !row.Department) {
        rowErrors.push('Department is required for HOD');
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: index + 2, // Excel row number (accounting for header)
          errors: rowErrors
        });
      }
    });

    return errors;
  }
};

// User type configurations
export const userTypeConfig = {
  principal: {
    label: 'Principal',
    icon: 'fas fa-user-tie',
    color: 'blue',
    description: 'School principal login',
    requiredFields: ['name', 'email', 'mobileNumber'],
    optionalFields: [],
    permissions: ['full_access', 'student_management', 'teacher_management', 'reports']
  },
  hod: {
    label: 'Head of Department',
    icon: 'fas fa-user-graduate',
    color: 'green',
    description: 'Department head login',
    requiredFields: ['name', 'email', 'mobileNumber', 'department'],
    optionalFields: [],
    permissions: ['department_access', 'teacher_management', 'student_management', 'reports']
  },
  teacher: {
    label: 'Teacher',
    icon: 'fas fa-chalkboard-teacher',
    color: 'purple',
    description: 'Teacher login',
    requiredFields: ['name', 'email', 'mobileNumber'],
    optionalFields: [],
    permissions: ['class_access', 'student_management', 'grading']
  },
  parent: {
    label: 'Parent/Student',
    icon: 'fas fa-users',
    color: 'orange',
    description: 'Parent or student login',
    requiredFields: ['name', 'email', 'mobileNumber'],
    optionalFields: [],
    permissions: ['student_view', 'grades_view', 'communication']
  }
};

// Department options
export const departments = [
  'Mathematics', 'Science', 'English', 'Social Studies', 'Physical Education',
  'Computer Science', 'Art', 'Music', 'Languages', 'Commerce', 'Biology',
  'Chemistry', 'Physics', 'History', 'Geography', 'Economics', 'Business Studies'
];

export default schoolLoginApi;

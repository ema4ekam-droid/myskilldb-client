import React, { useState, useEffect } from 'react';
import Pagination from '../../shared/Pagination';

const EmailCredentialsModal = ({
  isOpen,
  onClose,
  onSubmit,
  schoolId,
  userType,
  userIds,
  schools,
  isLoading,
  btnTealClass,
  btnSlateClass
}) => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [emailOptions, setEmailOptions] = useState({
    includePassword: true,
    includeLoginInstructions: true,
    customMessage: ''
  });
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  const userTypeConfig = {
    principal: { label: 'Principal', icon: 'fas fa-user-tie', color: 'blue' },
    hod: { label: 'Head of Department', icon: 'fas fa-user-graduate', color: 'green' },
    teacher: { label: 'Teacher', icon: 'fas fa-chalkboard-teacher', color: 'purple' },
    parent: { label: 'Parent/Student', icon: 'fas fa-users', color: 'orange' }
  };

  const config = userTypeConfig[userType] || {};

  useEffect(() => {
    if (isOpen && schoolId && userType) {
      fetchUsers();
      setSelectedUserIds(userIds || []);
    }
  }, [isOpen, schoolId, userType, userIds]);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      
      // Mock users data with credentials status
      const mockUsersByType = {
        principal: [
          { _id: '1', name: 'Dr. Rajesh Kumar', email: 'principal@school.com', mobileNumber: '+91-9876543210', hasCredentials: true }
        ],
        hod: [
          { _id: '2', name: 'Prof. Sarah Wilson', email: 'hod.math@school.com', mobileNumber: '+91-9876543211', hasCredentials: true },
          { _id: '3', name: 'Dr. Michael Chen', email: 'hod.science@school.com', mobileNumber: '+91-9876543212', hasCredentials: true },
          { _id: '4', name: 'Ms. Priya Sharma', email: 'hod.english@school.com', mobileNumber: '+91-9876543213', hasCredentials: false }
        ],
        teacher: [
          { _id: '5', name: 'Mr. Amit Singh', email: 'amit.singh@school.com', mobileNumber: '+91-9876543214', hasCredentials: true },
          { _id: '6', name: 'Ms. Lisa Johnson', email: 'lisa.johnson@school.com', mobileNumber: '+91-9876543215', hasCredentials: true },
          { _id: '7', name: 'Mr. David Brown', email: 'david.brown@school.com', mobileNumber: '+91-9876543216', hasCredentials: true },
          { _id: '8', name: 'Ms. Anjali Patel', email: 'anjali.patel@school.com', mobileNumber: '+91-9876543217', hasCredentials: false },
          { _id: '9', name: 'Mr. Robert Taylor', email: 'robert.taylor@school.com', mobileNumber: '+91-9876543218', hasCredentials: true }
        ],
        parent: [
          { _id: '10', name: 'Mrs. Sunita Gupta', email: 'sunita.gupta@email.com', mobileNumber: '+91-9876543219', hasCredentials: true },
          { _id: '11', name: 'Mr. Vijay Kumar', email: 'vijay.kumar@email.com', mobileNumber: '+91-9876543220', hasCredentials: true },
          { _id: '12', name: 'Ms. Jennifer Lee', email: 'jennifer.lee@email.com', mobileNumber: '+91-9876543221', hasCredentials: false }
        ]
      };
      
      const mockUsers = mockUsersByType[userType] || [];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleClose = () => {
    setUsers([]);
    setSelectedUserIds([]);
    setEmailOptions({
      includePassword: true,
      includeLoginInstructions: true,
      customMessage: ''
    });
    onClose();
  };

  const toggleSelectAll = (checked) => {
    const availableUsers = users.filter(user => user.hasCredentials);
    setSelectedUserIds(checked ? availableUsers.map(user => user._id) : []);
  };

  const toggleSelectOne = (userId, checked) => {
    setSelectedUserIds(prev => 
      checked ? [...new Set([...prev, userId])] : prev.filter(id => id !== userId)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedUserIds.length === 0) {
      alert('Please select at least one user to email credentials to');
      return;
    }

    onSubmit(schoolId, userType, selectedUserIds);
  };

  const selectedSchool = schools.find(s => s._id === schoolId);
  const availableUsers = users.filter(user => user.hasCredentials);
  const allChecked = availableUsers.length > 0 && selectedUserIds.length === availableUsers.length;

  // Pagination calculations
  const totalPages = Math.ceil(availableUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = availableUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <i className={`fas fa-envelope text-indigo-500`}></i>
              Email Login Credentials
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Send login credentials to {config.label.toLowerCase()}s via email
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-slate-500"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* School Info */}
          {selectedSchool && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <i className="fas fa-school text-slate-500"></i>
                <div>
                  <h3 className="font-medium text-slate-900">{selectedSchool.name}</h3>
                  <p className="text-sm text-slate-500">
                    {selectedSchool.district}, {selectedSchool.state}, {selectedSchool.country}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Email Options */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-3">Email Options</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailOptions.includePassword}
                  onChange={(e) => setEmailOptions(prev => ({ ...prev, includePassword: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-blue-800">Include generated password in email</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailOptions.includeLoginInstructions}
                  onChange={(e) => setEmailOptions(prev => ({ ...prev, includeLoginInstructions: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-blue-800">Include login instructions and portal link</span>
              </label>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                value={emailOptions.customMessage}
                onChange={(e) => setEmailOptions(prev => ({ ...prev, customMessage: e.target.value }))}
                placeholder="Add a custom message to include in the email..."
                className="w-full p-3 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                rows="3"
              />
            </div>
          </div>

          {/* Users List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-900">
                Select {config.label}s to Email ({availableUsers.length} with credentials)
              </h3>
              {availableUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={allChecked}
                    onChange={e => toggleSelectAll(e.target.checked)}
                  />
                  <span className="text-sm text-slate-600">Select All</span>
                </div>
              )}
            </div>

            {isLoadingUsers ? (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-2xl text-slate-400"></i>
                <p className="text-slate-500 mt-2">Loading users...</p>
              </div>
            ) : users.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-3 w-12">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          checked={allChecked}
                          onChange={e => toggleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th className="p-3 text-left font-medium text-slate-700">Name</th>
                      <th className="p-3 text-left font-medium text-slate-700">Email</th>
                      <th className="p-3 text-left font-medium text-slate-700">Mobile</th>
                      <th className="p-3 text-center font-medium text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedUsers.map(user => (
                      <tr key={user._id} className={`hover:bg-slate-50 ${!user.hasCredentials ? 'opacity-50' : ''}`}>
                        <td className="p-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedUserIds.includes(user._id)}
                            onChange={e => toggleSelectOne(user._id, e.target.checked)}
                            disabled={!user.hasCredentials}
                          />
                        </td>
                        <td className="p-3 font-medium text-slate-900">{user.name}</td>
                        <td className="p-3 text-slate-600">{user.email}</td>
                        <td className="p-3 text-slate-600">{user.mobileNumber || 'Not provided'}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            user.hasCredentials 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <i className={`fas ${user.hasCredentials ? 'fa-check' : 'fa-times'} text-xs`}></i>
                            {user.hasCredentials ? 'Has Credentials' : 'No Credentials'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination */}
                {availableUsers.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={availableUsers.length}
                    itemsPerPage={itemsPerPage}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                <i className={`${config.icon} text-4xl text-slate-300`}></i>
                <p className="text-slate-500 mt-2">No {config.label.toLowerCase()}s found for this school</p>
              </div>
            )}
          </div>

          {/* Email Preview */}
          {selectedUserIds.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <i className="fas fa-eye text-green-500 mt-1"></i>
                <div>
                  <h4 className="font-medium text-green-900">Email Preview</h4>
                  <div className="text-sm text-green-800 mt-2 space-y-1">
                    <p><strong>Recipients:</strong> {selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''}</p>
                    <p><strong>Subject:</strong> Your MySkillDB Login Credentials</p>
                    <p><strong>Includes:</strong> {
                      [
                        emailOptions.includePassword && 'Password',
                        emailOptions.includeLoginInstructions && 'Login Instructions',
                        emailOptions.customMessage && 'Custom Message'
                      ].filter(Boolean).join(', ') || 'Basic information only'
                    }</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <i className="fas fa-exclamation-triangle text-amber-500 mt-1"></i>
              <div>
                <h4 className="font-medium text-amber-900">Important Note</h4>
                <p className="text-sm text-amber-800 mt-1">
                  Only users with existing login credentials can receive emails. Users without credentials need to be created first.
                </p>
              </div>
            </div>
          </div>

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
              onClick={handleSubmit}
              className={btnTealClass}
              disabled={isLoading || selectedUserIds.length === 0}
            >
              <i className="fas fa-envelope"></i>
              {isLoading ? 'Sending...' : `Send to ${selectedUserIds.length} User${selectedUserIds.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCredentialsModal;

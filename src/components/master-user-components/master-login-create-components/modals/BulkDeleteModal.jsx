import React, { useState, useEffect } from 'react';
import Pagination from '../../shared/Pagination';

const BulkDeleteModal = ({
  isOpen,
  onClose,
  onSubmit,
  schoolId,
  userType,
  schools,
  isLoading,
  btnRoseClass,
  btnSlateClass
}) => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
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
    }
  }, [isOpen, schoolId, userType]);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      
      // Mock users data based on user type
      const mockUsersByType = {
        principal: [
          { _id: '1', name: 'Dr. Rajesh Kumar', email: 'principal@school.com', mobileNumber: '+91-9876543210', department: 'Administration' }
        ],
        hod: [
          { _id: '2', name: 'Prof. Sarah Wilson', email: 'hod.math@school.com', mobileNumber: '+91-9876543211', department: 'Mathematics' },
          { _id: '3', name: 'Dr. Michael Chen', email: 'hod.science@school.com', mobileNumber: '+91-9876543212', department: 'Science' },
          { _id: '4', name: 'Ms. Priya Sharma', email: 'hod.english@school.com', mobileNumber: '+91-9876543213', department: 'English' }
        ],
        teacher: [
          { _id: '5', name: 'Mr. Amit Singh', email: 'amit.singh@school.com', mobileNumber: '+91-9876543214', department: 'Mathematics' },
          { _id: '6', name: 'Ms. Lisa Johnson', email: 'lisa.johnson@school.com', mobileNumber: '+91-9876543215', department: 'Science' },
          { _id: '7', name: 'Mr. David Brown', email: 'david.brown@school.com', mobileNumber: '+91-9876543216', department: 'English' },
          { _id: '8', name: 'Ms. Anjali Patel', email: 'anjali.patel@school.com', mobileNumber: '+91-9876543217', department: 'Social Studies' },
          { _id: '9', name: 'Mr. Robert Taylor', email: 'robert.taylor@school.com', mobileNumber: '+91-9876543218', department: 'Physical Education' }
        ],
        parent: [
          { _id: '10', name: 'Mrs. Sunita Gupta', email: 'sunita.gupta@email.com', mobileNumber: '+91-9876543219', department: 'Parent' },
          { _id: '11', name: 'Mr. Vijay Kumar', email: 'vijay.kumar@email.com', mobileNumber: '+91-9876543220', department: 'Parent' },
          { _id: '12', name: 'Ms. Jennifer Lee', email: 'jennifer.lee@email.com', mobileNumber: '+91-9876543221', department: 'Parent' }
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
    onClose();
  };

  const toggleSelectAll = (checked) => {
    setSelectedUserIds(checked ? users.map(user => user._id) : []);
  };

  const toggleSelectOne = (userId, checked) => {
    setSelectedUserIds(prev => 
      checked ? [...new Set([...prev, userId])] : prev.filter(id => id !== userId)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedUserIds.length === 0) {
      alert('Please select at least one user to delete');
      return;
    }

    onSubmit(schoolId, userType, selectedUserIds);
  };

  const selectedSchool = schools.find(s => s._id === schoolId);
  const allChecked = users.length > 0 && selectedUserIds.length === users.length;

  // Pagination calculations
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

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
              <i className={`fas fa-trash-alt text-rose-500`}></i>
              Bulk Delete {config.label}s
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select and delete multiple {config.label.toLowerCase()}s from the school
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

          {/* Warning */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <i className="fas fa-exclamation-triangle text-red-500 mt-1"></i>
              <div>
                <h4 className="font-medium text-red-900">Warning</h4>
                <p className="text-sm text-red-800 mt-1">
                  This action cannot be undone. Deleting users will permanently remove their accounts and all associated data.
                </p>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-900">
                Select {config.label}s to Delete ({users.length} total)
              </h3>
              {users.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
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
                          className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                          checked={allChecked}
                          onChange={e => toggleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th className="p-3 text-left font-medium text-slate-700">Name</th>
                      <th className="p-3 text-left font-medium text-slate-700">Email</th>
                      <th className="p-3 text-left font-medium text-slate-700">Mobile</th>
                      {userType === 'hod' && (
                        <th className="p-3 text-left font-medium text-slate-700">Department</th>
                      )}
                    </tr>
                  </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedUsers.map(user => (
                      <tr key={user._id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                            checked={selectedUserIds.includes(user._id)}
                            onChange={e => toggleSelectOne(user._id, e.target.checked)}
                          />
                        </td>
                        <td className="p-3 font-medium text-slate-900">{user.name}</td>
                        <td className="p-3 text-slate-600">{user.email}</td>
                        <td className="p-3 text-slate-600">{user.mobileNumber || 'Not provided'}</td>
                        {userType === 'hod' && (
                          <td className="p-3 text-slate-600">{user.department || 'Not specified'}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination */}
                {users.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={users.length}
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

          {/* Selection Summary */}
          {selectedUserIds.length > 0 && (
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
              <div className="flex items-center gap-3">
                <i className="fas fa-info-circle text-rose-500"></i>
                <div>
                  <p className="font-medium text-rose-900">
                    {selectedUserIds.length} {config.label.toLowerCase()}{selectedUserIds.length > 1 ? 's' : ''} selected for deletion
                  </p>
                  <p className="text-sm text-rose-800 mt-1">
                    This action will permanently delete the selected accounts and cannot be undone.
                  </p>
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
              onClick={handleSubmit}
              className={btnRoseClass}
              disabled={isLoading || selectedUserIds.length === 0}
            >
              <i className="fas fa-trash-alt"></i>
              {isLoading ? 'Deleting...' : `Delete ${selectedUserIds.length} User${selectedUserIds.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteModal;

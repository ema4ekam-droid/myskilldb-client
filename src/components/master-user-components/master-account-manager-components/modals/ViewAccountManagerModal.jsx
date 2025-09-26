import React from 'react';

const ViewAccountManagerModal = ({
  isOpen,
  onClose,
  accountManager,
  schools
}) => {
  const handleClose = () => {
    onClose();
  };

  const formatAdharCard = (adharNumber) => {
    if (!adharNumber) return 'Not provided';
    // Format as XXXX-XXXX-XXXX
    return adharNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssignedSchools = (schoolIds) => {
    if (!schoolIds || schoolIds.length === 0) return [];
    return schoolIds.map(schoolId => schools.find(s => s._id === schoolId)).filter(Boolean);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', class: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactive', class: 'bg-red-100 text-red-800' },
      pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${status === 'active' ? 'bg-green-500' : status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
        {config.label}
      </span>
    );
  };

  if (!isOpen || !accountManager) return null;

  const assignedSchools = getAssignedSchools(accountManager.assignedSchools);

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-indigo-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Account Manager Details</h2>
              <p className="text-sm text-slate-500">View complete information</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-slate-500"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-user-circle text-indigo-600"></i>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <p className="text-slate-900 font-medium">{accountManager.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <div className="mt-1">
                  {getStatusBadge(accountManager.status)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <p className="text-slate-900 flex items-center gap-2">
                  <i className="fas fa-envelope text-slate-400"></i>
                  {accountManager.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                <p className="text-slate-900 flex items-center gap-2">
                  <i className="fas fa-phone text-slate-400"></i>
                  {accountManager.mobileNumber}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Aadhar Card Number</label>
                <p className="text-slate-900 flex items-center gap-2">
                  <i className="fas fa-id-card text-slate-400"></i>
                  <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                    {formatAdharCard(accountManager.adharCardNumber)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* School Assignments */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-school text-indigo-600"></i>
              Assigned Schools ({assignedSchools.length})
            </h3>
            
            {assignedSchools.length > 0 ? (
              <div className="space-y-3">
                {assignedSchools.map((school, index) => (
                  <div key={school._id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{school.name}</h4>
                      <p className="text-sm text-slate-500">{school.district}, {school.state}</p>
                    </div>
                    <div className="text-slate-400">
                      <i className="fas fa-school"></i>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <i className="fas fa-school text-4xl text-slate-300 mb-2"></i>
                <p>No schools assigned to this account manager</p>
              </div>
            )}
          </div>

          {/* Activity Information */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-clock text-indigo-600"></i>
              Activity Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Created</label>
                <p className="text-slate-900 flex items-center gap-2">
                  <i className="fas fa-calendar-plus text-slate-400"></i>
                  {formatDate(accountManager.createdAt)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Login</label>
                <p className="text-slate-900 flex items-center gap-2">
                  <i className="fas fa-sign-in-alt text-slate-400"></i>
                  {formatDate(accountManager.lastLogin)}
                </p>
              </div>
            </div>
          </div>

          {/* Account Manager ID */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-fingerprint text-indigo-600"></i>
              System Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Manager ID</label>
              <p className="text-slate-900 font-mono bg-slate-100 px-2 py-1 rounded text-sm">
                {accountManager._id}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <i className="fas fa-times"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAccountManagerModal;

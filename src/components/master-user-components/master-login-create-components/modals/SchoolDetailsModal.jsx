import React from 'react';

const SchoolDetailsModal = ({
  isOpen,
  onClose,
  school,
  onOpenLoginForm,
  btnTealClass,
  btnSlateClass
}) => {
  if (!isOpen || !school) return null;

  // Login counts data
  const loginCounts = school.loginCounts || {
    principal: 0,
    hod: 0,
    teacher: 0,
    student: 0
  };

  // Statistics cards
  const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <i className={`${icon} text-${color}-500 text-lg`}></i>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{label}</div>
        </div>
      </div>
    </div>
  );

  // Login count pill
  const LoginCountPill = ({ count, label, color }) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
      color === 'blue' ? 'bg-blue-100 text-blue-800' :
      color === 'green' ? 'bg-green-100 text-green-800' :
      color === 'purple' ? 'bg-purple-100 text-purple-800' :
      'bg-orange-100 text-orange-800'
    }`}>
      <span className="w-2 h-2 rounded-full bg-current"></span>
      <span>{count} {label}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <i className="fas fa-school text-2xl text-indigo-600"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{school.name}</h2>
              <p className="text-slate-500">School Details & Statistics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-slate-500 text-lg"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* School Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <i className="fas fa-info-circle text-indigo-500"></i>
                Basic Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Admin Email</span>
                  <span className="font-medium text-slate-900">{school.adminEmail}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Phone</span>
                  <span className="font-medium text-slate-900">{school.phone || 'Not provided'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Established</span>
                  <span className="font-medium text-slate-900">{school.established || 'Not provided'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Address</span>
                  <span className="font-medium text-slate-900 text-right">{school.address}</span>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-rose-500"></i>
                Location
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">District</span>
                  <span className="font-medium text-slate-900">{school.district}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">State</span>
                  <span className="font-medium text-slate-900">{school.state}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Country</span>
                  <span className="font-medium text-slate-900">{school.country}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <i className="fas fa-chart-bar text-green-500"></i>
              School Statistics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon="fas fa-users"
                label="Total Students"
                value={school.totalStudents || 0}
                color="blue"
              />
              <StatCard
                icon="fas fa-chalkboard-teacher"
                label="Total Teachers"
                value={school.totalTeachers || 0}
                color="green"
              />
              <StatCard
                icon="fas fa-user-tie"
                label="Principal"
                value={loginCounts.principal}
                color="purple"
              />
              <StatCard
                icon="fas fa-user-graduate"
                label="HODs"
                value={loginCounts.hod}
                color="orange"
              />
            </div>
          </div>

          {/* Login Counts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <i className="fas fa-user-check text-purple-500"></i>
              Active Logins
            </h3>
            
            <div className="flex flex-wrap gap-3">
              <LoginCountPill 
                count={loginCounts.principal} 
                label="Principal" 
                color="blue" 
              />
              <LoginCountPill 
                count={loginCounts.hod} 
                label="HODs" 
                color="green" 
              />
              <LoginCountPill 
                count={loginCounts.teacher} 
                label="Teachers" 
                color="purple" 
              />
              <LoginCountPill 
                count={loginCounts.student} 
                label="Students" 
                color="orange" 
              />
            </div>
          </div>

          {/* Facilities */}
          {school.facilities && school.facilities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <i className="fas fa-building text-amber-500"></i>
                Facilities
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {school.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <i className="fas fa-bolt text-teal-500"></i>
              Quick Actions
            </h3>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  onOpenLoginForm(school._id, 'principal');
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <i className="fas fa-user-tie"></i>
                Add Principal
              </button>
              
              <button
                onClick={() => {
                  onOpenLoginForm(school._id, 'hod');
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <i className="fas fa-user-graduate"></i>
                Add HOD
              </button>
              
              <button
                onClick={() => {
                  onOpenLoginForm(school._id, 'teacher');
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <i className="fas fa-chalkboard-teacher"></i>
                Add Teacher
              </button>
              
              <button
                onClick={() => {
                  onOpenLoginForm(school._id, 'student');
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <i className="fas fa-user-graduate"></i>
                Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className={btnSlateClass}
          >
            <i className="fas fa-times"></i>
            Close
          </button>
          <button
            onClick={() => {
              onOpenLoginForm(school._id);
              onClose();
            }}
            className={btnTealClass}
          >
            <i className="fas fa-plus"></i>
            Create New Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetailsModal;
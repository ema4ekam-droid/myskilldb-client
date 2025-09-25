import React from 'react';
import Pagination from '../shared/Pagination';

const SchoolsTable = ({
  schools,
  isLoading,
  selectedSchoolIds,
  allChecked,
  onToggleSelectAll,
  onToggleSelectOne,
  onOpenLoginForm,
  onDownloadTemplate,
  onOpenBulkUpload,
  onOpenBulkDelete,
  onEmailCredentials,
  btnTealClass,
  btnIndigoClass,
  btnRoseClass,
  btnSlateClass,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage
}) => {
  const LoginCountPill = ({ count, label, color }) => (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
      color === 'blue' ? 'bg-blue-100 text-blue-800' :
      color === 'green' ? 'bg-green-100 text-green-800' :
      color === 'purple' ? 'bg-purple-100 text-purple-800' :
      'bg-orange-100 text-orange-800'
    }`}>
      <span className="w-2 h-2 rounded-full bg-current"></span>
      <span>{count} {label}</span>
    </div>
  );

  const ActionDropdown = ({ school }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const userTypes = [
      { key: 'principal', label: 'Principal', icon: 'fas fa-user-tie', color: 'blue' },
      { key: 'hod', label: 'HOD', icon: 'fas fa-user-graduate', color: 'green' },
      { key: 'teacher', label: 'Teacher', icon: 'fas fa-chalkboard-teacher', color: 'purple' },
      { key: 'parent', label: 'Parent/Student', icon: 'fas fa-users', color: 'orange' }
    ];

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <i className="fas fa-plus"></i>
          Create Login
          <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
            <div className="p-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-2 border-b border-slate-100">
                Create Individual Login
              </div>
              {userTypes.map((userType) => (
                <button
                  key={userType.key}
                  onClick={() => {
                    onOpenLoginForm(school._id, userType.key);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <i className={`${userType.icon} w-4 text-${userType.color}-500`}></i>
                  <span>Create {userType.label} Login</span>
                </button>
              ))}
              
              <div className="border-t border-slate-100 my-2"></div>
              
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-2">
                Bulk Operations
              </div>
              
              <button
                onClick={() => {
                  onOpenBulkUpload();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                <i className="fas fa-upload w-4 text-indigo-500"></i>
                <span>Bulk Upload</span>
              </button>
              
              <button
                onClick={() => {
                  onDownloadTemplate('all');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                <i className="fas fa-download w-4 text-green-500"></i>
                <span>Download Templates</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const UserTypeActions = ({ school, userType, count }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const userTypeConfig = {
      principal: { label: 'Principal', icon: 'fas fa-user-tie', color: 'blue' },
      hod: { label: 'HOD', icon: 'fas fa-user-graduate', color: 'green' },
      teacher: { label: 'Teacher', icon: 'fas fa-chalkboard-teacher', color: 'purple' },
      parent: { label: 'Parent/Student', icon: 'fas fa-users', color: 'orange' }
    };

    const config = userTypeConfig[userType];

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
        >
          <i className={`fas fa-ellipsis-v`}></i>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
            <div className="p-2">
              <button
                onClick={() => {
                  onOpenLoginForm(school._id, userType);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                <i className="fas fa-plus w-4 text-green-500"></i>
                <span>Create {config.label}</span>
              </button>
              
              <button
                onClick={() => {
                  onDownloadTemplate(userType);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                <i className="fas fa-download w-4 text-blue-500"></i>
                <span>Download Template</span>
              </button>
              
              {count > 0 && (
                <>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      onOpenBulkDelete(school._id, userType);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <i className="fas fa-trash w-4 text-rose-500"></i>
                    <span>Bulk Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Schools & Login Management</h2>
          <div className="flex items-center gap-3">
            {selectedSchoolIds.length > 0 && (
              <button
                onClick={() => {
                  // Handle bulk operations for selected schools
                  console.log('Bulk operations for selected schools:', selectedSchoolIds);
                }}
                className={btnRoseClass}
                disabled={isLoading}
              >
                <i className="fas fa-trash-alt"></i>
                Bulk Delete ({selectedSchoolIds.length})
              </button>
            )}
            <button
              onClick={onOpenBulkUpload}
              className={btnTealClass}
            >
              <i className="fas fa-upload"></i>
              Bulk Upload
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={allChecked}
                  onChange={e => onToggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-4 text-left font-semibold">School Name</th>
              <th className="p-4 text-left font-semibold">Location</th>
              <th className="p-4 text-center font-semibold">Login Counts</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {schools.length > 0 ? schools.map(school => (
              <tr key={school._id} className="hover:bg-slate-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={selectedSchoolIds.includes(school._id)}
                    onChange={e => onToggleSelectOne(school._id, e.target.checked)}
                  />
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-semibold text-slate-900">{school.name}</div>
                    <div className="text-xs text-slate-500">{school.adminEmail}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-600">
                    <div>{school.district}, {school.state}</div>
                    <div className="text-xs text-slate-500">{school.country}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <LoginCountPill 
                      count={school.loginCounts?.principal || 0} 
                      label="Principal" 
                      color="blue" 
                    />
                    <LoginCountPill 
                      count={school.loginCounts?.hod || 0} 
                      label="HOD" 
                      color="green" 
                    />
                    <LoginCountPill 
                      count={school.loginCounts?.teacher || 0} 
                      label="Teacher" 
                      color="purple" 
                    />
                    <LoginCountPill 
                      count={school.loginCounts?.parent || 0} 
                      label="Parent" 
                      color="orange" 
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <ActionDropdown school={school} />
                    
                    {/* Individual user type actions */}
                    <div className="flex gap-1">
                      <UserTypeActions 
                        school={school} 
                        userType="principal" 
                        count={school.loginCounts?.principal || 0} 
                      />
                      <UserTypeActions 
                        school={school} 
                        userType="hod" 
                        count={school.loginCounts?.hod || 0} 
                      />
                      <UserTypeActions 
                        school={school} 
                        userType="teacher" 
                        count={school.loginCounts?.teacher || 0} 
                      />
                      <UserTypeActions 
                        school={school} 
                        userType="parent" 
                        count={school.loginCounts?.parent || 0} 
                      />
                    </div>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center p-8 text-slate-500">
                  {isLoading ? 'Loading schools...' : 'No schools found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={schools.length}
        itemsPerPage={itemsPerPage}
      />
    </section>
  );
};

export default SchoolsTable;

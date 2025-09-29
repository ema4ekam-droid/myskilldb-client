import React from 'react';

const SchoolsTable = ({
  schools,
  isLoading,
  selectedSchoolIds,
  allChecked,
  onToggleSelectAll,
  onToggleSelectOne,
  onOpenLoginForm,
  onOpenSchoolDetails,
  btnTealClass
}) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Schools & Login Management</h2>
          <div className="flex items-center gap-3">
            {selectedSchoolIds.length > 0 && (
              <button
                onClick={() => {
                  console.log('Bulk operations for selected schools:', selectedSchoolIds);
                }}
                className={`${btnTealClass} bg-rose-500 hover:bg-rose-600`}
                disabled={isLoading}
              >
                <i className="fas fa-trash-alt"></i>
                Bulk Delete ({selectedSchoolIds.length})
              </button>
            )}
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
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onOpenLoginForm(school._id)}
                      className={btnTealClass}
                    >
                      <i className="fas fa-plus"></i>
                      Create Login
                    </button>
                    <button
                      onClick={() => onOpenSchoolDetails(school)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <i className="fas fa-eye"></i>
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center p-8 text-slate-500">
                  {isLoading ? 'Loading schools...' : 'No schools found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SchoolsTable;
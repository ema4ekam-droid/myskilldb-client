import React from 'react';

const SchoolsTable = ({ 
  filteredSchools, 
  schoolSetupStatus, 
  onEditSchool, 
  onAddSchool 
}) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Schools</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 text-left font-semibold">School Name</th>
              <th className="p-3 text-left font-semibold">Location</th>
              <th className="p-3 text-center font-semibold">Setup Status</th>
              <th className="p-3 text-center font-semibold">Progress</th>
              <th className="p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.length > 0 ? filteredSchools.map((school) => {
              const status = schoolSetupStatus[school.id];
              return (
                <tr key={school.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-900">{school.name}</td>
                  <td className="p-3 text-slate-600">
                    {school.districtName}, {school.stateName}, {school.countryName}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      status?.isSetupComplete 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      <i className={`fas fa-${status?.isSetupComplete ? 'check' : 'clock'} mr-1`}></i>
                      {status?.isSetupComplete ? 'Complete' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-xs text-slate-600">
                      <div>Depts: {status?.departments || 0}</div>
                      <div>Classes: {status?.classes || 0}</div>
                      <div>Sections: {status?.sections || 0}</div>
                      <div>Subjects: {status?.subjects || 0}</div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      {status?.isSetupComplete ? (
                        <button 
                          onClick={() => onEditSchool(school)}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-1 rounded text-xs transition-colors"
                        >
                          <i className="fas fa-edit mr-1"></i>Edit
                        </button>
                      ) : (
                        <button 
                          onClick={() => onAddSchool(school)}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded text-xs transition-colors"
                        >
                          <i className="fas fa-plus mr-1"></i>Setup
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-500">
                  No schools found for the selected filter
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

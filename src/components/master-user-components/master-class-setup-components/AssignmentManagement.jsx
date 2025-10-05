const AssignmentManagement = ({
  departments,
  classes,
  sections,
  loadingEntities,
  assignmentFilters,
  appliedFilters,
  groupedAssignments,
  expandedDepartments,
  onAddAssignment,
  onApplyFilters,
  onClearFilters,
  onFilterChange,
  onToggleDepartment,
  onDeleteAssignment,
  getSelectedOrganizationInfo,
  inputBaseClass
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Section-Class Assignments</h2>
          <p className="text-slate-500 text-sm">Assign sections to classes under specific departments for {getSelectedOrganizationInfo()?.name}</p>
        </div>
        <button
          onClick={onAddAssignment}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          disabled={loadingEntities.assignments}
        >
          <i className="fas fa-plus"></i>
          Add Assignment
        </button>
      </div>

      {/* Assignment Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Department</label>
          <select
            value={assignmentFilters.departmentId}
            onChange={(e) => onFilterChange(prev => ({ ...prev, departmentId: e.target.value }))}
            className={inputBaseClass}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Class</label>
          <select
            value={assignmentFilters.classId}
            onChange={(e) => onFilterChange(prev => ({ ...prev, classId: e.target.value }))}
            className={inputBaseClass}
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onApplyFilters}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 w-full"
            disabled={loadingEntities.assignments}
          >
            <i className="fas fa-filter"></i>
            Apply Filters
          </button>
        </div>

        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 w-full"
            disabled={loadingEntities.assignments}
          >
            <i className="fas fa-times"></i>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Active filters indicator */}
      {(appliedFilters.departmentId || appliedFilters.classId) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-filter text-blue-600"></i>
            <span className="font-medium text-blue-900">Active Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {appliedFilters.departmentId && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Department: {departments.find(d => d._id === appliedFilters.departmentId)?.name}
              </span>
            )}
            {appliedFilters.classId && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Class: {classes.find(c => c._id === appliedFilters.classId)?.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading state for assignments */}
      {loadingEntities.assignments ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600">Loading assignments...</span>
        </div>
      ) : (
        /* Hierarchical Assignments View */
        <div className="space-y-4">
          {Object.keys(groupedAssignments).length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <i className="fas fa-inbox text-4xl mb-4"></i>
              <p>No assignments found. Create your first assignment or adjust your filters to see results.</p>
            </div>
          ) : (
            Object.entries(groupedAssignments).map(([deptId, deptData]) => (
              <div key={deptId} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                {/* Department Header */}
                <div 
                  className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => onToggleDepartment(deptId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <i className={`fas fa-chevron-${expandedDepartments[deptId] ? 'down' : 'right'} text-blue-600 transition-transform`}></i>
                      <h3 className="text-lg font-semibold text-blue-900">{deptData.name}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                        {Object.keys(deptData.classes).length} classes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Classes and Sections - Collapsible */}
                {expandedDepartments[deptId] && (
                  <div className="divide-y divide-slate-100">
                    {Object.entries(deptData.classes).map(([classId, classData]) => (
                      <div key={classId} className="p-4 bg-slate-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <i className="fas fa-graduation-cap text-green-600"></i>
                            <h4 className="font-semibold text-slate-900">{classData.name}</h4>
                            <span className="text-sm text-slate-600 bg-slate-200 px-2 py-1 rounded-full">
                              {classData.sections.length} sections
                            </span>
                          </div>
                        </div>

                        {/* Sections Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {classData.sections.map((section) => (
                            <div key={section.id} className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <i className="fas fa-layer-group text-purple-500"></i>
                                <span className="font-medium text-slate-700">{section.name}</span>
                              </div>
                              <button
                                onClick={() => onDeleteAssignment(section.assignmentData)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="Delete assignment"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;
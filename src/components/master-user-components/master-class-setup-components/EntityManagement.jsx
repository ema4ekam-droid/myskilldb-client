const EntityManagement = ({
  departments,
  classes,
  sections,
  subjects,
  loadingEntities,
  onAddDepartment,
  onAddClass,
  onAddSection,
  onAddSubject,
  onViewEntity,
  onEditEntity,
  getSelectedOrganizationInfo
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Entity Management</h2>
          <p className="text-slate-500 text-sm">Manage departments, classes, sections, and subjects for {getSelectedOrganizationInfo()?.name}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          <span className="text-blue-800 text-sm font-medium">
            Organization: {getSelectedOrganizationInfo()?.name}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Departments Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-900">Departments</h3>
            <i className="fas fa-building text-blue-600"></i>
          </div>
          <p className="text-blue-700 text-sm mb-3">
            {loadingEntities.departments ? 'Loading...' : `${departments.length} departments`}
          </p>
          <div className="space-y-2">
            <button
              onClick={onAddDepartment}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              disabled={loadingEntities.departments}
            >
              Add Department
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => onViewEntity('department', departments)}
                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="View all departments"
              >
                <i className="fas fa-eye"></i>
              </button>
              <button
                onClick={() => onEditEntity('department', departments)}
                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="Edit departments"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={onAddDepartment}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="Add new department"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Classes Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-green-900">Classes</h3>
            <i className="fas fa-graduation-cap text-green-600"></i>
          </div>
          <p className="text-green-700 text-sm mb-3">
            {loadingEntities.classes ? 'Loading...' : `${classes.length} classes`}
          </p>
          <div className="space-y-2">
            <button
              onClick={onAddClass}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              disabled={loadingEntities.classes}
            >
              Add Class
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => onViewEntity('class', classes)}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="View all classes"
              >
                <i className="fas fa-eye"></i>
              </button>
              <button
                onClick={() => onEditEntity('class', classes)}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="Edit classes"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={onAddClass}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="Add new class"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Sections Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-purple-900">Sections</h3>
            <i className="fas fa-layer-group text-purple-600"></i>
          </div>
          <p className="text-purple-700 text-sm mb-3">
            {loadingEntities.sections ? 'Loading...' : `${sections.length} sections`}
          </p>
          <div className="space-y-2">
            <button
              onClick={onAddSection}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              disabled={loadingEntities.sections}
            >
              Add Section
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => onViewEntity('section', sections)}
                className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="View all sections"
              >
                <i className="fas fa-eye"></i>
              </button>
              <button
                onClick={() => onEditEntity('section', sections)}
                className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="Edit sections"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={onAddSection}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="Add new section"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Subjects Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-orange-900">Subjects</h3>
            <i className="fas fa-book text-orange-600"></i>
          </div>
          <p className="text-orange-700 text-sm mb-3">
            {loadingEntities.subjects ? 'Loading...' : `${subjects.length} subjects`}
          </p>
          <div className="space-y-2">
            <button
              onClick={onAddSubject}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              disabled={loadingEntities.subjects}
            >
              Add Subject
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => onViewEntity('subject', subjects)}
                className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="View all subjects"
              >
                <i className="fas fa-eye"></i>
              </button>
              <button
                onClick={() => onEditEntity('subject', subjects)}
                className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="Edit subjects"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={onAddSubject}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                title="Add new subject"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityManagement;
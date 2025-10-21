  const QuickEditSection = ({
    departments,
    classes,
    sections,
    subjects,
    selectedDepartmentEdit,
    selectedClassEdit,
    selectedSectionEdit,
    selectedSubjectEdit,
    setSelectedDepartmentEdit,
    setSelectedClassEdit,
    setSelectedSectionEdit,
    setSelectedSubjectEdit,
    onQuickEditDepartment,
    onQuickEditClass,
    onQuickEditSection,
    onQuickEditSubject,
    inputBaseClass
  }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Quick Edit</h2>
          <p className="text-slate-500 text-sm">Select any entity below to edit its details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Department Quick Edit */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-700">View/Edit Department</h3>
            <select
              value={selectedDepartmentEdit}
              onChange={(e) => setSelectedDepartmentEdit(e.target.value)}
              className={`${inputBaseClass}`}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Class Quick Edit */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-700">View/Edit Class</h3>
            <select
              value={selectedClassEdit}
              onChange={(e) => setSelectedClassEdit(e.target.value)}
              className={`${inputBaseClass}`}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
          </div>

          {/* Section Quick Edit */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-700">View/Edit Section</h3>
            <select
              value={selectedSectionEdit}
              onChange={(e) => setSelectedSectionEdit(e.target.value)}
              className={`${inputBaseClass}`}
            >
              <option value="">Select Section</option>
              {sections.map(sec => (
                <option key={sec._id} value={sec._id}>{sec.name}</option>
              ))}
            </select>
          </div>

          {/* Subject Quick Edit */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-700">View/Edit Subject</h3>
            <select
              value={selectedSubjectEdit}
              onChange={(e) => setSelectedSubjectEdit(e.target.value)}
              className={`${inputBaseClass}`}
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Edit Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onQuickEditDepartment}
            disabled={!selectedDepartmentEdit}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Edit Department
          </button>
          <button
            onClick={onQuickEditClass}
            disabled={!selectedClassEdit}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Edit Class
          </button>
          <button
            onClick={onQuickEditSection}
            disabled={!selectedSectionEdit}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Edit Section
          </button>
          <button
            onClick={onQuickEditSubject}
            disabled={!selectedSubjectEdit}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Edit Subject
          </button>
        </div>
      </div>
    );
  };

  export default QuickEditSection;
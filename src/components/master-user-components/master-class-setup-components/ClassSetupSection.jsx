import React from 'react';

const ClassSetupSection = ({ 
  selectedSchoolForSetup, 
  onCloseSetup,
  departments,
  classes,
  sections,
  subjects,
  selectedDepartment,
  selectedClass,
  filteredClasses,
  filteredSections,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  onDownloadTemplate,
  onCsvUpload,
  isUploading,
  onDepartmentFilter,
  onClassFilter,
  inputBaseClass
}) => {
  if (!selectedSchoolForSetup) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
        <div className="text-slate-400 mb-4">
          <i className="fas fa-school text-4xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Select a School to Setup</h3>
        <p className="text-slate-500">Choose a school from the table above to manage its class setup.</p>
      </div>
    );
  }

  return (
    <>
      {/* School Setup Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <i className="fas fa-school text-blue-500 mr-2"></i>
          <span className="text-blue-800 font-medium">
            Setting up class structure for: {selectedSchoolForSetup.name}
          </span>
          <button 
            onClick={onCloseSetup}
            className="ml-auto text-blue-600 hover:text-blue-800"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* First Row - Departments and Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Departments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Departments</h3>
              <button
                onClick={onAddDepartment}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>Add Department
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3 text-left font-semibold">Department Name</th>
                  <th className="p-3 text-left font-semibold">Description</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? departments.map((department) => (
                  <tr key={department.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{department.name}</td>
                    <td className="p-3 text-slate-600">{department.description}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => onEditDepartment(department)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDeleteDepartment(department)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="text-center p-6 text-slate-500">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Classes Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Classes</h3>
              <button
                onClick={onAddClass}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>Add Class
              </button>
            </div>
            <div className="mt-3">
              <select
                className={inputBaseClass}
                value={selectedDepartment}
                onChange={(e) => onDepartmentFilter(e.target.value)}
              >
                <option value="">Filter by Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3 text-left font-semibold">Class Name</th>
                  <th className="p-3 text-left font-semibold">Description</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.length > 0 ? filteredClasses.map((classItem) => (
                  <tr key={classItem.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{classItem.name}</td>
                    <td className="p-3 text-slate-600">{classItem.description}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => onEditClass(classItem)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDeleteClass(classItem)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="text-center p-6 text-slate-500">
                      No classes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Second Row - Sections and Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sections Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Sections</h3>
              <button
                onClick={onAddSection}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>Add Section
              </button>
            </div>
            <div className="mt-3">
              <select
                className={inputBaseClass}
                value={selectedClass}
                onChange={(e) => onClassFilter(e.target.value)}
              >
                <option value="">Filter by Class</option>
                {filteredClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3 text-left font-semibold">Section Name</th>
                  <th className="p-3 text-left font-semibold">Class</th>
                  <th className="p-3 text-left font-semibold">Description</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSections.length > 0 ? filteredSections.map((section) => (
                  <tr key={section.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{section.name}</td>
                    <td className="p-3 text-slate-600">{section.className}</td>
                    <td className="p-3 text-slate-600">{section.description}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => onEditSection(section)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDeleteSection(section)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-slate-500">
                      No sections found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Subjects</h3>
              <div className="flex gap-2">
                <button
                  onClick={onDownloadTemplate}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <i className="fas fa-download mr-2"></i>Download Template
                </button>
                <label className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                  <i className="fas fa-upload mr-2"></i>Upload CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={onCsvUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <button
                  onClick={onAddSubject}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>Add Subject
                </button>
              </div>
            </div>
            {isUploading && (
              <div className="mt-2 text-sm text-blue-600">
                <i className="fas fa-spinner fa-spin mr-2"></i>Processing CSV file...
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3 text-left font-semibold">Subject Name</th>
                  <th className="p-3 text-left font-semibold">Code</th>
                  <th className="p-3 text-left font-semibold">Department</th>
                  <th className="p-3 text-left font-semibold">Credits</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? subjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{subject.name}</td>
                    <td className="p-3 text-slate-600">{subject.code}</td>
                    <td className="p-3 text-slate-600">{subject.departmentName}</td>
                    <td className="p-3 text-slate-600">{subject.credits}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => onEditSubject(subject)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDeleteSubject(subject)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-slate-500">
                      No subjects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassSetupSection;

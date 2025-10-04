import React from 'react';

const SubjectAssignment = ({ 
  subjects, 
  selectedSubjects, 
  onSubjectToggle, 
  isClassTeacher,
  onClassTeacherToggle,
  disabled = false,
  className = ""
}) => {
  const handleSubjectToggle = (subjectId) => {
    if (disabled) return;
    onSubjectToggle(subjectId);
  };

  const handleClassTeacherToggle = () => {
    if (disabled) return;
    onClassTeacherToggle();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Class Teacher Toggle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">Class Teacher Assignment</h4>
            <p className="text-sm text-blue-700">
              Assign this teacher as the class teacher for the selected class and section
            </p>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isClassTeacher}
              onChange={handleClassTeacherToggle}
              disabled={disabled}
              className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
            />
            <span className="ml-2 text-sm font-medium text-blue-900">
              Set as Class Teacher
            </span>
          </label>
        </div>
      </div>

      {/* Subject Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Assign Subjects to Teacher
        </label>
        <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-md p-3 space-y-2">
          {subjects.length === 0 ? (
            <div className="text-center py-4 text-slate-500">
              <i className="fas fa-book text-2xl mb-2 text-slate-300"></i>
              <p className="text-sm">No subjects available for this department</p>
            </div>
          ) : (
            subjects.map(subject => (
              <label key={subject._id} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject._id)}
                  onChange={() => handleSubjectToggle(subject._id)}
                  disabled={disabled}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 font-medium">{subject.name}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {subject.code}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      subject.type === 'core' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {subject.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{subject.description}</p>
                </div>
              </label>
            ))
          )}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{selectedSubjects.length} subject(s) selected</span>
          {isClassTeacher && (
            <span className="text-blue-600 font-medium">
              <i className="fas fa-crown mr-1"></i>
              Class Teacher Assignment
            </span>
          )}
        </div>
      </div>

      {/* Assignment Summary */}
      {selectedSubjects.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h5 className="font-medium text-slate-900 mb-2">Assignment Summary</h5>
          <div className="space-y-1">
            {selectedSubjects.map(subjectId => {
              const subject = subjects.find(s => s._id === subjectId);
              return subject ? (
                <div key={subjectId} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{subject.name} ({subject.code})</span>
                  <span className="text-slate-500">{subject.credits} credits</span>
                </div>
              ) : null;
            })}
          </div>
          {isClassTeacher && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2 text-blue-700">
                <i className="fas fa-crown text-sm"></i>
                <span className="text-sm font-medium">This teacher will also serve as the class teacher</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectAssignment;

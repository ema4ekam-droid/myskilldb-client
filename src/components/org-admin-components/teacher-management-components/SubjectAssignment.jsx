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
      {/* Subject Selection - More Prominent */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-medium text-slate-900">Select Subjects to Teach</h4>
            <p className="text-sm text-slate-600">
              Choose which subjects this teacher will teach in the selected section
            </p>
          </div>
          <div className="text-xs text-slate-500">
            {selectedSubjects.length} of {subjects.length} selected
          </div>
        </div>
        
        <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-md bg-white">
          {subjects.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <i className="fas fa-book text-2xl mb-2 text-slate-300"></i>
              <p className="text-sm font-medium mb-1">No subjects available</p>
              <p className="text-xs">All subjects for this section are already assigned to teachers</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
              {subjects.map(subject => (
                <label key={subject._id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject._id)}
                    onChange={() => handleSubjectToggle(subject._id)}
                    disabled={disabled}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 font-medium text-sm truncate">{subject.name}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-nowrap">
                        {subject.code}
                      </span>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      subject.type === 'core' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {subject.type}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Class Teacher Toggle - Smaller and Less Prominent */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fas fa-crown text-yellow-500 text-sm"></i>
            <span className="text-sm font-medium text-slate-700">Class Teacher</span>
            <span className="text-xs text-slate-500">(Optional)</span>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isClassTeacher}
              onChange={handleClassTeacherToggle}
              disabled={disabled}
              className="w-4 h-4 text-yellow-600 border-slate-300 rounded focus:ring-yellow-500 disabled:cursor-not-allowed"
            />
            <span className="ml-2 text-sm text-slate-600">
              Assign as class teacher
            </span>
          </label>
        </div>
        {isClassTeacher && (
          <div className="mt-2 text-xs text-slate-500">
            <i className="fas fa-info-circle mr-1"></i>
            This teacher will be responsible for all subjects in this section
          </div>
        )}
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

import React from 'react';

const TeacherSelector = ({ 
  teachers, 
  selectedTeacher, 
  onTeacherChange, 
  selectedDepartment,
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-slate-700">
        Select Teacher
      </label>
      <select
        value={selectedTeacher}
        onChange={(e) => onTeacherChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed"
      >
        <option value="">Choose a teacher</option>
        {teachers.map(teacher => (
          <option key={teacher._id} value={teacher._id}>
            {teacher.name}
          </option>
        ))}
      </select>
      {selectedTeacher && (
        <div className="text-xs text-slate-500">
          {(() => {
            const teacher = teachers.find(t => t._id === selectedTeacher);
            return teacher ? teacher.email : '';
          })()}
        </div>
      )}
    </div>
  );
};

export default TeacherSelector;

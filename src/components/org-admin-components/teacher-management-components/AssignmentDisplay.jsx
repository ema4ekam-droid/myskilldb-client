import React from 'react';

const AssignmentDisplay = ({ 
  assignments, 
  teachers, 
  departments, 
  classes, 
  sections, 
  subjects, 
  onEdit, 
  onDelete, 
  isLoading = false,
  sortBy = 'subjectsCount',
  className = ""
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Current Assignments</h2>
              <p className="text-slate-500 text-sm">Loading assignments...</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600">Loading assignments...</span>
          </div>
        </div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Current Assignments</h2>
              <p className="text-slate-500 text-sm">No assignments found for the selected filters</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-slate-500">
            <i className="fas fa-chalkboard-teacher text-4xl mb-4 text-slate-300"></i>
            <p className="font-medium mb-2">No teacher assignments found</p>
            <p className="text-sm">Create your first assignment or adjust your filters to see results.</p>
          </div>
        </div>
      </div>
    );
  }

  const getTeacherSubjectsCount = (assignment) => assignment.subjectIds?.length || 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Current Assignments</h2>
            <p className="text-slate-500 text-sm">
              {assignments.length} assignment{assignments.length !== 1 ? 's' : ''} found
              {sortBy === 'subjectsCount' && ' (sorted by subjects count)'}
              {sortBy === 'teacherName' && ' (sorted by teacher name)'}
              {sortBy === 'department' && ' (sorted by department)'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {assignments.map(assignment => {
            const teacher = teachers.find(t => t._id === assignment.teacherId);
            const department = departments.find(d => d._id === assignment.departmentId);
            const classItem = classes.find(c => c._id === assignment.classId);
            const section = sections.find(s => s._id === assignment.sectionId);
            const assignmentSubjects = subjects.filter(s => assignment.subjectIds?.includes(s._id));
            const subjectsCount = getTeacherSubjectsCount(assignment);

            return (
              <div key={assignment._id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <i className="fas fa-chalkboard-teacher text-indigo-600"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 text-lg">
                          {teacher?.name || 'Unknown Teacher'}
                        </h3>
                        {assignment.isClassTeacher && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            <i className="fas fa-crown text-xs"></i>
                            Class Teacher
                          </span>
                        )}
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {subjectsCount} Subject{subjectsCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="text-sm text-slate-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-building text-blue-500"></i>
                          <span>{department?.name || 'Unknown Department'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-graduation-cap text-green-500"></i>
                          <span>{classItem?.name || 'Unknown Class'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-layer-group text-purple-500"></i>
                          <span>{section?.name || 'Unknown Section'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(assignment)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Assignment"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => onDelete(assignment._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Assignment"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                {/* Teacher Details */}
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-slate-900 mb-2">Teacher Information</h4>
                  <div className="text-sm">
                    <div>
                      <span className="text-slate-500">Email:</span>
                      <span className="ml-2 text-slate-700">{teacher?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Subjects */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Assigned Subjects</h4>
                  {assignmentSubjects.length === 0 ? (
                    <div className="text-center py-4 text-slate-500 bg-slate-50 rounded-lg">
                      <i className="fas fa-book text-2xl mb-2 text-slate-300"></i>
                      <p className="text-sm">No subjects assigned yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {assignmentSubjects.map(subject => (
                        <div key={subject._id} className="bg-white border border-slate-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-slate-900 text-sm">{subject.name}</h5>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              {subject.code}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded ${
                              subject.type === 'core' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {subject.type}
                            </span>
                            <span className="text-xs text-slate-500">{subject.credits} credits</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDisplay;

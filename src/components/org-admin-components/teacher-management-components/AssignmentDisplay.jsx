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

  // Group assignments by teacher
  const groupedByTeacher = assignments.reduce((acc, assignment) => {
    const teacherId = assignment.teacherId;
    if (!acc[teacherId]) {
      acc[teacherId] = [];
    }
    acc[teacherId].push(assignment);
    return acc;
  }, {});

  // Get all unique subjects for a teacher across all assignments
  const getTeacherAllSubjects = (teacherAssignments) => {
    const allSubjectIds = teacherAssignments.flatMap(assignment => assignment.subjectIds || []);
    const uniqueSubjectIds = [...new Set(allSubjectIds)];
    return subjects.filter(subject => uniqueSubjectIds.includes(subject._id));
  };

  // Get teaching summary for a teacher
  const getTeachingSummary = (teacherAssignments) => {
    const summary = {};
    teacherAssignments.forEach(assignment => {
      const department = departments.find(d => d._id === assignment.departmentId);
      const classItem = classes.find(c => c._id === assignment.classId);
      const section = sections.find(s => s._id === assignment.sectionId);
      const key = `${department?.name} - ${classItem?.name} - ${section?.name}`;
      
      if (!summary[key]) {
        summary[key] = {
          department: department?.name,
          class: classItem?.name,
          section: section?.name,
          subjects: []
        };
      }
      
      const assignmentSubjects = subjects.filter(s => assignment.subjectIds?.includes(s._id));
      summary[key].subjects.push(...assignmentSubjects);
    });
    
    return summary;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Teacher Assignments</h2>
            <p className="text-slate-500 text-sm">
              {Object.keys(groupedByTeacher).length} teacher{Object.keys(groupedByTeacher).length !== 1 ? 's' : ''} with assignments
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(groupedByTeacher).map(([teacherId, teacherAssignments]) => {
            const teacher = teachers.find(t => t._id === teacherId);
            const allSubjects = getTeacherAllSubjects(teacherAssignments);
            const teachingSummary = getTeachingSummary(teacherAssignments);
            const totalSubjects = allSubjects.length;
            const isClassTeacher = teacherAssignments.some(assignment => assignment.isClassTeacher);

            return (
              <div key={teacherId} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                {/* Teacher Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-chalkboard-teacher text-indigo-600"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{teacher?.name || 'Unknown Teacher'}</h3>
                      <p className="text-xs text-slate-500">{teacher?.email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(teacherAssignments[0])}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Assignment"
                    >
                      <i className="fas fa-edit text-sm"></i>
                    </button>
                    <button
                      onClick={() => onDelete(teacherAssignments[0]._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Assignment"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </div>

                {/* Teacher Stats */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-book text-blue-500 text-xs"></i>
                    <span className="text-xs font-medium text-slate-700">{totalSubjects} subjects</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fas fa-graduation-cap text-green-500 text-xs"></i>
                    <span className="text-xs font-medium text-slate-700">{teacherAssignments.length} classes</span>
                  </div>
                  {isClassTeacher && (
                    <div className="flex items-center gap-1">
                      <i className="fas fa-crown text-yellow-500 text-xs"></i>
                      <span className="text-xs font-medium text-yellow-700">Class Teacher</span>
                    </div>
                  )}
                </div>

                {/* Teaching Summary */}
                <div className="space-y-2">
                  {Object.entries(teachingSummary).map(([key, summary]) => (
                    <div key={key} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-graduation-cap text-green-500 text-xs"></i>
                          <span className="text-sm font-medium text-slate-900">{summary.class}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-600">{summary.section}</span>
                        </div>
                        <span className="text-xs text-slate-500">{summary.department}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {summary.subjects.map((subject, index) => (
                          <span key={`${subject._id}-${index}`} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                            {subject.code}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
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

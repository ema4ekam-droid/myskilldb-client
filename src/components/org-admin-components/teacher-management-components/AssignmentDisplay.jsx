import React, { useState } from 'react';

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
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    assignmentId: null,
    teacherName: '',
    mathQuestion: { num1: 0, num2: 0, answer: 0 },
    userAnswer: ''
  });

  const toggleDepartment = (deptId) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [deptId]: !prev[deptId]
    }));
  };

  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 * num2 };
  };

  const openDeleteConfirmation = (assignment) => {
    const teacher = teachers.find(t => t._id === assignment.teacherId);
    const mathQuestion = generateMathQuestion();
    
    setDeleteConfirmation({
      isOpen: true,
      assignmentId: assignment._id,
      teacherName: teacher?.name || 'this teacher',
      mathQuestion,
      userAnswer: ''
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      assignmentId: null,
      teacherName: '',
      mathQuestion: { num1: 0, num2: 0, answer: 0 },
      userAnswer: ''
    });
  };

  const handleConfirmDelete = () => {
    if (parseInt(deleteConfirmation.userAnswer) === deleteConfirmation.mathQuestion.answer) {
      onDelete(deleteConfirmation.assignmentId);
      closeDeleteConfirmation();
    } else {
      alert('Incorrect answer. Please try again.');
      setDeleteConfirmation(prev => ({ ...prev, userAnswer: '' }));
    }
  };
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
        <div className="p-4 md:p-6">
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
        <div className="p-4 md:p-6">
          <div className="text-center py-8 text-slate-500">
            <i className="fas fa-chalkboard-teacher text-4xl mb-4 text-slate-300"></i>
            <p className="font-medium mb-2">No teacher assignments found</p>
            <p className="text-sm">Create your first assignment or adjust your filters to see results.</p>
          </div>
        </div>
      </div>
    );
  }

  // Group assignments hierarchically: Department → Class → Section → Subjects → Teachers
  const getHierarchicalData = () => {
    const hierarchy = {};
    
    assignments.forEach(assignment => {
      const deptId = assignment.departmentId;
      const classId = assignment.classId;
      const sectionId = assignment.sectionId;
      
      if (!hierarchy[deptId]) {
        hierarchy[deptId] = {};
      }
      if (!hierarchy[deptId][classId]) {
        hierarchy[deptId][classId] = {};
      }
      if (!hierarchy[deptId][classId][sectionId]) {
        hierarchy[deptId][classId][sectionId] = [];
      }
      
      hierarchy[deptId][classId][sectionId].push(assignment);
    });
    
    return hierarchy;
  };

  const hierarchicalData = getHierarchicalData();

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      <div className="p-4 md:p-6">
        {Object.keys(hierarchicalData).length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <i className="fas fa-chalkboard-teacher text-4xl mb-4 text-slate-300"></i>
            <p className="font-medium mb-2">No teacher assignments found</p>
            <p className="text-sm">Create your first assignment or adjust your filters to see results.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(hierarchicalData).map(([deptId, deptClasses]) => {
              const department = departments.find(d => d._id === deptId);
              const isExpanded = expandedDepartments[deptId];
              const totalClasses = Object.keys(deptClasses).length;
              
              // Get department-specific color and abbreviation
              const getDepartmentStyle = (deptName) => {
                const name = deptName?.toLowerCase() || '';
                if (name.includes('nursery')) {
                  return { letter: 'N', gradient: 'from-pink-500 to-pink-600', hoverGradient: 'from-pink-600 to-pink-700', border: 'border-pink-200' };
                } else if (name.includes('lower primary')) {
                  return { letter: 'L Pr', gradient: 'from-green-500 to-emerald-600', hoverGradient: 'from-green-600 to-emerald-700', border: 'border-green-200' };
                } else if (name.includes('upper primary')) {
                  return { letter: 'U Pr', gradient: 'from-blue-500 to-blue-600', hoverGradient: 'from-blue-600 to-blue-700', border: 'border-blue-200' };
                } else if (name.includes('high school')) {
                  return { letter: 'H Sc', gradient: 'from-indigo-500 to-indigo-600', hoverGradient: 'from-indigo-600 to-indigo-700', border: 'border-indigo-200' };
                } else if (name.includes('higher secondary')) {
                  return { letter: 'H Se', gradient: 'from-purple-500 to-purple-600', hoverGradient: 'from-purple-600 to-purple-700', border: 'border-purple-200' };
                }
                return { letter: 'D', gradient: 'from-slate-500 to-slate-600', hoverGradient: 'from-slate-600 to-slate-700', border: 'border-slate-200' };
              };

              const deptStyle = getDepartmentStyle(department?.name);
              
              return (
                <div key={deptId} className={`border-2 ${deptStyle.border} rounded-xl overflow-hidden`}>
                  {/* Department Header */}
                  <button
                    onClick={() => toggleDepartment(deptId)}
                    className={`w-full bg-gradient-to-r ${deptStyle.gradient} hover:${deptStyle.hoverGradient} px-6 py-4 transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center px-1">
                          <span className="text-black text-xs font-bold leading-tight">{deptStyle.letter}</span>
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-white">{department?.name || 'Unknown Department'}</h3>
                          <p className="text-xs text-white text-opacity-80">{totalClasses} class{totalClasses !== 1 ? 'es' : ''}</p>
                        </div>
                      </div>
                      <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-white text-lg transition-transform`}></i>
                    </div>
                  </button>

                  {/* Department Content */}
                  {isExpanded && (
                    <div className="bg-white p-3 md:p-4">
                      {Object.entries(deptClasses).map(([classId, classSections]) => {
                        const classItem = classes.find(c => c._id === classId);
                        
                        return (
                          <div key={classId} className="mb-3 last:mb-0 border border-slate-200 rounded-lg overflow-hidden">
                            {/* Grade Header */}
                            <div className="bg-slate-50 px-3 md:px-4 py-2 border-b border-slate-200">
                              <div className="flex items-center gap-2">
                                <i className="fas fa-graduation-cap text-green-600 text-sm"></i>
                                <span className="font-semibold text-slate-900 text-sm md:text-base">{classItem?.name}</span>
                              </div>
                            </div>
                            
                            {/* Sections List */}
                            <div className="divide-y divide-slate-100">
                              {Object.entries(classSections).map(([sectionId, sectionAssignments]) => {
                                const section = sections.find(s => s._id === sectionId);
                                
                                // Get all unique subjects taught by teachers in this section
                                const assignedSubjectIds = new Set();
                                sectionAssignments.forEach(assignment => {
                                  assignment.subjectIds?.forEach(subId => assignedSubjectIds.add(subId));
                                });
                                
                                // Get total subjects that could be taught
                                const totalSubjectsInDept = subjects.filter(s => s.departmentId === deptId).length;
                                const subjectsWithoutTeacher = Math.max(0, totalSubjectsInDept - assignedSubjectIds.size);
                                
                                // Get teachers with their details
                                const teachersInSection = sectionAssignments.map(assignment => {
                                  const teacher = teachers.find(t => t._id === assignment.teacherId);
                                  const teacherSubjects = subjects.filter(s => assignment.subjectIds?.includes(s._id));
                                  return {
                                    assignment,
                                    teacher,
                                    teacherSubjects
                                  };
                                });
                                
                                return (
                                  <div key={sectionId} className="p-2 md:p-3">
                                    {/* Section Name */}
                                    <div className="flex items-center gap-2 mb-3">
                                      <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-layer-group text-white text-xs"></i>
                                      </div>
                                      <span className="font-medium text-slate-900 text-sm">{section?.name}</span>
                                    </div>
                                    
                                    {/* Horizontal Scrollable Teacher Cards */}
                                    {teachersInSection.length > 0 && (
                                      <div className="mb-3">
                                        <div className="overflow-x-auto pb-2">
                                          <div className="flex gap-2 min-w-min">
                                            {teachersInSection.map(({ assignment, teacher, teacherSubjects }) => (
                                              <div 
                                                key={assignment._id} 
                                                className="flex-shrink-0 w-52 bg-indigo-50 border border-indigo-200 rounded-lg p-2.5"
                                              >
                                                {/* Teacher Info */}
                                                <div className="mb-2">
                                                  <div className="flex items-start justify-between mb-0.5">
                                                    <h4 className="font-semibold text-slate-900 text-xs truncate flex-1">
                                                      {teacher?.name || 'Unknown'}
                                                    </h4>
                                                    <button
                                                      onClick={() => onEdit(assignment)}
                                                      className="ml-1 p-0.5 text-blue-600 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
                                                      title="Edit teacher assignment"
                                                    >
                                                      <i className="fas fa-edit text-xs"></i>
                                                    </button>
                                                  </div>
                                                  <p className="text-xs text-slate-600 truncate">{teacher?.email || 'N/A'}</p>
                                                </div>
                                                
                                                {/* Subject Codes */}
                                                <div className="flex items-start gap-1">
                                                  <span className="text-xs text-slate-700 font-medium flex-shrink-0">Subjects:</span>
                                                  <div className="flex flex-wrap gap-1 flex-1">
                                                    {teacherSubjects.map(subject => (
                                                      <span 
                                                        key={subject._id}
                                                        className="text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded font-medium"
                                                        title={subject.name}
                                                      >
                                                        {subject.code}
                                                      </span>
                                                    ))}
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Subjects without teacher message */}
                                    {subjectsWithoutTeacher > 0 && (
                                      <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded px-3 py-2">
                                        <i className="fas fa-exclamation-circle"></i>
                                        <span className="font-medium">
                                          {subjectsWithoutTeacher} subject{subjectsWithoutTeacher !== 1 ? 's' : ''} of this class {subjectsWithoutTeacher !== 1 ? 'have' : 'has'} no teacher
                                        </span>
                                      </div>
                                    )}
                                    
                                    {teachersInSection.length === 0 && (
                                      <div className="text-center py-4 text-slate-500 text-sm">
                                        <i className="fas fa-user-slash mb-2"></i>
                                        <p>No teachers assigned to this section</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
                  <p className="text-slate-500 text-sm">This action cannot be undone</p>
                </div>
              </div>
              
              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-900">
                  You are about to delete the assignment for <span className="font-semibold">{deleteConfirmation.teacherName}</span>.
                </p>
              </div>

              {/* Math Question */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  To confirm, please solve this simple math problem:
                </label>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 mb-3">
                  <p className="text-center text-2xl font-bold text-slate-900">
                    {deleteConfirmation.mathQuestion.num1} × {deleteConfirmation.mathQuestion.num2} = ?
                  </p>
                </div>
                <input
                  type="number"
                  value={deleteConfirmation.userAnswer}
                  onChange={(e) => setDeleteConfirmation(prev => ({ ...prev, userAnswer: e.target.value }))}
                  placeholder="Enter your answer"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-center text-lg font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleConfirmDelete();
                    }
                  }}
                />
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteConfirmation}
                  className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-trash"></i>
                  Delete Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDisplay;

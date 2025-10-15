import React, { useState, useEffect } from 'react';
import TeacherSelector from './TeacherSelector';

const TeacherAssignmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  teachers,
  departments,
  classes,
  sections,
  subjects,
  subjectAssignments = [],
  teacherAssignments = [],
  editingAssignment,
  isLoading,
  inputBaseClass,
  btnIndigoClass,
  btnSlateClass
}) => {
  const [localFormData, setLocalFormData] = useState({
    teacherId: '',
    departmentId: '',
    classId: '',
    sectionId: '',
    subjectIds: [],
    isClassTeacher: false
  });

  // Update local form data when props change
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleInputChange = (field, value) => {
    const newFormData = { ...localFormData, [field]: value };
    
    // Reset dependent fields when parent changes
    if (field === 'departmentId') {
      newFormData.classId = '';
      newFormData.sectionId = '';
      newFormData.subjectIds = [];
    } else if (field === 'classId') {
      newFormData.sectionId = '';
    }
    
    setLocalFormData(newFormData);
    setFormData(newFormData);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!localFormData.teacherId || !localFormData.departmentId || 
        !localFormData.classId || !localFormData.sectionId) {
      return;
    }
    
    onSubmit(localFormData);
  };

  const filteredTeachers = teachers.filter(teacher => 
    !localFormData.departmentId || teacher.departmentId === localFormData.departmentId
  );

  const filteredSubjects = (() => {
    if (!localFormData.departmentId) return subjects;
    
    // If section is selected, show only subjects assigned to that section
    if (localFormData.sectionId) {
      // Get all subject assignments for the selected section
      const sectionSubjectAssignments = (subjectAssignments || []).filter(
        assignment => assignment.sectionIds.includes(localFormData.sectionId)
      );
      const assignedSubjectIds = sectionSubjectAssignments.map(assignment => assignment.subjectId);
      
      // EDIT MODE: Show ALL subjects in the section so teacher can be reassigned
      if (editingAssignment) {
        return subjects.filter(subject => 
          subject.departmentId === localFormData.departmentId && 
          assignedSubjectIds.includes(subject._id)
        );
      }
      
      // CREATE MODE: Only show subjects not yet assigned to any teacher
      const alreadyAssignedSubjects = (teacherAssignments || [])
        .filter(assignment => 
          assignment.sectionId === localFormData.sectionId &&
          assignment.departmentId === localFormData.departmentId &&
          assignment.classId === localFormData.classId
        )
        .flatMap(assignment => assignment.subjectIds || []);
      
      return subjects.filter(subject => 
        subject.departmentId === localFormData.departmentId && 
        assignedSubjectIds.includes(subject._id) &&
        !alreadyAssignedSubjects.includes(subject._id)
      );
    }
    
    // If only department is selected (create mode only)
    const alreadyAssignedSubjects = (teacherAssignments || [])
      .filter(assignment => 
        assignment.departmentId === localFormData.departmentId &&
        assignment.classId === localFormData.classId
      )
      .flatMap(assignment => assignment.subjectIds || []);
      
    return subjects.filter(subject => 
      subject.departmentId === localFormData.departmentId &&
      !alreadyAssignedSubjects.includes(subject._id)
    );
  })();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingAssignment ? 'Edit Teacher Assignment' : 'Assign Teacher to a Subject'}
              </h2>
              <p className="text-slate-500 text-sm">
                Follow the steps to assign a teacher to subjects in a specific class and section
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {editingAssignment ? (
              /* Teacher Assignment Summary Card for Editing */
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <i className="fas fa-user-graduate text-indigo-600 text-xl"></i>
                  <h3 className="text-lg font-bold text-slate-900">Teacher Assignment Summary</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-chalkboard-teacher text-blue-600"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Teacher</p>
                      <p className="font-semibold text-slate-900">
                        {teachers.find(t => t._id === localFormData.teacherId)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-building text-green-600"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Department</p>
                      <p className="font-semibold text-slate-900">
                        {departments.find(d => d._id === localFormData.departmentId)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-graduation-cap text-purple-600"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Class</p>
                      <p className="font-semibold text-slate-900">
                        {classes.find(c => c._id === localFormData.classId)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-layer-group text-orange-600"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Section</p>
                      <p className="font-semibold text-slate-900">
                        {sections.find(s => s._id === localFormData.sectionId)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Step Progress Indicator */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      localFormData.departmentId 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      1
                    </div>
                    <div className={`w-12 h-1 ${
                      localFormData.departmentId ? 'bg-green-500' : 'bg-slate-300'
                    }`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      localFormData.classId 
                        ? 'bg-green-500 text-white' 
                        : localFormData.departmentId 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-300 text-slate-500'
                    }`}>
                      2
                    </div>
                    <div className={`w-12 h-1 ${
                      localFormData.sectionId ? 'bg-green-500' : localFormData.classId ? 'bg-blue-500' : 'bg-slate-300'
                    }`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      localFormData.teacherId 
                        ? 'bg-green-500 text-white' 
                        : localFormData.sectionId 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-300 text-slate-500'
                    }`}>
                      3
                    </div>
                  </div>
                </div>

                {/* Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department Selection */}
              <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                !localFormData.departmentId 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    localFormData.departmentId ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    1
                  </div>
                  <label className="block text-sm font-medium text-slate-700">
                    Department *
                  </label>
                  {!localFormData.departmentId && (
                    <span className="text-xs text-blue-600 font-medium">← Start here</span>
                  )}
                </div>
                <select
                  value={localFormData.departmentId}
                  onChange={(e) => handleInputChange('departmentId', e.target.value)}
                  className={`w-full bg-white border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${
                    localFormData.departmentId ? 'border-green-300' : 'border-blue-300'
                  }`}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
                {localFormData.departmentId && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
                    <i className="fas fa-check"></i>
                    <span>Department selected</span>
                  </div>
                )}
              </div>

              {/* Class Selection */}
              <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                !localFormData.classId 
                  ? localFormData.departmentId 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-slate-200 bg-slate-50'
                  : 'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    localFormData.classId 
                      ? 'bg-green-500 text-white' 
                      : localFormData.departmentId 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-300 text-slate-500'
                  }`}>
                    2
                  </div>
                  <label className="block text-sm font-medium text-slate-700">
                    Class *
                  </label>
                  {localFormData.departmentId && !localFormData.classId && (
                    <span className="text-xs text-blue-600 font-medium">← Next step</span>
                  )}
                </div>
                <select
                  value={localFormData.classId}
                  onChange={(e) => handleInputChange('classId', e.target.value)}
                  className={`w-full bg-white border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${
                    localFormData.classId ? 'border-green-300' : localFormData.departmentId ? 'border-blue-300' : 'border-slate-300'
                  }`}
                  required
                  disabled={!localFormData.departmentId}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
                {localFormData.classId && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
                    <i className="fas fa-check"></i>
                    <span>Class selected</span>
                  </div>
                )}
              </div>

              {/* Section Selection */}
              <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                !localFormData.sectionId 
                  ? localFormData.classId 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-slate-200 bg-slate-50'
                  : 'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    localFormData.sectionId 
                      ? 'bg-green-500 text-white' 
                      : localFormData.classId 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-300 text-slate-500'
                  }`}>
                    3
                  </div>
                  <label className="block text-sm font-medium text-slate-700">
                    Section *
                  </label>
                  {localFormData.classId && !localFormData.sectionId && (
                    <span className="text-xs text-blue-600 font-medium">← Next step</span>
                  )}
                </div>
                <select
                  value={localFormData.sectionId}
                  onChange={(e) => handleInputChange('sectionId', e.target.value)}
                  className={`w-full bg-white border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${
                    localFormData.sectionId ? 'border-green-300' : localFormData.classId ? 'border-blue-300' : 'border-slate-300'
                  }`}
                  required
                  disabled={!localFormData.classId}
                >
                  <option value="">Select Section</option>
                  {sections.map(section => (
                    <option key={section._id} value={section._id}>{section.name}</option>
                  ))}
                </select>
                {localFormData.sectionId && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
                    <i className="fas fa-check"></i>
                    <span>Section selected</span>
                  </div>
                )}
              </div>

              {/* Teacher Selection */}
              <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                !localFormData.teacherId 
                  ? localFormData.sectionId 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-slate-200 bg-slate-50'
                  : 'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    localFormData.teacherId 
                      ? 'bg-green-500 text-white' 
                      : localFormData.sectionId 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-300 text-slate-500'
                  }`}>
                    4
                  </div>
                  <label className="block text-sm font-medium text-slate-700">
                    Teacher *
                  </label>
                  {localFormData.sectionId && !localFormData.teacherId && (
                    <span className="text-xs text-blue-600 font-medium">← Final step</span>
                  )}
                </div>
                <TeacherSelector
                  teachers={filteredTeachers}
                  selectedTeacher={localFormData.teacherId}
                  onTeacherChange={(teacherId) => handleInputChange('teacherId', teacherId)}
                  selectedDepartment={localFormData.departmentId}
                  disabled={!localFormData.sectionId}
                />
                {localFormData.teacherId && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
                    <i className="fas fa-check"></i>
                    <span>Teacher selected</span>
                  </div>
                )}
              </div>
                </div>
              </>
            )}

            {/* Subjects Selection - Always shown when classroom context is available */}
            {localFormData.teacherId && localFormData.sectionId && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-book text-indigo-600"></i>
                    <h4 className="font-bold text-slate-900">
                      {editingAssignment ? 'Edit Subjects to Teach in this Classroom' : 'Select Subjects to Teach'}
                    </h4>
                  </div>
                  <span className="text-sm text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                    {localFormData.subjectIds.length} selected
                  </span>
                </div>
                
                {editingAssignment && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                    <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">All subjects in this section are shown below.</p>
                      <p className="text-xs mt-1">Subjects with <i className="fas fa-exclamation text-orange-600 text-xs"></i> are assigned to other teachers. Selecting them will reassign to this teacher.</p>
                    </div>
                  </div>
                )}
                
                {filteredSubjects.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <i className="fas fa-inbox text-4xl mb-3 text-slate-300"></i>
                    <p className="font-medium">No subjects available</p>
                    <p className="text-sm">All subjects for this section have been assigned.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2">
                    {filteredSubjects.map(subject => {
                      const isSelected = localFormData.subjectIds.includes(subject._id);
                      
                      // Check if this subject is assigned to another teacher
                      const assignedToOther = editingAssignment && teacherAssignments.find(
                        ta => ta.subjectId === subject._id && 
                              ta.sectionId === localFormData.sectionId &&
                              ta.teacherId !== editingAssignment.teacherId
                      );
                      const otherTeacher = assignedToOther ? teachers.find(t => t._id === assignedToOther.teacherId) : null;
                      
                      return (
                        <button
                          key={subject._id}
                          type="button"
                          onClick={() => {
                            const newSubjectIds = isSelected
                              ? localFormData.subjectIds.filter(id => id !== subject._id)
                              : [...localFormData.subjectIds, subject._id];
                            handleInputChange('subjectIds', newSubjectIds);
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-left relative ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                          }`}
                        >
                          {assignedToOther && (
                            <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center" title={`Assigned to ${otherTeacher?.name}`}>
                              <i className="fas fa-exclamation text-xs"></i>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${
                              isSelected ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}>
                              {isSelected && <i className="fas fa-check text-white text-xs"></i>}
                            </div>
                            <span className={`font-medium text-sm ${
                              isSelected ? 'text-indigo-900' : 'text-slate-700'
                            }`}>
                              {subject.code}
                            </span>
                          </div>
                          <p className={`text-xs truncate ${
                            isSelected ? 'text-indigo-700' : 'text-slate-500'
                          }`}>
                            {subject.name}
                          </p>
                          {assignedToOther && otherTeacher && (
                            <div className="mt-1 text-xs text-orange-600 truncate">
                              <i className="fas fa-user-tie text-xs"></i> {otherTeacher.name}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className={btnSlateClass}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={btnIndigoClass}
                disabled={!localFormData.teacherId || !localFormData.departmentId || 
                         !localFormData.classId || !localFormData.sectionId || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editingAssignment ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <i className="fas fa-link"></i>
                    {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignmentModal;

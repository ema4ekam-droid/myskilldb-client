import React, { useState, useEffect } from 'react';
import TeacherSelector from './TeacherSelector';
import SubjectAssignment from './SubjectAssignment';

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

  const handleSubjectToggle = (subjectId) => {
    const newSubjectIds = localFormData.subjectIds.includes(subjectId)
      ? localFormData.subjectIds.filter(id => id !== subjectId)
      : [...localFormData.subjectIds, subjectId];
    
    handleInputChange('subjectIds', newSubjectIds);
  };

  const handleClassTeacherToggle = () => {
    handleInputChange('isClassTeacher', !localFormData.isClassTeacher);
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

  const filteredSubjects = subjects.filter(subject => 
    !localFormData.departmentId || subject.departmentId === localFormData.departmentId
  );

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
                {editingAssignment ? 'Edit Teacher Assignment' : 'Create Teacher Assignment'}
              </h2>
              <p className="text-slate-500 text-sm">
                Assign a teacher to specific subjects and optionally set as class teacher
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
            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department *
                </label>
                <select
                  value={localFormData.departmentId}
                  onChange={(e) => handleInputChange('departmentId', e.target.value)}
                  className={inputBaseClass}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class *
                </label>
                <select
                  value={localFormData.classId}
                  onChange={(e) => handleInputChange('classId', e.target.value)}
                  className={inputBaseClass}
                  required
                  disabled={!localFormData.departmentId}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              {/* Section Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Section *
                </label>
                <select
                  value={localFormData.sectionId}
                  onChange={(e) => handleInputChange('sectionId', e.target.value)}
                  className={inputBaseClass}
                  required
                  disabled={!localFormData.classId}
                >
                  <option value="">Select Section</option>
                  {sections.map(section => (
                    <option key={section._id} value={section._id}>{section.name}</option>
                  ))}
                </select>
              </div>

              {/* Teacher Selection */}
              <div>
                <TeacherSelector
                  teachers={filteredTeachers}
                  selectedTeacher={localFormData.teacherId}
                  onTeacherChange={(teacherId) => handleInputChange('teacherId', teacherId)}
                  selectedDepartment={localFormData.departmentId}
                  disabled={!localFormData.departmentId}
                />
              </div>
            </div>

            {/* Subject Assignment */}
            {localFormData.departmentId && (
              <div className="border-t border-slate-200 pt-6">
                <SubjectAssignment
                  subjects={filteredSubjects}
                  selectedSubjects={localFormData.subjectIds}
                  onSubjectToggle={handleSubjectToggle}
                  isClassTeacher={localFormData.isClassTeacher}
                  onClassTeacherToggle={handleClassTeacherToggle}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Assignment Preview */}
            {localFormData.teacherId && localFormData.departmentId && 
             localFormData.classId && localFormData.sectionId && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Assignment Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-chalkboard-teacher text-blue-500"></i>
                    <span className="text-slate-700">
                      {teachers.find(t => t._id === localFormData.teacherId)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-building text-green-500"></i>
                    <span className="text-slate-700">
                      {departments.find(d => d._id === localFormData.departmentId)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-graduation-cap text-purple-500"></i>
                    <span className="text-slate-700">
                      {classes.find(c => c._id === localFormData.classId)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-layer-group text-orange-500"></i>
                    <span className="text-slate-700">
                      {sections.find(s => s._id === localFormData.sectionId)?.name}
                    </span>
                  </div>
                  {localFormData.isClassTeacher && (
                    <div className="flex items-center gap-2 text-yellow-700">
                      <i className="fas fa-crown"></i>
                      <span className="font-medium">Class Teacher Assignment</span>
                    </div>
                  )}
                  {localFormData.subjectIds.length > 0 && (
                    <div className="flex items-center gap-2">
                      <i className="fas fa-book text-indigo-500"></i>
                      <span className="text-slate-700">
                        {localFormData.subjectIds.length} subject(s) assigned
                      </span>
                    </div>
                  )}
                </div>
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

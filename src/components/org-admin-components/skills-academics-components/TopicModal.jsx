import React, { useState, useEffect } from 'react';

const TopicModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  subjects,
  classes,
  sections,
  editingTopic,
  isLoading,
  inputBaseClass,
  btnIndigoClass,
  btnSlateClass
}) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Topic title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Topic description is required';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Please select a subject';
    }

    if (!formData.classId) {
      newErrors.classId = 'Please select a class';
    }

    if (!formData.sectionIds || formData.sectionIds.length === 0) {
      newErrors.sectionIds = 'Please select at least one section';
    }

    if (!formData.estimatedTime.trim()) {
      newErrors.estimatedTime = 'Estimated time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSectionToggle = (sectionId) => {
    const currentSections = formData.sectionIds || [];
    const newSections = currentSections.includes(sectionId)
      ? currentSections.filter(id => id !== sectionId)
      : [...currentSections, sectionId];
    
    setFormData(prev => ({ ...prev, sectionIds: newSections }));
    if (errors.sectionIds) {
      setErrors(prev => ({ ...prev, sectionIds: '' }));
    }
  };

  const handleClassChange = (classId) => {
    setFormData(prev => ({ ...prev, classId, sectionIds: [] }));
    if (errors.classId) {
      setErrors(prev => ({ ...prev, classId: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingTopic ? 'Edit Topic' : 'Create New Topic'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {editingTopic ? 'Update topic information' : 'Define a new topic by selecting class, subject, and multiple sections'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Topic Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`${inputBaseClass} ${errors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Enter topic title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`${inputBaseClass} h-20 resize-none ${errors.description ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Describe what this topic covers"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Class *
              </label>
              <select
                value={formData.classId}
                onChange={(e) => handleClassChange(e.target.value)}
                className={`${inputBaseClass} ${errors.classId ? 'border-red-300 focus:ring-red-500' : ''}`}
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
              {errors.classId && <p className="text-red-500 text-xs mt-1">{errors.classId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject *
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => handleInputChange('subjectId', e.target.value)}
                className={`${inputBaseClass} ${errors.subjectId ? 'border-red-300 focus:ring-red-500' : ''}`}
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
              </select>
              {errors.subjectId && <p className="text-red-500 text-xs mt-1">{errors.subjectId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className={inputBaseClass}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estimated Time *
              </label>
              <input
                type="text"
                value={formData.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                className={`${inputBaseClass} ${errors.estimatedTime ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="e.g., 2 hours, 90 minutes"
              />
              {errors.estimatedTime && <p className="text-red-500 text-xs mt-1">{errors.estimatedTime}</p>}
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select Sections * (Choose multiple sections for this topic)
            </label>
            {errors.sectionIds && <p className="text-red-500 text-xs mb-2">{errors.sectionIds}</p>}
            
            {!formData.classId ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-slate-500">
                <i className="fas fa-info-circle mb-2"></i>
                <p>Please select a class first to choose sections</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sections.map(section => (
                  <label key={section._id} className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sectionIds?.includes(section._id) || false}
                      onChange={() => handleSectionToggle(section._id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">{section.name}</span>
                  </label>
                ))}
              </div>
            )}
            
            {formData.sectionIds && formData.sectionIds.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <i className="fas fa-check-circle mr-2"></i>
                  Selected {formData.sectionIds.length} section(s): {
                    formData.sectionIds.map(sectionId => {
                      const section = sections.find(s => s._id === sectionId);
                      return section?.name;
                    }).join(', ')
                  }
                </p>
              </div>
            )}
          </div>

          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Learning Objectives
            </label>
            <textarea
              value={formData.learningObjectives}
              onChange={(e) => handleInputChange('learningObjectives', e.target.value)}
              className={`${inputBaseClass} h-20 resize-none`}
              placeholder="What will students learn from this topic?"
            />
          </div>

          {/* Prerequisites and Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prerequisites
              </label>
              <textarea
                value={formData.prerequisites}
                onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                className={`${inputBaseClass} h-16 resize-none`}
                placeholder="What knowledge should students have before this topic?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resources Required
              </label>
              <textarea
                value={formData.resources}
                onChange={(e) => handleInputChange('resources', e.target.value)}
                className={`${inputBaseClass} h-16 resize-none`}
                placeholder="Books, equipment, software needed"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
              Active (topic is available for use)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editingTopic ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {editingTopic ? 'Update Topic' : 'Create Topic'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicModal;

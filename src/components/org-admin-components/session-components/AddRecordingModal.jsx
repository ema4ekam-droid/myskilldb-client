import { useState } from 'react';

const AddRecordingModal = ({ onClose, onSubmit, selectedTeacher, selectedSubject, availableTopics }) => {
  const [formData, setFormData] = useState({
    title: '',
    videoLink: '',
    description: '',
    duration: '',
    topicId: '',
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.videoLink.trim()) newErrors.videoLink = 'Video link is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.topicId) newErrors.topicId = 'Topic is required';

    // Basic URL validation
    if (formData.videoLink && !formData.videoLink.match(/^https?:\/\/.+/)) {
      newErrors.videoLink = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold">Add Classroom Recording</h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1">
              Adding on behalf of {selectedTeacher?.name} • {selectedSubject?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <i className="fas fa-times text-lg sm:text-xl"></i>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Recording Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Recording Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Introduction to React Hooks"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-indigo-500'
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Video Link */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Video Link *
            </label>
            <input
              type="text"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.videoLink
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-indigo-500'
              }`}
            />
            {errors.videoLink && <p className="text-red-500 text-xs mt-1">{errors.videoLink}</p>}
            <p className="text-xs text-slate-500 mt-1">
              <i className="fas fa-info-circle mr-1"></i>
              YouTube, Vimeo, or any video hosting link
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Duration *
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 45 mins"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.duration
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-indigo-500'
              }`}
            />
            {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of what's covered in this recording"
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Topic *
            </label>
            <select
              name="topicId"
              value={formData.topicId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.topicId
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-indigo-500'
              }`}
            >
              <option value="">Select a topic</option>
              {availableTopics && availableTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
            {errors.topicId && <p className="text-red-500 text-xs mt-1">{errors.topicId}</p>}
            <p className="text-xs text-slate-500 mt-1">
              <i className="fas fa-info-circle mr-1"></i>
              Select the topic this recording covers
            </p>
          </div>

          {/* Teacher Info Display */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">
              <i className="fas fa-info-circle mr-2"></i>
              Recording Details
            </h3>
            <div className="space-y-1 text-sm text-indigo-700">
              <p>
                <span className="font-medium">Teacher:</span> {selectedTeacher?.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {selectedTeacher?.email}
              </p>
              <p>
                <span className="font-medium">Subject:</span> {selectedSubject?.name}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Recording
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordingModal;


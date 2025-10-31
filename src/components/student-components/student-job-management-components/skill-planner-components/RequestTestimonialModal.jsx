import React from 'react';

const RequestTestimonialModal = ({
  isOpen,
  onClose,
  selectedSkill,
  testimonialProject,
  setTestimonialProject,
  validatorName,
  setValidatorName,
  validatorEmail,
  setValidatorEmail,
  validatorRole,
  setValidatorRole,
  personalMessage,
  setPersonalMessage,
  onRequestTestimonial
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-award"></i>
              Request a Testimonial
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Skill Being Validated (Display Only) */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
            <p className="text-xs text-indigo-600 font-semibold mb-1">Skill to be validated:</p>
            <p className="text-lg font-bold text-indigo-900">{selectedSkill?.name}</p>
          </div>

          {/* Project Name Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Project *
            </label>
            <input
              type="text"
              value={testimonialProject}
              onChange={(e) => setTestimonialProject(e.target.value)}
              placeholder="e.g., E-commerce Checkout System"
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Validator Information */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Validator's Name *
            </label>
            <input
              type="text"
              value={validatorName}
              onChange={(e) => setValidatorName(e.target.value)}
              placeholder="e.g., Ms. Priya Sharma"
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Validator's Email *
            </label>
            <input
              type="email"
              value={validatorEmail}
              onChange={(e) => setValidatorEmail(e.target.value)}
              placeholder="e.g., priya.sharma@company.com"
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Validator's Role/Title *
            </label>
            <input
              type="text"
              value={validatorRole}
              onChange={(e) => setValidatorRole(e.target.value)}
              placeholder="e.g., Project Manager, TechSolutions Inc."
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Personal Message */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              placeholder="Hi Ms. Sharma, I'd really appreciate it if you could take a moment to validate my work..."
              rows={4}
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onRequestTestimonial}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-lg transition-colors"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestTestimonialModal;


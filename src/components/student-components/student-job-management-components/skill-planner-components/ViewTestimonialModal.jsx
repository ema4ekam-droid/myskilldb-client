import React from 'react';

const ViewTestimonialModal = ({ isOpen, onClose, selectedTestimonial }) => {
  if (!isOpen || !selectedTestimonial) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`p-6 ${
          selectedTestimonial.status === 'approved' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-purple-500 to-indigo-500'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-award"></i>
              Testimonial Details
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
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
              selectedTestimonial.status === 'approved' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              <i className={`fas ${selectedTestimonial.status === 'approved' ? 'fa-check-circle' : 'fa-clock'}`}></i>
              {selectedTestimonial.status === 'approved' ? 'Approved' : 'Pending Response'}
            </span>
          </div>

          {/* Project */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-600 mb-1">Project</p>
            <p className="text-base font-bold text-slate-900">{selectedTestimonial.project}</p>
          </div>

          {/* Skills */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-600 mb-2">Skills Validated</p>
            <div className="flex flex-wrap gap-2">
              {selectedTestimonial.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Validator Info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="text-xs text-slate-600">Validator Information</p>
            <p className="text-base font-bold text-slate-900">{selectedTestimonial.validatorName}</p>
            <p className="text-sm text-slate-700">{selectedTestimonial.validatorRole}</p>
            <p className="text-sm text-slate-600">{selectedTestimonial.validatorEmail}</p>
          </div>

          {/* Personal Message */}
          {selectedTestimonial.personalMessage && (
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-600 mb-2">Your Message</p>
              <p className="text-sm text-slate-700 italic">{selectedTestimonial.personalMessage}</p>
            </div>
          )}

          {/* Testimonial Text (if approved) */}
          {selectedTestimonial.status === 'approved' && selectedTestimonial.testimonialText && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-xs text-green-700 font-semibold mb-2 flex items-center gap-2">
                <i className="fas fa-quote-left"></i>
                Testimonial
              </p>
              <p className="text-sm text-slate-800 leading-relaxed">{selectedTestimonial.testimonialText}</p>
              <p className="text-xs text-slate-600 mt-3">
                Approved on: {selectedTestimonial.approvedDate}
              </p>
            </div>
          )}

          {/* Date Info */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Requested on: {selectedTestimonial.requestedDate}
            </p>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <button
              onClick={onClose}
              className={`w-full px-6 py-3 text-white font-semibold rounded-lg transition-colors ${
                selectedTestimonial.status === 'approved'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTestimonialModal;


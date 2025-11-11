import React from 'react';

const TestimonialsListModal = ({ isOpen, onClose, selectedSkill }) => {
  if (!isOpen || !selectedSkill) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Testimonials</h2>
              <p className="text-sm text-white opacity-90">{selectedSkill.name}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
            >
              <i className="fas fa-times text-white"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Approved Testimonials */}
          {selectedSkill.testimonials?.filter(t => t.status === 'approved').length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                Approved Testimonials
              </h3>
              {selectedSkill.testimonials.filter(t => t.status === 'approved').map((testimonial) => (
                <div key={testimonial.id} className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-green-700"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{testimonial.validatorName}</h4>
                      <p className="text-sm text-slate-600">{testimonial.validatorRole}</p>
                      <p className="text-xs text-slate-500">{testimonial.validatorEmail}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg mb-3">
                    <p className="text-sm text-slate-700 italic">"{testimonial.testimonialText}"</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Project: {testimonial.project}</span>
                    <span>Approved: {testimonial.approvedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending Testimonials */}
          {selectedSkill.testimonials?.filter(t => t.status === 'pending').length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-orange-700 mb-4 flex items-center gap-2">
                <i className="fas fa-clock"></i>
                Pending Testimonials
              </h3>
              {selectedSkill.testimonials.filter(t => t.status === 'pending').map((testimonial) => (
                <div key={testimonial.id} className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-orange-700"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{testimonial.validatorName}</h4>
                      <p className="text-sm text-slate-600">{testimonial.validatorRole}</p>
                      <p className="text-xs text-slate-500">{testimonial.validatorEmail}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                      Pending
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Project:</span> {testimonial.project}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Requested: {testimonial.requestedDate}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsListModal;

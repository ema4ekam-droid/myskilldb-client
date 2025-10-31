import React from 'react';

const SubjectAssessmentsModal = ({ subject, onClose, onViewDetails, onCreateStudyPlan }) => {
  if (!subject) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white hover:bg-purple-50 border border-slate-200 rounded-full flex items-center justify-center text-purple-600 transition-all hover:scale-110 shadow-md"
          aria-label="Close modal"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-xl z-10">
          <div className="pr-12">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <i className="fas fa-graduation-cap"></i>
              {subject.name}
            </h3>
            <p className="text-purple-100 text-sm">
              Subject-Level Assessment History - Comprehensive tests covering all topics
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="space-y-4">
            {subject.subjectAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fas fa-file-alt text-purple-600"></i>
                      <h6 className="font-semibold text-slate-900 text-base">{assessment.title}</h6>
                    </div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <i className="fas fa-calendar text-slate-400"></i>
                      Taken on {new Date(assessment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold mb-1 ${assessment.score >= 80 ? 'text-green-600' : assessment.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {assessment.score}%
                    </div>
                    <p className="text-sm text-slate-600">
                      {assessment.correctAnswers}/{assessment.totalQuestions} correct
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      onViewDetails(assessment);
                      onClose();
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  <button
                    onClick={() => onCreateStudyPlan(assessment)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-book-reader"></i>
                    Create Study Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 rounded-b-xl">
          <div className="text-sm text-slate-600 text-center">
            <i className="fas fa-info-circle text-purple-600 mr-2"></i>
            Subject-level assessments test your comprehensive understanding across all topics
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectAssessmentsModal;


import React from 'react';

const AssessmentDetailsModal = ({ assessment, onClose, onCreateStudyPlan }) => {
  if (!assessment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white hover:bg-blue-50 border border-slate-200 rounded-full flex items-center justify-center text-blue-600 transition-all hover:scale-110 shadow-md"
          aria-label="Close modal"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl z-10">
          <div className="flex items-start justify-between gap-4 pr-16">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2 text-left">{assessment.title}</h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
                <span>
                  <i className="fas fa-calendar mr-2"></i>
                  {new Date(assessment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span>
                  <i className="fas fa-check-circle mr-2"></i>
                  {assessment.correctAnswers}/{assessment.totalQuestions} Correct
                </span>
              </div>
            </div>
            <div className="text-right pr-2">
              <div className={`text-4xl font-bold text-white`}>
                {assessment.score}%
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body - Questions */}
        <div className="p-6 space-y-4">
          <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-list-ol text-blue-600"></i>
            Question Review
          </h4>
          
          {assessment.questions.map((question, index) => (
            <div
              key={question.id}
              className={`border-l-4 rounded-lg p-4 ${
                question.isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                  question.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-3">{question.question}</p>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className={`flex items-center gap-2 p-2 rounded ${
                      question.userAnswer === question.correctAnswer 
                        ? 'bg-green-100 border border-green-300' 
                        : question.userAnswer === question.correctAnswer
                          ? 'bg-green-100 border border-green-300'
                          : 'bg-red-100 border border-red-300'
                    }`}>
                      <i className={`fas ${
                        question.isCorrect ? 'fa-check-circle text-green-600' : 'fa-times-circle text-red-600'
                      }`}></i>
                      <span className="font-medium">
                        Your Answer: <span className="font-bold">Option {question.userAnswer}</span>
                      </span>
                    </div>
                    
                    {!question.isCorrect && (
                      <div className="flex items-center gap-2 p-2 rounded bg-green-100 border border-green-300">
                        <i className="fas fa-lightbulb text-green-600"></i>
                        <span className="font-medium">
                          Correct Answer: <span className="font-bold">Option {question.correctAnswer}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 rounded-b-xl flex justify-between items-center">
          <div className="text-sm text-slate-600">
            <i className="fas fa-info-circle text-blue-600 mr-2"></i>
            Review your answers and create a study plan to improve
          </div>
          <button
            onClick={() => onCreateStudyPlan(assessment)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <i className="fas fa-book-reader"></i>
            Create Study Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetailsModal;


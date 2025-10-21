import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const PublishTestModal = ({ isOpen, onClose, test, onPublish, classInfo }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Generate random multiplication problem
  useEffect(() => {
    if (isOpen) {
      generateProblem();
      setUserAnswer('');
    }
  }, [isOpen]);

  const generateProblem = () => {
    const n1 = Math.floor(Math.random() * 9) + 2; // 2-10
    const n2 = Math.floor(Math.random() * 9) + 2; // 2-10
    setNum1(n1);
    setNum2(n2);
  };

  const handleVerifyAndPublish = () => {
    const correctAnswer = num1 * num2;
    const userAnswerNum = parseInt(userAnswer);

    if (userAnswerNum !== correctAnswer) {
      toast.error('Incorrect answer. Please try again.');
      generateProblem();
      setUserAnswer('');
      return;
    }

    setIsVerifying(true);
    
    // Simulate publishing process
    setTimeout(() => {
      onPublish(test);
      setIsVerifying(false);
      setUserAnswer('');
      onClose();
      toast.success(`Test "${test.title}" has been published to all students in ${classInfo.className}!`);
    }, 1000);
  };

  if (!isOpen || !test) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-200 bg-gradient-to-r from-green-600 to-emerald-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-paper-plane"></i>
                Publish Test
              </h2>
              <p className="text-green-100 text-xs md:text-sm mt-1">
                Confirm to publish to students
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 space-y-3 md:space-y-4 overflow-y-auto flex-1">
          {/* Test Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
            <h3 className="text-xs md:text-sm font-semibold text-blue-900 mb-2">
              <i className="fas fa-info-circle mr-2"></i>
              Test Details
            </h3>
            <div className="space-y-0.5 md:space-y-1 text-xs md:text-sm">
              <p className="text-blue-800">
                <strong>Test:</strong> {test.title}
              </p>
              <p className="text-blue-800">
                <strong>Department:</strong> {classInfo.departmentName}
              </p>
              <p className="text-blue-800">
                <strong>Class:</strong> {classInfo.className}
              </p>
              <p className="text-blue-800">
                <strong>Section:</strong> {classInfo.sectionName}
              </p>
              <p className="text-blue-800">
                <strong>Questions:</strong> {test.questionCount}
              </p>
              <p className="text-blue-800">
                <strong>Difficulty:</strong> <span className="capitalize">{test.difficulty}</span>
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
            <div className="flex items-start gap-2">
              <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5 text-sm"></i>
              <div>
                <p className="text-xs md:text-sm font-semibold text-yellow-900 mb-1">Important</p>
                <p className="text-xs text-yellow-800">
                  Once published, all students in this class will receive this test. 
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Verification Challenge */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg p-3 md:p-4">
            <h3 className="text-xs md:text-sm font-semibold text-purple-900 mb-2 md:mb-3 flex items-center gap-2">
              <i className="fas fa-shield-alt"></i>
              Verification Required
            </h3>
            
            <div className="bg-white rounded-lg p-3 md:p-4 mb-2 md:mb-3">
              <p className="text-xs md:text-sm text-slate-600 mb-2 md:mb-3 text-center">
                Solve this simple problem to confirm:
              </p>
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl font-bold text-purple-600">{num1}</span>
                <span className="text-xl md:text-2xl text-slate-400">×</span>
                <span className="text-2xl md:text-3xl font-bold text-purple-600">{num2}</span>
                <span className="text-xl md:text-2xl text-slate-400">=</span>
                <span className="text-2xl md:text-3xl font-bold text-slate-400">?</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userAnswer) {
                      handleVerifyAndPublish();
                    }
                  }}
                  placeholder="Enter your answer"
                  className="flex-1 p-2 md:p-3 border-2 border-purple-300 rounded-lg text-center text-base md:text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <p className="text-xs text-purple-700 text-center">
              <i className="fas fa-lightbulb mr-1"></i>
              Press Enter or click the button below to submit
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-slate-200 flex justify-end gap-2 md:gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isVerifying}
            className="px-3 md:px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm md:text-base font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleVerifyAndPublish}
            disabled={!userAnswer || isVerifying}
            className="px-4 md:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm md:text-base font-semibold rounded-lg transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <i className="fas fa-spinner fa-spin text-sm"></i>
                <span className="hidden sm:inline">Publishing...</span>
                <span className="sm:hidden">Publishing</span>
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane text-sm"></i>
                <span className="hidden sm:inline">Publish Test</span>
                <span className="sm:hidden">Publish</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishTestModal;


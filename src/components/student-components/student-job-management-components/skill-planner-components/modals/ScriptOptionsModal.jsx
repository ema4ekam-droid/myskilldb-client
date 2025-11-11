import React from 'react';

const ScriptOptionsModal = ({ 
  isOpen, 
  onClose, 
  selectedSkill,
  onAIGeneration,
  onPromptGenerator,
  onCustomScript
}) => {
  if (!isOpen || !selectedSkill) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Script Option</h2>
              <p className="text-sm text-white opacity-90 mt-1">{selectedSkill.name}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
            >
              <i className="fas fa-times text-white text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* AI Generation Option */}
          <button
            onClick={onAIGeneration}
            className="w-full p-6 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-2 border-indigo-200 rounded-xl transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <i className="fas fa-magic text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  Generate with AI
                </h3>
                <p className="text-sm text-slate-600">
                  Let AI create a professional video script for you based on {selectedSkill.name}
                </p>
              </div>
              <i className="fas fa-arrow-right text-indigo-600 text-xl group-hover:translate-x-1 transition-transform"></i>
            </div>
          </button>

          {/* Get AI Prompt Option */}
          <button
            onClick={onPromptGenerator}
            className="w-full p-6 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 rounded-xl transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shrink-0">
                <i className="fas fa-file-lines text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  Get Teleprompter Prompt
                </h3>
                <p className="text-sm text-slate-600">
                  Get a prompt for easy-to-read scripts with short sentences & pause markers
                </p>
              </div>
              <i className="fas fa-arrow-right text-emerald-600 text-xl group-hover:translate-x-1 transition-transform"></i>
            </div>
          </button>

          {/* Custom Script Option */}
          <button
            onClick={onCustomScript}
            className="w-full p-6 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-200 rounded-xl transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shrink-0">
                <i className="fas fa-paste text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Paste Custom Script
                </h3>
                <p className="text-sm text-slate-600">
                  Already have a script? Paste it directly here
                </p>
              </div>
              <i className="fas fa-arrow-right text-blue-600 text-xl group-hover:translate-x-1 transition-transform"></i>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScriptOptionsModal;


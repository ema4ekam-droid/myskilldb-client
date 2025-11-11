import React from 'react';

const LearningModuleReader = ({ isOpen, onClose, generatedModule, selectedSkill, selectedJob, isGenerating }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Go Back</span>
          </button>
          
          <div className="flex-1 mx-4 text-center">
            <h2 className="text-lg font-bold text-white truncate">{selectedSkill?.name}</h2>
            <p className="text-xs text-white opacity-90 hidden sm:block">{selectedJob?.title}</p>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <i className="fas fa-times"></i>
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200">
          <div className="p-6 sm:p-10 lg:p-14" style={{ fontFamily: 'Roboto, sans-serif', lineHeight: '1.7' }}>
            
            {isGenerating ? (
              <div className="text-center py-24">
                <div className="w-24 h-24 border-8 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-8"></div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Generating Your Learning Module...</h2>
                <p className="text-lg text-slate-600">This will only take a moment.</p>
              </div>
            ) : generatedModule && (
              <>
                <div className="border-b-2 border-slate-300 pb-6 mb-10">
                  <h1 className="text-4xl font-bold text-slate-900 mb-3">{generatedModule.skillName}</h1>
                  <p className="text-base text-slate-600">Learning Module for {generatedModule.jobContext}</p>
                </div>

                <section className="mb-10">
                  <h2 className="text-3xl font-bold text-blue-700 mb-5 pb-2 border-b-2 border-blue-100">
                    1. Introduction
                  </h2>
                  <p className="text-slate-700 text-base leading-relaxed">{generatedModule.introduction}</p>
                </section>

                <section className="mb-10">
                  <h2 className="text-3xl font-bold text-blue-700 mb-5 pb-2 border-b-2 border-blue-100">
                    2. Key Concepts
                  </h2>
                  <div className="space-y-6">
                    {generatedModule.keyConcepts.map((concept, index) => (
                      <div key={index} className="bg-slate-50 border-l-4 border-blue-500 p-5 rounded-r">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">
                          2.{index + 1}. {concept.title}
                        </h3>
                        <p className="text-slate-700 text-base leading-relaxed">{concept.content}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-10">
                  <h2 className="text-3xl font-bold text-blue-700 mb-5 pb-2 border-b-2 border-blue-100">
                    3. Practical Example
                  </h2>
                  <pre className="bg-slate-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedModule.practicalExample}</code>
                  </pre>
                </section>

                <section className="mb-10">
                  <h2 className="text-3xl font-bold text-blue-700 mb-5 pb-2 border-b-2 border-blue-100">
                    4. Summary
                  </h2>
                  <ul className="space-y-3">
                    {generatedModule.summary.map((point, index) => (
                      <li key={index} className="flex gap-3 text-slate-700 text-base">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModuleReader;


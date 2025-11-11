import React from 'react';

const ViewAllResourcesModal = ({ 
  isOpen, 
  onClose, 
  selectedSkill, 
  selectedJob,
  onOpenModule,
  onOpenScript
}) => {
  if (!isOpen || !selectedSkill) return null;

  // Get the single learning module (there's only one per skill)
  const learningModule = selectedSkill.readingModules && selectedSkill.readingModules.length > 0 
    ? selectedSkill.readingModules[0] 
    : null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto">
      {/* Fixed Header with just buttons */}
      <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Go Back</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <i className="fas fa-times"></i>
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Title Section - Below Header */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedSkill.name} - Learning Resources</h2>
          <p className="text-sm text-slate-600">{selectedJob?.title}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Learning Module Section (Single Card) */}
        {learningModule && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-book text-blue-600 text-lg"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Learning Module</h3>
            </div>

            <div
              onClick={() => onOpenModule(learningModule)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-200 overflow-hidden max-w-2xl"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-start justify-between mb-3">
                  <i className="fas fa-book-open text-white text-3xl"></i>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm text-white font-medium">
                    {learningModule.timeSpent}
                  </span>
                </div>
                <h4 className="text-white font-bold text-xl mb-2">{learningModule.title}</h4>
                <p className="text-blue-100 text-sm">AI-Generated Learning Content</p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <span className="flex items-center gap-2">
                    <i className="fas fa-calendar"></i>
                    {learningModule.completedDate}
                  </span>
                  <span className="flex items-center gap-2 text-green-600 font-medium">
                    <i className="fas fa-check-circle"></i>
                    Completed
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModule(learningModule);
                  }}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <i className="fas fa-eye"></i>
                  Read Module
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Scripts Section (Horizontal Scroll) */}
        {selectedSkill.videoScripts && selectedSkill.videoScripts.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-video text-purple-600 text-lg"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Video Scripts</h3>
              <span className="text-sm text-slate-500">({selectedSkill.videoScripts.length})</span>
            </div>

            {/* Horizontal Scrolling Container */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
                {selectedSkill.videoScripts.map((script) => (
                  <div
                    key={script.id}
                    onClick={() => onOpenScript(script)}
                    className="flex-shrink-0 w-80 bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-200 overflow-hidden snap-start"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <i className="fas fa-film text-white text-2xl"></i>
                        <span className="px-2.5 py-1 bg-white bg-opacity-20 rounded-full text-xs text-white font-medium">
                          {script.duration}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-1 line-clamp-2">{script.title}</h4>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                        <span className="flex items-center gap-1.5">
                          <i className="fas fa-calendar"></i>
                          {script.generatedDate}
                        </span>
                        <span className="flex items-center gap-1.5 text-green-600 font-medium">
                          <i className="fas fa-check-circle"></i>
                          Generated
                        </span>
                      </div>

                      <div className="mb-4 text-sm text-slate-600">
                        <p className="font-medium mb-1">Sections:</p>
                        <p className="text-slate-500 text-xs">{script.content.sections.length} parts • Full breakdown</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenScript(script);
                        }}
                        className="w-full px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-eye"></i>
                        View Script
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!learningModule && (!selectedSkill.videoScripts || selectedSkill.videoScripts.length === 0) && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-book-open text-slate-400 text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Resources Yet</h3>
            <p className="text-slate-600 mb-4">
              Generate learning modules and video scripts to build your resource library
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllResourcesModal;


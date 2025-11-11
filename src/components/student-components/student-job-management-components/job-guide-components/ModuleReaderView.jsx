import React from 'react';

const ModuleReaderView = ({
  isGenerating,
  generatedModule,
  selectedSkill,
  selectedJob,
  handleCloseReader,
  handleSaveModule,
  handleBookmark
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto">
        {/* Fixed Header with Book Controls */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <button
              onClick={handleCloseReader}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Go Back</span>
            </button>
            
            <div className="flex-1 mx-4 text-center">
              <h2 className="text-sm sm:text-lg font-bold text-white truncate">{selectedSkill?.name}</h2>
              <p className="text-xs text-white opacity-90 hidden sm:block">{selectedJob?.jobName}</p>
            </div>
            
            <div className="flex gap-2">
              {!selectedSkill?.hasModule && (
                <button
                  onClick={handleSaveModule}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-save"></i>
                  <span className="hidden sm:inline">Save</span>
                </button>
              )}
              <button
                onClick={handleBookmark}
                className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <i className="fas fa-bookmark"></i>
                <span className="hidden sm:inline">Bookmark</span>
              </button>
              <button
                onClick={handleCloseReader}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <i className="fas fa-times"></i>
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          </div>
        </div>

        {/* Textbook Content */}
        <div className="min-h-screen bg-slate-50 py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Book Page Container */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200">
              {/* Page Content */}
              <div className="p-6 sm:p-10 lg:p-14" style={{ fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.7' }}>
                
                {isGenerating ? (
                  // Loading State
                  <div className="text-center py-24">
                    <div className="w-24 h-24 border-8 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-8"></div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Generating Your Learning Module...</h2>
                    <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
                      Our AI is crafting a personalized learning module just for you. This will only take a moment.
                    </p>
                    <div className="mt-8 flex justify-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                ) : (
                  // Generated Content
                  <>
                    {/* Chapter Title */}
                    <div className="border-b-2 border-slate-300 pb-6 mb-10">
                      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                        {generatedModule.skillName}
                      </h1>
                      <p className="text-base text-slate-600">Learning Module for {generatedModule.jobContext}</p>
                    </div>

                    {/* Introduction Section */}
                    <section className="mb-10">
                      <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-5 pb-2 border-b-2 border-blue-100">
                        1. Introduction
                      </h2>
                      <div className="text-slate-700 text-base leading-relaxed space-y-4">
                        <p className="text-justify">
                          {generatedModule.introduction}
                        </p>
                      </div>
                    </section>

                    {/* Key Concepts Section */}
                    <section className="mb-10">
                      <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-5 pb-2 border-b-2 border-blue-100">
                        2. Key Concepts
                      </h2>
                      <div className="space-y-6">
                        {generatedModule.keyConcepts.map((concept, index) => (
                          <div key={index} className="bg-slate-50 border-l-4 border-blue-500 p-5 rounded-r">
                            <h3 className="text-lg font-bold text-slate-900 mb-3">
                              2.{index + 1}. {concept.title}
                            </h3>
                            <p className="text-slate-700 text-base leading-relaxed text-justify">{concept.content}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Practical Example Section */}
                    <section className="mb-10">
                      <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-5 pb-2 border-b-2 border-blue-100">
                        3. Practical Example
                      </h2>
                      <div>
                        <div className="bg-slate-900 rounded overflow-hidden shadow-md border border-slate-700">
                          <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="text-slate-400 text-xs ml-2">example.js</span>
                          </div>
                          <pre className="p-5 overflow-x-auto text-sm">
                            <code className="text-slate-100" style={{ fontFamily: 'Consolas, Monaco, monospace' }}>
                              {generatedModule.practicalExample}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </section>

                    {/* Summary Section */}
                    <section className="mb-10">
                      <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-5 pb-2 border-b-2 border-blue-100">
                        4. Key Takeaways
                      </h2>
                      <div className="bg-blue-50 border border-blue-200 rounded p-6">
                        <ul className="space-y-3">
                          {generatedModule.summary.map((point, index) => (
                            <li key={index} className="flex items-start gap-3 text-base text-slate-800">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                                {index + 1}
                              </span>
                              <span className="leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>

                    {/* End of Chapter Marker */}
                    <div className="text-center py-6 border-t border-slate-200 mt-8">
                      <div className="inline-block">
                        <div className="flex items-center gap-3 text-slate-400">
                          <div className="w-12 h-0.5 bg-slate-300"></div>
                          <i className="fas fa-book text-xl"></i>
                          <div className="w-12 h-0.5 bg-slate-300"></div>
                        </div>
                        <p className="mt-3 text-sm text-slate-500">End of Module</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Page Number */}
            <div className="text-center mt-6 mb-4">
              <span className="text-slate-400 text-sm">Page 1</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModuleReaderView;


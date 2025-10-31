import React from 'react';

const SubjectSection = ({
  subjects,
  selectedSubject,
  subjectTopicsApi,
  expandedSubjects,
  toggleSubject,
  openManualTestModal,
  getTestsForSubject,
  selectedTopic,
  setSelectedTopic,
  subjectTopicTests,
  handleViewTest,
  handleEditTest,
  handleDeleteTest,
}) => {
  if (!selectedSubject) return null;
  const subject = subjects.find((s) => s._id === selectedSubject);
  if (!subject) return null;
  const subjectTopics = subjectTopicsApi;
  const isExpanded = expandedSubjects.has(subject._id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4">Subject & Tests</h2>

      <div className="space-y-3">
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSubject(subject._id)}
            className="w-full bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 p-4 flex items-center justify-between transition-colors"
          >
            <div className="flex items-start gap-3 flex-1 text-left">
              <i className="fas fa-book text-indigo-600 text-lg mt-0.5"></i>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm md:text-base mb-1">{subject.name}</h3>
                <p className="text-xs text-slate-600">Code: {subject.code}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                    <i className="fas fa-list text-[10px]"></i>
                    {subjectTopics.length} topic{subjectTopics.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-slate-400 ml-3 flex-shrink-0`}></i>
          </button>

          {isExpanded && (
            <div className="p-4 bg-white space-y-4">
              <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200">
                <button
                  onClick={() =>
                    openManualTestModal({
                      type: 'subject',
                      subjectId: subject._id,
                      topicIds: subjectTopics.map((t) => t._id),
                      subjectName: subject.name,
                      topicNames: subjectTopics.map((t) => t.title),
                    })
                  }
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  <span>Create Manual Test (Subject)</span>
                </button>
              </div>

              {(() => {
                const allTests = getTestsForSubject(subject._id);
                return (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Subject-Level Tests ({allTests.length})</h4>
                    {allTests.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {allTests.map((test) => (
                          <div
                            key={test._id}
                            className={`${
                              test.type === 'subject' ? 'bg-green-50 border-green-200' : 'bg-purple-50 border-purple-200'
                            } border rounded-lg p-3 w-[63vw] md:w-[21vw] flex-shrink-0`}
                          >
                            <div className="mb-2 text-center">
                              <h5 className="font-semibold text-slate-900 text-sm mb-1">{test.title}</h5>
                              <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                                <i className="fas fa-calendar-alt"></i>
                                {new Date(test.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex justify-center gap-2 mb-3">
                              <button onClick={() => handleViewTest(test)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Test">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button onClick={() => handleEditTest(test)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit Test">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button onClick={() => handleDeleteTest(test._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Test">
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                            <div className={`mb-3 pb-3 border-b ${test.type === 'subject' ? 'border-green-300' : 'border-purple-300'}`}>
                              <div className="flex items-center justify-center gap-3 flex-wrap text-xs">
                                <span
                                  className={`px-2 py-1 rounded-full ${
                                    test.difficulty === 'easy'
                                      ? 'bg-green-100 text-green-800'
                                      : test.difficulty === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {test.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <i className="fas fa-file-alt text-4xl mb-3 text-slate-300"></i>
                        <p className="text-sm">No tests found for this subject</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Topic Level Tests</h4>
                {subjectTopics.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No topics found for this section</p>
                ) : (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Select Topic</label>
                      <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      >
                        {subjectTopics.map((topic) => (
                          <option key={topic._id} value={topic._id}>
                            {topic.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedTopic && (
                      <div className="flex justify-center mb-4">
                        <button
                          onClick={() =>
                            openManualTestModal({
                              type: 'topic',
                              subjectId: subject._id,
                              topicIds: [selectedTopic],
                              subjectName: subject.name,
                              topicNames: [subjectTopics.find((t) => t._id === selectedTopic)?.title || subjectTopics.find((t) => t._id === selectedTopic)?.name],
                            })
                          }
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                          <i className="fas fa-plus"></i>
                          Create Test
                        </button>
                      </div>
                    )}

                    {(() => {
                      const topicsToShow = selectedTopic ? subjectTopics.filter((t) => t._id === selectedTopic) : subjectTopics;
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {topicsToShow.map((topic) => {
                            const topicTests = selectedTopic === topic._id ? subjectTopicTests : [];
                            return topicTests.map((test) => (
                              <div key={test._id} className="bg-white border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="mb-2 text-center">
                                  <h6 className="font-semibold text-slate-900 text-xs mb-1">{test.title}</h6>
                                  <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
                                    <i className="fas fa-user text-[10px]"></i>
                                    {test.createdBy}
                                  </p>
                                </div>
                                <div className="flex justify-center gap-1 mb-2">
                                  <button onClick={() => handleViewTest(test)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="View Test">
                                    <i className="fas fa-eye text-xs"></i>
                                  </button>
                                  <button onClick={() => handleEditTest(test)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors" title="Edit Test">
                                    <i className="fas fa-edit text-xs"></i>
                                  </button>
                                  <button onClick={() => handleDeleteTest(test._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Test">
                                    <i className="fas fa-trash text-xs"></i>
                                  </button>
                                </div>
                                <div className="mb-2">
                                  <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
                                    <span
                                      className={`px-2 py-0.5 rounded-full ${
                                        test.difficulty === 'easy'
                                          ? 'bg-green-100 text-green-800'
                                          : test.difficulty === 'medium'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {test.difficulty}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ));
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectSection;



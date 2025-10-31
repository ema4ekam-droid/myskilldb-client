import React from 'react';

const JobDetailsSection = ({
  jobs,
  selectedJob,
  subjects,
  jobTopicsApi,
  selectedJobTopic,
  setSelectedJobTopic,
  openManualTestModal,
  jobTests,
  jobTopicTests,
  handleViewTest,
  handleEditTest,
  handleDeleteTest,
}) => {
  if (!selectedJob) return null;

  const job = jobs.find((j) => j._id === selectedJob);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4">Job Details</h2>
      <div>
        {job && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-2xl mb-2">{job.jobTitle}</h3>
                <p className="text-lg text-slate-600 flex items-center gap-2 mb-4">
                  <i className="fas fa-building text-indigo-600"></i>
                  <span className="font-medium">{job.company}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Job-Level Tests ({jobTests.length})</h3>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => {
                const topic = selectedJobTopic ? jobTopicsApi.find((t) => t._id === selectedJobTopic) : undefined;
                const subject = topic ? subjects.find((s) => s._id === topic.subjectId) : undefined;
                openManualTestModal({
                  type: 'job',
                  subjectId: subject?._id,
                  topicIds: selectedJobTopic ? [selectedJobTopic] : [],
                  subjectName: subject?.name,
                  topicNames: topic ? [topic.title || topic.name] : [],
                });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Create Job-Level Test
            </button>
          </div>
          {jobTests.length === 0 ? (
            <div className="text-center py-6 text-slate-500 italic">No tests found for this job</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {jobTests.map((test) => (
                <div key={test._id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="mb-2 text-center">
                    <h6 className="font-semibold text-slate-900 text-xs mb-1">{test.title}</h6>
                    <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                      <i className="fas fa-calendar-alt"></i>
                      {new Date(test.createdAt).toLocaleDateString()}
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
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Topic Level Tests (Job)</h3>
        {jobTopicsApi.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No topics found for this department</p>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Topic</label>
              <select
                value={selectedJobTopic}
                onChange={(e) => setSelectedJobTopic(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {jobTopicsApi.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedJobTopic && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => {
                    const topic = jobTopicsApi.find((t) => t._id === selectedJobTopic);
                    const subject = subjects.find((s) => s._id === topic?.subjectId);
                    openManualTestModal({
                      type: 'topic',
                      subjectId: subject?._id,
                      topicIds: [selectedJobTopic],
                      subjectName: subject?.name,
                      topicNames: [topic?.title || topic?.name],
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Create Test
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {jobTopicsApi
                .filter((topic) => (selectedJobTopic ? topic._id === selectedJobTopic : true))
                .flatMap((topic) => {
                  const topicTests = selectedJobTopic === topic._id ? jobTopicTests : [];
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
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsSection;



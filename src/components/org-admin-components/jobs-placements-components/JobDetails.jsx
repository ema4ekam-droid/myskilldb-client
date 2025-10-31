import React from 'react';

const JobDetails = ({
  selectedJob,
  departments,
  hasTopicsCreated,
  getJobTopics,
  handleOpenCreateTopicModal,
  isLoadingJobDetails,
  isMobile = false,
  handleCloseJobDetail
}) => {
  const getTimeSincePosted = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto lg:hidden">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 z-10">
          <button
            onClick={handleCloseJobDetail}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <i className="fas fa-arrow-left text-lg text-slate-700"></i>
          </button>
          <h2 className="text-base font-semibold text-slate-900 flex-1">Job Details</h2>
        </div>
        <div className="p-4">
          {isLoadingJobDetails && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-slate-600">Loading job details...</span>
            </div>
          )}
          <JobContent
            selectedJob={selectedJob}
            departments={departments}
            hasTopicsCreated={hasTopicsCreated}
            getJobTopics={getJobTopics}
            handleOpenCreateTopicModal={handleOpenCreateTopicModal}
            getTimeSincePosted={getTimeSincePosted}
            isMobile={isMobile}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block lg:col-span-2">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 sticky top-24">
        <div className="p-6">
          {isLoadingJobDetails && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-slate-600">Loading job details...</span>
            </div>
          )}
          <JobContent
            selectedJob={selectedJob}
            departments={departments}
            hasTopicsCreated={hasTopicsCreated}
            getJobTopics={getJobTopics}
            handleOpenCreateTopicModal={handleOpenCreateTopicModal}
            getTimeSincePosted={getTimeSincePosted}
          />
        </div>
      </div>
    </div>
  );
};

const JobContent = ({
  selectedJob,
  departments,
  hasTopicsCreated,
  getJobTopics,
  handleOpenCreateTopicModal,
  getTimeSincePosted,
  isMobile = false
}) => (
  <>
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex-1 text-left">
        <h1 className="text-xl font-bold text-slate-900 mb-1">
          {selectedJob.title}
          {hasTopicsCreated(selectedJob._id) && (
            <i
              className="fas fa-check-circle text-sm text-blue-500 ml-2"
              title="Topics added"
            ></i>
          )}
        </h1>
        <p className="text-sm text-slate-700 mb-2">
          {selectedJob.company}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-2">
          <span className="inline-flex items-center gap-1">
            <i className="fas fa-building"></i>
            {departments.find((d) => d._id === selectedJob.departmentId)?.name || "General"}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <i className="fas fa-calendar"></i>
            Posted {getTimeSincePosted(selectedJob.postedDate)}
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          {selectedJob.location}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
            {selectedJob.jobType}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleOpenCreateTopicModal(selectedJob)}
            className={`px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-colors inline-flex items-center gap-2 ${
              isMobile ? "flex-1 justify-center" : ""
            }`}
          >
            <i className="fas fa-plus-circle"></i>
            Add Topic
          </button>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-200 pt-6 text-left">
      <h2 className="text-base font-bold text-slate-900 mb-4">
        About the job
      </h2>
      <p className="text-sm text-slate-700 mb-6 leading-relaxed text-left">
        {selectedJob.description}
      </p>
      <h3 className="text-sm font-semibold text-slate-900 mb-3">
        Requirements
      </h3>
      <ul className="space-y-2 mb-6">
        {selectedJob.requirements.map((req, index) => (
          <li
            key={index}
            className="text-sm text-slate-700 flex items-start gap-2 text-left"
          >
            <i className="fas fa-check text-green-600 text-xs mt-1"></i>
            <span>{req}</span>
          </li>
        ))}
      </ul>
      {hasTopicsCreated(selectedJob._id) && getJobTopics(selectedJob._id)?.topics && (
        <>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-start gap-2">
            <i className="fas fa-graduation-cap text-purple-600"></i>
            Topics Required to Learn
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {getJobTopics(selectedJob._id).topics.map((topic) => (
              <span
                key={topic._id}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium"
              >
                {topic.name}
              </span>
            ))}
          </div>
        </>
      )}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
        <p className="text-sm font-semibold text-green-900 mb-1">
          <i className="fas fa-money-bill-wave mr-2"></i>
          Salary Range
        </p>
        <p className="text-sm text-green-800">
          {selectedJob.salaryRange}
        </p>
      </div>
    </div>
  </>
);

export default JobDetails;
import React from 'react';

const JobsList = ({ jobs, selectedJob, handleJobClick, hasTopicsCreated, isJobDetailOpen }) => {
  const getCompanyInitial = (companyName) => {
    return companyName.charAt(0).toUpperCase();
  };

  const getCompanyColor = (companyName) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-red-500",
    ];
    const index = companyName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`lg:col-span-1 space-y-3 ${isJobDetailOpen ? "hidden lg:block" : ""}`}>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Top job picks for you
        </h2>
        <p className="text-xs text-slate-600 mb-2">
          Based on your profile and department
        </p>
        <p className="text-xs text-slate-500">{jobs.length} results</p>
      </div>
      <div className="space-y-2">
        {jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => handleJobClick(job)}
            className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-all ${
              selectedJob?._id === job._id
                ? "border-blue-500 ring-2 ring-blue-100"
                : "border-slate-200 hover:border-blue-300"
            }`}
          >
            <div className="p-4">
              <div className="flex gap-3">
                <div
                  className={`w-12 h-12 ${getCompanyColor(job.company)} rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                >
                  {getCompanyInitial(job.company)}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-sm font-semibold text-blue-600 hover:underline mb-1 flex items-center gap-2">
                    {job.title}
                    {hasTopicsCreated(job._id) && (
                      <i
                        className="fas fa-check-circle text-xs text-blue-500"
                        title="Topics added"
                      ></i>
                    )}
                  </h3>
                  <p className="text-sm text-slate-900 mb-1">
                    {job.company}
                  </p>
                  <p className="text-xs text-slate-600 mb-2">
                    {job.location}
                  </p>
                  {hasTopicsCreated(job._id) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                      <i className="fas fa-graduation-cap text-[10px]"></i>
                      Topics Ready
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsList;
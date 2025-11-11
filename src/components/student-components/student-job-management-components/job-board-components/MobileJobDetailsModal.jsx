import React from 'react';

const MobileJobDetailsModal = ({
  isOpen,
  selectedJob,
  onClose,
  onAddToSkillPlanner,
  isInSkillPlanner,
  getTimeSincePosted
}) => {
  if (!isOpen || !selectedJob) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto lg:hidden">
      {/* Header with Close Button */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 z-10">
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <i className="fas fa-arrow-left text-lg text-slate-700"></i>
        </button>
        <h2 className="text-base font-semibold text-slate-900 flex-1">Job Details</h2>
        
        <button 
          onClick={() => onAddToSkillPlanner(selectedJob)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <i className={`fas fa-bullseye text-lg ${isInSkillPlanner(selectedJob._id) ? 'text-green-600' : 'text-slate-600'}`}></i>
        </button>
      </div>

      {/* Job Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-6 text-left">
          <h1 className="text-xl font-bold text-slate-900 mb-1">
            {selectedJob.title}
          </h1>
          <p className="text-sm text-slate-700 mb-2">{selectedJob.company}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-2">
            <span className="inline-flex items-center gap-1">
              <i className="fas fa-calendar"></i>
              Posted {getTimeSincePosted(selectedJob.postedDate)}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <i className="fas fa-users"></i>
              {selectedJob.applicants} applicants
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">{selectedJob.location}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
              {selectedJob.workMode}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
              {selectedJob.jobType}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              disabled
              className="flex-1 px-6 py-2.5 bg-slate-400 text-white font-semibold rounded-full transition-colors inline-flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
              title="Apply functionality coming soon"
            >
              <i className="fas fa-external-link-alt text-xs"></i>
              Apply Now
            </button>
          </div>
        </div>

        {/* Job Description */}
        <div className="border-t border-slate-200 pt-6 text-left">
          <h2 className="text-base font-bold text-slate-900 mb-4">About the job</h2>
          <p className="text-sm text-slate-700 mb-6 leading-relaxed text-left">
            {selectedJob.description}
          </p>

          <h3 className="text-sm font-semibold text-slate-900 mb-3">Requirements</h3>
          <ul className="space-y-2 mb-6">
            {selectedJob.requirements.map((req, index) => (
              <li key={index} className="text-sm text-slate-700 flex items-start gap-2 text-left">
                <i className="fas fa-check text-green-600 text-xs mt-1"></i>
                <span>{req}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-sm font-semibold text-slate-900 mb-3">Skills Required</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedJob.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <p className="text-sm font-semibold text-green-900 mb-1">
              <i className="fas fa-money-bill-wave mr-2"></i>
              Salary Range
            </p>
            <p className="text-sm text-green-800">{selectedJob.salaryRange}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileJobDetailsModal;


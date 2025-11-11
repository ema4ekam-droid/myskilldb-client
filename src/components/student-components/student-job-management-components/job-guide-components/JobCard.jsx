import React from 'react';

const JobCard = ({ 
  job, 
  isJobCompleted, 
  getJobProgress,
  handleOpenJobDetails,
  setShowCompanySwitchModal 
}) => {
  const isLocked = !job.isUnlocked;
  const isComplete = isJobCompleted(job);

  return (
    <div 
      className={`relative bg-white rounded-xl shadow-sm border-2 overflow-visible transition-all ${
        isLocked 
          ? 'border-slate-300 opacity-60 cursor-not-allowed' 
          : isComplete
          ? 'border-green-400 ring-2 ring-green-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer'
          : 'border-indigo-200 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer'
      }`}
      onClick={() => !isLocked && handleOpenJobDetails(job)}
    >
      {/* Level Badge */}
      <div className="absolute bottom-3 right-3 z-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
          isLocked ? 'bg-slate-400' : isComplete ? 'bg-green-500' : 'bg-amber-500'
        }`}>
          {isLocked ? <i className="fas fa-lock"></i> : job.level}
        </div>
      </div>

      {/* Completion Badge */}
      {isComplete && (
        <div className="absolute top-3 right-3 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <i className="fas fa-trophy"></i>
          COMPLETED
        </div>
      )}

      {/* Job Header - Compact */}
      <div className={`bg-gradient-to-r p-5 lg:p-6 ${
        isLocked 
          ? 'from-slate-400 to-slate-500' 
          : isComplete
          ? 'from-green-500 to-emerald-600'
          : 'from-indigo-500 to-purple-600'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 text-left">
            <h2 className="text-lg lg:text-xl font-bold text-white mb-1 truncate">{job.jobName}</h2>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-white text-opacity-90 text-left">{job.company}</p>
              {job.level === 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCompanySwitchModal(true);
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isLocked 
                      ? 'bg-slate-700 hover:bg-slate-600' 
                      : isComplete
                      ? 'bg-green-700 hover:bg-green-600'
                      : 'bg-indigo-700 hover:bg-indigo-600'
                  }`}
                  title="Change Company"
                >
                  <i className="fas fa-exchange-alt text-white text-xs"></i>
                </button>
              )}
            </div>
            <div className="flex items-center bg-gradient-to-br from-green-500 to-green-600 px-3 py-1.5 rounded-full shadow-lg w-fit">
              <span className="text-sm text-white font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>{job.salary}</span>
            </div>
            {job.level === 1 && job.location && (
              <div className="flex items-center gap-3 mt-2 text-xs text-white text-opacity-80">
                <div className="flex items-center gap-1">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="fas fa-laptop-house"></i>
                  <span>{job.remote}</span>
                </div>
              </div>
            )}
          </div>
          <div className="text-right ml-3">
            <p className="text-2xl font-bold text-white">{getJobProgress(job)}%</p>
            <p className="text-xs text-white text-opacity-80">Progress</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${getJobProgress(job)}%` }}
            ></div>
          </div>
        </div>

        {/* Skills Count & EP */}
        <div className="flex items-center justify-center flex-wrap gap-3 pb-6">
          <div className="flex items-center gap-3 text-white text-sm">
            <div className="flex items-center gap-1.5">
              <i className="fas fa-bullseye"></i>
              <span className="font-medium">{job.skills.length} Skills</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fas fa-book"></i>
              <span className="font-medium">{job.skills.filter(s => s.hasModule).length} Modules</span>
            </div>
            {!isLocked && (
              <div className="flex items-center gap-1.5 bg-amber-400 bg-opacity-30 px-2 py-1 rounded-full">
                <i className="fas fa-star text-amber-300 text-xs"></i>
                <span className="font-bold text-amber-100">{job.xpReward} EP</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Button - Centered at Bottom */}
      {isLocked ? (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
          <div className="px-4 py-2 bg-slate-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-not-allowed shadow-lg">
            <i className="fas fa-lock text-[10px]"></i>
            <span>Requires {job.xpRequired} EP</span>
          </div>
        </div>
      ) : isComplete ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenJobDetails(job);
          }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <i className="fas fa-trophy"></i>
          <span>Review Quest</span>
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenJobDetails(job);
          }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <span>Start Quest</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      )}
    </div>
  );
};

export default JobCard;


import React from 'react';
import { toast } from 'react-hot-toast';

const JobDetailsView = ({
  selectedJobForDetails,
  setSelectedJobForDetails,
  jobsWithSkills,
  setJobsWithSkills,
  isJobCompleted,
  checkLevelRequirementsMet,
  getRequirementsProgress,
  handleCloseJobDetails,
  handleViewModule,
  handleGenerateModule,
  setJobDetailsView,
  handlePageChange
}) => {
  const isComplete = isJobCompleted(selectedJobForDetails);

  return (
    <>
      {/* Fixed Header with Controls */}
      <div className={`fixed top-0 left-0 right-0 border-b shadow-sm z-50 ${
        isComplete ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleCloseJobDetails}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            <span className="hidden sm:inline">Back to Quest</span>
          </button>
          
          <div className="flex-1 mx-4 text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                isComplete ? 'bg-green-500' : 'bg-amber-500'
              }`}>
                {selectedJobForDetails.level}
              </div>
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 truncate">{selectedJobForDetails.jobName}</h2>
            </div>
            <p className="text-xs text-slate-600 hidden sm:flex items-center gap-2">
              <span>{selectedJobForDetails.company}</span>
              <span className="inline-flex items-center bg-gradient-to-br from-green-500 to-green-600 px-2 py-0.5 rounded-full text-white text-xs shadow-lg font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {selectedJobForDetails.salary}
              </span>
            </p>
          </div>
          
          <div className="text-right">
            <p className={`text-xl font-bold ${isComplete ? 'text-green-600' : 'text-indigo-600'}`}>
              {getRequirementsProgress(selectedJobForDetails).completed}/{getRequirementsProgress(selectedJobForDetails).total}
            </p>
            <p className="text-xs text-slate-500">Requirements</p>
          </div>
        </div>
      </div>

      {/* Job Details Content */}
      <div className="min-h-screen bg-slate-50 pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Job Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200">
            {/* Job Header */}
            <div className={`bg-gradient-to-r p-6 lg:p-8 ${
              isComplete ? 'from-green-500 to-emerald-600' : 'from-indigo-500 to-purple-600'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${
                      isComplete ? 'bg-green-700 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {selectedJobForDetails.level}
                    </div>
                    <div>
                      <p className="text-xs text-white text-opacity-75">Level {selectedJobForDetails.level} Quest</p>
                      <div className="inline-flex items-center bg-gradient-to-br from-green-500 to-green-600 px-3 py-1 rounded-full shadow-lg mt-1">
                        <span className="text-sm text-white font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>{selectedJobForDetails.salary}</span>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">{selectedJobForDetails.jobName}</h2>
                  <p className="text-base text-white text-opacity-90">{selectedJobForDetails.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {getRequirementsProgress(selectedJobForDetails).completed}/{getRequirementsProgress(selectedJobForDetails).total}
                  </p>
                  <p className="text-sm text-white text-opacity-80">Requirements</p>
                </div>
              </div>
              
              {/* Requirements Progress Bar */}
              <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full transition-all"
                  style={{ 
                    width: `${(getRequirementsProgress(selectedJobForDetails).completed / getRequirementsProgress(selectedJobForDetails).total) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Level Requirements */}
            {selectedJobForDetails.levelRequirements && (
              <div className="p-6 lg:p-8 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-tasks text-indigo-600"></i>
                  Level Requirements
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {getRequirementsProgress(selectedJobForDetails).items.map((req, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        req.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          req.completed ? 'bg-green-500' : 'bg-slate-300'
                        }`}>
                          <i className={`fas fa-${req.icon} text-white`}></i>
                        </div>
                        {req.completed && (
                          <i className="fas fa-check-circle text-green-500 text-xl"></i>
                        )}
                      </div>
                      <p className={`text-sm font-semibold ${
                        req.completed ? 'text-green-900' : 'text-slate-700'
                      }`}>
                        {req.name}
                      </p>
                      {!req.completed ? (
                        <>
                          <p className="text-xs text-slate-500 mt-1 mb-3">Required to unlock next level</p>
                          {req.icon === 'clipboard-list' || req.icon === 'brain' ? (
                            <button
                              onClick={() => {
                                // Simulate taking assessment
                                const assessmentType = req.icon === 'brain' ? 'hard' : 'mid';
                                const updatedJob = {
                                  ...selectedJobForDetails,
                                  progressStatus: {
                                    ...selectedJobForDetails.progressStatus,
                                    assessmentCompleted: true,
                                    assessmentType: assessmentType
                                  }
                                };
                                setSelectedJobForDetails(updatedJob);
                                setJobsWithSkills(prev => prev.map(j => 
                                  j.id === selectedJobForDetails.id ? updatedJob : j
                                ));
                                toast.success(`${assessmentType === 'hard' ? 'Hard' : 'Mid'}-level assessment marked as complete!`);
                              }}
                              className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg font-semibold transition-all"
                            >
                              Take Assessment
                            </button>
                          ) : req.icon === 'certificate' ? (
                            <button
                              onClick={() => {
                                // Simulate getting testimonial
                                const updatedJob = {
                                  ...selectedJobForDetails,
                                  progressStatus: {
                                    ...selectedJobForDetails.progressStatus,
                                    hasTestimonial: true
                                  }
                                };
                                setSelectedJobForDetails(updatedJob);
                                setJobsWithSkills(prev => prev.map(j => 
                                  j.id === selectedJobForDetails.id ? updatedJob : j
                                ));
                                toast.success('Testimonial received!');
                              }}
                              className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg font-semibold transition-all"
                            >
                              Get Testimonial
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                // Simulate adding to CV
                                const updatedJob = {
                                  ...selectedJobForDetails,
                                  progressStatus: {
                                    ...selectedJobForDetails.progressStatus,
                                    addedToCV: true
                                  },
                                  skills: selectedJobForDetails.skills.map(skill => ({
                                    ...skill,
                                    addedToCV: true
                                  }))
                                };
                                setSelectedJobForDetails(updatedJob);
                                setJobsWithSkills(prev => prev.map(j => 
                                  j.id === selectedJobForDetails.id ? updatedJob : j
                                ));
                                toast.success('Skills added to CV!');
                              }}
                              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-semibold transition-all"
                            >
                              Add to CV
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="mt-2 flex items-center gap-1 text-xs text-green-600 font-medium">
                          <i className="fas fa-check"></i>
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {!checkLevelRequirementsMet(selectedJobForDetails) && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-info-circle text-amber-600 mt-0.5"></i>
                      <div>
                        <p className="text-sm font-semibold text-amber-900 mb-1">Complete all requirements to unlock next level</p>
                        <p className="text-xs text-amber-700">
                          Progress: {getRequirementsProgress(selectedJobForDetails).completed} / {getRequirementsProgress(selectedJobForDetails).total} requirements completed
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {checkLevelRequirementsMet(selectedJobForDetails) && (
                  <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <i className="fas fa-trophy text-green-600 text-xl mt-0.5"></i>
                        <div>
                          <p className="text-sm font-bold text-green-900 mb-1">🎉 Level Complete!</p>
                          <p className="text-xs text-green-700">
                            You've completed all requirements. Next level is now unlocked!
                          </p>
                        </div>
                      </div>
                      {selectedJobForDetails.level < 6 && (
                        <button
                          onClick={() => {
                            const nextLevel = selectedJobForDetails.level + 1;
                            
                            // Ensure next level is unlocked
                            setJobsWithSkills(prev => prev.map(j => {
                              if (j.level === nextLevel) {
                                return { ...j, isUnlocked: true };
                              }
                              return j;
                            }));
                            
                            // Find and navigate to next job
                            const nextJob = jobsWithSkills.find(j => j.level === nextLevel);
                            if (nextJob) {
                              const unlockedNextJob = { ...nextJob, isUnlocked: true };
                              setSelectedJobForDetails(unlockedNextJob);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              toast.success(`🚀 Moving to Level ${nextLevel}: ${nextJob.jobName}!`);
                            }
                          }}
                          className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-bold text-sm transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                        >
                          <span>Go to Next Level</span>
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      )}
                      {selectedJobForDetails.level === 6 && (
                        <button
                          onClick={() => {
                            handleCloseJobDetails();
                            toast.success('🎊 Congratulations! You completed all levels!');
                          }}
                          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg font-bold text-sm transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                        >
                          <i className="fas fa-crown"></i>
                          <span>Complete Quest</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Boost Your Job Chances Section */}
            <div className="p-6 lg:p-8 space-y-6 bg-gradient-to-br from-purple-50 to-pink-50">
              {/* Header with EP Goal */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <i className="fas fa-rocket text-purple-600 text-2xl"></i>
                  <h3 className="text-2xl font-bold text-slate-900">Boost Your Job Chances</h3>
                </div>
                <p className="text-sm text-slate-600 max-w-2xl mx-auto mb-4">
                  Earn <span className="font-bold text-indigo-600">400 EP</span> by completing activities across <span className="font-bold">LEARN • PROVE • EXPRESS</span> to maximize your success rate!
                </p>
                
                {/* EP Goal Progress Tracker */}
                <div className="bg-white rounded-xl shadow-lg p-5 max-w-3xl mx-auto border-2 border-indigo-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-left">
                      <p className="text-xs text-slate-500 mb-1">Your EP Progress</p>
                      <p className="text-3xl font-bold text-slate-900">0 <span className="text-lg text-slate-500">/ 400 EP</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Job Success Rate</p>
                      <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">0%</div>
                        <i className="fas fa-arrow-up text-green-600"></i>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                      style={{ width: '0%' }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-700">Target: 400 EP</span>
                    </div>
                  </div>
                  
                  {/* Milestone Markers */}
                  <div className="flex justify-between mt-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-flag text-slate-400"></i>
                      Start
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-star text-amber-500"></i>
                      200 EP
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-trophy text-green-600"></i>
                      400 EP Goal
                    </span>
                  </div>
                </div>

                {/* Three Pillars Banner */}
                <div className="grid grid-cols-3 gap-3 mt-6 max-w-3xl mx-auto">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-3 text-white shadow-lg">
                    <i className="fas fa-book-open text-2xl mb-2"></i>
                    <p className="font-bold text-sm">LEARN</p>
                    <p className="text-xs opacity-90">Build Knowledge</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-3 text-white shadow-lg">
                    <i className="fas fa-shield-check text-2xl mb-2"></i>
                    <p className="font-bold text-sm">PROVE</p>
                    <p className="text-xs opacity-90">Show Skills</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-3 text-white shadow-lg">
                    <i className="fas fa-bullhorn text-2xl mb-2"></i>
                    <p className="font-bold text-sm">EXPRESS</p>
                    <p className="text-xs opacity-90">Share Expertise</p>
                  </div>
                </div>
              </div>

              {/* Skills with Activities */}
              <div className="space-y-6">
                {selectedJobForDetails.skills.map((skill) => (
                  <div key={skill.id} className="bg-white rounded-xl shadow-md border-2 border-purple-200 overflow-hidden">
                    {/* Skill Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                            <i className="fas fa-bullseye text-indigo-600"></i>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">{skill.name}</h4>
                            <p className="text-xs text-white text-opacity-80">{skill.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activity Cards Grid */}
                    <div className="p-5">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        
                        {/* 1. LEARN - Learning Resources */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-300 relative">
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            LEARN
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                              <i className="fas fa-book-open text-white text-sm"></i>
                            </div>
                            <h5 className="font-bold text-slate-900 text-sm">Build Knowledge</h5>
                          </div>
                          <p className="text-xs text-slate-600 mb-3" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
                            Master the fundamentals
                          </p>
                          
                          <div className="space-y-2">
                            {/* Reading Module */}
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <i className="fas fa-book text-blue-600 text-xs"></i>
                                <span className="text-xs text-slate-700 truncate">Reading Module</span>
                                {skill.hasModule && <i className="fas fa-check-circle text-green-500 text-xs"></i>}
                              </div>
                              <span className="text-xs font-bold text-orange-600">+5 EP</span>
                            </div>

                            {/* Action Button */}
                            <button
                              onClick={() => {
                                if (skill.hasModule) {
                                  handleViewModule(selectedJobForDetails, skill);
                                  setJobDetailsView(false);
                                } else {
                                  handleGenerateModule(selectedJobForDetails, skill);
                                  setJobDetailsView(false);
                                }
                              }}
                              className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                                skill.hasModule
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md'
                              }`}
                            >
                              <i className={`fas ${skill.hasModule ? 'fa-book-reader' : 'fa-magic'}`}></i>
                              {skill.hasModule ? 'Read Again' : 'Generate'}
                            </button>
                          </div>
                        </div>

                        {/* 2. PROVE - Evidence & Proof */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300 relative">
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            PROVE
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                              <i className="fas fa-shield-check text-white text-base"></i>
                            </div>
                            <h5 className="font-bold text-slate-900 text-sm">Show Your Skills</h5>
                          </div>
                          <p className="text-xs text-slate-600 mb-3" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
                            Validate your expertise
                          </p>
                          
                          <div className="space-y-2">
                            {/* Easy Assessment */}
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <i className="fas fa-clipboard-check text-green-600 text-xs"></i>
                                <span className="text-xs text-slate-700 truncate">Easy Test</span>
                              </div>
                              <span className="text-xs font-bold text-orange-600">+5 EP</span>
                            </div>

                            {/* Mid Assessment */}
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <i className="fas fa-clipboard-list text-blue-600 text-xs"></i>
                                <span className="text-xs text-slate-700 truncate">Mid Test</span>
                              </div>
                              <span className="text-xs font-bold text-orange-600">+10 EP</span>
                            </div>

                            {/* Hard Assessment */}
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <i className="fas fa-brain text-purple-600 text-xs"></i>
                                <span className="text-xs text-slate-700 truncate">Hard Test</span>
                              </div>
                              <span className="text-xs font-bold text-orange-600">+15 EP</span>
                            </div>

                            {/* Certification */}
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <i className="fas fa-certificate text-indigo-600 text-xs"></i>
                                <span className="text-xs text-slate-700 truncate">Certification</span>
                              </div>
                              <span className="text-xs font-bold text-orange-600">+20 EP</span>
                            </div>

                            {/* Decorative Icon */}
                            <div className="flex justify-center py-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                                <i className="fas fa-check text-white text-sm"></i>
                              </div>
                            </div>

                            {/* Action Button */}
                            <button
                              onClick={() => {
                                handleCloseJobDetails();
                                handlePageChange('skill-planner');
                              }}
                              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                            >
                              <i className="fas fa-tasks"></i>
                              Take Tests
                            </button>
                          </div>
                        </div>

                        {/* 3. EXPRESS - Content & Sharing */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-300 relative">
                          <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            EXPRESS
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                              <i className="fas fa-bullhorn text-white text-sm"></i>
                            </div>
                            <h5 className="font-bold text-slate-900 text-sm">Share Expertise</h5>
                          </div>
                          <p className="text-xs text-slate-600 mb-3" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
                            Build your professional presence
                          </p>
                          
                          <div className="space-y-2">
                            {/* LinkedIn Post */}
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <i className="fab fa-linkedin text-blue-600 text-xs"></i>
                                <span className="text-xs text-slate-700 truncate">LinkedIn Post</span>
                              </div>
                              <span className="text-xs font-bold text-orange-600">+5 EP</span>
                            </div>

                            {/* Skill Video */}
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <i className="fas fa-video text-red-600 text-xs"></i>
                                <span className="text-xs text-slate-700 truncate">Skill Video</span>
                              </div>
                              <span className="text-xs font-bold text-orange-600">+10 EP</span>
                            </div>

                            {/* Add to CV */}
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <i className="fas fa-file-alt text-teal-600 text-xs"></i>
                                <span className="text-xs text-slate-700 truncate">Add to CV</span>
                              </div>
                              <span className="text-xs font-bold text-orange-600">+20 EP</span>
                            </div>

                            {/* Action Button */}
                            <button
                              onClick={() => {
                                handleCloseJobDetails();
                                handlePageChange('skill-planner');
                              }}
                              className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                            >
                              <i className="fas fa-rocket"></i>
                              Go to Planner
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Bonus EP Info */}
                      <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-lightbulb text-amber-600"></i>
                          <p className="text-xs text-slate-700">
                            <span className="font-bold text-amber-700">Pro Tip:</span> Score 85%+ on assessments for +25 EP bonus, or 100% for +35 EP bonus!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Success Formula Card */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-center text-white shadow-xl border-4 border-white">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <i className="fas fa-trophy text-amber-300 text-3xl animate-pulse"></i>
                  <h4 className="text-xl font-bold">The Success Formula</h4>
                </div>
                
                {/* Formula Display */}
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-3 text-sm font-bold flex-wrap">
                    <span className="bg-blue-500 px-3 py-1 rounded-full">LEARN</span>
                    <span>+</span>
                    <span className="bg-green-500 px-3 py-1 rounded-full">PROVE</span>
                    <span>+</span>
                    <span className="bg-purple-500 px-3 py-1 rounded-full">EXPRESS</span>
                    <span className="text-xl">=</span>
                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1 rounded-full text-lg">400 EP</span>
                  </div>
                </div>

                <p className="text-sm opacity-90 mb-4 max-w-2xl mx-auto">
                  Employers prioritize candidates who <span className="font-bold">learn continuously</span>, 
                  <span className="font-bold"> prove their skills</span>, and 
                  <span className="font-bold"> express their knowledge</span>. 
                  Reach 400 EP to maximize your chances!
                </p>

                {/* Success Rate Indicators */}
                <div className="grid grid-cols-3 gap-3 mb-4 max-w-xl mx-auto">
                  <div className="bg-white bg-opacity-10 rounded-lg p-2">
                    <p className="text-xs text-slate-900 opacity-75">0-133 EP</p>
                    <p className="font-bold text-slate-900">30%</p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-2">
                    <p className="text-xs text-slate-900 opacity-75">134-266 EP</p>
                    <p className="font-bold text-slate-900">60%</p>
                  </div>
                  <div className="bg-amber-400 bg-opacity-90 rounded-lg p-2 text-slate-900">
                    <p className="text-xs font-semibold">267-400 EP</p>
                    <p className="font-bold text-lg">90%+</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    handleCloseJobDetails();
                    handlePageChange('skill-planner');
                  }}
                  className="px-6 py-3 bg-white hover:bg-amber-50 text-indigo-600 rounded-lg font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
                >
                  <i className="fas fa-rocket"></i>
                  Start Earning EP in Skill Planner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetailsView;


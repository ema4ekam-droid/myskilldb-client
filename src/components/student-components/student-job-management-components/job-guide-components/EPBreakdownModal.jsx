import React from 'react';

const EPBreakdownModal = ({ isOpen, onClose, EP_REWARDS }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="fas fa-star text-2xl text-orange-500"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Effort Points (EP)</h2>
                <p className="text-sm opacity-90">How to earn EP and level up your career</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
            >
              <i className="fas fa-times text-orange-500"></i>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Introduction */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-slate-700 text-sm leading-relaxed">
              <strong className="text-amber-700">Effort Points (EP)</strong> are earned by actively engaging with skills and completing various learning activities. The more effort you put in, the more EP you earn!
            </p>
          </div>

          {/* EP Earning Methods */}
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-list-check text-indigo-600"></i>
            Ways to Earn EP
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Assessment Types */}
            <EPCard icon="clipboard-check" iconColor="green" title="Taking Easy Assessment" desc="Complete a basic level assessment" ep={EP_REWARDS.easyAssessment} />
            <EPCard icon="clipboard-list" iconColor="blue" title="Taking Mid-Level Assessment" desc="Challenge with intermediate questions" ep={EP_REWARDS.midAssessment} />
            <EPCard icon="brain" iconColor="purple" title="Taking Hard Assessment" desc="Master advanced concepts" ep={EP_REWARDS.hardAssessment} />
            <EPCard icon="trophy" iconColor="green" title="Scoring 85%+ on Assessment" desc="Demonstrate strong understanding" ep={EP_REWARDS.assessment85} highlight="green" />
            <EPCard icon="crown" iconColor="amber" title="Perfect Score (100%)" desc="Achieve complete mastery" ep={EP_REWARDS.assessment100} highlight="amber" />
            <EPCard icon="certificate" iconColor="indigo" title="Adding Certifications" desc="Upload course completion certificates" ep={EP_REWARDS.certification} />
            <EPCard icon="linkedin" iconColor="blue" title="Creating LinkedIn Posts" desc="Share your learning journey" ep={EP_REWARDS.linkedinPost} brand />
            <EPCard icon="video" iconColor="red" title="Adding Skill Videos" desc="Record and upload skill demos" ep={EP_REWARDS.skillVideo} />
            <EPCard icon="file-alt" iconColor="teal" title="Adding Skill to CV" desc="Add verified skills after assessments" ep={EP_REWARDS.cvSkillAdd} />
            <EPCard icon="book-open" iconColor="orange" title="Completing Read Modules" desc="Complete learning modules" ep={EP_REWARDS.readModule} />
          </div>

          {/* Total Potential EP */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="text-center lg:text-left">
                <h4 className="font-bold text-indigo-900 mb-1">Maximum EP Per Skill</h4>
                <p className="text-sm text-indigo-700">Complete all activities to maximize your EP earnings</p>
              </div>
              <div className="text-center lg:text-right">
                <div className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg">
                  <i className="fas fa-bolt text-yellow-300"></i>
                  <span className="text-2xl font-bold text-white">
                    {Object.values(EP_REWARDS).reduce((a, b) => a + b, 0)} EP
                  </span>
                </div>
                <p className="text-xs text-indigo-600 mt-1">per skill maximum</p>
              </div>
            </div>
          </div>

          {/* Tip Section */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <i className="fas fa-lightbulb text-amber-500 text-xl mt-0.5"></i>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Pro Tip</h4>
                <p className="text-sm text-amber-800">
                  Focus on completing assessments with high scores and adding verifiable evidence like certifications and videos to earn EP faster and unlock higher-paying jobs!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 p-4 rounded-b-xl border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-md"
          >
            Got it! Let's Earn EP
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for EP cards
const EPCard = ({ icon, iconColor, title, desc, ep, highlight, brand }) => (
  <div className={`flex items-start gap-2 p-3 rounded-lg border transition-all hover:shadow-md ${
    highlight 
      ? `bg-gradient-to-r from-${highlight}-50 to-${highlight === 'amber' ? 'yellow' : 'emerald'}-50 border-2 border-${highlight}-${highlight === 'amber' ? '300' : '200'}` 
      : 'bg-slate-50 border-slate-200'
  }`}>
    <div className={`w-10 h-10 bg-${iconColor}-${highlight ? '500' : '100'} rounded-full flex items-center justify-center flex-shrink-0`}>
      <i className={`${brand ? 'fab' : 'fas'} fa-${icon} text-${highlight ? 'white' : iconColor + '-600'} text-sm`}></i>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-slate-900 text-sm mb-0.5">{title}</h4>
      <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
    </div>
    <div className={`flex items-center gap-1 ${highlight ? `bg-${highlight}-500` : 'bg-amber-100'} px-2 py-1 rounded-full flex-shrink-0`}>
      <i className={`fas fa-star text-${highlight ? 'white' : 'amber-600'} text-[10px]`}></i>
      <span className={`font-bold text-${highlight ? 'white' : 'amber-700'} text-xs`}>+{ep}</span>
    </div>
  </div>
);

export default EPBreakdownModal;


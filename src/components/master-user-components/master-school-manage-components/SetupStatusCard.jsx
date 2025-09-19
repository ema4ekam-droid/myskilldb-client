import React from 'react';

const SetupStatusCard = ({ 
  selectedSchool, 
  schoolSetupStatus, 
  schools, 
  onStartSetup 
}) => {
  if (!selectedSchool) return null;

  const isSetupCompleted = schoolSetupStatus[selectedSchool]?.completed || false;
  const schoolName = schools.find(s => s.id === selectedSchool)?.name;

  if (!isSetupCompleted) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-exclamation-triangle text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-amber-900">School Setup Required</h3>
            <p className="text-amber-700 text-sm">Complete school setup before managing logins</p>
          </div>
        </div>
        <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 mb-4">
          <p className="text-amber-800 text-sm">
            <strong>Have you completed the school setup wizard?</strong><br/>
            If not, complete it first to create the necessary school structure and generate login accounts.
          </p>
        </div>
        <button
          onClick={onStartSetup}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-3 rounded-lg text-sm transition-colors"
        >
          Complete School Setup First
        </button>
      </div>
    );
  } else {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-check-circle text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-green-900">Setup Complete</h3>
            <p className="text-green-700 text-sm">School setup completed - you can now manage logins</p>
          </div>
        </div>
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
          <p className="text-green-800 text-sm">
            <strong>Setup completed on:</strong> {new Date(schoolSetupStatus[selectedSchool]?.completedAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={onStartSetup}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-3 rounded-lg text-sm transition-colors"
        >
          Re-run Setup Wizard
        </button>
      </div>
    );
  }
};

export default SetupStatusCard;

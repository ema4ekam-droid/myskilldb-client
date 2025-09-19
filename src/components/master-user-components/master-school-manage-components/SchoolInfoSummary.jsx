import React from 'react';

const SchoolInfoSummary = ({ 
  selectedSchool, 
  selectedState, 
  selectedDistrict, 
  schools, 
  schoolSetupStatus 
}) => {
  if (!selectedSchool) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4">School Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-900">Selected School</h4>
          <p className="text-slate-600">{schools.find(s => s.id === selectedSchool)?.name}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-900">Location</h4>
          <p className="text-slate-600">{selectedDistrict}, {selectedState}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-900">Setup Status</h4>
          <p className={`text-sm font-medium ${
            schoolSetupStatus[selectedSchool]?.completed 
              ? 'text-green-600' 
              : 'text-amber-600'
          }`}>
            {schoolSetupStatus[selectedSchool]?.completed 
              ? '✓ Setup Complete' 
              : '⚠ Setup Required'}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-900">Login Types Available</h4>
          <p className="text-slate-600">4 types (Principal, HOD, Teacher, Parent/Student)</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolInfoSummary;

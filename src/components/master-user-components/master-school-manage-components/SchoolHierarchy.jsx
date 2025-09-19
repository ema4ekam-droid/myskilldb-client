import React from 'react';

const SchoolHierarchy = ({ 
  selectedState, 
  selectedDistrict, 
  selectedSchool,
  selectedLoginType,
  states, 
  districts, 
  schools,
  loginTypes,
  onStateSelect,
  onDistrictSelect,
  onSchoolSelect,
  onLoginTypeSelect,
  isLoadingStates,
  isLoadingDistricts,
  isLoadingSchools
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold mb-6 text-slate-900">School Login Management</h2>
      
      {/* Hierarchy Tree */}
      <div className="space-y-6">
        {/* Level 1: State Selection */}
        <div className={`relative p-4 rounded-lg transition-colors ${
          selectedState ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-white border-2 border-slate-100'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
              selectedState ? 'bg-indigo-600' : 'bg-indigo-500'
            }`}>
              1
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-2 ${
                selectedState ? 'text-indigo-900' : 'text-slate-900'
              }`}>Select State</h3>
              <select
                value={selectedState || ''}
                onChange={(e) => onStateSelect(e.target.value)}
                className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                disabled={isLoadingStates}
              >
                <option value="">Choose a state...</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Connection Line */}
          {selectedState && (
            <div className="absolute left-4 top-12 w-0.5 h-6 bg-slate-300"></div>
          )}
        </div>

        {/* Level 2: District Selection */}
        {selectedState && (
          <div className={`relative ml-8 p-4 rounded-lg transition-colors ${
            selectedDistrict ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-white border-2 border-slate-100'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                selectedDistrict ? 'bg-emerald-600' : 'bg-emerald-500'
              }`}>
                2
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${
                  selectedDistrict ? 'text-emerald-900' : 'text-slate-900'
                }`}>Select District</h3>
                <select
                  value={selectedDistrict || ''}
                  onChange={(e) => onDistrictSelect(e.target.value)}
                  className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  disabled={isLoadingDistricts}
                >
                  <option value="">Choose a district...</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Connection Line */}
            {selectedDistrict && (
              <div className="absolute left-4 top-12 w-0.5 h-6 bg-slate-300"></div>
            )}
          </div>
        )}

        {/* Level 3: School Selection */}
        {selectedDistrict && (
          <div className={`relative ml-16 p-4 rounded-lg transition-colors ${
            selectedSchool ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white border-2 border-slate-100'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                selectedSchool ? 'bg-blue-600' : 'bg-blue-500'
              }`}>
                3
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${
                  selectedSchool ? 'text-blue-900' : 'text-slate-900'
                }`}>Select School</h3>
                <select
                  value={selectedSchool || ''}
                  onChange={(e) => onSchoolSelect(e.target.value)}
                  className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isLoadingSchools}
                >
                  <option value="">Choose a school...</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Connection Line */}
            {selectedSchool && (
              <div className="absolute left-4 top-12 w-0.5 h-6 bg-slate-300"></div>
            )}
          </div>
        )}

        {/* Level 4: Login Types */}
        {selectedSchool && (
          <div className="relative ml-24 p-4 rounded-lg bg-purple-50 border-2 border-purple-200">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-4">Create Login Accounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loginTypes.map((loginType, index) => {
                    const isSelected = selectedLoginType === loginType.id;
                    return (
                    <div
                      key={loginType.id}
                      className={`rounded-lg p-4 transition-colors cursor-pointer min-h-[80px] ${
                        isSelected
                          ? loginType.id === 'principal' ? 'bg-red-100 border-2 border-red-400 shadow-md' :
                            loginType.id === 'hod' ? 'bg-orange-100 border-2 border-orange-400 shadow-md' :
                            loginType.id === 'teacher' ? 'bg-green-100 border-2 border-green-400 shadow-md' :
                            'bg-blue-100 border-2 border-blue-400 shadow-md'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                      }`}
                      onClick={() => onLoginTypeSelect(loginType.id)}
                    >
                      <div className="flex flex-col items-center justify-center text-center space-y-3 h-full">
                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white ${
                          loginType.id === 'principal' ? 'bg-red-500' :
                          loginType.id === 'hod' ? 'bg-orange-500' :
                          loginType.id === 'teacher' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}>
                          <i className={`${loginType.icon} text-xl`}></i>
                        </div>
                        <div>
                          <h4 className={`font-semibold text-sm ${
                            isSelected
                              ? loginType.id === 'principal' ? 'text-red-900' :
                                loginType.id === 'hod' ? 'text-orange-900' :
                                loginType.id === 'teacher' ? 'text-green-900' :
                                'text-blue-900'
                              : 'text-slate-900'
                          }`}>{loginType.name}</h4>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Progress:</span>
          <div className="flex-1 bg-slate-200 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${selectedSchool ? 100 : selectedDistrict ? 75 : selectedState ? 50 : 25}%` 
              }}
            ></div>
          </div>
          <span className="text-sm font-medium text-slate-600">
            {selectedSchool ? '4/4' : selectedDistrict ? '3/4' : selectedState ? '2/4' : '1/4'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SchoolHierarchy;

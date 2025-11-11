import React from 'react';

const CompanySwitchModal = ({ 
  isOpen, 
  onClose, 
  alternativeCompanies, 
  currentCompany,
  onSelectCompany 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="fas fa-building text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Switch Focus Company</h2>
                <p className="text-sm opacity-90">Choose a company offering similar salary for Level 1</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-slate-600 text-sm">
              All companies below offer the same salary range (<span className="font-semibold text-indigo-600">Upto 2 lacs per annum</span>). 
              Choose the one that matches your location and work mode preference.
            </p>
          </div>

          <div className="space-y-3">
            {alternativeCompanies['level-1'].map((companyData, index) => {
              const isCurrentCompany = currentCompany === companyData.company;
              return (
                <button
                  key={index}
                  onClick={() => onSelectCompany(companyData)}
                  disabled={isCurrentCompany}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    isCurrentCompany
                      ? 'border-green-500 bg-green-50 cursor-default'
                      : 'border-slate-200 hover:border-indigo-500 hover:shadow-md bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{companyData.company}</h3>
                        {isCurrentCompany && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                            <i className="fas fa-check text-[10px]"></i>
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-indigo-600 mb-3">{companyData.jobName}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        {/* Location */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-map-marker-alt text-blue-600 text-xs"></i>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Location</p>
                            <p className="text-sm font-semibold text-slate-900">{companyData.location}</p>
                          </div>
                        </div>

                        {/* Work Mode */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-laptop-house text-purple-600 text-xs"></i>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Work Mode</p>
                            <p className="text-sm font-semibold text-slate-900">{companyData.remote}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isCurrentCompany && (
                      <div className="ml-4 flex items-center">
                        <i className="fas fa-arrow-right text-indigo-600"></i>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 p-4 rounded-b-xl border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanySwitchModal;


import React from 'react';

const StatsCards = ({ totalCountries, totalStates, totalDistricts, totalSyllabi }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total Countries Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-globe text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-900">Total Countries</h3>
            <p className="text-3xl font-bold text-blue-700">{totalCountries}</p>
            <p className="text-blue-600 text-sm">Countries registered</p>
          </div>
        </div>
      </div>

      {/* Total States Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-map-marker-alt text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900">Total States</h3>
            <p className="text-3xl font-bold text-green-700">{totalStates}</p>
            <p className="text-green-600 text-sm">States registered</p>
          </div>
        </div>
      </div>

      {/* Total Districts Card */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-map-pin text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-900">Total Districts</h3>
            <p className="text-3xl font-bold text-purple-700">{totalDistricts}</p>
            <p className="text-purple-600 text-sm">Districts registered</p>
          </div>
        </div>
      </div>

      {/* Total Syllabi Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-book text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900">Total Syllabi</h3>
            <p className="text-3xl font-bold text-amber-700">{totalSyllabi}</p>
            <p className="text-amber-600 text-sm">Syllabi registered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
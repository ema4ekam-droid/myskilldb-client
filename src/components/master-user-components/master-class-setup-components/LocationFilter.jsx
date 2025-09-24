import React from 'react';

const LocationFilter = ({ 
  selectedCountry, 
  selectedState, 
  selectedDistrict,
  countries,
  filteredStates,
  filteredDistricts,
  onCountryChange,
  onStateChange,
  onDistrictChange,
  inputBaseClass
}) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold mb-4 text-slate-900">Filter by Location</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
          <select
            className={inputBaseClass}
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
          <select
            className={inputBaseClass}
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            disabled={!selectedCountry}
          >
            <option value="">All States</option>
            {filteredStates.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">District</label>
          <select
            className={inputBaseClass}
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">All Districts</option>
            {filteredDistricts.map((district) => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default LocationFilter;

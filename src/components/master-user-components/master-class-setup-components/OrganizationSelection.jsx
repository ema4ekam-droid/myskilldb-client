const OrganizationSelection = ({
  locations,
  selectedCountry,
  selectedState,
  selectedDistrict,
  selectedOrganization,
  organizations,
  isLoading,
  onCountryChange,
  onStateChange,
  onDistrictChange,
  onOrganizationChange,
  getSelectedOrganizationInfo,
  inputBaseClass
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Select Organization</h2>
          <p className="text-slate-500 text-sm">Choose country, state, district, and organization to manage class setup</p>
        </div>
        {selectedOrganization && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="text-green-800 font-medium">
                {getSelectedOrganizationInfo()?.name}
              </span>
            </div>
            <p className="text-green-600 text-sm">
              {selectedState}, {selectedCountry}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Country *
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className={inputBaseClass}
            required
          >
            <option value="">Select Country</option>
            {locations.countries.map((country) => (
              <option key={country.code} value={country.name}>{country.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            State *
          </label>
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className={inputBaseClass}
            disabled={!selectedCountry}
            required
          >
            <option value="">Select State</option>
            {locations.states.map((state) => (
              <option key={state.code} value={state.name}>{state.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            District *
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className={inputBaseClass}
            disabled={!selectedState}
            required
          >
            <option value="">Select District</option>
            {locations.districts.map((district) => (
              <option key={district.code} value={district.name}>{district.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Organization *
          </label>
          <select
            value={selectedOrganization}
            onChange={(e) => onOrganizationChange(e.target.value)}
            className={inputBaseClass}
            disabled={!selectedDistrict || isLoading}
            required
          >
            <option value="">Select Organization</option>
            {organizations.map(org => (
              <option key={org._id} value={org._id}>{org.name}</option>
            ))}
          </select>
          {isLoading && selectedDistrict && (
            <p className="text-sm text-slate-500 mt-1">Loading organizations...</p>
          )}
        </div>
      </div>

      {!selectedOrganization && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-3">
            <i className="fas fa-info-circle text-amber-600"></i>
            <div>
              <h3 className="font-semibold text-amber-900">Organization Selection Required</h3>
              <p className="text-sm text-amber-700">Please select a country, state, district, and organization to manage class setup and assignments.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSelection;
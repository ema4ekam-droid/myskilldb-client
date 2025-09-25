import React, { useState } from 'react';
import Pagination from "../shared/Pagination";

const DistrictTable = ({ 
  districts, 
  countries, 
  states, 
  selectedCountry, 
  selectedState, 
  onCountryFilter, 
  onStateFilter, 
  onAddDistrict, 
  onEditDistrict, 
  onDeleteDistrict, 
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', countryCode: '', stateCode: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Map form data to match backend schema
    const districtData = {
      district: formData.name,
      districtCode: formData.code,
      countryCode: formData.countryCode,
      stateCode: formData.stateCode
    };
    
    if (editingDistrict) {
      onEditDistrict(editingDistrict._id, districtData);
    } else {
      onAddDistrict(districtData);
    }
    setIsModalOpen(false);
    setFormData({ name: '', code: '', countryCode: '', stateCode: '' });
    setEditingDistrict(null);
  };

  const handleEdit = (district) => {
    setEditingDistrict(district);
    setFormData({ 
      name: district.district, 
      code: district.districtCode, 
      countryCode: district.countryCode, 
      stateCode: district.stateCode 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (districtId) => {
    if (confirm('Are you sure you want to delete this district?')) {
      onDeleteDistrict(districtId);
    }
  };

  // Filter districts by selected country and state codes
  const filteredDistricts = districts.filter(district => {
    if (selectedCountry && district.countryCode !== selectedCountry) return false;
    if (selectedState && district.stateCode !== selectedState) return false;
    return true;
  });

  // Filter states by selected country code
  const filteredStates = selectedCountry
    ? states.filter(state => state.countryCode === selectedCountry)
    : states;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Districts</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>Add District
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={selectedCountry || ''}
            onChange={(e) => onCountryFilter(e.target.value)}
            className="bg-slate-100 border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country._id} value={country.countryCode}>
                {country.country}
              </option>
            ))}
          </select>
          <select
            value={selectedState || ''}
            onChange={(e) => onStateFilter(e.target.value)}
            className="bg-slate-100 border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={!selectedCountry}
          >
            <option value="">All States</option>
            {filteredStates.map((state) => (
              <option key={state._id} value={state.stateCode}>
                {state.state}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 text-left font-semibold">District Name</th>
              <th className="p-3 text-left font-semibold">District Code</th>
              <th className="p-3 text-left font-semibold">State</th>
              <th className="p-3 text-left font-semibold">Country</th>
              <th className="p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredDistricts.length > 0 ? filteredDistricts.map((district) => (
              <tr key={district._id} className="hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-900">{district.district}</td>
                <td className="p-3 text-slate-600">{district.districtCode}</td>
                <td className="p-3 text-slate-600">
                  {states.find(s => s.stateCode === district.stateCode)?.state || 'Unknown'}
                </td>
                <td className="p-3 text-slate-600">
                  {countries.find(c => c.countryCode === district.countryCode)?.country || 'Unknown'}
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(district)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(district._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-500">
                  {isLoading ? 'Loading...' : 'No districts found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={districts.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingDistrict ? 'Edit District' : 'Add New District'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Country *</label>
                <select
                  value={formData.countryCode}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, countryCode: e.target.value, stateCode: '' }));
                  }}
                  className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country._id} value={country.countryCode}>
                      {country.country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                <select
                  value={formData.stateCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, stateCode: e.target.value }))}
                  className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  disabled={!formData.countryCode}
                  required
                >
                  <option value="">Select State</option>
                  {states.filter(s => s.countryCode === formData.countryCode).map((state) => (
                    <option key={state._id} value={state.stateCode}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">District Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter district name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">District Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., BLR, CHN, MUM"
                  maxLength="3"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ name: '', code: '', countryCode: '', stateCode: '' });
                    setEditingDistrict(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm"
                >
                  {editingDistrict ? 'Update' : 'Add'} District
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictTable;
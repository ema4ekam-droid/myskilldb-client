import React, { useState } from 'react';

const CountryTable = ({ countries, onAddCountry, onEditCountry, onDeleteCountry, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCountry) {
      onEditCountry(editingCountry.id, formData);
    } else {
      onAddCountry(formData);
    }
    setIsModalOpen(false);
    setFormData({ name: '', code: '' });
    setEditingCountry(null);
  };

  const handleEdit = (country) => {
    setEditingCountry(country);
    setFormData({ name: country.name, code: country.code });
    setIsModalOpen(true);
  };

  const handleDelete = (countryId) => {
    if (confirm('Are you sure you want to delete this country?')) {
      onDeleteCountry(countryId);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Countries</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>Add Country
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 text-left font-semibold">Country Name</th>
              <th className="p-3 text-left font-semibold">Country Code</th>
              <th className="p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {countries.length > 0 ? countries.map((country) => (
              <tr key={country.id} className="hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-900">{country.name}</td>
                <td className="p-3 text-slate-600">{country.code}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(country)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(country.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="text-center p-6 text-slate-500">
                  {isLoading ? 'Loading...' : 'No countries found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingCountry ? 'Edit Country' : 'Add New Country'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Country Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter country name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Country Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., IN, US, UK"
                  maxLength="3"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ name: '', code: '' });
                    setEditingCountry(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm"
                >
                  {editingCountry ? 'Update' : 'Add'} Country
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryTable;

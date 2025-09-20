import React, { useState } from "react";

const StateTable = ({
  states,
  countries,
  selectedCountry,
  onCountryFilter,
  onAddState,
  onEditState,
  onDeleteState,
  isLoading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    countryCode: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Map form data to match backend schema
    const stateData = {
      state: formData.name,
      stateCode: formData.code,
      countryCode: formData.countryCode,
    };

    if (editingState) {
      onEditState(editingState._id, stateData);
    } else {
      onAddState(stateData);
    }
    setIsModalOpen(false);
    setFormData({ name: "", code: "", countryCode: "" });
    setEditingState(null);
  };

  const handleEdit = (state) => {
    setEditingState(state);
    setFormData({
      name: state.state,
      code: state.stateCode,
      countryCode: state.countryCode,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (stateId) => {
    if (
      confirm(
        "Deleting this state will also remove all its districts. Continue?"
      )
    ) {
      onDeleteState(stateId);
    }
  };

  // Filter states by selected country code
  const filteredStates = selectedCountry
    ? states.filter((state) => state.countryCode === selectedCountry)
    : states;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">States</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>Add State
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-3">
          <select
            value={selectedCountry || ""}
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
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 text-left font-semibold">State Name</th>
              <th className="p-3 text-left font-semibold">State Code</th>
              <th className="p-3 text-left font-semibold">Country</th>
              <th className="p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <tr key={state._id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-900">
                    {state.state}
                  </td>
                  <td className="p-3 text-slate-600">{state.stateCode}</td>
                  <td className="p-3 text-slate-600">
                    {countries.find((c) => c.countryCode === state.countryCode)
                      ?.country || "Unknown"}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(state)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(state._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-6 text-slate-500">
                  {isLoading ? "Loading..." : "No states found"}
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
                {editingState ? "Edit State" : "Add New State"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country *
                </label>
                <select
                  value={formData.countryCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      countryCode: e.target.value,
                    }))
                  }
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter state name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., KA, TN, MH"
                  maxLength="3"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ name: "", code: "", countryCode: "" });
                    setEditingState(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm"
                >
                  {editingState ? "Update" : "Add"} State
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateTable;

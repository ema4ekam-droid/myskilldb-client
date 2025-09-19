import React from 'react';

const LocationsTable = ({ 
  filteredLocations, 
  isLoadingLocations, 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold mb-4 text-slate-900">All Locations</h2>
      <input
        type="text"
        className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
        placeholder="Search by state or district..."
        value={searchTerm}
        onChange={onSearchChange}
      />
      
      <div className="h-[60vh] overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="text-slate-500 border-b border-slate-200 sticky top-0 bg-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">State</th>
              <th className="py-3 px-4 text-left font-semibold">District</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoadingLocations ? (
              <tr>
                <td colSpan="2" className="text-center py-8 text-slate-500">Loading locations...</td>
              </tr>
            ) : filteredLocations.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center py-8 text-slate-500">No locations found.</td>
              </tr>
            ) : (
              filteredLocations.map((location, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{location.state}</td>
                  <td className="py-3 px-4 text-slate-600">{location.district}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LocationsTable;

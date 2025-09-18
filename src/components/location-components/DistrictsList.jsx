import React from 'react';

const DistrictsList = ({ 
  selectedState, 
  districts, 
  isLoadingDistricts, 
  newDistrictName, 
  onDistrictNameChange, 
  onAddDistrict, 
  onDeleteDistrict 
}) => {
  return (
    <section className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        {selectedState ? `Districts in ${selectedState}` : 'Districts'}
      </h2>
      
      {selectedState ? (
        <div>
          <form onSubmit={onAddDistrict} className="flex gap-2 mb-4">
            <input
              type="text"
              className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="New District Name"
              value={newDistrictName}
              onChange={(e) => onDistrictNameChange(e.target.value)}
              required
            />
            <button type="submit" className="font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95 bg-indigo-500 hover:bg-indigo-600 text-white">
              Add
            </button>
          </form>
          
          <div className="space-y-2 h-[52vh] overflow-y-auto">
            {isLoadingDistricts ? (
              <p className="text-slate-500 text-center">Loading districts...</p>
            ) : districts.length === 0 ? (
              <p className="text-slate-400 text-center">No districts found for {selectedState}.</p>
            ) : (
              districts.sort().map((district) => (
                <div key={district} className="flex justify-between items-center bg-slate-100 p-3 rounded-md">
                  <span className="text-slate-900">{district}</span>
                  <button
                    onClick={() => onDeleteDistrict(district)}
                    className="text-rose-500 hover:text-rose-600 p-1"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <p className="text-slate-400 text-center mt-8">Select a state to view and manage its districts.</p>
      )}
    </section>
  );
};

export default DistrictsList;

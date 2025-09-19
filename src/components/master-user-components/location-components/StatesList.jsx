import React from 'react';

const StatesList = ({ 
  states, 
  selectedState, 
  isLoadingStates, 
  onStateSelect 
}) => {
  return (
    <section className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
      <h2 className="text-xl font-bold mb-4 text-slate-900">States</h2>
      <div className="space-y-2 h-[60vh] overflow-y-auto">
        {isLoadingStates ? (
          <p className="text-slate-500 text-center">Loading states...</p>
        ) : states.length === 0 ? (
          <p className="text-slate-400 text-center">No states found. Add one to get started!</p>
        ) : (
          states.sort().map((state) => (
            <div
              key={state}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedState === state
                  ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => onStateSelect(state)}
            >
              {state}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default StatesList;

import React from 'react';

const SetupStatusFilter = ({ setupStatusFilter, onFilterChange }) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold mb-4 text-slate-900">Filter Schools by Setup Status</h2>
      <div className="flex gap-4">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            setupStatusFilter === 'all' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          All Schools
        </button>
        <button
          onClick={() => onFilterChange('done')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            setupStatusFilter === 'done' 
              ? 'bg-green-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Setup Complete
        </button>
        <button
          onClick={() => onFilterChange('not-done')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            setupStatusFilter === 'not-done' 
              ? 'bg-orange-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Setup Pending
        </button>
      </div>
    </section>
  );
};

export default SetupStatusFilter;

import React from 'react';

const LocationTools = ({ 
  newStateName, 
  onStateNameChange, 
  onAddState, 
  onDownloadTemplate, 
  csvFile, 
  onFileChange, 
  onBulkUpload 
}) => {
  return (
    <div className="lg:col-span-1 space-y-8">
      {/* Add New State */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 text-slate-900">Add New State</h2>
        <form onSubmit={onAddState} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">State Name</label>
            <input
              type="text"
              className="w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Gujarat"
              value={newStateName}
              onChange={(e) => onStateNameChange(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95 bg-indigo-500 hover:bg-indigo-600 text-white w-full">
            Add State
          </button>
        </form>
      </section>

      {/* Bulk Upload */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 text-slate-900">Bulk Upload</h2>
        <p className="text-sm text-slate-500 mb-4">Upload a CSV file with 'State' and 'District' columns.</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={onDownloadTemplate}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2"
          >
            <i className="fas fa-download"></i>
            <span>Download Template</span>
          </button>
          
          <input
            type="file"
            accept=".csv"
            onChange={onFileChange}
            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
          />
          
          <button
            onClick={onBulkUpload}
            className="font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95 bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Upload File
          </button>
        </div>
      </section>
    </div>
  );
};

export default LocationTools;

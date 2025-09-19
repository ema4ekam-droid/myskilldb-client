import React from 'react';

const BulkLoginUpload = ({ 
  selectedSchool,
  onFileChange,
  onUpload,
  onDownloadTemplate,
  csvFile,
  isLoading
}) => {
  if (!selectedSchool) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600">
          <i className="fas fa-upload text-xl"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Bulk Login Upload</h2>
          <p className="text-slate-600">Upload multiple login accounts at once</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Download Template */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-2">Step 1: Download Template</h3>
          <p className="text-sm text-slate-600 mb-4">
            Download the CSV template with the correct format for bulk upload.
          </p>
          <button
            onClick={onDownloadTemplate}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-download"></i>
            Download Template
          </button>
        </div>

        {/* Upload File */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-2">Step 2: Upload CSV File</h3>
          <p className="text-sm text-slate-600 mb-4">
            Select the CSV file with login data to upload.
          </p>
          <div className="space-y-3">
            <input
              type="file"
              accept=".csv"
              onChange={onFileChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
            />
            {csvFile && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <i className="fas fa-file-csv text-emerald-500"></i>
                <span>Selected: {csvFile.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-2">Step 3: Process Upload</h3>
          <p className="text-sm text-slate-600 mb-4">
            Click upload to process the CSV file and create login accounts.
          </p>
          <button
            onClick={onUpload}
            disabled={!csvFile || isLoading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i>
                Upload & Create Logins
              </>
            )}
          </button>
        </div>

        {/* CSV Format Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">CSV Format Requirements</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Required columns:</strong> loginType, name, email, phone</p>
            <p><strong>Login types:</strong> principal, hod, teacher, parent-student</p>
            <p><strong>Additional fields:</strong> qualification, department, subject, experience, studentName, class, rollNumber</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkLoginUpload;

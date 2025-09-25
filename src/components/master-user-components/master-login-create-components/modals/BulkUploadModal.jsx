import React, { useState } from 'react';

const BulkUploadModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDownloadTemplate,
  isLoading,
  schools,
  inputBaseClass,
  btnTealClass,
  btnSlateClass
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [userType, setUserType] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const userTypes = [
    { key: 'principal', label: 'Principal', icon: 'fas fa-user-tie', color: 'blue' },
    { key: 'hod', label: 'Head of Department', icon: 'fas fa-user-graduate', color: 'green' },
    { key: 'teacher', label: 'Teacher', icon: 'fas fa-chalkboard-teacher', color: 'purple' },
    { key: 'parent', label: 'Parent/Student', icon: 'fas fa-users', color: 'orange' },
    { key: 'all', label: 'All Types', icon: 'fas fa-layer-group', color: 'indigo' }
  ];

  const handleClose = () => {
    setSelectedFile(null);
    setUserType('');
    setSelectedSchoolId('');
    setDragActive(false);
    onClose();
  };

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid Excel file (.xlsx)');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    if (!userType) {
      alert('Please select a user type');
      return;
    }

    if (!selectedSchoolId) {
      alert('Please select a school');
      return;
    }

    onSubmit(selectedFile, userType, selectedSchoolId);
  };

  const handleDownloadTemplate = (type) => {
    if (!type) {
      alert('Please select a user type first');
      return;
    }
    onDownloadTemplate(type);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Bulk Upload User Logins</h2>
            <p className="text-sm text-slate-500 mt-1">Upload multiple user logins using Excel templates</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-slate-500"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* School Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select School *
            </label>
            <select
              className={`${inputBaseClass}`}
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              <option value="">Choose a school...</option>
              {schools.map(school => (
                <option key={school._id} value={school._id}>
                  {school.name} - {school.district}, {school.state}
                </option>
              ))}
            </select>
          </div>

          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select User Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {userTypes.map(type => (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => setUserType(type.key)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    userType === type.key
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`${type.icon} text-lg ${
                      userType === type.key ? `text-${type.color}-500` : 'text-slate-400'
                    }`}></i>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-slate-500">
                        {type.key === 'all' ? 'Upload all user types' : `Upload ${type.label.toLowerCase()}s`}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Download Section */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">Download Template</h3>
                <p className="text-sm text-slate-500">Get the Excel template with correct format</p>
              </div>
              <button
                onClick={() => handleDownloadTemplate(userType)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                disabled={!userType}
              >
                <i className="fas fa-download"></i>
                Download Template
              </button>
            </div>
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Excel File *
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-indigo-400 bg-indigo-50'
                  : selectedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <i className="fas fa-file-excel text-4xl text-green-500"></i>
                  <div>
                    <p className="font-medium text-slate-900">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <i className="fas fa-cloud-upload-alt text-4xl text-slate-400"></i>
                  <div>
                    <p className="text-slate-600">
                      <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-slate-500">Excel files only (.xlsx)</p>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-blue-500 mt-1"></i>
              <div>
                <h4 className="font-medium text-blue-900">Upload Instructions</h4>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Download the template first to ensure correct format</li>
                  <li>• Fill in all required fields (marked with *)</li>
                  <li>• Email addresses must be unique across the system</li>
                  <li>• For HOD uploads, department field is required</li>
                  <li>• Mobile numbers are required for all user types</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sample Data Preview */}
          {userType && userType !== 'all' && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-medium text-slate-900 mb-3">Sample Data Format for {userTypes.find(t => t.key === userType)?.label}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-3 py-2 border border-slate-200 font-medium">Name *</th>
                      <th className="px-3 py-2 border border-slate-200 font-medium">Email *</th>
                      <th className="px-3 py-2 border border-slate-200 font-medium">Mobile *</th>
                      {userType === 'hod' && (
                        <th className="px-3 py-2 border border-slate-200 font-medium">Department *</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      <td className="px-3 py-2 border border-slate-200">John Doe</td>
                      <td className="px-3 py-2 border border-slate-200">john.doe@school.com</td>
                      <td className="px-3 py-2 border border-slate-200">+1234567890</td>
                      {userType === 'hod' && (
                        <td className="px-3 py-2 border border-slate-200">Mathematics</td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className={btnSlateClass}
              disabled={isLoading}
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={btnTealClass}
              disabled={isLoading || !selectedFile || !userType || !selectedSchoolId}
            >
              <i className="fas fa-upload"></i>
              {isLoading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;

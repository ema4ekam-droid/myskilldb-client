import React from 'react';

const SchoolModal = ({ 
  isOpen, 
  onClose, 
  schoolModalMode, 
  schoolFormData, 
  formErrors, 
  inputBaseClass, 
  btnTealClass, 
  btnSlateClass, 
  locations, 
  handleInputChange, 
  handleSchoolFormSubmit 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {schoolModalMode === 'view' ? 'View School Details' : 'Create New School'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSchoolFormSubmit} className="p-6 space-y-6">
          {/* School Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">School Name *</label>
                <input
                  type="text"
                  className={`${inputBaseClass} ${formErrors.schoolName ? 'border-red-300 focus:ring-red-500' : ''}`}
                  value={schoolFormData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  placeholder="Enter school name"
                  disabled={schoolModalMode === 'view'}
                />
                {formErrors.schoolName && <p className="text-red-500 text-xs mt-1">{formErrors.schoolName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">School Type *</label>
                <select
                  className={`${inputBaseClass} ${formErrors.schoolType ? 'border-red-300 focus:ring-red-500' : ''}`}
                  value={schoolFormData.schoolType}
                  onChange={(e) => handleInputChange('schoolType', e.target.value)}
                  disabled={schoolModalMode === 'view'}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Board Affiliation</label>
                <select
                  className={inputBaseClass}
                  value={schoolFormData.boardAffiliation}
                  onChange={(e) => handleInputChange('boardAffiliation', e.target.value)}
                  disabled={schoolModalMode === 'view'}
                >
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="IB">IB</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Established Year</label>
                <input
                  type="number"
                  className={inputBaseClass}
                  value={schoolFormData.establishedYear}
                  onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                  placeholder="e.g., 1995"
                  min="1900"
                  max={new Date().getFullYear()}
                  disabled={schoolModalMode === 'view'}
                />
              </div>
            </div>
          </div>

          {/* Admin Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Admin Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Admin Name *</label>
                <input
                  type="text"
                  className={`${inputBaseClass} ${formErrors.adminName ? 'border-red-300 focus:ring-red-500' : ''}`}
                  value={schoolFormData.adminName}
                  onChange={(e) => handleInputChange('adminName', e.target.value)}
                  placeholder="Enter admin name"
                  disabled={schoolModalMode === 'view'}
                />
                {formErrors.adminName && <p className="text-red-500 text-xs mt-1">{formErrors.adminName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Admin Email *</label>
                <input
                  type="email"
                  className={`${inputBaseClass} ${formErrors.adminEmail ? 'border-red-300 focus:ring-red-500' : ''}`}
                  value={schoolFormData.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  placeholder="admin@school.com"
                  disabled={schoolModalMode === 'view'}
                />
                {formErrors.adminEmail && <p className="text-red-500 text-xs mt-1">{formErrors.adminEmail}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  className={`${inputBaseClass} ${formErrors.mobileNumber ? 'border-red-300 focus:ring-red-500' : ''}`}
                  value={schoolFormData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  placeholder="9876543210"
                  maxLength="10"
                  disabled={schoolModalMode === 'view'}
                />
                {formErrors.mobileNumber && <p className="text-red-500 text-xs mt-1">{formErrors.mobileNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Alternate Email</label>
                <input
                  type="email"
                  className={inputBaseClass}
                  value={schoolFormData.alternateEmail}
                  onChange={(e) => handleInputChange('alternateEmail', e.target.value)}
                  placeholder="alternate@school.com"
                  disabled={schoolModalMode === 'view'}
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Location Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                <textarea
                  className={`${inputBaseClass} ${formErrors.address ? 'border-red-300 focus:ring-red-500' : ''}`}
                  value={schoolFormData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  rows="3"
                  disabled={schoolModalMode === 'view'}
                />
                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                  <select
                    className={`${inputBaseClass} ${formErrors.state ? 'border-red-300 focus:ring-red-500' : ''}`}
                    value={schoolFormData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    disabled={schoolModalMode === 'view'}
                  >
                    <option value="">Select State</option>
                    {locations.states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">District *</label>
                  <select
                    className={`${inputBaseClass} ${formErrors.district ? 'border-red-300 focus:ring-red-500' : ''}`}
                    value={schoolFormData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    disabled={!schoolFormData.state || schoolModalMode === 'view'}
                  >
                    <option value="">Select District</option>
                    {locations.districts.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {formErrors.district && <p className="text-red-500 text-xs mt-1">{formErrors.district}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    className={`${inputBaseClass} ${formErrors.pincode ? 'border-red-300 focus:ring-red-500' : ''}`}
                    value={schoolFormData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="560001"
                    maxLength="6"
                    disabled={schoolModalMode === 'view'}
                  />
                  {formErrors.pincode && <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* School Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">School Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Students</label>
                <input
                  type="number"
                  className={inputBaseClass}
                  value={schoolFormData.totalStudents}
                  onChange={(e) => handleInputChange('totalStudents', e.target.value)}
                  placeholder="1200"
                  min="0"
                  disabled={schoolModalMode === 'view'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Teachers</label>
                <input
                  type="number"
                  className={inputBaseClass}
                  value={schoolFormData.totalTeachers}
                  onChange={(e) => handleInputChange('totalTeachers', e.target.value)}
                  placeholder="45"
                  min="0"
                  disabled={schoolModalMode === 'view'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Principal Name</label>
                <input
                  type="text"
                  className={inputBaseClass}
                  value={schoolFormData.principalName}
                  onChange={(e) => handleInputChange('principalName', e.target.value)}
                  placeholder="Dr. Principal Name"
                  disabled={schoolModalMode === 'view'}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                className={inputBaseClass}
                value={schoolFormData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                disabled={schoolModalMode === 'view'}
              >
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className={btnSlateClass}
            >
              {schoolModalMode === 'view' ? 'Close' : 'Cancel'}
            </button>
            {schoolModalMode !== 'view' && (
              <button
                type="submit"
                className={btnTealClass}
              >
                <i className="fas fa-plus"></i> Create School
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolModal;

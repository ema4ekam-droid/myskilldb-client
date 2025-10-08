const DepartmentModal = ({ 
  isOpen, 
  editingDepartment, 
  departmentFormData, 
  setDepartmentFormData, 
  onSubmit, 
  onClose,
  inputBaseClass,
  btnTealClass,
  btnSlateClass
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {editingDepartment ? 'Edit Department' : 'Add Department'}
          </h3>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Department Name *</label>
            <input
              type="text"
              className={inputBaseClass}
              value={departmentFormData.name}
              onChange={(e) => setDepartmentFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              className={inputBaseClass}
              rows="3"
              value={departmentFormData.description}
              onChange={(e) => setDepartmentFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className={btnTealClass}>
              {editingDepartment ? 'Update' : 'Add'} Department
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className={btnSlateClass}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;
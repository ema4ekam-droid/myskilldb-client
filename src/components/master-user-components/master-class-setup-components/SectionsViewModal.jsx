const SectionsViewModal = ({
  isOpen,
  viewingSections,
  viewingDepartment,
  viewingClass,
  onClose,
  onAddAssignment,
  onDeleteAssignment,
  btnSlateClass,
  btnIndigoClass
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">View Sections</h2>
              <p className="text-slate-500 text-sm">
                Sections assigned to <span className="font-medium text-slate-700">{viewingClass?.name}</span> 
                under <span className="font-medium text-slate-700">{viewingDepartment?.name}</span> department
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          <div className="space-y-4">
            {/* Department and Class Info */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Department</label>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-building text-blue-600"></i>
                    <span className="font-medium text-slate-900">{viewingDepartment?.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Class</label>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-graduation-cap text-green-600"></i>
                    <span className="font-medium text-slate-900">{viewingClass?.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">Assigned Sections</h3>
                <span className="text-sm text-slate-500">
                  {viewingSections.length} section{viewingSections.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {viewingSections.length > 0 ? (
                <div className="space-y-2">
                  {viewingSections.map((assignment, index) => (
                    <div key={assignment._id || index} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <i className="fas fa-layer-group text-purple-600"></i>
                        <span className="font-medium text-slate-900">{assignment.sectionName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDeleteAssignment(assignment)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Assignment"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <i className="fas fa-layer-group text-4xl mb-4 text-slate-300"></i>
                  <p>No sections assigned to this class yet.</p>
                  <p className="text-sm">Use the "Add Assignment" button to assign sections.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className={btnSlateClass}
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onAddAssignment();
              }}
              className={btnIndigoClass}
            >
              <i className="fas fa-plus"></i>
              Add More Sections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionsViewModal;
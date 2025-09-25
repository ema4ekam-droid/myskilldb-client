import React from 'react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  itemToDelete, 
  deleteType, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600"></i>
            </div>
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-lg font-semibold text-slate-900">Confirm Deletion</h3>
            <div className="mt-2">
              <p className="text-sm text-slate-500">
                Are you sure you want to delete this {deleteType}?
              </p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {itemToDelete?.name}
              </p>
              {deleteType === 'department' && (
                <p className="text-xs text-red-600 mt-2">
                  This will also delete all related classes, sections, and subjects.
                </p>
              )}
              {deleteType === 'class' && (
                <p className="text-xs text-red-600 mt-2">
                  This will also delete all related sections.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-3">
            <button 
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Delete
            </button>
            <button 
              onClick={onCancel}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

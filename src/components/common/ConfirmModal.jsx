import React from 'react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  onConfirm, 
  btnSlateClass, 
  btnRoseClass,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
        
        <div className="p-6">
          <p className="text-slate-600">{message}</p>
        </div>
        
        <div className="p-4 bg-slate-50 flex justify-end gap-4 rounded-b-lg">
          <button 
            onClick={onClose} 
            className={btnSlateClass}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className={`${btnRoseClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <><i className="fas fa-spinner fa-spin"></i> Processing...</>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
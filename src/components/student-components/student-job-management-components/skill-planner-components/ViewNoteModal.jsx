import React from 'react';

const ViewNoteModal = ({ isOpen, onClose, selectedNote }) => {
  if (!isOpen || !selectedNote) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-sticky-note"></i>
              Note
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Note Content */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedNote.text}</p>
          </div>

          {/* Date Info */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Added on: {selectedNote.date}
            </p>
          </div>

          {/* Close Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNoteModal;


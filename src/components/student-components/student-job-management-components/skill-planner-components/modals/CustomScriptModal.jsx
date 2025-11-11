import React from 'react';

const CustomScriptModal = ({
  isOpen,
  onClose,
  selectedSkill,
  customScriptText,
  setCustomScriptText,
  showScriptPreview,
  setShowScriptPreview,
  onSave
}) => {
  if (!isOpen || !selectedSkill) return null;

  const handleClose = () => {
    onClose();
    setShowScriptPreview(false);
    setCustomScriptText('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Paste Your Custom Script</h2>
              <p className="text-sm text-white opacity-90 mt-1">{selectedSkill.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
            >
              <i className="fas fa-times text-white text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Toggle Tabs */}
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setShowScriptPreview(false)}
              className={`px-4 py-2 font-semibold transition-colors ${
                !showScriptPreview
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <i className="fas fa-edit mr-2"></i>
              Edit Script
            </button>
            <button
              onClick={() => setShowScriptPreview(true)}
              className={`px-4 py-2 font-semibold transition-colors ${
                showScriptPreview
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              disabled={!customScriptText.trim()}
            >
              <i className="fas fa-eye mr-2"></i>
              Preview
            </button>
          </div>

          {!showScriptPreview ? (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <i className="fas fa-file-alt mr-2 text-blue-600"></i>
                Your Video Script *
              </label>
              <textarea
                value={customScriptText}
                onChange={(e) => setCustomScriptText(e.target.value)}
                placeholder="Paste your video script here from ChatGPT or Gemini...

All formatting (line breaks, spacing, sections) will be preserved exactly as you paste it.

Example format:

0:00 - 0:30 | Introduction
Welcome to this tutorial...

0:30 - 2:00 | Main Concept
Let me explain the key idea..."
                className="w-full h-96 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm whitespace-pre-wrap bg-slate-50"
                style={{ lineHeight: '1.6' }}
              />
              <p className="text-xs text-slate-500 mt-2 flex items-start gap-2">
                <i className="fas fa-check-circle text-emerald-600 mt-0.5"></i>
                <span>All formatting will be preserved - paste exactly as formatted by AI tools</span>
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <i className="fas fa-eye mr-2 text-blue-600"></i>
                How Your Script Will Appear
              </label>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-300 h-96 overflow-y-auto">
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <pre className="text-slate-700 leading-relaxed whitespace-pre-wrap font-sans text-sm">
{customScriptText || 'Your script preview will appear here...'}
                  </pre>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2 flex items-start gap-2">
                <i className="fas fa-info-circle mt-0.5"></i>
                <span>This is exactly how your script will appear during video recording</span>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              disabled={!customScriptText.trim()}
            >
              <i className="fas fa-check mr-2"></i>
              Save & Use Script
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomScriptModal;


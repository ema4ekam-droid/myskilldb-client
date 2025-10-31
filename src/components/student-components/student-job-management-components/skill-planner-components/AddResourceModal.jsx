import React from 'react';

const AddResourceModal = ({
  isOpen,
  onClose,
  resourceType,
  selectedSkill,
  resourceTitle,
  setResourceTitle,
  resourceUrl,
  setResourceUrl,
  resourceNote,
  setResourceNote,
  onAddResource
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className={`p-6 rounded-t-xl ${
          resourceType === 'note' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
          resourceType === 'youtube' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
          'bg-gradient-to-r from-blue-500 to-indigo-500'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <i className={`fas ${
                resourceType === 'note' ? 'fa-sticky-note' :
                resourceType === 'youtube' ? 'fa-video' :
                'fa-certificate'
              }`}></i>
              Add {resourceType === 'note' ? 'Note' : resourceType === 'youtube' ? 'Video' : 'Certificate/File'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <p className="text-sm text-white text-opacity-90 mt-1">
            For skill: <strong>{selectedSkill?.name}</strong>
          </p>
        </div>

        <div className="p-6 space-y-4">
          {resourceType === 'note' ? (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Note
              </label>
              <textarea
                value={resourceNote}
                onChange={(e) => setResourceNote(e.target.value)}
                placeholder="Enter your note or learning objective..."
                rows={4}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder={resourceType === 'youtube' ? 'e.g., React Hooks Tutorial' : 'e.g., React Certificate'}
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  URL *
                  {resourceType === 'certificate' && (
                    <span className="text-xs text-slate-500 font-normal ml-2">
                      (Accepts <i className="fab fa-google-drive text-green-600"></i> Google Drive or <i className="fab fa-dropbox text-blue-600"></i> Dropbox links)
                    </span>
                  )}
                </label>
                <input
                  type="url"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  placeholder={
                    resourceType === 'youtube' 
                      ? 'https://youtu.be/... or https://youtube.com/watch?v=...' 
                      : 'https://drive.google.com/... or https://dropbox.com/...'
                  }
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAddResource}
              className={`flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-colors ${
                resourceType === 'note' 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                  : resourceType === 'youtube'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
              }`}
            >
              <i className="fas fa-plus mr-2"></i>
              Add {resourceType === 'note' ? 'Note' : resourceType === 'youtube' ? 'Video' : 'File'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddResourceModal;


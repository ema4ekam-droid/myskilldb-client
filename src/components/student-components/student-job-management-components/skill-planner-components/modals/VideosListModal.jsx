import React from 'react';

const VideosListModal = ({ isOpen, onClose, selectedSkill, videosList = [], isLoadingVideos = false }) => {
  if (!isOpen || !selectedSkill) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fab fa-youtube text-white text-2xl"></i>
              <div>
                <h2 className="text-2xl font-bold text-white">Your Videos</h2>
                <p className="text-sm text-white opacity-90">{selectedSkill.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
            >
              <i className="fas fa-times text-white"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {isLoadingVideos ? (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-3xl text-slate-400 mb-4"></i>
              <p className="text-slate-500">Loading videos...</p>
            </div>
          ) : videosList && videosList.length > 0 ? (
            videosList.map((video) => (
              <div key={video._id || video.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fab fa-youtube text-red-600 text-2xl"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 mb-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-slate-600 mb-3">{video.description}</p>
                    )}
                    <p className="text-xs text-slate-400 mb-3">
                      Added: {new Date(video.createdAt || video.addedAt).toLocaleDateString()}
                    </p>
                    <a
                      href={video.link || video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      <i className="fas fa-play"></i>
                      Watch Video
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fab fa-youtube text-red-600 text-4xl"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Videos Yet</h3>
              <p className="text-slate-600 mb-4">Start adding your videos to showcase your expertise!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideosListModal;

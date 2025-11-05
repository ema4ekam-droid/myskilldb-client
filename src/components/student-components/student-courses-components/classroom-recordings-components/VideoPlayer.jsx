import React from 'react';

const VideoPlayer = ({ activeRecording }) => {
  if (!activeRecording) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <i className="fas fa-video text-6xl mb-4"></i>
          <p className="text-lg">Select a video to start watching</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 bg-black flex items-center justify-center">
        <div className="w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${activeRecording.videoId}?autoplay=0`}
            title={activeRecording.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      
      <div className="bg-slate-900 text-white px-3 py-2 lg:px-4 lg:py-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 bg-gradient-to-br from-${activeRecording.subjectColor}-500 to-${activeRecording.subjectColor}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
            <i className="fab fa-youtube text-white text-sm"></i>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm lg:text-base font-semibold truncate">{activeRecording.title}</h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{activeRecording.subjectName}</span>
              <span>•</span>
              <span>{activeRecording.duration}</span>
              <span>•</span>
              <span>{activeRecording.addedBy}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;

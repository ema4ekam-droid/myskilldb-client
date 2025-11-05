import React from 'react';

const RecordingsList = ({ 
  subjects,
  expandedSubjectId,
  topics,
  loadingTopics,
  expandedTopicId,
  recordings,
  loadingRecordings,
  activeRecordingId,
  onToggleSubject,
  onToggleTopic,
  onPlayRecording
}) => {
  return (
    <div className="lg:w-[35%] bg-white border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto">
      <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2 z-10">
        <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
          <i className="fas fa-list text-blue-600 text-xs"></i>
          All Recordings
        </h3>
        <p className="text-xs text-slate-600 mt-0.5">
          {recordings.length > 0 
            ? `${recordings.length} video${recordings.length !== 1 ? 's' : ''} in current topic` 
            : 'Select a topic to view recordings'}
        </p>
      </div>

      <div className="divide-y divide-slate-200">
        {subjects.map((subject) => {
          const isSubjectExpanded = expandedSubjectId === subject.id;

          return (
            <div key={subject.id} className="bg-white">
              <div
                className="p-2 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => onToggleSubject(subject.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 bg-gradient-to-br from-${subject.color}-500 to-${subject.color}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-[9px] leading-tight">{subject.code}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm truncate">{subject.name}</h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <i className="fas fa-film text-[10px]"></i>
                      {subject.instructor}
                    </p>
                  </div>
                  <i className={`fas fa-chevron-${isSubjectExpanded ? 'up' : 'down'} text-${subject.color}-600 text-xs`}></i>
                </div>
              </div>

              {isSubjectExpanded && (
                <div className="bg-slate-50 px-2 pb-2">
                  {loadingTopics ? (
                    <div className="p-2 text-center text-xs text-slate-500">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Loading topics...
                    </div>
                  ) : (
                    topics.map((topic) => {
                      const isTopicExpanded = expandedTopicId === topic._id;

                      return (
                        <div key={topic._id} className="mb-1.5">
                          <div
                            className="bg-white rounded-lg p-1.5 cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200"
                            onClick={() => onToggleTopic(topic._id, subject.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 text-xs truncate">{topic.name}</p>
                                <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                                  <i className="fas fa-play-circle text-[10px]"></i>
                                  {isTopicExpanded && recordings.length > 0 
                                    ? `${recordings.length} video${recordings.length !== 1 ? 's' : ''}`
                                    : 'Click to load recordings'}
                                </p>
                              </div>
                              <i className={`fas fa-chevron-${isTopicExpanded ? 'up' : 'down'} text-${subject.color}-600 text-xs`}></i>
                            </div>
                          </div>

                          {isTopicExpanded && (
                            <div className="mt-1.5 space-y-1 pl-1.5">
                              {loadingRecordings ? (
                                <div className="p-2 text-center text-xs text-slate-500">
                                  <i className="fas fa-spinner fa-spin mr-2"></i>
                                  Loading recordings...
                                </div>
                              ) : recordings.length === 0 ? (
                                <div className="p-2 text-center text-xs text-slate-500">
                                  No recordings available
                                </div>
                              ) : (
                                recordings.map((recording) => {
                                  const isActive = activeRecordingId === recording.id;
                                  return (
                                    <div
                                      key={recording.id}
                                      className={`rounded-lg p-1.5 cursor-pointer transition-all ${
                                        isActive 
                                          ? `bg-${subject.color}-100 border-2 border-${subject.color}-400` 
                                          : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                      }`}
                                      onClick={() => onPlayRecording(recording, subject, topic)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
                                          isActive ? `bg-${subject.color}-500` : `bg-${subject.color}-100`
                                        }`}>
                                          <i className={`fab fa-youtube ${isActive ? 'text-white' : `text-${subject.color}-600`} text-xs`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className={`text-xs font-medium truncate ${
                                            isActive ? `text-${subject.color}-900` : 'text-slate-900'
                                          }`}>{recording.title}</p>
                                          <span className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                                            <i className="fas fa-clock text-[10px]"></i>
                                            {recording.duration}
                                          </span>
                                        </div>
                                        {isActive && (
                                          <div className={`text-${subject.color}-600`}>
                                            <i className="fas fa-play-circle text-sm"></i>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecordingsList;


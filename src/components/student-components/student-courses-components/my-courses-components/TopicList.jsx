import React from 'react';

const TopicList = ({ subject, topics, loadingTopics }) => {
  const isLoading = loadingTopics[subject._id];
  const topicList = topics[subject._id] || [];

  return (
    <div className="border-t border-slate-200 bg-slate-50 p-6">
      <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-book-open text-blue-600"></i>
        Subject Topics
      </h4>
      {subject._id ? (
        isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-500 flex items-center gap-2">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading topics...</span>
            </div>
          </div>
        ) : (
          <>
            {topicList.length > 0 ? (
              <div className="space-y-3">
                {topicList.map((topic, index) => (
                  <div
                    key={topic._id}
                    className={`bg-white rounded-lg border p-4 hover:border-${subject.color}-300 transition-colors`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Topic Number */}
                      <div className={`hidden md:flex w-10 h-10 bg-gradient-to-br from-${subject.color}-500 to-${subject.color}-600 rounded-lg items-center justify-center text-white font-bold flex-shrink-0`}>
                        {index + 1}
                      </div>

                      {/* Topic Info */}
                      <div className="flex-1 min-w-0">
                        {/* Title and Description */}
                        <div className="mb-2">
                          <h5 className="font-semibold text-slate-900 text-sm md:text-base">{topic.name}</h5>
                          {topic.description && (
                            <p className="text-xs md:text-sm text-slate-600 mt-1">{topic.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                <i className="fas fa-book-open text-slate-400 text-3xl mb-3"></i>
                <p className="text-slate-600 font-medium">No topics</p>
              </div>
            )}
          </>
        )
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <i className="fas fa-book-open text-slate-400 text-3xl mb-3"></i>
          <p className="text-slate-600 font-medium">No topics</p>
        </div>
      )}
    </div>
  );
};

export default TopicList;


import React from 'react';

const TopicList = ({ topics = [], isLoading = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Topics List
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          View and manage topics in your organization
        </p>
      </div>

      {/* Data Count */}
      <div className="mb-4">
        <p className="text-sm text-slate-600">
          Showing {topics.length} topics
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">Loading topics...</p>
        </div>
      ) : (
        /* List Items */
        <div className="space-y-3">
          {topics.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mx-auto mb-3">
                <i className="fas fa-inbox text-slate-400 text-xl"></i>
              </div>
              <p className="text-slate-500 text-sm">No topics found</p>
            </div>
          ) : (
            topics.map((topic) => (
              <div
                key={topic._id}
                className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full">
                        <i className="fas fa-book text-indigo-600 text-xs"></i>
                      </div>
                      <h4 className="font-medium text-slate-900">
                        {topic.name}
                      </h4>
                      {topic.difficultyLevel && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          topic.difficultyLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                          topic.difficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {topic.difficultyLevel}
                        </span>
                      )}
                    </div>
                    {topic.description && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {topic.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      {topic.subject && (
                        <span className="flex items-center gap-1">
                          <i className="fas fa-bookmark"></i>
                          Subject: {topic.subject}
                        </span>
                      )}
                      {topic.department && (
                        <span className="flex items-center gap-1">
                          <i className="fas fa-building"></i>
                          Department: {topic.department}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          Topics represent learning materials and subjects for skill development
        </p>
      </div>
    </div>
  );
};

export default TopicList;

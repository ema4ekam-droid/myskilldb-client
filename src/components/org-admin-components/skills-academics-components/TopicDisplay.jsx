import React from 'react';

const TopicDisplay = ({ 
  topics, 
  subjects, 
  classes, 
  sections, 
  onEdit, 
  onDelete, 
  isLoading = false,
  sortBy = 'title',
  className = ""
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Topics</h2>
              <p className="text-slate-500 text-sm">Loading topics...</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600">Loading topics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Topics</h2>
              <p className="text-slate-500 text-sm">No topics found for the selected filters</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-slate-500">
            <i className="fas fa-tags text-4xl mb-4 text-slate-300"></i>
            <p className="font-medium mb-2">No topics found</p>
            <p className="text-sm">Create your first topic or adjust your filters to see results.</p>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Topics</h2>
            <p className="text-slate-500 text-sm">
              {topics.length} topic{topics.length !== 1 ? 's' : ''} found
              {sortBy === 'title' && ' (sorted by title)'}
              {sortBy === 'subject' && ' (sorted by subject)'}
              {sortBy === 'class' && ' (sorted by class)'}
              {sortBy === 'sectionsCount' && ' (sorted by sections count)'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {topics.map(topic => {
            const subject = subjects.find(s => s._id === topic.subjectId);
            const classItem = classes.find(c => c._id === topic.classId);
            const topicSections = sections.filter(s => topic.sectionIds?.includes(s._id));
            const sectionsCount = topic.sectionIds?.length || 0;

            return (
              <div key={topic._id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
                      <i className="fas fa-tags text-indigo-600"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900 text-lg">
                          {topic.title}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {sectionsCount} Section{sectionsCount !== 1 ? 's' : ''}
                        </span>
                        {!topic.isActive && (
                          <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-1 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-3">{topic.description}</p>
                      
                      <div className="text-sm text-slate-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-book text-blue-500"></i>
                          <span>{subject?.name || 'Unknown Subject'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-graduation-cap text-green-500"></i>
                          <span>{classItem?.name || 'Unknown Class'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-clock text-purple-500"></i>
                          <span>{topic.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onEdit(topic)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Topic"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => onDelete(topic._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Topic"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                {/* Sections */}
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-slate-900 mb-3">Assigned Sections</h4>
                  {topicSections.length === 0 ? (
                    <div className="text-center py-2 text-slate-500">
                      <i className="fas fa-layer-group text-2xl mb-2 text-slate-300"></i>
                      <p className="text-sm">No sections assigned</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {topicSections.map(section => (
                        <span key={section._id} className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full">
                          {section.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topic.learningObjectives && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Learning Objectives</h4>
                      <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                        {topic.learningObjectives}
                      </p>
                    </div>
                  )}

                  {topic.prerequisites && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Prerequisites</h4>
                      <p className="text-sm text-slate-600 bg-yellow-50 p-3 rounded-lg">
                        {topic.prerequisites}
                      </p>
                    </div>
                  )}

                  {topic.resources && (
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-slate-900 mb-2">Resources Required</h4>
                      <p className="text-sm text-slate-600 bg-green-50 p-3 rounded-lg">
                        {topic.resources}
                      </p>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Created: {new Date(topic.createdAt).toLocaleDateString()}
                    </span>
                    {topic.updatedAt && (
                      <span>
                        Updated: {new Date(topic.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopicDisplay;

import React from 'react';
import TopicList from './TopicList';

const SubjectCard = ({ subject, isExpanded, onToggle, topics, loadingTopics }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Subject Header */}
      <div
        className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => onToggle(subject)}
      >
        <div className="flex items-start gap-4">
          {/* Icon - Subject Code */}
          <div className={`hidden md:flex w-16 h-16 bg-gradient-to-br from-${subject.color}-500 to-${subject.color}-600 rounded-xl items-center justify-center text-white flex-shrink-0 font-bold text-xs`}>
            {subject.code}
          </div>

          {/* Subject Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{subject.name}</h3>
              </div>
              <button
                className={`w-10 h-10 flex items-center justify-center border-2 border-${subject.color}-300 hover:border-${subject.color}-400 rounded-lg transition-all ${isExpanded ? `bg-${subject.color}-100` : 'bg-white hover:bg-' + subject.color + '-50'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(subject);
                }}
              >
                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-${subject.color}-600 text-lg`}></i>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm mt-3">
              <span className="text-slate-600">
                <i className="fas fa-code text-slate-400 mr-2 hidden md:inline"></i>
                {subject.code}
              </span>
              <span className={`${!subject.instructor || subject.instructor === 'No teacher assigned' ? 'text-slate-400' : 'text-slate-600'}`}>
                <i className="fas fa-user-tie text-slate-400 mr-2"></i>
                {subject.instructor || 'No teacher assigned'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics List - Accordion */}
      {isExpanded && (
        <TopicList
          subject={subject}
          topics={topics}
          loadingTopics={loadingTopics}
        />
      )}
    </div>
  );
};

export default SubjectCard;


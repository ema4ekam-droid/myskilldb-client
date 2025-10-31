import React from 'react';

const StudyPlanModal = ({ 
  assessment, 
  onClose, 
  focusAreas,
  currentNote,
  setCurrentNote,
  editingNoteId,
  onAddNote,
  onUpdateNote,
  onEditNote,
  onDeleteNote,
  onCancelEdit,
  onPlayVideo
}) => {
  if (!assessment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white hover:bg-blue-50 border border-slate-200 rounded-full flex items-center justify-center text-blue-600 transition-all hover:scale-110 shadow-md"
          aria-label="Close modal"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl">
          <div className="pr-12">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <i className="fas fa-book-reader"></i>
              Study Plan: {assessment.title}
            </h3>
            <p className="text-blue-100 text-sm">
              Score: {assessment.score}% • {assessment.correctAnswers}/{assessment.totalQuestions} Correct
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Wrong Answers Section */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-red-600"></i>
              Questions You Got Wrong
            </h4>
            <div className="space-y-3">
              {assessment.questions.filter(q => !q.isCorrect).length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <i className="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
                  <p className="text-green-700 font-medium">Perfect! You got all questions correct! 🎉</p>
                </div>
              ) : (
                assessment.questions.filter(q => !q.isCorrect).map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <p className="font-semibold text-slate-900 mb-2">
                      <span className="text-red-600">Q{index + 1}:</span> {question.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 p-2 rounded bg-red-100 border border-red-300">
                        <i className="fas fa-times-circle text-red-600"></i>
                        <span className="font-medium">
                          Your Answer: <span className="font-bold">Option {question.userAnswer}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded bg-green-100 border border-green-300">
                        <i className="fas fa-check-circle text-green-600"></i>
                        <span className="font-medium">
                          Correct Answer: <span className="font-bold">Option {question.correctAnswer}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Focus Areas / Doubts Section */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-clipboard-list text-orange-600"></i>
              Focus Areas & Doubts
            </h4>
            
            {/* Add/Edit Note Form */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {editingNoteId ? 'Edit Note' : 'Add a New Note'} (Max 300 characters)
              </label>
              <textarea
                value={currentNote}
                onChange={(e) => {
                  if (e.target.value.length <= 300) {
                    setCurrentNote(e.target.value);
                  }
                }}
                placeholder="E.g., Need to understand ACOS optimization better, confused about bidding strategies..."
                className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows="3"
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs ${currentNote.length >= 300 ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                  {currentNote.length}/300 characters
                </span>
                <div className="flex gap-2">
                  {editingNoteId && (
                    <button
                      onClick={onCancelEdit}
                      className="px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => editingNoteId ? onUpdateNote(assessment.id) : onAddNote(assessment.id)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <i className={`fas ${editingNoteId ? 'fa-check' : 'fa-plus'}`}></i>
                    {editingNoteId ? 'Update Note' : 'Add Note'}
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Notes */}
            {focusAreas[assessment.id] && focusAreas[assessment.id].length > 0 ? (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Your Notes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {focusAreas[assessment.id].map((note) => (
                    <div
                      key={note.id}
                      className="bg-white border border-orange-200 rounded-lg p-3 hover:shadow-md transition-shadow flex flex-col h-full"
                    >
                      <div className="flex-1 mb-3">
                        <p className="text-slate-900 text-sm whitespace-pre-wrap break-words">{note.text}</p>
                      </div>
                      <div className="border-t border-orange-100 pt-2 mt-auto">
                        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                          <i className="fas fa-clock"></i>
                          <span className="truncate">
                            {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {note.updatedAt && ' (edited)'}
                          </span>
                        </p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => onEditNote(assessment.id, note.id)}
                            className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-center"
                            title="Edit note"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => onDeleteNote(assessment.id, note.id)}
                            className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-center"
                            title="Delete note"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-slate-600">
                <i className="fas fa-sticky-note text-slate-400 text-2xl mb-2"></i>
                <p className="text-sm">No notes yet. Add your first note above!</p>
              </div>
            )}
          </div>

          {/* Related Videos Section */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-video text-blue-600"></i>
              Recommended Videos to Review
            </h4>
            {assessment.relatedVideos && assessment.relatedVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessment.relatedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onPlayVideo(video)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fab fa-youtube text-white text-xl"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm mb-1">{video.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <i className="fas fa-clock"></i>
                            {video.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="fas fa-play-circle"></i>
                            Watch Now
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-slate-600">
                <i className="fas fa-info-circle text-slate-400 mb-2"></i>
                <p>No related videos available for this assessment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 rounded-b-xl flex justify-between items-center">
          <div className="text-sm text-slate-600">
            <i className="fas fa-lightbulb text-blue-600 mr-2"></i>
            Review videos and save your focus areas to track your learning progress
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanModal;


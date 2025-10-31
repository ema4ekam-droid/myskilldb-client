import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ManualTestModal = ({ isOpen, onClose, context, onSave, topics, editingTest }) => {
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [questions, setQuestions] = useState([]);

  // Pre-populate form when editing, reset when creating new
  useEffect(() => {
    if (isOpen) {
      if (editingTest) {
        setTestTitle(editingTest.title || '');
        setTestDescription(editingTest.description || '');
        setDifficulty(editingTest.difficulty || 'medium');
        setQuestions(editingTest.questions || []);
        // Preselect topic for topic-level if present
        if (context?.type === 'topic' && Array.isArray(context?.topicIds) && context.topicIds.length > 0) {
          setSelectedTopicId(context.topicIds[0]);
        }
      } else {
        // Reset for new test
        setTestTitle('');
        setTestDescription('');
        setDifficulty('medium');
        setSelectedTopicId(
          context?.type === 'topic' && Array.isArray(context?.topicIds) && context.topicIds.length > 0
            ? context.topicIds[0]
            : ''
        );
        setQuestions([]);
      }
    }
  }, [isOpen, editingTest]);

  if (!isOpen) return null;

  // Get all available topics - show all fetched topics, not just context.topicIds
  const availableTopics = topics && Array.isArray(topics) && topics.length > 0 
    ? topics 
    : (context?.topicIds?.map(topicId => 
        topics?.find(t => t._id === topicId)
      ).filter(Boolean) || []);

  const addQuestion = () => {
    if (!selectedTopicId) {
      toast.error('Please select a topic first');
      return;
    }
    
    setQuestions([{
      id: Date.now(),
      question: '',
      options: ['', ''],
      correctAnswer: 0,
      topicId: selectedTopicId
    }, ...questions]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length < 4) {
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    }));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        const newOptions = q.options.filter((_, i) => i !== optionIndex);
        const newCorrectAnswer = q.correctAnswer >= newOptions.length ? 0 : q.correctAnswer;
        return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
      }
      return q;
    }));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSave = () => {
    // Validation
    if (!testTitle.trim()) {
      toast.error('Please enter a test title');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    if (!testDescription.trim()) {
      toast.error('Please enter a description for the test');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1}: Please enter a question`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`Question ${i + 1}: All options must be filled`);
        return;
      }
    }

    const testData = {
      _id: editingTest?._id || `test-${Date.now()}`,
      title: testTitle,
      description: testDescription,
      subjectId: context.subjectId,
      topicIds: context.topicIds,
      difficulty,
      questionCount: questions.length,
      type: context.type,
      isAIGenerated: editingTest?.isAIGenerated || false,
      questions: questions.map((q, index) => ({
        id: q.id,
        questionNumber: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        topicId: q.topicId
      })),
      createdAt: editingTest?.createdAt || new Date().toISOString(),
      updatedAt: editingTest ? new Date().toISOString() : undefined
    };

    onSave(testData);
    onClose();
  };

  const handleClose = () => {
    // Don't reset here, let useEffect handle it on next open
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md backdrop-saturate-150 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-edit"></i>
                {editingTest ? 'Edit Test' : 'Create Manual Test'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {context?.type === 'subject' ? 'Subject-Level' : 'Topic-Level'} Assessment
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
            <textarea
              value={testDescription}
              onChange={(e) => setTestDescription(e.target.value)}
              placeholder="Briefly describe this assessment"
              rows={3}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Context Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Test Coverage</h3>
            <p className="text-sm text-blue-800">
              <strong>Subject:</strong> {context?.subjectName}
            </p>
            {context?.topicNames && context.topicNames.length > 0 && (
              <p className="text-sm text-blue-800 mt-1">
                <strong>Topics:</strong> {context.topicNames.join(', ')}
              </p>
            )}
          </div>

          {/* Test Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Test Title *</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="e.g., HTML Fundamentals Quiz"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level *</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Topic Selection - hidden for topic-level since topic is predetermined */}
          {context?.type !== 'topic' && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-indigo-900 mb-2">
                <i className="fas fa-lightbulb mr-2"></i>
                Select Topic to Create Questions
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full p-2.5 bg-white border border-indigo-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">-- Choose a topic to add questions --</option>
                {availableTopics.map(topic => (
                  <option key={topic._id} value={topic._id}>
                    {topic.title || topic.name} ({questions.filter(q => q.topicId === topic._id).length} question{questions.filter(q => q.topicId === topic._id).length !== 1 ? 's' : ''})
                  </option>
                ))}
              </select>
              <p className="text-xs text-indigo-700 mt-2">
                <i className="fas fa-info-circle mr-1"></i>
                You can switch between topics to create different cohorts of questions
              </p>
            </div>
          )}

          {/* Questions Summary by Topic */}
          {questions.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-2">
                <i className="fas fa-chart-bar mr-2"></i>
                Questions Summary
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableTopics.map(topic => {
                  const count = questions.filter(q => q.topicId === topic._id).length;
                  if (count === 0) return null;
                  return (
                    <span
                      key={topic._id}
                      className="px-3 py-1.5 bg-white border border-green-300 rounded-full text-xs font-medium text-green-800 inline-flex items-center gap-1.5"
                    >
                      <i className="fas fa-lightbulb"></i>
                      {topic.title || topic.name}: {count} question{count !== 1 ? 's' : ''}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">Questions ({questions.length})</h3>
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, qIndex) => {
                const questionTopic = availableTopics.find(t => t._id === q.topicId);
                return (
                  <div key={q.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-700">Question {qIndex + 1}</h4>
                        {questionTopic && (
                          <p className="text-xs text-indigo-600 mt-1">
                            <i className="fas fa-lightbulb mr-1"></i>
                            Topic: {questionTopic.title}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeQuestion(q.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Question Text *</label>
                      <textarea
                        value={q.question}
                        onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                        placeholder="Enter your question here..."
                        rows={2}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Options (2-4 options) *</label>
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctAnswer === optIndex}
                              onChange={() => updateQuestion(q.id, 'correctAnswer', optIndex)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                              placeholder={`Option ${optIndex + 1}`}
                              className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            {q.options.length > 2 && (
                              <button
                                onClick={() => removeOption(q.id, optIndex)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <i className="fas fa-times text-sm"></i>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {q.options.length < 4 && (
                        <button
                          onClick={() => addOption(q.id)}
                          className="mt-2 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5"
                        >
                          <i className="fas fa-plus"></i>
                          Add Option
                        </button>
                      )}
                      <p className="text-xs text-slate-500 mt-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        Select the radio button to mark the correct answer
                      </p>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <i className="fas fa-check"></i>
            {editingTest ? 'Update Test' : 'Create Test'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualTestModal;


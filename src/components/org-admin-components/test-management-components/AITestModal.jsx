import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AITestModal = ({ isOpen, onClose, context, onSave, jobs, topics }) => {
  const [testTitle, setTestTitle] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);

  // Get jobs for the context
  const [availableJobs, setAvailableJobs] = useState([]);

  useEffect(() => {
    if (isOpen && context) {
      // For topic-level, use jobs passed in context
      if (context.type === 'topic' && context.topicJobs) {
        setAvailableJobs(context.topicJobs);
      } else if (context.type === 'subject') {
        // For subject-level, get all jobs related to the topics
        setAvailableJobs(jobs || []);
      }
    }
  }, [isOpen, context, jobs]);

  if (!isOpen) return null;

  const toggleJob = (jobId) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const generateWithAI = async () => {
    if (!testTitle.trim()) {
      toast.error('Please enter a test title');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate Gemini API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Get topic details
      const topicDetails = context.topicIds.map(topicId => {
        const topic = topics?.find(t => t._id === topicId);
        return topic ? {
          id: topicId,
          title: topic.title,
          description: topic.description,
          difficulty: topic.difficulty
        } : null;
      }).filter(Boolean);

      // Get selected job details
      const jobDetails = selectedJobs.map(jobId => {
        const job = availableJobs.find(j => j._id === jobId);
        return job ? {
          id: jobId,
          title: job.jobTitle,
          company: job.company
        } : null;
      }).filter(Boolean);

      // Mock AI-generated questions
      const mockQuestions = Array.from({ length: questionCount }, (_, i) => ({
        id: `q-${Date.now()}-${i}`,
        questionNumber: i + 1,
        question: `AI Generated Question ${i + 1} for ${context.subjectName} - ${difficulty} level`,
        options: [
          `Correct answer for question ${i + 1}`,
          `Incorrect option A for question ${i + 1}`,
          `Incorrect option B for question ${i + 1}`,
          `Incorrect option C for question ${i + 1}`
        ],
        correctAnswer: 0,
        explanation: `This question tests understanding of ${topicDetails[i % topicDetails.length]?.title || 'the topic'}.`,
        relatedTopic: topicDetails[i % topicDetails.length]?.title || '',
        relatedJob: jobDetails.length > 0 ? jobDetails[i % jobDetails.length]?.title : null
      }));

      setGeneratedQuestions(mockQuestions);
      toast.success(`Generated ${questionCount} questions with AI!`);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions with AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedQuestions) {
      toast.error('Please generate questions first');
      return;
    }

    const testData = {
      _id: `test-${Date.now()}`,
      title: testTitle,
      subjectId: context.subjectId,
      topicIds: context.topicIds,
      difficulty,
      questionCount: generatedQuestions.length,
      type: context.type,
      isAIGenerated: true,
      selectedJobs,
      questions: generatedQuestions,
      aiMetadata: {
        topics: context.topicNames,
        jobs: selectedJobs.map(jobId => {
          const job = availableJobs.find(j => j._id === jobId);
          return job?.jobTitle;
        }).filter(Boolean),
        difficulty,
        generatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };

    onSave(testData);
    resetForm();
  };

  const resetForm = () => {
    setTestTitle('');
    setDifficulty('medium');
    setQuestionCount(10);
    setSelectedJobs([]);
    setGeneratedQuestions(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-robot"></i>
                Create AI-Powered Test
                <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">AI</span>
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                {context?.type === 'subject' ? 'Subject-Level' : 'Topic-Level'} AI Assessment
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* AI Info Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-600 text-white rounded-full p-2 flex-shrink-0">
                <i className="fas fa-robot text-sm"></i>
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold text-purple-900 mb-1 flex items-center gap-2">
                  <span>AI-Powered Assessment Generation</span>
                  <span className="bg-yellow-400 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-full">AI</span>
                </h5>
                <p className="text-xs text-purple-700">
                  Our AI will analyze the topics, job requirements, and difficulty level to generate relevant questions
                </p>
              </div>
            </div>
          </div>

          {/* Context Info */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">Test Coverage</h3>
            <p className="text-sm text-indigo-800">
              <strong>Subject:</strong> {context?.subjectName}
            </p>
            {context?.topicNames && context.topicNames.length > 0 && (
              <p className="text-sm text-indigo-800 mt-1">
                <strong>Topics:</strong> {context.topicNames.join(', ')}
              </p>
            )}
          </div>

          {/* Test Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Test Title *</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="e.g., AI-Generated HTML Assessment"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level *</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Number of Questions (Max 15) *</label>
            <input
              type="number"
              min="1"
              max="15"
              value={questionCount}
              onChange={(e) => setQuestionCount(Math.min(15, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Job Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Related Jobs (Optional)
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Select job roles to align questions with industry requirements
            </p>
            {availableJobs.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No jobs available for this selection</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableJobs.map(job => (
                  <button
                    key={job._id}
                    onClick={() => toggleJob(job._id)}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      selectedJobs.includes(job._id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job._id)}
                        onChange={() => toggleJob(job._id)}
                        className="mt-0.5 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-slate-900 text-sm">{job.jobTitle}</h5>
                        <p className="text-xs text-slate-600">{job.company}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          {!generatedQuestions && (
            <div className="flex justify-center pt-4">
              <button
                onClick={generateWithAI}
                disabled={isGenerating || !testTitle.trim()}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:transform-none"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating with AI...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-robot"></i>
                    <span>Generate Questions with AI</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Generated Questions Preview */}
          {generatedQuestions && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-green-900 flex items-center gap-2">
                  <i className="fas fa-check-circle"></i>
                  AI Generated {generatedQuestions.length} Questions
                </h3>
                <button
                  onClick={() => setGeneratedQuestions(null)}
                  className="text-sm text-green-700 hover:text-green-900 underline"
                >
                  Regenerate
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {generatedQuestions.slice(0, 3).map((q, index) => (
                  <div key={q.id} className="bg-white border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-900 mb-2">
                      {q.questionNumber}. {q.question}
                    </p>
                    <div className="space-y-1">
                      {q.options.map((opt, optIndex) => (
                        <p key={optIndex} className={`text-xs ${optIndex === q.correctAnswer ? 'text-green-700 font-semibold' : 'text-slate-600'}`}>
                          {String.fromCharCode(65 + optIndex)}. {opt}
                          {optIndex === q.correctAnswer && ' ✓'}
                        </p>
                      ))}
                    </div>
                    {q.relatedJob && (
                      <p className="text-xs text-purple-600 mt-2">
                        <i className="fas fa-briefcase mr-1"></i>
                        Aligned with: {q.relatedJob}
                      </p>
                    )}
                  </div>
                ))}
                {generatedQuestions.length > 3 && (
                  <p className="text-xs text-slate-500 text-center italic">
                    ... and {generatedQuestions.length - 3} more questions
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          {generatedQuestions && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <i className="fas fa-check"></i>
              Create AI Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITestModal;


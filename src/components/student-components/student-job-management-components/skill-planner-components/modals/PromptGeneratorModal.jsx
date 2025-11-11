import React from 'react';

const PromptGeneratorModal = ({
  isOpen,
  onClose,
  selectedSkill,
  promptTopic,
  setPromptTopic,
  generatedPrompt,
  setGeneratedPrompt,
  onGenerate,
  onCopy,
  onGoToCustomScript
}) => {
  if (!isOpen || !selectedSkill) return null;

  const handleCloseAndReset = () => {
    onClose();
    setGeneratedPrompt('');
    setPromptTopic('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Teleprompter Script Generator</h2>
              <p className="text-sm text-white opacity-90 mt-1">Get a prompt for easy-to-read video scripts</p>
            </div>
            <button
              onClick={handleCloseAndReset}
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
            >
              <i className="fas fa-times text-white text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="fas fa-video text-emerald-600 text-xl mt-0.5"></i>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-2">Create a Teleprompter-Friendly Script:</h4>
                <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                  <li>Enter your video topic</li>
                  <li>Get a specialized prompt for teleprompter-style scripts</li>
                  <li>Copy and paste it into ChatGPT or Gemini</li>
                  <li>Receive an easy-to-read script with short sentences and pause markers</li>
                  <li>Copy the script back and use "Paste Custom Script"</li>
                </ol>
                <div className="mt-3 p-2 bg-white rounded border border-emerald-200">
                  <p className="text-xs text-emerald-800 font-semibold">
                    ✓ Short, readable sentences  •  ✓ Clear pause markers  •  ✓ Natural pacing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Input */}
          {!generatedPrompt && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <i className="fas fa-tag mr-2 text-emerald-600"></i>
                  Video Topic *
                </label>
                <input
                  type="text"
                  value={promptTopic}
                  onChange={(e) => setPromptTopic(e.target.value)}
                  placeholder={`e.g., Why ${selectedSkill.name} matters in 2025, My journey with ${selectedSkill.name}`}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-2">
                  <i className="fas fa-lightbulb mr-1"></i>
                  Examples: career insights, industry trends, personal experiences, professional tips, project showcases
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseAndReset}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onGenerate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                  disabled={!promptTopic.trim()}
                >
                  <i className="fas fa-file-lines mr-2"></i>
                  Generate Teleprompter Prompt
                </button>
              </div>
            </div>
          )}

          {/* Generated Prompt */}
          {generatedPrompt && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    <i className="fas fa-file-lines mr-2 text-emerald-600"></i>
                    Your Teleprompter-Style Prompt
                  </label>
                  <button
                    onClick={onCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    <i className="fas fa-copy"></i>
                    Copy Prompt
                  </button>
                </div>
                <div className="relative">
                  <pre className="w-full h-96 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg overflow-auto text-sm whitespace-pre-wrap font-mono text-slate-800">
{generatedPrompt}
                  </pre>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <i className="fas fa-arrow-right text-blue-600"></i>
                  Next Steps:
                </h4>
                <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
                  <li>Click "Copy Prompt" button above</li>
                  <li>Open ChatGPT (<code className="bg-white px-2 py-0.5 rounded text-xs">chat.openai.com</code>) or Gemini (<code className="bg-white px-2 py-0.5 rounded text-xs">gemini.google.com</code>)</li>
                  <li>Paste the prompt and submit</li>
                  <li>You'll get a teleprompter-friendly script with short sentences and pause markers</li>
                  <li>Copy the entire script back</li>
                  <li>Return here and use "Paste Custom Script" option</li>
                </ol>
                <div className="mt-3 p-2 bg-white rounded border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <i className="fas fa-lightbulb mr-1"></i>
                    <strong>Pro tip:</strong> The script will be formatted with [PAUSE] markers and short lines - perfect for reading while recording!
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseAndReset}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={onGoToCustomScript}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-paste mr-2"></i>
                  Go to Paste Script
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptGeneratorModal;


import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { parseJobPosting, extractSkills } from '../../../config/aiConfig';

const JobParserModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Paste, 2: Review, 3: Skills Results
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Paste job text
  const [fullJobText, setFullJobText] = useState('');
  
  // Step 2: Parsed data
  const [parsedData, setParsedData] = useState({
    job_title: '',
    company: '',
    description: '',
    salary: '',
    location: '',
    job_type: 'Full-time'
  });
  
  // Step 3: Extracted skills
  const [skillsData, setSkillsData] = useState(null);
  const [jobName, setJobName] = useState('');

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFullJobText('');
      setParsedData({
        job_title: '',
        company: '',
        description: '',
        salary: '',
        location: '',
        job_type: 'Full-time'
      });
      setSkillsData(null);
      setJobName('');
    }
  }, [isOpen]);

  // Step 1: Parse job posting
  const handleParseJob = async (e) => {
    e.preventDefault();
    
    if (!fullJobText.trim()) {
      toast.error('Please paste the job posting text first');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await parseJobPosting(fullJobText);
      
      if (result.success) {
        const data = result.data;
        setParsedData({
          job_title: data.job_title || '',
          company: data.company || 'Not specified',
          description: data.description || '',
          salary: data.salary || 'Not specified',
          location: data.location || 'Not specified',
          job_type: data.job_type || 'Full-time'
        });
        setStep(2);
        toast.success('✨ Job details extracted successfully!');
      } else {
        toast.error(result.error || 'Failed to parse job posting');
      }
    } catch (error) {
      console.error('Error parsing job:', error);
      toast.error('An error occurred while parsing the job posting');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Extract skills
  const handleExtractSkills = async (e) => {
    e.preventDefault();
    
    if (!parsedData.job_title.trim() || !parsedData.description.trim()) {
      toast.error('Job Title and Description are required to extract skills');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await extractSkills(parsedData.description);
      
      if (result.success) {
        const skills = result.data;
        setSkillsData(skills);
        setJobName(parsedData.job_title);
        setStep(3);
        toast.success('✨ Skills extracted successfully!');
      } else {
        toast.error(result.error || 'Failed to extract skills');
      }
    } catch (error) {
      console.error('Error extracting skills:', error);
      toast.error('An error occurred while extracting skills');
    } finally {
      setIsLoading(false);
    }
  };

  // Note: Job is not auto-saved to backend
  // The extracted data is displayed and user can manually create the job using "Add New Job Posting"
  // This matches the PHP functionality where jobs are saved to a separate saved_jobs table

  // Download skills as JSON
  const handleDownloadSkills = () => {
    if (!skillsData) return;
    
    const dataStr = JSON.stringify(skillsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${jobName.replace(/[^a-z0-9]/gi, '_')}_skills.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Skills data downloaded!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-magic text-purple-600 text-2xl"></i>
              </div>
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white">AI Job Parser</h2>
                <p className="text-sm text-purple-100">
                  {step === 1 && 'Paste job text and let AI extract the details'}
                  {step === 2 && 'Review extracted details and extract skills'}
                  {step === 3 && 'View extracted skills'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <i className="fas fa-times text-white text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="p-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Paste Job Details</h3>
                </div>
                
                <p className="text-sm text-slate-600 mb-4 bg-white rounded-lg p-3 border border-purple-200">
                  <i className="fas fa-info-circle text-purple-600 mr-2"></i>
                  Go to the opened tab, press <kbd className="px-2 py-1 bg-slate-200 rounded text-xs font-mono">Ctrl+A</kbd> then <kbd className="px-2 py-1 bg-slate-200 rounded text-xs font-mono">Ctrl+C</kbd>. Paste everything here.
                </p>

                <form onSubmit={handleParseJob}>
                  <textarea
                    value={fullJobText}
                    onChange={(e) => setFullJobText(e.target.value)}
                    placeholder="Paste the entire job posting text here..."
                    rows={12}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none text-slate-900 resize-none font-mono text-sm"
                    required
                  />

                  <button
                    type="submit"
                    disabled={!fullJobText.trim() || isLoading}
                    className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin text-xl"></i>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sparkles text-xl"></i>
                        Analyze with AI
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Review & Extract Skills</h3>
                </div>

                <form onSubmit={handleExtractSkills} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={parsedData.job_title}
                      onChange={(e) => setParsedData({ ...parsedData, job_title: e.target.value })}
                      placeholder="Will be auto-filled..."
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={parsedData.company}
                      onChange={(e) => setParsedData({ ...parsedData, company: e.target.value })}
                      placeholder="Will be auto-filled..."
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={parsedData.description}
                      onChange={(e) => setParsedData({ ...parsedData, description: e.target.value })}
                      placeholder="Will be auto-filled..."
                      rows={4}
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-slate-900 resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Salary
                      </label>
                      <input
                        type="text"
                        value={parsedData.salary}
                        onChange={(e) => setParsedData({ ...parsedData, salary: e.target.value })}
                        placeholder="Auto-filled"
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={parsedData.location}
                        onChange={(e) => setParsedData({ ...parsedData, location: e.target.value })}
                        placeholder="Auto-filled"
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Job Type
                    </label>
                    <select
                      value={parsedData.job_type}
                      onChange={(e) => setParsedData({ ...parsedData, job_type: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-slate-900"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Not specified">Not specified</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin text-xl"></i>
                        Extracting Skills...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sparkles text-xl"></i>
                        Extract Skills
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 3 && skillsData && (
            <div className="p-6">
              <div className="results-header mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  Extracted Skills for "{jobName}"
                </h2>
                <button
                  onClick={handleDownloadSkills}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-download"></i>
                  Download Results
                </button>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Educational Qualifications</h4>
                  <p className="text-slate-700">{skillsData.education || 'Not specified'}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Tools Mentioned</h4>
                  <p className="text-slate-700">{skillsData.tools || 'Not specified'}</p>
                </div>
              </div>

              {/* Technical Skills */}
              {skillsData.technical_skills && skillsData.technical_skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Technical Skills</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skillsData.technical_skills.map((skillItem, index) => (
                      <div
                        key={index}
                        className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-indigo-400 transition-all"
                      >
                        <h4 className="font-semibold text-slate-900 mb-2">{skillItem.skill}</h4>
                        <p className="text-sm text-slate-600">{skillItem.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {skillsData.soft_skills && skillsData.soft_skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Soft Skills</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skillsData.soft_skills.map((skillItem, index) => (
                      <div
                        key={index}
                        className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-green-400 transition-all"
                      >
                        <h4 className="font-semibold text-slate-900 mb-2">{skillItem.skill}</h4>
                        <p className="text-sm text-slate-600">{skillItem.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setStep(1);
                    setFullJobText('');
                    setSkillsData(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold transition-colors"
                >
                  Parse Another Job
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobParserModal;


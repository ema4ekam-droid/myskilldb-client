import React from 'react';

const CreateJobModal = ({
  newJobData,
  fieldErrors,
  departments,
  isSubmittingJob,
  handleFieldChange,
  handleCreateJob,
  handleCloseCreateJobModal
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-briefcase"></i>
                Create New Job Listing
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Add job details and submit to create a new job posting
              </p>
            </div>
            <button
              onClick={handleCloseCreateJobModal}
              disabled={isSubmittingJob}
              className={`p-2 rounded-lg transition-colors ${
                isSubmittingJob
                  ? "cursor-not-allowed opacity-50"
                  : "text-white hover:bg-white hover:bg-opacity-20"
              }`}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <FormSection
            newJobData={newJobData}
            fieldErrors={fieldErrors}
            departments={departments}
            handleFieldChange={handleFieldChange}
          />
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={handleCloseCreateJobModal}
            disabled={isSubmittingJob}
            className={`px-6 py-2.5 font-semibold rounded-lg transition-colors ${
              isSubmittingJob
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-slate-200 hover:bg-slate-300 text-slate-800"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleCreateJob}
            disabled={isSubmittingJob}
            className={`px-6 py-2.5 font-semibold rounded-lg transition-colors inline-flex items-center gap-2 ${
              isSubmittingJob
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            }`}
          >
            {isSubmittingJob ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-check"></i>
                Create Job Listing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const FormSection = ({ newJobData, fieldErrors, departments, handleFieldChange }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Job Name *"
        type="text"
        value={newJobData.name}
        onChange={(e) => handleFieldChange("name", e.target.value)}
        placeholder="e.g., Senior Frontend Developer"
        error={fieldErrors.name}
      />
      <FormField
        label="Company *"
        type="text"
        value={newJobData.company}
        onChange={(e) => handleFieldChange("company", e.target.value)}
        placeholder="e.g., TechCorp Solutions"
        error={fieldErrors.company}
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Department *
      </label>
      <select
        value={newJobData.department}
        onChange={(e) => handleFieldChange("department", e.target.value)}
        className={`w-full p-3 bg-white border rounded-lg text-sm focus:ring-2 outline-none ${
          fieldErrors.department
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-slate-200 focus:ring-blue-500 focus:border-blue-500"
        }`}
      >
        <option value="">Select a department</option>
        {departments.map((dept) => (
          <option key={dept._id} value={dept.name}>
            {dept.name}
          </option>
        ))}
      </select>
      {fieldErrors.department && (
        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
          <i className="fas fa-exclamation-circle"></i>
          {fieldErrors.department}
        </p>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Place *"
        type="text"
        value={newJobData.place}
        onChange={(e) => handleFieldChange("place", e.target.value)}
        placeholder="e.g., Bangalore, India"
        error={fieldErrors.place}
      />
      <FormField
        label="Salary Range"
        type="text"
        value={newJobData.salaryRange}
        onChange={(e) => handleFieldChange("salaryRange", e.target.value)}
        placeholder="e.g., ₹8-12 LPA or $80k - $100k"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Job Description *
      </label>
      <textarea
        value={newJobData.description}
        onChange={(e) => handleFieldChange("description", e.target.value)}
        placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
        rows={5}
        className={`w-full p-3 bg-white border rounded-lg text-sm focus:ring-2 outline-none resize-none ${
          fieldErrors.description
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-slate-200 focus:ring-blue-500 focus:border-blue-500"
        }`}
      />
      {fieldErrors.description && (
        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
          <i className="fas fa-exclamation-circle"></i>
          {fieldErrors.description}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Requirements (Array)
      </label>
      <p className="text-xs text-slate-500 mb-2">
        Enter each requirement on a new line or separate with commas
      </p>
      <textarea
        value={newJobData.requirements}
        onChange={(e) => handleFieldChange("requirements", e.target.value)}
        placeholder="3+ years of experience with React&#10;Bachelor's degree in Computer Science&#10;Strong knowledge of JavaScript/TypeScript&#10;Experience with REST APIs"
        rows={6}
        className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
      />
    </div>
  </>
);

const FormField = ({ label, type, value, onChange, placeholder, error }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 bg-white border rounded-lg text-sm focus:ring-2 outline-none ${
        error
          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
          : "border-slate-200 focus:ring-blue-500 focus:border-blue-500"
      }`}
    />
    {error && (
      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
        <i className="fas fa-exclamation-circle"></i>
        {error}
      </p>
    )}
  </div>
);

export default CreateJobModal;
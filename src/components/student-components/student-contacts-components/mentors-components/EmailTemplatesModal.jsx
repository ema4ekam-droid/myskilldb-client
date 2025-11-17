import React from 'react';
import { toast } from 'react-hot-toast';

const EmailTemplatesModal = ({ isOpen, onClose, templates }) => {
  if (!isOpen) return null;

  const handleCopyTemplate = (template) => {
    const fullTemplate = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(fullTemplate);
    toast.success('Email template copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-fuchsia-600 bg-opacity-40 rounded-full flex items-center justify-center">
            <i className="fas fa-envelope text-xl"></i>
          </div>
          <h2 className="text-xl font-bold">Email Templates for Mentors</h2>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-md"
          title="Close"
        >
          <i className="fas fa-times text-slate-700 text-md"></i>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {templates.map((template) => (
          <div key={template.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{template.title}</h3>
                <p className="text-sm text-slate-600">Subject: {template.subject}</p>
              </div>
              <button
                onClick={() => handleCopyTemplate(template)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <i className="fas fa-copy"></i>
                Copy
              </button>
            </div>
            <pre className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-64 overflow-y-auto">
              {template.body}
            </pre>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EmailTemplatesModal;


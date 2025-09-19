import React from 'react';

const LoginCreationForm = ({ 
  selectedLoginType,
  loginFormData,
  onInputChange,
  onSubmit,
  onCancel,
  isLoading
}) => {
  if (!selectedLoginType) return null;

  const loginTypeConfig = {
    principal: {
      title: 'Principal Login',
      icon: 'fas fa-user-tie',
      color: 'red',
      fields: ['name', 'email', 'phone', 'qualification']
    },
    hod: {
      title: 'HOD Login',
      icon: 'fas fa-user-graduate',
      color: 'orange',
      fields: ['name', 'email', 'phone', 'department']
    },
    teacher: {
      title: 'Teacher Login',
      icon: 'fas fa-chalkboard-teacher',
      color: 'green',
      fields: ['name', 'email', 'phone', 'subject', 'experience']
    },
    'parent-student': {
      title: 'Parent/Student Login',
      icon: 'fas fa-users',
      color: 'blue',
      fields: ['name', 'email', 'phone', 'studentName', 'class', 'rollNumber']
    }
  };

  const config = loginTypeConfig[selectedLoginType];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        {/* Hide icon on PC view, show on mobile */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center md:hidden flex-shrink-0 ${
          config.color === 'red' ? 'bg-red-100 text-red-600' :
          config.color === 'orange' ? 'bg-orange-100 text-orange-600' :
          config.color === 'green' ? 'bg-green-100 text-green-600' :
          'bg-blue-100 text-blue-600'
        }`}>
          <i className={`${config.icon} text-xl`}></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{config.title}</h2>
          <p className="text-slate-600">Create login credentials for {config.title.toLowerCase()}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            value={loginFormData.name || ''}
            onChange={onInputChange}
            className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            value={loginFormData.email || ''}
            onChange={onInputChange}
            className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Enter email address"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={loginFormData.phone || ''}
            onChange={onInputChange}
            className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* Dynamic Fields based on Login Type */}
        {config.fields.includes('qualification') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Qualification *</label>
            <input
              type="text"
              name="qualification"
              value={loginFormData.qualification || ''}
              onChange={onInputChange}
              className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., M.Ed, Ph.D"
              required
            />
          </div>
        )}

        {config.fields.includes('department') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
            <select
              name="department"
              value={loginFormData.department || ''}
              onChange={onInputChange}
              className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            >
              <option value="">Select department</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="social-studies">Social Studies</option>
              <option value="physical-education">Physical Education</option>
            </select>
          </div>
        )}

        {config.fields.includes('subject') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subject *</label>
            <input
              type="text"
              name="subject"
              value={loginFormData.subject || ''}
              onChange={onInputChange}
              className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Mathematics, Physics"
              required
            />
          </div>
        )}

        {config.fields.includes('experience') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
            <input
              type="number"
              name="experience"
              value={loginFormData.experience || ''}
              onChange={onInputChange}
              className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter years of experience"
              min="0"
            />
          </div>
        )}

        {config.fields.includes('studentName') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Student Name *</label>
            <input
              type="text"
              name="studentName"
              value={loginFormData.studentName || ''}
              onChange={onInputChange}
              className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter student's full name"
              required
            />
          </div>
        )}

        {config.fields.includes('class') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Class *</label>
            <select
              name="class"
              value={loginFormData.class || ''}
              onChange={onInputChange}
              className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            >
              <option value="">Select class</option>
              {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={i+1}>Class {i+1}</option>
              ))}
            </select>
          </div>
        )}

        {config.fields.includes('rollNumber') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Roll Number *</label>
            <input
              type="text"
              name="rollNumber"
              value={loginFormData.rollNumber || ''}
              onChange={onInputChange}
              className="w-full bg-slate-100 border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter student roll number"
              required
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Login'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginCreationForm;

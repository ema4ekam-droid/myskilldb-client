import React, { useState } from 'react';

const SchoolSetupWizard = ({ 
  selectedSchool, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [schoolData, setSchoolData] = useState({
    classes: [],
    subjects: [],
    sections: [],
    departments: []
  });

  const steps = [
    { id: 1, title: 'Classes & Sections', description: 'Set up classes and sections' },
    { id: 2, title: 'Subjects', description: 'Add subjects for each class' },
    { id: 3, title: 'Departments', description: 'Create departments for HODs' },
    { id: 4, title: 'Create Logins', description: 'Generate login accounts' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateSchoolData = (key, value) => {
    setSchoolData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">School Setup Wizard</h2>
        <p className="text-slate-600">Complete setup for {selectedSchool?.name || 'selected school'}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= step.id 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {step.id}
              </div>
              <div className="ml-3 hidden md:block">
                <h3 className={`text-sm font-semibold ${
                  currentStep >= step.id ? 'text-indigo-900' : 'text-slate-600'
                }`}>
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-indigo-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        {currentStep === 1 && (
          <ClassesSectionsStep 
            data={schoolData.classes} 
            onUpdate={(data) => updateSchoolData('classes', data)} 
          />
        )}
        {currentStep === 2 && (
          <SubjectsStep 
            classes={schoolData.classes}
            data={schoolData.subjects} 
            onUpdate={(data) => updateSchoolData('subjects', data)} 
          />
        )}
        {currentStep === 3 && (
          <DepartmentsStep 
            data={schoolData.departments} 
            onUpdate={(data) => updateSchoolData('departments', data)} 
          />
        )}
        {currentStep === 4 && (
          <LoginCreationStep 
            schoolData={schoolData}
            onComplete={onComplete}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === steps.length ? 'Complete Setup' : 'Next'}
        </button>
      </div>
    </div>
  );
};

// Step 1: Classes & Sections
const ClassesSectionsStep = ({ data, onUpdate }) => {
  const [newClass, setNewClass] = useState('');
  const [newSection, setNewSection] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const addClass = () => {
    if (newClass.trim()) {
      const updatedData = [...data, { 
        name: newClass.trim(), 
        sections: [] 
      }];
      onUpdate(updatedData);
      setNewClass('');
    }
  };

  const addSection = () => {
    if (newSection.trim() && selectedClass) {
      const updatedData = data.map(cls => 
        cls.name === selectedClass 
          ? { ...cls, sections: [...cls.sections, newSection.trim()] }
          : cls
      );
      onUpdate(updatedData);
      setNewSection('');
    }
  };

  const removeClass = (className) => {
    onUpdate(data.filter(cls => cls.name !== className));
  };

  const removeSection = (className, sectionName) => {
    const updatedData = data.map(cls => 
      cls.name === className 
        ? { ...cls, sections: cls.sections.filter(sec => sec !== sectionName) }
        : cls
    );
    onUpdate(updatedData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Classes & Sections</h3>
        
        {/* Add Class */}
        <div className="bg-slate-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-slate-900 mb-3">Add New Class</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              placeholder="e.g., Class 1, Class 2, Grade 10"
              className="flex-1 bg-white border border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={addClass}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md text-sm"
            >
              Add Class
            </button>
          </div>
        </div>

        {/* Classes List */}
        <div className="space-y-4">
          {data.map((cls, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-slate-900">{cls.name}</h4>
                <button
                  onClick={() => removeClass(cls.name)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Class
                </button>
              </div>
              
              {/* Add Section */}
              <div className="mb-3">
                <div className="flex gap-2">
                  <select
                    value={selectedClass === cls.name ? '' : selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value === cls.name ? '' : e.target.value)}
                    className="bg-white border border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select class to add section</option>
                    {data.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={selectedClass === cls.name ? newSection : ''}
                    onChange={(e) => setNewSection(e.target.value)}
                    placeholder="Section name (e.g., A, B, Science)"
                    className="flex-1 bg-white border border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    disabled={selectedClass !== cls.name}
                  />
                  <button
                    onClick={addSection}
                    disabled={selectedClass !== cls.name || !newSection.trim()}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3 py-2 rounded-md text-sm disabled:opacity-50"
                  >
                    Add Section
                  </button>
                </div>
              </div>

              {/* Sections List */}
              <div className="flex flex-wrap gap-2">
                {cls.sections.map((section, secIndex) => (
                  <div key={secIndex} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {section}
                    <button
                      onClick={() => removeSection(cls.name, section)}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Step 2: Subjects
const SubjectsStep = ({ classes, data, onUpdate }) => {
  const [newSubject, setNewSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const addSubject = () => {
    if (newSubject.trim() && selectedClass) {
      const updatedData = [...data, {
        name: newSubject.trim(),
        class: selectedClass
      }];
      onUpdate(updatedData);
      setNewSubject('');
    }
  };

  const removeSubject = (subjectName, className) => {
    onUpdate(data.filter(subj => !(subj.name === subjectName && subj.class === className)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Subjects by Class</h3>
        
        {/* Add Subject */}
        <div className="bg-slate-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-slate-900 mb-3">Add New Subject</h4>
          <div className="flex gap-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select Class</option>
              {classes.map((cls, index) => (
                <option key={index} value={cls.name}>{cls.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g., Mathematics, Science, English"
              className="flex-1 bg-white border border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={addSubject}
              disabled={!selectedClass || !newSubject.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              Add Subject
            </button>
          </div>
        </div>

        {/* Subjects by Class */}
        <div className="space-y-4">
          {classes.map((cls, index) => {
            const classSubjects = data.filter(subj => subj.class === cls.name);
            return (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">{cls.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {classSubjects.map((subject, subIndex) => (
                    <div key={subIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {subject.name}
                      <button
                        onClick={() => removeSubject(subject.name, cls.name)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {classSubjects.length === 0 && (
                    <p className="text-slate-500 text-sm">No subjects added yet</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Step 3: Departments
const DepartmentsStep = ({ data, onUpdate }) => {
  const [newDepartment, setNewDepartment] = useState('');

  const addDepartment = () => {
    if (newDepartment.trim()) {
      const updatedData = [...data, newDepartment.trim()];
      onUpdate(updatedData);
      setNewDepartment('');
    }
  };

  const removeDepartment = (deptName) => {
    onUpdate(data.filter(dept => dept !== deptName));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Departments for HODs</h3>
        
        {/* Add Department */}
        <div className="bg-slate-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-slate-900 mb-3">Add New Department</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="e.g., Mathematics, Science, English, Physical Education"
              className="flex-1 bg-white border border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={addDepartment}
              disabled={!newDepartment.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              Add Department
            </button>
          </div>
        </div>

        {/* Departments List */}
        <div className="flex flex-wrap gap-3">
          {data.map((dept, index) => (
            <div key={index} className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              {dept}
              <button
                onClick={() => removeDepartment(dept)}
                className="text-orange-600 hover:text-orange-800 font-bold"
              >
                ×
              </button>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-slate-500 text-sm">No departments added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 4: Login Creation
const LoginCreationStep = ({ schoolData, onComplete }) => {
  const [loginSummary, setLoginSummary] = useState({
    principals: 0,
    hods: 0,
    teachers: 0,
    students: 0,
    parents: 0
  });

  React.useEffect(() => {
    // Calculate login counts based on school data
    const summary = {
      principals: 1, // Usually 1 principal per school
      hods: schoolData.departments.length,
      teachers: schoolData.subjects.length,
      students: schoolData.classes.reduce((total, cls) => total + cls.sections.length, 0) * 30, // Assuming 30 students per section
      parents: schoolData.classes.reduce((total, cls) => total + cls.sections.length, 0) * 30 // Same as students
    };
    setLoginSummary(summary);
  }, [schoolData]);

  const handleCreateLogins = () => {
    // Here you would implement the actual login creation logic
    console.log('Creating logins for:', loginSummary);
    onComplete(schoolData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Login Summary</h3>
        <p className="text-slate-600 mb-6">Based on your school setup, the following logins will be created:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-user-tie text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-red-900">Principals</h4>
                <p className="text-red-700 text-sm">{loginSummary.principals} account(s)</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-user-graduate text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-orange-900">HODs</h4>
                <p className="text-orange-700 text-sm">{loginSummary.hods} account(s)</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-chalkboard-teacher text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Teachers</h4>
                <p className="text-green-700 text-sm">{loginSummary.teachers} account(s)</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-users text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Students & Parents</h4>
                <p className="text-blue-700 text-sm">{loginSummary.students} student + {loginSummary.parents} parent accounts</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateLogins}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
        >
          Create All Login Accounts
        </button>
      </div>
    </div>
  );
};

export default SchoolSetupWizard;

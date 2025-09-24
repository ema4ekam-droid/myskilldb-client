import React, { useState, useEffect } from 'react';
import Navigation from '../../components/master-user-components/master-dashboard-components/master-navigation/Navigation';
import {
  SetupStatusFilter,
  LocationFilter,
  SchoolsTable,
  ClassSetupSection,
  DepartmentModal,
  ClassModal,
  SectionModal,
  SubjectModal,
  DeleteConfirmationModal
} from '../../components/master-user-components/master-class-setup-components';

const MasterSchoolClassSetup = () => {
  // State for all data
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Modal states
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Form data states
  const [departmentFormData, setDepartmentFormData] = useState({ name: '', description: '' });
  const [classFormData, setClassFormData] = useState({ name: '', description: '' });
  const [sectionFormData, setSectionFormData] = useState({ name: '', classIds: [], description: '' });
  const [subjectFormData, setSubjectFormData] = useState({ 
    name: '', 
    code: '', 
    departmentId: '', 
    description: '',
    credits: '',
    type: 'core'
  });

  // File upload states for subjects
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Editing states
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);

  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  
  // Setup status filter
  const [setupStatusFilter, setSetupStatusFilter] = useState('all'); // 'all', 'done', 'not-done'
  
  // Location filter states
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  // Location data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [schools, setSchools] = useState([]);
  
  // School setup status
  const [schoolSetupStatus, setSchoolSetupStatus] = useState({});
  
  // Selected school for setup
  const [selectedSchoolForSetup, setSelectedSchoolForSetup] = useState(null);
  
  // Confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'department', 'class', 'section', 'subject'

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Mock data initialization
  useEffect(() => {
    // Initialize location data
    setCountries([
      { id: 1, name: 'India', code: 'IN' },
      { id: 2, name: 'United States', code: 'US' },
      { id: 3, name: 'United Kingdom', code: 'UK' }
    ]);

    setStates([
      { id: 1, name: 'Karnataka', code: 'KA', countryId: 1 },
      { id: 2, name: 'Tamil Nadu', code: 'TN', countryId: 1 },
      { id: 3, name: 'California', code: 'CA', countryId: 2 },
      { id: 4, name: 'New York', code: 'NY', countryId: 2 }
    ]);

    setDistricts([
      { id: 1, name: 'Bangalore Urban', code: 'BU', stateId: 1 },
      { id: 2, name: 'Chennai', code: 'CH', stateId: 2 },
      { id: 3, name: 'Los Angeles', code: 'LA', stateId: 3 },
      { id: 4, name: 'Manhattan', code: 'MN', stateId: 4 }
    ]);

    setSchools([
      { id: 1, name: 'ABC International School', districtId: 1, stateId: 1, districtName: 'Bangalore Urban', stateName: 'Karnataka', countryName: 'India' },
      { id: 2, name: 'XYZ Public School', districtId: 1, stateId: 1, districtName: 'Bangalore Urban', stateName: 'Karnataka', countryName: 'India' },
      { id: 3, name: 'DEF High School', districtId: 2, stateId: 2, districtName: 'Chennai', stateName: 'Tamil Nadu', countryName: 'India' },
      { id: 4, name: 'GHI Academy', districtId: 3, stateId: 3, districtName: 'Los Angeles', stateName: 'California', countryName: 'United States' }
    ]);

    // Initialize school setup status
    setSchoolSetupStatus({
      1: { isSetupComplete: false, departments: 0, classes: 0, sections: 0, subjects: 0 },
      2: { isSetupComplete: true, departments: 3, classes: 5, sections: 8, subjects: 12 },
      3: { isSetupComplete: false, departments: 1, classes: 2, sections: 3, subjects: 4 },
      4: { isSetupComplete: false, departments: 0, classes: 0, sections: 0, subjects: 0 }
    });

    // Initialize with some mock data
    setDepartments([
      { id: 1, name: 'Science', description: 'Science department' },
      { id: 2, name: 'Mathematics', description: 'Mathematics department' },
      { id: 3, name: 'Languages', description: 'Languages department' }
    ]);

    setClasses([
      { id: 1, name: 'Class 1', description: 'First grade' },
      { id: 2, name: 'Class 2', description: 'Second grade' },
      { id: 3, name: 'Class 3', description: 'Third grade' }
    ]);

    setSections([
      { id: 1, name: 'Section A', classId: 1, className: 'Class 1', description: 'Section A of Class 1' },
      { id: 2, name: 'Section B', classId: 1, className: 'Class 1', description: 'Section B of Class 1' },
      { id: 3, name: 'Section A', classId: 2, className: 'Class 2', description: 'Section A of Class 2' }
    ]);

    setSubjects([
      { id: 1, name: 'Physics', code: 'PHY101', departmentId: 1, departmentName: 'Science', description: 'Basic Physics', credits: '4', type: 'core' },
      { id: 2, name: 'Chemistry', code: 'CHE101', departmentId: 1, departmentName: 'Science', description: 'Basic Chemistry', credits: '4', type: 'core' },
      { id: 3, name: 'Algebra', code: 'MATH101', departmentId: 2, departmentName: 'Mathematics', description: 'Basic Algebra', credits: '3', type: 'core' }
    ]);
  }, []);

  // Department handlers
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setDepartmentFormData({ name: '', description: '' });
    setIsDepartmentModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setDepartmentFormData({ name: department.name, description: department.description });
    setIsDepartmentModalOpen(true);
  };

  const handleDeleteDepartment = (department) => {
    setItemToDelete(department);
    setDeleteType('department');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDepartment = (id) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
    // Also remove related classes, sections, and subjects
    setClasses(prev => prev.filter(cls => cls.departmentId !== id));
    setSections(prev => prev.filter(sec => {
      const relatedClass = classes.find(cls => cls.id === sec.classId);
      return relatedClass && relatedClass.departmentId !== id;
    }));
    setSubjects(prev => prev.filter(sub => sub.departmentId !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleDepartmentSubmit = (e) => {
    e.preventDefault();
    if (editingDepartment) {
      setDepartments(prev => prev.map(dept => 
        dept.id === editingDepartment.id 
          ? { ...dept, ...departmentFormData }
          : dept
      ));
    } else {
      const newDepartment = {
        id: Date.now(),
        ...departmentFormData
      };
      setDepartments(prev => [...prev, newDepartment]);
    }
    setIsDepartmentModalOpen(false);
    setDepartmentFormData({ name: '', description: '' });
  };

  // Class handlers
  const handleAddClass = () => {
    setEditingClass(null);
    setClassFormData({ name: '', description: '' });
    setIsClassModalOpen(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setClassFormData({ 
      name: classItem.name, 
      description: classItem.description 
    });
    setIsClassModalOpen(true);
  };

  const handleDeleteClass = (classItem) => {
    setItemToDelete(classItem);
    setDeleteType('class');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteClass = (id) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
    // Also remove related sections
    setSections(prev => prev.filter(sec => sec.classId !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleClassSubmit = (e) => {
    e.preventDefault();
    if (editingClass) {
      setClasses(prev => prev.map(cls => 
        cls.id === editingClass.id 
          ? { ...cls, ...classFormData }
          : cls
      ));
    } else {
      const newClass = {
        id: Date.now(),
        ...classFormData
      };
      setClasses(prev => [...prev, newClass]);
    }
    setIsClassModalOpen(false);
    setClassFormData({ name: '', description: '' });
  };

  // Section handlers
  const handleAddSection = () => {
    setEditingSection(null);
    setSectionFormData({ name: '', classIds: [], description: '' });
    setIsSectionModalOpen(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setSectionFormData({ 
      name: section.name, 
      classIds: section.classIds || [section.classId], 
      description: section.description 
    });
    setIsSectionModalOpen(true);
  };

  const handleDeleteSection = (section) => {
    setItemToDelete(section);
    setDeleteType('section');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSection = (id) => {
    setSections(prev => prev.filter(sec => sec.id !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleSectionSubmit = (e) => {
    e.preventDefault();
    const selectedClasses = classes.filter(cls => sectionFormData.classIds.includes(cls.id));
    const classNames = selectedClasses.map(cls => cls.name).join(', ');
    
    if (editingSection) {
      setSections(prev => prev.map(sec => 
        sec.id === editingSection.id 
          ? { ...sec, ...sectionFormData, className: classNames }
          : sec
      ));
    } else {
      const newSection = {
        id: Date.now(),
        ...sectionFormData,
        className: classNames
      };
      setSections(prev => [...prev, newSection]);
    }
    setIsSectionModalOpen(false);
    setSectionFormData({ name: '', classIds: [], description: '' });
  };

  // Subject handlers
  const handleAddSubject = () => {
    setEditingSubject(null);
    setSubjectFormData({ 
      name: '', 
      code: '', 
      departmentId: '', 
      description: '',
      credits: '',
      type: 'core'
    });
    setIsSubjectModalOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectFormData({ 
      name: subject.name, 
      code: subject.code, 
      departmentId: subject.departmentId, 
      description: subject.description,
      credits: subject.credits,
      type: subject.type
    });
    setIsSubjectModalOpen(true);
  };

  const handleDeleteSubject = (subject) => {
    setItemToDelete(subject);
    setDeleteType('subject');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSubject = (id) => {
    setSubjects(prev => prev.filter(sub => sub.id !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    const department = departments.find(dept => dept.id === parseInt(subjectFormData.departmentId));
    if (editingSubject) {
      setSubjects(prev => prev.map(sub => 
        sub.id === editingSubject.id 
          ? { ...sub, ...subjectFormData, departmentName: department?.name || 'No Department' }
          : sub
      ));
    } else {
      const newSubject = {
        id: Date.now(),
        ...subjectFormData,
        departmentName: department?.name || 'No Department'
      };
      setSubjects(prev => [...prev, newSubject]);
    }
    setIsSubjectModalOpen(false);
    setSubjectFormData({ 
      name: '', 
      code: '', 
      departmentId: '', 
      description: '',
      credits: '',
      type: 'core'
    });
  };

  // CSV download and upload handlers
  const handleDownloadTemplate = () => {
    const csvContent = "Subject Name,Subject Code,Department,Description,Credits,Type\nPhysics,PHY101,Science,Basic Physics,4,core\nChemistry,CHE101,Science,Basic Chemistry,4,core\nMathematics,MATH101,Mathematics,Basic Math,3,core";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subjects_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      setIsUploading(true);
      
      // Simulate CSV processing
      setTimeout(() => {
        const newSubjects = [
          { id: Date.now() + 1, name: 'Biology', code: 'BIO101', departmentName: 'Science', description: 'Basic Biology', credits: '4', type: 'core' },
          { id: Date.now() + 2, name: 'History', code: 'HIS101', departmentName: 'No Department', description: 'World History', credits: '3', type: 'core' }
        ];
        setSubjects(prev => [...prev, ...newSubjects]);
        setIsUploading(false);
        setCsvFile(null);
        alert('Subjects uploaded successfully!');
      }, 2000);
    }
  };

  // Filter handlers
  const handleDepartmentFilter = (departmentId) => {
    setSelectedDepartment(departmentId);
    setSelectedClass('');
  };

  const handleClassFilter = (classId) => {
    setSelectedClass(classId);
  };

  // Setup status filter handler
  const handleSetupStatusFilter = (status) => {
    setSetupStatusFilter(status);
  };

  // Location filter handlers
  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedState('');
    setSelectedDistrict('');
  };

  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
  };

  // School selection handlers
  const handleEditSchool = (school) => {
    setSelectedSchoolForSetup(school);
    // Load existing data for this school
    // This would typically fetch from API
  };

  const handleAddSchool = (school) => {
    setSelectedSchoolForSetup(school);
    // Clear existing data for new setup
    setDepartments([]);
    setClasses([]);
    setSections([]);
    setSubjects([]);
  };

  // Get filtered data for cascading dropdowns
  const filteredStates = selectedCountry 
    ? states.filter(state => state.countryId === parseInt(selectedCountry))
    : states;

  const filteredDistricts = selectedState 
    ? districts.filter(district => district.stateId === parseInt(selectedState))
    : districts;

  // Get filtered schools based on setup status and location
  const filteredSchools = schools.filter(school => {
    const status = schoolSetupStatus[school.id];
    
    // Filter by setup status
    let setupStatusMatch = true;
    if (setupStatusFilter === 'done') setupStatusMatch = status?.isSetupComplete;
    if (setupStatusFilter === 'not-done') setupStatusMatch = !status?.isSetupComplete;
    
    // Filter by location
    let locationMatch = true;
    if (selectedCountry) {
      const schoolState = states.find(s => s.id === school.stateId);
      if (schoolState && schoolState.countryId !== parseInt(selectedCountry)) {
        locationMatch = false;
      }
    }
    if (selectedState && school.stateId !== parseInt(selectedState)) {
      locationMatch = false;
    }
    if (selectedDistrict && school.districtId !== parseInt(selectedDistrict)) {
      locationMatch = false;
    }
    
    return setupStatusMatch && locationMatch;
  });

  const filteredClasses = selectedDepartment 
    ? classes.filter(cls => cls.departmentId === parseInt(selectedDepartment))
    : classes;

  const filteredSections = selectedClass 
    ? sections.filter(sec => sec.classId === parseInt(selectedClass))
    : sections;

  // Navigation handler
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  // Base styles
  const inputBaseClass = "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed";
  const btnBaseClass = "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnTealClass = `${btnBaseClass} bg-teal-500 hover:bg-teal-600 text-white`;
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnRoseClass = `${btnBaseClass} bg-rose-500 hover:bg-rose-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;

  // Check if any modal is open
  const isAnyModalOpen = isDepartmentModalOpen || isClassModalOpen || isSectionModalOpen || isSubjectModalOpen;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      {/* Navigation Component - hidden when modal is open */}
      {!isAnyModalOpen && <Navigation currentPage="school-class-setup" onPageChange={handlePageChange} />}

      {/* Main Content */}
      <div className={isAnyModalOpen ? "" : "lg:ml-72"}>
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">School Class Setup</h1>
              <p className="text-slate-500 text-sm">Manage departments, classes, sections, and subjects</p>
            </div>
          </header>

          {/* Setup Status Filter */}
          <SetupStatusFilter 
            setupStatusFilter={setupStatusFilter}
            onFilterChange={handleSetupStatusFilter}
          />

          {/* Location Filters */}
          <LocationFilter 
            selectedCountry={selectedCountry}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            countries={countries}
            filteredStates={filteredStates}
            filteredDistricts={filteredDistricts}
            onCountryChange={handleCountryChange}
            onStateChange={handleStateChange}
            onDistrictChange={handleDistrictChange}
            inputBaseClass={inputBaseClass}
          />

          {/* Schools Table */}
          <SchoolsTable 
            filteredSchools={filteredSchools}
            schoolSetupStatus={schoolSetupStatus}
            onEditSchool={handleEditSchool}
            onAddSchool={handleAddSchool}
          />

          {/* Class Setup Section */}
          <ClassSetupSection 
            selectedSchoolForSetup={selectedSchoolForSetup}
            onCloseSetup={() => setSelectedSchoolForSetup(null)}
            departments={departments}
            classes={classes}
            sections={sections}
            subjects={subjects}
            selectedDepartment={selectedDepartment}
            selectedClass={selectedClass}
            filteredClasses={filteredClasses}
            filteredSections={filteredSections}
            onAddDepartment={handleAddDepartment}
            onEditDepartment={handleEditDepartment}
            onDeleteDepartment={handleDeleteDepartment}
            onAddClass={handleAddClass}
            onEditClass={handleEditClass}
            onDeleteClass={handleDeleteClass}
            onAddSection={handleAddSection}
            onEditSection={handleEditSection}
            onDeleteSection={handleDeleteSection}
            onAddSubject={handleAddSubject}
            onEditSubject={handleEditSubject}
            onDeleteSubject={handleDeleteSubject}
            onDownloadTemplate={handleDownloadTemplate}
            onCsvUpload={handleCsvUpload}
            isUploading={isUploading}
            onDepartmentFilter={handleDepartmentFilter}
            onClassFilter={handleClassFilter}
            inputBaseClass={inputBaseClass}
          />
        </main>
      </div>

      {/* Modals */}
      <DepartmentModal 
        isOpen={isDepartmentModalOpen}
        editingDepartment={editingDepartment}
        departmentFormData={departmentFormData}
        setDepartmentFormData={setDepartmentFormData}
        onSubmit={handleDepartmentSubmit}
        onClose={() => setIsDepartmentModalOpen(false)}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />

      <ClassModal 
        isOpen={isClassModalOpen}
        editingClass={editingClass}
        classFormData={classFormData}
        setClassFormData={setClassFormData}
        onSubmit={handleClassSubmit}
        onClose={() => setIsClassModalOpen(false)}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />

      <SectionModal 
        isOpen={isSectionModalOpen}
        editingSection={editingSection}
        sectionFormData={sectionFormData}
        setSectionFormData={setSectionFormData}
        onSubmit={handleSectionSubmit}
        onClose={() => setIsSectionModalOpen(false)}
        classes={classes}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />

      <SubjectModal 
        isOpen={isSubjectModalOpen}
        editingSubject={editingSubject}
        subjectFormData={subjectFormData}
        setSubjectFormData={setSubjectFormData}
        onSubmit={handleSubjectSubmit}
        onClose={() => setIsSubjectModalOpen(false)}
        departments={departments}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />

      <DeleteConfirmationModal 
        isOpen={showDeleteConfirm}
        itemToDelete={itemToDelete}
        deleteType={deleteType}
        onConfirm={() => {
          if (deleteType === 'department') confirmDeleteDepartment(itemToDelete.id);
          if (deleteType === 'class') confirmDeleteClass(itemToDelete.id);
          if (deleteType === 'section') confirmDeleteSection(itemToDelete.id);
          if (deleteType === 'subject') confirmDeleteSubject(itemToDelete.id);
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
          setDeleteType('');
        }}
      />
    </div>
  );
};

export default MasterSchoolClassSetup;

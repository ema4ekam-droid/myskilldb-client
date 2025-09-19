import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../../components/master-user-components/master-dashboard-components/master-navigation/Navigation';
import {
  SchoolHierarchy,
  LoginCreationForm,
  BulkLoginUpload,
  SchoolSetupWizard,
  SetupStatusCard,
  SchoolInfoSummary,
  LoginManagementPanel,
  PageHeader,
  useSchoolSetupStatus,
  fetchStates,
  fetchDistricts,
  fetchSchools,
  createLogin,
  uploadBulkLogins,
  downloadTemplate
} from '../../components/master-user-components/master-school-manage-components';

function Schools() {
  const API_BASE_URL = useMemo(() => 'http://localhost:5000/api', []);

  // --- STATE MANAGEMENT ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Selection states
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedLoginType, setSelectedLoginType] = useState('');
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [currentView, setCurrentView] = useState('hierarchy'); // 'hierarchy' or 'setup'
  
  // Custom hook for school setup status
  const { schoolSetupStatus, markSetupComplete, isSetupCompleted } = useSchoolSetupStatus();
  
  // Data states
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [schools, setSchools] = useState([]);
  
  // Form data
  const [loginFormData, setLoginFormData] = useState({});
  const [csvFile, setCsvFile] = useState(null);
  
  // Loading states
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingBulk, setIsLoadingBulk] = useState(false);

  // Login types configuration
  const loginTypes = [
    {
      id: 'principal',
      name: 'Principal',
      description: 'School principal login',
      icon: 'fas fa-user-tie'
    },
    {
      id: 'hod',
      name: 'HOD',
      description: 'Head of Department',
      icon: 'fas fa-user-graduate'
    },
    {
      id: 'teacher',
      name: 'Teacher',
      description: 'Subject teacher login',
      icon: 'fas fa-chalkboard-teacher'
    },
    {
      id: 'parent-student',
      name: 'Parent/Student',
      description: 'Parent or student login',
      icon: 'fas fa-users'
    }
  ];

  // --- API FUNCTIONS ---
  const loadStates = async () => {
    setIsLoadingStates(true);
    try {
      const statesData = await fetchStates();
      setStates(statesData);
    } catch (error) {
      console.error('Failed to load states:', error);
    } finally {
      setIsLoadingStates(false);
    }
  };

  const loadDistricts = async (state) => {
    if (!state) return;
    setIsLoadingDistricts(true);
    try {
      const districtsData = await fetchDistricts(state);
      setDistricts(districtsData);
    } catch (error) {
      console.error('Failed to load districts:', error);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const loadSchools = async (state, district) => {
    if (!state || !district) return;
    setIsLoadingSchools(true);
    try {
      const schoolsData = await fetchSchools(state, district);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Failed to load schools:', error);
    } finally {
      setIsLoadingSchools(false);
    }
  };

  // --- EVENT HANDLERS ---
  const handleStateSelect = (state) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setSelectedSchool('');
    setSelectedLoginType('');
    setDistricts([]);
    setSchools([]);
    if (state) {
      loadDistricts(state);
    }
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedSchool('');
    setSelectedLoginType('');
    setSchools([]);
    if (district) {
      loadSchools(selectedState, district);
    }
  };

  const handleSchoolSelect = (schoolId) => {
    setSelectedSchool(schoolId);
    setSelectedLoginType('');
    
    // Check if school setup is completed
    if (!isSetupCompleted(schoolId)) {
      // Show setup wizard first
      setCurrentView('setup');
      setShowSetupWizard(true);
    } else {
      // Show login management
      setCurrentView('hierarchy');
      setShowSetupWizard(false);
    }
  };

  const handleStartSetup = () => {
    setCurrentView('setup');
    setShowSetupWizard(true);
  };

  const handleSetupComplete = (schoolData) => {
    console.log('School setup completed:', schoolData);
    
    // Mark school setup as completed using the custom hook
    markSetupComplete(selectedSchool, schoolData);
    
    setCurrentView('hierarchy');
    setShowSetupWizard(false);
    // Here you would save the school data and create the logins
    alert('School setup completed successfully! All login accounts have been created. You can now manage individual logins.');
  };

  const handleBackToHierarchy = () => {
    setCurrentView('hierarchy');
    setShowSetupWizard(false);
  };

  const handleLoginTypeSelect = (loginTypeId) => {
    setSelectedLoginType(loginTypeId);
    setLoginFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingLogin(true);
    
    try {
      const loginData = {
        schoolId: selectedSchool,
        loginType: selectedLoginType,
        ...loginFormData
      };
      
      const result = await createLogin(loginData);
      alert(result.message);
      setSelectedLoginType('');
      setLoginFormData({});
    } catch (error) {
      alert('Failed to create login. Please try again.');
    } finally {
      setIsLoadingLogin(false);
    }
  };

  const handleCancel = () => {
    setSelectedLoginType('');
    setLoginFormData({});
  };

  const handleBulkFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleBulkUpload = async () => {
    if (!csvFile) {
      alert('Please select a CSV file to upload.');
      return;
    }
    
    setIsLoadingBulk(true);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      formData.append('schoolId', selectedSchool);
      
      const result = await uploadBulkLogins(formData);
      alert(result.message);
      setCsvFile(null);
    } catch (error) {
      alert('Failed to upload bulk logins. Please try again.');
    } finally {
      setIsLoadingBulk(false);
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplate();
  };

  // --- EFFECTS ---
  useEffect(() => {
    loadStates();
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Navigation currentPage="schools" />
      <div className="lg:ml-72">
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <PageHeader 
            isUserMenuOpen={isUserMenuOpen}
            setIsUserMenuOpen={setIsUserMenuOpen}
          />

          {/* Main Content */}
          {currentView === 'hierarchy' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Hierarchy Tree */}
              <SchoolHierarchy
                selectedState={selectedState}
                selectedDistrict={selectedDistrict}
                selectedSchool={selectedSchool}
                selectedLoginType={selectedLoginType}
                states={states}
                districts={districts}
                schools={schools}
                loginTypes={loginTypes}
                onStateSelect={handleStateSelect}
                onDistrictSelect={handleDistrictSelect}
                onSchoolSelect={handleSchoolSelect}
                onLoginTypeSelect={handleLoginTypeSelect}
                isLoadingStates={isLoadingStates}
                isLoadingDistricts={isLoadingDistricts}
                isLoadingSchools={isLoadingSchools}
              />

              {/* Right Column: Login Creation Forms */}
              <div className="space-y-6">
                {/* Setup Status Check */}
                <SetupStatusCard
                  selectedSchool={selectedSchool}
                  schoolSetupStatus={schoolSetupStatus}
                  schools={schools}
                  onStartSetup={handleStartSetup}
                />

                {/* Login Management Panel - Only show if setup is completed */}
                <LoginManagementPanel
                  selectedSchool={selectedSchool}
                  schoolSetupStatus={schoolSetupStatus}
                  selectedLoginType={selectedLoginType}
                  loginFormData={loginFormData}
                  onInputChange={handleInputChange}
                  onSubmit={handleLoginSubmit}
                  onCancel={handleCancel}
                  isLoadingLogin={isLoadingLogin}
                  onFileChange={handleBulkFileChange}
                  onUpload={handleBulkUpload}
                  onDownloadTemplate={handleDownloadTemplate}
                  csvFile={csvFile}
                  isLoadingBulk={isLoadingBulk}
                />
              </div>
            </div>
          ) : (
            /* Setup Wizard View */
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <button
                  onClick={handleBackToHierarchy}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <i className="fas fa-arrow-left"></i>
                  Back to School Selection
                </button>
              </div>
              <SchoolSetupWizard
                selectedSchool={schools.find(s => s.id === selectedSchool)}
                onComplete={handleSetupComplete}
              />
            </div>
          )}

          {/* Summary Section */}
          <SchoolInfoSummary
            selectedSchool={selectedSchool}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            schools={schools}
            schoolSetupStatus={schoolSetupStatus}
          />
        </main>
      </div>
    </div>
  );
}

export default Schools;
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Navigation from '../../components/master-user-components/master-dashboard-components/master-navigation/Navigation';
import SchoolsTable from '../../components/master-user-components/master-login-create-components/SchoolsTable';
import LoginFormModal from '../../components/master-user-components/master-login-create-components/modals/LoginFormModal';
import BulkUploadModal from '../../components/master-user-components/master-login-create-components/modals/BulkUploadModal';
import BulkDeleteModal from '../../components/master-user-components/master-login-create-components/modals/BulkDeleteModal';
import EmailCredentialsModal from '../../components/master-user-components/master-login-create-components/modals/EmailCredentialsModal';
import { schoolLoginApi } from '../../components/master-user-components/master-login-create-components/utils/schoolLoginApi';

function SchoolLoginManager() {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);

  // --- STATE MANAGEMENT ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  // Filters
  const [filters, setFilters] = useState({
    name: '',
    country: '',
    state: '',
    district: ''
  });

  // Location data
  const [locations, setLocations] = useState({
    countries: [],
    states: [],
    districts: [],
    filterStates: [],
    filterDistricts: []
  });

  // Modal states
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    schoolId: '',
    userType: '',
    name: '',
    email: '',
    mobileNumber: '',
    department: ''
  });

  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isEmailCredentialsOpen, setIsEmailCredentialsOpen] = useState(false);
  const [emailCredentialsData, setEmailCredentialsData] = useState({
    schoolId: '',
    userType: '',
    userIds: []
  });

  // --- API CALLS ---
  const fetchData = async () => {
    await Promise.all([
      fetchSchools(),
      fetchCountries()
    ]);
  };

  const fetchSchools = async (filterParams = {}) => {
    try {
      setIsLoading(true);
      
      // Mock data for demonstration
      const mockSchools = [
        {
          _id: '1',
          name: 'Delhi Public School',
          adminEmail: 'admin@dpsdelhi.com',
          district: 'Central Delhi',
          state: 'Delhi',
          country: 'India',
          address: '123 Connaught Place, New Delhi',
          loginCounts: {
            principal: 1,
            hod: 3,
            teacher: 45,
            parent: 120
          }
        },
        {
          _id: '2',
          name: 'Bangalore International School',
          adminEmail: 'admin@bisbangalore.com',
          district: 'Bangalore Urban',
          state: 'Karnataka',
          country: 'India',
          address: '456 MG Road, Bangalore',
          loginCounts: {
            principal: 1,
            hod: 4,
            teacher: 52,
            parent: 180
          }
        },
        {
          _id: '3',
          name: 'Mumbai Central School',
          adminEmail: 'admin@mcschool.com',
          district: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          address: '789 Marine Drive, Mumbai',
          loginCounts: {
            principal: 1,
            hod: 2,
            teacher: 38,
            parent: 95
          }
        },
        {
          _id: '4',
          name: 'Chennai Global Academy',
          adminEmail: 'admin@cga.com',
          district: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          address: '321 Anna Salai, Chennai',
          loginCounts: {
            principal: 1,
            hod: 3,
            teacher: 41,
            parent: 110
          }
        },
        {
          _id: '5',
          name: 'Kolkata Modern School',
          adminEmail: 'admin@kms.com',
          district: 'Kolkata',
          state: 'West Bengal',
          country: 'India',
          address: '654 Park Street, Kolkata',
          loginCounts: {
            principal: 1,
            hod: 2,
            teacher: 33,
            parent: 85
          }
        },
        {
          _id: '6',
          name: 'Hyderabad Tech School',
          adminEmail: 'admin@hts.com',
          district: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          address: '987 HITEC City, Hyderabad',
          loginCounts: {
            principal: 1,
            hod: 3,
            teacher: 29,
            parent: 72
          }
        },
        {
          _id: '7',
          name: 'Pune Science Academy',
          adminEmail: 'admin@psa.com',
          district: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          address: '147 FC Road, Pune',
          loginCounts: {
            principal: 1,
            hod: 4,
            teacher: 47,
            parent: 135
          }
        },
        {
          _id: '8',
          name: 'Ahmedabad Public School',
          adminEmail: 'admin@aps.com',
          district: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          address: '258 CG Road, Ahmedabad',
          loginCounts: {
            principal: 1,
            hod: 2,
            teacher: 36,
            parent: 98
          }
        }
      ];

      // Apply filters to mock data
      let filteredSchools = mockSchools;
      
      if (filterParams.name) {
        filteredSchools = filteredSchools.filter(school => 
          school.name.toLowerCase().includes(filterParams.name.toLowerCase()) ||
          school.adminEmail.toLowerCase().includes(filterParams.name.toLowerCase())
        );
      }
      
      if (filterParams.country) {
        filteredSchools = filteredSchools.filter(school => 
          school.country === filterParams.country
        );
      }
      
      if (filterParams.state) {
        filteredSchools = filteredSchools.filter(school => 
          school.state === filterParams.state
        );
      }
      
      if (filterParams.district) {
        filteredSchools = filteredSchools.filter(school => 
          school.district === filterParams.district
        );
      }

      setSchools(filteredSchools);
      setCurrentPage(1); // Reset to first page when data changes
      
      // Uncomment below to use real API
      /*
      const params = new URLSearchParams();
      
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value.trim()) {
          params.append(key, value);
        }
      });

      const response = await axios.get(`${API_BASE_URL}/schools?${params}`);
      
      if (response.data.success) {
        const schoolsWithLoginCounts = await Promise.all(
          response.data.data.map(async (school) => {
            try {
              const loginCounts = await schoolLoginApi.getSchoolLoginCounts(school._id);
              return {
                ...school,
                loginCounts: loginCounts.data
              };
            } catch (error) {
              console.error(`Error fetching login counts for school ${school._id}:`, error);
              return {
                ...school,
                loginCounts: {
                  principal: 0,
                  hod: 0,
                  teacher: 0,
                  parent: 0
                }
              };
            }
          })
        );
        setSchools(schoolsWithLoginCounts);
      }
      */
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      // Mock countries data
      const mockCountries = [
        { name: 'India', code: 'IN' },
        { name: 'United States', code: 'US' },
        { name: 'United Kingdom', code: 'GB' },
        { name: 'Australia', code: 'AU' }
      ];
      
      setLocations(prev => ({ ...prev, countries: mockCountries }));
      
      // Uncomment below to use real API
      /*
      const response = await axios.get(`${API_BASE_URL}/locations/countries`);
      if (response.data.success) {
        const countries = response.data.data.map(country => ({
          name: country.country,
          code: country.countryCode
        }));
        setLocations(prev => ({ ...prev, countries }));
      }
      */
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (countryCode, forFilter = false) => {
    try {
      // Mock states data
      const mockStates = {
        'IN': [
          { name: 'Delhi', code: 'DL' },
          { name: 'Karnataka', code: 'KA' },
          { name: 'Maharashtra', code: 'MH' },
          { name: 'Tamil Nadu', code: 'TN' },
          { name: 'West Bengal', code: 'WB' },
          { name: 'Telangana', code: 'TG' },
          { name: 'Gujarat', code: 'GJ' }
        ],
        'US': [
          { name: 'California', code: 'CA' },
          { name: 'New York', code: 'NY' },
          { name: 'Texas', code: 'TX' }
        ],
        'GB': [
          { name: 'England', code: 'EN' },
          { name: 'Scotland', code: 'SC' },
          { name: 'Wales', code: 'WL' }
        ],
        'AU': [
          { name: 'New South Wales', code: 'NSW' },
          { name: 'Victoria', code: 'VIC' },
          { name: 'Queensland', code: 'QLD' }
        ]
      };
      
      const states = mockStates[countryCode] || [];
      
      if (forFilter) {
        setLocations(prev => ({ ...prev, filterStates: states }));
      } else {
        setLocations(prev => ({ ...prev, states }));
      }
      
      // Uncomment below to use real API
      /*
      const response = await axios.get(`${API_BASE_URL}/locations/states/${countryCode}`);
      if (response.data.success) {
        const states = response.data.data.map(state => ({
          name: state.state,
          code: state.stateCode
        }));
        if (forFilter) {
          setLocations(prev => ({ ...prev, filterStates: states }));
        } else {
          setLocations(prev => ({ ...prev, states }));
        }
      }
      */
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchDistricts = async (stateCode, forFilter = false) => {
    try {
      // Mock districts data
      const mockDistricts = {
        'DL': [
          { name: 'Central Delhi', code: 'CD' },
          { name: 'New Delhi', code: 'ND' },
          { name: 'East Delhi', code: 'ED' },
          { name: 'West Delhi', code: 'WD' }
        ],
        'KA': [
          { name: 'Bangalore Urban', code: 'BU' },
          { name: 'Bangalore Rural', code: 'BR' },
          { name: 'Mysore', code: 'MY' },
          { name: 'Mangalore', code: 'MG' }
        ],
        'MH': [
          { name: 'Mumbai', code: 'MU' },
          { name: 'Pune', code: 'PU' },
          { name: 'Nagpur', code: 'NG' },
          { name: 'Nashik', code: 'NS' }
        ],
        'TN': [
          { name: 'Chennai', code: 'CH' },
          { name: 'Coimbatore', code: 'CO' },
          { name: 'Madurai', code: 'MA' },
          { name: 'Tiruchirappalli', code: 'TR' }
        ],
        'WB': [
          { name: 'Kolkata', code: 'KL' },
          { name: 'Howrah', code: 'HW' },
          { name: 'Burdwan', code: 'BW' },
          { name: 'Hooghly', code: 'HG' }
        ],
        'TG': [
          { name: 'Hyderabad', code: 'HY' },
          { name: 'Warangal', code: 'WA' },
          { name: 'Nizamabad', code: 'NZ' },
          { name: 'Karimnagar', code: 'KR' }
        ],
        'GJ': [
          { name: 'Ahmedabad', code: 'AH' },
          { name: 'Surat', code: 'SU' },
          { name: 'Vadodara', code: 'VA' },
          { name: 'Rajkot', code: 'RA' }
        ]
      };
      
      const districts = mockDistricts[stateCode] || [];
      
      if (forFilter) {
        setLocations(prev => ({ ...prev, filterDistricts: districts }));
      } else {
        setLocations(prev => ({ ...prev, districts }));
      }
      
      // Uncomment below to use real API
      /*
      const response = await axios.get(`${API_BASE_URL}/locations/districts/state/${stateCode}`);
      if (response.data.success) {
        const districts = response.data.data.map(district => ({
          name: district.district,
          code: district.districtCode
        }));
        if (forFilter) {
          setLocations(prev => ({ ...prev, filterDistricts: districts }));
        } else {
          setLocations(prev => ({ ...prev, districts }));
        }
      }
      */
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleApiError = (error) => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      if (responseData?.message) {
        toast.error(responseData.message);
      }
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();

    const onWindowClick = (e) => {
      const menuButton = document.getElementById('profile-button');
      const menu = document.getElementById('profile-menu');
      if (isUserMenuOpen && menuButton && menu && 
          !menuButton.contains(e.target) && !menu.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('click', onWindowClick);
    return () => window.removeEventListener('click', onWindowClick);
  }, [isUserMenuOpen]);

  // --- EVENT HANDLERS ---
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when filtering
    fetchSchools(filters);
  };

  // Pagination calculations
  const totalPages = Math.ceil(schools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSchools = schools.slice(startIndex, endIndex);

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterLocationChange = async (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));

    if (field === 'country') {
      const selectedCountry = locations.countries.find(c => c.name === value);
      if (selectedCountry) {
        setFilters(prev => ({ ...prev, state: '', district: '' }));
        await fetchStates(selectedCountry.code, true);
      }
    } else if (field === 'state') {
      const selectedState = locations.filterStates.find(s => s.name === value);
      if (selectedState) {
        setFilters(prev => ({ ...prev, district: '' }));
        await fetchDistricts(selectedState.code, true);
      }
    }
  };

  const toggleSelectAll = (checked) => {
    setSelectedSchoolIds(checked ? schools.map(school => school._id) : []);
  };

  const toggleSelectOne = (schoolId, checked) => {
    setSelectedSchoolIds(prev => 
      checked ? [...new Set([...prev, schoolId])] : prev.filter(id => id !== schoolId)
    );
  };

  const openLoginForm = (schoolId, userType = '') => {
    setLoginFormData({
      schoolId,
      userType,
      name: '',
      email: '',
      mobileNumber: '',
      department: ''
    });
    setIsLoginFormOpen(true);
  };

  const handleLoginFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      // Mock success response
      setTimeout(() => {
        toast.success(`Successfully created ${formData.userType} login for ${formData.name}`);
        setIsLoginFormOpen(false);
        // Refresh the schools data to show updated counts
        fetchSchools(filters);
      }, 1000);
      
      // Uncomment below to use real API
      /*
      const response = await schoolLoginApi.createLogin(formData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        setIsLoginFormOpen(false);
        await fetchSchools(filters);
      }
      */
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = async (file, userType, schoolId) => {
    try {
      setIsLoading(true);
      
      // Mock success response
      setTimeout(() => {
        const schoolName = schools.find(s => s._id === schoolId)?.name || 'Selected School';
        toast.success(`Successfully uploaded ${file.name} and created ${userType} logins for ${schoolName}`);
        setIsBulkUploadOpen(false);
        fetchSchools(filters);
      }, 2000);
      
      // Uncomment below to use real API
      /*
      const response = await schoolLoginApi.bulkUpload(file, userType, schoolId);
      
      if (response.data.success) {
        toast.success(response.data.message);
        setIsBulkUploadOpen(false);
        await fetchSchools(filters);
      }
      */
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async (schoolId, userType, userIds) => {
    try {
      setIsLoading(true);
      
      // Mock success response
      setTimeout(() => {
        toast.success(`Successfully deleted ${userIds.length} ${userType} user(s)`);
        setIsBulkDeleteOpen(false);
        fetchSchools(filters);
      }, 1500);
      
      // Uncomment below to use real API
      /*
      const response = await schoolLoginApi.bulkDelete(schoolId, userType, userIds);
      
      if (response.data.success) {
        toast.success(response.data.message);
        setIsBulkDeleteOpen(false);
        await fetchSchools(filters);
      }
      */
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailCredentials = async (schoolId, userType, userIds) => {
    try {
      setIsLoading(true);
      
      // Mock success response
      setTimeout(() => {
        toast.success(`Successfully sent login credentials to ${userIds.length} ${userType} user(s)`);
        setIsEmailCredentialsOpen(false);
      }, 1500);
      
      // Uncomment below to use real API
      /*
      const response = await schoolLoginApi.emailCredentials(schoolId, userType, userIds);
      
      if (response.data.success) {
        toast.success(response.data.message);
        setIsEmailCredentialsOpen(false);
      }
      */
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = async (userType) => {
    try {
      // Mock template download
      const templateContent = `Name,Email,Mobile Number${userType === 'hod' ? ',Department' : ''}
John Doe,john.doe@school.com,+91-9876543210${userType === 'hod' ? ',Mathematics' : ''}
Jane Smith,jane.smith@school.com,+91-9876543211${userType === 'hod' ? ',Science' : ''}

Note: All fields marked with * are required. Mobile Number is mandatory for all user types.`;
      
      const blob = new Blob([templateContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userType}_template.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${userType} template downloaded successfully`);
      
      // Uncomment below to use real API
      /*
      const response = await schoolLoginApi.downloadTemplate(userType);
      
      // Create a blob and download the file
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userType}_template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Template downloaded successfully');
      */
    } catch (error) {
      handleApiError(error);
    }
  };

  // Navigation handler
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  // Base component styles
  const inputBaseClass = "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed";
  const btnBaseClass = "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnTealClass = `${btnBaseClass} bg-teal-500 hover:bg-teal-600 text-white`;
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnRoseClass = `${btnBaseClass} bg-rose-500 hover:bg-rose-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />
      
      {/* Navigation Component - Hide when bulk upload modal is open */}
      {!isBulkUploadOpen && (
        <Navigation currentPage="school-logins" onPageChange={handlePageChange} />
      )}

      {/* Main Content with offset for sidebar */}
      <div className={`${isBulkUploadOpen ? '' : 'lg:ml-72'}`}>
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">School Login Manager</h1>
              <p className="text-slate-500 text-sm">Create, edit and manage school user logins</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  id="profile-button"
                  onClick={() => setIsUserMenuOpen(v => !v)}
                >
                  <img
                    src="https://api.dicebear.com/8.x/initials/svg?seed=Master+Admin"
                    className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md hover:ring-2 hover:ring-indigo-400 transition-all"
                    alt="Admin Profile"
                  />
                </button>
                {isUserMenuOpen && (
                  <div id="profile-menu" className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-20">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100">
                      <i className="fas fa-plus w-4 text-slate-500"></i>
                      Organization Sign Up Page
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-slate-100 border-t border-slate-200">
                      <i className="fas fa-sign-out-alt w-4 text-red-500"></i>
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Filter Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-5 text-slate-900">Filter Schools</h2>
            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <input
                type="text"
                placeholder="School Name..."
                className={`${inputBaseClass} sm:col-span-2 lg:col-span-4`}
                value={filters.name}
                onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))}
              />

              <select
                className={inputBaseClass}
                value={filters.country}
                onChange={(e) => handleFilterLocationChange('country', e.target.value)}
              >
                <option value="">Select Country</option>
                {locations.countries.map((country) => (
                  <option key={country.code} value={country.name}>{country.name}</option>
                ))}
              </select>

              <select
                className={inputBaseClass}
                disabled={!filters.country}
                value={filters.state}
                onChange={(e) => handleFilterLocationChange('state', e.target.value)}
              >
                <option value="">Select State</option>
                {locations.filterStates.map((state) => (
                  <option key={state.code} value={state.name}>{state.name}</option>
                ))}
              </select>

              <select
                className={inputBaseClass}
                disabled={!filters.state}
                value={filters.district}
                onChange={(e) => setFilters(f => ({ ...f, district: e.target.value }))}
              >
                <option value="">Select District</option>
                {locations.filterDistricts.map((district) => (
                  <option key={district.code} value={district.name}>{district.name}</option>
                ))}
              </select>

              <button
                type="submit"
                className={`${btnIndigoClass} w-full`}
                disabled={isLoading}
              >
                <i className="fas fa-search"></i>
                {isLoading ? 'Filtering...' : 'Apply Filters'}
              </button>
            </form>
          </section>

          {/* Schools Table */}
          <SchoolsTable
            schools={paginatedSchools}
            isLoading={isLoading}
            selectedSchoolIds={selectedSchoolIds}
            allChecked={schools.length > 0 && selectedSchoolIds.length === schools.length}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectOne={toggleSelectOne}
            onOpenLoginForm={openLoginForm}
            onDownloadTemplate={downloadTemplate}
            onOpenBulkUpload={() => setIsBulkUploadOpen(true)}
            onOpenBulkDelete={(schoolId, userType) => {
              setEmailCredentialsData({ schoolId, userType, userIds: [] });
              setIsBulkDeleteOpen(true);
            }}
            onEmailCredentials={(schoolId, userType, userIds) => {
              setEmailCredentialsData({ schoolId, userType, userIds });
              setIsEmailCredentialsOpen(true);
            }}
            btnTealClass={btnTealClass}
            btnIndigoClass={btnIndigoClass}
            btnRoseClass={btnRoseClass}
            btnSlateClass={btnSlateClass}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePaginationChange}
            itemsPerPage={itemsPerPage}
          />
        </main>
      </div>

      {/* Modals */}
      <LoginFormModal
        isOpen={isLoginFormOpen}
        onClose={() => setIsLoginFormOpen(false)}
        onSubmit={handleLoginFormSubmit}
        formData={loginFormData}
        schools={schools}
        isLoading={isLoading}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSubmit={handleBulkUpload}
        onDownloadTemplate={downloadTemplate}
        schools={schools}
        isLoading={isLoading}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />

      <BulkDeleteModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onSubmit={handleBulkDelete}
        schoolId={emailCredentialsData.schoolId}
        userType={emailCredentialsData.userType}
        schools={schools}
        isLoading={isLoading}
        btnRoseClass={btnRoseClass}
        btnSlateClass={btnSlateClass}
      />

      <EmailCredentialsModal
        isOpen={isEmailCredentialsOpen}
        onClose={() => setIsEmailCredentialsOpen(false)}
        onSubmit={handleEmailCredentials}
        schoolId={emailCredentialsData.schoolId}
        userType={emailCredentialsData.userType}
        userIds={emailCredentialsData.userIds}
        schools={schools}
        isLoading={isLoading}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
      />
    </div>
  );
}

export default SchoolLoginManager;

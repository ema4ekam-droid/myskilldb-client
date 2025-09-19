import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../../components/master-user-components/master-dashboard-components/master-navigation/Navigation';
import CountryTable from '../../components/master-user-components/location-components/CountryTable';
import StateTable from '../../components/master-user-components/location-components/StateTable';
import DistrictTable from '../../components/master-user-components/location-components/DistrictTable';
import SyllabusTable from '../../components/master-user-components/location-components/SyllabusTable';
import StatsCards from '../../components/master-user-components/location-components/StatsCards';

function LocationManager() {
  const API_BASE_URL = useMemo(() => 'http://localhost:5000/api', []);

  // --- STATE MANAGEMENT ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Data arrays
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  
  // Filter states
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  
  // Loading states
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingSyllabi, setIsLoadingSyllabi] = useState(false);

  // --- DERIVED STATE ---
  const totalCountries = countries.length;
  const totalStates = states.length;

  // --- API CALLS ---
  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      // Mock data - replace with actual API call
      const mockCountries = [
        { id: '1', name: 'India', code: 'IN' },
        { id: '2', name: 'United States', code: 'US' },
        { id: '3', name: 'United Kingdom', code: 'UK' },
        { id: '4', name: 'Canada', code: 'CA' },
        { id: '5', name: 'Australia', code: 'AU' }
      ];
      setCountries(mockCountries);
    } catch (error) {
      console.error('Failed to load countries:', error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const fetchStates = async () => {
    setIsLoadingStates(true);
    try {
      // Mock data - replace with actual API call
      const mockStates = [
        { id: '1', name: 'Karnataka', code: 'KA', countryId: '1' },
        { id: '2', name: 'Tamil Nadu', code: 'TN', countryId: '1' },
        { id: '3', name: 'Maharashtra', code: 'MH', countryId: '1' },
        { id: '4', name: 'California', code: 'CA', countryId: '2' },
        { id: '5', name: 'Texas', code: 'TX', countryId: '2' },
        { id: '6', name: 'England', code: 'ENG', countryId: '3' },
        { id: '7', name: 'Scotland', code: 'SCT', countryId: '3' }
      ];
      setStates(mockStates);
    } catch (error) {
      console.error('Failed to load states:', error);
    } finally {
      setIsLoadingStates(false);
    }
  };

  const fetchDistricts = async () => {
    setIsLoadingDistricts(true);
    try {
      // Mock data - replace with actual API call
      const mockDistricts = [
        { id: '1', name: 'Bangalore', code: 'BLR', stateId: '1', countryId: '1' },
        { id: '2', name: 'Mysore', code: 'MYS', stateId: '1', countryId: '1' },
        { id: '3', name: 'Chennai', code: 'CHN', stateId: '2', countryId: '1' },
        { id: '4', name: 'Mumbai', code: 'MUM', stateId: '3', countryId: '1' },
        { id: '5', name: 'Los Angeles', code: 'LA', stateId: '4', countryId: '2' },
        { id: '6', name: 'Houston', code: 'HOU', stateId: '5', countryId: '2' }
      ];
      setDistricts(mockDistricts);
    } catch (error) {
      console.error('Failed to load districts:', error);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const fetchSyllabi = async () => {
    setIsLoadingSyllabi(true);
    try {
      // Mock data - replace with actual API call
      const mockSyllabi = [
        { id: '1', name: 'CBSE', code: 'CBSE', stateId: '1', countryId: '1' },
        { id: '2', name: 'ICSE', code: 'ICSE', stateId: '2', countryId: '1' },
        { id: '3', name: 'State Board', code: 'SB', stateId: '3', countryId: '1' },
        { id: '4', name: 'Common Core', code: 'CC', stateId: '4', countryId: '2' },
        { id: '5', name: 'A-Level', code: 'AL', stateId: '6', countryId: '3' }
      ];
      setSyllabi(mockSyllabi);
    } catch (error) {
      console.error('Failed to load syllabi:', error);
    } finally {
      setIsLoadingSyllabi(false);
    }
  };

  // --- EVENT HANDLERS ---
  const handleCountryFilter = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedState(''); // Reset state when country changes
  };

  const handleStateFilter = (stateId) => {
    setSelectedState(stateId);
  };

  // Country handlers
  const handleAddCountry = async (countryData) => {
    try {
      // Mock API call - replace with actual
      const newCountry = {
        id: Date.now().toString(),
        ...countryData
      };
      setCountries(prev => [...prev, newCountry]);
      alert('Country added successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEditCountry = async (countryId, countryData) => {
    try {
      // Mock API call - replace with actual
      setCountries(prev => prev.map(country => 
        country.id === countryId ? { ...country, ...countryData } : country
      ));
      alert('Country updated successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteCountry = async (countryId) => {
    try {
      // Mock API call - replace with actual
      setCountries(prev => prev.filter(country => country.id !== countryId));
      alert('Country deleted successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // State handlers
  const handleAddState = async (stateData) => {
    try {
      // Mock API call - replace with actual
      const newState = {
        id: Date.now().toString(),
        ...stateData
      };
      setStates(prev => [...prev, newState]);
      alert('State added successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEditState = async (stateId, stateData) => {
    try {
      // Mock API call - replace with actual
      setStates(prev => prev.map(state => 
        state.id === stateId ? { ...state, ...stateData } : state
      ));
      alert('State updated successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteState = async (stateId) => {
    try {
      // Mock API call - replace with actual
      setStates(prev => prev.filter(state => state.id !== stateId));
      alert('State deleted successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // District handlers
  const handleAddDistrict = async (districtData) => {
    try {
      // Mock API call - replace with actual
      const newDistrict = {
        id: Date.now().toString(),
        ...districtData
      };
      setDistricts(prev => [...prev, newDistrict]);
      alert('District added successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEditDistrict = async (districtId, districtData) => {
    try {
      // Mock API call - replace with actual
      setDistricts(prev => prev.map(district => 
        district.id === districtId ? { ...district, ...districtData } : district
      ));
      alert('District updated successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteDistrict = async (districtId) => {
    try {
      // Mock API call - replace with actual
      setDistricts(prev => prev.filter(district => district.id !== districtId));
      alert('District deleted successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Syllabus handlers
  const handleAddSyllabus = async (syllabusData) => {
    try {
      // Mock API call - replace with actual
      const newSyllabus = {
        id: Date.now().toString(),
        ...syllabusData
      };
      setSyllabi(prev => [...prev, newSyllabus]);
      alert('Syllabus added successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEditSyllabus = async (syllabusId, syllabusData) => {
    try {
      // Mock API call - replace with actual
      setSyllabi(prev => prev.map(syllabus => 
        syllabus.id === syllabusId ? { ...syllabus, ...syllabusData } : syllabus
      ));
      alert('Syllabus updated successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteSyllabus = async (syllabusId) => {
    try {
      // Mock API call - replace with actual
      setSyllabi(prev => prev.filter(syllabus => syllabus.id !== syllabusId));
      alert('Syllabus deleted successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchCountries();
    fetchStates();
    fetchDistricts();
    fetchSyllabi();
  }, []);

  useEffect(() => {
    const onWindowClick = (e) => {
      const menuButton = document.getElementById('profile-button');
      const menu = document.getElementById('profile-menu');
      if (isUserMenuOpen && menuButton && menu && !menuButton.contains(e.target) && !menu.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('click', onWindowClick);
    return () => window.removeEventListener('click', onWindowClick);
  }, [isUserMenuOpen]);

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
      {/* Navigation Component */}
      <Navigation currentPage="location-manager" onPageChange={handlePageChange} />
      
      {/* Main Content with offset for sidebar */}
      <div className="lg:ml-72">
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Location Data Management</h1>
              <p className="text-slate-500 text-sm">Manage states, districts, and location data</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button id="profile-button" onClick={() => setIsUserMenuOpen(v => !v)}>
                  <img src="https://api.dicebear.com/8.x/initials/svg?seed=Master+Admin" className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md hover:ring-2 hover:ring-indigo-400 transition-all" alt="Admin Profile" />
                </button>
                {isUserMenuOpen && (
                  <div id="profile-menu" className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-20">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"><i className="fas fa-plus w-4 text-slate-500"></i> School Sign Up Page</a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-slate-100 border-t border-slate-200"><i className="fas fa-sign-out-alt w-4 text-red-500"></i> Logout</a>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* First Row: Statistics Cards */}
          <StatsCards
            totalCountries={totalCountries}
            totalStates={totalStates}
          />

          {/* Second Row: Country and State Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Country Table */}
            <CountryTable
              countries={countries}
              onAddCountry={handleAddCountry}
              onEditCountry={handleEditCountry}
              onDeleteCountry={handleDeleteCountry}
              isLoading={isLoadingCountries}
            />

            {/* State Table */}
            <StateTable
              states={states}
              countries={countries}
              selectedCountry={selectedCountry}
              onCountryFilter={handleCountryFilter}
              onAddState={handleAddState}
              onEditState={handleEditState}
              onDeleteState={handleDeleteState}
              isLoading={isLoadingStates}
            />
          </div>

          {/* Third Row: District and Syllabus Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* District Table */}
            <DistrictTable
              districts={districts}
              countries={countries}
              states={states}
              selectedCountry={selectedCountry}
              selectedState={selectedState}
              onCountryFilter={handleCountryFilter}
              onStateFilter={handleStateFilter}
              onAddDistrict={handleAddDistrict}
              onEditDistrict={handleEditDistrict}
              onDeleteDistrict={handleDeleteDistrict}
              isLoading={isLoadingDistricts}
            />

            {/* Syllabus Table */}
            <SyllabusTable
              syllabi={syllabi}
              onAddSyllabus={handleAddSyllabus}
              onEditSyllabus={handleEditSyllabus}
              onDeleteSyllabus={handleDeleteSyllabus}
              isLoading={isLoadingSyllabi}
            />
          </div>

        </main>
      </div>
    </div>
  );
}

export default LocationManager;

import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../../components/master-components/master-navigation/Navigation';
import StatesList from '../../components/location-components/StatesList';
import DistrictsList from '../../components/location-components/DistrictsList';
import BoardsList from '../../components/location-components/BoardsList';
import LocationTools from '../../components/location-components/LocationTools';
import LocationsTable from '../../components/location-components/LocationsTable';

function LocationManager() {
  const API_BASE_URL = useMemo(() => 'http://localhost:5000/api', []);

  // --- STATE MANAGEMENT ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [allLocationsData, setAllLocationsData] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States and Districts
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [boards, setBoards] = useState([]);
  
  // Form data
  const [newStateName, setNewStateName] = useState('');
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newBoardName, setNewBoardName] = useState('');
  
  // File upload
  const [csvFile, setCsvFile] = useState(null);
  
  // Loading states
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingBoards, setIsLoadingBoards] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // --- DERIVED STATE ---
  const filteredStates = states.filter(state => 
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- API CALLS ---
  const fetchStates = async () => {
    setIsLoadingStates(true);
    try {
      const response = await fetch(`${API_BASE_URL}/locations/states`);
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error('Failed to load states:', error);
    } finally {
      setIsLoadingStates(false);
    }
  };

  const fetchDistricts = async (state) => {
    if (!state) return;
    setIsLoadingDistricts(true);
    try {
      const response = await fetch(`${API_BASE_URL}/locations/districts/${state}`);
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error('Failed to load districts:', error);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const fetchBoards = async (state) => {
    if (!state) return;
    setIsLoadingBoards(true);
    try {
      const response = await fetch(`${API_BASE_URL}/locations/boards/${state}`);
      const data = await response.json();
      setBoards(data);
    } catch (error) {
      console.error('Failed to load boards:', error);
    } finally {
      setIsLoadingBoards(false);
    }
  };

  const fetchAllLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const response = await fetch(`${API_BASE_URL}/locations/all`);
      const data = await response.json();
      setAllLocationsData(data);
      setFilteredLocations(data);
    } catch (error) {
      console.error('Failed to load all locations:', error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // --- EVENT HANDLERS ---
  const handleStateSelect = (state) => {
    setSelectedState(state);
    fetchDistricts(state);
    fetchBoards(state);
  };

  const handleAddState = async (e) => {
    e.preventDefault();
    if (!newStateName.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/locations/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newStateName.trim() })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      
      setNewStateName('');
      fetchStates();
      fetchAllLocations();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddDistrict = async (e) => {
    e.preventDefault();
    if (!newDistrictName.trim() || !selectedState) {
      alert('Please select a state first.');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/locations/district`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: selectedState, district: newDistrictName.trim() })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      
      setNewDistrictName('');
      fetchDistricts(selectedState);
      fetchAllLocations();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteDistrict = async (district) => {
    if (!selectedState) return;
    
    if (confirm(`Are you sure you want to delete the district "${district}" from ${selectedState}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/locations/district`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: selectedState, district })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }
        
        fetchDistricts(selectedState);
        fetchAllLocations();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleAddBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim() || !selectedState) {
      alert('Please select a state first.');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/locations/board`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: selectedState, board: newBoardName.trim() })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      
      setNewBoardName('');
      fetchBoards(selectedState);
      fetchAllLocations();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteBoard = async (board) => {
    if (!selectedState) return;
    
    if (confirm(`Are you sure you want to delete the board "${board}" from ${selectedState}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/locations/board`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: selectedState, board })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }
        
        fetchBoards(selectedState);
        fetchAllLocations();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleBulkUpload = async () => {
    if (!csvFile) {
      alert('Please select a CSV file to upload.');
      return;
    }
    
    try {
      const fileText = await csvFile.text();
      const response = await fetch(`${API_BASE_URL}/locations/bulk-upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData: fileText })
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      alert(result.message);
      setCsvFile(null);
      fetchStates();
      fetchAllLocations();
      setSelectedState(null);
      setDistricts([]);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = allLocationsData.filter(loc => 
      loc.state.toLowerCase().includes(term.toLowerCase()) ||
      loc.district.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const downloadTemplate = () => {
    const csvContent = 'State,District\nKerala,Kozhikode\nKerala,Kochi\nPunjab,Amritsar';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'location_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchStates();
    fetchAllLocations();
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

          {/* Top Section: Interactive Management */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Column 1: States List */}
            <StatesList
              states={states}
              selectedState={selectedState}
              isLoadingStates={isLoadingStates}
              onStateSelect={handleStateSelect}
            />

            {/* Column 2: Districts List */}
            <DistrictsList
              selectedState={selectedState}
              districts={districts}
              isLoadingDistricts={isLoadingDistricts}
              newDistrictName={newDistrictName}
              onDistrictNameChange={setNewDistrictName}
              onAddDistrict={handleAddDistrict}
              onDeleteDistrict={handleDeleteDistrict}
            />

            {/* Column 3: Boards List */}
            <BoardsList
              selectedState={selectedState}
              boards={boards}
              isLoadingBoards={isLoadingBoards}
              newBoardName={newBoardName}
              onBoardNameChange={setNewBoardName}
              onAddBoard={handleAddBoard}
              onDeleteBoard={handleDeleteBoard}
            />

            {/* Column 4: Tools */}
            <LocationTools
              newStateName={newStateName}
              onStateNameChange={setNewStateName}
              onAddState={handleAddState}
              onDownloadTemplate={downloadTemplate}
              csvFile={csvFile}
              onFileChange={(e) => setCsvFile(e.target.files[0])}
              onBulkUpload={handleBulkUpload}
            />
          </div>

          {/* All Locations Table */}
          <LocationsTable
            filteredLocations={filteredLocations}
            isLoadingLocations={isLoadingLocations}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

        </main>
      </div>
    </div>
  );
}

export default LocationManager;

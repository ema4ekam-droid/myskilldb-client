import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../../components/master-components/master-navigation/Navigation';
import SchoolModal from '../../components/master-components/master-modal/SchoolModal';
import ConfirmModal from '../../components/master-components/master-modal/ConfirmModal';

// NOTE: Ensure you have Font Awesome included in your project for these icons to work.
// For example, in your public/index.html:
// <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">

function MasterDashboard() {
  const API_BASE_URL = useMemo(() => 'http://localhost:5000/api', []);

  // --- STATE MANAGEMENT (Unchanged) ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
   const [stats, setStats] = useState({ totalSchools: 125, pendingSchools: 3, accountManagers: 8 });
  const [schools, setSchools] = useState([
    { school_id: 's1', school_name: 'Greenwood High School', status: 'active', admin_email: 'admin.greenwood@example.com' },
    { school_id: 's2', school_name: 'Riverside Academy', status: 'trial', admin_email: 'admin.riverside@example.com' },
    { school_id: 's3', school_name: 'Northwood Elementary', status: 'active', admin_email: 'admin.northwood@example.com' },
    { school_id: 's4', school_name: 'Oak Creek Institute', status: 'inactive', admin_email: 'admin.oakcreek@example.com' },
    { school_id: 's5', school_name: 'Sunset Hills College', status: 'active', admin_email: 'admin.sunsethills@example.com' },
  ]);
  const [pendingSchools, setPendingSchools] = useState([
    { school_id: 'p1', school_name: 'New Horizon School', admin_email: 'new.horizon@example.com', date_enrolled: '2023-10-26T10:00:00Z' },
    { school_id: 'p2', school_name: 'Bright Minds Institute', admin_email: 'bright.minds@example.com', date_enrolled: '2023-10-25T14:30:00Z' },
  ]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Reduced for demo
  
  const [filters, setFilters] = useState({ name: '', date: '', state: '', district: '', pincode: '' });
  
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [schoolModalMode, setSchoolModalMode] = useState('create');
  const [editingSchool, setEditingSchool] = useState(null);
  const [schoolFormData, setSchoolFormData] = useState({
    schoolName: '',
    adminEmail: '',
    adminName: '',
    mobileNumber: '',
    alternateEmail: '',
    address: '',
    state: '',
    district: '',
    pincode: '',
    schoolType: 'public',
    boardAffiliation: '',
    establishedYear: '',
    totalStudents: '',
    totalTeachers: '',
    principalName: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});
  
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveSchoolMeta, setApproveSchoolMeta] = useState({ id: '', name: '' });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: null });

  const [locations, setLocations] = useState({ 
    states: ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Kerala', 'Delhi', 'Gujarat', 'Rajasthan'], 
    districts: [], 
    filterDistricts: [] 
  });
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);

  // --- DERIVED STATE (Unchanged) ---
  const totalPages = Math.max(1, Math.ceil(stats.totalSchools / rowsPerPage));
  const allChecked = schools.length > 0 && selectedSchoolIds.length === schools.length;
  
  // --- API CALLS (MOCKED) & EVENT HANDLERS (Unchanged) ---
  const fetchData = async () => {};
  const fetchSchools = async (page = 1) => {};
  const fetchPending = async () => {};
  const fetchStates = async () => setLocations(prev => ({ ...prev, states: ['Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Maharashtra'] }));
  const fetchDistricts = async (stateValue, forFilter = false) => {
    // Mock district data based on state
    const districtMap = {
      'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirapalli'],
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
      'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
      'Delhi': ['New Delhi', 'Central Delhi', 'East Delhi', 'North Delhi', 'South Delhi'],
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
      'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer']
    };
    
    const mockDistricts = stateValue ? (districtMap[stateValue] || []) : [];
    if (forFilter) setLocations(prev => ({ ...prev, filterDistricts: mockDistricts }));
    else setLocations(prev => ({ ...prev, districts: mockDistricts }));
  };
  
  useEffect(() => {
    fetchData();
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

  const handleFilterSubmit = (e) => { e.preventDefault(); };
  const toggleSelectAll = (checked) => setSelectedSchoolIds(checked ? schools.map(s => s.school_id) : []);
  const toggleSelectOne = (schoolId, checked) => setSelectedSchoolIds(prev => (checked ? [...new Set([...prev, schoolId])] : prev.filter(id => id !== schoolId)));
  // --- FORM VALIDATION & HANDLERS ---
  const validateForm = () => {
    const errors = {};
    
    if (!schoolFormData.schoolName.trim()) errors.schoolName = 'School name is required';
    if (!schoolFormData.adminEmail.trim()) errors.adminEmail = 'Admin email is required';
    else if (!/\S+@\S+\.\S+/.test(schoolFormData.adminEmail)) errors.adminEmail = 'Please enter a valid email';
    if (!schoolFormData.adminName.trim()) errors.adminName = 'Admin name is required';
    if (!schoolFormData.mobileNumber.trim()) errors.mobileNumber = 'Mobile number is required';
    else if (!/^[0-9]{10}$/.test(schoolFormData.mobileNumber.replace(/\D/g, ''))) errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    if (!schoolFormData.address.trim()) errors.address = 'Address is required';
    if (!schoolFormData.state.trim()) errors.state = 'State is required';
    if (!schoolFormData.district.trim()) errors.district = 'District is required';
    if (!schoolFormData.pincode.trim()) errors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(schoolFormData.pincode)) errors.pincode = 'Please enter a valid 6-digit pincode';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setSchoolFormData({
      schoolName: '',
      adminEmail: '',
      adminName: '',
      mobileNumber: '',
      alternateEmail: '',
      address: '',
      state: '',
      district: '',
      pincode: '',
      schoolType: 'public',
      boardAffiliation: '',
      establishedYear: '',
      totalStudents: '',
      totalTeachers: '',
      principalName: '',
      status: 'active'
    });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setSchoolFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // If state changes, fetch districts and clear district selection
    if (field === 'state') {
      fetchDistricts(value, false);
      setSchoolFormData(prev => ({ ...prev, district: '' }));
    }
  };

  const handleSchoolFormSubmit = async (e) => {
    e.preventDefault();
    
    // Don't submit if in view mode
    if (schoolModalMode === 'view') return;
    
    if (!validateForm()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/schools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolFormData)
      });
      
      if (!response.ok) throw new Error('Failed to create school');
      
      // Add to local state for immediate UI update
      const newSchool = {
        school_id: `s${Date.now()}`,
        school_name: schoolFormData.schoolName,
        status: schoolFormData.status,
        admin_email: schoolFormData.adminEmail,
        admin_name: schoolFormData.adminName,
        mobile_number: schoolFormData.mobileNumber,
        address: schoolFormData.address,
        state: schoolFormData.state,
        district: schoolFormData.district,
        pincode: schoolFormData.pincode,
        school_type: schoolFormData.schoolType,
        board_affiliation: schoolFormData.boardAffiliation,
        established_year: schoolFormData.establishedYear,
        total_students: schoolFormData.totalStudents,
        total_teachers: schoolFormData.totalTeachers,
        principal_name: schoolFormData.principalName,
        created_date: new Date().toISOString().split('T')[0]
      };
      
      setSchools(prev => [newSchool, ...prev]);
      setIsSchoolModalOpen(false);
      resetForm();
      alert('School created successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const openCreateSchool = () => { 
    setEditingSchool(null); 
    setSchoolModalMode('create'); 
    resetForm();
    setIsSchoolModalOpen(true); 
  };
  
  const openEditOrViewSchool = (schoolId, mode) => { 
    const school = schools.find(s => s.school_id === schoolId);
    setEditingSchool(school); 
    setSchoolModalMode(mode); 
    
    // Populate form data when viewing/editing
    if (school) {
      setSchoolFormData({
        schoolName: school.school_name || '',
        adminEmail: school.admin_email || '',
        adminName: school.admin_name || '',
        mobileNumber: school.mobile_number || '',
        alternateEmail: school.alternate_email || '',
        address: school.address || '',
        state: school.state || '',
        district: school.district || '',
        pincode: school.pincode || '',
        schoolType: school.school_type || 'public',
        boardAffiliation: school.board_affiliation || '',
        establishedYear: school.established_year || '',
        totalStudents: school.total_students || '',
        totalTeachers: school.total_teachers || '',
        principalName: school.principal_name || '',
        status: school.status || 'active'
      });
      
      // Fetch districts for the selected state
      if (school.state) {
        fetchDistricts(school.state, false);
      }
    }
    
    setIsSchoolModalOpen(true); 
  };
  const handleDeleteSchool = async (schoolId) => {};
  const openConfirm = (title, message, onConfirm) => { setConfirmConfig({ title, message, onConfirm }); setIsConfirmOpen(true); };
  const bulkDelete = () => { if (selectedSchoolIds.length > 0) openConfirm('Bulk Delete Schools', `Are you sure you want to delete ${selectedSchoolIds.length} selected schools?`, () => {}); };
  const approveSchool = async (status) => {};
  
  // Navigation handler
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
    // Here you would typically use React Router or your routing solution
    // For now, we'll just log the navigation
  };

  // --- UI COMPONENTS ---
  const StatusPill = ({ status }) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      trial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status] || 'bg-slate-100 text-slate-800'}`}>{status}</span>;
  };
  
  // Base component styles from new theme
  const inputBaseClass = "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed";
  const btnBaseClass = "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnTealClass = `${btnBaseClass} bg-teal-500 hover:bg-teal-600 text-white`;
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnRoseClass = `${btnBaseClass} bg-rose-500 hover:bg-rose-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      {/* Navigation Component */}
      <Navigation currentPage="dashboard" onPageChange={handlePageChange} />
      
      {/* Main Content with offset for sidebar */}
      <div className="lg:ml-72">
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Master Dashboard</h1>
              <p className="text-slate-500 text-sm">System Overview & Management</p>
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

           <section>
             <h2 className="text-xl font-bold mb-4 text-slate-900">Platform Overview</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                   <div className="bg-indigo-100 p-4 rounded-full"><i className="fas fa-school fa-2x text-indigo-500"></i></div>
                   <div>
                       <p className="text-slate-500 text-sm">Total Approved Schools</p>
                       <p className="text-3xl font-bold text-slate-900">{stats.totalSchools}</p>
                   </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                   <div className="bg-amber-100 p-4 rounded-full"><i className="fas fa-bell fa-2x text-amber-500"></i></div>
                   <div>
                       <p className="text-slate-500 text-sm">Pending School Approvals</p>
                       <p className="text-3xl font-bold text-slate-900">{stats.pendingSchools}</p>
                   </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                   <div className="bg-emerald-100 p-4 rounded-full"><i className="fas fa-users fa-2x text-emerald-500"></i></div>
                   <div>
                       <p className="text-slate-500 text-sm">Account Managers</p>
                       <p className="text-3xl font-bold text-slate-900">{stats.accountManagers}</p>
                   </div>
               </div>
             </div>
           </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-5 text-slate-900">Filter Schools</h2>
            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <input type="text" placeholder="School Name, Email..." className={`${inputBaseClass} sm:col-span-2 lg:col-span-3`} value={filters.name} onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))}/>
              <select className={inputBaseClass} value={filters.state} onChange={async (e) => { const v = e.target.value; setFilters(f => ({ ...f, state: v, district: '' })); await fetchDistricts(v, true); }}>
                <option value="">Select State</option>
                {locations.states.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
              <select className={inputBaseClass} disabled={!filters.state} value={filters.district} onChange={(e) => setFilters(f => ({ ...f, district: e.target.value }))}>
                <option value="">Select District</option>
                {locations.filterDistricts.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
              <button type="submit" className={`${btnIndigoClass} w-full`}>
                <i className="fas fa-search"></i> Apply Filters
              </button>
            </form>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <h2 className="text-xl font-bold text-slate-900">Approved School Logins</h2>
                  <div className="flex items-center gap-3">
                    {selectedSchoolIds.length > 0 && (
                       <button onClick={bulkDelete} className={btnRoseClass}>
                         <i className="fas fa-trash-alt"></i> Delete ({selectedSchoolIds.length})
                       </button>
                    )}
                    <button onClick={openCreateSchool} className={btnTealClass}>
                      <i className="fas fa-plus"></i> Create New School
                    </button>
                  </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-4 w-12"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={allChecked} onChange={e => toggleSelectAll(e.target.checked)}/></th>
                    <th className="p-4 text-left font-semibold">School Name</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Admin Email</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {schools.length > 0 ? schools.map(school => (
                    <tr key={school.school_id} className="hover:bg-slate-50">
                      <td className="p-4"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={selectedSchoolIds.includes(school.school_id)} onChange={e => toggleSelectOne(school.school_id, e.target.checked)}/></td>
                      <td className="p-4 font-semibold text-slate-900">{school.school_name}</td>
                      <td className="p-4"><StatusPill status={school.status} /></td>
                      <td className="p-4 text-slate-600">{school.admin_email}</td>
                      <td className="p-4 text-center">
                          <div className="inline-flex rounded-md shadow-sm" role="group">
                              <button onClick={() => openEditOrViewSchool(school.school_id, 'view')} className="px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-l-lg hover:bg-slate-100">View</button>
                              <button onClick={() => openEditOrViewSchool(school.school_id, 'edit')} className="px-3 py-2 text-xs font-medium text-slate-900 bg-white border-t border-b border-slate-200 hover:bg-slate-100">Edit</button>
                              <button onClick={() => openConfirm('Delete School', `Are you sure you want to delete "${school.school_name}"?`, () => handleDeleteSchool(school.school_id))} className="px-3 py-2 text-xs font-medium text-rose-600 bg-white border border-slate-200 rounded-r-md hover:bg-slate-100">Delete</button>
                          </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="text-center p-8 text-slate-500">No schools found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-slate-200 bg-slate-50 text-sm">
                <button className={`${btnSlateClass} disabled:opacity-50`} disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                <span className="font-medium text-slate-700">Page {currentPage} of {totalPages}</span>
                <button className={`${btnSlateClass} disabled:opacity-50`} disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
              </div>
            )}
          </section>

          {pendingSchools.length > 0 && (
            <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Pending Approvals</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-4 text-left font-semibold">School Name</th>
                                <th className="p-4 text-left font-semibold">Admin Email</th>
                                <th className="p-4 text-left font-semibold">Date Registered</th>
                                <th className="p-4 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {pendingSchools.map(s => (
                                <tr key={s.school_id} className="hover:bg-slate-50">
                                    <td className="p-4 font-semibold text-slate-900">{s.school_name}</td>
                                    <td className="p-4 text-slate-600">{s.admin_email}</td>
                                    <td className="p-4 text-slate-600">{new Date(s.date_enrolled).toLocaleDateString()}</td>
                                    <td className="p-4 text-center space-x-2">
                                        <button onClick={() => { setApproveSchoolMeta({ id: s.school_id, name: s.school_name }); setIsApproveModalOpen(true); }} className="font-semibold text-green-600 hover:text-green-800">Approve</button>
                                        <button onClick={() => openConfirm('Reject Application', `Reject and delete the application for "${s.school_name}"? This cannot be undone.`, () => {})} className="font-semibold text-rose-600 hover:text-rose-800">Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
          )}

        </main>
      </div>

      {/* School Creation Modal */}
      <SchoolModal
        isOpen={isSchoolModalOpen}
        onClose={() => { setIsSchoolModalOpen(false); resetForm(); }}
        schoolModalMode={schoolModalMode}
        schoolFormData={schoolFormData}
        formErrors={formErrors}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
        locations={locations}
        handleInputChange={handleInputChange}
        handleSchoolFormSubmit={handleSchoolFormSubmit}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        btnSlateClass={btnSlateClass}
        btnRoseClass={btnRoseClass}
      />

    </div>
  );
}

export default MasterDashboard;
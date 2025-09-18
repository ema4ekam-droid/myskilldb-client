import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../../components/master-components/master-navigation/Navigation';

function Schools() {
  const API_BASE_URL = useMemo(() => 'http://localhost:5000/api', []);

  // --- STATE MANAGEMENT ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [schools, setSchools] = useState([
    { 
      school_id: 's1', 
      school_name: 'Greenwood High School', 
      status: 'active', 
      admin_email: 'admin.greenwood@example.com',
      admin_name: 'John Smith',
      mobile_number: '9876543210',
      address: '123 Education Street, Learning City',
      state: 'Karnataka',
      district: 'Bangalore',
      pincode: '560001',
      school_type: 'public',
      board_affiliation: 'CBSE',
      established_year: '1995',
      total_students: '1200',
      total_teachers: '45',
      principal_name: 'Dr. Sarah Johnson',
      created_date: '2023-01-15'
    },
    { 
      school_id: 's2', 
      school_name: 'Riverside Academy', 
      status: 'trial', 
      admin_email: 'admin.riverside@example.com',
      admin_name: 'Emily Davis',
      mobile_number: '9876543211',
      address: '456 River Road, Water Town',
      state: 'Tamil Nadu',
      district: 'Chennai',
      pincode: '600001',
      school_type: 'private',
      board_affiliation: 'ICSE',
      established_year: '2010',
      total_students: '800',
      total_teachers: '32',
      principal_name: 'Mr. Rajesh Kumar',
      created_date: '2023-02-20'
    },
    { 
      school_id: 's3', 
      school_name: 'Northwood Elementary', 
      status: 'active', 
      admin_email: 'admin.northwood@example.com',
      admin_name: 'Lisa Wilson',
      mobile_number: '9876543212',
      address: '789 Forest Avenue, Green Valley',
      state: 'Maharashtra',
      district: 'Mumbai',
      pincode: '400001',
      school_type: 'public',
      board_affiliation: 'State Board',
      established_year: '1988',
      total_students: '600',
      total_teachers: '25',
      principal_name: 'Mrs. Priya Sharma',
      created_date: '2023-03-10'
    },
    { 
      school_id: 's4', 
      school_name: 'Oak Creek Institute', 
      status: 'inactive', 
      admin_email: 'admin.oakcreek@example.com',
      admin_name: 'Michael Brown',
      mobile_number: '9876543213',
      address: '321 Oak Street, Creek City',
      state: 'Kerala',
      district: 'Kochi',
      pincode: '682001',
      school_type: 'private',
      board_affiliation: 'CBSE',
      established_year: '2005',
      total_students: '400',
      total_teachers: '18',
      principal_name: 'Dr. Anita Nair',
      created_date: '2023-04-05'
    },
    { 
      school_id: 's5', 
      school_name: 'Sunset Hills College', 
      status: 'active', 
      admin_email: 'admin.sunsethills@example.com',
      admin_name: 'David Lee',
      mobile_number: '9876543214',
      address: '654 Hill Road, Sunset City',
      state: 'Delhi',
      district: 'New Delhi',
      pincode: '110001',
      school_type: 'private',
      board_affiliation: 'IB',
      established_year: '2015',
      total_students: '1500',
      total_teachers: '60',
      principal_name: 'Dr. Sunita Patel',
      created_date: '2023-05-12'
    }
  ]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  const [filters, setFilters] = useState({ 
    name: '', 
    status: '', 
    state: '', 
    district: '', 
    schoolType: '',
    boardAffiliation: ''
  });
  
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [schoolModalMode, setSchoolModalMode] = useState('create');
  const [editingSchool, setEditingSchool] = useState(null);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: null });

  const [locations, setLocations] = useState({ 
    states: ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Kerala', 'Delhi', 'Gujarat', 'Rajasthan'], 
    districts: [], 
    filterDistricts: [] 
  });

  // --- DERIVED STATE ---
  const filteredSchools = schools.filter(school => {
    return (
      (!filters.name || school.school_name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.status || school.status === filters.status) &&
      (!filters.state || school.state === filters.state) &&
      (!filters.district || school.district === filters.district) &&
      (!filters.schoolType || school.school_type === filters.schoolType) &&
      (!filters.boardAffiliation || school.board_affiliation === filters.boardAffiliation)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / rowsPerPage));
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const allChecked = paginatedSchools.length > 0 && selectedSchoolIds.length === paginatedSchools.length;

  // --- STATS ---
  const stats = {
    total: schools.length,
    active: schools.filter(s => s.status === 'active').length,
    trial: schools.filter(s => s.status === 'trial').length,
    inactive: schools.filter(s => s.status === 'inactive').length
  };

  // --- EVENT HANDLERS ---
  const handleFilterSubmit = (e) => { 
    e.preventDefault(); 
    setCurrentPage(1);
  };

  const toggleSelectAll = (checked) => {
    setSelectedSchoolIds(checked ? paginatedSchools.map(s => s.school_id) : []);
  };

  const toggleSelectOne = (schoolId, checked) => {
    setSelectedSchoolIds(prev => (checked ? [...new Set([...prev, schoolId])] : prev.filter(id => id !== schoolId)));
  };

  const openCreateSchool = () => { 
    setEditingSchool(null); 
    setSchoolModalMode('create'); 
    setIsSchoolModalOpen(true); 
  };

  const openEditOrViewSchool = (schoolId, mode) => { 
    setEditingSchool(schools.find(s => s.school_id === schoolId)); 
    setSchoolModalMode(mode); 
    setIsSchoolModalOpen(true); 
  };

  const handleDeleteSchool = async (schoolId) => {
    setSchools(prev => prev.filter(s => s.school_id !== schoolId));
    setSelectedSchoolIds(prev => prev.filter(id => id !== schoolId));
  };

  const openConfirm = (title, message, onConfirm) => { 
    setConfirmConfig({ title, message, onConfirm }); 
    setIsConfirmOpen(true); 
  };

  const bulkDelete = () => { 
    if (selectedSchoolIds.length > 0) {
      openConfirm('Bulk Delete Schools', `Are you sure you want to delete ${selectedSchoolIds.length} selected schools?`, () => {
        setSchools(prev => prev.filter(s => !selectedSchoolIds.includes(s.school_id)));
        setSelectedSchoolIds([]);
      });
    }
  };

  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
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
      <Navigation currentPage="schools" onPageChange={handlePageChange} />
      
      {/* Main Content with offset for sidebar */}
      <div className="lg:ml-72">
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Schools Management</h1>
              <p className="text-slate-500 text-sm">Manage all registered schools and their information</p>
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

          {/* Stats Cards */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-slate-900">School Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-indigo-100 p-4 rounded-full"><i className="fas fa-school fa-2x text-indigo-500"></i></div>
                <div>
                  <p className="text-slate-500 text-sm">Total Schools</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-green-100 p-4 rounded-full"><i className="fas fa-check-circle fa-2x text-green-500"></i></div>
                <div>
                  <p className="text-slate-500 text-sm">Active Schools</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.active}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-yellow-100 p-4 rounded-full"><i className="fas fa-clock fa-2x text-yellow-500"></i></div>
                <div>
                  <p className="text-slate-500 text-sm">Trial Schools</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.trial}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-red-100 p-4 rounded-full"><i className="fas fa-times-circle fa-2x text-red-500"></i></div>
                <div>
                  <p className="text-slate-500 text-sm">Inactive Schools</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.inactive}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-5 text-slate-900">Filter Schools</h2>
            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <input 
                type="text" 
                placeholder="School Name..." 
                className={`${inputBaseClass} sm:col-span-2 lg:col-span-1`} 
                value={filters.name} 
                onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))}
              />
              <select 
                className={inputBaseClass} 
                value={filters.status} 
                onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="inactive">Inactive</option>
              </select>
              <select 
                className={inputBaseClass} 
                value={filters.state} 
                onChange={(e) => setFilters(f => ({ ...f, state: e.target.value, district: '' }))}
              >
                <option value="">All States</option>
                {locations.states.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
              <select 
                className={inputBaseClass} 
                disabled={!filters.state} 
                value={filters.district} 
                onChange={(e) => setFilters(f => ({ ...f, district: e.target.value }))}
              >
                <option value="">All Districts</option>
                {locations.filterDistricts.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
              <select 
                className={inputBaseClass} 
                value={filters.schoolType} 
                onChange={(e) => setFilters(f => ({ ...f, schoolType: e.target.value }))}
              >
                <option value="">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <select 
                className={inputBaseClass} 
                value={filters.boardAffiliation} 
                onChange={(e) => setFilters(f => ({ ...f, boardAffiliation: e.target.value }))}
              >
                <option value="">All Boards</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="IB">IB</option>
              </select>
              <button type="submit" className={`${btnIndigoClass} w-full`}>
                <i className="fas fa-search"></i> Apply Filters
              </button>
            </form>
          </section>

          {/* Schools Table */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900">All Schools ({filteredSchools.length})</h2>
                <div className="flex items-center gap-3">
                  {selectedSchoolIds.length > 0 && (
                    <button onClick={bulkDelete} className={btnRoseClass}>
                      <i className="fas fa-trash-alt"></i> Delete ({selectedSchoolIds.length})
                    </button>
                  )}
                  <button onClick={openCreateSchool} className={btnTealClass}>
                    <i className="fas fa-plus"></i> Add New School
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-4 w-12">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                        checked={allChecked} 
                        onChange={e => toggleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="p-4 text-left font-semibold">School Name</th>
                    <th className="p-4 text-left font-semibold">Admin</th>
                    <th className="p-4 text-left font-semibold">Location</th>
                    <th className="p-4 text-left font-semibold">Type</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedSchools.length > 0 ? paginatedSchools.map(school => (
                    <tr key={school.school_id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                          checked={selectedSchoolIds.includes(school.school_id)} 
                          onChange={e => toggleSelectOne(school.school_id, e.target.checked)}
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-semibold text-slate-900">{school.school_name}</div>
                          <div className="text-slate-500 text-xs">{school.board_affiliation}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-slate-900">{school.admin_name}</div>
                          <div className="text-slate-500 text-xs">{school.admin_email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-slate-900">{school.district}, {school.state}</div>
                          <div className="text-slate-500 text-xs">{school.pincode}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          school.school_type === 'public' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {school.school_type}
                        </span>
                      </td>
                      <td className="p-4"><StatusPill status={school.status} /></td>
                      <td className="p-4 text-center">
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                          <button 
                            onClick={() => openEditOrViewSchool(school.school_id, 'view')} 
                            className="px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-l-lg hover:bg-slate-100"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => openEditOrViewSchool(school.school_id, 'edit')} 
                            className="px-3 py-2 text-xs font-medium text-slate-900 bg-white border-t border-b border-slate-200 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => openConfirm('Delete School', `Are you sure you want to delete "${school.school_name}"?`, () => handleDeleteSchool(school.school_id))} 
                            className="px-3 py-2 text-xs font-medium text-rose-600 bg-white border border-slate-200 rounded-r-md hover:bg-slate-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" className="text-center p-8 text-slate-500">No schools found matching your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-slate-200 bg-slate-50 text-sm">
                <button 
                  className={`${btnSlateClass} disabled:opacity-50`} 
                  disabled={currentPage <= 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Previous
                </button>
                <span className="font-medium text-slate-700">Page {currentPage} of {totalPages}</span>
                <button 
                  className={`${btnSlateClass} disabled:opacity-50`} 
                  disabled={currentPage >= totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </section>

        </main>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">{confirmConfig.title}</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600">{confirmConfig.message}</p>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-4 rounded-b-lg">
              <button onClick={() => setIsConfirmOpen(false)} className={btnSlateClass}>Cancel</button>
              <button onClick={() => { confirmConfig.onConfirm(); setIsConfirmOpen(false); }} className={btnRoseClass}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schools;

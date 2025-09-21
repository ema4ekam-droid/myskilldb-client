import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Navigation from '../../components/master-user-components/master-dashboard-components/master-navigation/Navigation';
import OrganizationModal from '../../components/master-user-components/master-dashboard-components/master-modal/OrganizationModal';
import ConfirmModal from '../../components/master-user-components/master-dashboard-components/master-modal/ConfirmModal';

function MasterDashboard() {
  const API_BASE_URL = useMemo(() => 'http://localhost:5000/api', []);

  // --- STATE MANAGEMENT ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    pendingOrganizations: 0,
    accountManagers: 8
  });

  const [organizations, setOrganizations] = useState([]);
  const [pendingOrganizations, setPendingOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    country: '',
    state: '',
    district: ''
  });

  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const [organizationModalMode, setOrganizationModalMode] = useState('create');
  const [editingOrganization, setEditingOrganization] = useState(null);

  const [organizationFormData, setOrganizationFormData] = useState({
    name: '',
    board: '',
    establishedYear: '',
    adminName: '',
    adminEmail: '',
    mobileNumber: '',
    alternateEmail: '',
    address: '',
    country: '',
    state: '',
    district: '',
    pincode: '',
    totalStudents: '',
    totalTeachers: '',
    principalName: '',
    status: 'pending'
  });

  const [formErrors, setFormErrors] = useState({});

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: '',
    message: '',
    onConfirm: null
  });

  const [locations, setLocations] = useState({
    countries: [],
    states: [],
    districts: [],
    filterStates: [],
    filterDistricts: []
  });

  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState([]);

  // --- DERIVED STATE ---
  const allChecked = organizations.length > 0 && selectedOrganizationIds.length === organizations.length;

  // --- API CALLS ---
  const fetchData = async () => {
    await Promise.all([
      fetchOrganizations(),
      fetchCountries()
    ]);
  };

  const fetchOrganizations = async (filterParams = {}) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value.trim()) {
          params.append(key, value);
        }
      });

      const response = await axios.get(`${API_BASE_URL}/organization?${params}`);
      
      if (response.data.success) {
        const allOrgs = response.data.data;
        const activeOrgs = allOrgs.filter(org => org.status !== 'pending');
        const pendingOrgs = allOrgs.filter(org => org.status === 'pending');
        
        setOrganizations(activeOrgs);
        setPendingOrganizations(pendingOrgs);
        
        setStats(prev => ({
          ...prev,
          totalOrganizations: activeOrgs.length,
          pendingOrganizations: pendingOrgs.length
        }));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/countries`);
      if (response.data.success) {
        const countries = response.data.data.map(country => ({
          name: country.country,
          code: country.countryCode
        }));
        setLocations(prev => ({ ...prev, countries }));
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (countryCode, forFilter = false) => {
    try {
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
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchDistricts = async (stateCode, forFilter = false) => {
    try {
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
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleApiError = (error) => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;

      if (Array.isArray(responseData?.errors)) {
        const errorMap = {};
        responseData.errors.forEach((err) => {
          errorMap[err.field] = err.message;
        });
        setFormErrors(errorMap);
      } else if (responseData?.message) {
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
    fetchOrganizations(filters);
  };

  const toggleSelectAll = (checked) => {
    setSelectedOrganizationIds(checked ? organizations.map(org => org._id) : []);
  };

  const toggleSelectOne = (orgId, checked) => {
    setSelectedOrganizationIds(prev => 
      checked ? [...new Set([...prev, orgId])] : prev.filter(id => id !== orgId)
    );
  };

  // --- FORM VALIDATION & HANDLERS ---
  const resetForm = () => {
    setOrganizationFormData({
      name: '',
      board: '',
      establishedYear: '',
      adminName: '',
      adminEmail: '',
      mobileNumber: '',
      alternateEmail: '',
      address: '',
      country: '',
      state: '',
      district: '',
      pincode: '',
      totalStudents: '',
      totalTeachers: '',
      principalName: '',
      status: 'pending'
    });
    setFormErrors({});
  };

  const handleInputChange = async (field, value) => {
    setOrganizationFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle location changes
    if (field === 'country') {
      const selectedCountry = locations.countries.find(c => c.name === value);
      if (selectedCountry) {
        setOrganizationFormData(prev => ({ ...prev, state: '', district: '' }));
        await fetchStates(selectedCountry.code, false);
      }
    } else if (field === 'state') {
      const selectedState = locations.states.find(s => s.name === value);
      if (selectedState) {
        setOrganizationFormData(prev => ({ ...prev, district: '' }));
        await fetchDistricts(selectedState.code, false);
      }
    }
  };

  const handleOrganizationFormSubmit = async (e) => {
    e.preventDefault();
    
    if (organizationModalMode === 'view') return;

    try {
      setIsLoading(true);
      setFormErrors({});

      const submitData = {
        ...organizationFormData,
        establishedYear: parseInt(organizationFormData.establishedYear),
        totalStudents: parseInt(organizationFormData.totalStudents),
        totalTeachers: parseInt(organizationFormData.totalTeachers)
      };

      let response;
      if (organizationModalMode === 'edit') {
        response = await axios.put(`${API_BASE_URL}/organization/${editingOrganization._id}`, submitData);
      } else {
        response = await axios.post(`${API_BASE_URL}/organization`, submitData);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setIsOrganizationModalOpen(false);
        resetForm();
        await fetchOrganizations();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateOrganization = () => {
    setEditingOrganization(null);
    setOrganizationModalMode('create');
    resetForm();
    setIsOrganizationModalOpen(true);
  };

  const openEditOrViewOrganization = async (orgId, mode) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/organization/${orgId}`);
      if (response.data.success) {
        const org = response.data.data;
        setEditingOrganization(org);
        setOrganizationModalMode(mode);

        // Populate form data
        setOrganizationFormData({
          name: org.name || '',
          board: org.board || '',
          establishedYear: org.establishedYear || '',
          adminName: org.adminName || '',
          adminEmail: org.adminEmail || '',
          mobileNumber: org.mobileNumber || '',
          alternateEmail: org.alternateEmail || '',
          address: org.address || '',
          country: org.country || '',
          state: org.state || '',
          district: org.district || '',
          pincode: org.pincode || '',
          totalStudents: org.totalStudents || '',
          totalTeachers: org.totalTeachers || '',
          principalName: org.principalName || '',
          status: org.status || 'pending'
        });

        // Fetch related location data
        if (org.country) {
          const country = locations.countries.find(c => c.name === org.country);
          if (country) {
            await fetchStates(country.code, false);
            if (org.state) {
              // Wait for states to be loaded before finding the state
              setTimeout(async () => {
                const updatedStates = locations.states.length > 0 ? locations.states : 
                  (await axios.get(`${API_BASE_URL}/locations/states/${country.code}`)).data.data.map(s => ({
                    name: s.state,
                    code: s.stateCode
                  }));
                const state = updatedStates.find(s => s.name === org.state);
              if (state) {
                await fetchDistricts(state.code, false);
              }
              }, 100);
            }
          }
        }

        setIsOrganizationModalOpen(true);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteOrganization = async (orgId) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/organization/${orgId}`);
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchOrganizations();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeStatus = async (orgId, action) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`${API_BASE_URL}/organization/${orgId}/status`, { action });
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchOrganizations();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirm = (title, message, onConfirm) => {
    setConfirmConfig({ title, message, onConfirm });
    setIsConfirmOpen(true);
  };

  const bulkDelete = () => {
    if (selectedOrganizationIds.length > 0) {
      openConfirm(
        'Bulk Delete Organizations',
        `Are you sure you want to delete ${selectedOrganizationIds.length} selected organizations?`,
        async () => {
          try {
            setIsLoading(true);
            await Promise.all(
              selectedOrganizationIds.map(id => 
                axios.delete(`${API_BASE_URL}/organization/${id}`)
              )
            );
            toast.success('Organizations deleted successfully');
            setSelectedOrganizationIds([]);
            await fetchOrganizations();
          } catch (error) {
            handleApiError(error);
          } finally {
            setIsLoading(false);
          }
        }
      );
    }
  };

  // Handle filter location changes
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

  // Navigation handler
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  // --- UI COMPONENTS ---
  const StatusPill = ({ status }) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
        {status}
      </span>
    );
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

          <section>
            <h2 className="text-xl font-bold mb-4 text-slate-900">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <i className="fas fa-building fa-2x text-indigo-500"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total Approved Organizations</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalOrganizations}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-amber-100 p-4 rounded-full">
                  <i className="fas fa-bell fa-2x text-amber-500"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Pending Organization Approvals</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.pendingOrganizations}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <i className="fas fa-users fa-2x text-emerald-500"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Account Managers</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.accountManagers}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-5 text-slate-900">Filter Organizations</h2>
            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <input
                type="text"
                placeholder="Organization Name, Email..."
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

          <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900">Approved Organization Logins</h2>
                <div className="flex items-center gap-3">
                  {selectedOrganizationIds.length > 0 && (
                    <button
                      onClick={bulkDelete}
                      className={btnRoseClass}
                      disabled={isLoading}
                    >
                      <i className="fas fa-trash-alt"></i>
                      Delete ({selectedOrganizationIds.length})
                    </button>
                  )}
                  <button
                    onClick={openCreateOrganization}
                    className={btnTealClass}
                  >
                    <i className="fas fa-plus"></i>
                    Create New Organization
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
                    <th className="p-4 text-left font-semibold">Organization Name</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Admin Email</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {organizations.length > 0 ? organizations.map(organization => (
                    <tr key={organization._id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedOrganizationIds.includes(organization._id)}
                          onChange={e => toggleSelectOne(organization._id, e.target.checked)}
                        />
                      </td>
                      <td className="p-4 font-semibold text-slate-900">{organization.name}</td>
                      <td className="p-4"><StatusPill status={organization.status} /></td>
                      <td className="p-4 text-slate-600">{organization.adminEmail}</td>
                      <td className="p-4 text-center">
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                          <button
                            onClick={() => openEditOrViewOrganization(organization._id, 'view')}
                            className="px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-l-lg hover:bg-slate-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditOrViewOrganization(organization._id, 'edit')}
                            className="px-3 py-2 text-xs font-medium text-slate-900 bg-white border-t border-b border-slate-200 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openConfirm(
                              'Delete Organization',
                              `Are you sure you want to delete "${organization.name}"?`,
                              () => handleDeleteOrganization(organization._id)
                            )}
                            className="px-3 py-2 text-xs font-medium text-rose-600 bg-white border border-slate-200 rounded-r-md hover:bg-slate-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="text-center p-8 text-slate-500">
                        {isLoading ? 'Loading organizations...' : 'No organizations found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {pendingOrganizations.length > 0 && (
            <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Pending Approvals</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-4 text-left font-semibold">Organization Name</th>
                      <th className="p-4 text-left font-semibold">Admin Email</th>
                      <th className="p-4 text-left font-semibold">Date Registered</th>
                      <th className="p-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pendingOrganizations.map(org => (
                      <tr key={org._id} className="hover:bg-slate-50">
                        <td className="p-4 font-semibold text-slate-900">{org.name}</td>
                        <td className="p-4 text-slate-600">{org.adminEmail}</td>
                        <td className="p-4 text-slate-600">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center space-x-2">
                          <button
                            onClick={() => openEditOrViewOrganization(org._id, 'view')}
                            className="font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openConfirm(
                              'Approve Organization',
                              `Approve "${org.name}" and make it active?`,
                              () => handleChangeStatus(org._id, 'accept')
                            )}
                            className="font-semibold text-green-600 hover:text-green-800"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openConfirm(
                              'Reject Application',
                              `Reject the application for "${org.name}"? This cannot be undone.`,
                              () => handleChangeStatus(org._id, 'reject')
                            )}
                            className="font-semibold text-rose-600 hover:text-rose-800"
                          >
                            Reject
                          </button>
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

      {/* Organization Modal */}
      <OrganizationModal
        isOpen={isOrganizationModalOpen}
        onClose={() => {
          setIsOrganizationModalOpen(false);
          resetForm();
        }}
        organizationModalMode={organizationModalMode}
        organizationFormData={organizationFormData}
        formErrors={formErrors}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={btnSlateClass}
        locations={locations}
        handleInputChange={handleInputChange}
        handleOrganizationFormSubmit={handleOrganizationFormSubmit}
        isLoading={isLoading}
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
        isLoading={isLoading}
      />
    </div>
  );
}

export default MasterDashboard;
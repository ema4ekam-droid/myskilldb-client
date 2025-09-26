import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Navigation from '../../components/master-user-components/master-dashboard-components/master-navigation/Navigation';
import Pagination from '../../components/master-user-components/shared/Pagination';
import AccountManagersTable from '../../components/master-user-components/master-account-manager-components/AccountManagersTable';
import AccountManagerModal from '../../components/master-user-components/master-account-manager-components/modals/AccountManagerModal';
import ViewAccountManagerModal from '../../components/master-user-components/master-account-manager-components/modals/ViewAccountManagerModal';

function AccountManagers() {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);

  // --- STATE MANAGEMENT ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [accountManagers, setAccountManagers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountManagerIds, setSelectedAccountManagerIds] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingAccountManager, setEditingAccountManager] = useState(null);
  const [viewingAccountManager, setViewingAccountManager] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    mobileNumber: ''
  });

  // --- DERIVED STATE ---
  const allChecked = accountManagers.length > 0 && selectedAccountManagerIds.length === accountManagers.length;

  // --- API CALLS ---
  const fetchAccountManagers = async (filterParams = {}) => {
    try {
      setIsLoading(true);
      
      // Mock data for demonstration
      const mockAccountManagers = [
        {
          _id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@myskilldb.com',
          mobileNumber: '+91-9876543210',
          adharCardNumber: '1234-5678-9012',
          assignedSchools: ['1', '2', '3'],
          status: 'active',
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2024-01-20T14:25:00Z'
        },
        {
          _id: '2',
          name: 'Priya Sharma',
          email: 'priya.sharma@myskilldb.com',
          mobileNumber: '+91-9876543211',
          adharCardNumber: '2345-6789-0123',
          assignedSchools: ['2', '4'],
          status: 'active',
          createdAt: '2024-01-16T09:15:00Z',
          lastLogin: '2024-01-19T16:45:00Z'
        },
        {
          _id: '3',
          name: 'Amit Patel',
          email: 'amit.patel@myskilldb.com',
          mobileNumber: '+91-9876543212',
          adharCardNumber: '3456-7890-1234',
          assignedSchools: ['1', '3', '5'],
          status: 'inactive',
          createdAt: '2024-01-17T11:20:00Z',
          lastLogin: '2024-01-18T12:30:00Z'
        },
        {
          _id: '4',
          name: 'Sunita Singh',
          email: 'sunita.singh@myskilldb.com',
          mobileNumber: '+91-9876543213',
          adharCardNumber: '4567-8901-2345',
          assignedSchools: ['4', '6'],
          status: 'active',
          createdAt: '2024-01-18T08:45:00Z',
          lastLogin: '2024-01-20T10:15:00Z'
        },
        {
          _id: '5',
          name: 'Vikram Joshi',
          email: 'vikram.joshi@myskilldb.com',
          mobileNumber: '+91-9876543214',
          adharCardNumber: '5678-9012-3456',
          assignedSchools: ['1', '2', '4', '5'],
          status: 'active',
          createdAt: '2024-01-19T14:30:00Z',
          lastLogin: '2024-01-20T15:20:00Z'
        }
      ];

      // Apply filters
      let filteredManagers = mockAccountManagers;
      
      if (filterParams.name) {
        filteredManagers = filteredManagers.filter(manager => 
          manager.name.toLowerCase().includes(filterParams.name.toLowerCase())
        );
      }
      
      if (filterParams.email) {
        filteredManagers = filteredManagers.filter(manager => 
          manager.email.toLowerCase().includes(filterParams.email.toLowerCase())
        );
      }
      
      if (filterParams.mobileNumber) {
        filteredManagers = filteredManagers.filter(manager => 
          manager.mobileNumber.includes(filterParams.mobileNumber)
        );
      }


      setAccountManagers(filteredManagers);
      setCurrentPage(1); // Reset to first page when data changes
      
      // Uncomment below to use real API
      /*
      const params = new URLSearchParams();
      
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value.trim()) {
          params.append(key, value.trim());
        }
      });

      const response = await axios.get(`${API_BASE_URL}/account-managers?${params}`);
      setAccountManagers(response.data.data);
      */
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      // Mock schools data
      const mockSchools = [
        { _id: '1', name: 'Delhi Public School', district: 'Central Delhi', state: 'Delhi' },
        { _id: '2', name: 'St. Mary\'s School', district: 'South Delhi', state: 'Delhi' },
        { _id: '3', name: 'Kendriya Vidyalaya', district: 'East Delhi', state: 'Delhi' },
        { _id: '4', name: 'Modern Public School', district: 'North Delhi', state: 'Delhi' },
        { _id: '5', name: 'Springdales School', district: 'West Delhi', state: 'Delhi' },
        { _id: '6', name: 'The Heritage School', district: 'Gurgaon', state: 'Haryana' }
      ];
      setSchools(mockSchools);
      
      // Uncomment below to use real API
      /*
      const response = await axios.get(`${API_BASE_URL}/schools`);
      setSchools(response.data.data);
      */
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  // --- EVENT HANDLERS ---
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchAccountManagers(filters);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      email: '',
      mobileNumber: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    fetchAccountManagers({});
  };

  const toggleSelectAll = (checked) => {
    setSelectedAccountManagerIds(checked ? accountManagers.map(manager => manager._id) : []);
  };

  const toggleSelectOne = (managerId, checked) => {
    if (checked) {
      setSelectedAccountManagerIds(prev => [...prev, managerId]);
    } else {
      setSelectedAccountManagerIds(prev => prev.filter(id => id !== managerId));
    }
  };

  const openModal = (accountManager = null) => {
    setEditingAccountManager(accountManager);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingAccountManager(null);
    setIsModalOpen(false);
  };

  const openViewModal = (accountManager) => {
    setViewingAccountManager(accountManager);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewingAccountManager(null);
    setIsViewModalOpen(false);
  };

  const handleAccountManagerSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      // Mock success response
      setTimeout(() => {
        if (editingAccountManager) {
          toast.success('Account manager updated successfully');
        } else {
          toast.success('Account manager created successfully');
        }
        closeModal();
        fetchAccountManagers(filters);
      }, 2000);
      
      // Uncomment below to use real API
      /*
      if (editingAccountManager) {
        const response = await axios.put(`${API_BASE_URL}/account-managers/${editingAccountManager._id}`, formData);
        toast.success('Account manager updated successfully');
      } else {
        const response = await axios.post(`${API_BASE_URL}/account-managers`, formData);
        toast.success('Account manager created successfully');
      }
      
      closeModal();
      await fetchAccountManagers(filters);
      */
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccountManager = async (managerId) => {
    if (window.confirm('Are you sure you want to delete this account manager?')) {
      try {
        setIsLoading(true);
        
        // Mock success response
        setTimeout(() => {
          toast.success('Account manager deleted successfully');
          fetchAccountManagers(filters);
        }, 1500);
        
        // Uncomment below to use real API
        /*
        await axios.delete(`${API_BASE_URL}/account-managers/${managerId}`);
        toast.success('Account manager deleted successfully');
        await fetchAccountManagers(filters);
        */
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAccountManagerIds.length === 0) {
      toast.error('Please select account managers to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedAccountManagerIds.length} account manager(s)?`)) {
      try {
        setIsLoading(true);
        
        // Mock success response
        setTimeout(() => {
          toast.success(`${selectedAccountManagerIds.length} account manager(s) deleted successfully`);
          setSelectedAccountManagerIds([]);
          fetchAccountManagers(filters);
        }, 2000);
        
        // Uncomment below to use real API
        /*
        await axios.delete(`${API_BASE_URL}/account-managers/bulk`, {
          data: { ids: selectedAccountManagerIds }
        });
        toast.success(`${selectedAccountManagerIds.length} account manager(s) deleted successfully`);
        setSelectedAccountManagerIds([]);
        await fetchAccountManagers(filters);
        */
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleApiError = (error) => {
    console.error('API Error:', error);
    const message = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(message);
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchAccountManagers();
    fetchSchools();
  }, []);

  useEffect(() => {
    const onWindowClick = () => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('click', onWindowClick);
    return () => window.removeEventListener('click', onWindowClick);
  }, [isUserMenuOpen]);

  // Pagination calculations
  const totalPages = Math.ceil(accountManagers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAccountManagers = accountManagers.slice(startIndex, endIndex);

  // --- STYLES ---
  const inputBaseClass = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";
  const btnPrimaryClass = "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";
  const btnSecondaryClass = "px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";
  const btnDangerClass = "px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />
      
      {/* Navigation Component - Hide when modal is open */}
      {!isModalOpen && !isViewModalOpen && (
        <Navigation currentPage="account-managers" onPageChange={handlePageChange} />
      )}

      {/* Main Content with offset for sidebar */}
      <div className={`${isModalOpen || isViewModalOpen ? '' : 'lg:ml-72'}`}>
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Account Managers</h1>
              <p className="text-slate-500 text-sm">Manage account managers and their school assignments</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <i className="fas fa-filter-slash"></i>
                Clear Filters
              </button>
              
              {selectedAccountManagerIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className={btnDangerClass}
                  disabled={isLoading}
                >
                  <i className="fas fa-trash"></i>
                  Delete Selected ({selectedAccountManagerIds.length})
                </button>
              )}
              
              <button
                onClick={() => openModal()}
                className={btnPrimaryClass}
              >
                <i className="fas fa-plus"></i>
                Add Account Manager
              </button>
            </div>
          </header>

          {/* Search and Filters */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Search & Filters</h2>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  className={inputBaseClass}
                  placeholder="Search by name..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  className={inputBaseClass}
                  placeholder="Search by email..."
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  className={inputBaseClass}
                  placeholder="Search by mobile..."
                  value={filters.mobileNumber}
                  onChange={(e) => handleFilterChange('mobileNumber', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className={btnPrimaryClass}
                  disabled={isLoading}
                >
                  <i className="fas fa-search"></i>
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </section>

          {/* Account Managers Table */}
          <AccountManagersTable
            accountManagers={paginatedAccountManagers}
            schools={schools}
            isLoading={isLoading}
            selectedAccountManagerIds={selectedAccountManagerIds}
            allChecked={allChecked}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectOne={toggleSelectOne}
            onView={openViewModal}
            onEdit={openModal}
            onDelete={handleDeleteAccountManager}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePaginationChange}
            itemsPerPage={itemsPerPage}
            btnPrimaryClass={btnPrimaryClass}
            btnSecondaryClass={btnSecondaryClass}
            btnDangerClass={btnDangerClass}
          />
        </main>
      </div>

      {/* Account Manager Modal */}
      <AccountManagerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAccountManagerSubmit}
        schools={schools}
        editingAccountManager={editingAccountManager}
        isLoading={isLoading}
        inputBaseClass={inputBaseClass}
        btnPrimaryClass={btnPrimaryClass}
        btnSecondaryClass={btnSecondaryClass}
      />

      {/* View Account Manager Modal */}
      <ViewAccountManagerModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        accountManager={viewingAccountManager}
        schools={schools}
      />
    </div>
  );
}

export default AccountManagers;

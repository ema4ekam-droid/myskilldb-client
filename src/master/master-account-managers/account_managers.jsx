import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Navigation from "../../components/master-user-components/common/master-navigation/Navigation";
import AccountManagersTable from "../../components/master-user-components/master-account-manager-components/AccountManagersTable";
import AccountManagerModal from "../../components/master-user-components/master-account-manager-components/modals/AccountManagerModal";
import ViewAccountManagerModal from "../../components/master-user-components/master-account-manager-components/modals/ViewAccountManagerModal";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../api/apiRequests";
function AccountManagers() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [accountManagers, setAccountManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountManagerIds, setSelectedAccountManagerIds] = useState(
    []
  );

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingAccountManager, setEditingAccountManager] = useState(null);
  const [viewingAccountManager, setViewingAccountManager] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  // --- DERIVED STATE ---
  const allChecked =
    accountManagers.length > 0 &&
    selectedAccountManagerIds.length === accountManagers.length;

  // --- API CALLS ---
  const fetchAccountManagers = async (filterParams = {}) => {
    try {
      setIsLoading(true);

      // Always include role = account manager
      const params = {
        role: "acc_manager",
        ...filterParams,
      };

      const response = await getRequest(
        `/users?${new URLSearchParams(params).toString()}`
      );

      setAccountManagers(response.data.data || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- EVENT HANDLERS ---
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAccountManagers(filters);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      email: "",
      mobile: "",
    });
    setSearchTerm("");
    fetchAccountManagers({});
  };

  const toggleSelectAll = (checked) => {
    setSelectedAccountManagerIds(
      checked ? accountManagers.map((manager) => manager._id) : []
    );
  };

  const toggleSelectOne = (managerId, checked) => {
    if (checked) {
      setSelectedAccountManagerIds((prev) => [...prev, managerId]);
    } else {
      setSelectedAccountManagerIds((prev) =>
        prev.filter((id) => id !== managerId)
      );
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
      console.log("Form data received for submission:", formData);
      // Prepare the data for the API
      const apiData = {
        name: formData.name,
        email: formData.email,
        mobile: parseInt(formData.mobile), // Convert to number as per backend model
        organizationIds: formData.organizationIds, // Include organization ID
        role: "acc_manager",
      };

      let response;
      if (editingAccountManager) {
        // Update existing account manager
        response = await putRequest(
          `/users/${editingAccountManager._id}`,
          apiData
        );

        toast.success("Account manager updated successfully");
      } else {
        // Create new account manager
        response = await postRequest(`/users`, apiData);

        toast.success("Account manager created successfully");
      }

      closeModal();
      await fetchAccountManagers(filters);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccountManager = async (managerId) => {
    if (
      window.confirm("Are you sure you want to delete this account manager?")
    ) {
      try {
        setIsLoading(true);
        await deleteRequest(`/users/${managerId}`);
        toast.success("Account manager deleted successfully");
        await fetchAccountManagers(filters);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleApiError = (error) => {
    console.error("API Error:", error);
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchAccountManagers();
  }, []);

  useEffect(() => {
    const onWindowClick = () => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("click", onWindowClick);
    return () => window.removeEventListener("click", onWindowClick);
  }, [isUserMenuOpen]);

  // --- STYLES ---
  const inputBaseClass =
    "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";
  const btnPrimaryClass =
    "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";
  const btnSecondaryClass =
    "px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";
  const btnDangerClass =
    "px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />

      {/* Navigation Component - Hide when modal is open */}
      {!isModalOpen && !isViewModalOpen && (
        <Navigation
          currentPage="account-managers"
          onPageChange={handlePageChange}
        />
      )}

      {/* Main Content with offset for sidebar */}
      <div className={`${isModalOpen || isViewModalOpen ? "" : "lg:ml-72"}`}>
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Account Managers
              </h1>
              <p className="text-slate-500 text-sm">
                Manage account managers and their information
              </p>
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

              <button onClick={() => openModal()} className={btnPrimaryClass}>
                <i className="fas fa-plus"></i>
                Add Account Manager
              </button>
            </div>
          </header>

          {/* Search and Filters */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Search & Filters
            </h2>
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className={inputBaseClass}
                  placeholder="Search by name..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className={inputBaseClass}
                  placeholder="Search by email..."
                  value={filters.email}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="number"
                  className={inputBaseClass}
                  placeholder="Search by mobile..."
                  value={filters.mobile}
                  onChange={(e) =>
                    handleFilterChange(
                      "mobile",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className={btnPrimaryClass}
                  disabled={isLoading}
                >
                  <i className="fas fa-search"></i>
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
          </section>

          {/* Account Managers Table */}
          <AccountManagersTable
            accountManagers={accountManagers}
            isLoading={isLoading}
            selectedAccountManagerIds={selectedAccountManagerIds}
            allChecked={allChecked}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectOne={toggleSelectOne}
            onView={openViewModal}
            onEdit={openModal}
            onDelete={handleDeleteAccountManager}
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
      />
    </div>
  );
}

export default AccountManagers;
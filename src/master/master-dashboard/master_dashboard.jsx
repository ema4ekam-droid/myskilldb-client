import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import OrganizationModal from "../../components/master-user-components/master-dashboard-components/master-modal/OrganizationModal";
import Navigation from "../../components/master-user-components/common/master-navigation/Navigation";
import ConfirmModal from "../../components/common/ConfirmModal";
import FilterOrganizations from "../../components/master-user-components/common/FilterOrganizations";
import OrganizationTable from "../../components/master-user-components/master-dashboard-components/OrganizationTable";
import Pagination from "../../components/common/Pagination";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../api/apiRequests";

function MasterDashboard() {

  // --- STATE MANAGEMENT ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    pendingOrganizations: 0,
  });

  const [organizations, setOrganizations] = useState([]);
  const [pendingOrganizations, setPendingOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    country: "",
    state: "",
    district: "",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 5,
  });

  const [pendingPagination, setPendingPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 5,
  });

  // Location state for both FilterOrganizations and OrganizationModal
  const [locations, setLocations] = useState({
    countries: [],
    filterStates: [],
    filterDistricts: [],
    modalStates: [],
    modalDistricts: [],
  });

  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const [organizationModalMode, setOrganizationModalMode] = useState("create");
  const [editingOrganization, setEditingOrganization] = useState(null);

  const [organizationFormData, setOrganizationFormData] = useState({
    name: "",
    board: "",
    establishedYear: "",
    adminName: "",
    adminEmail: "",
    mobileNumber: "",
    alternateEmail: "",
    address: "",
    country: "",
    state: "",
    district: "",
    pincode: "",
    totalStudents: "",
    totalTeachers: "",
    principalName: "",
    status: "pending",
  });

  const [formErrors, setFormErrors] = useState({});

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState([]);

  const fetchOrganizationsCount = async () => {
    try {
      const [pendingRes, notPendingRes] = await Promise.all([
        getRequest(`/organization/counts?status=pending`),
        getRequest(`/organization/counts?status=not-pending`),
      ]);

      if (pendingRes.data.success && notPendingRes.data.success) {
        const pendingCount =
          pendingRes.data.count || pendingRes.data.data?.count;
        const notPendingCount =
          notPendingRes.data.count || notPendingRes.data.data?.count;

        setStats((prev) => ({
          ...prev,
          totalOrganizations: notPendingCount,
          pendingOrganizations: pendingCount,
        }));
      }
    } catch (error) {
      toast.error("Error fetching organization counts");
    }
  };

  // --- API CALLS ---
  const fetchData = async () => {
    await Promise.all([
      fetchOrganizations({}, 1, false), // Fetch approved organizations
      fetchOrganizations({}, 1, true), // Fetch pending organizations
      fetchCountries(),
      fetchOrganizationsCount(),
    ]);
  };

  const fetchOrganizations = async (
    filterParams = {},
    page = 1,
    isPending = false
  ) => {
    try {
      setIsLoading(true);

      // Build query params helper
      const buildParams = (extraParams = {}) => {
        const params = new URLSearchParams();
        const allParams = {
          ...filterParams,
          ...extraParams,
          page: String(page),
          limit: "5",
        };

        Object.entries(allParams).forEach(([key, value]) => {
          if (value && typeof value === "string" ? value.trim() : value) {
            params.append(key, String(value));
          }
        });
        return params.toString();
      };

      if (isPending) {
        // Fetch pending organizations with pagination
        const pendingResponse = await getRequest(
          `/organization?${buildParams({ status: "pending" })}`
        );

        if (pendingResponse.data.success) {
          const { organizations: pendingOrgs, pagination: pendingPagination } =
            pendingResponse.data.data;
          setPendingOrganizations(pendingOrgs);
          setPendingPagination(pendingPagination);
        }
      } else {
        // Fetch active (non-pending) organizations with pagination
        const activeResponse = await getRequest(
          `/organization?${buildParams({ status: "not-pending" })}`
        );

        if (activeResponse.data.success) {
          const { organizations: activeOrgs, pagination: activePagination } =
            activeResponse.data.data;
          setOrganizations(activeOrgs);
          setPagination(activePagination);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed location fetching functions
  const fetchCountries = async () => {
    try {
      const response = await getRequest(`/locations/countries`);

      if (response.data.success) {
        const countries = response.data.data;
        setLocations((prev) => ({
          ...prev,
          countries,
        }));
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchFilterStates = async (countryCode) => {
    if (!countryCode) return;

    try {
      const response = await getRequest(`/locations/states/${countryCode}`);

      if (response.data.success) {
        const states = response.data.data;
        setLocations((prev) => ({
          ...prev,
          filterStates: states,
          filterDistricts: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching filter states:", error);
    }
  };

  const fetchFilterDistricts = async (stateCode) => {
    if (!stateCode) return;

    try {
      const response = await getRequest(
        `/locations/districts/state/${stateCode}`
      );

      if (response.data.success) {
        const districts = response.data.data;
        setLocations((prev) => ({
          ...prev,
          filterDistricts: districts,
        }));
      }
    } catch (error) {
      console.error("Error fetching filter districts:", error);
    }
  };

  const fetchModalStates = async (countryCode) => {
    if (!countryCode) return;

    try {
      const response = await getRequest(`/locations/states/${countryCode}`);

      if (response.data.success) {
        const states = response.data.data;
        setLocations((prev) => ({
          ...prev,
          modalStates: states,
          modalDistricts: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching modal states:", error);
    }
  };

  const fetchModalDistricts = async (stateCode) => {
    if (!stateCode) return;

    try {
      const response = await getRequest(
        `/locations/districts/state/${stateCode}`
      );

      if (response.data.success) {
        const districts = response.data.data;
        setLocations((prev) => ({
          ...prev,
          modalDistricts: districts,
        }));
      }
    } catch (error) {
      console.error("Error fetching modal districts:", error);
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
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();

    const onWindowClick = (e) => {
      const menuButton = document.getElementById("profile-button");
      const menu = document.getElementById("profile-menu");
      if (
        isUserMenuOpen &&
        menuButton &&
        menu &&
        !menuButton.contains(e.target) &&
        !menu.contains(e.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("click", onWindowClick);
    return () => window.removeEventListener("click", onWindowClick);
  }, [isUserMenuOpen]);

  // --- EVENT HANDLERS ---
  const handleFilterSubmit = () => {
    // Reset to page 1 when filters change
    fetchOrganizations(filters, 1, false); // Fetch approved with filters
    fetchOrganizations(filters, 1, true); // Fetch pending with filters
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));

    // Handle filter location cascading
    if (field === "country") {
      const selectedCountry = locations.countries.find((c) => c.name === value);
      if (selectedCountry) {
        setFilters((prev) => ({ ...prev, state: "", district: "" }));
        fetchFilterStates(selectedCountry.code);
      }
    } else if (field === "state") {
      const selectedState = locations.filterStates.find(
        (s) => s.name === value
      );
      if (selectedState) {
        setFilters((prev) => ({ ...prev, district: "" }));
        fetchFilterDistricts(selectedState.code);
      }
    }
  };

  // Pagination handlers
  const handlePageChange = (page, isPending = false) => {
    fetchOrganizations(filters, page, isPending);
  };

  const toggleSelectAll = (checked) => {
    setSelectedOrganizationIds(
      checked ? organizations.map((org) => org._id) : []
    );
  };

  const toggleSelectOne = (orgId, checked) => {
    setSelectedOrganizationIds((prev) =>
      checked
        ? [...new Set([...prev, orgId])]
        : prev.filter((id) => id !== orgId)
    );
  };

  // --- FORM VALIDATION & HANDLERS ---
  const resetForm = () => {
    setOrganizationFormData({
      name: "",
      board: "",
      establishedYear: "",
      adminName: "",
      adminEmail: "",
      mobileNumber: "",
      alternateEmail: "",
      address: "",
      country: "",
      state: "",
      district: "",
      pincode: "",
      totalStudents: "",
      totalTeachers: "",
      principalName: "",
      status: "pending",
    });
    setFormErrors({});
  };

  const handleInputChange = async (field, value) => {
    setOrganizationFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Handle modal location cascading
    if (field === "country") {
      const selectedCountry = locations.countries.find((c) => c.name === value);
      if (selectedCountry) {
        setOrganizationFormData((prev) => ({
          ...prev,
          state: "",
          district: "",
        }));
        await fetchModalStates(selectedCountry.code);
      }
    } else if (field === "state") {
      const selectedState = locations.modalStates.find((s) => s.name === value);
      if (selectedState) {
        setOrganizationFormData((prev) => ({ ...prev, district: "" }));
        await fetchModalDistricts(selectedState.code);
      }
    }
  };

  const handleOrganizationFormSubmit = async (e) => {
    e.preventDefault();

    if (organizationModalMode === "view") return;

    try {
      setIsLoading(true);
      setFormErrors({});

      const submitData = {
        ...organizationFormData,
        establishedYear: parseInt(organizationFormData.establishedYear),
        totalStudents: parseInt(organizationFormData.totalStudents),
        totalTeachers: parseInt(organizationFormData.totalTeachers),
      };

      let response;
      if (organizationModalMode === "edit") {
        response = await putRequest(
          `/organization/${editingOrganization._id}`,
          submitData
        );
      } else {
        response = await postRequest(`/organization`, submitData);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setIsOrganizationModalOpen(false);
        // Refresh both tables after successful operation
        await fetchOrganizations(filters, pagination.currentPage, false);
        await fetchOrganizations(filters, pendingPagination.currentPage, true);
        await fetchOrganizationsCount();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateOrganization = () => {
    setEditingOrganization(null);
    setOrganizationModalMode("create");
    resetForm();
    setIsOrganizationModalOpen(true);
  };

  const openEditOrViewOrganization = async (orgId, mode) => {
    try {
      const response = await getRequest(`/organization/${orgId}`);

      if (response.data.success) {
        const org = response.data.data;
        setEditingOrganization(org);
        setOrganizationModalMode(mode);

        // Populate form data
        setOrganizationFormData({
          name: org.name || "",
          board: org.board || "",
          establishedYear: org.establishedYear || "",
          adminName: org.adminName || "",
          adminEmail: org.adminEmail || "",
          mobileNumber: org.mobileNumber || "",
          alternateEmail: org.alternateEmail || "",
          address: org.address || "",
          country: org.country || "",
          state: org.state || "",
          district: org.district || "",
          pincode: org.pincode || "",
          totalStudents: org.totalStudents || "",
          totalTeachers: org.totalTeachers || "",
          principalName: org.principalName || "",
          status: org.status || "pending",
        });

        // Pre-fetch location data for the organization
        if (org.country) {
          const selectedCountry = locations.countries.find(
            (c) => c.name === org.country
          );
          if (selectedCountry) {
            await fetchModalStates(selectedCountry.code);
            if (org.state) {
              const selectedState = locations.modalStates.find(
                (s) => s.name === org.state
              );
              if (selectedState) {
                await fetchModalDistricts(selectedState.code);
              }
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
      const response = await deleteRequest(`/organization/${orgId}`);

      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh both tables after deletion
        await fetchOrganizations(filters, pagination.currentPage, false);
        await fetchOrganizations(filters, pendingPagination.currentPage, true);
        await fetchOrganizationsCount();
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
      const response = await patchRequest(`/organization/${orgId}/status`, {
        action,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh both tables after status change
        await fetchOrganizations(filters, pagination.currentPage, false);
        await fetchOrganizations(filters, pendingPagination.currentPage, true);
        await fetchOrganizationsCount();
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
        "Bulk Delete Organizations",
        `Are you sure you want to delete ${selectedOrganizationIds.length} selected organizations?`,
        async () => {
          try {
            setIsLoading(true);
            await Promise.all(
              selectedOrganizationIds.map((id) =>
                deleteRequest(`/organization/${id}`)
              )
            );

            toast.success("Organizations deleted successfully");
            setSelectedOrganizationIds([]);
            // Refresh both tables after bulk deletion
            await fetchOrganizations(filters, pagination.currentPage, false);
            await fetchOrganizations(
              filters,
              pendingPagination.currentPage,
              true
            );
            await fetchOrganizationsCount();
          } catch (error) {
            handleApiError(error);
          } finally {
            setIsLoading(false);
          }
        }
      );
    }
  };

  // Navigation handler
  const handlePageNavigation = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  // Base component styles
  const inputBaseClass =
    "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed";
  const btnBaseClass =
    "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnTealClass = `${btnBaseClass} bg-teal-500 hover:bg-teal-600 text-white`;
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnRoseClass = `${btnBaseClass} bg-rose-500 hover:bg-rose-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />

      {/* Navigation Component */}
      <Navigation currentPage="dashboard" onPageChange={handlePageNavigation} />

      {/* Main Content with offset for sidebar */}
      <div className="lg:ml-72">
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Master Dashboard
              </h1>
              <p className="text-slate-500 text-sm">
                System Overview & Management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  id="profile-button"
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                >
                  <img
                    src="https://api.dicebear.com/8.x/initials/svg?seed=Master+Admin"
                    className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md hover:ring-2 hover:ring-indigo-400 transition-all"
                    alt="Admin Profile"
                  />
                </button>
                {isUserMenuOpen && (
                  <div
                    id="profile-menu"
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-20"
                  >
                    <a
                      href="#"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <i className="fas fa-plus w-4 text-slate-500"></i>
                      Organization Sign Up Page
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-slate-100 border-t border-slate-200"
                    >
                      <i className="fas fa-sign-out-alt w-4 text-red-500"></i>
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </header>
          <section>
            <h2 className="text-xl font-bold mb-4 text-slate-900">
              Platform Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <i className="fas fa-building fa-2x text-indigo-500"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">
                    Total Approved Organizations
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.totalOrganizations}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-amber-100 p-4 rounded-full">
                  <i className="fas fa-bell fa-2x text-amber-500"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">
                    Pending Organization Approvals
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.pendingOrganizations}
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* Reusable Filter Component */}
          <FilterOrganizations
            filters={filters}
            onFilterChange={handleFilterChange}
            onSubmit={handleFilterSubmit}
            isLoading={isLoading}
            locations={{
              countries: locations.countries || [],
              states: locations.filterStates || [],
              districts: locations.filterDistricts || [],
            }}
            inputBaseClass={inputBaseClass}
            btnClass={btnIndigoClass}
          />
          {/* Approved Organizations Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <h2 className="text-xl font-bold text-slate-900">
                Approved Organization Logins
              </h2>
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

            <OrganizationTable
              organizations={organizations}
              title=""
              isLoading={isLoading}
              onView={(orgId) => openEditOrViewOrganization(orgId, "view")}
              onEdit={(orgId) => openEditOrViewOrganization(orgId, "edit")}
              onDelete={(orgId) =>
                openConfirm(
                  "Delete Organization",
                  "Are you sure you want to delete this organization?",
                  () => handleDeleteOrganization(orgId)
                )
              }
              showActions={true}
              showCheckboxes={true}
              selectedIds={selectedOrganizationIds}
              onToggleSelect={toggleSelectOne}
              onToggleSelectAll={toggleSelectAll}
            />

            {/* Pagination for Approved Organizations */}
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              isPending={false}
              entityName="organizations"
            />
          </div>
          {/* Pending Organizations Table */}
          {pendingOrganizations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Pending Approvals
              </h2>

              <OrganizationTable
                organizations={pendingOrganizations}
                title=""
                isLoading={isLoading}
                onView={(orgId) => openEditOrViewOrganization(orgId, "view")}
                onApprove={(orgId) =>
                  openConfirm(
                    "Approve Organization",
                    "Are you sure you want to approve this organization?",
                    () => handleChangeStatus(orgId, "accept")
                  )
                }
                onDelete={(orgId) =>
                  openConfirm(
                    "Delete Organization",
                    "Are you sure you want to delete this organization?",
                    () => handleDeleteOrganization(orgId)
                  )
                }
                showActions={true}
                showCheckboxes={false}
              />

              {/* Pagination for Pending Organizations */}
              <Pagination
                pagination={pendingPagination}
                onPageChange={handlePageChange}
                isPending={true}
                entityName="organizations"
              />
            </div>
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
        locations={{
          countries: locations.countries,
          states: locations.modalStates,
          districts: locations.modalDistricts,
        }}
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

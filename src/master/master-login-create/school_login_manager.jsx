import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navigation from "../../components/master-user-components/master-dashboard-components/master-navigation/Navigation";
import SchoolsTable from "../../components/master-user-components/master-login-create-components/SchoolsTable";
import LoginFormModal from "../../components/master-user-components/master-login-create-components/modals/LoginFormModal";
import SchoolDetailsModal from "../../components/master-user-components/master-login-create-components/modals/SchoolDetailsModal";

function SchoolLoginManager() {
  const API_BASE_URL = useMemo(
    () => `${import.meta.env.VITE_SERVER_API_URL}/api`,
    []
  );

  // --- STATE MANAGEMENT ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    name: "",
    country: "",
    state: "",
    district: "",
  });

  // Location data
  const [locations, setLocations] = useState({
    countries: [],
    states: [],
    districts: [],
    filterStates: [],
    filterDistricts: [],
  });

  // Modal states
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isSchoolDetailsOpen, setIsSchoolDetailsOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const [loginFormData, setLoginFormData] = useState({
    organizationId: "",
    role: "",
    name: "",
    email: "",
    mobileNumber: "",
    department: "",
    year: "",
    section: "",
  });

  // --- API CALLS ---
  const fetchData = async () => {
    await Promise.all([fetchSchools(), fetchCountries()]);
  };

  const fetchSchools = async (filterParams = {}) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value.trim()) {
          params.append(key, value);
        }
      });

      const response = await axios.get(
        `${API_BASE_URL}/organization?${params}`
      );

      if (response.data.success) {
        const allOrgs = response.data.data;
        const activeOrgs = allOrgs.filter((org) => org.status === "active");
        setSchools(activeOrgs);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/countries`);
      if (response.data.success) {
        const countries = response.data.data.map((country) => ({
          name: country.country,
          code: country.countryCode,
        }));
        setLocations((prev) => ({ ...prev, countries }));
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to fetch countries");
    }
  };

  const fetchStates = async (countryCode, forFilter = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/locations/states/${countryCode}`
      );
      if (response.data.success) {
        const states = response.data.data.map((state) => ({
          name: state.state,
          code: state.stateCode,
        }));
        if (forFilter) {
          setLocations((prev) => ({ ...prev, filterStates: states }));
        } else {
          setLocations((prev) => ({ ...prev, states }));
        }
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Failed to fetch states");
    }
  };

  const fetchDistricts = async (stateCode, forFilter = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/locations/districts/state/${stateCode}`
      );
      if (response.data.success) {
        const districts = response.data.data.map((district) => ({
          name: district.district,
          code: district.districtCode,
        }));
        if (forFilter) {
          setLocations((prev) => ({ ...prev, filterDistricts: districts }));
        } else {
          setLocations((prev) => ({ ...prev, districts }));
        }
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to fetch districts");
    }
  };

  const handleApiError = (error) => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      if (responseData?.message) {
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
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchSchools(filters);
  };

  const handleFilterLocationChange = async (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));

    if (field === "country") {
      const selectedCountry = locations.countries.find((c) => c.name === value);
      if (selectedCountry) {
        setFilters((prev) => ({ ...prev, state: "", district: "" }));
        await fetchStates(selectedCountry.code, true);
      }
    } else if (field === "state") {
      const selectedState = locations.filterStates.find(
        (s) => s.name === value
      );
      if (selectedState) {
        setFilters((prev) => ({ ...prev, district: "" }));
        await fetchDistricts(selectedState.code, true);
      }
    }
  };

  const toggleSelectAll = (checked) => {
    setSelectedSchoolIds(checked ? schools.map((school) => school._id) : []);
  };

  const toggleSelectOne = (schoolId, checked) => {
    setSelectedSchoolIds((prev) =>
      checked
        ? [...new Set([...prev, schoolId])]
        : prev.filter((id) => id !== schoolId)
    );
  };

  const openLoginForm = (organizationId, role = "") => {
    setLoginFormData({
      organizationId,
      role,
      name: "",
      email: "",
      mobileNumber: "",
      department: "",
      year: "",
      section: "",
    });
    setIsLoginFormOpen(true);
  };

  const openSchoolDetails = (school) => {
    setSelectedSchool(school);
    setIsSchoolDetailsOpen(true);
  };

const handleLoginFormSubmit = async (formData) => {
  try {
    setIsLoading(true);

    // Prepare user data for API
    const userData = {
      organizationId: formData.organizationId,
      role: formData.role,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile, // Using 'mobile' field to match schema
      ...(formData.departmentId && { departmentId: formData.departmentId }),
      ...(formData.classId && { classId: formData.classId }),
      ...(formData.sectionId && { sectionId: formData.sectionId }),
    };

    // Make API call using axios
    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      toast.success(
        `Successfully created ${formData.role} login for ${formData.name}`
      );
      setIsLoginFormOpen(false);
    } else {
      toast.error(response.data.message || "Failed to create user");
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    setIsLoading(false);
  }
};

  // Navigation handler
  const handlePageChange = (pageId) => {
    console.log(`Navigating to: ${pageId}`);
  };

  // Base component styles
  const inputBaseClass =
    "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed";
  const btnBaseClass =
    "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnTealClass = `${btnBaseClass} bg-teal-500 hover:bg-teal-600 text-white`;
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />

      {/* Navigation Component */}
      <Navigation currentPage="school-logins" onPageChange={handlePageChange} />

      {/* Main Content with offset for sidebar */}
      <div className="lg:ml-72">
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Organization Login Manager
              </h1>
              <p className="text-slate-500 text-sm">
                Create, edit and manage organization user logins
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

          {/* Filter Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-5 text-slate-900">
              Filter Organizations
            </h2>
            <form
              onSubmit={handleFilterSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            >
              <input
                type="text"
                placeholder="Organization Name..."
                className={`${inputBaseClass} sm:col-span-2 lg:col-span-4`}
                value={filters.name}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, name: e.target.value }))
                }
              />

              <select
                className={inputBaseClass}
                value={filters.country}
                onChange={(e) =>
                  handleFilterLocationChange("country", e.target.value)
                }
              >
                <option value="">Select Country</option>
                {locations.countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>

              <select
                className={inputBaseClass}
                disabled={!filters.country}
                value={filters.state}
                onChange={(e) =>
                  handleFilterLocationChange("state", e.target.value)
                }
              >
                <option value="">Select State</option>
                {locations.filterStates.map((state) => (
                  <option key={state.code} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>

              <select
                className={inputBaseClass}
                disabled={!filters.state}
                value={filters.district}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, district: e.target.value }))
                }
              >
                <option value="">Select District</option>
                {locations.filterDistricts.map((district) => (
                  <option key={district.code} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className={`${btnIndigoClass} w-full`}
                disabled={isLoading}
              >
                <i className="fas fa-search"></i>
                {isLoading ? "Filtering..." : "Apply Filters"}
              </button>
            </form>
          </section>

          {/* Schools Table */}
          <SchoolsTable
            schools={schools}
            isLoading={isLoading}
            selectedSchoolIds={selectedSchoolIds}
            allChecked={
              schools.length > 0 && selectedSchoolIds.length === schools.length
            }
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectOne={toggleSelectOne}
            onOpenLoginForm={openLoginForm}
            onOpenSchoolDetails={openSchoolDetails}
            btnTealClass={btnTealClass}
          />
        </main>
      </div>

      {/* Login Form Modal */}
      <LoginFormModal
        isOpen={isLoginFormOpen}
        onClose={() => setIsLoginFormOpen(false)}
        onSubmit={handleLoginFormSubmit}
        formData={loginFormData}
        schools={schools}
        isLoading={isLoading}
        inputBaseClass={inputBaseClass}
        btnTealClass={btnTealClass}
        btnSlateClass={`${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`}
      />

      {/* School Details Modal */}
      <SchoolDetailsModal
        isOpen={isSchoolDetailsOpen}
        onClose={() => setIsSchoolDetailsOpen(false)}
        school={selectedSchool}
        onOpenLoginForm={openLoginForm}
        btnTealClass={btnTealClass}
        btnSlateClass={`${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`}
      />
    </div>
  );
}

export default SchoolLoginManager;
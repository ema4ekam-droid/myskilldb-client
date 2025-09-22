import React, { useEffect, useMemo, useState } from "react";
import Navigation from "../../components/master-user-components/master-dashboard-components/master-navigation/Navigation";
import CountryTable from "../../components/master-user-components/location-components/CountryTable";
import StateTable from "../../components/master-user-components/location-components/StateTable";
import DistrictTable from "../../components/master-user-components/location-components/DistrictTable";
import SyllabusTable from "../../components/master-user-components/location-components/SyllabusTable";
import StatsCards from "../../components/master-user-components/location-components/StatsCards";
import axios from "axios";

function LocationManager() {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);

  // --- STATE MANAGEMENT ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Data arrays
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [syllabi, setSyllabi] = useState([]);

  // Filter states
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // Loading states
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingSyllabi, setIsLoadingSyllabi] = useState(false);

  // --- DERIVED STATE ---
  const totalCountries = countries.length;
  const totalStates = states.length;

  // =========================
  // API CALLS
  // =========================
  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/countries`);
      setCountries(response.data.data);
    } catch (error) {
      handleApiError("fetching countries", error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const fetchStates = async () => {
    setIsLoadingStates(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/states/all`);
      setStates(response.data.data);
    } catch (error) {
      handleApiError("fetching states", error);
    } finally {
      setIsLoadingStates(false);
    }
  };

  const fetchDistricts = async () => {
    setIsLoadingDistricts(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/locations/districts/country/all`
      );
      setDistricts(response.data.data);
    } catch (error) {
      handleApiError("fetching districts", error);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const fetchSyllabi = async () => {
    setIsLoadingSyllabi(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/system-manager/Syllabus`);
      if (response.data.success && response.data.data) {
        // Convert values array to syllabus objects
        const parsedSyllabi = response.data.data.values.map((name, index) => ({
          id: index + 1, // Generate sequential ID
          name: name
        }));
        
        setSyllabi(parsedSyllabi);
      } else {
        setSyllabi([]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No syllabi found yet
        setSyllabi([]);
      } else {
        handleApiError("fetching syllabi", error);
      }
    } finally {
      setIsLoadingSyllabi(false);
    }
  };

  // =========================
  // CRUD HANDLERS
  // =========================

  // Countries
  const handleAddCountry = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/locations/countries`,
        data
      );
      setCountries((prev) => [...prev, response.data.data]);
      alert("Country added successfully!");
    } catch (error) {
      handleApiError("adding country", error, true);
    }
  };

  const handleEditCountry = async (id, data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/locations/countries/${id}`,
        data
      );
      setCountries((prev) =>
        prev.map((c) => (c._id === id ? response.data.data : c))
      );
      alert("Country updated successfully!");
    } catch (error) {
      handleApiError("updating country", error, true);
    }
  };

  const handleDeleteCountry = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/locations/countries/${id}`);
      setCountries((prev) => prev.filter((c) => c._id !== id));
      alert("Country deleted successfully!");
    } catch (error) {
      handleApiError("deleting country", error, true);
    }
  };

  // States
  const handleAddState = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/locations/states`, data);
      setStates((prev) => [...prev, response.data.data]);
      alert("State added successfully!");
    } catch (error) {
      handleApiError("adding state", error, true);
    }
  };

  const handleEditState = async (id, data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/locations/states/${id}`,
        data
      );
      setStates((prev) =>
        prev.map((s) => (s._id === id ? response.data.data : s))
      );
      alert("State updated successfully!");
    } catch (error) {
      handleApiError("updating state", error, true);
    }
  };

  const handleDeleteState = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/locations/states/${id}`);
      setStates((prev) => prev.filter((s) => s._id !== id));
      alert("State deleted successfully!");
    } catch (error) {
      handleApiError("deleting state", error, true);
    }
  };

  // Districts
  const handleAddDistrict = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/locations/districts`,
        data
      );
      setDistricts((prev) => [...prev, response.data.data]);
      alert("District added successfully!");
    } catch (error) {
      handleApiError("adding district", error, true);
    }
  };

  const handleEditDistrict = async (id, data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/locations/districts/${id}`,
        data
      );
      setDistricts((prev) =>
        prev.map((d) => (d._id === id ? response.data.data : d))
      );
      alert("District updated successfully!");
    } catch (error) {
      handleApiError("updating district", error, true);
    }
  };

  const handleDeleteDistrict = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/locations/districts/${id}`);
      setDistricts((prev) => prev.filter((d) => d._id !== id));
      alert("District deleted successfully!");
    } catch (error) {
      handleApiError("deleting district", error, true);
    }
  };

  // Syllabi (Using SystemSetting API)
  const handleAddSyllabus = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/system-manager/Syllabus`, {
        value: data.name
      });
      
      // Refresh syllabi list
      await fetchSyllabi();
      alert("Syllabus added successfully!");
    } catch (error) {
      handleApiError("adding syllabus", error, true);
    }
  };

  const handleDeleteSyllabus = async (id) => {
    try {
      // Find the syllabus to delete
      const syllabusToDelete = syllabi.find(s => s.id === id);
      if (!syllabusToDelete) {
        alert("Syllabus not found!");
        return;
      }

      // Call patch endpoint to remove the syllabus
      await axios.patch(`${API_BASE_URL}/system-manager/Syllabus`, {
        value: syllabusToDelete.name
      });
      
      // Refresh syllabi list
      await fetchSyllabi();
      alert("Syllabus deleted successfully!");
    } catch (error) {
      handleApiError("deleting syllabus", error, true);
    }
  };

  // =========================
  // HELPERS
  // =========================
  const handleApiError = (action, error, showAlert = false) => {
    let msg = "";
    if (error.response) {
      msg = error.response.data.message || error.response.statusText;
    } else if (error.request) {
      msg = "No response from server.";
    } else {
      msg = error.message;
    }
    console.error(`Error ${action}:`, msg);
    if (showAlert) alert(`Error ${action}: ${msg}`);
  };

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    fetchCountries();
    fetchStates();
    fetchDistricts();
    fetchSyllabi();
  }, []);

  // --- UI Handlers ---
  const handleCountryFilter = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedState(""); // reset state filter when country changes
  };

  const handleStateFilter = (stateId) => setSelectedState(stateId);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      {/* Navigation */}
      <Navigation
        currentPage="location-manager"
        onPageChange={(p) => console.log(`Navigating to: ${p}`)}
      />

      <div className="lg:ml-72">
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Location Data Management
              </h1>
              <p className="text-slate-500 text-sm">
                Manage countries, states, districts, and syllabi
              </p>
            </div>
          </header>

          {/* Stats */}
          <StatsCards totalCountries={totalCountries} totalStates={totalStates} />

          {/* Country + State */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CountryTable
              countries={countries}
              onAddCountry={handleAddCountry}
              onEditCountry={handleEditCountry}
              onDeleteCountry={handleDeleteCountry}
              isLoading={isLoadingCountries}
            />
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

          {/* District + Syllabus */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <SyllabusTable
              syllabi={syllabi}
              onAddSyllabus={handleAddSyllabus}
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
import { useState, useEffect } from "react";
import OrgMenuNavigation from "../../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation";
import {
  TopicModal,
  HierarchicalTopicList,
} from "../../../components/org-admin-components/skills-academics-components";
import LoaderOverlay from "../../../components/loader/LoaderOverlay";
import toast, { Toaster } from "react-hot-toast";
import {
  postRequest,
  getRequest,
  deleteRequest,
} from "../../../api/apiRequests";
import { useSelector } from "react-redux";

const TopicManagement = () => {
  // Get organization from Redux
  const organization = useSelector((state) => state.organization);

  // State for navigation
  const [currentPage, setCurrentPage] = useState("topic-management");

  // State for global entities
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]); // Current department subjects
  const [allSubjects, setAllSubjects] = useState([]); // All subjects from all departments
  const [topics, setTopics] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState({
    departments: false,
    subjects: false,
  });

  // Topic form data
  const [topicFormData, setTopicFormData] = useState({
    name: "",
    description: "",
    departmentId: "", // For UI filtering and API call
    subjectId: "",
    difficultyLevel: "Medium",
  });

  // Modal states
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  // --- API CALLS ---

  const fetchDepartments = async () => {
    if (!organization?._id) return;

    try {
      setLoadingEntities((prev) => ({ ...prev, departments: true }));
      const response = await getRequest(
        `/organization-setup/departments/${organization._id}`
      );

      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    } finally {
      setLoadingEntities((prev) => ({ ...prev, departments: false }));
    }
  };

  const fetchSubjects = async (departmentId = null) => {
    if (!organization?._id) return;

    try {
      setLoadingEntities((prev) => ({ ...prev, subjects: true }));
      if (departmentId) {
        const response = await getRequest(
          `/organization-setup/subjects/${organization._id}/${departmentId}`
        );
        if (response.data.success) {
          const newSubjects = response.data.data;
          setSubjects(newSubjects);

          // Update allSubjects by merging with existing subjects and removing duplicates
          setAllSubjects((prev) => {
            const filtered = prev.filter(
              (subject) => subject.departmentId !== departmentId
            );
            return [...filtered, ...newSubjects];
          });
        }
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects");
    } finally {
      setLoadingEntities((prev) => ({ ...prev, subjects: false }));
    }
  };

  const fetchTopics = async () => {
    if (!organization?._id) return;

    try {
      const response = await getRequest(`/topics/${organization._id}`);
      if (response.data.success) {
        setTopics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Failed to fetch topics");
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchDepartments(), fetchTopics()]);
    } catch (error) {
      console.error("Error in fetchAllData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- TOPIC FUNCTIONS ---

  const openTopicModal = () => {
    setTopicFormData({
      name: "",
      description: "",
      departmentId: "", // For UI filtering and API call
      subjectId: "",
      difficultyLevel: "Medium",
    });
    setIsTopicModalOpen(true);
  };

  const closeTopicModal = () => {
    setIsTopicModalOpen(false);
    setTopicFormData({
      name: "",
      description: "",
      departmentId: "", // For UI filtering and API call
      subjectId: "",
      difficultyLevel: "Medium",
    });
  };

  const handleCreateTopic = async (formData) => {
    setIsLoading(true);
    try {
      // Prepare data for API call - include departmentId
      const topicData = {
        name: formData.name,
        description: formData.description,
        subjectId: formData.subjectId,
        departmentId: formData.departmentId,
        difficultyLevel: formData.difficultyLevel,
        organizationId: organization._id,
      };
      console.log("Form data being sent:", topicData);
      const response = await postRequest("/topics", topicData);
      if (response.data.success) {
        toast.success("Topic created successfully");
        closeTopicModal();
        // Refresh topics list to show the new topic immediately
        await fetchTopics();
      } else {
        toast.error(response.data.message || "Failed to create topic");
      }
    } catch (error) {
      console.error("Error saving topic:", error);
      // Extract error message from axios error response
      const errorMessage = error.response?.data?.message || error.message || "Failed to save topic";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId, topicName) => {
    // Confirm before deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete the topic "${topicName}"?`
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await deleteRequest(`/topics/${topicId}`);
      if (response.data.success) {
        toast.success("Topic deleted successfully");
        await fetchTopics();
      } else {
        toast.error(response.data.message || "Failed to delete topic");
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
      // Extract error message from axios error response
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete topic";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change from menu
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // --- EFFECTS ---

  useEffect(() => {
    if (organization?._id) {
      fetchAllData();
    }
  }, [organization?._id]);

  // --- STYLES ---
  const inputBaseClass =
    "w-full bg-slate-100 border-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none";
  const btnBaseClass =
    "font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors transform active:scale-95";
  const btnIndigoClass = `${btnBaseClass} bg-indigo-500 hover:bg-indigo-600 text-white`;
  const btnSlateClass = `${btnBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-800`;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <LoaderOverlay
        isVisible={isLoading}
        title="MySkillDB"
        subtitle="Loading your data, please wait…"
      />

      {/* Navigation Component */}
      {!isTopicModalOpen && (
        <OrgMenuNavigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Main Content */}
      <div
        className={
          isTopicModalOpen
            ? "flex-1 flex flex-col"
            : "lg:ml-72 flex-1 flex flex-col"
        }
      >
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <header className="flex flex-col items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Departments, Subjects & Topics
              </h1>
              <p className="text-slate-600 mt-2">
                View and manage topics by department and subject
              </p>
            </div>
          </header>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openTopicModal}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <i className="fas fa-plus"></i>
              <span>Add Topic</span>
            </button>
          </div>

          {/* Topics List */}
          <div className="mt-8">
            <HierarchicalTopicList
              topics={topics}
              departments={departments}
              isLoading={isLoading}
              onDelete={handleDeleteTopic}
            />
          </div>
        </main>
      </div>

      {/* Topic Modal */}
      {isTopicModalOpen && (
        <TopicModal
          isOpen={isTopicModalOpen}
          onClose={closeTopicModal}
          onSubmit={handleCreateTopic}
          formData={topicFormData}
          setFormData={setTopicFormData}
          subjects={subjects}
          departments={departments}
          isLoading={isLoading}
          inputBaseClass={inputBaseClass}
          btnIndigoClass={btnIndigoClass}
          btnSlateClass={btnSlateClass}
          fetchSubjects={fetchSubjects}
          isLoadingDepartments={loadingEntities.departments}
          isLoadingSubjects={loadingEntities.subjects}
        />
      )}
    </div>
  );
};

export default TopicManagement;

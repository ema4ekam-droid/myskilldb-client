import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import OrgMenuNavigation from "../../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation";
import { postRequest, getRequest } from "../../../api/apiRequests";
import {
  JobsList,
  JobDetails,
  CreateJobModal,
  CreateTopicModal,
  FloatingActionButton,
  DepartmentFilter,
} from "../../../components/org-admin-components/jobs-placements-components";

const JobsPlacements = () => {
  const organization = useSelector((state) => state.organization);
  const isInitialMount = useRef(true);

  const [currentPage, setCurrentPage] = useState("test-topics");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const [selectedJobForTopic, setSelectedJobForTopic] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobTopics, setJobTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoadingJobDetails, setIsLoadingJobDetails] = useState(false);
  const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);

  const [topicFormData, setTopicFormData] = useState({
    topicName: "",
    description: "",
    difficultyLevel: "Easy",
  });

  const [newJobData, setNewJobData] = useState({
    name: "",
    description: "",
    department: "",
    role: "",
    company: "",
    place: "",
    requirements: "",
    salaryRange: "",
  });

  useEffect(() => {
    fetchDepartments();
    fetchJobs();
  }, [organization?._id]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (organization?._id) {
      fetchJobs(selectedDepartment);
    }
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      if (!organization?._id) {
        console.error("Organization ID not found");
        setDepartments([]);
        return;
      }

      const response = await getRequest(
        `/organization-setup/departments/${organization._id}`
      );

      if (response.data?.success && response.data?.data) {
        setDepartments(response.data.data);
      } else {
        console.error("Failed to fetch departments:", response.data?.message);
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  const fetchTopicsByJobId = async (jobId) => {
    try {
      const response = await getRequest(`/topics/job/${jobId}`);

      if (response.data?.success && response.data?.data) {
        const fetchedTopics = response.data.data.map((topic) => ({
          _id: topic._id,
          name: topic.name,
          description: topic.description,
          difficultyLevel: topic.difficultyLevel,
          createdAt: topic.createdAt,
        }));
        const existingJobTopic = jobTopics.find((jt) => jt.jobId === jobId);
        if (existingJobTopic) {
          setJobTopics((prev) =>
            prev.map((jt) =>
              jt.jobId === jobId
                ? {
                    ...jt,
                    topics: fetchedTopics,
                    topicsCount: fetchedTopics.length,
                  }
                : jt
            )
          );
        } else {
          const newJobTopic = {
            _id: `jobTopic-${Date.now()}`,
            jobId: jobId,
            jobTitle: selectedJob?.title || "Job",
            departmentId: selectedJob?.departmentId,
            createdAt: new Date().toISOString(),
            topicsCount: fetchedTopics.length,
            topics: fetchedTopics,
          };

          setJobTopics((prev) => [...prev, newJobTopic]);
        }
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchJobDetails = async (jobId) => {
    setIsLoadingJobDetails(true);

    try {
      const response = await getRequest(`/jobs/${jobId}`);
      if (response.data?.success && response.data?.data) {
        const fullJobDetails = {
          _id: response.data.data._id,
          title: response.data.data.name,
          company: response.data.data.companyName,
          companyLogo: "🏢",
          location: response.data.data.place,
          jobType: "Full-time",
          departmentId: response.data.data.departmentId,
          postedDate: response.data.data.createdAt,
          applicants: 0,
          description: response.data.data.description || "",
          requirements: response.data.data.requirements || [],
          skills: [],
          salaryRange: response.data.data.salaryRange || "",
          isPromoted: false,
        };

        setSelectedJob(fullJobDetails);
        await fetchTopicsByJobId(jobId);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to fetch job details");
    } finally {
      setIsLoadingJobDetails(false);
    }
  };

  const fetchJobs = async (departmentId = null) => {
    try {
      if (!organization?._id) {
        console.error("Organization ID not found");
        setJobs([]);
        setLoading(false);
        return;
      }

      let url = `/jobs/organization/${organization._id}`;
      if (departmentId && departmentId !== "all") {
        url += `?departmentId=${departmentId}`;
      }

      const response = await getRequest(url);

      if (response.data?.success && response.data?.data) {
        const jobsData = response.data.data.map((job) => ({
          _id: job._id,
          title: job.name,
          company: job.companyName,
          companyLogo: "🏢",
          location: job.place,
          jobType: "Full-time",
          departmentId: job.departmentId,
          postedDate: job.createdAt,
          applicants: 0,
          description: job.description || "",
          requirements: job.requirements || [],
          skills: [],
          salaryRange: job.salaryRange || "",
          isPromoted: false,
        }));
        setJobs(jobsData);
        if (jobsData.length > 0) {
          setSelectedJob(jobsData[0]);
          fetchJobDetails(jobsData[0]._id);
        }
      } else {
        console.error("Failed to fetch jobs:", response.data?.message);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleJobClick = async (job) => {
    setSelectedJob(job);
    if (window.innerWidth < 1024) {
      setIsJobDetailOpen(true);
    }
    await fetchJobDetails(job._id);
  };

  const handleCloseJobDetail = () => {
    setIsJobDetailOpen(false);
    setSelectedJob(null);
  };

  const handleOpenCreateJobModal = () => {
    setIsCreateJobModalOpen(true);
  };

  const handleCloseCreateJobModal = () => {
    setIsCreateJobModalOpen(false);
    setIsSubmittingJob(false);
    setFieldErrors({});
    setNewJobData({
      name: "",
      description: "",
      department: "",
      role: "",
      company: "",
      place: "",
      requirements: "",
      salaryRange: "",
    });
  };

  const handleFieldChange = (field, value) => {
    setNewJobData({ ...newJobData, [field]: value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" });
    }
  };

  const handleCreateJob = async () => {
    const errors = {};
    let hasErrors = false;

    if (!newJobData.name.trim()) {
      errors.name = "Job name is required";
      hasErrors = true;
    }
    if (!newJobData.company.trim()) {
      errors.company = "Company name is required";
      hasErrors = true;
    }
    if (!newJobData.role.trim()) {
      errors.role = "Role is required";
      hasErrors = true;
    }
    if (!newJobData.place.trim()) {
      errors.place = "Place is required";
      hasErrors = true;
    }
    if (!newJobData.department.trim()) {
      errors.department = "Department is required";
      hasErrors = true;
    }
    if (!newJobData.description.trim()) {
      errors.description = "Job description is required";
      hasErrors = true;
    }

    if (!organization?._id) {
      toast.error("Organization not found. Please login again.");
      return;
    }

    if (hasErrors) {
      setFieldErrors(errors);
      toast.error("Please fill in all required fields", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }
    setFieldErrors({});
    setIsSubmittingJob(true);

    try {
      const requirementsArray = newJobData.requirements
        .split(/[,\n]/)
        .map((req) => req.trim())
        .filter((req) => req.length > 0);
      const selectedDept = departments.find(
        (dept) =>
          dept.name.toLowerCase() === newJobData.department.toLowerCase()
      );

      if (!selectedDept) {
        setIsSubmittingJob(false);
        toast.error(
          `Department "${newJobData.department}" not found. Please select a valid department.`
        );
        return;
      }
      const jobData = {
        name: newJobData.name,
        description: newJobData.description,
        companyName: newJobData.company,
        departmentId: selectedDept._id,
        role: newJobData.role,
        place: newJobData.place,
        salaryRange: newJobData.salaryRange,
        requirements: requirementsArray,
        organizationId: organization._id,
      };

      const response = await postRequest("/jobs", jobData);

      if (response.data?.success) {
        toast.success(
          response.data.message ||
            `Job "${newJobData.name}" created successfully!`
        );
        const newJob = {
          _id: response.data.data?._id || `job-${Date.now()}`,
          title: newJobData.name,
          company: newJobData.company,
          companyLogo: "🏢",
          location: newJobData.place,
          jobType: "Full-time",
          departmentId: selectedDept._id,
          postedDate: new Date().toISOString(),
          applicants: 0,
          description: newJobData.description,
          requirements: requirementsArray,
          skills: [],
          salaryRange: newJobData.salaryRange,
          isPromoted: false,
        };

        setJobs((prev) => [newJob, ...prev]);
        setNewJobData({
          name: "",
          description: "",
          department: "",
          role: "",
          company: "",
          place: "",
          requirements: "",
          salaryRange: "",
        });

        handleCloseCreateJobModal();
      } else {
        toast.error(response.data?.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create job. Please try again.");
      }
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleOpenCreateTopicModal = (job) => {
    setSelectedJobForTopic(job);
    setIsCreateTopicModalOpen(true);
  };

  const handleCreateTopic = async () => {
    if (!selectedJobForTopic) return;
    if (!topicFormData.topicName.trim()) {
      toast.error("Topic name is required");
      return;
    }
    if (!organization?._id) {
      toast.error("Organization not found. Please login again.");
      return;
    }

    setIsSubmittingTopic(true);

    try {
      const topicData = {
        name: topicFormData.topicName,
        description: topicFormData.description || "",
        difficultyLevel: topicFormData.difficultyLevel,
        organizationId: organization._id,
        jobId: selectedJobForTopic._id,
      };

      const response = await postRequest("/topics", topicData);

      if (response.data?.success) {
        const createdTopic = response.data.data;
        toast.success(
          response.data.message ||
            `Topic "${topicFormData.topicName}" created successfully!`
        );
        const newTopic = {
          _id: createdTopic._id,
          name: createdTopic.name,
          description: createdTopic.description,
          difficultyLevel: createdTopic.difficultyLevel,
          createdAt: createdTopic.createdAt,
        };
        const existingJobTopic = jobTopics.find(
          (jt) => jt.jobId === selectedJobForTopic._id
        );
        if (existingJobTopic) {
          setJobTopics((prev) =>
            prev.map((jt) =>
              jt.jobId === selectedJobForTopic._id
                ? {
                    ...jt,
                    topicsCount: jt.topicsCount + 1,
                    topics: [...(jt.topics || []), newTopic],
                  }
                : jt
            )
          );
        } else {
          const newJobTopic = {
            _id: `jobTopic-${Date.now()}`,
            jobId: selectedJobForTopic._id,
            jobTitle: selectedJobForTopic.title,
            departmentId: selectedJobForTopic.departmentId,
            createdAt: new Date().toISOString(),
            topicsCount: 1,
            topics: [newTopic],
          };

          setJobTopics((prev) => [...prev, newJobTopic]);
        }
        setTopicFormData({
          topicName: "",
          description: "",
          difficultyLevel: "Easy",
        });

        setIsCreateTopicModalOpen(false);
        setSelectedJobForTopic(null);
      } else {
        toast.error(response.data?.message || "Failed to create topic");
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create topic. Please try again.");
      }
    } finally {
      setIsSubmittingTopic(false);
    }
  };

  const hasTopicsCreated = (jobId) => {
    return jobTopics.some((jt) => jt.jobId === jobId);
  };

  const getJobTopics = (jobId) => {
    return jobTopics.find((jt) => jt.jobId === jobId);
  };

  return (
    <>
      <Toaster position="top-center" />

      {!isJobDetailOpen && !isCreateJobModalOpen && !isCreateTopicModalOpen && (
        <OrgMenuNavigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

      <div className="min-h-screen bg-slate-50 lg:ml-72">
        {!isJobDetailOpen && (
          <DepartmentFilter
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            departments={departments}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <JobsList
              jobs={jobs}
              selectedJob={selectedJob}
              handleJobClick={handleJobClick}
              hasTopicsCreated={hasTopicsCreated}
              isJobDetailOpen={isJobDetailOpen}
            />

            {selectedJob && (
              <JobDetails
                selectedJob={selectedJob}
                departments={departments}
                hasTopicsCreated={hasTopicsCreated}
                getJobTopics={getJobTopics}
                handleOpenCreateTopicModal={handleOpenCreateTopicModal}
                isLoadingJobDetails={isLoadingJobDetails}
              />
            )}
          </div>
        </div>

        {selectedJob && isJobDetailOpen && (
          <JobDetails
            selectedJob={selectedJob}
            departments={departments}
            hasTopicsCreated={hasTopicsCreated}
            getJobTopics={getJobTopics}
            handleOpenCreateTopicModal={handleOpenCreateTopicModal}
            isLoadingJobDetails={isLoadingJobDetails}
            isMobile={true}
            handleCloseJobDetail={handleCloseJobDetail}
          />
        )}

        {!isJobDetailOpen &&
          !isCreateJobModalOpen &&
          !isCreateTopicModalOpen && (
            <FloatingActionButton onClick={handleOpenCreateJobModal} />
          )}

        {isCreateJobModalOpen && (
          <CreateJobModal
            newJobData={newJobData}
            fieldErrors={fieldErrors}
            departments={departments}
            isSubmittingJob={isSubmittingJob}
            handleFieldChange={handleFieldChange}
            handleCreateJob={handleCreateJob}
            handleCloseCreateJobModal={handleCloseCreateJobModal}
          />
        )}

        {isCreateTopicModalOpen && selectedJobForTopic && (
          <CreateTopicModal
            selectedJobForTopic={selectedJobForTopic}
            topicFormData={topicFormData}
            setTopicFormData={setTopicFormData}
            isSubmittingTopic={isSubmittingTopic}
            handleCreateTopic={handleCreateTopic}
            setIsCreateTopicModalOpen={setIsCreateTopicModalOpen}
          />
        )}
      </div>
    </>
  );
};

export default JobsPlacements;

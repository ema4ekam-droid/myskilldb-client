import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../../../api/apiRequests";
import {
  ManualTestModal,
  ViewTestModal,
  TestHeader,
  TestFilters,
  JobDetailsSection,
  SubjectSection,
} from "../../../components/org-admin-components/test-management-components";
import OrgMenuNavigation from "../../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation";

const TestManagement = () => {
  const organization = useSelector((state) => state.organization);
  // State for navigation
  const [currentPage, setCurrentPage] = useState("test-management");

  // State for filters
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filterType, setFilterType] = useState("subject"); // 'subject' or 'jobs'
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedJobTopic, setSelectedJobTopic] = useState("");

  // API-fetched topics scoped to current selections
  const [subjectTopicsApi, setSubjectTopicsApi] = useState([]);
  const [jobTopicsApi, setJobTopicsApi] = useState([]);
  const [subjectTopicTests, setSubjectTopicTests] = useState([]);
  const [jobTopicTests, setJobTopicTests] = useState([]);
  const [jobTests, setJobTests] = useState([]);

  // State for data
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tests, setTests] = useState([]);
  const [jobs, setJobs] = useState([]);

  // State for UI
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());

  // State for test creation
  const [isManualTestModalOpen, setIsManualTestModalOpen] = useState(false);
  const [testCreationContext, setTestCreationContext] = useState(null); // { type: 'subject' | 'topic', subjectId, topicIds, subjectName, topicNames }

  // State for test viewing/editing
  const [isViewTestModalOpen, setIsViewTestModalOpen] = useState(false);
  const [viewingTest, setViewingTest] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchDepartments();
  }, [organization?._id]);

  // Fetch subjects and jobs when department is selected
  useEffect(() => {
    if (selectedDepartment) {
      fetchSubjects();
      fetchJobs();
    } else {
      setSubjects([]);
      setJobs([]);
    }
  }, [selectedDepartment, organization?._id]);

  // Fetch topics for selected subject
  useEffect(() => {
    const fetchSubjectTopics = async () => {
      try {
        if (!selectedSubject) {
          setSubjectTopicsApi([]);
          return;
        }
        const response = await getRequest(`/topics/subject/${selectedSubject}`);
        const apiTopics = response?.data?.data || [];
        // Map API topics to normalize name -> title
        const mappedTopics = apiTopics.map((topic) => ({
          ...topic,
          title: topic.name || topic.title,
          _id: topic._id,
        }));
        setSubjectTopicsApi(mappedTopics);
        if (!selectedTopic && mappedTopics.length > 0) {
          setSelectedTopic(mappedTopics[0]._id);
        }
      } catch (error) {
        console.error("Error fetching subject topics:", error);
        toast.error("Failed to load subject topics");
        setSubjectTopicsApi([]);
      }
    };
    fetchSubjectTopics();
  }, [selectedSubject]);

  // Fetch topic-level tests for selected subject topic
  useEffect(() => {
    const fetchSubjectTopicTests = async () => {
      try {
        if (!selectedTopic) {
          setSubjectTopicTests([]);
          return;
        }
        const response = await getRequest(`/tests/topic/${selectedTopic}`);
        const apiTests = response?.data?.data || [];
        const mapped = apiTests.map((t) => ({
          _id: t._id,
          title: t.name,
          description: t.description,
          subjectId: t.subjectId,
          topicIds: t.topicId ? [t.topicId] : [],
          difficulty: String(t.difficultyLevel || "").toLowerCase(),
          createdAt: t.createdAt,
          type: "topic",
        }));
        setSubjectTopicTests(mapped);
      } catch (error) {
        console.error("Error fetching topic tests (subject):", error);
        toast.error("Failed to load topic tests");
        setSubjectTopicTests([]);
      }
    };
    fetchSubjectTopicTests();
  }, [selectedTopic]);

  // Fetch tests for selected subject via API
  useEffect(() => {
    const fetchSubjectTests = async () => {
      try {
        if (!selectedSubject) return;
        const response = await getRequest(`/tests/subject/${selectedSubject}`);
        const apiTests = response?.data?.data || [];
        const mapped = apiTests.map((t) => ({
          _id: t._id,
          title: t.name,
          description: t.description,
          subjectId: t.subjectId,
          topicIds: Array.isArray(t.topicIds) ? t.topicIds : [],
          difficulty: String(t.difficultyLevel || "").toLowerCase(),
          questionCount: Array.isArray(t.questions)
            ? t.questions.length
            : t.questionCount || 0,
          type: "subject",
          createdBy: t.createdBy || "Admin",
          createdAt: t.createdAt,
        }));
        setTests(mapped);
      } catch (error) {
        console.error("Error fetching tests by subject:", error);
        toast.error("Failed to load subject tests");
      }
    };
    fetchSubjectTests();
  }, [selectedSubject]);

  // Fetch topics for selected job
  useEffect(() => {
    const fetchJobTopics = async () => {
      try {
        if (!selectedJob) {
          setJobTopicsApi([]);
          return;
        }
        const response = await getRequest(`/topics/job/${selectedJob}`);
        const apiTopics = response?.data?.data || [];
        // Map API topics to normalize name -> title
        const mappedTopics = apiTopics.map((topic) => ({
          ...topic,
          title: topic.name || topic.title,
          _id: topic._id,
        }));
        setJobTopicsApi(mappedTopics);
        if (!selectedJobTopic && mappedTopics.length > 0) {
          setSelectedJobTopic(mappedTopics[0]._id);
        }
      } catch (error) {
        console.error("Error fetching job topics:", error);
        toast.error("Failed to load job topics");
        setJobTopicsApi([]);
      }
    };
    fetchJobTopics();
  }, [selectedJob]);

  // Fetch job-level tests for selected job
  useEffect(() => {
    const fetchJobTests = async () => {
      try {
        if (!selectedJob) {
          setJobTests([]);
          return;
        }
        const response = await getRequest(`/tests/job/${selectedJob}`);
        const apiTests = response?.data?.data || [];
        const mapped = apiTests.map((t) => ({
          _id: t._id,
          title: t.name,
          description: t.description,
          jobId: t.jobId,
          topicIds: t.topicId ? [t.topicId] : [],
          difficulty: String(t.difficultyLevel || "").toLowerCase(),
          createdAt: t.createdAt,
          type: "job",
        }));
        setJobTests(mapped);
      } catch (error) {
        console.error("Error fetching tests by job:", error);
        toast.error("Failed to load job tests");
      }
    };
    fetchJobTests();
  }, [selectedJob]);

  // Fetch topic-level tests for selected job topic
  useEffect(() => {
    const fetchJobTopicTests = async () => {
      try {
        if (!selectedJobTopic) {
          setJobTopicTests([]);
          return;
        }
        const response = await getRequest(`/tests/topic/${selectedJobTopic}`);
        const apiTests = response?.data?.data || [];
        const mapped = apiTests.map((t) => ({
          _id: t._id,
          title: t.name,
          description: t.description,
          subjectId: t.subjectId,
          topicIds: t.topicId ? [t.topicId] : [],
          difficulty: String(t.difficultyLevel || "").toLowerCase(),
          createdAt: t.createdAt,
          type: "topic",
        }));
        setJobTopicTests(mapped);
      } catch (error) {
        console.error("Error fetching topic tests (job):", error);
        toast.error("Failed to load topic tests");
        setJobTopicTests([]);
      }
    };
    fetchJobTopicTests();
  }, [selectedJobTopic]);

  const fetchDepartments = async () => {
    try {
      if (!organization?._id) return;
      const response = await getRequest(
        `/organization-setup/departments/${organization._id}`
      );
      const apiDepartments = response?.data?.data || [];
      setDepartments(apiDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    }
  };

  const fetchSubjects = async () => {
    try {
      if (!organization?._id || !selectedDepartment) return;
      const response = await getRequest(
        `/organization-setup/subjects/${organization._id}/${selectedDepartment}`
      );
      const apiSubjects = response?.data?.data || [];
      setSubjects(apiSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects");
    }
  };

  const fetchJobs = async () => {
    try {
      if (!organization?._id || !selectedDepartment) {
        setJobs([]);
        return;
      }
      const response = await getRequest(
        `/jobs/departments/${organization._id}/${selectedDepartment}`
      );
      const apiJobs = response?.data?.data || [];
      // Map API response to expected format
      const mappedJobs = apiJobs.map((job) => ({
        _id: job._id,
        jobTitle: job.name || job.jobTitle,
        company: job.companyName || job.company,
        departmentId: job.departmentId || selectedDepartment,
        classId: job.classId,
        sectionId: job.sectionId,
      }));
      setJobs(mappedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    }
  };

  // Get tests for a subject
  const getTestsForSubject = (subjectId) => {
    return tests.filter(
      (t) => t.subjectId === subjectId && t.type === "subject"
    );
  };

  // Toggle subject accordion
  const toggleSubject = (subjectId) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  // Open manual test modal
  const openManualTestModal = (context) => {
    setTestCreationContext(context);
    setIsManualTestModalOpen(true);
  };

  // Handle test save (create or update)
  const handleSaveTest = async (testData) => {
    if (viewingTest) {
      try {
        if (filterType === "subject") {
          const mapDifficulty = (d) => {
            if (!d) return "Medium";
            const v = String(d).toLowerCase();
            if (v === "easy") return "Easy";
            if (v === "hard") return "Hard";
            return "Medium";
          };

          const questionsArray = testData?.questions || [];
          const payload = {
            name:
              testData?.title ||
              testData?.name ||
              viewingTest?.title ||
              "Untitled Test",
            description: testData?.description,
            subjectId: testData?.subjectId || selectedSubject,
            ...(testCreationContext?.type === "topic" && {
              topicId:
                testData?.topicId ||
                (Array.isArray(testData?.topicIds)
                  ? testData.topicIds[0]
                  : undefined) ||
                selectedTopic ||
                undefined,
            }),
            difficultyLevel: mapDifficulty(
              testData?.difficulty || viewingTest?.difficulty
            ),
            organizationId: organization?._id,
            questionCount: questionsArray.length,
            questions: questionsArray.map((q) => {
              const options = q?.options || [];
              const correct =
                typeof q?.correctAnswer === "number"
                  ? options[q.correctAnswer]
                  : q?.correctAnswer;
              return {
                _id: q?.id, // existing ones will match and be updated; new ones will be created
                questionText: q?.question || q?.questionText || "",
                options,
                topicId:
                  q?.topicId ||
                  (Array.isArray(testData?.topicIds)
                    ? testData.topicIds[0]
                    : undefined) ||
                  selectedTopic ||
                  "",
                correctAnswer: correct || "",
                ...(q?.difficulty
                  ? { difficultyLevel: mapDifficulty(q.difficulty) }
                  : {}),
              };
            }),
          };

          await putRequest(`/tests/${viewingTest._id}`, payload);

          // Optimistic list update
          setTests((prev) =>
            prev.map((t) =>
              t._id === viewingTest._id
                ? {
                    ...t,
                    title: payload.name,
                    difficulty: String(
                      testData?.difficulty ||
                        viewingTest?.difficulty ||
                        "medium"
                    ).toLowerCase(),
                    createdAt: t.createdAt,
                  }
                : t
            )
          );
          toast.success(`Test "${payload.name}" updated successfully!`);
          setIsManualTestModalOpen(false);
          setViewingTest(null);
          setTestCreationContext(null);
          return;
        } else if (filterType === "jobs" && selectedJob) {
          const mapDifficulty = (d) => {
            if (!d) return "Medium";
            const v = String(d).toLowerCase();
            if (v === "easy") return "Easy";
            if (v === "hard") return "Hard";
            return "Medium";
          };

          const questionsArray = testData?.questions || [];
          const payload = {
            name:
              testData?.title ||
              testData?.name ||
              viewingTest?.title ||
              "Untitled Test",
            description: testData?.description,
            jobId: selectedJob,
            ...(testCreationContext?.type === "topic" && {
              topicId:
                testData?.topicId ||
                (Array.isArray(testData?.topicIds)
                  ? testData.topicIds[0]
                  : undefined) ||
                selectedJobTopic ||
                undefined,
            }),
            difficultyLevel: mapDifficulty(
              testData?.difficulty || viewingTest?.difficulty
            ),
            organizationId: organization?._id,
            questionCount: questionsArray.length,
            questions: questionsArray.map((q) => {
              const options = q?.options || [];
              const correct =
                typeof q?.correctAnswer === "number"
                  ? options[q.correctAnswer]
                  : q?.correctAnswer;
              return {
                _id: q?.id,
                questionText: q?.question || q?.questionText || "",
                options,
                topicId:
                  q?.topicId ||
                  (Array.isArray(testData?.topicIds)
                    ? testData.topicIds[0]
                    : undefined) ||
                  selectedJobTopic ||
                  "",
                correctAnswer: correct || "",
                ...(q?.difficulty
                  ? { difficultyLevel: mapDifficulty(q.difficulty) }
                  : {}),
              };
            }),
          };

          await putRequest(`/tests/${viewingTest._id}`, payload);

          if (testCreationContext?.type === "topic") {
            // Update job topic tests list
            setJobTopicTests((prev) =>
              prev.map((t) =>
                t._id === viewingTest._id
                  ? {
                      ...t,
                      title: payload.name,
                      difficulty: String(
                        testData?.difficulty ||
                          viewingTest?.difficulty ||
                          "medium"
                      ).toLowerCase(),
                    }
                  : t
              )
            );
          } else {
            // Update job-level tests list
            setJobTests((prev) =>
              prev.map((t) =>
                t._id === viewingTest._id
                  ? {
                      ...t,
                      title: payload.name,
                      difficulty: String(
                        testData?.difficulty ||
                          viewingTest?.difficulty ||
                          "medium"
                      ).toLowerCase(),
                    }
                  : t
              )
            );
          }

          toast.success(`Test "${payload.name}" updated successfully!`);
          setIsManualTestModalOpen(false);
          setViewingTest(null);
          setTestCreationContext(null);
          return;
        }

        // fallback local update
        handleUpdateTest(testData);
        return;
      } catch (error) {
        console.error("Error updating test:", error);
        toast.error("Failed to update test");
        return;
      }
    }

    // Create new test
    try {
      if (filterType === "subject") {
        const mapDifficulty = (d) => {
          if (!d) return "Medium";
          const v = String(d).toLowerCase();
          if (v === "easy") return "Easy";
          if (v === "hard") return "Hard";
          return "Medium";
        };

        const questionsArray = testData?.questions || [];
        const payload = {
          name: testData?.title || testData?.name || "Untitled Test",
          description: testData?.description,
          subjectId: testData?.subjectId || selectedSubject,
          ...(testCreationContext?.type === "topic" && {
            topicId:
              testData?.topicId ||
              (Array.isArray(testData?.topicIds)
                ? testData.topicIds[0]
                : undefined) ||
              selectedTopic ||
              undefined,
          }),
          difficultyLevel: mapDifficulty(testData?.difficulty),
          organizationId: organization?._id,
          questionCount: questionsArray.length,
          questions: questionsArray.map((q) => {
            const options = q?.options || [];
            const correct =
              typeof q?.correctAnswer === "number"
                ? options[q.correctAnswer]
                : q?.correctAnswer;
            return {
              questionText: q?.question || q?.questionText || "",
              options,
              topicId:
                q?.topicId ||
                (Array.isArray(testData?.topicIds)
                  ? testData.topicIds[0]
                  : undefined) ||
                selectedTopic ||
                "",
              correctAnswer: correct || "",
              // use question-level difficulty if provided, else inherit test difficulty
              ...(q?.difficulty
                ? { difficultyLevel: mapDifficulty(q.difficulty) }
                : {}),
            };
          }),
        };
        console.log(payload);
        const response = await postRequest("/tests", payload);
        const created = response?.data?.data || null;

        // Optimistic UI update
        if (testCreationContext?.type === "topic") {
          // Add to topic-level list instead of subject-level list
          const newTopicTest = {
            _id: created?._id || Math.random().toString(36).slice(2),
            title: payload.name,
            description: payload.description,
            subjectId: payload.subjectId,
            topicIds: payload?.topicId
              ? [payload.topicId]
              : Array.from(
                  new Set(
                    (testData?.questions || [])
                      .map((q) => q?.topicId)
                      .filter(Boolean)
                  )
                ),
            difficulty: String(testData?.difficulty || "medium").toLowerCase(),
            createdAt: new Date().toISOString(),
            type: "topic",
          };
          setSubjectTopicTests((prev) => [...prev, newTopicTest]);
        } else {
          // Subject-level test
          setTests((prev) => [
            ...prev,
            {
              _id: created?._id || Math.random().toString(36).slice(2),
              title: payload.name,
              subjectId: payload.subjectId,
              topicIds: Array.from(
                new Set(
                  (testData?.questions || [])
                    .map((q) => q?.topicId)
                    .filter(Boolean)
                )
              ),
              difficulty: String(
                testData?.difficulty || "medium"
              ).toLowerCase(),
              questionCount: payload.questions.length,
              type: "subject",
              createdBy: "Admin",
              createdAt: new Date().toISOString(),
            },
          ]);
        }
        toast.success(`Test "${payload.name}" created successfully!`);
      } else if (filterType === "jobs" && selectedJob) {
        const mapDifficulty = (d) => {
          if (!d) return "Medium";
          const v = String(d).toLowerCase();
          if (v === "easy") return "Easy";
          if (v === "hard") return "Hard";
          return "Medium";
        };

        const questionsArray = testData?.questions || [];
        const payload = {
          name: testData?.title || testData?.name || "Untitled Test",
          description: testData?.description,
          jobId: selectedJob,
          ...(testCreationContext?.type === "topic" && {
            topicId:
              testData?.topicId ||
              (Array.isArray(testData?.topicIds)
                ? testData.topicIds[0]
                : undefined) ||
              selectedJobTopic ||
              undefined,
          }),
          difficultyLevel: mapDifficulty(testData?.difficulty),
          organizationId: organization?._id,
          questionCount: questionsArray.length,
          questions: questionsArray.map((q) => {
            const options = q?.options || [];
            const correct =
              typeof q?.correctAnswer === "number"
                ? options[q.correctAnswer]
                : q?.correctAnswer;
            return {
              questionText: q?.question || q?.questionText || "",
              options,
              topicId:
                q?.topicId ||
                (Array.isArray(testData?.topicIds)
                  ? testData.topicIds[0]
                  : undefined) ||
                selectedJobTopic ||
                "",
              correctAnswer: correct || "",
              ...(q?.difficulty
                ? { difficultyLevel: mapDifficulty(q.difficulty) }
                : {}),
            };
          }),
        };

        const response = await postRequest("/tests", payload);
        const created = response?.data?.data || null;

        if (testCreationContext?.type === "topic") {
          // Add to Job Topic Level Tests immediately
          const topicIdFinal = payload?.topicId || selectedJobTopic || null;
          const topicMeta = topicIdFinal
            ? jobTopicsApi.find((t) => t._id === topicIdFinal)
            : undefined;
          const newJobTopicTest = {
            _id: created?._id || Math.random().toString(36).slice(2),
            title: payload.name,
            description: payload.description,
            subjectId: topicMeta?.subjectId,
            topicIds: topicIdFinal ? [topicIdFinal] : [],
            difficulty: String(testData?.difficulty || "medium").toLowerCase(),
            createdAt: new Date().toISOString(),
            type: "topic",
          };
          setJobTopicTests((prev) => [...prev, newJobTopicTest]);
        } else {
          // Add to Job-Level Tests immediately
          const newJobTest = {
            _id: created?._id || Math.random().toString(36).slice(2),
            title: payload.name,
            description: payload.description,
            jobId: payload.jobId,
            topicIds: Array.from(
              new Set(
                (testData?.questions || [])
                  .map((q) => q?.topicId)
                  .filter(Boolean)
              )
            ),
            difficulty: String(testData?.difficulty || "medium").toLowerCase(),
            createdAt: new Date().toISOString(),
            type: "job",
          };
          setJobTests((prev) => [...prev, newJobTest]);
        }
        toast.success(`Test "${payload.name}" created successfully!`);
      } else {
        // Topic-level under subject filter without selectedSubject
        setTests((prev) => [...prev, testData]);
        toast.success(`Test "${testData.title}" created successfully!`);
      }
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("Failed to create test");
      return;
    } finally {
      setIsManualTestModalOpen(false);
      setTestCreationContext(null);
      setViewingTest(null);
    }
  };

  // Handle view test
  const handleViewTest = async (test) => {
    try {
      const response = await getRequest(`/tests/${test._id}`);
      const payload = response?.data?.data;
      if (!payload) throw new Error("No data");

      const questions = (payload.questions || []).map((q, index) => {
        const options = q?.options || [];
        const correct = q?.answer?.correctAnswer;
        const correctIdx = correct
          ? options.findIndex((o) => o === correct)
          : -1;
        return {
          id: String(q?._id || index),
          questionNumber: index + 1,
          question: q?.questionText || q?.question || "",
          options,
          correctAnswer: correctIdx >= 0 ? correctIdx : 0,
          topicId: q?.topicId,
        };
      });

      const view = {
        _id: test._id,
        title: test.title,
        difficulty: test.difficulty,
        questionCount: questions.length,
        questions,
      };

      setViewingTest(view);
      setIsViewTestModalOpen(true);
    } catch (error) {
      console.error("Error fetching test details:", error);
      toast.error("Failed to load test details");
    }
  };

  // Handle edit test
  const handleEditTest = async (test) => {
    try {
      const response = await getRequest(`/tests/${test._id}`);
      const payload = response?.data?.data;
      if (!payload) throw new Error("No data");

      const questions = (payload.questions || []).map((q, index) => {
        const options = q?.options || [];
        const correct = q?.answer?.correctAnswer;
        const correctIdx = correct
          ? options.findIndex((o) => o === correct)
          : -1;
        return {
          id: String(q?._id || index),
          questionNumber: index + 1,
          question: q?.questionText || q?.question || "",
          options,
          correctAnswer: correctIdx >= 0 ? correctIdx : 0,
          topicId: q?.topicId,
        };
      });

      const editView = {
        _id: test._id,
        title: test.title,
        description: payload?.test?.description,
        difficulty: test.difficulty,
        questionCount: questions.length,
        questions,
      };

      setViewingTest(editView);
      if (filterType === "jobs") {
        // Set context for jobs flows
        setTestCreationContext({
          type: test.type, // 'job' or 'topic'
          subjectId: test.subjectId, // may be undefined for pure job-level
          topicIds: test.topicIds || [],
          subjectName: "",
          topicNames: [],
        });
      } else {
        setTestCreationContext({
          type: test.type,
          subjectId: test.subjectId,
          topicIds: test.topicIds,
          subjectName:
            subjects.find((s) => s._id === test.subjectId)?.name || "",
          topicNames: test.topicIds
            .map((tid) => topics.find((t) => t._id === tid)?.title || "")
            .filter(Boolean),
        });
      }
      setIsManualTestModalOpen(true);
    } catch (error) {
      console.error("Error fetching test for edit:", error);
      toast.error("Failed to load test for editing");
    }
  };

  // Handle delete test
  const handleDeleteTest = async (testId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this test? This action cannot be undone."
      )
    )
      return;
    try {
      await deleteRequest(`/tests/${testId}`);
      setTests((prev) => prev.filter((t) => t._id !== testId));
      setSubjectTopicTests((prev) => prev.filter((t) => t._id !== testId));
      setJobTopicTests((prev) => prev.filter((t) => t._id !== testId));
      setJobTests((prev) => prev.filter((t) => t._id !== testId));
      toast.success("Test deleted successfully");
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error("Failed to delete test");
    }
  };

  // Handle update test (from edit)
  const handleUpdateTest = (updatedTestData) => {
    setTests((prev) =>
      prev.map((t) => (t._id === updatedTestData._id ? updatedTestData : t))
    );
    toast.success(`Test "${updatedTestData.title}" updated successfully!`);
    setIsManualTestModalOpen(false);
    setViewingTest(null);
    setTestCreationContext(null);
  };

  // Handle page change from menu
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Navigation Component */}
      {!isManualTestModalOpen && !isViewTestModalOpen && (
        <OrgMenuNavigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:ml-72 pt-16 md:pt-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <TestHeader />
          <TestFilters
            departments={departments}
            subjects={subjects}
            jobs={jobs}
            filterType={filterType}
            setFilterType={setFilterType}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
          />

          {filterType === "jobs" && selectedJob && (
            <JobDetailsSection
              jobs={jobs}
              selectedJob={selectedJob}
              subjects={subjects}
              jobTopicsApi={jobTopicsApi}
              selectedJobTopic={selectedJobTopic}
              setSelectedJobTopic={setSelectedJobTopic}
              openManualTestModal={openManualTestModal}
              jobTests={jobTests}
              jobTopicTests={jobTopicTests}
              handleViewTest={handleViewTest}
              handleEditTest={handleEditTest}
              handleDeleteTest={handleDeleteTest}
            />
          )}

          {/* Subject and Topics List */}
          {filterType === "subject" && selectedSubject && (
            <SubjectSection
              subjects={subjects}
              selectedSubject={selectedSubject}
              subjectTopicsApi={subjectTopicsApi}
              expandedSubjects={expandedSubjects}
              toggleSubject={toggleSubject}
              openManualTestModal={openManualTestModal}
              getTestsForSubject={getTestsForSubject}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              subjectTopicTests={subjectTopicTests}
              handleViewTest={handleViewTest}
              handleEditTest={handleEditTest}
              handleDeleteTest={handleDeleteTest}
            />
          )}
        </div>

        {/* Modals */}
        <ManualTestModal
          isOpen={isManualTestModalOpen}
          onClose={() => {
            setIsManualTestModalOpen(false);
            setTestCreationContext(null);
            setViewingTest(null);
          }}
          context={testCreationContext}
          topics={(() => {
            if (testCreationContext?.type === "subject" && selectedSubject) {
              return subjectTopicsApi;
            } else if (
              testCreationContext?.type === "job" ||
              (testCreationContext?.type === "topic" && filterType === "jobs")
            ) {
              return jobTopicsApi;
            } else if (
              testCreationContext?.type === "topic" &&
              filterType === "subject"
            ) {
              return subjectTopicsApi;
            }
            return [];
          })()}
          editingTest={viewingTest}
          onSave={handleSaveTest}
        />

        <ViewTestModal
          isOpen={isViewTestModalOpen}
          onClose={() => {
            setIsViewTestModalOpen(false);
            setViewingTest(null);
          }}
          test={viewingTest}
        />
      </div>
    </>
  );
};

export default TestManagement;

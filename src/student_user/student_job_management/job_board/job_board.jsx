import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import { MobileJobDetailsModal } from '../../../components/student-components/student-job-management-components/job-board-components';
import { getRequest, postRequest } from '../../../api/apiRequests';

const JobBoard = () => {
  const [currentPage, setCurrentPage] = useState('job-board');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [skillPlannerJobs, setSkillPlannerJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingJobDetails, setIsLoadingJobDetails] = useState(false);
  
  // Redux state
  const user = useSelector((state) => state.user);
  const assignment = useSelector((state) => state.assignment);

  useEffect(() => {
    if (user?.organizationId && assignment?.departmentId) {
      fetchJobs();
      fetchSkillPlannerJobs();
    } else {
      setIsLoading(false);
    }
  }, [user?.organizationId, assignment?.departmentId, user?._id]);

  const fetchSkillPlannerJobs = async () => {
    if (!user?._id) return;
    
    try {
      const response = await getRequest('/skill-planner');
      if (response.data?.success && response.data?.data) {
        const plannerJobIds = response.data.data.map(item => String(item.jobId));
        // Store job IDs for matching
        setSkillPlannerJobs(plannerJobIds);
      }
    } catch (error) {
      console.error('Error fetching skill planner jobs:', error);
    }
  };

  const fetchJobDetails = async (job) => {
    if (!job?._id) return;

    // Fetch full job details from API
    try {
      setIsLoadingJobDetails(true);
      const response = await getRequest(`/jobs/${job._id}`);
      
      if (response.data?.success && response.data?.data) {
        const jobData = response.data.data;
        
        // Fetch topics (skills) for this job
        let skills = job.skills || [];
        try {
          const topicsResponse = await getRequest(`/topics/job/${job._id}`);
          if (topicsResponse.data?.success && topicsResponse.data?.data) {
            // Transform topics to skills (extract topic names)
            skills = topicsResponse.data.data.map(topic => topic.name || topic.title).filter(Boolean);
          }
        } catch (error) {
          console.error('Error fetching topics:', error);
          // Use existing skills if topics fetch fails
        }
        
        // Transform API data to match component's expected format
        const detailedJob = {
          _id: jobData._id,
          title: jobData.name || jobData.title || job.title,
          company: jobData.companyName || jobData.company || job.company,
          companyLogo: jobData.companyLogo || job.companyLogo || '🏢',
          location: jobData.place || jobData.location || job.location,
          workMode: jobData.workMode || job.workMode || 'Remote',
          jobType: jobData.jobType || job.jobType || 'Full-time',
          departmentId: jobData.departmentId || job.departmentId,
          postedDate: jobData.createdAt || jobData.postedDate || job.postedDate,
          applicants: jobData.applicants || job.applicants || 0,
          description: jobData.description || job.description || '',
          requirements: jobData.requirements || job.requirements || [],
          skills: skills.length > 0 ? skills : (jobData.skills || []),
          salaryRange: jobData.salaryRange || job.salaryRange || 'Not specified',
          jobPostingLink: jobData.jobPostingLink || jobData.externalLink || job.jobPostingLink || '#',
        };
        
        setSelectedJob(detailedJob);
      } else {
        toast.error('Failed to load job details');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setIsLoadingJobDetails(false);
    }
  };

  const fetchJobs = async () => {
    try {
      if (!user?.organizationId || !assignment?.departmentId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Fetch jobs by department
      const response = await getRequest(`/jobs/departments/${user.organizationId}/${assignment.departmentId}`);
      if (response.data?.success && response.data?.data) {
        const apiJobs = response.data.data || [];
        
        // Transform API data to match component's expected format
        const transformedJobs = apiJobs.map((job) => ({
          _id: job._id,
          title: job.name || job.title,
          company: job.companyName || job.company || 'Company',
          companyLogo: job.companyLogo || '🏢',
          location: job.place || job.location || 'Location',
          workMode: job.workMode || 'Remote',
          jobType: job.jobType || 'Full-time',
          departmentId: job.departmentId || assignment.departmentId,
          postedDate: job.createdAt || job.postedDate || new Date().toISOString(),
          applicants: job.applicants || 0,
          description: job.description || '',
          requirements: job.requirements || [],
          skills: job.skills || [],
          salaryRange: job.salaryRange || 'Not specified',
          jobPostingLink: job.jobPostingLink || job.externalLink || '#',
        }));
        
        setJobs(transformedJobs);
        if (transformedJobs.length > 0) {
          const firstJob = transformedJobs[0];
          setSelectedJob(firstJob);
          // Automatically fetch full details for the first job
          fetchJobDetails(firstJob);
        }
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobClick = async (job) => {
    // Set basic job info immediately for better UX
    setSelectedJob(job);
    // Only set isJobDetailOpen on mobile (triggers full-screen modal)
    if (window.innerWidth < 1024) { // lg breakpoint
      setIsJobDetailOpen(true);
    }

    // Fetch full job details from API
    await fetchJobDetails(job);
  };

  const handleCloseJobDetail = () => {
    setIsJobDetailOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddToSkillPlanner = async (job) => {
    if (!user?._id || !job?._id) {
      toast.error('Unable to add job to skill planner');
      return;
    }

    const isInPlanner = isInSkillPlanner(job._id);
    
    if (isInPlanner) {
      toast.info('Job is already in Skill Planner');
      return;
    }

    try {
      // Add to skill planner
      const response = await postRequest('/skill-planner', {
        jobId: job._id
      });
      console.log("response", response.data.data);
      if (response.data?.success) {
        setSkillPlannerJobs([...skillPlannerJobs, String(job._id)]);
        toast.success(`Added "${job.title}" to Skill Planner!`);
      } else {
        toast.error(response.data?.message || 'Failed to add job to skill planner');
      }
    } catch (error) {
      console.error('Error adding job to skill planner:', error);
      toast.error('Failed to add job to skill planner');
    }
  };

  const isInSkillPlanner = (jobId) => {
    if (!jobId) return false;
    // Check if jobId is in the array (could be job objects or just IDs)
    return skillPlannerJobs.some(j => {
      const id = typeof j === 'string' ? j : (j._id || j);
      return String(id) === String(jobId);
    });
  };

  const getTimeSincePosted = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getCompanyInitial = (companyName) => {
    return companyName.charAt(0).toUpperCase();
  };

  const getCompanyColor = (companyName) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500',
    ];
    const index = companyName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="Job Board" subtitle="Loading job opportunities..." />
      {!isJobDetailOpen && (
        <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      )}
      
      <div className="min-h-screen bg-slate-50 lg:ml-72">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Job Listings */}
            <div className={`lg:col-span-1 space-y-3 ${isJobDetailOpen ? 'hidden lg:block' : ''}`}>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <h2 className="text-lg font-bold text-slate-900 mb-1">
                  Department Jobs
                </h2>
                <p className="text-xs text-slate-600 mb-2">
                  Job opportunities in your department
                </p>
                <p className="text-xs text-slate-500">{jobs.length} results</p>
              </div>

              <div className="space-y-2">
                {jobs.map(job => (
                  <div
                    key={job._id}
                    onClick={() => handleJobClick(job)}
                    className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-all ${
                      selectedJob?._id === job._id
                        ? 'border-blue-500 ring-2 ring-blue-100'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex gap-3">
                        <div className={`w-12 h-12 ${getCompanyColor(job.company)} rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                          {getCompanyInitial(job.company)}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="text-sm font-semibold text-blue-600 hover:underline mb-1 flex items-center gap-2">
                            {job.title}
                            {isInSkillPlanner(job._id) && (
                              <i className="fas fa-bullseye text-xs text-green-500" title="In Skill Planner"></i>
                            )}
                          </h3>
                          <p className="text-sm text-slate-900 mb-1">{job.company}</p>
                          <p className="text-xs text-slate-600 mb-2">{job.location} ({job.workMode})</p>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              {getTimeSincePosted(job.postedDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Job Details (Desktop) */}
            {selectedJob && (
              <div className="hidden lg:block lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 sticky top-24">
                  <div className="p-6">
                    {isLoadingJobDetails && (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-sm text-slate-600">Loading job details...</span>
                      </div>
                    )}
                    {!isLoadingJobDetails && (
                      <>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div className="flex-1 text-left">
                            <h1 className="text-xl font-bold text-slate-900 mb-1">
                              {selectedJob.title}
                            </h1>
                        <p className="text-sm text-slate-700 mb-2">{selectedJob.company}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-2">
                          <span className="inline-flex items-center gap-1">
                            <i className="fas fa-calendar"></i>
                            Posted {getTimeSincePosted(selectedJob.postedDate)}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <i className="fas fa-users"></i>
                            {selectedJob.applicants} applicants
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-3">{selectedJob.location}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                            {selectedJob.workMode}
                          </span>
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                            {selectedJob.jobType}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button 
                            disabled
                            className="px-6 py-2.5 bg-slate-400 text-white font-semibold rounded-full transition-colors inline-flex items-center gap-2 cursor-not-allowed opacity-60"
                            title="Apply functionality coming soon"
                          >
                            <i className="fas fa-external-link-alt text-xs"></i>
                            Apply Now
                          </button>
                          
                          {!isInSkillPlanner(selectedJob._id) && (
                            <button 
                              onClick={() => handleAddToSkillPlanner(selectedJob)}
                              className="px-6 py-2.5 bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold rounded-full transition-colors inline-flex items-center gap-2"
                            >
                              <i className="fas fa-bullseye"></i>
                              Add to Skill Planner
                            </button>
                          )}
                          {isInSkillPlanner(selectedJob._id) && (
                            <div className="px-6 py-2.5 bg-green-100 text-green-700 font-semibold rounded-full inline-flex items-center gap-2">
                              <i className="fas fa-check-circle"></i>
                              In Skill Planner
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="border-t border-slate-200 pt-6 text-left">
                      <h2 className="text-base font-bold text-slate-900 mb-4">About the job</h2>
                      <p className="text-sm text-slate-700 mb-6 leading-relaxed text-left">
                        {selectedJob.description}
                      </p>

                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Requirements</h3>
                      <ul className="space-y-2 mb-6">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-slate-700 flex items-start gap-2 text-left">
                            <i className="fas fa-check text-green-600 text-xs mt-1"></i>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Skills Required</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedJob.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                        <p className="text-sm font-semibold text-green-900 mb-1">
                          <i className="fas fa-money-bill-wave mr-2"></i>
                          Salary Range
                        </p>
                        <p className="text-sm text-green-800">{selectedJob.salaryRange}</p>
                      </div>
                    </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Job Details Modal */}
        <MobileJobDetailsModal
          isOpen={isJobDetailOpen}
          selectedJob={selectedJob}
          onClose={handleCloseJobDetail}
          onAddToSkillPlanner={handleAddToSkillPlanner}
          isInSkillPlanner={isInSkillPlanner}
          getTimeSincePosted={getTimeSincePosted}
        />
      </div>
    </>
  );
};

export default JobBoard;


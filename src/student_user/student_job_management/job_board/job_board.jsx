import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import StudentMenuNavigation from '../../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../../components/loader/LoaderOverlay';
import { MobileJobDetailsModal } from '../../../components/student-components/student-job-management-components/job-board-components';

const JobBoard = () => {
  const [currentPage, setCurrentPage] = useState('job-board');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [skillPlannerJobs, setSkillPlannerJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Student's department - would be fetched from user profile
  const [studentDepartment] = useState({
    _id: 'dept-1',
    name: 'Web Development'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // All jobs (in real app, filter on backend by studentDepartment._id)
      const allJobs = [
        {
          _id: 'job-1',
          title: 'Frontend Developer',
          company: 'TechCorp Solutions',
          companyLogo: '🏢',
          location: 'Bangalore, India',
          workMode: 'Remote',
          jobType: 'Full-time',
          departmentId: 'dept-1',
          postedDate: '2024-01-20T10:00:00Z',
          applicants: 150,
          description: 'We are looking for a talented Frontend Developer to join our team. You will be responsible for building beautiful and responsive web applications using React, TypeScript, and modern CSS frameworks.',
          requirements: [
            '3+ years of experience with React',
            'Strong knowledge of JavaScript/TypeScript',
            'Experience with Tailwind CSS or similar frameworks',
            'Good understanding of REST APIs',
          ],
          skills: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
          salaryRange: '₹8-12 LPA',
          jobPostingLink: 'https://example.com/job-1',
        },
        {
          _id: 'job-2',
          title: 'Senior Data Scientist',
          company: 'Analytics Pro',
          companyLogo: '📊',
          location: 'Mumbai, India',
          workMode: 'Hybrid',
          jobType: 'Full-time',
          departmentId: 'dept-2',
          postedDate: '2024-01-19T14:00:00Z',
          applicants: 89,
          description: 'Join our data science team to work on cutting-edge machine learning projects. You will develop predictive models, analyze large datasets, and provide actionable insights.',
          requirements: [
            '5+ years in data science',
            'Expert in Python and ML libraries',
            'Experience with deep learning frameworks',
            'Strong statistical background',
          ],
          skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Statistics'],
          salaryRange: '₹15-25 LPA',
          jobPostingLink: 'https://example.com/job-2',
        },
        {
          _id: 'job-3',
          title: 'React Native Developer',
          company: 'MobileFirst Inc',
          companyLogo: '📱',
          location: 'Hyderabad, India',
          workMode: 'On-site',
          jobType: 'Contract',
          departmentId: 'dept-3',
          postedDate: '2024-01-18T09:00:00Z',
          applicants: 67,
          description: 'Develop cross-platform mobile applications using React Native. Work closely with designers and backend teams to deliver high-quality mobile experiences.',
          requirements: [
            '2+ years with React Native',
            'Published apps on App Store/Play Store',
            'Knowledge of native modules',
            'Experience with Redux or MobX',
          ],
          skills: ['React Native', 'JavaScript', 'Redux', 'Native Modules'],
          salaryRange: '₹6-10 LPA',
          jobPostingLink: 'https://example.com/job-3',
        },
        {
          _id: 'job-4',
          title: 'DevOps Engineer',
          company: 'CloudScale Systems',
          companyLogo: '☁️',
          location: 'Pune, India',
          workMode: 'Remote',
          jobType: 'Full-time',
          departmentId: 'dept-4',
          postedDate: '2024-01-21T11:00:00Z',
          applicants: 112,
          description: 'Manage and automate our cloud infrastructure. Work with Docker, Kubernetes, and CI/CD pipelines to ensure smooth deployments and high availability.',
          requirements: [
            '3+ years in DevOps',
            'Strong AWS/Azure experience',
            'Docker & Kubernetes expertise',
            'CI/CD pipeline experience',
          ],
          skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
          salaryRange: '₹10-18 LPA',
          jobPostingLink: 'https://example.com/job-4',
        },
        {
          _id: 'job-5',
          title: 'UI/UX Designer',
          company: 'DesignHub Studio',
          companyLogo: '🎨',
          location: 'Bangalore, India',
          workMode: 'Hybrid',
          jobType: 'Full-time',
          departmentId: 'dept-5',
          postedDate: '2024-01-17T15:00:00Z',
          applicants: 203,
          description: 'Create intuitive and beautiful user interfaces. Conduct user research, create wireframes, and design high-fidelity prototypes.',
          requirements: [
            '4+ years in UI/UX design',
            'Proficient in Figma/Adobe XD',
            'Strong portfolio required',
            'Understanding of design systems',
          ],
          skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
          salaryRange: '₹8-14 LPA',
          jobPostingLink: 'https://example.com/job-5',
        },
        {
          _id: 'job-6',
          title: 'Full Stack Developer',
          company: 'StartupXYZ',
          companyLogo: '🚀',
          location: 'Delhi, India',
          workMode: 'Remote',
          jobType: 'Full-time',
          departmentId: 'dept-1',
          postedDate: '2024-01-22T08:00:00Z',
          applicants: 94,
          description: 'Build end-to-end web applications using MERN stack. Take ownership of features from concept to deployment.',
          requirements: [
            '2+ years full stack development',
            'MERN stack expertise',
            'RESTful API design',
            'Database optimization',
          ],
          skills: ['MongoDB', 'Express', 'React', 'Node.js', 'AWS'],
          salaryRange: '₹7-11 LPA',
          jobPostingLink: 'https://example.com/job-6',
        },
      ];
      
      // Filter jobs by student's department
      const departmentJobs = allJobs.filter(job => job.departmentId === studentDepartment._id);
      
      setJobs(departmentJobs);
      setSelectedJob(departmentJobs[0]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setIsLoading(false);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    // Only set isJobDetailOpen on mobile (triggers full-screen modal)
    if (window.innerWidth < 1024) { // lg breakpoint
      setIsJobDetailOpen(true);
    }
  };

  const handleCloseJobDetail = () => {
    setIsJobDetailOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddToSkillPlanner = (job) => {
    if (skillPlannerJobs.find(j => j._id === job._id)) {
      setSkillPlannerJobs(skillPlannerJobs.filter(j => j._id !== job._id));
      toast.success('Job removed from Skill Planner');
    } else {
      setSkillPlannerJobs([...skillPlannerJobs, job]);
      toast.success(`Added "${job.title}" to Skill Planner with ${job.skills.length} skills to master!`);
    }
  };

  const isInSkillPlanner = (jobId) => {
    return skillPlannerJobs.some(j => j._id === jobId);
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
                  {studentDepartment.name} Jobs
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
                          <a 
                            href={selectedJob.jobPostingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors inline-flex items-center gap-2"
                          >
                            <i className="fas fa-external-link-alt text-xs"></i>
                            Apply Now
                          </a>
                          
                          <button 
                            onClick={() => handleAddToSkillPlanner(selectedJob)}
                            className={`px-6 py-2.5 font-semibold rounded-full transition-colors inline-flex items-center gap-2 ${
                              isInSkillPlanner(selectedJob._id)
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            }`}
                          >
                            <i className={`fas fa-bullseye`}></i>
                            {isInSkillPlanner(selectedJob._id) ? 'In Skill Planner' : 'Add to Skill Planner'}
                          </button>
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


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentMenuNavigation from '../../components/student-components/student-menu-components/StudentMenuNavigation';
import LoaderOverlay from '../../components/loader/LoaderOverlay';

const StudentDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [studentData, setStudentData] = useState({
    name: 'John Doe',
    studentId: 'STU2024001',
    department: 'Computer Science',
    semester: 'Semester 5',
    email: 'john.doe@example.com',
    title: 'Full Stack Developer Student'
  });

  // Stats Cards - Job-focused metrics
  const [stats, setStats] = useState([
    {
      id: 1,
      label: 'Total Jobs',
      sublabel: 'in Department',
      value: '24',
      icon: 'fas fa-briefcase',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      label: 'Jobs',
      sublabel: 'Assessment Taken',
      value: '8',
      icon: 'fas fa-clipboard-check',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      label: 'Jobs',
      sublabel: 'CV Created',
      value: '3',
      icon: 'fas fa-file-alt',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      label: 'Jobs',
      sublabel: 'Videos Created',
      value: '2',
      icon: 'fas fa-video',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]);

  // Jobs Posted by Placement Officers
  const [placementJobs, setPlacementJobs] = useState([
    {
      id: 1,
      company: 'Google',
      position: 'Software Engineer Intern',
      location: 'Bangalore',
      postedBy: 'Dr. Sarah Johnson',
      postedDate: '2 days ago',
      applicants: 24,
      deadline: 'Aug 15, 2024',
      logo: 'G'
    },
    {
      id: 2,
      company: 'Microsoft',
      position: 'Frontend Developer',
      location: 'Hyderabad',
      postedBy: 'Prof. Michael Chen',
      postedDate: '5 days ago',
      applicants: 18,
      deadline: 'Aug 20, 2024',
      logo: 'M'
    },
    {
      id: 3,
      company: 'Amazon',
      position: 'Full Stack Developer',
      location: 'Remote',
      postedBy: 'Dr. Sarah Johnson',
      postedDate: '1 week ago',
      applicants: 32,
      deadline: 'Aug 25, 2024',
      logo: 'A'
    }
  ]);

  // Pending Assessments
  const [pendingAssessments, setPendingAssessments] = useState([
    {
      id: 1,
      subject: 'React Advanced',
      level: 'Hard',
      duration: '60 min',
      questions: 15,
      deadline: 'Tomorrow',
      type: 'Job Skill'
    },
    {
      id: 2,
      subject: 'JavaScript ES6+',
      level: 'Medium',
      duration: '45 min',
      questions: 12,
      deadline: '2 days',
      type: 'Subject Level'
    },
    {
      id: 3,
      subject: 'TypeScript',
      level: 'Easy',
      duration: '30 min',
      questions: 10,
      deadline: '3 days',
      type: 'Topic Level'
    }
  ]);

  // CV Draft Status
  const [cvDrafts, setCvDrafts] = useState([
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'Google',
      completion: 85,
      lastEdited: '2 hours ago',
      missingItems: ['Testimonial', 'Video']
    },
    {
      id: 2,
      jobTitle: 'Full Stack Developer',
      company: 'Microsoft',
      completion: 60,
      lastEdited: '1 day ago',
      missingItems: ['Skills', 'Certificate', 'Video']
    }
  ]);

  // Job Focus Videos
  const [jobVideos, setJobVideos] = useState([
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'Google',
      videos: [
        { id: 1, skill: 'React', thumbnail: 'R', duration: '5:32', uploadedDate: '2 days ago' },
        { id: 2, skill: 'JavaScript', thumbnail: 'JS', duration: '7:15', uploadedDate: '3 days ago' },
        { id: 3, skill: 'TypeScript', thumbnail: 'TS', duration: '6:20', uploadedDate: '5 days ago' }
      ]
    },
    {
      id: 2,
      jobTitle: 'Full Stack Developer',
      company: 'Microsoft',
      videos: [
        { id: 4, skill: 'Node.js', thumbnail: 'N', duration: '8:45', uploadedDate: '1 week ago' },
        { id: 5, skill: 'MongoDB', thumbnail: 'M', duration: '6:10', uploadedDate: '1 week ago' }
      ]
    }
  ]);

  // LinkedIn Posts by Job & Skill
  const [linkedInPosts, setLinkedInPosts] = useState([
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'Google',
      posts: [
        { id: 1, skill: 'React', preview: 'Building scalable React apps...', likes: 24, createdDate: '3 days ago' },
        { id: 2, skill: 'JavaScript', preview: 'ES6 features that changed...', likes: 18, createdDate: '5 days ago' }
      ]
    },
    {
      id: 2,
      jobTitle: 'Full Stack Developer',
      company: 'Microsoft',
      posts: [
        { id: 3, skill: 'Node.js', preview: 'Microservices architecture...', likes: 32, createdDate: '1 week ago' },
        { id: 4, skill: 'MongoDB', preview: 'NoSQL database design...', likes: 15, createdDate: '1 week ago' }
      ]
    }
  ]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getCurrentDate = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const getGreeting = () => {
    // Get current time in IST (Indian Standard Time - UTC+5:30)
    const istTime = new Date().toLocaleString('en-US', { 
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false 
    });
    const hour = parseInt(istTime);
    
    if (hour < 12) {
      return { text: 'Good Morning', color: 'text-orange-600' };
    } else if (hour < 18) {
      return { text: 'Good Afternoon', color: 'text-blue-600' };
    } else {
      return { text: 'Good Evening', color: 'text-purple-600' };
    }
  };

  const greeting = getGreeting();

  return (
    <>
      <LoaderOverlay isVisible={isLoading} title="Dashboard" subtitle="Loading your dashboard..." />
      
      <StudentMenuNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <div className="min-h-screen bg-slate-50 lg:ml-72 pt-16 lg:pt-0">
        
        {/* Top Full-Width Section */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          
          {/* Header Greeting - Full Width */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200">
            <p className="text-xs md:text-sm text-slate-500 mb-2">{getCurrentDate()}</p>
            <h1 className={`text-2xl md:text-3xl font-bold ${greeting.color} mb-1`}>
              {greeting.text}
            </h1>
            <p className="text-base md:text-lg text-slate-700 font-medium">{studentData.name}</p>
          </div>

          {/* Stats Cards - Full Width */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <i className={`${stat.icon} ${stat.color} text-lg md:text-xl`}></i>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 hidden md:block">
                    <i className="fas fa-chevron-right text-sm"></i>
                  </button>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <div className="text-xs md:text-sm text-slate-600">
                  <p className="leading-tight">{stat.label}</p>
                  <p className="leading-tight">{stat.sublabel}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Jobs Posted by Placement Officers - Full Width */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-slate-900">Jobs Posted by Placement Officers</h2>
              <button 
                onClick={() => navigate('/student/job-board')}
                className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {placementJobs.map((job) => (
                <div key={job.id} className="border border-slate-200 rounded-xl p-4 md:p-5 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base md:text-lg">
                      {job.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{job.company}</h4>
                      <p className="text-xs text-slate-500 truncate">{job.position}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3 md:mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <i className="fas fa-map-marker-alt w-3 flex-shrink-0"></i>
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <i className="fas fa-user w-3 flex-shrink-0"></i>
                      <span className="truncate">{job.postedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <i className="fas fa-clock w-3 flex-shrink-0"></i>
                      <span>{job.postedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">{job.applicants} applicants</span>
                    <button 
                      onClick={() => navigate('/student/job-board')}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold whitespace-nowrap"
                    >
                      View & Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CV Draft Status - Full Width */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">CV Drafts</h3>
              <button 
                onClick={() => navigate('/student/job-cv')}
                className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {cvDrafts.map((draft) => (
                <div key={draft.id} className="border border-slate-200 rounded-lg p-4 hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{draft.jobTitle}</h4>
                      <p className="text-xs text-slate-500 truncate">{draft.company}</p>
                    </div>
                    <span className="text-xs font-bold text-purple-600 ml-2">{draft.completion}%</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full h-2 transition-all"
                      style={{ width: `${draft.completion}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate">Edited {draft.lastEdited}</span>
                    <button 
                      onClick={() => navigate('/student/job-cv')}
                      className="text-blue-600 hover:text-blue-700 font-semibold whitespace-nowrap ml-2"
                    >
                      Continue →
                    </button>
                  </div>

                  {draft.missingItems.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-2">Missing:</p>
                      <div className="flex flex-wrap gap-1">
                        {draft.missingItems.map((item, idx) => (
                          <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/student/job-cv')}
              className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Create New CV
            </button>
          </div>
        </div>

        {/* Main Container with Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 px-4 md:px-6 pb-4 md:pb-6 max-w-full">
          
          {/* Left Main Content */}
          <div className="flex-1 space-y-4 md:space-y-6">

            {/* Pending Assessments */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-bold text-slate-900">Pending Assessments</h2>
                <button 
                  onClick={() => navigate('/student/course-assessments')}
                  className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {pendingAssessments.map((assessment) => (
                  <div key={assessment.id} className="border border-slate-200 rounded-lg p-3 md:p-4 hover:border-blue-300 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{assessment.subject}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            assessment.level === 'Hard' ? 'bg-red-100 text-red-700' :
                            assessment.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {assessment.level}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                            {assessment.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <i className="far fa-clock"></i>
                            {assessment.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="far fa-file-alt"></i>
                            {assessment.questions} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="far fa-calendar"></i>
                            Due: {assessment.deadline}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/student/course-assessments')}
                        className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LinkedIn Posts */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">LinkedIn Posts</h3>
                <button 
                  onClick={() => navigate('/student/skill-planner')}
                  className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {linkedInPosts.map((job) => (
                  <div key={job.id} className="border border-slate-200 rounded-lg p-3">
                    <div className="mb-3">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{job.jobTitle}</h4>
                      <p className="text-xs text-slate-500 truncate">{job.company}</p>
                    </div>

                    {/* Horizontal Slider */}
                    <div className="relative">
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                        {job.posts.map((post) => (
                          <div 
                            key={post.id}
                            className="flex-shrink-0 w-36 md:w-40 cursor-pointer hover:scale-105 transition-transform"
                            style={{ scrollSnapAlign: 'start' }}
                            onClick={() => navigate('/student/skill-planner')}
                          >
                            <div className="border border-slate-200 rounded-lg p-2 md:p-3 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-shadow h-full">
                              <div className="flex items-center gap-2 mb-2">
                                <i className="fab fa-linkedin text-blue-600 text-base md:text-lg flex-shrink-0"></i>
                                <span className="text-xs font-bold text-slate-900 truncate">{post.skill}</span>
                              </div>
                              <p className="text-xs text-slate-700 line-clamp-2 mb-2">{post.preview}</p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1 text-slate-500">
                                  <i className="fas fa-thumbs-up text-blue-600"></i>
                                  {post.likes}
                                </span>
                                <span className="text-slate-500 text-[10px] md:text-xs">{post.createdDate}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/student/skill-planner')}
                className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Create New Post
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-96 space-y-4 md:space-y-6">
            
            {/* Teleprompter Shortcut - PROMINENT */}
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-video text-xl md:text-2xl"></i>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-bold">Video Recorder</h3>
                  <p className="text-xs text-white text-opacity-90">Teleprompter Ready</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-white text-opacity-90 mb-4">
                Record professional skill videos with built-in teleprompter and script generator.
              </p>
              <button
                onClick={() => navigate('/student/skill-planner')}
                className="w-full py-2.5 md:py-3 bg-white text-red-600 rounded-lg font-bold text-sm md:text-base hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <i className="fas fa-video"></i>
                Open Teleprompter
              </button>
            </div>

            {/* Job Focus Videos */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">My Videos</h3>
                <button 
                  onClick={() => navigate('/student/skill-planner')}
                  className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {jobVideos.map((job) => (
                  <div key={job.id} className="border border-slate-200 rounded-lg p-3">
                    <div className="mb-3">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{job.jobTitle}</h4>
                      <p className="text-xs text-slate-500 truncate">{job.company}</p>
                    </div>

                    {/* Horizontal Slider */}
                    <div className="relative">
                      <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                        {job.videos.map((video) => (
                          <div 
                            key={video.id}
                            className="flex-shrink-0 w-28 md:w-32 cursor-pointer hover:scale-105 transition-transform"
                            style={{ scrollSnapAlign: 'start' }}
                            onClick={() => navigate('/student/skill-planner')}
                          >
                            <div className="relative mb-2">
                              <div className="w-28 h-16 md:w-32 md:h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-base md:text-lg">
                                {video.thumbnail}
                                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                                  <i className="fas fa-play text-white text-xl md:text-2xl"></i>
                                </div>
                              </div>
                              <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-black bg-opacity-75 text-white text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 rounded">
                                {video.duration}
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-slate-900 truncate">{video.skill}</p>
                            <p className="text-[10px] md:text-xs text-slate-500">{video.uploadedDate}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/student/skill-planner')}
                className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Add More Videos
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;

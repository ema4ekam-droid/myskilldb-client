import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';
import JobParserModal from '../../components/org-admin-components/jobs-placements-components/JobParserModal';

const OrgDashboard = () => {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [organizationInfo, setOrganizationInfo] = useState(null);
  const [stats, setStats] = useState({
    departments: 5,
    totalJobs: 42,
    skillsDerived: 185,
    cvsGenerated: 67,
    cvsInProgress: 34
  });
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Add Job Modal states
  const [isAddJobStep1Open, setIsAddJobStep1Open] = useState(false);
  const [isAddJobStep2Open, setIsAddJobStep2Open] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    workMode: 'Remote',
    jobType: 'Full-time',
    departmentId: '',
    salaryRange: '',
    requirements: ''
  });

  // Job Hunter Modal states
  const [isJobHunterOpen, setIsJobHunterOpen] = useState(false);
  const [isJobParserOpen, setIsJobParserOpen] = useState(false);
  const [userPortals, setUserPortals] = useState([
    { id: 1, name: 'My LinkedIn Search', url: 'https://www.linkedin.com/jobs/' }
  ]);
  const [showAddPortalForm, setShowAddPortalForm] = useState(false);
  const [newPortal, setNewPortal] = useState({ name: '', url: '' });
  const [mySkillDBPortals] = useState([
    { id: 1, name: 'Indeed', url: 'https://www.indeed.com/' },
    { id: 2, name: 'Wellfound', url: 'https://wellfound.com/' }
  ]);

  // Record Placement Modal states
  const [isRecordPlacementOpen, setIsRecordPlacementOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [placementForm, setPlacementForm] = useState({
    studentId: '',
    studentName: '',
    department: '',
    company: '',
    package: '',
    recordDate: new Date().toISOString().split('T')[0]
  });
  
  // Dummy student data for search
  const [studentsData] = useState([
    { id: 1, name: 'Arjun Mehta', department: 'Computer Science' },
    { id: 2, name: 'Ananya Singh', department: 'Data Science' },
    { id: 3, name: 'Rohan Patel', department: 'IT' },
    { id: 4, name: 'Kavya Reddy', department: 'Computer Science' },
    { id: 5, name: 'Aditya Sharma', department: 'Engineering' },
    { id: 6, name: 'Ishita Kumar', department: 'Business Administration' }
  ]);
  
  // Dummy data for recent placements
  const [recentPlacements, setRecentPlacements] = useState([
    { id: 1, student: 'Rahul Kumar', company: 'Amazon', package: '₹18 LPA', department: 'Computer Science', date: '2024-11-10' },
    { id: 2, student: 'Priya Sharma', company: 'Microsoft', package: '₹22 LPA', department: 'IT', date: '2024-11-09' },
    { id: 3, student: 'Amit Patel', company: 'Google', package: '₹28 LPA', department: 'Computer Science', date: '2024-11-08' },
    { id: 4, student: 'Sneha Reddy', company: 'Flipkart', package: '₹15 LPA', department: 'Data Science', date: '2024-11-07' }
  ]);

  // Navigation handler
  const handlePageChange = (pageId) => {
    setActiveMenu(pageId);
  };

  // Add Job handlers
  const handleOpenAddJob = () => {
    setIsAddJobStep1Open(true);
  };

  // Job Hunter handlers
  const handleOpenJobHunter = () => {
    setIsJobHunterOpen(true);
  };

  const handleLaunch = (url) => {
    // Open portal in new browser tab
    window.open(url, '_blank', 'noopener,noreferrer');
    // Show job parser modal
    setIsJobParserOpen(true);
    setIsJobHunterOpen(false);
  };


  const handleSaveNewPortal = (e) => {
    e.preventDefault();
    
    if (!newPortal.name.trim() || !newPortal.url.trim()) {
      toast.error('Please fill in both portal name and URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(newPortal.url);
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }

    const portalToAdd = {
      id: userPortals.length + 1,
      name: newPortal.name,
      url: newPortal.url
    };

    setUserPortals([...userPortals, portalToAdd]);
    setNewPortal({ name: '', url: '' });
    setShowAddPortalForm(false);
    toast.success('Portal saved successfully!');
  };

  const handleStep1Continue = () => {
    if (!newJobData.title.trim() || !newJobData.description.trim()) {
      toast.error('Please fill in both job title and description');
      return;
    }
    setIsAddJobStep1Open(false);
    setIsAddJobStep2Open(true);
  };

  const handleStep2Back = () => {
    setIsAddJobStep2Open(false);
    setIsAddJobStep1Open(true);
  };

  const handleSubmitJob = async () => {
    if (!newJobData.company || !newJobData.location || !newJobData.departmentId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      // API call would go here
      // await axios.post(`${API_BASE_URL}/jobs`, newJobData);
      
      toast.success('Job posted successfully!');
      setIsAddJobStep2Open(false);
      setNewJobData({
        title: '',
        description: '',
        company: '',
        location: '',
        workMode: 'Remote',
        jobType: 'Full-time',
        departmentId: '',
        salaryRange: '',
        requirements: ''
      });
      
      // Refresh data
      fetchOrganizationData();
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job');
    } finally {
      setIsLoading(false);
    }
  };

  // Record Placement handlers
  const handleOpenRecordPlacement = () => {
    setIsRecordPlacementOpen(true);
  };

  const handleCloseRecordPlacement = () => {
    setIsRecordPlacementOpen(false);
    setStudentSearchQuery('');
    setShowStudentDropdown(false);
    setPlacementForm({
      studentId: '',
      studentName: '',
      department: '',
      company: '',
      package: '',
      recordDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleStudentSearch = (query) => {
    setStudentSearchQuery(query);
    setShowStudentDropdown(query.length > 0);
  };

  const handleSelectStudent = (student) => {
    setPlacementForm({
      ...placementForm,
      studentId: student.id,
      studentName: student.name,
      department: student.department
    });
    setStudentSearchQuery(student.name);
    setShowStudentDropdown(false);
  };

  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  const handleSubmitPlacement = async (e) => {
    e.preventDefault();
    
    if (!placementForm.studentId || !placementForm.company || !placementForm.package) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      // API call would go here
      // await axios.post(`${API_BASE_URL}/placements`, placementForm);

      // Add to recent placements
      const newPlacement = {
        id: recentPlacements.length + 1,
        student: placementForm.studentName,
        company: placementForm.company,
        package: placementForm.package,
        department: placementForm.department,
        date: placementForm.recordDate
      };
      setRecentPlacements([newPlacement, ...recentPlacements]);

      toast.success('Placement recorded successfully!');
      handleCloseRecordPlacement();
    } catch (error) {
      console.error('Error recording placement:', error);
      toast.error('Failed to record placement');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch organization data
  const fetchOrganizationData = async () => {
    try {
      setIsLoading(true);
      // Add your API calls here
      // const response = await axios.get(`${API_BASE_URL}/organization/stats`);
      // setStats(response.data);
    } catch (error) {
      console.error('Error fetching organization data:', error);
      toast.error('Failed to fetch organization data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();

    const onWindowClick = (e) => {
      const menuButton = document.getElementById('profile-button');
      const menuButtonMobile = document.getElementById('profile-button-mobile');
      const menu = document.getElementById('profile-menu');
      const menuMobile = document.getElementById('profile-menu-mobile');
      
      if (isUserMenuOpen) {
        const clickedInsideDesktop = menuButton && menu && 
          (menuButton.contains(e.target) || menu.contains(e.target));
        const clickedInsideMobile = menuButtonMobile && menuMobile && 
          (menuButtonMobile.contains(e.target) || menuMobile.contains(e.target));
        
        if (!clickedInsideDesktop && !clickedInsideMobile) {
        setIsUserMenuOpen(false);
        }
      }
    };

    window.addEventListener('click', onWindowClick);
    return () => window.removeEventListener('click', onWindowClick);
  }, [isUserMenuOpen]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />
      
      {/* Navigation Component - Hidden when Job Hunter modals are open */}
      {!isJobHunterOpen && !isJobParserOpen && (
      <OrgMenuNavigation currentPage={activeMenu} onPageChange={handlePageChange} />
      )}

      {/* Main Content with offset for sidebar */}
      <div className={isJobHunterOpen || isJobParserOpen ? "" : "lg:ml-72"}>
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          {/* Mobile Profile - Fixed Top Right */}
          <div className="lg:hidden fixed top-4 right-4 z-[99]">
            <div className="relative">
              <button
                id="profile-button-mobile"
                onClick={() => setIsUserMenuOpen(v => !v)}
              >
                <img
                  src="https://api.dicebear.com/8.x/initials/svg?seed=Placement+Officer"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-lg hover:ring-2 hover:ring-indigo-400 transition-all"
                  alt="Placement Officer Profile"
                />
              </button>
              {isUserMenuOpen && (
                <div id="profile-menu-mobile" className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-20">
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100">
                    <i className="fas fa-briefcase w-4 text-slate-500"></i>
                    Create Job Posting
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-slate-100 border-t border-slate-200">
                    <i className="fas fa-sign-out-alt w-4 text-red-500"></i>
                    Logout
                  </a>
            </div>
              )}
            </div>
          </div>

          <header className="pt-16 lg:pt-0">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Placement Dashboard</h1>
                <p className="text-slate-500 text-sm">Manage campus placements, interviews, and student opportunities</p>
              </div>
              {/* Desktop Profile */}
              <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <button
                  id="profile-button"
                  onClick={() => setIsUserMenuOpen(v => !v)}
                >
                  <img
                      src="https://api.dicebear.com/8.x/initials/svg?seed=Placement+Officer"
                    className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md hover:ring-2 hover:ring-indigo-400 transition-all"
                      alt="Placement Officer Profile"
                  />
                </button>
                {isUserMenuOpen && (
                  <div id="profile-menu" className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-20">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100">
                        <i className="fas fa-briefcase w-4 text-slate-500"></i>
                        Create Job Posting
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-slate-100 border-t border-slate-200">
                      <i className="fas fa-sign-out-alt w-4 text-red-500"></i>
                      Logout
                    </a>
                  </div>
                )}
                </div>
              </div>
            </div>
          </header>
          <section>
            <h2 className="text-xl font-bold mb-4 text-slate-900">Placement Overview</h2>
            
            {/* First Row - 3 Cards on Mobile, 5 on Desktop */}
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mb-3 lg:mb-0">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 md:p-6 rounded-xl shadow-lg text-white">
                <p className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">{stats.departments}</p>
                <p className="text-xs md:text-sm opacity-90 mb-0.5 md:mb-1">Departments</p>
                <p className="text-[10px] md:text-xs opacity-75">Active</p>
                </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 md:p-6 rounded-xl shadow-lg text-white">
                <p className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">{stats.totalJobs}</p>
                <p className="text-xs md:text-sm opacity-90 mb-0.5 md:mb-1">Jobs Added</p>
                <p className="text-[10px] md:text-xs opacity-75">Total</p>
                </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 md:p-6 rounded-xl shadow-lg text-white">
                <p className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">{stats.skillsDerived}</p>
                <p className="text-xs md:text-sm opacity-90 mb-0.5 md:mb-1">Skills Derived</p>
                <p className="text-[10px] md:text-xs opacity-75">Derived</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 md:p-6 rounded-xl shadow-lg text-white hidden lg:block">
                <p className="text-5xl font-bold mb-2">{stats.cvsGenerated}</p>
                <p className="text-sm opacity-90 mb-1">Total CV Generated</p>
                <p className="text-xs opacity-75">Complete</p>
                </div>

              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 md:p-6 rounded-xl shadow-lg text-white hidden lg:block">
                <p className="text-5xl font-bold mb-2">{stats.cvsInProgress}</p>
                <p className="text-sm opacity-90 mb-1">Total CV Under Progress</p>
                <p className="text-xs opacity-75">In Progress</p>
                </div>
              </div>

            {/* Second Row - 2 Wider CV Cards (Mobile Only) */}
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg text-white">
                <p className="text-3xl font-bold mb-1">{stats.cvsGenerated}</p>
                <p className="text-xs opacity-90 mb-0.5">CV Generated</p>
                <p className="text-[10px] opacity-75">Complete</p>
                </div>

              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-xl shadow-lg text-white">
                <p className="text-3xl font-bold mb-1">{stats.cvsInProgress}</p>
                <p className="text-xs opacity-90 mb-0.5">CV In Progress</p>
                <p className="text-[10px] opacity-75">In Progress</p>
                </div>
              </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-5 text-slate-900">Quick Actions</h2>
            
            {/* Prominent Actions - 2 per row on mobile */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
              {/* Add Job Action */}
              <button 
                onClick={handleOpenAddJob}
                className="p-4 md:p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all text-left group shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-plus-circle text-indigo-500 text-2xl md:text-3xl"></i>
                </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-xl font-bold text-white mb-0 md:mb-1">Add New Job Posting</h3>
                    <p className="text-xs md:text-sm text-indigo-100 hidden md:block">Create a new job opportunity for students</p>
                </div>
                  <i className="fas fa-arrow-right text-white text-lg md:text-xl opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden md:block"></i>
              </div>
              </button>

              {/* Job Hunter Action */}
              <button 
                onClick={handleOpenJobHunter}
                className="p-4 md:p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all text-left group shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-search text-emerald-500 text-2xl md:text-3xl"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-xl font-bold text-white mb-0 md:mb-1">Job Hunter</h3>
                    <p className="text-xs md:text-sm text-emerald-100 hidden md:block">Browse job portals and capture opportunities</p>
                  </div>
                  <i className="fas fa-arrow-right text-white text-lg md:text-xl opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden md:block"></i>
                </div>
              </button>
              </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button className="p-4 md:p-5 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex w-14 h-14 bg-blue-100 rounded-full items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                    <i className="fas fa-users text-blue-600 text-2xl"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm md:text-base">Eligible Students</h3>
                    <p className="text-xs md:text-sm text-slate-500 hidden md:block">Filter by department</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={handleOpenRecordPlacement}
                className="p-4 md:p-5 border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex w-14 h-14 bg-green-100 rounded-full items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                    <i className="fas fa-check-circle text-green-600 text-2xl"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm md:text-base">Record Placement</h3>
                    <p className="text-xs md:text-sm text-slate-500 hidden md:block">Mark student as placed</p>
                  </div>
                </div>
              </button>

              <button className="p-4 md:p-5 border-2 border-amber-200 rounded-lg hover:bg-amber-50 hover:border-amber-400 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex w-14 h-14 bg-amber-100 rounded-full items-center justify-center group-hover:bg-amber-200 transition-colors flex-shrink-0">
                    <i className="fas fa-clipboard-list text-amber-600 text-2xl"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm md:text-base">Plan Assessment</h3>
                    <p className="text-xs md:text-sm text-slate-500 hidden md:block">Create pre-placement tests</p>
                  </div>
                </div>
              </button>

              <button className="p-4 md:p-5 border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex w-14 h-14 bg-slate-100 rounded-full items-center justify-center group-hover:bg-slate-200 transition-colors flex-shrink-0">
                    <i className="fas fa-chart-line text-slate-600 text-2xl"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm md:text-base">Placement Reports</h3>
                    <p className="text-xs md:text-sm text-slate-500 hidden md:block">View analytics & insights</p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* Recent Placements */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="text-xl font-bold text-slate-900">Recent Placements</h2>
                <div className="flex items-center gap-3">
                <button 
                  onClick={handleOpenRecordPlacement}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Record New
                </button>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                  View All
                  <i className="fas fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Student Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Package</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPlacements.map((placement) => (
                    <tr key={placement.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://api.dicebear.com/8.x/initials/svg?seed=${placement.student}`}
                            className="w-8 h-8 rounded-full"
                            alt={placement.student}
                          />
                          <span className="font-medium text-slate-900">{placement.student}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{placement.company}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {placement.package}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-sm">{placement.department}</td>
                      <td className="py-3 px-4 text-slate-500 text-sm">{new Date(placement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Step 1 Modal - Job Title & Description */}
      {isAddJobStep1Open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-briefcase text-indigo-600 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-white">Create New Job</h2>
                    <p className="text-sm text-indigo-100">Step 1 of 2: Basic Information</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddJobStep1Open(false)}
                  className="w-8 h-8 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <i className="fas fa-times text-white"></i>
              </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Job Title */}
                  <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newJobData.title}
                  onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                  placeholder="e.g., Frontend Developer, Data Analyst, Marketing Manager"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-slate-900"
                />
                  </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newJobData.description}
                  onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-slate-900 resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  <i className="fas fa-info-circle mr-1"></i>
                  Provide a clear and engaging description of the role
                </p>
                </div>

              {/* Info Box */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="fas fa-lightbulb text-indigo-600 text-xl"></i>
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Quick Tip</p>
                    <p className="text-sm text-indigo-700 mt-1">
                      A good job title and description help attract the right candidates. In the next step, we'll ask for more details like company name, location, and requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-50 p-6 rounded-b-2xl border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => setIsAddJobStep1Open(false)}
                className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStep1Continue}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Continue
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 Modal - Additional Details (Q&A Format) */}
      {isAddJobStep2Open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-clipboard-list text-indigo-600 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-white">Almost Done!</h2>
                    <p className="text-sm text-indigo-100">Step 2 of 2: Additional Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddJobStep2Open(false)}
                  className="w-8 h-8 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <i className="fas fa-times text-white"></i>
              </button>
              </div>
            </div>

            {/* Content - Q&A Format */}
            <div className="p-6 space-y-5">
              {/* Company Name */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <label className="block text-base font-semibold text-slate-900 mb-2">
                      What's the company name? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newJobData.company}
                      onChange={(e) => setNewJobData({ ...newJobData, company: e.target.value })}
                      placeholder="e.g., Google, Microsoft, Amazon"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <label className="block text-base font-semibold text-slate-900 mb-2">
                      Where is this job located? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newJobData.location}
                      onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                      placeholder="e.g., Bangalore, India or Remote"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Work Mode */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <label className="block text-base font-semibold text-slate-900 mb-3">
                      What's the work mode?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Remote', 'Hybrid', 'On-site'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setNewJobData({ ...newJobData, workMode: mode })}
                          className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                            newJobData.workMode === mode
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Type */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <label className="block text-base font-semibold text-slate-900 mb-3">
                      What type of employment?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Full-time', 'Part-time', 'Contract'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setNewJobData({ ...newJobData, jobType: type })}
                          className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                            newJobData.jobType === type
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <label className="block text-base font-semibold text-slate-900 mb-2">
                      Which department is this for? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newJobData.departmentId}
                      onChange={(e) => setNewJobData({ ...newJobData, departmentId: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select a department</option>
                      <option value="dept-1">Computer Science</option>
                      <option value="dept-2">Data Science</option>
                      <option value="dept-3">IT & Technology</option>
                      <option value="dept-4">Business Administration</option>
                      <option value="dept-5">Engineering</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Salary Range */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                    6
                  </div>
                  <div className="flex-1">
                    <label className="block text-base font-semibold text-slate-900 mb-2">
                      What's the salary range? (Optional)
                    </label>
                    <input
                      type="text"
                      value={newJobData.salaryRange}
                      onChange={(e) => setNewJobData({ ...newJobData, salaryRange: e.target.value })}
                      placeholder="e.g., ₹8-12 LPA or $80k-$120k"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                    7
                  </div>
                  <div className="flex-1">
                    <label className="block text-base font-semibold text-slate-900 mb-2">
                      Any specific requirements? (Optional)
                    </label>
                    <textarea
                      value={newJobData.requirements}
                      onChange={(e) => setNewJobData({ ...newJobData, requirements: e.target.value })}
                      placeholder="e.g., 2+ years experience, Knowledge of React, Bachelor's degree..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-50 p-6 rounded-b-2xl border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={handleStep2Back}
                className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition-colors flex items-center gap-2"
              >
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
              <button
                onClick={handleSubmitJob}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Posting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle"></i>
                    Post Job
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Hunter Modal - Portal Selection */}
      {isJobHunterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-search text-emerald-600 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-white">Job Hunter</h2>
                    <p className="text-sm text-emerald-100">Browse job portals and capture opportunities</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsJobHunterOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <i className="fas fa-times text-white"></i>
              </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* My Saved Portals */}
                  <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <i className="fas fa-bookmark text-indigo-600"></i>
                    My Saved Portals
                  </h3>
                  <button
                    onClick={() => setShowAddPortalForm(!showAddPortalForm)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <i className={`fas ${showAddPortalForm ? 'fa-times' : 'fa-plus'}`}></i>
                    {showAddPortalForm ? 'Cancel' : 'Add New'}
                  </button>
                  </div>

                {/* Add New Portal Form */}
                {showAddPortalForm && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-300 rounded-xl p-5 mb-4">
                    <form onSubmit={handleSaveNewPortal} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Portal Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newPortal.name}
                          onChange={(e) => setNewPortal({ ...newPortal, name: e.target.value })}
                          placeholder="e.g., My Naukri Search"
                          className="w-full px-4 py-2.5 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-slate-900"
                          required
                        />
                </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Portal URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          value={newPortal.url}
                          onChange={(e) => setNewPortal({ ...newPortal, url: e.target.value })}
                          placeholder="https://www.example.com/jobs"
                          className="w-full px-4 py-2.5 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-slate-900"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-save"></i>
                        Save Portal
              </button>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPortals.map((portal) => (
                    <div key={portal.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5 hover:border-indigo-400 transition-all">
                <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-bookmark text-white text-lg"></i>
                  </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 truncate mb-1">{portal.name}</h4>
                          <p className="text-xs text-slate-600 truncate">{portal.url}</p>
                </div>
                        <button
                          onClick={() => handleLaunch(portal.url)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center gap-2 flex-shrink-0"
                        >
                          <i className="fas fa-external-link-alt"></i>
                          Launch
              </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discover Portals */}
                  <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-star text-amber-500"></i>
                  New from MySkillDB
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mySkillDBPortals.map((portal) => (
                    <div key={portal.id} className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5 hover:border-emerald-400 transition-all">
                <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-star text-white text-lg"></i>
                  </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 truncate mb-1">{portal.name}</h4>
                          <p className="text-xs text-slate-600 truncate">{portal.url}</p>
                </div>
                        <button
                          onClick={() => handleLaunch(portal.url)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center gap-2 flex-shrink-0"
                        >
                          <i className="fas fa-external-link-alt"></i>
                          Launch
              </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="fas fa-sparkles text-purple-600 text-xl"></i>
                  <div>
                    <p className="text-sm font-medium text-purple-900">✨ AI-Powered Job Extraction</p>
                    <p className="text-sm text-purple-700 mt-1">
                      Click "Launch" to open a job portal. Copy the entire job post (Ctrl+A, Ctrl+C), paste it in our AI parser, and watch the magic happen!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Job Parser Modal */}
      <JobParserModal
        isOpen={isJobParserOpen}
        onClose={() => setIsJobParserOpen(false)}
      />

      {/* Record Placement Modal */}
      {isRecordPlacementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-graduation-cap text-green-600 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-white">Record Placement</h2>
                    <p className="text-sm text-green-100">Add a new student placement record</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseRecordPlacement}
                  className="w-8 h-8 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <i className="fas fa-times text-white"></i>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitPlacement} className="p-6 space-y-5">
              {/* Student Name Search */}
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => handleStudentSearch(e.target.value)}
                    onFocus={() => setShowStudentDropdown(studentSearchQuery.length > 0)}
                    placeholder="Search for a student..."
                    className="w-full px-4 py-3 pl-11 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-slate-900"
                    required
                  />
                  <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                </div>
                
                {/* Dropdown for search results */}
                {showStudentDropdown && filteredStudents.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => handleSelectStudent(student)}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                  <div>
                            <p className="font-semibold text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.department}</p>
                  </div>
                          <i className="fas fa-chevron-right text-slate-400 text-sm"></i>
                </div>
              </button>
                    ))}
            </div>
                )}
      </div>

              {/* Department (Auto-filled) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={placementForm.department}
                  readOnly
                  placeholder="Will be auto-filled when you select a student"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">
                  <i className="fas fa-info-circle mr-1"></i>
                  This field is automatically filled based on the selected student
                </p>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={placementForm.company}
                  onChange={(e) => setPlacementForm({ ...placementForm, company: e.target.value })}
                  placeholder="e.g., Google, Amazon, Microsoft"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-slate-900"
                  required
                />
                <p className="text-xs text-green-600 mt-1">
                  <i className="fas fa-plus-circle mr-1"></i>
                  Add new company name if not in system
                </p>
              </div>

              {/* Package */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Package (CTC) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={placementForm.package}
                  onChange={(e) => setPlacementForm({ ...placementForm, package: e.target.value })}
                  placeholder="e.g., ₹12 LPA or $80,000"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-slate-900"
                  required
                />
              </div>

              {/* Record Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Record Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={placementForm.recordDate}
                  onChange={(e) => setPlacementForm({ ...placementForm, recordDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-slate-900"
                  required
                />
              </div>

              {/* Info Box */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="fas fa-check-circle text-green-600 text-xl"></i>
                  <div>
                    <p className="text-sm font-medium text-green-900">Quick Tip</p>
                    <p className="text-sm text-green-700 mt-1">
                      Make sure all details are accurate before submitting. This will be added to the placement records immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseRecordPlacement}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Recording...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle"></i>
                      Record Placement
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgDashboard;
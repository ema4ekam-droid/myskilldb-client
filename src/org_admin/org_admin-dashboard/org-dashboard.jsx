import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import OrgMenuNavigation from '../../components/org-admin-components/org-admin-menu_components/OrgMenuNavigation';

const OrgDashboard = () => {
  const API_BASE_URL = useMemo(() => `${import.meta.env.VITE_SERVER_API_URL}/api`, []);
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [organizationInfo, setOrganizationInfo] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0
  });
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Navigation handler
  const handlePageChange = (pageId) => {
    setActiveMenu(pageId);
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
      const menu = document.getElementById('profile-menu');
      if (isUserMenuOpen && menuButton && menu && 
          !menuButton.contains(e.target) && !menu.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('click', onWindowClick);
    return () => window.removeEventListener('click', onWindowClick);
  }, [isUserMenuOpen]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Toaster position="top-right" />
      
      {/* Navigation Component */}
      <OrgMenuNavigation currentPage={activeMenu} onPageChange={handlePageChange} />

      {/* Main Content with offset for sidebar */}
      <div className="lg:ml-72">
        <main id="mainContent" className="flex-1 p-4 md:p-8 space-y-8">
          <header className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Organization Dashboard</h1>
              <p className="text-slate-500 text-sm">Welcome to your organization management portal</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  id="profile-button"
                  onClick={() => setIsUserMenuOpen(v => !v)}
                >
                  <img
                    src="https://api.dicebear.com/8.x/initials/svg?seed=Org+Admin"
                    className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md hover:ring-2 hover:ring-indigo-400 transition-all"
                    alt="Admin Profile"
                  />
                </button>
                {isUserMenuOpen && (
                  <div id="profile-menu" className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-20">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100">
                      <i className="fas fa-plus w-4 text-slate-500"></i>
                      Add New Student
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100">
                      <i className="fas fa-plus w-4 text-slate-500"></i>
                      Add New Teacher
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-slate-100 border-t border-slate-200">
                      <i className="fas fa-sign-out-alt w-4 text-red-500"></i>
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </header>
          <section>
            <h2 className="text-xl font-bold mb-4 text-slate-900">Organization Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <i className="fas fa-users fa-2x text-indigo-500"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total Students</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalStudents}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <i className="fas fa-chalkboard-teacher fa-2x text-emerald-500"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total Teachers</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalTeachers}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-purple-100 p-4 rounded-full">
                  <i className="fas fa-graduation-cap fa-2x text-purple-500"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total Classes</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalClasses}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="bg-amber-100 p-4 rounded-full">
                  <i className="fas fa-book fa-2x text-amber-500"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total Subjects</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalSubjects}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-5 text-slate-900">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <i className="fas fa-user-plus text-indigo-600"></i>
                  <div>
                    <h3 className="font-semibold text-slate-900">Add Student</h3>
                    <p className="text-sm text-slate-500">Register a new student</p>
                  </div>
                </div>
              </button>

              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <i className="fas fa-chalkboard-teacher text-emerald-600"></i>
                  <div>
                    <h3 className="font-semibold text-slate-900">Add Teacher</h3>
                    <p className="text-sm text-slate-500">Register a new teacher</p>
                  </div>
                </div>
              </button>

              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <i className="fas fa-calendar-check text-purple-600"></i>
                  <div>
                    <h3 className="font-semibold text-slate-900">Mark Attendance</h3>
                    <p className="text-sm text-slate-500">Take attendance for classes</p>
                  </div>
                </div>
              </button>

              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <i className="fas fa-chart-bar text-amber-600"></i>
                  <div>
                    <h3 className="font-semibold text-slate-900">View Reports</h3>
                    <p className="text-sm text-slate-500">Generate academic reports</p>
                  </div>
                </div>
              </button>

              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <i className="fas fa-cog text-slate-600"></i>
                  <div>
                    <h3 className="font-semibold text-slate-900">Settings</h3>
                    <p className="text-sm text-slate-500">Manage organization settings</p>
                  </div>
                </div>
              </button>

              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <i className="fas fa-bell text-red-600"></i>
                  <div>
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    <p className="text-sm text-slate-500">View recent notifications</p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default OrgDashboard;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logoutRequest } from '../../../api/apiRequests';

const StudentMenuNavigation = ({ currentPage, onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [pendingAssessmentsCount, setPendingAssessmentsCount] = useState(2); // Mock count - will be fetched from API
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'fas fa-home',
      color: 'green',
      route: '/student/dashboard'
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: 'fas fa-book-open',
      color: 'blue',
      subItems: [
        {
          id: 'my-courses',
          label: 'My Courses',
          icon: 'fas fa-graduation-cap',
          route: '/student/courses'
        },
        {
          id: 'classroom-recordings',
          label: 'Classroom Recordings',
          icon: 'fas fa-video',
          route: '/student/recordings'
        },
        {
          id: 'course-assessments',
          label: 'Course Assessments',
          icon: 'fas fa-clipboard-check',
          route: '/student/course-assessments'
        }
      ]
    },
    {
      id: 'job-management',
      label: 'Job Management',
      icon: 'fas fa-briefcase',
      color: 'orange',
      subItems: [
        {
          id: 'job-board',
          label: 'Job Board',
          icon: 'fas fa-briefcase',
          route: '/student/jobs'
        },
        {
          id: 'skill-planner',
          label: 'Skill Planner',
          icon: 'fas fa-bullseye',
          route: '/student/skill-planner'
        },
        {
          id: 'job-assessments',
          label: 'Job Assessments',
          icon: 'fas fa-tasks',
          route: '/student/job-assessments'
        },
        {
          id: 'job-cv',
          label: 'Job specific CV',
          icon: 'fas fa-file-alt',
          route: '/student/cv'
        }
      ]
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: 'fas fa-users',
      color: 'purple',
      subItems: [
        {
          id: 'mentors',
          label: 'Mentors',
          icon: 'fas fa-user-tie',
          route: '/student/contacts/mentors'
        },
        {
          id: 'hr-managers',
          label: 'HR Managers',
          icon: 'fas fa-user-friends',
          route: '/student/contacts/hr'
        },
        {
          id: 'founders',
          label: 'Founders',
          icon: 'fas fa-user-check',
          route: '/student/contacts/founders'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'fas fa-cog',
      color: 'gray',
      route: '/student/settings'
    }
  ];

  // Auto-expand parent menu when submenu is active
  React.useEffect(() => {
    const activeSubmenuParent = menuItems.find(
      (item) =>
        item.subItems &&
        item.subItems.some((subItem) => subItem.id === currentPage)
    );

    if (activeSubmenuParent) {
      setExpandedMenus((prev) => ({
        ...prev,
        [activeSubmenuParent.id]: true,
      }));
    }
  }, [currentPage]);

  const handlePageChange = (pageId, parentId = null) => {
    onPageChange(pageId);

    // If it's a submenu item, navigate directly but keep parent menu open
    if (parentId) {
      const parentItem = menuItems.find((item) => item.id === parentId);
      const subItem = parentItem?.subItems?.find((item) => item.id === pageId);
      
      if (subItem && subItem.route) {
        navigate(subItem.route);
        toast.success(`Navigating to: ${subItem.label}`);
      }
      // Ensure parent menu stays expanded
      setExpandedMenus((prev) => ({
        ...prev,
        [parentId]: true,
      }));
      setIsMobileMenuOpen(false);
    } else {
      // This is a main menu item
      const menuItem = menuItems.find((item) => item.id === pageId);
      if (menuItem && menuItem.subItems) {
        // Just toggle the accordion - don't navigate automatically
        setExpandedMenus((prev) => ({
          ...prev,
          [pageId]: !prev[pageId],
        }));
      } else {
        // Regular menu item without submenus - navigate directly
        if (menuItem && menuItem.route) {
          navigate(menuItem.route);
          toast.success(`Navigating to: ${menuItem.label}`);
        }
        setIsMobileMenuOpen(false);
      }
    }
  };

  const handleLogout = async () => {
    await logoutRequest('/auth/logout');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[100] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-4 shadow-2xl border-2 border-white transition-all duration-200 transform hover:scale-105 active:scale-95"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Navigation Menu"
      >
        <i
          className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}
        ></i>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-[90] backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Navigation Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[95] w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
          ${
            isMobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* Logo Section */}
        <div className="p-4 md:p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">MySkillDB</h1>
            </div>
            {/* Close button for mobile */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <i className="fas fa-times text-slate-500 text-sm"></i>
            </button>
          </div>
        </div>

        {/* Student Panel Text */}
        <div className="px-4 md:px-6 py-2 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <p className="text-xs md:text-sm text-slate-500">
            Student Portal
          </p>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            const isExpanded = expandedMenus[item.id];
            const hasActiveSubmenu =
              item.subItems &&
              item.subItems.some((subItem) => currentPage === subItem.id);

            return (
              <div key={item.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => handlePageChange(item.id)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                    ${
                      hasActiveSubmenu
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 shadow-md'
                        : isActive
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 shadow-md'
                        : isExpanded && item.subItems
                        ? 'bg-slate-50 text-slate-700 border-l-4 border-slate-300 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm'
                    }
                  `}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      hasActiveSubmenu
                        ? `bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white shadow-lg`
                        : isActive
                        ? `bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white shadow-lg`
                        : isExpanded && item.subItems
                        ? `bg-${item.color}-100 text-${item.color}-600 shadow-md`
                        : `bg-slate-100 text-slate-500 hover:bg-${item.color}-50 hover:text-${item.color}-500`
                    }`}
                  >
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-base">
                      {item.label}
                    </span>
                  </div>
                  {item.subItems && (
                    <i
                      className={`fas fa-chevron-${
                        isExpanded ? 'up' : 'down'
                      } text-xs transition-transform duration-200 ${
                        hasActiveSubmenu
                          ? 'text-indigo-500'
                          : isExpanded
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    ></i>
                  )}
                  {(hasActiveSubmenu || isActive) && (
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse ${
                        item.color === 'blue'
                          ? 'bg-blue-500'
                          : item.color === 'green'
                          ? 'bg-green-500'
                          : item.color === 'purple'
                          ? 'bg-purple-500'
                          : item.color === 'orange'
                          ? 'bg-orange-500'
                          : item.color === 'teal'
                          ? 'bg-teal-500'
                          : item.color === 'indigo'
                          ? 'bg-indigo-500'
                          : item.color === 'pink'
                          ? 'bg-pink-500'
                          : item.color === 'gray'
                          ? 'bg-gray-500'
                          : 'bg-indigo-500'
                      }`}
                    ></div>
                  )}
                </button>

                {/* Sub Menu Items - Only show when expanded */}
                {item.subItems && isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = currentPage === subItem.id;
                      const showBadge = subItem.id === 'course-assessments' && pendingAssessmentsCount > 0;
                      return (
                        <button
                          key={subItem.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePageChange(subItem.id, item.id);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-sm
                            ${
                              isSubActive
                                ? `bg-${item.color}-50 text-${item.color}-700 border-l-4 border-${item.color}-500 shadow-sm font-semibold`
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:shadow-sm'
                            }
                          `}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              isSubActive
                                ? `bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white shadow-md`
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            <i className={`${subItem.icon} text-sm`}></i>
                          </div>
                          <span className="font-medium flex-1">{subItem.label}</span>
                          {showBadge && (
                            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                              {pendingAssessmentsCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/8.x/initials/svg?seed=Student"
              alt="Student Profile"
              className="w-10 h-10 rounded-full border-2 border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                Student User
              </p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded hover:bg-slate-200 transition-colors"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt text-slate-500 text-sm"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default StudentMenuNavigation;


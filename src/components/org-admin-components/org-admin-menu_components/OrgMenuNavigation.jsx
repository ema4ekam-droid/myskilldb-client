import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutRequest } from "../../../api/apiRequests";

const OrgMenuNavigation = ({ currentPage, onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();

  // Menu structure
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fas fa-tachometer-alt",
      color: "blue",
    },
    {
      id: 'classrooms',
      label: 'Classroom Setup',
      icon: 'fas fa-school',
      color: 'green',
      subItems: [
        { id: 'view-classrooms', label: 'Class Setup', icon: 'fas fa-list' },
        { id: 'define-subjects', label: 'Subject Setup', icon: 'fas fa-book' },
        { id: 'teacher-assignments', label: 'Teacher Assignments', icon: 'fas fa-user-tie' }
      ]
    },
    {
      id: 'skills-academics',
      label: 'Skills & Academics',
      icon: 'fas fa-graduation-cap',
      color: 'purple',
      subItems: [
        {
          id: "topic-management",
          label: "Topic Management",
          icon: "fas fa-tags",
        },
        {
          id: "test-management",
          label: "Test Management",
          icon: "fas fa-clipboard-check",
        },
        { id: "test-topics", label: "Test & Topics", icon: "fas fa-link" },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      icon: "fas fa-chart-bar",
      color: "orange",
      subItems: [
        {
          id: "school-reports",
          label: "School Reports",
          icon: "fas fa-file-alt",
        },
        {
          id: "student-ratings",
          label: "Student Ratings",
          icon: "fas fa-star",
        },
      ],
    },
    {
      id: "student-profiles",
      label: "Student Profiles",
      icon: "fas fa-users",
      color: "teal",
    },
    {
      id: 'access-management',
      label: 'Access Management',
      icon: 'fas fa-key',
      color: 'red'
    },
    {
      id: "settings",
      label: "Settings",
      icon: "fas fa-cog",
      color: "gray",
    },
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

  // Navigation handler
  const handlePageChange = (pageId, parentId = null) => {
    onPageChange(pageId);

    // Route mapping
    const routes = {
      dashboard: "/admin/dashboard",
      "view-classrooms": "/admin/classrooms/view",
      "define-subjects": "/admin/classrooms/subjects",
      "teacher-assignments": "/admin/classrooms/teacher-assignments",
      "topic-management": "/admin/skills/topics",
      "test-management": "/admin/skills/tests",
      "test-topics": "/admin/skills/test-topics",
      "school-reports": "/admin/reports/organization",
      "student-ratings": "/admin/reports/student-ratings",
      "student-profiles": "/admin/students/profile",
      "access-management": "/admin/access/manage",
      "user-creation": "/admin/access/create-user",
      settings: "/admin/settings",
    };

    // If it's a submenu item, navigate directly but keep parent menu open
    if (parentId) {
      if (routes[pageId]) {
        navigate(routes[pageId]);
        toast.success(`Navigating to: ${pageId}`);
      }
      // Ensure parent menu stays expanded
      setExpandedMenus((prev) => ({
        ...prev,
        [parentId]: true,
      }));
    } else {
      // This is a main menu item
      const menuItem = menuItems.find((item) => item.id === pageId);
      if (menuItem && menuItem.subItems) {
        // Just toggle the accordion - don't navigate automatically
        setExpandedMenus((prev) => ({
          ...prev,
          [pageId]: !prev[pageId],
        }));

        // Update the current page to the main menu item for visual feedback
        // but don't navigate to any route
        onPageChange(pageId);
      } else {
        // Regular menu item without submenus - navigate directly
        if (routes[pageId]) {
          navigate(routes[pageId]);
          toast.success(`Navigating to: ${pageId}`);
        }
      }
    }
  };

  const handleLogout = async () => {
    await logoutRequest("/auth/logout");
    navigate(`/login`);
  };

  return (
    <>
      {/* Mobile Menu Button - Matching master design */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[100] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-4 shadow-2xl border-2 border-white transition-all duration-200 transform hover:scale-105 active:scale-95"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Navigation Menu"
      >
        <i
          className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}
        ></i>
      </button>

      {/* Mobile Menu Overlay - Higher z-index */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-[90] backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Navigation Sidebar - Higher z-index and better positioning */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-[95] w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out shadow-2xl
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">MySkillDB</h1>
              <p className="text-sm text-slate-500 mt-1">
                Organization Admin Panel
              </p>
            </div>
            {/* Close button for mobile */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <i className="fas fa-times text-slate-500"></i>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
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
                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 shadow-md"
                        : isActive
                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 shadow-md"
                        : isExpanded && item.subItems
                        ? "bg-slate-50 text-slate-700 border-l-4 border-slate-300 shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm"
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
                        isExpanded ? "up" : "down"
                      } text-xs transition-transform duration-200 ${
                        hasActiveSubmenu
                          ? "text-indigo-500"
                          : isExpanded
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    ></i>
                  )}
                  {(hasActiveSubmenu || isActive) && (
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse ${
                        item.color === "blue"
                          ? "bg-blue-500"
                          : item.color === "green"
                          ? "bg-green-500"
                          : item.color === "purple"
                          ? "bg-purple-500"
                          : item.color === "orange"
                          ? "bg-orange-500"
                          : item.color === "teal"
                          ? "bg-teal-500"
                          : item.color === "red"
                          ? "bg-red-500"
                          : item.color === "gray"
                          ? "bg-gray-500"
                          : "bg-indigo-500"
                      }`}
                    ></div>
                  )}
                </button>

                {/* Sub Menu Items - Only show when expanded */}
                {item.subItems && isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = currentPage === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent any parent click handlers
                            handlePageChange(subItem.id, item.id);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-sm
                            ${
                              isSubActive
                                ? `bg-${item.color}-50 text-${item.color}-700 border-l-4 border-${item.color}-500 shadow-sm font-semibold`
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:shadow-sm"
                            }
                          `}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              isSubActive
                                ? `bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white shadow-md`
                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            }`}
                          >
                            <i className={`${subItem.icon} text-sm`}></i>
                          </div>
                          <span className="font-medium">{subItem.label}</span>
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/8.x/initials/svg?seed=Org+Admin"
              alt="Admin Profile"
              className="w-10 h-10 rounded-full border-2 border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                Organization Admin
              </p>
              <p className="text-xs text-slate-500">Admin User</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded hover:bg-slate-200 transition-colors"
            >
              <i className="fas fa-sign-out-alt text-slate-500 text-sm"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default OrgMenuNavigation;

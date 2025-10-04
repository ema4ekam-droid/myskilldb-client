import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

const Navigation = ({ currentPage = 'dashboard', onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Master Dashboard',
      icon: 'fas fa-chart-pie',
      path: '/master-dashboard',
      color: 'indigo'
    },
    {
      id: 'location-manager',
      label: 'Location Manager',
      icon: 'fas fa-globe-americas',
      path: '/location-manager',
      color: 'indigo'
    },
    {
      id: 'organization-setup',
      label: 'organization Setup',
      icon: 'fas fa-graduation-cap',
      path: '/organization-setup',
      color: 'emerald'
    },
    {
      id: 'organization-logins',
      label: 'organization Logins',
      icon: 'fas fa-user-lock',
      path: '/organization-logins',
      color: 'teal'
    },
    {
      id: 'account-managers',
      label: 'Account Managers',
      icon: 'fas fa-user-tie',
      path: '/account-managers',
      color: 'purple'
    },
    {
      id: 'analytics',
      label: 'System Analytics',
      icon: 'fas fa-chart-line',
      path: '/analytics',
      color: 'orange'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'fas fa-sliders-h',
      path: '/settings',
      color: 'gray'
    }
  ];

  const handleMenuClick = (itemId) => {
    // Navigate to the appropriate route
    const routes = {
      'dashboard': '/master/dashboard',
      'location-manager': '/master/location-manager',
      'organization-setup': '/master/organization-setup',
      'organization-logins': '/master/organization-logins',
      'account-managers': '/master/account-managers',
      'analytics': '/master/analytics',
      'settings': '/master/settings'
    };
    
    if (routes[itemId]) {
      navigate(routes[itemId]);
    }
    
    if (onPageChange) {
      onPageChange(itemId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - More prominent and visible */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[100] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-4 shadow-2xl border-2 border-white transition-all duration-200 transform hover:scale-105 active:scale-95"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Navigation Menu"
      >
        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        <div style={{ display: 'none' }}>
          <Icon name={isMobileMenuOpen ? 'fa-times' : 'fa-bars'} className="text-xl" />
        </div>
      </button>

      {/* Mobile Menu Overlay - Higher z-index */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-[90] backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Navigation Sidebar - Higher z-index and better positioning */}
      <aside className={`
        fixed inset-y-0 left-0 z-[95] w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">MySkillDB</h1>
              <p className="text-sm text-slate-500 mt-1">Master Admin Panel</p>
            </div>
            {/* Close button for mobile */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <i className="fas fa-times text-slate-500"></i>
              <div style={{ display: 'none' }}>
                <Icon name="fa-times" className="text-slate-500" />
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`
                  w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm'
                  }
                `}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? `bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white shadow-lg` 
                    : `bg-slate-100 text-slate-500 hover:bg-${item.color}-50 hover:text-${item.color}-500`
                }`}>
                  {/* Font Awesome icon with fallback */}
                  <i className={`${item.icon} text-lg`} style={{ display: 'block' }}></i>
                  <div style={{ display: 'none' }}>
                    <Icon name={item.icon} className="text-lg" />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-base">{item.label}</span>
                </div>
                {isActive && (
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    item.color === 'blue' ? 'bg-blue-500' :
                    item.color === 'green' ? 'bg-green-500' :
                    item.color === 'purple' ? 'bg-purple-500' :
                    item.color === 'teal' ? 'bg-teal-500' :
                    item.color === 'orange' ? 'bg-orange-500' :
                    item.color === 'gray' ? 'bg-gray-500' :
                    item.color === 'emerald' ? 'bg-emerald-500' :
                    'bg-indigo-500'
                  }`}></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <img 
              src="https://api.dicebear.com/8.x/initials/svg?seed=Master+Admin" 
              alt="Admin Profile" 
              className="w-10 h-10 rounded-full border-2 border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Master Admin</p>
              <p className="text-xs text-slate-500">System Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;

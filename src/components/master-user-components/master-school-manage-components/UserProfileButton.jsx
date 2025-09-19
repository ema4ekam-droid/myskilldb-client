import React, { useState } from 'react';

const UserProfileButton = ({ isUserMenuOpen, setIsUserMenuOpen }) => {
  return (
    <div className="relative">
      <button 
        onClick={() => setIsUserMenuOpen(v => !v)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <img 
          src="https://api.dicebear.com/8.x/initials/svg?seed=Master+Admin" 
          className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md hover:ring-2 hover:ring-indigo-400 transition-all" 
          alt="Admin Profile" 
        />
        <div className="text-left">
          <p className="font-semibold text-slate-900">Master Admin</p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>
      </button>
    
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-20">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100">
            <i className="fas fa-plus w-4 text-slate-500"></i> School Sign Up Page
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-slate-100 border-t border-slate-200">
            <i className="fas fa-sign-out-alt w-4 text-red-500"></i> Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default UserProfileButton;

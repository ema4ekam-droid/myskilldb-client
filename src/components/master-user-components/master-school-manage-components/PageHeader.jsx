import React from 'react';
import UserProfileButton from './UserProfileButton';

const PageHeader = ({ 
  isUserMenuOpen, 
  setIsUserMenuOpen 
}) => {
  return (
    <header className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">School Login Management</h1>
        <p className="text-slate-500 text-sm">Create and manage login accounts for schools</p>
      </div>
      
      {/* User Profile Button */}
      <UserProfileButton 
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
      />
    </header>
  );
};

export default PageHeader;

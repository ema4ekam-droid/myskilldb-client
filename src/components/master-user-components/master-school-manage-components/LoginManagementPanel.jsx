import React from 'react';
import LoginCreationForm from './LoginCreationForm';
import BulkLoginUpload from './BulkLoginUpload';

const LoginManagementPanel = ({
  selectedSchool,
  schoolSetupStatus,
  selectedLoginType,
  loginFormData,
  onInputChange,
  onSubmit,
  onCancel,
  isLoadingLogin,
  onFileChange,
  onUpload,
  onDownloadTemplate,
  csvFile,
  isLoadingBulk
}) => {
  // Only show login management if setup is completed
  if (!selectedSchool || !schoolSetupStatus[selectedSchool]?.completed) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Individual Login Creation */}
      <LoginCreationForm
        selectedLoginType={selectedLoginType}
        loginFormData={loginFormData}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoading={isLoadingLogin}
      />

      {/* Bulk Upload */}
      <BulkLoginUpload
        selectedSchool={selectedSchool}
        onFileChange={onFileChange}
        onUpload={onUpload}
        onDownloadTemplate={onDownloadTemplate}
        csvFile={csvFile}
        isLoading={isLoadingBulk}
      />
    </div>
  );
};

export default LoginManagementPanel;

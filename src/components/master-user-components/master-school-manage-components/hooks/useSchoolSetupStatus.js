import { useState } from 'react';

export const useSchoolSetupStatus = () => {
  const [schoolSetupStatus, setSchoolSetupStatus] = useState({});

  const markSetupComplete = (schoolId, schoolData) => {
    setSchoolSetupStatus(prev => ({
      ...prev,
      [schoolId]: {
        completed: true,
        completedAt: new Date().toISOString(),
        data: schoolData
      }
    }));
  };

  const isSetupCompleted = (schoolId) => {
    return schoolSetupStatus[schoolId]?.completed || false;
  };

  const getSetupData = (schoolId) => {
    return schoolSetupStatus[schoolId]?.data || null;
  };

  const resetSetupStatus = (schoolId) => {
    setSchoolSetupStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[schoolId];
      return newStatus;
    });
  };

  return {
    schoolSetupStatus,
    markSetupComplete,
    isSetupCompleted,
    getSetupData,
    resetSetupStatus
  };
};
